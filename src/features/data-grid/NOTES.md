# DataGrid — state & re-render notes

Design notes on how grid state is organized and the re-render tradeoffs behind it.
Written during the take-home; safe to fold into the project README.

## Current design

All grid state lives in one `useReducer` inside `DataGrid` (`state/grid-reducer.ts`):

- **View state** (drives what's displayed): `sort`, `filters` (+ `deferredFilters`),
  `visibility`, `page`, `rowsPerPage`.
- **Overlay** (which menu/popover is open): a single `overlay` discriminated union, not
  separate anchor fields — see "Reducer design" below.

Rows flow through a memoized pipeline: **filter → sort → paginate**
(`getFilteredRows` → `getSortedRows` → `slice`), all in `shared/utils.ts`.

## Loading / empty / error states — separation of concerns

**`DataGrid` is synchronous.** It takes `rows` + `columns` and owns sort / filter / pagination /
visibility — and the **empty** state only. Empty isn't an async concern: "no rows" is a fact
about the data it was handed, and crucially only the grid can tell "no data at all" apart from
"no rows match the current filters" (it's the only thing that knows about filters). That lives in
`ui/grid-empty-row.tsx`. The grid has no `status`/`loading`/`error` props at all.

**The async lifecycle sits _on top_ of the grid**, in a generic
[`QueryBoundary`](../../../components/query-boundary.tsx): given a single
`status: 'pending' | 'error' | 'success'`, it renders a `loadingFallback`, an error message with
Retry, or its children. It's grid-agnostic — it wraps any async content and keeps whatever's
inside it purely synchronous. The loading fallback we pass is `DataGridSkeleton`
(`ui/data-grid-skeleton.tsx`), which mirrors the table chrome so the layout doesn't jump.

Composition lives in `App.tsx`:
`useQuery → <QueryBoundary loadingFallback={<DataGridSkeleton/>}> <DataGrid/> </QueryBoundary>`.

**Why this split (earlier the grid was dual-mode).** A first cut gave `DataGrid` an optional
`status` prop defaulting to `'success'`, so it could be used both synchronously and
asynchronously. That forced the grid to be two things at once and carried "pretend it's success"
state it didn't need. Pulling the fetch lifecycle into a boundary makes each piece do one job:
the grid renders data; the boundary renders the fetch.

**Why one `status` enum, not `loading`/`error` booleans.** Two booleans can represent a
contradictory `loading && error`; a single discriminated value can't.

**Why TanStack Query (see `App.tsx` / `src/mocks/fetch-people.ts`).** The data is still generated
locally; `fetchPeople` just wraps it in a Promise with artificial latency and an injectable
failure so there's a real async lifecycle. We reach for Query rather than hand-rolling a fetch
hook because correct data-fetching is deceptively hard — request races, cancellation on unmount,
caching, retry — and Query gives `status` + `refetch` + caching for free. The cost is one
dependency, accepted deliberately and isolated to `App.tsx` + `main.tsx`.

**Alternative considered — React 19 `use()` + `<Suspense>` + Error Boundary.** Rejected as
_more_ wiring, not less: a hand-written error-boundary class (React has no built-in one), a
cached/swappable promise for retry, and it still leaves empty to handle manually (`[]` is a
successful resolve).

**Follow-up (not done):** no RTL harness is set up, so the rendering of `QueryBoundary` /
`DataGridSkeleton` / the empty row isn't covered by tests — only the async `fetchPeople` contract
is (`src/mocks/fetch-people.test.ts`). Adding React Testing Library is the natural next step.

## Reducer design

Why a reducer rather than a pile of `useState` (or a store):

- **Single source of truth.** Sort / filters / pagination / visibility / overlay are
  interrelated (e.g. filtering must reset the page). Each such rule lives in exactly one
  transition instead of being scattered across handlers.
- **Events, not setters.** Actions describe _what the user did_ (`headerClicked`,
  `filterChanged`), and the "why" (the business rule) is encoded in the reducer — so
  "filtering jumps back to page 0" is part of the `filterChanged` transition, not something
  a caller must remember to compose.
- **Impossible states are impossible.** The three overlays (⋮ actions menu, filter popover,
  manage-columns menu) are mutually exclusive, so they are ONE `overlay` discriminated union,
  not three independent anchors. "Two menus open at once" has no representable value.
- **Pure / testable.** `gridReducer` is a pure, non-generic function — it works on column
  _ids_, never on `Column<TRow>` — so it unit-tests in isolation with no React.

Notable transitions: `filterChanged` and `rowsPerPageChanged` reset `page` to 0;
`filterOpenedFromMenu` / `manageOpened` reuse the actions menu's anchor (the "open from ⋮"
flow) and only fire while the actions overlay is open. The visibility default rule has one
home in `resolveVisibility` (`shared/utils.ts`), shared by the reducer's toggle and the render pass
so they can't drift.

## The re-render tradeoff (if we break this into subcomponents)

**Rule:** a Context change re-renders _every_ consumer, compared by value identity —
even consumers that don't read the field that changed. **`React.memo` does not stop
this** — memo only blocks re-renders coming through props; a context update reaches
the consumer directly and bypasses the memo boundary.

**Worst offender:** ephemeral UI state. Menu/popover anchors flip on every open/close
and have nothing to do with the data, yet in a shared context they invalidate the
most expensive subtree — the body (hundreds/thousands of cells). Opening a dropdown
should touch one component, not redraw the grid.

## How many contexts for efficient re-rendering?

Grouping state by "changes together AND read by the same components":

| Context    | Holds                 | Re-renders                                      | Changes on   |
| ---------- | --------------------- | ----------------------------------------------- | ------------ |
| Sort       | `sort`                | header cells, body                              | header click |
| Filter     | `filters`             | header badges, filter popover, body, pagination | typing       |
| Visibility | `visibility`          | header row, body, manage menu                   | toggle       |
| Pagination | `page`, `rowsPerPage` | body, pagination                                | paging       |
| Actions    | all setters           | nothing (stable identity)                       | never        |

- **Plain split-context minimum: 5** (4 state + 1 stable actions). Merging any two
  reintroduces waste (e.g. Sort+Pagination → header cells re-render on paging).
- **Ephemeral anchors: 0 contexts** — keep them local with `useState`.
- **Selector store: 1** — one context holding a `useSyncExternalStore` store (or
  Zustand) gives the same (actually finer: `filters[columnId]`) per-slice granularity
  as the 5 contexts, with one provider. See `state/grid-store.tsx` for a worked example.

## Planned change: sort-then-filter (decouple sort from typing)

Today `sortedRows` depends on `filteredRows`, so **every keystroke re-sorts** (O(n log n)).
Fix = swap the pipeline order: sort first (depends only on `rows`+`sort`), then filter the
sorted array. `Array.filter` preserves order, so "sort then drop non-matches" === "drop
non-matches then sort" — same list, but now the sort memo is a cache hit while typing;
only the O(n) filter re-runs.

```tsx
const sortedRows = useMemo(() => getSortedRows(rows, columns, sort), [rows, columns, sort]);
const filteredSortedRows = useMemo(
    () => getFilteredRows(sortedRows, columns, deferredFilters),
    [sortedRows, columns, deferredFilters],
);
// pagination count → filteredSortedRows.length
```

**No-sort edge:** when `sort === null` (initial state), `getSortedRows` early-returns
`rows` _by reference_ — so the sort step is a free no-op and the result is `rows` in source
order, identical to today. The unsorted path is the _cheapest_ path, not a special case.
(We don't need MUI's id-mask lookup — that's the virtualization variant; we paginate.)

Measure before adopting — see `perf.spec.ts`.

## Sort: single-column only (multi-column not supported)

`SortState` is `{ columnId, direction } | null` — one column or none. Multi-column
("sort by department, then age") is **unsupported by design** for this scope.

It's a small, well-understood extension, not a hard problem: make `SortState` an ordered
list of criteria, have the comparator fall through to the next key on a tie. The
decorate-sort-undecorate structure in `getSortedRows` doesn't change — just precompute one
key per sort column per row. **Talking point:** a library (TanStack Table / MUI DataGrid)
earns its place not for multi-sort alone (that's ~15 lines) but once requirements stack —
multi-sort _plus_ grouping, pinning, virtualization, server-side — where hand-rolling a
grid engine stops paying off.

### Perf fix applied (the freeze)

Clicking a header froze the tab at 1M rows: the old comparator called `columns.find(...)`
AND the accessor _inside_ the sort comparator, which runs ~n·log n (~20M) times — hundreds
of millions of ops on the main thread, synchronous, so the whole UI locked.
Fixed in `getSortedRows` by (1) resolving the column once up front and (2)
decorate-sort-undecorate — compute each row's key once (O(n)), sort on precomputed
primitives. Sort is still O(n log n) and synchronous; if that's still too slow at 1M, a
Web Worker is the next step (see worker note above).

**Measured after the fix (sort pass only):**

| Rows | Sort time | Verdict                                                        |
| ---- | --------- | -------------------------------------------------------------- |
| 100k | ~36 ms    | fast enough, but already noticeable (~2 frames)                |
| 1M   | ~350 ms   | clearly janky — blocks the main thread for a third of a second |

So the problem is really a **1M-row** problem; at 100k it's fine (though 36ms isn't free).
Decision deferred: revisit how to handle the 1M case later (Web Worker offload, or cap/
paginate server-side). Noted here so the threshold is on record.

## Pagination options are caller-provided

`DataGrid` exposes `rowsPerPageOptions` + `defaultRowsPerPage` instead of hardcoding — the
consumer decides the page-size choices (see `App.tsx`).

**Known edge (not fixed — low priority):** `defaultRowsPerPage` must be one of
`rowsPerPageOptions`, otherwise MUI's `TablePagination` logs a dev warning. Right now it's
the caller's responsibility (documented in the prop's JSDoc). Easy to make foolproof later
by validating/clamping the initial value to the options inside the component; left as-is
because it's a caller-controlled edge case, not a user-facing bug.

## Decision (given the time constraint)

**Don't optimize now.** For a single self-contained grid that isn't demonstrably slow,
a store or 5 contexts is premature optimization. Keep state lifted; if the grid is
split into `Row`/`Cell`, add `React.memo` + `useCallback` (memo works here — we're on
props, not context).

**If revisited at scale:** reach for **Zustand**, not a hand-rolled store or 5 contexts
— same slice-selector behavior, far less boilerplate, none of the `useSyncExternalStore`
snapshot-stability footguns. Hand-roll only if "no extra dependencies" is a hard rule.

## TODO: pending indicator while filtering

Typing shows a slight lag — that's the _table_ catching up, not the input (the input is
bound to live `filters`, the filtering pass reads `deferredFilters`). `useDeferredValue`
gives us the "work in flight" signal for free:

```tsx
const isFiltering = filters !== deferredFilters; // stale → deferred render pending
```

Use it to **dim the table body** (`opacity: 0.6`) rather than swap in a spinner — keeps
the current (stale) rows visible while the new ones compute, less jarring than a blank
flash. Wire it around the `TableContainer` in `ui/index.tsx`.

Note: `filters` is an object, so `!==` is a reference compare — fine as long as the
reducer only makes a new `filters` object when a filter actually changes.

## Why `useDeferredValue`, not debounce

Debounce delays _when_ the work starts (wait for a typing pause); `useDeferredValue`
starts ASAP but keeps it off the critical path for _painting_.

**Caveat (don't overstate deferred value):** `useDeferredValue` interrupts _rendering_,
NOT a running synchronous `getFilteredRows` loop. Once that O(n) block starts, it blocks
the thread; deferring can't chop it up. So the honest framing is:

- **Debounce** reduces _how many_ passes run (collapse N keystrokes → 1 after a pause).
- **Deferred value** reduces _how much each pass blocks paint_, and coalesces, but a heavy
  synchronous pass still janks once it starts.

For a genuinely heavy _synchronous_ pass, debounce is a legitimately strong lever — it's
why MUI X DataGrid debounces its filter input (~150ms) rather than relying on React
concurrency. The real escape from the choice is to make each pass _cheap_ (see below), so
it barely matters which you pick. They also compose: debounce a server filter, defer a
client one.

## What MUI X DataGrid does (patterns to steal for our hand-rolled grid)

Studied the MUI X DataGrid client-side filter engine. NOTE: that lives in the `react/`
study repo (`@mui/x-data-grid`); _this_ repo is hand-rolled on `@mui/material` primitives,
no DataGrid, no TanStack. These are transferable concepts, not a drop-in.

1. **Sorted order + filter MASK, decoupled — the big one.** MUI keeps a sorted row-id
   order and filtering produces a boolean lookup `{ [rowId]: boolean }` _over_ that order;
   it does NOT re-sort on filter change. Our pipeline does the opposite: `sortedRows`
   depends on `filteredRows` (`ui/index.tsx`), so **every keystroke re-sorts** the filtered
   set — O(n log n) per key. Fix: sort the id list once (depends only on `sort`+`rows`),
   filter to a mask, then build the visible page by walking the sorted ids, skipping masked
   ones, taking the page window. Typing then costs only the O(n) mask, never a re-sort.
   (The bare "boolean lookup not a new array" trick is a _virtualization_ idea on its own;
   because we sort+paginate we need the sorted-order-plus-mask version.)
2. **Compile the predicate once, apply per row.** MUI calls `getApplyFilterFn(item, col)`
   once → returns `(value) => boolean` already bound to operator + typed value; the per-row
   loop is one function call, no operator-dispatch/parse per row. Our equivalent: build the
   per-column predicate once per filter change, not inside the row loop. Pairs with
   pre-lowercasing (above).
3. **Debounce the input** (~150ms) — collapses a burst of keystrokes into one O(n) pass.
   See the caveat above for why this beats leaning only on `useDeferredValue` for a heavy
   synchronous pass.
4. **Memoized selector over references.** The lookup is a reselect-style memo keyed on
   `rows` / `filterModel` / `columns` _references_ — unrelated state (selection, hover,
   resize) never re-runs the filter. Our `useMemo`s already do this; the lesson is to key on
   stable references and keep the filter out of anything that re-renders for other reasons.
5. **Mutation ≠ recompute ≠ render.** State lives in `apiRef` (ref + event emitter), so
   `setFilterModel()` mutating state doesn't itself render; selectors recompute only on the
   changed reference, and only components whose slice changed re-render. This is the
   compute-side version of our "narrow selectors / don't put ephemeral state in context."
6. **Escape hatch: `filterMode="server"`.** MUI is explicit that client-side has a ceiling
   (~low hundreds of thousands); beyond that it emits the filter model and renders returned
   rows. Our worker-offload note is the DIY version of the same ceiling.

## TODO: offload filter/sort of 100k+ rows to a Web Worker?

Spec says ≥100k rows. Filter + sort currently run synchronously on the main thread
(`shared/utils.ts`). At 100k a sort is ~O(n log n) string compares — tens of ms on a
decent machine, enough to drop frames on a slow one.

- **`useDeferredValue` keeps the UI responsive but does NOT add a thread.** It lets React
  _interrupt rendering_, but the `getFilteredRows`/`getSortedRows` calls themselves are
  still one uninterruptible synchronous block on the main thread. Once that block runs,
  it blocks. So deferring hides small costs, not a genuinely heavy pass.
- **Web Worker is the real fix for CPU-bound work:** run filter+sort in a worker, post
  back the resulting rows (or just the row ids/indices to keep the message small). Main
  thread stays at 60fps regardless of dataset size.
    - Cost: serialization across the worker boundary (`postMessage` structured-clone), and
      the data has to live in / be transferable to the worker. For 100k rows, send indices
      not full row objects; consider a `SharedArrayBuffer`/`Comlink` if it gets hot.
    - Only worth it if the pass is _measurably_ janky — measure first (`performance.now()`
      around the pipeline). Below ~16ms it's not worth the complexity.
- **Virtualization does NOT apply here — we paginate.** The body renders ≤100 rows no
  matter the dataset size, so DOM count is already bounded. The _entire_ cost is the
  filter+sort pass over the full array; there is no rendering cost to optimize.
- **Other Web APIs?** No browser API does "filter/sort an array" for us. The relevant
  platform tool is the **Web Worker** (off-thread compute — the answer here);
  `requestIdleCallback`/time-slicing can chunk the work cooperatively on the main thread
  but is weaker (still main-thread, awkward to resume mid-sort).

### Algorithmic wins (cheaper than a worker — try first)

The pass re-runs on every keystroke, so shrink the work per keystroke:

1. **Incremental filtering on narrowing.** Appending a character can only _shrink_ the
   result set — the new matches are a subset of the previous matches. So filter the
   _previous_ filtered array, not the full 100k, whenever the new query extends the old
   one (same column, `new.startsWith(old)`). Full re-scan only on delete/clear. Turns a
   100k scan into a scan of the (shrinking) current result.
2. **Pre-lowercase once.** Case-insensitive `includes` currently does `toLowerCase()` per
   cell per keystroke. Precompute a lowercased search string per row/column once when rows
   load; filter against that. Removes 100k×cols allocations per keystroke.
3. **Pre-sorted index per column.** Sorting is O(n log n) _every_ time `sort` changes.
   Instead compute, once per column, an array of row indices in sorted order (both
   directions). Then "sort" is a lookup, not a comparison pass. Costs memory (indices ×
   columns) and an upfront build; worth it if sort-toggling is the hot path.
4. **We don't need a full sort to show one page** (only `page*rowsPerPage+rowsPerPage`
   rows). A partial sort / quickselect could get just the visible window — but note our
   full sort is already `useMemo`'d and does NOT re-run on page change, so this only helps
   the filter/sort-change path, and adds real complexity. Lower priority.

### Web Worker (when the algorithmic wins aren't enough)

Run filter+sort in a worker, post back **row indices** (not full objects — keep the
message small / avoid structured-clone cost). Main thread stays at 60fps regardless of
size. Consider `Comlink` to make the worker call look like an async function, and
`SharedArrayBuffer` only if the message passing itself becomes hot.

**Order of attack at scale:** (1) measure the pass with `performance.now()`, (2) apply
incremental filtering + pre-lowercasing (cheap, no new infra), (3) pre-sorted indices if
sort-toggle is hot, (4) worker-offload only if it's _still_ measurably blocking.

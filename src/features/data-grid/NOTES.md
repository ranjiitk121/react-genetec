# DataGrid — design notes

Short rationale for the choices here, and what I'd improve.

## Why hand-rolled (not MUI X / TanStack Table)

A grid library does all the work — and then there's nothing to show. The point of the
exercise is how I structure state, components, and perf tradeoffs, so the grid is built on
MUI primitives. In real work I'd use a library; here I hand-rolled to show the craft, and
drew the line at virtualization (see below).

## State: one reducer — no store, no context

- All grid state (sort, filters, visibility, page, overlay) lives in a single `useReducer`
  in `DataGrid`.
- **No Redux/Zustand** — it's one self-contained component; a store is premature for state
  that never leaves the grid.
- **No context** — a context change re-renders every consumer, and `React.memo` can't stop
  it, so ephemeral UI state (menu anchors) would redraw the whole table body. A lifted
  reducer + memo is simpler and faster here.
- **Reducer, not scattered `useState`** — the fields interact (filtering resets the page), so
  each rule lives in one transition. It's pure and non-generic (works on column ids), so it
  unit-tests with no DOM.
- At real scale, if slice-level subscriptions were needed: reach for Zustand, not hand-rolled
  context.

## Filtering: debounce, not `useDeferredValue`

The filter is a heavy synchronous pass over 200k rows. Debounce cuts _how many_ passes run;
`useDeferredValue` only de-prioritizes each pass (still attempts the full scan per keystroke)
and double-renders, which hurts without perfect memoization. The input stays live (bound to
`filters`); only the filter pass reads the debounced value. The value-debounce is ~8 lines —
lodash is for debouncing _callbacks_, not values.

## Sorting & filtering cost: main thread, no Web Worker (*)

Measured over 200k rows (dev build, so roughly 2× a production build): **sort ~75ms**,
**filter ~30ms** (filter is O(n), sort O(n log n)). Fine in the common case, but a header
click blocks for ~250ms in dev — StrictMode runs the memo twice, and a production single
pass would be ~40ms. On a slow machine or a much larger set, that drops frames.

**(\*) Needs a look** — the sort runs synchronously on the main thread. A Web Worker (post the
sort keys over, get row indices back) is the real fix for very large sets, since neither
`useDeferredValue` nor `useTransition` can interrupt a single synchronous sort pass mid-flight —
they schedule it at low priority but it still blocks once it starts. Deferred for now.

**No cross-sort cache (considered, dropped).** `useMemo` on `[filteredRows, columns, sort]`
already prevents re-sorting on unrelated re-renders — the case that matters. A WeakMap caching
every sorted result would only buy instant _re-toggling_ to a previously-seen sort (and is
invalidated by the next filter keystroke anyway), at the cost of holding several full 100k-length
arrays. Not worth the memory for a ~40ms recompute users rarely repeat. If ever needed, cache a
`Uint32Array` index permutation (half the memory), not row arrays.

## Virtualization: library, not hand-rolled

The grid **paginates** (≤100 rows in the DOM), so it needs no virtualization. The **Timeline**
does virtualize, and there I used a library (`@tanstack/react-virtual`) rather than hand-roll
it. The balance: hand-roll the grid to show how I organize code; don't also reinvent a
virtualization engine — I wouldn't in real life either.

## Error handling: render vs. async

Two complementary layers, because a React error boundary **only catches render-phase**
errors — not async or event handlers:

- **Async** (the fetch failing) is caught by TanStack Query → `status: 'error'`, rendered by
  `QueryBoundary` with a Retry. No boundary needed; Query already funnels the rejected promise
  into render state.
- **Render** (a bad accessor, a malformed row) is caught by an `AppErrorBoundary`
  (`react-error-boundary`): one at the root as a backstop, one per feature (`resetKeys={[events]}`)
  so a crash in the grid doesn't blank the header/timeline and resets when the data changes.

## Known limitations / to improve

- **Filter is basic** — one column at a time, "contains" only (no equals / `>` / `<`, no
  multi-column). UX could be better.
- **Sort is single-column** — multi-column (sort by A, then B) isn't supported; it's a small
  extension (ordered criteria + tie-break), not a hard problem.
- **Feedback gaps** — filtering/sorting give little in-progress feedback; e.g. dim the body
  while a recompute is pending.

## Sort interaction & layout

- **Three-state sort cycle** — clicking a header goes `asc → desc → unsorted`, matching MUI
  DataGrid; a third click clears. The arrow's space is always reserved (invisible until active)
  so toggling never shifts the label.
- **Fixed table layout** — `table-layout: fixed` keeps column widths constant instead of
  resizing to each sorted/filtered page's content, which otherwise made columns jump on sort.
  Cells clip with an ellipsis. The whole header cell is the click target, not just the label.

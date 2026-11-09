# react-genetec

A small app that shows 100,000 events two ways: a **timeline** grouped by day, and a **grid**
(table) you can sort, filter and page through. You can also add an event.

## Stack

React 19 + TypeScript, built with Vite. UI on MUI. Data fetching with TanStack Query,
virtualization with TanStack Virtual. Tests with Vitest.

## Setup

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
```

Needs Node 20.19+ (see `.nvmrc`).

## Structure

```
src/
  App.tsx            # wires it together, fetches the data
  features/
    timeline/        # the day-grouped timeline
    data-grid/       # the table
    event-form/      # the add-event form
  components/        # shared bits (header, error/loading boundaries)
  mocks/             # the generated sample data
```

Each feature is its own folder with `shared/` (types + pure functions), `state/` (reducer) and
`ui/`, and you import it only through its `index`. Full rules in `product-structure-README.md`.

## Decisions

The theme across all of this is **simplicity**. I know the fancier, higher-level options exist, and
in a few spots I could've reached for them — but this task doesn't need them, so I didn't pull them
in just because they're there. If a problem actually called for it, I'd reach for the bigger tool.
So where a decision below looks simple, that's on purpose, not because I didn't know the
alternative.

- **Each feature is its own box.** Time line, grid and form are independent — I can change or delete
  one without touching the others (see Structure above).

- **The grid is hand-built on MUI, not a grid library.** I built it on plain MUI pieces to show how
  I structure a larger component — state, composition and interaction. In a real project I'd just
  use a library.

- **Grid state is one reducer.** Sort, filter, visible columns, page, which menu is open — all of
  it in one reducer. Actions are named after what the user did (`headerClicked`, `filterChanged`),
  and the rules live in the reducer (filtering jumps back to page 1). It's a plain function, so
  it's easy to test.

    The downside is re-renders: when the state changes, more of the grid re-renders than strictly
    needs to. I looked at the alternatives and skipped them on purpose:
    - **Context** would cause re-renders too, and then I'd have to optimize around that — so it
      doesn't really buy me anything.
    - **A store like Zustand** is good at avoiding re-renders, but this state isn't truly global —
      it never leaves the grid. Pulling in a library for that felt like premature optimization.

    In testing it stays functional anyway: at any moment we only show a handful of rows
    (pagination), so there isn't much to render. The slow part is the computation — sorting/filtering
    100k rows — which is raw work, not a React render thing (see Performance). And the React Compiler
    already memoizes a lot for free. If the grid grew more moving parts I'd reconsider a store —
    there are some avoidable re-renders here, they're just not bad enough to be worth it yet.

- **The state can't get into a bad spot.** Only one menu/popover can be open at a time, and I
  modelled that as a single "what's open" value (a discriminated union), not a pile of separate
  booleans. So you can't end up with two menus open, or an "open" flag that's out of sync with the
  column it belongs to — those states just don't exist. Fewer bugs, and the code reads straight off
  the shape.

- **The filter is debounced.** Filtering scans every row, so what I actually want is _fewer_
  passes — run it once after you stop typing, not on every keystroke. A debounce does that.
  `useDeferredValue` / `useTransition` are a different tool: they don't cut how many passes run,
  they just drop each pass to a lower, interruptible priority. React is fast enough to compute the
  deferred value between keystrokes, so you still attempt a full scan per character (and concurrent
  hooks double-render on top). That keeps _typing_ responsive but doesn't reduce the _work_, which
  is the part that hurts here — so debounce is the right fit. The concurrent hooks earn their place
  when the work has to stay but the render needs to be interruptible, which isn't this case.

- **React Compiler is on.** It auto-memoizes, so it quietly stopped a bunch of unnecessary
  re-renders I'd otherwise have handled by hand. There's still more I could squeeze out, but it does
  a lot for free.

- **Timeline uses a virtualization library.** 100k events is too much for the DOM, so only what's
  on screen is rendered (`@tanstack/react-virtual`). I didn't hand-roll this one — I wouldn't
  reinvent a virtualizer in real life either. The grouping by day is done once and kept, not
  redone every time you switch tabs.

- **The form is just a plain form.** Three fields, two rules. No form library needed.

- **Few custom hooks.** Worth it when you genuinely need one — usually to share logic — and only if
  you're careful it doesn't add re-renders. Given the time, I wrote the one that felt most worth it
  (`useTimelineGroups`) and kept the rest in the component/reducer. Partly preference — happy to talk
  it through.

- **Load what you need, cache the rest.** Grid and form only load when you open them, so the first
  screen stays light. React and TanStack Query are split into their own chunks so they stay cached
  when I ship app changes.

- **Error handling is two layers.** A React error boundary only catches render errors, not a
  failed fetch. So a failed fetch is handled by TanStack Query (with a retry button), and render
  crashes are caught by an error boundary — one per feature, so if the grid crashes it doesn't
  blank the timeline too.

## Tests

`npm run test`. The tests focus on the pure parts — the reducers and the sort/filter/group and
form-validation functions — because that's where the logic that can actually break lives. They run
without a DOM, so they're fast and easy to read. I didn't add UI/DOM tests; for this scope the pure
functions cover the risky bits. These were written mostly with AI to save time — I chose what to
cover and reviewed the result.

## Performance

Sorting or searching across 100,000 rows takes time, and on a slow device you'll feel it. If you
really have to do this in the browser, the answer is a web worker so the heavy work stays off the
main thread. But really this belongs on the server — the server sorts, filters and paginates, and
the front end just shows the result. I kept it on the client here because it's a demo.

Things I knew about and skipped on purpose, for time:

- The filter is basic — one column at a time, simple text match (no "equals", "greater than", etc).
- Sort is one column only — no sorting by two columns.
- A few rough edges in the UI I'd polish with more time.

## What I'd do next

- **No real backend.** The API is faked on purpose — I didn't want to stand up a server for this —
  so none of the heavy work happens server-side yet. In a real app that's where the sorting,
  filtering and paging would live.
- **Tidy up the grid.** Reorganise it a bit so it's more composable, and pull the open-menu state
  out of the main reducer so opening a menu doesn't re-render the grid.
- **Richer filtering and sorting.** Multi-column, and more than "contains" (equals, ranges), plus
  smarter sort — e.g. sort status by its real order (initiated → started → completed), not
  alphabetically.
- **Animate new events in.** When you add an event it should ease into the list, not pop in out of
  nowhere.
- **Handle way more rows.** Personally I'd have loved to optimise the grid (and the rest) to handle
  something like a million rows. You probably wouldn't do that on the front end, but it would've
  been a nice challenge.

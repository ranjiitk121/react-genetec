# react-genetec

A small React + TypeScript + Vite app featuring a reusable, config-driven **DataGrid**
(sortable columns, pagination) built on MUI.

> 📐 **Project structure guideline:** see [`product-structure-README.md`](./product-structure-README.md)
> for how to organize features, layers, and folders in this project.

## Requirements

- Node `>=20.19` (see [`.nvmrc`](./.nvmrc) — run `nvm use`)

## Getting started

```bash
npm install     # uses legacy-peer-deps (see .npmrc) — this is expected
npm run dev     # start dev server
npm run build   # typecheck + production build
npm run preview # preview the production build
```

## Scripts

| Script                 | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Vite dev server                                 |
| `npm run build`        | `tsc -b` then `vite build`                      |
| `npm run typecheck`    | Type-check only, no emit                        |
| `npm run lint`         | `oxlint` (primary) + `eslint` (import ordering) |
| `npm run format`       | Prettier write                                  |
| `npm run format:check` | Prettier check (CI-friendly)                    |

## Architecture

```
src/
  features/
    data-grid/        # the reusable grid
      index.tsx       # <DataGrid /> — composition + state (sort, pagination)
      utils.ts        # pure sort / pagination helpers (framework-agnostic)
      types.ts        # Column<TRow>, SortState — shared contracts
  mocks/              # deterministic sample data + column definitions
```

Key ideas:

- **Config-driven columns.** A `Column<TRow>` describes `accessor` (sort key) and optional
  `cell` (render). Callers declare columns as data; the grid stays generic over `TRow`.
- **Logic separated from rendering.** Sorting and pagination are pure functions in `utils.ts`,
  so they're trivially testable and reusable without a DOM.

## Tooling notes

The lint stack intentionally runs **two** linters:

- **oxlint** — fast primary linter (correctness, react, a11y, unicorn, …).
- **eslint** — used _only_ for `import/order` (package imports above local imports), which
  oxlint doesn't currently implement.

Because the repo is on TypeScript 7, `typescript-eslint` can't be used yet
([tracking issue](https://github.com/typescript-eslint/typescript-eslint/issues/10940)), so
ESLint parses via `@babel/eslint-parser`. A few plugins also lag on peer ranges, hence
`legacy-peer-deps=true` in [`.npmrc`](./.npmrc).

## Known limitations / tradeoffs

- **Sort is applied per visible page, not across the full dataset.** `getSortedRows` slices to
  the current page before sorting, so sorting reorders only the rows currently shown. Fixing it
  is a matter of sorting the full `rows` first, then paginating — deferred to a follow-up commit.
- **No virtualization.** Fine for the current dataset sizes; for 10k+ rows the table body should
  be virtualized (e.g. `@tanstack/react-virtual`).
- **No test suite yet.** The pure helpers in `utils.ts` are the natural first target
  (Vitest + React Testing Library).

# Project Structure Guideline — react-genetec

Based on [Developer Way – "React project structure for scale"](https://www.developerway.com/posts/react-project-structure).

These are **guidelines, not laws** (same as the Pirate's Code). When in doubt, prefer the
option that makes a feature easier to move, delete, or rewrite without touching the rest
of the app.

This structure works the same whether you're a big team, a small startup, or a one-person
project — the goals below are what every decision is optimizing for.

---

## Why — the 4 goals every decision serves

Before any rule, these are what a good structure must deliver. When a rule feels
ambiguous, pick whatever serves these best:

1. **Replicability** — simple enough that anyone (even a new intern) can reproduce it.
   If following the convention needs a PhD and endless debate, it only exists on paper.
2. **Inferrability** — so obvious you can reverse-engineer it just by reading the code.
   The structure *is* the documentation; you shouldn't need to memorize a rulebook.
3. **Independence** — people/features work in parallel without stepping on each other.
   No two people fighting over one file; no feature reaching into another's internals.
4. **Optimised for refactoring** — moving, splitting, or rewriting code should feel as
   easy as breathing. Never "glue" code permanently in place. Frontend changes fast —
   expect to rewrite features often, so make that cheap.

---

## The 3 big ideas

### 1. Decomposition — think in *features*, not files
Don't build one big app. Build a bunch of small, independent **features** that plug into
each other through a clear public API (usually just React props). A feature = a group of
components + logic that together do *one* complete thing for the user — a "nanoservice."

A feature is a black box:
- Its **internals** can be rewritten freely.
- Only its **public API** (what `index.js` exports) is visible to the outside.
- Removing it = unplug it. Replacing it = swap it.

Each feature lives in its own folder under `src/features/`.

### 2. Layers — separate concerns inside a feature
Inside a feature, keep different *kinds* of code apart:

| Layer      | What goes here                                        | Can depend on   |
|------------|-------------------------------------------------------|-----------------|
| `data/`    | API calls, fetching, data transforms                  | nothing         |
| `shared/`  | utils, hooks, types, constants, tiny components        | nothing         |
| `ui/`      | the actual components / feature implementation          | `data`, `shared`|

Dependency direction is one-way: **ui → data/shared**. Nothing depends on `ui`.
(If you add state management later, add a `state/` layer between `data` and `ui`.)

### 3. Hierarchy — folders form a strict tree
Inside the `ui` layer, structure components as a tree:

- Only `index.js` in a folder may have sub-components and import them.
- You may import **only from your children**, never from neighbours or parents.
- You may **not skip levels** — import from direct children only.

If two components need to share something → it does **not** belong in the tree.
Move it to `shared/` and import it from there. This keeps every branch independent,
so you can drag-and-drop a folder somewhere else and nothing else breaks.

> React recommends max **3–4 levels of nesting**. If a feature gets deeper than that,
> that's your signal to split it into smaller features.

---

## Folder layout

```
src/
  features/
    my-feature/
      index.jsx          # public API — the ONLY thing outsiders import
      data/              # data layer
        index.js
        get-something.js
        update-something.js
      shared/            # shared layer (used by everything in the feature)
        utils.js
        hooks.js
        types.js
      ui/                # ui layer (the tree)
        index.jsx
        header/
          index.jsx
          search-bar.jsx
        footer/
          index.jsx
    another-feature/
      ...
  app.jsx                # wires features together
  main.jsx              # entry point
```

Small features don't need all the layers — start simple, add folders only when a file
starts doing too many different things.

---

## Naming convention

Pick one style and never mix. This project uses **kebab-case** for all files/folders:

```
my-feature/
  assets/           # images/svgs for this feature only
    logo.svg
  index.jsx         # main feature code
  index.test.jsx    # tests
  index.styles.js   # styles kept separate from logic
  types.js          # types shared within the feature
  utils.js          # utils used ONLY in this feature
  hooks.js          # hooks used ONLY in this feature
```

When a feature grows sub-components, give each its own folder with the **same file names
inside** (`index.jsx`, `index.test.jsx`, ...). Same names everywhere = copy-paste a
folder, rename one thing, done.

---

## When to extract a feature (how to split)

Don't extract every tiny thing (you'll end up with hundreds of one-file features), and
don't let one feature swallow half the app. Good candidates for their own feature:

- **Design-system pieces** — buttons, modals, layouts, tooltips, etc.
- **Natural UI boundaries** — something that lives in a modal, drawer, slide-in panel…
- **Shareable things** — used in more than one place.
- Anything you can describe as an **isolated feature** with clear boundaries, ideally
  visible in the UI.

Golden rule: **one feature = one conceptual thing.** A feature that exports a `Button`, a
`CreateDialog`, *and* a `DateConverter` is doing too much — split it.

---

## Evolving to packages (optional — only when you outgrow folders)

The full article organizes features as **monorepo packages** (`@react-genetec/button`)
instead of plain folders. We **start with plain `src/features/` folders** because this is
a small project and the folder version gives ~90% of the benefit with zero setup.

Reach for packages later if/when you feel the pain of:
- deep relative imports (`../../../common`) that hide where things come from,
- wanting to forbid "deep" imports and enforce a single public entry point,
- sharing code across multiple apps or a frontend/backend split.

What changes if you go there:
- Each feature folder gets a `package.json` with `name` + `main`, e.g.
  ```json
  { "name": "@react-genetec/my-feature", "main": "index.jsx" }
  ```
- Add `"workspaces": ["packages/**"]` to the root `package.json`; run `npm install` to symlink.
- Import by **name, not path**: `import { X } from '@react-genetec/my-feature'`.
- **Keep dependencies in the root `package.json`** — for a private repo you don't need to
  declare deps per-package; everything hoists to the root.
- Structure packages flat at first, then group as they grow:
  ```
  packages/core/{button,modal,tooltip}
  packages/product/{footer,settings}
  packages/common/{configs,utils,types}   # shared across front/back if you add a backend
  ```
- The physical location stops mattering — a package is always `@react-genetec/x` no matter
  where its folder lives, so you can reorganize freely.

Until then: folders are fine. Don't over-engineer early.

---

## Quick checklist (use this while coding)

- [ ] Is each feature a self-contained folder under `src/features/`?
- [ ] Does the feature expose everything through its `index.jsx` (and nothing imports its "deep" internals)?
- [ ] Is data-fetching in `data/`, not mixed into components?
- [ ] Is anything shared between components living in `shared/` (not imported neighbour-to-neighbour)?
- [ ] In the `ui` tree: do folders import only from their direct children?
- [ ] No imports from `../../..` crossing feature boundaries?
- [ ] Nesting ≤ 3–4 levels? If deeper, split the feature.
- [ ] One feature = one conceptual thing? If it does many, split it.
- [ ] File/folder names all follow the same convention (kebab-case)?
- [ ] Would a newcomer understand the layout just by reading it? (inferrability)

---

## Want me to check your work?

Once you've built something, just ask:
> "Can you check if this follows the structure?"

and I'll review your `src/` against the checklist above.

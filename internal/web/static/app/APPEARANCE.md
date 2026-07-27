# Studio appearance extension

Agent Deck Studio keeps its theme and terminal-font customizations outside the
upstream stylesheets. This reduces conflicts when rebasing the fork.

## Ownership

- `theme.js` owns preference normalization, resolved light/dark state, xterm
  colors, and terminal font-family values used by JavaScript.
- `appearance-theme.css` owns Studio color tokens and light-theme overrides.
- `appearance-fonts.css` owns CSS terminal font-family selection and platform
  fallbacks.
- `appearance-overrides.css` is the late-cascade bridge from those tokens to
  upstream component selectors.

The extension styles must load after `design-tokens.css` and `app.css`, in the
order shown in `index.html`.

## Upstream sync rule

Do not put Studio-only theme or font rules directly in:

- `app.css`
- `design-tokens.css`
- `styles.src.css`

Add new tokens to the appropriate appearance module. Add component selectors
to `appearance-overrides.css` only when the upstream component does not already
consume a semantic token.

After a change, run:

```sh
make css
cd tests/web
npm run test:unit
npm run test:e2e -- e2e/tweaks-rail.spec.js e2e/visual-baselines.spec.js
```

`appearance_extension_test.go` guards the stylesheet presence and load order.

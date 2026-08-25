# dsh.plus

English | [中文](README.zh.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) plugin that shows the [dsh.plus](https://dsh.plus) curated plugin catalog inside DSH. Once installed, a **Plugin Catalog** page appears under DSH Settings, listing the human-curated DSH plugins from dsh.plus live: browse, search, filter by category, copy the install command, or open each plugin’s GitHub repository.

> This plugin is a **read-only gallery**: it surfaces entries to other plugins. It installs nothing, executes no plugin code, and never mutates the profile. The install command is derived by the host from the GitHub repository URL and is shown for copying only.

## Features

- **Live data**: the host fetches dsh.plus’s public catalog contract (`/v1/plugins` + `/plugin-index.json`) at runtime — the site updates and the gallery follows, with no extra deployment.
- **Bilingual**: plugin summaries load in zh or en to match the DSH UI language.
- **Search / category filter / sort**: name-and-summary search, six-category filter, and sorting by stars / updated time / name.
- **Copy the install command**: `dsh plugin --profile web add github:<owner>/<repo>`.
- **GitHub links**: every card opens the plugin repo and shows stars, license, publisher, last-updated time, and cover.
- **Safety boundary**: all remote fields are sanitized and URLs re-validated against the DSH Community Market contract; no install scripts or credentials ever pass through.

## Install

```sh
# from GitHub (dev / preview)
dsh plugin --profile web add github:zhaimingyou/dsh.plus

# once published to npm:
dsh plugin --profile web add dsh.plus
```

Restart DSH, then open **Settings → Plugin Catalog**.

## Conforms to the DSH plugin spec

This plugin follows the official DeepSeek Harness plugin model ([`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness)):

- A [Cordis](https://github.com/cordiverse/cordis) (`@deepseek-ai/cordis`) **dual-half plugin**:
  - **host half** (`src/`): `apply(ctx)` injects the `webServer` service and registers a read-only route;
  - **browser half** (`src/client/`, exported as `./client`): injects `slots`/`locale` and registers a page in the `settings.section` slot.
- The **`dsh.client`** manifest in `package.json` (`platform: "web"` + client dependency injection) declares the browser half.
- **`cordis.patch.yml`** (via `dsh.bundle.patch`) inserts the plugin into the profile’s layer stack so `dsh plugin add` takes effect automatically.
- The client artifact is built by **tsdown** into a lazy-CJS factory bundle that calls `window.__ModuleLoader__.load({ id, factory })`.

It reuses the standard catalog-source contract dsh.plus already publishes ([`/catalog-source.json`](https://dsh.plus/catalog-source.json) + `GET /v1/plugins`, v1), so this plugin is essentially a “Path B” browser-side rendering of that directory.

## Development

```sh
npm install
npm run typecheck   # both host and client projects
npm run build       # tsc (host) + tsdown (client)
npm run check       # typecheck + build + preflight guard
```

Artifacts: `lib/` (host, ESM) + `client/client.js` (browser factory bundle, committed). `prepack` builds and runs `preflight`, which asserts the `cordis.patch.yml` name and bundle loader id match the package name.

## Project layout

```
src/
├── index.ts             # host entry: inject webServer, mount routes
├── catalog.ts           # fetch + merge + sanitize the dsh.plus catalog
├── routes.ts            # GET /dsh.plus/catalog
├── http.ts              # minimal JSON response helper
└── client/              # browser half (bundled by tsdown)
    ├── index.ts         # registers settings.section
    ├── CatalogSection.tsx   # gallery UI
    ├── styles.ts        # styles following DSH design tokens
    ├── locales.ts       # zh/en dictionaries
    └── types.ts         # catalog data types
tsdown.config.ts         # client factory bundle config
cordis.patch.yml         # profile layer insertion
scripts/                 # banner normalization + preflight guard
```

## Relationship to dsh.plus

[dsh.plus](https://dsh.plus) is the bilingual DSH ecosystem portal and curated plugin directory. This plugin is its in-DSH rendering: the host process reads dsh.plus’s public catalog data at runtime, and this repository bundles no plugin snapshot or third-party code.

## Disclaimers

- This plugin is maintained independently by the dsh.plus community and is not affiliated with or endorsed by DeepSeek AI or the official DeepSeek Harness project.
- Catalog listings are third-party open-source code; this plugin only browses metadata and does not install, execute, or review any plugin code. Verify a plugin’s source and trustworthiness before installing it.
- Compatibility: targets the DeepSeek Harness `web` client (`dsh web`) with `dsh.client` support.

## License

[MIT](LICENSE)

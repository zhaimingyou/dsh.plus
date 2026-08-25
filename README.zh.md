# dsh-plus-catalog

[English](README.md) | 中文

在 DeepSeek Harness（DSH）内展示 [dsh.plus](https://dsh.plus) 精选插件目录的插件。安装后，DSH 设置的「插件目录」页会实时列出 dsh.plus 上人工精选的 DSH 插件：浏览、搜索、筛选分类，复制安装命令，或直接打开插件的 GitHub 仓库。

> 本插件是**只读浏览画廊**：它展示其他插件的入口，不执行安装、不执行任何插件代码、不修改 profile。安装命令由宿主按 GitHub 仓库地址推导，仅供复制。

## 特性

- **实时数据**：host 侧实时读取 dsh.plus 的公开目录契约 `/v1/plugins` 与 `/plugin-index.json`，网站更新即同步，无需额外部署。
- **双语**：跟随 DSH 界面语言（zh / en）加载对应语言的简介。
- **搜索 / 分类 / 排序**：名称与简介搜索、六分类筛选、按 Star / 更新时间 / 名称排序。
- **一键复制安装命令**：`dsh plugin --profile web add github:<owner>/<repo>`，可复制到 DSH CLI。
- **GitHub 跳转**：每张卡片直达插件仓库，并展示 Star、协议、作者、最近更新时间与封面。
- **安全边界**：所有远程字段按 DSH Community Market 契约清洗、URL 重新校验，绝不透传安装脚本或凭据。

## 安装

```sh
# 从 GitHub 安装（开发/尝鲜）
dsh plugin --profile web add github:zhaimingyou/dsh-plus-catalog

# 发布到 npm 后：
dsh plugin --profile web add dsh-plus-catalog
```

安装后重启 DSH，打开 **设置 → 插件目录** 即可看到画廊。

## 符合 DSH 插件规范

本插件遵循 DeepSeek Harness 官方插件模型（[`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness)）：

- 基于 [Cordis](https://github.com/cordiverse/cordis)（`@deepseek-ai/cordis`）的**双半侧插件**：
  - **host 半侧**（`src/`）：`apply(ctx)` 注入 `webServer` 服务并注册只读路由；
  - **浏览器半侧**（`src/client/`，经 `./client` 导出）：注入 `slots`/`locale` 服务，向 `settings.section` 槽位注册页面。
- `package.json` 的 **`dsh.client`** manifest（`platform: "web"` + 客户端依赖注入）声明浏览器半侧。
- **`cordis.patch.yml`**（经 `dsh.bundle.patch`）把插件插入 profile 的层栈，使 `dsh plugin add` 安装后自动生效。
- 客户端产物由 **tsdown** 打包成 `window.__ModuleLoader__.load({ id, factory })` 惰性 CJS 工厂。

数据侧复用 dsh.plus 已上线的**标准目录源契约**（`/catalog-source.json` + `GET /v1/plugins`，v1）。因此本插件本质上是该目录的一份 “Path B” 浏览器端呈现。

## 开发

```sh
npm install
npm run typecheck   # host + client 双项目类型检查
npm run build       # tsc 编译 host + tsdown 打包 client
npm run check       # typecheck + build + preflight 守护
```

产物：`lib/`（host，ESM）+ `client/client.js`（浏览器工厂 bundle，已提交）。发布前 `prepack` 会自动构建并跑 `preflight`，校验 `cordis.patch.yml` 的 name 与 bundle 的 loader id 与包名一致。

## 目录结构

```
src/
├── index.ts             # host 入口：注入 webServer、挂载路由
├── catalog.ts           # 拉取 + 合并 + 清洗 dsh.plus 目录
├── routes.ts            # GET /dsh-plus-catalog/catalog
├── http.ts              # JSON 响应的最小工具
└── client/              # 浏览器半侧（tsdown 打包）
    ├── index.ts         # 注册 settings.section
    ├── CatalogSection.tsx   # 画廊 UI
    ├── styles.ts        # 样式（跟随 DSH 设计 token）
    ├── locales.ts       # zh/en 文案
    └── types.ts         # 目录数据类型
tsdown.config.ts         # 客户端 factory bundle 配置
cordis.patch.yml         # profile 层注入
scripts/                 # banner 规范化 + preflight 守护
```

## 与 dsh.plus 的关系

[dsh.plus](https://dsh.plus) 是 DSH 生态的双语门户与插件精选目录。本插件是它的 DSH 内呈现：宿主进程在运行时读取 dsh.plus 的公开目录数据，本仓库不含任何插件快照或第三方代码。

## License

[MIT](LICENSE)

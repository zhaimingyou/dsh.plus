window.__ModuleLoader__.load({ id: "dsh.plus", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/types.ts
		const CATEGORY_IDS = [
			"agent",
			"tools",
			"ui",
			"workflow",
			"dev",
			"misc"
		];
		//#endregion
		//#region src/client/CatalogSection.tsx
		const CATEGORY_KEY = {
			agent: "catAgent",
			tools: "catTools",
			ui: "catUi",
			workflow: "catWorkflow",
			dev: "catDev",
			misc: "catMisc"
		};
		function hueOf(name) {
			let hash = 0;
			for (let i = 0; i < name.length; i++) hash = hash * 31 + name.charCodeAt(i) | 0;
			return (hash % 360 + 360) % 360;
		}
		function formatStars(stars) {
			if (stars >= 1e3) return (stars / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
			return String(stars);
		}
		/** `dsh plugin --profile web add github:owner/repo` -> `github:owner/repo`.
		* The full command stays on the title tooltip and is what Copy writes. */
		function shortSpec(install) {
			const index = install.indexOf(" add ");
			return index === -1 ? install : install.slice(index + 5);
		}
		async function copyText(text) {
			try {
				await navigator.clipboard.writeText(text);
				return true;
			} catch {
				try {
					const area = document.createElement("textarea");
					area.value = text;
					area.style.position = "fixed";
					area.style.opacity = "0";
					document.body.appendChild(area);
					area.select();
					const ok = document.execCommand("copy");
					area.remove();
					return ok;
				} catch {
					return false;
				}
			}
		}
		function Cover({ name, url }) {
			const [failed, setFailed] = (0, react.useState)(false);
			if (url === void 0 || failed) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsc-cover-fallback",
				style: { background: `hsl(${hueOf(name)} 55% 48%)` },
				children: name.charAt(0).toUpperCase()
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				className: "dsc-cover",
				src: url,
				alt: "",
				loading: "lazy",
				referrerPolicy: "no-referrer",
				onError: () => setFailed(true)
			});
		}
		function CatalogSection({ t, locale }) {
			const [status, setStatus] = (0, react.useState)("loading");
			const [entries, setEntries] = (0, react.useState)([]);
			const [query, setQuery] = (0, react.useState)("");
			const [category, setCategory] = (0, react.useState)("all");
			const [sort, setSort] = (0, react.useState)("stars-desc");
			const [copiedId, setCopiedId] = (0, react.useState)(null);
			const lang = (0, react.useMemo)(() => {
				return (locale.getSnapshot().active || "").toLowerCase().startsWith("en") ? "en" : "zh";
			}, [locale]);
			(0, react.useEffect)(() => {
				let cancelled = false;
				setStatus("loading");
				fetch(`/dsh.plus/catalog?locale=${lang}`).then((response) => {
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					return response.json();
				}).then((data) => {
					if (cancelled) return;
					setEntries(Array.isArray(data.entries) ? data.entries : []);
					setStatus("ready");
				}).catch(() => {
					if (!cancelled) setStatus("error");
				});
				return () => {
					cancelled = true;
				};
			}, [lang]);
			const visible = (0, react.useMemo)(() => {
				const q = query.trim().toLowerCase();
				const sorted = [...entries.filter((entry) => {
					if (category !== "all" && !entry.categories.includes(category)) return false;
					if (q === "") return true;
					return [
						entry.name,
						entry.summary,
						entry.publisher ?? "",
						...entry.categories
					].join("\0").toLowerCase().includes(q);
				})];
				switch (sort) {
					case "stars-desc":
						sorted.sort((a, b) => b.stars - a.stars);
						break;
					case "stars-asc":
						sorted.sort((a, b) => a.stars - b.stars);
						break;
					case "updated-desc":
						sorted.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
						break;
					case "name-asc": sorted.sort((a, b) => a.name.localeCompare(b.name));
				}
				return sorted;
			}, [
				entries,
				query,
				category,
				sort
			]);
			const copyInstall = (entry) => {
				copyText(entry.install).then((ok) => {
					if (ok) {
						setCopiedId(entry.id);
						window.setTimeout(() => setCopiedId((current) => current === entry.id ? null : current), 1600);
					}
				});
			};
			const formatDate = (iso) => {
				if (!iso) return "";
				const date = new Date(iso);
				if (Number.isNaN(date.getTime())) return "";
				return date.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
					year: "numeric",
					month: "short",
					day: "numeric"
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsc-root",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "dsc-header",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("title") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("subtitle") })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsc-toolbar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							className: "dsc-search",
							type: "search",
							value: query,
							placeholder: t("searchPh"),
							onChange: (event) => setQuery(event.currentTarget.value)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: "dsc-sort",
							"aria-label": t("sortLabel"),
							value: sort,
							onChange: (event) => setSort(event.currentTarget.value),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "stars-desc",
									children: t("sortStarsDesc")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "stars-asc",
									children: t("sortStarsAsc")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "updated-desc",
									children: t("sortUpdated")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "name-asc",
									children: t("sortName")
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsc-chips",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsc-chip",
							"data-active": category === "all",
							onClick: () => setCategory("all"),
							children: t("all")
						}), CATEGORY_IDS.map((id) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsc-chip",
							"data-active": category === id,
							onClick: () => setCategory(category === id ? "all" : id),
							children: t(CATEGORY_KEY[id])
						}, id))]
					}),
					status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsc-state",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsc-spin",
							"aria-hidden": "true"
						}), t("loading")]
					}),
					status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsc-state dsc-error",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("loadFail") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsc-btn dsc-btn-primary",
							onClick: () => {
								setStatus("loading");
								setCategory("all");
								fetch(`/dsh.plus/catalog?locale=${lang}`).then((r) => r.ok ? r.json() : Promise.reject(/* @__PURE__ */ new Error())).then((d) => {
									setEntries(Array.isArray(d.entries) ? d.entries : []);
									setStatus("ready");
								}).catch(() => setStatus("error"));
							},
							children: t("retry")
						})]
					}),
					status === "ready" && visible.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsc-state",
						children: t("empty")
					}),
					status === "ready" && visible.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsc-count",
						children: [
							visible.length,
							" ",
							t("many"),
							" · ",
							t("installHint")
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsc-grid",
						children: visible.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
							className: "dsc-card",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsc-card-head",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Cover, {
										name: entry.name,
										url: entry.cover
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsc-card-body",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
											className: "dsc-name",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
												href: entry.repository,
												target: "_blank",
												rel: "noopener noreferrer",
												children: entry.name
											})
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "dsc-summary",
											title: entry.summary,
											children: entry.summary
										})]
									})]
								}),
								entry.categories.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dsc-tags",
									children: entry.categories.map((id) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsc-tag",
										children: CATEGORY_IDS.includes(id) ? t(CATEGORY_KEY[id]) : id
									}, id))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsc-meta",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "dsc-stars",
											children: ["⭐ ", formatStars(entry.stars)]
										}),
										entry.license && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: entry.license === "NOASSERTION" ? t("licenseCustom") : entry.license }),
										entry.publisher && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											t("publishedBy"),
											" ",
											entry.publisher
										] }),
										entry.updatedAt && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											t("updatedAt"),
											" ",
											formatDate(entry.updatedAt)
										] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
											className: "dsc-meta-link",
											href: entry.repository,
											target: "_blank",
											rel: "noopener noreferrer",
											children: "GitHub ↗"
										})
									]
								}),
								entry.install && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsc-install",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
										title: entry.install,
										children: shortSpec(entry.install)
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsc-btn dsc-btn-primary",
										title: t("installHint"),
										onClick: () => copyInstall(entry),
										children: copiedId === entry.id ? t("copied") : t("copy")
									})]
								})
							]
						}, entry.id))
					})] })
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** zh/en dictionaries for the dsh.plus settings section. */
		const zh = {
			nav: "插件目录",
			title: "dsh.plus 插件目录",
			subtitle: "由 dsh.plus 人工精选的 DeepSeek Harness 插件 · 数据实时同步",
			searchPh: "搜索插件名称或简介…",
			all: "全部",
			catAgent: "Agent 增强",
			catTools: "工具集成",
			catUi: "UI 主题",
			catWorkflow: "自动化工作流",
			catDev: "开发工具",
			catMisc: "其他",
			sortLabel: "排序",
			sortStarsDesc: "Star 最多",
			sortStarsAsc: "Star 最少",
			sortUpdated: "最近更新",
			sortName: "名称",
			loading: "正在加载 dsh.plus 目录…",
			loadFail: "目录加载失败（无法访问 dsh.plus），请稍后重试。",
			retry: "重试",
			empty: "没有匹配的插件",
			install: "安装",
			copy: "复制",
			copied: "已复制",
			installHint: "安装：复制命令后粘贴到 DSH CLI 即可",
			licenseCustom: "自定义协议",
			github: "GitHub",
			updatedAt: "更新于",
			publishedBy: "作者",
			many: "个插件",
			openSite: "访问 dsh.plus"
		};
		const en = {
			nav: "Plugin Catalog",
			title: "dsh.plus Plugin Catalog",
			subtitle: "Curated DeepSeek Harness plugins from dsh.plus · data synced live",
			searchPh: "Search plugins by name or summary…",
			all: "All",
			catAgent: "Agent",
			catTools: "Tools",
			catUi: "UI & Theme",
			catWorkflow: "Automation",
			catDev: "DevTools",
			catMisc: "Misc",
			sortLabel: "Sort",
			sortStarsDesc: "Most stars",
			sortStarsAsc: "Fewest stars",
			sortUpdated: "Recently updated",
			sortName: "Name",
			loading: "Loading dsh.plus catalog…",
			loadFail: "Could not load the catalog (dsh.plus unreachable). Try again later.",
			retry: "Retry",
			empty: "No matching plugins",
			install: "Install",
			copy: "Copy",
			copied: "Copied",
			installHint: "Install: copy the command, then paste it into the DSH CLI",
			licenseCustom: "Custom",
			github: "GitHub",
			updatedAt: "Updated",
			publishedBy: "by",
			many: "plugins",
			openSite: "Visit dsh.plus"
		};
		//#endregion
		//#region src/client/styles.ts
		/** Scoped styles for the dsh.plus section. Class names are prefixed
		* dsc- to avoid colliding with the host shell or other plugins. Colors come
		* from the DSH web design tokens so light/dark theming follows the host. */
		function installStyles() {
			if (typeof document === "undefined") return () => {};
			const id = "dsh.plus-catalog";
			if (document.getElementById(id) !== null) return () => {};
			const style = document.createElement("style");
			style.id = id;
			style.dataset.plugin = "dsh.plus";
			style.dataset.pluginCss = "dsh.plus/catalog";
			style.textContent = CSS;
			document.head.appendChild(style);
			return () => {
				style.remove();
			};
		}
		const CSS = `
.dsc-root {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: min(100%, 1000px);
  padding: 2px 0 40px;
  color: var(--dsw-alias-label-primary);
}
.dsc-header { display: flex; flex-direction: column; gap: 4px; }
.dsc-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.35;
}
.dsc-header p {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.dsc-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.dsc-search {
  flex: 1;
  min-width: 220px;
  min-height: 36px;
  box-sizing: border-box;
  padding: 7px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
}
.dsc-search:focus-visible {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 20%, transparent);
}
.dsc-sort {
  min-height: 36px;
  padding: 6px 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.dsc-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.dsc-chip {
  min-height: 28px;
  padding: 3px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 20px;
}
.dsc-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsc-chip[data-active='true'] {
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary);
}
.dsc-count { color: var(--dsw-alias-label-secondary); font-size: 12px; }
.dsc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}
.dsc-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
  min-width: 0;
}
.dsc-card-head { display: flex; gap: 12px; align-items: flex-start; min-width: 0; }
.dsc-cover {
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  background: var(--dsw-alias-bg-layer-2);
}
.dsc-cover-fallback {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}
.dsc-card-body { flex: 1; min-width: 0; }
.dsc-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.dsc-name a { color: inherit; text-decoration: none; }
.dsc-summary {
  margin: 3px 0 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dsc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.dsc-tag {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 18px;
}
.dsc-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
}
.dsc-stars { color: var(--dsw-alias-label-primary); font-weight: 600; }
.dsc-install {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 6px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
}
.dsc-install code {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsc-btn {
  flex: 0 0 auto;
  min-height: 30px;
  padding: 4px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}
.dsc-btn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dsc-btn-primary {
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}
.dsc-meta-link { color: var(--dsw-alias-label-secondary); text-decoration: none; }
.dsc-meta-link:hover { color: var(--dsw-alias-brand-primary); }
.dsc-state {
  padding: 28px 16px;
  border: 1px dashed var(--dsw-alias-border-l1);
  border-radius: 12px;
  color: var(--dsw-alias-label-secondary);
  text-align: center;
  font-size: 13px;
  line-height: 1.6;
}
.dsc-error { color: var(--dsw-alias-state-error-primary); border-color: var(--dsw-alias-state-error-primary); }
.dsc-spin { display: inline-block; width: 14px; height: 14px; margin-right: 8px; vertical-align: -2px; border: 2px solid var(--dsw-alias-border-l2); border-top-color: var(--dsw-alias-brand-primary); border-radius: 50%; animation: dsc-spin 0.8s linear infinite; }
@keyframes dsc-spin { to { transform: rotate(360deg); } }
@media (max-width: 640px) {
  .dsc-grid { grid-template-columns: 1fr; }
}
`;
		//#endregion
		//#region src/client/index.ts
		const NS = "dsh.plus";
		const name = "dsh.plus";
		const inject = ["slots", "locale"];
		/**
		* Client entry: register the "dsh.plus" section in the Settings
		* shell so the gallery renders as a first-class page. Built by tsdown into
		* the __ModuleLoader__ factory bundle at client/client.js.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh.plus: dictionaries");
			ctx.effect(() => installStyles(), "dsh.plus: styles");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh.plus",
				order: 50,
				label: () => t("nav"),
				locale: NS,
				inject: () => ({ t })
			}, () => (0, react.createElement)(CatalogSection, {
				t,
				locale: ctx.locale
			})));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
/** Scoped styles for the dsh-plus-catalog section. Class names are prefixed
 * dsc- to avoid colliding with the host shell or other plugins. Colors come
 * from the DSH web design tokens so light/dark theming follows the host. */

export function installStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  const id = 'dsh-plus-catalog-catalog'
  if (document.getElementById(id) !== null) return () => {}
  const style = document.createElement('style')
  style.id = id
  style.dataset.plugin = 'dsh-plus-catalog'
  style.dataset.pluginCss = 'dsh-plus-catalog/catalog'
  style.textContent = CSS
  document.head.appendChild(style)
  return () => {
    style.remove()
  }
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
.dsc-actions { display: flex; flex-direction: column; gap: 8px; }
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
.dsc-actions-row { display: flex; gap: 8px; align-items: center; }
.dsc-install-hint { color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 1.5; }
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

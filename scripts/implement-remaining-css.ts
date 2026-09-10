import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const css: Record<string, string> = {
  alert: `:where([data-dui='alert']){display:flex;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:var(--dui-radius-md);border:1px solid var(--dui-color-border-default);background:var(--dui-color-action-soft)}
:where([data-dui='alert'][data-status='success']){background:var(--dui-color-success-soft);border-color:var(--dui-color-success-bg)}
:where([data-dui='alert'][data-status='warning']){background:var(--dui-color-warning-soft);border-color:var(--dui-color-warning-bg)}
:where([data-dui='alert'][data-status='error']){background:var(--dui-color-danger-soft);border-color:var(--dui-color-danger-bg)}
:where([data-dui='alert'] [data-part='title']){display:block;margin-bottom:4px}
:where([data-dui='alert'] [data-part='closeButton']){border:0;background:transparent;cursor:pointer;min-width:32px;min-height:32px}`,
  tag: `:where([data-dui='tag']){display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border-radius:var(--dui-radius-pill);background:var(--dui-color-action-soft);color:var(--dui-color-action-bg);font-size:13px}
:where([data-dui='tag'][data-variant='solid']){background:var(--dui-color-action-bg);color:#fff}
:where([data-dui='tag'][data-variant='outline']){background:transparent;border:1px solid var(--dui-color-border-strong)}
:where([data-dui='tag'][data-checked]){box-shadow:0 0 0 2px var(--dui-color-action-bg)}
:where([data-dui='tag'] [data-part='close']){border:0;background:transparent;cursor:pointer;color:inherit}`,
  avatar: `:where([data-dui='avatar']){display:inline-grid;place-items:center;width:40px;height:40px;border-radius:var(--dui-radius-pill);background:linear-gradient(135deg,#ff7ac6,#7ad7ff);color:#fff;overflow:hidden}
:where([data-dui='avatar'][data-size='sm']){width:28px;height:28px;font-size:12px}
:where([data-dui='avatar'][data-size='lg']){width:56px;height:56px}
:where([data-dui='avatar'][data-shape='square']){border-radius:var(--dui-radius-md)}
:where([data-dui='avatar'] img){width:100%;height:100%;object-fit:cover}
:where([data-dui='avatar-group']){display:inline-flex}
:where([data-dui='avatar-group'] [data-dui='avatar']){margin-inline-start:-8px;box-shadow:0 0 0 2px #fff}`,
  image: `:where([data-dui='image']){display:inline-block;overflow:hidden;border-radius:var(--dui-radius-md);background:var(--dui-surface-muted)}
:where([data-dui='image'] img){display:block;width:100%;height:100%;object-fit:cover}
:where([data-dui='image'][data-fit='contain'] img){object-fit:contain}
:where([data-dui='image'] [data-part='fallback']){display:grid;place-items:center;min-height:80px;color:var(--dui-color-text-muted)}`,
  progress: `:where([data-dui='progress']){display:flex;align-items:center;gap:10px;width:100%}
:where([data-dui='progress'] [data-part='track']){flex:1;height:var(--dui-progress-height);border-radius:var(--dui-radius-pill);background:var(--dui-progress-bg);overflow:hidden}
:where([data-dui='progress'] [data-part='bar']){display:block;height:100%;background:var(--dui-progress-fill);border-radius:inherit}
:where([data-dui='progress'][data-status='success'] [data-part='bar']){background:var(--dui-color-success-bg)}
:where([data-dui='progress'][data-status='error'] [data-part='bar']){background:var(--dui-color-danger-bg)}
:where([data-dui='progress'][data-indeterminate] [data-part='bar']){width:40%;animation:dui-progress 1s ease-in-out infinite}
@keyframes dui-progress{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}`,
  pagination: `:where([data-dui='pagination']){display:flex;flex-wrap:wrap;gap:8px;align-items:center}
:where([data-dui='pagination'] button){min-width:36px;min-height:36px;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md);background:#fff;cursor:pointer}
:where([data-dui='pagination'] button[data-active]){background:var(--dui-color-action-bg);color:#fff;border-color:transparent}`,
  breadcrumb: `:where([data-dui='breadcrumb'] ol){display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0;padding:0}
:where([data-dui='breadcrumb'] a){color:var(--dui-color-link)}
:where([data-dui='breadcrumb'] [data-part='separator']){color:var(--dui-color-text-muted)}`,
  menu: `:where([data-dui='menu']){list-style:none;margin:0;padding:6px;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md);background:#fff;min-width:160px}
:where([data-dui='menu'] li){min-height:36px;display:flex;align-items:center;padding:0 10px;border-radius:8px;cursor:pointer}
:where([data-dui='menu'] li[data-active]),:where([data-dui='menu'] li:hover){background:var(--dui-color-action-soft);color:var(--dui-color-action-bg)}`,
  dropdown: `:where([data-dui='dropdown']){position:relative;display:inline-flex}
:where([data-dui='dropdown'] [data-part='trigger']){min-height:40px;padding:0 12px;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md);background:#fff;cursor:pointer}
:where([data-dui='dropdown'] [data-part='menu']){position:absolute;top:calc(100% + 6px);inset-inline-start:0;z-index:var(--dui-zIndex-popover);list-style:none;margin:0;padding:6px;min-width:160px;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md);background:#fff;box-shadow:var(--dui-shadow-md)}
:where([data-dui='dropdown'] [data-part='menu'] li){min-height:36px;display:flex;align-items:center;padding:0 10px;cursor:pointer;border-radius:8px}
:where([data-dui='dropdown'] [data-part='menu'] li:hover){background:var(--dui-color-action-soft)}
:where([data-dui='dropdown'] [data-danger]){color:var(--dui-color-danger-bg)}`,
  accordion: `:where([data-dui='accordion'] [data-part='item']){border-bottom:1px solid var(--dui-color-border-default)}
:where([data-dui='accordion'] [data-part='trigger']){width:100%;min-height:44px;text-align:start;border:0;background:transparent;font:inherit;cursor:pointer}
:where([data-dui='accordion'] [data-part='panel']){padding:0 0 12px}`,
  'input-number': `:where([data-dui='input-number']){display:inline-flex;align-items:center;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md);overflow:hidden;background:#fff}
:where([data-dui='input-number'] input){width:72px;height:40px;border:0;text-align:center;font:inherit}
:where([data-dui='input-number'] button){width:40px;height:40px;border:0;background:var(--dui-color-action-soft);color:var(--dui-color-action-bg);cursor:pointer}`,
  slider: `:where([data-dui='slider']){display:flex;align-items:center;gap:12px;width:100%;position:relative}
:where([data-dui='slider'] input[type='range']){position:absolute;inset:0;opacity:0;cursor:pointer}
:where([data-dui='slider'] [data-part='track']){position:relative;flex:1;height:8px;border-radius:999px;background:var(--dui-surface-muted)}
:where([data-dui='slider'] [data-part='fill']){position:absolute;inset-block:0;inset-inline-start:0;background:var(--dui-color-action-bg);border-radius:inherit}
:where([data-dui='slider'] [data-part='thumb']){position:absolute;top:50%;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--dui-color-action-bg);transform:translate(-50%,-50%)}`,
  rate: `:where([data-dui='rate']){display:inline-flex;gap:4px}
:where([data-dui='rate'] button){border:0;background:transparent;font-size:22px;color:#ffd0e4;cursor:pointer}
:where([data-dui='rate'] button[data-active]){color:#ff4d8d}`,
  upload: `:where([data-dui='upload'] [data-part='trigger']){display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border:1px dashed var(--dui-color-border-strong);border-radius:var(--dui-radius-md);cursor:pointer;background:var(--dui-color-action-soft);color:var(--dui-color-action-bg)}
:where([data-dui='upload'] [data-part='list']){margin:8px 0 0;padding:0;list-style:none;color:var(--dui-color-text-secondary)}`,
  'date-picker': `:where([data-dui='date-picker'] input),:where([data-dui='time-picker'] input){min-height:44px;padding:0 12px;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md);font:inherit;background:#fff}`,
  'time-picker': `:where([data-dui='time-picker']){display:inline-flex}`,
  table: `:where([data-dui='table']){overflow:auto;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md)}
:where([data-dui='table'] table){width:100%;border-collapse:collapse}
:where([data-dui='table'] th),:where([data-dui='table'] td){padding:10px 12px;border-bottom:1px solid var(--dui-color-border-default);text-align:start}
:where([data-dui='table'] th){background:var(--dui-surface-muted);color:var(--dui-color-action-bg)}`,
  list: `:where([data-dui='list']){list-style:none;margin:0;padding:0}
:where([data-dui='list'] [data-part='item']){padding:12px 0;border-bottom:1px solid var(--dui-color-border-default)}
:where([data-dui='list'] [data-part='description']){color:var(--dui-color-text-muted);font-size:13px}`,
  descriptions: `:where([data-dui='descriptions'] dl){display:grid;grid-template-columns:repeat(var(--dui-descriptions-columns,2),1fr);gap:12px;margin:0}
:where([data-dui='descriptions'] dt){color:var(--dui-color-text-muted);font-size:13px}
:where([data-dui='descriptions'] dd){margin:4px 0 0}`,
  steps: `:where([data-dui='steps']){display:flex;gap:16px;list-style:none;margin:0;padding:0}
:where([data-dui='steps'] li){display:flex;flex-direction:column;gap:4px;flex:1}
:where([data-dui='steps'] [data-part='index']){width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--dui-surface-muted)}
:where([data-dui='steps'] li[data-status='process'] [data-part='index']),:where([data-dui='steps'] li[data-status='done'] [data-part='index']){background:var(--dui-color-action-bg);color:#fff}`,
  'bottom-sheet': `:where([data-dui='bottom-sheet']){position:fixed;inset:0;z-index:var(--dui-zIndex-modal)}
:where([data-dui='bottom-sheet'] [data-part='backdrop']){position:absolute;inset:0;background:var(--dui-surface-overlay)}
:where([data-dui='bottom-sheet'] [data-part='content']){position:absolute;inset-inline:0;bottom:0;padding:16px;border-radius:20px 20px 0 0;background:#fff}`,
  'tab-bar': `:where([data-dui='tab-bar']){display:flex;border-top:1px solid var(--dui-color-border-default);background:#fff}
:where([data-dui='tab-bar'] button){flex:1;min-height:52px;border:0;background:transparent;cursor:pointer}
:where([data-dui='tab-bar'] button[data-active]){color:var(--dui-color-action-bg)}`,
  'action-sheet': `:where([data-dui='action-sheet']){position:fixed;inset:0;z-index:var(--dui-zIndex-modal)}
:where([data-dui='action-sheet'] [data-part='backdrop']){position:absolute;inset:0;background:var(--dui-surface-overlay)}
:where([data-dui='action-sheet'] [data-part='content']){position:absolute;inset-inline:12px;bottom:12px;display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:16px;background:#fff}
:where([data-dui='action-sheet'] button){min-height:44px;border:0;border-radius:12px;background:var(--dui-surface-muted);cursor:pointer}
:where([data-dui='action-sheet'] [data-danger]){color:var(--dui-color-danger-bg)}`,
  'safe-area': `:where([data-dui='safe-area']){padding-bottom:env(safe-area-inset-bottom);padding-top:env(safe-area-inset-top)}`,
  segmented: `:where([data-dui='segmented']){display:inline-flex;padding:4px;border-radius:var(--dui-radius-pill);background:var(--dui-surface-muted)}
:where([data-dui='segmented'] button){min-height:36px;padding:0 14px;border:0;border-radius:var(--dui-radius-pill);background:transparent;cursor:pointer}
:where([data-dui='segmented'] button[data-active]){background:#fff;color:var(--dui-color-action-bg);box-shadow:var(--dui-shadow-sm)}`,
  autocomplete: `:where([data-dui='autocomplete']){position:relative}
:where([data-dui='autocomplete'] input){width:100%;min-height:44px;padding:0 12px;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md);font:inherit}
:where([data-dui='autocomplete'] ul){position:absolute;inset-inline:0;top:calc(100% + 4px);margin:0;padding:6px;list-style:none;background:#fff;border:1px solid var(--dui-color-border-default);border-radius:12px;z-index:10}
:where([data-dui='autocomplete'] li){min-height:36px;display:flex;align-items:center;padding:0 10px;cursor:pointer}
:where([data-dui='autocomplete'] li:hover){background:var(--dui-color-action-soft)}`,
  calendar: `:where([data-dui='calendar'] [data-part='grid']){display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
:where([data-dui='calendar'] button){min-height:36px;border:0;border-radius:10px;background:transparent;cursor:pointer}
:where([data-dui='calendar'] button[data-selected]){background:var(--dui-color-action-bg);color:#fff}
:where([data-dui='calendar'] [data-part='weekday']){text-align:center;color:var(--dui-color-text-muted);font-size:12px}`,
  notification: `:where([data-dui='notification']){display:flex;flex-direction:column;gap:4px;min-width:240px;padding:12px 36px 12px 14px;position:relative;border-radius:var(--dui-radius-md);background:#fff;box-shadow:var(--dui-shadow-md);border:1px solid var(--dui-color-border-default)}
:where([data-dui='notification'] button){position:absolute;top:8px;inset-inline-end:8px;border:0;background:transparent;cursor:pointer}`,
  tree: `:where([data-dui='tree']){list-style:none;margin:0;padding:0}
:where([data-dui='tree'] ul){padding-inline-start:16px;list-style:none}
:where([data-dui='tree'] button){border:0;background:transparent;min-height:32px;cursor:pointer}
:where([data-dui='tree'] button[data-active]){color:var(--dui-color-action-bg)}`,
  'tree-select': `:where([data-dui='tree-select']){min-height:44px;padding:0 12px;border-radius:var(--dui-radius-md);border:1px solid var(--dui-color-border-default);font:inherit}`,
  cascader: `:where([data-dui='cascader']){display:flex;gap:8px}
:where([data-dui='cascader'] select){min-height:44px;border-radius:var(--dui-radius-md);border:1px solid var(--dui-color-border-default);font:inherit}`,
  transfer: `:where([data-dui='transfer']){display:grid;grid-template-columns:1fr 1fr;gap:12px}
:where([data-dui='transfer'] ul){min-height:160px;margin:0;padding:8px;list-style:none;border:1px solid var(--dui-color-border-default);border-radius:12px}
:where([data-dui='transfer'] button){border:0;background:transparent;cursor:pointer;min-height:32px}`,
  carousel: `:where([data-dui='carousel']){display:flex;align-items:center;gap:8px}
:where([data-dui='carousel'] [data-part='viewport']){flex:1;min-height:120px;border-radius:16px;background:var(--dui-color-action-soft);display:grid;place-items:center}
:where([data-dui='carousel'] button){width:36px;height:36px;border:0;border-radius:50%;background:var(--dui-color-action-bg);color:#fff;cursor:pointer}`,
  timeline: `:where([data-dui='timeline']){list-style:none;margin:0;padding:0}
:where([data-dui='timeline'] li){display:flex;gap:12px;padding-bottom:16px}
:where([data-dui='timeline'] [data-part='dot']){width:10px;height:10px;margin-top:6px;border-radius:50%;background:var(--dui-color-action-bg);flex:0 0 auto}`,
  anchor: `:where([data-dui='anchor']){display:flex;flex-direction:column;gap:8px}
:where([data-dui='anchor'] a){color:var(--dui-color-link)}`,
  affix: `:where([data-dui='affix']){position:sticky;z-index:var(--dui-zIndex-sticky)}`,
  'scroll-area': `:where([data-dui='scroll-area']){overflow:auto;border:1px solid var(--dui-color-border-default);border-radius:12px;padding:8px}`,
  'back-top': `:where([data-dui='back-top']){position:fixed;inset-inline-end:20px;bottom:20px;width:44px;height:44px;border:0;border-radius:50%;background:var(--dui-color-action-bg);color:#fff;cursor:pointer;z-index:20}`,
  'pull-refresh': `:where([data-dui='pull-refresh']){display:flex;flex-direction:column;gap:8px}`,
  'infinite-scroll': `:where([data-dui='infinite-scroll']){display:flex;flex-direction:column;gap:8px;align-items:center}`,
  'swipe-cell': `:where([data-dui='swipe-cell']){display:flex;overflow:hidden;border:1px solid var(--dui-color-border-default);border-radius:12px}
:where([data-dui='swipe-cell'] [data-part='content']){flex:1;padding:12px;cursor:pointer}
:where([data-dui='swipe-cell'] [data-part='actions']){display:flex}
:where([data-dui='swipe-cell'] [data-part='actions'] button){min-width:72px;border:0;background:var(--dui-color-danger-bg);color:#fff;cursor:pointer}`,
  'notice-bar': `:where([data-dui='notice-bar']){display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:40px;padding:0 12px;border-radius:12px;background:var(--dui-color-warning-soft);color:var(--dui-color-warning-bg)}
:where([data-dui='notice-bar'] button){border:0;background:transparent;cursor:pointer}`,
  'virtual-list': `:where([data-dui='virtual-list']){border:1px solid var(--dui-color-border-default);border-radius:12px}`,
  'search-bar': `:where([data-dui='search-bar']){display:flex;gap:8px}
:where([data-dui='search-bar'] input){flex:1;min-height:44px;padding:0 12px;border:1px solid var(--dui-color-border-default);border-radius:var(--dui-radius-md);font:inherit}
:where([data-dui='search-bar'] button){min-height:44px;padding:0 14px;border:0;border-radius:var(--dui-radius-md);background:var(--dui-color-action-bg);color:#fff;cursor:pointer}`,
  picker: `:where([data-dui='picker']){display:flex;gap:8px}
:where([data-dui='picker'] select){min-height:44px;border-radius:12px;border:1px solid var(--dui-color-border-default);font:inherit}`,
  watermark: `:where([data-dui='watermark']){position:relative}
:where([data-dui='watermark'])::after{content:var(--dui-watermark-text,'Xiaoli');position:absolute;inset:0;pointer-events:none;opacity:.12;display:grid;place-items:center;font-size:32px;transform:rotate(-18deg)}`,
};

await Promise.all(Object.entries(css).map(([name, body]) => writeFile(path.join(root, `packages/theme/src/components/${name}.css`), `@layer dui.components {\n${body}\n}\n`)));
console.log(`wrote ${Object.keys(css).length} css files`);

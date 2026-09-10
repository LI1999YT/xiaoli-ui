# 06｜Design Tokens 与主题系统

## 1. 三层 token

| 层级 | 示例 | 约束 |
|---|---|---|
| 原始 foundation | `color.blue.600`, `space.4`, `radius.md` | 只表达数值，不绑定业务 |
| 语义 semantic | `color.action.bg`, `color.text.primary`, `surface.panel` | 表达用途，可按明暗模式替换 |
| 组件 component | `button.primaryBg`, `dialog.radius` | 默认引用语义 token，可局部覆写 |

CSS 变量命名为 `--dui-color-action-bg`、`--dui-surface-panel`、`--dui-button-primary-bg`。ThemeConfig.tokens 暴露稳定的语义与布局别名；例如 `radius.md` 虽源自 foundation，也作为获准的公开布局别名开放，源 schema 必须标记其类别与映射，不能把全部原始调色板自动升级为公共语义 API。

公共变量清单由源数据生成；新增、删除和重命名均进行兼容审查。禁止只有主色能切换，其余组件硬编码。

## 2. 主题配置目标接口

```ts
interface ThemeConfig {
  id: string;                    // 安全标识，不直接拼接 CSS 选择器
  mode?: 'light' | 'dark' | 'system';
  tokens?: Partial<SemanticTokens>;
  components?: {
    button?: Partial<ButtonTokens>;
    input?: Partial<InputTokens>;
    dialog?: Partial<DialogTokens>;
    // 由组件 token 清单生成其余键，不使用 Record<string, any>
  };
  density?: 'compact' | 'comfortable';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  motion?: 'system' | 'normal' | 'reduced' | 'none';
}
```

`defineTheme(config)` 仅校验和归一化数据，不操作 document。两框架 ConfigProvider 应用已解析的主题。`mode=system` 在 effect/mount 后订阅 matchMedia；SSR 使用 Provider.initialMode 作为明确的初始 resolvedMode，并保持首个客户端树一致。

## 3. 合并与优先级

默认预设 → 外层 Provider → 当前 Provider token 覆写 → 组件局部 token → 使用者显式样式。tokens 按已知键深合并，数组替换，`undefined` 视为未设置，未知键开发告警。禁止用字符串“null”生成无效 CSS。

更换主题时必须删除上一主题独有的内联变量，避免残留。每次更新不可对所有组件逐一强制重挂载；CSS 变量承载视觉变更，只有 locale/direction 等交互配置才触发必要渲染。

## 4. CSS 作用域

```css
@layer dui.reset, dui.tokens, dui.base, dui.components;

:where([data-dui-theme]) {
  color: var(--dui-color-text-primary);
}
:where([data-dui='button']:not([data-unstyled])) {
  border-radius: var(--dui-button-radius, var(--dui-radius-md));
}
```

上述代码是接口示意。tokens 的赋值需要完整 light/dark 选择器，且不能把全部组件颜色硬赋到局部根节点，遮蔽父主题继承。只对库元素做局部基础样式，不重置宿主所有 button/input/body。

普通用户未分层样式通常可覆盖库的分层样式，但 `!important` 的层叠顺序不同；项目禁止组件默认使用 `!important`。主题内联 token 优先级更高，明确提示使用者应通过 Provider 或局部 token 覆盖，而非不断升级选择器权重。

## 5. 浮层主题桥接

默认每个 Provider 建立与自身关联的 portal host，通常位于当前 ownerDocument.body。传递的不只是 `data-theme=dark`，而是解析后的 token、direction、locale、density、motion 与层级上下文。由 Provider 管理的配置更新应同步到已有弹层。

DOM 外层任意 class 所造成的继承不能假装会穿过 portal。支持两种明确路径：

1. **标准主题路径**：通过 Provider tokens 配置，桥接保证同步。
2. **自定义 CSS 作用域路径**：使用 `portalContainer` 指向同一主题作用域内的宿主；使用者负责处理祖先 transform/overflow/stacking context。或显式提供 `portalClassName` / portal 样式表。

只在打开时读取 computedStyle 的快照不能承诺响应任意外部 CSS 变化；不把 MutationObserver 监听整个页面作为默认方案。

## 6. CSS 与无样式输出

提供 `tokens.css`、`base.css`、`components/button.css` 等外观文件和 `all.css` 聚合入口。`base.css` 包含必要结构、visually-hidden、交互命中区、焦点与浮层基础。`unstyled` 去掉品牌外观，不去掉焦点、隐藏内容规则或必需的浮层定位；具体见 [自定义规范](07-自定义与无样式模式.md)。

## 7. 主题导入导出

主题 JSON 带 `schemaVersion: 1`，保存原始可序列化配置，不保存函数或 DOM。导入限制大小与 token 白名单，拒绝 `__proto__` 等危险键，禁止 eval、任意 CSS 代码和远程 URL。CSS 导出仅产生经过类型校验的变量赋值。

## 8. 验收

同页两种主题、嵌套反向明暗、打开弹层后换肤、卸载 Provider、系统明暗变化、未知 token、清除覆写、SSR 初始主题、RTL、reduced-motion 均有测试。主题变化前后选中值、输入、滚动位置和焦点不得无故丢失。

## 9. 起始公开 token schema（设计提案）

以下是 M0 必须先落地的公开键与候选默认值，不是用户已经确认的品牌色，也不代表配色已经通过实际组件对比度测试。更换品牌时通过这些键和 component overrides 完成，不逐文件修改 CSS。

| 公开键 | light 候选值 | dark 候选值 | 类型/用途 |
|---|---|---|---|
| color.action.bg | #2563eb | #60a5fa | 主操作背景 |
| color.action.fg | #ffffff | #0b1220 | 主操作前景 |
| color.action.hover | #1d4ed8 | #93c5fd | hover 背景 |
| color.action.pressed | #1e40af | #3b82f6 | 按下背景，须另验前景对比 |
| color.action.soft | #eff6ff | #172554 | 轻背景 |
| color.text.primary | #111827 | #f9fafb | 主要文字 |
| color.text.secondary | #4b5563 | #d1d5db | 次要文字 |
| color.text.muted | #6b7280 | #9ca3af | 辅助文字 |
| color.text.disabled | #9ca3af | #6b7280 | 禁用文字，不能用于普通正文 |
| color.link | #1d4ed8 | #93c5fd | 链接文字 |
| color.border.default | #d1d5db | #4b5563 | 普通边界 |
| color.border.strong | #6b7280 | #9ca3af | 必须辨识的控件边界候选 |
| color.focus | #1d4ed8 | #93c5fd | 焦点轮廓 |
| color.success.bg | #15803d | #4ade80 | 成功实色背景 |
| color.success.fg | #ffffff | #0b1220 | 成功实色前景 |
| color.success.soft | #f0fdf4 | #052e16 | 成功轻背景 |
| color.warning.bg | #854d0e | #facc15 | 警告实色背景 |
| color.warning.fg | #ffffff | #0b1220 | 警告实色前景 |
| color.warning.soft | #fefce8 | #422006 | 警告轻背景 |
| color.danger.bg | #dc2626 | #f87171 | 错误/危险实色背景 |
| color.danger.fg | #ffffff | #0b1220 | 错误/危险实色前景 |
| color.danger.soft | #fef2f2 | #450a0a | 错误轻背景 |
| surface.page | #ffffff | #0b1220 | 应用内容表面 |
| surface.panel | #ffffff | #111827 | 面板/弹层 |
| surface.muted | #f3f4f6 | #1f2937 | 次要表面 |
| surface.hover | #f9fafb | #374151 | 中性 hover 表面 |
| surface.disabled | #f3f4f6 | #1f2937 | 禁用表面 |
| surface.overlay | rgb(0 0 0 / 0.45) | rgb(0 0 0 / 0.60) | 模态遮罩 |
| font.family | system-ui, sans-serif | 同 light | 字体族，不内置远程字体 |
| font.familyMono | ui-monospace, monospace | 同 light | 代码字体 |
| font.size.sm / md / lg | 14px / 16px / 18px | 同 light | 正文字号 |
| font.size.headingSm / headingMd / headingLg | 20px / 24px / 30px | 同 light | 标题外观，与语义级别分离 |
| font.weight.normal / medium / bold | 400 / 500 / 700 | 同 light | 字重 |
| font.lineHeight.body / heading | 1.5 / 1.25 | 同 light | 无单位行高 |
| radius.none / sm / md / lg / xl / pill | 0 / 4px / 8px / 12px / 16px / 9999px | 同 light | 公开布局别名 |
| border.width | 1px | 同 light | 边框宽度 |
| focus.width / offset | 2px / 2px | 同 light | 焦点几何 |
| control.height.sm / md / lg | 32px / 40px / 48px | 同 light | 视觉高度，触控区域另计 |
| motion.duration.fast / normal / slow | 120ms / 180ms / 240ms | 同 light | 支持 reduced/none |
| motion.easing.standard | cubic-bezier(0.2,0,0,1) | 同 light | 缓动 |
| shadow.sm | 0 1px 3px rgb(0 0 0 / 0.12) | 0 1px 3px rgb(0 0 0 / 0.32) | 小阴影 |
| shadow.md | 0 8px 24px rgb(0 0 0 / 0.14) | 0 8px 24px rgb(0 0 0 / 0.40) | 面板阴影 |
| zIndex.sticky / popover / modal / notification | 10 / 1000 / 1100 / 1300 | 同 light | 层级起点，嵌套栈另计算 |

上表斜线合并行在真实 schema 中展开为独立键。例如 `font.size.sm`、`font.size.md`、`font.size.lg`；不把整段斜线字符串当一个 key。颜色派生到不同 variant 后逐一验证，不能假定实色前景可直接放在 soft 背景上。

间距别名固定映射：`space.0=0`、`space.half=2px`、`space.1=4px`、`space.2=8px`、`space.3=12px`、`space.4=16px`、`space.5=20px`、`space.6=24px`、`space.8=32px`、`space.10=40px`、`space.12=48px`、`space.16=64px`。Grid/Flex 的 gap=4 表示 space.4，不是 4px；直接长度必须带单位。

## 10. 组件 token 的名称映射与注册门禁

单组件规格使用 CSS 后缀，例如 Button 的 primary-bg。配置对象使用 camelCase：`theme.components.button.primaryBg`；其 CSS 为 `--dui-button-primary-bg`。本文件的 token 语义路径 `button.primaryBg` 是文档标识，不是让用户同时维护三份值。radius 对应 `theme.components.button.radius` 与 `--dui-button-radius`。

所有组件 token 必须登记：组件/属性、CSS变量、类型、默认字面值或语义引用、适用variant/size、是否可继承、废弃版本。清单由一个源 schema 生成 TS、JSON、CSS 与文档；不能根据字符串运行时随意拼成 CSS 声明。P0 先登记 P0，不将未实现 P2 键冒充有效主题能力。

当用户覆写字号、尺寸或间距为无效单位/非有限数值时给出明确错误；不能输出 NaNpx。颜色值先由白名单类型解析和浏览器支持策略验证，非颜色的 URL、CSS声明片段或远程资源一律拒绝。shadow 等复合值用对应受限语法校验，而不是接受任意整段 CSS。

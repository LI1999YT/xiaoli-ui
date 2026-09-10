# C01｜ConfigProvider · 全局配置

> 优先级：**P0** · 分类：基础设施 · 当前状态：**待实施**。这是开发与验收规格，不表示组件已实现、已测试或已发布。

## 1. 用途与范围

为一棵组件树提供主题、语言、方向、密度、尺寸和浮层归属，支持多个实例互相隔离。

**本期不包含：**不全局修改 documentElement；不自动读写 localStorage；不导出跨应用全局可变配置。

## 2. 公共 API

属性表为目标合同。`value/checked` 在 Vue 中按[跨框架契约](../docs/04-跨框架API与类型契约.md)映射；“默认 false/null/[]”描述非受控初始值，受控 prop 的存在判定仍以 undefined 为准。公共 class、style、部位注入和 unstyled 见[通用规格](../docs/26-组件通用规格.md)，不把无关属性强塞到本组件。

| 属性 / 方法输入 | 类型或可选值 | 默认 / 要求 | 语义与约束 |
|---|---|---|---|
| `theme` | `ThemeConfig` | 默认 light 预设 | 见主题系统，id 必须稳定 |
| `locale` | `LocaleConfig` | zh-CN | 外层继承后局部覆盖 |
| `dir` | `ltr / rtl` | 外层或 ltr | 使用真实 dir 属性 |
| `density` | `compact / comfortable` | theme 或 comfortable | 显式 prop 优先于 theme |
| `size` | `sm / md / lg` | md | 仅影响有尺寸语义的组件 |
| `unstyled` | `boolean` | false | 外层继承，实例可覆盖 |
| `portalContainer` | `HTMLElement / 延迟获取函数` | mount 后 ownerDocument.body | SSR 不执行 DOM 获取 |
| `initialMode` | `light / dark` | light | system 模式 SSR 与首个 hydration 共用，之后才响应系统 |
| `portalClassName` | `string` | 未设置 | 同步到所属 portal host 的自定义 CSS 类 |
| `motion` | `system / normal / reduced / none` | theme 或 system | 实例显式配置覆盖 theme，低动效策略见视觉规范 |

## 3. 事件、实例与时序

不自动发业务事件；主题解析失败开发告警并回退到最后有效配置，不清空整个应用。

模型更新不因父 prop 回写而重复通知；可取消默认行为与清理边界遵循通用契约。对确实不存在模型的纯展示组件，不添加无意义的 change 事件。

## 4. 内容扩展与公开部位

default；root；portalHost。

React 使用 children/renderX，Vue 使用 default/具名 scoped slot；`data-part` 与 classNames/styles 的键一致。需要转交 ref、aria、事件的 trigger/field slot 必须定义强类型上下文并给出可运行示例；不要依靠选择私有 nth-child 做定制。

## 5. 行为与状态

按既定优先级合并配置；切换后删除旧主题残留变量；已打开浮层同步；卸载释放自己创建的 host；不影响其他 Provider。根包装为合法 div，文档提醒不要把它放成 table/tbody 的非法直接子元素。

## 6. PC、移动端与可访问性

**移动端：**密度不等于设备类型；触屏命中区仍由组件保证；安全区由 SafeArea 或浮层处理。

**键盘与可访问性：**Provider 不增加无意义 role/tabindex；dir 与主题变化不重置焦点。

遵循 [响应式规范](../docs/08-PC移动端响应式规范.md) 与 [无障碍规范](../docs/09-无障碍与键盘交互.md)。手势或 hover 如适用，必须有键盘/点击替代；不通过裁掉内容伪装兼容小屏。

## 7. 主题与样式合同

继承完整的公开语义与布局 token；Provider 不增加一组重复的视觉 token。

这些为拟定的组件级 token；由 theme schema 生成名称、类型、fallback 与双框架类型声明。实现时为每个键提供默认值/语义引用，不临时硬编码一份 React 配色和另一份 Vue 配色。light/dark、局部主题、RTL、低动效及 unstyled 必须保持信息可辨；有浮层的组件同时验证 portal 内主题。

## 8. 专项验收用例

以下专项用例必须形成命名测试或人工测试记录；不能用一个 snapshot 代替整表。

| 测试 ID | 场景 | 结果要求 |
|---|---|---|
| `C01-EDGE-01` | 两主题并存且互不串色 | React / Vue 分别记录结果与证据 |
| `C01-EDGE-02` | 嵌套 Provider 覆盖后恢复 | React / Vue 分别记录结果与证据 |
| `C01-EDGE-03` | 打开 Dialog 时改主题 | React / Vue 分别记录结果与证据 |
| `C01-EDGE-04` | SSR 两请求配置不污染 | React / Vue 分别记录结果与证据 |
| `C01-EDGE-05` | 卸载时 host 引用释放 | React / Vue 分别记录结果与证据 |

共用基线另覆盖 `C01-BASE-*`、适用的 `CTRL-*`、`A11Y-*`、`MOBILE-*`、`THEME-*`、`SSR-*`。不适用项写明原因；未执行项写“未运行”，不能默认通过。两框架接受同一行为案例，但各自运行并保存证据。

## 9. 导出、依赖与交付

**命名导出：**`ConfigProvider` 与对应公共类型；必要子组件的命名在实施 API 审查时补全并同步两框架。

**目标子路径：**`@your-scope/ui-react/config-provider`、`@your-scope/ui-vue/config-provider`。样式为同名 `/style.css` 子路径，配合框架包 `base.css`，或使用全量 `style.css`。纯逻辑入口的 CSS 可以为空但需明确产物策略，不能暴露指向不存在文件的 exports。只有完成验收的模块才进入稳定导出清单。

**复用参考：**通用 tokens / 样式基础；无指定公共组件依赖。

交付应包含双框架实现、必要共享核心、同源 CSS/token、类型测试、双框架 stories、用户用法与边界说明、上述专项测试、changeset 及 tarball 消费验证。阶段状态记录在 [TASKS](../tracking/TASKS.md)，而不是直接改本规格为“已经发布”。

## 10. Provider 与实例生命周期

始终输出一个稳定的 div 根节点，业务布局要考虑该包装；不依赖不稳定的 display:contents 隐藏结构。每个 Provider 管理所属 portal host，嵌套时配置继承、宿主可独立，卸载时只清理自己的资源。没有显式 Provider 时组件按默认上下文可用；反馈服务 useToast/useNotification 必须在 Provider 内获取，缺少 Provider 在开发阶段明确报错。

`theme.mode=system` 的服务端输出使用 `initialMode`；`initialMode` 是初次解析输入而不是持续锁定当前主题的受控值。客户端订阅系统变化前不改变首次 DOM。显式 `dir/density/motion` 优先于 theme；主题切换不重建子组件。

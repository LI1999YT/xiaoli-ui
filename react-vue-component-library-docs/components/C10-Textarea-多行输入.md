# C10｜Textarea · 多行输入

> 优先级：**P0** · 分类：表单 · 当前状态：**待实施**。这是开发与验收规格，不表示组件已实现、已测试或已发布。

## 1. 用途与范围

原生多行编辑、可选字数与自动高度。

**本期不包含：**

## 2. 公共 API

属性表为目标合同。`value/checked` 在 Vue 中按[跨框架契约](../docs/04-跨框架API与类型契约.md)映射；“默认 false/null/[]”描述非受控初始值，受控 prop 的存在判定仍以 undefined 为准。公共 class、style、部位注入和 unstyled 见[通用规格](../docs/26-组件通用规格.md)，不把无关属性强塞到本组件。

| 属性 / 方法输入 | 类型或可选值 | 默认 / 要求 | 语义与约束 |
|---|---|---|---|
| `value / defaultValue` | `string` | 空字符串 | Vue modelValue |
| `rows` | `positive integer` | 3 | 初始行数 |
| `autoSize` | `false / {minRows,maxRows}` | false | 上下限 |
| `resize` | `none / vertical / both` | vertical | autoSize 时默认 none |
| `showCount` | `boolean` | false | 默认原生 UTF-16 长度语义 |
| `maxLength` | `integer` | 未设置 | 与原生一致 |
| `readOnly / disabled / invalid` | `boolean` | false | 对齐 Input |

## 3. 事件、实例与时序

onValueChange / update:modelValue；focus/blur 原生事件；实例 element/focus/blur/select。

模型更新不因父 prop 回写而重复通知；可取消默认行为与清理边界遵循通用契约。对确实不存在模型的纯展示组件，不添加无意义的 change 事件。

## 4. 内容扩展与公开部位

count；root,textarea,count。

React 使用 children/renderX，Vue 使用 default/具名 scoped slot；`data-part` 与 classNames/styles 的键一致。需要转交 ref、aria、事件的 trigger/field slot 必须定义强类型上下文并给出可运行示例；不要依靠选择私有 nth-child 做定制。

## 5. 行为与状态

测量在 mount/effect 后执行；先读后写、避免尺寸循环；maxRows 后内部滚动；自动高度与外部 resize 规则明确。原生 maxLength/count 默认按 UTF-16 口径；emoji 字素计数只作为未来显式扩展。

## 6. PC、移动端与可访问性

**移动端：**软键盘弹出后保持插入点可见；不能禁用系统文本选择。

**键盘与可访问性：**label/error 与 Input 一致；计数不每键 assertive 朗读。

遵循 [响应式规范](../docs/08-PC移动端响应式规范.md) 与 [无障碍规范](../docs/09-无障碍与键盘交互.md)。手势或 hover 如适用，必须有键盘/点击替代；不通过裁掉内容伪装兼容小屏。

## 7. 主题与样式合同

`--dui-textarea-min-height`、`--dui-textarea-padding`、`--dui-textarea-radius`、`--dui-textarea-border-color`、`--dui-textarea-count-color`。

这些为拟定的组件级 token；由 theme schema 生成名称、类型、fallback 与双框架类型声明。实现时为每个键提供默认值/语义引用，不临时硬编码一份 React 配色和另一份 Vue 配色。light/dark、局部主题、RTL、低动效及 unstyled 必须保持信息可辨；有浮层的组件同时验证 portal 内主题。

## 8. 专项验收用例

以下专项用例必须形成命名测试或人工测试记录；不能用一个 snapshot 代替整表。

| 测试 ID | 场景 | 结果要求 |
|---|---|---|
| `C10-EDGE-01` | 空值与多行粘贴 | React / Vue 分别记录结果与证据 |
| `C10-EDGE-02` | 中文/emoji 计数 | React / Vue 分别记录结果与证据 |
| `C10-EDGE-03` | min/maxRows | React / Vue 分别记录结果与证据 |
| `C10-EDGE-04` | 容器变宽后高度 | React / Vue 分别记录结果与证据 |
| `C10-EDGE-05` | SSR 无测量 | React / Vue 分别记录结果与证据 |
| `C10-EDGE-06` | 卸载 observer 清理 | React / Vue 分别记录结果与证据 |

共用基线另覆盖 `C10-BASE-*`、适用的 `CTRL-*`、`A11Y-*`、`MOBILE-*`、`THEME-*`、`SSR-*`。不适用项写明原因；未执行项写“未运行”，不能默认通过。两框架接受同一行为案例，但各自运行并保存证据。

## 9. 导出、依赖与交付

**命名导出：**`Textarea` 与对应公共类型；必要子组件的命名在实施 API 审查时补全并同步两框架。

**目标子路径：**`@your-scope/ui-react/textarea`、`@your-scope/ui-vue/textarea`。样式为同名 `/style.css` 子路径，配合框架包 `base.css`，或使用全量 `style.css`。纯逻辑入口的 CSS 可以为空但需明确产物策略，不能暴露指向不存在文件的 exports。只有完成验收的模块才进入稳定导出清单。

**复用参考：**[Input](C09-Input-单行输入.md)。这是复用与测试参考，不要求每项都形成强制运行时 import；严格按实际代码生成 CSS 依赖图。

交付应包含双框架实现、必要共享核心、同源 CSS/token、类型测试、双框架 stories、用户用法与边界说明、上述专项测试、changeset 及 tarball 消费验证。阶段状态记录在 [TASKS](../tracking/TASKS.md)，而不是直接改本规格为“已经发布”。


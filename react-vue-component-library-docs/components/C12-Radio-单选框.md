# C12｜Radio · 单选框

> 优先级：**P0** · 分类：表单 · 当前状态：**待实施**。这是开发与验收规格，不表示组件已实现、已测试或已发布。

## 1. 用途与范围

RadioGroup 内排他选择，保留原生 radio name 与键盘体验。

**本期不包含：**

## 2. 公共 API

属性表为目标合同。`value/checked` 在 Vue 中按[跨框架契约](../docs/04-跨框架API与类型契约.md)映射；“默认 false/null/[]”描述非受控初始值，受控 prop 的存在判定仍以 undefined 为准。公共 class、style、部位注入和 unstyled 见[通用规格](../docs/26-组件通用规格.md)，不把无关属性强塞到本组件。

| 属性 / 方法输入 | 类型或可选值 | 默认 / 要求 | 语义与约束 |
|---|---|---|---|
| `RadioGroup.value/defaultValue` | `K / null` | null | Vue modelValue |
| `options` | `{value,label,disabled?}[]` | [] | 或显式 Radio 子项 |
| `orientation` | `horizontal / vertical` | horizontal | 排列 |
| `disabled` | `boolean` | false | 组级禁用 |
| `name` | `string` | 稳定生成值 | 同组原生 name 一致 |
| `Radio.value` | `K` | 必填 | 唯一 key |

## 3. 事件、实例与时序

Group onValueChange / update:modelValue；选择已选项不重复通知；实例组 focus()。

模型更新不因父 prop 回写而重复通知；可取消默认行为与清理边界遵循通用契约。对确实不存在模型的纯展示组件，不添加无意义的 change 事件。

## 4. 内容扩展与公开部位

default；option；root,item,input,control,label。

React 使用 children/renderX，Vue 使用 default/具名 scoped slot；`data-part` 与 classNames/styles 的键一致。需要转交 ref、aria、事件的 trigger/field slot 必须定义强类型上下文并给出可运行示例；不要依靠选择私有 nth-child 做定制。

## 5. 行为与状态

一组最多一个；受控空值允许无选中；已选选项删除时不偷偷选择第一项，只通知/告警由明确策略处理。混合 options 与 children 模式开发告警。

## 6. PC、移动端与可访问性

**移动端：**默认允许纵排；长标签可换行且整行命中。

**键盘与可访问性：**fieldset/legend 或 radiogroup 名称；方向键移动选择，禁用项跳过，Tab 合理进入组。

遵循 [响应式规范](../docs/08-PC移动端响应式规范.md) 与 [无障碍规范](../docs/09-无障碍与键盘交互.md)。手势或 hover 如适用，必须有键盘/点击替代；不通过裁掉内容伪装兼容小屏。

## 7. 主题与样式合同

`--dui-radio-control-size`、`--dui-radio-checked-bg`、`--dui-radio-border-color`、`--dui-radio-gap`。

这些为拟定的组件级 token；由 theme schema 生成名称、类型、fallback 与双框架类型声明。实现时为每个键提供默认值/语义引用，不临时硬编码一份 React 配色和另一份 Vue 配色。light/dark、局部主题、RTL、低动效及 unstyled 必须保持信息可辨；有浮层的组件同时验证 portal 内主题。

## 8. 专项验收用例

以下专项用例必须形成命名测试或人工测试记录；不能用一个 snapshot 代替整表。

| 测试 ID | 场景 | 结果要求 |
|---|---|---|
| `C12-EDGE-01` | 排他性 | React / Vue 分别记录结果与证据 |
| `C12-EDGE-02` | 0 key | React / Vue 分别记录结果与证据 |
| `C12-EDGE-03` | 组键盘 | React / Vue 分别记录结果与证据 |
| `C12-EDGE-04` | 不同组 name 不冲突 | React / Vue 分别记录结果与证据 |
| `C12-EDGE-05` | 选中项动态删除 | React / Vue 分别记录结果与证据 |
| `C12-EDGE-06` | SSR ID 一致 | React / Vue 分别记录结果与证据 |

共用基线另覆盖 `C12-BASE-*`、适用的 `CTRL-*`、`A11Y-*`、`MOBILE-*`、`THEME-*`、`SSR-*`。不适用项写明原因；未执行项写“未运行”，不能默认通过。两框架接受同一行为案例，但各自运行并保存证据。

## 9. 导出、依赖与交付

**命名导出：**`Radio`、`RadioGroup` 与对应类型。

**目标子路径：**`@your-scope/ui-react/radio`、`@your-scope/ui-vue/radio`。样式为同名 `/style.css` 子路径，配合框架包 `base.css`，或使用全量 `style.css`。纯逻辑入口的 CSS 可以为空但需明确产物策略，不能暴露指向不存在文件的 exports。只有完成验收的模块才进入稳定导出清单。

**复用参考：**[Checkbox](C11-Checkbox-复选框.md)。这是复用与测试参考，不要求每项都形成强制运行时 import；严格按实际代码生成 CSS 依赖图。

交付应包含双框架实现、必要共享核心、同源 CSS/token、类型测试、双框架 stories、用户用法与边界说明、上述专项测试、changeset 及 tarball 消费验证。阶段状态记录在 [TASKS](../tracking/TASKS.md)，而不是直接改本规格为“已经发布”。


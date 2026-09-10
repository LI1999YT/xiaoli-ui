# C14｜Select · 选择器

> 优先级：**P0** · 分类：表单 · 当前状态：**待实施**。这是开发与验收规格，不表示组件已实现、已测试或已发布。

## 1. 用途与范围

从已知选项中单选/多选，可搜索；移动可用同值模型切换弹层。

**本期不包含：**v1 不支持任意创建标签、分组异步树、默认虚拟化；1000 选项性能另测。

## 2. 公共 API

属性表为目标合同。`value/checked` 在 Vue 中按[跨框架契约](../docs/04-跨框架API与类型契约.md)映射；“默认 false/null/[]”描述非受控初始值，受控 prop 的存在判定仍以 undefined 为准。公共 class、style、部位注入和 unstyled 见[通用规格](../docs/26-组件通用规格.md)，不把无关属性强塞到本组件。

| 属性 / 方法输入 | 类型或可选值 | 默认 / 要求 | 语义与约束 |
|---|---|---|---|
| `value/defaultValue` | `K/null 或 K[]` | null / [] | 由 multiple 判别，Vue modelValue |
| `options` | `Option<K>[]` | [] | value 唯一，label 为搜索/读屏文本 |
| `multiple` | `boolean` | false | 挂载后不切换值模型 |
| `searchable` | `boolean` | false | 文本输入仅搜索，不允许任意新值 |
| `searchValue/defaultSearchValue` | `string` | 非受控空 | Vue v-model:search-value |
| `open/defaultOpen` | `boolean` | false | Vue v-model:open |
| `clearable / disabled / loading` | `boolean` | false | loading 与 empty 分开 |
| `presentation` | `auto / popover / sheet` | auto | 同一值与选项模型 |
| `error` | `string / 未设置` | 未设置 | 与 loading、empty 分开，不把失败显示为无结果 |

## 3. 事件、实例与时序

onValueChange / update:modelValue；onSearchValueChange / update:searchValue；onOpenChange / update:open；onClear/@clear。选择、搜索、打开各司其职。实例 focus/blur/open/close。

模型更新不因父 prop 回写而重复通知；可取消默认行为与清理边界遵循通用契约。对确实不存在模型的纯展示组件，不添加无意义的 change 事件。

## 4. 内容扩展与公开部位

option({option,selected,active})；value；empty；loading；footer；root,trigger,input,list,option,tag,clearButton。

React 使用 children/renderX，Vue 使用 default/具名 scoped slot；`data-part` 与 classNames/styles 的键一致。需要转交 ref、aria、事件的 trigger/field slot 必须定义强类型上下文并给出可运行示例；不要依靠选择私有 nth-child 做定制。

## 5. 行为与状态

高亮候选与已提交选择分离；Escape 不提交当前高亮；多选不因一次选择关闭；空数据/加载/错误有独立文案；选项删除保留受控值并显示回退标签，不悄悄改业务值。远程搜索只通知 query，结果过期由外部 requestId 处理。

## 6. PC、移动端与可访问性

**移动端：**sheet 模式焦点/滚动继承浮层规范；一行选项命中区足够大，多选 tags 过多不挤掉清空入口。

**键盘与可访问性：**参考 combobox/listbox 模式；aria-expanded/controls/activedescendant 正确；候选键盘导航不破坏 IME 和输入编辑；多选模式须独立验证读屏。

遵循 [响应式规范](../docs/08-PC移动端响应式规范.md) 与 [无障碍规范](../docs/09-无障碍与键盘交互.md)。手势或 hover 如适用，必须有键盘/点击替代；不通过裁掉内容伪装兼容小屏。

## 7. 主题与样式合同

`--dui-select-height`、`--dui-select-radius`、`--dui-select-option-height`、`--dui-select-option-active-bg`、`--dui-select-option-selected-bg`、`--dui-select-list-max-height`、`--dui-select-tag-gap`。

这些为拟定的组件级 token；由 theme schema 生成名称、类型、fallback 与双框架类型声明。实现时为每个键提供默认值/语义引用，不临时硬编码一份 React 配色和另一份 Vue 配色。light/dark、局部主题、RTL、低动效及 unstyled 必须保持信息可辨；有浮层的组件同时验证 portal 内主题。

## 8. 专项验收用例

以下专项用例必须形成命名测试或人工测试记录；不能用一个 snapshot 代替整表。

| 测试 ID | 场景 | 结果要求 |
|---|---|---|
| `C14-EDGE-01` | 受控/非受控单多选 | React / Vue 分别记录结果与证据 |
| `C14-EDGE-02` | 0 与空字符串 key | React / Vue 分别记录结果与证据 |
| `C14-EDGE-03` | 快速搜索旧响应 | React / Vue 分别记录结果与证据 |
| `C14-EDGE-04` | IME Enter 不选项 | React / Vue 分别记录结果与证据 |
| `C14-EDGE-05` | Escape 不提交 | React / Vue 分别记录结果与证据 |
| `C14-EDGE-06` | 已选值缺失 | React / Vue 分别记录结果与证据 |
| `C14-EDGE-07` | Dialog 内再开 Select | React / Vue 分别记录结果与证据 |
| `C14-EDGE-08` | 移动 sheet | React / Vue 分别记录结果与证据 |

共用基线另覆盖 `C14-BASE-*`、适用的 `CTRL-*`、`A11Y-*`、`MOBILE-*`、`THEME-*`、`SSR-*`。不适用项写明原因；未执行项写“未运行”，不能默认通过。两框架接受同一行为案例，但各自运行并保存证据。

## 9. 导出、依赖与交付

**命名导出：**`Select` 与对应公共类型；必要子组件的命名在实施 API 审查时补全并同步两框架。

**目标子路径：**`@your-scope/ui-react/select`、`@your-scope/ui-vue/select`。样式为同名 `/style.css` 子路径，配合框架包 `base.css`，或使用全量 `style.css`。纯逻辑入口的 CSS 可以为空但需明确产物策略，不能暴露指向不存在文件的 exports。只有完成验收的模块才进入稳定导出清单。

**复用参考：**[Input](C09-Input-单行输入.md)、[Popover](C18-Popover-弹出面板.md)、[Dialog](C16-Dialog-对话框.md)。这是复用与测试参考，不要求每项都形成强制运行时 import；严格按实际代码生成 CSS 依赖图。

交付应包含双框架实现、必要共享核心、同源 CSS/token、类型测试、双框架 stories、用户用法与边界说明、上述专项测试、changeset 及 tarball 消费验证。阶段状态记录在 [TASKS](../tracking/TASKS.md)，而不是直接改本规格为“已经发布”。

## 10. 选项与详情类型

`Option<K>` 见跨框架契约。自定义视觉内容通过 option slot/renderOption；label 必须仍有纯文本，不能只保存 ReactNode/VNode 给跨框架搜索。

多选值数组保持选择顺序，无重复 key；清空输出 []。单选清空输出 null。选中不可用项的历史值可显示但不能再通过用户动作新选入。原生表单序列化多选采用重复 name entries，而不是未经说明拼接逗号。

参考：[W3C Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)。

P0 的 sheet 展示基于 internal-dom 与 Dialog 的共享浮层基础实现，不依赖尚未交付的 P1 公共 BottomSheet。搜索词与已选值独立；错误时保留可见历史值，并提供外部重试入口。

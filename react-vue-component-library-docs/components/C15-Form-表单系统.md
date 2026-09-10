# C15｜Form · 表单系统

> 优先级：**P0** · 分类：表单 · 当前状态：**待实施**。这是开发与验收规格，不表示组件已实现、已测试或已发布。

## 1. 用途与范围

统一字段注册、label/error 关联、验证、提交与重置，不内置业务请求。

**本期不包含：**首发不做完整 JSON Schema 生成器、任意循环依赖或复杂 FieldArray 拖拽。

## 2. 公共 API

属性表为目标合同。`value/checked` 在 Vue 中按[跨框架契约](../docs/04-跨框架API与类型契约.md)映射；“默认 false/null/[]”描述非受控初始值，受控 prop 的存在判定仍以 undefined 为准。公共 class、style、部位注入和 unstyled 见[通用规格](../docs/26-组件通用规格.md)，不把无关属性强塞到本组件。

| 属性 / 方法输入 | 类型或可选值 | 默认 / 要求 | 语义与约束 |
|---|---|---|---|
| `values/defaultValues` | `generic object T` | 必须提供初始结构 | Vue v-model:values |
| `validateTrigger` | `blur / change / submit` | blur | 初次提交全量验证 |
| `validators` | `readonly FieldRule<T>[]` | [] | 每项 {path,validators}，路径为片段数组，支持 AbortSignal |
| `React onSubmit / Vue submitHandler` | `(values,context)=>void/Promise` | 可选 | 可等待的唯一业务提交执行器 |
| `preserve` | `boolean` | true | 动态字段卸载保留值 |
| `disabled` | `boolean` | false | 向注册控件传递禁用，显式规则一致 |
| `FormField.name` | `readonly (string/number)[]` | 必填 | 路径片段，不用点号猜测 |

## 3. 事件、实例与时序

React onValuesChange/onSubmit/onSubmitError/onReset；Vue update:values/@submit/@submit-error/@reset。实例 validate、validateField、setFieldValue、setFieldError、reset、submit、focusField。

模型更新不因父 prop 回写而重复通知；可取消默认行为与清理边界遵循通用契约。对确实不存在模型的纯展示组件，不添加无意义的 change 事件。

## 4. 内容扩展与公开部位

default；FormField render({field,state}) / scoped slot；FormLabel/Control/Description/Error/Actions；root,field,label,control,description,error,actions。

React 使用 children/renderX，Vue 使用 default/具名 scoped slot；`data-part` 与 classNames/styles 的键一致。需要转交 ref、aria、事件的 trigger/field slot 必须定义强类型上下文并给出可运行示例；不要依靠选择私有 nth-child 做定制。

## 5. 行为与状态

字段 touched/dirty/errors/pending；验证请求按版本生效；重复提交防护；reset 清理请求和错误；失效字段不能收到旧回调；初始值快照明确。最小 API 不复制大型表单引擎全部能力。

## 6. PC、移动端与可访问性

**移动端：**单列布局优先；错误不被键盘遮挡；提交按钮不与安全区/TabBar 重叠。

**键盘与可访问性：**真实 form；标签和错误绑定实际控件；提交错误摘要或首错误可聚焦；必填不只有星号。

遵循 [响应式规范](../docs/08-PC移动端响应式规范.md) 与 [无障碍规范](../docs/09-无障碍与键盘交互.md)。手势或 hover 如适用，必须有键盘/点击替代；不通过裁掉内容伪装兼容小屏。

## 7. 主题与样式合同

`--dui-form-field-gap`、`--dui-form-label-color`、`--dui-form-label-font-size`、`--dui-form-error-color`、`--dui-form-error-gap`、`--dui-form-actions-gap`。

这些为拟定的组件级 token；由 theme schema 生成名称、类型、fallback 与双框架类型声明。实现时为每个键提供默认值/语义引用，不临时硬编码一份 React 配色和另一份 Vue 配色。light/dark、局部主题、RTL、低动效及 unstyled 必须保持信息可辨；有浮层的组件同时验证 portal 内主题。

## 8. 专项验收用例

以下专项用例必须形成命名测试或人工测试记录；不能用一个 snapshot 代替整表。

| 测试 ID | 场景 | 结果要求 |
|---|---|---|
| `C15-EDGE-01` | 异步校验竞态 | React / Vue 分别记录结果与证据 |
| `C15-EDGE-02` | 提交中重复点击 | React / Vue 分别记录结果与证据 |
| `C15-EDGE-03` | reset 与父受控值 | React / Vue 分别记录结果与证据 |
| `C15-EDGE-04` | 字段卸载 | React / Vue 分别记录结果与证据 |
| `C15-EDGE-05` | 数组路径 | React / Vue 分别记录结果与证据 |
| `C15-EDGE-06` | disabled 原生提交 | React / Vue 分别记录结果与证据 |
| `C15-EDGE-07` | IME 输入不提前验证 | React / Vue 分别记录结果与证据 |
| `C15-EDGE-08` | 两框架等价 | React / Vue 分别记录结果与证据 |

共用基线另覆盖 `C15-BASE-*`、适用的 `CTRL-*`、`A11Y-*`、`MOBILE-*`、`THEME-*`、`SSR-*`。不适用项写明原因；未执行项写“未运行”，不能默认通过。两框架接受同一行为案例，但各自运行并保存证据。

## 9. 导出、依赖与交付

**命名导出：**`Form`、`FormField`、`FormLabel`、`FormControl`、`FormDescription`、`FormError`、`FormActions` 与对应类型。

**目标子路径：**`@your-scope/ui-react/form`、`@your-scope/ui-vue/form`。样式为同名 `/style.css` 子路径，配合框架包 `base.css`，或使用全量 `style.css`。纯逻辑入口的 CSS 可以为空但需明确产物策略，不能暴露指向不存在文件的 exports。只有完成验收的模块才进入稳定导出清单。

**复用参考：**[Input](C09-Input-单行输入.md)、[Checkbox](C11-Checkbox-复选框.md)。这是复用与测试参考，不要求每项都形成强制运行时 import；严格按实际代码生成 CSS 依赖图。

交付应包含双框架实现、必要共享核心、同源 CSS/token、类型测试、双框架 stories、用户用法与边界说明、上述专项测试、changeset 及 tarball 消费验证。阶段状态记录在 [TASKS](../tracking/TASKS.md)，而不是直接改本规格为“已经发布”。

## 10. 方法结果与提交接入

`validate(): Promise<{valid:boolean;errors:FieldError[]}>`；`submit(): Promise<{status:'success'|'invalid'|'error'|'aborted'}>`，业务异常通过 onSubmitError 和返回值表达；不要无条件吞异常。

Vue 事件不能依赖 emit 返回 Promise 来驱动 submitting。提供 `submitHandler?: (values,ctx)=>Promise<void>|void` 承载可等待业务提交；`@submit` 仅成功验证后的观察通知。React 对应可等待 onSubmit。字段验证参考 docs/11，防止同一业务 handler 被调用两次。

`FieldRule<T> = {path: readonly (string|number)[]; validators: readonly Validator<unknown,T>[]}` 为存储结构示意；对外通过类型化字段 helper 保留该路径值的类型，不用任意对象键把数组路径隐式转成逗号字符串。FormField 注册的同字段规则追加顺序必须确定，重复注册开发告警。

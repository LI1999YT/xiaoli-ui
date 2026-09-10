# 04｜跨框架 API 与类型契约

## 1. 统一语义，不强迫统一语法

| 语义 | React | Vue |
|---|---|---|
| 文本/选择值 | `value`, `defaultValue`, `onValueChange` | `modelValue`, `defaultValue`, `update:modelValue` |
| 布尔选择 | `checked`, `defaultChecked`, `onCheckedChange` | `modelValue`, `defaultChecked`, `update:modelValue` |
| 打开状态 | `open`, `defaultOpen`, `onOpenChange` | `open`, `defaultOpen`, `update:open`，用 `v-model:open` |
| 页码 | `page`, `defaultPage`, `onPageChange` | `page`, `defaultPage`, `update:page` |
| 原生事件 | `onClick`, `onFocus`, `onBlur` | `@click`, `@focus`, `@blur` |
| 内容 | children / renderX 回调 | default / 具名 scoped slots |
| 根样式 | `className`, `style` | `class`, `style` |
| 命名部位样式 | `classNames`, `styles`, `slotProps` | 同名 props |
| 公开实例 | ref handle | `defineExpose` + template ref |

单组件规格中 `value` 是逻辑值名称，Vue 应映射为 `modelValue`；明确写出 open、page、expandedKeys 等命名模型的例外。选择态通知只用上表的 model 事件，不能再发送一个重复业务 change。需要最终提交时另设 `onValueCommit / @value-commit`。

Vue 模型事件可以携带 `(next, details)` 两个参数，v-model 使用第一个；手动监听 update 事件可以读取详情，但不能再次调用同一业务更新。模板事件可使用对应 kebab-case 写法，公开 TypeScript emits 键保持统一 camelCase。

## 2. 值与状态规则

`undefined` 表示未提供受控值；`null` 是允许清空的控件的合法空值；`false`、`0`、`''`、`[]` 均不能当成“未传”。挂载时固定受控模式；中途切换开发告警。受控模式仅通知下一值，不私自长期维护与 prop 冲突的真实值；非受控模式先更新内部值再通知。

Vue 的可选受控 Boolean prop 显式设置默认 `undefined`，避免 Boolean casting 把“未传”转换成 false。不要为了使用 defineModel 而丢失可选值、默认值或父子同步语义；必要时用显式 props/emits。

非受控 defaultValue/defaultChecked 只在初始化读取；reset 回到初始化快照。外部更新受控值不产生“用户修改”事件。一次用户动作最多通知一次；IME composition 不触发提前提交、选择或截断。

## 3. 公共类型（目标接口）

```ts
export type Size = 'sm' | 'md' | 'lg';
export type Density = 'compact' | 'comfortable';
export type ThemeMode = 'light' | 'dark' | 'system';
export type Direction = 'ltr' | 'rtl';
export type ValueKey = string | number;
export interface ChangeDetails {
  reason: 'input' | 'select' | 'clear' | 'keyboard' | 'reset' | 'remove';
  originalEvent?: Event; // 对外保存原生事件；React 从 nativeEvent 取值
}
export interface OpenChangeDetails {
  reason: 'trigger' | 'escape' | 'outside' | 'close-button' | 'select' | 'swipe';
  originalEvent?: Event;
}
export interface Option<K extends ValueKey = ValueKey> {
  value: K;
  label: string; // 搜索与读屏的纯文本标签
  disabled?: boolean;
  description?: string;
}
```

实际组件根据用途收窄 reason，不能广播不可能出现的原因。程序性 prop 更新不触发事件，因此无需伪造原生 Event。异常输入用开发告警或 Result 类型处理，不能悄悄改变业务数据。

## 4. 单选、多选与泛型

Select 的 `multiple: true` 对应 `K[]`，否则对应 `K | null`。使用 discriminated union，默认 `multiple=false`；不让调用者把标量和数组任意混用。Table 使用 `TableColumn<T>`、稳定 rowKey 与强类型 renderCell；Vue 泛型 SFC 的声明产物必须通过 vue-tsc 和消费端校验。

Form、Tree、Upload 的对象不应深拷贝丢失类型或引用身份。数组更新使用新数组；不修改用户传入的 options、columns 或 files。索引不是动态列表的稳定主键。

## 5. DOM 属性和组合

原生语义元素尽量保留。字段的 `id/name/required/disabled/aria-*` 传给真正的 input，而不是外层 div。多根组件在文档列出 attrs 落点。不得用 `$attrs` 或 `{...props}` 把业务属性直接泄漏到 DOM。

事件合并：先执行用户 handler；若 `defaultPrevented` 则取消可取消的默认动作；禁用检查、安全关闭和必要的清理不能被覆盖。ref 必须组合而非替换。aria-describedby 合并 ID 且去重；保证内部 label/control 关系不被普通 slotProps 意外破坏。

不在全部组件上开放任意 `as`。仅 Typography、Flex 等安全的展示组件提供有限语义标签集合。按钮触发与链接导航分开；Popover 等 trigger render/slot 返回元素时，必须转交必要事件、ref 和 aria 属性，并提供真实示例测试。

## 6. API 稳定性

公共 props、事件、实例方法、tokens、data-part、子路径导出和默认交互均属于版本契约。私有 DOM 层级、内部 class 和私有函数不属于公共契约。名称冲突先修规格；不要让两框架各自起一套名称。

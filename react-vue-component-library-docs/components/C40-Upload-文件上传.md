# C40｜Upload · 文件上传

> 优先级：**P1** · 分类：表单 · 当前状态：**待实施**。这是开发与验收规格，不表示组件已实现、已测试或已发布。

## 1. 用途与范围

文件选择、状态列表和可注入传输任务，不绑定任何云存储或后端。

**本期不包含：**文件安全、服务器鉴权、类型检查、病毒扫描与分片续传协议不由本组件自动保证。

## 2. 公共 API

属性表为目标合同。`value/checked` 在 Vue 中按[跨框架契约](../docs/04-跨框架API与类型契约.md)映射；“默认 false/null/[]”描述非受控初始值，受控 prop 的存在判定仍以 undefined 为准。公共 class、style、部位注入和 unstyled 见[通用规格](../docs/26-组件通用规格.md)，不把无关属性强塞到本组件。

| 属性 / 方法输入 | 类型或可选值 | 默认 / 要求 | 语义与约束 |
|---|---|---|---|
| `files/defaultFiles` | `UploadFile[]` | [] | Vue v-model:files |
| `multiple` | `boolean` | false | 原生选择 |
| `accept` | `string` | 未设置 | 仅客户端提示 |
| `maxCount` | `positive integer` | 未限制 | 超出不静默截断 |
| `maxSize` | `positive integer bytes` | 未限制 | 客户端提示 |
| `beforeUpload` | `(file)=>boolean/Promise<boolean>` | true | 允许异步校验 |
| `request` | `RequestAdapter` | 必须提供才传输 | signal/progress 支持 |
| `autoUpload` | `boolean` | true | false 只加入待上传 |
| `disabled` | `boolean` | false | 不接受新文件 |

## 3. 事件、实例与时序

onFilesChange/update:files；onProgress/@progress；onSuccess/@success；onError/@error；onRemove/@remove。实例 start(id?)、abort(id)、retry(id)、clear。

模型更新不因父 prop 回写而重复通知；可取消默认行为与清理边界遵循通用契约。对确实不存在模型的纯展示组件，不添加无意义的 change 事件。

## 4. 内容扩展与公开部位

trigger；dropzone；file({file,actions})；preview；root,input,dropzone,list,item,progress,actions。

React 使用 children/renderX，Vue 使用 default/具名 scoped slot；`data-part` 与 classNames/styles 的键一致。需要转交 ref、aria、事件的 trigger/field slot 必须定义强类型上下文并给出可运行示例；不要依靠选择私有 nth-child 做定制。

## 5. 行为与状态

稳定 file.id；idle/validating/queued/uploading/success/error/cancelled；并发初始上限3；删除中止请求且旧结果不恢复已删项；重试只重试目标文件；重新选择同一文件可触发；ObjectURL 正确释放。

## 6. PC、移动端与可访问性

**移动端：**使用原生文件选择；不默认摄像头权限；预览不下载巨图；文件名换行，删除/重试可触达。

**键盘与可访问性：**按钮触发隐藏但可访问的 file input；拖拽区有等价按钮；进度/错误可读；不能只拖拽上传。

遵循 [响应式规范](../docs/08-PC移动端响应式规范.md) 与 [无障碍规范](../docs/09-无障碍与键盘交互.md)。手势或 hover 如适用，必须有键盘/点击替代；不通过裁掉内容伪装兼容小屏。

## 7. 主题与样式合同

`--dui-upload-dropzone-bg`、`--dui-upload-dropzone-border`、`--dui-upload-radius`、`--dui-upload-item-gap`、`--dui-upload-progress-color`、`--dui-upload-error-color`。

这些为拟定的组件级 token；由 theme schema 生成名称、类型、fallback 与双框架类型声明。实现时为每个键提供默认值/语义引用，不临时硬编码一份 React 配色和另一份 Vue 配色。light/dark、局部主题、RTL、低动效及 unstyled 必须保持信息可辨；有浮层的组件同时验证 portal 内主题。

## 8. 专项验收用例

以下专项用例必须形成命名测试或人工测试记录；不能用一个 snapshot 代替整表。

| 测试 ID | 场景 | 结果要求 |
|---|---|---|
| `C40-EDGE-01` | 数量/体积限制 | React / Vue 分别记录结果与证据 |
| `C40-EDGE-02` | beforeUpload拒绝/异常 | React / Vue 分别记录结果与证据 |
| `C40-EDGE-03` | 并发 | React / Vue 分别记录结果与证据 |
| `C40-EDGE-04` | 取消后旧响应 | React / Vue 分别记录结果与证据 |
| `C40-EDGE-05` | 同名不同id | React / Vue 分别记录结果与证据 |
| `C40-EDGE-06` | 重试 | React / Vue 分别记录结果与证据 |
| `C40-EDGE-07` | 重复选择 | React / Vue 分别记录结果与证据 |
| `C40-EDGE-08` | SSR 无 File 顶层引用 | React / Vue 分别记录结果与证据 |
| `C40-EDGE-09` | 卸载 URL 清理 | React / Vue 分别记录结果与证据 |

共用基线另覆盖 `C40-BASE-*`、适用的 `CTRL-*`、`A11Y-*`、`MOBILE-*`、`THEME-*`、`SSR-*`。不适用项写明原因；未执行项写“未运行”，不能默认通过。两框架接受同一行为案例，但各自运行并保存证据。

## 9. 导出、依赖与交付

**命名导出：**`Upload` 与对应公共类型；必要子组件的命名在实施 API 审查时补全并同步两框架。

**目标子路径：**`@your-scope/ui-react/upload`、`@your-scope/ui-vue/upload`。样式为同名 `/style.css` 子路径，配合框架包 `base.css`，或使用全量 `style.css`。纯逻辑入口的 CSS 可以为空但需明确产物策略，不能暴露指向不存在文件的 exports。只有完成验收的模块才进入稳定导出清单。

**复用参考：**[Button](C02-Button-按钮.md)。这是复用与测试参考，不要求每项都形成强制运行时 import；严格按实际代码生成 CSS 依赖图。

交付应包含双框架实现、必要共享核心、同源 CSS/token、类型测试、双框架 stories、用户用法与边界说明、上述专项测试、changeset 及 tarball 消费验证。阶段状态记录在 [TASKS](../tracking/TASKS.md)，而不是直接改本规格为“已经发布”。

## 10. 数据与 adapter 目标类型

```ts
interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: 'idle'|'validating'|'queued'|'uploading'|'success'|'error'|'cancelled';
  progress?: number;
  raw?: File; // 仅客户端；已有服务器文件可以没有 raw
  url?: string;
  error?: { code: string; message: string };
}
type RequestAdapter = (ctx: {
  file: File;
  signal: AbortSignal;
  onProgress: (loaded: number, total?: number) => void;
}) => Promise<{ url?: string; response?: unknown }>;
```

没有可靠 total 时展示未知进度；不能假装 fetch 天然提供跨浏览器上传百分比。传输适配可采用经过验证的 XHR 等实现；断点续传另行定义协议。

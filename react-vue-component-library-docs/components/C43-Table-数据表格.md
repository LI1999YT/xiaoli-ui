# C43｜Table · 数据表格

> 优先级：**P1** · 分类：数据展示 · 当前状态：**待实施**。这是开发与验收规格，不表示组件已实现、已测试或已发布。

## 1. 用途与范围

常规业务数据表，支持列定义、排序、筛选、选择、分页组合和自定义单元格。

**本期不包含：**v1 不含电子表格编辑、任意合并单元格、列拖拽、树表、默认虚拟化或万能导出。

## 2. 公共 API

属性表为目标合同。`value/checked` 在 Vue 中按[跨框架契约](../docs/04-跨框架API与类型契约.md)映射；“默认 false/null/[]”描述非受控初始值，受控 prop 的存在判定仍以 undefined 为准。公共 class、style、部位注入和 unstyled 见[通用规格](../docs/26-组件通用规格.md)，不把无关属性强塞到本组件。

| 属性 / 方法输入 | 类型或可选值 | 默认 / 要求 | 语义与约束 |
|---|---|---|---|
| `data` | `readonly T[]` | [] | 不修改传入数据 |
| `columns` | `TableColumn<T>[]` | 必填 | 稳定 column.key |
| `rowKey` | `keyof T / (row:T)=>K` | 必填 | 不允许动态列表使用索引 |
| `loading/error` | `boolean / string` | false / 无 | 与 empty 分开 |
| `sort/defaultSort` | `{key,order:asc/desc}/null` | null | Vue v-model:sort |
| `filters/defaultFilters` | `Record<string,unknown>` | {} | Vue v-model:filters |
| `selectedKeys/defaultSelectedKeys` | `K[]` | [] | Vue v-model:selected-keys |
| `manualSorting/manualFiltering` | `boolean` | false | true 时仅发请求，不本地变更 |
| `stickyHeader` | `boolean` | false | 明确滚动容器 |
| `mobileMode` | `scroll / cards` | scroll | cards 必须提供 renderMobileItem |
| `pagination` | `{page:number,pageSize:number,total?:number} / false` | false | 外部分页共享的只读状态，不显示内置分页器 |
| `manualPagination` | `boolean` | false | true 表示 data 已是当前页，total 必须显式提供 |
| `preserveSelectedKeys` | `boolean` | false | true 时保留不在当前 data 内的 key，业务负责权限与删除 |
| `caption` | `string` | 建议提供 | 表格可访问名称，可用 caption slot 覆写 |

## 3. 事件、实例与时序

onSortChange/update:sort；onFiltersChange/update:filters；onSelectedKeysChange/update:selectedKeys；onRowClick/@row-click 不拦截单元格内按钮。分页控件使用独立 Pagination，和 Table.pagination 读取父应用同一份状态；Table 不发第二条页码变化或私自重置页码。

模型更新不因父 prop 回写而重复通知；可取消默认行为与清理边界遵循通用契约。对确实不存在模型的纯展示组件，不添加无意义的 change 事件。

## 4. 内容扩展与公开部位

caption；headerCell；cell({row,column,value,rowIndex})；empty；loading；mobileItem；root,scroll,table,head,body,row,cell,sortButton,selection。

React 使用 children/renderX，Vue 使用 default/具名 scoped slot；`data-part` 与 classNames/styles 的键一致。需要转交 ref、aria、事件的 trigger/field slot 必须定义强类型上下文并给出可运行示例；不要依靠选择私有 nth-child 做定制。

## 5. 行为与状态

v1 单列排序、列筛选、受控选择、显式列宽/溢出、固定表头和有限固定列。本地模式顺序为 filter→stable sort→按 pagination 切片；manualSorting/manualFiltering/manualPagination 对应步骤逐项跳过。全选只选最终可见页的可选行；跨页保留选择 opt-in。请求中旧数据是否保留由业务控制。

## 6. PC、移动端与可访问性

**移动端：**默认容器横向滚动，不隐藏关键列；卡片模式由用户明确渲染数据和动作；固定列不能遮住主要内容。

**键盘与可访问性：**默认真实 table/caption/th；表头排序按钮 aria-sort 合理；checkbox 有行名称；不声明完整 spreadsheet/grid 键盘能力。

遵循 [响应式规范](../docs/08-PC移动端响应式规范.md) 与 [无障碍规范](../docs/09-无障碍与键盘交互.md)。手势或 hover 如适用，必须有键盘/点击替代；不通过裁掉内容伪装兼容小屏。

## 7. 主题与样式合同

`--dui-table-header-bg`、`--dui-table-row-bg`、`--dui-table-row-hover-bg`、`--dui-table-row-selected-bg`、`--dui-table-cell-padding`、`--dui-table-border-color`、`--dui-table-row-height`。

这些为拟定的组件级 token；由 theme schema 生成名称、类型、fallback 与双框架类型声明。实现时为每个键提供默认值/语义引用，不临时硬编码一份 React 配色和另一份 Vue 配色。light/dark、局部主题、RTL、低动效及 unstyled 必须保持信息可辨；有浮层的组件同时验证 portal 内主题。

## 8. 专项验收用例

以下专项用例必须形成命名测试或人工测试记录；不能用一个 snapshot 代替整表。

| 测试 ID | 场景 | 结果要求 |
|---|---|---|
| `C43-EDGE-01` | rowKey缺失/重复 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-02` | 排序稳定性 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-03` | 空/loading/error | React / Vue 分别记录结果与证据 |
| `C43-EDGE-04` | manual不二次排序 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-05` | 分页全选范围 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-06` | 单元格按钮不触发行点击 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-07` | 横向滚动 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-08` | SSR/主题/RTL | React / Vue 分别记录结果与证据 |
| `C43-EDGE-09` | 本地过滤后分页总数与切片 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-10` | 服务端三manual不重复处理 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-11` | 筛选后越界页 | React / Vue 分别记录结果与证据 |
| `C43-EDGE-12` | 保留选择范围 | React / Vue 分别记录结果与证据 |

共用基线另覆盖 `C43-BASE-*`、适用的 `CTRL-*`、`A11Y-*`、`MOBILE-*`、`THEME-*`、`SSR-*`。不适用项写明原因；未执行项写“未运行”，不能默认通过。两框架接受同一行为案例，但各自运行并保存证据。

## 9. 导出、依赖与交付

**命名导出：**`Table`、`deriveTableRows`、`TableColumn` 与对应类型。

**目标子路径：**`@your-scope/ui-react/table`、`@your-scope/ui-vue/table`。样式为同名 `/style.css` 子路径，配合框架包 `base.css`，或使用全量 `style.css`。纯逻辑入口的 CSS 可以为空但需明确产物策略，不能暴露指向不存在文件的 exports。只有完成验收的模块才进入稳定导出清单。

**复用参考：**[Checkbox](C11-Checkbox-复选框.md)、[Pagination](C32-Pagination-分页.md)、[Empty](C26-Empty-空状态.md)。这是复用与测试参考，不要求每项都形成强制运行时 import；严格按实际代码生成 CSS 依赖图。

交付应包含双框架实现、必要共享核心、同源 CSS/token、类型测试、双框架 stories、用户用法与边界说明、上述专项测试、changeset 及 tarball 消费验证。阶段状态记录在 [TASKS](../tracking/TASKS.md)，而不是直接改本规格为“已经发布”。

## 10. 列类型目标

```ts
interface TableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  compare?: (a:T,b:T)=>number;
  fixed?: 'start' | 'end';
  // React renderCell / Vue cell slot 保留 T，不放入共享核心类型中的 ReactNode
}
```

null/undefined 的排序位置固定为最后，字符串排序 locale 明确；默认稳定排序保留原相对顺序。行选中 key 不使用对象引用；数据刷新时选中保留/清理策略为 `preserveSelectedKeys=false`，true 时允许跨页 key 保留，但调用方负责权限和已删除数据。

固定列需要显式宽度并测试 sticky 与滚动；固定列表头视觉克隆不可产生第二份可访问表格。导出当前数据只是未来可选 adapter，不负责业务访问授权。

## 分页与筛选合同

本地模式 `data` 为全量集合，Table 先筛选和排序，再按外部传入的 `pagination.page/pageSize` 切片；不启用分页时展示处理后的全部数据。对外提供同版本纯函数 `deriveTableRows({data,columns,sort,filters,pagination,...})`（从 table 子路径导出），返回 `filteredTotal` 与 `rows` 等确定结果，供父应用把筛选后总数传给独立 Pagination；Table 自身复用该函数，避免两套算法。类型不含 ReactNode/VNode。

服务端模式应将三个 manual 标志一起设为 true，传当前页 data 与服务端 total；混合模式必须说明排序/筛选只是当前 data 范围，不误称跨页全局。由父应用在筛选/页容量变化时更新同一份页码状态并请求数据，Table 不先发一次、Pagination 再发一次。越界页不静默修改父状态，可展示空页和开发提示，由业务决定恢复到哪一页。

`preserveSelectedKeys=false` 的有效范围是当前 data 中存在的 key，而非当前视觉页；本地 data 为全量时允许已选行跨视觉页留存，服务端 data 则仅含当前页。全选仍只作用于最终可见页。开发用例必须覆盖这两个区别。

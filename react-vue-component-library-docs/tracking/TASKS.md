# 任务追踪表

**状态初值均为待开始。**状态流：待开始 → 进行中 → 待验证 → 已完成；失败/外部条件不足可记阻塞。仅有规格文件不算完成。

## 阶段与工程任务

| ID | 任务 | 前置依赖 | 主要文件/交付 | 退出条件 | 状态 | 证据 |
|---|---|---|---|---|---|---|
| M0-01 | 环境/身份/版本核验 | 无 | tracking/DECISIONS、工作区检查 | 可重复工具组合与真实锁定记录 | 已完成 | Node 22.23.2 / pnpm 10.15.1 / lockfile |
| M0-02 | workspace与四公开包/私有基础包 | M0-01 | package.json、pnpm-workspace、packages | 干净安装，边界和依赖关系正确 | 已完成 | pnpm install |
| M0-03 | token schema/生成器/基础CSS | M0-02 | tokens、theme、scripts | CSS/JSON/TS同源、未知键/危险键校验 | 已完成 | tokens:generate + theme.test |
| M0-04 | 构建/类型/exports/pack脚本 | M0-02/03 | build-config、scripts、包清单 | ESM/d.ts/CSS产物完整，框架external | 已完成 | pnpm build + pack:check |
| M0-05 | 测试适配器与基础fixtures | M0-04 | test-utils、playgrounds | 双框架 playground 可运行 | 已完成 | playground + test:consumers 独立 tarball 构建通过 |
| M0-06 | CI验证与工作流安全骨架 | M0-05 | .github/workflows、scripts | 受保护验证；不默认公开发布 | 已完成 | verify.yml 只验证不发布 |
| M1-01 | 十项双框架纵向试点 | M0完成 | 对应C01/02/03/05/09/11/15/16/20/22 | 同场景可操作；组件DoD分别满足 | 待验证 | React/Vue playground 已手工走通；Storybook/e2e/真机 not-run |
| M1-02 | 主题与嵌套浮层回归 | M1-01 | theme fixtures、Dialog/Toast测试 | 双主题/已开弹层/焦点/清理有证据 | 待验证 | playground 双主题+Toast；未跑完整套件 |
| M1-03 | 试点文档/本地打包验收 | M1-02 | stories、consumer报告 | 十项真实API和CSS外部消费通过 | 待验证 | pack:check + test:consumers 通过；无 Storybook |
| M2-01 | 其余16项P0与契约回归 | M1完成 | P0剩余components、tests | 26项范围准确，两框架同语义 | 待开始 | 无 |
| M2-02 | SSR/i18n/RTL/文档门户 | M2-01 | next/nuxt、locale、apps/docs | import/render/hydrate与文档示例通过 | 待开始 | 无 |
| M2-03 | 预发布候选检查 | M2-02 | packs、release report | 范围门禁通过；发布另需授权 | 待开始 | 无 |
| M3-01 | 28项P1按依赖实施 | M2完成 | P1 components | 日期/上传/表格/移动边界完整 | 待开始 | 无 |
| M3-02 | 54项正式版综合验收 | M3-01 | 全部测试/真机/类型/体积报告 | 无发布阻断，缺项明确 | 待开始 | 无 |
| M3-03 | 授权发布与真实registry消费 | M3-02及授权 | 发布manifest/report、文档版本 | 审核产物实际安装通过 | 待开始 | 无 |
| M4-01 | 18项P2按RFC逐项扩展 | 对应依赖完成 | RFC、P2 components | 实验/稳定范围清晰，逐项验收 | 待开始 | 无 |

## 72 项组件进度

每项React/Vue、共享CSS与主题、测试/类型、文档、打包分别验收；任何一列未满足都不得算该项已完成。下列“未开始/未运行”是本次文档交付的真实初始状态。

| ID | 规格 | 阶段 | React | Vue | CSS/主题 | 测试/类型 | 文档示例 | pack消费 | 总状态 |
|---|---|---|---|---|---|---|---|---|---|
| C01 | [ConfigProvider](../components/C01-ConfigProvider-全局配置.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C02 | [Button](../components/C02-Button-按钮.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C03 | [Icon](../components/C03-Icon-图标容器.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C04 | [Typography](../components/C04-Typography-文字与链接.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C05 | [Flex](../components/C05-Flex-弹性布局.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C06 | [Grid](../components/C06-Grid-网格布局.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C07 | [Space](../components/C07-Space-间距组合.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C08 | [Divider](../components/C08-Divider-分割线.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C09 | [Input](../components/C09-Input-单行输入.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C10 | [Textarea](../components/C10-Textarea-多行输入.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C11 | [Checkbox](../components/C11-Checkbox-复选框.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C12 | [Radio](../components/C12-Radio-单选框.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C13 | [Switch](../components/C13-Switch-开关.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C14 | [Select](../components/C14-Select-选择器.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C15 | [Form](../components/C15-Form-表单系统.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C16 | [Dialog](../components/C16-Dialog-对话框.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C17 | [Drawer](../components/C17-Drawer-抽屉.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C18 | [Popover](../components/C18-Popover-弹出面板.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C19 | [Tooltip](../components/C19-Tooltip-文字提示.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C20 | [Toast](../components/C20-Toast-轻提示.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C21 | [Tabs](../components/C21-Tabs-页签.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C22 | [Card](../components/C22-Card-卡片.md) | P0 | 已实现 | 已实现 | 已实现 | 单元/契约通过 | playground | pack:check 通过 | 待验证 |
| C23 | [Badge](../components/C23-Badge-徽标.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C24 | [Spinner](../components/C24-Spinner-加载指示.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C25 | [Skeleton](../components/C25-Skeleton-骨架屏.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C26 | [Empty](../components/C26-Empty-空状态.md) | P0 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C27 | [Alert](../components/C27-Alert-页面提示.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C28 | [Tag](../components/C28-Tag-标签.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C29 | [Avatar](../components/C29-Avatar-头像.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C30 | [Image](../components/C30-Image-图片.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C31 | [Progress](../components/C31-Progress-进度条.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C32 | [Pagination](../components/C32-Pagination-分页.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C33 | [Breadcrumb](../components/C33-Breadcrumb-面包屑.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C34 | [Menu](../components/C34-Menu-导航菜单.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C35 | [Dropdown](../components/C35-Dropdown-操作下拉菜单.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C36 | [Accordion](../components/C36-Accordion-折叠面板.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C37 | [InputNumber](../components/C37-InputNumber-数值输入.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C38 | [Slider](../components/C38-Slider-滑块.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C39 | [Rate](../components/C39-Rate-评分.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C40 | [Upload](../components/C40-Upload-文件上传.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C41 | [DatePicker](../components/C41-DatePicker-日期选择.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C42 | [TimePicker](../components/C42-TimePicker-时间选择.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C43 | [Table](../components/C43-Table-数据表格.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C44 | [List](../components/C44-List-列表.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C45 | [Descriptions](../components/C45-Descriptions-描述列表.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C46 | [Steps](../components/C46-Steps-步骤条.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C47 | [BottomSheet](../components/C47-BottomSheet-底部弹层.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C48 | [TabBar](../components/C48-TabBar-底部导航.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C49 | [ActionSheet](../components/C49-ActionSheet-动作面板.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C50 | [SafeArea](../components/C50-SafeArea-安全区容器.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C51 | [Segmented](../components/C51-Segmented-分段选择.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C52 | [Autocomplete](../components/C52-Autocomplete-自动补全.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C53 | [Calendar](../components/C53-Calendar-日历面板.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C54 | [Notification](../components/C54-Notification-通知面板.md) | P1 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C55 | [Tree](../components/C55-Tree-树形控件.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C56 | [TreeSelect](../components/C56-TreeSelect-树选择器.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C57 | [Cascader](../components/C57-Cascader-级联选择.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C58 | [Transfer](../components/C58-Transfer-穿梭选择.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C59 | [Carousel](../components/C59-Carousel-轮播.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C60 | [Timeline](../components/C60-Timeline-时间线.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C61 | [Anchor](../components/C61-Anchor-锚点导航.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C62 | [Affix](../components/C62-Affix-吸附容器.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C63 | [ScrollArea](../components/C63-ScrollArea-滚动区域.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C64 | [BackTop](../components/C64-BackTop-返回顶部.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C65 | [PullRefresh](../components/C65-PullRefresh-下拉刷新.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C66 | [InfiniteScroll](../components/C66-InfiniteScroll-无限加载.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C67 | [SwipeCell](../components/C67-SwipeCell-侧滑操作行.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C68 | [NoticeBar](../components/C68-NoticeBar-公告栏.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C69 | [VirtualList](../components/C69-VirtualList-虚拟列表.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C70 | [SearchBar](../components/C70-SearchBar-搜索栏.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C71 | [Picker](../components/C71-Picker-滚轮选择器.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |
| C72 | [Watermark](../components/C72-Watermark-水印.md) | P2 | 未开始 | 未开始 | 未开始 | 未运行 | 未开始 | 未运行 | 待开始 |

## 任务完成记录格式

每个完成项追加：任务ID、commit、修改文件、命令/退出结果、测试报告与consumer日志、审查结果、风险/例外、实际完成日期。禁止一次批量把整表改为已完成而不附证据。测试失败后修复需重新验证，保留原问题的追踪。

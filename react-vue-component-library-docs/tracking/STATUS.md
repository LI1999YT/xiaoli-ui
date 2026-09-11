# 当前状态

记录日期：2026-09-11。

| 项目 | 当前真实状态 |
|---|---|
| 产品/架构/组件/发布规格 | 文档已编写；实施按 M0+M1 推进，并继续加深薄组件 |
| 当前开发阶段 | M0 底座 + M1 试点已落地；P1/P2 有源码，规格完整度不一 |
| 组件实现 | 72 项均有文件夹；本批加深 Table/DatePicker/TimePicker/Calendar/Tree/PullRefresh/Affix/ScrollArea/Watermark/SafeArea |
| 已公开 npm 包 | 0；不要把源码存在写成已发布 |
| 实际测试/构建/消费验证 | 以本轮 `pnpm test:unit` 为准；未 npm publish |
| 兼容性与性能 | 目标已定义，未对真机测量 |

## 下一项具体工作

继续加深仍薄的 P1/P2（Picker、Carousel、VirtualList、Upload 边界、Tree cascade/懒加载），补单元测试与 playground 验收。不要宣布 1.0 或 72 项已完成。

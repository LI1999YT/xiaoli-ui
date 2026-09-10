# 24｜风险、常见问题与排障

## 1. 主要风险

| 风险 | 征兆 | 预防与处理 |
|---|---|---|
| 双框架分叉 | 同组件默认值/事件不同 | 先冻结契约、同 caseId 双框架测试 |
| 主题只改主色 | 弹窗/禁用/暗色仍旧配色 | 三层 token + 全状态主题测试 |
| 移动是假响应式 | 缩窄后还依赖 hover/小按钮 | 真机、Pointer Events、替代操作 |
| 一次生成太多空壳 | 72 个文件但缺状态/测试 | 10 项试点，按 DoD 逐项完成 |
| 本地能用 npm 不能用 | alias 掩盖缺依赖/缺 CSS | 安装 tarball 的独立 fixture |
| 发布身份失败 | OIDC 403/不允许 publish | 检查 allowed actions、精确 repo/workflow |
| 上游工具配置变化 | 旧教程参数失效 | M0 核验并锁定版本 |
| 低估复杂组件 | Table/DatePicker/Tree API 反复改 | v1 范围收敛，高阶能力 P2/RFC |
| 自定义破坏语义 | slot 丢 ref/aria/key handlers | 受保护属性合并与扩展示例验收 |

## 2. 为什么不写一份组件同时给 React/Vue 用？

本项目选择双原生渲染层，公共逻辑和样式复用。强行统一渲染会引入额外适配边界，违背本次对框架惯用 API 的目标；不是说其他技术路线绝对不可行。

## 3. 可直接在 React Native / 小程序运行吗？

不能据此承诺。这里输出 HTML/CSS/DOM；原生平台和微信小程序原生组件需要对应渲染与交互适配。WebView 中的 H5 可作为目标环境实测。

## 4. 可以完全换成自己的设计吗？

按 tokens、部位、slots、unstyled 层级可以覆盖大量外观和内容；任意改变语义 DOM 或键盘模型需要重新验收。不承诺“无论怎么改都保持功能和无障碍”。

## 5. 要不要全局安装插件？

默认 named import，不全局注册，避免无意引入所有组件。Vue 全量 install 插件若后续提供，放显式子路径并标明体积，不作为默认入口。

## 6. 要不要 CommonJS？

v1 明确 ESM-only；现代构建项目先验证此路径。需要旧 CJS 系统再立 ADR 和 fixture，不能只在 package.json 填 require 字段假装支持。

## 7. 为什么仅改 class，弹窗颜色没有变？

body portal 可能脱离原 CSS 继承。优先用 Provider tokens；或设置同作用域 portalContainer/portalClassName。不要反复增大 z-index 解决主题继承问题。

## 8. 为什么只导入 Button 却体积很大？

检查根入口副作用、全量图标、全量 CSS、错误 external、循环 barrel 引用、无条件聚合日期/表格逻辑。以 consumer bundle graph 诊断，不盲目加 memo。

## 9. 为什么第一次发布不能全自动？

npm scope、账号权限、2FA、包创建与可信发布者属于真实外部身份配置，不能由文档虚构。按发布手册确认实际账号能力，后续再自动化。

## 10. AI 写完能直接上线吗？

AI 输出代码不等于验证完成。必须有安装、构建、类型、双框架交互、移动、无障碍、SSR、发布检查的证据。没有真机的环境如实记录未测，不能用“模拟器通过”代替。

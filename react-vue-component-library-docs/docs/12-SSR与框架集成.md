# 12｜SSR、Next.js 与 Nuxt 集成

## 1. 三个独立检查

“模块能在 Node 导入”“组件能输出服务端 HTML”“客户端 hydration 无差异”是三件事，必须分别测试。所有公开 JS 入口在没有 window/document/navigator 的环境导入成功。

禁止顶层 localStorage、matchMedia、Date.now 随机 ID、浏览器尺寸判断或跨请求共享用户配置。create store、主题解析与 toast registry 以请求/Provider 为边界。服务端并发 20 次渲染不同主题与 locale，结果不能串数据。

## 2. React

公共交互组件入口保留 `'use client'` 指令，包含按需子路径。构建过程可能改变文件边界，必须检查 dist 指令并在 Next App Router 的 fixture 运行；不能只看源码有这行就判定成功。

v1 React 框架包整体按客户端组件边界使用；不额外承诺某个 Typography 导出是 RSC server-only 组件。客户端组件仍需要通过 SSR 渲染测试。纯 token/theme 数据工具可在服务端使用，不持有 React context。

Provider 放在 Client wrapper 内；从 Server Component 传入的配置需可序列化。业务事件 handler 写在客户端组件，不从服务器把函数 prop 直接传入客户端边界。

稳定 ID 使用 React useId；React 18.3 与 React 19 都跑 fixture。不能把 useId 当动态列表 key，不能用全局自增计数器制造跨请求 ID。

资料：[React useId](https://react.dev/reference/react/useId)、[use client 边界](https://react.dev/reference/rsc/use-client)。

## 3. Vue / Nuxt

避免模块级共享响应式配置和全局 toast 状态。SSR 时不执行 mounted、DOM 测量、scrollIntoView 等逻辑。稳定 ID 使用经过版本基线确认的 Vue useId；客户端树必须与服务端树保持一致。

Vue 组件产物先编译 SFC，不要求消费方转译本库源码。使用 vue-tsc 输出/检查类型声明，并在 Nuxt fixture 测试。Teleport 默认采用挂载后输出策略；高级 SSR Teleport 按官方流程验证，不能把 SSR 内容随意挂在 body 并假定正常 hydration。

资料：[Vue SSR](https://vuejs.org/guide/scaling-up/ssr.html)、[Composition API helpers](https://vuejs.org/api/composition-api-helpers.html#useid)。

## 4. 明暗主题首屏

优先由应用在 cookie/服务端配置中确定初始明暗，把相同明暗值作为 Provider.initialMode 传入；固定明暗主题同时在 theme.mode 中声明。无服务端偏好时使用固定回退，例如 light，hydration 完成再跟随系统；承认可能短暂换色。

可选的 pre-hydration 主题脚本必须由应用管理 CSP nonce/hash 与缓存策略。v1 不自动向 head 插脚本，不为了消除告警默认开启 suppressHydrationWarning。

## 5. 日期、尺寸与空数据

展示日期的 locale/timezone 明确传入；服务端和客户端不能各自取不同默认时区。DatePicker 的 date-only 值为 YYYY-MM-DD，不能通过 `new Date('YYYY-MM-DD')` 再转本地时间导致日期移动。

Responsive CSS 优先；需要 DOM 测量的 VirtualList、瀑布布局等采用稳定服务端占位，mount 后增强。默认关闭浮层服务端不输出内容；defaultOpen 的具体限制见浮层文档。

## 6. 验收

双主题并发、重复实例 ID、错误字段 ARIA ID、打开状态、locale、夏令时边界、暗色初始页、异步加载后的重排、路由切换/卸载、非浏览器导入、Next/Nuxt 生产 build 与 preview。所有 console hydration 警告视为失败，不能清空控制台伪装通过。

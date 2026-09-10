# AGENTS｜AI 开发协作总规则

## 项目任务

依据本仓库 Markdown 规格，构建双框架 Web 组件库：React 原生实现与 Vue 原生实现；共用 tokens、CSS、纯逻辑和 DOM 工具；支持 PC / 平板 / 手机 H5；准备可靠 npm 分发。`Dual UI`、`@your-scope`、`dui` 是本方案占位名称，不表示已经获得 npm 命名空间。

当前交付只有需求文档。不要把文档数量当作已实现组件数量，不要声称已经安装依赖、构建、运行测试或发布。

## 读取顺序与冲突处理

开始任务先读 `START_HERE.md`、`tracking/STATUS.md`、`tracking/TASKS.md`、`tracking/DECISIONS.md`、`tracking/BLOCKERS.md`；按阶段读取相关 `docs/`，仅对本次组件读取对应 `components/Cxx-*.md`。

优先级：用户本次明确指示 > 已批准的新 ADR > 本文件与通用契约 > 单组件规格 > 示例/注释。涉及 API、主题、发布的冲突先记录，并统一修订受影响文档；不能用旧代码倒逼规格含糊化。未经明确批准，不扩大组件范围，不引入未论证的运行时依赖。

## 不可静默改变的默认决策

四个公开包 ui-tokens/ui-theme/ui-react/ui-vue，同步版本；私有 core/dom 构建内联。pnpm workspace；TypeScript strict；现代 ESM + d.ts + 显式 CSS。React 与 Vue 不互相依赖。没有验证过的 CJS、React Native、小程序、IE 等不在兼容承诺中。

主题采用三层 token、CSS variables、公开 parts、局部/嵌套主题与 portal 桥接。`unstyled` 保留必要结构、焦点与行为样式，不承诺完全零 CSS。可选受控布尔值不可因 Vue 默认转换被误判。

## 每次工作流程

1. 确认当前阶段、目标任务、输入文档和涉及包；先阅读已有代码/配置，不覆盖未知改动。
2. 列出本次可验收范围，优先设计公共类型与关键失败用例；验证工具版本组合后才锁定。
3. 同时实现两框架映射，共用能稳定共享的逻辑和 CSS；不机械转换 JSX/Vue。
4. 运行与本次变更有关的真实命令；报告命令、退出结果、日志路径；未执行明确写未运行。
5. 更新 TASKS/STATUS/BLOCKERS 和变更记录；报告完成、未完成、风险及下一个具体任务。

公开 API、slots、tokens、parts、默认行为或 exports 变化必须同步文档、类型测试与 changeset。PR 中解释需要新依赖的理由、许可证和包体影响。

## 禁止的“假完成”

不得用 `return null`、空回调、静态截图、硬编码演示数组、隐藏异常、跳过断言、修改测试期望掩盖 bug、无根据设置 `as any` 等方式冒充功能。允许明确命名且有待办追踪的内部脚手架，但不能进入稳定导出或对外功能清单。

不能把未跑测试写 pass；不能把模拟设备写成真机；不能把源码构建成功写成 npm 消费通过；不能把 dry-run 写成公开发布；不能把覆盖率高写成无障碍认证。

## 资源、安全与工作区

不要删除已有用户文件、重置 Git 历史或清空 lockfile 来规避错误。读取 `.env`、凭证、用户私有接口之前遵循项目权限；绝不把秘密复制到文档、日志或示例。业务上传和远程数据通过 adapter，不内置真实地址和凭证。

默认只做本地开发和验证。禁止擅自 `npm publish`、unpublish、改 dist-tag、修改远端权限、创建公开仓库或推送到受保护分支。公开操作需所有者明确授权，并核验精确包名、版本、registry、tag 与 tarball 哈希。

## 完成定义

严格遵循 `docs/22-验收清单与追踪矩阵.md`。阶段推进靠实际退出条件，不靠文件数量或 AI 自述。没有外部账号/真机时继续可完成的本地工作，把对应验证列为 blocked/not-run，不假定成功。

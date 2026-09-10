# 决策与待填写项

## 已采用的方案默认值

详见 [ADR摘要](../docs/29-架构决策ADR.md)。这些是本需求包的默认设计，不替用户决定对外名称/许可证，不代表技术实现已验证。

| 项目 | 当前方案 | 是否阻断本地开发 | 发布前要求 |
|---|---|---|---|
| 项目名称 | Xiaoli UI（文件夹 xiaoliComponent；文档原 Dual UI 占位已替换） | 否 | 所有者确认品牌与重名风险 |
| npm scope | `@xiaoli-ui` | 否 | 真实存在且有发布权限 |
| CSS前缀 | `dui`（与 72 项规格一致） | 否 | 名称确定后冻结公开 token 前缀 |
| 仓库地址 | 公开仓库 `https://github.com/LI1999YT/xiaoli-ui.git` | 否 | 已写入 repository/homepage/bugs |
| 许可证 | MIT，版权人 yuntuo，2026 | 否 | 所有者确认署名 |
| 品牌视觉 | 文档中性蓝预设 | 否 | 对比度与视觉验收 |
| 图标 | SVG 容器，不内置全量图标集 | 否 | 引入第三方图标须查许可证 |
| 平台 | Web PC/平板/手机 H5 | 否 | 只能宣传实测范围 |
| 框架/包格式 | 原生双适配、ESM-only | 否 | peer/SSR/consumer 验证 |
| 版本管理 | 四公开包 fixed 同步版本 0.1.0 | 否 | Changesets 实际发布验证 |
| 发布策略 | 人工批准，禁止 AI 擅自 publish | 否 | npm allowed actions 核验 |

## M0 精确版本记录（由执行者查询并安装后填写）

| 工具 | 查阅官方兼容依据 | 锁定版本 | 安装/测试证据 |
|---|---|---|---|
| Node | 本机 `node -v`；文档建议 24，兼容目标 22 | 22.23.2 | 本地开发机 |
| npm | `npm -v` | 10.9.8 | 本地开发机 |
| pnpm | `pnpm -v`；写入 packageManager | 10.15.1 | package.json packageManager |
| TypeScript / Vite / Vitest / Vue / React | 安装时解析 | 见根 package.json 与 pnpm-lock.yaml | lockfile |

不要把“建议 Node24”当作已经锁定补丁版本。

## 新决策日志

| 日期 | 决策ID | 问题与选择 | 证据/批准 | 影响文件 |
|---|---|---|---|---|
| 2026-09-10 | ADR-011 | 产品名采用 Xiaoli UI，npm scope `@xiaoli-ui`，CSS 前缀保持 `dui` 以对齐规格 | 实施期默认，待所有者确认 | README、各 package.json |
| 2026-09-10 | ADR-012 | M1 先交付十项试点，不实现 72 项空壳 | 遵循 START_HERE / docs/21 | packages/* |

# 19｜npm 发布操作手册

本文提供未来发布步骤，本次只交付需求文档，未注册、未登录、未发布任何 npm 包。所有 `@your-scope`、仓库名和版本号为待替换参数。

## 1. 一次性准备

所有者确认 npm 用户/组织 scope、四个包名与仓库归属；启用 2FA；验证账号对 scope 有发布权；填写真实 repository/homepage/bugs/license/author；在 npm 查询名称。`npm view` 返回 404 不代表你自动拥有名称或命名空间。

确认公开发布授权。带 scope 的公开包显式 `access: public`。本项目目标包：ui-tokens、ui-theme、ui-react、ui-vue；私有 internal 包与 apps 不发布。

## 2. 先完成本地 tarball 流程

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:contract
pnpm build
pnpm pack:check
pnpm test:consumers
pnpm release:verify
```

这些是 M0/M2 需实现的根脚本，文档包本身没有可执行项目。pack:check 必须通过 pnpm pack 或明确的 staging 流程完成 workspace 协议重写，并解包检查结果。`npm publish --dry-run` 不等于远端认证、权限或 OIDC 已验证成功。

## 3. 首次发布与可信发布者配置

新包尚未存在时，若 npm 当前流程要求先创建包，则由维护者通过交互登录和 2FA 发布审核后的首个有效版本，再为每个包设置 Trusted Publisher；不要发布无内容的占位包来冒充完成，也不要假定不存在的包已经有设置页面。执行时再次核验 npm 是否已提供其他首次创建流程。

登录在本机终端完成，不把密码或一次性验证码贴进 AI 聊天/仓库。审批后的 tarball 可按依赖顺序逐个发布：tokens → theme → react / vue；先发布预发布版本并打 `next` tag。首次实际命令使用审批确定的真实路径，而非复制示例占位符。

```sh
npm login
npm whoami
# 以下路径和版本仅示意；实际文件由 release manifest 提供。
npm publish ./artifacts/your-scope-ui-tokens-0.1.0-beta.1.tgz --access public --tag next
```

每个包配置正确 GitHub owner、repo、workflow 文件名和 environment；仓库 URL 必须对应真实来源。OIDC 配置本身不会帮你检查所有字段拼写，需要真实发布验证。

## 4. OIDC 关键条件（2026-09-10 核验）

npm 官方文档要求 npm CLI ≥11.5.1、Node ≥22.14.0；本项目采用 Node 24 的已核验补丁版本和精确 npm 版本。GitHub 使用支持的托管 runner，发布 job 需要 `id-token: write`。

**当前 npm 新建可信发布者的 allowed actions 必须检查。**官方页面记录：2026-09-03 之后新建配置默认允许 staged publishing，可以另行允许直接 `npm publish`。本项目初始流程是“GitHub environment 人工批准 + 直接 npm publish”，因此要明确允许直接 publish；否则不能照旧教程直接运行并期待成功。stage-only 模式可作为后续更严格流程，需另写批准与恢复步骤。

公开仓库发布公开包且满足官方条件时，GitHub/GitLab OIDC 可自动附带 provenance；私有仓库不能据此承诺自动 provenance。正常 OIDC 发布不需要仓库存放长期写 token；安装私有依赖的读取认证是另一件事。

来源：[npm Trusted Publishers](https://docs.npmjs.com/trusted-publishers/)。正式执行仍需复核当前文档与账号设置。

## 5. 发布顺序与半失败恢复

发布前生成 manifest：提交、版本、各 tarball SHA256、包间依赖、tag、目标 registry、审核人。依赖包先发，验证 registry 可见后再发下游。四个包不是一个原子事务，必须接受并处理半成功。

重试时查询已存在的 name@version，核对 registry integrity 与预期 tarball；一致则跳过已成功项，不尝试覆盖；不一致立即停止并人工调查。只补发同一份已审核产物，不从变化后的分支重新构建同版本。

## 6. dist-tag 与版本

alpha/beta/rc 预发布使用 next，稳定版使用 latest。不要因为发布一个 beta 而移动 latest。稳定晋级前执行完整发布验收；同版本内容不可修改。变更需发新版本。

版本弃用与回退：先把 latest 指回上一个可用版本，再发布修复；必要时 npm deprecate 问题版本并给迁移说明。改 dist-tag 不会让已安装或锁文件中的用户自动回退。不要把 unpublish 当常规回滚。

## 7. 发布后验收

查看 registry 的 exports/files/dependencies/dist-tags；在仓库外空白工程安装明确版本；双框架构建并操作 Button/Input/Dialog；检查 CSS、类型、主题、SSR、来源信息。更新 CHANGELOG、Git tag、文档版本和兼容表。证据保存到 release report，而不是只看 npm 页面有包名。

## 8. 常见失败

| 问题 | 优先检查 |
|---|---|
| 401/ENEEDAUTH | npm/Node 版本、OIDC 权限、workflow 文件名、repo/environment、runner |
| 403 | scope 权限、包策略、allowed actions、2FA、版本已存在 |
| E404 | registry 是否正确、包/依赖是否先发布、scope 是否有权限 |
| workspace 协议泄漏 | 使用了错误打包命令，或 staging 未改写依赖 |
| 安装缺 CSS | CSS exports 指向错误，发布 files 缺资源，CSS 被误判无副作用 |
| Invalid hook call | 重复 React、运行时未 external、peer 安装不匹配 |

不以关闭 2FA、扩大 token 权限或禁用安全策略作为默认排障方法。

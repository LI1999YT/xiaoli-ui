# 20｜CI/CD 与版本治理

## 1. 四条流水线

PR 验证：lint → typecheck → unit/contract → build → a11y/关键 E2E → pack/consumer。主分支：完整矩阵与文档预览。版本 PR：Changesets 更新同版本组、依赖和 CHANGELOG。发布：可信提交的无缓存干净构建与验证 → 固化 tarball/manifest → 受保护环境人工批准 → 校验同一产物并发布 → 外部安装验收。

普通 PR 不获得 npm 发布权限，不运行 fork 提供的高权限脚本。OIDC 权限仅发布 job 设置，不放整个仓库所有 workflow。发布 job 禁止使用来自不受信任 PR 的缓存/构建产物。

## 2. 同版本发布组

四个公共包使用 Changesets fixed group：

```json
{
  "fixed": [[
    "@your-scope/ui-tokens",
    "@your-scope/ui-theme",
    "@your-scope/ui-react",
    "@your-scope/ui-vue"
  ]]
}
```

这是配置片段，不是完整 Changesets 配置。fixed 组会一起升版和发布，包括本次没有源码改动的成员；不是只设置 linked 后假定永远同版本。[Changesets fixed 官方说明](https://changesets.dev/guide/fixed-packages)

统一版本降低 React/Vue/主题匹配难度，但也意味着只改 Vue 时 React 包也会发布新版本，这是本项目接受的成本。

## 3. 发布 workflow 合同

使用经核验且固定 SHA 的 checkout/setup-node/pnpm 安装步骤；安装精确 Node/npm/pnpm；`pnpm install --frozen-lockfile`；在不含发布权限的可信构建 job 执行 release:verify 并生成唯一 manifest；人工批准后由发布 job 验证产物哈希/commit，按依赖顺序用 npm CLI 发布同一份审核产物。发布 job 不重新构建一份内容可能不同的同版本 tarball。不要假定任意版本的 pnpm publish / Changesets 内部调用都会以同样方式使用 OIDC。

版本编排可用 Changesets，真正上传由明确的 release 脚本调用 npm CLI。脚本必须正确处理 workspace 依赖重写、私有包排除、预发布 tag、已发布版本与失败恢复。不得直接 `npm publish` 根 monorepo。

发布 workflow 文件名示例 `release.yml`，最终与 npm Trusted Publisher 保持一致。权限为 contents:read、id-token:write；若另需创建 release/tag，优先分离受限 job 或显式评估额外权限。environment 配置人工批准；不依赖 AI 自称“确认发布”。

## 4. SemVer

patch：不改变约定 API 的修复。minor：向后兼容新增组件/prop/token。major：移除或改名、事件语义变化、默认交互不兼容、CSS token/part 移除、peer 最低版本不兼容提升。视觉变化也可能破坏业务布局，不能一律算 patch。

0.x 仍维护变更记录和预告，不把“未到 1.0”当随意破坏理由。废弃 API 至少跨一个明确约定的 minor 迁移窗口后再 major 删除，安全问题可以单独说明例外。

## 5. 发布产物和记录

每次产物关联 commit、lockfile hash、工具版本、兼容矩阵、测试日志、tarball hash、包版本、dist-tag、npm 发布结果。重新跑失败 job 只重试已审核 manifest 的剩余步骤；变更代码必须新构建并重新审查。

## 6. 变更审查

公共 API 差异自动检测；token 清单与部位清单 diff；两框架 API parity；新增依赖、变更脚本、workflow 或构建工具需要维护者审查。文档与 npm 的版本一致，实验 API 不能悄悄进入稳定主入口。

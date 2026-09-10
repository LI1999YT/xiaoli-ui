# 发布检查表｜所有项目初始未勾选

配合 [npm手册](../docs/19-npm发布操作手册.md)、[CI版本治理](../docs/20-CI-CD与版本治理.md) 与 [发布报告模板](../templates/发布报告模板.md)。不凭文档存在勾选。

## 身份与范围

- [ ] 所有者明确批准真实包名/scope/公开仓库与许可证。
- [ ] scope权限、registry、版本和tag正确，示例占位已全部替换。
- [ ] 本次稳定/实验组件清单与实际实现一致，没有空壳。
- [ ] 四包版本与changeset、CHANGELOG、迁移说明一致。

## 代码与产物

- [ ] 源码commit冻结，精确工具版本和lockfile可重复。
- [ ] 双框架类型/单元/契约/浏览器/SSR等门禁通过并附证据。
- [ ] 承诺范围的真机/读屏/主题/响应式检查完成；未验证项没有被宣传为通过。
- [ ] CSS全量/按需/主题/parts/unstyled通过，包体预算有实测值。
- [ ] 框架运行时external；无workspace协议/private包/秘密泄漏。
- [ ] exports和类型/CSS文件存在；许可和README齐全。
- [ ] 在仓库外用npm与pnpm安装审核tarball，consumer构建与运行通过。
- [ ] manifest包含每包精确产物、commit、哈希、依赖顺序和审批。

## 发布权限与流程

- [ ] 当天复核npm官方规则与Node/npm条件。
- [ ] 每包可信发布者repo/workflow/environment正确，runner受支持。
- [ ] 发布job仅有必要权限，id-token:write及人工environment审批有效。
- [ ] 所选直接publish模式已被npm allowed actions明确允许；没有混用stage-only。
- [ ] 公开发布获得明确授权，不使用聊天中暴露的凭证。
- [ ] 按tokens→theme→react/vue执行，next与latest区分。
- [ ] 半成功时仅补发审核产物；已存在版本的integrity核验一致。

## 发布后与恢复

- [ ] 从真实registry安装明确版本，双框架关键场景/CSS/SSR验证。
- [ ] dist-tags、仓库来源与适用的provenance验证。
- [ ] 文档/示例/CHANGELOG/Git tag/兼容矩阵同步。
- [ ] 上一可用版本与回退审批路径明确，理解tag不能改写用户锁文件。
- [ ] 发布报告只记录真实结果，失败/未运行/阻塞如实保留。

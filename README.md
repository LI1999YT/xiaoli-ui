# Xiaoli UI

开源的 React + Vue 双框架 Web 组件库（[MIT](./LICENSE)）。源码托管在 [github.com/LI1999YT/xiaoli-ui](https://github.com/LI1999YT/xiaoli-ui)。PC / 平板 / 手机 H5 共用同一套 token 与 CSS，原生实现，不互相嵌套运行时。

当前发布范围为 **M1 试点（0.1.0）**，不是 1.0 的 54 项承诺。已实现：ConfigProvider、Button、Icon、Input、Checkbox、Form、Dialog、Toast、Flex、Card。

规格文档在 [`react-vue-component-library-docs/`](./react-vue-component-library-docs/)。技术前缀仍使用文档约定的 `dui`（`data-dui`、`--dui-*`）。npm 包使用 `@xiaoli-ui/*`。

## 安装

只需安装对应框架包，并显式导入 CSS。

```bash
# React
pnpm add @xiaoli-ui/react

# Vue 3
pnpm add @xiaoli-ui/vue
```

Peer：React `^18.3.1 || ^19.0.0`，Vue `^3.5.0`。

## React 用法

```tsx
import { Button, ConfigProvider, Input } from '@xiaoli-ui/react';
import '@xiaoli-ui/react/style.css';

export function App() {
  return (
    <ConfigProvider theme={{ id: 'app', mode: 'light' }}>
      <Input aria-label="姓名" defaultValue="" onValueChange={console.log} />
      <Button htmlType="button">提交</Button>
    </ConfigProvider>
  );
}
```

## Vue 用法

```vue
<script setup>
import { Button, ConfigProvider, Input } from '@xiaoli-ui/vue';
import '@xiaoli-ui/vue/style.css';
</script>

<template>
  <ConfigProvider :theme="{ id: 'app', mode: 'light' }">
    <Input aria-label="姓名" v-model="name" />
    <Button>提交</Button>
  </ConfigProvider>
</template>
```

## 按需加载

```ts
import '@xiaoli-ui/react/base.css';
import '@xiaoli-ui/react/button/style.css';
import { Button } from '@xiaoli-ui/react/button';
```

全量 `style.css` 与按需 CSS 二选一，不要同时导入。

## 主题

```ts
import { defineTheme } from '@xiaoli-ui/react';

const brand = defineTheme({
  id: 'brand',
  mode: 'light',
  tokens: { 'color.action.bg': '#0f766e' },
  components: { button: { radius: '12px' } },
});
```

`unstyled` 去掉品牌外观，保留焦点、隐藏内容和浮层结构样式。Portal 内主题由 ConfigProvider 桥接，不会自动继承页面上任意祖先 class。

## 本地开发

```bash
pnpm install
pnpm tokens:generate
pnpm dev:react   # http://localhost:5173
pnpm dev:vue     # http://localhost:5174
pnpm test:unit
pnpm build
pnpm pack:check
```

M1 串联场景：输入姓名并勾选 → 表单校验 → Dialog 确认 → Toast 反馈；两个主题并存，打开弹层后仍可换肤。

## 包列表

| 包 | 说明 |
|---|---|
| `@xiaoli-ui/tokens` | token schema 与 `defineTheme` |
| `@xiaoli-ui/theme` | 共享 CSS / 预设 |
| `@xiaoli-ui/react` | React 组件 |
| `@xiaoli-ui/vue` | Vue 3 组件 |

四个公开包同步版本。`internal-core` / `internal-dom` 为私有源码，构建时内联，不会出现在已发布依赖里。

## 许可证

本仓库以 **MIT** 开源，版权署名为 yuntuo。欢迎通过 Issues / Pull Request 参与：[https://github.com/LI1999YT/xiaoli-ui](https://github.com/LI1999YT/xiaoli-ui)。

尚未完成：P0 其余 16 项、P1/P2、文档站、Storybook、Playwright/axe、真机与读屏、npm 正式发布。

# @xiaoli-ui/vue

Xiaoli UI 的 Vue 3 实现。只需安装本包，不必安装 React。

```bash
pnpm add @xiaoli-ui/vue
```

```vue
<script setup>
import { Button, ConfigProvider } from '@xiaoli-ui/vue';
import '@xiaoli-ui/vue/style.css';
</script>

<template>
  <ConfigProvider :theme="{ id: 'app' }">
    <Button>确定</Button>
  </ConfigProvider>
</template>
```

值用 `v-model`，打开状态用 `v-model:open`，表单值用 `v-model:values`。完整说明见仓库根 README。

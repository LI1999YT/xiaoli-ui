<script setup lang="ts">
import { Flex } from '@xiaoli-ui/vue';
import SignupPanel from './SignupPanel.vue';
</script>

<template>
  <div class="demo-page">
    <h1>Xiaoli UI · Vue 试点</h1>
    <p>输入姓名并勾选 → 校验 → 确认对话框 → Toast。两侧主题互相隔离，打开弹层后仍可换肤。</p>
    <Flex :gap="6" :direction="{ base: 'column', lg: 'row' }">
      <SignupPanel title="浅色主题" />
      <SignupPanel title="可切换主题" switchable start-dark />
    </Flex>
  </div>
</template>

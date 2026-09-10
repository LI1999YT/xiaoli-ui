<script setup lang="ts">
import { Button, ConfigProvider, Input, defineTheme } from '@xiaoli-ui/vue';
import SignupPanel from './SignupPanel.vue';
import Gallery from './Gallery.vue';

const lightTheme = defineTheme({ id: 'gallery-light', mode: 'light' });
</script>

<template>
  <div class="demo-shell">
    <header class="demo-top">
      <div class="demo-brand">
        <span class="demo-mark">小</span>
        <div>
          <strong>Xiaoli UI</strong>
          <small>React + Vue 开源组件库</small>
        </div>
      </div>
      <span class="demo-chip">Vue 试点</span>
    </header>

    <ConfigProvider :theme="lightTheme">
      <section class="demo-section">
        <h2>按钮</h2>
        <div class="demo-row">
          <Button>主要按钮</Button>
          <Button variant="outline">次要按钮</Button>
          <Button variant="soft">轻量按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
          <Button color="danger">危险按钮</Button>
        </div>
      </section>
      <section class="demo-section">
        <h2>输入框</h2>
        <Input aria-label="示例输入" placeholder="请输入内容" />
      </section>
      <Gallery />
    </ConfigProvider>

    <section class="demo-section">
      <h2>表单场景</h2>
      <p>输入姓名并勾选后提交：校验 → 确认对话框 → Toast。左右主题互相隔离。</p>
      <div class="demo-grid">
        <SignupPanel title="浅色主题" />
        <SignupPanel title="深色主题" switchable start-dark />
      </div>
    </section>
  </div>
</template>

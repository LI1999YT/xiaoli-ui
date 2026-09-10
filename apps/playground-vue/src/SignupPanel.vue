<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Dialog,
  Form,
  FormActions,
  FormControl,
  FormError,
  FormField,
  FormLabel,
  Input,
  ToastViewport,
  defineTheme,
  required,
} from '@xiaoli-ui/vue';
import ConfirmActions from './ConfirmActions.vue';

const props = defineProps<{
  title: string;
  switchable?: boolean;
  startDark?: boolean;
}>();

const lightTheme = defineTheme({ id: 'demo-light', mode: 'light' });
const darkTheme = defineTheme({
  id: 'demo-dark',
  mode: 'dark',
  tokens: { 'color.action.bg': '#38bdf8' },
});

const mode = ref(props.startDark ? 'dark' : 'light');
const theme = computed(() => (mode.value === 'dark' ? darkTheme : lightTheme));
const open = ref(false);
const pending = ref<{ name: string; agreed: boolean } | null>(null);

const validators = [
  { path: ['name'], validators: [required('请输入姓名')] },
  { path: ['agreed'], validators: [(value: unknown) => (value ? undefined : '请勾选同意')] },
];

function onSubmit(values: Record<string, unknown>) {
  pending.value = values as { name: string; agreed: boolean };
  open.value = true;
}
</script>

<template>
  <ConfigProvider :theme="theme">
    <ToastViewport />
    <Card :title="title">
      <template v-if="switchable" #extra>
        <Button variant="ghost" size="sm" @click="mode = mode === 'light' ? 'dark' : 'light'">切换主题</Button>
      </template>
      <Form :default-values="{ name: '', agreed: false }" :validators="validators" :submit-handler="onSubmit">
        <FormField :name="['name']" v-slot="{ field }">
          <FormLabel>姓名</FormLabel>
          <FormControl>
            <Input aria-label="姓名" clearable v-bind="field.inputProps" />
          </FormControl>
          <FormError />
        </FormField>
        <FormField :name="['agreed']" v-slot="{ field }">
          <Checkbox v-bind="field.checkboxProps">我已阅读并同意开源许可说明</Checkbox>
          <FormError />
        </FormField>
        <FormActions>
          <Button html-type="submit">提交</Button>
          <Button html-type="reset" variant="ghost" color="neutral">重置</Button>
        </FormActions>
      </Form>
      <Dialog :open="open" title="确认提交" @update:open="open = $event">
        确认提交「{{ pending?.name || '未填写' }}」的信息？可先切换主题观察弹层是否同步换肤。
        <template #footer>
          <ConfirmActions :name="pending?.name" @close="open = false" />
        </template>
      </Dialog>
    </Card>
  </ConfigProvider>
</template>

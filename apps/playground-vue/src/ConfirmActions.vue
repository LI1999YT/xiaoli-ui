<script setup lang="ts">
import { Button, Flex, useToast } from '@xiaoli-ui/vue';

const props = defineProps<{
  name?: string;
}>();
const emit = defineEmits<{ close: [] }>();
const toast = useToast();

function confirm() {
  emit('close');
  toast.show({ message: `${props.name || '用户'} 提交成功`, status: 'success' });
}
</script>

<template>
  <Flex :gap="2" justify="end" wrap>
    <Button variant="ghost" @click="emit('close')">取消</Button>
    <Button @click="confirm">确认</Button>
  </Flex>
</template>

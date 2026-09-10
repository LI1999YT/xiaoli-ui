import { useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Dialog,
  Flex,
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
  useToast,
} from '@xiaoli-ui/react';

const lightTheme = defineTheme({ id: 'demo-light', mode: 'light' });
const darkTheme = defineTheme({
  id: 'demo-dark',
  mode: 'dark',
  tokens: { 'color.action.bg': '#38bdf8' },
});

interface Values {
  name: string;
  agreed: boolean;
}

function SignupForm({
  title,
  switchable,
  mode,
  onToggleMode,
}: {
  title: string;
  switchable?: boolean;
  mode: 'light' | 'dark';
  onToggleMode: () => void;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Values | null>(null);

  return (
    <>
      <ToastViewport />
      <Card
        title={title}
        extra={
          switchable ? (
            <Button variant="ghost" size="sm" onClick={onToggleMode}>
              切换主题
            </Button>
          ) : null
        }
      >
        <Form<Values>
          defaultValues={{ name: '', agreed: false }}
          validators={[
            { path: ['name'], validators: [required('请输入姓名')] },
            { path: ['agreed'], validators: [(value) => (value ? undefined : '请勾选同意')] },
          ]}
          onSubmit={(values) => {
            setPending(values);
            setOpen(true);
          }}
        >
          <FormField name={['name']}>
            {({ field }) => (
              <>
                <FormLabel>姓名</FormLabel>
                <FormControl>
                  <Input aria-label="姓名" clearable {...field.inputProps} />
                </FormControl>
                <FormError />
              </>
            )}
          </FormField>
          <FormField name={['agreed']}>
            {({ field }) => (
              <>
                <Checkbox {...field.checkboxProps}>我已阅读并同意开源许可说明</Checkbox>
                <FormError />
              </>
            )}
          </FormField>
          <FormActions>
            <Button htmlType="submit">提交</Button>
            <Button htmlType="reset" variant="ghost" color="neutral">
              重置
            </Button>
          </FormActions>
        </Form>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="确认提交"
          footer={
            <Flex gap={2} justify="end" wrap>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  toast.show({ message: `${pending?.name || '用户'} 提交成功`, status: 'success' });
                }}
              >
                确认
              </Button>
            </Flex>
          }
        >
          确认提交「{pending?.name || '未填写'}」的信息？可先切换主题观察弹层是否同步换肤。
        </Dialog>
      </Card>
    </>
  );
}

function SignupPanel({ title, switchable, startDark }: { title: string; switchable?: boolean; startDark?: boolean }) {
  const [mode, setMode] = useState<'light' | 'dark'>(startDark ? 'dark' : 'light');
  return (
    <ConfigProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <SignupForm
        title={title}
        switchable={switchable}
        mode={mode}
        onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
      />
    </ConfigProvider>
  );
}

export function App() {
  return (
    <div className="demo-page">
      <h1>Xiaoli UI · React 试点</h1>
      <p>输入姓名并勾选 → 校验 → 确认对话框 → Toast。两侧主题互相隔离，打开弹层后仍可换肤。</p>
      <Flex gap={6} direction={{ base: 'column', lg: 'row' }} align="stretch">
        <SignupPanel title="浅色主题" />
        <SignupPanel title="可切换主题" switchable startDark />
      </Flex>
    </div>
  );
}

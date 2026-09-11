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
import { Gallery } from './Gallery';

const lightTheme = defineTheme({ id: 'demo-light', mode: 'light' });
const darkTheme = defineTheme({ id: 'demo-dark', mode: 'dark' });

interface Values {
  name: string;
  agreed: boolean;
}

function SignupForm({
  title,
  switchable,
  onToggleMode,
}: {
  title: string;
  switchable?: boolean;
  onToggleMode: () => void;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Values | null>(null);

  return (
    <>
      <ToastViewport />
      <Card
        variant="outlined"
        padding={5}
        title={title}
        extra={
          switchable ? (
            <Button variant="outline" onClick={onToggleMode}>
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
                  <Input aria-label="姓名" clearable {...field.inputProps} placeholder="请输入姓名" />
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
            <Button htmlType="reset" variant="outline" color="neutral">
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
        onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
      />
    </ConfigProvider>
  );
}

export function App() {
  return (
    <div className="demo-shell">
      <header className="demo-top">
        <div className="demo-brand">
          <span className="demo-mark">小</span>
          <div>
            <strong>Xiaoli UI</strong>
            <small>React + Vue 开源组件库</small>
          </div>
        </div>
        <span className="demo-chip">React 试点</span>
      </header>

      <ConfigProvider theme={lightTheme}>
        <section className="demo-section">
          <h2>按钮</h2>
          <div className="demo-row">
            <Button>主要按钮</Button>
            <Button variant="outline">次要按钮</Button>
            <Button variant="soft">轻量按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
            <Button color="danger">危险按钮</Button>
          </div>
        </section>
        <section className="demo-section">
          <h2>输入框</h2>
          <Input aria-label="示例输入" placeholder="请输入内容" defaultValue="" />
        </section>
        <Gallery />
      </ConfigProvider>

      <section className="demo-section">
        <h2>表单场景</h2>
        <p>输入姓名并勾选后提交：校验 → 确认对话框 → Toast。左右主题互相隔离。</p>
        <div className="demo-grid">
          <SignupPanel title="浅色主题" />
          <SignupPanel title="深色主题" switchable startDark />
        </div>
      </section>
    </div>
  );
}

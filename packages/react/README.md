# @xiaoli-ui/react

Xiaoli UI 的 React 实现。只需安装本包，不必安装 Vue。

```bash
pnpm add @xiaoli-ui/react
```

```tsx
import { Button, ConfigProvider } from '@xiaoli-ui/react';
import '@xiaoli-ui/react/style.css';

export function Example() {
  return (
    <ConfigProvider theme={{ id: 'app' }}>
      <Button>确定</Button>
    </ConfigProvider>
  );
}
```

完整说明见仓库根 README。

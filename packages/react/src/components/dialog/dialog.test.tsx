import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { ConfigProvider } from '../config-provider/config-provider.tsx';
import { Button } from '../button/button.tsx';
import { Dialog } from './dialog';

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <ConfigProvider theme={{ id: 'test' }}>
      <Button onClick={() => setOpen(true)}>打开</Button>
      <Dialog open={open} onOpenChange={setOpen} title="确认">
        内容
      </Dialog>
    </ConfigProvider>
  );
}

describe('Dialog', () => {
  it('C16-EDGE-01 打开后可关闭并恢复', async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole('button', { name: '打开' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

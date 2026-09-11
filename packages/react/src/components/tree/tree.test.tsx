import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tree } from './tree';

const data = [
  {
    key: 'cast',
    title: '角色',
    children: [
      { key: 'cast-xiaoli', title: '小狸', children: [{ key: 'cast-xiaoli-note', title: '笔记' }] },
      { key: 'cast-sakura', title: '樱花' },
    ],
  },
];

describe('Tree', () => {
  it('C55-EDGE-02 三层树可展开并选中叶子', async () => {
    const onSelectedKeysChange = vi.fn();
    render(<Tree data={data} defaultExpandedKeys={['cast']} onSelectedKeysChange={onSelectedKeysChange} />);
    expect(screen.getByRole('treeitem', { name: '小狸' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '展开' }));
    await userEvent.click(screen.getByRole('treeitem', { name: '笔记' }));
    expect(onSelectedKeysChange).toHaveBeenCalledWith(['cast-xiaoli-note']);
  });
});

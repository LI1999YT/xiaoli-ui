import { useMemo, useState, type KeyboardEvent } from 'react';
import {
  collectParentKeys,
  flattenVisibleTree,
  isControlled,
  normalizeTreeNodes,
  toggleKeyList,
  type LegacyTreeNode,
  type TreeNode,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

export interface TreeProps {
  nodes?: TreeNode[];
  data?: LegacyTreeNode[];
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  checkedKeys?: string[];
  defaultCheckedKeys?: string[];
  multiple?: boolean;
  checkable?: boolean;
  value?: string;
  onValueChange?: (next: string) => void;
  onSelectedKeysChange?: (next: string[]) => void;
  onExpandedKeysChange?: (next: string[]) => void;
  onCheckedKeysChange?: (next: string[]) => void;
}

export function Tree({
  nodes,
  data,
  selectedKeys,
  defaultSelectedKeys,
  expandedKeys,
  defaultExpandedKeys,
  checkedKeys,
  defaultCheckedKeys = [],
  multiple = false,
  checkable = false,
  value,
  onValueChange,
  onSelectedKeysChange,
  onExpandedKeysChange,
  onCheckedKeysChange,
}: TreeProps) {
  const tree = useMemo(() => normalizeTreeNodes(nodes, data), [nodes, data]);
  const initialSelected = defaultSelectedKeys ?? (value ? [value] : []);
  const [uncontrolledSelected, setUncontrolledSelected] = useState(initialSelected);
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpandedKeys ?? collectParentKeys(tree, initialSelected[0] ?? ''));
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultCheckedKeys);
  const [active, setActive] = useState(initialSelected[0]);

  const currentSelected = isControlled(selectedKeys) ? (selectedKeys ?? []) : uncontrolledSelected;
  const currentExpanded = isControlled(expandedKeys) ? (expandedKeys ?? []) : uncontrolledExpanded;
  const currentChecked = isControlled(checkedKeys) ? (checkedKeys ?? []) : uncontrolledChecked;
  const expandedSet = useMemo(() => new Set(currentExpanded), [currentExpanded]);
  const visible = useMemo(() => flattenVisibleTree(tree, expandedSet), [tree, expandedSet]);

  const setSelected = (next: string[]) => {
    if (!isControlled(selectedKeys)) setUncontrolledSelected(next);
    onSelectedKeysChange?.(next);
    if (next[0]) onValueChange?.(next[0]);
  };
  const setExpanded = (next: string[]) => {
    if (!isControlled(expandedKeys)) setUncontrolledExpanded(next);
    onExpandedKeysChange?.(next);
  };
  const setChecked = (next: string[]) => {
    if (!isControlled(checkedKeys)) setUncontrolledChecked(next);
    onCheckedKeysChange?.(next);
  };

  const select = (key: string, disabled?: boolean) => {
    if (disabled) return;
    setActive(key);
    setSelected(multiple ? toggleKeyList(currentSelected, key) : [key]);
  };
  const toggleExpand = (key: string) => setExpanded(toggleKeyList(currentExpanded, key));

  const onKeyDown = (event: KeyboardEvent, key: string, hasChildren: boolean, disabled?: boolean) => {
    const index = visible.findIndex((item) => item.node.key === key);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = visible[index + 1];
      if (next) setActive(next.node.key);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = visible[index - 1];
      if (next) setActive(next.node.key);
    }
    if (event.key === 'ArrowRight' && hasChildren && !expandedSet.has(key)) {
      event.preventDefault();
      toggleExpand(key);
    }
    if (event.key === 'ArrowLeft' && hasChildren && expandedSet.has(key)) {
      event.preventDefault();
      toggleExpand(key);
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(key, disabled);
    }
  };

  return (
    <ul data-dui="tree" role="tree">
      {visible.map(({ node, depth }) => {
        const hasChildren = Boolean(node.children?.length);
        const expanded = expandedSet.has(node.key);
        const selected = currentSelected.includes(node.key);
        return (
          <li key={node.key} role="none">
            <div data-part="node" style={{ ['--dui-tree-depth' as string]: String(depth) }}>
              {hasChildren ? (
                <button
                  type="button"
                  data-part="expander"
                  aria-label={expanded ? '折叠' : '展开'}
                  aria-expanded={expanded}
                  onClick={() => toggleExpand(node.key)}
                >
                  {expanded ? '▾' : '▸'}
                </button>
              ) : (
                <span data-part="expander" />
              )}
              {checkable ? (
                <input
                  type="checkbox"
                  aria-label={`勾选 ${node.label}`}
                  disabled={node.disabled}
                  checked={currentChecked.includes(node.key)}
                  onChange={() => setChecked(toggleKeyList(currentChecked, node.key))}
                />
              ) : null}
              <button
                type="button"
                role="treeitem"
                data-part="label"
                data-selected={presence(selected)}
                data-active={presence(active === node.key)}
                aria-selected={selected}
                aria-expanded={hasChildren ? expanded : undefined}
                tabIndex={active === node.key ? 0 : -1}
                disabled={node.disabled}
                onClick={() => select(node.key, node.disabled)}
                onKeyDown={(event) => onKeyDown(event, node.key, hasChildren, node.disabled)}
              >
                {node.label}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

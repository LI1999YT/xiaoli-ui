export interface TreeNode<K extends string = string> {
  key: K;
  label: string;
  disabled?: boolean;
  isLeaf?: boolean;
  children?: Array<TreeNode<K>>;
}

export interface LegacyTreeNode {
  key: string;
  title?: string;
  label?: string;
  disabled?: boolean;
  children?: LegacyTreeNode[];
}

export function normalizeTreeNodes(
  nodes?: TreeNode[],
  data?: LegacyTreeNode[],
): TreeNode[] {
  if (nodes?.length) return nodes;
  if (!data?.length) return [];
  const map = (items: LegacyTreeNode[]): TreeNode[] =>
    items.map((item) => ({
      key: item.key,
      label: item.label ?? item.title ?? item.key,
      disabled: item.disabled,
      children: item.children?.length ? map(item.children) : undefined,
    }));
  return map(data);
}

export function toggleKeyList<K extends string>(keys: readonly K[], key: K): K[] {
  return keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key];
}

export function findTreeNode<K extends string>(nodes: TreeNode<K>[], key: K): TreeNode<K> | undefined {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findTreeNode(node.children, key);
      if (found) return found;
    }
  }
  return undefined;
}

export interface FlatTreeItem<K extends string = string> {
  node: TreeNode<K>;
  depth: number;
  parentKey?: K;
}

export function flattenVisibleTree<K extends string>(
  nodes: TreeNode<K>[],
  expanded: ReadonlySet<K>,
): Array<FlatTreeItem<K>> {
  const out: Array<FlatTreeItem<K>> = [];
  const walk = (list: TreeNode<K>[], depth: number, parentKey?: K) => {
    for (const node of list) {
      out.push({ node, depth, parentKey });
      if (node.children?.length && expanded.has(node.key)) {
        walk(node.children, depth + 1, node.key);
      }
    }
  };
  walk(nodes, 0);
  return out;
}

export function collectParentKeys<K extends string>(nodes: TreeNode<K>[], key: K): K[] {
  const path: K[] = [];
  const walk = (list: TreeNode<K>[], trail: K[]): boolean => {
    for (const node of list) {
      if (node.key === key) {
        path.push(...trail);
        return true;
      }
      if (node.children && walk(node.children, [...trail, node.key])) return true;
    }
    return false;
  };
  walk(nodes, []);
  return path;
}

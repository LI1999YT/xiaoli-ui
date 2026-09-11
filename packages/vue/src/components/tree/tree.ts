import { computed, defineComponent, h, ref, type PropType } from 'vue';
import {
  collectParentKeys,
  flattenVisibleTree,
  isControlled,
  normalizeTreeNodes,
  toggleKeyList,
  type LegacyTreeNode,
  type TreeNode,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';

export const Tree = defineComponent({
  name: 'DuiTree',
  props: {
    nodes: { type: Array as PropType<TreeNode[]>, default: undefined },
    data: { type: Array as PropType<LegacyTreeNode[]>, default: () => [] },
    selectedKeys: { type: Array as PropType<string[]>, default: undefined },
    defaultSelectedKeys: { type: Array as PropType<string[]>, default: undefined },
    expandedKeys: { type: Array as PropType<string[]>, default: undefined },
    defaultExpandedKeys: { type: Array as PropType<string[]>, default: undefined },
    checkedKeys: { type: Array as PropType<string[]>, default: undefined },
    defaultCheckedKeys: { type: Array as PropType<string[]>, default: () => [] },
    multiple: { type: Boolean, default: false },
    checkable: { type: Boolean, default: false },
    modelValue: { type: String, default: undefined },
  },
  emits: {
    'update:modelValue': (_next: string) => true,
    'update:selectedKeys': (_next: string[]) => true,
    'update:expandedKeys': (_next: string[]) => true,
    'update:checkedKeys': (_next: string[]) => true,
  },
  setup(props, { emit }) {
    const tree = computed(() => normalizeTreeNodes(props.nodes, props.data));
    const initialSelected = props.defaultSelectedKeys ?? (props.modelValue ? [props.modelValue] : []);
    const uncontrolledSelected = ref(initialSelected);
    const uncontrolledExpanded = ref(props.defaultExpandedKeys ?? collectParentKeys(tree.value, initialSelected[0] ?? ''));
    const uncontrolledChecked = ref([...props.defaultCheckedKeys]);
    const active = ref(initialSelected[0]);

    const currentSelected = () => (isControlled(props.selectedKeys) ? (props.selectedKeys ?? []) : uncontrolledSelected.value);
    const currentExpanded = () => (isControlled(props.expandedKeys) ? (props.expandedKeys ?? []) : uncontrolledExpanded.value);
    const currentChecked = () => (isControlled(props.checkedKeys) ? (props.checkedKeys ?? []) : uncontrolledChecked.value);

    const setSelected = (next: string[]) => {
      if (!isControlled(props.selectedKeys)) uncontrolledSelected.value = next;
      emit('update:selectedKeys', next);
      if (next[0]) emit('update:modelValue', next[0]);
    };
    const setExpanded = (next: string[]) => {
      if (!isControlled(props.expandedKeys)) uncontrolledExpanded.value = next;
      emit('update:expandedKeys', next);
    };
    const setChecked = (next: string[]) => {
      if (!isControlled(props.checkedKeys)) uncontrolledChecked.value = next;
      emit('update:checkedKeys', next);
    };

    return () => {
      const expandedSet = new Set(currentExpanded());
      const visible = flattenVisibleTree(tree.value, expandedSet);
      return h(
        'ul',
        { 'data-dui': 'tree', role: 'tree' },
        visible.map(({ node, depth }) => {
          const hasChildren = Boolean(node.children?.length);
          const expanded = expandedSet.has(node.key);
          const selected = currentSelected().includes(node.key);
          return h('li', { key: node.key, role: 'none' }, [
            h('div', { 'data-part': 'node', style: { '--dui-tree-depth': String(depth) } }, [
              hasChildren
                ? h(
                    'button',
                    {
                      type: 'button',
                      'data-part': 'expander',
                      'aria-label': expanded ? '折叠' : '展开',
                      'aria-expanded': expanded,
                      onClick: () => setExpanded(toggleKeyList(currentExpanded(), node.key)),
                    },
                    expanded ? '▾' : '▸',
                  )
                : h('span', { 'data-part': 'expander' }),
              props.checkable
                ? h('input', {
                    type: 'checkbox',
                    'aria-label': `勾选 ${node.label}`,
                    disabled: node.disabled,
                    checked: currentChecked().includes(node.key),
                    onChange: () => setChecked(toggleKeyList(currentChecked(), node.key)),
                  })
                : null,
              h(
                'button',
                {
                  type: 'button',
                  role: 'treeitem',
                  'data-part': 'label',
                  'data-selected': presence(selected),
                  'data-active': presence(active.value === node.key),
                  'aria-selected': selected,
                  tabindex: active.value === node.key ? 0 : -1,
                  disabled: node.disabled,
                  onClick: () => {
                    if (node.disabled) return;
                    active.value = node.key;
                    setSelected(props.multiple ? toggleKeyList(currentSelected(), node.key) : [node.key]);
                  },
                },
                node.label,
              ),
            ]),
          ]);
        }),
      );
    };
  },
});

import { useState } from 'react';
import {
  Accordion,
  ActionSheet,
  Affix,
  Alert,
  Autocomplete,
  Avatar,
  Badge,
  BottomSheet,
  Breadcrumb,
  Button,
  Calendar,
  Carousel,
  Cascader,
  Checkbox,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Grid,
  GridItem,
  Image,
  Input,
  InputNumber,
  List,
  Menu,
  NoticeBar,
  Notification,
  Pagination,
  Picker,
  Popover,
  Progress,
  PullRefresh,
  Radio,
  RadioGroup,
  Rate,
  SafeArea,
  ScrollArea,
  SearchBar,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spinner,
  Steps,
  Switch,
  TabBar,
  Table,
  Tabs,
  Tag,
  Textarea,
  TimePicker,
  Timeline,
  Tooltip,
  Transfer,
  Tree,
  Typography,
  Upload,
  Watermark,
} from '@xiaoli-ui/react';

export function Gallery() {
  const [radio, setRadio] = useState('sakura');
  const [on, setOn] = useState(true);
  const [city, setCity] = useState<string | number | null>('tokyo');
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [actions, setActions] = useState(false);
  const [page, setPage] = useState(2);
  const [score, setScore] = useState(4);
  const [volume, setVolume] = useState(40);
  const [tab, setTab] = useState('form');
  const [seg, setSeg] = useState('week');
  const [tablePage, setTablePage] = useState(1);
  const [refreshCount, setRefreshCount] = useState(0);

  const tableRows = [
    { id: '1', name: '小狸', city: '京都', score: 92 },
    { id: '2', name: '星屑', city: '东京', score: 88 },
    { id: '3', name: '月光', city: '大阪', score: 95 },
    { id: '4', name: '樱花', city: '京都', score: 81 },
    { id: '5', name: '夜行', city: '奈良', score: 76 },
  ];

  return (
    <>
      <section className="demo-section">
        <h2>输入与开关</h2>
        <Space wrap size={4} align="start">
          <div style={{ minWidth: 240 }}>
            <Input aria-label="画廊输入" placeholder="点这里输入" />
          </div>
          <div style={{ minWidth: 240 }}>
            <Textarea aria-label="多行输入" placeholder="可以输入多行" rows={3} showCount />
          </div>
        </Space>
        <div className="demo-row" style={{ marginTop: 12 }}>
          <Checkbox defaultChecked>独立复选框</Checkbox>
          <RadioGroup value={radio} onValueChange={setRadio} options={[{ value: 'sakura', label: '樱花' }, { value: 'star', label: '星屑' }]} />
          <Switch checked={on} onCheckedChange={setOn}>夜间模式</Switch>
        </div>
        <div className="demo-row" style={{ marginTop: 12 }}>
          <Select value={city} onValueChange={setCity} clearable options={[{ value: 'tokyo', label: '东京' }, { value: 'kyoto', label: '京都' }, { value: 'osaka', label: '大阪' }]} />
          <InputNumber defaultValue={3} min={0} max={99} />
          <SearchBar defaultValue="" onSearch={() => undefined} />
        </div>
      </section>

      <section className="demo-section">
        <h2>排版与布局</h2>
        <Typography variant="heading">樱花季标题</Typography>
        <Typography tone="muted">这是一段辅助说明，用来检查截断与色调。</Typography>
        <Divider>分割线</Divider>
        <Grid columns={3} gap={3}>
          <GridItem><div className="demo-chip">Grid 1</div></GridItem>
          <GridItem><div className="demo-chip">Grid 2</div></GridItem>
          <GridItem><div className="demo-chip">Grid 3</div></GridItem>
        </Grid>
      </section>

      <section className="demo-section">
        <h2>浮层与页签</h2>
        <div className="demo-row">
          <Button onClick={() => setDrawer(true)}>打开抽屉</Button>
          <Popover title="提示" trigger={<Button variant="outline">打开气泡</Button>}>可以放任意内容。</Popover>
          <Tooltip content="悬停或聚焦查看"><Button variant="soft">文字提示</Button></Tooltip>
          <Button variant="ghost" onClick={() => setSheet(true)}>底部弹层</Button>
          <Button variant="ghost" onClick={() => setActions(true)}>动作面板</Button>
        </div>
        <Tabs value={tab} onValueChange={setTab} items={[{ value: 'form', label: '表单', content: '表单页签内容' }, { value: 'data', label: '数据', content: '数据页签内容' }]} />
        <Drawer open={drawer} title="抽屉" onOpenChange={setDrawer}>这里是抽屉内容，可以放筛选或设置。</Drawer>
        <BottomSheet open={sheet} title="底部弹层" onOpenChange={setSheet}>从底部滑出的面板。</BottomSheet>
        <ActionSheet open={actions} title="选择操作" actions={[{ value: 'edit', label: '编辑' }, { value: 'del', label: '删除', danger: true }]} onOpenChange={setActions} />
      </section>

      <section className="demo-section">
        <h2>展示</h2>
        <div className="demo-row">
          <Badge count={8}><Button variant="outline">消息</Button></Badge>
          <Spinner label="加载中" />
          <Tag color="primary">樱花</Tag>
          <Avatar name="小狸" />
          <Alert status="success" title="提交成功">表单已经保存。</Alert>
        </div>
        <Skeleton rows={3} />
        <Empty title="还没有作品" description="去创建一个新的组件试试。" />
        <Progress value={64} label="完成度" />
        <Rate value={score} onValueChange={setScore} />
        <Slider value={volume} onValueChange={setVolume} />
      </section>

      <section className="demo-section">
        <h2>导航与数据</h2>
        <Breadcrumb items={[{ label: '首页', href: '#' }, { label: '组件' }, { label: '画廊' }]} />
        <Steps current={1} items={[{ title: '填写' }, { title: '确认' }, { title: '完成' }]} />
        <Pagination page={page} total={80} pageSize={10} onPageChange={setPage} />
        <Menu items={[{ value: 'a', label: '概览' }, { value: 'b', label: '设置' }]} defaultValue="a" />
        <Dropdown items={[{ value: 'copy', label: '复制' }, { value: 'remove', label: '删除', danger: true }]}><Button variant="outline">更多</Button></Dropdown>
        <Accordion items={[{ key: '1', title: '什么是 Xiaoli？', content: '一套樱花主题的 React + Vue 组件库。' }]} />
        <Table
          caption="角色表"
          rowKey="id"
          selectable
          stickyHeader
          pagination={{ page: tablePage, pageSize: 3 }}
          columns={[
            { key: 'name', title: '姓名', sortable: true, filterable: true },
            { key: 'city', title: '城市', filterable: true },
            { key: 'score', title: '分数', sortable: true },
          ]}
          data={tableRows}
        />
        <Pagination page={tablePage} total={5} pageSize={3} onPageChange={setTablePage} />
        <List items={[{ key: '1', title: '第一项', description: '描述文字' }]} />
        <Descriptions title="资料" items={[{ label: '名字', value: '小狸' }, { label: '主题', value: '樱花' }]} />
      </section>

      <section className="demo-section">
        <h2>选择与日期</h2>
        <div className="demo-row">
          <DatePicker defaultValue="2026-09-10" clearable />
          <DatePicker mode="range" clearable />
          <TimePicker defaultValue="17:00" clearable showSeconds />
          <Segmented value={seg} onValueChange={setSeg} options={[{ value: 'week', label: '周' }, { value: 'month', label: '月' }]} />
          <Autocomplete options={['樱花', '星屑', '月光']} />
        </div>
        <Calendar />
        <Upload />
        <Picker columns={[['春', '夏'], ['朝', '夜']]} />
      </section>

      <section className="demo-section">
        <h2>其余组件</h2>
        <NoticeBar text="开源组件库持续建设中" closable />
        <Notification title="新消息" description="画廊已经可以交互。" />
        <Tree
          defaultExpandedKeys={['cast']}
          data={[
            {
              key: 'cast',
              title: '角色',
              children: [
                { key: 'cast-xiaoli', title: '小狸', children: [{ key: 'cast-xiaoli-note', title: '笔记' }] },
                { key: 'cast-sakura', title: '樱花' },
              ],
            },
            { key: 'places', title: '地点', children: [{ key: 'places-kyoto', title: '京都' }] },
          ]}
        />
        <Cascader options={[{ value: 'jp', label: '日本', children: [{ value: 'kyoto', label: '京都' }] }]} />
        <Transfer data={[{ key: '1', title: '按钮' }, { key: '2', title: '输入框' }]} />
        <Carousel items={['第一屏', '第二屏', '第三屏']} />
        <Timeline items={[{ title: 'M0 底座', description: '完成' }, { title: 'M1 试点', description: '进行中' }]} />
        <TabBar items={[{ value: 'home', label: '首页' }, { value: 'me', label: '我的' }]} />
        <Image src="https://picsum.photos/seed/xiaoli/240/140" alt="示例图" width={240} height={140} />
        <Watermark text="Xiaoli"><div style={{ minHeight: 80, padding: 16 }}>水印容器</div></Watermark>
        <Affix offset={8}><Button variant="outline">吸附按钮</Button></Affix>
        <ScrollArea height={120}>
          <p>滚动区域第一段</p>
          <p>滚动区域第二段</p>
          <p>滚动区域第三段</p>
          <p>滚动区域第四段</p>
        </ScrollArea>
        <PullRefresh
          onRefresh={async () => {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setRefreshCount((count) => count + 1);
          }}
        >
          <div style={{ minHeight: 80, padding: 8 }}>已刷新 {refreshCount} 次。手机上可下拉，键盘可用刷新按钮。</div>
        </PullRefresh>
        <SafeArea edges={['bottom']}>
          <div className="demo-chip">SafeArea 底部</div>
        </SafeArea>
      </section>
    </>
  );
}

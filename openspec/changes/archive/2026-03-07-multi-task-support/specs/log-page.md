## 录入页面适配

### LOG-1: 数据流改造

修改 `src/app/tasks/page.tsx`：
- `parsedTask` state 改为 `parsedTasks: ParsedTask[]`
- `handleTaskParsed` 接收 `{ tasks: ParsedTask[] }` 格式
- 弹窗组件替换为 `TaskBatchConfirmModal`

### LOG-2: 批量保存逻辑

- `handleSaveTasks` 接收 `ParsedTask[]` 数组
- POST 到 `/api/tasks` 使用 `{ tasks: [...] }` 格式
- 保存成功后关闭弹窗、清空状态、刷新列表

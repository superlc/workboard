## 任务 API 批量支持

### TASK-API-1: 批量创建端点

修改 `src/app/api/tasks/route.ts` 的 POST handler：
- 检测请求体是否包含 `tasks` 数组字段
- 如果有 → 批量创建模式，使用事务插入所有任务
- 如果没有 → 兼容旧的单任务创建模式
- 批量模式返回 `{ tasks: Task[] }`，单任务模式返回不变

### TASK-API-2: 数据层批量函数

在 `src/lib/tasks.ts` 新增 `createTasks(tasks: Task[]): Task[]`：
- 使用 `db.transaction` 保证原子性
- 复用 insert prepared statement
- 返回带ID的任务数组

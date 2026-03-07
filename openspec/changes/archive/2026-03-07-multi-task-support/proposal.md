## 变更概述

**名称**: multi-task-support  
**目标**: 让用户一次输入可以包含多条任务记录，API 和前端完整支持多任务解析、确认和批量保存。

## 问题

当前系统只支持单任务流程：
1. API prompt 要求 AI 返回单个 JSON 对象
2. 前端确认弹窗只渲染单个任务的表单
3. 保存接口逐条提交

当用户输入 "上午10点修了Bug，下午2点开会1小时" 时，要么只识别第一个任务，要么 AI 返回数组导致前端异常。

## 方案

### API 层
- 修改 `/api/parse` 的 prompt，要求 AI **始终**返回 `{ "tasks": [...] }` 数组格式
- 单条输入也统一为数组（长度为1），保持前端处理逻辑一致
- 新增 `/api/tasks` POST 端点支持批量创建（接受 `{ tasks: [...] }` 数组体）

### 前端层
- `TaskInput` 回调类型改为传递任务数组
- 新建 `TaskBatchConfirmModal` 替代原有的 `TaskConfirmationModal`，以列表形式展示所有解析出的任务，每条可独立编辑/删除
- `LogPage` 适配多任务流程：批量确认 → 批量保存 → 刷新列表

## 影响范围

| 文件 | 变更类型 |
|------|---------|
| `src/app/api/parse/route.ts` | 修改 prompt 和响应归一化 |
| `src/app/api/tasks/route.ts` | 新增批量 POST 支持 |
| `src/lib/tasks.ts` | 新增 `createTasks` 批量写入函数 |
| `src/components/task-logger/TaskBatchConfirmModal.tsx` | 新增 |
| `src/components/task-logger/TaskConfirmationModal.tsx` | 删除（被替代） |
| `src/app/tasks/page.tsx` | 适配多任务数据流 |

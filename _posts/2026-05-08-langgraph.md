---
layout: post
title: "LangGraph"
categories: AI
tags: AI
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}

## 一、LangGraph 概述

### 1.1 什么是 LangGraph？

**LangGraph** 是一个用于构建有状态、多步骤 AI 应用和自主智能体的低级编排框架。它将 Agent 工作流建模为**有向图**，通过节点（Nodes）和边（Edges）的组合，实现对复杂 AI 工作流的精确控制。

**核心定位：** LangGraph 专注于 Agent **编排（Orchestration）**，提供持久化执行、流式输出、人工干预等底层基础设施。

### 1.2 LangChain 生态中的定位

```
┌──────────────────────────────────────────────────┐
│              LangChain 产品体系                    │
├──────────────────────────────────────────────────┤
│  Deep Agents    │ 开箱即用的 Agent，最上层抽象       │
│  LangChain      │ Agent 框架：模型/工具/Agent 抽象   │
│  LangGraph      │ 编排运行时：持久化/流式/人工干预    │
│  LangSmith      │ 可观测性平台：追踪/评估/部署        │
│  LangSmith Fleet│ 无代码 Agent 构建器               │
└──────────────────────────────────────────────────┘
```

**LangGraph 与 LangChain 的关系：**

| 维度 | LangChain | LangGraph |
|------|-----------|-----------|
| **定位** | Agent 框架 | 编排运行时 |
| **抽象层级** | 中等（组件化） | 低级（图结构） |
| **核心能力** | 模型/工具/链 | 状态管理/流程控制/持久化 |
| **使用方式** | 可独立使用 | 可独立使用（不需要 LangChain） |
| **适合场景** | 快速构建 Agent | 复杂有状态工作流 |

### 1.3 为什么需要 LangGraph？

传统 Agent 框架（如 LangChain 的 ReAct Agent）存在以下局限：

| 问题 | 说明 | LangGraph 解决方案 |
|------|------|-------------------|
| **流程不可控** | Agent 自主循环，难以精确控制 | 图结构定义流程，条件路由精确控制 |
| **状态管理弱** | 依赖 Memory 类，难以管理复杂状态 | 内置 State 机制，支持 Reducer 聚合 |
| **无持久化** | 进程崩溃后状态丢失 | Checkpoint 持久化，断点恢复 |
| **无法人工干预** | Agent 全自动，关键决策无法暂停 | interrupt() 动态中断 + Human-in-the-loop |
| **循环工作流难** | 依赖递归或 while 循环 | 图天然支持循环（边可指回已访问节点） |

### 1.4 核心能力

- **持久化执行（Durable Execution）**：Agent 持久通过故障，可长时间运行并从断点恢复
- **人工干预（Human-in-the-loop）**：在任意节点暂停，等待人工审核后继续
- **全面记忆（Comprehensive Memory）**：短期工作记忆 + 跨会话长期记忆
- **流式输出（Streaming）**：多种流模式（Token、状态更新、自定义数据）
- **生产级部署**：LangGraph Platform 提供 Server、Studio、Cloud 部署方案

### 1.5 LangGraph vs 其他编排框架

| 特性 | LangGraph | Temporal + AI | CrewAI | AutoGen |
|------|-----------|--------------|--------|---------|
| **编排方式** | 有向图 | 工作流引擎 | 角色协作 | 对话驱动 |
| **状态管理** | 内置 State + Checkpoint | 外部持久化 | 有限 | 有限 |
| **人工干预** | 原生支持 | 支持 | 不支持 | 部分 |
| **灵活性** | 极高（低级API） | 高 | 中 | 中 |
| **学习曲线** | 较陡 | 陡 | 平缓 | 平缓 |
| **LLM 集成** | LangChain 生态 | 需自建 | 内置 | 内置 |

### 1.6 学习资源

| 资源类型 | 链接 | 说明 |
|---------|------|------|
| 官方文档 | https://docs.langchain.com/oss/python/langgraph/overview | 最权威的参考 |
| GitHub | https://github.com/langchain-ai/langgraph | 源码和示例 |
| 中文教程 | https://github.langchain.ac.cn/langgraph/tutorials/ | 中文翻译版本 |
| LangChain Academy | LangChain 官方课程 | 交互式学习 |

---

## 二、环境安装与配置

### 2.1 基础安装

```bash
# 使用 pip 安装
pip install -U langgraph

# 安装时包含 LangChain 集成
pip install -U "langgraph[langchain]"
```

**环境要求：Python 3.10+**

### 2.2 与 LangChain 集成安装

```bash
# OpenAI 集成
pip install -U langchain-openai langgraph

# Anthropic 集成
pip install -U langchain-anthropic langgraph

# 社区工具集成
pip install -U langchain-community langgraph
```

### 2.3 配置追踪（LangSmith）

```python
import os

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-langsmith-key"
os.environ["LANGSMITH_PROJECT"] = "langgraph-project"
```

### 2.4 Hello World 示例

```python
from langgraph.graph import StateGraph, MessagesState, START, END

def mock_llm(state: MessagesState):
    return {"messages": [{"role": "ai", "content": "hello world"}]}

graph = StateGraph(MessagesState)
graph.add_node(mock_llm)
graph.add_edge(START, "mock_llm")
graph.add_edge("mock_llm", END)
graph = graph.compile()

result = graph.invoke({"messages": [{"role": "user", "content": "hi!"}]})
print(result)
```

---

## 三、核心概念详解

### 3.1 状态（State）

#### 3.1.1 基本概念

**State** 是图的核心数据结构，表示应用在任意时刻的快照。所有节点读取和更新同一个 State。

#### 3.1.2 定义 State

**方式一：TypedDict（最常用）**

```python
from typing import TypedDict, Annotated
from typing_extensions import TypedDict
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]  # 累加模式：新消息追加到列表
    current_step: str                         # 覆盖模式：新值直接替换旧值
    results: Annotated[list, operator.add]    # 累加模式
```

**方式二：dataclass（支持默认值）**

```python
from dataclasses import dataclass, field

@dataclass
class AgentState:
    messages: list = field(default_factory=list)
    current_step: str = "init"
    results: list = field(default_factory=list)
```

**方式三：Pydantic BaseModel（数据验证）**

```python
from pydantic import BaseModel, Field

class AgentState(BaseModel):
    messages: list = Field(default_factory=list)
    current_step: str = "init"
    results: list = Field(default_factory=list)
```

#### 3.1.3 Reducer 机制

Reducer 决定节点返回的更新如何应用到 State：

| Reducer 类型 | 说明 | 示例 |
|-------------|------|------|
| **默认（无 Reducer）** | 新值直接覆盖旧值 | `current_step: str` → 新值替换旧值 |
| **operator.add** | 列表累加 | `messages: Annotated[list, add]` → 新消息追加 |
| **自定义 Reducer** | 自定义合并逻辑 | 传入任意函数 |

```python
from typing import Annotated, TypedDict
from operator import add

def merge_dicts(existing: dict, new: dict) -> dict:
    """自定义 Reducer：合并字典"""
    return {**existing, **new}

class State(TypedDict):
    # 覆盖模式
    query: str
    # 累加模式
    messages: Annotated[list, add]
    # 自定义 Reducer
    metadata: Annotated[dict, merge_dicts]
```

#### 3.1.4 多 Schema 设计

LangGraph 支持定义不同的输入、输出和内部 Schema：

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class InputState(TypedDict):
    user_input: str

class OutputState(TypedDict):
    graph_output: str

class OverallState(TypedDict):
    foo: str
    user_input: str
    graph_output: str

class PrivateState(TypedDict):
    bar: str  # 节点间内部通信，不暴露给外部

def node_1(state: InputState) -> OverallState:
    return {"foo": state["user_input"] + " name"}

def node_2(state: OverallState) -> PrivateState:
    return {"bar": state["foo"] + " is"}

def node_3(state: PrivateState) -> OutputState:
    return {"graph_output": state["bar"] + " Lance"}

builder = StateGraph(OverallState, input_schema=InputState, output_schema=OutputState)
builder.add_node("node_1", node_1)
builder.add_node("node_2", node_2)
builder.add_node("node_3", node_3)
builder.add_edge(START, "node_1")
builder.add_edge("node_1", "node_2")
builder.add_edge("node_2", "node_3")
builder.add_edge("node_3", END)

graph = builder.compile()
result = graph.invoke({"user_input": "My"})
# {'graph_output': 'My name is Lance'}
```

---

### 3.2 节点（Nodes）

#### 3.2.1 基本概念

**Nodes（节点）** 是图中的计算单元，封装 Agent 的逻辑。每个节点是一个函数，接收当前 State，执行计算，返回 State 更新。

> 核心原则：**节点做工作，边决定下一步**

#### 3.2.2 定义节点

```python
from typing import TypedDict

class State(TypedDict):
    messages: list
    count: int

# 最简单的节点：普通函数
def analyze_node(state: State):
    """分析用户输入"""
    return {"count": state["count"] + 1}

# 使用 LLM 的节点
def llm_node(state: State):
    from langchain_openai import ChatOpenAI
    llm = ChatOpenAI(model="gpt-4")
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# 带副作用的节点
def log_node(state: State):
    """记录日志（副作用节点）"""
    print(f"当前步骤: count={state['count']}")
    return {}  # 不更新 State
```

#### 3.2.3 添加节点到图

```python
from langgraph.graph import StateGraph, START, END

graph = StateGraph(State)

# 方式 1：函数名作为节点名
graph.add_node(analyze_node)

# 方式 2：指定节点名
graph.add_node("analyzer", analyze_node)

# 方式 3：链式添加
graph = (
    StateGraph(State)
    .add_node("analyze", analyze_node)
    .add_node("search", search_node)
    .add_node("generate", generate_node)
)
```

---

### 3.3 边（Edges）

#### 3.3.1 基本边类型

| 边类型 | 说明 | 示例 |
|--------|------|------|
| **普通边** | 固定从一个节点到另一个节点 | `A → B` |
| **条件边** | 根据条件路由到不同节点 | `A → B or C` |
| **START 边** | 图的入口 | `START → A` |
| **END 边** | 图的出口 | `A → END` |

#### 3.3.2 普通边

```python
from langgraph.graph import StateGraph, START, END

graph = StateGraph(State)

# 固定流转
graph.add_edge(START, "analyze")
graph.add_edge("analyze", "search")
graph.add_edge("search", "generate")
graph.add_edge("generate", END)
```

#### 3.3.3 条件边

条件边是 LangGraph 的核心能力，允许根据 State 动态选择下一个节点。

```python
def route_by_intent(state: State) -> str:
    """根据意图路由到不同节点"""
    if state["intent"] == "search":
        return "search_node"
    elif state["intent"] == "calculate":
        return "calculate_node"
    else:
        return "chat_node"

# 添加条件边
graph.add_conditional_edges(
    "analyze",          # 源节点
    route_by_intent,    # 路由函数
    {                   # 路由映射（可选，用于验证）
        "search_node": "search_node",
        "calculate_node": "calculate_node",
        "chat_node": "chat_node"
    }
)
```

#### 3.3.4 循环边

LangGraph 的图天然支持循环——边可以指回已访问的节点：

```python
def should_continue(state: State) -> str:
    """决定是否继续循环"""
    if state["iteration"] < state["max_iterations"] and not state["task_complete"]:
        return "agent"  # 继续循环
    return END           # 结束

graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", should_continue, {"agent": "agent", END: END})
```

---

### 3.4 编译与执行

#### 3.4.1 编译图

图**必须编译**后才能使用。编译过程会检查图的结构完整性（如孤立节点等），并配置运行时参数。

```python
# 基础编译
app = graph.compile()

# 带 Checkpointer 编译（启用持久化）
from langgraph.checkpoint.memory import InMemorySaver
checkpointer = InMemorySaver()
app = graph.compile(checkpointer=checkpointer)

# 带断点编译（在指定节点前暂停）
app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["approval_node"]  # 在 approval_node 之前暂停
)
```

#### 3.4.2 执行方法

| 方法 | 说明 | 使用场景 |
|------|------|----------|
| `invoke(input)` | 同步执行，返回最终结果 | 最常用 |
| `stream(input)` | 流式执行，逐步返回 | 实时反馈 |
| `ainvoke(input)` | 异步执行 | 高并发 |
| `astream(input)` | 异步流式执行 | 高并发 + 实时反馈 |

```python
# 同步执行
result = app.invoke({"messages": [{"role": "user", "content": "Hello"}]})

# 流式执行
for chunk in app.stream({"messages": [...]}, stream_mode="updates"):
    print(chunk)

# 异步执行
result = await app.ainvoke({"messages": [...]})
```

---

### 3.5 MessagesState 快捷状态

LangGraph 提供了预定义的 `MessagesState`，专为聊天场景优化：

```python
from langgraph.graph import StateGraph, MessagesState, START, END

# MessagesState 等价于：
# class MessagesState(TypedDict):
#     messages: Annotated[list, add]  # 自动累加消息

def chatbot(state: MessagesState):
    from langchain_openai import ChatOpenAI
    llm = ChatOpenAI(model="gpt-4")
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

graph = StateGraph(MessagesState)
graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

app = graph.compile()
result = app.invoke({"messages": [{"role": "user", "content": "Hello!"}]})
```

---

## 四、持久化与记忆

### 4.1 为什么需要持久化？

| 功能 | 说明 |
|------|------|
| **人工干预** | 暂停执行，等待人工审核后继续 |
| **对话记忆** | 同一线程的多轮对话保持上下文 |
| **时间旅行** | 回溯到历史状态，探索不同路径 |
| **容错恢复** | 节点失败后从最近检查点恢复 |

### 4.2 Checkpointer 配置

#### 4.2.1 内存 Checkpointer（开发调试）

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
app = graph.compile(checkpointer=checkpointer)

# 使用时必须指定 thread_id
config = {"configurable": {"thread_id": "thread-1"}}
result = app.invoke({"messages": [...]}, config=config)
```

#### 4.2.2 SQLite Checkpointer（本地持久化）

```python
from langgraph.checkpoint.sqlite import SqliteSaver

# 同步版本
with SqliteSaver.from_conn_string("checkpoints.db") as checkpointer:
    app = graph.compile(checkpointer=checkpointer)
    result = app.invoke({"messages": [...]}, config=config)

# 异步版本
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
async with AsyncSqliteSaver.from_conn_string("checkpoints.db") as checkpointer:
    app = graph.compile(checkpointer=checkpointer)
    result = await app.ainvoke({"messages": [...]}, config=config)
```

#### 4.2.3 PostgreSQL Checkpointer（生产推荐）

```python
from langgraph.checkpoint.postgres import PostgresSaver

# 同步版本
conn_string = "postgresql://user:pass@localhost:5432/langgraph"
with PostgresSaver.from_conn_string(conn_string) as checkpointer:
    checkpointer.setup()  # 首次使用需创建表
    app = graph.compile(checkpointer=checkpointer)

# 异步版本（生产推荐）
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
async with AsyncPostgresSaver.from_conn_string(conn_string) as checkpointer:
    await checkpointer.setup()
    app = graph.compile(checkpointer=checkpointer)
```

#### 4.2.4 Checkpointer 选型对比

| Checkpointer | 适用场景 | 持久化 | 性能 | 并发支持 |
|-------------|---------|--------|------|---------|
| `InMemorySaver` | 开发调试 | 否（进程内） | 最快 | 单进程 |
| `SqliteSaver` | 本地/单机 | 是 | 中等 | 单进程 |
| `PostgresSaver` | 生产环境 | 是 | 高 | 多进程 |

### 4.3 Thread 与 Checkpoint

```
┌───────────────────────────────────────┐
│  Thread (thread_id = "session-001")    │
│                                       │
│  Checkpoint 1: START 状态             │
│      ↓                                │
│  Checkpoint 2: node_a 执行后          │
│      ↓                                │
│  Checkpoint 3: node_b 执行后          │
│      ↓                                │
│  Checkpoint 4: 最终状态               │
└───────────────────────────────────────┘
```

```python
# 获取最新状态
state_snapshot = app.get_state(config)
print(state_snapshot.values)    # 当前 State 值
print(state_snapshot.next)      # 下一个要执行的节点

# 获取历史检查点
state_history = list(app.get_state_history(config))
for snapshot in state_history:
    print(f"Step {snapshot.metadata['step']}: {snapshot.values}")

# 获取特定检查点
config_with_checkpoint = {
    "configurable": {
        "thread_id": "thread-1",
        "checkpoint_id": "1ef663ba-28fe-6528-8002-5a559208592c"
    }
}
snapshot = app.get_state(config_with_checkpoint)
```

### 4.4 长期记忆（Long-term Memory）

LangGraph 区分两种记忆：

| 记忆类型 | 实现方式 | 作用域 | 用途 |
|---------|---------|--------|------|
| **短期记忆** | Checkpointer | 单线程（Thread） | 对话上下文 |
| **长期记忆** | BaseStore | 跨线程（全局） | 用户偏好、知识积累 |

```python
from langgraph.store.memory import InMemoryStore
from langgraph.store.base import BaseStore

# 创建 Store
store = InMemoryStore()

# 写入长期记忆
store.put(
    namespace=("users", "user_123", "preferences"),
    key="language",
    value={"preferred": "zh-CN", "level": "native"}
)

# 读取长期记忆
memory = store.get(("users", "user_123", "preferences"), "language")
print(memory.value)  # {'preferred': 'zh-CN', 'level': 'native'}

# 搜索长期记忆
memories = store.search(("users", "user_123", "preferences"))
for m in memories:
    print(m.key, m.value)

# 在节点中使用 Store
def memory_aware_node(state: State, *, store: BaseStore):
    # 读取用户偏好
    pref = store.get(("users", state["user_id"], "preferences"), "language")
    # 基于偏好处理...
    # 更新长期记忆
    store.put(("users", state["user_id"], "history"), "last_query", {"value": state["query"]})
    return {"result": "processed"}
```

---

## 五、人工干预（Human-in-the-Loop）

### 5.1 interrupt() 动态中断

`interrupt()` 是 LangGraph 的核心人工干预机制，可在节点内任意位置暂停执行。

```python
from langgraph.types import interrupt, Command
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

class State(TypedDict):
    input: str
    approved: bool
    result: str

def approval_node(state: State):
    # 暂停执行，等待人工审核
    approved = interrupt("请确认是否执行此操作？")
    # 当恢复执行时，Command(resume=...) 的值会成为 interrupt() 的返回值
    if approved:
        return {"approved": True, "result": "操作已执行"}
    else:
        return {"approved": False, "result": "操作已取消"}

graph = StateGraph(State)
graph.add_node("approval", approval_node)
graph.add_edge(START, "approval")
graph.add_edge("approval", END)

app = graph.compile(checkpointer=InMemorySaver())

# 第一次调用：遇到 interrupt 暂停
config = {"configurable": {"thread_id": "1"}}
result = app.invoke({"input": "删除数据库"}, config=config)
# result 包含 __interrupt__ 信息

# 恢复执行：传入人工审核结果
result = app.invoke(Command(resume=True), config=config)
print(result["result"])  # "操作已执行"
```

### 5.2 审批工作流

```python
from typing import Literal
from langgraph.types import interrupt, Command

def approval_node(state: State) -> Command[Literal["proceed", "cancel"]]:
    """审批节点：暂停等待人工决策"""
    approved = interrupt({
        "question": "是否批准此操作？",
        "action": state["proposed_action"],
        "risk_level": state.get("risk_level", "medium")
    })
    
    if approved:
        return Command(goto="proceed", update={"approved": True})
    else:
        return Command(goto="cancel", update={"approved": False})

# 构建审批工作流
graph = StateGraph(State)
graph.add_node("plan", plan_node)
graph.add_node("approval", approval_node)
graph.add_node("proceed", execute_node)
graph.add_node("cancel", cancel_node)

graph.add_edge(START, "plan")
graph.add_edge("plan", "approval")
graph.add_edge("proceed", END)
graph.add_edge("cancel", END)
```

### 5.3 工具调用审核

```python
from langgraph.types import interrupt

def tool_node(state: State):
    """工具执行节点：执行前暂停审核"""
    tool_calls = state["messages"][-1].tool_calls
    
    results = []
    for tool_call in tool_calls:
        # 危险工具需要人工确认
        if tool_call["name"] in ["delete_database", "send_email", "make_payment"]:
            approved = interrupt({
                "type": "tool_approval",
                "tool": tool_call["name"],
                "args": tool_call["args"]
            })
            if not approved:
                results.append(f"工具 {tool_call['name']} 被拒绝执行")
                continue
        
        # 执行工具
        result = execute_tool(tool_call)
        results.append(result)
    
    return {"messages": results}
```

### 5.4 多中断处理

```python
from typing import Annotated
import operator
from langgraph.types import interrupt, Command

class State(TypedDict):
    vals: Annotated[list[str], operator.add]

def node_a(state):
    answer = interrupt("question_a")
    return {"vals": [f"a:{answer}"]}

def node_b(state):
    answer = interrupt("question_b")
    return {"vals": [f"b:{answer}"]}

graph = (
    StateGraph(State)
    .add_node("a", node_a)
    .add_node("b", node_b)
    .add_edge(START, "a")
    .add_edge(START, "b")   # 并行执行
    .add_edge("a", END)
    .add_edge("b", END)
    .compile(checkpointer=InMemorySaver())
)

config = {"configurable": {"thread_id": "1"}}
result = graph.invoke({"vals": []}, config)
# 两个并行节点同时触发 interrupt

# 一次性恢复所有中断
resume_map = {
    i.id: f"answer for {i.value}"
    for i in result["__interrupt__"]
}
result = graph.invoke(Command(resume=resume_map), config)
```

---

## 六、流式输出

### 6.1 流模式概览

LangGraph 提供多种流模式，通过 `stream_mode` 参数控制：

| 模式 | 类型 | 说明 |
|------|------|------|
| `values` | ValuesStreamPart | 每步之后的完整 State |
| `updates` | UpdatesStreamPart | 每步之后的 State 增量更新 |
| `messages` | MessagesStreamPart | LLM Token 级别流式输出 |
| `custom` | CustomStreamPart | 节点自定义流式数据 |
| `checkpoints` | CheckpointStreamPart | 检查点事件 |
| `tasks` | TasksStreamPart | 任务开始/完成事件 |

### 6.2 基础流式输出

```python
# v2 格式（推荐，LangGraph >= 1.1）
for chunk in graph.stream(
    {"topic": "ice cream"},
    stream_mode=["updates", "custom"],
    version="v2",
):
    if chunk["type"] == "updates":
        for node_name, state in chunk["data"].items():
            print(f"Node {node_name} updated: {state}")
    elif chunk["type"] == "custom":
        print(f"Status: {chunk['data']['status']}")
```

### 6.3 Token 级流式输出

```python
for chunk in graph.stream(
    {"messages": [{"role": "user", "content": "讲个笑话"}]},
    stream_mode="messages",
    version="v2",
):
    if chunk["type"] == "messages":
        msg, metadata = chunk["data"]
        if hasattr(msg, 'content') and msg.content:
            print(msg.content, end="", flush=True)
```

### 6.4 自定义流式数据

```python
from langgraph.config import get_stream_writer

class State(TypedDict):
    topic: str
    joke: str

def generate_joke(state: State):
    # 使用 stream_writer 发送自定义进度数据
    writer = get_stream_writer()
    writer({"status": "thinking of a joke...", "progress": 30})
    
    # ... 执行 LLM 调用 ...
    
    writer({"status": "generating punchline...", "progress": 70})
    return {"joke": "Why did the ice cream go to school? To get a sundae education!"}
```

### 6.5 异步流式输出

```python
# 异步流式
async for chunk in graph.astream(
    {"messages": [...]},
    stream_mode=["messages", "updates"],
    version="v2",
):
    if chunk["type"] == "messages":
        msg, _ = chunk["data"]
        if hasattr(msg, 'content') and msg.content:
            print(msg.content, end="", flush=True)
    elif chunk["type"] == "updates":
        if "__interrupt__" in chunk["data"]:
            # 处理中断
            interrupt_info = chunk["data"]["__interrupt__"][0].value
            user_response = get_user_input(interrupt_info)
```

---

## 七、子图（Subgraphs）

### 7.1 基本概念

子图允许将复杂工作流分解为模块化的子组件，每个子图拥有独立的状态管理。

```python
from langgraph.graph import StateGraph, START, END

# 子图：文档分析
class DocAnalysisState(TypedDict):
    document: str
    summary: str
    keywords: list[str]

def summarize(state: DocAnalysisState):
    return {"summary": "文档摘要..."}

def extract_keywords(state: DocAnalysisState):
    return {"keywords": ["AI", "机器学习"]}

doc_analysis_graph = StateGraph(DocAnalysisState)
doc_analysis_graph.add_node("summarize", summarize)
doc_analysis_graph.add_node("extract_keywords", extract_keywords)
doc_analysis_graph.add_edge(START, "summarize")
doc_analysis_graph.add_edge("summarize", "extract_keywords")
doc_analysis_graph.add_edge("extract_keywords", END)
doc_analysis = doc_analysis_graph.compile()

# 父图：引用子图
class ParentState(TypedDict):
    document: str
    analysis_result: str
    final_report: str

def generate_report(state: ParentState):
    return {"final_report": f"报告：{state.get('analysis_result', '')}"}

parent_graph = StateGraph(ParentState)
parent_graph.add_node("doc_analysis", doc_analysis)  # 将子图作为节点添加
parent_graph.add_node("report", generate_report)
parent_graph.add_edge(START, "doc_analysis")
parent_graph.add_edge("doc_analysis", "report")
parent_graph.add_edge("report", END)

app = parent_graph.compile()
```

### 7.2 子图状态转换

子图和父图可以使用不同的 State，需要通过转换函数映射：

```python
def doc_analysis_node(state: ParentState):
    """手动调用子图并转换状态"""
    # 从父图状态提取子图输入
    sub_input = {"document": state["document"]}
    # 调用子图
    sub_result = doc_analysis.invoke(sub_input)
    # 将子图输出映射回父图状态
    return {"analysis_result": f"{sub_result['summary']} | {sub_result['keywords']}"}

parent_graph.add_node("doc_analysis", doc_analysis_node)
```

---

## 八、实战案例

### 8.1 带工具的对话 Agent

这是 LangGraph 最经典的用例——构建一个能使用工具、保持对话记忆的 Agent。

```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.precondition import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

# 1. 定义状态
class State(TypedDict):
    messages: Annotated[list, add_messages]

# 2. 定义工具
@tool
def get_weather(city: str) -> str:
    """获取指定城市的天气"""
    weather_data = {"北京": "晴天 25°C", "上海": "多云 28°C"}
    return weather_data.get(city, f"暂无{city}的天气信息")

@tool
def calculate(expression: str) -> str:
    """计算数学表达式"""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"计算错误: {e}"

tools = [get_weather, calculate]

# 3. 初始化模型
llm = ChatOpenAI(model="gpt-4")
llm_with_tools = llm.bind_tools(tools)

# 4. 定义节点
def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

# 5. 定义路由
def should_use_tools(state: State) -> str:
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

# 6. 构建图
graph = StateGraph(State)
graph.add_node("chatbot", chatbot)
graph.add_node("tools", ToolNode(tools))

graph.add_edge(START, "chatbot")
graph.add_conditional_edges("chatbot", should_use_tools, {"tools": "tools", END: END})
graph.add_edge("tools", "chatbot")  # 工具执行后回到 chatbot

# 7. 编译（带持久化）
app = graph.compile(checkpointer=InMemorySaver())

# 8. 使用
config = {"configurable": {"thread_id": "chat-1"}}

# 第一轮对话
result = app.invoke({"messages": [{"role": "user", "content": "北京天气如何？"}]}, config)
print(result["messages"][-1].content)

# 第二轮对话（保持记忆）
result = app.invoke({"messages": [{"role": "user", "content": "和上海比呢？"}]}, config)
print(result["messages"][-1].content)
```

### 8.2 RAG 智能体（Agentic RAG）

结合检索和 Agent 的自主决策能力，实现智能文档问答。

```python
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import InMemorySaver
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate

class RAGState(TypedDict):
    messages: Annotated[list, add_messages]
    context: str
    query_type: str

# 初始化向量库
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_texts(
    texts=["LangChain 是 AI 应用框架", "LangGraph 是编排框架", "RAG 是检索增强生成"],
    embedding=embeddings
)

@tool
def search_documents(query: str) -> str:
    """搜索知识库文档"""
    docs = vectorstore.similarity_search(query, k=3)
    return "\n\n".join([doc.page_content for doc in docs])

@tool
def classify_query(query: str) -> str:
    """分类查询类型"""
    if "什么是" in query or "解释" in query:
        return "definition"
    elif "如何" in query or "怎么做" in query:
        return "howto"
    else:
        return "general"

# 构建 RAG Agent
llm = ChatOpenAI(model="gpt-4", temperature=0)
llm_with_tools = llm.bind_tools([search_documents, classify_query])

def agent_node(state: RAGState):
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

def generate_answer(state: RAGState):
    """基于检索上下文生成答案"""
    from langgraph.precondition import ToolNode
    prompt = ChatPromptTemplate.from_template(
        "基于以下上下文回答问题：\n\n{context}\n\n问题：{question}\n\n答案："
    )
    chain = prompt | llm
    last_human = [m for m in state["messages"] if m.type == "human"][-1]
    answer = chain.invoke({"context": state.get("context", ""), "question": last_human.content})
    return {"messages": [answer]}

def should_continue(state: RAGState):
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return "generate"

def update_context(state: RAGState):
    """从工具结果中提取上下文"""
    tool_messages = [m for m in state["messages"] if m.type == "tool"]
    if tool_messages:
        return {"context": tool_messages[-1].content}
    return {}

graph = StateGraph(RAGState)
graph.add_node("agent", agent_node)
graph.add_node("tools", ToolNode([search_documents, classify_query]))
graph.add_node("update_context", update_context)
graph.add_node("generate", generate_answer)

graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", "generate": "generate"})
graph.add_edge("tools", "update_context")
graph.add_edge("update_context", "agent")
graph.add_edge("generate", END)

app = graph.compile(checkpointer=InMemorySaver())
```

### 8.3 多 Agent 系统

#### 8.3.1 Supervisor 模式

```python
from typing import Annotated, TypedDict, Literal
import operator
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage

class SupervisorState(TypedDict):
    messages: Annotated[list, add_messages]
    next_agent: str

llm = ChatOpenAI(model="gpt-4")

def supervisor(state: SupervisorState):
    """主管 Agent：决定将任务分配给哪个专家"""
    system_prompt = """你是一个任务调度器。根据用户的需求，选择最合适的专家：
    - researcher: 负责信息检索和研究
    - writer: 负责内容撰写
    - coder: 负责代码相关任务
    
    请只返回专家名称。"""
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        *state["messages"]
    ])
    
    agent_name = response.content.strip().lower()
    valid_agents = ["researcher", "writer", "coder"]
    
    return {"next_agent": agent_name if agent_name in valid_agents else "researcher"}

def researcher(state: SupervisorState):
    response = llm.invoke([
        SystemMessage(content="你是研究专家，负责收集和分析信息。"),
        *state["messages"]
    ])
    return {"messages": [response], "next_agent": "supervisor"}

def writer(state: SupervisorState):
    response = llm.invoke([
        SystemMessage(content="你是内容撰写专家，负责生成高质量文本。"),
        *state["messages"]
    ])
    return {"messages": [response], "next_agent": "supervisor"}

def coder(state: SupervisorState):
    response = llm.invoke([
        SystemMessage(content="你是编程专家，负责代码相关任务。"),
        *state["messages"]
    ])
    return {"messages": [response], "next_agent": "supervisor"}

def route_to_agent(state: SupervisorState) -> str:
    return state["next_agent"]

# 构建图
graph = StateGraph(SupervisorState)
graph.add_node("supervisor", supervisor)
graph.add_node("researcher", researcher)
graph.add_node("writer", writer)
graph.add_node("coder", coder)

graph.add_edge(START, "supervisor")
graph.add_conditional_edges("supervisor", route_to_agent, {
    "researcher": "researcher",
    "writer": "writer",
    "coder": "coder",
    "supervisor": END  # 防止无限循环
})
graph.add_edge("researcher", "supervisor")
graph.add_edge("writer", "supervisor")
graph.add_edge("coder", "supervisor")

app = graph.compile()
```

#### 8.3.2 Network 模式（多 Agent 协作）

```python
class NetworkState(TypedDict):
    messages: Annotated[list, add_messages]
    task: str
    current_results: Annotated[list, operator.add]

def researcher_a(state: NetworkState):
    """研究员A：技术视角"""
    response = llm.invoke(f"从技术角度分析：{state['task']}")
    return {"current_results": [{"agent": "researcher_a", "content": response.content}]}

def researcher_b(state: NetworkState):
    """研究员B：商业视角"""
    response = llm.invoke(f"从商业角度分析：{state['task']}")
    return {"current_results": [{"agent": "researcher_b", "content": response.content}]}

def synthesizer(state: NetworkState):
    """综合器：合并所有研究结果"""
    all_research = "\n".join([f"- {r['agent']}: {r['content']}" for r in state["current_results"]])
    response = llm.invoke(f"综合以下研究结果，给出最终结论：\n{all_research}")
    return {"messages": [response]}

graph = StateGraph(NetworkState)
graph.add_node("researcher_a", researcher_a)
graph.add_node("researcher_b", researcher_b)
graph.add_node("synthesizer", synthesizer)

graph.add_edge(START, "researcher_a")
graph.add_edge(START, "researcher_b")  # 并行执行
graph.add_edge("researcher_a", "synthesizer")
graph.add_edge("researcher_b", "synthesizer")
graph.add_edge("synthesizer", END)

app = graph.compile()
```

### 8.4 反思与自我改进 Agent

```python
from typing import TypedDict

class ReflectionState(TypedDict):
    task: str
    draft: str
    critique: str
    revision_count: int
    final_output: str

def generate_draft(state: ReflectionState):
    """生成初稿"""
    response = llm.invoke(f"请完成以下任务：{state['task']}")
    return {"draft": response.content}

def critique_draft(state: ReflectionState):
    """批评初稿"""
    response = llm.invoke(f"""请批评以下内容，指出不足和改进方向：

{state['draft']}

请从以下维度批评：
1. 准确性
2. 完整性
3. 清晰度
4. 改进建议""")
    return {"critique": response.content}

def revise_draft(state: ReflectionState):
    """根据批评修改初稿"""
    response = llm.invoke(f"""请根据以下批评修改内容：

原文：
{state['draft']}

批评意见：
{state['critique']}

请输出修改后的版本：""")
    return {
        "draft": response.content,
        "revision_count": state["revision_count"] + 1
    }

def should_continue(state: ReflectionState) -> str:
    """决定是否继续修改"""
    if state["revision_count"] >= 3:
        return "finalize"
    # 检查批评是否仍需要重大修改
    if "重大修改" in state["critique"] or "严重不足" in state["critique"]:
        return "revise"
    return "finalize"

def finalize(state: ReflectionState):
    return {"final_output": state["draft"]}

# 构建反思循环图
graph = StateGraph(ReflectionState)
graph.add_node("generate", generate_draft)
graph.add_node("critique", critique_draft)
graph.add_node("revise", revise_draft)
graph.add_node("finalize", finalize)

graph.add_edge(START, "generate")
graph.add_edge("generate", "critique")
graph.add_conditional_edges("critique", should_continue, {
    "revise": "revise",
    "finalize": "finalize"
})
graph.add_edge("revise", "critique")  # 修改后再次批评（循环）
graph.add_edge("finalize", END)

app = graph.compile()
```

### 8.5 审批工作流系统

```python
from typing import TypedDict, Literal
from langgraph.types import interrupt, Command
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

class ApprovalState(TypedDict):
    request: str
    amount: float
    risk_level: str
    approver_comments: list[str]
    status: str

def assess_risk(state: ApprovalState):
    """评估风险等级"""
    if state["amount"] > 100000:
        risk = "high"
    elif state["amount"] > 10000:
        risk = "medium"
    else:
        risk = "low"
    return {"risk_level": risk}

def auto_approve(state: ApprovalState):
    """低风险自动审批"""
    return {"status": "approved", "approver_comments": ["低风险自动审批通过"]}

def manual_approval(state: ApprovalState):
    """人工审批"""
    decision = interrupt({
        "type": "approval_request",
        "request": state["request"],
        "amount": state["amount"],
        "risk_level": state["risk_level"],
        "message": "请审批此请求"
    })
    
    if decision.get("approved"):
        return {
            "status": "approved",
            "approver_comments": state.get("approver_comments", []) + [decision.get("comment", "")]
        }
    else:
        return {
            "status": "rejected",
            "approver_comments": state.get("approver_comments", []) + [decision.get("comment", "拒绝")]
        }

def route_by_risk(state: ApprovalState) -> str:
    if state["risk_level"] == "low":
        return "auto_approve"
    return "manual_approval"

# 构建审批图
graph = StateGraph(ApprovalState)
graph.add_node("assess_risk", assess_risk)
graph.add_node("auto_approve", auto_approve)
graph.add_node("manual_approval", manual_approval)

graph.add_edge(START, "assess_risk")
graph.add_conditional_edges("assess_risk", route_by_risk, {
    "auto_approve": "auto_approve",
    "manual_approval": "manual_approval"
})
graph.add_edge("auto_approve", END)
graph.add_edge("manual_approval", END)

app = graph.compile(checkpointer=InMemorySaver())

# 使用
config = {"configurable": {"thread_id": "approval-1"}}
result = app.invoke({"request": "采购服务器", "amount": 50000}, config)

# 如果需要人工审批，恢复执行
if "__interrupt__" in result:
    decision = {"approved": True, "comment": "同意采购"}
    result = app.invoke(Command(resume=decision), config)
```

### 8.6 仿 Dify 工作流系统

Dify 是目前最流行的 LLM 应用开发平台之一，其核心是**可视化工作流引擎**——用户通过拖拽节点、连线，即可构建复杂的 AI 应用。本节使用 LangGraph 从零实现一个类 Dify 的工作流引擎，深入理解"DSL 驱动 + 动态图构建"的架构模式。

#### 8.6.1 Dify 工作流核心概念

Dify 工作流的核心数据结构：

```
┌─────────────────────────────────────────────────┐
│  Dify 工作流 DSL (YAML/JSON)                      │
├─────────────────────────────────────────────────┤
│  nodes:                                          │
│    - id: "start"       → 开始节点（定义输入变量）  │
│    - id: "llm_1"       → LLM 大模型节点           │
│    - id: "kb_1"        → 知识检索节点             │
│    - id: "code_1"      → 代码执行节点             │
│    - id: "http_1"      → HTTP 请求节点            │
│    - id: "if_else_1"   → IF/ELSE 条件分支节点     │
│    - id: "template_1"  → 模板转换节点             │
│    - id: "var_agg_1"   → 变量聚合器节点           │
│    - id: "human_1"     → 人工审核节点             │
│    - id: "answer"      → 输出答案节点             │
│  edges:                                          │
│    - source → target（定义执行顺序和分支）         │
└─────────────────────────────────────────────────┘
```

**Dify 节点类型与 LangGraph 映射：**

| Dify 节点类型 | 功能说明 | LangGraph 实现方式 |
|-------------|---------|-------------------|
| **start** | 定义输入变量 | 图的输入 State |
| **llm** | 调用大模型 | LLM 节点函数 |
| **knowledge-retrieval** | 知识库检索 | LangChain VectorStore 节点 |
| **code** | 执行 Python 代码 | exec() 沙箱节点 |
| **http-request** | 调用外部 API | requests/httpx 节点 |
| **if-else** | 条件分支 | 条件边 `add_conditional_edges()` |
| **template-transform** | 模板渲染 | Jinja2/字符串格式化节点 |
| **variable-aggregator** | 多分支变量聚合 | State Reducer 合并 |
| **question-classifier** | 问题分类 | LLM 分类 + 条件边 |
| **loop / iteration** | 循环/迭代 | 循环边 + 计数器 |
| **human-review** | 人工审核 | `interrupt()` + `Command(resume=...)` |
| **answer** | 输出结果 | END 节点 |

#### 8.6.2 工作流 DSL 设计

仿照 Dify 的 DSL 格式，用 YAML 定义工作流配置：

```yaml
# workflow_dsl.yaml — 智能客服工作流
name: "智能客服工作流"
description: "自动分类用户问题，检索知识库，生成回答"
version: "1.0"

inputs:
  - name: "query"
    type: "string"
    required: true
    description: "用户问题"
  - name: "user_id"
    type: "string"
    required: false
    description: "用户ID"

nodes:
  - id: "classifier"
    type: "question-classifier"
    data:
      title: "问题分类"
      categories:
        - key: "product"
          label: "产品咨询"
          description: "关于产品功能、价格、规格的问题"
        - key: "tech_support"
          label: "技术支持"
          description: "技术问题、错误排查、使用指南"
        - key: "complaint"
          label: "投诉建议"
          description: "投诉、不满、改进建议"
      model:
        provider: "openai"
        name: "gpt-4"

  - id: "kb_search"
    type: "knowledge-retrieval"
    data:
      title: "知识库检索"
      query_var: "query"
      top_k: 3
      score_threshold: 0.7

  - id: "llm_answer"
    type: "llm"
    data:
      title: "生成回答"
      model:
        provider: "openai"
        name: "gpt-4"
      system_prompt: |
        你是一个专业的客服助手。请基于以下知识库内容回答用户问题。
        如果知识库内容不足以回答问题，请诚实说明。

        知识库内容：
        {{kb_result}}
      temperature: 0.3

  - id: "complaint_handler"
    type: "llm"
    data:
      title: "投诉处理"
      model:
        provider: "openai"
        name: "gpt-4"
      system_prompt: |
        你是一个专业的投诉处理专员。请对用户的投诉表示理解，
        提供初步解决方案，并告知会转交相关部门处理。
      temperature: 0.5

  - id: "escalate_review"
    type: "human-review"
    data:
      title: "升级审核"
      message: "该投诉需要人工审核，是否升级处理？"

  - id: "code_format"
    type: "code"
    data:
      title: "格式化输出"
      language: "python3"
      code: |
        def main(answer: str, category: str) -> dict:
            return {
                "result": {
                    "answer": answer,
                    "category": category,
                    "timestamp": __import__('datetime').datetime.now().isoformat(),
                    "status": "resolved" if category != "complaint" else "escalated"
                }
            }

  - id: "http_notify"
    type: "http-request"
    data:
      title: "通知推送"
      method: "POST"
      url: "https://api.example.com/notify"
      headers:
        Content-Type: "application/json"
      body_template: |
        {"event": "complaint_escalated", "user_id": "{{user_id}}", "content": "{{answer}}"}

  - id: "answer"
    type: "answer"
    data:
      title: "输出结果"
      answer_var: "result"

edges:
  - source: "__start__"
    target: "classifier"
  - source: "classifier"
    target: "kb_search"
    condition:
      field: "category"
      value: "product"
    label: "产品咨询"
  - source: "classifier"
    target: "kb_search"
    condition:
      field: "category"
      value: "tech_support"
    label: "技术支持"
  - source: "classifier"
    target: "complaint_handler"
    condition:
      field: "category"
      value: "complaint"
    label: "投诉建议"
  - source: "kb_search"
    target: "llm_answer"
  - source: "llm_answer"
    target: "code_format"
  - source: "complaint_handler"
    target: "escalate_review"
  - source: "escalate_review"
    target: "http_notify"
    condition:
      field: "approved"
      value: true
    label: "审核通过"
  - source: "escalate_review"
    target: "answer"
    condition:
      field: "approved"
      value: false
    label: "审核驳回"
  - source: "http_notify"
    target: "code_format"
  - source: "code_format"
    target: "answer"
```

#### 8.6.3 工作流引擎核心实现

**第一步：定义工作流 State**

```python
from typing import TypedDict, Annotated, Any, Optional
from typing_extensions import TypedDict
import operator

class WorkflowState(TypedDict):
    """Dify 工作流引擎的统一状态"""
    # 输入
    query: str                                    # 用户原始问题
    user_id: str                                  # 用户ID
    # 分类
    category: str                                 # 问题分类结果
    # 检索
    kb_result: str                                # 知识库检索结果
    # LLM 生成
    answer: str                                   # LLM 生成的回答
    # 人工审核
    approved: bool                                # 人工审核结果
    review_comment: str                           # 审核意见
    # 代码执行
    result: dict                                  # 格式化输出结果
    # 元信息
    node_outputs: Annotated[dict, operator.add]   # 各节点输出（追踪用）
    errors: Annotated[list, operator.add]          # 错误收集
```

**第二步：实现各节点类型处理器**

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langgraph.types import interrupt, Command
import json
import httpx

class DifyNodeHandlers:
    """Dify 风格的节点处理器集合"""

    # ---------- 问题分类器 ----------
    @staticmethod
    def question_classifier(state: WorkflowState, config: dict) -> dict:
        """问题分类节点：使用 LLM 将用户问题分到预定义类别"""
        categories = config.get("categories", [])
        cat_descriptions = "\n".join(
            [f"- {c['key']}: {c['description']}" for c in categories]
        )

        llm = ChatOpenAI(model=config.get("model", {}).get("name", "gpt-4"), temperature=0)
        prompt = f"""请将以下用户问题分类到最合适的类别中，只返回类别key。

可选类别：
{cat_descriptions}

用户问题：{state['query']}

只返回类别key（如 product / tech_support / complaint），不要其他内容："""

        response = llm.invoke(prompt)
        category = response.content.strip().lower()

        # 验证分类结果
        valid_keys = [c["key"] for c in categories]
        if category not in valid_keys:
            category = valid_keys[0]  # 默认取第一个

        return {
            "category": category,
            "node_outputs": {"classifier": {"category": category}}
        }

    # ---------- 知识库检索 ----------
    @staticmethod
    def knowledge_retrieval(state: WorkflowState, config: dict) -> dict:
        """知识库检索节点"""
        query = state.get("query", "")
        top_k = config.get("top_k", 3)
        score_threshold = config.get("score_threshold", 0.7)

        # 初始化向量库（实际生产中应注入已有实例）
        embeddings = OpenAIEmbeddings()
        # 此处假设已有 vectorstore 实例，实际需从外部注入
        # docs = vectorstore.similarity_search_with_score(query, k=top_k)
        # filtered = [d for d, s in docs if s >= score_threshold]
        # kb_result = "\n\n".join([d.page_content for d, _ in filtered])

        # 模拟检索结果
        mock_results = {
            "product": "产品A：企业版 ¥999/月，支持无限调用。产品B：标准版 ¥299/月，支持1万次/天。",
            "tech_support": "常见问题：1) API超时请检查网络配置 2) 认证失败请刷新Token 3) 速率限制请升级套餐",
        }
        kb_result = mock_results.get(state.get("category", ""), "未找到相关知识")

        return {
            "kb_result": kb_result,
            "node_outputs": {"kb_search": {"result_length": len(kb_result)}}
        }

    # ---------- LLM 生成 ----------
    @staticmethod
    def llm_generate(state: WorkflowState, config: dict) -> dict:
        """LLM 生成节点"""
        model_name = config.get("model", {}).get("name", "gpt-4")
        temperature = config.get("temperature", 0.3)
        system_prompt = config.get("system_prompt", "你是一个AI助手")

        # 模板变量替换（仿 Dify 的 {{var}} 语法）
        system_prompt = system_prompt.replace("{{kb_result}}", state.get("kb_result", ""))
        system_prompt = system_prompt.replace("{{query}}", state.get("query", ""))
        system_prompt = system_prompt.replace("{{user_id}}", state.get("user_id", ""))

        llm = ChatOpenAI(model=model_name, temperature=temperature)
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=state.get("query", ""))
        ])

        return {
            "answer": response.content,
            "node_outputs": {config.get("title", "llm"): {"tokens": getattr(response, 'usage_metadata', {}).__len__() if hasattr(response, 'usage_metadata') else 0}}
        }

    # ---------- 代码执行 ----------
    @staticmethod
    def code_execute(state: WorkflowState, config: dict) -> dict:
        """代码执行节点（受限沙箱环境）"""
        code = config.get("code", "")
        language = config.get("language", "python3")

        if language != "python3":
            return {"result": {"error": f"不支持的语言: {language}"}, "errors": [f"Unsupported language: {language}"]}

        # 构建沙箱执行环境
        sandbox_globals = {
            "__builtins__": {
                "str": str, "int": int, "float": float, "dict": dict,
                "list": list, "bool": bool, "len": len, "range": range,
                "print": print, "isinstance": isinstance, "__import__": __import__,
            },
            "answer": state.get("answer", ""),
            "category": state.get("category", ""),
            "query": state.get("query", ""),
            "user_id": state.get("user_id", ""),
        }

        try:
            # 提取 main 函数并执行
            local_vars = {}
            exec(code, sandbox_globals, local_vars)
            if "main" in local_vars:
                result = local_vars["main"](
                    answer=state.get("answer", ""),
                    category=state.get("category", "")
                )
                return {"result": result, "node_outputs": {"code_format": {"success": True}}}
            else:
                return {"result": {"error": "未找到 main 函数"}, "errors": ["No main function found"]}
        except Exception as e:
            return {"result": {"error": str(e)}, "errors": [f"Code execution error: {e}"]}

    # ---------- HTTP 请求 ----------
    @staticmethod
    def http_request(state: WorkflowState, config: dict) -> dict:
        """HTTP 请求节点"""
        method = config.get("method", "GET").upper()
        url = config.get("url", "")
        headers = config.get("headers", {})
        body_template = config.get("body_template", "")

        # 模板变量替换
        body = body_template.replace("{{user_id}}", state.get("user_id", ""))
        body = body.replace("{{answer}}", state.get("answer", ""))

        try:
            with httpx.Client(timeout=10.0) as client:
                if method == "POST":
                    resp = client.post(url, json=json.loads(body), headers=headers)
                else:
                    resp = client.get(url, headers=headers)

                return {
                    "node_outputs": {"http_notify": {"status": resp.status_code}},
                    "answer": state.get("answer", "")  # 保留之前的 answer
                }
        except Exception as e:
            return {
                "errors": [f"HTTP request failed: {e}"],
                "answer": state.get("answer", "")
            }

    # ---------- 人工审核 ----------
    @staticmethod
    def human_review(state: WorkflowState, config: dict) -> dict:
        """人工审核节点：使用 LangGraph interrupt 暂停等待人工决策"""
        message = config.get("message", "请审核")

        decision = interrupt({
            "type": "human_review",
            "message": message,
            "query": state.get("query", ""),
            "category": state.get("category", ""),
            "answer": state.get("answer", ""),
        })

        return {
            "approved": decision.get("approved", False),
            "review_comment": decision.get("comment", ""),
            "node_outputs": {"escalate_review": {"approved": decision.get("approved", False)}}
        }

    # ---------- 模板转换 ----------
    @staticmethod
    def template_transform(state: WorkflowState, config: dict) -> dict:
        """模板转换节点：使用 Jinja2 风格的模板渲染"""
        template = config.get("template", "{{answer}}")

        # 简单变量替换
        for key, value in state.items():
            if isinstance(value, str):
                template = template.replace(f"{{{{{key}}}}}", value)

        return {
            "answer": template,
            "node_outputs": {"template": {"rendered": True}}
        }
```

**第三步：DSL 解析与动态图构建**

这是最核心的部分——将 DSL 配置动态转换为 LangGraph 图：

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
import yaml


class DifyWorkflowEngine:
    """仿 Dify 工作流引擎：从 DSL 动态构建 LangGraph"""

    # 节点类型 → 处理器映射
    NODE_HANDLER_MAP = {
        "question-classifier": DifyNodeHandlers.question_classifier,
        "knowledge-retrieval": DifyNodeHandlers.knowledge_retrieval,
        "llm": DifyNodeHandlers.llm_generate,
        "code": DifyNodeHandlers.code_execute,
        "http-request": DifyNodeHandlers.http_request,
        "human-review": DifyNodeHandlers.human_review,
        "template-transform": DifyNodeHandlers.template_transform,
    }

    def __init__(self, dsl_path: str = None, dsl_dict: dict = None):
        """初始化工作流引擎"""
        if dsl_path:
            with open(dsl_path, "r", encoding="utf-8") as f:
                self.dsl = yaml.safe_load(f)
        elif dsl_dict:
            self.dsl = dsl_dict
        else:
            raise ValueError("必须提供 dsl_path 或 dsl_dict")

        self.nodes_config = {n["id"]: n for n in self.dsl.get("nodes", [])}
        self.edges_config = self.dsl.get("edges", [])
        self.graph = None
        self.app = None

    def _build_node_fn(self, node_id: str):
        """为 DSL 节点构建 LangGraph 节点函数"""
        node_config = self.nodes_config[node_id]
        node_type = node_config["type"]
        node_data = node_config.get("data", {})

        if node_type == "answer":
            # answer 节点：直接透传结果
            answer_var = node_data.get("answer_var", "result")
            def answer_fn(state: WorkflowState):
                return {"node_outputs": {"answer": {"output": state.get(answer_var, {})}}}
            return answer_fn

        handler = self.NODE_HANDLER_MAP.get(node_type)
        if not handler:
            raise ValueError(f"不支持的节点类型: {node_type}")

        # 闭包捕获 node_data
        def node_fn(state: WorkflowState):
            return handler(state, node_data)

        return node_fn

    def _build_conditional_router(self, source_id: str):
        """构建条件路由函数"""
        # 收集从该节点出发的所有条件边
        conditional_edges = [
            e for e in self.edges_config
            if e["source"] == source_id and "condition" in e
        ]

        # 无条件边：收集所有普通边
        normal_edges = [
            e for e in self.edges_config
            if e["source"] == source_id and "condition" not in e
        ]

        if not conditional_edges:
            return None, None

        # 构建路由函数
        condition_field = conditional_edges[0]["condition"]["field"]
        route_map = {}
        for edge in conditional_edges:
            target = edge["target"]
            value = edge["condition"]["value"]
            # 布尔值特殊处理
            if isinstance(value, str):
                if value.lower() == "true":
                    value = True
                elif value.lower() == "false":
                    value = False
            route_map[str(value)] = target

        # 默认目标：取第一条普通边
        default_target = normal_edges[0]["target"] if normal_edges else END

        def router(state: WorkflowState) -> str:
            field_value = state.get(condition_field, "")
            key = str(field_value)
            if key in route_map:
                return route_map[key]
            # 布尔匹配
            if isinstance(field_value, bool):
                if str(field_value).lower() in route_map:
                    return route_map[str(field_value).lower()]
            return default_target

        return router, route_map

    def build(self) -> "DifyWorkflowEngine":
        """从 DSL 构建 LangGraph"""
        builder = StateGraph(WorkflowState)

        # 1. 添加所有节点
        for node_id, node_config in self.nodes_config.items():
            node_type = node_config["type"]
            if node_type == "start":
                continue  # start 节点由 START 边代替
            node_fn = self._build_node_fn(node_id)
            builder.add_node(node_id, node_fn)

        # 2. 添加边
        # 找到 start 节点指向的目标
        start_edges = [e for e in self.edges_config if e["source"] == "__start__"]
        for edge in start_edges:
            builder.add_edge(START, edge["target"])

        # 如果没有显式 __start__，取第一个节点
        if not start_edges and self.nodes_config:
            first_node = list(self.nodes_config.keys())[0]
            if self.nodes_config[first_node]["type"] != "start":
                builder.add_edge(START, first_node)
            else:
                # 找 start 节点指向的第一个节点
                for edge in self.edges_config:
                    if edge["source"] == first_node:
                        builder.add_edge(START, edge["target"])
                        break

        # 处理其他边
        processed_sources = {"__start__"}
        for edge in self.edges_config:
            source = edge["source"]
            if source in processed_sources:
                continue

            # 检查是否有条件边
            router, route_map = self._build_conditional_router(source)

            if router:
                # 添加条件边
                all_targets = set(route_map.values())
                builder.add_conditional_edges(source, router, {
                    t: t for t in all_targets
                })
                processed_sources.add(source)
            else:
                # 添加普通边
                targets = [
                    e["target"] for e in self.edges_config
                    if e["source"] == source
                ]
                for target in targets:
                    if target == "__end__" or target == END:
                        builder.add_edge(source, END)
                    else:
                        builder.add_edge(source, target)
                processed_sources.add(source)

        # 3. 编译
        self.graph = builder
        self.app = builder.compile(checkpointer=InMemorySaver())
        return self

    def run(self, query: str, user_id: str = "", thread_id: str = "default") -> dict:
        """执行工作流"""
        config = {"configurable": {"thread_id": thread_id}}
        result = self.app.invoke(
            {"query": query, "user_id": user_id},
            config=config
        )
        return result

    def run_stream(self, query: str, user_id: str = "", thread_id: str = "default"):
        """流式执行工作流"""
        config = {"configurable": {"thread_id": thread_id}}
        for chunk in self.app.stream(
            {"query": query, "user_id": user_id},
            config=config,
            stream_mode="updates"
        ):
            yield chunk

    def resume(self, decision: dict, thread_id: str = "default") -> dict:
        """恢复人工审核后的执行"""
        config = {"configurable": {"thread_id": thread_id}}
        result = self.app.invoke(Command(resume=decision), config=config)
        return result

    def get_graph_mermaid(self) -> str:
        """获取工作流的 Mermaid 图"""
        if self.graph:
            return self.graph.compile().get_graph().draw_mermaid()
        return ""
```

#### 8.6.4 使用工作流引擎

**从 YAML DSL 构建：**

```python
# 1. 从 YAML 文件构建工作流
engine = DifyWorkflowEngine(dsl_path="workflow_dsl.yaml")
engine.build()

# 2. 也可以从字典直接构建（方便 API 动态创建）
workflow_dsl = {
    "name": "简单问答工作流",
    "nodes": [
        {"id": "llm_1", "type": "llm", "data": {
            "title": "LLM回答",
            "model": {"provider": "openai", "name": "gpt-4"},
            "system_prompt": "你是一个AI助手，请回答用户问题。",
            "temperature": 0.3
        }},
        {"id": "answer", "type": "answer", "data": {"answer_var": "answer"}}
    ],
    "edges": [
        {"source": "__start__", "target": "llm_1"},
        {"source": "llm_1", "target": "answer"}
    ]
}
engine = DifyWorkflowEngine(dsl_dict=workflow_dsl)
engine.build()
```

**执行智能客服工作流（产品咨询场景）：**

```python
# 场景 1：产品咨询 — 自动分类 → 知识库检索 → LLM 回答 → 格式化输出
result = engine.run(
    query="你们的企业版多少钱？有什么功能？",
    user_id="user_001",
    thread_id="session_001"
)
print(result["result"])
# {'answer': '...', 'category': 'product', 'timestamp': '2026-05-08T...', 'status': 'resolved'}
```

**执行智能客服工作流（投诉场景 — 触发人工审核）：**

```python
# 场景 2：投诉 — 分类 → 投诉处理 → 人工审核 → 通知/驳回
result = engine.run(
    query="你们的产品太难用了！我要投诉！",
    user_id="user_002",
    thread_id="session_002"
)
# 触发 interrupt，暂停等待人工审核

# 人工审核通过
result = engine.resume(
    decision={"approved": True, "comment": "同意升级处理"},
    thread_id="session_002"
)
# 流程继续：HTTP 通知 → 格式化输出 → 结束
print(result["result"])
# {'answer': '...', 'category': 'complaint', 'timestamp': '...', 'status': 'escalated'}

# 或者人工审核驳回
result = engine.resume(
    decision={"approved": False, "comment": "已解决，无需升级"},
    thread_id="session_003"  # 另一个会话
)
```

**流式执行：**

```python
# 流式执行，逐步获取每个节点的输出
for chunk in engine.run_stream(
    query="如何配置API认证？",
    user_id="user_003",
    thread_id="session_004"
):
    for node_name, output in chunk.items():
        print(f"[节点 {node_name}] 输出: {output}")
# [节点 classifier] 输出: {'category': 'tech_support'}
# [节点 kb_search] 输出: {'kb_result': '常见问题：1) API超时...'}
# [节点 llm_answer] 输出: {'answer': 'API认证配置步骤如下...'}
# [节点 code_format] 输出: {'result': {...}}
```

#### 8.6.5 可视化查看工作流图

```python
# 获取 Mermaid 图（可用于前端展示）
mermaid_str = engine.get_graph_mermaid()
print(mermaid_str)
```

生成的智能客服工作流图结构：

```
START → classifier
            ├── product ──→ kb_search → llm_answer ──→ code_format → answer → END
            ├── tech_support → kb_search
            └── complaint → complaint_handler → escalate_review
                                                    ├── approved=True → http_notify → code_format
                                                    └── approved=False → answer → END
```

#### 8.6.6 扩展：更多节点类型

工作流引擎可通过 `NODE_HANDLER_MAP` 轻松扩展新节点类型：

```python
# 扩展：变量聚合器节点
@staticmethod
def variable_aggregator(state: WorkflowState, config: dict) -> dict:
    """将多个分支的变量聚合为一个"""
    aggregate_vars = config.get("variables", [])
    aggregated = {}
    for var_name in aggregate_vars:
        if var_name in state:
            aggregated[var_name] = state[var_name]
    return {
        **aggregated,
        "node_outputs": {"var_aggregator": {"aggregated_keys": list(aggregated.keys())}}
    }

# 扩展：迭代节点（Map-Reduce 模式）
@staticmethod
def iteration_node(state: WorkflowState, config: dict) -> dict:
    """对列表中每个元素执行子流程"""
    items = state.get(config.get("input_var", "items"), [])
    output_var = config.get("output_var", "results")
    iterate_llm_prompt = config.get("prompt", "处理以下内容：{item}")

    results = []
    llm = ChatOpenAI(model="gpt-4")
    for item in items:
        prompt = iterate_llm_prompt.replace("{item}", str(item))
        response = llm.invoke(prompt)
        results.append(response.content)

    return {
        output_var: results,
        "node_outputs": {"iteration": {"processed": len(results)}}
    }

# 扩展：参数提取节点
@staticmethod
def parameter_extractor(state: WorkflowState, config: dict) -> dict:
    """从自然语言中提取结构化参数"""
    parameters = config.get("parameters", [])
    param_desc = "\n".join([f"- {p['name']}({p['type']}): {p.get('description', '')}" for p in parameters])

    llm = ChatOpenAI(model="gpt-4", temperature=0)
    prompt = f"""从以下文本中提取参数，以JSON格式返回：

需要提取的参数：
{param_desc}

文本：{state.get('query', '')}

请直接返回JSON，不要其他内容："""

    response = llm.invoke(prompt)
    try:
        import json
        extracted = json.loads(response.content)
    except json.JSONDecodeError:
        extracted = {"error": "参数提取失败", "raw": response.content}

    return {
        **extracted,
        "node_outputs": {"param_extractor": extracted}
    }

# 注册到引擎
DifyWorkflowEngine.NODE_HANDLER_MAP["variable-aggregator"] = variable_aggregator
DifyWorkflowEngine.NODE_HANDLER_MAP["iteration"] = iteration_node
DifyWorkflowEngine.NODE_HANDLER_MAP["parameter-extractor"] = parameter_extractor
```

#### 8.6.7 生产级增强

将工作流引擎从原型升级到生产可用：

```python
import logging
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.store.memory import InMemoryStore
from langgraph.store.base import BaseStore

logger = logging.getLogger("dify_workflow")


class ProductionDifyEngine(DifyWorkflowEngine):
    """生产级工作流引擎"""

    def __init__(self, dsl_path=None, dsl_dict=None,
                 postgres_conn: str = "postgresql://localhost:5432/workflows",
                 enable_tracing: bool = True):
        super().__init__(dsl_path=dsl_path, dsl_dict=dsl_dict)
        self.postgres_conn = postgres_conn
        self.enable_tracing = enable_tracing
        self.store = InMemoryStore()  # 长期记忆存储

    def build(self) -> "ProductionDifyEngine":
        """构建生产级图"""
        builder = StateGraph(WorkflowState)

        # 添加所有节点（同父类）
        for node_id, node_config in self.nodes_config.items():
            if node_config["type"] == "start":
                continue
            node_fn = self._build_node_fn(node_id)
            builder.add_node(node_id, node_fn)

        # 添加边（同父类）
        self._add_edges(builder)

        # 使用 PostgreSQL 持久化
        checkpointer = PostgresSaver.from_conn_string(self.postgres_conn)
        checkpointer.setup()

        self.graph = builder
        self.app = builder.compile(
            checkpointer=checkpointer,
            interrupt_before=self._get_interrupt_nodes(),  # 自动检测需人工审核的节点
        )
        return self

    def _get_interrupt_nodes(self) -> list[str]:
        """自动检测需要人工审核的节点"""
        return [
            nid for nid, ncfg in self.nodes_config.items()
            if ncfg["type"] == "human-review"
        ]

    def _add_edges(self, builder):
        """添加边逻辑（从父类提取）"""
        start_edges = [e for e in self.edges_config if e["source"] == "__start__"]
        for edge in start_edges:
            builder.add_edge(START, edge["target"])
        if not start_edges and self.nodes_config:
            first_node = list(self.nodes_config.keys())[0]
            builder.add_edge(START, first_node)

        processed_sources = {"__start__"}
        for edge in self.edges_config:
            source = edge["source"]
            if source in processed_sources:
                continue
            router, route_map = self._build_conditional_router(source)
            if router:
                all_targets = set(route_map.values())
                builder.add_conditional_edges(source, router, {t: t for t in all_targets})
            else:
                targets = [e["target"] for e in self.edges_config if e["source"] == source]
                for target in targets:
                    builder.add_edge(source, target if target != "__end__" else END)
            processed_sources.add(source)

    def run(self, query: str, user_id: str = "", thread_id: str = "") -> dict:
        """生产级执行：添加日志、追踪、错误处理"""
        if not thread_id:
            import uuid
            thread_id = str(uuid.uuid4())

        config = {"configurable": {"thread_id": thread_id}}

        logger.info(f"Workflow started: query={query}, user={user_id}, thread={thread_id}")

        try:
            result = self.app.invoke(
                {"query": query, "user_id": user_id},
                config=config
            )

            # 记录到长期记忆
            self.store.put(
                ("users", user_id, "workflow_history"),
                key=thread_id,
                value={"query": query, "category": result.get("category"), "status": "completed"}
            )

            logger.info(f"Workflow completed: thread={thread_id}, category={result.get('category')}")
            return result

        except Exception as e:
            logger.error(f"Workflow failed: thread={thread_id}, error={e}")
            return {"result": {"error": str(e)}, "errors": [str(e)]}


# 使用生产级引擎
engine = ProductionDifyEngine(
    dsl_path="workflow_dsl.yaml",
    postgres_conn="postgresql://user:pass@localhost:5432/workflows",
    enable_tracing=True
)
engine.build()
result = engine.run(query="产品价格是多少？", user_id="user_001")
```

#### 8.6.8 架构总结

```
┌──────────────────────────────────────────────────────────────┐
│                    仿 Dify 工作流系统架构                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │  YAML/JSON   │───→│  DifyWorkflow    │───→│  LangGraph   │ │
│  │  DSL 配置    │    │  Engine 解析构建  │    │  StateGraph  │ │
│  └─────────────┘    └──────────────────┘    └─────────────┘ │
│       │                     │                      │         │
│       │              ┌──────┴──────┐               │         │
│       │              │ 节点处理器    │               │         │
│       │              │ ┌─────────┐ │               │         │
│       │              │ │ LLM     │ │               │         │
│       │              │ │ KB搜索  │ │               │         │
│       │              │ │ Code    │ │               │         │
│       │              │ │ HTTP    │ │               │         │
│       │              │ │ IF/ELSE │ │               │         │
│       │              │ │ Human   │ │               │         │
│       │              │ │ ...     │ │               │         │
│       │              │ └─────────┘ │               │         │
│       │              └──────┬──────┘               │         │
│       │                     │                      │         │
│  ┌────┴──────────────────────┴──────────────────────┴─────┐  │
│  │                  运行时基础设施                          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │Checkpter │ │ Store    │ │ LangSmith│ │ Studio   │  │  │
│  │  │持久化    │ │ 长期记忆 │ │ 追踪监控 │ │ 可视调试 │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Dify 工作流 vs LangGraph 原生实现对比：**

| 维度 | Dify 可视化工作流 | LangGraph 原生实现 |
|------|------------------|-------------------|
| **构建方式** | 可视化拖拽 | YAML DSL + Python 代码 |
| **灵活性** | 受限于预定义节点 | 完全自由，可自定义任意节点 |
| **调试** | 内置 Studio | LangSmith + Studio + 时间旅行 |
| **部署** | Dify Cloud / Docker | LangGraph Platform / 自托管 |
| **扩展性** | 自定义节点需开发插件 | Python 原生，无边界的扩展性 |
| **人工干预** | Human Input 节点 | `interrupt()` + `Command(resume=...)` |
| **持久化** | 内置 | Checkpointer（PostgreSQL） |
| **循环/迭代** | Loop 节点 | 图天然支持循环边 |
| **多 Agent** | Agent 节点 | 子图 + Supervisor 模式 |
| **适用场景** | 非技术人员快速搭建 | 开发者构建复杂可控系统 |

---

## 九、时间旅行调试

### 9.1 核心概念

时间旅行允许你回溯到图执行的任意历史检查点，查看当时的状态，甚至从某个历史点重新执行（Fork）。

### 9.2 查看历史状态

```python
config = {"configurable": {"thread_id": "thread-1"}}

# 获取所有历史检查点
history = list(app.get_state_history(config))
for snapshot in history:
    print(f"Step {snapshot.metadata['step']}: next={snapshot.next}")
    print(f"  State: {snapshot.values}")
    print(f"  Checkpoint ID: {snapshot.config['configurable']['checkpoint_id']}")
```

### 9.3 从历史点恢复（Fork）

```python
# 找到要回溯的检查点
target_checkpoint_id = history[2].config["configurable"]["checkpoint_id"]

# 从该检查点重新执行
fork_config = {
    "configurable": {
        "thread_id": "thread-1",
        "checkpoint_id": target_checkpoint_id
    }
}

# 修改状态后重新执行
app.update_state(fork_config, {"query": "修改后的查询"})
result = app.invoke(None, fork_config)
```

### 9.4 回放执行过程

```python
# 逐步回放图的执行过程
for state in app.get_state_history(config):
    if state.metadata["source"] == "loop":
        print(f"--- Step {state.metadata['step']} ---")
        print(f"Node outputs: {state.metadata.get('writes', {})}")
```

---

## 十、LangGraph Platform 部署

### 10.1 部署选项

| 部署方式 | 说明 | 适用场景 |
|---------|------|---------|
| **LangGraph Cloud** | 全托管云服务 | 不想运维的团队 |
| **LangGraph Server（自托管）** | 自行部署服务器 | 需要数据本地化 |
| **Python 直接运行** | 本地运行 | 开发测试 |

### 10.2 LangGraph Server 快速入门

```bash
# 安装 LangGraph CLI
pip install -U "langgraph-cli[inmem]"

# 创建配置文件 langgraph.json
```

**langgraph.json 配置示例：**

```json
{
  "python_version": "3.11",
  "dependencies": ["."],
  "graphs": {
    "agent": "./agent.py:graph"
  },
  "env": ".env"
}
```

```bash
# 启动本地开发服务器
langgraph dev

# 服务器启动后可访问：
# - API: http://localhost:2024
# - Studio: http://localhost:2024/studio
```

### 10.3 REST API 交互

```bash
# 创建线程
curl -X POST http://localhost:2024/threads \
  -H "Content-Type: application/json" \
  -d '{"metadata": {"user_id": "user_123"}}'

# 发送消息
curl -X POST http://localhost:2024/threads/{thread_id}/runs \
  -H "Content-Type: application/json" \
  -d '{
    "assistant_id": "agent",
    "input": {"messages": [{"role": "user", "content": "Hello!"}]},
    "metadata": {"user_id": "user_123"}
  }'

# 流式输出
curl -X POST http://localhost:2024/threads/{thread_id}/runs/stream \
  -H "Content-Type: application/json" \
  -d '{
    "assistant_id": "agent",
    "input": {"messages": [{"role": "user", "content": "Hello!"}]}
  }'
```

### 10.4 身份验证与访问控制

LangGraph Platform 支持自定义身份验证：

```python
# auth.py
from langgraph_sdk import Auth

auth = Auth()

@auth.authenticate
async def authenticate(request):
    """验证请求身份"""
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    # 验证 token
    user = await verify_token(token)
    return {"identity": user["id"], "permissions": user["permissions"]}

@auth.on.threads.create
async def on_thread_create(request, thread):
    """控制线程创建权限"""
    user = request.context
    thread["metadata"]["owner"] = user["identity"]
    return thread
```

### 10.5 LangGraph Studio

LangGraph Studio 是 LangGraph Platform 的可视化开发环境：

| 功能 | 说明 |
|------|------|
| **可视化图结构** | 实时查看图的节点和边 |
| **交互式测试** | 直接在 UI 中输入测试 |
| **断点调试** | 在任意节点暂停，检查和修改 State |
| **时间旅行** | 回溯到历史状态重新执行 |
| **流式预览** | 实时查看 Token 流式输出 |

---

## 十一、进阶模式

### 11.1 Map-Reduce 模式

并行处理多个任务后汇总结果：

```python
from typing import Annotated, TypedDict
import operator

class MapReduceState(TypedDict):
    items: list[str]
    results: Annotated[list, operator.add]
    final_summary: str

def map_node(state: MapReduceState):
    """并行处理每个 item"""
    results = []
    for item in state["items"]:
        result = llm.invoke(f"分析：{item}")
        results.append(result.content)
    return {"results": results}

def reduce_node(state: MapReduceState):
    """汇总所有结果"""
    all_results = "\n".join(state["results"])
    summary = llm.invoke(f"汇总以下分析结果：\n{all_results}")
    return {"final_summary": summary.content}

graph = StateGraph(MapReduceState)
graph.add_node("map", map_node)
graph.add_node("reduce", reduce_node)
graph.add_edge(START, "map")
graph.add_edge("map", "reduce")
graph.add_edge("reduce", END)
```

### 11.2 Plan-and-Execute 模式

先规划再执行的两阶段 Agent：

```python
class PlanExecuteState(TypedDict):
    input: str
    plan: list[str]
    current_step: int
    step_results: Annotated[list, operator.add]
    final_answer: str

def planner(state: PlanExecuteState):
    """制定执行计划"""
    response = llm.invoke(f"为以下任务制定详细步骤：{state['input']}")
    steps = response.content.strip().split("\n")
    return {"plan": steps, "current_step": 0}

def executor(state: PlanExecuteState):
    """执行当前步骤"""
    step = state["plan"][state["current_step"]]
    result = llm.invoke(f"执行步骤：{step}")
    return {
        "step_results": [result.content],
        "current_step": state["current_step"] + 1
    }

def should_continue(state: PlanExecuteState):
    if state["current_step"] < len(state["plan"]):
        return "execute"
    return "summarize"

def summarize(state: PlanExecuteState):
    all_results = "\n".join(state["step_results"])
    summary = llm.invoke(f"综合以下步骤结果，给出最终答案：\n{all_results}")
    return {"final_answer": summary.content}

graph = StateGraph(PlanExecuteState)
graph.add_node("planner", planner)
graph.add_node("executor", executor)
graph.add_node("summarize", summarize)

graph.add_edge(START, "planner")
graph.add_edge("planner", "executor")
graph.add_conditional_edges("executor", should_continue, {
    "execute": "executor",
    "summarize": "summarize"
})
graph.add_edge("summarize", END)
```

### 11.3 Command 模式

`Command` 允许节点同时更新状态和控制流程：

```python
from langgraph.types import Command
from typing import Literal

def router_node(state: State) -> Command[Literal["search", "calculate", "chat"]]:
    if "搜索" in state["query"]:
        return Command(goto="search", update={"query_type": "search"})
    elif "计算" in state["query"]:
        return Command(goto="calculate", update={"query_type": "calculate"})
    else:
        return Command(goto="chat", update={"query_type": "chat"})
```

---

## 十二、最佳实践

### 12.1 State 设计原则

| 原则 | 说明 |
|------|------|
| **最小化 State** | 只存储必要字段，避免冗余 |
| **使用 Reducer** | 列表类型用 `Annotated[list, add]`，避免覆盖 |
| **分离输入输出** | 使用 `input_schema` 和 `output_schema` 隔离 |
| **私有 State** | 内部通信用 `PrivateState`，不暴露给外部 |

### 12.2 图设计原则

| 原则 | 说明 |
|------|------|
| **单一职责** | 每个节点只做一件事 |
| **子图模块化** | 复杂逻辑拆分为子图 |
| **明确路由条件** | 条件边要有清晰的判断逻辑 |
| **防止死循环** | 循环边必须设置终止条件 |
| **优雅降级** | 关键节点添加 Fallback 逻辑 |

### 12.3 生产部署清单

| 检查项 | 说明 |
|--------|------|
| **Checkpointer** | 生产环境必须使用 PostgreSQL 等持久化存储 |
| **Thread ID** | 使用稳定的 thread_id，避免随机 ID |
| **错误处理** | 节点内添加 try-except，防止单节点失败导致整个图崩溃 |
| **超时控制** | 对 LLM 调用设置 timeout |
| **监控追踪** | 启用 LangSmith 追踪 |
| **安全防护** | 对用户输入和 LLM 输出做 Guardrails 检查 |
| **资源限制** | 限制图的迭代次数，防止无限循环 |

### 12.4 常见问题与解决

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 图无限循环 | 循环边无终止条件 | 添加最大迭代次数计数器 |
| State 被意外覆盖 | 未使用 Reducer | 列表字段用 `Annotated[list, add]` |
| Checkpoint 丢失 | 使用 InMemorySaver | 切换到 PostgreSQL |
| 人工干预后无响应 | 未使用 Command(resume=...) | 正确调用 `app.invoke(Command(resume=value), config)` |
| 节点报错图崩溃 | 未做错误处理 | 节点内添加 try-except |

### 12.5 性能优化

| 优化方向 | 具体措施 |
|---------|---------|
| **减少 LLM 调用** | 合并简单任务，减少节点数 |
| **并行执行** | 无依赖的节点通过并行边同时执行 |
| **流式输出** | 使用 `stream_mode="messages"` 提升用户体验 |
| **缓存结果** | 相同输入的节点结果缓存 |
| **精简 State** | 只传递必要字段，减少序列化开销 |

---

## 十三、总结

### 13.1 核心概念速查

| 概念 | 作用 | 关键类/方法 |
|------|------|------------|
| **State** | 图的共享数据结构 | `TypedDict`, `Annotated`, `Reducer` |
| **Nodes** | 计算单元 | `add_node()`, 普通函数 |
| **Edges** | 流程控制 | `add_edge()`, `add_conditional_edges()` |
| **StateGraph** | 图构建器 | `StateGraph()`, `compile()` |
| **Checkpointer** | 持久化 | `InMemorySaver`, `PostgresSaver` |
| **interrupt()** | 动态中断 | `interrupt()`, `Command(resume=...)` |
| **Store** | 长期记忆 | `InMemoryStore`, `BaseStore` |
| **Subgraphs** | 子图模块化 | `add_node("sub", sub_graph)` |
| **Command** | 状态+流程控制 | `Command(goto=, update=)` |

### 13.2 常用模式速查

```python
# 基础图
graph = StateGraph(State).add_node("a", fn).add_edge(START, "a").add_edge("a", END).compile()

# 条件路由
graph.add_conditional_edges("a", router_fn, {"b": "b", "c": "c"})

# 循环
graph.add_conditional_edges("a", lambda s: "a" if not s["done"] else END, {"a": "a", END: END})

# 人工干预
approved = interrupt("请确认"); result = app.invoke(Command(resume=True), config)

# 持久化
app = graph.compile(checkpointer=PostgresSaver(...))
result = app.invoke(input, config={"configurable": {"thread_id": "1"}})

# 流式
for chunk in app.stream(input, stream_mode=["messages", "updates"], version="v2"): ...
```

### 13.3 学习路线建议

```
阶段 1（1-2周）：基础入门
├── 理解 State / Nodes / Edges 三大核心概念
├── 构建第一个有向图
├── 掌握条件路由和循环
└── 熟悉 compile / invoke / stream 基础方法

阶段 2（2-3周）：进阶能力
├── 掌握 Checkpointer 持久化
├── 实现 Human-in-the-Loop 工作流
├── 学习流式输出（messages / custom mode）
└── 理解 Reducer 和多 Schema 设计

阶段 3（2-4周）：实战项目
├── 构建完整的对话 Agent（带工具调用）
├── 实现 RAG 智能体
├── 构建 Supervisor 多 Agent 系统
├── 实现审批工作流系统
└── 实现仿 Dify 工作流引擎（DSL驱动+动态图构建）

阶段 4（2-4周）：生产部署
├── LangGraph Platform 部署
├── PostgreSQL 持久化 + 长期记忆
├── 安全防护与合规
└── 监控与持续优化
```

---

## 附录：版本更新记录

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-05-08 | 初始版本：从入门到实战完整覆盖 LangGraph 核心知识 |
| v1.1 | 2026-05-08 | 新增仿 Dify 工作流系统实战（DSL驱动+动态图构建+10种节点类型+生产级增强） |

---

**学习完成日期**：2026年5月8日

**文档版本**：v1.1

**文档统计**：涵盖 LangGraph 从入门到生产的完整知识体系，包含核心概念、持久化与记忆、人工干预、流式输出、子图、多 Agent 系统、仿 Dify 工作流引擎、部署方案、最佳实践等

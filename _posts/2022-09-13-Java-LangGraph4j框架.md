---
title: "Java-LangGraph4j框架"
categories: spring
tags: [spring, ai, langgraph]
author: 百味皆苦
music-id: 3136952023
---
{% raw %}

## 简介

LangGraph4j 是一个专为 Java 生态设计的开源 **AI 智能体工作流编排框架**，是 Python 版 LangGraph 在 Java 生态中的官方实现。它专注于构建有状态的、多步骤复杂 AI 应用，让开发者可以通过图结构（Graph）来编排智能体的执行流程。

项目地址：https://github.com/langgraph4j/langgraph4j
官方文档：https://langgraph4j.github.io/langgraph4j/
当前最新版本：**1.8.14**

### 为什么需要 LangGraph4j？

LangChain4j 解决了"如何在 Java 中调用大模型"的问题，而 LangGraph4j 解决的是"**如何编排多个智能体/步骤的复杂工作流**"：

| 痛点 | 传统方案 | LangGraph4j 方案 |
|------|---------|-----------------|
| 状态管理 | 无状态或手动维护 | 完整的状态生命周期管理，支持 Channel 策略 |
| 流程控制 | 简单链式调用 | 支持顺序、条件、循环、并行等复杂流程 |
| 异步处理 | 同步阻塞 | 非阻塞异步执行，支持 CompletableFuture |
| 可视化 | 纯代码配置 | 图形化展示（Mermaid）和调试工具 |
| 容错恢复 | 无 | 检查点（Checkpoint）+ 断点续跑 |
| 人机协同 | 无 | 内置 Human-in-the-Loop 支持 |

### 核心设计理念

- **图结构编排**：通过节点（Node）和边（Edge）定义工作流，支持循环图结构，这对智能体的自我迭代至关重要
- **状态驱动**：所有节点共享 AgentState，通过 Channel 定义状态更新策略（覆盖/追加/自定义）
- **异步优先**：节点和边都支持异步操作，充分利用 Java 并发能力
- **框架无关**：同时支持 LangChain4j 和 Spring AI 两种底层框架
- **可观测性**：内置 Mermaid 图可视化、检查点、流式响应等调试能力

### LangChain4j vs LangGraph4j

| 维度 | LangChain4j | LangGraph4j |
|------|------------|-------------|
| 定位 | LLM 集成工具箱 | 工作流编排引擎 |
| 核心能力 | 模型调用、RAG、工具、记忆 | 流程编排、状态管理、多智能体协作 |
| 流程控制 | 链式/简单分支 | 图结构（顺序/条件/循环/并行/子图） |
| 适用场景 | 单步骤 LLM 调用 | 多步骤复杂 Agent 工作流 |
| 关系 | 基础设施层 | 编排层（可基于 LangChain4j） |

> **一句话总结**：LangChain4j 是"砖头"（提供基础能力），LangGraph4j 是"建筑师"（编排复杂流程）。两者配合使用，才能构建企业级 AI 应用。

### 模块结构

LangGraph4j 采用模块化设计：

| 模块 | 说明 |
|------|------|
| `langgraph4j-core` | 核心模块，包含 StateGraph、NodeAction、EdgeAction 等 |
| `langgraph4j-core-jdk8` | JDK 8 兼容版本 |
| `langgraph4j-langchain4j` | 与 LangChain4j 集成模块 |
| `langgraph4j-spring-ai` | 与 Spring AI 集成模块 |
| `langgraph4j-openai` | OpenAI 模型集成 |
| `langgraph4j-ollama` | Ollama 模型集成 |
| `langgraph4j-postgres-saver` | PostgreSQL 检查点持久化 |

## 快速开始

### 环境要求

- JDK 17+（核心模块）/ JDK 8+（JDK8 兼容模块）
- Maven 3.6+ 或 Gradle 7+

### 添加依赖

**Maven：**

```xml
<!-- 核心模块 -->
<dependency>
    <groupId>org.bsc.langgraph4j</groupId>
    <artifactId>langgraph4j-core</artifactId>
    <version>1.8.14</version>
</dependency>

<!-- 与 LangChain4j 集成（可选） -->
<dependency>
    <groupId>org.bsc.langgraph4j</groupId>
    <artifactId>langgraph4j-langchain4j</artifactId>
    <version>1.8.14</version>
</dependency>

<!-- 与 Spring AI 集成（可选） -->
<dependency>
    <groupId>org.bsc.langgraph4j</groupId>
    <artifactId>langgraph4j-spring-ai</artifactId>
    <version>1.8.14</version>
</dependency>
```

**JDK 8 项目：**

```xml
<dependency>
    <groupId>org.bsc.langgraph4j</groupId>
    <artifactId>langgraph4j-core-jdk8</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Gradle：**

```groovy
implementation 'org.bsc.langgraph4j:langgraph4j-core:1.8.14'
```

### 第一个示例：Hello World 顺序工作流

```java
import org.bsc.langgraph4j.GraphDefinition;
import org.bsc.langgraph4j.GraphStateException;
import org.bsc.langgraph4j.StateGraph;
import org.bsc.langgraph4j.state.AgentState;

import java.util.Map;

import static org.bsc.langgraph4j.action.AsyncNodeAction.node_async;

public class HelloWorldApp {

    public static void main(String[] args) throws GraphStateException {
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
                // 添加2个节点
                .addNode("greet", node_async(state -> {
                    System.out.println("Hello");
                    return Map.of("message", "Hello");
                }))
                .addNode("farewell", node_async(state -> {
                    System.out.println("World!");
                    return Map.of("message", "World!");
                }))
                // 定义边的连接
                .addEdge(GraphDefinition.START, "greet")
                .addEdge("greet", "farewell")
                .addEdge("farewell", GraphDefinition.END);

        // 打印 Mermaid 图
        System.out.println(graph.getGraph(
            GraphRepresentation.Type.MERMAID, "Hello World", true).content());

        // 编译并运行
        graph.compile()
             .invoke(Map.of("input", "test"))
             .ifPresent(c -> System.out.println("最终状态: " + c.data()));
    }
}
```

**运行结果：**

```
Hello
World!
最终状态: {input=test, message=World!}
```

> **解释**：`message` 字段被第二个节点覆盖为 "World!"，而 `input` 字段保持不变。每个节点返回的 Map 会 merge 进 AgentState。

## 核心概念

LangGraph4j 的核心只需要掌握三个概念：**节点（Node）**、**边（Edge）**、**状态（State）**。

### 1. 状态（AgentState）

状态是图在执行过程中共享的数据容器，所有节点都可以读取和更新状态。

```java
// 默认的 AgentState，本质是一个 Map<String, Object>
AgentState state = new AgentState(Map.of("key", "value"));

// 读取值
Optional<Object> value = state.value("key");

// 更新值（通过节点返回 Map）
// 节点返回的 Map 会自动 merge 到状态中
```

#### 自定义状态与 Schema

默认的 AgentState 没有类型约束，实际项目中推荐定义 Schema 和 Channel：

```java
public class OrderState extends AgentState {

    public static final Map<String, Channel<?>> SCHEMA = Map.of(
        "orderId",   Channels.base(() -> ""),                      // String，覆盖更新
        "amount",    Channels.base(() -> 0),                       // Integer，覆盖更新
        "price",     Channels.base(OrderState::minPrice),          // BigDecimal，自定义策略（取最低价）
        "total",     Channels.base(() -> BigDecimal.valueOf(0)),   // BigDecimal，覆盖更新
        "remark",    Channels.appender(ArrayList::new)             // List，追加更新
    );

    static BigDecimal minPrice(BigDecimal a, BigDecimal b) {
        if (a == null) return b;
        if (b == null) return a;
        return a.min(b);
    }

    public OrderState(Map<String, Object> initData) {
        super(initData);
    }

    // 强类型访问器
    public String orderId() {
        return this.<String>value("orderId").orElse("");
    }

    public BigDecimal price() {
        return this.<BigDecimal>value("price").orElse(BigDecimal.ZERO);
    }

    public List<String> remark() {
        return this.<List<String>>value("remark").orElse(new ArrayList<>());
    }
}
```

**使用 Schema 构建 StateGraph：**

```java
StateGraph<OrderState> graph = new StateGraph<>(OrderState.SCHEMA, OrderState::new);
```

#### Channel 更新策略

| Channel 类型 | 策略 | 适用场景 |
|-------------|------|---------|
| `Channels.base(supplier)` | 覆盖（新值替换旧值） | 订单号、金额、状态等 |
| `Channels.appender(supplier)` | 追加（新值追加到列表） | 备注列表、消息历史 |
| `Channels.base(customReducer)` | 自定义（传入合并函数） | 取最低价、求和等 |

> **实用技巧**：聊天场景中，消息列表应该使用 `Channels.appender`，这样每条消息都会追加而不是覆盖。LangGraph4j 内置了 `MessagesState`，就是使用 Appender Channel 管理消息列表。

#### MessagesState

LangGraph4j 内置了 `MessagesState`，专门用于聊天场景，消息字段使用追加策略：

```java
import org.bsc.langgraph4j.state.MessagesState;
import dev.langchain4j.data.message.ChatMessage;

// 使用 MessagesState
StateGraph<MessagesState<ChatMessage>> graph =
    new StateGraph<>(MessagesState.SCHEMA, MessagesState::<ChatMessage>new);
```

### 2. 节点（NodeAction）

节点是工作流中的执行单元，封装具体的业务逻辑。每个节点接收当前状态，返回要更新的状态数据。

```java
import org.bsc.langgraph4j.action.NodeAction;

// 方式1：实现 NodeAction 接口
public class AnalyzeIntentNode implements NodeAction<AgentState> {
    @Override
    public Map<String, Object> apply(AgentState state) throws Exception {
        String userInput = state.<String>value("input").orElse("");
        // 业务逻辑：分析意图
        String intent = analyzeIntent(userInput);
        return Map.of("intent", intent);
    }
}

// 方式2：Lambda 表达式（简单逻辑推荐）
StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
    .addNode("analyze", node_async(state -> {
        String input = state.<String>value("input").orElse("");
        return Map.of("intent", "greeting");
    }));
```

> **要点**：
> - 节点的 `apply()` 方法返回 `Map<String, Object>`，返回的数据会自动 merge 到状态中
> - 使用 `node_async()` 包装节点，支持异步执行
> - 同名的 key 会被新值覆盖（除非使用 Appender Channel）

### 3. 边（EdgeAction）

边定义了节点之间的流转关系，包括普通边和条件边。

#### 普通边（addEdge）

定义节点之间的固定流转：

```java
graph.addEdge(GraphDefinition.START, "node-1")  // 开始 → node-1
      .addEdge("node-1", "node-2")               // node-1 → node-2
      .addEdge("node-2", GraphDefinition.END);   // node-2 → 结束
```

#### 条件边（addConditionalEdges）

根据状态动态决定下一个节点：

```java
// 方式1：Lambda 表达式
graph.addConditionalEdges("node-1",
    state -> {
        String intent = state.<String>value("intent").orElse("");
        if ("complaint".equals(intent)) {
            return CompletableFuture.completedFuture("escalate");
        }
        return CompletableFuture.completedFuture("respond");
    },
    Map.of(
        "escalate", "escalate-node",
        "respond", "respond-node"
    )
);

// 方式2：实现 EdgeAction 接口
public class RoutingEdgeAction implements EdgeAction<AgentState> {
    @Override
    public String apply(AgentState state) throws Exception {
        String intent = state.<String>value("intent").orElse("");
        return "complaint".equals(intent) ? "escalate" : "respond";
    }
}

graph.addConditionalEdges("node-1",
    edge_async(new RoutingEdgeAction()),
    Map.of("escalate", "escalate-node", "respond", "respond-node")
);
```

> **条件边三要素**：源节点 + 路由函数 + 映射表。路由函数返回一个字符串 key，映射表决定该 key 对应的目标节点。

### 4. StateGraph 与编译

```java
// 构建图
StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
    .addNode("node-1", node_async(new Node1Action()))
    .addNode("node-2", node_async(new Node2Action()))
    .addEdge(START, "node-1")
    .addEdge("node-1", "node-2")
    .addEdge("node-2", END);

// 编译图
CompiledGraph<AgentState> workflow = graph.compile();

// 运行图
Optional<AgentState> result = workflow.invoke(Map.of("key", "initial-value"));
```

### 5. 图可视化

LangGraph4j 支持生成 Mermaid 图，方便调试和文档化：

```java
String mermaid = graph.getGraph(
    GraphRepresentation.Type.MERMAID, "My Workflow", true).content();
System.out.println(mermaid);
```

## 基础工作流

### 顺序工作流

最简单的线性流程：START → Node1 → Node2 → END

```
┌───────┐     ┌───────┐     ┌───────┐
│ START │────▶│node-1 │────▶│node-2 │────▶ END
└───────┘     └───────┘     └───────┘
```

```java
public class SequenceGraphApplication {

    public static void main(String[] args) throws GraphStateException {
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            .addNode("node-1", node_async(new Node1Action()))
            .addNode("node-2", node_async(new Node2Action()))
            .addEdge(GraphDefinition.START, "node-1")
            .addEdge("node-1", "node-2")
            .addEdge("node-2", GraphDefinition.END);

        graph.compile()
             .invoke(Map.of("test", "test-init-value"))
             .ifPresent(c -> System.out.println(c.data()));
    }
}

// 节点1：返回数据
class Node1Action implements NodeAction<AgentState> {
    @Override
    public Map<String, Object> apply(AgentState state) throws Exception {
        System.out.println("当前节点: node-1");
        return Map.of("myData", "node1-value", "node1Key", "node1-value");
    }
}

// 节点2：返回数据（myData 会被覆盖）
class Node2Action implements NodeAction<AgentState> {
    @Override
    public Map<String, Object> apply(AgentState state) throws Exception {
        System.out.println("当前节点: node-2");
        return Map.of("myData", "node2-value", "node2Key", "node2-value");
    }
}
```

**运行结果：**

```
当前节点: node-1
当前节点: node-2
{node1Key=node1-value, test=test-init-value, node2Key=node2-value, myData=node2-value}
```

> **注意**：`myData` 被节点2的值覆盖了，而其他 key 会被 merge 进状态。

### 条件工作流

根据节点输出的状态值动态决定流转方向：

```
                 ┌───────┐
          ┌─────▶│node-2 │─────▶ END
          │      └───────┘
┌───────┐ │
│node-1 │─┤
└───────┘ │
          │      ┌───────┐
          └─────▶│node-3 │─────▶ END
                 └───────┘
```

```java
public class ConditionalGraphApplication {

    public static void main(String[] args) throws GraphStateException {
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            .addNode("node-1", node_async(new Node1Action()))
            .addNode("node-2", node_async(new Node2Action()))
            .addNode("node-3", node_async(new Node3Action()))
            .addEdge(GraphDefinition.START, "node-1")
            // 条件边：根据 nextNode 的值决定路由
            .addConditionalEdges("node-1",
                edge_async(new RoutingEdgeAction(
                    Set.of("2", "3"), "2")),
                Map.of("2", "node-2", "3", "node-3"))
            .addEdge("node-2", GraphDefinition.END)
            .addEdge("node-3", GraphDefinition.END);

        graph.compile()
             .invoke(Map.of("nextNode", "3"))
             .ifPresent(c -> System.out.println(c.data()));
    }
}

// 条件边路由器
class RoutingEdgeAction implements EdgeAction<AgentState> {
    private final Set<String> allowedNodes;
    private final String defaultNode;

    public RoutingEdgeAction(Set<String> allowedNodes, String defaultNode) {
        this.allowedNodes = Set.copyOf(allowedNodes);
        this.defaultNode = defaultNode;
    }

    @Override
    public String apply(AgentState state) throws Exception {
        String next = state.<String>value("nextNode").orElse(defaultNode);
        return allowedNodes.contains(next) ? next : defaultNode;
    }
}
```

> **实用技巧**：条件边是构建智能体的核心能力。在 LLM Agent 中，通常由 LLM 决定调用哪个工具，这就是通过条件边实现的。

### 循环工作流

循环是条件工作流的变种，通过条件边控制循环的跳出：

```
┌───────┐     ┌───────┐     ┌───────┐
│ START │────▶│node-1 │──┬─▶│node-2 │
└───────┘     └───────┘  │  └───────┘
                  ▲      │      │
                  └──────┘      ▼
                 (循环)       END
                  (条件跳出)
```

```java
public class LoopGraphApplication {

    private static final int MAX_LOOP = 3;

    public static void main(String[] args) throws GraphStateException {
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            .addNode("node-1", node_async(new Node1Action()))
            .addNode("node-2", node_async(new Node2Action()))
            .addEdge(GraphDefinition.START, "node-1")
            .addEdge("node-2", "node-1")  // node-2 → node-1 形成循环
            .addConditionalEdges("node-1",
                state -> {
                    long count = state.<Number>value("loopCount")
                        .map(Number::longValue).orElse(0L);
                    if (count >= MAX_LOOP) {
                        return CompletableFuture.completedFuture("exit");
                    }
                    return CompletableFuture.completedFuture("continue");
                },
                Map.of("exit", GraphDefinition.END, "continue", "node-2"));

        graph.compile()
             .invoke(Map.of("loopCount", 0L))
             .ifPresent(c -> System.out.println(c.data()));
    }
}
```

> **安全提示**：循环工作流务必设置最大迭代次数，防止 Agent 陷入无限循环。特别是在 LLM Agent 中，LLM 可能反复调用同一个工具而不收敛。

### 并行工作流

多个节点从同一个源节点出发，并行执行：

```
                 ┌───────┐
          ┌─────▶│node-2 │──┐
          │      └───────┘  │
┌───────┐ │                 │    ┌─────┐
│node-1 │─┤                 ├───▶│ END │
└───────┘ │                 │    └─────┘
          │      ┌───────┐  │
          └─────▶│node-3 │──┘
                 └───────┘
```

```java
StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
    .addNode("node-1", node_async(new Node1Action()))
    .addNode("node-2", node_async(new Node2Action()))
    .addNode("node-3", node_async(new Node3Action()))
    .addEdge(START, "node-1")
    .addEdge("node-1", "node-2")  // 从 node-1 分支
    .addEdge("node-1", "node-3")  // 从 node-1 分支
    .addEdge("node-2", END)
    .addEdge("node-3", END);
```

#### 真正的并行：线程池加速

默认情况下，LangGraph4j 的并行分支是**顺序执行**的（总耗时 = 各分支之和）。要实现真正的并行，需要指定线程池：

```java
// 使用固定线程池
ExecutorService executor = Executors.newFixedThreadPool(2);
RunnableConfig rc = RunnableConfig.builder()
    .addParallelNodeExecutor("node-1", executor)  // node-1 后的分支并行
    .build();

graph.compile().invoke(Map.of("test", "value"), rc);

executor.shutdown();  // 别忘了关闭线程池
```

**性能对比：**

| 方式 | node-2(1s) + node-3(1s) 总耗时 |
|------|-------------------------------|
| 默认（顺序执行） | ~2000ms |
| FixedThreadPool(2) | ~1000ms |
| VirtualThreadPerTaskExecutor | ~1000ms |

> **JDK 21+ 推荐使用虚拟线程**：`Executors.newVirtualThreadPerTaskExecutor()`，无需手动管理线程池大小。

## 与 LangChain4j 集成

LangGraph4j 可以与 LangChain4j 无缝集成，构建基于 LLM 的智能体工作流。

### ReAct Agent（AgentExecutor）

ReAct（Reasoning and Acting）是最经典的 Agent 模式：LLM 推理 → 调用工具 → 观察结果 → 继续推理，循环直到任务完成。

LangGraph4j 提供了内置的 `AgentExecutor` 实现：

```java
import org.bsc.langgraph4j.langchain4j.AgentExecutor;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaChatModel;

// 1. 定义工具
public class WeatherTool {
    @Tool("查询指定城市的天气")
    String getWeather(@P("城市名称") String city) {
        return city + "今天晴天，气温25°C";
    }
}

// 2. 创建模型
ChatLanguageModel model = OllamaChatModel.builder()
    .baseUrl("http://localhost:11434")
    .modelName("qwen2.5:7b")
    .temperature(0.1)
    .build();

// 3. 构建 AgentExecutor
var agent = AgentExecutor.builder()
    .chatModel(model)
    .toolsFromObject(new WeatherTool())
    .build()
    .compile();

// 4. 运行
var result = agent.invoke(Map.of(
    "messages", new UserMessage("北京今天天气怎么样？")
));

result.ifPresent(state -> {
    state.<ChatMessage>value("messages")
         .ifPresent(msg -> System.out.println(msg));
});
```

**ReAct Agent 工作流程：**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Agent   │────▶│  Action  │────▶│Observation│
│ (推理)    │     │(执行工具) │     │(观察结果) │
└──────────┘     └──────────┘     └──────────┘
      ▲                                  │
      └──────────────────────────────────┘
              (循环直到完成)
```

### AgentExecutor 核心配置

```java
var agent = AgentExecutor.builder()
    .chatModel(chatModel)                     // LLM 模型
    .toolsFromObject(new MyTools())           // 工具对象
    .defaultSystem("你是一个有帮助的助手")      // 系统提示词
    .maxIterations(10)                        // 最大迭代次数（防止无限循环）
    .build()
    .compile();
```

> **生产建议**：务必设置 `maxIterations`，防止 LLM 反复调用工具而不收敛，把 API 预算烧光。

### 自定义 LLM 工作流

不使用 AgentExecutor，手动构建基于 LLM 的工作流图：

```java
// 定义 LLM 调用节点
NodeAction<AgentState> callModel = state -> {
    String userInput = state.<String>value("input").orElse("");
    String response = chatModel.generate(userInput);
    return Map.of("response", response);
};

// 定义工具调用节点
NodeAction<AgentState> callTool = state -> {
    String toolName = state.<String>value("toolName").orElse("");
    String toolInput = state.<String>value("toolInput").orElse("");
    String result = executeTool(toolName, toolInput);
    return Map.of("toolResult", result);
};

// 构建图
StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
    .addNode("agent", node_async(callModel))
    .addNode("tools", node_async(callTool))
    .addEdge(START, "agent")
    .addConditionalEdges("agent",
        state -> {
            boolean needsTool = state.<Boolean>value("needsTool").orElse(false);
            return needsTool ? "tools" : "end";
        },
        Map.of("tools", "tools", "end", END))
    .addEdge("tools", "agent");  // 工具结果返回给 Agent 继续推理
```

## 流式响应

流式响应是改善 LLM 应用用户体验的关键技术，可以有效缓解长耗时应用的焦虑感。

### 基础流式

```java
public class StreamGraphApplication {

    public static void main(String[] args) throws GraphStateException {
        StateGraph<MessagesState<String>> graph = getGraph();

        RunnableConfig rc = RunnableConfig.builder()
            .threadId("conversation-1")
            .streamMode(CompiledGraph.StreamMode.VALUES)
            .build();

        // 使用 stream() 方法（而不是 invoke()）
        AsyncGenerator<NodeOutput<MessagesState<String>>> result =
            graph.compile().stream(Map.of(), rc);

        System.out.println("=========流式stream模式========");
        for (NodeOutput<MessagesState<String>> output : result) {
            System.out.println("Node: " + output.node());
            if (!CollectionUtils.isEmpty(output.state().messages())) {
                System.out.println(output.state().messages());
            }

            // 可以取消流式执行
            if ("node-3".equalsIgnoreCase(output.node())) {
                result.cancel(true);
            }
        }
    }
}
```

### 与 LangChain4j 流式集成

使用 `StreamingChatGenerator` 实现与 LLM 的流式交互：

```java
import org.bsc.langgraph4j.langchain4j.StreamingChatGenerator;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;

public class LLMStreamGraphApp {

    public static void main(String[] args) throws GraphStateException {
        OllamaStreamingChatModel model = OllamaStreamingChatModel.builder()
            .baseUrl("http://localhost:11434")
            .modelName("qwen3:1.7b")
            .temperature(0.0)
            .build();

        // 定义 Agent 节点
        NodeAction<MessagesState<ChatMessage>> callModel = state -> {
            StreamingChatGenerator<MessagesState<ChatMessage>> generator =
                StreamingChatGenerator.<MessagesState<ChatMessage>>builder()
                    .mapResult(response -> Map.of(MESSAGES_STATE, response.aiMessage()))
                    .startingNode("agent")
                    .startingState(state)
                    .build();

            ChatRequest request = ChatRequest.builder()
                .messages(state.messages())
                .build();

            model.chat(request, generator.handler());
            return Map.of("_streaming_messages", generator);
        };

        // 构建图
        CompiledGraph<MessagesState<ChatMessage>> graph =
            new MessagesStateGraph<>(
                new LC4jStateSerializer<>(MessagesState::<ChatMessage>new))
                .addNode("agent", node_async(callModel))
                .addEdge(START, "agent")
                .addEdge("agent", END)
                .compile();

        // 流式执行
        AsyncGenerator<NodeOutput<MessagesState<ChatMessage>>> stream =
            graph.stream(Map.of(MESSAGES_STATE, UserMessage.from("介绍一下李清照的词风")));

        for (NodeOutput<MessagesState<ChatMessage>> out : stream) {
            if (out instanceof StreamingOutput<?> streamingOut) {
                System.out.print(streamingOut.chunk());
            }
        }
    }
}
```

### 流式 vs 非流式对比

| 维度 | `invoke()` | `stream()` |
|------|-----------|-----------|
| 返回方式 | 等待全部完成后返回 | 逐节点/逐 Token 返回 |
| 用户体验 | 长时间无响应 | 实时反馈 |
| 适用场景 | 后台任务、批量处理 | 对话、实时交互 |
| 取消支持 | 不支持 | 支持 `cancel()` |

## 检查点与状态持久化

检查点（Checkpoint）是 LangGraph4j 的核心特性之一，它可以在图执行过程中保存状态快照，实现断点续跑和"时间旅行"调试。

### CheckpointSaver 类型

| 类型 | 类名 | 适用场景 |
|------|------|---------|
| 内存 | `MemorySaver` | 开发调试、短期运行 |
| 文件系统 | `FileSystemSaver` | 本地持久化 |
| JSON 文件 | `JsonFileSystemSaver` | 跨平台持久化 |
| PostgreSQL | `langgraph4j-postgres-saver` | 生产环境 |

### 基本用法：中断 + 恢复

```java
// 1. 构建 CheckpointSaver
BaseCheckpointSaver saver = new MemorySaver();

// 2. 编译时配置中断和检查点
CompileConfig cc = CompileConfig.builder()
    .interruptBefore("node-3")       // 在 node-3 前中断
    .checkpointSaver(saver)          // 保存检查点
    .build();

RunnableConfig rc = RunnableConfig.builder()
    .threadId("thread-1")            // 线程ID（区分不同会话）
    .build();

CompiledGraph<MessagesState<String>> workflow = graph.compile(cc);

// 3. 首次运行：会在 node-3 前中断
workflow.invoke(Map.of(), rc)
    .ifPresent(state -> System.out.println("中断时状态: " + state.data()));
// 输出: [have, a]  (node-3 未执行)

// 4. 获取中断时的状态快照
StateSnapshot<MessagesState<String>> snapshot = workflow.getState(rc);
System.out.println("快照: " + snapshot.state().data());

// 5. 从断点恢复运行
RunnableConfig newRc = workflow.updateState(rc, snapshot.state().data());
workflow.invoke(GraphInput.resume(), newRc)
    .ifPresent(state -> System.out.println("恢复后状态: " + state.data()));
// 输出: [have, a, good, trip]  (node-3, node-4 继续执行)
```

### 检查点工作流程

```
invoke() ──▶ node-1 ──▶ node-2 ──▶ [interrupt + checkpoint] ──▶ 返回
                                                     │
                   getState() ◀─────────────────────┘
                                                     │
        updateState() + resume() ───────────────────┘
                         │
                         ▼
                    node-3 ──▶ node-4 ──▶ END
```

> **生产建议**：生产环境推荐使用 PostgreSQL 检查点存储（`langgraph4j-postgres-saver`），支持分布式部署和长期存储。

## 人机协同（Human-in-the-Loop）

人机协同是生产环境中至关重要的能力，允许在关键决策点暂停工作流，等待人类审批后继续。

### 基础人机协同

通过条件边 + 控制台输入实现简单的人机协同：

```java
public class HumanInLoopGraphApplication {

    private static final Scanner SCANNER = new Scanner(System.in);

    public static void main(String[] args) throws GraphStateException {
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            .addNode("node-1", node_async(state ->
                Map.of("loopCount", (int) state.value("loopCount").orElse(0) + 1)))
            .addNode("node-2", node_async(state -> Map.of()))
            .addEdge(GraphDefinition.START, "node-1")
            .addEdge("node-2", "node-1")
            .addConditionalEdges("node-1",
                state -> CompletableFuture.supplyAsync(
                    HumanInLoopGraphApplication::waitForHumanDecision),
                Map.of(
                    "exit", GraphDefinition.END,
                    "next", "node-2",
                    "back", "node-1"));

        graph.compile().stream(Map.of()).forEach(output ->
            System.out.println(output.node() + "->" +
                output.state().value("loopCount").orElse(0)));
    }

    private static String waitForHumanDecision() {
        System.out.print("请输入 N(继续) / B(回退) / Q(退出): ");
        String input = SCANNER.nextLine().trim().toUpperCase();
        return switch (input) {
            case "N" -> "next";
            case "B" -> "back";
            default -> "exit";
        };
    }
}
```

### 基于 Checkpoint 的高级人机协同

结合 Checkpoint + Interrupt 实现更可靠的人机协同：

```java
public class HumanInLoopAdvanced {

    public static void main(String[] args) throws Exception {
        StateGraph<AgentState> graph = getLoopGraph();

        BaseCheckpointSaver saver = new MemorySaver();
        CompileConfig compileConfig = CompileConfig.builder()
            .interruptBefore("node-2")       // 在 node-2 前中断
            .interruptBefore("node-reset")   // 在 node-reset 前中断
            .checkpointSaver(saver)          // 保存检查点
            .build();

        RunnableConfig rc = RunnableConfig.builder().threadId("thread-1").build();
        CompiledGraph<AgentState> workflow = graph.compile(compileConfig);

        // 首次运行到中断点
        workflow.stream(Map.of(), rc).forEach(output ->
            System.out.println(output.node() + "->" + output.state().data()));

        // 循环：获取快照 → 用户决策 → 恢复/重置
        boolean isQuit = false;
        while (!isQuit) {
            StateSnapshot<AgentState> snapshot = workflow.getState(rc);
            if (snapshot == null) break;

            System.out.println("当前快照: " + snapshot.state().data());

            // 用户决策
            String decision = getUserDecision();

            if ("R".equals(decision)) {
                // 重置：清零 loopCount 并清空 checkpoint 历史
                workflow.stream(GraphInput.resume(),
                    workflow.updateState(rc, Map.of("loopCount", 0)));
                saver.release(rc);
            } else if ("Q".equals(decision)) {
                isQuit = true;
            } else {
                // 继续：从 checkpoint 恢复
                workflow.stream(GraphInput.resume(),
                    workflow.updateState(rc, snapshot.state().data()));
            }
        }
    }
}
```

### AgentExecutorEx：带审批的 ReAct Agent

LangGraph4j 提供了 `AgentExecutorEx`，在 ReAct Agent 基础上增加了人工审批能力：

```java
import org.bsc.langgraph4j.langchain4j.AgentExecutorEx;
import org.bsc.langgraph4j.InterruptionMetadata;

// 1. 构建带审批的 Agent
var agent = AgentExecutorEx.builder()
    .chatModel(chatModel)
    .toolsFromObject(new Tools())
    .approvalOn("deleteData", (nodeId, state) ->    // 对 deleteData 工具要求审批
        InterruptionMetadata.builder(nodeId, state)
            .addMetadata("label", "确认执行删除操作？")
            .build())
    .build()
    .compile(compileConfig);

// 2. 执行循环
while (true) {
    var generator = agent.stream(input, runnableConfig);
    var lastNode = generator.stream().reduce((a, b) -> b).orElseThrow();

    if (lastNode.isEND()) {
        System.out.println("结果: " + lastNode.state().finalResponse().orElseThrow());
        break;
    }

    // 获取中断元数据
    var interruption = (InterruptionMetadata<?>) AsyncGenerator.resultValue(generator).orElseThrow();
    String answer = console.readLine(interruption.metadata("label").orElse("确认执行？") + " (Y/N): ");

    // 注入审批结果
    if ("Y".equalsIgnoreCase(answer)) {
        runnableConfig = agent.updateState(runnableConfig,
            Map.of(AgentEx.APPROVAL_RESULT_PROPERTY, AgentEx.ApprovalState.APPROVED.name()));
    } else {
        runnableConfig = agent.updateState(runnableConfig,
            Map.of(AgentEx.APPROVAL_RESULT_PROPERTY, AgentEx.ApprovalState.REJECTED.name()));
    }
    input = null;  // 恢复时不需要新输入
}
```

> **企业级最佳实践**：对于涉及数据修改、资金操作、发送通知等不可逆操作，务必加入人工审批环节。这是 AI Agent 在生产环境安全运行的基本保障。

## 多智能体协作（Multi-Agent）

### Agent Handoff 模式

Agent Handoff 是多智能体协作的经典模式：一个主导 Agent 根据用户需求，将控制权交接给专业的子 Agent。

LangGraph4j 提供了 `AbstractAgentExecutor` 和 `AgentHandoff` 来实现这一模式：

```java
// 1. 定义市场搜索 Agent
public class AgentMarketplace extends AbstractAgentExecutor<AgentMarketplace.Builder> {

    static class Tools {
        record Product(String name, double price, String currency) {}

        @Tool(description = "search for a specific product in the marketplace")
        Product searchByProduct(@ToolParam(description = "the product name") String product) {
            // 实现搜索逻辑
            return new Product(product, 99.99, "CNY");
        }
    }

    public static class Builder extends AbstractAgentExecutor.Builder<AgentMarketplace.Builder> {
        public AgentMarketplace build() throws GraphStateException {
            this.name("marketplace")
                .description("marketplace agent, ask for information about products")
                .parameterDescription("all information request about the products")
                .defaultSystem("You are the agent that provides product information.")
                .toolsFromObject(new Tools());
            return new AgentMarketplace(this);
        }
    }

    public static Builder builder() { return new Builder(); }
    protected AgentMarketplace(Builder builder) throws GraphStateException { super(builder); }
}

// 2. 定义支付 Agent
public class AgentPayment extends AbstractAgentExecutor<AgentPayment.Builder> {

    static class Tools {
        @Tool(description = "submit a payment for purchasing a product")
        String submitPayment(
            @ToolParam(description = "product name") String product,
            @ToolParam(description = "price") double price,
            @ToolParam(description = "IBAN") String iban) {
            return "支付成功: " + product;
        }
    }

    public static class Builder extends AbstractAgentExecutor.Builder<AgentPayment.Builder> {
        public AgentPayment build() throws GraphStateException {
            this.name("payment")
                .description("payment agent, request purchase and payment transactions")
                .parameterDescription("all information about purchasing")
                .defaultSystem("You are the agent that provides payment service.")
                .toolsFromObject(new Tools());
            return new AgentPayment(this);
        }
    }

    public static Builder builder() { return new Builder(); }
    protected AgentPayment(Builder builder) throws GraphStateException { super(builder); }
}

// 3. 组装 Agent Handoff
var model = OllamaChatModel.builder()
    .baseUrl("http://localhost:11434")
    .modelName("qwen2.5:7b")
    .build();

var agentMarketplace = AgentMarketplace.builder().chatModel(model).build();
var agentPayment = AgentPayment.builder().chatModel(model).build();

var handoffExecutor = AgentHandoff.builder()
    .chatModel(model)
    .agent(agentMarketplace)   // 注册子 Agent
    .agent(agentPayment)       // 注册子 Agent
    .build()
    .compile();

// 4. 测试
var result = handoffExecutor.invoke(Map.of(
    "messages", new UserMessage("搜索产品X并购买它")
));
```

**Agent Handoff 工作流：**

```
┌──────────────┐     ┌──────────────────┐
│  Handoff     │────▶│ AgentMarketplace │ (搜索产品)
│  Controller  │     └──────────────────┘
│  (主导Agent) │              │
│              │◀─────────────┘ (返回结果)
│              │
│              │────▶┌──────────────────┐
│              │     │  AgentPayment    │ (执行支付)
│              │     └──────────────────┘
│              │◀─────────────┘ (返回结果)
└──────────────┘
```

> **核心思想**：子 Agent 本质上是主导 Agent 的"工具"。主导 Agent 通过 Function Call 来决定何时将控制权交给哪个子 Agent。

### 监督者模式（Supervisor）

监督者模式是更高级的多智能体协作模式，一个监督者 Agent 负责任务分配和结果审核：

```java
// 监督者模式的核心思想
StateGraph<AgentState> supervisorGraph = new StateGraph<>(AgentState::new)
    .addNode("supervisor", node_async(supervisorNode))
    .addNode("agent_a", node_async(agentANode))
    .addNode("agent_b", node_async(agentBNode))
    .addNode("reviewer", node_async(reviewerNode))
    .addEdge(START, "supervisor")
    .addConditionalEdges("supervisor",
        state -> {
            String task = state.<String>value("taskType").orElse("");
            return switch (task) {
                case "analysis" -> "agent_a";
                case "generation" -> "agent_b";
                default -> "end";
            };
        },
        Map.of("agent_a", "agent_a", "agent_b", "agent_b", "end", END))
    .addEdge("agent_a", "reviewer")
    .addEdge("agent_b", "reviewer")
    .addConditionalEdges("reviewer",
        state -> {
            boolean approved = state.<Boolean>value("approved").orElse(false);
            return approved ? "end" : "supervisor";  // 不通过则打回重做
        },
        Map.of("end", END, "supervisor", "supervisor"));
```

### 多智能体模式对比

| 模式 | 特点 | 适用场景 |
|------|------|---------|
| Agent Handoff | 主导 Agent 交接给子 Agent | 客服路由、任务分发 |
| Supervisor | 监督者分配+审核 | 需要质量控制的场景 |
| 并行协作 | 多 Agent 同时处理不同子任务 | 多源信息检索、并行分析 |
| 串行流水线 | Agent 依次处理 | 代码审查→安全审查→部署 |

## 子图（SubGraph）

子图允许将复杂逻辑封装为独立的可复用模块，实现系统解耦和分层设计。

### 定义子图

```java
// 定义文档处理子图
StateGraph<DocState> docProcessingSubGraph = new StateGraph<>(DocState.SCHEMA, DocState::new)
    .addNode("parse_document", node_async(state -> {
        // 解析文档逻辑
        String rawDoc = state.<String>value("rawDocument").orElse("");
        return Map.of("parsedContent", parseDocument(rawDoc));
    }))
    .addNode("extract_info", node_async(state -> {
        // 提取关键信息
        String content = state.<String>value("parsedContent").orElse("");
        return Map.of("extractedInfo", extractKeyInfo(content));
    }))
    .addNode("validate", node_async(state -> {
        // 校验提取结果
        String info = state.<String>value("extractedInfo").orElse("");
        return Map.of("isValid", !info.isEmpty());
    }))
    .addEdge(START, "parse_document")
    .addEdge("parse_document", "extract_info")
    .addEdge("extract_info", "validate")
    .addEdge("validate", END);
```

### 在主图中引用子图

```java
StateGraph<MainState> mainGraph = new StateGraph<>(MainState::new)
    .addNode("receive_request", node_async(receiveRequestNode))
    .addNode("doc_processing", docProcessingSubGraph.compile())  // 引用子图
    .addNode("generate_response", node_async(generateResponseNode))
    .addEdge(START, "receive_request")
    .addEdge("receive_request", "doc_processing")
    .addEdge("doc_processing", "generate_response")
    .addEdge("generate_response", END);
```

> **模块化优势**：
> - 子图可以独立开发和测试
> - 子图可以在多个主图中复用
> - 支持多层嵌套，构建复杂的分层系统

## 与 Spring AI 集成

LangGraph4j 不仅支持 LangChain4j，还与 Spring AI 深度集成，为 Spring Boot 开发者提供熟悉的编程体验。

### 基本集成

```xml
<dependency>
    <groupId>org.bsc.langgraph4j</groupId>
    <artifactId>langgraph4j-spring-ai</artifactId>
    <version>1.8.14</version>
</dependency>
```

```java
import org.bsc.langgraph4j.springai.AgentExecutor;

var model = ChatClient.builder(chatModel).build();

var agent = AgentExecutor.builder()
    .chatModel(model)
    .toolsFromObject(new MyTools())
    .build()
    .compile();
```

### Skill-Based Sub-Agent

Spring AI 集成支持基于技能的子 Agent 模式：

```java
// 定义技能 Agent
public class SearchAgent extends AbstractAgentExecutor<SearchAgent.Builder> {
    static class Tools {
        @Tool("搜索相关信息")
        String search(@ToolParam("搜索关键词") String query) {
            return searchService.search(query);
        }
    }

    public static class Builder extends AbstractAgentExecutor.Builder<SearchAgent.Builder> {
        public SearchAgent build() throws GraphStateException {
            this.name("search")
                .description("搜索 Agent，负责信息检索")
                .parameterDescription("需要搜索的关键词")
                .defaultSystem("你是专业的搜索助手")
                .toolsFromObject(new Tools());
            return new SearchAgent(this);
        }
    }
}
```

### Spring Boot 完整集成示例

```java
@Configuration
public class LangGraph4jConfig {

    @Bean
    public CompiledGraph<AgentState> workflow(ChatModel chatModel) throws GraphStateException {
        return new StateGraph<>(AgentState::new)
            .addNode("analyze", node_async(state -> {
                String input = state.<String>value("input").orElse("");
                // 使用 Spring AI 的 ChatModel
                String response = chatModel.call(input);
                return Map.of("analysis", response);
            }))
            .addNode("respond", node_async(state -> {
                String analysis = state.<String>value("analysis").orElse("");
                return Map.of("output", "基于分析结果: " + analysis);
            }))
            .addEdge(START, "analyze")
            .addEdge("analyze", "respond")
            .addEdge("respond", END)
            .compile();
    }
}

@RestController
@RequestMapping("/api/agent")
public class AgentController {

    private final CompiledGraph<AgentState> workflow;

    public AgentController(CompiledGraph<AgentState> workflow) {
        this.workflow = workflow;
    }

    @PostMapping("/chat")
    public Map<String, Object> chat(@RequestBody Map<String, String> request) {
        return workflow.invoke(Map.of("input", request.get("message")))
            .map(state -> state.data())
            .orElse(Map.of());
    }
}
```

## 企业级最佳实践

### 1. 状态设计原则

- **最小化状态**：只保留必要的状态字段，避免状态膨胀
- **使用 Schema**：定义 Schema 和 Channel，保证类型安全和更新策略清晰
- **不可变数据**：节点返回新的 Map，不要直接修改传入的 State

### 2. 图结构设计

- **单一职责**：每个节点只做一件事
- **命名规范**：节点命名清晰表达功能，如 `analyze_intent`、`search_products`
- **合理拆分**：复杂逻辑拆分为多个节点，简单逻辑合并到一个节点
- **使用子图**：可复用的逻辑封装为子图

### 3. Agent 安全规范

- **最大迭代次数**：务必设置 `maxIterations`，防止无限循环
- **人工审批**：对危险操作（删除、支付、发送）加入审批环节
- **输入校验**：工具方法中做好输入校验，防止注入攻击
- **输出过滤**：对 LLM 输出进行敏感信息过滤

### 4. 性能优化

- **并行执行**：利用线程池或虚拟线程实现真正的并行分支
- **流式响应**：长耗时任务使用流式响应，改善用户体验
- **状态裁剪**：使用 `TokenWindowChatMemory` 或自定义策略控制状态大小
- **模型选择**：简单任务用小模型，复杂任务用大模型

### 5. 容错与降级

```java
// 三级降级策略
StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
    .addNode("primary_model", node_async(state -> {
        try {
            String response = primaryModel.generate(input);
            return Map.of("response", response);
        } catch (Exception e) {
            return Map.of("fallback", true);
        }
    }))
    .addNode("backup_model", node_async(state -> {
        String response = backupModel.generate(input);
        return Map.of("response", response);
    }))
    .addNode("default_response", node_async(state ->
        Map.of("response", "抱歉，服务暂时不可用，请稍后重试")))
    .addEdge(START, "primary_model")
    .addConditionalEdges("primary_model",
        state -> state.<Boolean>value("fallback").orElse(false) ? "backup" : "end",
        Map.of("backup", "backup_model", "end", END))
    .addConditionalEdges("backup_model",
        state -> state.<Boolean>value("fallback").orElse(false) ? "default" : "end",
        Map.of("default", "default_response", "end", END))
    .addEdge("default_response", END);
```

### 6. 可观测性

```java
// 添加节点执行钩子
graph.addBeforeCallNodeHook((node, data, config) -> {
    log.info("执行节点: {}, 状态: {}", node, data);
    return CompletableFuture.completedFuture(data);
});

graph.addAfterCallNodeHook((node, data, config) -> {
    log.info("节点完成: {}, 状态: {}", node, data);
    return CompletableFuture.completedFuture(data);
});
```

### 7. 企业级应用场景

| 应用场景 | 核心技术 | 实现复杂度 | 业务价值 |
|---------|---------|-----------|---------|
| 智能客服路由 | Agent Handoff + 条件边 | 中 | 准确率提升40% |
| 文档审核流水线 | 子图 + 人机协同 | 中高 | 审核效率提升5倍 |
| 多源数据检索 | 并行工作流 + RAG | 中 | 检索效率提升10倍 |
| 代码审查 | 监督者模式 + 工具调用 | 高 | 代码质量提升30% |
| 交易风控 | 条件工作流 + 人机审批 | 高 | 风险事件减少60% |
| 自动化运维 | ReAct Agent + 审批 | 中高 | 故障响应速度提升3倍 |

## 实战案例

### 实战一：智能客服路由系统

基于 Agent Handoff 模式，根据用户意图自动路由到专业 Agent：

```java
// 1. 定义订单查询 Agent
public class OrderAgent extends AbstractAgentExecutor<OrderAgent.Builder> {
    static class Tools {
        @Tool("查询订单状态")
        String queryOrder(@ToolParam("订单号") String orderNo) {
            return orderService.getStatus(orderNo);
        }

        @Tool("申请退款")
        String refundOrder(@ToolParam("订单号") String orderNo) {
            return orderService.refund(orderNo);
        }
    }

    public static class Builder extends AbstractAgentExecutor.Builder<OrderAgent.Builder> {
        public OrderAgent build() throws GraphStateException {
            this.name("order_agent")
                .description("订单查询与售后 Agent，处理订单相关请求")
                .parameterDescription("用户的订单相关问题")
                .defaultSystem("你是专业的订单客服，帮助用户查询订单和处理售后。")
                .toolsFromObject(new Tools());
            return new OrderAgent(this);
        }
    }
}

// 2. 定义技术支持 Agent
public class TechAgent extends AbstractAgentExecutor<TechAgent.Builder> {
    static class Tools {
        @Tool("搜索知识库")
        String searchKB(@ToolParam("问题关键词") String keyword) {
            return knowledgeBase.search(keyword);
        }
    }

    public static class Builder extends AbstractAgentExecutor.Builder<TechAgent.Builder> {
        public TechAgent build() throws GraphStateException {
            this.name("tech_agent")
                .description("技术支持 Agent，解答产品使用问题")
                .parameterDescription("用户的技术问题")
                .defaultSystem("你是专业的技术支持，帮助用户解决产品使用问题。")
                .toolsFromObject(new Tools());
            return new TechAgent(this);
        }
    }
}

// 3. 组装 Handoff
var handoff = AgentHandoff.builder()
    .chatModel(model)
    .agent(OrderAgent.builder().chatModel(model).build())
    .agent(TechAgent.builder().chatModel(model).build())
    .build()
    .compile();

// 4. 测试
handoff.invoke(Map.of("messages",
    new UserMessage("我的订单12345怎么还没发货？")));
handoff.invoke(Map.of("messages",
    new UserMessage("如何重置密码？")));
```

### 实战二：文档审核流水线

多步骤审核流程，支持人机协同和断点续跑：

```java
public class DocumentReviewWorkflow {

    public static void main(String[] args) throws Exception {
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            // 步骤1：自动初审
            .addNode("auto_review", node_async(state -> {
                String doc = state.<String>value("document").orElse("");
                String reviewResult = chatModel.generate(
                    "请审核以下文档是否合规:\n" + doc);
                return Map.of("autoReviewResult", reviewResult);
            }))
            // 步骤2：提取关键信息
            .addNode("extract_info", node_async(state -> {
                String doc = state.<String>value("document").orElse("");
                String info = chatModel.generate(
                    "请提取以下文档的关键条款:\n" + doc);
                return Map.of("keyInfo", info);
            }))
            // 步骤3：人工复核（需要审批）
            .addNode("human_review", node_async(state -> {
                // 此节点前会 interrupt，等待人工审批
                boolean approved = state.<Boolean>value("approved").orElse(false);
                return Map.of("finalResult", approved ? "审核通过" : "审核不通过");
            }))
            .addEdge(START, "auto_review")
            .addEdge("auto_review", "extract_info")
            .addEdge("extract_info", "human_review")
            .addEdge("human_review", END);

        // 配置：在人工复核前中断
        BaseCheckpointSaver saver = new MemorySaver();
        CompileConfig cc = CompileConfig.builder()
            .interruptBefore("human_review")
            .checkpointSaver(saver)
            .build();

        CompiledGraph<AgentState> workflow = graph.compile(cc);
        RunnableConfig rc = RunnableConfig.builder().threadId("review-1").build();

        // 首次运行到中断点
        workflow.invoke(Map.of("document", "合同内容..."), rc);

        // 模拟人工审批
        StateSnapshot<AgentState> snapshot = workflow.getState(rc);
        System.out.println("自动审核结果: " + snapshot.state().data());

        // 注入审批结果并恢复
        RunnableConfig newRc = workflow.updateState(rc, Map.of("approved", true));
        workflow.invoke(GraphInput.resume(), newRc)
            .ifPresent(s -> System.out.println("最终结果: " + s.data()));
    }
}
```

### 实战三：AI 网站生成系统

基于 Spring Boot + LangChain4j + LangGraph4j 的 AI 网站生成系统：

```java
@Configuration
public class WebsiteGeneratorConfig {

    @Bean
    public CompiledGraph<AgentState> websiteGenerator(ChatModel model) throws GraphStateException {

        // 节点1：需求分析
        NodeAction<AgentState> analyzeRequirements = state -> {
            String userRequest = state.<String>value("userRequest").orElse("");
            String analysis = model.generate("分析以下网站需求:\n" + userRequest);
            return Map.of("requirementAnalysis", analysis);
        };

        // 节点2：生成 HTML
        NodeAction<AgentState> generateHtml = state -> {
            String analysis = state.<String>value("requirementAnalysis").orElse("");
            String html = model.generate("根据以下需求生成HTML代码:\n" + analysis);
            return Map.of("htmlCode", html);
        };

        // 节点3：代码审查
        NodeAction<AgentState> reviewCode = state -> {
            String html = state.<String>value("htmlCode").orElse("");
            String review = model.generate("审查以下HTML代码质量:\n" + html);
            return Map.of("codeReview", review);
        };

        // 节点4：修正代码（审查不通过时执行）
        NodeAction<AgentState> fixCode = state -> {
            String html = state.<String>value("htmlCode").orElse("");
            String review = state.<String>value("codeReview").orElse("");
            String fixed = model.generate(
                "根据以下审查意见修正HTML代码:\n原始代码:\n" + html + "\n审查意见:\n" + review);
            return Map.of("htmlCode", fixed);
        };

        return new StateGraph<>(AgentState::new)
            .addNode("analyze", node_async(analyzeRequirements))
            .addNode("generate", node_async(generateHtml))
            .addNode("review", node_async(reviewCode))
            .addNode("fix", node_async(fixCode))
            .addEdge(START, "analyze")
            .addEdge("analyze", "generate")
            .addEdge("generate", "review")
            .addConditionalEdges("review",
                state -> {
                    boolean pass = state.<String>value("codeReview")
                        .map(r -> r.contains("通过") || r.contains("PASS"))
                        .orElse(false);
                    return pass ? "end" : "fix";
                },
                Map.of("fix", "fix", "end", END))
            .addEdge("fix", "review")  // 修正后再审查（循环）
            .compile();
    }
}
```

### 实战四：金融交易风控 Agent

带有多级审批和并行风险评估的金融交易风控系统：

```java
public class RiskControlWorkflow {

    public static void main(String[] args) throws Exception {
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            // 并行风险评估（3个维度）
            .addNode("risk_score", node_async(state -> {
                double amount = state.<Number>value("amount").map(Number::doubleValue).orElse(0.0);
                double score = calculateRiskScore(amount);
                return Map.of("riskScore", score);
            }))
            .addNode("aml_check", node_async(state -> {
                String account = state.<String>value("account").orElse("");
                boolean flagged = amlService.check(account);
                return Map.of("amlFlagged", flagged);
            }))
            .addNode("behavior_analysis", node_async(state -> {
                String account = state.<String>value("account").orElse("");
                boolean anomaly = behaviorService.detectAnomaly(account);
                return Map.of("behaviorAnomaly", anomaly);
            }))
            // 汇总决策
            .addNode("decision", node_async(state -> {
                double score = state.<Number>value("riskScore").map(Number::doubleValue).orElse(0.0);
                boolean amlFlagged = state.<Boolean>value("amlFlagged").orElse(false);
                boolean anomaly = state.<Boolean>value("behaviorAnomaly").orElse(false);

                if (amlFlagged) return Map.of("decision", "REJECT", "reason", "AML风险");
                if (anomaly && score > 0.7) return Map.of("decision", "MANUAL_REVIEW");
                if (score > 0.9) return Map.of("decision", "MANUAL_REVIEW");
                return Map.of("decision", "APPROVE");
            }))
            // 人工审批
            .addNode("manual_review", node_async(state -> {
                boolean approved = state.<Boolean>value("approved").orElse(false);
                return Map.of("decision", approved ? "APPROVE" : "REJECT");
            }))
            .addEdge(START, "risk_score")
            .addEdge(START, "aml_check")
            .addEdge(START, "behavior_analysis")
            .addEdge("risk_score", "decision")
            .addEdge("aml_check", "decision")
            .addEdge("behavior_analysis", "decision")
            .addConditionalEdges("decision",
                state -> state.<String>value("decision").orElse("APPROVE"),
                Map.of("APPROVE", END, "REJECT", END, "MANUAL_REVIEW", "manual_review"))
            .addEdge("manual_review", END);

        // 配置并行执行
        ExecutorService executor = Executors.newFixedThreadPool(3);
        RunnableConfig rc = RunnableConfig.builder()
            .addParallelNodeExecutor(START, executor)
            .build();

        // 配置人工审批中断
        BaseCheckpointSaver saver = new MemorySaver();
        CompileConfig cc = CompileConfig.builder()
            .interruptBefore("manual_review")
            .checkpointSaver(saver)
            .build();

        CompiledGraph<AgentState> workflow = graph.compile(cc);
        workflow.invoke(Map.of("account", "ACC001", "amount", 50000.0), rc);

        executor.shutdown();
    }
}
```

### 实战五：用 LangGraph4j 实现 Dify 风格的工作流引擎

Dify 是目前最流行的 AI 应用低代码平台之一，其核心能力是可视化工作流编排。很多开发者会问：**能不能用 LangGraph4j 实现 Dify 的工作流？** 答案是肯定的，而且 LangGraph4j 在灵活性和可编程性上更具优势。

#### Dify vs LangGraph4j 定位对比

| 维度 | Dify | LangGraph4j |
|------|------|-------------|
| 核心定位 | 低代码可视化 AI 应用平台 | 代码优先的工作流编排框架 |
| 使用方式 | 拖拽式可视化编排 | Java 代码编程式编排 |
| 优势 | 零代码、快速搭建、非技术人员可用 | 灵活性高、可精细控制、易集成企业系统 |
| 劣势 | 灵活性受限、复杂逻辑难实现 | 需要编程能力、无可视化编辑器 |
| 适用团队 | 产品经理/运营也可参与 | 开发者主导 |
| 部署方式 | SaaS 或自部署 Docker | 嵌入到 Java 应用中 |
| 状态管理 | 平台托管 | 开发者完全控制 |

> **结论**：Dify 适合快速原型和简单场景，LangGraph4j 适合需要精细控制和企业级集成的复杂场景。两者不是替代关系，而是互补关系。

#### Dify 节点类型与 LangGraph4j 映射

Dify 的工作流由各类节点组成，每种节点都可以用 LangGraph4j 的对应机制实现：

| Dify 节点类型 | 功能说明 | LangGraph4j 对应实现 |
|-------------|---------|-------------------|
| **开始节点** | 工作流入口，定义输入变量 | `addEdge(START, "first_node")` + 初始状态 |
| **结束节点** | 工作流出口，定义输出变量 | `addEdge("last_node", END)` + 最终状态 |
| **直接回复节点** | 向用户返回响应 | 终端节点返回 `Map.of("response", ...)` |
| **LLM 节点** | 调用大语言模型 | NodeAction 中调用 `chatModel.generate()` |
| **知识检索节点** | RAG 检索知识库 | NodeAction 中调用 EmbeddingStore + Retriever |
| **问题分类节点** | 对用户输入分类 | 条件边 `addConditionalEdges()` + LLM 分类 |
| **条件分支节点** | IF/ELIF/ELSE 条件路由 | `addConditionalEdges()` + EdgeAction |
| **迭代节点** | 对数组逐项处理 | 循环工作流 + Appender Channel |
| **代码执行节点** | 运行自定义代码 | NodeAction 中编写任意 Java 代码 |
| **模板转换节点** | 数据格式转换 | NodeAction + PromptTemplate |
| **变量聚合节点** | 多分支变量合并 | AgentState 自动 merge + Schema 策略 |
| **变量赋值节点** | 动态更新变量 | NodeAction 返回 `Map.of(key, value)` |
| **HTTP 请求节点** | 调用外部 API | NodeAction 中使用 HttpClient/RestTemplate |
| **工具节点** | 调用预定义工具 | `@Tool` 注解 + AgentExecutor |

#### 实现一：Dify 风格的通用工作流引擎

以下是一个用 LangGraph4j 实现的通用工作流引擎，支持 Dify 的核心节点类型：

```java
/**
 * Dify 风格的通用工作流引擎
 * 支持：LLM节点、条件分支、迭代、HTTP请求、变量聚合、知识检索
 */
public class DifyStyleWorkflowEngine {

    private final ChatLanguageModel chatModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;

    public DifyStyleWorkflowEngine(ChatLanguageModel chatModel,
                                   EmbeddingStore<TextSegment> embeddingStore,
                                   EmbeddingModel embeddingModel) {
        this.chatModel = chatModel;
        this.embeddingStore = embeddingStore;
        this.embeddingModel = embeddingModel;
    }

    // ==================== Dify 节点工厂方法 ====================

    /**
     * 对应 Dify「LLM 节点」
     * 调用大语言模型，支持系统提示词和变量模板
     */
    public NodeAction<AgentState> llmNode(String systemPrompt, String userPromptKey, String outputKey) {
        return state -> {
            String userPrompt = state.<String>value(userPromptKey).orElse("");
            // 支持变量替换：{{variable}} 格式
            String resolvedSystem = resolveVariables(systemPrompt, state);
            String resolvedUser = resolveVariables(userPrompt, state);

            String response = chatModel.generate(
                SystemMessage.from(resolvedSystem),
                UserMessage.from(resolvedUser)
            );
            return Map.of(outputKey, response);
        };
    }

    /**
     * 对应 Dify「知识检索节点」
     * 从向量数据库检索相关文档
     */
    public NodeAction<AgentState> knowledgeRetrievalNode(String queryKey, String outputKey) {
        return state -> {
            String query = state.<String>value(queryKey).orElse("");
            EmbeddingQuery embeddingQuery = new EmbeddingQuery(query);
            List<EmbeddingMatch<TextSegment>> matches =
                embeddingStore.search(embeddingQuery, 5);

            String context = matches.stream()
                .map(match -> match.embedded().text())
                .collect(Collectors.joining("\n\n"));
            return Map.of(outputKey, context);
        };
    }

    /**
     * 对应 Dify「问题分类节点」
     * 使用 LLM 对用户输入进行意图分类
     */
    public NodeAction<AgentState> classifyNode(String inputKey, String outputKey,
                                               List<String> categories) {
        return state -> {
            String input = state.<String>value(inputKey).orElse("");
            String categoryPrompt = String.format(
                "请将以下用户输入分类到以下类别之一：%s\n用户输入：%s\n只输出类别名称",
                String.join("、", categories), input);
            String category = chatModel.generate(categoryPrompt).trim();
            return Map.of(outputKey, category);
        };
    }

    /**
     * 对应 Dify「HTTP 请求节点」
     * 调用外部 REST API
     */
    public NodeAction<AgentState> httpRequestNode(String urlKey, String method,
                                                   String bodyKey, String outputKey) {
        return state -> {
            String url = state.<String>value(urlKey).orElse("");
            String body = state.<String>value(bodyKey).orElse("");

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create(url));

            if ("POST".equalsIgnoreCase(method)) {
                requestBuilder.POST(HttpRequest.BodyPublishers.ofString(body))
                    .header("Content-Type", "application/json");
            } else {
                requestBuilder.GET();
            }

            HttpResponse<String> response = client.send(
                requestBuilder.build(), HttpResponse.BodyHandlers.ofString());
            return Map.of(outputKey, response.body());
        };
    }

    /**
     * 对应 Dify「代码执行节点」
     * 执行自定义逻辑（这里用策略模式替代动态代码执行）
     */
    public NodeAction<AgentState> codeNode(String outputKey,
                                           Function<AgentState, Map<String, Object>> logic) {
        return state -> logic.apply(state);
    }

    /**
     * 对应 Dify「模板转换节点」
     * 使用模板格式化输出
     */
    public NodeAction<AgentState> templateNode(String templateKey, String outputKey) {
        return state -> {
            String template = state.<String>value(templateKey).orElse("");
            String result = resolveVariables(template, state);
            return Map.of(outputKey, result);
        };
    }

    /**
     * 对应 Dify「迭代节点」
     * 对列表中的每个元素执行相同的处理
     */
    public NodeAction<AgentState> iterationNode(String listKey, String itemKey,
                                                 String outputKey,
                                                 Function<String, String> processor) {
        return state -> {
            List<?> items = state.<List<?>>value(listKey).orElse(List.of());
            List<String> results = new ArrayList<>();
            for (Object item : items) {
                String result = processor.apply(item.toString());
                results.add(result);
            }
            return Map.of(outputKey, results);
        };
    }

    /**
     * 对应 Dify「变量聚合节点」
     * 将多个互斥分支的输出统一为一个变量
     */
    public NodeAction<AgentState> variableAggregatorNode(String outputKey,
                                                          String... inputKeys) {
        return state -> {
            for (String key : inputKeys) {
                Optional<Object> value = state.value(key);
                if (value.isPresent()) {
                    return Map.of(outputKey, value.get());
                }
            }
            return Map.of();
        };
    }

    // ==================== 辅助方法 ====================

    /**
     * 模板变量替换：{{variable}} → state中的值
     */
    private String resolveVariables(String template, AgentState state) {
        String result = template;
        for (Map.Entry<String, Object> entry : state.data().entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}",
                String.valueOf(entry.getValue()));
        }
        return result;
    }

    /**
     * 构建条件边的映射（对应 Dify 的 IF/ELIF/ELSE）
     */
    public Map<String, String> conditionalMapping(String defaultTarget,
                                                   String... keyValuePairs) {
        Map<String, String> map = new LinkedHashMap<>();
        for (int i = 0; i < keyValuePairs.length; i += 2) {
            map.put(keyValuePairs[i], keyValuePairs[i + 1]);
        }
        map.put("default", defaultTarget);
        return map;
    }
}
```

#### 实现二：用通用引擎构建完整工作流

使用上面的通用引擎，构建一个类似 Dify 官方教程的「多平台内容生成器」工作流：

```
用户输入 → 意图分类 → [条件分支]
  ├─ 技术问题 → 知识检索 → LLM回答
  ├─ 内容创作 → LLM生成多平台内容 → 迭代翻译
  └─ 数据查询 → HTTP请求 → 模板格式化
→ 变量聚合 → 直接回复
```

```java
public class MultiPlatformContentWorkflow {

    public static void main(String[] args) throws GraphStateException {
        // 初始化引擎
        DifyStyleWorkflowEngine engine = new DifyStyleWorkflowEngine(
            chatModel, embeddingStore, embeddingModel);

        // 定义 Schema（使用 Appender Channel 管理消息列表）
        Map<String, Channel<?>> schema = Map.of(
            "messages",    Channels.appender(ArrayList::new),
            "intent",      Channels.base(() -> ""),
            "knowledge",   Channels.base(() -> ""),
            "content",     Channels.base(() -> ""),
            "translated",  Channels.appender(ArrayList::new),
            "apiResult",   Channels.base(() -> ""),
            "response",    Channels.base(() -> "")
        );

        // ==================== 构建工作流图 ====================
        StateGraph<AgentState> graph = new StateGraph<>(schema, AgentState::new)

            // ---- 开始节点 → 意图分类 ----
            .addNode("classify", node_async(
                engine.classifyNode("input", "intent",
                    List.of("技术问题", "内容创作", "数据查询"))))

            // ---- 技术问题分支 ----
            .addNode("knowledge_search", node_async(
                engine.knowledgeRetrievalNode("input", "knowledge")))
            .addNode("tech_answer", node_async(
                engine.llmNode(
                    "基于以下知识回答用户问题：{{knowledge}}",
                    "input", "response")))

            // ---- 内容创作分支 ----
            .addNode("content_generate", node_async(
                engine.llmNode(
                    "你是一个多平台内容创作专家，为微信公众号、小红书、抖音生成内容",
                    "input", "content")))
            .addNode("iterate_translate", node_async(
                engine.iterationNode("platforms", "platform", "translated",
                    platform -> generateForPlatform(platform))))

            // ---- 数据查询分支 ----
            .addNode("http_query", node_async(
                engine.httpRequestNode("apiUrl", "GET", null, "apiResult")))
            .addNode("format_result", node_async(
                engine.templateNode(
                    "查询结果：{{apiResult}}", "response")))

            // ---- 变量聚合 → 直接回复 ----
            .addNode("aggregate", node_async(
                engine.variableAggregatorNode("response",
                    "tech_response", "content_response", "data_response")))
            .addNode("reply", node_async(
                state -> Map.of("final_output",
                    state.<String>value("response").orElse("无法处理"))))

            // ==================== 定义边 ====================
            .addEdge(START, "classify")

            // 条件分支（对应 Dify 的条件分支节点）
            .addConditionalEdges("classify",
                state -> {
                    String intent = state.<String>value("intent").orElse("");
                    return switch (intent) {
                        case "技术问题" -> "tech";
                        case "内容创作" -> "content";
                        case "数据查询" -> "data";
                        default -> "default";
                    };
                },
                Map.of(
                    "tech", "knowledge_search",
                    "content", "content_generate",
                    "data", "http_query",
                    "default", "reply"))

            // 技术问题路径
            .addEdge("knowledge_search", "tech_answer")
            .addEdge("tech_answer", "aggregate")

            // 内容创作路径
            .addEdge("content_generate", "iterate_translate")
            .addEdge("iterate_translate", "aggregate")

            // 数据查询路径
            .addEdge("http_query", "format_result")
            .addEdge("format_result", "aggregate")

            // 聚合 → 回复 → 结束
            .addEdge("aggregate", "reply")
            .addEdge("reply", END);

        // ==================== 运行工作流 ====================
        CompiledGraph<AgentState> workflow = graph.compile();

        // 打印 Mermaid 图
        System.out.println(workflow.getGraph(
            GraphRepresentation.Type.MERMAID, "Dify风格内容生成器", true).content());

        // 测试：技术问题
        workflow.invoke(Map.of(
            "input", "如何配置Redis集群？",
            "apiUrl", "http://api.example.com/data"
        )).ifPresent(s -> System.out.println("结果: " + s.data()));

        // 测试：内容创作
        workflow.invoke(Map.of(
            "input", "写一篇关于Spring Boot的文章"
        )).ifPresent(s -> System.out.println("结果: " + s.data()));
    }

    static String generateForPlatform(String platform) {
        // 根据不同平台生成适配内容
        return platform + "版本内容";
    }
}
```

#### 实现三：带检查点和人机协同的 Dify 风格工作流

在 Dify 中，工作流可以暂停等待人工输入。LangGraph4j 通过 Checkpoint + Interrupt 实现相同能力，而且更加灵活：

```java
public class DifyStyleWorkflowWithHITL {

    public static void main(String[] args) throws Exception {
        DifyStyleWorkflowEngine engine = new DifyStyleWorkflowEngine(
            chatModel, embeddingStore, embeddingModel);

        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            // LLM 生成内容
            .addNode("llm_generate", node_async(
                engine.llmNode("你是内容创作助手", "input", "draft")))

            // 内容审核（自动）
            .addNode("auto_review", node_async(state -> {
                String draft = state.<String>value("draft").orElse("");
                String review = chatModel.generate(
                    "审核以下内容是否合规，回答APPROVE或REJECT：\n" + draft);
                return Map.of("autoReviewResult", review);
            }))

            // 人工审批节点（对应 Dify 的人工审批功能）
            .addNode("human_approval", node_async(state -> {
                boolean approved = state.<Boolean>value("approved").orElse(false);
                return Map.of("status", approved ? "published" : "rejected");
            }))

            .addEdge(START, "llm_generate")
            .addEdge("llm_generate", "auto_review")
            .addConditionalEdges("auto_review",
                state -> {
                    String result = state.<String>value("autoReviewResult").orElse("");
                    return result.contains("APPROVE") ? "approve" : "review";
                },
                Map.of("approve", END, "review", "human_approval"))
            .addEdge("human_approval", END);

        // 配置检查点 + 人工审批前中断
        BaseCheckpointSaver saver = new MemorySaver();
        CompileConfig cc = CompileConfig.builder()
            .interruptBefore("human_approval")
            .checkpointSaver(saver)
            .build();

        CompiledGraph<AgentState> workflow = graph.compile(cc);
        RunnableConfig rc = RunnableConfig.builder().threadId("content-1").build();

        // 首次运行到人工审批前中断
        workflow.invoke(Map.of("input", "写一篇产品推广文案"), rc);

        // 获取快照，展示给审批人
        StateSnapshot<AgentState> snapshot = workflow.getState(rc);
        System.out.println("待审批内容: " + snapshot.state().data());

        // 审批人确认后，注入审批结果并恢复
        RunnableConfig newRc = workflow.updateState(rc, Map.of("approved", true));
        workflow.invoke(GraphInput.resume(), newRc)
            .ifPresent(s -> System.out.println("最终状态: " + s.data()));
    }
}
```

#### 实现四：Dify 迭代节点的 LangGraph4j 实现

Dify 的迭代节点对数组逐项处理，这在批量翻译、批量分析等场景非常常用。LangGraph4j 通过循环工作流实现：

```java
public class DifyIterationWorkflow {

    public static void main(String[] args) throws GraphStateException {
        // 迭代处理：对列表中的每个 item 执行 LLM 处理
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            // 加载数据源
            .addNode("load_items", node_async(state -> {
                List<String> items = List.of(
                    "人工智能正在改变世界",
                    "区块链技术日趋成熟",
                    "量子计算取得突破"
                );
                return Map.of("items", items, "results", new ArrayList<String>(),
                             "currentIndex", 0);
            }))

            // 迭代处理单个 item（对应 Dify 迭代节点内部的工作流）
            .addNode("process_item", node_async(state -> {
                List<String> items = state.<List<String>>value("items").orElse(List.of());
                int index = state.<Integer>value("currentIndex").orElse(0);
                List<String> results = new ArrayList<>(
                    state.<List<String>>value("results").orElse(List.of()));

                if (index < items.size()) {
                    String item = items.get(index);
                    String translated = chatModel.generate(
                        "将以下内容翻译为英文：" + item);
                    results.add(translated);
                    return Map.of("results", results, "currentIndex", index + 1);
                }
                return Map.of();
            }))

            .addEdge(START, "load_items")
            .addEdge("load_items", "process_item")
            // 循环条件：还有 item 未处理则继续
            .addConditionalEdges("process_item",
                state -> {
                    List<?> items = state.<List<?>>value("items").orElse(List.of());
                    int index = state.<Integer>value("currentIndex").orElse(0);
                    return index < items.size() ? "continue" : "done";
                },
                Map.of("continue", "process_item", "done", END));

        graph.compile()
             .invoke(Map.of())
             .ifPresent(s -> {
                 List<String> results = s.<List<String>>value("results").orElse(List.of());
                 System.out.println("翻译结果: " + results);
             });
    }
}
```

#### 实现五：Dify 并行分支的 LangGraph4j 实现

Dify 支持并行执行多个分支（如同时进行多源检索），然后汇聚结果。LangGraph4j 原生支持并行：

```java
public class DifyParallelBranchWorkflow {

    public static void main(String[] args) throws GraphStateException {
        StateGraph<AgentState> graph = new StateGraph<>(AgentState::new)
            // 并行分支1：搜索引擎检索
            .addNode("search_engine", node_async(state -> {
                String query = state.<String>value("query").orElse("");
                String result = searchService.search(query);
                return Map.of("searchResult", result);
            }))

            // 并行分支2：知识库检索
            .addNode("knowledge_base", node_async(state -> {
                String query = state.<String>value("query").orElse("");
                String result = ragService.retrieve(query);
                return Map.of("kbResult", result);
            }))

            // 并行分支3：数据库查询
            .addNode("database_query", node_async(state -> {
                String query = state.<String>value("query").orElse("");
                String result = dbService.query(query);
                return Map.of("dbResult", result);
            }))

            // 变量聚合（对应 Dify 的变量聚合节点）
            .addNode("aggregate", node_async(state -> {
                String searchResult = state.<String>value("searchResult").orElse("");
                String kbResult = state.<String>value("kbResult").orElse("");
                String dbResult = state.<String>value("dbResult").orElse("");
                return Map.of("aggregatedContext",
                    searchResult + "\n" + kbResult + "\n" + dbResult);
            }))

            // LLM 综合回答
            .addNode("llm_answer", node_async(state -> {
                String context = state.<String>value("aggregatedContext").orElse("");
                String query = state.<String>value("query").orElse("");
                String answer = chatModel.generate(
                    "基于以下信息回答问题：\n" + context + "\n问题：" + query);
                return Map.of("answer", answer);
            }))

            // 定义边：START 后并行分发到3个分支
            .addEdge(START, "search_engine")
            .addEdge(START, "knowledge_base")
            .addEdge(START, "database_query")
            // 3个分支都汇聚到 aggregate
            .addEdge("search_engine", "aggregate")
            .addEdge("knowledge_base", "aggregate")
            .addEdge("database_query", "aggregate")
            .addEdge("aggregate", "llm_answer")
            .addEdge("llm_answer", END);

        // 使用线程池实现真正并行
        ExecutorService executor = Executors.newFixedThreadPool(3);
        RunnableConfig rc = RunnableConfig.builder()
            .addParallelNodeExecutor(START, executor)
            .build();

        graph.compile()
             .invoke(Map.of("query", "最新的AI技术趋势是什么？"), rc)
             .ifPresent(s -> System.out.println(s.<String>value("answer").orElse("")));

        executor.shutdown();
    }
}
```

#### Dify 工作流 → LangGraph4j 迁移指南

如果你已有 Dify 工作流，想迁移到 LangGraph4j，可以按以下步骤操作：

| 步骤 | Dify 操作 | LangGraph4j 对应 |
|------|---------|-----------------|
| 1. 提取输入输出 | 开始/结束节点的变量定义 | 定义 AgentState Schema + Channel |
| 2. 映射节点 | 各类 Dify 节点 | NodeAction（见上方映射表） |
| 3. 映射连线 | 节点之间的连线 | addEdge / addConditionalEdges |
| 4. 映射条件 | IF/ELIF/ELSE 条件 | EdgeAction 条件边 |
| 5. 映射迭代 | 迭代节点 | 循环工作流 + 计数器 |
| 6. 映射并行 | 并行分支 | 同一源节点到多目标的 addEdge + 线程池 |
| 7. 映射变量聚合 | 变量聚合节点 | AgentState 自动 merge |
| 8. 映射人工审批 | 人工审批节点 | interruptBefore + Checkpoint |
| 9. 测试验证 | Dify 预览运行 | Mermaid 可视化 + stream() 调试 |

#### LangGraph4j 相比 Dify 的优势场景

虽然 Dify 的可视化编排很方便，但在以下场景中 LangGraph4j 更具优势：

| 场景 | Dify 的局限 | LangGraph4j 的优势 |
|------|-----------|-------------------|
| 复杂条件逻辑 | 可视化条件表达力有限 | 代码级条件判断，无任何限制 |
| 企业系统集成 | 需通过 Webhook/API 桥接 | 直接嵌入 Java 应用，调用 Spring Bean |
| 自定义状态管理 | 平台托管，黑盒 | 完全控制状态结构和更新策略 |
| 高并发场景 | 单实例部署 | JVM 原生并发 + 分布式部署 |
| 细粒度容错 | 有限的重试机制 | Checkpoint + 自定义降级策略 |
| 代码审查友好 | JSON 配置，难以 Code Review | 纯 Java 代码，Git 友好 |
| CI/CD 集成 | 手动部署 | 标准 Java 构建流程 |
| 可观测性 | 平台内建 | 集成 Micrometer/OpenTelemetry |

> **实用建议**：如果你的团队以 Java 开发者为主，且工作流需要与企业系统深度集成，推荐使用 LangGraph4j。如果团队中有非技术人员也需要参与工作流设计，可以先用 Dify 快速验证原型，再迁移到 LangGraph4j 做生产级实现。

## 调试与开发工具

### Mermaid 图可视化

```java
// 生成 Mermaid 图代码
String mermaid = graph.getGraph(
    GraphRepresentation.Type.MERMAID, "My Graph", true).content();
System.out.println(mermaid);

// 可直接在 Mermaid Live Editor 中渲染：
// https://mermaid.live/
```

### 节点执行钩子

```java
// 执行前钩子
graph.addBeforeCallNodeHook((node, data, config) -> {
    log.info("开始执行节点: {}, 状态: {}", node, data);
    return CompletableFuture.completedFuture(data);
});

// 执行后钩子
graph.addAfterCallNodeHook((node, data, config) -> {
    log.info("节点执行完成: {}, 状态: {}", node, data);
    return CompletableFuture.completedFuture(data);
});
```

### LangGraph4j Studio

LangGraph4j 提供了可视化开发环境 Studio：

- **Spring Boot 版**：`studio/springboot/`
- **Quarkus 版**：`studio/quarkus/`
- **Jetty 版**：`studio/jetty/`

Studio 功能：
- 拖拽式工作流设计
- 实时节点状态查看
- 断点调试与流程回放
- 性能监控（集成 Micrometer）

### 深度文档（DeepWiki）

项目文档通过 DeepWiki 提供：https://deepwiki.com/langgraph4j/langgraph4j

## 与 Python LangGraph 的对比

| 维度 | Python LangGraph | Java LangGraph4j |
|------|-----------------|------------------|
| 语言 | Python | Java |
| 异步模型 | async/await | CompletableFuture |
| 状态类型 | TypedDict | AgentState (Map) |
| 节点定义 | 函数/类 | NodeAction 接口 |
| 条件边 | 函数返回字符串 | EdgeAction 接口 |
| 检查点 | SqliteSaver/PostgresSaver | MemorySaver/FileSystemSaver/PostgresSaver |
| LLM 集成 | LangChain | LangChain4j / Spring AI |
| 部署 | FastAPI/Flask | Spring Boot/Quarkus/Jetty |
| 可视化 | LangGraph Studio | LangGraph4j Studio |

> **迁移提示**：如果你熟悉 Python 版 LangGraph，核心概念完全一致，只是 API 风格从 Python 函数式变为 Java 接口式。

## 常见问题与技巧

### Q1：如何处理节点异常？

```java
.addNode("risky_node", node_async(state -> {
    try {
        String result = callExternalService();
        return Map.of("result", result);
    } catch (Exception e) {
        log.error("节点执行失败", e);
        return Map.of("error", e.getMessage(), "fallback", true);
    }
}))
```

### Q2：如何在节点间传递大量数据？

- 使用 AgentState 的 key-value 结构
- 对于大数据（如文件内容），建议只传递引用（如文件路径），在需要时再加载
- 使用 Appender Channel 累积消息列表

### Q3：如何调试条件边的路由？

```java
.addConditionalEdges("node-1",
    state -> {
        String route = determineRoute(state);
        log.info("条件边路由: node-1 -> {}", route);  // 添加日志
        return CompletableFuture.completedFuture(route);
    },
    Map.of(...))
```

### Q4：如何限制 Agent 的迭代次数？

```java
var agent = AgentExecutor.builder()
    .chatModel(chatModel)
    .toolsFromObject(new Tools())
    .maxIterations(10)  // 限制最大10次迭代
    .build()
    .compile();
```

### Q5：如何实现超时控制？

```java
// 使用 CompletableFuture 的超时机制
CompletableFuture<Optional<AgentState>> future = CompletableFuture.supplyAsync(
    () -> workflow.invoke(input));
Optional<AgentState> result = future.get(30, TimeUnit.SECONDS);
```

## 学习路径与资源

### 学习路径建议

1. **入门阶段**：掌握 StateGraph + NodeAction + EdgeAction + AgentState
   - 实战目标：构建一个顺序/条件工作流
   - 练习：实现一个简单的计算器工作流
2. **进阶阶段**：学习循环工作流 + Schema/Channel + 流式响应
   - 实战目标：构建一个带循环的 LLM 对话 Agent
   - 练习：实现 ReAct Agent + 流式输出
3. **高级阶段**：掌握检查点 + 人机协同 + 多智能体协作
   - 实战目标：构建一个带审批流程的智能客服
   - 练习：实现 Agent Handoff + 人工审批
4. **生产阶段**：关注子图 + 持久化 + 可观测性 + 性能优化
   - 实战目标：构建企业级 AI 工作流系统
   - 练习：Spring Boot 集成 + PostgreSQL 检查点 + 监控

### 参考资源

- 官方文档：https://langgraph4j.github.io/langgraph4j/
- GitHub 仓库：https://github.com/langgraph4j/langgraph4j
- API 文档：https://langgraph4j.github.io/langgraph4j/apidocs/
- DeepWiki 文档：https://deepwiki.com/langgraph4j/langgraph4j
- 学习系列博客：https://www.cnblogs.com/yjmyzz (菩提树下的杨过)
- 学习示例代码：https://github.com/yjmyzz/langgraph4j-study
- JDK8 兼容版：https://github.com/langgraph4j/langgraph4j-jdk8

## 总结

LangGraph4j 为 Java 开发者提供了构建复杂 AI 智能体工作流的完整解决方案。从简单的顺序流程到多智能体协作，从基础的状态管理到检查点持久化和人机协同，它覆盖了企业级 AI 应用开发的核心需求。

**核心能力一览：**

| 能力 | 说明 |
|------|------|
| 图结构编排 | 顺序/条件/循环/并行/子图 |
| 状态管理 | Schema + Channel（覆盖/追加/自定义） |
| LLM 集成 | LangChain4j / Spring AI 双框架支持 |
| 流式响应 | 逐节点/逐 Token 实时输出 |
| 检查点 | 状态持久化 + 断点续跑 |
| 人机协同 | Interrupt + Approval + Resume |
| 多智能体 | Agent Handoff / Supervisor / 并行协作 |
| 可视化 | Mermaid 图 + Studio 开发环境 |

**与 LangChain4j 的关系**：LangChain4j 提供了 LLM 集成的"原子能力"（模型调用、RAG、工具、记忆），而 LangGraph4j 提供了"编排能力"（流程控制、状态管理、多智能体协作）。两者互补，共同构成 Java AI 应用开发的完整技术栈。

{% endraw %}

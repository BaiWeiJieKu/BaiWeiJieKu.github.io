---
title: "Java-langchain4j框架"
categories: spring
tags: [spring, ai]
author: 百味皆苦
music-id: 3136952023
---

## 简介

LangChain4j 是一个专为 Java 生态设计的开源 LLM 应用开发框架，旨在简化将大语言模型（LLM）集成到 Java 应用程序中的过程。该项目始于 2023 年初 ChatGPT 热潮期间，填补了 Java 生态中缺少类似 Python LangChain 框架的空白。

虽然名字中有"LangChain"，但该项目融合了 LangChain、Haystack、LlamaIndex 和更广泛社区的想法与概念，并加入了自身的创新。目前最新版本为 **1.0.0-beta3**。

### 核心设计理念

- **统一 API**：提供统一的 API 接口，支持 15+ 个 LLM 提供商和 20+ 个嵌入存储，无需为每个提供商学习专用 API，可轻松切换而无需重写代码
- **全面工具箱**：从低级提示模板、聊天记忆管理和函数调用，到高级模式如代理和 RAG，提供即用型组件
- **两个抽象层次**：低层次（最大自由度，完全控制组合方式）和高层次（AI 服务，声明式 API，隐藏复杂性）

### 核心功能一览

| 功能 | 说明 |
|------|------|
| LLM 提供商集成 | 支持 15+ 个主流 LLM 提供商 |
| 嵌入存储集成 | 支持 20+ 个向量数据库 |
| 嵌入模型集成 | 支持 15+ 个嵌入模型 |
| 图像生成 | 支持 5 个图像生成模型 |
| 多模态 | 支持文本和图像作为输入 |
| AI 服务 | 高级声明式 LLM API |
| 提示模板 | 灵活的提示词模板系统 |
| 聊天记忆 | 消息窗口和令牌窗口两种策略 |
| 流式响应 | 逐 token 流式输出 |
| 结构化输出 | 将 LLM 输出解析为 Java 对象 |
| 工具/函数调用 | LLM 可调用外部工具 |
| RAG | 完整的检索增强生成管道 |
| Agent | 智能代理和多代理编排 |
| 可观察性 | 内置监控和日志支持 |

### 库结构

LangChain4j 采用模块化设计：

- **langchain4j-core**：定义核心抽象（如 `ChatLanguageModel`、`EmbeddingStore`）及其 API
- **langchain4j**：主模块，包含文档加载器、聊天记忆实现以及 AI 服务等高级功能
- **langchain4j-{integration}**：各种 LLM 提供商和嵌入存储的集成模块，可独立使用

### 国内常用模型提供商

LangChain4j 也对国内主流大模型提供了良好的支持：

| 提供商 | 模块名 | 说明 |
|--------|--------|------|
| 阿里云 DashScope（通义千问） | langchain4j-dashscope | 支持千问系列模型 |
| 智谱 AI（ChatGLM） | langchain4j-zhipu | 支持 GLM-4 等模型 |
| 百度千帆 | langchain4j-qianfan | 支持文心一言 |
| MiniMax | langchain4j-minimax | 支持 MiniMax 模型 |
| 讯飞星火 | langchain4j-spark | 支持星火大模型 |


## 快速开始

### 环境要求

- JDK 17+
- Maven 或 Gradle

### 添加依赖

**Maven 方式：**

```xml
<!-- OpenAI 集成 -->
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-open-ai</artifactId>
    <version>1.0.0-beta3</version>
</dependency>

<!-- 高级 AI 服务 API（推荐） -->
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j</artifactId>
    <version>1.0.0-beta3</version>
</dependency>
```

**Gradle 方式：**

```groovy
implementation 'dev.langchain4j:langchain4j-open-ai:1.0.0-beta3'
implementation 'dev.langchain4j:langchain4j:1.0.0-beta3'
```

**使用 BOM 管理版本（推荐）：**

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-bom</artifactId>
            <version>1.0.0-beta3</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 第一个程序

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

import static dev.langchain4j.model.openai.OpenAiChatModelName.GPT_4_O_MINI;

public class QuickStart {
    public static void main(String[] args) {
        // 1. 创建模型实例
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName(GPT_4_O_MINI)
                .build();

        // 2. 发送消息并获取响应
        String answer = model.chat("你好，请介绍一下你自己");
        System.out.println(answer);
    }
}
```

### 使用国内模型（以通义千问为例）

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.dashscope.QwenChatModel;

ChatLanguageModel model = QwenChatModel.builder()
        .apiKey(System.getenv("DASHSCOPE_API_KEY"))
        .modelName("qwen-plus")
        .build();

String answer = model.chat("你好，请用中文介绍一下LangChain4j");
System.out.println(answer);
```

### 使用本地模型（Ollama）

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaChatModel;

ChatLanguageModel model = OllamaChatModel.builder()
        .baseUrl("http://localhost:11434")
        .modelName("llama3.1")
        .build();

String answer = model.chat("Hello, how are you?");
System.out.println(answer);
```

> **实用技巧**：开发阶段推荐使用 Ollama 运行本地模型，既省钱又无需担心 API 速率限制，适合快速迭代。生产环境再切换到云端 API。


## 核心概念：低级 API

在深入高级 API 之前，了解低级 API 有助于理解框架的底层机制。

### ChatLanguageModel

`ChatLanguageModel` 是最核心的低级接口，代表一个可以接收聊天消息并返回响应的模型。

```java
// 简单文本对话
String response = model.chat("What is Java?");

// 使用 ChatMessage 对象进行更精细的控制
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;

UserMessage userMessage = UserMessage.from("解释一下什么是微服务");
AiMessage aiMessage = model.chat(userMessage).aiMessage();
System.out.println(aiMessage.text());
```

### ChatMessage 体系

LangChain4j 定义了几种消息类型：

| 消息类型 | 说明 | 使用场景 |
|---------|------|---------|
| `UserMessage` | 用户发送的消息 | 用户输入 |
| `AiMessage` | AI 的回复 | 模型输出 |
| `SystemMessage` | 系统指令 | 设定 AI 的行为和角色 |
| `ToolExecutionResultMessage` | 工具执行结果 | 函数调用返回结果 |

```java
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;

// 构建多轮对话
SystemMessage systemMessage = SystemMessage.from("你是一位资深的Java架构师，擅长解答技术问题");
UserMessage userMessage = UserMessage.from("请对比Spring Boot和Quarkus的优劣");

ChatRequest request = ChatRequest.builder()
        .messages(systemMessage, userMessage)
        .build();

ChatResponse response = model.chat(request);
System.out.println(response.aiMessage().text());
```

### ChatResponse 和元数据

```java
ChatResponse response = model.chat(ChatRequest.builder()
        .messages(UserMessage.from("Hello"))
        .build());

// 获取 AI 回复内容
AiMessage aiMessage = response.aiMessage();
String text = aiMessage.text();

// 获取 token 使用信息
TokenUsage tokenUsage = response.tokenUsage();
System.out.println("输入token: " + tokenUsage.inputTokenCount());
System.out.println("输出token: " + tokenUsage.outputTokenCount());

// 获取结束原因
FinishReason finishReason = response.finishReason();
```


## AI 服务（高级 API）

AI 服务是 LangChain4j 最核心的高级抽象，类似于 Spring Data JPA 或 Retrofit 的设计理念——通过声明式接口定义 API，框架自动生成实现。

### 最简单的 AI 服务

```java
// 1. 定义接口
interface Assistant {
    String chat(String userMessage);
}

// 2. 创建模型
ChatLanguageModel model = OpenAiChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY"))
        .modelName(GPT_4_O_MINI)
        .build();

// 3. 创建 AI 服务实例
Assistant assistant = AiServices.create(Assistant.class, model);

// 4. 使用
String answer = assistant.chat("Hello");
System.out.println(answer); // Hello, how can I help you?
```

### @SystemMessage — 设定 AI 角色

```java
interface Friend {
    @SystemMessage("你是我的好朋友，用口语化的方式回答问题")
    String chat(String userMessage);
}

Friend friend = AiServices.create(Friend.class, model);
String answer = friend.chat("你好"); // 嘿！最近咋样？
```

`@SystemMessage` 也支持从资源文件加载提示模板：

```java
@SystemMessage(fromResource = "my-prompt-template.txt")
String chat(String userMessage);
```

**动态系统消息：**

```java
Friend friend = AiServices.builder(Friend.class)
        .chatLanguageModel(model)
        .systemMessageProvider(chatMemoryId -> 
            "你是用户" + chatMemoryId + "的专属助手")
        .build();
```

### @UserMessage — 用户消息模板

```java
interface Translator {
    @UserMessage("将以下文本翻译成{{language}}：{{text}}")
    String translate(@V("language") String language, @V("text") String text);
}

Translator translator = AiServices.create(Translator.class, model);
String result = translator.translate("日语", "今天天气真好");
```

> **提示**：在 Quarkus 或 Spring Boot 应用中，不需要使用 `@V` 注解，参数名会自动识别。

### 返回类型

AI 服务方法支持多种返回类型：

```java
interface Assistant {
    // 返回纯文本
    String chat(String message);
    
    // 返回结构化对象（自动解析）
    Person extractPerson(String text);
    
    // 返回枚举
    Sentiment analyzeSentiment(String text);
    
    // 返回列表
    List<String> generateTopics(String text);
    
    // 包装在 Result 中获取元数据
    Result<String> chatWithMetadata(String message);
}
```

使用 `Result<T>` 获取额外元数据：

```java
interface Assistant {
    @UserMessage("生成关于{{topic}}的文章大纲")
    Result<List<String>> generateOutline(String topic);
}

Result<List<String>> result = assistant.generateOutline("Java");
List<String> outline = result.content();
TokenUsage tokenUsage = result.tokenUsage();
List<Content> sources = result.sources();
```


## 提示模板

提示模板是构建高质量 LLM 应用的基础，LangChain4j 提供了灵活的模板系统。

### PromptTemplate

```java
import dev.langchain4j.model.input.PromptTemplate;

// 创建模板
PromptTemplate template = PromptTemplate.from(
    "作为一名{{role}}，请解释{{concept}}的概念"
);

// 命名参数渲染
Prompt prompt = template.apply(Map.of(
    "role", "Java架构师",
    "concept", "微服务架构"
));

String response = model.chat(prompt.userMessageText());
```

### ChatPromptTemplate

支持多消息类型的模板：

```java
import dev.langchain4j.model.input.ChatPromptTemplate;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;

ChatPromptTemplate chatPrompt = ChatPromptTemplate.builder()
        .systemMessage("你是一名{{role}}，请用{{style}}的风格回答问题")
        .userMessage("{{question}}")
        .build();

ChatPrompt prompt = chatPrompt.apply(Map.of(
    "role", "技术专家",
    "style", "通俗易懂",
    "question", "什么是Docker？"
));

ChatResponse response = model.chat(prompt.messages());
```

### 提示工程技巧

```java
// 1. 少量示例（Few-shot）
@SystemMessage("""
    你是一个文本情感分析器。请按照以下示例分析情感：
    
    示例1：
    输入：今天真开心！
    输出：POSITIVE
    
    示例2：
    输入：这部电影太令人失望了
    输出：NEGATIVE
    
    示例3：
    输入：天气还可以吧
    输出：NEUTRAL
    """)
Sentiment analyze(String text);

// 2. 思维链（Chain of Thought）
@SystemMessage("""
    请按步骤分析以下问题：
    1. 首先，理解问题的核心
    2. 然后，列出关键因素
    3. 接着，逐步推理
    4. 最后，给出结论
    
    请在回答中展示你的推理过程。
    """)
String analyzeProblem(String problem);

// 3. 输出格式约束
@UserMessage("""
    分析以下文本，并以JSON格式返回结果：
    {{text}}
    
    要求JSON格式：
    {
        "summary": "内容摘要",
        "keywords": ["关键词1", "关键词2"],
        "sentiment": "POSITIVE/NEGATIVE/NEUTRAL"
    }
    只返回JSON，不要其他内容。
    """)
String analyzeAsJson(@V("text") String text);
```


## 聊天记忆

LLM 本身是无状态的，每次请求都是独立的。聊天记忆使得 AI 可以"记住"之前的对话内容。

### 记忆 vs 历史

- **历史**：保持所有消息完整无缺，是用户在 UI 中看到的内容
- **记忆**：呈现给 LLM 的信息，可能经过淘汰、总结等处理

LangChain4j 目前只提供"记忆"，如果需要完整历史需自行保存。

### MessageWindowChatMemory（消息窗口）

保留最近 N 条消息，淘汰最旧的消息：

```java
import dev.langchain4j.memory.chat.MessageWindowChatMemory;

ChatMemory chatMemory = MessageWindowChatMemory.builder()
        .maxMessages(10)  // 保留最近10条消息
        .build();
```

### TokenWindowChatMemory（令牌窗口）

保留最近 N 个令牌，淘汰超出的消息（消息不可分割，整条淘汰）：

```java
import dev.langchain4j.memory.chat.TokenWindowChatMemory;

ChatMemory chatMemory = TokenWindowChatMemory.builder()
        .maxTokens(1000)
        .tokenizer(new OpenAiTokenizer("gpt-4o-mini"))
        .build();
```

> **实用技巧**：`TokenWindowChatMemory` 更精确，适合生产环境；`MessageWindowChatMemory` 适合快速原型开发。

### 持久化聊天记忆

默认聊天记忆存储在内存中，通过实现 `ChatMemoryStore` 接口可以持久化到数据库：

```java
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import dev.langchain4j.store.memory.chat.ChatMessageSerializer;
import dev.langchain4j.store.memory.chat.ChatMessageDeserializer;

class PersistentChatMemoryStore implements ChatMemoryStore {
    
    private final ChatMessageRepository repository; // 自定义的数据访问层
    
    @Override
    public List<ChatMessage> getMessages(Object memoryId) {
        String json = repository.findByMemoryId(memoryId);
        return ChatMessageDeserializer.messagesFromJson(json);
    }
    
    @Override
    public void updateMessages(Object memoryId, List<ChatMessage> messages) {
        String json = ChatMessageSerializer.messagesToJson(messages);
        repository.save(memoryId, json);
    }
    
    @Override
    public void deleteMessages(Object memoryId) {
        repository.deleteByMemoryId(memoryId);
    }
}
```

### 为每个用户提供独立的聊天记忆

```java
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;

// 使用 ChatMemoryProvider 为不同用户创建独立的 ChatMemory
ChatMemoryProvider chatMemoryProvider = memoryId -> MessageWindowChatMemory.builder()
        .id(memoryId)
        .maxMessages(20)
        .chatMemoryStore(new PersistentChatMemoryStore())
        .build();

// 在 AI 服务中使用
Assistant assistant = AiServices.builder(Assistant.class)
        .chatLanguageModel(model)
        .chatMemoryProvider(chatMemoryProvider)
        .build();

// 不同用户有独立的记忆
String answer1 = assistant.chat("user-001", "我叫张三");
String answer2 = assistant.chat("user-002", "我叫李四");
String answer3 = assistant.chat("user-001", "我叫什么名字？"); // 张三
```

### 在 AI 服务中使用聊天记忆

```java
interface Assistant {
    String chat(String message);
    String chat(@MemoryId String memoryId, @UserMessage String message);
}

// 方式1：共享单个 ChatMemory 实例
ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
Assistant assistant = AiServices.builder(Assistant.class)
        .chatLanguageModel(model)
        .chatMemory(chatMemory)
        .build();

// 方式2：使用 ChatMemoryProvider 为每个 memoryId 提供独立记忆
Assistant assistant = AiServices.builder(Assistant.class)
        .chatLanguageModel(model)
        .chatMemoryProvider(chatMemoryProvider)
        .build();
```

> **企业级技巧**：在生产环境中，推荐使用 Redis 或数据库实现 `ChatMemoryStore` 的持久化，避免服务重启导致用户对话丢失。同时设置合理的记忆窗口大小，平衡上下文质量和成本。

### 实战：基于 Redis 的多用户聊天记忆持久化

以下是一个生产级的 Redis 聊天记忆持久化方案，支持多用户会话隔离：

```java
@Component
@Slf4j
public class RedisChatMemoryStore implements ChatMemoryStore {

    private static final String KEY_PREFIX = "chat:memory:";
    private static final Duration TTL = Duration.ofHours(24);  // 24小时过期

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisChatMemoryStore(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public List<ChatMessage> getMessages(Object memoryId) {
        String key = KEY_PREFIX + memoryId;
        Object raw = redisTemplate.opsForValue().get(key);
        if (raw == null) {
            log.debug("未找到用户{}的聊天记忆，可能是首次对话", memoryId);
            return List.of();
        }
        return ChatMessageDeserializer.messagesFromJson(raw.toString());
    }

    @Override
    public void updateMessages(Object memoryId, List<ChatMessage> messages) {
        String key = KEY_PREFIX + memoryId;
        String json = ChatMessageSerializer.messagesToJson(messages);
        redisTemplate.opsForValue().set(key, json, TTL);
        log.debug("已更新用户{}的聊天记忆，共{}条消息", memoryId, messages.size());
    }

    @Override
    public void deleteMessages(Object memoryId) {
        String key = KEY_PREFIX + memoryId;
        redisTemplate.delete(key);
        log.info("已清除用户{}的聊天记忆", memoryId);
    }
}
```

在 Spring Boot 控制器中集成多用户记忆：

```java
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final RedisChatMemoryStore chatMemoryStore;
    private final StreamingChatLanguageModel streamingModel;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chat(
            @RequestParam String message,
            @RequestParam String userId) {  // 以userId作为memoryId实现多用户隔离

        ChatMemoryProvider chatMemoryProvider = memoryId ->
                MessageWindowChatMemory.builder()
                        .id(memoryId)
                        .maxMessages(20)
                        .chatMemoryStore(chatMemoryStore)
                        .build();

        StreamingAssistant assistant = AiServices.builder(StreamingAssistant.class)
                .streamingChatLanguageModel(streamingModel)
                .chatMemoryProvider(chatMemoryProvider)
                .build();

        return assistant.chat(message, userId);
    }
}
```

**企业级要点：**
- 使用 `KEY_PREFIX` 避免键名冲突
- 设置 TTL 自动过期，防止 Redis 内存无限增长
- 以 `userId` 作为 `memoryId` 实现多用户会话隔离
- `maxMessages` 设置为 20 条，平衡上下文质量和 API 成本
- 服务重启后用户对话不丢失（Redis 持久化）


## 流式响应

LLM 逐 token 生成响应，流式传输可以让用户几乎立即开始阅读响应，极大改善用户体验。

### 低级流式 API

```java
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.chat.response.StreamingChatResponseHandler;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;

// 1. 创建流式模型
StreamingChatLanguageModel streamingModel = OpenAiStreamingChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY"))
        .modelName(GPT_4_O_MINI)
        .build();

// 2. 流式调用
streamingModel.chat("讲一个笑话", new StreamingChatResponseHandler() {
    @Override
    public void onPartialResponse(String partialResponse) {
        System.out.print(partialResponse); // 逐token输出
    }
    
    @Override
    public void onCompleteResponse(ChatResponse completeResponse) {
        System.out.println("\n--- 响应完成 ---");
    }
    
    @Override
    public void onError(Throwable error) {
        error.printStackTrace();
    }
});
```

### 使用 Lambda 简化

```java
import static dev.langchain4j.model.LambdaStreamingResponseHandler.onPartialResponse;
import static dev.langchain4j.model.LambdaStreamingResponseHandler.onPartialResponseAndError;

// 仅处理部分响应
streamingModel.chat("讲一个笑话", onPartialResponse(System.out::print));

// 同时处理响应和错误
streamingModel.chat("讲一个笑话", 
    onPartialResponseAndError(System.out::print, Throwable::printStackTrace));
```

### AI 服务中的流式响应

```java
interface Assistant {
    @SystemMessage("你是一个友好的助手")
    TokenStream chat(String message);
}

StreamingChatLanguageModel streamingModel = OpenAiStreamingChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY"))
        .modelName(GPT_4_O_MINI)
        .build();

Assistant assistant = AiServices.builder(Assistant.class)
        .streamingChatLanguageModel(streamingModel)
        .build();

// 使用 TokenStream
TokenStream tokenStream = assistant.chat("介绍一下Java");
tokenStream
    .onPartialResponse(System.out::print)
    .onCompleteResponse(response -> System.out.println("\n完成"))
    .onError(Throwable::printStackTrace)
    .start();
```

### Spring Boot 中使用 Flux 流式响应

```java
@AiService
interface Assistant {
    @SystemMessage("你是一个友好的助手")
    Flux<String> chat(String userMessage);
}
```

需要额外导入 `langchain4j-reactor` 模块，配合 WebFlux 实现真正的 SSE（Server-Sent Events）流式传输。

> **企业级技巧**：在 Web 应用中，流式响应通常结合 SSE 或 WebSocket 使用。Spring Boot 中可利用 `Flux<String>` 配合 `SseEmitter` 实现前端实时显示 AI 回复的效果。

### 实战：ChatGPT 风格的 SSE 流式聊天接口

以下是一个生产级的 SSE 流式响应方案，实现类似 ChatGPT 的逐字输出效果：

**后端（Spring Boot + WebFlux）：**

```java
@RestController
@RequestMapping("/api/chat")
public class StreamingChatController {

    private final StreamingChatLanguageModel streamingModel;
    private final ChatMemoryProvider chatMemoryProvider;

    @GetMapping(value = "/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamChat(
            @RequestParam String message,
            @RequestParam String userId) {

        interface ChatAssistant {
            @SystemMessage("你是一个专业的AI助手，请用中文回答问题")
            TokenStream chat(@MemoryId String userId, @UserMessage String message);
        }

        ChatAssistant assistant = AiServices.builder(ChatAssistant.class)
                .streamingChatLanguageModel(streamingModel)
                .chatMemoryProvider(chatMemoryProvider)
                .build();

        return Flux.create(sink -> {
            assistant.chat(userId, message)
                    .onPartialResponse(token -> {
                        // 逐token推送给前端
                        sink.next(ServerSentEvent.<String>builder()
                                .event("message")
                                .data(token)
                                .build());
                    })
                    .onCompleteResponse(response -> {
                        // 发送结束标记
                        sink.next(ServerSentEvent.<String>builder()
                                .event("done")
                                .data("[DONE]")
                                .build());
                        sink.complete();
                    })
                    .onError(error -> {
                        sink.next(ServerSentEvent.<String>builder()
                                .event("error")
                                .data(error.getMessage())
                                .build());
                        sink.complete();
                    })
                    .start();
        });
    }
}
```

**前端（JavaScript EventSource）：**

```javascript
const eventSource = new EventSource(
    `/api/chat/sse?message=${encodeURIComponent(userInput)}&userId=${userId}`
);

let fullResponse = '';

eventSource.addEventListener('message', function(event) {
    // 逐字追加显示，实现打字机效果
    fullResponse += event.data;
    document.getElementById('ai-response').innerHTML = 
        marked.parse(fullResponse);  // 支持Markdown渲染
    scrollToBottom();  // 自动滚动到底部
});

eventSource.addEventListener('done', function(event) {
    eventSource.close();  // 关闭连接
    hideLoadingSpinner();  // 隐藏加载动画
});

eventSource.addEventListener('error', function(event) {
    console.error('流式响应错误:', event.data);
    eventSource.close();
    showError('AI回复出现问题，请重试');
});
```

**三种流式方式对比：**

| 方式 | 适用场景 | 特点 |
|------|---------|------|
| `StreamingChatResponseHandler` | 快速原型、控制台测试 | 最简单，回调式 |
| `TokenStream` | 后端逐token处理、缓存 | 拉式，控制灵活 |
| `Flux<String>` | Web应用、SSE/WebSocket | 非阻塞，响应式，生产首选 |


## 结构化输出

将 LLM 的非结构化文本输出转换为结构化的 Java 对象，是 LLM 应用落地的关键能力。

### 三种实现方式

| 方式 | 可靠性 | 说明 |
|------|--------|------|
| JSON Schema | 最高 | LLM 原生支持，由 API 层面保证输出格式 |
| 提示 + JSON 模式 | 中等 | 提示中要求 JSON 格式 + 开启 JSON 模式 |
| 仅提示 | 最低 | 仅通过提示词要求输出格式 |

### 方式一：JSON Schema（推荐）

```java
record Person(String name, int age, double height, boolean married) {}

interface PersonExtractor {
    @UserMessage("从以下文本中提取人物信息：{{text}}")
    Person extractPerson(@V("text") String text);
}

PersonExtractor extractor = AiServices.create(PersonExtractor.class, model);

Person person = extractor.extractPerson(
    "John is 42 years old and lives an independent life. " +
    "He stands 1.75 meters tall. Currently unmarried."
);

System.out.println(person); // Person[name=John, age=42, height=1.75, married=false]
```

### 方式二：提取枚举值

```java
enum Sentiment {
    POSITIVE, NEUTRAL, NEGATIVE
}

interface SentimentAnalyzer {
    @UserMessage("分析以下文本的情感倾向：{{text}}")
    Sentiment analyzeSentimentOf(@V("text") String text);
}

SentimentAnalyzer analyzer = AiServices.create(SentimentAnalyzer.class, model);
Sentiment sentiment = analyzer.analyzeSentimentOf("今天真是美好的一天！");
// sentiment = POSITIVE
```

### 方式三：提取复杂对象

```java
record Address(String street, String city) {}
record Employee(String name, int age, Address address, List<String> skills) {}

interface EmployeeExtractor {
    @UserMessage("从以下文本中提取员工信息：{{text}}")
    Employee extractEmployee(@V("text") String text);
}

EmployeeExtractor extractor = AiServices.create(EmployeeExtractor.class, model);
Employee emp = extractor.extractEmployee(
    "张三，28岁，住在北京海淀区中关村大街1号，擅长Java、Python和Go"
);
// Employee[name=张三, age=28, address=Address[street=中关村大街1号, city=北京], skills=[Java, Python, Go]]
```

### 低级 API 手动指定 JSON Schema

```java
import dev.langchain4j.model.chat.request.ResponseFormat;
import dev.langchain4j.model.chat.request.json.JsonSchema;
import dev.langchain4j.model.chat.request.json.JsonObjectSchema;

ResponseFormat responseFormat = ResponseFormat.builder()
        .type(ResponseFormat.Type.JSON)
        .jsonSchema(JsonSchema.builder()
                .name("Person")
                .rootElement(JsonObjectSchema.builder()
                        .addStringProperty("name")
                        .addIntegerProperty("age")
                        .addNumberProperty("height")
                        .addBooleanProperty("married")
                        .required("name", "age", "height", "married")
                        .build())
                .build())
        .build();

ChatRequest chatRequest = ChatRequest.builder()
        .responseFormat(responseFormat)
        .messages(UserMessage.from("John is 42 years old..."))
        .build();

ChatResponse chatResponse = model.chat(chatRequest);
// 输出: {"name":"John","age":42,"height":1.75,"married":false}
```

### JSON Schema 支持的类型

| Schema 类型 | Java 类型 |
|-------------|----------|
| `JsonObjectSchema` | 对象/POJO |
| `JsonStringSchema` | String, char |
| `JsonIntegerSchema` | int, long, BigInteger |
| `JsonNumberSchema` | float, double, BigDecimal |
| `JsonBooleanSchema` | boolean |
| `JsonEnumSchema` | enum |
| `JsonArraySchema` | List, Set |
| `JsonReferenceSchema` | 递归引用（如树结构） |
| `JsonAnyOfSchema` | 多态类型 |

> **企业级技巧**：结构化输出在数据抽取、信息归类等场景中非常实用。建议始终使用 JSON Schema 方式，以确保输出格式稳定可靠。对于复杂对象，可先定义好 Java record，让框架自动推断 Schema。

### 实战一：智能简历信息抽取系统

从非结构化的简历文本中自动提取结构化信息，用于 HR 系统的简历筛选：

```java
// 定义简历数据结构
record EducationRecord(String school, String major, String degree, String startDate, String endDate) {}
record WorkExperience(String company, String position, String startDate, String endDate, List<String> responsibilities) {}
record ResumeInfo(
    String name,
    String phone,
    String email,
    Integer age,
    List<String> skills,
    List<EducationRecord> education,
    List<WorkExperience> workExperience,
    String summary
) {}

// 定义抽取接口
interface ResumeExtractor {
    @SystemMessage("""
        你是一个专业的HR助手，负责从简历文本中提取结构化信息。
        请仔细阅读简历内容，准确提取所有字段。
        如果某些信息无法从文本中找到，对应字段返回null。
        技能列表请提取技术相关的关键词。
        """)
    @UserMessage("请从以下简历中提取信息：\n\n{{resumeText}}")
    ResumeInfo extractResume(@V("resumeText") String resumeText);
}

// 使用示例
ResumeExtractor extractor = AiServices.create(ResumeExtractor.class, model);

String resumeText = """
    张三，手机13800138000，邮箱zhangsan@gmail.com
    男，1995年出生
    
    教育经历：
    2013-2017 清华大学 计算机科学与技术 本科
    2017-2020 北京大学 软件工程 硕士
    
    工作经历：
    2020-2022 阿里巴巴 Java开发工程师
    - 负责交易系统微服务开发
    - 参与双11性能优化
    2022-至今 字节跳动 高级Java工程师
    - 主导推荐系统架构设计
    - 带领5人团队完成核心模块重构
    
    技能：Java, Spring Boot, MySQL, Redis, Kafka, Docker
    """;

ResumeInfo info = extractor.extractResume(resumeText);
// 自动解析为结构化对象，可直接存入数据库
```

### 实战二：合同关键条款自动审核

从合同文本中提取关键条款，辅助法务审核：

```java
record ContractClause(String clauseType, String content, String riskLevel, String suggestion) {}
record ContractReview(
    String contractName,
    String partyA,
    String partyB,
    Double totalAmount,
    String startDate,
    String endDate,
    List<ContractClause> keyClauses,
    List<String> riskPoints,
    String overallAssessment
) {}

interface ContractReviewer {
    @SystemMessage("""
        你是一个专业的法务审核助手。请从合同文本中提取以下信息：
        1. 合同双方、金额、期限等基本信息
        2. 关键条款（付款条件、违约责任、保密条款、争议解决等）
        3. 风险点（对己方不利的条款、模糊表述、缺失条款）
        4. 总体评估和建议
        riskLevel 取值为：HIGH/MEDIUM/LOW
        """)
    @UserMessage("请审核以下合同：\n\n{{contractText}}")
    ContractReview reviewContract(@V("contractText") String contractText);
}

// 使用
ContractReviewer reviewer = AiServices.create(ContractReviewer.class, model);
ContractReview review = reviewer.reviewContract(contractText);
// review.riskPoints() 可直接展示给法务人员重点关注
```

### 实战三：客户评论情感与标签分析

批量分析客户评论，为产品运营提供数据支撑：

```java
record ReviewAnalysis(
    Sentiment sentiment,
    List<String> tags,           // 如：["物流", "质量", "客服"]
    String summary,
    Integer rating,              // 1-5星
    boolean needsAttention       // 是否需要人工跟进
) {}

enum Sentiment { POSITIVE, NEUTRAL, NEGATIVE }

interface ReviewAnalyzer {
    @SystemMessage("""
        分析客户评论，提取情感倾向、标签、摘要和评分。
        如果是差评（1-2星）或涉及投诉/退款，needsAttention设为true。
        tags从以下选项中选择：[质量, 物流, 客服, 价格, 包装, 售后, 退款]
        """)
    ReviewAnalysis analyzeReview(@V("review") String reviewText);
}

// 批量处理
ReviewAnalyzer analyzer = AiServices.create(ReviewAnalyzer.class, model);
List<ReviewAnalysis> results = reviews.stream()
        .map(analyzer::analyzeReview)
        .toList();

// 统计需要跟进的评论
long attentionCount = results.stream().filter(ReviewAnalysis::needsAttention).count();
```


## 工具（函数调用）

工具/函数调用是 LLM 应用最强大的功能之一，允许 LLM 在需要时调用外部工具来完成特定任务。

### 核心概念

LLM 本身不能直接调用工具，而是表达调用意图。开发者执行工具后将结果反馈给 LLM，LLM 再基于结果生成最终回答。

```
用户提问 → LLM 判断是否需要工具 → 返回工具调用请求 → 开发者执行工具 → 返回结果 → LLM 生成最终回答
```

### 高级 API：@Tool 注解

```java
class WeatherTools {
    @Tool("返回给定城市的天气预报")
    String getWeather(@P("城市名称") String city) {
        // 调用实际的天气API
        return weatherService.getWeather(city);
    }
    
    @Tool("返回给定城市的空气质量指数")
    String getAirQuality(@P("城市名称") String city) {
        return airQualityService.getAQI(city);
    }
}

interface WeatherAssistant {
    @SystemMessage("你是一个天气助手，可以帮助用户查询天气信息")
    String chat(String message);
}

WeatherAssistant assistant = AiServices.builder(WeatherAssistant.class)
        .chatLanguageModel(model)
        .tools(new WeatherTools())
        .build();

String answer = assistant.chat("北京今天天气怎么样？空气好不好？");
// LLM 会自动调用 getWeather("北京") 和 getAirQuality("北京")
```

### 低级 API：ToolSpecification

```java
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.model.chat.request.json.JsonObjectSchema;

ToolSpecification weatherTool = ToolSpecification.builder()
        .name("getWeather")
        .description("返回给定城市的天气预报")
        .parameters(JsonObjectSchema.builder()
                .addStringProperty("city", "城市名称")
                .required("city")
                .build())
        .build();

ChatRequest request = ChatRequest.builder()
        .messages(UserMessage.from("北京天气如何？"))
        .toolSpecifications(List.of(weatherTool))
        .build();

ChatResponse response = model.chat(request);

if (response.aiMessage().hasToolExecutionRequests()) {
    // LLM 请求调用工具
    ToolExecutionRequest toolRequest = response.aiMessage().toolExecutionRequests().get(0);
    System.out.println("工具名: " + toolRequest.name());       // getWeather
    System.out.println("参数: " + toolRequest.arguments());    // {"city":"北京"}
    
    // 手动执行工具
    String result = weatherService.getWeather("北京");
    
    // 将结果返回给 LLM
    ToolExecutionResultMessage toolResult = ToolExecutionResultMessage.from(toolRequest, result);
    ChatRequest request2 = ChatRequest.builder()
            .messages(UserMessage.from("北京天气如何？"), 
                      response.aiMessage(), 
                      toolResult)
            .toolSpecifications(List.of(weatherTool))
            .build();
    ChatResponse response2 = model.chat(request2);
    System.out.println(response2.aiMessage().text());
}
```

### 工具方法参数和返回值

```java
class OrderTools {
    // 支持基本类型、对象类型、枚举、List、自定义 POJO
    @Tool("查询订单详情")
    Order getOrder(@P("订单号") String orderNo, @P("客户姓名") String customerName) {
        return orderService.findByOrderNo(orderNo, customerName);
    }
    
    // 可选参数
    @Tool("搜索商品")
    List<Product> searchProducts(
            @P("搜索关键词") String keyword,
            @P(required = false, value = "价格排序方式") SortOrder priceOrder) {
        return productService.search(keyword, priceOrder);
    }
    
    // void 返回类型：成功时返回 "Success"
    @Tool("取消订单")
    void cancelOrder(@P("订单号") String orderNo) {
        orderService.cancel(orderNo);
    }
}
```

### 企业级工具示例

```java
@Component
public class DatabaseTools {
    
    private final JdbcTemplate jdbcTemplate;
    private final RedisTemplate<String, String> redisTemplate;
    
    public DatabaseTools(JdbcTemplate jdbcTemplate, RedisTemplate<String, String> redisTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.redisTemplate = redisTemplate;
    }
    
    @Tool("查询数据库中的用户数量")
    long countUsers() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Long.class);
    }
    
    @Tool("根据用户ID查询用户信息")
    String getUserById(@P("用户ID") Long userId) {
        // 先查缓存
        String cached = redisTemplate.opsForValue().get("user:" + userId);
        if (cached != null) {
            return cached;
        }
        // 查数据库
        Map<String, Object> user = jdbcTemplate.queryForMap("SELECT * FROM users WHERE id = ?", userId);
        String result = user.toString();
        redisTemplate.opsForValue().set("user:" + userId, result, Duration.ofMinutes(30));
        return result;
    }
    
    @Tool("执行只读SQL查询")
    String executeQuery(@P("SQL查询语句（仅支持SELECT）") String sql) {
        // 安全校验：只允许SELECT语句
        if (!sql.trim().toUpperCase().startsWith("SELECT")) {
            return "错误：仅允许执行SELECT查询";
        }
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);
        return results.toString();
    }
}
```

> **安全提示**：在工具方法中，务必做好输入校验和权限控制，防止 LLM 被诱导执行危险操作（如 SQL 注入、删除数据等）。关键操作建议加入人工确认环节。

### 实战一：电商订单查询与操作系统

完整的订单管理工具集，支持查询、取消、退款等操作，展示了工具调用的典型企业级应用：

```java
@Component
@Slf4j
public class OrderTools {

    private final OrderService orderService;
    private final PaymentService paymentService;

    public OrderTools(OrderService orderService, PaymentService paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    @Tool("查询订单详情，包括商品、金额、状态、物流等信息")
    OrderDetail getOrderDetail(@P("订单号") String orderNo) {
        log.info("工具调用：查询订单 {}", orderNo);
        return orderService.getDetail(orderNo);
    }

    @Tool("查询订单的物流状态")
    LogisticsInfo getLogistics(@P("订单号") String orderNo) {
        return orderService.getLogistics(orderNo);
    }

    @Tool("取消未发货的订单")
    String cancelOrder(@P("订单号") String orderNo, @P("取消原因") String reason) {
        Order order = orderService.getByOrderNo(orderNo);
        if (order.getStatus() == OrderStatus.SHIPPED) {
            return "该订单已发货，无法取消。建议您收到货后申请退货。";
        }
        orderService.cancel(orderNo, reason);
        return "订单" + orderNo + "已成功取消，退款将在1-3个工作日内原路返回。";
    }

    @Tool("申请退款，仅限已签收的订单")
    String requestRefund(
            @P("订单号") String orderNo,
            @P("退款原因") String reason,
            @P("退款金额") @P(required = false) Double amount) {
        Order order = orderService.getByOrderNo(orderNo);
        if (order.getStatus() != OrderStatus.DELIVERED) {
            return "仅已签收的订单可申请退款，当前订单状态：" + order.getStatus();
        }
        double refundAmount = (amount != null) ? amount : order.getTotalAmount();
        paymentService.refund(orderNo, refundAmount, reason);
        return "退款申请已提交，订单" + orderNo + "退款" + refundAmount + "元，预计3-5个工作日到账。";
    }

    @Tool("查询用户的全部订单列表")
    List<OrderSummary> listOrders(
            @P("用户手机号") String phone,
            @P("订单状态筛选") @P(required = false) String status) {
        return orderService.listByPhone(phone, status);
    }
}
```

在 AI 服务中集成：

```java
@AiService
interface CustomerServiceAssistant {
    @SystemMessage("""
        你是一个电商客服助手。请根据用户的问题调用相应的工具。
        注意：
        - 取消订单前务必先查询订单状态，确认是否可取消
        - 退款操作要确认订单已签收
        - 涉及金额的操作要特别谨慎
        - 语气要友好专业
        """)
    String chat(@MemoryId String userId, @UserMessage String message);
}
```

**对话示例：**

```
用户: 我的订单202501010001怎么还没到？
AI: [调用 getOrderDetail("202501010001")]
    [调用 getLogistics("202501010001")]
    您的订单202501010001目前正在运输中，预计明天送达。
    物流信息：2025-01-05 快递已到达北京转运中心。

用户: 太慢了，我想取消这个订单
AI: [调用 getOrderDetail("202501010001") 确认状态]
    很抱歉您的订单已经发货，无法直接取消。
    建议您收到货后联系我申请退货退款，届时会全额退款。
    是否需要我帮您标记一下？
```

### 实战二：智能数据库查询助手

让非技术人员通过自然语言查询数据库，工具方法自动将自然语言转为 SQL 并执行：

```java
@Component
public class DatabaseQueryTools {

    private final JdbcTemplate jdbcTemplate;

    @Tool("查询用户总数")
    long countUsers() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Long.class);
    }

    @Tool("按日期范围查询订单金额统计")
    String getOrderStats(
            @P("开始日期，格式yyyy-MM-dd") String startDate,
            @P("结束日期，格式yyyy-MM-dd") String endDate) {
        Map<String, Object> result = jdbcTemplate.queryForMap(
            "SELECT COUNT(*) as order_count, COALESCE(SUM(amount),0) as total_amount " +
            "FROM orders WHERE created_at BETWEEN ? AND ?",
            startDate, endDate);
        return String.format("%s至%s期间，共%s笔订单，总金额%s元",
                startDate, endDate, result.get("order_count"), result.get("total_amount"));
    }

    @Tool("查询指定商品的销售排名")
    String getProductRanking(
            @P("排名前N名") int topN,
            @P("时间范围，如：本月/本季度/本年") String period) {
        String dateCondition = switch (period) {
            case "本月" -> "AND created_at >= DATE_TRUNC('month', CURRENT_DATE)";
            case "本季度" -> "AND created_at >= DATE_TRUNC('quarter', CURRENT_DATE)";
            case "本年" -> "AND created_at >= DATE_TRUNC('year', CURRENT_DATE)";
            default -> "";
        };
        List<Map<String, Object>> results = jdbcTemplate.queryForList(
            "SELECT p.name, SUM(oi.quantity) as total_qty " +
            "FROM order_items oi JOIN products p ON oi.product_id = p.id " +
            "JOIN orders o ON oi.order_id = o.id " +
            "WHERE 1=1 " + dateCondition + " " +
            "GROUP BY p.name ORDER BY total_qty DESC LIMIT ?",
            topN);
        return results.toString();
    }
}
```

> **安全提醒**：数据库工具中应严格限制为只读查询，避免 LLM 被诱导执行 DELETE/UPDATE 等危险操作。对于写操作，建议单独设置需要人工确认的流程。


## RAG（检索增强生成）

LLM 的知识仅限于训练数据。RAG 是一种在发送给 LLM 之前，从外部数据中找到并注入相关信息片段到提示中的方法，可以显著降低幻觉概率。

### RAG 两个阶段

1. **索引阶段（离线）**：文档预处理 → 分割 → 嵌入 → 存储到向量数据库
2. **检索阶段（在线）**：用户提问 → 嵌入查询 → 向量搜索 → 注入提示 → LLM 回答

### Easy RAG（最简方式）

```java
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

// 1. 加载文档（支持 TXT、PDF、DOC、PPT、XLS 等）
List<Document> documents = FileSystemDocumentLoader.loadDocuments("/path/to/documents");

// 2. 创建内存向量存储并导入
InMemoryEmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();
EmbeddingStoreIngestor.ingest(documents, embeddingStore);

// 3. 创建 AI 服务并使用
interface Assistant {
    String chat(String message);
}

Assistant assistant = AiServices.builder(Assistant.class)
        .chatLanguageModel(model)
        .contentRetriever(ContentRetriever.from(embeddingStore, embeddingModel))
        .build();

String answer = assistant.chat("公司的请假制度是什么？");
```

### 文档加载

```java
// 加载指定目录的所有文件
List<Document> docs = FileSystemDocumentLoader.loadDocuments("/path/to/docs");

// 递归加载子目录
List<Document> docs = FileSystemDocumentLoader.loadDocumentsRecursively("/path/to/docs");

// 使用 glob 过滤
PathMatcher pathMatcher = FileSystems.getDefault().getPathMatcher("glob:*.pdf");
List<Document> docs = FileSystemDocumentLoader.loadDocuments("/path/to/docs", pathMatcher);

// 从 URL 加载
Document document = UrlDocumentLoader.load("https://example.com/page.html");
```

### 文档分割

```java
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.document.splitter.DocumentBySentenceSplitter;
import dev.langchain4j.data.document.splitter.DocumentByRegexSplitter;

// 按段落分割，每个片段最多300个token，重叠30个token
DocumentByParagraphSplitter splitter = DocumentByParagraphSplitter.builder()
        .maxParagraphs(1)
        .maxSegmentSize(300, new OpenAiTokenizer())
        .overlapSize(30)
        .build();

// 按句子分割
DocumentBySentenceSplitter sentenceSplitter = new DocumentBySentenceSplitter(
        300,    // 每段最大token数
        30      // 重叠token数
);

// 使用 EmbeddingStoreIngestor 配置分割器
EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
        .documentSplitter(splitter)
        .embeddingModel(embeddingModel)
        .embeddingStore(embeddingStore)
        .build();

ingestor.ingest(documents);
```

> **实用技巧**：分割粒度是影响 RAG 效果的关键因素。片段太大会包含无关信息，太小会丢失上下文。建议根据实际文档特点调整分割策略，一般 300-500 token 为宜，配合适当的重叠。

### Naive RAG（基础 RAG）

```java
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;

// 创建内容检索器
ContentRetriever contentRetriever = EmbeddingStoreContentRetriever.builder()
        .embeddingStore(embeddingStore)
        .embeddingModel(embeddingModel)
        .maxResults(5)                    // 最多返回5个相关片段
        .minScore(0.5)                    // 最低相似度阈值
        .build();

// 在 AI 服务中使用
interface Assistant {
    @SystemMessage("基于提供的上下文信息回答问题，如果上下文中没有相关信息，请说明")
    String chat(String message);
}

Assistant assistant = AiServices.builder(Assistant.class)
        .chatLanguageModel(model)
        .contentRetriever(contentRetriever)
        .build();
```

### Advanced RAG（高级 RAG）

高级 RAG 提供模块化框架，支持查询转换、多源检索、重排序等高级功能。

#### 查询转换

```java
import dev.langchain4j.rag.query.transformer.ExpandingQueryTransformer;
import dev.langchain4j.rag.query.transformer.CompressingQueryTransformer;

// 查询扩展：将一个查询扩展为多个变体
QueryTransformer expandingTransformer = ExpandingQueryTransformer.builder()
        .chatLanguageModel(model)
        .build();

// 查询压缩：将多轮对话压缩为独立查询
QueryTransformer compressingTransformer = CompressingQueryTransformer.builder()
        .chatLanguageModel(model)
        .build();
```

#### 查询路由

```java
import dev.langchain4j.rag.query.router.QueryRouter;

// 根据查询内容路由到不同的检索器
QueryRouter queryRouter = query -> {
    if (query.text().contains("代码")) {
        return List.of(codeRetriever);
    } else if (query.text().contains("文档")) {
        return List.of(docRetriever);
    } else {
        return List.of(generalRetriever);
    }
};
```

#### 重排序

```java
import dev.langchain4j.rag.content.aggregator.ContentAggregator;
import dev.langchain4j.rag.content.aggregator.ReRankingContentAggregator;

// 使用重排序模型对检索结果重新排序
ContentAggregator aggregator = ReRankingContentAggregator.builder()
        .scoringModel(scoringModel)
        .build();
```

#### 完整的高级 RAG 流程

```java
import dev.langchain4j.rag.DefaultRetrievalAugmentor;
import dev.langchain4j.rag.RetrievalAugmentor;

RetrievalAugmentor retrievalAugmentor = DefaultRetrievalAugmentor.builder()
        .queryTransformer(expandingTransformer)         // 查询扩展
        .queryRouter(queryRouter)                        // 查询路由
        .contentRetriever(contentRetriever)              // 内容检索
        .contentAggregator(aggregator)                   // 内容聚合/重排序
        .build();

Assistant assistant = AiServices.builder(Assistant.class)
        .chatLanguageModel(model)
        .retrievalAugmentor(retrievalAugmentor)
        .build();
```

### Metadata 的使用

```java
// 创建带元数据的文档
Metadata metadata = new Metadata();
metadata.put("source", "company-wiki");
metadata.put("department", "HR");
metadata.put("lastUpdated", "2024-01-15");

Document document = Document.from("公司的年假制度...", metadata);

// 搜索时根据元数据过滤
ContentRetriever contentRetriever = EmbeddingStoreContentRetriever.builder()
        .embeddingStore(embeddingStore)
        .embeddingModel(embeddingModel)
        .filter(metadataKey("department").isEqualTo("HR"))  // 只搜索HR部门的文档
        .build();
```

### 向量数据库集成

LangChain4j 支持 20+ 种向量数据库，以下是常见的几种：

```java
// Milvus
import dev.langchain4j.store.embedding.milvus.MilvusEmbeddingStore;

MilvusEmbeddingStore store = MilvusEmbeddingStore.builder()
        .host("localhost")
        .port(19530)
        .collectionName("documents")
        .dimension(1536)
        .build();

// Redis
import dev.langchain4j.store.embedding.redis.RedisEmbeddingStore;

RedisEmbeddingStore store = RedisEmbeddingStore.builder()
        .host("localhost")
        .port(6379)
        .dimension(1536)
        .build();

// Pinecone
import dev.langchain4j.store.embedding.pinecone.PineconeEmbeddingStore;

PineconeEmbeddingStore store = PineconeEmbeddingStore.builder()
        .apiKey(System.getenv("PINECONE_API_KEY"))
        .index("documents")
        .build();

// PGVector
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;

PgVectorEmbeddingStore store = PgVectorEmbeddingStore.builder()
        .host("localhost")
        .port(5432)
        .database("vectordb")
        .user("postgres")
        .password("password")
        .table("embeddings")
        .dimension(1536)
        .build();
```

> **企业级技巧**：生产环境中，推荐使用 Milvus、PGVector 或 Redis 作为向量存储。Milvus 性能强劲适合大规模场景；PGVector 与现有 PostgreSQL 基础设施集成方便；Redis 适合需要低延迟的场景。

### 实战：企业级知识库问答系统

以下是一个完整的企业级知识库问答系统架构与实现，涵盖从文档摄入到智能问答的全流程：

**架构设计（按团队规模）：**

| 架构组件 | 小型团队（<10人） | 中型企业（10-100人） | 大型组织（>100人） |
|----------|-------------------|----------------------|---------------------|
| 向量数据库 | InMemoryEmbeddingStore | Redis Stack / Chroma | Milvus / Weaviate |
| 文档处理 | 单机同步处理 | 分布式队列异步处理 | 微服务化文档处理流水线 |
| 检索策略 | 简单向量检索 | 混合检索（向量+关键词） | 多级检索+重排序 |
| 部署方式 | 单体应用 | 容器化部署 | Kubernetes 集群 |
| 监控告警 | 基础日志 | 指标监控+告警 | 全链路追踪+智能告警 |

**1. 文档摄入服务：**

```java
@Service
@Slf4j
public class DocumentIngestionService {

    private final EmbeddingStoreIngestor ingestor;

    public DocumentIngestionService(EmbeddingModel embeddingModel,
                                     EmbeddingStore<TextSegment> embeddingStore) {
        this.ingestor = EmbeddingStoreIngestor.builder()
                .documentSplitter(DocumentSplitters.recursive(
                        300, 30, new OpenAiTokenizer()))
                .embeddingModel(embeddingModel)
                .embeddingStore(embeddingStore)
                .documentTransformer(doc -> {
                    // 添加元数据，便于后续过滤和溯源
                    doc.metadata().put("ingestedAt", Instant.now().toString());
                    return doc;
                })
                .build();
    }

    /**
     * 批量导入目录下的文档
     */
    @Async
    public CompletableFuture<Void> ingestDirectory(String directoryPath) {
        PathMatcher pdfMatcher = FileSystems.getDefault().getPathMatcher("glob:**.pdf");
        PathMatcher docMatcher = FileSystems.getDefault().getPathMatcher("glob:**.{doc,docx}");
        PathMatcher allMatcher = FileSystems.getDefault().getPathMatcher("glob:**.{pdf,doc,docx,txt,md,html}");

        List<Document> documents = FileSystemDocumentLoader.loadDocuments(
                Path.of(directoryPath), allMatcher);

        log.info("开始摄入{}个文档...", documents.size());
        ingestor.ingest(documents);
        log.info("文档摄入完成");

        return CompletableFuture.completedFuture(null);
    }

    /**
     * 单文档实时导入（用户上传场景）
     */
    public void ingestSingleDocument(MultipartFile file, String category) throws IOException {
        // 解析文档
        DocumentParser parser = new ApacheTikaDocumentParser();
        Document document = parser.parse(file.getInputStream());

        // 增强元数据
        document.metadata().put("fileName", file.getOriginalFilename());
        document.metadata().put("category", category);
        document.metadata().put("fileSize", file.getSize());

        ingestor.ingest(document);
        log.info("文档 {} 摄入成功", file.getOriginalFilename());
    }
}
```

**2. 智能问答服务：**

```java
@Service
public class KnowledgeBaseQAService {

    private final ChatLanguageModel chatModel;
    private final ContentRetriever contentRetriever;

    public KnowledgeBaseQAService(ChatLanguageModel chatModel,
                                   EmbeddingStore<TextSegment> embeddingStore,
                                   EmbeddingModel embeddingModel) {
        this.chatModel = chatModel;
        this.contentRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)           // 返回最相关的5个片段
                .minScore(0.6)           // 最低相似度阈值
                .build();
    }

    public String ask(String question, String category) {
        // 如果需要按分类过滤
        ContentRetriever filteredRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .filter(metadataKey("category").isEqualTo(category))
                .maxResults(5)
                .minScore(0.6)
                .build();

        interface KBAssistant {
            @SystemMessage("""
                你是一个企业知识库助手。请基于提供的上下文信息回答用户问题。
                规则：
                1. 只基于提供的上下文信息回答
                2. 如果上下文中没有相关信息，明确说“我在知识库中未找到相关信息”
                3. 不要编造或推测任何信息
                4. 引用来源时，说明出自哪个文档
                """)
            Result<String> answer(String question);
        }

        KBAssistant assistant = AiServices.builder(KBAssistant.class)
                .chatLanguageModel(chatModel)
                .contentRetriever(filteredRetriever)
                .build();

        Result<String> result = assistant.answer(question);
        // result.sources() 包含了检索到的原文片段，可用于溯源
        return result.content();
    }
}
```

**3. 实际效果案例（某电商客服系统）：**

场景：用户咨询"我买的洗衣机坏了，怎么维修？"

```
处理流程：
1. 用户输入通过意图识别为“售后维修”
2. RAG引擎检索知识库，命中文档《家电维修政策》
3. 生成回答：“根据政策，您可联系400-xxx-xxxx预约上门维修，或携带发票至线下门店。”
4. 若用户追问“需要准备什么？”，系统检索《维修准备清单》并补充回答

实测效果：
- 回答准确率从72%提升至91%
- 平均响应时间从15秒降至3秒
- 人工客服工作量减少60%
```


## Agent（智能代理）

Agent 是 LLM 应用的最高级形态，能够自主规划和使用工具来完成复杂任务。

### 基础 Agent

使用 AI 服务 + 工具即可构建基础 Agent：

```java
@Component
public class CustomerSupportTools {
    
    private final BookingService bookingService;
    
    public CustomerSupportTools(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    @Tool("查询预订详情")
    Booking getBookingDetails(
            @P("预订号") String bookingNumber, 
            @P("客户名") String customerName, 
            @P("客户姓") String customerSurname) {
        return bookingService.getBookingDetails(bookingNumber, customerName, customerSurname);
    }
    
    @Tool("取消预订")
    void cancelBooking(
            @P("预订号") String bookingNumber, 
            @P("客户名") String customerName, 
            @P("客户姓") String customerSurname) {
        bookingService.cancelBooking(bookingNumber, customerName, customerSurname);
    }
}

@AiService
interface CustomerSupportAgent {
    @SystemMessage("""
        你是一个客户支持代理。
        在取消预订之前，请务必确认客户的身份信息和预订详情。
        语气要礼貌专业。
        """)
    String chat(@MemoryId String userId, @UserMessage String message);
}
```

### Agentic 模块（新特性）

LangChain4j 新增了 `langchain4j-agentic` 模块，支持构建更复杂的 Agent 编排工作流：

#### 顺序工作流（Sequential）

```java
import dev.langchain4j.agentic.workflow.SequentialAgent;

// 多个 Agent 按顺序执行，前一个的输出作为后一个的输入
Agent researchAgent = Agent.builder()
        .name("researcher")
        .systemMessage("你负责搜索和收集信息")
        .chatModel(model)
        .build();

Agent writerAgent = Agent.builder()
        .name("writer")
        .systemMessage("你负责根据研究结果撰写文章")
        .chatModel(model)
        .build();

Agent editorAgent = Agent.builder()
        .name("editor")
        .systemMessage("你负责审核和润色文章")
        .chatModel(model)
        .build();

SequentialAgent pipeline = SequentialAgent.builder()
        .agents(researchAgent, writerAgent, editorAgent)
        .build();

String result = pipeline.execute("写一篇关于AI发展趋势的文章");
```

#### 条件工作流（Conditional）

```java
// 根据条件选择不同的 Agent 处理
Agent techSupport = Agent.builder()
        .name("tech-support")
        .systemMessage("你负责技术支持")
        .chatModel(model)
        .build();

Agent billingSupport = Agent.builder()
        .name("billing-support")
        .systemMessage("你负责账单问题")
        .chatModel(model)
        .build();

ConditionalAgent router = ConditionalAgent.builder()
        .condition(query -> query.contains("账单") ? "billing" : "tech")
        .branch("billing", billingSupport)
        .branch("tech", techSupport)
        .build();
```

#### 循环工作流（Loop）

```java
// Agent 反复执行直到满足条件
LoopAgent reviewLoop = LoopAgent.builder()
        .agent(reviewer)
        .maxIterations(5)            // 最多循环5次
        .terminationCondition(result -> result.contains("APPROVED"))
        .build();
```

#### 并行工作流（Parallel）

```java
// 多个 Agent 同时执行
ParallelAgent parallelAgent = ParallelAgent.builder()
        .agents(marketAnalyzer, techAnalyzer, riskAnalyzer)
        .build();

String combinedResult = parallelAgent.execute("分析这个投资标的");
```

#### 主管模式（Supervisor）

```java
// 主管 Agent 自主决定调用哪个 Agent
Agent supervisor = Agent.builder()
        .name("supervisor")
        .systemMessage("你是一个主管，根据用户需求决定调用哪个专业Agent")
        .chatModel(model)
        .tools(researchTool, analysisTool, writingTool)
        .build();
```

### 多 Agent 系统

```java
// 使用 A2A（Agent-to-Agent）协议实现 Agent 间通信
// 通过 langchain4j-agentic-a2a 模块

// 主管 Agent + 专业 Agent 架构
Agent coordinator = Agent.builder()
        .name("coordinator")
        .systemMessage("你是协调者，将任务分配给合适的专业Agent")
        .chatModel(model)
        .build();

Agent coder = Agent.builder()
        .name("coder")
        .systemMessage("你是编程专家，负责编写代码")
        .chatModel(model)
        .tool(coderTool)
        .build();

Agent tester = Agent.builder()
        .name("tester")
        .systemMessage("你是测试专家，负责编写测试用例")
        .chatModel(model)
        .tool(testTool)
        .build();
```

> **企业级技巧**：Agent 系统中，务必设置合理的终止条件和最大迭代次数，防止 Agent 陷入无限循环。对于关键操作（如删除数据、发送邮件），建议加入人工审核（human-in-the-loop）机制。

### 实战一：招聘流程监督者 Agent

以下是基于 LangChain4j Agentic 模块实现的企业级招聘流程监督者系统，监督者 Agent 自主决定调用哪些子 Agent：

```java
// 1. 定义子智能体
public interface HrCvReviewer {
    @Agent("HR评审员，从人力资源角度审查候选人简历")
    ResultWithAgenticScope<String> reviewCv(@V("cv") String cv, @V("jobDescription") String jobDescription);
}

public interface ManagerCvReviewer {
    @Agent("经理评审员，从技术和管理角度审查候选人简历")
    ResultWithAgenticScope<String> reviewCv(@V("cv") String cv, @V("jobDescription") String jobDescription);
}

public interface InterviewOrganizer {
    @Agent("面试安排员，为通过筛选的候选人安排面试")
    ResultWithAgenticScope<String> organize(@V("candidateName") String name, @V("position") String position);
}

public interface EmailAssistant {
    @Agent("邮件助手，向未通过筛选的候选人发送拒绝邮件")
    ResultWithAgenticScope<String> sendRejection(@V("candidateName") String name, @V("position") String position);
}

// 2. 构建子智能体实例
HrCvReviewer hrReviewer = AgenticServices.agentBuilder(HrCvReviewer.class)
        .chatModel(model)
        .outputKey("hrReview")
        .build();

ManagerCvReviewer managerReviewer = AgenticServices.agentBuilder(ManagerCvReviewer.class)
        .chatModel(model)
        .outputKey("managerReview")
        .build();

InterviewOrganizer interviewOrganizer = AgenticServices.agentBuilder(InterviewOrganizer.class)
        .chatModel(model)
        .tools(new OrganizingTools())  // 包含日历、邮件等工具
        .build();

EmailAssistant emailAssistant = AgenticServices.agentBuilder(EmailAssistant.class)
        .chatModel(model)
        .tools(new OrganizingTools())
        .build();

// 3. 构建监督者智能体
SupervisorAgent hiringSupervisor = AgenticServices.supervisorBuilder()
        .chatModel(model)
        .subAgents(hrReviewer, managerReviewer, interviewOrganizer, emailAssistant)
        .contextGenerationStrategy(SupervisorContextStrategy.CHAT_MEMORY_AND_SUMMARIZATION)
        .responseStrategy(SupervisorResponseStrategy.SUMMARY)
        .supervisorContext("始终使用所有可用的评审者。始终用中文回答。调用智能体时使用纯JSON格式。")
        .build();

// 4. 执行招聘流程
String result = hiringSupervisor.invoke(
    "请审查以下候选人简历：" + candidateCv + "，职位要求：" + jobDescription);

// 监督者会自动：
// 1. 调用HR评审 → 获得HR视角的评价
// 2. 调用经理评审 → 获得技术视角的评价  
// 3. 根据评审结果决定下一步：
//    - 通过 → 调用面试安排员
//    - 不通过 → 调用邮件助手发送拒绝邮件
```

### 实战二：AI 辅助代码审查工作流

构建一个自动化的代码审查流水线，多个 Agent 协作完成代码审查：

```java
// 定义代码审查相关的工具
@Component
public class CodeReviewTools {

    @Tool("获取指定文件最新的代码变更")
    String getFileDiff(@P("文件路径") String filePath, @P("分支名") String branch) {
        return gitService.getFileDiff(filePath, branch);
    }

    @Tool("获取代码仓库中指定文件的完整内容")
    String getFileContent(@P("文件路径") String filePath, @P("分支名") String branch) {
        return gitService.getFileContent(filePath, branch);
    }

    @Tool("在代码审查系统中添加评论")
    void addReviewComment(@P("文件路径") String filePath, @P("行号") int line, @P("评论内容") String comment) {
        codeReviewService.addComment(filePath, line, comment);
    }

    @Tool("批准代码合并请求")
    void approveMergeRequest(@P("合并请求ID") String mrId) {
        codeReviewService.approve(mrId);
    }
}

// 定义安全审查工具
@Component
public class SecurityTools {

    @Tool("检查代码是否包含常见安全漏洞模式")
    List<String> scanSecurityIssues(@P("代码内容") String code) {
        return securityScanner.scan(code);
    }

    @Tool("检查依赖包是否存在已知安全漏洞")
    List<String> checkDependencyVulnerabilities(@P("项目路径") String projectPath) {
        return dependencyChecker.check(projectPath);
    }
}

// 定义审查 Agent
@AiService
interface CodeReviewerAgent {
    @SystemMessage("""
        你是一个高级代码审查员。请检查代码的：
        1. 代码质量和可读性
        2. 潜在的 Bug 和逻辑错误
        3. 性能问题
        4. 设计模式的使用
        给出具体的改进建议和代码示例。
        """)
    String reviewCode(@UserMessage String codeChange);
}

@AiService
interface SecurityReviewerAgent {
    @SystemMessage("""
        你是一个安全审查专家。请检查代码中是否存在：
        1. SQL注入、XSS等安全漏洞
        2. 敏感信息泄露
        3. 不安全的加密使用
        4. 权限控制缺失
        严重问题请标记为 [CRITICAL]，一般问题标记为 [WARNING]。
        """)
    String reviewSecurity(@UserMessage String codeChange);
}

// 顺序工作流：代码审查 → 安全审查 → 汇总
// 代码审查Agent先检查代码质量，安全审查Agent再检查安全漏洞
// 最后汇总所有审查意见，决定是否批准合并
```

### 实战三：邮件自动分类与回复 Agent

```java
@Component
public class EmailTools {

    @Tool("获取未读邮件列表")
    List<EmailInfo> getUnreadEmails() {
        return emailService.getUnreadEmails();
    }

    @Tool("发送邮件回复")
    void sendReply(@P("邮件ID") String emailId, 
                   @P("回复内容") String content,
                   @P("是否需要人工审核") boolean needApproval) {
        if (needApproval) {
            // 需要人工审核的邮件先放入待审核队列
            approvalQueue.add(new PendingReply(emailId, content));
        } else {
            emailService.sendReply(emailId, content);
        }
    }

    @Tool("转发邮件给指定部门")
    void forwardEmail(@P("邮件ID") String emailId, @P("目标部门") String department) {
        emailService.forward(emailId, department);
    }
}

@AiService
interface EmailAssistantAgent {
    @SystemMessage("""
        你是一个邮件处理助手。对于收到的邮件：
        1. 判断邮件类型：咨询/投诉/合作/其他
        2. 咨询类：根据知识库生成回复草稿
        3. 投诉类：标记为紧急，转交客服部门
        4. 合作类：转交商务部门
        5. 所有对外回复必须经过人工审核后再发送
        """)
    String processEmails(@UserMessage String instruction);
}
```


## Spring Boot 集成

LangChain4j 提供了完善的 Spring Boot 自动配置支持，极大简化了开发流程。

### 添加依赖

```xml
<!-- OpenAI Spring Boot Starter -->
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-open-ai-spring-boot-starter</artifactId>
    <version>1.0.0-beta3</version>
</dependency>

<!-- 声明式 AI 服务 Starter -->
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-spring-boot-starter</artifactId>
    <version>1.0.0-beta3</version>
</dependency>
```

### 配置文件

```yaml
# application.yml
langchain4j:
  open-ai:
    chat-model:
      api-key: ${OPENAI_API_KEY}
      model-name: gpt-4o
      temperature: 0.7
      max-tokens: 4096
      log-requests: true
      log-responses: true
    streaming-chat-model:
      api-key: ${OPENAI_API_KEY}
      model-name: gpt-4o
```

### 声明式 AI 服务

```java
@AiService
interface Assistant {
    @SystemMessage("你是一个智能客服助手，请用专业且友好的语气回答问题")
    String chat(@MemoryId String userId, @UserMessage String message);
}
```

无需手动调用 `AiServices.create()`，Spring Boot 启动时自动扫描 `@AiService` 注解的接口并注册为 Bean。

### 自动装配工具

```java
@Component
public class OrderTools {
    
    private final OrderService orderService;
    
    public OrderTools(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @Tool("查询订单状态")
    String getOrderStatus(@P("订单号") String orderNo) {
        return orderService.getStatus(orderNo);
    }
    
    @Tool("申请退款")
    String requestRefund(@P("订单号") String orderNo, @P("退款原因") String reason) {
        return orderService.refund(orderNo, reason);
    }
}
```

所有标注了 `@Tool` 的方法会自动装配到 AI 服务中。

### 显式组件装配

当存在多个同类型组件时，使用显式装配：

```yaml
# 配置多个模型
langchain4j:
  open-ai:
    chat-model:
      api-key: ${OPENAI_API_KEY}
      model-name: gpt-4o-mini
  ollama:
    chat-model:
      base-url: http://localhost:11434
      model-name: llama3.1
```

```java
@AiService(wiringMode = WiringMode.EXPLICIT, chatModel = "openAiChatModel")
interface OpenAiAssistant {
    @SystemMessage("你是OpenAI助手")
    String chat(String message);
}

@AiService(wiringMode = WiringMode.EXPLICIT, chatModel = "ollamaChatModel")
interface OllamaAssistant {
    @SystemMessage("你是Ollama助手")
    String chat(String message);
}
```

### 完整的 Spring Boot 示例

```java
// Controller
@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    private final Assistant assistant;
    
    public ChatController(Assistant assistant) {
        this.assistant = assistant;
    }
    
    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String answer = assistant.chat(request.getUserId(), request.getMessage());
        return new ChatResponse(answer);
    }
}

// DTO
record ChatRequest(String userId, String message) {}
record ChatResponse(String answer) {}

// 配置持久化聊天记忆
@Configuration
public class ChatMemoryConfig {
    
    @Bean
    ChatMemoryProvider chatMemoryProvider(ChatMemoryStore chatMemoryStore) {
        return memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(20)
                .chatMemoryStore(chatMemoryStore)
                .build();
    }
}
```

### 可观察性（Observability）

```java
@Configuration
public class ObservabilityConfig {
    
    @Bean
    ChatModelListener chatModelListener() {
        return new ChatModelListener() {
            private static final Logger log = LoggerFactory.getLogger(ChatModelListener.class);
            
            @Override
            public void onRequest(ChatModelRequestContext requestContext) {
                log.info("LLM请求: {}", requestContext.chatRequest().messages().size() + " 条消息");
            }
            
            @Override
            public void onResponse(ChatModelResponseContext responseContext) {
                TokenUsage usage = responseContext.chatResponse().tokenUsage();
                log.info("LLM响应: 输入{}token, 输出{}token", 
                        usage.inputTokenCount(), usage.outputTokenCount());
            }
            
            @Override
            public void onError(ChatModelErrorContext errorContext) {
                log.error("LLM错误: {}", errorContext.error().getMessage());
            }
        };
    }
}
```

### 实战：生产级 Spring Boot AI 对话系统

以下是一个完整的生产级 AI 对话系统配置，整合了 Redis 持久化记忆、流式响应、工具调用和可观察性：

**1. 依赖配置（pom.xml）：**

```xml
<dependencies>
    <!-- Spring Boot WebFlux（支持流式响应） -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>

    <!-- Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- LangChain4j 核心 -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-spring-boot-starter</artifactId>
        <version>1.0.0-beta3</version>
    </dependency>

    <!-- OpenAI 集成 -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-open-ai-spring-boot-starter</artifactId>
        <version>1.0.0-beta3</version>
    </dependency>

    <!-- 响应式支持（Flux） -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-reactor</artifactId>
        <version>1.0.0-beta3</version>
    </dependency>
</dependencies>
```

**2. 应用配置（application.yml）：**

```yaml
langchain4j:
  open-ai:
    streaming-chat-model:
      base-url: https://api.openai.com/v1
      api-key: ${OPENAI_API_KEY}
      model-name: gpt-4o-mini
      temperature: 0.7
      max-tokens: 4096
      log-requests: true
      log-responses: true

spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      database: 1
```

**3. 流式助手接口：**

```java
@AiService
public interface StreamingAssistant {
    @SystemMessage("你是一个专业的AI助手，请用中文回答问题，语气友好专业")
    Flux<String> chat(@MemoryId int memoryId, @UserMessage String userMessage);
}
```

**4. 自定义工具：**

```java
@Component
public class AssistantTools {

    @Tool("获取当前日期和时间")
    public String currentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @Tool("计算数学表达式")
    public String calculate(@P("数学表达式") String expression) {
        try {
            // 使用安全的表达式计算器
            return String.valueOf(mathEvaluator.evaluate(expression));
        } catch (Exception e) {
            return "计算错误：" + e.getMessage();
        }
    }
}
```

**5. 控制器（支持 SSE 流式输出）：**

```java
@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final OpenAiStreamingChatModel streamingModel;
    private final RedisChatMemoryStore chatMemoryStore;
    private final AssistantTools assistantTools;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(
            @RequestParam String message,
            @RequestParam(defaultValue = "1") int memoryId) {

        ChatMemoryProvider chatMemoryProvider = memoryId2 ->
                MessageWindowChatMemory.builder()
                        .id(memoryId2)
                        .maxMessages(20)
                        .chatMemoryStore(chatMemoryStore)
                        .build();

        StreamingAssistant assistant = AiServices.builder(StreamingAssistant.class)
                .streamingChatLanguageModel(streamingModel)
                .chatMemoryProvider(chatMemoryProvider)
                .tools(assistantTools)
                .build();

        return assistant.chat(memoryId, message);
    }
}
```

**6. 前端调用示例：**

```javascript
// 使用 EventSource 接收流式响应
const eventSource = new EventSource(
    `/api/v1/chat/stream?message=${encodeURIComponent(input)}&memoryId=${userId}`
);

eventSource.onmessage = function(event) {
    document.getElementById('response').textContent += event.data;
};

eventSource.onerror = function() {
    eventSource.close();
};
```

**项目结构一览：**

```
src/main/java/com/example/ai/
├── config/
│   ├── RedisChatMemoryStore.java     # Redis持久化记忆
│   └── RedisTemplateConfig.java      # Redis配置
├── controller/
│   └── ChatController.java           # 聊天接口
├── service/
│   └── StreamingAssistant.java       # AI助手接口
├── tool/
│   └── AssistantTools.java           # 自定义工具
└── listener/
    └── ChatModelListener.java        # 监听器(可观察性)
```



LangChain4j 支持 15+ 个主流 LLM 提供商，以下是部分列表：

| 提供商 | 模块名 | 聊天 | 流式 | 工具 | JSON Schema |
|--------|--------|------|------|------|-------------|
| OpenAI | langchain4j-open-ai | ✓ | ✓ | ✓ | ✓ |
| Azure OpenAI | langchain4j-azure-open-ai | ✓ | ✓ | ✓ | ✓ |
| Google Gemini | langchain4j-google-ai-gemini | ✓ | ✓ | ✓ | ✓ |
| Anthropic | langchain4j-anthropic | ✓ | ✓ | ✓ | ✗ |
| Ollama | langchain4j-ollama | ✓ | ✓ | ✓ | ✓ |
| Mistral AI | langchain4j-mistral-ai | ✓ | ✓ | ✓ | ✓ |
| DashScope(千问) | langchain4j-dashscope | ✓ | ✓ | ✓ | ✗ |
| 智谱 AI | langchain4j-zhipu | ✓ | ✓ | ✓ | ✗ |
| AWS Bedrock | langchain4j-bedrock | ✓ | ✓ | ✓ | ✗ |
| 百度千帆 | langchain4j-qianfan | ✓ | ✓ | ✗ | ✗ |
| MiniMax | langchain4j-minimax | ✓ | ✓ | ✓ | ✗ |
| 讯飞星火 | langchain4j-spark | ✓ | ✓ | ✗ | ✗ |


## 嵌入模型

嵌入模型将文本转换为向量表示，是 RAG 的核心组件。

### 进程内嵌入模型

LangChain4j 提供了 5 种可在 JVM 内直接运行的嵌入模型（无需外部 API）：

```java
import dev.langchain4j.model.embedding.onnx.allminilml6v2.AllMiniLmL6V2EmbeddingModel;

// 使用 ONNX Runtime 在进程内运行
AllMiniLmL6V2EmbeddingModel embeddingModel = new AllMiniLmL6V2EmbeddingModel();

// 生成嵌入向量
Response<Embedding> response = embeddingModel.embed("Hello World");
float[] vector = response.content().vector();
```

### 云端嵌入模型

```java
// OpenAI 嵌入
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;

OpenAiEmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY"))
        .modelName("text-embedding-3-small")
        .build();

// DashScope 嵌入
import dev.langchain4j.model.dashscope.QwenEmbeddingModel;

QwenEmbeddingModel embeddingModel = QwenEmbeddingModel.builder()
        .apiKey(System.getenv("DASHSCOPE_API_KEY"))
        .modelName("text-embedding-v2")
        .build();
```

### 嵌入相似度计算

```java
import dev.langchain4j.store.embedding.CosineSimilarity;
import dev.langchain4j.store.embedding.RelevanceScore;

Embedding embedding1 = embeddingModel.embed("Java编程").content();
Embedding embedding2 = embeddingModel.embed("Python编程").content();
Embedding embedding3 = embeddingModel.embed("美食烹饪").content();

double sim12 = CosineSimilarity.between(embedding1, embedding2);
double sim13 = CosineSimilarity.between(embedding1, embedding3);
// sim12 > sim13（编程相关度更高）

// 转换为0-1之间的相关度分数
double relevance = RelevanceScore.fromCosineSimilarity(sim12);
```


## 文档处理管道

### EmbeddingStoreIngestor

`EmbeddingStoreIngestor` 是一个完整的文档摄入管道：

```java
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;

// 构建摄入管道
EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
        // 1. 文档分割器
        .documentSplitter(DocumentSplitters.recursive(300, 30, new OpenAiTokenizer()))
        // 2. 文档后处理器（可选）
        .documentTransformer(document -> {
            // 自定义文档预处理，如清洗、去噪
            return document;
        })
        // 3. 嵌入模型
        .embeddingModel(embeddingModel)
        // 4. 向量存储
        .embeddingStore(embeddingStore)
        // 5. 元数据增强（可选）
        .documentTransformer(document -> {
            document.metadata().put("ingestedAt", Instant.now().toString());
            return document;
        })
        .build();

// 加载并摄入文档
List<Document> documents = FileSystemDocumentLoader.loadDocuments("/path/to/docs");
ingestor.ingest(documents);
```

### 自定义文档解析器

```java
import dev.langchain4j.data.document.DocumentParser;

// 自定义解析器
public class CsvDocumentParser implements DocumentParser {
    @Override
    public List<Document> parse(InputStream inputStream) {
        // 解析 CSV 文件的逻辑
        // ...
        return documents;
    }
}

// 使用自定义解析器加载文档
DocumentParser parser = new CsvDocumentParser();
List<Document> documents = FileSystemDocumentLoader.loadDocuments(
        Path.of("/path/to/csv"),
        pathMatcher,
        parser
);
```


## 企业级最佳实践

### 1. API 密钥管理

```java
// 错误：硬编码API密钥
// String apiKey = "sk-xxxxxx";  // 绝对不要这样做！

// 正确：使用环境变量
String apiKey = System.getenv("OPENAI_API_KEY");

// 更好：Spring Boot 配置文件 + 加密
// application.yml 中使用 ${OPENAI_API_KEY} 引用环境变量
// 或使用 Spring Cloud Config Server / Vault 管理密钥
```

### 2. 请求重试和超时

```java
ChatLanguageModel model = OpenAiChatModel.builder()
        .apiKey(apiKey)
        .modelName("gpt-4o-mini")
        .timeout(Duration.ofSeconds(60))            // 请求超时
        .maxRetries(3)                               // 最大重试次数
        .temperature(0.7)                             // 控制创造性
        .topP(1.0)                                    // 核采样
        .maxTokens(4096)                              // 最大输出token数
        .build();
```

### 3. 成本控制

```java
// 监控每次请求的 token 使用量
ChatResponse response = model.chat(request);
TokenUsage usage = response.tokenUsage();
log.info("本次请求消耗: 输入{} tokens, 输出{} tokens, 总计{} tokens",
        usage.inputTokenCount(), 
        usage.outputTokenCount(), 
        usage.totalTokenCount());

// 设置合理的 maxTokens 限制输出长度
// 使用合适的模型：简单任务用 gpt-4o-mini，复杂任务用 gpt-4o
// 优化提示词：简洁明确的提示词可以减少 token 消耗
```

### 4. 幻觉控制

```java
@SystemMessage("""
    你是一个专业的知识助手。请遵循以下规则：
    1. 只基于提供的上下文信息回答问题
    2. 如果上下文中没有相关信息，请明确回答"我没有找到相关信息"
    3. 不要编造或推测任何信息
    4. 如果不确定，请说明不确定的部分
    """)
String chat(String message);
```

### 5. 输入输出护栏（Guardrails）

```java
// 输入护栏：过滤敏感信息
public class InputGuardrail {
    
    private static final List<String> SENSITIVE_PATTERNS = List.of(
            "密码", "身份证号", "银行卡号"
    );
    
    public String validate(String input) {
        for (String pattern : SENSITIVE_PATTERNS) {
            if (input.contains(pattern)) {
                return "您的输入包含敏感信息，请移除后重试";
            }
        }
        return input;
    }
}

// 输出护栏：验证输出格式和内容
public class OutputGuardrail {
    
    public String validate(String output) {
        // 检查是否包含不当内容
        // 检查输出格式是否合法
        // 检查输出长度是否合理
        return output;
    }
}
```

### 6. 异步处理

```java
@Service
public class AiService {
    
    private final Assistant assistant;
    private final ExecutorService executor;
    
    public CompletableFuture<String> chatAsync(String message) {
        return CompletableFuture.supplyAsync(() -> assistant.chat(message), executor);
    }
}
```

### 7. 缓存策略

```java
// 对相同问题的回答进行缓存
@Configuration
public class AiCacheConfig {
    
    @Bean
    public Cache<String, String> aiResponseCache() {
        return Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofHours(1))
                .build();
    }
}
```

### 8. 生产环境检查清单

| 检查项 | 说明 |
|--------|------|
| API 密钥安全 | 使用环境变量或密钥管理服务，禁止硬编码 |
| 请求超时 | 设置合理的超时时间，避免长时间阻塞 |
| 重试策略 | 配置合理的重试次数和间隔 |
| Token 监控 | 监控每次请求的 token 消耗，控制成本 |
| 错误处理 | 捕获并优雅处理 LLM API 错误 |
| 内容安全 | 过滤敏感输入，验证输出内容 |
| 聊天记忆持久化 | 避免服务重启导致对话丢失 |
| 速率限制 | 控制请求频率，避免超出 API 配额 |
| 日志记录 | 记录请求和响应用于调试和审计 |
| 降级方案 | LLM 不可用时的备选方案 |

### 9. 企业级应用场景汇总

以下是 LangChain4j 在企业中的典型应用场景及实现要点：

| 应用场景 | 核心技术 | 实现复杂度 | 业务价值 |
|---------|---------|-----------|---------|
| 智能客服 | AI Services + Tools + Memory | 中 | 降低60%人工客服工作量 |
| 知识库问答 | RAG + EmbeddingStore | 中 | 信息检索效率提升10倍 |
| 文档智能审核 | 结构化输出 + Agent | 中高 | 审核效率提升5倍 |
| 简历筛选 | 结构化输出 + Agent | 中 | 招聘效率提升3倍 |
| 代码审查 | Tools + Agent工作流 | 高 | 代码质量提升30% |
| 邮件分类回复 | Tools + Agent | 中 | 邮件处理效率提升5倍 |
| 数据报表查询 | Tools + 结构化输出 | 低 | 非技术人员自助查询 |
| 合同分析 | 结构化输出 + RAG | 中 | 法务审核效率提升4倍 |
| 舆情监控 | RAG + 结构化输出 | 中 | 实时掌握品牌动态 |
| 智能排班 | Agent + Tools | 高 | 人力成本降低15% |

### 10. 降级与容错策略

生产环境中 LLM API 可能不可用，需要设计容错机制：

```java
@Service
@Slf4j
public class ResilientAiService {

    private final ChatLanguageModel primaryModel;   // 主模型（如OpenAI）
    private final ChatLanguageModel fallbackModel;   // 备用模型（如Ollama本地）
    private final Cache<String, String> responseCache;

    public String chat(String message) {
        try {
            // 1. 先查缓存
            String cached = responseCache.getIfPresent(message);
            if (cached != null) {
                log.debug("命中缓存");
                return cached;
            }

            // 2. 尝试主模型
            String response = primaryModel.chat(message);
            responseCache.put(message, response);
            return response;

        } catch (Exception e) {
            log.warn("主模型调用失败，尝试备用模型: {}", e.getMessage());

            try {
                // 3. 降级到备用模型
                return fallbackModel.chat(message);

            } catch (Exception e2) {
                log.error("备用模型也失败: {}", e2.getMessage());

                // 4. 最终降级：返回预设回复
                return "抱歉，AI服务暂时不可用，请稍后重试或联系人工客服。";
            }
        }
    }
}
```

### 11. 多模型路由策略

根据任务类型自动选择最合适的模型：

```java
@Service
public class ModelRouter {

    private final ChatLanguageModel gpt4o;          // 复杂推理
    private final ChatLanguageModel gpt4oMini;      // 日常对话
    private final ChatLanguageModel localModel;    // 隐私敏感任务

    public ChatLanguageModel selectModel(String prompt, TaskType type) {
        return switch (type) {
            case COMPLEX_REASONING -> gpt4o;        // 复杂推理用最强模型
            case SIMPLE_CHAT -> gpt4oMini;           // 日常对话用轻量模型
            case PRIVACY_SENSITIVE -> localModel;    // 隐私数据用本地模型
        };
    }

    // 根据token估算自动选择
    public ChatLanguageModel autoSelect(String prompt) {
        int estimatedTokens = prompt.length() / 2;  // 粗略估算
        if (estimatedTokens > 8000) {
            return gpt4o;      // 长文本需要大上下文窗口
        } else if (containsSensitiveData(prompt)) {
            return localModel;  // 敏感数据走本地
        } else {
            return gpt4oMini;   // 普通场景用经济型
        }
    }
}
```


## 常见问题与踩坑

### 1. 模型选择问题

```
Q: 该选择哪个模型？
A: 根据场景选择：
   - 简单对话/文本生成：gpt-4o-mini 或通义千问-turbo（低成本）
   - 复杂推理/代码生成：gpt-4o 或 Claude-3.5-Sonnet（高质量）
   - 本地部署/隐私敏感：Ollama + llama3.1（免费+离线）
   - 国内合规要求：通义千问/智谱GLM/百度千帆
```

### 2. Token 限制问题

```
Q: 对话太长导致超出 token 限制怎么办？
A: 
   - 使用 TokenWindowChatMemory 自动管理上下文窗口
   - 设置合理的 maxTokens 和 maxMessages
   - 对长文档使用 RAG 而非将全文放入上下文
   - 对历史消息进行摘要压缩
```

### 3. 工具调用失败

```
Q: LLM 没有调用预期的工具怎么办？
A:
   - 检查工具描述是否清晰明确
   - 确认使用的模型支持工具调用
   - 在系统提示中明确指示何时使用工具
   - 简化工具参数，避免过于复杂
   - 添加更多示例引导 LLM 正确使用工具
```

### 4. 中文支持问题

```
Q: 中文场景下效果不好怎么办？
A:
   - 选择对中文支持好的模型（千问、GLM、GPT-4o）
   - 在系统提示中明确要求使用中文回答
   - 优化中文提示词，确保意图清晰
   - 使用中文友好的嵌入模型
```

### 5. 流式响应中断

```
Q: 流式响应中途出错怎么办？
A:
   - 实现 onError 回调，记录错误日志
   - 设置重试机制
   - 在前端实现断点续传
   - 检查网络连接稳定性
```


## 总结

LangChain4j 为 Java 开发者提供了一个全面、灵活的 LLM 应用开发框架。从简单的聊天到复杂的 RAG 系统，从单一 Agent 到多 Agent 编排，它都提供了完善的解决方案。

### 学习路径建议

1. **入门阶段**：掌握 ChatLanguageModel + AI 服务 + 聊天记忆
   - 实战目标：构建一个简单的多轮对话聊天机器人
   - 推荐练习：使用 Ollama 本地模型跑通第一个对话
2. **进阶阶段**：学习结构化输出 + 工具调用 + 流式响应
   - 实战目标：构建一个带工具调用的智能客服助手
   - 推荐练习：实现订单查询 + 流式响应 + Redis 记忆持久化
3. **高级阶段**：深入 RAG 管道 + Agent 编排 + Spring Boot 集成
   - 实战目标：构建一个企业级知识库问答系统
   - 推荐练习：实现 PDF 文档摄入 + 向量检索 + 问答闭环
4. **生产阶段**：关注可观察性 + 安全护栏 + 成本控制 + 高可用架构
   - 实战目标：将 AI 功能集成到现有业务系统
   - 推荐练习：实现多模型路由 + 降级策略 + 监控告警

### 实战项目推荐

| 项目 | 难度 | 涉及知识点 | 学习收获 |
|------|------|-----------|----------|
| 个人AI助手 | ⭐ | AI Services + Memory + Streaming | 掌握基础对话能力 |
| 智能客服系统 | ⭐⭐ | Tools + Memory + SSE | 掌握工具调用和流式输出 |
| 知识库问答 | ⭐⭐⭐ | RAG + Embedding + 分割策略 | 掌握 RAG 全流程 |
| 简历筛选系统 | ⭐⭐⭐ | 结构化输出 + Agent | 掌握信息抽取和 Agent |
| 代码审查助手 | ⭐⭐⭐⭐ | Agent工作流 + Tools | 掌握多 Agent 协作 |
| 企业级智能客服 | ⭐⭐⭐⭐⭐ | 全部知识点 | 掌握生产级架构设计 |

### 相关资源

- 官方文档：https://docs.langchain4j.info/
- GitHub 仓库：https://github.com/langchain4j/langchain4j
- 中文社区文档：https://langchain4j.cn/
- 示例代码：https://github.com/langchain4j/langchain4j-examples
- Spring Boot 集成：https://docs.langchain4j.info/tutorials/spring-boot-integration
- Agent 编排示例：https://github.com/yjmyzz/agentic_tutorial_with_langchain4j
- Microsoft LangChain4j 入门课程：https://github.com/microsoft/LangChain4j-for-Beginners

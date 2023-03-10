---
layout: post
title: "springcloud限流sentinel"
categories: springcloud
tags: springcloud gateway
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}


## 简介

Sentinel：面向分布式服务架构的流量控制组件，主要以流量为切入点，从限流、流量整形、熔断降级、系统负载保护、热点防护等多个维度来帮助开发者保障微服务的稳定性。

https://sentinelguard.io/zh-cn/docs/introduction.html

特征

- **丰富的应用场景。** 支撑阿里的双十一核心场景，如秒杀、消息削峰填谷、集群流量控制、实时熔断下游不可用。
- **完备的实时监控。** 可以看到接入应用的单台机器秒级数据，以及集群的汇总情况。
- **广泛的开源生态。** Spring Cloud、Dubbo、gRPC 都可以接入 Sentinel。
- **完善的 SPI 扩展点。** 实现扩展接口来快速定制逻辑。

组成

- 核心库（Java 客户端）不依赖任何框架/库，能在所有的 Java 运行时环境运行，且对 Spring Cloud、Dubbo 等框架有较好的支持。
- 控制台（Dashboard）基于 Spring Boot 开发，打包后可以直接运行，不需要额外的 Tomcat 等应用容器。

优势

![Hystix 和 Sentinel 对比总结](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202303091652935.png)





## 实现接口限流

sentinel-dashboard不像Nacos的服务端那样提供了外置的配置文件，比较容易修改参数。不过不要紧，由于sentinel-dashboard是一个标准的spring boot应用，所以如果要自定义端口号等内容的话，可以通过在启动命令中增加参数来调整，比如：`-Dserver.port=8888`。

默认情况下，sentinel-dashboard以8080端口启动，所以可以通过访问：`localhost:8080`来验证是否已经启动成功

默认用户名和密码都是`sentinel`。对于用户登录的相关配置可以在启动命令中增加下面的参数来进行配置：

- `-Dsentinel.dashboard.auth.username=sentinel`: 用于指定控制台的登录用户名为 sentinel；
- `-Dsentinel.dashboard.auth.password=123456`: 用于指定控制台的登录密码为 123456；如果省略这两个参数，默认用户和密码均为 sentinel
- `-Dserver.servlet.session.timeout=7200`: 用于指定 Spring Boot 服务端 session 的过期时间，如 7200 表示 7200 秒；60m 表示 60 分钟，默认为 30 分钟；



整合sentinel

在Spring Cloud应用的`pom.xml`中引入Spring Cloud Alibaba的Sentinel模块

```xml
		<dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
    </dependency>
```



在Spring Cloud应用中通过`spring.cloud.sentinel.transport.dashboard`参数配置sentinel dashboard的访问地址

```properties
spring.application.name=alibaba-sentinel-rate-limiting
server.port=8001

# sentinel dashboard address
spring.cloud.sentinel.transport.dashboard=localhost:8080
```



创建应用主类，并提供一个rest接口

```java
@SpringBootApplication
public class TestApplication {

    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }

    @Slf4j
    @RestController
    static class TestController {

        @GetMapping("/hello")
        public String hello() {
            return "didispace.com";
        }

    }

}
```



启动应用，然后通过postman或者curl访问几下`localhost:8001/hello`接口

此时，在上一节启动的Sentinel Dashboard中就可以当前我们启动的`alibaba-sentinel-rate-limiting`这个服务以及接口调用的实时监控了

![upload successful](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202303091819431.png)



我们在`alibaba-sentinel-rate-limiting`服务下，点击`簇点链路`菜单

其中`/hello`接口，就是我们上一节中实现并调用过的接口。通过点击`流控`按钮，来为该接口设置限流规则

这里做一个最简单的配置：

- 阈值类型选择：QPS
- 单机阈值：2

综合起来的配置效果就是，该接口的限流策略是每秒最多允许2个请求进入。



## 使用nacos存储规则

Sentinel自身就支持了多种不同的数据源来持久化规则配置，目前包括以下几种方式：

- 文件配置
- Nacos配置
- ZooKeeper配置
- Apollo配置



先把`Nacos`和`Sentinel Dashboard`启动起来。

在Spring Cloud应用的`pom.xml`中引入Spring Cloud Alibaba的Sentinel模块和Nacos存储扩展

```xml
		<dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba.csp</groupId>
        <artifactId>sentinel-datasource-nacos</artifactId>
        <version>1.5.2</version>
    </dependency>
```



在Spring Cloud应用中添加配置信息

```properties
spring.application.name=alibaba-sentinel-datasource-nacos
server.port=8003

# sentinel dashboard
spring.cloud.sentinel.transport.dashboard=localhost:8080

# sentinel datasource nacos ：http://blog.didispace.com/spring-cloud-alibaba-sentinel-2-1/
spring.cloud.sentinel.datasource.ds.nacos.server-addr=localhost:8848
spring.cloud.sentinel.datasource.ds.nacos.dataId=${spring.application.name}-sentinel
spring.cloud.sentinel.datasource.ds.nacos.groupId=DEFAULT_GROUP
spring.cloud.sentinel.datasource.ds.nacos.rule-type=flow
```



创建应用主类，并提供一个rest接口

```java
@SpringBootApplication
public class TestApplication {

    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }

    @Slf4j
    @RestController
    static class TestController {

        @GetMapping("/hello")
        public String hello() {
            return "didispace.com";
        }

    }

}
```



Nacos中创建限流规则的配置

![upload successful](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202303091838076.png)



此时，在Sentinel Dashboard中就可以看到当前我们启动的`alibaba-sentinel-datasource-nacos`服务。点击左侧菜单中的流控规则，可以看到已经存在一条记录了



## 修改配置同步nacos

在`com.alibaba.csp.sentinel.dashboard.rule`包下新建一个nacos包，用来编写针对Nacos的扩展实现。

创建Nacos的配置类

```java
@Configuration
public class NacosConfig {

    @Bean
    public Converter<List<FlowRuleEntity>, String> flowRuleEntityEncoder() {
        return JSON::toJSONString;
    }

    @Bean
    public Converter<String, List<FlowRuleEntity>> flowRuleEntityDecoder() {
        return s -> JSON.parseArray(s, FlowRuleEntity.class);
    }

    @Bean
    public ConfigService nacosConfigService() throws Exception {
        Properties properties = new Properties();
        properties.put(PropertyKeyConst.SERVER_ADDR, "localhost");
        return ConfigFactory.createConfigService(properties);
    }
}
```



实现Nacos的配置拉取

```java
@Component("flowRuleNacosProvider")
public class FlowRuleNacosProvider implements DynamicRuleProvider<List<FlowRuleEntity>> {

    @Autowired
    private ConfigService configService;
    @Autowired
    private Converter<String, List<FlowRuleEntity>> converter;

    public static final String FLOW_DATA_ID_POSTFIX = "-sentinel";
    public static final String GROUP_ID = "DEFAULT_GROUP";

    @Override
    public List<FlowRuleEntity> getRules(String appName) throws Exception {
        String rules = configService.getConfig(appName + FLOW_DATA_ID_POSTFIX, GROUP_ID, 3000);
        if (StringUtil.isEmpty(rules)) {
            return new ArrayList<>();
        }
        return converter.convert(rules);
    }
}
```



实现Nacos的配置推送。

```java
@Component("flowRuleNacosPublisher")
public class FlowRuleNacosPublisher implements DynamicRulePublisher<List<FlowRuleEntity>> {

    @Autowired
    private ConfigService configService;
    @Autowired
    private Converter<List<FlowRuleEntity>, String> converter;

    public static final String FLOW_DATA_ID_POSTFIX = "-sentinel";
    public static final String GROUP_ID = "DEFAULT_GROUP";

    @Override
    public void publish(String app, List<FlowRuleEntity> rules) throws Exception {
        AssertUtil.notEmpty(app, "app name cannot be empty");
        if (rules == null) {
            return;
        }
        configService.publishConfig(app + FLOW_DATA_ID_POSTFIX, GROUP_ID, converter.convert(rules));
    }
}
```



修改`com.alibaba.csp.sentinel.dashboard.controller.v2.FlowControllerV2`中`DynamicRuleProvider`和`DynamicRulePublisher`注入的Bean

```java
@Autowired
@Qualifier("flowRuleNacosProvider")
private DynamicRuleProvider<List<FlowRuleEntity>> ruleProvider;
@Autowired
@Qualifier("flowRuleNacosPublisher")
private DynamicRulePublisher<List<FlowRuleEntity>> rulePublisher;
```





整理自：http://www.passjava.cn/#/02.SpringCloud/
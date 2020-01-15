---
layout: post
title: "springsecurity分布式"
categories: springsecurity
tags: 安全框架
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 分布式系统

- 具有分布式架构的系统叫分布式系统，分布式系统的运行通常依赖网络，它将单体结构的系统分为若干服务，服务之间通过网络交互来完成用户的业务处理，当前流行的微服务架构就是分布式系统架构，如下图：

![](https://i.postimg.cc/23p3W1WL/image.png)

- 分布式系统具体如下基本特点：
  - 1、分布性：每个部分都可以独立部署，服务之间交互通过网络进行通信，比如：订单服务、商品服务。
  - 2、伸缩性：每个部分都可以集群方式部署，并可针对部分结点进行硬件及软件扩容，具有一定的伸缩能力。
  - 3、共享性：每个部分都可以作为共享资源对外提供服务，多个部分可能有操作共享资源的情况。
  - 4、开放性：每个部分根据需求都可以对外发布共享资源的访问接口，并可允许第三方系统访问。

#### 分布式认证

- 分布式系统的每个服务都会有认证、授权的需求，如果每个服务都实现一套认证授权逻辑会非常冗余，考虑分布式系统共享性的特点，需要由独立的认证服务处理系统认证授权的请求；考虑分布式系统开放性的特点，不仅对系统内部服务提供认证，对第三方系统也要提供认证。
- **统一认证授权**：提供独立的认证服务，统一处理认证授权。无论是不同类型的用户，还是不同种类的客户端(web端，H5、APP)，均采用一致的认证、权限、会话机制，实现统一认证授权。要实现统一则认证方式必须可扩展，支持各种认证需求，比如：用户名密码认证、短信验证码、二维码、人脸识别等认证方式，并可以非常灵活的切换。
- **应用接入认证**：应提供扩展和开放能力，提供安全的系统对接机制，并可开放部分API给接入第三方使用，一方应用（内部 系统服务）和三方应用（第三方应用）均采用统一机制接入。

#### 选型分析

- 1、**基于session的认证方式**：在分布式的环境下，基于session的认证会出现一个问题，每个应用服务都需要在session中存储用户身份信息，通过负载均衡将本地的请求分配到另一个应用服务需要将session信息带过去，否则会重新认证。

![](https://i.postimg.cc/k55jzGVb/image.png)

- 这个时候，通常的做法有下面几种：
  - **Session复制**：多台应用服务器之间同步session，使session保持一致，对外透明。
  - **Session黏贴**：当用户访问集群中某台服务器后，强制指定后续所有请求均落到此机器上。
  - **Session集中存储**：将Session存入分布式缓存中，所有服务器应用实例统一从分布式缓存中存取Session。
- 总体来讲，基于session认证的认证方式，可以更好的在服务端对会话进行控制，且安全性较高。但是，session机制方式基于cookie，在复杂多样的移动客户端上不能有效的使用，并且无法跨域，另外随着系统的扩展需提高session的复制、黏贴及存储的容错性。



- **2、基于token的认证方式**：基于token的认证方式，服务端不用存储认证数据，易维护扩展性强， 客户端可以把token 存在任意地方，并且可以实现web和app统一认证机制。其缺点也很明显，token由于自包含信息，因此一般数据量较大，而且每次请求都需要传递，因此比较占带宽。另外，token的签名验签操作也会给cpu带来额外的处理负担。

![](https://i.postimg.cc/hjkpX02L/image.png)



#### 技术方案

- 根据 选型的分析，决定采用基于token的认证方式，它的优点是：
  - 1、适合统一认证的机制，客户端、一方应用、三方应用都遵循一致的认证机制。
  - 2、token认证方式对第三方应用接入更适合，因为它更开放，可使用当前有流行的开放协议Oauth2.0、JWT等。
  - 3、一般情况服务端无需存储会话信息，减轻了服务端的压力。

![](https://i.postimg.cc/KvFDCjw8/image.png)

- 流程描述：
  - （1）用户通过接入方（应用）登录，接入方采取OAuth2.0方式在统一认证服务(UAA)中认证。
  - （2）认证服务(UAA)调用验证该用户的身份是否合法，并获取用户权限信息。
  - （3）认证服务(UAA)获取接入方权限信息，并验证接入方是否合法。
  - （4）若登录用户以及接入方都合法，认证服务生成jwt令牌返回给接入方，其中jwt中包含了用户权限及接入方权限。
  - （5）后续，接入方携带jwt令牌对API网关内的微服务资源进行访问。
  - （6）API网关对令牌解析、并验证接入方的权限是否能够访问本次请求的微服务。
  - （7）如果接入方的权限没问题，API网关将原请求header中附加解析后的明文Token，并将请求转发至微服务。
  - （8）微服务收到请求，明文token中包含登录用户的身份和权限信息。因此后续微服务自己可以干两件事：1，用户授权拦截（看当前用户是否有权访问该资源）2，将用户信息存储进当前线程上下文（有利于后续业务逻辑随时获取当前用户信息）
- **统一认证服务(UAA)**： 它承载了OAuth2.0接入方认证、登入用户的认证、授权以及生成令牌的职责，完成实际的用户认证、授权功能。
- **API网关**： 作为系统的唯一入口，API网关为接入方提供定制的API集合，它可能还具有其它职责，如身份验证、监控、负载均衡、缓存等。API网关方式的核心要点是，所有的接入方和消费端都通过统一的网关接入微服务，在网关层处理所有的非业务功能。



### OAuth2.0

#### 介绍

- OAuth（开放授权）是一个开放标准，允许用户授权第三方应用访问他们存储在另外的服务提供者上的信息，而不需要将用户名和密码提供给第三方应用或分享他们数据的所有内容。

- Oauth协议：https://tools.ietf.org/html/rfc6749

- Oauth2认证的例子：

  - 1、**客户端请求第三方授权**：用户进入黑马程序的登录页面，点击微信的图标以微信账号登录系统，用户是自己在微信里信息的资源拥有者。点击“微信”出现一个二维码，此时用户扫描二维码，开始给黑马程序员授权。
  - 2、**资源拥有者同意给客户端授权**：资源拥有者扫描二维码表示资源拥有者同意给客户端授权，微信会对资源拥有者的身份进行验证， 验证通过后，微信会询问用户是否给授权黑马程序员访问自己的微信数据，用户点击“确认登录”表示同意授权，微信认证服务器会颁发一个授权码，并重定向到黑马程序员的网站。
  - 3、**客户端获取到授权码，请求认证服务器申请令牌**：此过程用户看不到，客户端应用程序请求认证服务器，请求携带授权码。
  - 4、**认证服务器向客户端响应令牌**：微信认证服务器验证了客户端请求的授权码，如果合法则给客户端颁发令牌，令牌是客户端访问资源的通行证。此交互过程用户看不到，当客户端拿到令牌后，用户在黑马程序员看到已经登录成功。
  - 5、**客户端请求资源服务器的资源**：客户端携带令牌访问资源服务器的资源。黑马程序员网站携带令牌请求访问微信服务器获取用户的基本信息。
  - 6、**资源服务器返回受保护资源**：资源服务器校验令牌的合法性，如果合法则向用户响应资源信息内容。

  ![](https://i.postimg.cc/L8ngPm4j/image.png)

- OAuth2.0认证流程：

  ![](https://i.postimg.cc/3Nz5bjp8/image.png)

  - 1、**客户端**：本身不存储资源，需要通过资源拥有者的授权去请求资源服务器的资源，比如：Android客户端、Web客户端（浏览器端）、微信客户端等。
  - 2、**资源拥有者**：通常为用户，也可以是应用程序，即该资源的拥有者。
  - 3、**授权服务器（也称认证服务器）**：用于服务提供商对资源拥有的身份进行认证、对访问资源进行授权，认证成功后会给客户端发放令牌（access_token），作为客户端访问资源服务器的凭据。本例为微信的认证服务器。
  - 4、资源服务器：存储资源的服务器，本例子为微信存储的用户信息。

- 现在还有一个问题，服务提供商能允许随便一个**客户端**就接入到它的**授权服务器**吗？答案是否定的，服务提供商会给准入的接入方一个身份，用于接入时的凭据:

  **client_id**：客户端标识 

  **client_secret**：客户端秘钥

  因此，准确来说，**授权服务器**对两种OAuth2.0中的两个角色进行认证授权，分别是**资源拥有者**、**客户端**。

### Spring Cloud Security OAuth2

#### 环境介绍

-  Spring-Security-OAuth2是对OAuth2的一种实现，并且跟我们之前学习的Spring Security相辅相成，与Spring Cloud体系的集成也非常便利

- OAuth2.0的服务提供方涵盖两个服务，即授权服务 (Authorization Server，也叫认证服务) 和资源服务 (Resource Server)，使用 Spring Security OAuth2 的时候你可以选择把它们在同一个应用程序中实现，也可以选择建立使用同一个授权服务的多个资源服务。

- **授权服务 (Authorization Server）**应包含对接入端以及登入用户的合法性进行验证并颁发token等功能，对令牌的请求端点由 Spring MVC 控制器进行实现，下面是配置一个认证服务必须要实现的endpoints：

  - **AuthorizationEndpoint** 服务于认证请求。默认 URL： `/oauth/authorize`。
  - **TokenEndpoint** 服务于访问令牌的请求。默认 URL： `/oauth/token`。

- **资源服务 (Resource Server)**，应包含对资源的保护功能，对非法请求进行拦截，对请求中token进行解析鉴权等，下面的过滤器用于实现 OAuth 2.0 资源服务：

  - OAuth2AuthenticationProcessingFilter用来对请求给出的身份令牌解析鉴权。

- 本案例分别创建uaa授权服务（也可叫认证服务）和order订单资源服务。

  ![](https://i.postimg.cc/C59VdyFH/image.png)

  - 1、客户端请求UAA授权服务进行认证。
  - 2、认证通过后由UAA颁发令牌。
  - 3、客户端携带令牌Token请求资源服务。
  - 4、资源服务校验令牌的合法性，合法即返回资源信息。



#### 搭建父工程

- 创建maven工程作为父工程，依赖如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.pbteach.security</groupId>
    <artifactId>distributed-security</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.3.RELEASE</version>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
    </properties>

    <dependencyManagement>
        <dependencies>

            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Greenwich.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>


            <dependency>
                <groupId>javax.servlet</groupId>
                <artifactId>javax.servlet-api</artifactId>
                <version>3.1.0</version>
                <scope>provided</scope>
            </dependency>

            <dependency>
                <groupId>javax.interceptor</groupId>
                <artifactId>javax.interceptor-api</artifactId>
                <version>1.2</version>
            </dependency>

            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>fastjson</artifactId>
                <version>1.2.47</version>
            </dependency>

            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.0</version>
            </dependency>

            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>5.1.47</version>
            </dependency>


            <dependency>
                <groupId>org.springframework.security</groupId>
                <artifactId>spring-security-jwt</artifactId>
                <version>1.0.10.RELEASE</version>
            </dependency>


            <dependency>
                <groupId>org.springframework.security.oauth.boot</groupId>
                <artifactId>spring-security-oauth2-autoconfigure</artifactId>
                <version>2.1.3.RELEASE</version>
            </dependency>


        </dependencies>
    </dependencyManagement>



    <build>
        <finalName>${project.name}</finalName>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
                <includes>
                    <include>**/*</include>
                </includes>
            </resource>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
            </resource>
        </resources>
        <plugins>
            <!--<plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>-->

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>

            <plugin>
                <artifactId>maven-resources-plugin</artifactId>
                <configuration>
                    <encoding>utf-8</encoding>
                    <useDefaultDelimiters>true</useDefaultDelimiters>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```



#### 创建UAA授权服务工程

- 1、在父工程上创建distributed-security-uaa的model

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>distributed-security</artifactId>
        <groupId>com.pbteach.security</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>distributed-security-uaa</artifactId>
    <dependencies>

       <!--<dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>-->

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>

        <dependency>
            <groupId>com.netflix.hystrix</groupId>
            <artifactId>hystrix-javanica</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.retry</groupId>
            <artifactId>spring-retry</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>


        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-freemarker</artifactId>
        </dependency>


        <dependency>
            <groupId>org.springframework.data</groupId>
            <artifactId>spring-data-commons</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-security</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-oauth2</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-jwt</artifactId>
        </dependency>

        <dependency>
            <groupId>javax.interceptor</groupId>
            <artifactId>javax.interceptor-api</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>


        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>


    </dependencies>

</project>

```

![](https://i.postimg.cc/13SBpWY9/image.png)

- 2、启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableHystrix
@EnableFeignClients(basePackages = {"com.pbteach.security.distributed.uaa"})
public class UAAServer {
   public static void main(String[] args) {
      SpringApplication.run(UAAServer.class, args);
   }
}
```

- 3、配置文件:在resources下创建application.properties

```properties
spring.application.name=uaa-service
server.port=53020
spring.main.allow-bean-definition-overriding = true

logging.level.root = debug
logging.level.org.springframework.web = info

spring.http.encoding.enabled = true
spring.http.encoding.charset = UTF-8
spring.http.encoding.force = true
server.tomcat.remote_ip_header = x-forwarded-for
server.tomcat.protocol_header = x-forwarded-proto
server.use-forward-headers = true
server.servlet.context-path = /uaa

spring.freemarker.enabled = true
spring.freemarker.suffix = .html
spring.freemarker.request-context-attribute = rc
spring.freemarker.content-type = text/html
spring.freemarker.charset = UTF-8
spring.mvc.throw-exception-if-no-handler-found = true
spring.resources.add-mappings = false

spring.datasource.url = jdbc:mysql://localhost:3306/user_db?useUnicode=true
spring.datasource.username = root
spring.datasource.password = mysql
spring.datasource.driver-class-name = com.mysql.jdbc.Driver

#eureka.client.serviceUrl.defaultZone = http://localhost:53000/eureka/
#eureka.instance.preferIpAddress = true
#eureka.instance.instance-id = ${spring.application.name}:${spring.cloud.client.ip-address}:${spring.application.instance_id:${server.port}}
management.endpoints.web.exposure.include = refresh,health,info,env

feign.hystrix.enabled = true
feign.compression.request.enabled = true
feign.compression.request.mime-types[0] = text/xml
feign.compression.request.mime-types[1] = application/xml
feign.compression.request.mime-types[2] = application/json
feign.compression.request.min-request-size = 2048
feign.compression.response.enabled = true
```



#### 创建Order资源服务工程

- 本工程为Order订单服务工程，访问本工程的资源需要认证通过。
- 本工程的目的主要是测试认证授权的功能，所以不涉及订单管理相关业务。
- 1、在父工程上创建distributed-security-order的model

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>distributed-security</artifactId>
        <groupId>com.pbteach.security</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>distributed-security-order</artifactId>
    <dependencies>

        <!--<dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>-->

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-oauth2</artifactId>
        </dependency>
        <dependency>
            <groupId>javax.interceptor</groupId>
            <artifactId>javax.interceptor-api</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>


    </dependencies>

</project>

```

![](https://i.postimg.cc/CLgktRC7/image.png)

- 3、配置文件:在resources中创建application.properties

```properties
spring.application.name=order-service
server.port=53021
spring.main.allow-bean-definition-overriding = true

logging.level.root = debug
logging.level.org.springframework.web = info
spring.http.encoding.enabled = true
spring.http.encoding.charset = UTF-8
spring.http.encoding.force = true
server.tomcat.remote_ip_header = x-forwarded-for
server.tomcat.protocol_header = x-forwarded-proto
server.use-forward-headers = true
server.servlet.context-path = /order


spring.freemarker.enabled = true
spring.freemarker.suffix = .html
spring.freemarker.request-context-attribute = rc
spring.freemarker.content-type = text/html
spring.freemarker.charset = UTF-8
spring.mvc.throw-exception-if-no-handler-found = true
spring.resources.add-mappings = false


#eureka.client.serviceUrl.defaultZone = http://localhost:53000/eureka/
#eureka.instance.preferIpAddress = true
#eureka.instance.instance-id = ${spring.application.name}:${spring.cloud.client.ip-address}:${spring.application.instance_id:${server.port}}
management.endpoints.web.exposure.include = refresh,health,info,env

feign.hystrix.enabled = true
feign.compression.request.enabled = true
feign.compression.request.mime-types[0] = text/xml
feign.compression.request.mime-types[1] = application/xml
feign.compression.request.mime-types[2] = application/json
feign.compression.request.min-request-size = 2048
feign.compression.response.enabled = true
```



#### 授权服务器配置

##### EnableAuthorizationServer

- 可以用 @EnableAuthorizationServer 注解并继承AuthorizationServerConfigurerAdapter来配置OAuth2.0 授权服务器。
- 在order项目的Config包下创建AuthorizationServer：

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServer extends
      AuthorizationServerConfigurerAdapter {
        //略...
 }
```

-  AuthorizationServerConfigurerAdapter要求配置以下几个类，这几个类是由Spring创建的独立的配置对象，它们会被Spring传入AuthorizationServerConfigurer中进行配置。

```java
public class AuthorizationServerConfigurerAdapter implements AuthorizationServerConfigurer {
    public AuthorizationServerConfigurerAdapter() {}
    
    //AuthorizationServerSecurityConfigurer：用来配置令牌端点的安全约束.
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {}
    
    /*
    ClientDetailsServiceConfigurer：用来配置客户端详情服务（ClientDetailsService），客户端详情信息在这里进行初始化，你能够把客户端详情信息写死在这里或者是通过数据库来存储调取详情信息。
    */
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {}
    
    /*
    AuthorizationServerEndpointsConfigurer：用来配置令牌（token）的访问端点和令牌服务(token services)。
    */
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {}
}
```

##### 配置客户端详细信息

-  ClientDetailsServiceConfigurer 能够使用内存或者JDBC来实现客户端详情服务（ClientDetailsService），ClientDetailsService负责查找ClientDetails，而ClientDetails有几个重要的属性如下列表：
  - clientId：（必须的）用来标识客户的Id。
  - secret：（需要值得信任的客户端）客户端安全码，如果有的话。
  - scope：用来限制客户端的访问范围，如果为空（默认）的话，那么客户端拥有全部的访问范围。
  - authorizedGrantTypes：此客户端可以使用的授权类型，默认为空。
  - authorities：此客户端可以使用的权限（基于Spring Security authorities）。
- 客户端详情（Client Details）能够在应用程序运行的时候进行更新，可以通过访问底层的存储服务（例如将客户端详情存储在一个关系数据库的表中，就可以使用 JdbcClientDetailsService）或者通过自己实现ClientRegistrationService接口（同时你也可以实现 ClientDetailsService 接口）来进行管理。
- 我们暂时使用内存方式存储客户端详情信息，AuthorizationServer配置如下:

```java
//配置客户端详细信息
@Override
public void configure(ClientDetailsServiceConfigurer clients)
    throws Exception {
    //		clients.withClientDetails(clientDetailsService);
    //暂时使用内存存储方式
    clients.inMemory()// 使用in-memory存储
        .withClient("c1")// client_id
        .secret(new BCryptPasswordEncoder().encode("secret"))//客户端秘钥
        .resourceIds("res1")//客户端可访问的资源列表
        .authorizedGrantTypes("authorization_code", "password","client_credentials","implicit","refresh_token")// 该client允许的授权类型authorization_code,password,refresh_token,implicit,client_credentials
        .scopes("all")// 允许的授权范围
        .autoApprove(false)//false 跳转到授权页面。true 直接颁发令牌
        //加上验证回调地址
        .redirectUris("http://www.baidu.com");
}
```



##### 管理令牌

- AuthorizationServerTokenServices 接口定义了一些操作使得你可以对令牌进行一些必要的管理，令牌可以被用来加载身份信息，里面包含了这个令牌的相关权限。
-  自己可以创建 AuthorizationServerTokenServices 这个接口的实现，则需要继承 DefaultTokenServices 这个类，里面包含了一些有用实现，你可以使用它来修改令牌的格式和令牌的存储。默认的，当它尝试创建一个令牌的时候，是使用随机值来进行填充的，除了持久化令牌是委托一个 TokenStore 接口来实现以外，这个类几乎帮你做了所有的事情。并且 TokenStore 这个接口有一个默认的实现，它就是 InMemoryTokenStore ，如其命名，所有的令牌是被保存在了内存中。除了使用这个类以外，你还可以使用一些其他的预定义实现，下面有几个版本，它们都实现了TokenStore接口：
  - **InMemoryTokenStore**：这个版本的实现是被默认采用的，它可以完美的工作在单服务器上（即访问并发量压力不大的情况下，并且它在失败的时候不会进行备份），大多数的项目都可以使用这个版本的实现来进行尝试，你可以在开发的时候使用它来进行管理，因为不会被保存到磁盘中，所以更易于调试。
  - **JdbcTokenStore**：这是一个基于JDBC的实现版本，令牌会被保存进关系型数据库。使用这个版本的实现时，你可以在不同的服务器之间共享令牌信息，使用这个版本的时候请注意把”spring-jdbc”这个依赖加入到你的classpath当中。
  - **JwtTokenStore**：这个版本的全称是 JSON Web Token（JWT），它可以把令牌相关的数据进行编码（因此对于后端服务来说，它不需要进行存储，这将是一个重大优势），但是它有一个缺点，那就是撤销一个已经授权令牌将会非常困难，所以它通常用来处理一个生命周期较短的令牌以及撤销刷新令牌（refresh_token）。另外一个缺点就是这个令牌占用的空间会比较大，如果你加入了比较多用户凭证信息。JwtTokenStore 不会保存任何数据，但是它在转换令牌值以及授权信息方面与 DefaultTokenServices 所扮演的角色是一样的。
- 1、定义TokenConfig：在config包下定义TokenConfig，我们暂时先使用InMemoryTokenStore，生成一个普通的令牌。

```java
@Configuration
  public class TokenConfig {
	//令牌存储策略
      @Bean
      public TokenStore tokenStore() {
          //内存方式，生成普通令牌
          return new InMemoryTokenStore();
      }

  }
```

- 2、定义AuthorizationServerTokenServices：在AuthorizationServer中定义AuthorizationServerTokenServices

```java
@Autowired
private TokenStore tokenStore;

@Autowired
private ClientDetailsService clientDetailsService;
//令牌管理服务
@Bean
public AuthorizationServerTokenServices tokenService() {
    DefaultTokenServices service=new DefaultTokenServices();
    service.setClientDetailsService(clientDetailsService);//客户端信息服务
    service.setSupportRefreshToken(true);//是否产生刷新令牌
    service.setTokenStore(tokenStore);//令牌存储策略
    service.setAccessTokenValiditySeconds(7200); // 令牌默认有效期2小时
    service.setRefreshTokenValiditySeconds(259200); // 刷新令牌默认有效期3天
    return service;
}
```



##### 令牌访问端点配置

- AuthorizationServerEndpointsConfigurer 这个对象的实例可以完成令牌服务以及令牌endpoint配置。

**配置授权类型（Grant Types）**

- AuthorizationServerEndpointsConfigurer 通过设定以下属性决定支持的**授权类型（Grant Types）:**
  - **authenticationManager**：认证管理器，当你选择了资源所有者密码（password）授权类型的时候，请设置这个属性注入一个 AuthenticationManager 对象。
  - **userDetailsService**：如果你设置了这个属性的话，那说明你有一个自己的 UserDetailsService 接口的实现，或者你可以把这个东西设置到全局域上面去（例如 GlobalAuthenticationManagerConfigurer 这个配置对象），当你设置了这个之后，那么 “refresh_token” 即刷新令牌授权类型模式的流程中就会包含一个检查，用来确保这个账号是否仍然有效，假如说你禁用了这个账户的话。
  - **authorizationCodeServices**：这个属性是用来设置授权码服务的（即 AuthorizationCodeServices 的实例对象），主要用于 “authorization_code” 授权码类型模式。
  - **implicitGrantService**：这个属性用于设置隐式授权模式，用来管理隐式授权模式的状态。
  - **tokenGranter**：当你设置了这个东西（即 TokenGranter 接口实现），那么授权将会交由你来完全掌控，并且会忽略掉上面的这几个属性，这个属性一般是用作拓展用途的，即标准的四种授权模式已经满足不了你的需求的时候，才会考虑使用这个。

**配置授权端点的URL（Endpoint URLs）：**

- AuthorizationServerEndpointsConfigurer 这个配置对象有一个叫做 pathMapping() 的方法用来配置端点URL链接，它有两个参数：
  - 第一个参数：String 类型的，这个端点URL的默认链接。
  - 第二个参数：String 类型的，你要进行替代的URL链接。
- 以上的参数都将以 “/” 字符为开始的字符串，框架的默认URL链接如下列表，可以作为这个 pathMapping() 方法的第一个参数：
  - /oauth/authorize：授权端点。
  - /oauth/token：令牌端点。
  - /oauth/confirm_access：用户确认授权提交端点。
  - /oauth/error：授权服务错误信息端点。
  - /oauth/check_token：用于资源服务访问的令牌解析端点。
  - /oauth/token_key：提供公有密匙的端点，如果你使用JWT令牌的话。
- 需要注意的是授权端点这个URL应该被Spring Security保护起来只供授权用户访问.
- 在AuthorizationServer配置令牌访问端点

```java
@Autowired

private AuthorizationCodeServices authorizationCodeServices;

@Autowired
private AuthenticationManager authenticationManager;

//令牌访问端点
@Override
public void configure(AuthorizationServerEndpointsConfigurer endpoints) {

    endpoints
        .authenticationManager(authenticationManager)//密码模式需要
        .authorizationCodeServices(authorizationCodeServices)//授权码模式需要
        .tokenServices(tokenService())//令牌管理服务
        .allowedTokenEndpointRequestMethods(HttpMethod.POST);//允许post提交

}

@Bean
public AuthorizationCodeServices authorizationCodeServices() { //设置授权码模式的授权码如何存取，暂时采用内存方式
    return new InMemoryAuthorizationCodeServices();
}
```

##### 令牌端点的安全约束

- **AuthorizationServerSecurityConfigurer**：用来配置令牌端点(Token Endpoint)的安全约束，在AuthorizationServer中配置如下

```java
@Override
public void configure(AuthorizationServerSecurityConfigurer security){
   security
   .tokenKeyAccess("permitAll()")					(1)
   .checkTokenAccess("permitAll()")					(2)
   .allowFormAuthenticationForClients()				(3)
   ;
}
/*
（1）tokenkey这个endpoint当使用JwtToken且使用非对称加密时，资源服务用于获取公钥而开放的，这里指这个endpoint完全公开。
（2）checkToken这个endpoint完全公开
（3） 允许表单认证,申请令牌
*/
```



- **授权服务配置总结**：授权服务配置分成三大块，可以关联记忆。
- 既然要完成认证，它首先得知道客户端信息从哪儿读取，因此要进行客户端详情配置。
- 既然要颁发token，那必须得定义token的相关endpoint，以及token如何存取，以及客户端支持哪些类型的token。
- 既然暴露除了一些endpoint，那对这些endpoint可以定义一些安全上的约束等。



##### web安全配置

- 将Spring-Boot工程中的WebSecurityConfig拷贝到UAA工程中。

```java
@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true,prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
    //安全拦截机制（最重要）
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/r/r1").hasAnyAuthority("p1")
                .antMatchers("/login*").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
        ;

    }
}
```


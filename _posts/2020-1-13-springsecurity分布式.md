---
layout: post
title: "springsecurity分布式"
categories: 鉴权
tags: springsecurity
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 分布式系统

- 具有分布式架构的系统叫分布式系统，分布式系统的运行通常依赖网络，它将单体结构的系统分为若干服务，服务之间通过网络交互来完成用户的业务处理，当前流行的微服务架构就是分布式系统架构，如下图：

![image.png](https://i.loli.net/2020/02/22/w5Ner6XfDSOYKUz.png)

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

![image.png](https://i.loli.net/2020/02/22/WgNtHA6mMbIwGXK.png)

- 这个时候，通常的做法有下面几种：
  - **Session复制**：多台应用服务器之间同步session，使session保持一致，对外透明。
  - **Session黏贴**：当用户访问集群中某台服务器后，强制指定后续所有请求均落到此机器上。
  - **Session集中存储**：将Session存入分布式缓存中，所有服务器应用实例统一从分布式缓存中存取Session。
- 总体来讲，基于session认证的认证方式，可以更好的在服务端对会话进行控制，且安全性较高。但是，session机制方式基于cookie，在复杂多样的移动客户端上不能有效的使用，并且无法跨域，另外随着系统的扩展需提高session的复制、黏贴及存储的容错性。



- **2、基于token的认证方式**：基于token的认证方式，服务端不用存储认证数据，易维护扩展性强， 客户端可以把token 存在任意地方，并且可以实现web和app统一认证机制。其缺点也很明显，token由于自包含信息，因此一般数据量较大，而且每次请求都需要传递，因此比较占带宽。另外，token的签名验签操作也会给cpu带来额外的处理负担。

![image.png](https://i.loli.net/2020/02/22/nh6woNYavKkTGrE.png)



#### 技术方案

- 根据 选型的分析，决定采用基于token的认证方式，它的优点是：
  - 1、适合统一认证的机制，客户端、一方应用、三方应用都遵循一致的认证机制。
  - 2、token认证方式对第三方应用接入更适合，因为它更开放，可使用当前有流行的开放协议Oauth2.0、JWT等。
  - 3、一般情况服务端无需存储会话信息，减轻了服务端的压力。

![image.png](https://i.loli.net/2020/02/22/rtpwgYBR5AT8Mkv.png)

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

  ![image.png](https://i.loli.net/2020/02/22/oHWTDqQEk2vJMeF.png)

- OAuth2.0认证流程：

  ![image.png](https://i.loli.net/2020/02/22/RQbEL1jm6rIxywO.png)

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

  ![image.png](https://i.loli.net/2020/02/22/U1lKzkdnI28AgeQ.png)

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

![image.png](https://i.loli.net/2020/02/22/1vwAGsPaxFQnfIe.png)

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

![image.png](https://i.loli.net/2020/02/22/mgoAZy2UrX8wDfS.png)

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
- 在uaa项目的Config包下创建AuthorizationServer：

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
-  客户端详情（Client Details）能够在应用程序运行的时候进行更新，可以通过访问底层的存储服务（例如将客户端详情存储在一个关系数据库的表中，就可以使用 JdbcClientDetailsService）或者通过自己实现ClientRegistrationService接口（同时你也可以实现 ClientDetailsService 接口）来进行管理。
-  我们暂时使用内存方式存储客户端详情信息，AuthorizationServer配置如下:

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
- 自己可以创建 AuthorizationServerTokenServices 这个接口的实现，则需要继承 DefaultTokenServices 这个类，里面包含了一些有用实现，你可以使用它来修改令牌的格式和令牌的存储。默认的，当它尝试创建一个令牌的时候，是使用随机值来进行填充的，除了持久化令牌是委托一个 TokenStore 接口来实现以外，这个类几乎帮你做了所有的事情。并且 TokenStore 这个接口有一个默认的实现，它就是 InMemoryTokenStore ，如其命名，所有的令牌是被保存在了内存中。除了使用这个类以外，你还可以使用一些其他的预定义实现，下面有几个版本，它们都实现了TokenStore接口：
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



#### 授权码模式

![image.png](https://i.loli.net/2020/02/22/JWowy86dLm1S3PF.png)

- **（1）资源拥有者打开客户端，客户端要求资源拥有者给予授权，它将浏览器被重定向到授权服务器，重定向时会附加客户端的身份信息。如：**

  ```
  /uaa/oauth/authorize?client_id=c1&response_type=code&scope=all&redirect_uri=http://www.baidu.com
  ```

  - 参数列表如下：

  - client_id：客户端准入标识。
  - response_type：授权码模式固定为code。
  - scope：客户端权限。
  - redirect_uri：跳转uri，当授权码申请成功后会跳转到此地址，并在后边带上code参数（授权码）。

- **（2）浏览器出现向授权服务器授权页面，之后将用户同意授权。**

- **（3）授权服务器将授权码（AuthorizationCode）转经浏览器发送给client(通过redirect_uri)。**

- **（4）客户端拿着授权码向授权服务器索要访问access_token，请求如下：**

  ```
  /uaa/oauth/token?client_id=c1&client_secret=secret&grant_type=authorization_code&code=5PgfcD&redirect_uri=http://www.baidu.com
  ```

  - 参数列表如下

  - client_id：客户端准入标识。
  - client_secret：客户端秘钥。
  - grant_type：授权类型，填写authorization_code，表示授权码模式
  - code：授权码，就是刚刚获取的授权码，注意：授权码只使用一次就无效了，需要重新申请。
  - redirect_uri：申请授权码时的跳转url，一定和申请授权码时用的redirect_uri一致。

- **（5）授权服务器返回令牌(access_token)**

-  这种模式是四种模式中最安全的一种模式。一般用于client是Web服务器端应用或第三方的原生App调用资源服务的时候。因为在这种模式中access_token不会经过浏览器或移动端的App，而是直接从服务端去交换，这样就最大限度的减小了令牌泄漏的风险。



#### 简化模式

![image.png](https://i.loli.net/2020/02/22/J7wnpS6siXv4jt9.png)

- **（1）资源拥有者打开客户端，客户端要求资源拥有者给予授权，它将浏览器被重定向到授权服务器，重定向时会附加客户端的身份信息**

  ```
  /uaa/oauth/authorize?client_id=c1&response_type=token&scope=all&redirect_uri=http://www.baidu.com
  ```

  参数描述同**授权码模式** ，注意response_type=token，说明是简化模式。

- **（2）浏览器出现向授权服务器授权页面，之后将用户同意授权。**

- （**3）授权服务器将授权码将令牌（access_token）以Hash的形式存放在重定向uri的fargment中发送给浏览器。**

- fragment 主要是用来标识 URI 所标识资源里的某个资源，在 URI 的末尾通过 （#）作为 fragment 的开头，其中 # 不属于 fragment 的值。如https://domain/index#L18这个 URI 中 `L18` 就是 fragment 的值。大家只需要知道js通过响应浏览器地址栏变化的方式能获取到fragment 就行了。

- 一般来说，简化模式用于没有服务器端的第三方单页面应用，因为没有服务器端就无法接收授权码。



#### 密码模式

![image.png](https://i.loli.net/2020/02/22/ptuUb1yeXoTw7nL.png)

- **（1）资源拥有者将用户名、密码发送给客户端**

- **（2）客户端拿着资源拥有者的用户名、密码向授权服务器请求令牌（access_token）**

  ```
  /uaa/oauth/token?client_id=c1&client_secret=secret&grant_type=password&username=shangsan&password=123
  ```

  参数列表如下：

  - client_id：客户端准入标识。
  - client_secret：客户端秘钥。
  - grant_type：授权类型，填写password表示密码模式
  - username：资源拥有者用户名。
  - password：资源拥有者密码。

- **（3）授权服务器将令牌（access_token）发送给client**

-  这种模式十分简单，但是却意味着直接将用户敏感信息泄漏给了client，因此这就说明这种模式只能用于client是我们自己开发的情况下。因此密码模式一般用于我们自己开发的，第一方原生App或第一方单页面应用。



#### 客户端模式

![image.png](https://i.loli.net/2020/02/22/XdovzaUsS5TlKMO.png)

- **（1）客户端向授权服务器发送自己的身份信息，并请求令牌（access_token）**

- **（2）确认客户端身份无误后，将令牌（access_token）发送给client**

  ```
  /uaa/oauth/token?client_id=c1&client_secret=secret&grant_type=client_credentials
  ```

  参数列表如下：

  - client_id：客户端准入标识。
  - client_secret：客户端秘钥。
  - grant_type：授权类型，填写client_credentials表示客户端模式

- 这种模式是最方便但最不安全的模式。因此这就要求我们对client完全的信任，而client本身也是安全的。因此这种模式一般用来提供给我们完全信任的服务器端服务。比如，合作方系统对接，拉取一组用户信息。



#### 资源服务器配置

- 本项目中的order项目就是一个资源服务器

- @EnableResourceServer 注解到一个 @Configuration 配置类上，并且必须使用 ResourceServerConfigurer 这个配置对象来进行配置（可以选择继承自 ResourceServerConfigurerAdapter 然后覆写其中的方法，参数就是这个对象的实例）
- ResourceServerSecurityConfigurer中主要包括：
  - tokenServices：ResourceServerTokenServices 类的实例，用来实现令牌服务。
  - tokenStore：TokenStore类的实例，指定令牌如何访问，与tokenServices配置可选
  - resourceId：这个资源服务的ID，这个属性是可选的，但是推荐设置并在授权服务中进行验证。
  - 其他的拓展属性例如 tokenExtractor 令牌提取器用来提取请求中的令牌。

- HttpSecurity配置这个与Spring Security类似：
  - 请求匹配器，用来设置需要进行保护的资源路径，默认的情况下是保护资源服务的全部路径。
  - 通过http.authorizeRequests()来设置受保护资源的访问规则
  - 其他的自定义权限保护规则通过 HttpSecurity 来进行配置。
- @EnableResourceServer 注解自动增加了一个类型为 OAuth2AuthenticationProcessingFilter 的过滤器链
- 在order项目中编写ResouceServerConfig：

```java
@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ResouceServerConfig extends
        ResourceServerConfigurerAdapter {

    public static final String RESOURCE_ID = "res1"; 

   
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId(RESOURCE_ID) //资源id
                .tokenServices(tokenService()) //验证令牌的服务
                .stateless(true);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {

        http
                .authorizeRequests()
                .antMatchers("/**").access("#oauth2.hasScope('all')")
                .and().csrf().disable()
                 .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}
```



##### 验证token

-  ResourceServerTokenServices 是组成授权服务的另一半，如果你的授权服务和资源服务在同一个应用程序上的话，你可以使用 DefaultTokenServices ，这样的话，你就不用考虑关于实现所有必要的接口的一致性问题。如果你的资源服务器是分离开的，那么你就必须要确保能够有匹配授权服务提供的 ResourceServerTokenServices，它知道如何对令牌进行解码。
-  令牌解析方法： 使用 DefaultTokenServices 在资源服务器本地配置令牌存储、解码、解析方式 使用 RemoteTokenServices 资源服务器通过 HTTP 请求来解码令牌，每次都请求授权服务器端点 /oauth/check_token
-  使用**授权服务**的 /oauth/check_token 端点你需要在授权服务将这个端点暴露出去，以便资源服务可以进行访问，这在咱们授权服务配置中已经提到了，下面是一个例子,在这个例子中，我们在授权服务中配置了 /oauth/check_token 和 /oauth/token_key 这两个端点：

```java
@Override
public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
    security
				.tokenKeyAccess("permitAll()")// /oauth/token_key 安全配置
				.checkTokenAccess("permitAll()") // /oauth/check_token 安全配置
}
```

- 在**资源服务**配置RemoteTokenServices ，在ResouceServerConfig中配置：

```java
//资源服务令牌解析服务
@Bean
public ResourceServerTokenServices tokenService() {
    //使用远程服务请求授权服务器校验token,必须指定校验token 的url、client_id，client_secret
    RemoteTokenServices service=new RemoteTokenServices();
    service.setCheckTokenEndpointUrl("http://localhost:53020/uaa/oauth/check_token");
    service.setClientId("c1");
    service.setClientSecret("secret");
    return service;
}
@Override
public void configure(ResourceServerSecurityConfigurer resources) {
	resources.resourceId(RESOURCE_ID)
		.tokenServices(tokenService())
		.stateless(true);
}
```



##### 编写资源

- 在controller包下编写OrderController，此controller表示订单资源的访问类：

```java
@RestController
public class OrderController {

    @GetMapping(value = "/r1")
    @PreAuthorize("hasAnyAuthority('p1')")
    public String r1(){
        return "访问资源1";
    }

}
```



##### 添加安全访问控制

```java
@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true,prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {


    //安全拦截机制（最重要）
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
//                .antMatchers("/r/r1").hasAuthority("p2")
//                .antMatchers("/r/r2").hasAuthority("p2")
                .antMatchers("/r/**").authenticated()//所有/r/**的请求必须认证通过
                .anyRequest().permitAll()//除了/r/**，其它的请求可以访问
                ;


    }
}
```



#### 测试OAuth授权认证

- 1、申请令牌

  - 使用密码模式申请令牌，响应结果为

  ```
  {
      "access_token": "e3360db3-2d85-41c9-ac5e-b9adba48e26c",
      "token_type": "bearer",
      "expires_in": 7199,
      "scope": "all"
  }
  ```

- 2、请求资源

  - 按照oauth2.0协议要求，请求资源需要携带token，token的参数名称为：Authorization，值为：Bearer token值

    ![image.png](https://i.loli.net/2020/02/22/bOodjmfJeT2AIwl.png)

  - 如果token错误，则授权失败，如下：

  ```
  {
      "error": "invalid_token",
      "error_description": "f3360db3-2d85-41c9-ac5e-b9adba48e26c"
  }
  ```




### JWT令牌

#### 介绍

- 当资源服务和授权服务不在一起时资源服务使用RemoteTokenServices 远程请求授权服务验证token，如果访问量较大将会影响系统的性能 。

- 令牌采用JWT格式即可解决上边的问题，用户认证通过会得到一个JWT令牌，JWT令牌中已经包括了用户相关的信息，客户端只需要携带JWT访问资源服务，资源服务根据事先约定的算法自行完成令牌校验，无需每次都请求认证服务完成授权。

- JSON Web Token（JWT）是一个开放的行业标准（RFC 7519），它定义了一种简介的、自包含的协议格式，用于在通信双方传递json对象，传递的信息经过数字签名可以被验证和信任。JWT可以使用HMAC算法或使用RSA的公钥/私钥对来签名，防止被篡改。

- JWT令牌的优点：

  1）jwt基于json，非常方便解析。

  2）可以在令牌中自定义丰富的内容，易扩展。

  3）通过非对称加密算法及数字签名技术，JWT防止篡改，安全性高。

  4）资源服务使用JWT可不依赖认证服务即可完成授权。

- 缺点：

  １）JWT令牌较长，占存储空间比较大。

- JWT令牌由三部分组成，每部分中间使用点（.）分隔，比如：xxxxx.yyyyy.zzzzz

- Header：

  头部包括令牌的类型（即JWT）及使用的哈希算法（如HMAC SHA256或RSA）

  ```
  {
      "alg": "HS256",
      "typ": "JWT"
  }
  ```

  将上边的内容使用Base64Url编码，得到一个字符串就是JWT令牌的第一部分。

- Payload:

  第二部分是负载，内容也是一个json对象，它是存放有效信息的地方，它可以存放jwt提供的现成字段，比如：iss（签发者）,exp（过期时间戳）, sub（面向的用户）等，也可自定义字段。

  此部分不建议存放敏感信息，因为此部分可以解码还原原始内容。

  最后将第二部分负载使用Base64Url编码，得到一个字符串就是JWT令牌的第二部分。

  ```
  {
      "sub": "1234567890",
      "name": "456",
      "admin": true
  }
  ```

- Signature:

  第三部分是签名，此部分用于防止jwt内容被篡改。

  这个部分使用base64url将前两部分进行编码，编码后使用点（.）连接组成字符串，最后使用header中声明签名算法进行签名。

  ```
  HMACSHA256(
      base64UrlEncode(header) + "." +
      base64UrlEncode(payload),
      secret)
  ```

  base64UrlEncode(header)：jwt令牌的第一部分。

  base64UrlEncode(payload)：jwt令牌的第二部分。

  secret：签名所使用的密钥。



#### 配置令牌服务

- 在uaa中配置jwt令牌服务，即可实现生成jwt格式的令牌。
- 1、TokenConfig

```java
@Configuration
public class TokenConfig {

    private String SIGNING_KEY = "uaa123"; //对称加密字符串，在授权服务和资源服务中要保持一致

    @Bean
    public TokenStore tokenStore() {
        //JWT令牌存储方案
        return new JwtTokenStore(accessTokenConverter());
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey(SIGNING_KEY); //对称秘钥，资源服务器使用该秘钥来验证
        return converter;
    }

}
```

- 2、定义JWT令牌服务：AuthorizationServer配置类

```java
@Autowired
private JwtAccessTokenConverter accessTokenConverter;

 @Bean
 public AuthorizationServerTokenServices tokenService() {
      DefaultTokenServices service=new DefaultTokenServices();
      service.setClientDetailsService(clientDetailsService);
      service.setSupportRefreshToken(true);
      service.setTokenStore(tokenStore);

     //令牌增强
TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
tokenEnhancerChain.setTokenEnhancers(Arrays.asList(accessTokenConverter));
service.setTokenEnhancer(tokenEnhancerChain);

      service.setAccessTokenValiditySeconds(7200); // 令牌默认有效期2小时
      service.setRefreshTokenValiditySeconds(259200); // 刷新令牌默认有效期3天
      return service;
  }
```



#### 生成JWT令牌

![](https://i.postimg.cc/hGPKMCCd/image.png)



#### 校验JWT令牌

- 资源服务需要和授权服务拥有一致的签字、令牌服务等：
- 1、将授权服务中的TokenConfig类拷贝到资源 服务中
- 2、屏蔽资源 服务原来的令牌服务类

```java
@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ResouceServerConfig extends
        ResourceServerConfigurerAdapter {

    public static final String RESOURCE_ID = "res1";

    @Autowired
    TokenStore tokenStore;

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId(RESOURCE_ID)
                .tokenStore(tokenStore) //采用JWT令牌模式
                .stateless(true);
    }
```

#### 测试

- 1）申请jwt令牌
- 2）使用令牌请求资源

![](https://i.postimg.cc/SNNVSCtG/image.png)



#### 完善环境配置

- 截止目前**客户端信息**和**授权码**仍然存储在内存中，生产环境中通过会存储在数据库中，下边完善环境的配置：

- 创建表

  ```sql
  DROP TABLE IF EXISTS `oauth_client_details`;
  CREATE TABLE `oauth_client_details`  (
    `client_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '客户端标识',
    `resource_ids` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '接入资源列表',
    `client_secret` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '客户端秘钥',
    `scope` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
    `authorized_grant_types` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
    `web_server_redirect_uri` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
    `authorities` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
    `access_token_validity` int(11) NULL DEFAULT NULL,
    `refresh_token_validity` int(11) NULL DEFAULT NULL,
    `additional_information` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
    `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
    `archived` tinyint(4) NULL DEFAULT NULL,
    `trusted` tinyint(4) NULL DEFAULT NULL,
    `autoapprove` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
    PRIMARY KEY (`client_id`) USING BTREE
  ) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '接入客户端信息' ROW_FORMAT = Dynamic;

  INSERT INTO `oauth_client_details` VALUES ('c1', 'res1', '$2a$10$NlBC84MVb7F95EXYTXwLneXgCca6/GipyWR5NHm8K0203bSQMLpvm', 'ROLE_ADMIN,ROLE_USER,ROLE_API', 'client_credentials,password,authorization_code,implicit,refresh_token', 'http://www.baidu.com', NULL, 7200, 259200, NULL, '2019-09-09 16:04:28', 0, 0, 'false');
  INSERT INTO `oauth_client_details` VALUES ('c2', 'res2', '$2a$10$NlBC84MVb7F95EXYTXwLneXgCca6/GipyWR5NHm8K0203bSQMLpvm', 'ROLE_API', 'client_credentials,password,authorization_code,implicit,refresh_token', 'http://www.baidu.com', NULL, 31536000, 2592000, NULL, '2019-09-09 21:48:51', 0, 0, 'false');
  ```

  ```sql
  DROP TABLE IF EXISTS `oauth_code`;
  CREATE TABLE `oauth_code`  (
    `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
    `authentication` blob NULL,
    INDEX `code_index`(`code`) USING BTREE
  ) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;
  ```



- 配置授权服务

- **（1）修改AuthorizationServer：**ClientDetailsService和AuthorizationCodeServices从数据库读取数据。

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServer extends
		AuthorizationServerConfigurerAdapter {

	@Autowired
	private TokenStore tokenStore;

	@Autowired
	private JwtAccessTokenConverter accessTokenConverter;

	@Autowired
	private ClientDetailsService clientDetailsService;

	@Autowired
	private AuthorizationCodeServices authorizationCodeServices;

	@Autowired
	private AuthenticationManager authenticationManager;

	/**
	 * 1.客户端详情相关配置
	 */
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
  
	@Bean
	public ClientDetailsService clientDetailsService(DataSource dataSource) {
		ClientDetailsService clientDetailsService = new JdbcClientDetailsService(dataSource);
		((JdbcClientDetailsService) clientDetailsService).setPasswordEncoder(passwordEncoder());
		return clientDetailsService;
	}

	@Override
	public void configure(ClientDetailsServiceConfigurer clients)
			throws Exception {
		clients.withClientDetails(clientDetailsService);
	}


	/**
	 * 2.配置令牌服务(token services)
	 */
	@Bean
	public AuthorizationServerTokenServices tokenService() {
		DefaultTokenServices service=new DefaultTokenServices();
		service.setClientDetailsService(clientDetailsService);
		service.setSupportRefreshToken(true);//支持刷新令牌
		service.setTokenStore(tokenStore); //绑定tokenStore

		TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
		tokenEnhancerChain.setTokenEnhancers(Arrays.asList(accessTokenConverter));
		service.setTokenEnhancer(tokenEnhancerChain);

		service.setAccessTokenValiditySeconds(7200); // 令牌默认有效期2小时
		service.setRefreshTokenValiditySeconds(259200); // 刷新令牌默认有效期3天
		return service;
	}


	/**
	 * 3.配置令牌（token）的访问端点
	 */

	@Bean
	public AuthorizationCodeServices authorizationCodeServices(DataSource dataSource) { 
		return new JdbcAuthorizationCodeServices(dataSource);//设置授权码模式的授权码如何存取
	}

	@Override
	public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
		endpoints.authenticationManager(authenticationManager)
				.authorizationCodeServices(authorizationCodeServices)
				.tokenServices(tokenService())
				.allowedTokenEndpointRequestMethods(HttpMethod.POST);
	}

	/**
	 * 4.配置令牌端点(Token Endpoint)的安全约束
	 */
	@Override
	public void configure(AuthorizationServerSecurityConfigurer security){
		security
				.tokenKeyAccess("permitAll()")
				.checkTokenAccess("permitAll()")
				.allowFormAuthenticationForClients()//允许表单认证
		;
	}
}
```



### Spring Security实现分布式系统授权

#### 需求分析

![](https://i.postimg.cc/KvFDCjw8/image.png)

- 1、UAA认证服务负责认证授权。
- 2、所有请求经过 网关到达微服务
- 3、网关负责鉴权客户端以及请求转发
- 4、网关将token解析后传给微服务，微服务进行授权。

#### 注册中心

- 所有微服务的请求都经过网关，网关从注册中心读取微服务的地址，将请求转发至微服务。
- 本节完成注册中心的搭建，注册中心采用Eureka。
- 1、创建maven工程

![image.png](https://i.postimg.cc/hvhCQYDm/image.png)



- 2、pom.xml依赖如下

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

    <artifactId>distributed-security-discovery</artifactId>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

    </dependencies>

</project>
```

- 3、配置文件:在resources中配置application.yml

```yaml
spring:
    application:
        name: distributed-discovery

server:
    port: 53000 #启动端口

eureka:
  server:
    enable-self-preservation: false    #关闭服务器自我保护，客户端心跳检测15分钟内错误达到80%服务会保护，导致别人还认为是好用的服务
    eviction-interval-timer-in-ms: 10000 #清理间隔（单位毫秒，默认是60*1000）5秒将客户端剔除的服务在服务注册列表中剔除# 
    shouldUseReadOnlyResponseCache: true #eureka是CAP理论种基于AP策略，为了保证强一致性关闭此切换CP 默认不关闭 false关闭
  client: 
    register-with-eureka: false  #false:不作为一个客户端注册到注册中心
    fetch-registry: false      #为true时，可以启动，但报异常：Cannot execute request on any known server
    instance-info-replication-interval-seconds: 10 
    serviceUrl: 
      defaultZone: http://localhost:${server.port}/eureka/
  instance:
    hostname: ${spring.cloud.client.ip-address}
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${spring.cloud.client.ip-address}:${spring.application.instance_id:${server.port}}

    
```

- 启动类：

```java
package com.pbteach.security.distributed.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServer {

   public static void main(String[] args) {
      SpringApplication.run(DiscoveryServer.class, args);

   }
}
```

#### 网关

- 网关整合 OAuth2.0 有**两种思路**，一种是认证服务器生成jwt令牌, 所有请求统一在网关层验证，判断权限等操作；另一种是由各资源服务处理，网关只做请求转发。
- 我们选用第一种。我们把API网关作为OAuth2.0的资源服务器角色，实现接入客户端权限拦截、令牌解析并转发当前登录用户信息(jsonToken)给微服务，这样下游微服务就不需要关心令牌格式解析以及OAuth2.0相关机制了。
- API网关在认证授权体系里主要负责两件事：
  - （1）作为OAuth2.0的**资源服务器**角色，实现接入方权限拦截。
  - （2）令牌解析并转发当前登录用户信息（明文token）给微服务
- 微服务拿到明文token(明文token中包含登录用户的身份和权限信息)后也需要做两件事：
  - （1）用户授权拦截（看当前用户是否有权访问该资源）
  - （2）将用户信息存储进当前线程上下文（有利于后续业务逻辑随时获取当前用户信息）
- 创建工程

![image.png](https://i.postimg.cc/52mkGLR6/image.png)

- 1、pom.xml

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

    <artifactId>distributed-security-gateway</artifactId>
    <dependencies>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

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
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
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

- 2、配置文件:配置application.properties

```properties
spring.application.name=gateway-server
server.port=53010
spring.main.allow-bean-definition-overriding = true

logging.level.root = info
logging.level.org.springframework = info

zuul.retryable = true
zuul.ignoredServices = *
zuul.add-host-header = true
zuul.sensitiveHeaders = *

zuul.routes.uaa-service.stripPrefix = false
zuul.routes.uaa-service.path = /uaa/**

zuul.routes.order-service.stripPrefix = false
zuul.routes.order-service.path = /order/**

eureka.client.serviceUrl.defaultZone = http://localhost:53000/eureka/
eureka.instance.preferIpAddress = true
eureka.instance.instance-id = ${spring.application.name}:${spring.cloud.client.ip-address}:${spring.application.instance_id:${server.port}}
management.endpoints.web.exposure.include = refresh,health,info,env

feign.hystrix.enabled = true
feign.compression.request.enabled = true
feign.compression.request.mime-types[0] = text/xml
feign.compression.request.mime-types[1] = application/xml
feign.compression.request.mime-types[2] = application/json
feign.compression.request.min-request-size = 2048
feign.compression.response.enabled = true
```

- 统一认证服务（UAA）与统一用户服务都是网关下微服务，需要在网关上新增路由配置：

```properties
zuul.routes.uaa-service.stripPrefix = false
zuul.routes.uaa-service.path = /uaa/**

zuul.routes.user-service.stripPrefix = false
zuul.routes.user-service.path = /order/**
```

- 上面配置了网关接收的请求url若符合/order/**表达式，将被被转发至order-service(统一用户服务)。
- 启动类：

```java
@SpringBootApplication
@EnableZuulProxy
@EnableDiscoveryClient
public class GatewayServer {

    public static void main(String[] args) {
        SpringApplication.run(GatewayServer.class, args);
    }
}
```

- token配置：**资源服务器**由于需要验证并解析令牌，往往可以通过在授权服务器暴露check_token的Endpoint来完成，而我们在授权服务器使用的是对称加密的jwt，因此知道密钥即可，资源服务与授权服务本就是对称设计，那我们把授权服务的TokenConfig两个类拷贝过来就行 。

```java
package com.pbteach.security.distributed.gateway.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

@Configuration
public class TokenConfig {


  private String SIGNING_KEY = "uaa123";

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

   @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey(SIGNING_KEY); //对称秘钥，资源服务器使用该秘钥来解密
        return converter;
    }

}
```

- 配置资源服务：在ResouceServerConfig中定义资源服务配置，主要配置的内容就是定义一些匹配规则，描述某个接入客户端需要什么样的权限才能访问某个微服务，如：

```java
@Configuration
public class ResouceServerConfig {

    public static final String RESOURCE_ID = "res1";

    /**
     * 统一认证服务(UAA) 资源拦截
     */
    @Configuration
    @EnableResourceServer
    public class UAAServerConfig extends
            ResourceServerConfigurerAdapter {

        @Autowired
        private TokenStore tokenStore;

        @Override
        public void configure(ResourceServerSecurityConfigurer resources){
            resources.tokenStore(tokenStore).resourceId(RESOURCE_ID)
                    .stateless(true);
        }

        @Override
        public void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests()
                    .antMatchers("/uaa/**").permitAll();
        }

    }

    /**
     *  订单服务
     */
    @Configuration
    @EnableResourceServer
    public class OrderServerConfig extends
        ResourceServerConfigurerAdapter {
            @Autowired
            private TokenStore tokenStore;

        @Override
        public void configure(ResourceServerSecurityConfigurer resources) {
            resources.tokenStore(tokenStore).resourceId(RESOURCE_ID)
                    .stateless(true);
        }
        @Override
        public void configure(HttpSecurity http) throws Exception {

            http
                    .authorizeRequests()
                    .antMatchers("/order/**").access("#oauth2.hasScope('ROLE_API')");

        }

    }
}
```

- 上面定义了两个微服务的资源，其中：UAAServerConfig指定了若请求匹配/uaa/**网关不进行拦截。OrderServerConfig指定了若请求匹配/order/**，也就是访问统一用户服务，接入客户端需要有scope中包含read，并且authorities(权限)中需要包含ROLE_USER。由于res1这个接入客户端，read包括ROLE_ADMIN,ROLE_USER,ROLE_API三个权限。
- 安全配置：

```java
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .authorizeRequests()
                .antMatchers("/**").permitAll()
                .and().csrf().disable();
    }
}
```

#### 转发明文token

- 转发明文token给微服务：通过Zuul过滤器的方式实现，目的是让下游微服务能够很方便的获取到当前的登录用户信息（明文token）
- **（1）实现Zuul前置过滤器，完成当前登录用户信息提取，并放入转发微服务的request中**

```java
/**
 * token传递拦截
 */
public class AuthFilter extends ZuulFilter {
    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public Object run() {
        /**
         * 1.获取令牌内容
         */
        RequestContext ctx = RequestContext.getCurrentContext();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(authentication instanceof OAuth2Authentication)){ // 无token访问网关内资源的情况，目前仅有uua服务直接暴露
            return null;
        }
        OAuth2Authentication oauth2Authentication  = (OAuth2Authentication)authentication;
        Authentication userAuthentication = oauth2Authentication.getUserAuthentication();
        Object principal = userAuthentication.getPrincipal();
        /**
         * 2.组装明文token，转发给微服务，放入header，名称为json-token
         */
        List<String> authorities = new ArrayList();
        userAuthentication.getAuthorities().stream().forEach(s ->authorities.add(((GrantedAuthority) s).getAuthority()));

        OAuth2Request oAuth2Request = oauth2Authentication.getOAuth2Request();
        Map<String, String> requestParameters = oAuth2Request.getRequestParameters();
        Map<String,Object> jsonToken = new HashMap<>(requestParameters);
        if(userAuthentication != null){

            jsonToken.put("principal",userAuthentication.getName());
            jsonToken.put("authorities",authorities);
        }
        ctx.addZuulRequestHeader("json-token", EncryptUtil.encodeUTF8StringBase64(JSON.toJSONString(jsonToken)));
        return null;
    }
}
```

- **（2）将filter纳入spring 容器：**配置AuthFilter

```java
package com.pbteach.security.distributed.gateway.config;


import com.pbteach.security.distributed.gateway.filter.AuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


@Configuration
public class ZuulConfig {

    @Bean
    public AuthFilter preFileter() {
        return new AuthFilter();
    }


    @Bean
    public FilterRegistrationBean corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(18000L);
        source.registerCorsConfiguration("/**", config);
        CorsFilter corsFilter = new CorsFilter(source);
        FilterRegistrationBean bean = new FilterRegistrationBean(corsFilter);
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

}
```

#### 微服务用户鉴权拦截

- 当微服务收到明文token时，应该怎么鉴权拦截呢？自己实现一个filter？自己解析明文token，自己定义一套资源访问策略？
- 能不能适配Spring Security呢，是不是突然想起了前面我们实现的Spring Security基于token认证例子。咱们还拿统一用户服务作为网关下游微服务，对它进行改造，增加**微服务用户鉴权拦截**功能。
- **（1）增加测试资源**：OrderController增加以下endpoint

```java
	@PreAuthorize("hasAuthority('p1')")
    @GetMapping(value = "/r1")
    public String r1(){
        UserDTO user = (UserDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
         return user.getUsername() + "访问资源1";
    }

    @PreAuthorize("hasAuthority('p2')")
    @GetMapping(value = "/r2")
    public String r2(){//通过Spring Security API获取当前登录用户
        UserDTO user = (UserDTO)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getUsername() + "访问资源2";
    }
```

- **（2）Spring Security配置**:开启方法保护，并增加Spring配置策略，除了/login方法不受保护(统一认证要调用)，其他资源全部需要认证才能访问。

```java
@Override
public void configure(HttpSecurity http) throws Exception {

  http
    .authorizeRequests()
    .antMatchers("/**").access("#oauth2.hasScope('ROLE_ADMIN')")
    .and().csrf().disable()
    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
}
```

- 综合上面的配置，咱们共定义了三个资源了，拥有p1权限可以访问r1资源，拥有p2权限可以访问r2资源，只要认证通过就能访问r3资源。
- （3）定义filter拦截token，并形成Spring Security的Authentication对象

```java
@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {

        String token = httpServletRequest.getHeader("json-token");


        if (token != null){
            //1.解析token
            String json = EncryptUtil.decodeUTF8StringBase64(token);
            JSONObject userJson = JSON.parseObject(json);
            UserDTO user = new UserDTO();
            user.setUsername(userJson.getString("principal"));
            JSONArray authoritiesArray = userJson.getJSONArray("authorities");

            String  [] authorities = authoritiesArray.toArray( new String[authoritiesArray.size()]);


            //2.新建并填充authentication
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user, null, AuthorityUtils.createAuthorityList(authorities));
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(
                    httpServletRequest));
            //3.将authentication保存进安全上下文
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}
```

- 经过上边的过虑 器，资源 服务中就可以方便到的获取用户的身份信息：

`UserDTO user = (UserDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();`

- 还是三个步骤：

  1.解析token

  2.新建并填充authentication

  3.将authentication保存进安全上下文

  剩下的事儿就交给Spring Security好了



#### 集成测试

- 本案例测试过程描述：

  1、采用OAuth2.0的密码模式从UAA获取token

  2、使用该token通过网关访问订单服务的测试资源

- （1）**过网关**访问uaa的授权及获取令牌，获取token。注意端口是53010，网关的端口。

  如授权endpoint：`http://localhost:53010/uaa/oauth/authorize?response_type=code&client_id=c1`

  令牌endpoint:`http://localhost:53010/uaa/oauth/token`

- （2）使用Token过网关访问订单服务中的r1-r2测试资源进行测试。

- 结果：

  使用张三token访问p1，访问成功

  使用张三token访问p2，访问失败

  使用李四token访问p1，访问失败

  使用李四token访问p2，访问成功

  符合预期结果。

- （3）破坏token测试

  无token测试返回内容：

  ```
  {
      "error": "unauthorized",
      "error_description": "Full authentication is required to access this resource"
  }
  ```

  破坏token测试返回内容：

  ```
  {
      "error": "invalid_token",
      "error_description": "Cannot convert access token to JSON"
  }
  ```



#### 扩展用户信息

- 需求分析：目前jwt令牌存储了用户的身份信息、权限信息，网关将token明文化转发给微服务使用，目前用户身份信息仅包括了用户的账号，微服务还需要用户的ID、手机号等重要信息。所以，本案例将提供扩展用户信息的思路和方法，满足微服务使用用户信息的需求。

- 下边分析JWT令牌中扩展用户信息的方案：

  在认证阶段DaoAuthenticationProvider会调用UserDetailService查询用户的信息，这里是可以获取到齐全的用户信息的。由于JWT令牌中用户身份信息来源于UserDetails，UserDetails中仅定义了username为用户的身份信息，这里有两个思路：第一是可以扩展UserDetails，使之包括更多的自定义属性，第二也可以扩展username的内容 ，比如存入json数据内容作为username的内容。相比较而言，方案二比较简单还不用破坏UserDetails的结构，我们采用方案二。

- 修改UserDetailService：从数据库查询到user，将整体user转成json存入userDetails对象。

```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    //登录账号
    System.out.println("username="+username);
    //根据账号去数据库查询...
    UserDto user = userDao.getUserByUsername(username);
    if(user == null){
        return null;
    }
    //查询用户权限
    List<String> permissions = userDao.findPermissionsByUserId(user.getId());
    String[] perarray = new String[permissions.size()];
    permissions.toArray(perarray);
    //创建userDetails
    //这里将user转为json，将整体user存入userDetails
    String principal = JSON.toJSONString(user);
    UserDetails userDetails = User.withUsername(principal).password(user.getPassword()).authorities(perarray).build();
    return userDetails;
}
```

- 修改资源服务过滤器：资源服务中的过虑 器负责 从header中解析json-token，从中即可拿网关放入的用户身份信息，部分关键代码如下：

```java
...
if (token != null){
    //1.解析token
    String json = EncryptUtil.decodeUTF8StringBase64(token);
    JSONObject userJson = JSON.parseObject(json);
    //取出用户身份信息
    String principal = userJson.getString("principal");
    //将json转成对象
    UserDTO userDTO = JSON.parseObject(principal, UserDTO.class);
    JSONArray authoritiesArray = userJson.getJSONArray("authorities");
    ...
```

- 以上过程就完成自定义用户身份信息的方案。
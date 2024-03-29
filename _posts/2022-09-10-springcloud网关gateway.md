---
layout: post
title: "springcloud网关gateway"
categories: springcloud
tags: springcloud gateway
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}


## 简介

客户端请求都是访问的 API 网关，然后网关转发到会员微服务，客户端无需知道会员微服务的地址。

业界比较出名的网关：Spring Cloud Gateway、Netflix Zuul、Nginx、Kong、Alibaba Tengine。

作为 Spring Cloud 全家桶中的一款组件，当然选择 Spring Cloud Gateway 了。

最开始 Spring Cloud 推荐的网关是 Netflix Zuul 1.x，但是停止维护了，后来又有 Zuul 2.0，但是因为开发延期比较严重，Spring Cloud 官方自己开发了 Spring Cloud Gateway 网关组件，用于代替 Zuul 网关。

gateway的工作流程：

1：**路由判断**；客户端的请求到达网关后，先经过 Gateway Handler Mapping 处理，这里面会做断言（Predicate）判断，看下符合哪个路由规则，这个路由映射后端的某个服务。

2：**请求过滤**：然后请求到达 Gateway Web Handler，这里面有很多过滤器，组成过滤器链（Filter Chain），这些过滤器可以对请求进行拦截和修改，比如添加请求头、参数校验等等，有点像净化污水。然后将请求转发到实际的后端服务。这些过滤器逻辑上可以称作 Pre-Filters，Pre 可以理解为“在...之前”。

3：**服务处理**：后端服务会对请求进行处理。

4：**响应过滤**： 后端处理完结果后，返回给 Gateway 的过滤器再次做处理，逻辑上可以称作 Post-Filters，Post 可以理解为“在...之后”。

5：**响应返回**：响应经过过滤处理后，返回给客户端。



## 断言Predicate

断言（Predicate）说白了它就是对一个表达式进行 if 判断，结果为真或假，如果为真则做这件事，否则做那件事。

在 Gateway 中，如果客户端发送的请求满足了断言的条件，则映射到指定的路由器，就能转发到指定的服务上进行处理。

断言配置的示例如下，配置了两个路由规则，有一个 predicates 断言配置，当请求 url 中包含 api/thirdparty，就匹配到了第一个路由 route_thirdparty。

application-routers.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: route_auth # 认证微服务路由规则
          uri: lb://java-auth # 负载均衡，将请求转发到注册中心注册的 auth 服务，lb 是 loadbalance（负载均衡) 单词的缩写
          predicates: # 断言
            - Path=/api/auth/** # 如果前端请求路径包含 api/auth，则应用这条路由规则
          filters: #过滤器
            - RewritePath=/api/(?<segment>.*),/$\{segment} # 将跳转路径中包含的api替换成空

        - id: route_member # 会员微服务路由规则
          uri: lb://java-member # 负载均衡，将请求转发到注册中心注册的 member 服务
          predicates: # 断言
            - Path=/api/member/** # 如果前端请求路径包含 api/member，则应用这条路由规则
          filters: #过滤器
            - RewritePath=/api/(?<segment>.*),/$\{segment} # 将跳转路径中包含的 api 替换成空
```



Route 路由和 Predicate 断言的对应关系

**一对多**：一个路由规则可以包含多个断言。如上图中路由 Route1 配置了三个断言 Predicate。

**同时满足**：如果一个路由规则中有多个断言，则需要同时满足才能匹配。如路由 Route2 配置了两个断言，客户端发送的请求必须同时满足这两个断言，才能匹配路由 Route2。

**第一个匹配成功**：如果一个请求可以匹配多个路由，则映射第一个匹配成功的路由。客户端发送的请求满足 Route3 和 Route4 的断言，但是 Route3 的配置在配置文件中靠前，所以只会匹配 Route3。



常见的 Predicate 断言配置如下所示

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220729113029190p6cTvL.png)



演示 Gateway 中通过断言来匹配路由的例子

pom

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

```



application.yml 

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: route_qq
          uri: http://www.qq.com
          predicates:
            - Query=url,qq # 表示当请求路径中包含 url=qq，则跳转到http://www.qq.com
        - id: route_baidu
          uri: http://www.baidu.com
          predicates:
            - Query=url,baidu # 当请求路径中包含 url=baidu，则跳转到http://www.baidu.com
server:
  port: 8060 

```



## 动态路由

在微服务架构中，我们不会直接通过 IP + 端口的方式访问微服务，而是通过服务名的方式来访问。

微服务中加入了注册中心，多个微服务将自己注册到了注册中心，这样注册中心就保存了服务名和 IP+端口的映射关系。

客户端先将请求发送给 Nginx，然后转发到网关，网关经过断言匹配到一个路由后，将请求转发给指定 uri，这个 uri 可以配置成 微服务的名字，比如 java-member。

Gateway 从注册中心拉取注册表，就能知道服务名对应具体的 IP + 端口，如果一个服务部署了多台机器，则还可以通过负载均衡进行请求的转发。



举例：调用第三方服务上传文件到oss

配置

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: route_thirdparty # 第三方微服务路由规则
          uri: lb://java-thirdparty # 负载均衡，将请求转发到注册中心注册的 passjava-thirdparty 服务
          predicates: # 断言
            - Path=/api/thirdparty/** # 如果前端请求路径包含 api/thirdparty，则应用这条路由规则
          filters: #过滤器
            - RewritePath=/api/(?<segment>.*),/$\{segment} # 将跳转路径中包含的api替换成空
```



前端请求地址：

`http://localhost:8060/api/thirdparty/v1/admin/oss/getPolicy`



转发地址

`http://localhost:14000/thirdparty/v1/admin/oss/getPolicy`



## 过滤器Filter

过滤器 Filter 按照请求和响应可以分为两种：`Pre` 类型和 `Post` 类型。

**Pre 类型**：在请求被转发到微服务之前，对请求进行拦截和修改，例如参数校验、权限校验、流量监控、日志输出以及协议转换等操作。

**Post 类型**：微服务处理完请求后，返回响应给网关，网关可以再次进行处理，例如修改响应内容或响应头、日志输出、流量监控等。

另外一种分类是按照过滤器 Filter 作用的范围进行划分：

**GlobalFilter**：全局过滤器，应用在所有路由上的过滤器。官方文档：https://cloud.spring.io/spring-cloud-static/Greenwich.SR2/single/spring-cloud.html#_global_filters

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220801160759874YcDKvo.png)



全局过滤器最常见的用法是进行负载均衡。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: route_member # 第三方微服务路由规则
          uri: lb://java-member # 负载均衡，将请求转发到注册中心注册的 passjava-member 服务
          predicates: # 断言
            - Path=/api/member/** # 如果前端请求路径包含 api/member，则应用这条路由规则
          filters: #过滤器
            - RewritePath=/api/(?<segment>.*),/$\{segment} # 将跳转路径中包含的api替换成空
```

关键字 `lb`，用到了全局过滤器 `LoadBalancerClientFilter`，当匹配到这个路由后，会将请求转发到 java-member 服务，且支持负载均衡转发，也就是先将 java-member 解析成实际的微服务的 host 和 port，然后再转发给实际的微服务。





**GatewayFilter**：局部过滤器，应用在单个路由或一组路由上的过滤器。标红色表示比较常用的过滤器。

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220801153546221F5Ja7c.png)



示例，如果 URL 匹配成功，则去掉 URL 中的 “api”。

```
filters: #过滤器
   - RewritePath=/api/(?<segment>.*),/$\{segment} # 将跳转路径中包含的 “api” 替换成空
```



## token认证

客户端登录时，将用户名和密码发送给网关，网关转发给认证服务器后，如果账号密码正确，则拿到一个 JWT token，然后客户端再访问应用服务时，先将请求发送给网关，网关统一做 JWT 认证，如果 JWT 符合条件，再将请求转发给应用服务。

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220801210230668uBySXS.png)



认证实例。客户端携带 token 访问 member 服务，网关会先校验 token 的合法性，验证规则如下：

当请求的 header 中包含 token，且 token = admin，则认证通过。

当验证通过后，就会将请求转发给 member 服务。

先定义一个全局过滤器，验证 token 的合法性。

```java
@Component
public class GlobalLoginFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request= exchange.getRequest();
        String token = request.getHeaders().getFirst("token");
        if(!StringUtils.isEmpty(token)){
            if("admin".equals(token)){
                return chain.filter(exchange);
            }
        }
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```



先测试在 header 中添加 token=123，响应结果为 401 Unauthorized，没有权限。

然后测试在 header 中添加 token=admin，正常返回响应数据。



## cookie-session

用户登录认证通过后，后端会存放该客户端的身份信息，也就是存放到 session 中，session 可以用来区分不同，然后返回一个 sessionId 给到客户端。

客户端将 sessionId 缓存在客户端。当客户端下次发送 HTTP 请求时，在 header 的 cookie 字段附带着 sessionId 发送给后端服务器。

后端服务器拿到 header 中的 sessionId，然后根据 sessionId 找到 session，如果 session 存在，则从 session 中解析出用户的身份信息，然后执行业务逻辑。

我们都知道 HTTP 协议是一种`无状态`的传输协议，无状态表示对一个事务的处理没有上下文的记忆能力，每一个 HTTP 请求都是完全独立的。但是 Cookie-Seesion 模式却和 HTTP 无状态特性相悖，因为客户端访问资源时，是携带第一次拿到的 sessionId 的，让服务端能够顺利区分出发送请求的用户是谁。

服务端对 session 的管理，就是一种状态管理机制，该机制存储了每个在线用户的上下文状态，再加上一些超时自动清理的管理措施。Cookie-Session 也是最传统但今天依旧应用到大量系统中，由服务端与客户端`联动`来完成的状态管理机制。

优势

状态信息都存储于服务器，只要依靠客户端的[同源策略](https://en.wikipedia.org/wiki/Same-origin_policy)和 HTTPS 的传输层安全，保证 Cookie 中的键值不被窃取而出现被冒认身份的情况，就能完全规避掉上下文信息在传输过程中被泄漏和篡改的风险。Cookie-Session 方案的另一大优点是服务端有主动的状态管理能力，可根据自己的意愿随时修改、清除任意上下文信息，譬如很轻易就能实现强制某用户下线的这样功能。（来自凤凰架构）

劣势

在单节点的单体服务中再适合不过，但是如果需要水平扩展要部署集群就很麻烦。

如果让 session 分配到不同的的节点上，不重复地保存着一部分用户的状态，用户的请求固定分配到对应的节点上，如果某个节点崩溃了，则里面的用户状态就会完全丢失。如果让 session 复制到所有节点上，那么同步的成本又会很高。

而为了解决分布式下的认证授权问题，并顺带解决少量状态的问题，就有了 JWT 令牌方案，但是 JWT 令牌和 Cookie-Session 并不是完全对等的解决方案，JWT 只能处理认证授权问题，且不能说 JWT 比 Cookie-Session 更加先进，也不可能全面取代 Cookie-Seesion 机制。



## JWT方案

服务端不保存任何状态信息，由客户端来存储，每次发送请求时携带这个状态信息发给后端服务。

但是这种方式无法携带大量信息，而且有泄漏和篡改的安全风险。信息量大小受限没有比较好的解决方案，但是确保信息不被中间人篡改则可以借助 JWT 方案。

JWT（JSON WEB TOKEN）是一种令牌格式，经常与 OAuth2.0 配合应用于分布式、多方的应用系统中。

JWT 令牌是以 JSON 结构存储，用点号分割为三个部分。

第一部分是**令牌头**（Header）;它描述了令牌的类型（统一为 typ:JWT）以及令牌签名的算法，示例中 HS256 为 HMAC SHA256 算法的缩写，其他各种系统支持的签名算法可以参考https://jwt.io/网站所列。

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```



令牌的第二部分是**负载**（Payload），这是令牌真正需要向服务端传递的信息。但是服务端不会直接用这个负载，而是通过加密传过来的 Header 和 Payload 后再比对签名是否一致来判断负载是否被篡改，如果没有被篡改，才能用 Payload 中的内容。因为负载只是做了 base64 编码，并不是加密，所以是不安全的，千万别把敏感信息比如密码放到负载里面。

```json
{
  "sub": "java",
  "name": "琪琪",
  "phone": 17122223333
}
```



令牌的第三部分是**签名**（Signature），使用在对象头中公开的特定签名算法，通过特定的密钥（Secret，由服务器进行保密，不能公开）对前面两部分内容进行加密计算，以例子里使用的 JWT 默认的 HMAC SHA256 算法为例，将通过以下公式产生签名值：

```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload) , secret)
```



**签名的意义**：确保负载中的信息是可信的、没有被篡改的，也没有在传输过程中丢失任何信息。因为被签名的内容哪怕发生了一个字节的变动，也会导致整个签名发生显著变化。此外，由于签名这件事情只能由认证授权服务器完成（只有它知道 Secret），任何人都无法在篡改后重新计算出合法的签名值，所以服务端才能够完全信任客户端传上来的 JWT 中的负载信息。

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/20221107172022.png)





## 认证，授权，凭证

认证表示你是谁。系统如何正确分辨出操作用户的真实身份，比如通过输入用户名和密码来辨别身份。

授权表示你能干什么。系统如何控制一个用户能看到哪些数据和操作哪些功能，也就是具有哪些权限。

凭证表示你如何证明你的身份。系统如何保证它与用户之间的承诺是双方当时真实意图的体现，是准确、完整和不可抵赖的。



### 认证的原理

认证和验证身份的流程：

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-202208142218310444AGSjdwqWPvG.png)



① **用户登录**：客户端在登录页面输入用户名和密码，提交表单，调用登录接口。

② **转发请求**：这里会先将登录请求发送到网关服务 passjava-gateway，网关对于登录请求会直接转发到认证服务 passjava-auth。（网关对登录请求不做 token 校验，这个可以配置不校验哪些请求 URL）

③ **认证**：认证服务会将请求参数中的用户名+密码和数据库中的用户进行比对，如果完全匹配，则认证通过。

④ **生成令牌**：生成两个令牌：`access_token` 和 refresh_token（刷新令牌），刷新令牌我们后面再说，这里其实也可以只用生成一个令牌 access_token。令牌里面会包含用户的身份信息，**如果要做权限管控**，还需要在 token 里面包含用户的权限信息，权限这一块不在本篇展开，会放到下一篇中进行讲解。

⑤ **客户端缓存 token**：客户端拿到两个 token 缓存到 cookie 中或者 LocalStorage 中。

⑥ **携带 token 发起请求**：客户端下次想调用业务服务时，将 access_token 放到请求的 header 中。

⑦ **网关校验 token**：请求还是先到到网关服务，然后由它校验 access_token 是否合法。如果 access_token 未过期，且能正确解析出来，就说明是合法的 access_token。

⑧ **携带用户身份信息转发请求**：网关将 access_token 中携带的用户的 user_id 放到请求的 header 中，转发给真正的业务服务。

⑨ **处理业务逻辑**：业务服务从 header 中拿到用户的 user_id，然后处理业务逻辑，处理完后将结果延原理返回给客户端。



### 如何做登陆认证



登录认证就是校验下用户提交的账户名和密码与本地数据库中的是否完全匹配，如果匹配，就认证通过。就是下方这个流程的 1、2、3 步。

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814105416774WMesSj.png)

第一步：提交用户名和密码

这里用 Postman 工具模拟前端发起登录请求，请求的 URL 如下：

```SH
http://localhost:8060/api/auth/login
```

![image-20220814161920022](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814161920022TSi6Tf.png)

请求是向网关服务 passjava-gateway 发起的，所以可以看到上面的 URL 中 localhost 和 8060 是网关的 host 和 port。

然后 API 地址为 /api/auth/login，这个地址经过网关的路由匹配后会转发到 passjava-auth 服务的登录 API。

```
http://localhost:10001/auth/login
```



账号和密码都是密文的，转发到认证服务后，会根据 userId 查询出系统用户，然后将 password 参数加密后对比系统用户的密码。

所以为了让用户登录成功，还需要在数据库插入一条系统用户，用户 id 为 wukong，密码是对 123456 加密后的密码。

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814163415719HMyHcP.png)

在线加密工具地址：

https://www.bejson.com/encrypt/bcrpyt_encode



第二步：转发登陆请求

转发登录请求是网关服务做的，所以我们来看下做了那些事情。

在 Gateway 项目的 application-routers.yml 中配置路由规则：

```YAML
spring:
  cloud:
    gateway:
      routes:
        - id: route_auth # 认证微服务路由规则
          uri: lb://passjava-auth # 负载均衡，将请求转发到注册中心注册的 passjava-auth 服务
          predicates: # 断言
            - Path=/api/auth/** # 如果前端请求路径包含 api/auth，则应用这条路由规则
          filters: #过滤器
            - RewritePath=/api/(?<segment>.*),/$\{segment} # 将跳转路径中包含的api替换成空复制复制失败复制成功
```

在 application.properties 引入 application-routers.yml

```yaml
spring:
  profiles:
    include: routers, jwt
```



第三步：验证用户名和密码

这一步是认证服务的登录 API 里面做的。在 AuthController 中定义 login 接口，核心步骤就是查找系统用户和比对密码。

![登录 API](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-202208141655254572aPJrp.png)

用户名和密码匹配成功后，就会生成 JWT 令牌。



### 如何生成令牌



生成令牌就是通过工具类 PassJavaJwtTokenUtil 生成 JWT Token，也就是流程图中的第四步。

![流程图-生成 JWT 令牌](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-2022081417084513103ogTt.png)

生成令牌的核心代码如下：

![生成 JWT 的核心代码](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814172121051Rqwmfq.png)

使用这个工具类的前提是我们需要先引入 jwt 依赖。这个在 passjava-jwt 项目的 pom 文件中引入。

![引入 jjwt 依赖](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814172217792z4J5WV.png)

用 Postman 工具调用后，可以看到生成的令牌如下：

![生成令牌](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814182655100H4H07N.png)

用 base64 解码后，可以看到 token 中的 PAYLOAD 里面包含了用户 id 和用户名。

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814171711910cic4Jn.png)

生成 JWT 的加密密钥一般都是写到配置文件中。这里我是配置在 passjava-jwt 项目的 application-jwt.yml 配置文件中的。

![JWT 配置项](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814181404573xWi2V2.png)

然后认证服务就会将 JWT 令牌返回给客户端了。当客户端想要查询这个 userId 对应的会员信息时，就可以在请求的 Header 中带上 JWT 令牌。



### 如何携带JWT发送请求



![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814184517467cvInSy.png)

客户端（浏览器或 APP）拿到 JWT 后，可以将 JWT 存放在浏览器的 Cookie 或 LocalStorage（本地存储） 或者内存中。

发送请求时在请求 Header 的 Authorization 字段中设置 JWT，这个字段其实可以自定义，但是我建议用 Authorization，因为这是一种业界标准。

另外告诉大家一个小技巧，在 Postman 工具中有个地方专门配置 Authorization，然后自动加到 Header 中，不用自己手动加 Header。

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814180402617UdX4Rz.png)

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814180431393sqNqcg.png)

还有一个点需要注意，这里配置的 Authorization 的认证类型为 Bearer Token。它表示令牌可以是任意字符串格式的令牌。然后会在 Authorization 字段中加上一个前缀 Bearer。所以我们在网关服务解析 Header 中的 Authorization 时，需要去掉这个前缀 Bearer，代码如下所示：

![去掉 Bearer 前缀](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-202208141825224276nl5ld.png)



### 网关如何验证 JWT 和转发请求



![网关验证 Token和转发请求](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814194440430RIKvF0.png)

网关接收到前端发起的业务请求后，会先验证请求的 Header 中是否携带 Authorization 字段，以及里面的 Token 是否合法。然后解析 Token 中的 userId 和 username，放到 header 中再进行转发，也就是流程图中的第七步和第八步。

网关是通过多个`过滤器 Filter`对请求进行串行拦截处理的，所以我们可以自定义一个全局过滤器，对所有请求进行校验，当然对于一些特殊请求比如登录请求就不需要校验了，因为调用登录请求的时候还没有生成 Token。

网关的全局过滤器 JwtAuthCheckFilter 的核心代码如下所示：

![网关的全局过滤器 JwtAuthCheckFilter](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814185733422F5KMsJ.png)



### 处理业务逻辑



![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814221220859aWnQGr.png)

会员服务接收到网关转发的请求后，就从 Header 中拿到用户身份信息，然后通过 userId 获取会员信息。

> 注意：有的时候业务逻辑并不需要身份信息，更多的时候是需要检验用户的操作权限是否足够。其实 Token 里面也是可以携带权限信息的，不过这是下一篇讲解授权的部分。

获取 userId 的方式其实可以通过加一个`拦截器`，由拦截器将 Header 中的 userId 和 username 放到线程中，后续的 controller，service，dao 类都可以从线程里面拿到 userId 和 username，不用通过传参的方式。

获取 userId 的方式：

- 方式一：从 request 的 Header 中拿到 userId。代码简单，但是如果其他地方也要用到 userId，则需要通过方法传参的方式传递 userId。
- 方式二：从线程变量里面拿到 userId。代码复杂，使用简单。好处是所有地方统一从一个地方获取。



Request 中获取 userId 方式：

代码示例如下：

![img](http://cdn.jayh.club/uPic/image-20220814195455216njzYqE.png)

下面介绍如何使用拦截器方式将 userId 存入线程变量的方式。



拦截器方式：

在 passjava-common 模块中新增一个拦截器，获取请求头中的身份信息，加入到线程变量中。文件名为 HeaderInterceptor。

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814195944424JfFsIz.png)

将拦截器注册到 WebMvcConfigurer。文件名为 WebMvcConfig.java。![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814220241678N9udz3.png)

配置文件中需要定义一个配置项：

```SH
文件名；org.springframework.boot.autoconfigure.AutoConfiguration.imports
配置项：com.jackson0714.passjava.common.config.WebMvcConfig
```

然后 passjava-member 服务引入这个拦截器配置。

```JAVA
@Import({WebMvcConfig.class})
```

通过上面两种方式中的任意一种拿到 userId 后，通过 userId 查询会员的详情。这里需要注意的是这个 user 既是系统用户也是系统中的会员。关于查询会员的数据库操作就不在此展开了。

执行结果如下图所示：

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220814224556708tM1RKs.png)



### 如何刷新令牌



还有一个内容是关于如何刷新令牌的。当认证服务返回给客户端的 JWT 也就是 access_token 过期后，客户端是通过发送登录请求重新拿到 access_token 吗？

这种重新登录的操作如果很频繁（因 JWT 过期时间较短），对于用户来说体验就很差了。客户端需要跳转到登录页面，让用户重新提交用户名和密码，即使客户端有记住用户名和密码，但是这种跳转的到登录页的操作会大幅度降低用户的体验，甚至导致用户不想再用第二次。

> 有没有一种比较优雅的方式让客户端重新拿到 access_token 或者说延长 access_token 有效期呢？

我们知道 JWT 生成后是不能篡改里面的内容，即使是 JWT 的有效期也不行。所以延长 access_token 有效期的做法并不适合，而且如果长期保持一个 access_token 有效，也是不安全的。

那就只能重新生成 access_token 了。方案其实挺简单，客户端拿之前生成的 JWT 调用后端一个接口，然后后端校验这个 JWT 是否合法，如果是合法的就重新生成一个新的返回给客户端。客户端自行替换掉之前本地保存的 access_token 就可以了。

![生成 access_token 和 refresh_token](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220815085804556JqzMJA.png)

这里有一个巧妙的设计，就是生成 JWT 时，返回了两个 JWT token，一个 access_token，一个 refresh_token，这两个 token 其实都可以用来刷新 token，但是我们把 refresh_token 设置的过期时间稍微长一点，比如两倍于 access_token，当 access_token 过期后，refresh_token 如果还没有过期，**就可以利用两者的过期时间差进行重新生成令牌的操作**，也就是`刷新令牌`，这里的刷新指的是客户端重置本地保存的令牌，以后都用新的令牌。



饥饿模式和懒模式：

当然，在 access_token 过期之前，客户端提前刷新令牌也是可以的，我称这种提前刷新的模式为`饥饿模式`（单例模式中也有这种叫法），而过期后再刷新令牌的模式我称之为`懒模式`。两种模式都可以用，前者需要客户端定期检查过期时间，增加了复杂性；后者则会出现短暂的请求失败的情况，得拿到新的令牌后才会成功。

刷新令牌的操作完全是通过客户端自己控制的，而且客户端也不仅限于浏览器，还有可能是第三方服务。



一次性：

通常情况下，我们会将刷新令牌 refresh_token 设置为只能用一次，来保证刷新令牌的安全性。而这种就需要服务端来缓存刷新令牌了，当用过一次后，就从缓存里面主动剔除掉。但这样就违背了 JWT 无状态的特性，这个完全看业务需求来决定是否使用这种缓存方式。

如下图所示，生成令牌时我将刷新令牌缓存到了 Redis 里面。当我用 refresh_token 调用刷新 API 时，会主动剔除掉这个 key，下次再用相同的 refresh_token 刷新令牌时，因 Redis 中不存在这个 key，就会提示刷新刷新失败了。

![缓存令牌](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220815083736227NZOnFi.png)

留两个小问题：

- 有没有办法让 access_token 主动失效？
- 场景题：如何保证同一个用户只能登录一台设备？



整理自：http://www.passjava.cn/#/02.SpringCloud/06.Gateway%E7%BD%91%E5%85%B3/04.%E5%AE%9E%E6%88%98SpringCloud+JWT%E8%AE%A4%E8%AF%81
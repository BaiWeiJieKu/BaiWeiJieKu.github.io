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






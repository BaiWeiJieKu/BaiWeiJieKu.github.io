---
layout: post
title: "springsecurity入门"
categories: 鉴权
tags: springsecurity
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 简介

- 系统为什么要认证？认证是为了保护系统的隐私数据与资源，用户的身份合法方可访问该系统的资源。
- **认证** ：用户认证就是判断一个用户的身份是否合法的过程，用户去访问系统资源时系统要求验证用户的身份信息，身份合法方可继续访问，不合法则拒绝访问。常见的用户身份认证方式有：用户名密码登录，二维码登录，手机短信登录，指纹认证等方式。
- **会话**：用户认证通过后，为了避免用户的每次操作都进行认证可将用户的信息保证在会话中。会话就是系统为了保持当前用户的登录状态所提供的机制，常见的有基于session方式、基于token方式等。
- 基于session的认证方式流程是，用户认证成功后，在服务端生成用户相关的数据保存在session(当前会话)中，发给客户端的 sesssion_id 存放到 cookie 中，这样用户客户端请求时带上 session_id 就可以验证服务器端是否存在 session 数据，以此完成用户的合法校验，当用户退出系统或session过期销毁时,客户端的session_id也就无效了。

![image.png](https://i.loli.net/2020/01/02/mPpJqUCaZ2sAGSo.png)

- 基于token方式交互流程是，用户认证成功后，服务端生成一个token发给客户端，客户端可以放到 cookie 或 localStorage 等存储中，每次请求时带上 token，服务端收到token通过验证后即可确认用户身份。

![image.png](https://i.loli.net/2020/01/02/XLWU8KDvdk94QS5.png)

- 基于session的认证方式由Servlet规范定制，服务端要存储session信息需要占用内存资源，客户端需要支持cookie；
- 基于token的方式则一般不需要服务端存储token，并且不限制客户端的存储方式。如今移动互联网时代更多类型的客户端需要接入系统，系统多是采用前后端分离的架构进行实现，所以基于token的方式更适合。
- **授权**： 授权是用户认证通过根据用户的权限来控制用户访问资源的过程，拥有资源的访问权限则正常访问，没有权限则拒绝访问。
- 认证是为了保证用户身份的合法性，授权则是为了更细粒度的对隐私数据进行划分，授权是在认证通过后发生的，控制不同的用户能够访问不同的资源。

#### 授权模型

-  授权可简单理解为Who对What(which)进行How操作
-  Who，即主体（Subject），主体一般是指用户，也可以是程序，需要访问系统中的资源。
-  What，即资源（Resource），如系统菜单、页面、按钮、代码方法、系统商品信息、系统订单信息等。
-  系统菜单、页面、按钮、代码方法都属于系统功能资源，对于web系统每个功能资源通常对应一个URL；系统商品信息、系统订单信息都属于实体资源（数据资源），实体资源由资源类型和资源实例组成，比如商品信息为资源类型，商品编号 为001的商品为资源实例。
-  How，权限/许可（Permission），规定了用户对资源的操作许可，权限离开资源没有意义，如用户查询权限、用户添加权限、某个代码方法的调用权限、编号为001的用户的修改权限等，通过权限可知用户对哪些资源都有哪些操作许可。

![image.png](https://i.loli.net/2020/01/02/Hi7FlEOMPqshr6Y.png)

- 主体、资源、权限相关的数据模型如下：
  - 主体（用户id、账号、密码、…）
  - 资源（资源id、资源名称、访问地址、…）
  - 权限（权限id、权限标识、权限名称、资源id、…）
  - 角色（角色id、角色名称、…）
  - 角色和权限关系（角色id、权限id、…）
  - 主体（用户）和角色关系（用户id、角色id、…）
- 主体（用户）、资源、权限关系如下图：

![image.png](https://i.loli.net/2020/02/22/MpGdaUH2TENn5Rg.png)

- 通常企业开发中将资源和权限表合并为一张权限表，如下：

  资源（资源id、资源名称、访问地址、…）

  权限（权限id、权限标识、权限名称、资源id、…）

  合并为：

  权限（权限id、权限标识、权限名称、资源名称、资源访问地址、…）

![image.png](https://i.loli.net/2020/02/22/4RCgeAc8fp7w5JO.png)



### cookie与JWT

**凭证**（Credentials）的出现就是系统保证它与用户之间的承诺是双方当时真实意图的体现，是准确、完整且不可抵赖的。

关于凭证的存储方案，业界的安全架构中有两种方案：

- Cookie-Session 模式
- JWT 方案



#### Cookie-Session 模式

流程图（悟空架构）

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/20220907170958.png)



用户登录认证通过后，后端会存放该客户端的身份信息，也就是存放到 session 中，session 可以用来区分不同，然后返回一个 sessionId 给到客户端。

客户端将 sessionId 缓存在客户端。当客户端下次发送 HTTP 请求时，在 header 的 cookie 字段附带着 sessionId 发送给后端服务器。

后端服务器拿到 header 中的 sessionId，然后根据 sessionId 找到 session，如果 session 存在，则从 session 中解析出用户的身份信息，然后执行业务逻辑。

我们都知道 HTTP 协议是一种`无状态`的传输协议，无状态表示对一个事务的处理没有上下文的记忆能力，每一个 HTTP 请求都是完全独立的。但是 Cookie-Seesion 模式却和 HTTP 无状态特性相悖，因为客户端访问资源时，是携带第一次拿到的 sessionId 的，让服务端能够顺利区分出发送请求的用户是谁。

服务端对 session 的管理，就是一种状态管理机制，该机制存储了每个在线用户的上下文状态，再加上一些超时自动清理的管理措施。Cookie-Session 也是最传统但今天依旧应用到大量系统中，由服务端与客户端`联动`来完成的状态管理机制。



**优势**

状态信息都存储于服务器，只要依靠客户端的同源策略和 HTTPS 的传输层安全，保证 Cookie 中的键值不被窃取而出现被冒认身份的情况，就能完全规避掉上下文信息在传输过程中被泄漏和篡改的风险。Cookie-Session 方案的另一大优点是服务端有主动的状态管理能力，可根据自己的意愿随时修改、清除任意上下文信息，譬如很轻易就能实现强制某用户下线的这样功能。（来自凤凰架构）



**劣势**

在单节点的单体服务中再适合不过，但是如果需要水平扩展要部署集群就很麻烦。

如果让 session 分配到不同的的节点上，不重复地保存着一部分用户的状态，用户的请求固定分配到对应的节点上，如果某个节点崩溃了，则里面的用户状态就会完全丢失。如果让 session 复制到所有节点上，那么同步的成本又会很高。

而为了解决分布式下的认证授权问题，并顺带解决少量状态的问题，就有了 JWT 令牌方案，但是 JWT 令牌和 Cookie-Session 并不是完全对等的解决方案，JWT 只能处理认证授权问题，且不能说 JWT 比 Cookie-Session 更加先进，也不可能全面取代 Cookie-Seesion 机制。



#### JWT模式

流程（悟空架构）

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/20220907171312.png)



但是这种方式无法携带大量信息，而且有泄漏和篡改的安全风险。信息量大小受限没有比较好的解决方案，但是确保信息不被中间人篡改则可以借助 JWT 方案。

JWT（JSON WEB TOKEN）是一种令牌格式，经常与 OAuth2.0 配合应用于分布式、多方的应用系统中。

我们先来看下 JWT 的格式长什么样：

JWT 令牌是以 JSON 结构存储，用点号分割为三个部分。

第一部分是**令牌头**（Header），内容如下所示：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

它描述了令牌的类型（统一为 typ:JWT）以及令牌签名的算法，示例中 HS256 为 HMAC SHA256 算法的缩写，其他各种系统支持的签名算法可以参考https://jwt.io/网站所列。

令牌的第二部分是**负载**（Payload），这是令牌真正需要向服务端传递的信息。但是服务端不会直接用这个负载，而是通过加密传过来的 Header 和 Payload 后再比对签名是否一致来判断负载是否被篡改，如果没有被篡改，才能用 Payload 中的内容。因为负载只是做了 base64 编码，并不是加密，所以是不安全的，千万别把敏感信息比如密码放到负载里面。

```JSON
{
  "sub": "passjava",
  "name": "悟空聊架构",
  "iat": 1516239022
}
```

令牌的第三部分是**签名**（Signature），使用在对象头中公开的特定签名算法，通过特定的密钥（Secret，由服务器进行保密，不能公开）对前面两部分内容进行加密计算，以例子里使用的 JWT 默认的 HMAC SHA256 算法为例，将通过以下公式产生签名值：

```java
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload) , secret)
```

**签名的意义**：确保负载中的信息是可信的、没有被篡改的，也没有在传输过程中丢失任何信息。因为被签名的内容哪怕发生了一个字节的变动，也会导致整个签名发生显著变化。此外，由于签名这件事情只能由认证授权服务器完成（只有它知道 Secret），任何人都无法在篡改后重新计算出合法的签名值，所以服务端才能够完全信任客户端传上来的 JWT 中的负载信息。



**优势**

- **无状态**：不需要服务端保存 JWT 令牌，也就是说不需要服务节点保留任何一点状态信息，就能在后续的请求中完成认证功能。
- **天然的扩容便利**：服务做水平扩容不用考虑 JWT 令牌，而 Cookie-Session 是需要考虑扩容后服务节点如何存储 Session 的。
- **不依赖 Cookie**：JWT 可以存放在浏览器的 LocalStorage，不一定非要存储在 Cookie 中。



**劣势**

- **令牌难以主动失效**：JWT 令牌签发后，理论上和认证的服务器就没有什么关系了，到期之前始终有效。除非服务器加些特殊的逻辑处理来缓存 JWT，并来管理 JWT 的生命周期，但是这种方式又会退化成有状态服务。而这种要求有状态的需求又很常见：譬如用户退出后，需要重新输入用户名和密码才能登录；或者用户只允许在一台设备登录，登录到另外一台设备，要求强行退出。但是这种有状态的模式，降低了 JWT 本身的价值。
- **更容易遭受重放攻击**：Cookie-Session 也有重放攻击的问题，也就是客户端可以拿着这个 cookie 不断发送大量请求，对系统性能造成影响。但是因为 Session 在服务端也有一份，服务端可以控制 session 的生命周期，应对重放攻击更加主动一些。但是 JWT 的重放攻击对于服务端来说就很被动，比如通过客户端的验证码、服务端限流或者缩短令牌有效期，应用起来都会麻烦些。
- **存在泄漏的风险**：客户端存储，很有可能泄漏出去，被其他人重复利用。
- **信息大小有限**：HTTP 协议并没有强制约束 Header 的最大长度，但是服务器、浏览器会做限制。而且如果令牌很大还会消耗传输带宽。



### RBAC

#### 基于角色访问控制

- RBAC基于角色的访问控制（Role-Based Access Control）是按角色进行授权，比如：主体的角色为总经理可以查询企业运营报表，查询员工工资信息等，访问控制流程如下：

```
if(主体.hasRole("总经理角色id")){
查询工资
}
```

- 当需要修改角色的权限时就需要修改授权的相关代码，系统可扩展性差

#### 基于资源访问控制

- RBAC基于资源的访问控制（Resource-Based Access Control）是按资源（或权限）进行授权，比如：用户必须具有查询工资权限才可以查询员工工资信息等

```
if(主体.hasPermission("查询工资权限标识")){
    查询工资
}
```

- 优点：系统设计时定义好查询工资的权限标识，即使查询工资所需要的角色变化为总经理和部门经理也不需要修改授权代码，系统可扩展性强。

### session认证

- 基于Session的认证机制由Servlet规范定制，Servlet容器已实现，用户通过HttpSession的操作方法即可实现，如下是HttpSession相关的操作API。
- 本案例工程使用maven进行构建，使用SpringMVC、Servlet3.0实现。
- 创建maven工程 security-springmvc

![image.png](https://i.loli.net/2020/02/22/5bKpiBSJrOn2FMy.png)

#### pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.pbteach.security</groupId>
    <artifactId>security-springmvc</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.1.5.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.0.1</version>
            <scope>provided</scope>
        </dependency>
         <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.8</version>
        </dependency>
    </dependencies>
    <build>
        <finalName>security-springmvc</finalName>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.tomcat.maven</groupId>
                    <artifactId>tomcat7-maven-plugin</artifactId>
                    <version>2.2</version>
                </plugin>
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
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>

</project>
```



#### 配置类

- 在config包下定义ApplicationConfig.java，它对应web.xml中ContextLoaderListener的配置

```java
//相当于applicationContext.xml
@Configuration
@ComponentScan(basePackages = "com.pbteach.security.springmvc"
                ,excludeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,value = Controller.class)})
public class ApplicationConfig {
    //在此配置除了Controller的其它bean，比如：数据库链接池、事务管理器、业务bean等。
}
```

- 采用Servlet3.0无web.xml方式，在config包下定义WebConfig.java，它对应于DispatcherServlet配置。

```java
//相当于springmvc.xml
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.pbteach.security.springmvc"
            ,includeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,value = Controller.class)})
public class WebConfig implements WebMvcConfigurer {

    //视频解析器
    @Bean
    public InternalResourceViewResolver viewResolver(){
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }
 }
```

#### 容器初始化

- 在init包下定义Spring容器初始化类SpringApplicationInitializer，此类实现WebApplicationInitializer接口，Spring容器启动时加载WebApplicationInitializer接口的所有实现类。

```java
public class SpringApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    //spring容器，相当于加载applicationContext.xml
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { ApplicationConfig.class };//指定rootContext的配置类
    }
	//servlet容器，相当于加载springmvc.xml
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] { WebConfig.class }; //指定servletContext的配置类
    }
	//URL-mapping映射集合
    @Override
    protected String[] getServletMappings() {
        return new String [] {"/"};
    }
}
```

- SpringApplicationInitializer相当于web.xml，使用了servlet3.0开发则不需要再定义web.xml，ApplicationConfig.class对应以下配置的application-context.xml，WebConfig.class对应以下配置的spring-mvc.xml，web.xml的内容参考：

```xml
<web-app>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener
        </listener-class>
    </listener>
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/application-context.xml</param-value>
    </context-param>
  
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

</web-app>
```

#### 认证页面

- 在webapp/WEB-INF/views下定义认证页面login.jsp

```jsp
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="utf-8" %>
<html>
<head>
    <title>用户登录</title>
</head>
<body>
<form action="login" method="post">
    用户名：<input type="text" name="username"><br>
    密&nbsp;&nbsp;&nbsp;码:
    <input type="password" name="password"><br>
    <input type="submit" value="登录">
</form>
</body>
</html>
```

- 在WebConfig中新增如下配置，将/直接导向login.jsp页面：

```java
@Override
public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("login");
}
```

#### 认证接口

- 用户进入认证页面，输入账号和密码，点击登录，请求/login进行身份认证。
- 定义认证接口，此接口用于对传来的用户名、密码校验，若成功则返回该用户的详细信息，否则抛出错误异常：

```java
/**
 * 认证服务
 */
public interface AuthenticationService {

    /**
     * 用户认证
     * @param authenticationRequest 用户认证请求,包含账号和密码
     * @return 认证成功的用户信息
     */
    UserDto authentication(AuthenticationRequest authenticationRequest);
}
```

```java
@Data
public class AuthenticationRequest {
    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;
}
```

```java
/**
 * 当前登录用户信息
 */
@Data
@AllArgsConstructor
public class UserDto {

    private String id;
    private String username;
    private String password;
    private String fullname;
    private String mobile;
}
```

- 认证实现类，根据用户名查找用户信息，并校验密码，这里模拟了两个用户：

```java
@Service
public class AuthenticationServiceImpl implements AuthenticationService{

    /**
     * 用户认证,校验用户身份信息是否合法
     * @param authenticationRequest 用户认证请求,包含账号和密码
     * @return 认证成功的用户信息
     */
    @Override
    public UserDto authentication(AuthenticationRequest authenticationRequest) {
        
        //校验参数是否为空
        if(authenticationRequest == null
                || StringUtils.isEmpty(authenticationRequest.getUsername())
                || StringUtils.isEmpty(authenticationRequest.getPassword())){
            throw new RuntimeException("账号或密码为空");
        }
        //根据账号去查询数据库
        UserDto userDto = getUserDto(authenticationRequest.getUsername());
        //判断用户是否为空
        if(userDto == null){
            throw new RuntimeException("查询不到该用户");
        }
        //校验密码
        if(!authenticationRequest.getPassword().equals(userDto.getPassword())){
            throw new RuntimeException("账号或密码错误");
        }
		//认证通过，返回用户身份信息
        return userDto;
    }
    //模拟用户查询
    public UserDto getUserDto(String username){
        return userMap.get(username);
    }
    //用户信息
    private Map<String,UserDto> userMap = new HashMap<>();
    {
        userMap.put("zhangsan",new UserDto("1010","zhangsan","123","张三","133443"));
        userMap.put("lisi",new UserDto("1011","lisi","456","李四","144553"));
    }
}
```

#### controller

- 登录Controller，对/login请求处理，它调用AuthenticationService完成认证并返回登录结果提示信息：

```java
@RestController
public class LoginController {

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * 用户登录,登录出错就会抛出异常，登录成功就会返回纯文本
     * @param authenticationRequest 登录请求
     * @return
     */
    @PostMapping(value = "/login",produces = {"text/plain;charset=UTF-8"})
    public String login(AuthenticationRequest authenticationRequest){
        UserDetails userDetails = authenticationService.authentication(authenticationRequest);
        return userDetails.getFullname() + " 登录成功";
    }

}
```

#### 实现会话功能

- 会话是指用户登入系统后，系统会记住该用户的登录状态，他可以在系统连续操作直到退出系统的过程。
- 认证的目的是对系统资源的保护，每次对资源的访问，系统必须得知道是谁在访问资源，才能对该请求进行合法性拦截。因此，在认证成功后，一般会把认证成功的用户信息放入Session中，在后续的请求中，系统能够从Session中获取到当前用户，用这样的方式来实现会话机制。
- （1）增加会话控制：首先在UserDto中定义一个SESSION_USER_KEY，作为Session中存放登录用户信息的key。

`public static final String SESSION_USER_KEY = "_user";`

- 然后修改LoginController，认证成功后，将用户信息放入当前会话。并增加用户登出方法，登出时将session置为失效。

```java
/**
 * 用户登录
 * @param authenticationRequest 登录请求
 * @param session http会话
 * @return
 */
 @PostMapping(value = "/login",produces = "text/plain;charset=utf-8")
    public String login(AuthenticationRequest authenticationRequest, HttpSession session)	{

        UserDto userDto = authenticationService.authentication(authenticationRequest);
        //用户信息存入session
        session.setAttribute(UserDto.SESSION_USER_KEY,userDto);
        return userDto.getUsername() + "登录成功";
    }

    @GetMapping(value = "logout",produces = "text/plain;charset=utf-8")
    public String logout(HttpSession session){
        //清空session	
        session.invalidate();
        return "退出成功";
    }
```

#### 实现授权功能

- 匿名用户（未登录用户）访问拦截：禁止匿名用户访问某些资源。

  登录用户访问拦截：根据用户的权限决定是否能访问某些资源。

- （1）增加权限数据：为了实现这样的功能，我们需要在UserDto里增加权限属性，用于表示该登录用户所拥有的权限，同时修改UserDto的构造方法。

```java
@Data
@AllArgsConstructor
public class UserDto {
    public static final String SESSION_USER_KEY = "_user";

    private String id;
    private String username;
    private String password;
    private String fullname;
    private String mobile;
    /**
     * 用户权限
     */
    private Set<String> authorities;

}
```

- 并在AuthenticationServiceImpl中为模拟用户初始化权限，其中张三给了p1权限，李四给了p2权限。

```java
//用户信息
    private Map<String,UserDto> userMap = new HashMap<>();
    {
        Set<String> authorities1 = new HashSet<>();
        authorities1.add("p1");
        Set<String> authorities2 = new HashSet<>();
        authorities2.add("p2");
        userMap.put("zhangsan",new UserDto("1010","zhangsan","123","张三","133443",authorities1));
        userMap.put("lisi",new UserDto("1011","lisi","456","李四","144553",authorities2));
    }
    private UserDetails getUserDetails(String username) {
        return userDetailsMap.get(username);
    }
```

- （2）增加测试资源：我们想实现针对不同的用户能访问不同的资源，前提是得有多个资源，因此在LoginController中增加测试资源2。

```java
/**
     * 测试资源1
     * @param session
     * @return
     */
 
    @GetMapping(value = "/r/r1",produces = {"text/plain;charset=UTF-8"})
    public String r1(HttpSession session){
        String fullname = null;
        Object userObj = session.getAttribute(UserDto.SESSION_USER_KEY);
        if(userObj != null){
            fullname = ((UserDto)userObj).getFullname();
        }else{
            fullname = "匿名";
        }
        return fullname + " 访问资源1";
    }

/**
 * 测试资源2
 * @param session
 * @return
 */
@GetMapping(value = "/r/r2",produces = {"text/plain;charset=UTF-8"})
public String r2(HttpSession session){
    String fullname = null;
    Object userObj = session.getAttribute(UserDto.SESSION_USER_KEY);
    if(userObj != null){
        fullname = ((UserDto)userObj).getFullname();
    }else{
        fullname = "匿名";
    }
    return fullname + " 访问资源2";
}
```

- （3）实现授权拦截器:在interceptor包下定义SimpleAuthenticationInterceptor拦截器，实现授权拦截：

```java
//实现springmvc的拦截器，在访问controller之前进行拦截
@Component
public class SimpleAuthenticationInterceptor implements HandlerInterceptor {
    //请求拦截方法，在这个方法中校验用户请求的URL是否在用户权限范围内
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //读取会话信息，取出用户身份信息
        Object object = request.getSession().getAttribute(UserDto.SESSION_USER_KEY);
        //没有认证，提示登录
        if(object == null){
            writeContent(response,"请登录");
        }
        UserDto user = (UserDto) object;
        //请求的url
        String requestURI = request.getRequestURI();
        if(user.getAuthorities().contains("p1") && requestURI.contains("/r1")){
            return true;
        }
        if(user.getAuthorities().contains("p2") && requestURI.contains("/r2")){
            return true;
        }
        writeContent(response,"权限不足，拒绝访问");
        return false;
    }

    //响应输出
    private void writeContent(HttpServletResponse response, String msg) throws IOException {
        response.setContentType("text/html;charset=utf-8");
        PrintWriter writer = response.getWriter();
        writer.print(msg);
        writer.close();
    }

}
```

- 在WebConfig中配置拦截器，匹配/r/**的资源为受保护的系统资源，访问该资源的请求进入SimpleAuthenticationInterceptor拦截器。

```java
 @Autowired
 private SimpleAuthenticationInterceptor simpleAuthenticationInterceptor;
    
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(simpleAuthenticationInterceptor).addPathPatterns("/r/**");
}
```

- 未登录情况下，/r/r1与/r/r2均提示 “请先登录”。

  张三登录情况下，由于张三有p1权限，因此可以访问/r/r1，张三没有p2权限，访问/r/r2时提示 “权限不足 “。

  李四登录情况下，由于李四有p2权限，因此可以访问/r/r2，李四没有p1权限，访问/r/r1时提示 “权限不足 “。

### Spring Security快速入门

- 创建maven工程 security-spring-security

![image.png](https://i.loli.net/2020/02/22/Pf6kyioVnOucqbs.png)

#### pom

- 在security-springmvc的基础上增加spring-security的依赖：

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>5.1.4.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>5.1.4.RELEASE</version>
</dependency>
```

#### 配置类

```java
@Configuration
@ComponentScan(basePackages = "com.pbteach.security.springmvc"
                ,excludeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,value = Controller.class)})
public class ApplicationConfig {
    //在此配置除了Controller的其它bean，比如：数据库链接池、事务管理器、业务bean等。
}
```

```java
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.pbteach.security.springmvc"
            ,includeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,value = Controller.class)})
public class WebConfig implements WebMvcConfigurer {

    //视频解析器
    @Bean
    public InternalResourceViewResolver viewResolver(){
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }
 }
```

#### 容器初始化

```java
public class SpringApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { ApplicationConfig.class };//指定rootContext的配置类
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] { WebConfig.class }; //指定servletContext的配置类
    }

    @Override
    protected String[] getServletMappings() {
        return new String [] {"/"};
    }
}
```

#### 认证

- springSecurity默认提供认证页面，不需要额外开发。
- spring security提供了用户名密码登录、退出、会话管理等认证功能，只需要配置即可使用。
- 1) 在config包下定义WebSecurityConfig，安全配置的内容包括：用户信息、密码编码器、安全拦截机制。

```java
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
//配置用户信息服务
    @Bean
    public UserDetailsService userDetailsService()  {
        //在userDetailsService()方法中，我们返回了一个UserDetailsService给spring容器，Spring Security会使用它来获取用户信息。我们暂时使用InMemoryUserDetailsManager实现类，并在其中分别创建了zhangsan、lisi两个用户，并设置密码和权限。
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("zhangsan").password("123").authorities("p1").build());
        manager.createUser(User.withUsername("lisi").password("456").authorities("p2").build());
    return manager;
}
    //密码编码器
    @Bean
    public PasswordEncoder passwordEncoder() {
        //先使用不加密的密码编码器
        return  NoOpPasswordEncoder.getInstance();
    }
    //配置安全拦截机制
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/r/**").authenticated() //所有的/r/**请求必须认证通过
                .anyRequest().permitAll()             //除了/r/**以外的请求都可以直接访问
                .and()//允许表单登录
                .formLogin().successForwardUrl("/login-success");//自定义登录成功后的跳转地址
    }
}
```

- 2) 加载 WebSecurityConfig：修改SpringApplicationInitializer的getRootConfigClasses()方法，添加WebSecurityConfig.class：

```java
@Override
protected Class<?>[] getRootConfigClasses() {
    return new Class<?>[] { ApplicationConfig.class, WebSecurityConfig.class};
}
```

#### Spring Security初始化

- Spring Security初始化，这里有两种情况:
  - 若当前环境没有使用Spring或Spring MVC，则需要将 WebSecurityConfig(Spring Security配置类) 传入超类，以确保获取配置，并创建spring context。
  - 相反，若当前环境已经使用spring，我们应该在现有的springContext中注册Spring Security(上一步已经做将WebSecurityConfig加载至rootcontext)，此方法可以什么都不做。
- 在init包下定义SpringSecurityApplicationInitializer：

```java
public class SpringSecurityApplicationInitializer
        extends AbstractSecurityWebApplicationInitializer {
    public SpringSecurityApplicationInitializer() {
        //super(WebSecurityConfig.class);
    }
}
```

#### 默认根路径请求

- 在WebConfig.java中添加默认请求根路径跳转到/login，此url为spring security提供：

```java
//默认Url根路径跳转到/login，此url为spring security提供
@Override
public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("redirect:/login");
}
```

- 认证成功页面:在安全配置中，认证成功将跳转到/login-success

#### controller

```java
@RequestMapping(value = "/login-success",produces = {"text/plain;charset=UTF-8"})
public String loginSuccess(){
    return " 登录成功";
}
```

- 启动项目，访问http://localhost:8080/security-spring-security/路径地址， 页面会根据WebConfig中addViewControllers配置规则，跳转至/login，/login是pring Security提供的登录页面。
- 请求/logout退出，退出后再访问资源自动跳转到登录页面

#### 授权

- 实现授权需要对用户的访问进行拦截校验，校验用户的权限是否可以操作指定的资源，Spring Security默认提供授权实现方法。
- 在LoginController添加/r/r1或/r/r2

```java
/**
 * 测试资源1
 * @return
 */
@GetMapping(value = "/r/r1",produces = {"text/plain;charset=UTF-8"})
public String r1(){
    return " 访问资源1";
}

/**
 * 测试资源2
 * @return
 */
@GetMapping(value = "/r/r2",produces = {"text/plain;charset=UTF-8"})
public String r2(){
    return " 访问资源2";
}
```

- 在安全配置类WebSecurityConfig.java中配置授权规则：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
            .authorizeRequests()
            .antMatchers("/r/r1").hasAuthority("p1")//访问/r/r1资源的 url需要拥有p1权限
            .antMatchers("/r/r2").hasAuthority("p2")//访问/r/r2资源的 url需要拥有p2权限
            .antMatchers("/r/**").authenticated()
            .anyRequest().permitAll()
            .and()
            .formLogin().successForwardUrl("/login-success");
}
```


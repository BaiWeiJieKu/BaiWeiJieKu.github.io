---
layout: post
title: "springsecurity集成boot"
categories: springsecurity
tags: 安全框架
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 集成springboot

- 创建maven工程 security-spring-boot

![](https://i.postimg.cc/BQLq1ndR/security-spring-boot.png)

#### pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.pbteach.security</groupId>
    <artifactId>security-springboot</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.3.RELEASE</version>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>
    <dependencies>
        <!-- 以下是>spring boot依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 以下是>spring security依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>


        <!-- 以下是jsp依赖-->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <scope>provided</scope>
        </dependency>
        <!--jsp页面使用jstl标签 -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
            <scope>provided</scope>
        </dependency>
        <!--用于编译jsp -->
        <dependency>
            <groupId>org.apache.tomcat.embed</groupId>
            <artifactId>tomcat-embed-jasper</artifactId>
            <scope>provided</scope>
        </dependency>
         <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.0</version>
          </dependency>
    </dependencies>
    <build>
        <finalName>security-springboot</finalName>
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

#### spring容器

- SpringBoot工程启动会自动扫描启动类所在包下的所有Bean，加载到spring容器。
- 1）Spring Boot配置文件：在resources下添加application.properties

```properties
server.port=8080
server.servlet.context-path=/security-springboot
spring.application.name = security-springboot
```

- 2）Spring Boot 启动类

```java
@SpringBootApplication
public class SecuritySpringBootApp {
    public static void main(String[] args) {
        SpringApplication.run(SecuritySpringBootApp.class, args);
    }

}
```

#### Servlet Context配置

- 由于Spring boot starter自动装配机制，这里无需使用@EnableWebMvc与@ComponentScan，WebConfig如下

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    //默认Url根路径跳转到/login，此url为spring security提供
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("redirect:/login");
    }
}
```

- 视图解析器配置在application.properties中

```properties
spring.mvc.view.prefix=/WEB-INF/views/
spring.mvc.view.suffix=.jsp
```

#### 安全配置

- 由于Spring boot starter自动装配机制，这里无需使用@EnableWebSecurity，WebSecurityConfig内容如下

```java
@Configuration
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

#### controller

```java
@RequestMapping(value = "/login-success",produces = {"text/plain;charset=UTF-8"})
public String loginSuccess(){
    return " 登录成功";
}
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

### 工作原理

#### 结构总览

- Spring Security所解决的问题就是**安全访问控制**，而安全访问控制功能其实就是对所有进入系统的请求进行拦截，校验每个请求是否能够访问它所期望的资源。
- 可以通过Filter或AOP等技术来实现，Spring Security对Web资源的保护是靠Filter实现的
- 当初始化Spring Security时，会创建一个名为`SpringSecurityFilterChain`的Servlet过滤器，类型为 org.springframework.security.web.FilterChainProxy，它实现了javax.servlet.Filter，因此外部的请求会经过此类

![](https://i.postimg.cc/xdQLxcMp/Filter-Chain-Proxy.png)

- FilterChainProxy是一个代理，真正起作用的是FilterChainProxy中SecurityFilterChain所包含的各个Filter
- 同时这些Filter作为Bean被Spring管理，它们是Spring Security核心，各有各的职责，但他们并不直接处理用户的**认证**，也不直接处理用户的**授权**，而是把它们交给了**认证管理器**（AuthenticationManager）和**决策管理器**（AccessDecisionManager）进行处理

![](https://i.postimg.cc/gJs9XXqC/Authentication-Manager.png)

- **SecurityContextPersistenceFilter** ：这个Filter是整个拦截过程的入口和出口（也就是第一个和最后一个拦截器），会在请求开始时从配置好的 SecurityContextRepository 中获取 SecurityContext，然后把它设置给 SecurityContextHolder。在请求完成后将 SecurityContextHolder 持有的 SecurityContext 再保存到配置好的 SecurityContextRepository，同时清除 securityContextHolder 所持有的 SecurityContext；
- **UsernamePasswordAuthenticationFilter** 用于处理来自表单提交的认证。该表单必须提供对应的用户名和密码，其内部还有登录成功或失败后进行处理的 AuthenticationSuccessHandler 和 AuthenticationFailureHandler，这些都可以根据需求做相关改变；
- **FilterSecurityInterceptor** 是用于保护web资源的，使用AccessDecisionManager对当前用户进行授权访问
- **ExceptionTranslationFilter** 能够捕获来自 FilterChain 所有的异常，并进行处理。但是它只会处理两类异常：AuthenticationException 和 AccessDeniedException，其它的异常它会继续抛出。

#### 认证流程

![](https://i.postimg.cc/NjQQMtc2/image.png)

- 仔细分析认证过程：
  - 用户提交用户名、密码被SecurityFilterChain中的`UsernamePasswordAuthenticationFilter`过滤器获取到，封装为请求Authentication，通常情况下是UsernamePasswordAuthenticationToken这个实现类
  - 然后过滤器将Authentication提交至认证管理器（AuthenticationManager）进行认证
  - 认证成功后，`AuthenticationManager`身份管理器返回一个被填充满了信息的（包括上面提到的权限信息，身份信息，细节信息，但密码通常会被移除）`Authentication`实例
  - `SecurityContextHolder`安全上下文容器将第3步填充了信息的`Authentication`，通过SecurityContextHolder.getContext().setAuthentication(…)方法，设置到其中。
- 可以看出AuthenticationManager接口（认证管理器）是认证相关的核心接口，也是发起认证的出发点，它的实现类为ProviderManager。而Spring Security支持多种认证方式，因此ProviderManager维护着一个`List<AuthenticationProvider>`列表，存放多种认证方式，最终实际的认证工作是由AuthenticationProvider完成的。
- web表单的对应的AuthenticationProvider实现类为DaoAuthenticationProvider，它的内部又维护着一个UserDetailsService负责UserDetails的获取。最终AuthenticationProvider将UserDetails填充至Authentication。

![](https://i.postimg.cc/52W6SDMf/image.png)

#### AuthenticationProvider

- 认证管理器（AuthenticationManager）委托AuthenticationProvider完成认证工作。

- AuthenticationProvider是一个接口

  ```java
  public interface AuthenticationProvider {
      Authentication authenticate(Authentication authentication) throws AuthenticationException;
      boolean supports(Class<?> var1);
  }
  ```

  - **authenticate**()方法定义了**认证的实现过程**，它的参数是一个Authentication，里面包含了登录用户所提交的用户、密码等。而返回值也是一个Authentication，这个Authentication则是在认证成功后，将用户的权限及其他信息重新组装后生成。

- Spring Security中维护着一个`List<AuthenticationProvider>`列表，存放多种认证方式，不同的认证方式使用不同的AuthenticationProvider。如使用用户名密码登录时，使用AuthenticationProvider1，短信登录时使用AuthenticationProvider2等等这样的例子很多。
- 每个AuthenticationProvider需要实现**supports（）**方法来表明自己支持的认证方式，如我们使用表单方式认证，在提交请求时Spring Security会生成UsernamePasswordAuthenticationToken，它是一个Authentication，里面封装着用户提交的用户名、密码信息。

```java
//DaoAuthenticationProvider的基类AbstractUserDetailsAuthenticationProvider
public boolean supports(Class<?> authentication) {
    return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
}
```

- **也就是说当web表单提交用户名密码时，Spring Security由DaoAuthenticationProvider处理。**
- Authentication是spring security包中的接口，直接继承自Principal类，而Principal是位于`java.security`包中的。它是表示着一个抽象主体身份，任何主体都有一个名称，因此包含一个getName()方法。

```java
public interface Authentication extends Principal, Serializable {         （1）
 
    Collection<? extends GrantedAuthority> getAuthorities();              （2）
    
  	Object getCredentials();										  （3）				

    Object getDetails();                                                  （4）

    Object getPrincipal();                                                （5）

    boolean isAuthenticated();                                            

    void setAuthenticated(boolean var1) throws IllegalArgumentException;
}
```

- （2）getAuthorities()，权限信息列表，默认是GrantedAuthority接口的一些实现类，通常是代表权限信息的一系列字符串。
- （3）getCredentials()，凭证信息，用户输入的密码字符串，在认证过后通常会被移除，用于保障安全。
- （4）getDetails()，细节信息，web应用中的实现接口通常为 WebAuthenticationDetails，它记录了访问者的ip地址和sessionId的值。
- （5）**getPrincipal()**，身份信息，大部分情况下返回的是UserDetails接口的实现类，UserDetails代表用户的详细信息，那从Authentication中取出来的UserDetails就是当前登录用户信息，它也是框架中的常用接口之一。

#### UserDetailsService

- 咱们现在知道DaoAuthenticationProvider处理了web表单的认证逻辑，认证成功后既得到一个Authentication(UsernamePasswordAuthenticationToken实现)，里面包含了身份信息（Principal）。这个身份信息就是一个`Object` ，大多数情况下它可以被强转为UserDetails对象。
- DaoAuthenticationProvider中包含了一个UserDetailsService实例，它负责根据用户名提取用户信息UserDetails(包含密码)，而后DaoAuthenticationProvider会去对比UserDetailsService提取的用户密码与用户提交的密码是否匹配作为认证成功的关键依据，因此可以通过将自定义的`UserDetailsService`公开为spring bean来定义自定义身份验证。

```java
public interface UserDetailsService {    
	UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

- UserDetailsService只负责从特定的地方（通常是数据库）加载用户信息，仅此而已。而DaoAuthenticationProvider的职责更大，它完成完整的认证流程，同时会把UserDetails填充至Authentication。

```java
public interface UserDetails extends Serializable {

   Collection<? extends GrantedAuthority> getAuthorities();

   String getPassword();

   String getUsername();

   boolean isAccountNonExpired();

   boolean isAccountNonLocked();

   boolean isCredentialsNonExpired();

   boolean isEnabled();
}
```

- Authentication的getCredentials()与UserDetails中的getPassword()需要被区分对待，前者是用户提交的密码凭证，后者是用户实际存储的密码，认证其实就是对这两者的比对。
- Authentication中的getAuthorities()实际是由UserDetails的getAuthorities()传递而形成的。
- 通过实现UserDetailsService和UserDetails，我们可以完成对用户信息获取方式以及用户信息字段的扩展
- Spring Security提供的InMemoryUserDetailsManager(内存认证)，JdbcUserDetailsManager(jdbc认证)就是UserDetailsService的实现类，主要区别无非就是从内存还是从数据库加载用户。
- 自定义UserDetailsService

```java
@Service
public class SpringDataUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //登录账号
        System.out.println("username="+username);
        //根据账号去数据库查询...
        //这里暂时使用静态数据
        UserDetails userDetails = User.withUsername(username).password("123").authorities("p1").build();
        return userDetails;
    }
}


//屏蔽安全配置类中UserDetailsService的定义
/*    @Bean
    public UserDetailsService userDetailsService()  {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("zhangsan").password("123").authorities("p1").build());
        manager.createUser(User.withUsername("lisi").password("456").authorities("p2").build());
        return manager;
}*/
```

#### PasswordEncoder

- Spring Security为了适应多种多样的加密类型，又做了抽象，DaoAuthenticationProvider通过PasswordEncoder接口的matches方法进行密码的对比，而具体的密码对比细节取决于实现：

```java
public interface PasswordEncoder {
    String encode(CharSequence var1);

    boolean matches(CharSequence var1, String var2);

    default boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
```

- 而Spring Security提供很多内置的PasswordEncoder，能够开箱即用，使用某种PasswordEncoder只需要进行如下声明即可，如下：

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return  NoOpPasswordEncoder.getInstance();
}
```

- NoOpPasswordEncoder采用字符串匹配方法，不对密码进行加密比较处理，密码比较流程如下：
  - 1、用户输入密码（明文 ）
  - 2、DaoAuthenticationProvider获取UserDetails（其中存储了用户的正确密码）
  - 3、DaoAuthenticationProvider使用PasswordEncoder对输入的密码和正确的密码进行校验，密码一致则校验通过，否则校验失败。
- 实际项目中推荐使用BCryptPasswordEncoder, Pbkdf2PasswordEncoder, SCryptPasswordEncoder等

- 使用BCryptPasswordEncoder

  - 1、在安全配置类中配置BCryptPasswordEncoder

  ```java
  @Bean
  public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
  }
  ```

  - 添加依赖：

  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
  </dependency>
  ```

  - 测试

  ```java
  @RunWith(SpringRunner.class)
  public class TestBCrypt {
      @Test
      public void test1(){
          //对原始密码加密
          String hashpw = BCrypt.hashpw("123",BCrypt.gensalt());
          System.out.println(hashpw);
          //校验原始密码和BCrypt密码是否一致
          boolean checkpw = BCrypt.checkpw("123", "$2a$10$NlBC84MVb7F95EXYTXwLneXgCca6/GipyWR5NHm8K0203bSQMLpvm");
          System.out.println(checkpw);
      }
  }
  ```

  - 修改安全配置类，实际项目中存储在数据库中的密码并不是原始密码，都是经过加密处理的密码。

  ```java
  manager.createUser(User.withUsername("zhangsan").password("$2a$10$1b5mIkehqv5c4KRrX9bUj.A4Y2hug3IGCnMCL5i4RpQrYV12xNKye").authorities("p1").build());
  ```

  

### 授权流程

- Spring Security可以通过`http.authorizeRequests()`对web请求进行授权保护。Spring Security使用标准Filter建立了对web请求的拦截，最终实现对资源的授权访问。
- Spring Security的授权流程如下：
  - **拦截请求**，已认证用户访问受保护的web资源将被SecurityFilterChain中的`FilterSecurityInterceptor`的子类拦截。
  - **获取资源访问策略**，FilterSecurityInterceptor会从`SecurityMetadataSource`的子类`DefaultFilterInvocationSecurityMetadataSource`获取要访问当前资源所需要的权限`Collection<ConfigAttribute>`。

![](https://i.postimg.cc/DyNzwZgj/image.png)

- SecurityMetadataSource其实就是读取访问策略的抽象，而读取的内容，其实就是我们配置的访问规则， 读取访问策略如：

```java
 http
   	.authorizeRequests()                                                           
           .antMatchers("/r/r1").hasAuthority("p1")                                      
           .antMatchers("/r/r2").hasAuthority("p2")
           ...
```

- 最后，FilterSecurityInterceptor会调用`AccessDecisionManager`进行授权决策，若决策通过，则允许访问资源，否则将禁止访问。

```java
public interface AccessDecisionManager {
  	/**
  	* 通过传递的参数来决定用户是否有访问对应受保护资源的权限
  	*/
    void decide(Authentication authentication , Object object, Collection<ConfigAttribute> configAttributes ) throws AccessDeniedException, InsufficientAuthenticationException;
	 //略..
}
```

- 着重说明一下decide的参数：
  - authentication：要访问资源的访问者的身份
  - object：要访问的受保护资源，web请求对应FilterInvocation
  - configAttributes：是受保护资源的访问策略，通过SecurityMetadataSource获取。

- **decide接口就是用来鉴定当前用户是否有访问对应受保护资源的权限。**



#### 授权决策

- AccessDecisionManager采用**投票**的方式来确定是否能够访问受保护资源。
- AccessDecisionManager中包含的一系列AccessDecisionVoter将会被用来对Authentication是否有权访问受保护对象进行投票，AccessDecisionManager根据投票结果，做出最终决策。
- AccessDecisionVoter是一个接口，其中定义有三个方法

```java
public interface AccessDecisionVoter<S> {
    int ACCESS_GRANTED = 1;
    int ACCESS_ABSTAIN = 0;
    int ACCESS_DENIED = -1;

    boolean supports(ConfigAttribute var1);

    boolean supports(Class<?> var1);

    int vote(Authentication var1, S var2, Collection<ConfigAttribute> var3);
}
```

-  vote()方法的返回结果会是AccessDecisionVoter中定义的三个常量之一。ACCESS_GRANTED表示同意，ACCESS_DENIED表示拒绝，ACCESS_ABSTAIN表示弃权。
- 如果一个AccessDecisionVoter不能判定当前Authentication是否拥有访问对应受保护对象的权限，则其vote()方法的返回值应当为弃权ACCESS_ABSTAIN。
- Spring Security内置了三个基于投票的AccessDecisionManager实现类如下，它们分别是**AffirmativeBased**、**ConsensusBased**和**UnanimousBased**。Spring security默认使用的是AffirmativeBased。
- **AffirmativeBased**的逻辑是：
  - （1）只要有AccessDecisionVoter的投票为ACCESS_GRANTED则同意用户进行访问
  - （2）如果全部弃权也表示通过
  - （3）如果没有一个人投赞成票，但是有人投反对票，则将抛出AccessDeniedException

- **ConsensusBased**的逻辑是：
  - （1）如果赞成票多于反对票则表示通过。
  - （2）反过来，如果反对票多于赞成票则将抛出AccessDeniedException。
  - （3）如果赞成票与反对票相同且不等于0，并且属性allowIfEqualGrantedDeniedDecisions的值为true，则表示通过，否则将抛出异常AccessDeniedException。参数allowIfEqualGrantedDeniedDecisions的值默认为true。
  - （4）如果所有的AccessDecisionVoter都弃权了，则将视参数allowIfAllAbstainDecisions的值而定，如果该值为true则表示通过，否则将抛出异常AccessDeniedException。参数allowIfAllAbstainDecisions的值默认为false。
- **UnanimousBased**的逻辑：
  - 与另外两种实现有点不一样，另外两种会一次性把受保护对象的配置属性全部传递给AccessDecisionVoter进行投票，而UnanimousBased会一次只传递一个ConfigAttribute给AccessDecisionVoter进行投票。
  - 这也就意味着如果我们的AccessDecisionVoter的逻辑是只要传递进来的ConfigAttribute中有一个能够匹配则投赞成票，但是放到UnanimousBased中其投票结果就不一定是赞成了
  - （1）如果受保护对象配置的某一个ConfigAttribute被任意的AccessDecisionVoter反对了，则将抛出AccessDeniedException。
  - （2）如果没有反对票，但是有赞成票，则表示通过。
  - （3）如果全部弃权了，则将视参数allowIfAllAbstainDecisions的值而定，true则通过，false则抛出AccessDeniedException。
---
layout: post
title: "springsecurity集成boot"
categories: 鉴权
tags: springsecurity
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 集成springboot

- 创建maven工程 security-spring-boot

![image.png](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302131118944.png)

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

![image.png](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302131119595.png)

- FilterChainProxy是一个代理，真正起作用的是FilterChainProxy中SecurityFilterChain所包含的各个Filter
- 同时这些Filter作为Bean被Spring管理，它们是Spring Security核心，各有各的职责，但他们并不直接处理用户的**认证**，也不直接处理用户的**授权**，而是把它们交给了**认证管理器**（AuthenticationManager）和**决策管理器**（AccessDecisionManager）进行处理

![image.png](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302131119554.png)

- **SecurityContextPersistenceFilter** ：这个Filter是整个拦截过程的入口和出口（也就是第一个和最后一个拦截器），会在请求开始时从配置好的 SecurityContextRepository 中获取 SecurityContext，然后把它设置给 SecurityContextHolder。在请求完成后将 SecurityContextHolder 持有的 SecurityContext 再保存到配置好的 SecurityContextRepository，同时清除 securityContextHolder 所持有的 SecurityContext；
- **UsernamePasswordAuthenticationFilter** 用于处理来自表单提交的认证。该表单必须提供对应的用户名和密码，其内部还有登录成功或失败后进行处理的 AuthenticationSuccessHandler 和 AuthenticationFailureHandler，这些都可以根据需求做相关改变；
- **FilterSecurityInterceptor** 是用于保护web资源的，使用AccessDecisionManager对当前用户进行授权访问
- **ExceptionTranslationFilter** 能够捕获来自 FilterChain 所有的异常，并进行处理。但是它只会处理两类异常：AuthenticationException 和 AccessDeniedException，其它的异常它会继续抛出。

#### 认证流程

![image.png](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302131119544.png)

- 仔细分析认证过程：
  - 用户提交用户名、密码被SecurityFilterChain中的`UsernamePasswordAuthenticationFilter`过滤器获取到，封装为请求Authentication，通常情况下是UsernamePasswordAuthenticationToken这个实现类
  - 然后过滤器将Authentication提交至认证管理器（AuthenticationManager）进行认证
  - 认证成功后，`AuthenticationManager`身份管理器返回一个被填充满了信息的（包括上面提到的权限信息，身份信息，细节信息，但密码通常会被移除）`Authentication`实例
  - `SecurityContextHolder`安全上下文容器将第3步填充了信息的`Authentication`，通过SecurityContextHolder.getContext().setAuthentication(…)方法，设置到其中。
- 可以看出AuthenticationManager接口（认证管理器）是认证相关的核心接口，也是发起认证的出发点，它的实现类为ProviderManager。而Spring Security支持多种认证方式，因此ProviderManager维护着一个`List<AuthenticationProvider>`列表，存放多种认证方式，最终实际的认证工作是由AuthenticationProvider完成的。
- web表单的对应的AuthenticationProvider实现类为DaoAuthenticationProvider，它的内部又维护着一个UserDetailsService负责UserDetails的获取。最终AuthenticationProvider将UserDetails填充至Authentication。

![image.png](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302131119834.png)

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

![image.png](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302131120006.png)

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
-  如果一个AccessDecisionVoter不能判定当前Authentication是否拥有访问对应受保护对象的权限，则其vote()方法的返回值应当为弃权ACCESS_ABSTAIN。
-  Spring Security内置了三个基于投票的AccessDecisionManager实现类如下，它们分别是**AffirmativeBased**、**ConsensusBased**和**UnanimousBased**。Spring security默认使用的是AffirmativeBased。
-  **AffirmativeBased**的逻辑是：
  - （1）只要有AccessDecisionVoter的投票为ACCESS_GRANTED则同意用户进行访问
  - （2）如果全部弃权也表示通过
  - （3）如果没有一个人投赞成票，但是有人投反对票，则将抛出AccessDeniedException

-  **ConsensusBased**的逻辑是：
  - （1）如果赞成票多于反对票则表示通过。
  - （2）反过来，如果反对票多于赞成票则将抛出AccessDeniedException。
  - （3）如果赞成票与反对票相同且不等于0，并且属性allowIfEqualGrantedDeniedDecisions的值为true，则表示通过，否则将抛出异常AccessDeniedException。参数allowIfEqualGrantedDeniedDecisions的值默认为true。
  - （4）如果所有的AccessDecisionVoter都弃权了，则将视参数allowIfAllAbstainDecisions的值而定，如果该值为true则表示通过，否则将抛出异常AccessDeniedException。参数allowIfAllAbstainDecisions的值默认为false。
-  **UnanimousBased**的逻辑：
  - 与另外两种实现有点不一样，另外两种会一次性把受保护对象的配置属性全部传递给AccessDecisionVoter进行投票，而UnanimousBased会一次只传递一个ConfigAttribute给AccessDecisionVoter进行投票。
  - 这也就意味着如果我们的AccessDecisionVoter的逻辑是只要传递进来的ConfigAttribute中有一个能够匹配则投赞成票，但是放到UnanimousBased中其投票结果就不一定是赞成了
  - （1）如果受保护对象配置的某一个ConfigAttribute被任意的AccessDecisionVoter反对了，则将抛出AccessDeniedException。
  - （2）如果没有反对票，但是有赞成票，则表示通过。
  - （3）如果全部弃权了，则将视参数allowIfAllAbstainDecisions的值而定，true则通过，false则抛出AccessDeniedException。

### 自定义认证

#### 自定义登录页面

- Spring Security的默认配置没有明确设定一个登录页面的URL，因此Spring Security会根据启用的功能自动生成一个登录页面URL，并使用默认URL处理登录的提交内容，登录后跳转的到默认URL等等。尽管自动生成的登录页面很方便快速启动和运行，但大多数应用程序都希望定义自己的登录页面。

- 在项目工程中创建自己的登录页面

```
webapp---WEB-INF---views---login.jsp
```

- 在WebConfig.java中配置认证页面地址：

```java
//默认Url根路径跳转到/login，此url为spring security提供
@Override
public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("redirect:/login-view");
    registry.addViewController("/login-view").setViewName("login");
}
```

- 在WebSecurityConfig中配置表章登录信息：

```java
//配置安全拦截机制
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/r/**").authenticated() //所有的/r/**请求必须认证通过
                .anyRequest().permitAll()             //除了/r/**以外的请求都可以直接访问
                .and()//允许表单登录
                .formLogin()
            		.loginPage("/login-view") //配置登录URL
            		.loginProcessingUrl("/login") //配置登录验证请求地址
            		.successForwardUrl("/login-success");//自定义登录成功后的跳转地址
        			.permitAll(); //允许任意用户访问基于表单登录的所有的URL。
    }
```

- spring security为防止CSRF（Cross-site request forgery跨站请求伪造）的发生，限制了除了get以外的大多数方法。

- 解决方法1：

  屏蔽CSRF控制，即spring security不再限制CSRF。

  配置WebSecurityConfig

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable()	//屏蔽CSRF控制，即spring security不再限制CSRF
            ...
}
```

- 解决方法2：

  在login.jsp页面添加一个token，spring security会验证token，如果token合法则可以继续请求。

  修改login.jsp

```jsp
<form action="login" method="post">
    <input type="hidden"  name="${_csrf.parameterName}"   value="${_csrf.token}"/>
   ...
</form>
```

#### 连接数据库

- 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
```



- 定义dataSource：在application.properties配置

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_db
spring.datasource.username=root
spring.datasource.password=mysql
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

- 定义Dao:定义模型类型，在model包定义UserDto：

```java
@Data
public class UserDto {

    private String id;
    private String username;
    private String password;
    private String fullname;
    private String mobile;
}
```

- 在Dao包定义UserDao：

```java
@Repository
public class UserDao {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public UserDto getUserByUsername(String username){
        String sql ="select id,username,password,fullname from t_user where username = ?";
        List<UserDto> list = jdbcTemplate.query(sql, new Object[]{username}, new BeanPropertyRowMapper<>(UserDto.class));
        if(list == null && list.size() <= 0){
            return null;
        }
        return list.get(0);
    }
}
```

- 在service包下定义SpringDataUserDetailsService：

```java
@Service
public class SpringDataUserDetailsService implements UserDetailsService {

    @Autowired
    UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //登录账号
        System.out.println("username="+username);
        //根据账号去数据库查询...
        UserDto user = userDao.getUserByUsername(username);
        if(user == null){
            return null;
        }
        //注意这里如果使用BCryptPasswordEncoder密码编辑器，在数据库中存储的应该是密文
        UserDetails userDetails = User.withUsername(user.getFullname()).password(user.getPassword()).authorities("p1").build();
        return userDetails;
    }
}
```



### 会话

- 用户认证通过后，为了避免用户的每次操作都进行认证可将用户的信息保存在会话中。spring security提供会话管理，认证通过后将身份信息放入SecurityContextHolder上下文，SecurityContext与当前线程进行绑定，方便获取用户身份。

#### 获取用户身份

- 编写LoginController，实现/r/r1、/r/r2的测试资源，并修改loginSuccess方法，注意getUsername方法，Spring Security获取当前登录用户信息的方法为SecurityContextHolder.getContext().getAuthentication()

```java
@RestController
public class LoginController {

    /**
     * 用户登录成功
     * @return
     */
    @RequestMapping(value = "/login-success",produces = {"text/plain;charset=UTF-8"})
    public String loginSuccess(){
        String username = getUsername();
        return username + " 登录成功";
    }

   /**
     * 获取当前登录用户名
     * @return
     */
    private String getUsername(){
        //获取认证后的用户信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //没有认证
        if(!authentication.isAuthenticated()){
            return null;
        }
        Object principal = authentication.getPrincipal();
        String username = null;
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            username = ((org.springframework.security.core.userdetails.UserDetails)principal).getUsername();
        } else {
            username = principal.toString();

        }
        return username;
    }

    /**
     * 测试资源1
     * @return
     */
    @GetMapping(value = "/r/r1",produces = {"text/plain;charset=UTF-8"})
    public String r1(){
        String username = getUsername();
        return username + " 访问资源1";
    }

    /**
     * 测试资源2
     * @return
     */
    @GetMapping(value = "/r/r2",produces = {"text/plain;charset=UTF-8"})
    public String r2(){
        String username = getUsername();
        return username + " 访问资源2";
    }
}
```

#### 会话控制

- 我们可以通过以下选项准确控制会话何时创建以及Spring Security如何与之交互：

| 机制         | 描述                                       |
| ---------- | ---------------------------------------- |
| always     | 如果没有session存在就创建一个                       |
| ifRequired | 如果需要就创建一个Session（默认）登录时                  |
| never      | SpringSecurity 将不会创建Session，但是如果应用中其他地方创建了Session，那么Spring Security将会使用它。 |
| stateless  | SpringSecurity将绝对不会创建Session，也不使用Session |

- 通过以下配置方式对该选项进行配置：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
   http.sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
}
```

-  默认情况下，Spring Security会为每个登录成功的用户会新建一个Session，就是**ifRequired** 。
-  若选用**never**，则指示Spring Security对登录成功的用户不创建Session了，但若你的应用程序在某地方新建了session，那么Spring Security会用它的。
-  若使用**stateless**，则说明Spring Security对登录成功的用户不会创建Session了，你的应用程序也不会允许新建session。并且它会暗示不使用cookie，所以每个请求都需要重新进行身份验证。这种无状态架构适用于REST API及其无状态认证机制。

#### 会话超时

- 可以在sevlet容器中设置Session的超时时间，如下设置Session有效期为3600s；

- spring boot 配置文件：

```properties
server.servlet.session.timeout=3600s
```

- session超时之后，可以通过Spring Security 设置跳转的路径。

```java
http.sessionManagement()
    .expiredUrl("/login-view?error=EXPIRED_SESSION")
    .invalidSessionUrl("/login-view?error=INVALID_SESSION");
```

- expired指session过期，invalidSession指传入的sessionid无效。

#### 安全会话

- 我们可以使用httpOnly和secure标签来保护我们的会话cookie：
  - **httpOnly**：如果为true，那么浏览器脚本将无法访问cookie
  - **secure**：如果为true，则cookie将仅通过HTTPS连接发送

```properties
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=true
```



### 退出

- Spring security默认实现了logout退出，访问/logout，果然不出所料，退出功能Spring也替我们做好了。
- 自定义退出成功的页面：
- 在WebSecurityConfig的protected void configure(HttpSecurity http)中配置：

```
.and()
.logout()
.logoutUrl("/logout")
.logoutSuccessUrl("/login-view?logout");
```

- 当退出操作出发时，将发生：
  - 使HTTP Session 无效
  - 清除`SecurityContextHolder`
  - 跳转到 `/login-view?logout`

- 类似于配置登录功能，咱们可以进一步自定义退出功能：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
            .authorizeRequests()
      		//...
            .and()
            .logout()                                                    (1)
                .logoutUrl("/logout")                                    (2)
                .logoutSuccessUrl("/login-view?logout")                  (3)
                .logoutSuccessHandler(logoutSuccessHandler)              (4)
      		    .addLogoutHandler(logoutHandler)                         (5)
                .invalidateHttpSession(true);                             (6)
                
}

/*
（1）提供系统退出支持，使用WebSecurityConfigurerAdapter会自动被应用
（2）设置触发退出操作的URL (默认是/logout).
（3）退出之后跳转的URL。默认是/login?logout。
（4）定制的 LogoutSuccessHandler ，用于实现用户退出成功时的处理。如果指定了这个选项那么logoutSuccessUrl()的设置会被忽略。
（5）添加一个LogoutHandler，用于实现用户退出时的清理工作.默认SecurityContextLogoutHandler会被添加为最后一个LogoutHandler。
（6）指定是否在退出时让HttpSession无效。 默认设置为 true。
*/
```

- **注意：如果让logout在GET请求下生效，必须关闭防止CSRF攻击csrf().disable()。如果开启了CSRF，必须使用post方式请求/logout**

#### logoutHandler

- 一般来说，`LogoutHandler`的实现类被用来执行必要的清理，因而他们不应该抛出异常。
- 下面是Spring Security提供的一些实现：
  - PersistentTokenBasedRememberMeServices 基于持久化token的**RememberMe**功能的相关清理
  - TokenBasedRememberMeService 基于token的**RememberMe**功能的相关清理
  - CookieClearingLogoutHandler 退出时Cookie的相关清理
  - CsrfLogoutHandler 负责在退出时移除csrfToken
  - SecurityContextLogoutHandler 退出时SecurityContext的相关清理
- 链式API提供了调用相应的`LogoutHandler` 实现的快捷方式，比如deleteCookies()。



### 授权

- 授权的方式包括 **web授权和方法授权**，web授权是通过 url拦截进行授权，方法授权是通过 方法拦截进行授权。他们都会调用accessDecisionManager进行授权决策，若为web授权则拦截器为FilterSecurityInterceptor；若为方法授权则拦截器为MethodSecurityInterceptor。如果同时通过web授权和方法授权则先执行web授权，再执行方法授权，最后决策通过，则允许访问资源，否则将禁止访问。

#### 数据库

- 角色表：

```sql
CREATE TABLE `t_role` (
  `id` varchar(32) NOT NULL COMMENT '角色id',
  `role_name` varchar(255) DEFAULT NULL COMMENT '角色名称',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `create_time` datetime DEFAULT NULL COMMENT '角色创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '角色修改时间',
  `status` char(1) NOT NULL COMMENT '角色状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

insert  into `t_role`(`id`,`role_name`,`description`,`create_time`,`update_time`,`status`) values ('1','管理员',NULL,NULL,NULL,'');
```

- 用户角色关系表：

```sql
CREATE TABLE `t_user_role` (
  `user_id` varchar(32) NOT NULL COMMENT '用户id',
  `role_id` varchar(32) NOT NULL COMMENT '角色id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `creator` varchar(255) DEFAULT NULL COMMENT '创建者',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


insert  into `t_user_role`(`user_id`,`role_id`,`create_time`,`creator`) values ('1','1',NULL,NULL);

```

- 权限表：

```sql
CREATE TABLE `t_permission` (
  `id` varchar(32) NOT NULL,
  `code` varchar(32) NOT NULL COMMENT '权限标识符',
  `description` varchar(64) DEFAULT NULL COMMENT '描述',
  `url` varchar(128) DEFAULT NULL COMMENT '请求地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

insert  into `t_permission`(`id`,`code`,`description`,`url`) values ('1','p1','测试资源1','/r/r1'),('2','p3','测试资源2','/r/r2');
```

- 角色权限关系表：

```sql
CREATE TABLE `t_role_permission` (
  `role_id` varchar(32) NOT NULL COMMENT '角色id',
  `permission_id` varchar(32) NOT NULL COMMENT '权限id',
  PRIMARY KEY (`role_id`,`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

insert  into `t_role_permission`(`role_id`,`permission_id`) values ('1','1'),('1','2');
```



#### 修改授权逻辑

- 修改dao接口：在UserDao中添加

```java
//根据用户id查询用户权限
public List<String> findPermissionsByUserId(String userId){
    String sql="SELECT * FROM t_permission WHERE id IN(\n" +
            "SELECT permission_id FROM t_role_permission WHERE role_id IN(\n" +
            "\tSELECT role_id FROM t_user_role WHERE user_id = ? \n" +
            ")\n" +
            ")";

    List<PermissionDto> list = jdbcTemplate.query(sql, new Object[]{userId}, new BeanPropertyRowMapper<>(PermissionDto.class));
    //获取权限标识符
    List<String> permissions = new ArrayList<>();
    list.iterator().forEachRemaining(c->permissions.add(c.getCode()));
    return permissions;

}
```

- 修改UserDetailService：实现从数据库读取权限

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
    UserDetails userDetails = User.withUsername(user.getFullname()).password(user.getPassword()).authorities(perarray).build();
    return userDetails;
}
```

#### WEB授权

- 我们想进行灵活的授权控制该怎么做呢？通过给`http.authorizeRequests()`添加多个子节点来定制需求到我们的URL

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()                                          (1)
        .antMatchers("/r/r1").hasAuthority("p1")                      (2)
        .antMatchers("/r/r2").hasAuthority("p2")                      (3)
        .antMatchers("/r/r3").access("hasAuthority('p1') and hasAuthority('p2')") (4)
        .antMatchers("/r/**").authenticated()                         (5)
        .anyRequest().permitAll()                                     (6)
        .and()
        .formLogin()
        // ...
}

/*
（1）http.authorizeRequests()方法有多个子节点，每个macher按照他们的声明顺序执行。

（2）指定”/r/r1”URL，拥有p1权限标识符能够访问

（3）指定”/r/r2”URL，拥有p2权限标识符能够访问

（4）指定了”/r/r3”URL，同时拥有p1和p2权限标识符才能够访问

（5）指定了除了r1、r2、r3之外”/r/**“资源，同时通过身份认证就能够访问，这里使用SpEL（Spring Expression Language）表达式。。

（6）剩余的尚未匹配的资源，不做保护。
*/
```

- **注意：规则的顺序是重要的,更具体的规则应该先写**。现在以/ admin开始的所有内容都需要具有ADMIN角色的身份验证用户,即使是/ admin / login路径(因为/ admin / login已经被/ admin / **规则匹配,因此第二个规则被忽略).

```java
.antMatchers("/admin/**").hasRole("ADMIN")
.antMatchers("/admin/login").permitAll()
```

- 因此,登录页面的规则应该在/ admin / **规则之前.例如.

```java
.antMatchers("/admin/login").permitAll()
.antMatchers("/admin/**").hasRole("ADMIN")
```

- 保护URL常用的方法有：
  - **authenticated()** 保护URL，需要用户登录
  - **permitAll()** 指定URL无需保护，一般应用与静态资源文件
  - **hasRole(String role)** 限制单个角色访问，角色将被增加 “ROLE_” .所以”ADMIN” 将和 “ROLE_ADMIN”进行比较
  - **hasAuthority(String authority)** 限制单个权限访问
  - **hasAnyRole(String… roles)**允许多个角色访问
  - **hasAnyAuthority(String… authorities)** 允许多个权限访问
  - **access(String attribute)** 该方法使用 SpEL表达式, 所以可以创建复杂的限制
  - **hasIpAddress(String ipaddressExpression)** 限制IP地址或子网



#### 方法授权

- 从Spring Security2.0版本开始，它支持服务层方法的安全性的支持。本节学习@PreAuthorize,@PostAuthorize, @Secured三类注解。
- 我们可以在任何`@Configuration`实例上使用`@EnableGlobalMethodSecurity`注释来启用基于注解的安全性。
- 以下内容将启用Spring Security的`@Secured`注释。

```java
@EnableGlobalMethodSecurity(securedEnabled = true)
@Configuration
public class MethodSecurityConfig {// ...}
```

-  然后向方法（在类或接口上）添加注解就会限制对该方法的访问。 Spring Security的原生注释支持为该方法定义了一组属性。 这些将被传递给AccessDecisionManager以供它作出实际的决定：

```java
public interface BankService {

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
public Account readAccount(Long id);

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
public Account[] findAccounts();

@Secured("ROLE_TELLER")
public Account post(Account account, double amount);
}

/*
以上配置标明readAccount、findAccounts方法可匿名访问，底层使用WebExpressionVoter投票器
post方法需要有TELLER角色才能访问，底层使用RoleVoter投票器。
*/
```





- 使用如下代码可启用prePost注解的支持

```java
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Configuration
public class MethodSecurityConfig {// ...}
```

```java
public interface BankService {

@PreAuthorize("isAnonymous()")
public Account readAccount(Long id);

@PreAuthorize("isAnonymous()")
public Account[] findAccounts();

@PreAuthorize("hasAuthority('p_transfer') and hasAuthority('p_read_account')")
public Account post(Account account, double amount);
}

/*
以上配置标明readAccount、findAccounts方法可匿名访问，post方法需要同时拥有p_transfer和p_read_account权限才能访问，底层使用WebExpressionVoter投票器
*/
```


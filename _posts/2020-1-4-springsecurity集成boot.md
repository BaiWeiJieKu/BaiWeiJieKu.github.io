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

![](https://i.postimg.cc/BQLq1ndR/image.png)

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


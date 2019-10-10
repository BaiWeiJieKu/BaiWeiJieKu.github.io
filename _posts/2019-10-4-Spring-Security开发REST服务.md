---
layout: post
title: "Spring Security开发REST服务"
categories: Spring-Security
tags: Spring-Security
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 主模块(pom)

#### pom

```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.imooc.security</groupId>
	<artifactId>imooc-security</artifactId>
	<version>1.0.0-SNAPSHOT</version>
	<packaging>pom</packaging>
	
	<properties>
		<imooc.security.version>1.0.0-SNAPSHOT</imooc.security.version>
	</properties>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>io.spring.platform</groupId>
				<artifactId>platform-bom</artifactId>
				<version>Brussels-SR4</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>Dalston.SR2</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>
	
	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<version>2.3.2</version>
				<configuration>
					<source>1.8</source>
					<target>1.8</target>
					<encoding>UTF-8</encoding>
				</configuration>
			</plugin>
		</plugins>
	</build>
	
	<modules>
		<module>../imooc-security-app</module>
		<module>../imooc-security-browser</module>
		<module>../imooc-security-core</module>
		<module>../imooc-security-demo</module>
	</modules>
</project>
```



### 核心业务(jar)

#### pom

```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<artifactId>imooc-security-core</artifactId>
	<parent>
		<groupId>com.imooc.security</groupId>
		<artifactId>imooc-security</artifactId>
		<version>1.0.0-SNAPSHOT</version>
		<relativePath>../imooc-security</relativePath>
	</parent>

	<dependencies>
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-oauth2</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-redis</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-jdbc</artifactId>
		</dependency>
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.social</groupId>
			<artifactId>spring-social-config</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.social</groupId>
			<artifactId>spring-social-core</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.social</groupId>
			<artifactId>spring-social-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.social</groupId>
			<artifactId>spring-social-web</artifactId>
		</dependency>
		<dependency>
			<groupId>commons-lang</groupId>
			<artifactId>commons-lang</artifactId>
		</dependency>
		<dependency>
			<groupId>commons-collections</groupId>
			<artifactId>commons-collections</artifactId>
		</dependency>
		<dependency>
			<groupId>commons-beanutils</groupId>
			<artifactId>commons-beanutils</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-configuration-processor</artifactId>
		</dependency>
	</dependencies>
</project>
```



### 浏览器安全(jar)

#### pom

```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<artifactId>imooc-security-browser</artifactId>
	<parent>
		<groupId>com.imooc.security</groupId>
		<artifactId>imooc-security</artifactId>
		<version>1.0.0-SNAPSHOT</version>
		<relativePath>../imooc-security</relativePath>
	</parent>

	<dependencies>
		<dependency>
			<groupId>com.imooc.security</groupId>
			<artifactId>imooc-security-core</artifactId>
			<version>${imooc.security.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.session</groupId>
			<artifactId>spring-session</artifactId>
		</dependency>
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-core</artifactId>
			<version>1.2.2</version>
		</dependency>
	</dependencies>

</project>
```



### app相关(jar)

#### pom

```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<artifactId>imooc-security-app</artifactId>
	<parent>
		<groupId>com.imooc.security</groupId>
		<artifactId>imooc-security</artifactId>
		<version>1.0.0-SNAPSHOT</version>
		<relativePath>../imooc-security</relativePath>
	</parent>
	
	<dependencies>
		<dependency>
			<groupId>com.imooc.security</groupId>
			<artifactId>imooc-security-core</artifactId>
			<version>${imooc.security.version}</version>
		</dependency>
	</dependencies>
</project>
```



### 样例

#### pom

```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<artifactId>imooc-security-demo</artifactId>
	<parent>
		<groupId>com.imooc.security</groupId>
		<artifactId>imooc-security</artifactId>
		<version>1.0.0-SNAPSHOT</version>
		<relativePath>../imooc-security</relativePath>
	</parent>

	<dependencies>
		<dependency>
			<groupId>com.imooc.security</groupId>
			<artifactId>imooc-security-browser</artifactId>
			<version>${imooc.security.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-aop</artifactId>
		</dependency>
		<dependency>
			<groupId>commons-io</groupId>
			<artifactId>commons-io</artifactId>
		</dependency>
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger2</artifactId>
			<version>2.7.0</version>
		</dependency>
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger-ui</artifactId>
			<version>2.7.0</version>
		</dependency>
		<dependency>
			<groupId>com.github.tomakehurst</groupId>
			<artifactId>wiremock</artifactId>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<version>1.3.3.RELEASE</version>
				<executions>
					<execution>
						<goals>
							<goal>repackage</goal>
						</goals>
					</execution>
				</executions>
			</plugin>
		</plugins>
		<finalName>demo</finalName>
	</build>
</project>
```



#### RestFul

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/spring-security/restful.png)

#### 常用注解

- @RestController：标明此Controller提供RestAPI

  @RequestMapping：映射HTTP请求URL到java方法

  @RequestParam：映射请求参数到java方法的参数

  @PageableDefault：指定分页参数默认值

  @PathVariable：映射URL片段到java方法的参数

  @JsonView：控制json输出内容
  
  @RequestBody：映射请求体到java方法的参数
  
  @Valid+BindingResult：验证请求参数的合法性并处理校验结果

#### 测试用例

##### GET请求



- 设计测试用例测试查询

```java
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserControllerTest {
	
    //web应用上下文
	@Autowired
	private WebApplicationContext wac;
	//模拟MVC环境
	private MockMvc mockMvc;

	@Before
	public void setup() {
        //在执行测试方法之前实例化MVC环境
		mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
	}
	
	@Test
	public void whenQuerySuccess() throws Exception {
        //模拟发送RestFul格式请求
        //get("/user"):请求URL
        //param("username", "jojo")：请求参数
        //contentType：类型
        //andExpect:期望得到的响应状态
        //jsonPath：响应参数的长度为3
		String result = mockMvc.perform(
				get("/user").param("username", "jojo").param("age", "18").param("ageTo", "60").param("xxx", "yyy")
						// .param("size", "15")
						// .param("page", "3")
						// .param("sort", "age,desc")
						.contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(3))
				.andReturn().getResponse().getContentAsString();
		
		System.out.println(result);
	}
}
```



- 根据id查询详细信息

```java
@Test
	public void whenGetInfoSuccess() throws Exception {
		String result = mockMvc.perform(get("/user/1")
				.contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.username").value("tom"))
				.andReturn().getResponse().getContentAsString();
		
		System.out.println(result);
	}
```

```java
//{id}:id可以是字符串，也可以是数字
//@RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
//正则表达式,接收的参数必须为数字：
//@PathVariable：把URL中｛id｝映射到参数的id上
@GetMapping("/user/{id:\\d+}")
@JsonView(User.UserDetailView.class)
public User getInfo(@PathVariable String id) {
    User user = new User();
    user.setUsername("tom");
    return user;
}
```

##### POST请求

- 添加用户

```java
	@Test
	public void whenCreateSuccess() throws Exception {
		
		Date date = new Date();
		System.out.println(date.getTime());
        //模拟前台发送的json数据，时间类型用时间戳传递，由前台决定保留哪些部分
		String content = "{\"username\":\"tom\",\"password\":null,\"birthday\":"+date.getTime()+"}";
		String reuslt = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(content))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value("1"))
				.andReturn().getResponse().getContentAsString();
		
		System.out.println(reuslt);
	}
```

```java
//@RequestBody:把前台传递的json串映射为一个对象
//@Valid：使用user对象中的校验参数注解
//BindingResult:当参数校验有异常时可以获取到异常信息
@PostMapping
@ApiOperation(value = "创建用户")
public User create(@Valid @RequestBody User user, BindingResult errors) {
    //如果有异常，打印所有异常
    if(errors.hasErrors()) {
        errors.getAllErrors().stream().forEach(error -> System.out.println(error.getDefaultMessage()));
    }

    System.out.println(user.getId());
    System.out.println(user.getUsername());
    System.out.println(user.getPassword());
    System.out.println(user.getBirthday());

    user.setId("1");
    return user;
}
```

```java
public class User {
    private String id;
    
    @NotBlank(message = "密码不能为空")
	private String password;
}
```

##### PUT请求

```java
@Test
public void whenUpdateSuccess() throws Exception {
	//用java8获取一年后的时间
    Date date = new Date(LocalDateTime.now().plusYears(1).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
    System.out.println(date.getTime());
    String content = "{\"id\":\"1\", \"username\":\"tom\",\"password\":null,\"birthday\":"+date.getTime()+"}";
    String reuslt = mockMvc.perform(put("/user/1").contentType(MediaType.APPLICATION_JSON_UTF8)
                                    .content(content))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value("1"))
        .andReturn().getResponse().getContentAsString();

    System.out.println(reuslt);
}
```

```java
@PutMapping("/{id:\\d+}")
public User update(@Valid @RequestBody User user, BindingResult errors) {
    //如果有异常，打印所有异常
    if(errors.hasErrors()) {
        errors.getAllErrors().stream().forEach(error -> System.out.println(error.getDefaultMessage()));
    }

    System.out.println(user.getId());
    System.out.println(user.getUsername());
    System.out.println(user.getPassword());
    System.out.println(user.getBirthday());

    user.setId("1");
    return user;
}
```

##### DELETE请求

```java
@Test
public void whenDeleteSuccess() throws Exception {
    mockMvc.perform(delete("/user/1")
                    .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
}
```

```java
@DeleteMapping("/{id:\\d+}")
public void delete(@PathVariable String id) {
    System.out.println(id);
}
```

##### upload请求

```java
@Test
public void whenUploadSuccess() throws Exception {
    String result = mockMvc.perform(fileUpload("/file")
                                    .file(new MockMultipartFile("file", "test.txt", "multipart/form-data", "hello upload".getBytes("UTF-8"))))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();
    System.out.println(result);
}
```

```java
@RestController
@RequestMapping("/file")
public class FileController {
	//文件上传路径
	private String folder = "/Users/zhailiang/Documents/my/muke/inaction/java/workspace/github/imooc-security-demo/src/main/java/com/imooc/web/controller";
	
    /**
    * 文件上传
    */
	@PostMapping
	public FileInfo upload(MultipartFile file) throws Exception {

		System.out.println(file.getName());
		System.out.println(file.getOriginalFilename());
		System.out.println(file.getSize());
		//根据路径和时间戳创建一个文件
		File localFile = new File(folder, new Date().getTime() + ".txt");
		//把内容写到文件里
		file.transferTo(localFile);
		//返回上传成功后文件的保存路径
		return localFile.getAbsolutePath();
	}
	/**
	* 文件下载
	*/
	@GetMapping("/{id}")
	public void download(@PathVariable String id, HttpServletRequest request, HttpServletResponse response) throws Exception {

		try (InputStream inputStream = new FileInputStream(new File(folder, id + ".txt"));
				OutputStream outputStream = response.getOutputStream();) {
			
			response.setContentType("application/x-download");
			response.addHeader("Content-Disposition", "attachment;filename=test.txt");
			
			IOUtils.copy(inputStream, outputStream);
			outputStream.flush();
		} 

	}

}
```



#### JsonView

- 使用这个注解的场景：当查询多个用户时不希望给前台显示密码，而在查询用户详情时需要展示密码
- 使用步骤：
- 使用接口来声明多个视图

```java
public class User {
	
	public interface UserSimpleView {};
	public interface UserDetailView extends UserSimpleView {};
    
    @JsonView(UserSimpleView.class)
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@JsonView(UserDetailView.class)
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
```



- 在值对象的get方法上指定视图
- 在Controller方法上指定视图

```java
//{id}:id可以是字符串，也可以是数字
//@RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
//正则表达式,接收的参数必须为数字：
@GetMapping("/user/{id:\\d+}")
@JsonView(User.UserDetailView.class)
public User getInfo(@PathVariable String id) {
    User user = new User();
    user.setUsername("tom");
    return user;
}
```



#### 自定义校验注解

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

/**
 * @author zhailiang
 *
 */
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MyConstraintValidator.class)
public @interface MyConstraint {
	
	String message();

	Class<?>[] groups() default { };

	Class<? extends Payload>[] payload() default { };

}
```

```java
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;

import com.imooc.service.HelloService;

/**
 * @author zhailiang
 *
 */
public class MyConstraintValidator implements ConstraintValidator<MyConstraint, Object> {

	//@Autowired
	//private HelloService helloService;
	
	@Override
	public void initialize(MyConstraint constraintAnnotation) {
        //初始化
		System.out.println("my validator init");
	}

	@Override
	public boolean isValid(Object value, ConstraintValidatorContext context) {
		//helloService.greeting("tom");
		//System.out.println(value);
        //执行校验逻辑，返回true为校验通过
		return true;
	}

}
```

```java
@MyConstraint(message = "这是一个测试")
private String username;
```

#### 控制器异常处理器

```java
public class UserNotExistException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6112780192479692859L;
	
	private String id;
	
	public UserNotExistException(String id) {
		super("user not exist");
		this.id = id;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}

```

```java
mport org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.imooc.exception.UserNotExistException;

/**
 * @author zhailiang
 *
 */
//在springboot的controller层主动抛出自定义异常时会进入这个类寻找处理方法
@ControllerAdvice
public class ControllerExceptionHandler {
	//指定自定义异常类
	@ExceptionHandler(UserNotExistException.class)
    //json形式返回
	@ResponseBody
    //服务器内部错误
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, Object> handleUserNotExistException(UserNotExistException ex) {
		Map<String, Object> result = new HashMap<>();
		result.put("id", ex.getId());
		result.put("message", ex.getMessage());
		return result;
	}

}
```

```java
@GetMapping("/{id:\\d+}")
@JsonView(User.UserDetailView.class)
public User getInfo(@ApiParam("用户id") @PathVariable String id) {
    throw new RuntimeException("user not exist");
    System.out.println("进入getInfo服务");
    User user = new User();
    user.setUsername("tom");
    return user;
}
```

#### RESTful拦截

##### 过滤器

- 使用springboot配置类来指定过滤器来拦截哪些URL,缺点是只能拿到request和response

```java
/**
 * 
 */
package com.imooc.web.filter;

import java.io.IOException;
import java.util.Date;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * @author zhailiang
 *
 */
//@Component不把过滤器声明为组件，用配置类去加载过滤器
public class TimeFilter implements Filter {

	/* (non-Javadoc)
	 * @see javax.servlet.Filter#destroy()
	 */
	@Override
	public void destroy() {
		System.out.println("time filter destroy");
	}

	/* (non-Javadoc)
	 * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse, javax.servlet.FilterChain)
	 */
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		System.out.println("time filter start");
		long start = new Date().getTime();
		chain.doFilter(request, response);
		System.out.println("time filter 耗时:"+ (new Date().getTime() - start));
		System.out.println("time filter finish");
	}

	/* (non-Javadoc)
	 * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
	 */
	@Override
	public void init(FilterConfig arg0) throws ServletException {
		System.out.println("time filter init");
	}

}

```

```java

@Configuration
public class WebConfig{

	@Bean
	public FilterRegistrationBean timeFilter() {
		
		FilterRegistrationBean registrationBean = new FilterRegistrationBean();
		
		TimeFilter timeFilter = new TimeFilter();
		registrationBean.setFilter(timeFilter);
		
		List<String> urls = new ArrayList<>();
		urls.add("/*");
		registrationBean.setUrlPatterns(urls);
		
		return registrationBean;
		
	}

}

```



##### 拦截器

- 缺点是不能获取到拦截方法的参数列表

```java
@Component
public class TimeInterceptor implements HandlerInterceptor {

	/* (non-Javadoc)
	 * @see 方法执行前调用
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		System.out.println("preHandle");
		//打印类名和方法名
		System.out.println(((HandlerMethod)handler).getBean().getClass().getName());
		System.out.println(((HandlerMethod)handler).getMethod().getName());
		
		request.setAttribute("startTime", new Date().getTime());
		return true;
	}

	/* (non-Javadoc)
	 * 方法执行完成后调用，抛出异常时不调用
	 */
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		System.out.println("postHandle");
		Long start = (Long) request.getAttribute("startTime");
		System.out.println("time interceptor 耗时:"+ (new Date().getTime() - start));

	}

	/* (non-Javadoc)
	 * @see 无论方法是否抛出错误都会执行
	 */
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println("afterCompletion");
		Long start = (Long) request.getAttribute("startTime");
		System.out.println("time interceptor 耗时:"+ (new Date().getTime() - start));
		System.out.println("ex is "+ex);

	}

}
```

```java
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {
	

	@Autowired
	private TimeInterceptor timeInterceptor;
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(timeInterceptor);
	}
}
```

##### 切面

- 可以获取到拦截方法的参数列表

```java
@Aspect
@Component
public class TimeAspect {
	
	@Around("execution(* com.imooc.web.controller.UserController.*(..))")
	public Object handleControllerMethod(ProceedingJoinPoint pjp) throws Throwable {
		
		System.out.println("time aspect start");
		//获取参数列表
		Object[] args = pjp.getArgs();
		for (Object arg : args) {
			System.out.println("arg is "+arg);
		}
		
		long start = new Date().getTime();
		//controller中拦截方法的返回值类型
		Object object = pjp.proceed();
		
		System.out.println("time aspect 耗时:"+ (new Date().getTime() - start));
		
		System.out.println("time aspect end");
		
		return object;
	}

}
```

##### 拦截顺序

- 方法进去：filter--->Interceptor--->ControllerAdvice--->Aspect--->Controller
- 方法退出：Controller--->Aspect--->ControllerAdvice--->Interceptor--->filter



#### 处理异步请求

- 通常我们的程序只有一个主线程，当并发量增大后性能就会下降

- DeferredResult：处理异步请求，使用多线程提高REST服务性能

- 当一个请求到达API接口，如果该API接口的return返回值是DeferredResult，在没有超时或者DeferredResult对象设置setResult时，接口不会返回，但是Servlet容器线程会结束，DeferredResult另起线程来进行结果处理(即这种操作提升了**服务短时间的吞吐能力**)，并setResult，如此以来这个请求不会占用服务连接池太久，如果超时或设置setResult，接口会立即返回

- 使用DeferredResult的流程：

  1. 1. 浏览器发起异步请求
     2. 请求到达服务端被挂起
     3. 向浏览器进行响应，分为两种情况：
        3.1 调用`DeferredResult.setResult()`，请求被唤醒，返回结果
        3.2 超时，返回一个你设定的结果
     4. 浏览得到响应，再次重复1，处理此次响应结果

```java
import org.springframework.web.context.request.async.DeferredResult;

@RestController
public class AsyncController {
	//消息队列
	@Autowired
	private MockQueue mockQueue;
	//自定义异步请求处理器
	@Autowired
	private DeferredResultHolder deferredResultHolder;
	
	private Logger logger = LoggerFactory.getLogger(getClass());
	
	@RequestMapping("/order")
	public DeferredResult<String> order() throws Exception {
		logger.info("主线程开始");
		//生成一个订单号
		String orderNumber = RandomStringUtils.randomNumeric(8);
        //放入消息队列
		mockQueue.setPlaceOrder(orderNumber);
		//创建一个异步请求处理结果
		DeferredResult<String> result = new DeferredResult<>();
		deferredResultHolder.getMap().put(orderNumber, result);
		
		return result;
		
	}

}
```

```java
/**
 * 
 */
package com.imooc.web.async;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * @author zhailiang
 *模拟消息队列
 */
@Component
public class MockQueue {
	//下单消息
	private String placeOrder;
	//完成消息
	private String completeOrder;
	
	private Logger logger = LoggerFactory.getLogger(getClass());

	public String getPlaceOrder() {
		return placeOrder;
	}

	public void setPlaceOrder(String placeOrder) throws Exception {
		new Thread(() -> {
			logger.info("接到下单请求, " + placeOrder);
			try {
                //代表开始处理订单任务
				Thread.sleep(1000);
			} catch (Exception e) {
				e.printStackTrace();
			}
            //订单任务处理完成
			this.completeOrder = placeOrder;
			logger.info("下单请求处理完毕," + placeOrder);
		}).start();
	}

	public String getCompleteOrder() {
		return completeOrder;
	}

	public void setCompleteOrder(String completeOrder) {
		this.completeOrder = completeOrder;
	}

}

```

```java
/**
 * 
 */
package com.imooc.web.async;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.async.DeferredResult;

/**
 * @author zhailiang
 *两个线程之间传递消息
 */
@Component
public class DeferredResultHolder {
	//key：字符串
    //value：异步消息结果
	private Map<String, DeferredResult<String>> map = new HashMap<String, DeferredResult<String>>();

	public Map<String, DeferredResult<String>> getMap() {
		return map;
	}

	public void setMap(Map<String, DeferredResult<String>> map) {
		this.map = map;
	}
	
}

```

```java
/**
 * 
 */
package com.imooc.web.async;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 * @author zhailiang
 *消息队列监听器
 */
@Component
public class QueueListener implements ApplicationListener<ContextRefreshedEvent> {

	@Autowired
	private MockQueue mockQueue;

	@Autowired
	private DeferredResultHolder deferredResultHolder;
	
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		new Thread(() -> {
			while (true) {
				//无限循环，消息队列中有值就开始处理，没值等待
				if (StringUtils.isNotBlank(mockQueue.getCompleteOrder())) {
					
					String orderNumber = mockQueue.getCompleteOrder();
					logger.info("返回订单处理结果:"+orderNumber);
                    //设置异步消息结果
					deferredResultHolder.getMap().get(orderNumber).setResult("place order success");
					mockQueue.setCompleteOrder(null);
					
				}else{
					try {
						Thread.sleep(100);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}

			}
		}).start();
	}
}

```

```
访问/order

结果：
主线程：AsyncController：主线程开始
Thread-10：MockQueue：接到下单请求，43692617
主线程：AsyncController：主线程返回
Thread-10：MockQueue：下单请求处理完毕，43692617
Thread-7：QueueListener：返回订单处理结果：43692617
```

#### Swagger生成文档

[Swagger](https://blog.csdn.net/sanyaoxu_2/article/details/80555328)

#### WireMock伪造REST服务


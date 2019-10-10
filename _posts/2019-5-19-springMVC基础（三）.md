---
layout: post
title: "springMVC基础（三）"
categories: springMVC
tags: springMVC
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### JSON

- 在方法上添加 @ResponseBody 注解
- `HttpMessageConverter<T>` 是 Spring3.0新添加的一个接  口，负责将请求信息转换为一个对象（类型为 T），将对象（  类型为 T）输出为响应信息

```java
	@RequestMapping("/testResponseEntity")
	public ResponseEntity<byte[]> testResponseEntity(HttpSession session) throws IOException{
		byte [] body = null;
		ServletContext servletContext = session.getServletContext();
		InputStream in = servletContext.getResourceAsStream("/files/abc.txt");
		body = new byte[in.available()];
		in.read(body);
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "attachment;filename=abc.txt");
		
		HttpStatus statusCode = HttpStatus.OK;
		
		ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(body, headers, statusCode);
		return response;
	}

```



### 文件上传

```java
	@RequestMapping("/testFileUpload")
	public String testFileUpload(@RequestParam("desc") String desc, 
			@RequestParam("file") MultipartFile file) throws IOException{
		System.out.println("desc: " + desc);
		System.out.println("OriginalFilename: " + file.getOriginalFilename());
		System.out.println("InputStream: " + file.getInputStream());
		return "success";
	}

```



### 拦截器

- 自定义的拦截器必  须实现HandlerInterceptor接口
- **preHandle**()：这个方法在业务处理器处理请求之前被调用，在该  方法中对用户请求request进行处理

- postHandle()：这个方法在业务处理器处理完请求后，但  是DispatcherServlet 向客户端返回响应前被调用，在该方法中对  用户请求request进行处理。

- **afterCompletion**()：这个方法**在** **DispatcherServlet** **完全处理完请  求后被调用**，可以在该方法中进行一些资源清理的操作

```java

public class FirstInterceptor implements HandlerInterceptor{

	/**
	 * 该方法在目标方法之前被调用.
	 * 若返回值为 true, 则继续调用后续的拦截器和目标方法. 
	 * 若返回值为 false, 则不会再调用后续的拦截器和目标方法. 
	 * 
	 * 可以考虑做权限. 日志, 事务等. 
	 */
	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		System.out.println("[FirstInterceptor] preHandle");
		return true;
	}

	/**
	 * 调用目标方法之后, 但渲染视图之前. 
	 * 可以对请求域中的属性或视图做出修改. 
	 */
	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		System.out.println("[FirstInterceptor] postHandle");
	}

	/**
	 * 渲染视图之后被调用. 释放资源
	 */
	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println("[FirstInterceptor] afterCompletion");
	}

}


```



### 异常处理

- Spring MVC 通过 **HandlerExceptionResolver** 处理程序  的异常，包括 Handler 映射、数据绑定以及目标方法执行  时发生的异常

```java
	/**
	 * 1. 在 @ExceptionHandler 方法的入参中可以加入 Exception 类型的参数, 该参数即对应发生的异常对象
	 * 2. @ExceptionHandler 方法的入参中不能传入 Map. 若希望把异常信息传导页面上, 需要使用 ModelAndView 作为返回值
	 * 3. @ExceptionHandler 方法标记的异常有优先级的问题. 
	 * 4. @ControllerAdvice: 如果在当前 Handler 中找不到 @ExceptionHandler 方法来出来当前方法出现的异常, 
	 * 则将去 @ControllerAdvice 标记的类中查找 @ExceptionHandler 标记的方法来处理异常. 
	 */
	@ExceptionHandler({ArithmeticException.class})
	public ModelAndView handleArithmeticException(Exception ex){
		System.out.println("出异常了: " + ex);
		ModelAndView mv = new ModelAndView("error");
		mv.addObject("exception", ex);
		return mv;
	}

```



- 全局异常处理

```java
@ControllerAdvice
public class SpringMVCTestExceptionHandler {

	@ExceptionHandler({ArithmeticException.class})
	public ModelAndView handleArithmeticException(Exception ex){
		System.out.println("----> 出异常了: " + ex);
		ModelAndView mv = new ModelAndView("error");
		mv.addObject("exception", ex);
		return mv;
	}
	
}

```



- @ResponseStatus

```java
@ResponseStatus(value=HttpStatus.FORBIDDEN, reason="用户名和密码不匹配!")
public class UserNameNotMatchPasswordException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	
}

```

```java
	@ResponseStatus(reason="测试",value=HttpStatus.NOT_FOUND)
	@RequestMapping("/testResponseStatusExceptionResolver")
	public String testResponseStatusExceptionResolver(@RequestParam("i") int i){
		if(i == 13){
			throw new UserNameNotMatchPasswordException();
		}
		System.out.println("testResponseStatusExceptionResolver...");
		
		return "success";
	}

```



#### 映射异常

```
	<!-- 配置使用 SimpleMappingExceptionResolver 来映射异常 -->
	<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
		<property name="exceptionAttribute" value="ex"></property>
		<property name="exceptionMappings">
			<props>
				<prop key="java.lang.ArrayIndexOutOfBoundsException">error</prop>
			</props>
		</property>
	</bean>	


```



#### 运行流程

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/mvc.png)
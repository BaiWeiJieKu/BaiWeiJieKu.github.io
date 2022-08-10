---
layout: post
title: "业务层框架spring(AOP)"
categories: spring
tags: spring
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### AOP

- AOP(Aspect-Oriented Programming, 面向切面编程):是一种新的方法论, 是对传统 OOP(Object-Oriented Programming, 面向对象编程) 的补充
- AOP 的主要编程对象是**切面**(aspect), 而**切面模块化横切关注点**
- 在应用 AOP 编程时, 仍然需要**定义**公共功能**, 但可以明确的定义这个功能在哪里, 以什么方式应用, **并且不必修改受影响的类. 这样一来横切关注点就被模块化到特殊的对象(切面)里
- 每个事物逻辑位于一个位置, 代码不分散, 便于维护和升级
- 业务模块更简洁, 只包含核心业务代码



#### 术语

- **切面(Aspect)**:  横切关注点(跨越应用程序多个模块的功能)被模块化的特殊对象
- **通知(Advice)**:  切面必须要完成的工作
- **目标(Target)**:被通知的对象
- **代理(Proxy)**: 向目标对象应用通知之后创建的对象
- **连接点（Joinpoint）**：程序执行的某个特定位置：如类某个方法调用前、调用后、方法抛出异常后等。连接点由两个信息确定：方法表示的程序执行点；相对点表示的方位。
- **切点（pointcut）**：每个类都拥有多个连接点，连接点是程序类中客观存在的事务。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件



#### 动态代理

- 接口

```java
package com.atguigu.spring.aop;

public interface ArithmeticCalculator {

	int add(int i, int j);
	int sub(int i, int j);
	
	int mul(int i, int j);
	int div(int i, int j);
	
}

```



- 实现类

```java
package com.atguigu.spring.aop;

import org.springframework.stereotype.Component;

public class ArithmeticCalculatorImpl implements ArithmeticCalculator {

	@Override
	public int add(int i, int j) {
		int result = i + j;
		return result;
	}

	@Override
	public int sub(int i, int j) {
		int result = i - j;
		return result;
	}

	@Override
	public int mul(int i, int j) {
		int result = i * j;
		return result;
	}

	@Override
	public int div(int i, int j) {
		int result = i / j;
		return result;
	}

}

```



- 动态代理

```java
package com.atguigu.spring.aop;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Arrays;

public class ArithmeticCalculatorLoggingProxy {
	
	//要代理的对象
	private ArithmeticCalculator target;
	
	public ArithmeticCalculatorLoggingProxy(ArithmeticCalculator target) {
		super();
		this.target = target;
	}

	//返回代理对象
	public ArithmeticCalculator getLoggingProxy(){
		ArithmeticCalculator proxy = null;
		//获取类加载器,代理对象由哪一个类加载器负责加载
		ClassLoader loader = target.getClass().getClassLoader();
        //理对象的类型，即其中有哪些方法
		Class [] interfaces = new Class[]{ArithmeticCalculator.class};
        //当调用代理对象中的方法时，该执行带的代码
		InvocationHandler h = new InvocationHandler() {
			/**
			 * proxy: 代理对象。 一般不使用该对象
			 * method: 正在被调用的方法
			 * args: 调用方法传入的参数
			 */
			@Override
			public Object invoke(Object proxy, Method method, Object[] args)
					throws Throwable {
				String methodName = method.getName();
				//打印日志
				System.out.println("[before] The method " + methodName + " begins with " + Arrays.asList(args));
				
				//调用目标方法
				Object result = null;
				
				try {
					//前置通知
					result = method.invoke(target, args);
					//返回通知, 可以访问到方法的返回值
				} catch (NullPointerException e) {
					e.printStackTrace();
					//异常通知, 可以访问到方法出现的异常
				}
				
				//后置通知. 因为方法可以能会出异常, 所以访问不到方法的返回值
				
				//打印日志
				System.out.println("[after] The method ends with " + result);
				
				return result;
			}
		};
		
		/**创建实现类的一个动态代理
		 * loader: 代理对象使用的类加载器。 
		 * interfaces: 指定代理对象的类型. 即代理代理对象中可以有哪些方法. 
		 * h: 当具体调用代理对象的方法时, 应该如何进行响应, 实际上就是调用 InvocationHandler 的 invoke 方法
		 */
		proxy = (ArithmeticCalculator) Proxy.newProxyInstance(loader, interfaces, h);
		
		return proxy;
	}
}

```



- 测试

```java
package com.qinfen.entity;

public class Test {
	public static void main(String[] args) {
		
		ArithmeticCalculator arithmeticCalculator = new ArithmeticCalculatorImpl();
		
		arithmeticCalculator = 
				new ArithmeticCalculatorLoggingProxy(arithmeticCalculator).getLoggingProxy();
		
		int result = arithmeticCalculator.add(11, 12);
		System.out.println("result:" + result);
		
		result = arithmeticCalculator.div(21, 3);
		System.out.println("result:" + result);
	}
}

```

```
[before] The method add begins with [11, 12]
[after] The method ends with 23
result:23
[before] The method div begins with [21, 3]
[after] The method ends with 7
result:7
```



#### AspectJ

- 要在 Spring 应用中使用 AspectJ 注解, 必须在 classpath 下包含 AspectJ 类库: aopalliance.jar、aspectj.weaver.jar 和 spring-aspects.jar
- 将 aop Schema 添加到 `<beans> `根元素中
- 要在 Spring IOC 容器中启用 AspectJ 注解支持, 只要在 Bean 配置文件中定义一个空的
  XML 元素 `<aop:aspectj-autoproxy>`
- 当 SpringIOC 容器侦测到 Bean 配置文件中的 `<aop:aspectj-autoproxy> `元素时, 会自动为与 AspectJ 切面匹配的 Bean 创建代理
- 要在 Spring 中声明 AspectJ 切面, 只需要在 IOC 容器中将切面声明为 Bean 实例. 当在 SpringIOC 容器中初始化 AspectJ 切面之后, SpringIOC 容器就会为那些与 AspectJ 切面相匹配的 Bean 创建代理
- 在 AspectJ 注解中, 切面只是一个带有 @Aspect 注解的 Java 类
- AspectJ 支持 5 种类型的通知注解:①**@Before:** 前置通知, 在方法执行之前执行②**@After:** 后置通知, 在方法执行之后执行 ③**@AfterRunning**: 返回通知, 在方法返回结果之后执行④**@AfterThrowing**: 异常通知, 在方法抛出异常之后⑤**@Around**: 环绕通知, 围绕着方法执行



#### 前置通知

- 声明切面

```java
package com.atguigu.spring.aop;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

/**
 * AOP 的 helloWorld
 * 1. 加入 jar 包
 * com.springsource.net.sf.cglib-2.2.0.jar
 * com.springsource.org.aopalliance-1.0.0.jar
 * com.springsource.org.aspectj.weaver-1.6.8.RELEASE.jar
 * spring-aspects-4.0.0.RELEASE.jar
 * 
 * 2. 在 Spring 的配置文件中加入 aop 的命名空间。 
 * 
 * 3. 基于注解的方式来使用 AOP
 * 3.1 在配置文件中配置自动扫描的包: <context:component-scan base-package="com.atguigu.spring.aop"></context:component-scan>
 * 3.2 加入使 AspjectJ 注解起作用的配置: <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
 * 为匹配的类自动生成动态代理对象. 
 * 
 * 4. 编写切面类: 
 * 4.1 一个一般的 Java 类
 * 4.2 在其中添加要额外实现的功能. 
 *
 * 5. 配置切面
 * 5.1 切面必须是 IOC 中的 bean: 实际添加了 @Component 注解
 * 5.2 声明是一个切面: 添加 @Aspect
 * 5.3 声明通知: 即额外加入功能对应的方法. 
 * 5.3.1 前置通知: @Before("execution(public int com.atguigu.spring.aop.ArithmeticCalculator.*(int, int))")
 * @Before 表示在目标方法执行之前执行 @Before 标记的方法的方法体. 
 * @Before 里面的是切入点表达式: 
 * 
 * 6. 在通知中访问连接细节: 可以在通知方法中添加 JoinPoint 类型的参数, 从中可以访问到方法的签名和方法的参数. 
 * 
 * 7. @After 表示后置通知: 在方法执行之后执行的代码. 
 */

//通过添加 @Aspect 注解声明一个 bean 是一个切面!
@Aspect
@Component
public class LoggingAspect {

	@Before("execution(public int com.atguigu.spring.aop.ArithmeticCalculator.*(int, int))")
	public void beforeMethod(JoinPoint joinPoint){
        //获取方法名
		String methodName = joinPoint.getSignature().getName();
        //获取方法参数
		Object [] args = joinPoint.getArgs();
		
		System.out.println("The method " + methodName + " begins with " + Arrays.asList(args));
	}
	
	@After("execution(* com.atguigu.spring.aop.*.*(..))")
	public void afterMethod(JoinPoint joinPoint){
		String methodName = joinPoint.getSignature().getName();
		System.out.println("The method " + methodName + " ends");
	}
	
}

```

```
方法签名

execution(* *.*(..))
切点表达式表示执行任意类的任意方法. 第一个 * 代表匹配任意修饰符及任意返回值,  第二个 * 代表任意类的对象,
第三个 * 代表任意方法, 参数列表中的 ..  匹配任意数量的参数

execution * com.atguigu.spring.ArithmeticCalculator.*(..): 
匹配 ArithmeticCalculator 中声明的所有方法,第一个 * 代表任意修饰符及任意返回值. 第二个 * 代表任意方法. .. 匹配任意数量的参数. 若目标类与接口与该切面在同一个包中, 可以省略包名

execution public * ArithmeticCalculator.*(..):
匹配 ArithmeticCalculator 接口的所有公有方法

execution public double ArithmeticCalculator.*(..): 
匹配 ArithmeticCalculator 中返回 double 类型数值的方法

execution public double ArithmeticCalculator.*(double, ..):
匹配第一个参数为 double 类型的方法, .. 匹配任意数量任意类型的参数

execution public double ArithmeticCalculator.*(double, double): 
匹配参数类型为 double, double 类型的方法
```



- ApplicationContext.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-4.0.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">

	<!-- 自动扫描的包 -->
	<context:component-scan base-package="com.atguigu.spring.aop"></context:component-scan>

	<!-- 使 AspectJ 的注解起作用 -->
	<aop:aspectj-autoproxy></aop:aspectj-autoproxy>

</beans>
```



- 测试与动态代理相同



#### 后置通知

- 后置通知是在连接点完成之后执行的, 即连接点返回结果或者抛出异常的时候, 下面的后置通知记录了方法的终止

```java
/**
* 在方法执行之后执行的代码. 无论该方法是否出现异常
*/
@After("declareJointPointExpression()")
public void afterMethod(JoinPoint joinPoint){
    String methodName = joinPoint.getSignature().getName();
    System.out.println("The method " + methodName + " ends");
}

```



#### 返回通知

- 无论连接点是正常返回还是抛出异常, 后置通知都会执行. 如果只想在连接点返回的时候记录日志, 应使用返回通知代替后置通知
- 在返回通知中, 只要将 **returning** 属性添加到 @AfterReturning 注解中, 就可以访问连接点的返回值. 该属性的值即为用来传入返回值的参数名称
- 必须在通知方法的签名中添加一个**同名参数**. 在运行时, Spring AOP 会通过这个参数传递返回值
- 原始的切点表达式需要出现在 pointcut 属性中

```java
	/**
	 * 在方法法正常结束受执行的代码
	 * 返回通知是可以访问到方法的返回值的!
	 */
	@AfterReturning(value="declareJointPointExpression()",
			returning="result")
	public void afterReturning(JoinPoint joinPoint, Object result){
		String methodName = joinPoint.getSignature().getName();
		System.out.println("The method " + methodName + " ends with " + result);
	}

```



#### 异常通知

- 只在连接点抛出异常时才执行异常通知
- 将 throwing 属性添加到 @AfterThrowing 注解中, 也可以访问连接点抛出的异常. Throwable 是所有错误和异常类的超类. 所以在异常通知方法可以捕获到任何错误和异常
- 如果只对某种特殊的异常类型感兴趣, 可以将参数声明为其他异常的参数类型. 然后通知就只在抛出这个类型及其子类的异常时才被执行

```java
/**
* 在目标方法出现异常时会执行的代码.
* 可以访问到异常对象; 且可以指定在出现特定异常时在执行通知代码
*/
@AfterThrowing(value="declareJointPointExpression()",
throwing="e")
public void afterThrowing(JoinPoint joinPoint, Exception e){
    String methodName = joinPoint.getSignature().getName();
    System.out.println("The method " + methodName + " occurs excetion:" + e);
}

```



#### 环绕通知

- 环绕通知是所有通知类型中功能最为强大的, 能够全面地控制连接点. 甚至**可以控制是否执行连接点**
- 对于环绕通知来说, 连接点的参数类型必须是 ProceedingJoinPoint . 它是 JoinPoint 的子接口, 允许控制何时执行, 是否执行连接点
- 在环绕通知中需要明确调用 ProceedingJoinPoint 的 proceed()方法来执行被代理的方法. 如果忘记这样做就会导致通知被执行了, 但目标方法没有被执行
- 注意: 环绕通知的方法需要返回目标方法执行之后的结果, 即调用 joinPoint.proceed(); 的返回值, 否则会出现空指针异常

```java
	/**
	 * 环绕通知需要携带 ProceedingJoinPoint 类型的参数. 
	 * 环绕通知类似于动态代理的全过程: ProceedingJoinPoint 类型的参数可以决定是否执行目标方法.
	 * 且环绕通知必须有返回值, 返回值即为目标方法的返回值
	 */
	@Around("execution(public int com.atguigu.spring.aop.ArithmeticCalculator.*(..))")
	public Object aroundMethod(ProceedingJoinPoint pjd){
		
		Object result = null;
		String methodName = pjd.getSignature().getName();
		
		try {
			//前置通知
			System.out.println("The method " + methodName + " begins with " + Arrays.asList(pjd.getArgs()));
			//执行目标方法
			result = pjd.proceed();
			//返回通知
			System.out.println("The method " + methodName + " ends with " + result);
		} catch (Throwable e) {
			//异常通知
			System.out.println("The method " + methodName + " occurs exception:" + e);
			throw new RuntimeException(e);
		}
		//后置通知
		System.out.println("The method " + methodName + " ends");
		
		return result;
	}
	

```



#### 切面优先

- 在同一个连接点上应用不止一个切面时, 除非明确指定, 否则它们的优先级是不确定的
- 切面的优先级可以通过实现 Ordered 接口或利用 @Order 注解指定
- 实现 Ordered 接口, getOrder() 方法的返回值越小, 优先级越高
- 若使用 @Order 注解, 序号出现在注解中

```java
**
 * 可以使用 @Order 注解指定切面的优先级, 值越小优先级越高
 */
@Order(2)
@Aspect
@Component
public class LoggingAspect {
}
```



#### 重用切入点

- 在 AspectJ 切面中, 可以通过 @Pointcut 注解将一个切入点声明成简单的方法. 切入点的方法体通常是空的, 因为将切入点定义与应用程序逻辑混在一起是不合理的
- 切入点方法的访问控制符同时也控制着这个切入点的可见性
- 其他通知可以通过方法名称引入该切入点

```java
/**
 * 可以使用 @Order 注解指定切面的优先级, 值越小优先级越高
 */
@Order(2)
@Aspect
@Component
public class LoggingAspect {
	
	/**
	 * 定义一个方法, 用于声明切入点表达式. 一般地, 该方法中再不需要添入其他的代码. 
	 * 使用 @Pointcut 来声明切入点表达式. 
	 * 后面的其他通知直接使用方法名来引用当前的切入点表达式. 
	 */
	@Pointcut("execution(public int com.atguigu.spring.aop.ArithmeticCalculator.*(..))")
	public void declareJointPointExpression(){}
	
	/**
	 * 在 com.atguigu.spring.aop.ArithmeticCalculator 接口的每一个实现类的每一个方法开始之前执行一段代码
	 */
	@Before("declareJointPointExpression()")
	public void beforeMethod(JoinPoint joinPoint){
		String methodName = joinPoint.getSignature().getName();
		Object [] args = joinPoint.getArgs();
		
		System.out.println("The method " + methodName + " begins with " + Arrays.asList(args));
	}
}
```

```java
@Order(1)
@Aspect
@Component
public class VlidationAspect {

	@Before("com.atguigu.spring.aop.LoggingAspect.declareJointPointExpression()")
	public void validateArgs(JoinPoint joinPoint){
		System.out.println("-->validate:" + Arrays.asList(joinPoint.getArgs()));
	}
	
}

```



#### xml配置

- 切面

```java
package com.atguigu.spring.aop.xml;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;

public class LoggingAspect {
	
	public void beforeMethod(JoinPoint joinPoint){
		String methodName = joinPoint.getSignature().getName();
		Object [] args = joinPoint.getArgs();
		
		System.out.println("The method " + methodName + " begins with " + Arrays.asList(args));
	}
	
	public void afterMethod(JoinPoint joinPoint){
		String methodName = joinPoint.getSignature().getName();
		System.out.println("The method " + methodName + " ends");
	}
	
	public void afterReturning(JoinPoint joinPoint, Object result){
		String methodName = joinPoint.getSignature().getName();
		System.out.println("The method " + methodName + " ends with " + result);
	}
	
	public void afterThrowing(JoinPoint joinPoint, Exception e){
		String methodName = joinPoint.getSignature().getName();
		System.out.println("The method " + methodName + " occurs excetion:" + e);
	}
	
	@Around("execution(public int com.atguigu.spring.aop.ArithmeticCalculator.*(..))")
	public Object aroundMethod(ProceedingJoinPoint pjd){
		
		Object result = null;
		String methodName = pjd.getSignature().getName();
		
		try {
			//前置通知
			System.out.println("The method " + methodName + " begins with " + Arrays.asList(pjd.getArgs()));
			//执行目标方法
			result = pjd.proceed();
			//返回通知
			System.out.println("The method " + methodName + " ends with " + result);
		} catch (Throwable e) {
			//异常通知
			System.out.println("The method " + methodName + " occurs exception:" + e);
			throw new RuntimeException(e);
		}
		//后置通知
		System.out.println("The method " + methodName + " ends");
		
		return result;
	}
}

```

```java
package com.atguigu.spring.aop.xml;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;

public class VlidationAspect {

	public void validateArgs(JoinPoint joinPoint){
		System.out.println("-->validate:" + Arrays.asList(joinPoint.getArgs()));
	}
	
}

```



- ApplicationContext-xml.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-4.0.xsd">

	<!-- 配置 bean -->
	<bean id="arithmeticCalculator" 
		class="com.atguigu.spring.aop.xml.ArithmeticCalculatorImpl"></bean>

	<!-- 配置切面的 bean. -->
	<bean id="loggingAspect"
		class="com.atguigu.spring.aop.xml.LoggingAspect"></bean>

	<bean id="vlidationAspect"
		class="com.atguigu.spring.aop.xml.VlidationAspect"></bean>

	<!-- 配置 AOP -->
	<aop:config>
		<!-- 配置切点表达式 -->
		<aop:pointcut expression="execution(* com.atguigu.spring.aop.xml.ArithmeticCalculator.*(int, int))" 
			id="pointcut"/>
		<!-- 配置切面及通知 -->
		<aop:aspect ref="loggingAspect" order="2">
			<aop:before method="beforeMethod" pointcut-ref="pointcut"/>
			<aop:after method="afterMethod" pointcut-ref="pointcut"/>
			<aop:after-throwing method="afterThrowing" pointcut-ref="pointcut" throwing="e"/>
			<aop:after-returning method="afterReturning" pointcut-ref="pointcut" returning="result"/>
			<!--  
			<aop:around method="aroundMethod" pointcut-ref="pointcut"/>
			-->
		</aop:aspect>	
		<aop:aspect ref="vlidationAspect" order="1">
			<aop:before method="validateArgs" pointcut-ref="pointcut"/>
		</aop:aspect>
	</aop:config>

</beans>

```



- 测试

```java
package com.atguigu.spring.aop.xml;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
	
	public static void main(String[] args) {
		
		ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext-xml.xml");
		ArithmeticCalculator arithmeticCalculator = (ArithmeticCalculator) ctx.getBean("arithmeticCalculator");
		
		System.out.println(arithmeticCalculator.getClass().getName());
		
		int result = arithmeticCalculator.add(1, 2);
		System.out.println("result:" + result);
		
		result = arithmeticCalculator.div(1000, 0);
		System.out.println("result:" + result);
	}
	
}

```


---
layout: post
title: "struts2（整合spring）"
categories: struts2
tags: struts2
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 步骤

```properties
1). 整合目标 ? 使 IOC 容器来管理 Struts2 的 Action!

2). 如何进行整合 ? 

①. 正常加入 Struts2

②. 在 Spring 的 IOC 容器中配置 Struts2 的 Action
注意: 在 IOC 容器中配置 Struts2 的 Action 时, 需要配置 scope 属性, 其值必须为 prototype

<bean id="personAction" 
	class="com.atguigu.spring.struts2.actions.PersonAction"
	scope="prototype">
	<property name="personService" ref="personService"></property>	
</bean>

③. 配置 Struts2 的配置文件: action 节点的 class 属性需要指向 IOC 容器中该 bean 的 id

<action name="person-save" class="personAction">
	<result>/success.jsp</result>
</action> 

④. 加入 struts2-spring-plugin-2.3.15.3.jar

3). 整合原理: 通过添加 struts2-spring-plugin-2.3.15.3.jar 以后, Struts2 会先从 IOC 容器中
获取 Action 的实例.

if (appContext.containsBean(beanName)) {
    o = appContext.getBean(beanName);
} else {
    Class beanClazz = getClassInstance(beanName);
    o = buildBean(beanClazz, extraContext);
}
```



### 配置文件

- web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://java.sun.com/xml/ns/javaee" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" id="WebApp_ID" version="2.5">

	<!-- 配置 Spring 配置文件的名称和位置 -->
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>classpath:applicationContext.xml</param-value>
	</context-param>
	
	<!-- 启动 IOC 容器的 ServletContextListener -->
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>
	
	<!-- 配置 Struts2 的 Filter -->
	<filter>
        <filter-name>struts2</filter-name>
        <filter-class>org.apache.struts2.dispatcher.ng.filter.StrutsPrepareAndExecuteFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>struts2</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

</web-app>
```



- appliationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
 
<!-- 引入的Spring的约束，已经很全了 -->
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xmlns:tx="http://www.springframework.org/schema/tx"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context.xsd
    http://www.springframework.org/schema/aop
    http://www.springframework.org/schema/aop/spring-aop.xsd
    http://www.springframework.org/schema/tx
    http://www.springframework.org/schema/tx/spring-tx.xsd">
 
	<!-- 开启注解扫描 -->
    <context:component-scan base-package="com.ssh">  
        <!-- 不扫描controller包下的UserController类，既去除注解   -->
        <!-- <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/> -->  
    </context:component-scan>
    
    <!-- userDao -->
    <!-- <bean id="userDao" class="com.ssh.dao.UserDao"></bean> -->
 
    <!-- userService -->
    <!-- <bean id="userService" class="com.ssh.service.UserService">
        <property name="userDao" ref="userDao"></property>
    </bean> -->
    
    <!-- 配置action的对象 -->
    <!-- 注意action是多实例的，因此我们这里把scope配置为prototype的 -->
    <!-- <bean id="userAction" class="com.ssh.action.UserAction" scope="prototype">
        <property name="userService" ref="userService"></property>
    </bean> -->
     
 
</beans>
```



- struts.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
 
<!DOCTYPE struts PUBLIC
    "-//Apache Software Foundation//DTD Struts Configuration 2.3//EN"
    "http://struts.apache.org/dtds/struts-2.3.dtd">
 
<struts>
	<!-- 在struts.xml中指定objectFactory对象工厂为spring，即action的创建交由spring进行 -->
	<constant name="struts.objectFactory" value="spring"/>
	
	<package name="demo1" extends="struts-default" namespace="/">
        <!-- class属性是从Spring IoC中获取的 -->
        <action name="userAction" class="userAction">
        </action>
 
    </package>
</struts>
```



### dao

```java
package com.ssh.dao;
 
import org.springframework.stereotype.Repository;
 
@Repository 
public class UserDao {
 
    public void add() {
        System.out.println("userDao ......");
    }
 
}
```



### service

```java
package com.ssh.service;
 
import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import com.ssh.dao.UserDao;
 
//@Service(value="userService")--value="userService"可不要，因为UserServiece的默认bean的name为小写字母开头的类名
@Service
public class UserService {
	
    @Resource
    private UserDao userDao;
 
    public UserDao getUserDao() {
        return userDao;
    }
 
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
 
    public void add() {
        System.out.println("userService ......");
        userDao.add();
    }
 
}
```



### action

```java
package com.ssh.action;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
 
import com.opensymphony.xwork2.ActionSupport;
import com.ssh.service.UserService;
 
@Controller
@Scope("prototype")
public class UserAction extends ActionSupport {
	
    @Autowired
    private UserService userService;
 
    public UserService getUserService() {
        return userService;
    }
 
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
 
    @Override
    public String execute() throws Exception {
 
        System.out.println("userAction .......");
        // 调用userService中方法发
        userService.add();
 
        return NONE;    // 表示返回到任何页面中去
    }
 
}
```


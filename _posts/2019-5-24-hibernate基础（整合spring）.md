---
layout: post
title: "hibernate基础（整合spring）"
categories: hibernate
tags: hibernate
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 总体流程

```properties
1. Spring 整合 Hibernate 整合什么 ?

1). 有 IOC 容器来管理 Hibernate 的 SessionFactory
2). 让 Hibernate 使用上 Spring 的声明式事务

2. 整合步骤:

1). 加入 hibernate
①. jar 包
②. 添加 hibernate 的配置文件: hibernate.cfg.xml
③. 编写了持久化类对应的 .hbm.xml 文件。 

2). 加入 Spring
①. jar 包
②. 加入 Spring 的配置文件

3). 整合.

3. 编写代码
```



### 配置文件

#### applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:tx="http://www.springframework.org/schema/tx"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xsi:schemaLocation="http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-4.0.xsd
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">
	
	<!-- 配置自动扫描的包 -->
	<context:component-scan base-package="com.atguigu.spring.hibernate"></context:component-scan>
	
	<!-- 配置数据源 -->
	<!-- 导入资源文件 -->
	<context:property-placeholder location="classpath:db.properties"/>
	
	<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="user" value="${jdbc.user}"></property>
		<property name="password" value="${jdbc.password}"></property>
		<property name="driverClass" value="${jdbc.driverClass}"></property>
		<property name="jdbcUrl" value="${jdbc.jdbcUrl}"></property>

		<property name="initialPoolSize" value="${jdbc.initPoolSize}"></property>
		<property name="maxPoolSize" value="${jdbc.maxPoolSize}"></property>
	</bean>
	
	<!-- 配置 Hibernate 的 SessionFactory 实例: 通过 Spring 提供的 LocalSessionFactoryBean 进行配置 -->
	<bean id="sessionFactory" class="org.springframework.orm.hibernate4.LocalSessionFactoryBean">
		<!-- 配置数据源属性 -->
		<property name="dataSource" ref="dataSource"></property>
		<!-- 配置 hibernate 配置文件的位置及名称 -->
		<!--  
		<property name="configLocation" value="classpath:hibernate.cfg.xml"></property>
		-->
		<!-- 使用 hibernateProperties 属相来配置 Hibernate 原生的属性 -->
		<property name="hibernateProperties">
			<props>
				<prop key="hibernate.dialect">org.hibernate.dialect.MySQL5InnoDBDialect</prop>
				<prop key="hibernate.show_sql">true</prop>
				<prop key="hibernate.format_sql">true</prop>
				<prop key="hibernate.hbm2ddl.auto">update</prop>
			</props>
		</property>
		<!-- 配置 hibernate 映射文件的位置及名称, 可以使用通配符 -->
		<property name="mappingLocations" 
			value="classpath:com/atguigu/spring/hibernate/entities/*.hbm.xml"></property>
	</bean>

	<!-- 配置 Spring 的声明式事务 -->
	<!-- 1. 配置事务管理器 -->
	<bean id="transactionManager" class="org.springframework.orm.hibernate4.HibernateTransactionManager">
		<property name="sessionFactory" ref="sessionFactory"></property>
	</bean>

	<!-- 2. 配置事务属性, 需要事务管理器 -->
	<tx:advice id="txAdvice" transaction-manager="transactionManager">
		<tx:attributes>
			<tx:method name="get*" read-only="true"/>
			<tx:method name="purchase" propagation="REQUIRES_NEW"/>
			<tx:method name="*"/>
		</tx:attributes>
	</tx:advice>

	<!-- 3. 配置事务切点, 并把切点和事务属性关联起来 -->
	<aop:config>
		<aop:pointcut expression="execution(* com.atguigu.spring.hibernate.service.*.*(..))" 
			id="txPointcut"/>
		<aop:advisor advice-ref="txAdvice" pointcut-ref="txPointcut"/>
	</aop:config>

</beans>

```



#### db.properties

```properties
jdbc.user=root
jdbc.password=1230
jdbc.driverClass=com.mysql.jdbc.Driver
jdbc.jdbcUrl=jdbc:mysql:///spring7

jdbc.initPoolSize=5
jdbc.maxPoolSize=10
#...
```



#### hibernate.cfg.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
		"-//Hibernate/Hibernate Configuration DTD 3.0//EN"
		"http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
    
    	<!-- 配置 hibernate 的基本属性 -->
    	<!-- 1. 数据源需配置到 IOC 容器中, 所以在此处不再需要配置数据源 -->
    	<!-- 2. 关联的 .hbm.xml 也在 IOC 容器配置 SessionFactory 实例时在进行配置 -->
    	<!-- 3. 配置 hibernate 的基本属性: 方言, SQL 显示及格式化, 生成数据表的策略以及二级缓存等. -->
    	<property name="hibernate.dialect">org.hibernate.dialect.MySQL5InnoDBDialect</property>

		<property name="hibernate.show_sql">true</property>
		<property name="hibernate.format_sql">true</property>
		
		<property name="hibernate.hbm2ddl.auto">update</property>
		
		<!-- 配置 hibernate 二级缓存相关的属性. -->
		    	
    </session-factory>
</hibernate-configuration>

```



### beans

```java
package com.atguigu.spring.hibernate.entities;

public class Book {

	private Integer id;
	private String bookName;
	private String isbn;
	private int price;
	private int stock;

//get set

}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">

<hibernate-mapping>
    <class name="com.atguigu.spring.hibernate.entities.Book" table="SH_BOOK">
    
        <id name="id" type="java.lang.Integer">
            <column name="ID" />
            <generator class="native" />
        </id>
        
        <property name="bookName" type="java.lang.String">
            <column name="BOOK_NAME" />
        </property>
        
        <property name="isbn" type="java.lang.String">
            <column name="ISBN" />
        </property>
        
        <property name="price" type="int">
            <column name="PRICE" />
        </property>
        
        <property name="stock" type="int">
            <column name="STOCK" />
        </property>
        
    </class>
</hibernate-mapping>

```



```java
package com.atguigu.spring.hibernate.entities;

public class Account {

	private Integer id;
	private String username;
	private int balance;

//get set

}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">

<hibernate-mapping>
    <class name="com.atguigu.spring.hibernate.entities.Account" table="SH_ACCOUNT">
        
        <id name="id" type="java.lang.Integer">
            <column name="ID" />
            <generator class="native" />
        </id>
        
        <property name="username" type="java.lang.String">
            <column name="USERNAME" />
        </property>
        
        <property name="balance" type="int">
            <column name="BALANCE" />
        </property>
        
    </class>
</hibernate-mapping>

```



### dao

```java
package com.atguigu.spring.hibernate.dao;

public interface BookShopDao {

	//根据书号获取书的单价
	public int findBookPriceByIsbn(String isbn);
	
	//更新数的库存. 使书号对应的库存 - 1
	public void updateBookStock(String isbn);
	
	//更新用户的账户余额: 使 username 的 balance - price
	public void updateUserAccount(String username, int price);
}

```



#### impl

```java
package com.atguigu.spring.hibernate.dao.impl;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.atguigu.spring.hibernate.dao.BookShopDao;
import com.atguigu.spring.hibernate.exceptions.BookStockException;
import com.atguigu.spring.hibernate.exceptions.UserAccountException;

@Repository
public class BookShopDaoImpl implements BookShopDao {
	
	@Autowired
	private SessionFactory sessionFactory;
	
	//不推荐使用 HibernateTemplate 和 HibernateDaoSupport
	//因为这样会导致 Dao 和 Spring 的 API 进行耦合
	//可以移植性变差
//	private HibernateTemplate hibernateTemplate;
	
	//获取和当前线程绑定的 Session. 
	private Session getSession(){
		return sessionFactory.getCurrentSession();
	}

	@Override
	public int findBookPriceByIsbn(String isbn) {
		String hql = "SELECT b.price FROM Book b WHERE b.isbn = ?";
		Query query = getSession().createQuery(hql).setString(0, isbn);
		return (Integer)query.uniqueResult();
	}

	@Override
	public void updateBookStock(String isbn) {
		//验证书的库存是否充足. 
		String hql2 = "SELECT b.stock FROM Book b WHERE b.isbn = ?";
		int stock = (int) getSession().createQuery(hql2).setString(0, isbn).uniqueResult();
		if(stock == 0){
			throw new BookStockException("库存不足!");
		}
		
		String hql = "UPDATE Book b SET b.stock = b.stock - 1 WHERE b.isbn = ?";
		getSession().createQuery(hql).setString(0, isbn).executeUpdate();
	}

	@Override
	public void updateUserAccount(String username, int price) {
		//验证余额是否足够
		String hql2 = "SELECT a.balance FROM Account a WHERE a.username = ?";
		int balance = (int) getSession().createQuery(hql2).setString(0, username).uniqueResult();
		if(balance < price){
			throw new UserAccountException("余额不足!");
		}
		
		String hql = "UPDATE Account a SET a.balance = a.balance - ? WHERE a.username = ?";
		getSession().createQuery(hql).setInteger(0, price).setString(1, username).executeUpdate();
	}

}

```



### service

```java
package com.atguigu.spring.hibernate.service;

public interface BookShopService {
	
	public void purchase(String username, String isbn);
	
}

```

```java
package com.atguigu.spring.hibernate.service;

import java.util.List;

public interface Cashier {

	public void checkout(String username, List<String> isbns);
	
}

```



#### impl

```java
package com.atguigu.spring.hibernate.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.spring.hibernate.dao.BookShopDao;
import com.atguigu.spring.hibernate.service.BookShopService;

@Service
public class BookShopServiceImpl implements BookShopService {

	@Autowired
	private BookShopDao bookShopDao;
	
	/**
	 * Spring hibernate 事务的流程
	 * 1. 在方法开始之前
	 * ①. 获取 Session
	 * ②. 把 Session 和当前线程绑定, 这样就可以在 Dao 中使用 SessionFactory 的
	 * getCurrentSession() 方法来获取 Session 了
	 * ③. 开启事务
	 * 
	 * 2. 若方法正常结束, 即没有出现异常, 则
	 * ①. 提交事务
	 * ②. 使和当前线程绑定的 Session 解除绑定
	 * ③. 关闭 Session
	 * 
	 * 3. 若方法出现异常, 则:
	 * ①. 回滚事务
	 * ②. 使和当前线程绑定的 Session 解除绑定
	 * ③. 关闭 Session
	 */
	@Override
	public void purchase(String username, String isbn) {
		int price = bookShopDao.findBookPriceByIsbn(isbn);
		bookShopDao.updateBookStock(isbn);
		bookShopDao.updateUserAccount(username, price);
	}

}

```

```java
package com.atguigu.spring.hibernate.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.spring.hibernate.service.BookShopService;
import com.atguigu.spring.hibernate.service.Cashier;

@Service
public class CashierImpl implements Cashier{
	
	@Autowired
	private BookShopService bookShopService;
	
	@Override
	public void checkout(String username, List<String> isbns) {
		for(String isbn:isbns){
			bookShopService.purchase(username, isbn);
		}
	}

}

```



### exception

```java
package com.atguigu.spring.hibernate.exceptions;

public class UserAccountException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public UserAccountException() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserAccountException(String message, Throwable cause,
			boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
		// TODO Auto-generated constructor stub
	}

	public UserAccountException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

	public UserAccountException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	public UserAccountException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	
	
}

```

```java
package com.atguigu.spring.hibernate.exceptions;

public class BookStockException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public BookStockException() {
		super();
		// TODO Auto-generated constructor stub
	}

	public BookStockException(String message, Throwable cause,
			boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
		// TODO Auto-generated constructor stub
	}

	public BookStockException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

	public BookStockException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	public BookStockException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	
}

```



### test

```java
package com.atguigu.spring.hibernate.test;

import java.sql.SQLException;
import java.util.Arrays;

import javax.sql.DataSource;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.atguigu.spring.hibernate.service.BookShopService;
import com.atguigu.spring.hibernate.service.Cashier;

public class SpringHibernateTest {

	private ApplicationContext ctx = null;
	private BookShopService bookShopService = null;
	private Cashier cashier = null;
	
	{
		ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
		bookShopService = ctx.getBean(BookShopService.class);
		cashier = ctx.getBean(Cashier.class);
	}
	
	@Test
	public void testCashier(){
		cashier.checkout("aa", Arrays.asList("1001","1002"));
	}
	
	@Test
	public void testBookShopService(){
		bookShopService.purchase("aa", "1001");
	}
	
	@Test
	public void testDataSource() throws SQLException {
		DataSource dataSource = ctx.getBean(DataSource.class);
		System.out.println(dataSource.getConnection());
	}

}

```


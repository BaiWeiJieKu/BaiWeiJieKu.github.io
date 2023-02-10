---
layout: post
title: "mybatisPlus（通用CRUD）"
categories: mybatisPlus
tags: mybatisPlus
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 环境搭建

#### pom

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.atguigu.mp</groupId>
  <artifactId>mp01</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  
  <dependencies>
  		<!-- mp依赖
  			 mybatisPlus 会自动的维护Mybatis 以及MyBatis-spring相关的依赖
  		 -->
		<dependency>
		    <groupId>com.baomidou</groupId>
		    <artifactId>mybatis-plus</artifactId>
		    <version>2.3</version>
		</dependency>		
		<!--junit -->
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>4.9</version>
		</dependency>
		<!-- log4j -->
		<dependency>
			<groupId>log4j</groupId>
			<artifactId>log4j</artifactId>
			<version>1.2.17</version>
		</dependency>
		<!-- c3p0 -->
		<dependency>
			<groupId>com.mchange</groupId>
			<artifactId>c3p0</artifactId>
			<version>0.9.5.2</version>
		</dependency>
		<!-- mysql -->
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<version>5.1.37</version>
		</dependency>
		<!-- spring -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context</artifactId>
			<version>4.3.10.RELEASE</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-orm</artifactId>
			<version>4.3.10.RELEASE</version>
		</dependency>
  
  </dependencies>
  
  
</project>
```



#### applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:tx="http://www.springframework.org/schema/tx"
	xmlns:mybatis-spring="http://mybatis.org/schema/mybatis-spring"
	xsi:schemaLocation="http://mybatis.org/schema/mybatis-spring http://mybatis.org/schema/mybatis-spring-1.2.xsd
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd
		http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.0.xsd">
	
	
	<!-- 数据源 -->
	<context:property-placeholder location="classpath:db.properties"/>
	<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="driverClass" value="${jdbc.driver}"></property>
		<property name="jdbcUrl" value="${jdbc.url}"></property>
		<property name="user" value="${jdbc.username}"></property>
		<property name="password" value="${jdbc.password}"></property>
	</bean>
	
	<!-- 事务管理器 -->
	<bean id="dataSourceTransactionManager" 
		class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
		<property name="dataSource" ref="dataSource"></property>
	</bean>
	<!-- 基于注解的事务管理 -->
	<tx:annotation-driven transaction-manager="dataSourceTransactionManager"/>
	
	
	<!--  配置SqlSessionFactoryBean 
		Mybatis提供的: org.mybatis.spring.SqlSessionFactoryBean
		MP提供的:com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean
	 -->
	<bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
		<!-- 数据源 -->
		<property name="dataSource" ref="dataSource"></property>
		<property name="configLocation" value="classpath:mybatis-config.xml"></property>
		<!-- 别名处理 -->
		<property name="typeAliasesPackage" value="com.atguigu.mp.beans"></property>		
		
		<!-- 注入全局MP策略配置 -->
		<property name="globalConfig" ref="globalConfiguration"></property>
	</bean>
	
	<!-- 定义MybatisPlus的全局策略配置-->
	<bean id ="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
		<!--相当于驼峰命名 在2.3版本以后，dbColumnUnderline 默认值就是true -->
		<property name="dbColumnUnderline" value="true"></property>
		
		<!-- 全局的主键策略 -->
		<property name="idType" value="0"></property>
		
		<!-- 全局的表前缀策略配置 -->
		<property name="tablePrefix" value="tbl_"></property>

	</bean>

	<!-- 
		配置mybatis 扫描mapper接口的路径
	 -->
	<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
		<property name="basePackage" value="com.atguigu.mp.mapper"></property>
	</bean>
	
	
</beans>

```



#### db.properties

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mp
jdbc.username=root
jdbc.password=1234
```



#### log4j.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
 
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
 
 <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
   <param name="Encoding" value="UTF-8" />
   <layout class="org.apache.log4j.PatternLayout">
    <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS} %m  (%F:%L) \n" />
   </layout>
 </appender>
 <logger name="java.sql">
   <level value="debug" />
 </logger>
 <logger name="org.apache.ibatis">
   <level value="info" />
 </logger>
 <root>
   <level value="debug" />
   <appender-ref ref="STDOUT" />
 </root>
</log4j:configuration>

```



#### mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	
</configuration>

```



#### bean

```java
package com.atguigu.mp.beans;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;

/**
 * javaBean
 * 
 * 定义JavaBean中成员变量时所使用的类型: 
 * 	 因为每个基本类型都有一个默认值:  
 * 	   int ==> 0
 * 	   boolean ==> false
 *
 */

/*
 * MybatisPlus会默认使用实体类的类名到数据中找对应的表. 
 * 
 */
//@TableName(value="tbl_employee")
public class Employee {
	/*
	 * @TableId:
	 * 	 value: 指定表中的主键列的列名， 如果实体属性名与列名一致，可以省略不指定. 
	 *   type: 指定主键策略. 
	 */
	//@TableId(value="id" , type =IdType.AUTO)
	private Integer id ;   //  int 
	
	@TableField(value = "last_name")
	private String  lastName; 
	private String  email ;
	private Integer gender; 
	private Integer age ;
	
	@TableField(exist=false)
	private Double salary ; 
	
	//get set
    
	@Override
	public String toString() {
		return "Employee [id=" + id + ", lastName=" + lastName + ", email=" + email + ", gender=" + gender + ", age="
				+ age + "]";
	} 
	
	
}

```



#### mapper 

```java
package com.atguigu.mp.mapper;

import com.atguigu.mp.beans.Employee;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * Mapper接口
 * 	
 * 基于Mybatis:  在Mapper接口中编写CRUD相关的方法  提供Mapper接口所对应的SQL映射文件 以及 方法对应的SQL语句. 
 * 
 * 基于MP:  让XxxMapper接口继承 BaseMapper接口即可.
 * 		   BaseMapper<T> : 泛型指定的就是当前Mapper接口所操作的实体类类型 
 * 
 */
public interface EmployeeMapper extends BaseMapper<Employee> {
    //   Integer  insertEmployee(Employee employee );
	//   <insert useGeneratedKeys="true" keyProperty="id" > SQL...</insert>
}

```



### 插入操作

```properties
1)	Integer insert(T entity);

2)	@TableName:指定实体类和数据库中哪一个表对应

3)	全局的MP 配置: <property name="tablePrefix" value="tbl_"></property>

4)	@TableField：标明类的某个属性是否在数据库中有相对应的列

5)	全局的MP 配置: <property name="dbColumnUnderline" value="true"></property>

6)	@TableId：标明主键

7)	全局的MP 配置: <property name="idType" value="0"></property>

8)	支持主键自增的数据库插入数据获取主键值

	Mybatis: 需要通过 useGeneratedKeys  以及  keyProperty 来设置

	MP: 自动将主键值回写到实体类中

9)	Integer  insertAllColumn(T entity)
```



```java
	/**
	 * 通用 插入操作
	 */
	@Test
	public void testCommonInsert() {
		
		//初始化Employee对象
		Employee employee  = new Employee();
		employee.setLastName("MP");
		employee.setEmail("mp@atguigu.com");
		//employee.setGender(1);
		//employee.setAge(22);
		employee.setSalary(20000.0);
		//插入到数据库   
		// insert方法在插入时， 会根据实体类的每个属性进行非空判断，只有非空的属性对应的字段才会出现到SQL语句中
		//Integer result = employeeMapper.insert(employee);  
		
		//insertAllColumn方法在插入时， 不管属性是否非空， 属性所对应的字段都会出现到SQL语句中. 
		Integer result = employeeMapper.insertAllColumn(employee);
		
		System.out.println("result: " + result );
		
		//获取当前数据在数据库中的主键值
		Integer key = employee.getId();
		System.out.println("key:" + key );
	}
```



### 更新操作

```properties
1)	Integer updateById(@Param("et") T entity);

2)	Integer updateAllColumnById(@Param("et") T entity)
```



```java
	/**
	 * 通用 更新操作
	 */
	@Test
	public void testCommonUpdate() {
		//初始化修改对象
		Employee employee = new Employee();
		employee.setId(7);
		employee.setLastName("小泽老师");
		employee.setEmail("xz@sina.com");
		employee.setGender(0);
		//employee.setAge(33);
		
		//Integer result = employeeMapper.updateById(employee);
		Integer result = employeeMapper.updateAllColumnById(employee);
		
		System.out.println("result: " + result );
	}
```



### 查询操作

```properties
1)	T selectById(Serializable id);

2)	T selectOne(@Param("ew") T entity);

3)	List<T> selectBatchIds(List<? extends Serializable> idList);

4)	List<T> selectByMap(@Param("cm") Map<String, Object> columnMap);

5)	List<T> selectPage(RowBounds rowBounds, @Param("ew") Wrapper<T> wrapper);
```



```java
	/**
	 * 通用 查询操作
	 */
	@Test
	public void  testCommonSelect() {
		//1. 通过id查询
		Employee employee = employeeMapper.selectById(7);
		System.out.println(employee);
		
		//2. 通过多个列进行查询    id  +  lastName
		Employee  employee = new Employee();
		//employee.setId(7);
		employee.setLastName("小泽老师");
		employee.setGender(0);
		
		Employee result = employeeMapper.selectOne(employee);
		System.out.println("result: " +result );
		
		
		//3. 通过多个id进行查询    <foreach>
		List<Integer> idList = new ArrayList<>();
		idList.add(4);
		idList.add(5);
		idList.add(6);
		idList.add(7);
		List<Employee> emps = employeeMapper.selectBatchIds(idList);
		System.out.println(emps);
		
		//4. 通过Map封装条件查询
		Map<String,Object> columnMap = new HashMap<>();
		columnMap.put("last_name", "Tom");
		columnMap.put("gender", 1);
		
		List<Employee> emps = employeeMapper.selectByMap(columnMap);
		System.out.println(emps);
		
		//5. 分页查询
		List<Employee> emps = employeeMapper.selectPage(new Page<>(3, 2), null);
		System.out.println(emps);
	}
```



### 删除操作

```properties
1)	Integer deleteById(Serializable id);

2)	Integer deleteByMap(@Param("cm") Map<String, Object> columnMap);

3)	Integer deleteBatchIds(List<? extends Serializable> idList);
```



```java
	/**
	 * 通用 删除操作
	 */
	@Test
	public void testCommonDelete() {
		//1 .根据id进行删除
		Integer result = employeeMapper.deleteById(13);
		System.out.println("result: " + result );
		//2. 根据 条件进行删除
		Map<String,Object> columnMap = new HashMap<>();
		columnMap.put("last_name", "MP");
		columnMap.put("email", "mp@atguigu.com");
		Integer result = employeeMapper.deleteByMap(columnMap);
		System.out.println("result: " + result );
		
		//3. 批量删除
		List<Integer> idList = new ArrayList<>();
		idList.add(3);
		idList.add(4);
		idList.add(5);
		Integer result = employeeMapper.deleteBatchIds(idList);
		System.out.println("result: " + result );
	}
```



### SQL注入原理

- employeeMapper 的本质  org.apache.ibatis.binding.MapperProxy
- MapperProxy 中 sqlSession –>SqlSessionFactory 

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302101738325.png)

- SqlSessionFacotry 中  → Configuration→ MappedStatements
- 每一个mappedStatement 都表示Mapper 接口中的一个方法与 Mapper 映射文件 中的一个SQL
- MP 在启动就会挨个分析 xxxMapper 中的方法，并且将对应的 SQL 语句处理好，保存到configuration 对象中的mappedStatements 中
- Configuration： MyBatis 或者MP 全局配置对象
- MappedStatement：一个MappedStatement 对象对应 Mapper 配置文件中的一个 
   select/update/insert/delete 节点，主要描述的是一条SQL 语句
- SqlMethod : 枚举对象  ，MP 支持的SQL 方法 
- TableInfo：数据库表反射信息 ，可以获取到数据库表相关的信息
- SqlSource: SQL 语句处理对象
- MapperBuilderAssistant： 用于缓存、SQL 参数、查询方剂结果集处理等. 通过 MapperBuilderAssistant 将每一个 mappedStatement 添加到configuration 中的mappedstatements 中 

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302101738062.png)

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302101738276.png)

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302101738514.png)



### 小结

- 以上是基本的 CRUD 操作，如您所见，我们仅仅需要继承一个 BaseMapper 即可实现大部分单表 CRUD 操作。BaseMapper 提供了多达 17 个方法给大家使用, 可以极其方便的实现单一、批量、分页等操作。极大的减少开发负担
- MP 提供了功能强大的条件构造器 EntityWrapper
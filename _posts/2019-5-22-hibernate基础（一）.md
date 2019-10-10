---
layout: post
title: "hibernate基础（一）"
categories: hibernate
tags: hibernate
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 对象持久化

- 狭义的理解，“持久化”仅仅指把对象永久保存到数据库中
- 广义的理解，“持久化”包括和数据库相关的各种操作：
- 保存：把对象永久保存到数据库中
- 更新：更新数据库中对象(记录)的状态
- 删除：从数据库中删除一个对象
- 查询：根据特定的查询条件，把符合查询条件的一个或多个对象从数据库加载到内存中



### ORM

- ORM(Object/Relation Mapping): 对象/关系映射
- 类---》表
- 对象---》表的行（记录）
- 属性---》表的列（字段）
- ORM的思想：将关系数据库中表中的记录映射成为对象，以对象的形式展现，**程序员可以把对数据库的操作转化为对对象的操作**
- ORM 采用**元数据**来描述对象-关系映射细节, 元数据通常采用 XML 格式, 并且存放在专门的对象-关系映射文件中



### 开发步骤

#### 配置文件

- Hibernate 从其配置文件中读取和数据库连接的有关信息, 这个文件应该位于应用的 classpath 下

- hibernate.cfg.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
		"-//Hibernate/Hibernate Configuration DTD 3.0//EN"
		"http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
        <property name="hibernate.connection.driver_class">com.mysql.jdbc.Driver</property>
        
        <property name="hibernate.connection.username">mysql</property>
        
        <property name="hibernate.connection.password">mysql</property>
        
        <property name="hibernate.connection.url">jdbc:mysql://localhost:3306/mysqldb</property>
        
        <property name="hibernate.dialect">org.hibernate.dialect.MySQLDialect</property>
        
        <property name="connection.pool_size">1</property>
        
        <!--   配置数据库方言 -->
        <property name="dialect">org.hibernate.dialect.MySQLDialect</property>
        
        <!--  输出运行时生成的SQL语句-->
        <property name="show_sql">true</property>
        
        <!--指定是否对输出sql语句进行格式化-->
        <property name="format_sql">true</property>
        
        <!--指定程序运行时是否在数据库自动生成数据表-->
        <property name="hbm2ddl.auto">update</property>
        
        <!-- 列出所有的映射文件 -->
        <mapping resource="org/hibernate/entity/User.hbm.xml"/>
        
    </session-factory>
</hibernate-configuration>

```

```properties
hbm2ddl.auto：该属性可帮助程序员实现正向工程:create | update | create-drop | validate

create : 会根据 .hbm.xml  文件来生成数据表, 但是每次运行都会删除上一次的表 ,重新生成表, 哪怕二次没有任何改变 

create-drop : 会根据 .hbm.xml 文件生成表,但是SessionFactory一关闭, 表就自动删除 

update : 最常用的属性值，也会根据 .hbm.xml 文件生成表, 但若 .hbm.xml  文件和数据库中对应的数据表的表结构不同, Hiberante  将更新数据表结构，但不会删除已有的行和列 

validate : 会和数据库中的表进行比较, 若 .hbm.xml 文件中的列在数据表中不存在，则抛出异常

```



#### 持久化类

- **提供一个无参的构造器**:使Hibernate可以使用Constructor.newInstance() 来实例化持久化类
- **提供一个标识属性(identifier property)**: 通常映射为数据库表的主键字段. 如果没有该属性，一些功能将不起作用，如：Session.saveOrUpdate()
- **为类的持久化类字段声明访问方法**(get/set): Hibernate对JavaBeans 风格的属性实行持久化
- **使用非** **final** **类**: 在运行时生成代理是 Hibernate 的一个重要的功能. 如果持久化类没有实现任何接口, Hibnernate 使用 CGLIB 生成代理. 如果使用的是 final 类, 则无法生成 CGLIB 代理
- **重写 eqauls 和 hashCode 方法**: 如果需要把持久化类的实例放到 Set 中(当需要进行关联映射时), 则应该重写这两个方法
- Hibernate 不要求持久化类继承任何父类或实现接口，这可以保证代码不被污染（低侵入式设计）

#### 映射文件

- Hibernate 采用 XML 格式的文件来指定对象和关系数据之间的映射
- 在运行时 Hibernate将根据这个映射文件来生成各种 SQL 语句
- 映射文件的扩展名为 XXX.hbm.xml

```java
package org.hibernate.entity;

public class User{
	// Fields
	private int id;
	private String name;
	private String password;
	private String type;
	// Constructors
	/** default constructor */
	public User() {                                                      
	}
	/** full constructor */
	public User(int id, String name, String password, String type) {
		this.id = id;
		this.name = name;
		this.password = password;
		this.type = type;
	}
	// Property accessors
	public int getId() {
		return this.id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return this.name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return this.password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getType() {
		return this.type;
	}
	public void setType(String type) {
		this.type = type;
	}
}

```



```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<hibernate-mapping>
	<!--name指定持久化类的类名，table指定数据表的表名-->
    <class name="org.hibernate.entity.User" table="USER">
    	<!--将user类中的id属性映射为数据表USER中的主键USER_ID-->
        <id name="id" type="java.lang.Integer" column="USER_ID">
        	<!--主键生成策略，意味着id的自增长方式采用数据库的自增长模式-->
            <generator class="increment" />
        </id>
        <!--映射User类中的name属性-->
        <property name="name" type="java.lang.String">
       		<column name="NAME" length="20"></column>
        </property>
        <!--映射User类中的password属性-->
        <property name="password" type="java.lang.String" >
        	<column name="PASSWORD" length="12"></column>
        </property>
        <!--映射User类中的type属性-->
        <property name="type" type="java.lang.String" >
        	<column name="TYPE" length="6"></column>
        </property>
    </class>
</hibernate-mapping>


```



#### 访问数据库

- 工具类

```java
package org.hibernate.entity;

import org.hibernate.*;
import org.hibernate.cfg.*;
public class HibernateUtil {
	private static SessionFactory sessionFactory;
	private  static Configuration configuration = new Configuration();   
    //创建线程局部变量threadLocal，用来保存Hibernate的Session
    private static final ThreadLocal<Session> threadLocal = new ThreadLocal<Session>();
	//使用静态代码块初始化Hibernate
    static {
        try {
        Configuration cfg=new Configuration().configure();	//读取配置文件hibernate.cfg.xml
        //创建ServiceRegistry对象
        ServiceRegistry serviceRegistey=new ServiceRegistryBuilder().applySettings(cfg.getProperties()).buildServiceRegistry();
        //创建SessionFactory
        sessionFactory=cfg.buildSessionFactory(serviceRegistey);		
        } catch (Throwable ex) {
        	throw new ExceptionInInitializerError(ex);
        }
    }
//获得SessionFactory实例
public static SessionFactory getSessionFactory() {
	return sessionFactory;
}
//获得ThreadLocal 对象管理的Session实例.  
public static Session getSession() throws HibernateException {                
        Session session = (Session) threadLocal.get();
        if (session == null || !session.isOpen()) {
            if (sessionFactory == null) {

                rebuildSessionFactory();
            }
            //通过SessionFactory对象创建Session对象
            session = (sessionFactory != null) ? sessionFactory.openSession(): null;
             //将新打开的Session实例保存到线程局部变量threadLocal中
            threadLocal.set(session);
        }
            return session;
	}
//关闭Session实例
public static void closeSession() throws HibernateException {
//从线程局部变量threadLocal中获取之前存入的Session实例
Session session = (Session) threadLocal.get();
        threadLocal.set(null);
        if (session != null) {
            session.close();
        }
    }
//重建SessionFactory
public static void rebuildSessionFactory() {
	try {
	configuration.configure("/hibernate.cfg.xml");			//读取配置文件hibernate.cfg.xml
sessionFactory = configuration.buildSessionFactory();		//创建SessionFactory
		} catch (Exception e) {
			System.err.println("Error Creating SessionFactory ");
			e.printStackTrace();
		}
	}
//关闭缓存和连接池
public static void shutdown() {
		getSessionFactory().close();
	}
}


```



- DAO

```java
package org.hibernate.dao;

import java.util.List;
import org.hibernate.entity.User;
//创建UserDAO接口
public interface UserDAO {
	 void save(User user);				//添加用户
	 User findById(int id);				//根据用户标识查找指定用户	 
	void delete(User user);				//删除用户	
	 void update(User user);			//修改用户信息
}


```

```java
package org.hibernate.dao;

import org.hibernate.*;
import org.hibernate.entity.*;
public class UserDAOImpl implements UserDAO {
	//添加用户
    public void save(User user){
        Session session= HibernateUtil.getSession();	//生成Session实例
        Transaction tx = session.beginTransaction();	//创建Transaction实例
        try{
            session.save(user);				//使用Session的save方法将持久化对象保存到数据库
            tx.commit();						//提交事务
        } catch(Exception e){
            e.printStackTrace();
            tx.rollback();					//回滚事务
        }finally{
             HibernateUtil. closeSession();		//关闭Session实例
        }
    }
    //根据用户标识查找指定用户	 
    public User findById(int id){	 
        User user=null;
        Session session= HibernateUtil.getSession();	//生成Session实例
        Transaction tx = session.beginTransaction();	//创建Transaction实例
        try{
            user=(User)session.get(User.class,id);//使用Session的get方法获取指定id的用户到内存中
            tx.commit();								//提交事务
        } catch(Exception e){
            e.printStackTrace();
            tx.rollback();								//回滚事务
        }finally{
             HibernateUtil. closeSession();				//关闭Session实例
        }
        return user;
    }
	//删除用户	
    public void delete(User user){
        Session session= HibernateUtil.getSession();	//生成Session实例
        Transaction tx = session.beginTransaction();	//创建Transaction实例
        try{
            session.delete(user);						//使用Session的delete方法将持久化对象删除
            tx.commit();								//提交事务
        } catch(Exception e){
            e.printStackTrace();
            tx.rollback();								//回滚事务
        }finally{
             HibernateUtil. closeSession();				//关闭Session实例
        }
    }					
    //修改用户信息
    public void update(User user){
        Session session= HibernateUtil.getSession();	//生成Session实例
        Transaction tx = session.beginTransaction();	//创建Transaction实例
        try{
            session.update(user);						//使用Session的update方法更新持久化对象	
            tx.commit();								//提交事务
        } catch(Exception e){
            e.printStackTrace();
            tx.rollback();								//回滚事务
        }finally{
             HibernateUtil. closeSession();				//关闭Session实例
        }
    }					
}

```

- test

```java
package org.hibernate.test;
import org.hibernate.dao.*;
import org.hibernate.entity.User;
import org.junit.Before;
import org.junit.Test;

public class UserTest {
	@Before
	public void setUp() throws Exception {
	}
	@Test //test注释表明该方法为一个测试方法
	public void testSave() {
		UserDAO userdao=new UserDAOImpl();	
	     try{
		  User u=new User();			//创建User对象
		  //设置User对象中的各个属性值
		  u.setId(20);
		  u.setName("zhangsan");
		  u.setPassword("456");
		  u.setType("admin");
		  userdao.save(u);				//使用userdaoimpl的save方法将User对象存入数据库
	     }catch(Exception e){
	    	 e.printStackTrace();
	     }
	}
}

```



#### 总结

- 编写持久化类： POJO + 映射文件
- 获取 Configuration对象
- 获取 SessionFactory 对象
- 获取 Session，打开事务
- 用面向对象的方式操作数据库
- 关闭事务，关闭 Session



### Configuration

- Configuration 类负责管理 Hibernate 的配置信息。包括如下内容
- Hibernate 运行的底层信息：数据库的URL、用户名、密码、JDBC驱动类，数据库Dialect,数据库连接池等（对应 **hibernate.cfg.xml** 文件）



- 创建 Configuration的两种方式：
- 属性文件（hibernate.properties）:**Configuration cfg = new Configuration();**
- Xml文件（hibernate.cfg.xml）：**Configuration cfg = new Configuration().configure();**

```java
File file = new File(“simpleit.xml”);
Configuration cfg = new Configuration().configure(file);
```



### SessionFactory

- 针对单个数据库映射关系经过编译后的内存镜像，是线程安全的
- SessionFactory 对象一旦构造完毕，即被赋予特定的配置信息
- SessionFactory是生成Session的工厂
- 构造 SessionFactory 很消耗资源，一般情况下一个应用中只初始化一个 SessionFactory 对象
- Hibernate4 新增了一个 ServiceRegistry 接口，所有基于 Hibernate 的配置或者服务都必须统一向这个 ServiceRegistry  注册后才能生效

```java
Configuration cfg=new Configuration().configure();	//读取配置文件hibernate.cfg.xml
//创建ServiceRegistry对象
ServiceRegistry serviceRegistey=new ServiceRegistryBuilder().applySettings(cfg.getProperties()).buildServiceRegistry();
//创建SessionFactory
sessionFactory=cfg.buildSessionFactory(serviceRegistey);
```



### Session接口

- Session 是应用程序与数据库之间交互操作的一个**单线程对象**
- 是 Hibernate运作的中心，所有持久化对象必须在 session 的管理下才可以进行持久化操作
- 此对象的生命周期很短
- Session 对象有一个一级缓存，显式执行flush 之前，所有的持久层操作的数据都缓存在 session 对象处
- 相当于 JDBC 中的 Connection

- 持久化类与 Session 关联起来后就具有了持久化的能力

#### 方法

- get() ，load()：取得持久化对象的方法
- save(),update(),saveOrUpdate(),delete()：持久化对象都得保存，更新和删除
- beginTransaction()：开启事务
- isOpen(),flush(),clear(), evict(), close()：管理 Session 的方法



#### save

- Session 的 save() 方法使一个临时对象转变为持久化对象
- 把 News 对象加入到 Session 缓存中, 使它进入持久化状态
- 选用映射文件指定的标识符生成器, 为持久化对象分配唯一的 OID
- 计划执行一条 insert 语句：在 flush 缓存的时候
- Hibernate 通过持久化对象的 OID 来维持它和数据库相关记录的对应关系
- 当 News 对象处于持久化状态时, 不允许程序随意修改它的ID
- 当对一个 OID 不为 Null 的对象执行 save() 方法时, 会把该对象以一个新的 oid 保存到数据库中;  但执行 persist() 方法时会抛出一个异常



#### get&load

- 都可以根据跟定的 OID 从数据库中加载一个持久化对象
- 当数据库中不存在与 OID 对应的记录时, load() 方法抛出 ObjectNotFoundException 异常, 而 get() 方法返回 null
- 两者采用不同的延迟检索策略：load 方法支持延迟加载策略。而get 不支持



#### update

- Session 的 update() 方法使一个游离对象转变为持久化对象, 并且计划执行一条 update 语句
- 若希望 Session 仅当修改了 News 对象的属性时, 才执行 update() 语句, 可以把映射文件中 `<class> `元素的 select-before-update 设为 true. 该属性的默认值为 false
- 当 update() 方法关联一个游离对象时, 如果在 Session 的缓存中已经存在相同
  OID 的持久化对象, 会抛出异常
- 当 update() 方法关联一个游离对象时, 如果在数据库中不存在相应的记录, 也会抛出异常



#### saveOrUpdate

- Session 的 saveOrUpdate() 方法同时包含了 save() 与 update() 方法的功能



#### delete

- Session 的 delete() 方法既可以删除一个游离对象, 也可以删除一个持久化对象
- 计划执行一条 delete 语句
- 把对象从 Session 缓存中删除, 该对象进入删除状态
- Hibernate 的 cfg.xml 配置文件中有一个 **hibernate.use_identifier_rollback** 属性, 其默认值为 false, 若把它设为 true, 将改变 delete() 方法的运行行为: delete() 方法会把持久化对象或游离对象的 OID 设置为 null, 使它们变为临时对象



### Query接口

- query接口是hibernate的查询接口，用于向数据库中查询对象，并控制执行查询的过程。
- query中包装了一个HQL查询语句



#### 使用步骤

- 通过session实例的createQuery方法创建一个query实例
- 设置动态参数，使用setter方法
- 执行查询语句



#### 常用方法

- **setter方法**：设置查询语句中的参数，针对不同的数据类型需要用到不同的setter方法
- **list方法**：用于执行查询语句，并将查询结果以list的形式返回
- **iterator方法**：用于查询语句，返回结果是一个iterator对象，在读取时只能按照顺序方式读取
- **uniqueResult方法**：用于返回唯一的结果，在确保最多只有一条记录的情况下可以使用该方法。返回的结果可以直接转换为相应的对象
- **executeUpdate方法**：支持HQL语句的更新和删除操作，建议更新时采用此方法
- **setFirstResult方法**：可以设置所获得的第一条记录的位置，从0开始计算，用于筛选选取记录的范围。
- **setMaxResults方法**：设置结果集的最大记录数，可以和setFirstResult结合使用，限制结果集的范围，实现分页功能

```java
Query query=session.createQuery("from User");
int currentPage=1;
int pageSize=10;
query.setFirstResult( (currentPage-1)*pageSize);
query.setMaxResults(pageSize);
List Users=query.list();
session.close();
```



### Criteria接口

- 也是查询接口，它允许创建并执行面向对象方式的查询
- 更擅长执行动态查询



#### 常用类

- Criteria：表示一次查询
- Criterion：表示一个查询条件，可以通过Restrictions工具类来创建
- Restriction：表示查询条件的工具类。提供了大量的静态方法，如eq（等于）、ge（大于等于）、between



#### 使用步骤

- 利用session实例的createCriteria方法创建一个实例
- 设定查询条件，通过Expression类或Restrictions类创建查询条件的实例，即Criterion实例
- 调用Criteria的list（）方法来执行查询语句

```java
List users=session.createCriteria(User.class).add(Restrictions.eq("name","jack")).list();
/*
在运行时，转化为：
select * from user where name="jack";
*/
```



#### 常用方法

- add方法：设置查询条件，可以追加任意个add方法
- addOrder方法：设置查询结果集的排序规则，相当于sql的order by语句，参数为Order类的实例

```java
List users=session.createCriteria(User.class)
	.add(Restrictions.eq("name","jack"))
	.addOrder(Order.asc("name"))
	.list();
```

- createCriteria方法：提供了对多表查询的方法

```java
List users=session.createCriteria(User.class)
	.add(Restrictions.eq("name","jack"))
	.createCriteria("role")
	.add(Restrictions.eq("rolename","admin"))
	.list();
/*
select * from user,role where name="jack" and rolename="admin"
*/
```

- list方法：执行数据查询，并将查询结果返回
- scroll方法：与list方法类似，将结果集以ScrollableResults类型返回
- setFetchModel方法：设置抓取策略
- setFetchSize方法：指定一次从数据库中提取数据的数量大小，通过调用Statement.setFetchSize()方法实现
- setMaxResults方法：用于设置从数据库中取得记录的最大行数，实现分页功能时将每页显示数据的数目作为参数传入该方法即可
- setFirstResult方法：设置所获取带的第一个记录的位置，从0开始，用于分页查询
- setProjection方法：主完成一些聚合查询和分组查询。

```java
List users=session.createCriteria(User.class)
	.setProjection(Projections.projectionList()
		.add(Projections.rowCount())
		.add(Projections.avg("age"))
		.add(Projections.max("age"))
		.ad(Projections.min("age"))
		.add(Projections.groupProperty("sex"))
	).list();
	
/*
select sex,count(*),avg(age),max(age),min(age) from user group by sex
*/
```

- uniqueResult方法：可以得到唯一的查询结果，该结果为一个对象

### Transaction

- 代表一次原子操作，它具有数据库事务的概念
- 所有持久层都应该在事务管理下进行，即使是只读操作
- `Transaction tx = session.beginTransaction();`



#### 方法

- commit():提交相关联的session实例
- rollback():撤销事务操作
- wasCommitted():检查事务是否提交
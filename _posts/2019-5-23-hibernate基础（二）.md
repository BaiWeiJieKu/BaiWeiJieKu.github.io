---
layout: post
title: "hibernate基础（二）"
categories: hibernate
tags: hibernate
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### Session

- Session 接口是 Hibernate 向应用程序提供的操纵数据库的最主要的接口, 它提供了基本的保存, 更新, 删除和加载 Java 对象的方法
- Session 具有一个缓存, 位于缓存中的对象称为持久化对象, 它和数据库中的相关记录对应
- Session 能够在某些时间点, 按照缓存中对象的变化来执行相关的 SQL 语句, 来同步更新数据库, 这一过程被称为刷新缓存(flush)
- 站在持久化的角度, Hibernate 把对象分为 4 种状态: **持久化状态, 临时状态, 游离状态, 删除状态**
- Session 的特定方法能使对象从一个状态转换到另一个状态



#### 缓存

- 在 Session 接口的实现中包含一系列的 Java 集合, 这些 Java 集合构成了 Session 缓存
- 只要 Session 实例没有结束生命周期, 且没有清理缓存，则存放在它缓存中的对象也不会结束生命周期
- Session 缓存可减少 Hibernate 应用程序访问数据库的频率

```properties
Session缓存（持久化对象）---------flush()---------->数据库（记录）
数据库（记录）-------------------reflesh()-------->Session缓存（持久化对象）
Session缓存（持久化对象）--------clear()----------->Session缓存（空）
```

- flush：Session 按照缓存中对象的属性变化来同步更新数据库
- flush 缓存的例外情况: 如果对象使用 native 生成器生成 OID, 那么当调用 Session 的 save() 方法保存对象时, 会立即执行向数据库插入该实体的 insert 语句
- commit() 和 flush() 方法的区别：flush 执行一系列 sql 语句，但不提交事务；commit 方法先调用flush() 方法，然后提交事务. 意味着提交事务意味着对数据库操作永久保存下来
- 若希望改变 flush 的默认时间点, 可以通过 Session 的 setFlushMode() 方法显式设定 flush 的时间点 



- 默认情况下 Session 在以下时间点刷新缓存：
- 显式调用 Session 的 flush() 方法
- 当应用程序调用 Transaction 的 commit（）方法的时, 该方法先 flush ，然后在向数据库提交事务
- 当应用程序执行一些查询(HQL, Criteria)操作时，如果缓存中持久化对象的属性已经发生了变化，会先 flush 缓存，以保证查询结果能够反映持久化对象的最新状态



### 隔离级别

- 一个事务与其他事务隔离的程度称为隔离级别
- 隔离级别越高, 数据一致性就越好, 但并发性越弱

- 对于同时运行的多个事务, 当这些事务访问数据库中相同的数据时, 如果没有采取必要的隔离机制, 就会导致各种并发问题

- **脏读**，**不可重复读**，**幻读**

- 数据库事务的隔离性: 数据库系统必须具有隔离并发运行各个事务的能力, 使它们不会相互影响, 避免各种并发问题

- Mysql 支持 4 中事务隔离级别. Mysql 默认的事务隔离级别为: REPEATABLE READ

  Hibernate 通过为 Hibernate 映射文件指定 hibernate.connection.isolation 属性来设置事务的隔离级别（1. READ UNCOMMITED；2. READ COMMITED；4. REPEATABLE READ；8. SERIALIZEABLE）



### 对象状态

#### 临时对象

- 在使用代理主键的情况下, OID 通常为 null
- 不处于 Session 的缓存中
- 在数据库中没有对应的记录



#### 持久对象

- OID 不为 null
- 位于 Session 缓存中
- 若在数据库中已经有和其对应的记录, 持久化对象和数据库中的相关记录对应
- Session 在 flush 缓存时, 会根据持久化对象的属性变化, 来同步更新数据库
- 在同一个 Session 实例的缓存中, 数据库表中的每条记录只对应唯一的持久化对象



#### 删除对象

- 在数据库中没有和其 OID 对应的记录
- 不再处于 Session 缓存中
- 一般情况下, 应用程序不该再使用被删除的对象



#### 游离对象

- OID 不为 null
- 不再处于 Session 缓存中
- 一般情况需下, 游离对象是由持久化对象转变过来的, 因此在数据库中可能还存在与它对应的记录



### 单向多对一

- 单向 n-1 关联只需从 n 的一端可以访问 1 的一端
- 在Order 类中定义一个 Customer 属性, 而在 Customer 类中无需定义存放 Order 对象的集合属性
- `<many-to-one> `**元素来映射组成关系**
- **name:** **设定待映射的持久化类的属性的名字**
- **column:** **设定和持久化类的属性对应的表的外键**
- **class**：设定待映射的持久化类的属性的类型

```xml
<many-to-one
	name="customer"
	class="Customer"
	column="CUSTOMER_ID"
	not-null="true" />
```



- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
address_id int cannull mul
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
```



```java
public class User {
	private int userid; 				// User类的标识属性
	private String name; 			//name属性
	private String password;			//password属性
	private Address address; 			// User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
		this.address = address;
	}
	// getter和setter方法

}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <generator class="identity"/>
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--用来映射多对一关联实体，column属性指定外键列列名-->
       <many-to-one name="address" class="Address" unique="true" fetch="join">
       		<column name="address_id" />
       </many-to-one>
    </class>
</hibernate-mapping>

```



```java

public class Address {
//Address类的标识属性
private int addressid;
    private String addressinfo;
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//getter和setter方法

}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="identity" />
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
    </class>
</hibernate-mapping>

```



### 双向一对多

- 双向 1-n 与 双向 n-1 是完全相同的两种情形
- 双向 1-n 需要在 1 的一端可以访问 n 的一端, 反之依然
- 从 Order 到 Customer 的多对一双向关联需要在Order 类中定义一个 Customer 属性, 而在 Customer 类中需定义存放 Order 对象的集合属性
- 当 Session 从数据库中加载 Java 集合时, 创建的是 Hibernate内置集合类的实例, 因此在持久化类中定义集合属性时必须把属性声明为Java 接口类型
- Hibernate 使用` <set> `元素来映射 set 类型的属性

```xml
<set name="orders">
	<key column="CUSTOMER_ID" />
	<one-to-many class="Order" />
</set>
```



- 在hibernate中通过对 inverse 属性的来决定是由双向关联的哪一方来维护表和表之间的关系
- inverse = false 的为主动方，inverse = true 的为被动方
- 由主动方负责维护关联关系
- 在没有设置 inverse=true 的情况下，父子两边都维护父子关系 
- 在 1-n 关系中，将 n 方设为主控方将有助于性能改善



- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
user_id int notnull mul
```



```java
import java.util.HashSet;
import java.util.Set;

public class User {
	private int userid; 											// User类的标识属性
	private String name; 											//name属性
	private String password;										//password属性
	private Set<Address> addresses=new HashSet<Address>(); 			// User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
	}
	//getter和setter方法

}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-11-3 10:29:42 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <generator class="identity" />
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--映射集合属性，关联到持久化类。由Address一方控制关联关系-->
        <set name="addresses" table="ADDRESS" inverse="true" lazy="true">
            <key>
                <column name="USER_ID" />
            </key>
            <one-to-many class="Address" />
        </set>
    </class>
</hibernate-mapping>

```



```java

public class Address {
//Address类的标识属性
	private int addressid;
    private String addressinfo;
    private User user;
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//getter和setter方法

}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-11-3 10:29:42 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="identity" />
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
        <many-to-one name="user" class="User" fetch="join">
            <column name="USER_ID" not-null="true"/>
        </many-to-one>
    </class>
</hibernate-mapping>

```



### 单向一对一

#### 基于外键

- 对于基于外键的1-1关联，其外键可以存放在任意一边，比如一个用户对应一个地址
- 在需要存放外键一端，增加many-to-one元素
- 为many-to-one元素增加unique=“true” 属性来表示为1-1关联

```xml
<many-to-one 
	name="manager" 
	class="Manager" 
	column="MANAGER_ID"
	cascade="all"
	unique="true" />
```

- 另一端需要使用one-to-one元素，该元素使用 **property-ref** 属性指定使用被关联实体主键以外的字段作为关联字段

```xml
<one-to-one
	name="dept"
	class="Department"
	property-ref="manager" />
```



- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
address_id int cannull mul
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
```



```java
public class User {
	private int userid; 				// User类的标识属性
	private String name; 			//name属性
	private String password;			//password属性
	private Address address; 			// User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
		this.address = address;
	}
	// getter和setter方法
}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <generator class="identity"/>
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--映射关联实体Address，将其address属性映射为address表中的外键address_id,unique指定为一对一映射-->
       <many-to-one name="address" class="Address" unique="true">
       		<column name="ADDRESS_ID" />
       </many-to-one>
    </class>
</hibernate-mapping>

```



```java

public class Address {
	//Address类的标识属性
	private int addressid;
    private String addressinfo;
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//Address属性的getter和setter方法
	public int getAddressid () {
		return this.addressid;
	}
	public void setUseid(int addressid) {
		this.addressid = addressid;
	}
	//addressinfo的getter和setter方法
	public String getAddressinfo () {
		return this. addressinfo;
	}
	public void setAddressinfo (String addressinfo) {
		this. addressinfo = addressinfo;
	}
}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="identity" />
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
    </class>
</hibernate-mapping>

```



#### 基于主键映射

- 基于主键的映射策略:指一端的主键生成器使用 foreign 策略,表明根据**”对方”**的主键来生成自己的主键，自己并不能独立生成主键
- `<param>` 子元素指定使用当前持久化类的哪个属性作为 **“对方”**

```xml
<id name="id" column="ID" type="integer">
	<generator class="foreign">
		<param name="property">manager</param>
	</generator>
</id>
```

- 采用foreign主键生成器策略的一端增加 one-to-one 元素映射关联属性，其one-to-one属性还应增加 constrained=“true” 属性
- 另一端增加one-to-one元素映射关联属性
- constrained(约束):指定为当前持久化类对应的数据库表的主键添加一个外键约束，引用被关联的对象(“对方”)所对应的数据库表主键

```xml
<one-to-one
	name="manager"
	class="Manager"
	constrained="true" />
```



- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
```



```java
public class User {
	private int userid; 				// User类的标识属性
	private String name; 			//name属性
	private String password;			//password属性
	private Address address; 			// User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
		this.address = address;
	}
	// getter和setter方法
	
}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <!--基于主键关联时，将主键生成策略设置为foreign，表明由关联类来生成主键，即直接使用另一个关联类的主键值，该持久类本身不能生成主键-->
            <generator class="foreign">
            	<!--关联持久化类的属性名-->
            	<param name="property">address</param>
            </generator>
            
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--基于主键的一对一关联映射-->
        <one-to-one name="address" class="Address" constrained="true">
        </one-to-one>
    </class>
</hibernate-mapping>

```



```java

public class Address {
//Address类的标识属性
	private int addressid;
    private String addressinfo;
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//Address属性的getter和setter方法
	public int getAddressid () {
		return this.addressid;
	}
	public void setUseid(int addressid) {
		this.addressid = addressid;
	}
	//addressinfo的getter和setter方法
	public String getAddressinfo () {
		return this. addressinfo;
	}
	public void setAddressinfo (String addressinfo) {
		this. addressinfo = addressinfo;
	}
}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="identity" />
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
    </class>
</hibernate-mapping>

```



### 双向一对一

#### 基于主键

- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
```



```java
public class User {
	private int userid; 				// User类的标识属性
	private String name; 			//name属性
	private String password;			//password属性
	private Address address; 			// User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
		this.address = address;
	}
	//getter和setter方法

}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <generator class="identity"/>  
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--映射关联属性address.cascade=all表示级联保存User对象关联的Address对象-->
        <one-to-one name="address" class="Address" cascade="all">
        </one-to-one>
    </class>
</hibernate-mapping>

```



```java

public class Address {
//Address类的标识属性
	private int addressid;
    private String addressinfo;
    private User user;
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//getter和setter方法
}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="foreign">
            	<param name="property">user</param>
            </generator>
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
        <!--映射关联属性user。constrained表示在address表中存在一个外键约束-->
        <one-to-one name="user" class="User" constrained="true">
        </one-to-one>
    </class>
</hibernate-mapping>

```



#### 基于外键

- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
user_id int notnull mul
```



```java
public class User {
	private int userid; 				// User类的标识属性
	private String name; 			//name属性
	private String password;			//password属性
	private Address address; 			// User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
		this.address = address;
	}
	//getter和setter方法

}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <generator class="identity"/>  
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--映射关联属性address。在保存User类的对象时，级联保存该对象所关联的address对象-->
        <one-to-one name="address" class="Address" cascade="all">
        </one-to-one>
    </class>
</hibernate-mapping>

```



```java

public class Address {
//Address类的标识属性
	private int addressid;
    private String addressinfo;
    private User user;
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//getter和setter方法

	
}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 20:36:01 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="identity"/>
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
        <many-to-one name="user" class="User" fetch="select" unique="true">
        	<column name="USER_ID" />
        </many-to-one>
    </class>
</hibernate-mapping>

```



### 单向一对多

- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
user_id int notnull mul
```



```java
import java.util.HashSet;
import java.util.Set;

public class User {
	private int userid; 				// User类的标识属性
	private String name; 			//name属性
	private String password;			//password属性
	private Set<Address> addresses=new HashSet<Address>(); 				// User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
	}
	//getter和setter方法

}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 23:57:50 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <generator class="identity" />
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--映射集合属性，inverse为false表示由User方来维护关联关系，不采用延迟加载-->
        <set name="addresses" table="ADDRESS" inverse="false" lazy="true">
            <key>
            	<!--确定关联的外键列-->
                <column name="USER_ID" />
            </key>
            <!--映射到关联类属性-->
            <one-to-many class="Address" />
        </set>
    </class>
</hibernate-mapping>

```



```java

public class Address {
//Address类的标识属性
	private int addressid;
    private String addressinfo;
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//getter和setter方法
	
}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 23:57:50 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="identity" />
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
    </class>
</hibernate-mapping>

```




### 单向多对多

- 它利用中间表将两个主表关联起来。
- 中间表的作用是将两张表的主键作为其外键，通过外键建立这两张表之间的映射关系
- 比如多个用户User对应多个地址Address
- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
```

- user_address表

```properties
addressid int notnull pri
userid int notnull pri
```



```java
import java.util.HashSet;
import java.util.Set;

public class User {
	private int userid; 				// User类的标识属性
	private String name; 			//name属性
	private String password;			//password属性
	private Set<Address> addresses=new HashSet<Address>(); // User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
	}
	//省略get和set
}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 23:57:50 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <generator class="identity" />
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--映射集合属性，USER_ADDRESS是中间表名称，由User一方来维护关联关系，不采用延迟加载-->
        <set name="addresses" table="USER_ADDRESS" inverse="false" lazy="true">
            <key>
                <column name="USERID" /><!--指定USER表关联到中间表的外键列名-->
            </key>
            <!--指定关联USER表的Address对象的主键在连接表中的列名-->
            <many-to-many class="Address" column="ADDRESSID"/>
        </set>
    </class>
</hibernate-mapping>

```



```java

public class Address {
//Address类的标识属性
	private int addressid;
    private String addressinfo;
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//Address属性的getter和setter方法
	public int getAddressid () {
		return this.addressid;
	}
	public void setUseid(int addressid) {
		this.addressid = addressid;
	}
	//addressinfo的getter和setter方法
	public String getAddressinfo () {
		return this. addressinfo;
	}
	public void setAddressinfo (String addressinfo) {
		this. addressinfo = addressinfo;
	}
}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 23:57:50 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="identity" />
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
    </class>
</hibernate-mapping>

```



### 双向多对多

- 双向 n-n 关联需要两端都使用集合属性
- 双向n-n关联**必须使用连接表**
- 集合属性应增加 key 子元素用以映射外键列, 集合元素里还应增加many-to-many子元素关联实体类
- 对于双向 n-n 关联, 必须把其中一端的 inverse 设置为 true, 否则两端都维护关联关系可能会造成主键冲突

- user表

```properties
userid int(11) notnull primarykey 主键
name varchar cannull 
password varchar cannull
```

- address表

```properties
addressid int notnull pri 主键
addressinfo varchar
```

- user_address表

```properties
addressid int notnull pri
userid int notnull pri
```



```java
import java.util.HashSet;
import java.util.Set;

public class User {
	private int userid; 				// User类的标识属性
	private String name; 			//name属性
	private String password;			//password属性
	private Set<Address> addresses=new HashSet<Address>(); 	// User类的关联实体属性
	//无参构造方法
	public User() {                                                                   
	}
	//初始化所有User属性的构造方法
	public User(int userid, String name, String password, String type, Address address) {
		this.userid = userid;
		this.name = name;
		this.password = password;
	}
	//省略get和set

}

```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-10-31 23:57:50 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="User" table="USER">
        <id name="userid" type="int" access="field">
            <column name="USERID" />
            <generator class="identity" />
        </id>
        <property name="name" type="java.lang.String">
            <column name="NAME" />
        </property>
        <property name="password" type="java.lang.String">
            <column name="PASSWORD" />
        </property>
        <!--映射集合属性，关联到持久化类，table="user_address"指定了中间表名称-->
        <set name="addresses" table="USER_ADDRESS" inverse="true" lazy="true">
            <key>
                <column name="USERID" />
            </key>
            <many-to-many class="Address" column="ADDRESSID"/>
        </set>
    </class>
</hibernate-mapping>

```



```java
import java.util.HashSet;
import java.util.Set;


public class Address {
//Address类的标识属性
	private int addressid;
    private String addressinfo;
    private Set<User> users = new HashSet<User>();	
	//无参构造方法
	public Address () {
	}
	//初始化所有Address属性的构造方法
	public Address (int addressid, String addressinfo) {
		this.addressid = addressid;
		this.addressinfo = addressinfo;
	}
	//Address属性的getter和setter方法
	public int getAddressid () {
		return this.addressid;
	}
	public void setUseid(int addressid) {
		this.addressid = addressid;
	}
	//addressinfo的getter和setter方法
	public String getAddressinfo () {
		return this. addressinfo;
	}
	public void setAddressinfo (String addressinfo) {
		this. addressinfo = addressinfo;
	}
	public Set<User> getUsers() {
		return users;
	}
	public void setUsers(Set<User> users) {
		this.users = users;
	}
}


```

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<!-- Generated 2012-11-2 11:19:47 by Hibernate Tools 3.4.0.CR1 -->
<hibernate-mapping>
    <class name="Address" table="ADDRESS">
        <id name="addressid" type="int" access="field">
            <column name="ADDRESSID" />
            <generator class="identity" />
        </id>
        <property name="addressinfo" type="java.lang.String">
            <column name="ADDRESSINFO" />
        </property>
        <!--映射集合属性，关联到持久化类，table属性指定了中间表名字-->
        <set name="users" table="USER_ADDRESS" inverse="false" lazy="true">
            <key>
                <column name="ADDRESSID" />
            </key>
            <many-to-many class="User" column="USERID"/>
        </set>
    </class>
</hibernate-mapping>

```


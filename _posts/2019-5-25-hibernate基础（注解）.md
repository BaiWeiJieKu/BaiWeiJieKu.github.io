---
layout: post
title: "hibernate基础（注解）"
categories: hibernate
tags: hibernate
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 配置文件

```xml
<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE hibernate-configuration PUBLIC
       "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
"http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
 
<hibernate-configuration>
 
    <session-factory>
        <!-- Database connection settings -->
        <property name="connection.driver_class">com.mysql.jdbc.Driver</property>
        <property name="connection.url">jdbc:mysql://localhost:3306/test?characterEncoding=UTF-8</property>
        <property name="connection.characterEncoding">utf-8</property>
        <property name="connection.username">root</property>
        <property name="connection.password">admin</property>
        <!-- SQL dialect -->
        <property name="dialect">org.hibernate.dialect.MySQLDialect</property>
        <property name="current_session_context_class">thread</property>
        <property name="show_sql">true</property>
        <property name="hbm2ddl.auto">update</property>
<!--    <mapping resource="com/how2java/pojo/Product.hbm.xml" />改为注解开发 -->
        <mapping class="com.how2java.pojo.Product" />

    </session-factory>
 
</hibernate-configuration>

```



### 内置注解

#### @Override

- @Override 用在方法上，表示这个方法重写了父类的方法，如toString()
- 如果父类没有这个方法，那么就无法编译通过



#### @Deprecated

- @Deprecated 表示这个方法已经过期，不建议开发者使用



#### @SuppressWarnings

- 个注解的用处是忽略警告信息



#### @SafeVarargs

- @SafeVarargs注解只能用在参数长度可变的方法或构造方法上，且方法必须声明为static或final，否则会出现编译错误
- 一个方法使用@SafeVarargs注解的前提是，开发人员必须确保这个方法的实现中对泛型类型参数的处理不会引发类型安全问题



#### @FunctionalInterface

- 用于约定函数式接口
- 函数式接口概念： 如果接口中只有一个抽象方法（可以包含多个默认方法或多个static方法），该接口称为函数式接口



### 自定义注解

```java
package anno;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;

import java.lang.annotation.Documented;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({METHOD,TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface JDBCConfig {
     String ip(); 
     int port() default 3306; 
     String database(); 
     String encoding(); 
     String loginName(); 
     String password(); 
}

```

```java
package util;

import anno.JDBCConfig;

@JDBCConfig(ip = "127.0.0.1", database = "test", encoding = "UTF-8", loginName = "root", password = "admin")
public class DBUtil {
	static {
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}

}

```

```java
package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import anno.JDBCConfig;

@JDBCConfig(ip = "127.0.0.1", database = "test", encoding = "UTF-8", loginName = "root", password = "admin")
public class DBUtil {
	static {
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}

	public static Connection getConnection() throws SQLException, NoSuchMethodException, SecurityException {
		JDBCConfig config = DBUtil.class.getAnnotation(JDBCConfig.class);

		String ip = config.ip();
		int port = config.port();
		String database = config.database();
		String encoding = config.encoding();
		String loginName = config.loginName();
		String password = config.password();

		String url = String.format("jdbc:mysql://%s:%d/%s?characterEncoding=%s", ip, port, database, encoding);
		return DriverManager.getConnection(url, loginName, password);
	}
	
	public static void main(String[] args) throws NoSuchMethodException, SecurityException, SQLException {
		Connection c = getConnection();
		System.out.println(c);
	}
}

```



### 元注解

- 元数据在英语中对应单词 metadata，为其他数据提供信息的数据
- 元注解 meta annotation用于注解 自定义注解 的注解



#### @Target

- @Target 表示这个注解能放在什么位置上，是只能放在类上？还是即可以放在方法上，又可以放在属性上

```properties
ElementType.TYPE：能修饰类、接口或枚举类型

ElementType.FIELD：能修饰成员变量

ElementType.METHOD：能修饰方法

ElementType.PARAMETER：能修饰参数

ElementType.CONSTRUCTOR：能修饰构造器

ElementType.LOCAL_VARIABLE：能修饰局部变量

ElementType.ANNOTATION_TYPE：能修饰注解

ElementType.PACKAGE：能修饰包 
```



#### @Retention

- @Retention 表示生命周期

```properties
RetentionPolicy.SOURCE： 注解只在源代码中存在，编译成class之后，就没了。@Override 就是这种注解。

RetentionPolicy.CLASS： 注解在java文件编程成.class文件后，依然存在，但是运行起来后就没了。@Retention的默认值，即当没有显式指定@Retention的时候，就会是这种类型

RetentionPolicy.RUNTIME： 注解在运行起来之后依然存在，程序可以通过反射获取这些信息
```



#### @Inherited

- @Inherited 表示该注解具有继承性
- 如例，设计一个DBUtil的子类，其getConnection2方法，可以获取到父类DBUtil上的注解信息。

```java
package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import anno.JDBCConfig;

public class DBUtilChild extends DBUtil {
	
	public static Connection getConnection2() throws SQLException, NoSuchMethodException, SecurityException {
		JDBCConfig config = DBUtilChild.class.getAnnotation(JDBCConfig.class);
		String ip = config.ip();
		int port = config.port();
		String database = config.database();
		String encoding = config.encoding();
		String loginName = config.loginName();
		String password = config.password();

		String url = String.format("jdbc:mysql://%s:%d/%s?characterEncoding=%s", ip, port, database, encoding);
		return DriverManager.getConnection(url, loginName, password);
	}
	
	public static void main(String[] args) throws NoSuchMethodException, SecurityException, SQLException {
		Connection c = getConnection2();
		System.out.println(c);
	}
}

```



#### @Documented

- 在用javadoc命令生成API文档后，DBUtil的文档里会出现该注解说明



#### @Repeatable

- 当没有@Repeatable修饰的时候，注解在同一个位置，只能出现一次

### 类级别

#### @Entity

- 映射实体类
- `@Entity(name="tableName")`
- name:可选，对应数据库中的一个表，若表名和实体类名相同，则可以省略
- 使用该注解时必须指定实体类的主键属性



#### @Table

- `@Table(name="",catalog="",schema="")`
- 和@Entity配合使用，只能标注在实体的class定义处，表示实体对应的数据表信息
- name：可选，映射表的名称，默认表名和实体名称一致，若不一致则需要指定表名
- catalog：可选，表示Catalog名称，默认为空
- schema：可选，表示Schema名称，默认为空
- 各种数据库系统对catalog和schema的支持和实现不一样



#### @Embeddable

- 表示一个非Entity类可以嵌入到另一个Entity类中作为属性而存在

```java
@Entity
public class Employee{
    private Department dp;
}

@Embeddable
public class Department{
}

```



### 属性级别

- 添加到属性字段上面或者get方法上必须统一



#### @Id

- 必须，定义了映射到数据库表的主键的属性
- 一个实体类可以有一个或者多个属性被映射为主键
- 可置于主键属性或者get方法前，如果有多个属性定义为主键属性，该实体类必须实现serializable接口



#### @SequenceGenerator

- 注解声明了一个数据库序列
- name： 表示该表主键生成策略名称，它被引用在@GeneratedValue中设置的“gernerator”值中 
- sequenceName： 表示生成策略用到的数据库序列名称
- initialValue： 表示主键初始值，默认为0
- allocationSize： 每次主键值增加的大小，例如设置成1，则表示每次创建新记录后自动加1，默认为50

#### @GeneratedValue

- 可选，用于定义主键生成策略
- `@GeneratedValue(strategy=GenerationType,generator="")`
- strategy:表示主键生成策略，取值有：

```properties
GenerationType.AUTO：根据底层数据库自动选择（默认）

GenerationType.INDENTITY：根据数据库的Identity字段生成

GenerationType.SEQUENCE：使用Sequence来决定主键的取值

GenerationType.TABLE：使用指定表来决定主键取值，结合@TableGenerator使用

```



#### @Column

- 可以将属性映射到列，使用该注解来覆盖默认值
- 该注解描述了数据库中该字段的详细定义，这对于根据JPA注解生成数据库表结构的工具非常有作用
- name：可选，表示数据库中该字段的名称，默认和属性名一致
- nullable：可选，表示该字段是否允许为null，默认为true
- unique：可选，表示该字段是否为唯一标识，默认为false
- length：可选，标识该字段的大小，仅对String类型的字段有效，默认为255，主键不能使用默认值
- insertable：可选，表示在ORM框架执行插入操作时，该字段是否应出现insert语句中，默认为true
- updateable：可选，表示在ORM框架执行更新操作时，该字段是否应该出现在UPDATE语句中，默认为true

```java
@Entity
@Table(name = "product_")
public class Product {
    int id;
    String name;
    float price;
     
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")  
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    @Column(name = "name")
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @Column(name = "price")
    public float getPrice() {
        return price;
    }
    public void setPrice(float price) {
        this.price = price;
    }
      
}
```



#### @Enbedded

- 该注解是注释属性的，表示该属性的类是嵌入类
- 同时嵌入类也必须标注@Embeddable注解



#### @EnbeddedId

- 该注解使用嵌入式主键类实现复合主键
- 嵌入式主键类必须实现Serializable接口、必须有默认的public无惨数的构造方法、必须覆盖equals和hashcode方法



#### @Lob

- 该注解表示属性将被持久化为Blob或者Clob类型，具体取决于属性的类型



#### @Version

- 该注解来发现数据库记录的并发操作，当JPA运行时检测到一个并发操作也在试图更改一条记录，他会抛出一个尝试提交事务异常



#### @Basic

- 对于一些特殊属性，比如长文本类型text、字节流型blob的数据，在加载Entity时，这些属性对应的数据量比较大，有时创建实体如果也加载的话，可能会严重造成资源的占用。
- 该注解可以设置实体属性的加载方式为懒加载

`@Basic(fetch=FetchType.LAZY,optional=true)`



#### @transient

- 表示该属性并非一个到数据库表的字段映射，ORM框架将忽略该属性，ORM默认为@Basic

### 参数校验

#### @NotNull

- 值不能为空，对象类型

#### @Null

- 值必须为空

#### @Pattern

- @Pattern(regex=)：字符串必须匹配正则表达式

#### @Size

- @Size(min=,max=)：集合的元素数量必须在min和max之间

#### @CreditCardNumber

- 字符串必须是信用卡号

#### @Email

- 字符串必须是email地址

#### @Length

- @Length（min=，max=）：检查字符串的长度

#### @NotBlank

- 字符串必须有字符，不能为空

#### @NotEmpty

- 字符串不为null，集合有元素

#### @Range

- @Range（min，max）：数字必须大于等于min，小于等于max

#### @SafeHtml

- 字符串是安全的HTML

#### @URL

- 字符串是合法的URL

#### @AssertFalse

- 用于boolean字段，该字段的值只能为false

#### @AssertTrue

- 用于boolean字段，该字段只能为true

#### @DecimalMax(value)

- 被注释的元素必须是一个数字，只能大于或等于该值

#### @DecimalMin(value)

- 被注释的元素必须是一个数字，只能小于或等于该值

#### @Digits(integer,fraction)

- 检查是否是一种数字的(整数,小数)的位数

#### @Future

- 检查该字段的日期是否是属于将来的日期

#### @Past

- 检查该字段的日期是在过去

#### @Max(value)

- 该字段的值只能小于或等于该值

#### @Min(value)

- 该字段的值只能大于或等于该值

#### 正负数

- @Negative：判断负数

  @NegativeOrZero：判断负数或0

  @Positive：判断正数

  @PositiveOrZero：判断正数或0



### 关联级别

#### 一对一单向外键

```java
public class Student{
    private String id;
    private IdCard idCard;
    ...
    @OneToOne(cascade=CascadeType.ALL) // 级联关系（数据同步，删除一边，另一边也删除等）
    @JoinColumn(name="cid",unique=true) // 外键名称
    public IdCard setIdCard(){
        	this.idCard = idCard;
    	}
    } 
}
public class IdCard{
    private String iid;
    ...
}

```



#### 一对一双向外键

- 双向关联只能交给一方去控制，不可能双方都保存关联关系

```java
public class Student{
    private String id;
    private IdCard card;
    ...
    @OneToOne(cascade=CascadeType.ALL) // 级联关系（数据同步，删除一边，另一边也删除等）
    @JoinColumn(name="cid",unique=true) // 外键名称
    public IdCard setCard(){
        this.idCard = idCard;
    }
}

public class IdCard{
    private String iid;
    private Student student;
    @OneToOne(mappedBy("card")) //card是指Student.card
    public Student setStudent(){
    }
    ...
}

```



#### 多对一单向外键

- 一对多单向外键也如此
- 多方持有一方的引用

```java
public class Student{
    private String id;
    private ClassRoom classRoom;
    ...
    @ManyToOne(cascade={CascadeType.ALL},fetch=FetchType.EAGER) //级联关系，抓取规则
    // @JoinColumn中的name为当前类的属性名，（多对一单向，有多方维护）所以，name为student中的cid，而ReferenceColumnName为引用表的列（多对一单向，所以为一方的引用列）即ClassRoom中的主键列
    @JoinColumn(name="cid",referencedColumnName="CID")  
    public CLassRoom setClassRoom(ClassRoom classRoom){
        this.classRoom = classRoom;
    } 
}

public class ClassRoom{
    private String cid;
    ...
}

```



#### 多对一双向外键

- 一对多双向外键也如此
- 多方持有一方的引用，一方持有多方的集合

```java
public class Student{
    private String id;
    private ClassRoom classRoom;
    ...
    @ManyToOne(cascade={CascadeType.ALL},fetch=FetchType.EAGER) //级联关系，抓取规则
    // name为ClassRoom.cid
    @JoinColumn(name="cid") 
    public CLassRoom setClassRoom(ClassRoom classRoom){
        this.classRoom = classRoom;
    } 
}

// ClassRoom添加
public class ClassRoom{
    private String cid;
    private Map<String,Student> student;

    @OneToMany(cascade={CascadeType.ALL},fetch=FetchType.LAZY) //级联关系，抓取规则
    @JoinColumn(name="cid") 
    public Map<String,Student> getStudent(){
    }
    ...
}

```



#### 多对多单向关联

```java
//Teacher类
@ManyToMany
@JoinTable(name="student_teacher",//中间表名
joinColumns=@JoinColumn(name="teacher_id"),//这个类在表中的id
inverseJoinColumns=@JoinColumn(name="student_id")//反转的类在联合表中的id
)
public Set<Student> getStudentSet() {
return studentSet;
}

```



#### 多对多双向关联

```java
//Teacher类
@ManyToMany
@JoinTable(name="student_teacher",
joinColumns=@JoinColumn(name="teacher_id"),//这个类在表中的id
inverseJoinColumns=@JoinColumn(name="student_id")//反转的类在联合表中的id
)
public Set<Student> getStudentSet() {
	return studentSet;
}

//Student类
@ManyToMany(mappedBy="studentSet")
public Set<Teacher> getSet() {
	return set;
}

```


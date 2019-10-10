---
layout: post
title: "java基础复习四Java继承"
categories: java基础
tags: java基础 继承
author: 百味皆苦
music-id: 475152589
---

* content
{:toc}
## 类，超类和子类

- 关键字extends表示继承，在Java中，所有继承都是公有继承
- 关键字extends表明正在构造的新类派生于一个已经存在的类。已经存在的类称为超类，基类或父类，新类为子类，并且子类比超类拥有的功能更加丰富
- 将通用的方法放在超类中，而将具有特殊用途的方法放在子类中
- super不是一个对象的引用，不能将super赋给另一个对象变量，它只是一个指示编译器调用超类方法的特殊关键字。
- 通过super实现对超类构造器的调用，使用super调用构造器的语句必须是子类构造器的第一条语句
- this有两个用途，一是引用隐式参数，二是调用该类其他的构造器
- super关键字两个用途，一是调用超类的方法，二是调用超类的构造器
- 在子类中可以增加域，增加方法或覆盖超类的方法，然而绝对不能删除继承的任何域和方法
- 一个对象变量可以指示多种实际类型的现象被称为多态，在运行时能够自动选择调用哪个方法的现象称为动态绑定

### 继承层次

- 继承并不仅限于一个层次。由一个公共超类派生出来的所有类的集合被称为继承层次，在继承层次中，从某个特定类到其祖先的路径被称为该类的继承链，一个祖先类可以拥有多个子孙继承链
- Java不支持多继承

### 多态

- 有一个用来判断是否应该设计为继承关系的简单规则，就是“is-a”规则，它表明子类的每一个对象也是超类的对象。

```java
Employee e;
e=new Employee();
e=new Manager();
//可以将一个子类的对象赋值给超类变量
```

- 在Java中，子类数组的引用可以转换成超类数组的引用，而不需要采用强制类型转换

```java
Manager[] manages=new Manager[10];
//将他转换成Employee[]数组是合法的
Employee[]staff=manages;
```

### 动态绑定

- 编译器查看对象的声明类型和方法名
- 编译器将查看调用方法时提供的参数类型，这个过程称为重载解析
- 在覆盖方法时，一定要保证返回类型的兼容性
- 动态绑定有一个非常重要的特性：无需对现存的代码进行修改，就可以对程序进行扩展
- 在覆盖一个方法的时候，子类方法不能低于超类方法的可见性，如果超类方法是public，子类方法一定要声明为public

### 阻止继承final

- 不允许扩展的类被称为final类
- 类中的特定方法也可以被声明为final，但是子类不能覆盖这个方法（final类中的所有方法自动的成为final方法）
- 对于final域来说，构造对象之后就不允许改变他们的值了。
- 将方法或类声明为final主要目的是：确保他们不会在子类中改变语义

### 强制类型转换

- 将一个类型强制转换为另一个类型的过程被称为类型转换
- 仅需要用一对圆括号将目标类名括起来，并放置在需要转换的对象引用之前就可以了。

```java
Manager boss=(Manager)staff[0];
```

- 进行类型转换的唯一原因是：在暂时忽视对象的实际类型之后，使用对象的全部功能。
- 在进行类型转换之前，先查看一下是否能够成功的转换，这个过程简单的使用instanceof运算符就可以实现

```java
if(staff[1] instanceof Manager)
{
  boss=(Manager)staff[1];
}
```

- 只能在继承层次内进行类型转换
- 在将超类转换为子类之前，应该使用instanceof进行检查
- 当类型转换失败时，Java不会生成一个null对象，而是抛出一个异常

### 抽象类abstract

- 如果自下而上在类的继承层次结构中上移，位于上层的类更具有通用性，甚至可能更加抽象
- 人们只将他作为派生其他类的基类，而不作为想使用的特定的实例类。
- 包含一个或多个抽象方法的类本身必须声明为抽象的
- 抽象类还可以包含具体数据和具体方法
- 在抽象类中不能包含具体方法，建议尽量将通用的域和方法（不管是否是抽象的）放在超类（不管是否是抽象类）中
- 抽象方法充当着占位的角色，它们的具体实现在子类中
- 抽象类不能被实例化，如果将一个类声明为abstract，就不能创建这个类的对象
- 可以定义一个抽象类的对象变量，但是他只能引用非抽象子类的对象

```Java
Person p=new Student();
//p是一个抽象类Person变量，Person引用了一个非抽象子类Student的实例
```

### 受保护访问

- 最好将类中的域标记为private，而方法标记为public
- 人们希望超类中的某些方法允许被子类访问，或允许子类的方法访问超类的某个域，所以需要将这些方法或域声明为protected
- 受保护的方法更具有实际意义，如果需要限制某个方法的使用，就可以将它声明为protected，这表明子类（可能很熟悉祖先类）得到信任，可以正确的使用这个方法，而其他类不行
- 事实上，Java中受保护部分对所有子类及同一个包中的所有其他类都可见
- Java控制可见性的四个访问修饰符
- 1）private：仅对本类可见
- 2）public：对所有类可见
- 3）protected：对本包和所有子类可见 

## Object超类

- Object类是Java中所有类的始祖，在Java中每个类都是由他扩展而来的
- 可以使用Object类型的变量引用任何类型的对象

```java
Object obj=new Employee();
```

- Object类型的变量只能用于作为各种值得通用持有者，要想对其中的内容进行具体的操作，需要清楚对象的原始类型，并进行相应的类型转换。
- 在Java中，只有基本类型不是对象，例如数值，字符，布尔类型的值都不是对象
- 所有的数组类型，不管是对象数组还是基本类型的数组都扩展于Object类

```java
Employee[]staff=new Employee[10];
obj=staff;
obj=new int[10];
```

### equals方法

- 该方法用于检测一个对象是否等于另一个对象。

- 在Object类中，这个方法将判断两个对象是否具有相同的引用。

- getClass（）方法将返回一个对象所属的类

- 在子类中定义equals方法时，首先调用超类的equals方法

### 相等测试
- Java要求equals方法具有下面的特性：

- 1）自反性：对于任何非空引用x，x.equals(x)应该返回true

- 2）对称性：对于任何引用x,y,当且仅当y.equals(x)返回true，x.equals(y)也应该返回true

- 3）传递性：对于任何引用x,y和z，如果x.equals(y)返回true，y.equals(z)返回true，x.equals(z)也应该返回true

- 4）一致性：如果x和y引用的对象没有发生变化，反复调用x.equals(y)应该返回同样的结果

- 5）对于任意非空引用x,x.equals(null)应该返回false

- 如果子类能够拥有自己的相等概念，则对称性需求将强制采用getClass进行检测

- 如果由超类决定相等的概念，那么就可以使用instanceof进行检测，这样就可以在不同子类的对象之间进行相等的比较

- 编写一个完美的equals方法的建议：

- 1）显式参数命名为otherobject，稍后需要将他转换成另一个叫做other的变量

- 2）检测this与otherobject是否引用同一个对象

```java
if(this==otherobject) return true;
```

- 3）检测otherobject是否为null，如果为null，返回false。

```java
if(otherobject==null) return false;
```

- 4）比较this和otherobject是否属于同一类，如果equals的语义在每个子类中有所改变，就是用getClass检测

```java
if(getClass()!=otherobject.getClass()) return false;
```

如果所有子类都拥有统一的语义，就是用instanceof检测

```java
if(!(otherobject instanceof ClassName)) return false;
```

- 5）将otherobject转换为相应的类类型变量

```java
ClassName other =(ClassName) otherobject
```

- 6）现在开始对所有需要比较的域进行比较。使用==比较基本类型域，使用equals比较对象域，如果所有域都匹配，就返回true，否则返回false

```java
return filed1==other.filed1 && Objects.equals(filed2,other.filed2)
```

### hashCode方法

- 散列码是由对象导出的一个整形值。
- 散列码是没有规律的
- 由于hashcode方法定义在Object类中，因此每个对象都有一个默认的散列码，其值为对象的存储地址
- 如果重新定义equals方法，就必须重新定义hashcode方法，以便用户可以将对象插入到散列表中
- hashcode方法应该返回一个整形数值（也可以是负数），并合理的组合实例域的散列码，以便能够让各个不同的对象产生的散列码更加均匀
- equals和hashcode的定义必须一致，如果x.equals(y)返回true，那么x.hashCode()就必须与y.hashCode()具有相同的值
- 如果存在数组类型的域，那么可以使用静态的Array.hashCode方法计算一个散列码，这个散列码由数组元素的散列码组成

### toString方法

- 它用于返回表示对象值得字符串
- 绝大多数（但不是全部）的toString方法都遵循这样的格式：类的名字，随后是一对方括号括起来的域值
- toString方法也可以供子类调用
- 随处可见toString方法的主要原因：只要对象与一个字符串通过操作符“+”连接起来，Java编译就会自动的调用toString方法，以便获得这个对象的字符串描述
- 强烈建议为自定义的每一个类增加toString方法

### API

```java
方法摘要 
protected  Object clone() 
          "创建并返回此对象的一个副本。" 
 boolean equals(Object obj) 
         " 指示其他某个对象是否与此对象“相等”。" 
protected  void finalize() 
          "当垃圾回收器确定不存在对该对象的更多引用时，由对象的垃圾回收器调用此方法。 "
 Class<?> getClass() 
         " 返回此 Object 的运行时类。" 
 int hashCode() 
         " 返回该对象的哈希码值。" 
 void notify() 
          "唤醒在此对象监视器上等待的单个线程。" 
 void notifyAll() 
         " 唤醒在此对象监视器上等待的所有线程。 "
 String toString() 
         " 返回该对象的字符串表示。" 
 void wait() 
         " 在其他线程调用此对象的 notify() 方法或 notifyAll() 方法前，导致当前线程等待。 "
 void wait(long timeout) 
          "在其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或者超过指定的时间量前，导致当前线			  程等待。" 
 void wait(long timeout, int nanos) 
         " 在其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或者其他某个线程中断当前线程，或者			  已超过某个实际时间量前，导致当前线程等待。" 

```

## ArrayList

- 一旦确定了数组的大小，改变他就不容易了
- 在Java中，可以用ArrayList这个类来解决这个问题
- 他使用起来有点像数组，但在添加或删除元素时，具有自动调节数组容量的功能
- ArrayList是一个采用类型参数的泛型类
- 对数组实施插入和删除元素的操作其效率比较低，如果数组存储的元素比较多，又经常需要在中间位置插入，删除元素，就应该考虑使用链表了。

### API

```java
// Collection中定义的API
boolean             add(E object)
boolean             addAll(Collection<? extends E> collection)
void                clear()
boolean             contains(Object object)
boolean             containsAll(Collection<?> collection)
boolean             equals(Object object)
int                 hashCode()
boolean             isEmpty()
Iterator<E>         iterator()
boolean             remove(Object object)
boolean             removeAll(Collection<?> collection)
boolean             retainAll(Collection<?> collection)
int                 size()
<T> T[]             toArray(T[] array)
Object[]            toArray()
// AbstractCollection中定义的API
void                add(int location, E object)
boolean             addAll(int location, Collection<? extends E> collection)
E                   get(int location)
int                 indexOf(Object object)
int                 lastIndexOf(Object object)
ListIterator<E>     listIterator(int location)
ListIterator<E>     listIterator()
E                   remove(int location)
E                   set(int location, E object)
List<E>             subList(int start, int end)
// ArrayList新增的API
Object               clone()
void                 ensureCapacity(int minimumCapacity)
void                 trimToSize()
void                 removeRange(int fromIndex, int toIndex)
```

```java
boolean add(E e) 
          "将指定的元素添加到此列表的尾部。" 
 void add(int index, E element) 
          "将指定的元素插入此列表中的指定位置。" 
 boolean addAll(Collection<? extends E> c) 
         " 按照指定 collection 的迭代器所返回的元素顺序，将该 collection 中的所有元素添加到此列表的尾			部。 "
 boolean addAll(int index, Collection<? extends E> c) 
         "从指定的位置开始，将指定 collection 中的所有元素插入到此列表中。" 
 void clear() 
          "移除此列表中的所有元素。" 
 Object clone() 
         " 返回此 ArrayList 实例的浅表副本。" 
 boolean contains(Object o) 
         " 如果此列表中包含指定的元素，则返回 true。" 
 void ensureCapacity(int minCapacity) 
         " 如有必要，增加此 ArrayList 实例的容量，以确保它至少能够容纳最小容量参数所指定的元素数。" 
 E get(int index) 
          "返回此列表中指定位置上的元素。" 
 int indexOf(Object o) 
          "返回此列表中首次出现的指定元素的索引，或如果此列表不包含元素，则返回 -1。" 
 boolean isEmpty() 
         " 如果此列表中没有元素，则返回 true "
 int lastIndexOf(Object o) 
          "返回此列表中最后一次出现的指定元素的索引，或如果此列表不包含索引，则返回 -1。" 
 E remove(int index) 
         " 移除此列表中指定位置上的元素。" 
 boolean remove(Object o) 
         " 移除此列表中首次出现的指定元素（如果存在）。 "
protected  void removeRange(int fromIndex, int toIndex) 
         " 移除列表中索引在 fromIndex（包括）和 toIndex（不包括）之间的所有元素。" 
 E set(int index, E element) 
         " 用指定的元素替代此列表中指定位置上的元素。 "
 int size() 
         " 返回此列表中的元素数。 "
 Object[] toArray() 
         " 按适当顺序（从第一个到最后一个元素）返回包含此列表中所有元素的数组。" 
<T> T[] toArray(T[] a) 
          "按适当顺序（从第一个到最后一个元素）返回包含此列表中所有元素的数组；返回数组的运行时类型是指			定数组的运行时类型。" 
 void trimToSize() 
         " 将此 ArrayList 实例的容量调整为列表的当前大小。" 

```



## 对象包装器和自动装箱

- 所有的基本类型都有一个与之对应的类，有时，需要将int这样的基本类型转为对象，如Integer类对应的基本类型是int，这些类称为包装类
- 对象包装器类是不可变的，一旦构造了包装器，就不允许更改包装在其中的值。
- 对象包装器类还是final，因此不能定义它们的子类
- 下面操作称为自动装箱

```java
ArrayList<Integer> list=new ArrayList<>();
list.add(3);
//自动变换成
list.add(Integer.valueOf(3));
```

- 相应的，当将一个Integer对象赋值给一个int值，将会自动拆箱

```java
int n=list.get(i);
//自动转换为
int n=list.get(i).intValue();
```

- 在算术表达式中也能够自动装箱和拆箱
- 如果将经常出现的值包装到同一个对象中，这种比较就有可能成立
- 自动装箱规范要求boolean，byte，char<=127,介于-128~127之间的short和int被包装到固定的对象中

### API

```java
字段摘要 
static int MAX_VALUE 
         " 值为 231－1 的常量，它表示 int 类型能够表示的最大值。" 
static int MIN_VALUE 
          "值为 －231 的常量，它表示 int 类型能够表示的最小值。 "
static int SIZE 
          "用来以二进制补码形式表示 int 值的比特位数。 "
static Class<Integer> TYPE 
         " 表示基本类型 int 的 Class 实例。 "

```

```java
构造方法摘要 
Integer(int value) 
        "  构造一个新分配的 Integer 对象，它表示指定的 int 值。" 
Integer(String s) 
         " 构造一个新分配的 Integer 对象，它表示 String 参数所指示的 int 值。 "

```

```java
方法摘要 
static int bitCount(int i) 
          "返回指定 int 值的二进制补码表示形式的 1 位的数量。 "
 byte byteValue() 
         " 以 byte 类型返回该 Integer 的值。" 
 int compareTo(Integer anotherInteger) 
         " 在数字上比较两个 Integer 对象。" 
static Integer decode(String nm) 
         " 将 String 解码为 Integer。" 
 double doubleValue() 
          "以 double 类型返回该 Integer 的值。" 
 boolean equals(Object obj) 
         " 比较此对象与指定对象。" 
 float floatValue() 
         " 以 float 类型返回该 Integer 的值。" 
static Integer getInteger(String nm) 
          "确定具有指定名称的系统属性的整数值。" 
static Integer getInteger(String nm, int val) 
          "确定具有指定名称的系统属性的整数值。" 
static Integer getInteger(String nm, Integer val) 
          "返回具有指定名称的系统属性的整数值。" 
 int hashCode() 
          "返回此 Integer 的哈希码。" 
static int highestOneBit(int i) 
          "返回具有至多单个 1 位的 int 值，在指定的 int 值中最高位（最左边）的 1 位的位置。 "
 int intValue() 
          "以 int 类型返回该 Integer 的值。" 
 long longValue() 
          "以 long 类型返回该 Integer 的值。" 
static int lowestOneBit(int i) 
         " 返回具有至多单个 1 位的 int 值，在指定的 int 值中最低位（最右边）的 1 位的位置。" 
static int numberOfLeadingZeros(int i) 
         " 在指定 int 值的二进制补码表示形式中最高位（最左边）的 1 位之前，返回零位的数量。" 
static int numberOfTrailingZeros(int i) 
         " 返回指定的 int 值的二进制补码表示形式中最低（“最右边”）的为 1 的位后面的零位个数。" 
static int parseInt(String s) 
         " 将字符串参数作为有符号的十进制整数进行解析。" 
static int parseInt(String s, int radix) 
          "使用第二个参数指定的基数，将字符串参数解析为有符号的整数。 "
static int reverse(int i) 
          "返回通过反转指定 int 值的二进制补码表示形式中位的顺序而获得的值。 "
static int reverseBytes(int i) 
          "返回通过反转指定 int 值的二进制补码表示形式中字节的顺序而获得的值。" 
static int rotateLeft(int i, int distance) 
          "返回根据指定的位数循环左移指定的 int 值的二进制补码表示形式而得到的值。" 
static int rotateRight(int i, int distance) 
          "返回根据指定的位数循环右移指定的 int 值的二进制补码表示形式而得到的值。 "
 short shortValue() 
         " 以 short 类型返回该 Integer 的值。 "
static int signum(int i) 
          "返回指定 int 值的符号函数。 "
static String toBinaryString(int i) 
         " 以二进制（基数 2）无符号整数形式返回一个整数参数的字符串表示形式。" 
static String toHexString(int i) 
          "以十六进制（基数 16）无符号整数形式返回一个整数参数的字符串表示形式。 "
static String toOctalString(int i) 
          "以八进制（基数 8）无符号整数形式返回一个整数参数的字符串表示形式。" 
 String toString() 
          "返回一个表示该 Integer 值的 String 对象。 "
static String toString(int i) 
         " 返回一个表示指定整数的 String 对象。 "
static String toString(int i, int radix) 
          "返回用第二个参数指定基数表示的第一个参数的字符串表示形式。" 
static Integer valueOf(int i) 
         " 返回一个表示指定的 int 值的 Integer 实例。" 
static Integer valueOf(String s) 
          "返回保存指定的 String 的值的 Integer 对象。 "
static Integer valueOf(String s, int radix) 
         " 返回一个 Integer 对象，该对象中保存了用第二个参数提供的基数进行解析时从指定的 String 中提取            的值。 "

```

## 参数数量可变

```java
public class PrintStream
{
  public PrintStream printf(String fmt,Object...args)
  {
    return format(fmt,args);
  }
}
/*
Object...args表明这个方法可以接受任意数量的对象
*/
```

## 枚举类

- 在比较两个枚举类型的数值时，永远不要使用equals，而直接使用“==”就可以了。
- 如果需要，可以在枚举类型中添加一些构造器，方法，和域
- 构造器只在构造枚举常量的时候被调用
- 所有的枚举类型都是Enum类的子类
- toString方法能够返回枚举常量名

```java
public enum Size
{
  SMALL("S"),MEDIUM("M"),LARGE("L"),EXTRA_LARGE("XL");
  
  private String abbreviatation;
  
  private Size(String abbreviation)
  {
    this.abbreviation=abbreviation;
  }
  public String getAbbreviation(){
    return abbreviation;
  }
}
```

```java
Size.SMALL.toString()//返回字符串“SMALL”
Size s=Enum.valueOf(Size.class,"SMALL")//将s设置为Size.SMALL
```

### API

```java
方法摘要 
protected  Object clone() 
          "抛出 CloneNotSupportedException。 "
 int compareTo(E o) 
         " 比较此枚举与指定对象的顺序。" 
 boolean equals(Object other) 
          "当指定对象等于此枚举常量时，返回 true。 "
protected  void finalize() 
          "枚举类不能有 finalize 方法。" 
 Class<E> getDeclaringClass() 
          "返回与此枚举常量的枚举类型相对应的 Class 对象。 "
 int hashCode() 
         " 返回枚举常量的哈希码。" 
 String name() 
          "返回此枚举常量的名称，在其枚举声明中对其进行声明。 "
 int ordinal() 
          "返回枚举常量的序数（它在枚举声明中的位置，其中初始常量序数为零）。" 
 String toString() 
         " 返回枚举常量的名称，它包含在声明中。" 
static <T extends Enum<T>> T 
 valueOf(Class<T> enumType, String name) 
         " 返回带指定名称的指定枚举类型的枚举常量。" 

```



## 反射

本模块参考自http://how2j.cn/k/reflection/reflection-class/108.html

### 获取类对象

- 类对象概念： 所有的类，都存在一个类对象，这个类对象用于提供类本身的信息，比如有几种构造方法， 有多少属性，有哪些普通方法。

#### 类对象概念

- 在理解类对象之前，先说我们熟悉的对象之间的区别：garen和teemo都是Hero对象，他们的区别在于，各自有不同的名称，血量，伤害值。
- 然后说说类之间的区别，Hero和Item都是类，他们的区别在于有不同的方法，不同的属性。
- 类对象，就是用于描述这种类，都有什么属性，什么方法的

#### 获取类对象

- 获取类对象有3种方式：Class.forName，Hero.class，new Hero().getClass()
- 在一个JVM中，一种类，只会有一个类对象存在。所以以上三种方式取出来的类对象，都是一样的。

```java
package reflection;
 
import charactor.Hero;
 
public class TestReflection {
 
    public static void main(String[] args) {
            String className = "charactor.Hero";
            try {
                Class pClass1=Class.forName(className);
                Class pClass2=Hero.class;
                Class pClass3=new Hero().getClass();
                System.out.println(pClass1==pClass2);
                System.out.println(pClass1==pClass3);
            } catch (ClassNotFoundException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
    }
}
```

#### 类属性初始化

- 为Hero增加一个静态属性,并且在静态初始化块里进行初始化，参考 [类属性初始化](http://how2j.cn/k/class-object/class-object-init/297.html#step589)。

```java
static String copyright;
static {
    System.out.println("初始化 copyright");
    copyright = "版权由Riot Games公司所有";
}
```

- 无论什么途径获取类对象，都会导致静态属性被初始化，而且只会执行一次。（除了直接使用 Class c = Hero.class 这种方式，这种方式不会导致静态属性被初始化）

```java
package charactor;
 
public class Hero {
    public String name;
    public float hp;
    public int damage;
    public int id;
 
    static String copyright;
 
    static {
        System.out.println("初始化 copyright");
        copyright = "版权由Riot Games公司所有";
    }
 
}
```

```java
package reflection;
 
import charactor.Hero;
 
public class TestReflection {
 
    public static void main(String[] args) {
            String className = "charactor.Hero";
            try {
                Class pClass1=Class.forName(className);
                Class pClass2=Hero.class;
                Class pClass3=new Hero().getClass();
            } catch (ClassNotFoundException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
    }
}
```

### 创建对象

- 与传统的通过new 来获取对象的方式不同，反射机制，会先拿到Hero的“类对象”,然后通过类对象获取“构造器对象” ，再通过构造器对象创建一个对象

```java
package reflection;
import java.lang.reflect.Constructor;
import charactor.Hero;
public class TestReflection {
  
    public static void main(String[] args) {
        //传统的使用new的方式创建对象
        Hero h1 =new Hero();
        h1.name = "teemo";
        System.out.println(h1);
          
        try {
            //使用反射的方式创建对象
            String className = "charactor.Hero";
            //类对象
            Class pClass=Class.forName(className);
            //构造器
            Constructor c= pClass.getConstructor();
            //通过构造器实例化
            Hero h2= (Hero) c.newInstance();
            h2.name="gareen";
            System.out.println(h2);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
```

- 通过配置文件获取对象
- 首先准备一个文本文件：hero.config。 在这个文件中保存类的全名称，可以是charactor.APHero 或者是charactor.ADHero
- 接着设计一个方法叫做：public static Hero getHero()
- 在这个方法中，读取hero.config的数据，取出其中的类名，根据类名实例化出对象，然后返回对象。

```java
package charactor;
  
public class APHero extends Hero {
  
    public void magicAttack() {
        System.out.println("进行魔法攻击");
    }
  
}
```

```java
package charactor;
  
public class ADHero extends Hero {
  
    public void physicAttack() {
        System.out.println("进行物理攻击");
    }
  
}
```

### 访问属性

- 通过反射机制修改对象的属性

#### Hero.java

- 为了访问属性，把name修改为public。
- 对于private修饰的成员，需要使用setAccessible(true)才能访问和修改。

```java
package charactor;
 
public class Hero {
    public String name;
    public float hp;
    public int damage;
    public int id;
     
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Hero(){
         
    }
    public Hero(String string) {
        name =string;
    }
 
    @Override
    public String toString() {
        return "Hero [name=" + name + "]";
    }
    public boolean isDead() {
        // TODO Auto-generated method stub
        return false;
    }
    public void attackHero(Hero h2) {
        System.out.println(this.name+ " 正在攻击 " + h2.getName());
    }
 
}
```

#### TestRelection

- 通过反射修改属性的值

```java
package reflection;
 
import java.lang.reflect.Field;
 
import charactor.Hero;
  
public class TestReflection {
  
    public static void main(String[] args) {
            Hero h =new Hero();
            //使用传统方式修改name的值为garen
            h.name = "garen";
            try {
                //获取类Hero的名字叫做name的字段
                Field f1= h.getClass().getDeclaredField("name");
                //修改这个字段的值
                f1.set(h, "teemo");
                //打印被修改后的值
                System.out.println(h.name);
                 
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
    }
}
```

#### 区别

- getField和getDeclaredField的区别
- 这两个方法都是用于获取字段
- getField 只能获取public的，包括从父类继承来的字段。
- getDeclaredField 可以获取本类所有的字段，包括private的，但是不能获取继承来的字段。 (注： 这里只能获取到private的字段，但并不能访问该private字段的值,除非加上setAccessible(true))

### 调用方法

- 通过反射机制，调用一个对象的方法

```java
package charactor;
 
public class Hero {
    public String name;
    public float hp;
    public int damage;
    public int id;
     
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Hero(){
         
    }
    public Hero(String string) {
        name =string;
    }
 
    @Override
    public String toString() {
        return "Hero [name=" + name + "]";
    }
    public boolean isDead() {
        // TODO Auto-generated method stub
        return false;
    }
    public void attackHero(Hero h2) {
        // TODO Auto-generated method stub
         
    }
 
}
```

```java
package reflection;
 
import java.lang.reflect.Method;
 
import charactor.Hero;
 
public class TestReflection {
 
    public static void main(String[] args) {
        Hero h = new Hero();
 
        try {
            // 获取这个名字叫做setName，参数类型是String的方法
            Method m = h.getClass().getMethod("setName", String.class);
            // 对h对象，调用这个方法
            m.invoke(h, "盖伦");
            // 使用传统的方式，调用getName方法
            System.out.println(h.getName());
 
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
 
    }
}
```

- 通过配置文件获取对象

```java
charactor.APHero
garen
charactor.ADHero
teemo
```

- 首先根据这个配置文件，使用反射实例化出两个英雄出来。
- 然后通过反射给这两个英雄设置名称，接着再通过反射，调用第一个英雄的attackHero方法，攻击第二个英雄

```java
package charactor;
  
public class Hero {
    public String name;
    public float hp;
    public int damage;
    public int id;
      
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Hero(){
          
    }
    public Hero(String string) {
        name =string;
    }
  
    @Override
    public String toString() {
        return "Hero [name=" + name + "]";
    }
    public boolean isDead() {
        // TODO Auto-generated method stub
        return false;
    }
    public void attackHero(Hero h2) {
        System.out.println(this.name+ " 正在攻击 " + h2.getName());
    }
  
}
```

```java
package charactor;
  
public class APHero extends Hero {
  
    public void magicAttack() {
        System.out.println("进行魔法攻击");
    }
  
}
```

```java
package charactor;
  
public class ADHero extends Hero {
  
    public void physicAttack() {
        System.out.println("进行物理攻击");
    }
  
}
```

### 反射作用

- 反射非常强大，但是学习了之后，会不知道该如何使用，反而觉得还不如直接调用方法来的直接和方便。
- 通常来说，需要在学习了[Spring ](http://how2j.cn/k/spring/spring-ioc-di/87.html)的依赖注入，反转控制之后，才会对反射有更好的理解
- 业务类

```java
package reflection;
 
public class Service1 {
 
    public void doService1(){
        System.out.println("业务方法1");
    }
}
```

```java
package reflection;
 
public class Service2 {
 
    public void doService2(){
        System.out.println("业务方法2");
    }
}
```

- 非反射方式：当需要从第一个业务方法切换到第二个业务方法的时候，使用非反射方式，必须修改代码，并且重新编译运行，才可以达到效果

```java
package reflection;
 
public class Test {
 
    public static void main(String[] args) {
        new Service1().doService1();
    }
}
```

```java
package reflection;
 
public class Test {
 
    public static void main(String[] args) {
//      new Service1().doService1();
        new Service2().doService2();
    }
}
```

#### 反射方式

- 使用反射方式，首先准备一个配置文件，就叫做spring.txt吧, 放在src目录下。 里面存放的是类的名称，和要调用的方法名。
- 在测试类Test中，首先取出类名称和方法名，然后通过反射去调用这个方法。
- 当需要从调用第一个业务方法，切换到调用第二个业务方法的时候，不需要修改一行代码，也不需要重新编译，只需要修改配置文件spring.txt，再运行即可。
- 这也是[Spring框架](http://how2j.cn/k/spring/spring-ioc-di/87.html)的最基本的原理，只是它做的更丰富，安全，健壮。

```
class=reflection.Service1
method=doService1
```

```java
package reflection;
 
import java.io.File;
import java.io.FileInputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Properties;
 
public class Test {
 
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public static void main(String[] args) throws Exception {
 
        //从spring.txt中获取类名称和方法名称
        File springConfigFile = new File("e:\\project\\j2se\\src\\spring.txt");
        Properties springConfig= new Properties();
        springConfig.load(new FileInputStream(springConfigFile));
        String className = (String) springConfig.get("class");
        String methodName = (String) springConfig.get("method");
         
        //根据类名称获取类对象
        Class clazz = Class.forName(className);
        //根据方法名称，获取方法对象
        Method m = clazz.getMethod(methodName);
        //获取构造器
        Constructor c = clazz.getConstructor();
        //根据构造器，实例化出对象
        Object service = c.newInstance();
        //调用对象的指定方法
        m.invoke(service);
         
    }
}
```

## Class-API

```java
方法摘要 
<U> Class<? extends U> asSubclass(Class<U> clazz) 
         " 强制转换该 Class 对象，以表示指定的 class 对象所表示的类的一个子类。" 
 T cast(Object obj) 
          "将一个对象强制转换成此 Class 对象所表示的类或接口。" 
 boolean desiredAssertionStatus() 
         " 如果要在调用此方法时将要初始化该类，则返回将分配给该类的断言状态。" 
static Class<?> forName(String className) 
         " 返回与带有给定字符串名的类或接口相关联的 Class 对象。 "
static Class<?> forName(String name, boolean initialize, ClassLoader loader) 
          "使用给定的类加载器，返回与带有给定字符串名的类或接口相关联的 Class 对象。 "
<A extends Annotation> A 
 getAnnotation(Class<A> annotationClass) 
         " 如果存在该元素的指定类型的注释，则返回这些注释，否则返回 null。 "
 Annotation[] getAnnotations() 
          "返回此元素上存在的所有注释。" 
 String getCanonicalName() 
         " 返回 Java Language Specification 中所定义的底层类的规范化名称。" 
 Class<?>[] getClasses() 
          "返回一个包含某些 Class 对象的数组，这些对象表示属于此 Class 对象所表示的类的成员的所有公共类			  和接口。 "
 ClassLoader getClassLoader() 
          "返回该类的类加载器。 "
 Class<?> getComponentType() 
          "返回表示数组组件类型的 Class。" 
 Constructor<T> getConstructor(Class<?>... parameterTypes) 
          "返回一个 Constructor 对象，它反映此 Class 对象所表示的类的指定公共构造方法。" 
 Constructor<?>[] getConstructors() 
         " 返回一个包含某些 Constructor 对象的数组，这些对象反映此 Class 对象所表示的类的所有公共构造			 方法。" 
 Annotation[] getDeclaredAnnotations() 
         " 返回直接存在于此元素上的所有注释。" 
 Class<?>[] getDeclaredClasses() 
         " 返回 Class 对象的一个数组，这些对象反映声明为此 Class 对象所表示的类的成员的所有类和接口。" 
 Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes) 
         " 返回一个 Constructor 对象，该对象反映此 Class 对象所表示的类或接口的指定构造方法。 "
 Constructor<?>[] getDeclaredConstructors() 
         " 返回 Constructor 对象的一个数组，这些对象反映此 Class 对象表示的类声明的所有构造方法。 "
 Field getDeclaredField(String name) 
        "  返回一个 Field 对象，该对象反映此 Class 对象所表示的类或接口的指定已声明字段。 "
 Field[] getDeclaredFields() 
          "返回 Field 对象的一个数组，这些对象反映此 Class 对象所表示的类或接口所声明的所有字段。" 
 Method getDeclaredMethod(String name, Class<?>... parameterTypes) 
         " 返回一个 Method 对象，该对象反映此 Class 对象所表示的类或接口的指定已声明方法。" 
 Method[] getDeclaredMethods() 
          "返回 Method 对象的一个数组，这些对象反映此 Class 对象表示的类或接口声明的所有方法，包括公				共、保护、默认（包）访问和私有方法，但不包括继承的方法。 "
 Class<?> getDeclaringClass() 
         " 如果此 Class 对象所表示的类或接口是另一个类的成员，则返回的 Class 对象表示该对象的声明类。" 
 Class<?> getEnclosingClass() 
          "返回底层类的立即封闭类。 "
 Constructor<?> getEnclosingConstructor() 
         " 如果该 Class 对象表示构造方法中的一个本地或匿名类，则返回 Constructor 对象，它表示底层类的			立即封闭构造方法。" 
 Method getEnclosingMethod() 
          "如果此 Class 对象表示某一方法中的一个本地或匿名类，则返回 Method 对象，它表示底层类的立即封			闭方法。" 
 T[] getEnumConstants() 
         " 如果此 Class 对象不表示枚举类型，则返回枚举类的元素或 null。" 
 Field getField(String name) 
          "返回一个 Field 对象，它反映此 Class 对象所表示的类或接口的指定公共成员字段。" 
 Field[] getFields() 
          "返回一个包含某些 Field 对象的数组，这些对象反映此 Class 对象所表示的类或接口的所有可访问公共			  字段。 "
 Type[] getGenericInterfaces() 
          "返回表示某些接口的 Type，这些接口由此对象所表示的类或接口直接实现。" 
 Type getGenericSuperclass() 
          "返回表示此 Class 所表示的实体（类、接口、基本类型或 void）的直接超类的 Type。" 
 Class<?>[] getInterfaces() 
         " 确定此对象所表示的类或接口实现的接口。" 
 Method getMethod(String name, Class<?>... parameterTypes) 
         " 返回一个 Method 对象，它反映此 Class 对象所表示的类或接口的指定公共成员方法。" 
 Method[] getMethods() 
          "返回一个包含某些 Method 对象的数组，这些对象反映此 Class 对象所表示的类或接口（包括那些由该			类或接口声明的以及从超类和超接口继承的那些的类或接口）的公共 member 方法。" 
 int getModifiers() 
         " 返回此类或接口以整数编码的 Java 语言修饰符。" 
 String getName() 
         " 以 String 的形式返回此 Class 对象所表示的实体（类、接口、数组类、基本类型或 void）名称。" 
 Package getPackage() 
         " 获取此类的包。" 
 ProtectionDomain getProtectionDomain() 
         " 返回该类的 ProtectionDomain。" 
 URL getResource(String name) 
          "查找带有给定名称的资源。" 
 InputStream getResourceAsStream(String name) 
          "查找具有给定名称的资源。" 
 Object[] getSigners() 
         " 获取此类的标记。" 
 String getSimpleName() 
         " 返回源代码中给出的底层类的简称。" 
 Class<? super T> getSuperclass() 
         " 返回表示此 Class 所表示的实体（类、接口、基本类型或 void）的超类的 Class。" 
 TypeVariable<Class<T>>[] getTypeParameters() 
          "按声明顺序返回 TypeVariable 对象的一个数组，这些对象表示用此 GenericDeclaration 对象所表示		  的常规声明来声明的类型变量。 "
 boolean isAnnotation() 
         " 如果此 Class 对象表示一个注释类型则返回 true。" 
 boolean isAnnotationPresent(Class<? extends Annotation> annotationClass) 
          "如果指定类型的注释存在于此元素上，则返回 true，否则返回 false。" 
 boolean isAnonymousClass() 
          "当且仅当底层类是匿名类时返回 true。" 
 boolean isArray() 
         " 判定此 Class 对象是否表示一个数组类。" 
 boolean isAssignableFrom(Class<?> cls) 
          "判定此 Class 对象所表示的类或接口与指定的 Class 参数所表示的类或接口是否相同，或是否是其超类			  或超接口。" 
 boolean isEnum() 
         " 当且仅当该类声明为源代码中的枚举时返回 true。 "
 boolean isInstance(Object obj) 
         " 判定指定的 Object 是否与此 Class 所表示的对象赋值兼容。" 
 boolean isInterface() 
          "判定指定的 Class 对象是否表示一个接口类型。" 
 boolean isLocalClass() 
          "当且仅当底层类是本地类时返回 true。" 
 boolean isMemberClass() 
         " 当且仅当底层类是成员类时返回 true。 "
 boolean isPrimitive() 
         " 判定指定的 Class 对象是否表示一个基本类型。" 
 boolean isSynthetic() 
         " 如果此类是复合类，则返回 true，否则 false。" 
 T newInstance() 
         " 创建此 Class 对象所表示的类的一个新实例。 "
 String toString() 
          "将对象转换为字符串。" 

```



## 继承设计技巧

- 将公共操作和域放在超类
- 不要使用受保护的域
- 使用继承实现“is-a”关系
- 除非所有继承的方法都有意义，否则不要使用继承
- 在覆盖方法时，不要改变预期的行为
- 使用多态，而非类型信息
- 不要过多的使用反射
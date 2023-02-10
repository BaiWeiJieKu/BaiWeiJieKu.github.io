---
layout: post
title: "java基础复习-Java介绍"
categories: java基础
tags: java基础 Java介绍
author: 百味皆苦
music-id: 29836717
---

* content
{:toc}
## 1：Java语言的主要特性

### 1简单性

Java语言是c++语言的一个“纯净”版本，这里没有头文件，指针运算（甚至指针语法）,结构，联合，操作符重载，虚基类等。

简单的另一个方面是小，Java的目标之一是支持开发能够在小型机器上独立运行的软件。

### 2面向对象

简单的讲，面向对象设计是一种程序设计技术，他将重点放在数据（即对象）和对象的接口上。

打个比喻：我（具有操作门的功能）去操作门（门有打开和关闭功能），把他打开，这就是面向对象

​		   我走过去把门打开了，这是面向过程。

在本质上，Java的面向对象能力和c++是一样的，主要不同在于多继承（Java支持单继承（extends）多实现（implement）），在Java中取而代之的是简单的接口概念。

### 3网络技能

Java有一个扩展的例程库，用于处理像HTTP和FTP之类的TCP/IP协议。Java应用程序能够通过URL打开和访问网络上的对象，其便捷程度就好像访问本地文件一样。

### 4健壮性

Java的设计目标之一在于使得Java编写的程序具有多方面的可靠性。Java和c++最大的不同之处在于Java采用的指针模型可以消除重写内存和损坏数据的可能性。

Java编译器能够检测许多在其他语言中仅在运行时刻才能够检测出来的问题。

Java是绝对安全的，其原因是永远不会存取一个“坏的”指针，造成内存分配的错误，也不必防范内存泄漏。

Java的强类型机制、异常处理、垃圾的自动收集等是Java程序健壮性的重要保证。

### 5安全性

Java适用于网络/分布式环境。

从一开始，Java就设计成能够防范各种攻击，其中包括：

- 运行时堆栈溢出，如蠕虫病毒等常用的攻击手段。

- 在自己 的处理空间之外破坏内存。

- 未经授权读写文件。


Java通过数字签名类，可以确定类的作者，如果信任这个类的作者，这个类就可以在你的机器上拥有更多的权限。

### 6体系结构中立

编译器生成一个体系结构中立的目标文件格式，这是一种编译过的代码，只要有Java系统运行时，就可以在许多处理器上运行。

Java编译器通过生成与特定的计算机体系结构无关的字节码指令来实现这一特性。

### 7可移植性

与c和c++不同，Java规范中没有“依赖具体实现”的地方。基本数据类型的大小以及有关算法都做了明确的说明。（例如Java中的int永远为32位的整数）

在Java中，数据类型具有固定的大小，这消除了代码移植时的问题。

二进制数据以固定的格式进行存储和传输。消除了字节顺序的困扰。字符串是用标准的Unicode格式存储的。

### 8解释型

Java解释器可以在任何移植了解释器的机器上执行Java字节码。

### 9高性能

尽管对解释后的字节码性能已经比较满意，但在有些场合下还需要更加高效的性能。 字节码可以（在运行时刻）快速的翻译成运行这个应用程序的特定CPU的机器码。性能就是“适应性更强”。

### 10多线程

多线程可以带来更好的交互响应和实时行为。

Java中的线程可以利用多个处理器。

Java把多线程的实现交给了底层的操作系统或线程库来完成。

## 2：Java语言的核心内容

- 涵盖 java的基本语法结构、java的面向对象特征、java集合框架体系、java泛型、异常处理、java 注释、java的 io 流体系、java多线程编程、java网络通信编程和 java 反射机制；
- 覆盖了java.lang、java.util、java.text、java.io 和 java.nio、java.sql 包下绝大部分类和接口。



## 3：java语言规范

- 类格式：修饰符（public）+class+类名（HelloWorld首字母大写，驼峰命名，必须以字母开头，后面可以跟字母和数字的任意组合，不得使用Java保留字）

- main方法必须声明为public

- ```java
  public class HelloWorld{
    public static void main(String[] args){
      System.out.println("hello world");
    }
  }
  ```



### 注释

```java
//单行注释

/**
文档注释
*/

/*多行注释*/
```



### 数据类型

| 数据类型    | 字节    | 范围                                       |
| ------- | ----- | ---------------------------------------- |
| byte    | 1字节   | -128~127                                 |
| short   | 2字节   | -32 768~32767                            |
| int     | 4字节   | -2147 483 648~2147 483 647               |
| long    | 8字节   | -9223 372 016 854 775 808~9223 372 036 854 775 807 |
| float   | 4字节   |                                          |
| double  | 8字节   |                                          |
| boolean | 1byte |                                          |
| char    |       |                                          |

- boolean(整形值和布尔值之间不能进行相互转换)
- 变量：第二个单词开始首字母大写，声明一个变量后必须用赋值语句对变量进行显式初始化
- 常量：用final修饰，只能被赋值一次，常量名用全大写
- 类型强转：int x=(int)6.66=>x=6

### 运算符

- +(加)-（减）*（乘）/（除）%(取余)

- ++(自增)--(自减)

- ==检测是否相等！=不相等>,>=,<,<=

- ```
  &&与||或！=非
  &（“与”），|（“或”），^（“异或”），~（“非”）
  ？：三元操作符
  二进制位右移（>>）左移（<<）
  平方根Math.sqrt()
  ```



## 4：字符串

Java字符串就是Unicode字符序列。Java没有内置的字符串类型，String是一个预定义类

### 1、equals()

- 它具有如下的一般形式：boolean equals(Object str)
- str是一个用来与调用字符串（String）对象做比较的字符串（String）对象。
- 如果两个字符串具有相同的字符和长度，它返回true，否则返回false。这种比较是区分大小写的。

### 2、IgnoreCase( )

- 当比较两个字符串时，它会认为A-Z和a-z是一样的。
- 其一般形式如下：boolean equalsIgnoreCase(String str)
- str是一个用来与调用字符串（String）对象做比较的字符串（String）对象。如果两个字符串具有相同的字符和长度，它也返回true，否则返回false。

### 3、toString()

```java
Object object = getObject(); 

System.out.println(object.toString()); 

```

- 注意：必须保证object不是null值，否则将抛出NullPointerException异常。
- 采用这种方法时，通常派生类会覆盖Object里的toString（）方法。 

### 4、String

- （String）object：这是标准的类型转换，将object转成String类型的值。
- 注意：类型必须能转成String类型。因此最好用instanceof做个类型检查，以判断是否可以转换。否则容易抛出CalssCastException异常。
- 因定义为Object 类型的对象在转成String时语法检查并不会报错，这将可能导致潜在的错误存在。
- 如： Object obj = new Integer(100); String strVal = (String)obj; 在运行时将会出错，因为将Integer类型强制转换为String类型，无法通过。 
- 但是， Integer obj = new Integer(100); String strVal = (String)obj; 
- 如是格式代码，将会报语法错误。此外，因null值可以强制转换为任何java类类型，(String)null也是合法的。 

### 5、valueOf()

- 注意：当object为null 时，String.valueOf（object）的值是字符串”null”，而不是null。

### 6、split()

```properties
1、如果用“.”作为分隔的话,必须是如下写法,String.split("\\.")

2、如果用“|”作为分隔的话,必须是如下写法,String.split("\\|"),
“.”、“|”、"*" 和"+"都是转义字符,必须得加"\\";

3、如果在一个字符串中有多个分隔符,可以用“|”作为连字符,比如,“acount=? and uu =? or n=?”,把三个都分隔出来,可以用String.split("and|or");
```



```java
例如：String[] aa = "aaa|bbb|ccc".split("\*"); 

for (int i = 0 ; i <aa.length ; i++ ) {

System.out.println("--"+aa[i]); 

} 

```

### 7、subString()

- （1）str＝str.substring(int beginIndex);截取掉str从首字母起长度为beginIndex的字符串，将剩余字符串赋值给str；
- （2）str＝str.substring(int beginIndex，int endIndex);截取str中从beginIndex开始至endIndex结束时的字符串，并将其赋值给str;

### 8、charAt()

```java
public char charAt(int index)

char s = str.charAt(1);

```

### 9、LowerCase()

```java
public String toLowerCase()

String newStr = str.toLowerCase();

```

### 10、indexOf()

- 1、int indexOf(String str) ：返回第一次出现的指定子字符串在此字符串中的索引。 
- 2、int indexOf(String str, int startIndex)：从指定的索引处开始，返回第一次出现的指定子字符串在此字符串中的索引。 
- 3、int lastIndexOf(String str) ：返回在此字符串中最右边出现的指定子字符串的索引。 
- 4、int lastIndexOf(String str, int startIndex) ：从指定的索引处开始向后搜索，返回在此字符串中最后一次出现的指定子字符串的索引。
- 注意：如果没有找到子字符串，则返回-1。
- 如果 startindex 是负数，则 startindex 被当作零。如果它比最大的字符位置索引还大，则它被当作最大的可能索引。

```java
例如：String s = "xXccxxxXX"; 

// 从头开始查找是否存在指定的字符 //结果如下 

System.out.println(s.indexOf("c")); //2 

// 从第四个字符位置开始往后继续查找，包含当前位置 

System.out.println(s.indexOf("c", 3)); //3 

//若指定字符串中没有该字符则系统返回-1 

System.out.println(s.indexOf("y")); //-1 

System.out.println(s.lastIndexOf("x")); //6 

```

### 11、replace

- （1）replace的参数是char和CharSequence，即可以支持字符的替换，也支持字符串的替换（CharSequence即字符串序列的意思,说白了也就是字符串）；
- （2）replaceAll的参数是regex，即基于规则表达式的替换，比如：可以通过replaceAll("\\d", "*")把一个字符串所有的数字字符都换成星号；
- 相同点：都是全部替换，即把源字符串中的某一字符或字符串全部换成指定的字符或字符串；
- 不同点：（1）replaceAll支持正则表达式，因此会对参数进行解析（两个参数均是），如replaceAll("\\d", "*")，而replace则不会，replace("\\d","*")就是替换"\\d"的字符串，而不会解析为正则。
- （2）“\”在java中是一个转义字符，所以需要用两个代表一个。例如System.out.println( "\\" ) ;只打印出一个"\"。但是“\”也是正则表达式中的转义字符，需要用两个代表一个。所以：\\\\被java转换成\\，\\又被正则表达式转换成\，因此用replaceAll替换“\”为"\\"，就要用replaceAll("\\\\","\\\\\\\\")，而replace则replace("\\","\\\\")。
- （3）如果只想替换第一次出现的，可以使用replaceFirst()，这个方法也是基于规则表达式的替换，但与replaceAll()不同的是，只替换第一次出现的字符串。 

```java
说到正则表达式，有个例子就能很好的解释replaceAll的用法。即替换空格

String test = "wa n\tg_p\te\tn　g"; 

test = test.replaceAll("\t|\\t|\u0020|\u3000", "");//去掉空格 

System.out.println(test); 

其中test = test.replaceAll("\t|\\t|\u0020|\u3000", "") 

与test = Pattern.compile("\t|\\t|\u0020|\u3000").matcher(test).replaceAll("") 

是等效的，

因此用正则表达式仅仅是替换全部或替换第一个的话，用replaceAll或replaceFirst即可。

```

### 12、getBytes()

- 都是将一个string类型的字符串转换成byte类型并且存入一个byte数组中。在java中的所有数据底层都是字节，字节数据可以存入到byte数组。
- UTF-8每个汉字转成3bytes，而GBK转成2bytes，所以要说明编码方式，否则用缺省编码。

```java
String.getBytes(String decode)

byte[] b_gbk = "中".getBytes("GBK");

byte[] b_utf8 = "中".getBytes("UTF-8");

byte[] b_iso88591 = "中".getBytes("ISO8859-1");

将分别返回"中"这个汉字在GBK、UTF-8和ISO8859-1编码下的byte数组表示,此时

b_gbk的长度为2,

b_utf8的长度为3,

b_iso88591的长度为1。

new String(byte[], decode)实际是使用指定的编码decode来将byte[]解析成字符串.

String s_gbk = new String(b_gbk,"GBK");

String s_utf8 = new String(b_utf8,"UTF-8");

String s_iso88591 = new String(b_iso88591,"ISO8859-1");

```

- 通过输出s_gbk、s_utf8和s_iso88591,会发现s_gbk和s_utf8都是"中",而只有s_iso88591是一个不被识别的字符（可以理解为乱码）,为什么使用ISO8859-1编码再组合之后,无法还原"中"字？原因很简单,因为ISO8859-1编码的编码表根本就不包含汉字字符,当然也就无法通过"中".getBytes("ISO8859-1");来得到正确的"中"字在ISO8859-1中的编码值了,所以，再通过new String()来还原就更是无从谈起。因此,通过String.getBytes(String decode)方法来得到byte[]时,一定要确定decode的编码表中确实存在String表示的码值,这样得到的byte[]数组才能正确被还原。

### 13、StringBuffer

```java
"构造方法摘要" 
StringBuffer() 
          "构造一个其中不带字符的字符串缓冲区，其初始容量为 16 个字符。" 
StringBuffer(CharSequence seq) 
          "public java.lang.StringBuilder(CharSequence seq) 构造一个字符串缓冲区，它包含与指定的 			  CharSequence 相同的字符。" 
StringBuffer(int capacity) 
          "构造一个不带字符，但具有指定初始容量的字符串缓冲区。" 
StringBuffer(String str) 
         " 构造一个字符串缓冲区，并将其内容初始化为指定的字符串内容。" 

```

```java
"方法摘要" 
 StringBuffer append(boolean b) 
         " 将 boolean 参数的字符串表示形式追加到序列。" 
 StringBuffer append(char c) 
          "将 char 参数的字符串表示形式追加到此序列。" 
 StringBuffer append(char[] str) 
          "将 char 数组参数的字符串表示形式追加到此序列。" 
 StringBuffer append(char[] str, int offset, int len) 
         " 将 char 数组参数的子数组的字符串表示形式追加到此序列。" 
 StringBuffer append(CharSequence s) 
          "将指定的 CharSequence 追加到该序列。" 
 StringBuffer append(CharSequence s, int start, int end) 
         " 将指定 CharSequence 的子序列追加到此序列。" 
 StringBuffer append(double d) 
         " 将 double 参数的字符串表示形式追加到此序列。 "
 StringBuffer append(float f) 
          "将 float 参数的字符串表示形式追加到此序列。 "
 StringBuffer append(int i) 
         " 将 int 参数的字符串表示形式追加到此序列。" 
 StringBuffer append(long lng) 
          "将 long 参数的字符串表示形式追加到此序列。" 
 StringBuffer append(Object obj) 
         " 追加 Object 参数的字符串表示形式。 "
 StringBuffer append(String str) 
         " 将指定的字符串追加到此字符序列。" 
 StringBuffer append(StringBuffer sb) 
          "将指定的 StringBuffer 追加到此序列中。" 
 StringBuffer appendCodePoint(int codePoint) 
         " 将 codePoint 参数的字符串表示形式追加到此序列。" 
 int capacity() 
          "返回当前容量。" 
 char charAt(int index) 
         " 返回此序列中指定索引处的 char 值。" 
 int codePointAt(int index) 
        "  返回指定索引处的字符（统一代码点）。" 
 int codePointBefore(int index) 
         " 返回指定索引前的字符（统一代码点）。" 
 int codePointCount(int beginIndex, int endIndex) 
         " 返回此序列指定文本范围内的统一代码点。" 
 StringBuffer delete(int start, int end) 
         " 移除此序列的子字符串中的字符。" 
 StringBuffer deleteCharAt(int index) 
         " 移除此序列指定位置的 char。 "
 void ensureCapacity(int minimumCapacity) 
         " 确保容量至少等于指定的最小值。" 
 void getChars(int srcBegin, int srcEnd, char[] dst, int dstBegin) 
         " 将字符从此序列复制到目标字符数组 dst。" 
 int indexOf(String str) 
         " 返回第一次出现的指定子字符串在该字符串中的索引。" 
 int indexOf(String str, int fromIndex) 
         " 从指定的索引处开始，返回第一次出现的指定子字符串在该字符串中的索引。 "
 StringBuffer insert(int offset, boolean b) 
          "将 boolean 参数的字符串表示形式插入此序列中。" 
 StringBuffer insert(int offset, char c) 
         " 将 char 参数的字符串表示形式插入此序列中。 "
 StringBuffer insert(int offset, char[] str) 
         "将 char 数组参数的字符串表示形式插入此序列中。" 
 StringBuffer insert(int index, char[] str, int offset, int len) 
         " 将数组参数 str 的子数组的字符串表示形式插入此序列中。" 
 StringBuffer insert(int dstOffset, CharSequence s) 
         " 将指定 CharSequence 插入此序列中。" 
 StringBuffer insert(int dstOffset, CharSequence s, int start, int end) 
         " 将指定 CharSequence 的子序列插入此序列中。" 
 StringBuffer insert(int offset, double d) 
         " 将 double 参数的字符串表示形式插入此序列中。 "
 StringBuffer insert(int offset, float f) 
         " 将 float 参数的字符串表示形式插入此序列中。 "
 StringBuffer insert(int offset, int i) 
         " 将 int 参数的字符串表示形式插入此序列中。" 
 StringBuffer insert(int offset, long l) 
         " 将 long 参数的字符串表示形式插入此序列中。" 
 StringBuffer insert(int offset, Object obj) 
         " 将 Object 参数的字符串表示形式插入此字符序列中。" 
 StringBuffer insert(int offset, String str) 
         " 将字符串插入此字符序列中。" 
 int lastIndexOf(String str) 
         " 返回最右边出现的指定子字符串在此字符串中的索引。" 
 int lastIndexOf(String str, int fromIndex) 
          "返回最后一次出现的指定子字符串在此字符串中的索引。" 
 int length() 
          "返回长度（字符数）。" 
 int offsetByCodePoints(int index, int codePointOffset) 
         " 返回此序列中的一个索引，该索引是从给定 index 偏移 codePointOffset 个代码点后得到的。 "
 StringBuffer replace(int start, int end, String str) 
         " 使用给定 String 中的字符替换此序列的子字符串中的字符。" 
 StringBuffer reverse() 
          "将此字符序列用其反转形式取代。" 
 void setCharAt(int index, char ch) 
         " 将给定索引处的字符设置为 ch。 "
 void setLength(int newLength) 
          "设置字符序列的长度。" 
 CharSequence subSequence(int start, int end) 
         " 返回一个新的字符序列，该字符序列是此序列的子序列。" 
 String substring(int start) 
         " 返回一个新的 String，它包含此字符序列当前所包含的字符子序列。" 
 String substring(int start, int end) 
         " 返回一个新的 String，它包含此序列当前所包含的字符子序列。 "
 String toString() 
          "返回此序列中数据的字符串表示形式。 "
 void trimToSize() 
          "尝试减少用于字符序列的存储空间。 "

```



### 14、length()

返回字符串长度

### 15、trim()

返回一个新字符串，这个字符串将删除了原始字符串头部和尾部的空格

### API

```java
构造方法摘要 
String() 
          "初始化一个新创建的 String 对象，使其表示一个空字符序列。" 
String(byte[] bytes) 
          "通过使用平台的默认字符集解码指定的 byte 数组，构造一个新的 String。 "
String(byte[] bytes, Charset charset) 
          "通过使用指定的 charset 解码指定的 byte 数组，构造一个新的 String。 "
String(byte[] ascii, int hibyte) 
          "已过时。 该方法无法将字节正确地转换为字符。从 JDK 1.1 开始，完成该转换的首选方法是使用带有 		   Charset、字符集名称，或使用平台默认字符集的 String 构造方法。" 
String(byte[] bytes, int offset, int length) 
          "通过使用平台的默认字符集解码指定的 byte 子数组，构造一个新的 String。 "
String(byte[] bytes, int offset, int length, Charset charset) 
          "通过使用指定的 charset 解码指定的 byte 子数组，构造一个新的 String。"
String(byte[] ascii, int hibyte, int offset, int count) 
          "已过时。 该方法无法将字节正确地转换为字符。从 JDK 1.1 开始，完成该转换的首选方法是使用带有 		   Charset、字符集名称，或使用平台默认字符集的 String 构造方法。" 
String(byte[] bytes, int offset, int length, String charsetName) 
          "通过使用指定的字符集解码指定的 byte 子数组，构造一个新的 String。 "
String(byte[] bytes, String charsetName) 
         " 通过使用指定的 charset 解码指定的 byte 数组，构造一个新的 String。" 
String(char[] value) 
         " 分配一个新的 String，使其表示字符数组参数中当前包含的字符序列。 "
String(char[] value, int offset, int count) 
         " 分配一个新的 String，它包含取自字符数组参数一个子数组的字符。 "
String(int[] codePoints, int offset, int count) 
          "分配一个新的 String，它包含 Unicode 代码点数组参数一个子数组的字符。" 
String(String original) 
         " 初始化一个新创建的 String 对象，使其表示一个与参数相同的字符序列；换句话说，新创建的字符串是		  该参数字符串的副本。" 
String(StringBuffer buffer) 
         " 分配一个新的字符串，它包含字符串缓冲区参数中当前包含的字符序列。 "
String(StringBuilder builder) 
          "分配一个新的字符串，它包含字符串生成器参数中当前包含的字符序列。 "

```

```java
方法摘要 
 char charAt(int index) 
         " 返回指定索引处的 char 值。" 
 int codePointAt(int index) 
          "返回指定索引处的字符（Unicode 代码点）。 "
 int codePointBefore(int index) 
         " 返回指定索引之前的字符（Unicode 代码点）。" 
 int codePointCount(int beginIndex, int endIndex) 
         " 返回此 String 的指定文本范围中的 Unicode 代码点数。 "
 int compareTo(String anotherString) 
          "按字典顺序比较两个字符串。" 
 int compareToIgnoreCase(String str) 
         " 按字典顺序比较两个字符串，不考虑大小写。" 
 String concat(String str) 
          "将指定字符串连接到此字符串的结尾。" 
 boolean contains(CharSequence s) 
          "当且仅当此字符串包含指定的 char 值序列时，返回 true。 "
 boolean contentEquals(CharSequence cs) 
         " 将此字符串与指定的 CharSequence 比较。" 
 boolean contentEquals(StringBuffer sb) 
         " 将此字符串与指定的 StringBuffer 比较。 "
static String copyValueOf(char[] data) 
         " 返回指定数组中表示该字符序列的 String。" 
static String copyValueOf(char[] data, int offset, int count) 
          "返回指定数组中表示该字符序列的 String。" 
 boolean endsWith(String suffix) 
          "测试此字符串是否以指定的后缀结束。 "
 boolean equals(Object anObject) 
         " 将此字符串与指定的对象比较。" 
 boolean equalsIgnoreCase(String anotherString) 
         " 将此 String 与另一个 String 比较，不考虑大小写。" 
static String format(Locale l, String format, Object... args) 
         " 使用指定的语言环境、格式字符串和参数返回一个格式化字符串。" 
static String format(String format, Object... args) 
          "使用指定的格式字符串和参数返回一个格式化字符串。" 
 byte[] getBytes() 
          "使用平台的默认字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。" 
 byte[] getBytes(Charset charset) 
          "使用给定的 charset 将此 String 编码到 byte 序列，并将结果存储到新的 byte 数组。" 
 void getBytes(int srcBegin, int srcEnd, byte[] dst, int dstBegin) 
         " 已过时。 该方法无法将字符正确转换为字节。从 JDK 1.1 起，完成该转换的首选方法是通过 				  getBytes() 方法，该方法使用平台的默认字符集。" 
 byte[] getBytes(String charsetName) 
         " 使用指定的字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。" 
 void getChars(int srcBegin, int srcEnd, char[] dst, int dstBegin) 
          "将字符从此字符串复制到目标字符数组。" 
 int hashCode() 
         " 返回此字符串的哈希码。" 
 int indexOf(int ch) 
          "返回指定字符在此字符串中第一次出现处的索引。" 
 int indexOf(int ch, int fromIndex) 
          "返回在此字符串中第一次出现指定字符处的索引，从指定的索引开始搜索。" 
 int indexOf(String str) 
         " 返回指定子字符串在此字符串中第一次出现处的索引。" 
 int indexOf(String str, int fromIndex) 
          "返回指定子字符串在此字符串中第一次出现处的索引，从指定的索引开始。" 
 String intern() 
          "返回字符串对象的规范化表示形式。" 
 boolean isEmpty() 
         " 当且仅当 length() 为 0 时返回 true。 "
 int lastIndexOf(int ch) 
          "返回指定字符在此字符串中最后一次出现处的索引。 "
 int lastIndexOf(int ch, int fromIndex) 
          "返回指定字符在此字符串中最后一次出现处的索引，从指定的索引处开始进行反向搜索。" 
 int lastIndexOf(String str) 
          "返回指定子字符串在此字符串中最右边出现处的索引。" 
 int lastIndexOf(String str, int fromIndex) 
         " 返回指定子字符串在此字符串中最后一次出现处的索引，从指定的索引开始反向搜索。 "
 int length() 
         " 返回此字符串的长度。 "
 boolean matches(String regex) 
         " 告知此字符串是否匹配给定的正则表达式。" 
 int offsetByCodePoints(int index, int codePointOffset) 
          "返回此 String 中从给定的 index 处偏移 codePointOffset 个代码点的索引。" 
 boolean regionMatches(boolean ignoreCase, int toffset, String other, int ooffset, int len) 
          "测试两个字符串区域是否相等。" 
 boolean regionMatches(int toffset, String other, int ooffset, int len) 
         " 测试两个字符串区域是否相等。 "
 String replace(char oldChar, char newChar) 
         " 返回一个新的字符串，它是通过用 newChar 替换此字符串中出现的所有 oldChar 得到的。" 
 String replace(CharSequence target, CharSequence replacement) 
         " 使用指定的字面值替换序列替换此字符串所有匹配字面值目标序列的子字符串。 "
 String replaceAll(String regex, String replacement) 
          "使用给定的 replacement 替换此字符串所有匹配给定的正则表达式的子字符串。" 
 String replaceFirst(String regex, String replacement) 
          "使用给定的 replacement 替换此字符串匹配给定的正则表达式的第一个子字符串。 "
 String[] split(String regex) 
          "根据给定正则表达式的匹配拆分此字符串。 "
 String[] split(String regex, int limit) 
          "根据匹配给定的正则表达式来拆分此字符串。" 
 boolean startsWith(String prefix) 
          "测试此字符串是否以指定的前缀开始。" 
 boolean startsWith(String prefix, int toffset) 
          "测试此字符串从指定索引开始的子字符串是否以指定前缀开始。" 
 CharSequence subSequence(int beginIndex, int endIndex) 
          "返回一个新的字符序列，它是此序列的一个子序列。" 
 String substring(int beginIndex) 
         " 返回一个新的字符串，它是此字符串的一个子字符串。 "
 String substring(int beginIndex, int endIndex) 
         " 返回一个新字符串，它是此字符串的一个子字符串。 "
 char[] toCharArray() 
        "  将此字符串转换为一个新的字符数组。 "
 String toLowerCase() 
         " 使用默认语言环境的规则将此 String 中的所有字符都转换为小写。 "
 String toLowerCase(Locale locale) 
         " 使用给定 Locale 的规则将此 String 中的所有字符都转换为小写。" 
 String toString() 
         " 返回此对象本身（它已经是一个字符串！）。 "
 String toUpperCase() 
          "使用默认语言环境的规则将此 String 中的所有字符都转换为大写。 "
 String toUpperCase(Locale locale) 
         " 使用给定 Locale 的规则将此 String 中的所有字符都转换为大写。 "
 String trim() 
         " 返回字符串的副本，忽略前导空白和尾部空白。" 
static String valueOf(boolean b) 
          "返回 boolean 参数的字符串表示形式。" 
static String valueOf(char c) 
          "返回 char 参数的字符串表示形式。" 
static String valueOf(char[] data) 
         " 返回 char 数组参数的字符串表示形式。" 
static String valueOf(char[] data, int offset, int count) 
          "返回 char 数组参数的特定子数组的字符串表示形式。" 
static String valueOf(double d) 
         " 返回 double 参数的字符串表示形式。" 
static String valueOf(float f) 
          "返回 float 参数的字符串表示形式。" 
static String valueOf(int i) 
          "返回 int 参数的字符串表示形式。" 
static String valueOf(long l) 
         " 返回 long 参数的字符串表示形式。 "
static String valueOf(Object obj) 
          "返回 Object 参数的字符串表示形式。 "

```

### StringUtils

```java
public static boolean isEmpty(String str) 
   "判断某字符串是否为空，为空的标准是 str==null 或 str.length()==0 "
public static boolean isNotEmpty(String str) 
   "判断某字符串是否非空，等于 !isEmpty(String str) "
public static boolean isBlank(String str) 
  " 判断某字符串是否为空或长度为0或由空白符(whitespace) 构成"
public static boolean isNotBlank(String str) 
   "判断某字符串是否不为空且长度不为0且不由空白符(whitespace) 构成，等于 !isBlank(String str) "
public static String trim(String str) 
   "去掉字符串两端的控制符(control characters, char <= 32) , 如果输入为 null 则返回null "
public static String trimToNull(String str) 
   "去掉字符串两端的控制符(control characters, char <= 32) ,如果变为 null 或""，则返回 null "
public static String trimToEmpty(String str) 
   "去掉字符串两端的控制符(control characters, char <= 32) ,如果变为 null 或 "" ，则返回 "" "
public static String strip(String str) 
   "去掉字符串两端的空白符(whitespace) ，如果输入为 null 则返回 null "
public static String stripToNull(String str) 
   "去掉字符串两端的空白符(whitespace) ，如果变为 null 或""，则返回 null "
public static String stripToEmpty(String str) 
    "去掉字符串两端的空白符(whitespace) ，如果变为 null 或"" ，则返回"" "
public static String strip(String str, String stripChars) 
   "去掉 str 两端的在 stripChars 中的字符。"
public static String stripStart(String str, String stripChars) 
    "和11相似，去掉 str 前端的在 stripChars 中的字符。"
public static String stripEnd(String str, String stripChars) 
   " 和11相似，去掉 str 末端的在 stripChars 中的字符。"
public static String[] stripAll(String[] strs) 
   " 对字符串数组中的每个字符串进行 strip(String str) ，然后返回。"
public static String[] stripAll(String[] strs, String stripChars) 
    "对字符串数组中的每个字符串进行 strip(String str, String stripChars) ，然后返回。"
public static boolean equals(String str1, String str2) 
   " 比较两个字符串是否相等，如果两个均为空则也认为相等。"
public static boolean equalsIgnoreCase(String str1, String str2) 
   " 比较两个字符串是否相等，不区分大小写，如果两个均为空则也认为相等。"
public static int indexOf(String str, char searchChar) 
    "返回字符 searchChar 在字符串 str 中第一次出现的位置。"
public static int indexOf(String str, char searchChar, int startPos) 
   " 返回字符 searchChar 从 startPos 开始在字符串 str 中第一次出现的位置。"
public static int indexOf(String str, String searchStr) 
   " 返回字符串 searchStr 在字符串 str 中第一次出现的位置。"
public static int ordinalIndexOf(String str, String searchStr, int ordinal) 
    "返回字符串 searchStr 在字符串 str 中第 ordinal 次出现的位置。"
public static int indexOf(String str, String searchStr, int startPos) 
   " 返回字符串 searchStr 从 startPos 开始在字符串 str 中第一次出现的位置。"
```

## 5：输入输出

本模块参考自：https://blog.csdn.net/wobushixiaobailian/article/details/80279880

### 1输入处理

- java的输入，我们用到Scanner类，可以用它创建一个对象
- Scanner reader=new Scanner(System.in);
- 然后reader对象调用nextBoolean(),nextByte(),nextShort(),nextInt(),nextLong(),nextFloat(),nextDouble()方法来从输入流中获取数据。
- 这些方法在执行时都会阻塞，程序等待用户在输入流中输入enter键（\n）时继续执行。
- 这里的nextInt,hasNextInt()这些方法的调用，会判断当前字节流里面是否有东西，没有就阻塞等待输入直到用户按enter键（\n）结束输入,在Scanner类中有一个变量needInput,当需要读取数据时，needInput=true(也就是调用nextInt,hasNextInt()这些函数的时候)。
- 有一个readInput方法，当字节流中有东西可读时，让needInput=false（表示不需要阻塞等待输入）;
- 总之，在调用next(),hasNext()方法时，字节流里面有东西，就不用等待，没有东西就阻塞等待。例如：

```java
public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner s=new Scanner(System.in);
		int a,b;
		a=s.nextInt();
		System.out.println(a);
		b=s.nextInt();
		System.out.println(b);
		/*a=s.nextInt();
		b=s.nextInt();
		System.out.println(a+"  "+b);*/
	}
/*
第一种情况
2 3
2
3
*/
/*
第二种情况
2
2
3
3
*/

```

- 当在命令行时输入时，我可以这样输入（在一行就输入两个数据再按enter）,当运行到b=s.nextInt()时，发现字节流里面有东西，就没有阻塞等待输入了。（如第一种情况）
- 当然我们也可以这样输入（第一行输入2后，按enter键，然后在输入3，再按enter键）。运行过程是这样的，首先，当运行到a=s.nextInput()时发现，字节流里面没东西，等待输入，于是我们在命令行的第一行输入了2，按回车确认，这时程序继续执行。当运行到b=s.nextInt()时，发现字节流里面没东西，则阻塞等待输入，于是我们在命令行第三行输入3,按enter键确认，程序继续执行。（如第二种情况） Scanner 使用分隔符模式将其输入分解为标记，默认情况下该分隔符模式与空白匹配（当然可以自定义分隔符）。

### 2输出处理

- 可用System.out.println()或System.out.print()来向屏幕进行输出。
- jdk1.5新增了和C语言中printf函数类似的数据输出方法
- System.out.printf(“格式控制部分”，表达式1，表达式2，……，表达式n)
- 格式控制部分由格式控制符号：%d,%c,%f,%s和普通字符组成，普通字符原样输出。格式控制符用来输出表达式的值。
- %d:输出int类型数据值
- %[c:](https://www.baidu.com/s?wd=c%3A&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)输出int类型数据
- %f:输出浮点型数据，小数点部分最多保留6位
- %s:输出字符串数据
- %md:输出int型数据占m列
- %m.nf:输出的浮点型数据占m列，小数点保留n位
- 格式字符串语法：每个格式控制以%开始，以空格或标点符号结尾。

```Java

public class Main {
 
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		for(int i=1;i<=9;i++)
		{
			for(int j=1;j<=i;j++)
			{
				System.out.printf("%2d X%2d=%3d ",j,i,i*j);
			}
			System.out.println();
		}
	}
}
//输出99乘法表
```

## 6：流程控制

本模块参考自：https://www.cnblogs.com/adamjwh/p/8329496.html

### 一块作用域

- Java语言的复合语句是以整个块区为单位的语句，又称块语句。复合语句由“{”开始，“}”结束。
- 对于复合语句，我们只需要知道，复合语句为局部变量创建了一个作用域，该作用域为程序的一部分，在该作用域中某个变量被创建并能够被使用，如果在某个变量的作用域外使用该变量，则会发生错误。并且复合语句中可以嵌套复合语句。

### 二条件语句

- 条件语句可根据不同的条件执行不同的语句。包括if条件语句与switch多分支语句。这是学习Java的一个基础与重点。

#### if条件语句

- 使用if条件语句，可选择是否要执行紧跟在条件之后的那个语句。关键字if之后是作为条件的“布尔表达式”，如果该表达式返回true，则执行其后的语句；若为false，则不执行if后的语句。可分为简单的if条件语句、if···else语句和if···else if多分支语句。

```java
int a = 100;
if(a == 100) {
    System.out.println(a);
}
```

- 如上方代码，｛｝之间为复合语句，if为条件语句，翻译过来就是如果a等于100，则输出a的值，否则不执行。
- 如果if后只有一条语句，比如上述代码只有一条输出，可以不加｛｝，但为了代码的可读性，以及防止代码过多出现不必要的错误，建议所有的if、else后都加上相应的｛｝。

#### if-else语句

- if···else语句是条件语句中最常用的一种形式，它会针对某种条件有选择的作出处理。通常表现为“如果满足某种条件，就进行某种处理，否则就进行另一种处理”。
- if后的()内的表达式必须是boolean型的。如果为true，则执行if后的复合语句；如果为false，则执行else后的复合语句。

```java
public class Getifelse {

    public static void main(String[] args) {
        int math = 80;        // 声明，数学成绩为80（及格）
        int english = 50;    // 声明，英语成绩为50（不及格）
        
        if(math >= 60) {    // if判断语句判断math是否大于等于60
            System.out.println("math has passed");
        } else {            // if条件不成立
            System.out.println("math has not passed");
        }
        
        if(english >= 60) {    // if判断语句判断english是否大于等于60
            System.out.println("english has passed");
        } else {            // if条件不成立
            System.out.println("english has not passed");
        }
    }

}
```

#### if-elseif语句

- if···else if多分支语句用于针对某一事件的多种情况进行处理。通常表现为“如果满足某种条件”，就进行某种处理，否则，如果满足另一种条件，则进行另一种处理。

```java
public class GetTerm {

    public static void main(String[] args) {
        int x = 40;
        
        if(x > 60) {
            System.out.println("x的值大于60");
        } else if (x > 30) {
            System.out.println("x的值大于30但小于60");
        } else if (x > 0) {
            System.out.println("x的值大于0但小于30");
        } else {
            System.out.println("x的值小于等于0");
        }
    }

}
```

#### switch语句

- switch语句是一种比较简单明了的多选一的选择，在Java语言中，可以用switch语句将动作组织起来进行多选一。语法格式如下：

```java
switch(表达式)
{ 
 case 常量值1:
        语句块1
        [break;]
...
case 常量值n:
        语句块2
        [break;]
default:
        语句块 n+1;
        [break;]
}
```

- switch语句中表达式的值必须是**整型或字符型**，常量值1~n必须也是整型或字符型。
- 简单说一下switch语句是怎么执行的（重点，初学的朋友要注意）。首先switch语句先计算表达式的值，如果表达式的值与case后的常量值相同，则执行该case后的若干个语句，直到遇到break语句为止。如果没有break，则继续执行下一case中的若干语句，直到遇到break为止。若没有一个常量的值与表达式的值相同，则执行default后面的语句。default语句可选，如果不存在default语句，而且switch语句中的表达式的值与任何case的常量值都不相同，则switch不做任何处理。并且，同一个switch语句，case的常量值必须互不相同。
- 要注意的是case后的常量表达式的值可以为整数和字符，但不可以是实数后字符串，比如case 1.1，case “ok”都是非法的。

### 三循环语句

- 循环语句就是在满足一定条件的情况下反复执行某一个操作。包括while循环语句、do···while循环语句和for循环语句。

#### while循环

- while循环语句的循环方式为利用一个条件来控制是否要继续反复执行这个语句。
- 假设现在有1~10十个数字，我们要将它们相加求和，在学习while之前可能会直接用+运算符从1加到10，也就是1+2+3+4+5+6+7+8+9+10，但如果现在需要从1加到1万呢？10万？所以，我们要引入while循环来进行循环相加，如下：

```java
public class GetSum {

    public static void main(String[] args) {
        int x = 1;            // 定义初值
        int sum = 0;        // 定义求和变量，用于存储相加后的结果
        
        while(x <= 10) {
            sum += x;        // 循环相加，也即    sum = sum + x;
            x++;
        }
        System.out.println(sum);
    }
  /*
  这就是一个从1加到10的代码，首先定义一个初值x为1，然后定义一个存储相加结果的变量sum为0，循环条件为x<=10，也就是每次判断x<=10是否成立，成立则继续循环。循环内第一句“sum +=x;”其实就是“sum = sum +x;”的另一种写法，是在sum的基础上加x，并赋给sum，那么此时sum的值为0+1=1了，然后x++，x自增1为2，判断x<=10，则继续循环，sum的值变为1+2=3，然后x++变为3，如此循环下去，直到x为11时退出循环，此时sum的值就是1+2+3+4+5+6+7+8+9+10最后的结果55了。
  */

}
```

- 在while循环语句中，如果while语句后直接加分号，如while(a == 5);代表当前while为空语句，进入无线循环。

#### do-while循环

- do···while循环语句与while循环语句的区别是，while循环语句先判断条件是否成立再执行循环体，而do···while循环语句则先执行一次循环后，再判断条件是否成立。也即do···while至少执行一次。语法格式如下：

```java
do
{
    执行语句
}  while (条件表达式);
```

```java
public class Cycle {

    public static void main(String[] args) {
        int a = 10;
        int b = 10;
        
        // while循环语句
        while(a == 8) {
            System.out.println("a == " + a);
            a--;
        }
        
        // do···while循环语句
        do {
            System.out.println("b == " + b);
            b--;
        } while(b == 8);
    }

}
```

- 这里，a、b都为10，先看while循环语句，进入while下语句块的条件是a == 8，很明显不成立，所以不执行，结果中没有关于a的结果，然后再看do···while循环语句，先执行一次do后的语句块，输出“b == 10”，然后判断while条件b == 8不成立，循环结束，所以结果只有一个do···while语句中执行的第一步b == 10。

#### for循环

- for循环语句是Java程序设计中最有用的循环语句之一。一个for循环可以用来重复执行某条语句，知道某个条件得到满足。语法格式如下：

```java
for(表达式1; 表达式2; 表达式3)
{
    语句序列
}
```

- 其中，表达式1为初始化表达式，负责完成变量的初始化；表达式2为循环条件表达式，指定循环条件；表达式3为循环后操作表达式，负责修整变量，改变循环条件。三个表达式间用分号隔开

```java
public class Circulate {

    public static void main(String[] args) {
        int sum = 0;
        
        for(int i=2; i<=100; i+=2) {
            sum += i;
        }
        
        System.out.println(sum);
    }
/*
例：用for循环语句求100以内所有偶数的和。
for循环内，首先定义一个变量并赋初值，表示循环中i从2开始进行，然后条件为i<=100，即i<=100时进行循环并执行语句块中的语句，第三个表达式“i+=2”表示每次循环执行i=i+1，即没循环一次，i的值为在原来的基础上加2后的值。然后循环求sum的值，即2+4+6+8+···+100，当i=102时退出循环，执行输出语句，输出结果为2550。
*/
}
```

- 说到for循环语句就不得提到foreach语句了，它是Java5后新增的for语句的特殊简化版本，并不能完全替代for语句，但所有foreach语句都可以改写为for语句。foreach语句在遍历数组等时为程序员提供了很大的方便。语法格式如下：

```java
for(元素变量x : 遍历对象obj) {
    引用了x的Java语句;
}

int array[] = {7, 8, 9};
/*
array是一个一维数组，其中有7、8、9三个值，现在要将这三个值打印到控制台上，用foreach语句相比for语句会简单很多。其中，在for的条件中，先定义了一个整型变量arr（只要和要遍历的数组名不同即可），冒号后则是要遍历的数组名，那么｛｝间就是要循环的内容了。
*/
for (int arr : array) {
     System.out.println(arr);
}
```

### 四跳转语句

- Java语言提供了三种跳转语句，分别是break语句、continue语句和return语句。

#### break语句

- break语句刚刚在switch中已经见过了，是用来中止case的。实际上break语句在for、while、do···while循环语句中，用于强行退出当前循环，为什么说是当前循环呢，因为break只能跳出离它最近的那个循环的循环体，假设有两个循环嵌套使用，break用在内层循环下，则break只能跳出内层循环，如下：

```java
for(int i=0; i<n; i++) {    // 外层循环
    for(int j=0; j<n ;j++) {    // 内层循环
        break;
    }
}
```

#### continue语句

- continue语句只能用于for、while、do···while循环语句中，用于让程序直接跳过其后面的语句，进行下一次循环。

```java
public class ContinueDemo {

    public static void main(String[] args) {
        int i = 0;
        
        while(i < 10) {
            i++;
            
            if(i%2 == 0) {    // 能被2整除，是偶数
                continue;    // 跳过当前循环
            }
            
            System.out.print(i + " ");    
        }
    }
//例：输出10以内的所有奇数
  /*这里if条件判断是否为偶数，如果是偶数则执行continue，直接跳出本次循环，不进行continue后的步骤（即不执行输出语句），然后下一次循环为奇数，输出i*/
}
```

#### return语句

- return语句可以从一个方法返回，并把控制权交给调用它的语句。

```java
public void getName() {
    return name;
}
//这是一个方法用于获取姓名，当调用这个方法时将返回姓名值。
```

## 7：数组

### 数组常用方法

本模块参考：https://www.cnblogs.com/chenpi/p/5507806.html,https://blog.csdn.net/goodbye_youth/article/details/81003817

#### 声明一个数组

```java
String[] aArray = new String[5];
String[] bArray = {"a","b","c", "d", "e"};
String[] cArray = new String[]{"a","b","c","d","e"};
```

#### 打印一个数组

```java
int[] intArray = { 1, 2, 3, 4, 5 };
String intArrayString = Arrays.toString(intArray);
// print directly will print reference value
System.out.println(intArray);
// [I@7150bd4d
System.out.println(intArrayString);
// [1, 2, 3, 4, 5]
```

#### 创建ArrayList

```java
String[] stringArray = { "a", "b", "c", "d", "e" };
ArrayList<String> arrayList = new ArrayList<String>(Arrays.asList(stringArray));
System.out.println(arrayList);
// [a, b, c, d, e]
```

#### 包含某个值

```java
String[] stringArray = { "a", "b", "c", "d", "e" };
boolean b = Arrays.asList(stringArray).contains("a");
System.out.println(b);
// true
```

#### 连接两个数组

```java
int[] intArray = { 1, 2, 3, 4, 5 };
int[] intArray2 = { 6, 7, 8, 9, 10 };
// Apache Commons Lang library
int[] combinedIntArray = ArrayUtils.addAll(intArray, intArray2);
```

#### 内联数组

```java
method(new String[]{"a", "b", "c", "d", "e"});
```

#### 拼接数组元素

```java
// containing the provided list of elements
// Apache common lang
String j = StringUtils.join(new String[] { "a", "b", "c" }, ", ");
System.out.println(j);
// a, b, c
```

#### ArrayList转数组

```java
String[] stringArray = { "a", "b", "c", "d", "e" };
ArrayList<String> arrayList = new ArrayList<String>(Arrays.asList(stringArray));
String[] stringArr = new String[arrayList.size()];
arrayList.toArray(stringArr);
for (String s : stringArr)
    System.out.println(s);
```

#### Array转Set

```java
Set<String> set = new HashSet<String>(Arrays.asList(stringArray));
System.out.println(set);
//[d, e, b, c, a]
```

#### 翻转数组

```java
int[] intArray = { 1, 2, 3, 4, 5 };
ArrayUtils.reverse(intArray);
System.out.println(Arrays.toString(intArray));
//[5, 4, 3, 2, 1]
```

#### 删除数组元素

```java
int[] intArray = { 1, 2, 3, 4, 5 };
int[] removed = ArrayUtils.removeElement(intArray, 3);//create a new array
System.out.println(Arrays.toString(removed));
```

#### 整形转字节数组

```java
byte[] bytes = ByteBuffer.allocate(4).putInt(8).array();
for (byte t : bytes) {
    System.out.format("0x%x ", t);
}
```

#### 数组填充

```java
//用指定元素填充整个数组（会替换掉数组中原来的元素）
//Arrays.fill(Object[] array, Object obj)
Integer[] data = {1, 2, 3, 4};
Arrays.fill(data, 9);
System.out.println(Arrays.toString(data)); // [9, 9, 9, 9]

//用指定元素填充数组，从起始位置到结束位置，取头不取尾（会替换掉数组中原来的元素）
//Arrays.fill(Object[] array, int fromIndex, int toIndex, Object obj)
Integer[] data = {1, 2, 3, 4};
Arrays.fill(data, 0, 2, 9);
System.out.println(Arrays.toString(data)); // [9, 9, 3, 4]
```

#### 排序

```java
//Arrays.sort(Object[] array)
//对数组元素进行排序（串行排序）
String[] data = {"1", "4", "3", "2"};
System.out.println(Arrays.toString(data)); // [1, 4, 3, 2]
Arrays.sort(data);
System.out.println(Arrays.toString(data)); // [1, 2, 3, 4]

//Arrays.sort(T[] array, Comparator<? super T> comparator)
//使用自定义比较器，对数组元素进行排序（串行排序）
String[] data = {"1", "4", "3", "2"};
System.out.println(Arrays.toString(data)); // [1, 4, 3, 2]
// 实现降序排序，返回-1放左边，1放右边，0保持不变
Arrays.sort(data, (str1, str2) -> {
    if (str1.compareTo(str2) > 0) {
        return -1;
    } else {
        return 1;
    }
});
System.out.println(Arrays.toString(data)); // [4, 3, 2, 1]


//Arrays.sort(Object[] array, int fromIndex, int toIndex)
//对数组元素的指定范围进行排序（串行排序）
String[] data = {"1", "4", "3", "2"};
System.out.println(Arrays.toString(data)); // [1, 4, 3, 2]
// 对下标[0, 3)的元素进行排序，即对1，4，3进行排序，2保持不变
Arrays.sort(data, 0, 3);
System.out.println(Arrays.toString(data)); // [1, 3, 4, 2]

/*Arrays.sort(T[] array, int fromIndex, int toIndex, Comparator<? super T> c)*/
//使用自定义比较器，对数组元素的指定范围进行排序（串行排序）
String[] data = {"1", "4", "3", "2"};
System.out.println(Arrays.toString(data)); // [1, 4, 3, 2]
// 对下标[0, 3)的元素进行降序排序，即对1，4，3进行降序排序，2保持不变
Arrays.sort(data, 0, 3, (str1, str2) -> {
    if (str1.compareTo(str2) > 0) {
        return -1;
    } else {
        return 1;
    }
});
System.out.println(Arrays.toString(data)); // [4, 3, 1, 2]

```

#### 数组复制

```java
//Arrays.copyOf(T[] original, int newLength)
/*拷贝数组，其内部调用了 System.arraycopy() 方法，从下标0开始，如果超过原数组长度，会用null进行填充*/
Integer[] data1 = {1, 2, 3, 4};
Integer[] data2 = Arrays.copyOf(data1, 2);
System.out.println(Arrays.toString(data2)); // [1, 2]
Integer[] data2 = Arrays.copyOf(data1, 5);
System.out.println(Arrays.toString(data2)); // [1, 2, 3, 4, null]


//Arrays.copyOfRange(T[] original, int from, int to)
//拷贝数组，指定起始位置和结束位置，如果超过原数组长度，会用null进行填充
Integer[] data1 = {1, 2, 3, 4};
Integer[] data2 = Arrays.copyOfRange(data1, 0, 2);
System.out.println(Arrays.toString(data2)); // [1, 2]
Integer[] data2 = Arrays.copyOfRange(data1, 0, 5);
System.out.println(Arrays.toString(data2)); // [1, 2, 3, 4, null]

```

#### 数组比较

```java
//Arrays.equals(Object[] array1, Object[] array2)
/*判断两个数组是否相等，实际上比较的是两个数组的哈希值，即 Arrays.hashCode(data1) == Arrays.hashCode(data2)*/
Integer[] data1 = {1, 2, 3};
Integer[] data2 = {1, 2, 3};
System.out.println(Arrays.equals(data1, data2)); // true

```

#### 数组哈希值

```java
//Arrays.hashCode(Object[] array)
//返回数组的哈希值
Integer[] data = {1, 2, 3};
System.out.println(Arrays.hashCode(data)); // 30817
```

### Arrays

```java
static <T> List<T> asList(T... a) 
          "返回一个受指定数组支持的固定大小的列表。" 
static void fill(Object[] a, Object val) 
         " 将指定的 Object 引用分配给指定 Object 数组的每个元素。 "
static void fill(Object[] a, int fromIndex, int toIndex, Object val) 
          "将指定的 Object 引用分配给指定 Object 数组指定范围中的每个元素。" 
static void sort(Object[] a) 
         " 根据元素的自然顺序对指定对象数组按升序进行排序。" 
static void sort(Object[] a, int fromIndex, int toIndex) 
          "根据元素的自然顺序对指定对象数组的指定范围按升序进行排序。" 
static <T> void sort(T[] a, Comparator<? super T> c) 
          "根据指定比较器产生的顺序对指定对象数组进行排序。" 
static <T> void sort(T[] a, int fromIndex, int toIndex, Comparator<? super T> c) 
          "根据指定比较器产生的顺序对指定对象数组的指定范围进行排序。" 
static <T> T[] copyOf(T[] original, int newLength) 
          "复制指定的数组，截取或用 null 填充（如有必要），以使副本具有指定的长度。" 
static <T> T[] copyOfRange(T[] original, int from, int to) 
         " 将指定数组的指定范围复制到一个新数组。" 
static boolean equals(Object[] a, Object[] a2) 
          "如果两个指定的 Objects 数组彼此相等，则返回 true。" 
static int hashCode(Object[] a) 
          "基于指定数组的内容返回哈希码。" 
static String toString(Object[] a) 
          "返回指定数组内容的字符串表示形式。" 
static int binarySearch(Object[] a, Object key) 
          "使用二分搜索法来搜索指定数组，以获得指定对象。但是要先排序 "
```

#### 排序

```java
// *************排序 sort****************
		int a[] = { 1, 3, 2, 7, 6, 5, 4, 9 };
		// sort(int[] a)方法按照数字顺序排列指定的数组。
		Arrays.sort(a);
		System.out.println("Arrays.sort(a):");
		for (int i : a) {
			System.out.print(i);
		}
		// 换行
		System.out.println();

		// sort(int[] a,int fromIndex,int toIndex)按升序排列数组的指定范围
		int b[] = { 1, 3, 2, 7, 6, 5, 4, 9 };
		Arrays.sort(b, 2, 6);
		System.out.println("Arrays.sort(b, 2, 6):");
		for (int i : b) {
			System.out.print(i);
		}
		// 换行
		System.out.println();

		int c[] = { 1, 3, 2, 7, 6, 5, 4, 9 };
		// parallelSort(int[] a) 按照数字顺序排列指定的数组(并行的)。同sort方法一样也有按范围的排序
		Arrays.parallelSort(c);
		System.out.println("Arrays.parallelSort(c)：");
		for (int i : c) {
			System.out.print(i);
		}
		// 换行
		System.out.println();

		// parallelSort给字符数组排序，sort也可以
		char d[] = { 'a', 'f', 'b', 'c', 'e', 'A', 'C', 'B' };
		Arrays.parallelSort(d);
		System.out.println("Arrays.parallelSort(d)：");
		for (char d2 : d) {
			System.out.print(d2);
		}
		// 换行
		System.out.println();
```

#### 查找



```java
// *************查找 binarySearch()****************
		char[] e = { 'a', 'f', 'b', 'c', 'e', 'A', 'C', 'B' };
		// 排序后再进行二分查找，否则找不到
		Arrays.sort(e);
		System.out.println("Arrays.sort(e)" + Arrays.toString(e));
		System.out.println("Arrays.binarySearch(e, 'c')：");
		int s = Arrays.binarySearch(e, 'c');
		System.out.println("字符c在数组的位置：" + s);
```

#### 比较

```java
// *************比较 equals****************
		char[] e = { 'a', 'f', 'b', 'c', 'e', 'A', 'C', 'B' };
		char[] f = { 'a', 'f', 'b', 'c', 'e', 'A', 'C', 'B' };
		/*
		* 元素数量相同，并且相同位置的元素相同。 另外，如果两个数组引用都是null，则它们被认为是相等的 。
		*/
		// 输出true
		System.out.println("Arrays.equals(e, f):" + Arrays.equals(e, f));
```

#### 填充

```java
// *************填充fill(批量初始化)****************
		int[] g = { 1, 2, 3, 3, 3, 3, 6, 6, 6 };
		// 数组中所有元素重新分配值
		Arrays.fill(g, 3);
		System.out.println("Arrays.fill(g, 3)：");
		// 输出结果：333333333
		for (int i : g) {
			System.out.print(i);
		}
		// 换行
		System.out.println();

		int[] h = { 1, 2, 3, 3, 3, 3, 6, 6, 6, };
		// 数组中指定范围元素重新分配值
		Arrays.fill(h, 0, 2, 9);
		System.out.println("Arrays.fill(h, 0, 2, 9);：");
		// 输出结果：993333666
		for (int i : h) {
			System.out.print(i);
		}
```

#### 转列表

```java
// *************转列表 asList()****************
		/*
		 * 返回由指定数组支持的固定大小的列表。
		 * （将返回的列表更改为“写入数组”。）该方法作为基于数组和基于集合的API之间的桥梁，与Collection.toArray()相结合 。
		 * 返回的列表是可序列化的，并实现RandomAccess 。
		 * 此方法还提供了一种方便的方式来创建一个初始化为包含几个元素的固定大小的列表如下：
		 */
		List<String> stooges = Arrays.asList("Larry", "Moe", "Curly");
		System.out.println(stooges);
```

#### 转字符串

```java
// *************转字符串 toString()****************
		/*
		* 返回指定数组的内容的字符串表示形式。
		*/
		char[] k = { 'a', 'f', 'b', 'c', 'e', 'A', 'C', 'B' };
		System.out.println(Arrays.toString(k));// [a, f, b, c, e, A, C, B]
```

#### 复制

```java
// *************复制 copy****************
		// copyOf 方法实现数组复制,h为数组，6为复制的长度
		int[] h = { 1, 2, 3, 3, 3, 3, 6, 6, 6, };
		int i[] = Arrays.copyOf(h, 6);
		System.out.println("Arrays.copyOf(h, 6);：");
		// 输出结果：123333
		for (int j : i) {
			System.out.print(j);
		}
		// 换行
		System.out.println();
		// copyOfRange将指定数组的指定范围复制到新数组中
		int j[] = Arrays.copyOfRange(h, 6, 11);
		System.out.println("Arrays.copyOfRange(h, 6, 11)：");
		// 输出结果66600(h数组只有9个元素这里是从索引6到索引11复制所以不足的就为0)
		for (int j2 : j) {
			System.out.print(j2);
		}
		// 换行
		System.out.println();
```

#### 注意事项

- **传递的数组必须是对象数组，而不是基本类型。**

```java
int[] myArray = { 1, 2, 3 };
List myList = Arrays.asList(myArray);//相当于list中放了一个array数组
System.out.println(myList.size());//1，里面只有一个数组
System.out.println(myList.get(0));//数组地址值
System.out.println(myList.get(1));//报错：ArrayIndexOutOfBoundsException
int [] array=(int[]) myList.get(0);
System.out.println(array[0]);//1
System.out.println(array[1]);//2
System.out.println(array[2]);//3

//应该使用Integer[] myArray = { 1, 2, 3 };
```

- **使用集合的修改方法:add()、remove()、clear()会抛出异常。**
- `Arrays.asList()` 方法返回的并不是 `java.util.ArrayList` ，而是 `java.util.Arrays` 的一个内部类,这个内部类并没有实现集合的修改方法或者说并没有重写这些方法。

```java
List myList = Arrays.asList(1, 2, 3);
myList.add(4);//运行时报错：UnsupportedOperationException
myList.remove(1);//运行时报错：UnsupportedOperationException
myList.clear();//运行时报错：UnsupportedOperationException
System.out.println(myList.getClass());//class java.util.Arrays$ArrayList
```

#### 正确数组转集合

- 自实现方法

```java
//JDK1.5+
static <T> List<T> arrayToList(final T[] array) {
  final List<T> l = new ArrayList<T>(array.length);

  for (final T s : array) {
    l.add(s);
  }
  return (l);
}

Integer [] myArray = { 1, 2, 3 };
System.out.println(arrayToList(myArray).getClass());//class java.util.ArrayList
```

- 使用ArrayList构造方法(推荐)

```java
List list = new ArrayList<>(Arrays.asList("a", "b", "c"));
```

- 使用 Java8 的Stream(推荐)

```java
Integer [] myArray = { 1, 2, 3 };
List myList = Arrays.stream(myArray).collect(Collectors.toList());
//基本类型也可以实现转换（依赖boxed的装箱操作）
int [] myArray2 = { 1, 2, 3 };
List myList = Arrays.stream(myArray2).boxed().collect(Collectors.toList());
```

- 使用 Guava(推荐)

```java
/*
对于不可变集合，你可以使用ImmutableList类及其of()与copyOf()工厂方法：（参数不能为空）
*/
List<String> il = ImmutableList.of("string", "elements");  // from varargs
List<String> il = ImmutableList.copyOf(aStringArray);      // from array

//对于可变集合，你可以使用Lists类及其newArrayList()工厂方法：
List<String> l1 = Lists.newArrayList(anotherListOrCollection);    // from collection
List<String> l2 = Lists.newArrayList(aStringArray);               // from array
List<String> l3 = Lists.newArrayList("or", "string", "elements"); // from varargs
```

- 使用 Apache Commons Collections

```java
List<String> list = new ArrayList<String>();
CollectionUtils.addAll(list, str);
```



### ArrayUtils

```java
static String	toString(Object array) 
          "将数组作为String输出，null视为空数组。"
static Map	toMap(Object[] array) 
         " 将给定数组转换为Map。"
static Object[]	clone(Object[] array) 
         " Shallow克隆返回类型转换结果和处理的数组 null。"
static Object[]	subarray(Object[] array, int startIndexInclusive, int endIndexExclusive) 
          "生成一个包含开始和结束索引之间元素的新数组。"
static boolean	isSameLength(Object[] array1, Object[] array2) 
          "检查两个数组是否长度相同，将 null数组视为长度0。"
static boolean	isSameType(Object array1, Object array2) 
          "考虑多维数组，检查两个数组是否是同一类型。"
static int	getLength(Object array) 
          "返回指定数组的长度。"
static void	reverse(Object[] array) 
         " 反转给定数组的顺序。"
static int	indexOf(Object[] array, Object objectToFind, int startIndex) 
          "从给定索引开始查找数组中给定对象的索引。"
static boolean	contains(Object[] array, Object objectToFind) 
          "检查对象是否在给定的数组中。"
static Integer[]	toObject(int[] array) 
          "将原始int数组转换为对象。"
static boolean	isEmpty(Object[] array) 
          "检查对象数组是否为空或null。"
static Object[]	addAll(Object[] array1, Object[] array2) 
          "将给定数组的所有元素添加到新数组中。"
static Object[]	add(Object[] array, int index, Object element) 
         " 将指定元素插入数组中的指定位置。"
static Object[]	remove(Object[] array, int index) 
          "从指定的数组中删除指定位置的元素。"
static Object[]	removeElement(Object[] array, Object element) 
         " 从指定的数组中删除指定元素的第一个匹配项。"
```



译文链接：<http://www.programcreek.com/2013/09/top-10-methods-for-java-arrays/>

详细数组讲解请参考：https://www.cnblogs.com/adamjwh/p/8336354.html

如果想了解自实现数组和数组底层，请参考：https://blog.csdn.net/qq_36925536/article/category/8532206



## 8：类

- 面向对象程序设计（简称OOP），Java是完全面向对象的
- 类（class）是构造对象的模板或蓝图，由类构造对象的过程称为创建类的实例
- 封装是将数据和行为组合在一个包中，并对对象的使用者隐藏了数据的实现方式。数据称为实例域，操纵数据的过程称为方法。实现封装的关键在于绝对不能让类中的方法直接访问其他类的实例域。这是提高重用性和可靠性的关键。
- 定义类的属性：修饰符 类型 属性名 = 初值 ;
- 定义类的方法：修饰符 返回值类型 方法名 ( 参数列表) { 方法体语句； }，所有方法都必须在类的内部定义

### 类之间的关系

- 依赖：应该尽可能的将相互依赖的类减至最少（耦合度最小）
- 聚合：类A的对象包含类B的对象
- 继承：子类继承父类，拥有父类方法的同时还可以定义自己的方法

### 用户自定义类

- 在一个源文件中，只能有一个公有类，但可以有任意数目的非公有类。
- this代表本类，为隐式参数

### 构造器

- 构造器与类同名，在构造类的对象时，构造器会运行，将实例域初始化为希望的状态
- 构造器总是伴随着new操作符的执行被调用
- 每个类可以有一个以上的构造器
- 构造器可以有0个，1个或多个参数
- 构造器没有返回值
- 修饰符一般为public

### 静态域和静态方法和静态属性

- 如果把域定义为static，如：static｛。。｝，它属于类，而不属于任何独立的对象
- 在类第一次加载的时候，将会进行静态域的初始化
- 在静态域（静态方法，静态属性，静态代码块中），静态方法永远是最后执行的，跟顺序无关，而其他两个跟声明的顺序有关
- 所有的静态初始化语句及静态初始化块都将依照类定义的顺序执行
- 静态方法是一种不能向对象实施操作的方法，建议使用类名，而不是对象来调用静态方法
- 使用静态方法的情况有两种，一种是一个方法不需要访问对象状态，其所需参数都是通过显式参数提供。另一种是一个方法只需要访问类的静态域

### 方法参数

- Java程序设计语言总是采用按值调用（表示方法接收的是调用者提供的值）
- 按引用调用（表示方法接受的是调用者提供的变量地址）
- 一个方法可以修改传递引用所对应的变量值，而不能修改传递值调用所对应的变量值
- 方法参数共有两种类型：一种是基本数据类型（数字，布尔值）,另一种是对象引用
- 一个方法不可能修改一个基本数据类型的参数（数值型和布尔型）
- 方法得到的是对象引用的拷贝，对象引用及其他的拷贝同时引用同一个对象
- 对象引用进行的是值传递
- 一个方法可以改变一个对象参数的状态
- 一个方法不能让对象参数引用一个新的对象

### 类加载过程

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202302101028816.png)

- 首先cong.java生成了.class文件
- 要运行程序，首先虚拟机里会有一个类加载器（class loader），把类加载到虚拟机里去，存到静态方法区里面了
- 方法区就是上面的静态方法区。
- 执行引擎：检索堆的：回收垃圾、怎么运行堆等；本地方法接口：提供给计数器用的。最后再加上本地方法库。

## 9：对象

面向对象的三大特征：封装，继承，多态

对象的三个主要特性：

- 对象的行为：可以对对象施加哪些操作或哪些方法。
- 对象的状态：当施加方法时，对象如何响应。
- 对象标识：如何辨别具有相同行为与状态的不同对象。

Java中通过将数据声明为私有的(private)，再提供公共的（public）方法:getXxx()和setXxx()实现对该属性的操作，以实现下述目的：

- 隐藏一个类中不需要对外提供的实现细节
- 使用者只能通过事先定制好的方法来访问数据，可以方便地加入控制逻辑，限制对属性的不合理操作
- 便于修改，增强代码的可维护性

### 对象构造

- 如果多个方法有相同的名字，不同的参数，就产生了重载
- Java允许重载任何方法，而不只是构造器方法。
- 如果在构造器中没有显式的给域赋值，那么就会被自动的赋为默认值：数值为0，布尔型为false，对象引用为null
- 很多类都包含一个无参数的构造函数，对象由无参数构造函数创建时，其状态会设置为适当的默认值
- 如果在编写一个类时没有编写构造器，那么系统就会提供一个无参数的构造器
- 如果类中提供了至少一个构造器，但是没有提供无参数的构造器，则在构造对象时如果没有提供参数就会被视为不合法
- 仅当类没有提供任何构造器的时候，系统才会提供一个默认的构造器
- 在执行构造器之前，先执行赋值操作，初始值不一定是常量
- 如果构造器的第一个语句为：this（。。。），这个构造器将调用同一个类的另一个构造器。
- 调用构造器的具体处理步骤：
- 1）所有数据域被初始化为默认值（0，false，null）
- 2）按照在类声明中出现的次序，依次执行所有域初始化语句和初始化块
- 3）如果构造器第一行调用了第二个构造器，则执行第二个构造器主体
- 4）执行这个构造器主体

### 初始化块

- 初始化块由｛｝组成，只要构造类的对象，这些块就会被执行
- 首先运行初始化块，然后才运行构造器的主体部分
- 调用

### 对象析构

- 由于Java有自动的垃圾回收器，不需要人工回收内存，所以Java不支持析构器
- 可以为任何一个类添加finalize方法，finalize方法将会在垃圾回收器清除对象之前调用

### 对象内存解析

[类和对象内存解析](https://blog.csdn.net/silent0001/article/details/89606204)

## 10：类设计技巧

- 一定要保证数据私有（绝对不要破坏封装性）
- 一定要对数据初始化（Java不对局部变量进行初始化，但是会对对象的实例域进行初始化）
- 不要在类中使用过多的基本类型
- 不是所有的域都需要独立的域访问器和域更改器
- 将职责过多的类进行分解
- 类名和方法名要能够体现他们的职责



## 11：面向对象设计原则

- 开-闭原则（目标、总的指导思想）Open Closed Principle：对扩展开放，对修改关闭。增加新功能，不改变原有代码。
- 类的单一职责（一个类的定义）Single ResponsibilityPrinciple：一个类有且只有一个改变它的原因。适用于基础类，不适用基于基础类构建复杂的聚合类。
- 依赖倒置（依赖抽象）Dependency Inversion Principle：客户端代码(调用的类)尽量依赖(使用)抽象的组件。抽象的是稳定的。实现是多变的。
- 组合复用原则（复用的最佳实践）Composite Reuse Principle：如果仅仅为了代码复用优先选择组合复用，而非继承复用。组合的耦合性相对继承低。
- 里氏替换（继承后的重写，指导继承的设计）Liskov Substitution Principle：父类出现的地方可以被子类替换，在替换后依然保持原功能。子类要拥有父类的所有功能。子类在重写父类方法时，尽量选择扩展重写，防止改变了功能。
- 接口隔离（功能拆分） Interface Segregation Principle：尽量定义小而精的接口interface，少定义大而全的接口。本质与单一职责相同，小接口之间功能隔离，实现类需要多个功能时可以选择多实现或接口之间做继承。
- 面向接口编程而非面向实现（切换、并行开发）：客户端通过一系列抽象操作实例，而无需关注具体类型。便于灵活切换一系列功能。实现软件的并行开发。
- 迪米特法则（类与类交互的原则）Law of Demeter：类与类交互时，在满足功能要求的基础上，传递的数据量越少越好。因为这样可能降低耦合度。





## 12：类，超类和子类

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

## 13：Object超类

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

## 14：ArrayList

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



## 15：对象包装器和自动装箱

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

## 16：参数数量可变

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

## 17：枚举类

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



## 18：反射

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

## 19：Class-API

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



## 20：继承设计技巧

- 将公共操作和域放在超类
- 不要使用受保护的域
- 使用继承实现“is-a”关系
- 除非所有继承的方法都有意义，否则不要使用继承
- 在覆盖方法时，不要改变预期的行为
- 使用多态，而非类型信息
- 不要过多的使用反射


## 21：接口

- 接口技术主要用来描述类具有什么功能，而并不给出每个功能的具体实现
- 一个类可以实现一个或多个接口
- 如果类遵从某个特定接口，那么就履行这项服务
- 接口中的方法自动的属于public，在接口声明方法时，不必提供关键字public
- 在接口中可以定义常量
- 接口绝不能含有实例域，也不能在接口中实现方法
- 提供实例域和方法实现的任务应该由实现接口的那个类来完成
- 为了让类实现一个接口，需要两个步骤：（1）将类声明为实现给定的接口。（2）对接口中的所有方法进行定义
- 要将类声明为实现某个接口，需要使用关键字implements
- 在实现接口时，必须把方法声明为public
- 要让一个类使用排序服务必须让他实现compareTo方法

### 接口的特性

- 接口不是类，尤其不能使用new运算符实例化一个接口

```java
x=new Comparable()//error
```

- 尽管不能构造接口的对象，却能声明接口的变量

```java
Comparable x;//ok
```

- 接口变量必须引用实现了接口的类对象

```java
x=new Employee();//ok
```

- 接口中的域将被自动设为public static final
- 尽管每个类只能够拥有一个超类，但却可以实现多个接口，使用逗号分隔开

### 接口和抽象类

- Java不支持多继承的主要原因是多继承会让语言本身变得非常复杂，效率也会降低
- 接口可以提供多重继承的大多数好处，同时还能避免多重继承的复杂性和低效性

## 22：对象克隆

### 克隆含义

- 在实际编程过程中，我们常常要遇到这种情况：有一个对象A，在某一时刻A中已经包含了一些有效值，此时可能 会需要一个和A完全相同新对象B，并且此后对B任何改动都不会影响到A中的值，也就是说，A与B是两个独立的对象，但B的初始值是由A对象确定的。在 Java语言中，用简单的赋值语句是不能满足这种需求的。要满足这种需求虽然有很多途径，但实现clone（）方法是其中最简单，也是最高效的手段。
- Java的所有类都默认继承java.lang.Object类，在java.lang.Object类中有一个方法clone()。JDK API的说明文档解释这个方法将返回Object对象的一个拷贝。要说明的有两点：一是拷贝对象返回的是一个新对象，而不是一个引用。二是拷贝对象与用 new操作符返回的新对象的区别就是这个拷贝已经包含了一些原来对象的信息，而不是对象的初始信息。

### clone方法

```java
class CloneClass implements Cloneable{ 
　public int aInt; 
　public Object clone(){ 
　　CloneClass o = null; 
　　try{ 
　　　o = (CloneClass)super.clone(); 
　　}catch(CloneNotSupportedException e){ 
　　　e.printStackTrace(); 
　　} 
　　return o; 
　} 
｝
```

- 有三个值得注意的地方，一是希望能实现clone功能的CloneClass类实现了Cloneable接口，这个接口属于java.lang 包，java.lang包已经被缺省的导入类中，所以不需要写成java.lang.Cloneable。
- 另一个值得请注意的是重载了clone()方 法。最后在clone()方法中调用了super.clone()，这也意味着无论clone类的继承结构是什么样的，super.clone()直接或 间接调用了java.lang.Object类的clone()方法
- Object类的clone()一个native方法，native方法的效率一般来说都是远高于java中的非native方法。这也解释了为 什么要用Object中clone()方法而不是先new一个类，然后把原始对象中的信息赋到新对象中，虽然这也实现了clone功能。对于第二点，也要 观察Object类中的clone()还是一个protected属性的方法。这也意味着如果要应用clone()方法，必须继承Object类，在 Java中所有的类是缺省继承Object类的，也就不用关心这点了。然后重写clone()方法。还有一点要考虑的是为了让其它类能调用这个clone 类的clone()方法，重写之后要把clone()方法的属性设置为public。
- 那么clone类为什么还要实现 Cloneable接口呢？稍微注意一下，Cloneable接口是不包含任何方法的！其实这个接口仅仅是一个标志，而且这个标志也仅仅是针对 Object类中clone()方法的，如果clone类没有实现Cloneable接口，并调用了Object的clone()方法（也就是调用了 super.Clone()方法），那么Object的clone()方法就会抛出CloneNotSupportedException异常。

### 深浅拷贝

[深浅拷贝](https://www.cnblogs.com/xuanxufeng/p/6558330.html)

## 23：接口回调

[接口回调](https://www.cnblogs.com/wangming007/p/5122701.html)

- 在Java学习中有个比较重要的知识点，就是今天我们要讲的接口回调。接口回调的理解如果解释起来会比较抽象，我一般喜欢用一个或几个经典的例子来帮助加深理解。
- 举例：老板分派给员工做事，员工做完事情后需要给老板回复，老板对其做出反应。
- 上面是个比较经典的例子，下面用代码实现上述例子：

### 定义接口

```java
package JieKouHuiDiao;
2 //定义一个接口
3 public interface JieKou {
4 public void show();
5 }
```

### Boss类

```java
package JieKouHuiDiao;

public class Boss implements JieKou{
//定义一个老板实现接口
    @Override
    public void show() {
        System.out.println("知道了");
    }

}
```

### 员工类

```java
package JieKouHuiDiao;

public class Employee {
//接口属性，方便后边注册
    JieKou jiekou;
//注册一个接口属性，等需要调用的时候传入一个接口类型的参数，即本例中的Boss和Employee，
public Employee zhuce(JieKou jiekou,Employee e){
    this.jiekou=jiekou;
    return e;
}
public void dosomething(){
    System.out.println("拼命做事，做完告诉老板");
    //接口回调，如果没有注册调用，接口中的抽象方法也不会影响dosomething
    jiekou.show();
}

}
```

### 测试类

```java
package JieKouHuiDiao;

public class Test {
public static void main(String[] args) {
    Employee e=new Employee();
    //需要调用的时候先注册,传入Boss类型对象和员工参数
    Employee e1=e.zhuce(new Boss(),e);
    e1.dosomething();
}
}
```

## 24：内部类

http://how2j.cn/k/interface-inheritance/interface-inheritance-inner-class/322.html

- 内部类分为四种：非静态内部类 ，静态内部类，匿名类，本地类


### 非静态内部类

- 非静态内部类 BattleScore “战斗成绩”
- 非静态内部类可以直接在一个类里面定义
- 比如：
  战斗成绩只有在一个英雄对象存在的时候才有意义
  所以实例化BattleScore 的时候，必须建立在一个存在的英雄的基础上
  语法: new 外部类().new 内部类()
  作为Hero的非静态内部类，是可以直接访问外部类的private实例属性name的

```java
package charactor;
 
public class Hero {
    private String name; // 姓名
 
    float hp; // 血量
 
    float armor; // 护甲
 
    int moveSpeed; // 移动速度
 
    // 非静态内部类，只有一个外部类对象存在的时候，才有意义
    // 战斗成绩只有在一个英雄对象存在的时候才有意义
    class BattleScore {
        int kill;
        int die;
        int assit;
 
        public void legendary() {
            if (kill >= 8)
                System.out.println(name + "超神！");
            else
                System.out.println(name + "尚未超神！");
        }
    }
 
    public static void main(String[] args) {
        Hero garen = new Hero();
        garen.name = "盖伦";
        // 实例化内部类
        // BattleScore对象只有在一个英雄对象存在的时候才有意义
        // 所以其实例化必须建立在一个外部类对象的基础之上
        BattleScore score = garen.new BattleScore();
        score.kill = 9;
        score.legendary();
    }
 
}
```

### 静态内部类

- 在一个类里面声明一个静态内部类
  比如敌方水晶，当敌方水晶没有血的时候，己方所有英雄都取得胜利，而不只是某一个具体的英雄取得胜利。
  与非静态内部类不同，静态内部类水晶类的实例化 不需要一个外部类的实例为基础，可以直接实例化
- 语法：new 外部类.静态内部类();
- 因为没有一个外部类的实例，所以在静态内部类里面不可以访问外部类的实例属性和方法
- 除了可以访问外部类的私有静态成员外，静态内部类和普通类没什么大的区别

```java
package charactor;
  
public class Hero {
    public String name;
    protected float hp;
  
    private static void battleWin(){
        System.out.println("battle win");
    }
     
    //敌方的水晶
    static class EnemyCrystal{
        int hp=5000;
         
        //如果水晶的血量为0，则宣布胜利
        public void checkIfVictory(){
            if(hp==0){
                Hero.battleWin();
                 
                //静态内部类不能直接访问外部类的对象属性
                System.out.println(name + " win this game");
            }
        }
    }
     
    public static void main(String[] args) {
        //实例化静态内部类
        Hero.EnemyCrystal crystal = new Hero.EnemyCrystal();
        crystal.checkIfVictory();
    }
  
}
```

### 匿名类

- 匿名类指的是在声明一个类的同时实例化它，使代码更加简洁精练
- 通常情况下，要使用一个接口或者抽象类，都必须创建一个子类
- 有的时候，为了快速使用，直接实例化一个抽象类，并“当场”实现其抽象方法。
- 既然实现了抽象方法，那么就是一个新的类，只是这个类，没有命名。
- 这样的类，叫做匿名类

```java
package charactor;
   
public abstract class Hero {
    String name; //姓名
          
    float hp; //血量
          
    float armor; //护甲
          
    int moveSpeed; //移动速度
      
    public abstract void attack();
      
    public static void main(String[] args) {
          
        ADHero adh=new ADHero();
        //通过打印adh，可以看到adh这个对象属于ADHero类
        adh.attack();
        System.out.println(adh);
          
        Hero h = new Hero(){
            //当场实现attack方法
            public void attack() {
                System.out.println("新的进攻手段");
            }
        };
        h.attack();
        //通过打印h，可以看到h这个对象属于Hero$1这么一个系统自动分配的类名
          
        System.out.println(h);
    }
      
}
```

![](http://how2j.cn/img/site/step/687.png)

- 在匿名类中使用外部的局部变量
- 在匿名类中使用外部的局部变量，外部的局部变量必须修饰为final

```java
package charactor;
   
public abstract class Hero {
 
    public abstract void attack();
      
    public static void main(String[] args) {
 
        //在匿名类中使用外部的局部变量，外部的局部变量必须修饰为final
        final int damage = 5;
         
        Hero h = new Hero(){
            public void attack() {
                System.out.printf("新的进攻手段，造成%d点伤害",damage );
            }
        };
 
    }
      
}   
```

```java
package charactor;
   
public abstract class Hero {
 
    public abstract void attack();
      
    public static void main(String[] args) {
 
        //在匿名类中使用外部的局部变量damage 必须修饰为final
        int damage = 5;
         
        //这里使用本地类AnonymousHero来模拟匿名类的隐藏属性机制
         
        //事实上的匿名类，会在匿名类里声明一个damage属性，并且使用构造方法初始化该属性的值
        //在attack中使用的damage，真正使用的是这个内部damage，而非外部damage
         
        //假设外部属性不需要声明为final
        //那么在attack中修改damage的值，就会被暗示为修改了外部变量damage的值
         
        //但是他们俩是不同的变量，是不可能修改外部变量damage的
        //所以为了避免产生误导，外部的damage必须声明为final,"看上去"就不能修改了
        class AnonymousHero extends Hero{
            int damage;
            public AnonymousHero(int damage){
                this.damage = damage;
            }
            public void attack() {
                damage = 10;
                System.out.printf("新的进攻手段，造成%d点伤害",this.damage );
            }
        }
         
        Hero h = new AnonymousHero(damage);
         
    }
      
}
```

### 本地类

- 本地类可以理解为有名字的匿名类
- 内部类与匿名类不一样的是，内部类必须声明在成员的位置，即与属性和方法平等的位置。
- 本地类和匿名类一样，直接声明在代码块里面，可以是主方法，for循环里等等地方

```java
package charactor;
   
public abstract class Hero {
    String name; //姓名
          
    float hp; //血量
          
    float armor; //护甲
          
    int moveSpeed; //移动速度
      
    public abstract void attack();
      
    public static void main(String[] args) {
          
        //与匿名类的区别在于，本地类有了自定义的类名
        class SomeHero extends Hero{
            public void attack() {
                System.out.println( name+ " 新的进攻手段");
            }
        }
         
        SomeHero h  =new SomeHero();
        h.name ="地卜师";
        h.attack();
    }
      
}
```

## 25：异常

- 导致程序的正常流程被中断的事件，叫做异常
- Java使用异常处理的错误捕获机制处理
- 如果由于出现错误而使得某些操作没有完成，程序应该：返回到一种安全状态，并能够让用户执行一些其他的命令，或者允许用户保存所有操作的结果，并以适当的形式终止程序
- 异常处理的任务就是将控制权从错误产生的地方转移到能够处理这种情况的错误处理器
- 常见的错误和问题有：1、用户输入错误。2、设备错误。3、物理限制。4、代码错误。
- 异常对象都是派生于throwable类的一个实例，如果Java中内置的异常类不能够满足需求，用户可以创建自己的异常类
- 所有的异常都是由Throwable继承而来，但是在下一层立刻分解为两个分支：error和exception
- error类层次结构描述了Java运行时系统内部错误和资源耗尽错误
- exception层次机构又分解为两个分支：一个分支派生于RuntimeException；另一个分支是其他异常
- 由程序错误导致的异常属于RuntimeException；而程序本身没问题，但有I/O错误这一类问题导致的异常属于其他异常
- RuntimeException异常包含下面几种情况：
- 1）错误的类型转换
- 2）数组访问越界
- 3）访问空指针
- 其他异常包含下面几种情况：
- 1）试图在文件尾部后面读取数据
- 2）试图打开一个不存在的文件
- 3）试图根据指定的字符串查找Class对象，而这个字符串表示的类并不存在
- 在遇到下面情况时应该抛出异常：
- 1）调用一个抛出已检查异常的方法，如FileInputStream构造器
- 2）程序运行过程中发生错误，并且利用throw语句抛出一个已检查异常
- 3）程序出现错误
- 4）Java虚拟机和运行时库出现的内部错误
- 如果一个方法有可能抛出多个已检查异常，那么就必须在方法的首部列出所有的异常类，每个异常类之间用逗号隔开
- 不需要声明Java的内部错误，即从error继承的错误，也不应该声明从RuntimeException继承的未检查异常
- 一个方法必须声明所有可能抛出的已检查异常，而未检查异常要么不可控制（error），要么就应该避免发生（RuntimeException）。如果方法没有声明所有可能发生的已检查异常，编译器就会给出一个错误消息
- 除了声明异常之外，还可以捕获异常
- 子类方法中可以抛出更特定的异常，或者根本不抛出任何异常。如果超类方法没有抛出任何已检查异常，子类也不能抛出任何已检查异常

### 异常处理

- 异常处理常见手段： try catch finally throws

#### try catch

- 将可能抛出FileNotFoundException 文件不存在异常的代码放在try里
- 如果文件存在，就会顺序往下执行，并且不执行catch块中的代码
- 如果文件不存在，try 里的代码会立即终止，程序流程会运行到对应的catch块中
- e.printStackTrace(); 会打印出方法的调用痕迹，如此例，会打印出异常开始于TestException的第16行，这样就便于定位和分析到底哪里出了异常

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class TestException {

	public static void main(String[] args) {
		
		File f= new File("d:/LOL.exe");
		
		try{
			System.out.println("试图打开 d:/LOL.exe");
			new FileInputStream(f);
			System.out.println("成功打开");
		}
		catch(FileNotFoundException e){
			System.out.println("d:/LOL.exe不存在");
			e.printStackTrace();
		}
		
	}
}

```

![](http://stepimagewm.how2j.cn/735.png)

#### 父类catch

- FileNotFoundException是Exception的子类，使用Exception也可以catch住FileNotFoundException

```java
package exception;
 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
 
public class TestException {
 
    public static void main(String[] args) {
         
        File f= new File("d:/LOL.exe");
         
        try{
            System.out.println("试图打开 d:/LOL.exe");
            new FileInputStream(f);
            System.out.println("成功打开");
        }
        
        catch(Exception e){
            System.out.println("d:/LOL.exe不存在");
            e.printStackTrace();
        }
         
    }
}

```

#### 多异常

- 有的时候一段代码会抛出多种异常，比如

```java
new FileInputStream(f);
Date d = sdf.parse("2016-06-03");
```

- 这段代码，会抛出 文件不存在异常 FileNotFoundException 和 解析异常ParseException 
  解决办法之一是分别进行catch

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestException {

	public static void main(String[] args) {

		File f = new File("d:/LOL.exe");

		try {
			System.out.println("试图打开 d:/LOL.exe");
			new FileInputStream(f);
			System.out.println("成功打开");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date d = sdf.parse("2016-06-03");
		} catch (FileNotFoundException e) {
			System.out.println("d:/LOL.exe不存在");
			e.printStackTrace();
		} catch (ParseException e) {
			System.out.println("日期格式解析错误");
			e.printStackTrace();
		}
	}
}

```

- 另一个种办法是把多个异常，放在一个catch里统一捕捉
- 这种方式从 JDK7开始支持，好处是捕捉的代码更紧凑，不足之处是，一旦发生异常，不能确定到底是哪种异常，需要通过instanceof 进行判断具体的异常类型

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestException {

	public static void main(String[] args) {

		File f = new File("d:/LOL.exe");

		try {
			System.out.println("试图打开 d:/LOL.exe");
			new FileInputStream(f);
			System.out.println("成功打开");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date d = sdf.parse("2016-06-03");
		} catch (FileNotFoundException | ParseException e) {
			if (e instanceof FileNotFoundException)
				System.out.println("d:/LOL.exe不存在");
			if (e instanceof ParseException)
				System.out.println("日期格式解析错误");

			e.printStackTrace();
		}

	}
}

```

#### finally

- 当代码抛出一个异常时，就会终止方法中剩余代码的处理，并退出这个方法的执行
- 假设利用return语句从try语句块中退出，在方法返回前，finally子句的内容将被执行，如果finally子句中也有一个return语句，这个返回值将会覆盖原始的返回值
- 无论是否出现异常，finally中的代码都会被执行

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class TestException {

	public static void main(String[] args) {
		
		File f= new File("d:/LOL.exe");
		
		try{
			System.out.println("试图打开 d:/LOL.exe");
			new FileInputStream(f);
			System.out.println("成功打开");
		}
		catch(FileNotFoundException e){
			System.out.println("d:/LOL.exe不存在");
			e.printStackTrace();
		}
		finally{
			System.out.println("无论文件是否存在， 都会执行的代码");
		}
	}
}

```

#### throws

- 考虑如下情况：
  主方法调用method1
  method1调用method2
  method2中打开文件
- method2中需要进行异常处理
  但是method2不打算处理，而是把这个异常通过throws抛出去
  那么method1就会接到该异常。 处理办法也是两种，要么是try catch处理掉，要么也是抛出去。
  method1选择本地try catch住 一旦try catch住了，就相当于把这个异常消化掉了，主方法在调用method1的时候，就不需要进行异常处理了

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class TestException {

	public static void main(String[] args) {
		method1();

	}

	private static void method1() {
		try {
			method2();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private static void method2() throws FileNotFoundException {

		File f = new File("d:/LOL.exe");

		System.out.println("试图打开 d:/LOL.exe");
		new FileInputStream(f);
		System.out.println("成功打开");

	}
}

```

- throw和throws的区别
- 1)throws 出现在方法声明上，而throw通常都出现在方法体内。
- 2) throws 表示出现异常的一种可能性，并不一定会发生这些异常；throw则是抛出了异常，执行throw则一定抛出了某个异常对象。

### 异常分类

- 异常分类： 可查异常，运行时异常和错误3种 ，其中，运行时异常和错误又叫非可查异常

#### 可查异常

- 可查异常： CheckedException
- 可查异常即必须进行处理的异常，要么try catch住,要么往外抛，谁调用，谁处理，比如 FileNotFoundException
- 如果不处理，编译器，就不让你通过

```java
package exception;
 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
 
public class TestException {
 
    public static void main(String[] args) {
         
        File f= new File("d:/LOL.exe");
         
        try{
            System.out.println("试图打开 d:/LOL.exe");
            new FileInputStream(f);
            System.out.println("成功打开");
        }
        catch(FileNotFoundException e){
            System.out.println("d:/LOL.exe不存在");
            e.printStackTrace();
        }
         
    }
}

```

#### 运行异常

- 运行时异常RuntimeException指： 不是必须进行try catch的异常
- 常见运行时异常: 
  除数不能为0异常:ArithmeticException 
  下标越界异常:ArrayIndexOutOfBoundsException 
  空指针异常:NullPointerException 
- 在编写代码的时候，依然可以使用try catch throws进行处理，与可查异常不同之处在于，即便不进行try catch，也不会有编译错误
- Java之所以会设计运行时异常的原因之一，是因为下标越界，空指针这些运行时异常太过于普遍，如果都需要进行捕捉，代码的可读性就会变得很糟糕。

```java
package exception;
 
public class TestException {
 
    public static void main(String[] args) {
    	
    	//任何除数不能为0:ArithmeticException
    	int k = 5/0; 
    	
    	//下标越界异常：ArrayIndexOutOfBoundsException
    	int j[] = new int[5];
    	j[10] = 10;
    	
    	//空指针异常：NullPointerException
    	String str = null;
    	str.length();
   }
}

```

#### 错误

- 错误Error，指的是系统级别的异常，通常是内存用光了
- 在默认设置下，一般java程序启动的时候，最大可以使用16m的内存
- 如例不停的给StringBuffer追加字符，很快就把内存使用光了。抛出OutOfMemoryError
- 与运行时异常一样，错误也是不要求强制捕捉的

```java
package exception;
 
public class TestException {
 
    public static void main(String[] args) {
    
    	StringBuffer sb =new StringBuffer();
    	
    	for (int i = 0; i < Integer.MAX_VALUE; i++) {
			sb.append('a');
		}
    	
    }

}

```

![](http://stepimagewm.how2j.cn/2412.png)

### Throwable

- Throwable是类，Exception和Error都继承了该类
- 所以在捕捉的时候，也可以使用Throwable进行捕捉
- 异常分Error和Exception,Exception里又分运行时异常和可查异常。

```java
package exception;

import java.io.File;
import java.io.FileInputStream;

public class TestException {

	public static void main(String[] args) {

		File f = new File("d:/LOL.exe");

		try {
			new FileInputStream(f);
			//使用Throwable进行异常捕捉
		} catch (Throwable t) {
			// TODO Auto-generated catch block
			t.printStackTrace();
		}

	}
}

```

![](http://stepimagewm.how2j.cn/742.png)

### 自定义异常

#### 创建

- 一个英雄攻击另一个英雄的时候，如果发现另一个英雄已经挂了，就会抛出EnemyHeroIsDeadException
- 创建一个类EnemyHeroIsDeadException，并继承Exception
- 提供两个构造方法：无参的构造方法，带参的构造方法，并调用父类的对应的构造方法

```java
class EnemyHeroIsDeadException extends Exception{
    
	public EnemyHeroIsDeadException(){
		
	}
    public EnemyHeroIsDeadException(String msg){
        super(msg);
    }
}

```

#### 抛出

- 在Hero的attack方法中，当发现敌方英雄的血量为0的时候，抛出该异常
- 创建一个EnemyHeroIsDeadException实例
- 通过throw 抛出该异常
- 当前方法通过 throws 抛出该异常
- 在外部调用attack方法的时候，就需要进行捕捉，并且捕捉的时候，可以通过e.getMessage() 获取当时出错的具体原因

```java
package charactor;
 
public class Hero {
    public String name; 
    protected float hp;

    public void attackHero(Hero h) throws EnemyHeroIsDeadException{
    	if(h.hp == 0){
    		throw new EnemyHeroIsDeadException(h.name + " 已经挂了,不需要施放技能" );
    	}
    }

    public String toString(){
    	return name;
    }
    
    class EnemyHeroIsDeadException extends Exception{
        
    	public EnemyHeroIsDeadException(){
    		
    	}
        public EnemyHeroIsDeadException(String msg){
            super(msg);
        }
    }
     
    public static void main(String[] args) {
    	
        Hero garen =  new Hero();
        garen.name = "盖伦";
        garen.hp = 616;

        Hero teemo =  new Hero();
        teemo.name = "提莫";
        teemo.hp = 0;
        
        try {
			garen.attackHero(teemo);
			
		} catch (EnemyHeroIsDeadException e) {
			// TODO Auto-generated catch block
			System.out.println("异常的具体原因:"+e.getMessage());
			e.printStackTrace();
		}
        
    }
}

```

![](http://stepimagewm.how2j.cn/744.png)

[特别感谢](http://how2j.cn/k/exception/exception-tutorial/332.html)

### API

```java
"Throwable构造方法摘要 "
Throwable() 
         " 构造一个将 null 作为其详细消息的新 throwable。" 
Throwable(String message) 
          "构造带指定详细消息的新 throwable。" 
Throwable(String message, Throwable cause) 
          "构造一个带指定详细消息和 cause 的新 throwable。" 
Throwable(Throwable cause) 
          "构造一个带指定 cause 和 (cause==null ? null :cause.toString())（它通常包含类和 cause 的			详细消息）的详细消息的新 throwable。" 

```

```java
"Throwable方法摘要" 
 Throwable fillInStackTrace() 
          "在异常堆栈跟踪中填充。" 
 Throwable getCause() 
          "返回此 throwable 的 cause；如果 cause 不存在或未知，则返回 null。" 
 String getLocalizedMessage() 
         " 创建此 throwable 的本地化描述。" 
 String getMessage() 
          "返回此 throwable 的详细消息字符串。" 
 StackTraceElement[] getStackTrace() 
         " 提供编程访问由 printStackTrace() 输出的堆栈跟踪信息。" 
 Throwable initCause(Throwable cause) 
          "将此 throwable 的 cause 初始化为指定值。" 
 void printStackTrace() 
          "将此 throwable 及其追踪输出至标准错误流。" 
 void printStackTrace(PrintStream s) 
         " 将此 throwable 及其追踪输出到指定的输出流。" 
 void printStackTrace(PrintWriter s) 
         " 将此 throwable 及其追踪输出到指定的 PrintWriter。" 
 void setStackTrace(StackTraceElement[] stackTrace) 
         " 设置将由 getStackTrace() 返回，并由 printStackTrace() 和相关方法输出的堆栈跟踪元素。" 
 String toString() 
         " 返回此 throwable 的简短描述。" 

```



## 26：断言

- 在防御式编程中经常会用断言（Assertion）对参数和环境做出判断，避免程序因不当的输入或错误的环境而产生逻辑异常，断言在很多语言中都存在
- 在Java中的断言使用的是assert关键字

[详细参考](http://www.cnblogs.com/DreamDrive/p/5417283.html)

## 27：日志

- 一般在最开始写代码的时候总是会在代码中加入一些System.out.println方法的语句来观察代码运行的情况。这样需要反复加入和修改，日志API就是为了解决这个问题。
- **java.util.logging**包就是JDK的日志开发包。

[详细参考](https://www.cnblogs.com/xt0810/p/3659045.html)

## 28：调试

### JavaDebug

- 这是一个有for循环的Java代码，利于观察设置断点的效果

```java
public class HelloWorld {
    public static void main(String[] args) {
 
        int moneyEachDay = 0;
        int day = 10;
        int sum=0;
        for (int i = 1; i <= day; i++) {
            if(0==moneyEachDay)
                moneyEachDay = 1;
            else
                moneyEachDay *= 2;
             
            sum+=moneyEachDay;
             
            System.out.println(i + " 天之后，洪帮主手中的钱总数是: " + sum );
        }
    }
 
}

```

- 断点概念： 断点就是指在调试模式下，当代码运行到断点这个位置的时候，就会停下来，便于开发者观察相关数据，进行代码逻辑的分析，排错。

![](http://stepimagewm.how2j.cn/5609.png)

- 在平时用运行按钮左边， 有个虫子按钮，就是debug按钮。
- 需要注意的是，当前类，一定要有主方法，否则就会调试到 上一次成功运行的程序

![](http://stepimagewm.how2j.cn/5610.png)

- 如果是第一次运行，会弹出一个对话框询问是否要切换到调试视觉, 点击YES。

![](http://stepimagewm.how2j.cn/5611.png)

- 点击右上角的Debug旁边的 Java，就可以切换回原来熟悉的Java 开发环境了

![](http://stepimagewm.how2j.cn/5612.png)

- 在调试视觉，需要关注的是这么4个区域
- 1)当前是哪个线程，因为是非多线程程序，所以就是主线程
- 2)对第八行运行有影响的几个变量的值，这个就是调试的主要作用，观察这些值的多少，进行分析问题所在或者理解代码逻辑
- 3)当前代码，表示马上就要运行第八行，但是还没有来得及运行第八行
- 4)控制台输出

![](http://stepimagewm.how2j.cn/5613.png)

- 点击这个按钮，就可以一行一行的执行了，或者用快捷键F6

![](http://stepimagewm.how2j.cn/5614.png)

- 这是调试期间主要需要注意的区域，通过观察，分析，理解这些值的变化来加强对代码的理解，或者寻找代码的错误所在

![](http://stepimagewm.how2j.cn/5615.png)

- 红色按钮，点击退出

![](http://stepimagewm.how2j.cn/5616.png)

### WebDebug

![](http://stepimagewm.how2j.cn/5621.png)

- 1)当前是哪个线程，Tomcat里有个线程池，所以会有多个线程，而当前线程是 :http-bio-8080=exec-3。
- 2)对第13行运行有影响的几个变量的值，比如request和response对象。
- 3)当前代码，表示马上就要运行第13行，但是还没有来得及运行第13行
- 4)控制台输出

参考自：http://how2j.cn/k/debug/debug-multipe-console/1717.html


## 29：集合泛型

### 不用泛型

- 不使用泛型带来的问题
- ADHero（物理攻击英雄） APHero（魔法攻击英雄）都是Hero的子类
- ArrayList 默认接受Object类型的对象，所以所有对象都可以放进ArrayList中
- 所以get(0) 返回的类型是Object
- 接着，需要进行强制转换才可以得到APHero类型或者ADHero类型。
- 如果软件开发人员记忆比较好，能记得哪个是哪个，还是可以的。 但是开发人员会犯错误，比如第20行，会记错，把第0个对象转换为ADHero,这样就会出现类型转换异常

```java
package generic;

import java.util.ArrayList;

import charactor.ADHero;
import charactor.APHero;

public class TestGeneric {

	public static void main(String[] args) {
		
		ArrayList heros = new ArrayList();
		
		heros.add(new APHero());
		heros.add(new ADHero());
		
		APHero apHero =  (APHero) heros.get(0);
		ADHero adHero =  (ADHero) heros.get(1);
		
		ADHero adHero2 =  (ADHero) heros.get(0);
	}
}

```

### 使用泛型

- 使用泛型的好处：泛型表示这种容器，只能存放APHero，ADHero就放不进去了。

```java
package generic;

import java.util.ArrayList;

import charactor.APHero;

public class TestGeneric {

	public static void main(String[] args) {
		ArrayList<APHero> heros = new ArrayList<APHero>();
		
		//只有APHero可以放进去		
		heros.add(new APHero());
		
		//ADHero甚至放不进去
		//heros.add(new ADHero());
		
		//获取的时候也不需要进行转型，因为取出来一定是APHero
		APHero apHero =  heros.get(0);
		
	}
}

```

### 子类对象

- 假设容器的泛型是Hero,那么Hero的子类APHero,ADHero都可以放进去
- 和Hero无关的类型Item还是放不进去

```java
package generic;

import java.util.ArrayList;

import property.Item;

import charactor.ADHero;
import charactor.APHero;
import charactor.Hero;

public class TestGeneric {

	public static void main(String[] args) {
		ArrayList<Hero> heros = new ArrayList<Hero>();
		
		//只有作为Hero的子类可以放进去		
		heros.add(new APHero());
		heros.add(new ADHero());
		
		//和Hero无关的类型Item还是放不进去
		//heros.add(new Item());
		
	}
}

```

### 泛型简写

- 为了不使编译器出现警告，需要前后都使用泛型，像这样：

```java
ArrayList<Hero> heros = new ArrayList<Hero>();
```

- 不过JDK7提供了一个可以略微减少代码量的泛型简写方式

```java
ArrayList<Hero> heros2 = new ArrayList<>();
```

## 30：泛型类

- 设计一个支持泛型的栈MyStack
- 设计这个类的时候，在类的声明上，加上一个`<T>`，表示该类支持泛型。
- T是type的缩写，也可以使用任何其他的合法的变量，比如A,B,X都可以，但是一般约定成俗使用T，代表类型。

```java
package generic;
  
import java.util.HashMap;
import java.util.LinkedList;

import charactor.Hero;
import property.Item;
  
public class MyStack<T> {
  
    LinkedList<T> values = new LinkedList<T>();
      
    public void push(T t) {
        values.addLast(t);
    }
  
    public T pull() {
        return values.removeLast();
    }
  
    public T peek() {
        return values.getLast();
    }
      
    public static void main(String[] args) {
    	//在声明这个Stack的时候，使用泛型<Hero>就表示该Stack只能放Hero
    	MyStack<Hero> heroStack = new MyStack<>();
        heroStack.push(new Hero());
        //不能放Item
        heroStack.push(new Item());
        
    	//在声明这个Stack的时候，使用泛型<Item>就表示该Stack只能放Item
    	MyStack<Item> itemStack = new MyStack<>();
    	itemStack.push(new Item());
        //不能放Hero
    	itemStack.push(new Hero());
    }
  
}

```

## 31：通配符

### ? extends

- ArrayList heroList<? extends Hero> 表示这是一个Hero泛型或者其子类泛型
- heroList 的泛型可能是Hero，可能是APHero，可能是ADHero
- 所以 可以确凿的是，从heroList取出来的对象，一定是可以转型成Hero的

![](http://stepimagewm.how2j.cn/837.png)

```java
package generic;
  
import java.util.ArrayList;
 
import charactor.ADHero;
import charactor.APHero;
import charactor.Hero;
  
public class TestGeneric {
  
    public static void main(String[] args) {
         
        ArrayList<APHero> apHeroList = new ArrayList<APHero>();
        apHeroList.add(new APHero());
        
        ArrayList<? extends Hero> heroList = apHeroList;
         
        //? extends Hero 表示这是一个Hero泛型的子类泛型
         
        //heroList 的泛型可以是Hero
        //heroList 的泛型可以使APHero
        //heroList 的泛型可以使ADHero
         
        //可以确凿的是，从heroList取出来的对象，一定是可以转型成Hero的
         
        Hero h= heroList.get(0);
         
        //但是，不能往里面放东西
        heroList.add(new ADHero()); //编译错误，因为heroList的泛型 有可能是APHero
         
    }
     
}

```

### ? super

- ArrayList heroList<? super Hero> 表示这是一个Hero泛型或者其父类泛型
- heroList的泛型可能是Hero,可能是Object
- 可以往里面插入Hero以及Hero的子类,但是取出来有风险，因为不确定取出来是Hero还是Object

![](http://stepimagewm.how2j.cn/838.png)

```java
package generic;
 
import java.util.ArrayList;
 
import charactor.ADHero;
import charactor.APHero;
import charactor.Hero;
 
public class TestGeneric {
    public static void main(String[] args) {
 
        ArrayList<? super Hero> heroList = new ArrayList<Object>();
         
        //? super Hero 表示 heroList的泛型是Hero或者其父类泛型
         
        //heroList 的泛型可以是Hero
        //heroList 的泛型可以是Object
         
        //所以就可以插入Hero
        heroList.add(new Hero());
        //也可以插入Hero的子类
        heroList.add(new APHero());
        heroList.add(new ADHero());
         
        //但是，不能从里面取数据出来,因为其泛型可能是Object,而Object是强转Hero会失败
        Hero h= heroList.get(0);
         
    }
 
}

```

### 泛型通配符?

- 泛型通配符? 代表任意泛型
- 既然?代表任意泛型，那么换句话说，这个容器什么泛型都有可能
- 所以只能以Object的形式取出来
- 并且不能往里面放对象，因为不知道到底是一个什么泛型的容器

```java
package generic;
 
import java.util.ArrayList;

import property.Item;
import charactor.APHero;
import charactor.Hero;
 
public class TestGeneric {
 
    public static void main(String[] args) {
 
        ArrayList<APHero> apHeroList = new ArrayList<APHero>();
        
        //?泛型通配符，表示任意泛型
        ArrayList<?> generalList = apHeroList;

        //?的缺陷1： 既然?代表任意泛型，那么换句话说，你就不知道这个容器里面是什么类型
        //所以只能以Object的形式取出来
        Object o = generalList.get(0);

        //?的缺陷2： 既然?代表任意泛型，那么既有可能是Hero,也有可能是Item
        //所以，放哪种对象进去，都有风险，结果就什么什么类型的对象，都不能放进去
        generalList.add(new Item()); //编译错误 因为?代表任意泛型，很有可能不是Item
        generalList.add(new Hero()); //编译错误 因为?代表任意泛型，很有可能不是Hero
        generalList.add(new APHero()); //编译错误  因为?代表任意泛型，很有可能不是APHero
 
    }
}

```

### 总结

- 如果希望只取出，不插入，就使用? extends Hero
- 如果希望只插入，不取出，就使用? super Hero
- 如果希望，又能插入，又能取出，就不要用通配符？

## 32：泛型转型

### 对象转型

- 根据面向对象学习的知识，[子类转父类](http://how2j.cn/k/interface-inheritance/interface-inheritance-casting/308.html#step624) 是一定可以成功的

```java
package generic;

import charactor.ADHero;
import charactor.Hero;

public class TestGeneric {

	public static void main(String[] args) {

		Hero h = new Hero();
		ADHero ad = new ADHero();
		//子类转父类
		h = ad;
	}

}

```

### 子转父

- 子类泛型不可以转换为父类泛型

![](http://stepimagewm.how2j.cn/835.png)

```java
package generic;

import java.util.ArrayList;

import charactor.ADHero;
import charactor.APHero;
import charactor.Hero;

public class TestGeneric {

	public static void main(String[] args) {
		ArrayList<Hero> hs =new ArrayList<>();
		ArrayList<ADHero> adhs =new ArrayList<>();

		//假设能转换成功
		hs = adhs;
		
		//作为Hero泛型的hs,是可以向其中加入APHero的
		//但是hs这个引用，实际上是指向的一个ADHero泛型的容器
		//如果能加进去，就变成了ADHero泛型的容器里放进了APHero，这就矛盾了
		hs.add(new APHero());
	}

}

```

本文章引用自：http://how2j.cn/






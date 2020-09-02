---
layout: post
title: "BigDecimal精确计算"
categories: java基础
tags: BigDecimal
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 简介

- **使用 BigDecimal 来定义浮点数的值，再进行浮点数的运算操作，解决浮点数运算精度丢失问题**
- 我们在使用BigDecimal时，为了防止精度丢失，推荐使用它的 **BigDecimal(String)** 构造方法来创建对象。
- BigDecimal 主要用来操作（大）浮点数，BigInteger 主要用来操作大整数（超过 long 类型）。
- BigDecimal 的实现利用到了 BigInteger, 所不同的是 BigDecimal 加入了小数位的概念

### 大小比较

```java
//a.compareTo(b) : 返回 -1 表示小于，0 表示 等于， 1表示 大于。
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("0.9");
System.out.println(a.compareTo(b));// 1
```

### 保留小数

```java
//通过 setScale方法设置保留几位小数以及保留规则。
BigDecimal m = new BigDecimal("1.255433");
BigDecimal n = m.setScale(3,BigDecimal.ROUND_HALF_DOWN);
System.out.println(n);// 1.255
```

### 常用方法

```java
/**
 * 求余数
 * 返回值为 (this % divisor) 的 BigDecimal
 */
BigDecimal remainder(BigDecimal divisor);

/**
 * 求相反数
 * 返回值是 (-this) 的 BigDecimal
 */
BigDecimal negate();

/**
 * 将此 BigDecimal 与指定的 BigDecimal 比较
 * 根据此方法,值相等但具有不同标度的两个 BigDecimal 对象（如，2.0 和 2.00）被认为是相等的;
 * 相对六个 boolean 比较运算符 (<, ==, >, >=, !=, <=) 中每一个运算符的各个方法,优先提供此方法;
 * 建议使用以下语句执行上述比较：(x.compareTo(y) <op> 0), 其中 <op> 是六个比较运算符之一;
 *
 * 指定者：接口 Comparable<BigDecimal> 中的 compareTo
 * 返回：当此 BigDecimal 在数字上小于、等于或大于 val 时，返回 -1、0 或 1
 */
int compareTo(BigDecimal val);
```

### 运算工具类

```java
import java.math.BigDecimal;

public class ArithUtil {

    // 除法运算默认精度  
    private static final int DEF_DIV_SCALE = 10;  
  
    private ArithUtil() {  
  
    }  
  
    /** 
     * 精确加法 
     */  
    public static double add(double value1, double value2) {  
        BigDecimal b1 = BigDecimal.valueOf(value1);  
        BigDecimal b2 = BigDecimal.valueOf(value2);  
        return b1.add(b2).doubleValue();  
    }  
  
    /** 
     * 精确减法 
     */  
    public static double sub(double value1, double value2) {  
        BigDecimal b1 = BigDecimal.valueOf(value1);  
        BigDecimal b2 = BigDecimal.valueOf(value2);  
        return b1.subtract(b2).doubleValue();  
    }  
  
    /** 
     * 精确乘法 
     */  
    public static double mul(double value1, double value2) {  
        BigDecimal b1 = BigDecimal.valueOf(value1);  
        BigDecimal b2 = BigDecimal.valueOf(value2);  
        return b1.multiply(b2).doubleValue();  
    }  
  
    /** 
     * 精确除法 使用默认精度 
     */  
    public static double div(double value1, double value2) throws IllegalAccessException {  
        return div(value1, value2, DEF_DIV_SCALE);  
    }  
  
    /** 
     * 精确除法 
     * @param scale 精度 
     */  
    public static double div(double value1, double value2, int scale) throws IllegalAccessException {  
        if(scale < 0) {  
            throw new IllegalAccessException("精确度不能小于0");  
        }  
        BigDecimal b1 = BigDecimal.valueOf(value1);  
        BigDecimal b2 = BigDecimal.valueOf(value2);  
        // return b1.divide(b2, scale).doubleValue();  
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();  
    }  
  
    /** 
     * 四舍五入 
     * @param scale 小数点后保留几位 
     */  
    public static double round(double v, int scale) throws IllegalAccessException {  
        return div(v, 1, scale);  
    }  
      
    /** 
     * 比较大小 
     */  
    public static boolean equalTo(BigDecimal b1, BigDecimal b2) {  
        if(b1 == null || b2 == null) {  
            return false;  
        }  
        return 0 == b1.compareTo(b2);  
    }  
    
    
    public static void main(String[] args) throws IllegalAccessException {
        double value1=1.2345678912311;
        double value2=9.1234567890123;
        BigDecimal value3=new BigDecimal(Double.toString(value1));
        BigDecimal value4=new BigDecimal(Double.toString(value2));
        System.out.println("精确加法================="+ArithUtil.add(value1, value2));
        System.out.println("精确减法================="+ArithUtil.sub(value1, value2));
        System.out.println("精确乘法================="+ArithUtil.mul(value1, value2));
        System.out.println("精确除法 使用默认精度 ================="+ArithUtil.div(value1, value2));
        System.out.println("精确除法  设置精度================="+ArithUtil.div(value1, value2,20));
        System.out.println("四舍五入   小数点后保留几位 ================="+ArithUtil.round(value1, 10));
        System.out.println("比较大小 ================="+ArithUtil.equalTo(value3, value4));
    }
}
```



### 避坑指南

#### 使用double很危险

- 计算机是以二进制存储数值的，浮点数也不例外。对于计算机而言，0.1 无法精确表达，这是浮点数计算造成精度损失的根源。
- 使用 BigDecimal 表示和计算浮点数，且务必使用字符串的构造方法来初始化BigDecimal
- BigDecimal 有 scale 和 precision 的概念，scale 表示小数点右边的位数，而 precision 表示精度，也就是有效数字的长度
- 不能调用 BigDecimal 传入 Double 的构造方法，但手头只有一个 Double，如何转换为精确表达的 BigDecimal 呢？
- 如果一定要用 Double 来初始化 BigDecimal 的话，可以使用 BigDecimal.valueOf 方法，以确保其表现和字符串形式的构造方法一致
- `System.out.println(new BigDecimal("4.015").multiply(BigDecimal.valueOf(100)));`
- new BigDecimal(Double.toString(100)) 得到的 BigDecimal 的
  scale=1、precision=4；而 new BigDecimal(“100”) 得到的 BigDecimal 的 scale=0、
  precision=3。对于 BigDecimal 乘法操作，返回值的 scale 是两个数的 scale 相加。所
  以，初始化 100 的两种不同方式，导致最后结果的 scale 分别是 4 和 3。



#### 考虑浮点数舍入和格式化方式

- 首先用 double 和 float 初始化两个 3.35 的浮点数，然后通过String.format 使用 %.1f 来格式化这 2 个数字

```java
double num1 = 3.35;
float num2 = 3.35f;
System.out.println(String.format("%.1f", num1));//四舍五入 3.4
System.out.println(String.format("%.1f", num2));//3.3
```

- 这就是由精度问题和舍入方式共同导致的，double 和 float 的 3.35 其实相当于 3.350xxx和 3.349xxx
- String.format 采用四舍五入的方式进行舍入，取 1 位小数，double 的 3.350 四舍五入为3.4，而 float 的 3.349 四舍五入为 3.3。
- 如果我们希望使用其他舍入方式来格式化字符串的话，可以设置 DecimalFormat

```java
double num1 = 3.35;
float num2 = 3.35f;
DecimalFormat format = new DecimalFormat("#.##");
format.setRoundingMode(RoundingMode.DOWN);
System.out.println(format.format(num1));//3.35
format.setRoundingMode(RoundingMode.DOWN);
System.out.println(format.format(num2));//3.34
```

- 即使通过 DecimalFormat 来精确控制舍入方式，double 和 float 的问题也可能产
  生意想不到的结果
- 所以浮点数避坑第二原则：**浮点数的字符串格式化也要通过BigDecimal 进行**。
- 使用 BigDecimal 来格式化数字 3.35，分别使用向下舍入和四舍五入方式取 1 位小数进行格式化

```java
BigDecimal num1 = new BigDecimal("3.35");
BigDecimal num2 = num1.setScale(1, BigDecimal.ROUND_DOWN);
System.out.println(num2);//3.3
BigDecimal num3 = num1.setScale(1, BigDecimal.ROUND_HALF_UP);
System.out.println(num3);//3.4
```



#### equals做判断

- 包装类的比较要通过 equals 进行，而不能使用 ==。那么，使用 equals 方法对两个 BigDecimal 判等，一定能得到我们想要的结果吗？

```java
System.out.println(new BigDecimal("1.0").equals(new BigDecimal("1")));
/*
BigDecimal 的 equals 方法的注释中说
明了原因，equals 比较的是 BigDecimal 的 value 和 scale，1.0 的 scale 是 1，1 的
scale 是 0，所以结果一定是 false
*/
```

- **如果我们希望只比较 BigDecimal 的 value，可以使用 compareTo 方法**

```java
System.out.println(new BigDecimal("1.0").compareTo(new BigDecimal("1"))==0);
```

-  BigDecimal 的 equals 和 hashCode 方法会同时考虑 value和 scale，如果结合 HashSet 或 HashMap 使用的话就可能会出现麻烦。比如，我们把值为 1.0 的 BigDecimal 加入 HashSet，然后判断其是否存在值为 1 的 BigDecimal，得到的结果是 false

```java
Set<BigDecimal> hashSet1 = new HashSet<>();
hashSet1.add(new BigDecimal("1.0"));
System.out.println(hashSet1.contains(new BigDecimal("1")));//返回false
```

- 第一个方法是，使用 TreeSet 替换 HashSet。TreeSet 不使用 hashCode 方法，也不使用 equals 比较元素，而是使用 compareTo 方法，所以不会有问题。

```java
Set<BigDecimal> treeSet = new TreeSet<>();
treeSet.add(new BigDecimal("1.0"));
System.out.println(treeSet.contains(new BigDecimal("1")));//返回true
```

- 第二个方法是，把 BigDecimal 存入 HashSet 或 HashMap 前，先使用stripTrailingZeros 方法去掉尾部的零，比较的时候也去掉尾部的 0，确保 value 相同的BigDecimal，scale 也是一致的

```java
Set<BigDecimal> hashSet2 = new HashSet<>();
hashSet2.add(new BigDecimal("1.0").stripTrailingZeros());
System.out.println(hashSet2.contains(new BigDecimal("1.000").stripTrailingZeros()));//返回true
```



#### 小心数值溢出

- 不管是 int 还是 long，所有的基本数值类型都有超出表达范围的可能性。
- 显然这是发生了溢出，而且是默默的溢出，并没有任何异常。这类问题非常容易被忽略，改进方式有下面 2 种
- 方法一是，考虑使用 Math 类的 addExact、subtractExact 等 xxExact 方法进行数值运算，这些方法可以在数值溢出时主动抛出异常。

```java
try {
  long l = Long.MAX_VALUE;
  System.out.println(Math.addExact(l, 1));
} catch (Exception ex) {
	ex.printStackTrace();//java.lang.ArithmeticException: long overflow
}
```

- 方法二是，使用大数类 BigInteger。BigDecimal 是处理浮点数的专家，而 BigInteger 则是对大数进行科学计算的专家。
- 使用 BigInteger 对 Long 最大值进行 +1 操作；如果希望把计算结果转换一个Long 变量的话，可以使用 BigInteger 的 longValueExact 方法，在转换出现溢出时，同样会抛出 ArithmeticException

```java
BigInteger i = new BigInteger(String.valueOf(Long.MAX_VALUE));
System.out.println(i.add(BigInteger.ONE).toString());
try {
long l = i.add(BigInteger.ONE).longValueExact();
} catch (Exception ex) {
ex.printStackTrace();
}

/*
9223372036854775808
java.lang.ArithmeticException: BigInteger out of long range
可以看到，通过 BigInteger 对 Long 的最大值加 1 一点问题都没有，当尝试把结果转换为
Long 类型时，则会提示 BigInteger out of long range
*/
```


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


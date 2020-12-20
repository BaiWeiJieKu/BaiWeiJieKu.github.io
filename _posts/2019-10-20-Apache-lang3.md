---
layout: post
title: "Apache-lang3"
categories: 工具类
tags: lang3
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### NumberUtils

#### isNumber:判断字符串是否是数字

```java
//isNumber:判断字符串是否是数字
System.out.println(NumberUtils.isNumber("5.96"));//true
System.out.println(NumberUtils.isNumber("ay1"));//false
System.out.println(NumberUtils.isNumber("100424030"));//true
System.out.println(NumberUtils.isNumber("1#$"));//false
```



#### isDigits:判断字符串中是否全为数字

```java
System.out.println(NumberUtils.isDigits("100424060.100424030"));//false
System.out.println(NumberUtils.isDigits("100424060"));//true
```



#### max:最大值

```java
System.out.println(NumberUtils.max(new int[]{7,5,6}));//7
System.out.println(NumberUtils.max(7, 1, 7));//7
System.out.println(NumberUtils.max(7.1, 1.1, 7.0));//7.1
System.out.println(NumberUtils.max(new double[]{7.2,5.2,6.2}));//7.2
```



#### toInt():字符串转换为整数

```java
System.out.println(NumberUtils.toInt("5"));//5
System.out.println(NumberUtils.toLong("5"));//5
System.out.println(NumberUtils.toByte("3"));//3
System.out.println(NumberUtils.toFloat(""));//0.0
System.out.println(NumberUtils.toDouble("4"));//4.0
System.out.println(NumberUtils.toShort("3"));//3
```



#### createLong：通过字符串创建包装类型

```java
NumberUtils.createBigDecimal("1");
NumberUtils.createLong("1");
NumberUtils.createInteger("1");
```



### RandomUtils,RandomStringUtils

#### nextInt

```java
//返回指定范围内的随机整数。
System.out.println(RandomUtils.nextInt(1,5));//3
```



### StringUtils

![](https://tcs.teambition.net/storage/3120a063cc3c0f63392ed5c5da83adc54757?Signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcHBJRCI6IjU5Mzc3MGZmODM5NjMyMDAyZTAzNThmMSIsIl9hcHBJZCI6IjU5Mzc3MGZmODM5NjMyMDAyZTAzNThmMSIsIl9vcmdhbml6YXRpb25JZCI6IjVmOWI3NDQxMDMwNThjMmFlMWNkNTViOCIsImV4cCI6MTYwOTA2MjUzNywiaWF0IjoxNjA4NDU3NzM3LCJyZXNvdXJjZSI6Ii9zdG9yYWdlLzMxMjBhMDYzY2MzYzBmNjMzOTJlZDVjNWRhODNhZGM1NDc1NyJ9.b22CXB_ZpfcrqeHFWusre03k2qwP2D5BbMboCqYA9sI)



### DateUtils

#### 判断两个日期时间是否是同一天

```java
/**
 * 判断两个日期时间是否是同一天 。
 *
 * @param date1  第一个日期，不可修改，非null
 * @param date2  第二个日期，不可修改，非null
 */
public static boolean isSameDay(final Date date1, final Date date2)

/**
 * 判断两个日历时间是否是同一天 。   
 *
 * @param cal1  第一个日历，不可修改，非null
 * @param cal2  第二个日历，不可修改，非null
 */
public static boolean isSameDay(final Calendar cal1, final Calendar cal2)
```



#### 判断两个日期是否相同

```java
/**
 * 判断两个日期是否相同
 * 这种方法比较两个对象的毫秒时间 
 *
 * @param date1  第一个日期，不可修改，非null
 * @param date2  第二个日期，不可修改，非null
 */
public static boolean isSameInstant(final Date date1, final Date date2)

/**
 * 判断两个日历是否相同
 * 这种方法比较两个对象的毫秒时间 
 *
 * @param cal1  第一个日历，不可修改，非null
 * @param cal2  第二个日历，不可修改，非null
 */
public static boolean isSameInstant(final Calendar cal1, final Calendar cal2)

/**
 * 判断两个日历本地时间是否相同
 * 除了比较数值外两个日历对象的类型还要相同
 *
 * @param cal1  第一个日历，不可修改，非null
 * @param cal2  第二个日历，不可修改，非null
 */
public static boolean isSameLocalTime(final Calendar cal1, final Calendar cal2)
```



#### 解析代表时间的字符串

```java
/**
 * 尝试用parsePatterns中各种不同的日期格式解析代表时间的字符串str 。
 *
 * 解析时会逐个使用parsePatterns中的格式，如果都没有匹配上， 则抛出异常ParseException 。
 *
 * @param str  被解析的时间字符串，非null
 * @param parsePatterns  用于解析str的时间格式，有一个或几个，非null
 */
public static Date parseDate(final String str, final String... parsePatterns) throws ParseException

/**
 * 尝试用parsePatterns中各种不同的日期格式解析代表时间的字符串str 。
 * 解析时会使用给定的日期格式符locale 。
 *
 * 解析时会逐个使用parsePatterns中的格式，如果都没有匹配上， 则抛出异常ParseException 。
 *
 * @param str  被解析的时间字符串，非null
 * @param locale 使用locale中的日期格式符，如果为null，则使用系统默认的locale
 * @param parsePatterns  用于解析str的时间格式，有一个或几个，非null
 */
public static Date parseDate(final String str, final Locale locale, final String... parsePatterns) throws ParseException

/**
 * 尝试用parsePatterns中各种不同的日期格式解析代表时间的字符串str 。
 *
 * 解析时会逐个使用parsePatterns中的格式，如果都没有匹配上， 则抛出异常ParseException 。
 * 解析器解析严格不允许的日期， 如："February 942, 1996" 。
 *
 * @param str  被解析的时间字符串，非null
 * @param parsePatterns  用于解析str的时间格式，有一个或几个，非null
 */
public static Date parseDateStrictly(final String str, final String... parsePatterns) throws ParseException

/**
 * 尝试用parsePatterns中各种不同的日期格式解析代表时间的字符串str 。
 * 解析时会使用给定的日期格式符locale 。
 *
 * 解析时会逐个使用parsePatterns中的格式，如果都没有匹配上， 则抛出异常ParseException 。
 * 解析器解析严格不允许的日期， 如："February 942, 1996" 。
 *
 * @param str  被解析的时间字符串，非null
 * @param locale 使用locale中的日期格式符，如果为null，则使用系统默认的locale
 * @param parsePatterns  用于解析str的时间格式，有一个或几个，非null
 */
public static Date parseDateStrictly(final String str, final Locale locale, final String... parsePatterns) throws ParseException
```



#### 日期加减

```java
/**
 * 在日期date上增加amount年 。
 *
 * @param date  处理的日期，非null
 * @param amount  要加的年数，可能为负数
 */
public static Date addYears(final Date date, final int amount)

/**
 * 在日期date上增加amount月 。
 *
 * @param date  处理的日期，非null
 * @param amount  要加的月数，可能为负数
 */
public static Date addMonths(final Date date, final int amount)

/**
 * 在日期date上增加amount周 。
 *
 * @param date  处理的日期，非null
 * @param amount  要加的周数，可能为负数
 */
public static Date addWeeks(final Date date, final int amount)

/**
 * 在日期date上增加amount天 。
 *
 * @param date  处理的日期，非null
 * @param amount  要加的天数，可能为负数
 */
public static Date addDays(final Date date, final int amount)

/**
 * 在日期date上增加amount小时 。
 *
 * @param date  处理的日期，非null
 * @param amount  要加的小时数，可能为负数
 */
public static Date addHours(final Date date, final int amount)

/**
 * 在日期date上增加amount分钟 。
 *
 * @param date  处理的日期，非null
 * @param amount  要加的分钟数，可能为负数
 */
public static Date addMinutes(final Date date, final int amount)

/**
 * 在日期date上增加amount秒 。
 *
 * @param date  处理的日期，非null
 * @param amount  要加的秒数，可能为负数
 */
public static Date addSeconds(final Date date, final int amount)

/**
 * 在日期date上增加amount 毫秒 。
 *
 * @param date  处理的日期，非null
 * @param amount  要加的毫秒数，可能为负数
 */
public static Date addMilliseconds(final Date date, final int amount)
```



#### 重新设置日期

```java
/**
 * 给日期data设置一个新的年份 。
 *
 * @param date 处理的日期，非null
 * @param amount 要设置的年份
 */
public static Date setYears(final Date date, final int amount)

/**
 * 给日期data设置一个新的月份 。
 *
 * @param date 处理的日期，非null
 * @param amount 要设置的月份
 */
public static Date setMonths(final Date date, final int amount)

/**
 * 给日期data设置一个新的天 。
 *
 * @param date 处理的日期，非null
 * @param amount 要设置的天
 */
public static Date setDays(final Date date, final int amount)

/**
 * 给日期data设置一个新的小时 。
 *
 * @param date 处理的日期，非null
 * @param amount 要设置的小时
 */
public static Date setHours(final Date date, final int amount)

/**
 * 给日期data设置一个新的分钟 。
 *
 * @param date 处理的日期，非null
 * @param amount 要设置的分钟
 */
public static Date setMinutes(final Date date, final int amount)

/**
 * 给日期data设置一个新的秒 。
 *
 * @param date 处理的日期，非null
 * @param amount 要设置的秒
 */
public static Date setSeconds(final Date date, final int amount)

/**
 * 给日期data设置一个新的毫秒 。
 *
 * @param date 处理的日期，非null
 * @param amount 要设置的毫秒
 */
public static Date setMilliseconds(final Date date, final int amount)
```



#### 处理日历

```java
/**
 * 将一个日期放到日历中 。
 */
public static Calendar toCalendar(final Date date)

/**
 * 根据阈值field四舍五入日历date 。
 *
 * 例如， 如果你的时间是 28 Mar 2002 13:45:01.231，
 * 如果field为HOUR，它将返回 28 Mar 2002 14:00:00.000；
 * 如果field为MONTH，它将返回 1 April 2002 0:00:00.000 。
 *
 * @param date  处理的日期，非null
 * @param field  阈值
 */
public static Date round(final Date date, final int field)

/**
 * 根据阈值field四舍五入日历date 。
 *
 * 例如， 如果你的时间是 28 Mar 2002 13:45:01.231，
 * 如果field为HOUR，它将返回 28 Mar 2002 14:00:00.000；
 * 如果field为MONTH，它将返回 1 April 2002 0:00:00.000 。
 *
 * @param date  处理的日期，非null
 * @param field  阈值  
 */
public static Calendar round(final Calendar date, final int field)
  
/**
 * 根据阈值field截取日历date 。
 *
 * 例如， 如果你的时间是 28 Mar 2002 13:45:01.231，
 * 如果field为HOUR，它将返回 28 Mar 2002 13:00:00.000；
 * 如果field为MONTH，它将返回 1 Mar 2002 0:00:00.000 。
 *
 * @param date  处理的日期，非null
 * @param field  阈值
 */
public static Calendar truncate(final Calendar date, final int field)
  
/**
 * 根据阈值field向上舍入日期date 。
 *
 * 例如， 如果你的时间是 28 Mar 2002 13:45:01.231，
 * 如果field为HOUR，它将返回 28 Mar 2002 14:00:00.000；
 * 如果field为MONTH，它将返回 1 Apr 2002 0:00:00.000 。
 *
 * @param date  处理的日期，非null
 * @param field  阈值
 */
public static Calendar ceiling(final Calendar date, final int field)
```



#### 截取日期

```java
/**
 * 根据阈值field四舍五入日历date 。
 *
 * 例如， 如果你的时间是 28 Mar 2002 13:45:01.231，
 * 如果field为HOUR，它将返回 28 Mar 2002 14:00:00.000；
 * 如果field为MONTH，它将返回 1 April 2002 0:00:00.000 。
 *
 * @param date  处理的日期，非null
 * @param field  阈值 
 */
public static Date round(final Object date, final int field)

/**
 * 根据阈值field截取日期date 。
 *
 * 例如， 如果你的时间是 28 Mar 2002 13:45:01.231，
 * 如果field为HOUR，它将返回 28 Mar 2002 13:00:00.000；
 * 如果field为MONTH，它将返回 1 Mar 2002 0:00:00.000 。
 *
 * @param date  处理的日期，非null
 * @param field  阈值 
 */
public static Date truncate(final Date date, final int field)
  
/**
 * 根据阈值field向上舍入日期date 。
 *
 * 例如， 如果你的时间是 28 Mar 2002 13:45:01.231，
 * 如果field为HOUR，它将返回 28 Mar 2002 14:00:00.000；
 * 如果field为MONTH，它将返回 1 Apr 2002 0:00:00.000 。
 *
 * @param date  处理的日期，非null
 * @param field  阈值
 */
public static Date ceiling(final Date date, final int field)
  

```



### ArrayUtils

![](https://tcs.teambition.net/storage/31204ac8721386a5a6d62ba3b7aa5622dcfd?Signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcHBJRCI6IjU5Mzc3MGZmODM5NjMyMDAyZTAzNThmMSIsIl9hcHBJZCI6IjU5Mzc3MGZmODM5NjMyMDAyZTAzNThmMSIsIl9vcmdhbml6YXRpb25JZCI6IiIsImV4cCI6MTYwOTA2MDkzOCwiaWF0IjoxNjA4NDU2MTM4LCJyZXNvdXJjZSI6Ii9zdG9yYWdlLzMxMjA0YWM4NzIxMzg2YTVhNmQ2MmJhM2I3YWE1NjIyZGNmZCJ9.PrvrQ1dB4UhuoJQCWz7gci5zCVTmnXgTbduqNMS_GQM)



### BooleanUtils

![](https://tcs.teambition.net/storage/3120fbf6eafbcd892817d3549b692877b199?Signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcHBJRCI6IjU5Mzc3MGZmODM5NjMyMDAyZTAzNThmMSIsIl9hcHBJZCI6IjU5Mzc3MGZmODM5NjMyMDAyZTAzNThmMSIsIl9vcmdhbml6YXRpb25JZCI6IiIsImV4cCI6MTYwOTA2MDkzOCwiaWF0IjoxNjA4NDU2MTM4LCJyZXNvdXJjZSI6Ii9zdG9yYWdlLzMxMjBmYmY2ZWFmYmNkODkyODE3ZDM1NDliNjkyODc3YjE5OSJ9.Jw-f-wE3eX4tgyMZr26XCYXeE1JT0AIKiOK7aiOsixI)



### ClassUtils

![](https://tcs.teambition.net/storage/31207a88960e21a3533603036a5278288cb7?Signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcHBJRCI6IjU5Mzc3MGZmODM5NjMyMDAyZTAzNThmMSIsIl9hcHBJZCI6IjU5Mzc3MGZmODM5NjMyMDAyZTAzNThmMSIsIl9vcmdhbml6YXRpb25JZCI6IiIsImV4cCI6MTYwOTA2MDkzOCwiaWF0IjoxNjA4NDU2MTM4LCJyZXNvdXJjZSI6Ii9zdG9yYWdlLzMxMjA3YTg4OTYwZTIxYTM1MzM2MDMwMzZhNTI3ODI4OGNiNyJ9.RV-X8R75kXJGA7IkrOha9jRvEDxT9gW21CFJYcMhqEU)


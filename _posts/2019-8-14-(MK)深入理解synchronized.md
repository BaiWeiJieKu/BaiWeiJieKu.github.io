---
layout: post
title: "MK深入理解synchronized"
categories: 并发
tags: 并发
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 简介

- synchronized作用：能够保证在**同一时刻**最多只有**一个**线程执行该段代码，以达到保证并发安全的效果。
- JVM会自动通过使用monitor来加锁和解锁，保证了同时只有一个线程可以执行指定代码，从而保证了线程安全，同时具有可重入和不可中断的性质

#### 对象锁

- 包括方法锁（默认锁对象为this当前实例对象）和同步代码块锁（自己制定锁对象）

```java
public void synchronized method(){
    System.out.println("我是普通方法形式的对象锁");
 }
 public void method(){
     synchronized(this){
     　　System.out.println("我是代码块形式的对象锁");
　　　}
 }
```



#### 类锁

- 指synchronized修饰静态的方法或制定锁为Class对象
- Java类可以有多个对象，但只有一个class对象，所谓的类锁，只不过是class对象的锁
- 类锁只能在同一时刻被一个对象拥有
- 形式1：synchronized加在static方法上
- 形式2：synchronized（*class）代码块

```java
public static void synchronized method(){
　　System.out.println("我是静态方法形式的类锁");
}
public void method(){
　　synchronized(*.class){
　　　　System.out.println("我是代码块形式的类锁");
　　}
}
```



#### 核心思想

- 一把锁只能同时被一个线程获取，没有拿到锁的线程必须等待
- 每个实例都对应有自己的一把锁，不同实例之间互不影响；例外，锁对象是*.class以及synchronized修饰的是static方法的时候，所有对象共用同一把类锁。
- 无论是方法正常执行完毕活着方法抛出异常，都会释放锁

#### 性质

- 可重入

  指的是同一线程的外层函数获得锁后，内层函数可以直接再次获取该锁

  好处：避免死锁，提升封装性

  是线程粒度的

  原理：加锁次数计数器。JVM负责跟踪对象被加锁的次数，线程第一次给对象加锁的时候，计数器变为1，每当这个相同的线程在此对象上再次获得锁时，计数会递增。每当任务离开时，计数递减，当计数为0的时候，锁被完全释放

```java
public class SynchronizedRecursion{
　　int a =0;
　　int b =0;
　　private void method1(){
　　　　System.out.println("method1正在执行，a = "+ a);
　　　　if(a ==0){
　　　　　　a ++;
　　　　　　method1();
　　　　}
　　　　System.out.println("method1执行结束，a = "+ a);
　　}
　　private synchronized void method2(){
　　　　System.out.println("method2正在执行，b = "+ b);
　　　　if(b == 0){
　　　　　　b ++;
　　　　　　method2();
　　　　}
　　　　System.out.println("method2执行结束，b = "+ b);
　　}
　　public static void main(String[] args){
　　　　SynchronizedRecursion synchronizedRecursion = new SynchronizedRecursion();
　　　　synchronizedRecursion.method1();
　　　　synchronizedRecursion.method2();
　　}
}
结果为：
method1正在执行，a =0
method1正在执行，a =1
method1执行结束，a =1
method1执行结束，a =1
method2正在执行，b =0
method2正在执行，b =1
method2执行结束，b =1
method2执行结束，b =1
// 可以看到method1()与method2()的执行结果一样的，method2()在获取到对象锁以后，在递归调用时不需要等上一次调用先释放后再获取，而是直接进入，这说明了synchronized的可重入性.
// 当然，除了递归调用，调用同类的其它同步方法，调用父类同步方法，都是可重入的，前提是同一对象去调用，这里就不一一列举了.
```



- 不可中断

  一旦这个锁被别人获取了，如果我还想获得，我只能选择等待或者阻塞，直到别的线程释放这个锁。如果别人永远不释放锁，那么我只能永远等待下去，也就形成了死锁

#### 实现原理

- monitorenter和monitorexit
- 将下面两段代码分别用 javac *.java编译成.class文件，再反编译 javap -verbose *.class文件

```
public class SynchronizedThis{
　　public void method(){
　　　　synchronized(this){}
　　}
}

// 反编译结果
public void method();
descriptor:()V
flags: ACC_PUBLIC
Code:
stack=2, locals=3, args_size=1
0: aload_0
1: dup
2: astore_1
3: monitorenter
4: aload_1
5: monitorexit
6:goto14
9: astore_2
10: aload_1
11: monitorexit
12: aload_2
13: athrow
14:return
 
public class SynchronizedMethod{
　　public synchronized void method(){}
}

// 反编译结果
public synchronized void method();
descriptor:()V
flags: ACC_PUBLIC, ACC_SYNCHRONIZED
Code:
stack=0, locals=1, args_size=1
0:return
LineNumberTable:
line 2:0
```

- 可以看到：

  synchronized加在代码块上，JVM是通过**monitorenter**和**monitorexit**来控制锁的获取的释放的；

  synchronized加在方法上，JVM是通过**ACC_SYNCHRONIZED**来控制的，但本质上也是通过monitorenter和monitorexit指令控制的。

#### 缺陷

- 效率低，释放锁的情况少，试图获得锁时不能设定超时，不能中断一个正在试图获取锁的线程
- 不够灵活（读写锁更灵活），加锁和释放的时机单一，每个锁仅有单一的条件（某个对象），可能是不够的
- 无法知道是否成功的获取到了锁

#### 面试问题

- 使用的注意点

  锁对象不能为空，必须是一个实例对象，因为锁是保存在对象头中的

  作用域不宜过大

  避免死锁

- 多线程访问同步方法的各种具体情况

  - 两个线程同时访问一个对象的同步方法：一个一个的执行，因为持有的是同一个锁
  - 两个线程访问两个对象的同步方法：并发的执行，因为是不同的实例对象，相互不影响
  - 两个线程访问的是synchronized的静态方法：一个一个的执行
  - 同时访问同步方法和非同步方法：非同步方法不受影响，两个线程并发执行
  - 访问同一个对象的不同的普通同步方法：一个一个的执行
  - 同时访问静态synchronized和非静态synchronized方法：同时运行，锁对象不同
  - 方法抛出异常后，会释放锁

- 多个实例，对当前实例加锁，同步执行，对当前类Class对象加锁，异步执行

```java
public class SimpleExample implements Runnable{
　　static SimpleExample instance1 = new SimpleExample();
　　static SimpleExample instance2 = new SimpleExample();

　　@Override
　　public void run(){
　　　　method1();
　　　　method2();
　　　　method3();
　　　　method4();
　　}

   //锁对象为当前对象
　　public synchronized void method1(){
　　　　common();
　　}
	//锁对象为类对象
　　public static synchronized void method2(){
　　　　commonStatic();
　　}
	//锁对象为当前对象
　　public void method3(){
　　　　synchronized(this){
　　　　　　common();
　　　　}
　　}
	//锁对象为类对象
　　public void method4(){
　　　　synchronized(MultiInstance.class){
　　　　　　common();
　　　　}
　　}
	//普通方法
　　public void method5(){
　　　　common();
　　}
	//普通方法
　　public void method6(){
　　　　commonStatic();
　　}

　　public void common(){
　　　　System.out.println("线程 "+Thread.currentThread().getName()+" 正在执行");
　　　　try{
　　　　　　Thread.sleep(1000);
　　　　}catch(InterruptedException e){
　　　　　　e.printStackTrace();
　　　　}
　　　　System.out.println("线程 "+Thread.currentThread().getName()+" 执行完毕");
　　}

　　public static void commonStatic(){
　　　　System.out.println("线程 "+Thread.currentThread().getName()+" 正在执行");
　　　　try{
　　　　　　Thread.sleep(1000);
　　　　}catch(InterruptedException e){
　　　　　　e.printStackTrace();
　　　　}
　　　　System.out.println("线程 "+Thread.currentThread().getName()+" 执行完毕");
　　}
　　public static void main(String[] args)throws InterruptedException{
　　　　Thread t1 = new Thread(instance1);
　　　　Thread t2 = new Thread(instance2);
　　　　t1.start();
　　　　t2.start();
　　　　t1.join();
　　　　t2.join();
　　　　System.out.println("finished");
　　}
}
/*
method1()、method3()结果为：
线程Thread-0正在执行
线程Thread-1正在执行
线程Thread-0执行完毕
线程Thread-1执行完毕
finished
-----------------------------------
method2()、method4()执行结果为：
线程Thread-0正在执行
线程Thread-0执行完毕
线程Thread-1正在执行
线程Thread-1执行完毕
finished
*/
```

- 对象锁和类锁，锁的对象不一样，互不影响，所以异步执行

```java
// 将run方法改为
@Override
public void run(){
　　if("Thread-0".equals(Thread.currentThread().getName())){
　　　　method1();
　　}else{
　　　　method2();
}
}
// 将main方法改为
public static void main(String[] args) throws InterruptedException{
Thread t1 = new Thread(instance1);
Thread t2 = new Thread(instance1);
t1.start();
t2.start();
t1.join();
t2.join();
System.out.println("finished");
}

结果为：
线程Thread-0正在执行
线程Thread-1正在执行
线程Thread-1执行完毕
线程Thread-0执行完毕
finished
```

- 对象锁和无锁得普通方法，普通方法不需要持有锁，所以异步执行

```java
// 将run方法改为
@Override
public void run(){
　　if("Thread-0".equals(Thread.currentThread().getName())){
　　　　method1();
　　}else{
　　　　method5();
　　}
}
// main方法同 2
结果为：
线程Thread-0正在执行
线程Thread-1正在执行
线程Thread-0执行完毕
线程Thread-1执行完毕
finished
```

- 类锁和无锁静态方法，异步执行

```java
// 将run方法改为
@Override
public void run(){
　　if("Thread-0".equals(Thread.currentThread().getName())){
　　　　method1();
　　}else{
　　　　method6();
　　}
}
// main方法同 2
结果为：
线程Thread-0正在执行
线程Thread-1正在执行
线程Thread-0执行完毕
线程Thread-1执行完毕
finished
```

- 方法抛出异常，synchronized锁自动释放

```java
// run方法改为
@Override
public void run(){
　　if("Thread-0".equals(Thread.currentThread().getName())){
　　　　method7();
　　}else{
　　　　method8();
　　}
}
public synchronized void method7(){
　　try{
　　　　...
　　　　throw new Exception();
　　}catch(Exception e){
　　　　e.printStackTrace();
　　}
}
public synchronized void method8(){
　　common();
}
public static void main(String[] args) throws InterruptedException{
　　// 同 2
}
结果为：
线程Thread-0正在执行
java.lang.Exception
at com.marksman.theory2practicehighconcurrency.synchronizedtest.blog.SynchronizedException.method7(SynchronizedException.java:26)
at com.marksman.theory2practicehighconcurrency.synchronizedtest.blog.SynchronizedException.run(SynchronizedException.java:15)
at java.lang.Thread.run(Thread.java:748)
线程Thread-0执行结束
线程Thread-1正在执行
线程Thread-1执行结束
finished
// 这说明抛出异常后持有对象锁的method7()方法释放了锁，这样method8()才能获取到锁并执行。
```


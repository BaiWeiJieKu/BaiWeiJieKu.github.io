---
layout: post
title: "java基础复习五Java接口和内部类"
categories: java基础
tags: java基础 接口 内部类
author: 百味皆苦
music-id: 556241619
---

* content
{:toc}
## 接口

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

## 对象克隆

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

## 接口回调

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

## 内部类

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


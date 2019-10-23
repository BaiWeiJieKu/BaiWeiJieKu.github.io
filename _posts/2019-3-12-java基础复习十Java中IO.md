---
layout: post
title: "java基础复习十Java中IO"
categories: java基础
tags: java基础 IO
author: 百味皆苦
music-id: 28912536
---

* content
{:toc}
## 文件对象

- 文件和文件夹都是用File代表
- 使用绝对路径或者相对路径创建File对象

```java
package file;
 
import java.io.File;
 
public class TestFile {
 
    public static void main(String[] args) {
        // 绝对路径
        File f1 = new File("d:/LOLFolder");
        System.out.println("f1的绝对路径：" + f1.getAbsolutePath());
        // 相对路径,相对于工作目录，如果在eclipse中，就是项目目录
        File f2 = new File("LOL.exe");
        System.out.println("f2的绝对路径：" + f2.getAbsolutePath());
 
        // 把f1作为父目录创建文件对象
        File f3 = new File(f1, "LOL.exe");
 
        System.out.println("f3的绝对路径：" + f3.getAbsolutePath());
    }
}

```

![](http://stepimagewm.how2j.cn/756.png)

- 注意1： 需要在D:\LOLFolder确实存在一个LOL.exe,才可以看到对应的文件长度、修改时间等信息
- 注意2： renameTo方法用于对物理文件名称进行修改，但是并不会修改File对象的name属性。

```java
package file;
 
import java.io.File;
import java.util.Date;
 
public class TestFile {
 
    public static void main(String[] args) {
 
        File f = new File("d:/LOLFolder/LOL.exe");
        System.out.println("当前文件是：" +f);
        //文件是否存在
        System.out.println("判断是否存在："+f.exists());
        
        //是否是文件夹
        System.out.println("判断是否是文件夹："+f.isDirectory());
         
        //是否是文件（非文件夹）
        System.out.println("判断是否是文件："+f.isFile());
         
        //文件长度
        System.out.println("获取文件的长度："+f.length());
         
        //文件最后修改时间
        long time = f.lastModified();
        Date d = new Date(time);
        System.out.println("获取文件的最后修改时间："+d);
        //设置文件修改时间为1970.1.1 08:00:00
        f.setLastModified(0);
         
        //文件重命名
        File f2 =new File("d:/LOLFolder/DOTA.exe");
        f.renameTo(f2);
        System.out.println("把LOL.exe改名成了DOTA.exe");
        
        System.out.println("注意： 需要在D:\\LOLFolder确实存在一个LOL.exe,\r\n才可以看到对应的文件长度、修改时间等信息");
    }
}

```

![](http://stepimagewm.how2j.cn/757.png)

```java
package file;
 
import java.io.File;
import java.io.IOException;
 
public class TestFile {
 
    public static void main(String[] args) throws IOException {
 
        File f = new File("d:/LOLFolder/skin/garen.ski");
 
        // 以字符串数组的形式，返回当前文件夹下的所有文件（不包含子文件及子文件夹）
        f.list();
 
        // 以文件数组的形式，返回当前文件夹下的所有文件（不包含子文件及子文件夹）
        File[]fs= f.listFiles();
 
        // 以字符串形式返回获取所在文件夹
        f.getParent();
 
        // 以文件形式返回获取所在文件夹
        f.getParentFile();
        // 创建文件夹，如果父文件夹skin不存在，创建就无效
        f.mkdir();
 
        // 创建文件夹，如果父文件夹skin不存在，就会创建父文件夹
        f.mkdirs();
 
        // 创建一个空文件,如果父文件夹skin不存在，就会抛出异常
        f.createNewFile();
        // 所以创建一个空文件之前，通常都会创建父目录
        f.getParentFile().mkdirs();
 
        // 列出所有的盘符c: d: e: 等等
        f.listRoots();
 
        // 刪除文件
        f.delete();
 
        // JVM结束的时候，刪除文件，常用于临时文件的删除
        f.deleteOnExit();
 
    }
}

```



## 流

- 当不同的介质之间有数据交互的时候，JAVA就使用流来实现。
- 数据源可以是文件，还可以是数据库，网络甚至是其他的程序
- 比如读取文件的数据到程序中，站在程序的角度来看，就叫做输入流
- 输入流： InputStream；输出流：OutputStream

![](http://stepimagewm.how2j.cn/759.png)



## 字节流

- InputStream字节输入流 
- OutputStream字节输出流 
- 用于以字节的形式读取和写入数据

### ASCII码

- 所有的数据存放在计算机中都是以数字的形式存放的。 所以字母就需要转换为数字才能够存放
- 比如A就对应的数字65，a对应的数字97. 不同的字母和符号对应不同的数字，就是一张码表。
- ASCII是这样的一种码表。 只包含简单的英文字母，符号，数字等等。



### 读取

- InputStream是字节输入流，同时也是抽象类，只提供方法声明，不提供方法的具体实现。
- FileInputStream 是InputStream子类，以FileInputStream 为例进行文件读取

```java
package stream;
 
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
 
public class TestStream {
 
    public static void main(String[] args) {
        try {
            //准备文件lol.txt其中的内容是AB，对应的ASCII分别是65 66
            File f =new File("d:/lol.txt");
            //创建基于文件的输入流
            FileInputStream fis =new FileInputStream(f);
            //创建字节数组，其长度就是文件的长度
            byte[] all =new byte[(int) f.length()];
            //以字节流的形式读取文件所有内容
            fis.read(all);
            for (byte b : all) {
                //打印出来是65 66
                System.out.println(b);
            }
            
            //每次使用完流，都应该进行关闭
            fis.close();
             
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
         
    }
}

```



### 写入

- OutputStream是字节输出流，同时也是抽象类，只提供方法声明，不提供方法的具体实现。
- FileOutputStream 是OutputStream子类，以FileOutputStream 为例向文件写出数据
- 注: 如果文件d:/lol2.txt不存在，写出操作会自动创建该文件。 
- 但是如果是文件 d:/xyz/lol2.txt，而目录xyz又不存在，会抛出异常

```java
package stream;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class TestStream {

	public static void main(String[] args) {
		try {
			// 准备文件lol2.txt其中的内容是空的
			File f = new File("d:/lol2.txt");
			// 准备长度是2的字节数组，用88,89初始化，其对应的字符分别是X,Y
			byte data[] = { 88, 89 };

			// 创建基于文件的输出流
			FileOutputStream fos = new FileOutputStream(f);
			// 把数据写入到输出流
			fos.write(data);
			// 关闭输出流
			fos.close();
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}

```

## 关闭流

- 所有的流，无论是输入流还是输出流，使用完毕之后，都应该关闭。
- 如果不关闭，会产生对资源占用的浪费。
- 当量比较大的时候，会影响到业务的正常开展。



### try

- 在try的作用域里关闭文件输入流，在前面的示例中都是使用这种方式，这样做有一个弊端；
- 如果文件不存在，或者读取的时候出现问题而抛出异常，那么就不会执行这一行关闭流的代码，存在巨大的资源占用隐患。 
- 不推荐使用

```java
package stream;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class TestStream {

	public static void main(String[] args) {
		try {
			File f = new File("d:/lol.txt");
			FileInputStream fis = new FileInputStream(f);
			byte[] all = new byte[(int) f.length()];
			fis.read(all);
			for (byte b : all) {
				System.out.println(b);
			}
			// 在try 里关闭流
			fis.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}

```



### finally

- 这是标准的关闭流的方式
  1. 首先把流的引用声明在try的外面，如果声明在try里面，其作用域无法抵达finally.
  2. 在finally关闭之前，要先判断该引用是否为空
  3. 关闭的时候，需要再一次进行try catch处理
- 这是标准的严谨的关闭流的方式，但是看上去很繁琐，所以写不重要的或者测试代码的时候，都会采用上面的有隐患try的方式，因为不麻烦

```java
package stream;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class TestStream {

	public static void main(String[] args) {
		File f = new File("d:/lol.txt");
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(f);
			byte[] all = new byte[(int) f.length()];
			fis.read(all);
			for (byte b : all) {
				System.out.println(b);
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			// 在finally 里关闭流
			if (null != fis)
				try {

					fis.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}

	}
}

```



### try()

- 把流定义在try()里,try,catch或者finally结束的时候，会自动关闭
- 这种编写代码的方式叫做 try-with-resources， 这是从JDK7开始支持的技术
- 所有的流，都实现了一个接口叫做 AutoCloseable，任何类实现了这个接口，都可以在try()中进行实例化。 并且在try, catch, finally结束的时候自动关闭，回收相关资源。

```java
package stream;
 
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
 
public class TestStream {
 
    public static void main(String[] args) {
        File f = new File("d:/lol.txt");
 
        //把流定义在try()里,try,catch或者finally结束的时候，会自动关闭
        try (FileInputStream fis = new FileInputStream(f)) {
            byte[] all = new byte[(int) f.length()];
            fis.read(all);
            for (byte b : all) {
                System.out.println(b);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
 
    }
}

```



## 字符流

- Reader字符输入流 
- Writer字符输出流 
- 专门用于字符的形式读取和写入数据



### 读取

- FileReader 是Reader子类，以FileReader 为例进行文件读取

```java
package stream;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class TestStream {

	public static void main(String[] args) {
		// 准备文件lol.txt其中的内容是AB
		File f = new File("d:/lol.txt");
		// 创建基于文件的Reader
		try (FileReader fr = new FileReader(f)) {
			// 创建字符数组，其长度就是文件的长度
			char[] all = new char[(int) f.length()];
			// 以字符流的形式读取文件所有内容
			fr.read(all);
			for (char b : all) {
				// 打印出来是A B
				System.out.println(b);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}

```

### 写入

- FileWriter 是Writer的子类，以FileWriter 为例把字符串写入到文件

```java
package stream;
 
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
 
public class TestStream {
 
    public static void main(String[] args) {
        // 准备文件lol2.txt
        File f = new File("d:/lol2.txt");
        // 创建基于文件的Writer
        try (FileWriter fr = new FileWriter(f)) {
            // 以字符流的形式把数据写入到文件中
        	String data="abcdefg1234567890";
        	char[] cs = data.toCharArray();
            fr.write(cs);
 
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
 
    }
}

```



## 中文问题

### 编码

- 计算机存放数据只能存放数字，所有的字符都会被转换为不同的数字。

![](http://stepimagewm.how2j.cn/2481.png)

- 工作后经常接触的编码方式有如下几种：
  ISO-8859-1 ASCII 数字和西欧字母
  GBK GB2312 BIG5 中文
  UNICODE (统一码，万国码)
- 其中
  ISO-8859-1 包含 ASCII
  GB2312 是简体中文，BIG5是繁体中文，GBK同时包含简体和繁体以及日文。
  UNICODE 包括了所有的文字，无论中文，英文，藏文，法文，世界所有的文字都包含其中

![](http://stepimagewm.how2j.cn/2483.png)



### 读取中文

- 为了能够正确的读取中文内容
  1. 必须了解文本是以哪种编码方式保存字符的
  2. 使用字节流读取了文本后，再使用对应的编码方式去识别这些数字，得到正确的字符



## 缓存流

- 以介质是硬盘为例，字节流和字符流的弊端： 
  在每一次读写的时候，都会访问硬盘。 如果读写的频率比较高的时候，其性能表现不佳。 
- 为了解决以上弊端，采用缓存流。 
  缓存流在读取的时候，会一次性读较多的数据到缓存中，以后每一次的读取，都是在缓存中访问，直到缓存中的数据读取完毕，再到硬盘中读取。 
- 就好比吃饭，不用缓存就是每吃一口都到锅里去铲。用缓存就是先把饭盛到碗里，碗里的吃完了，再到锅里去铲 
- 缓存流在写入数据的时候，会先把数据写入到缓存区，直到缓存区达到一定的量，才把这些数据，一起写入到硬盘中去。按照这种操作模式，就不会像字节流，字符流那样每写一个字节都访问硬盘，从而减少了IO操作



### 读取

- 缓存字符输入流 BufferedReader 可以一次读取一行数据

```java
package stream;
 
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
 
public class TestStream {
 
    public static void main(String[] args) {
        // 准备文件lol.txt其中的内容是
        // garen kill teemo
        // teemo revive after 1 minutes
        // teemo try to garen, but killed again
        File f = new File("d:/lol.txt");
        // 创建文件字符流
        // 缓存流必须建立在一个存在的流的基础上
        try (
        		FileReader fr = new FileReader(f); 
        		BufferedReader br = new BufferedReader(fr);
        	) 
        {
            while (true) {
                // 一次读一行
                String line = br.readLine();
                if (null == line)
                    break;
                System.out.println(line);
            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
 
    }
}

```



### 写入

- PrintWriter 缓存字符输出流， 可以一次写出一行数据

```java
package stream;
  
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
  
public class TestStream {
  
    public static void main(String[] args) {
        // 向文件lol2.txt中写入三行语句
        File f = new File("d:/lol2.txt");
         
        try (
                // 创建文件字符流
                FileWriter fw = new FileWriter(f);
                // 缓存流必须建立在一个存在的流的基础上               
                PrintWriter pw = new PrintWriter(fw);               
        ) {
            pw.println("garen kill teemo");
            pw.println("teemo revive after 1 minutes");
            pw.println("teemo try to garen, but killed again");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
  
    }
}

```



### flush

- 有的时候，需要立即把数据写入到硬盘，而不是等缓存满了才写出去。 这时候就需要用到flush

```java
package stream;
   
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
public class TestStream {
    public static void main(String[] args) {
        //向文件lol2.txt中写入三行语句
        File f =new File("d:/lol2.txt");
        //创建文件字符流
        //缓存流必须建立在一个存在的流的基础上
        try(FileWriter fr = new FileWriter(f);PrintWriter pw = new PrintWriter(fr);) {
            pw.println("garen kill teemo");
            //强制把缓存中的数据写入硬盘，无论缓存是否已满
                pw.flush();            
            pw.println("teemo revive after 1 minutes");
                pw.flush();
            pw.println("teemo try to garen, but killed again");
                pw.flush();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}

```



## 数据流

- DataInputStream 数据输入流 
- DataOutputStream 数据输出流
- 使用数据流的writeUTF()和readUTF() 可以进行数据的格式化顺序读写
- 通过DataOutputStream 向文件顺序写出 布尔值，整数和字符串。 然后再通过DataInputStream 顺序读入这些数据。
- 要用DataInputStream 读取一个文件，这个文件必须是由DataOutputStream 写出的，否则会出现EOFException，因为DataOutputStream 在写出的时候会做一些特殊标记，只有DataInputStream 才能成功的读取。

```java
package stream;
     
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
     
public class TestStream {
     
    public static void main(String[] args) {
    	write();
    	read();
    }

	private static void read() {
        File f =new File("d:/lol.txt");
		try (
                FileInputStream fis  = new FileInputStream(f);
                DataInputStream dis =new DataInputStream(fis);
        ){
            boolean b= dis.readBoolean();
            int i = dis.readInt();
            String str = dis.readUTF();
            
            System.out.println("读取到布尔值:"+b);
            System.out.println("读取到整数:"+i);
            System.out.println("读取到字符串:"+str);

        } catch (IOException e) {
            e.printStackTrace();
        }
		
	}

	private static void write() {
        File f =new File("d:/lol.txt");
		try (
                FileOutputStream fos  = new FileOutputStream(f);
                DataOutputStream dos =new DataOutputStream(fos);
        ){
            dos.writeBoolean(true);
            dos.writeInt(300);
            dos.writeUTF("123 this is gareen");
        } catch (IOException e) {
            e.printStackTrace();
        }
		
	}
}

```

![](http://stepimagewm.how2j.cn/771.png)



## 对象流

- 对象流指的是可以直接把一个对象以流的形式传输给其他的介质，比如硬盘 
- 一个对象以流的形式进行传输，叫做序列化。 该对象所对应的类，必须是实现Serializable接口
- 创建一个Hero对象，设置其名称为garen。 
  把该对象序列化到一个文件garen.lol。
  然后再通过序列化把该文件转换为一个Hero对象

```java

package charactor;

import java.io.Serializable;

public class Hero implements Serializable {
	//表示这个类当前的版本，如果有了变化，比如新设计了属性，就应该修改这个版本号
	private static final long serialVersionUID = 1L; 
	public String name;
	public float hp;

}

```

```java
package stream;
   
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
 
import charactor.Hero;
   
public class TestStream {
   
    public static void main(String[] args) {
        //创建一个Hero garen
        //要把Hero对象直接保存在文件上，务必让Hero类实现Serializable接口
        Hero h = new Hero();
        h.name = "garen";
        h.hp = 616;
         
        //准备一个文件用于保存该对象
        File f =new File("d:/garen.lol");

        try(
	        //创建对象输出流
	        FileOutputStream fos = new FileOutputStream(f);
	        ObjectOutputStream oos =new ObjectOutputStream(fos);
        	//创建对象输入流        		
            FileInputStream fis = new FileInputStream(f);
            ObjectInputStream ois =new ObjectInputStream(fis);
        ) {
            oos.writeObject(h);
            Hero h2 = (Hero) ois.readObject();
            System.out.println(h2.name);
            System.out.println(h2.hp);
              
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
           
    }
}

```



## system

- System.out 是常用的在控制台输出数据的
- System.in 可以从控制台输入数据

```java
public class ScannerDemo {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        // 从键盘接收数据
 
        // next方式接收字符串
        System.out.println("next方式接收：");
        // 判断是否还有输入
        if (scan.hasNext()) {
            String str1 = scan.next();
            System.out.println("输入的数据为：" + str1);
        }
        scan.close();
    }
}
/*
next方式接收：
runoob com
输入的数据为：runoob
*/
```

```java
public class ScannerDemo {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        // 从键盘接收数据
 
        // nextLine方式接收字符串
        System.out.println("nextLine方式接收：");
        // 判断是否还有输入
        if (scan.hasNextLine()) {
            String str2 = scan.nextLine();
            System.out.println("输入的数据为：" + str2);
        }
        scan.close();
    }
}
/*
nextLine方式接收：
runoob com
输入的数据为：runoob com
*/
```

- next():
  - 1、一定要读取到有效字符后才可以结束输入。
  - 2、对输入有效字符之前遇到的空白，next() 方法会自动将其去掉。
  - 3、只有输入有效字符后才将其后面输入的空白作为分隔符或者结束符。
  - next() 不能得到带有空格的字符串。
- nextLine()：
  - 1、以Enter为结束符,也就是说 nextLine()方法返回的是输入回车之前的所有字符。
  - 2、可以获得空白。
- 在输入之前最好先使用 hasNextXxx() 方法进行验证，再使用 nextXxx() 来读取

```java
public class ScannerDemo {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        // 从键盘接收数据
        int i = 0;
        float f = 0.0f;
        System.out.print("输入整数：");
        if (scan.hasNextInt()) {
            // 判断输入的是否是整数
            i = scan.nextInt();
            // 接收整数
            System.out.println("整数数据：" + i);
        } else {
            // 输入错误的信息
            System.out.println("输入的不是整数！");
        }
        System.out.print("输入小数：");
        if (scan.hasNextFloat()) {
            // 判断输入的是否是小数
            f = scan.nextFloat();
            // 接收小数
            System.out.println("小数数据：" + f);
        } else {
            // 输入错误的信息
            System.out.println("输入的不是小数！");
        }
        scan.close();
    }
}
/*
输入整数：12
整数数据：12
输入小数：1.2
小数数据：1.2
*/
```

```java
class ScannerDemo {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
 
        double sum = 0;
        int m = 0;
 
        while (scan.hasNextDouble()) {
            double x = scan.nextDouble();
            m = m + 1;
            sum = sum + x;
        }
 
        System.out.println(m + "个数的和为" + sum);
        System.out.println(m + "个数的平均值是" + (sum / m));
        scan.close();
    }
}
/*
12
23
15
21.4
end
4个数的和为71.4
4个数的平均值是17.85
*/
```



## 总结

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-6/IO-%E6%93%8D%E4%BD%9C%E6%96%B9%E5%BC%8F%E5%88%86%E7%B1%BB.png)

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-6/IO-%E6%93%8D%E4%BD%9C%E5%AF%B9%E8%B1%A1%E5%88%86%E7%B1%BB.png)

本文参考自：http://how2j.cn


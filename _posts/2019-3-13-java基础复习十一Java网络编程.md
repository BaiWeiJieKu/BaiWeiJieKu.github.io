---
layout: post
title: "java基础复习十一Java网络编程"
categories: java基础
tags: java基础 网络编程
author: 百味皆苦
music-id: 139718
---

* content
{:toc}
## IP

### IP地址

- 在网络中每台计算机都必须有一个的IP地址
- 32位，4个字节，常用点分十进制的格式表示，例如：192.168.1.100 
- 127.0.0.1 是固定ip地址，代表当前计算机，相当于面向对象里的 "this"

### 端口

- 两台计算机进行连接，总有一台服务器，一台客户端。
- ip地址是 192.168.1.100的服务器通过端口 8080，与ip地址是192.168.1.189的客户端 的1087端口通信

![](http://stepimagewm.how2j.cn/881.png)

### 本机IP

```java
package socket;

import java.net.InetAddress;
import java.net.UnknownHostException;

public class TestSocket {

	public static void main(String[] args) throws UnknownHostException {
		InetAddress host = InetAddress.getLocalHost();
		String ip =host.getHostAddress();
		System.out.println("本机ip地址：" + ip);
	}
}

```

### ping

- 使用ping判断一个地址是否能够到达
- ping不是java的api，是windows中的一个小工具，用于判断一个地址的响应时间

![](http://stepimagewm.how2j.cn/2717.png)



## Socket

- 使用 Socket(套接字)进行不同的程序之间的通信

### 建立连接

- 服务端开启8888端口，并监听着，时刻等待着客户端的连接请求
- 客户端知道服务端的ip地址和监听端口号，发出请求到服务端 
- 一旦建立了连接，服务端会得到一个新的Socket对象，该对象负责与客户端进行通信。 
- 在开发调试的过程中，如果修改过了服务器Server代码，要关闭启动的Server,否则新的Server不能启动，因为8888端口被占用了

![](http://stepimagewm.how2j.cn/882.png)

```java
package socket;
 
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
  
public class Server {
  
    public static void main(String[] args)  {
        try {
			//服务端打开端口8888
			ServerSocket ss = new ServerSocket(8888);
			  
			//在8888端口上监听，看是否有连接请求过来
			System.out.println("监听在端口号:8888");
			Socket s =  ss.accept();
			  
			System.out.println("有连接过来" + s);
			
			s.close();
			ss.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
          
    }
}

```

```java

package socket;
 
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
  
public class Client {
  
    public static void main(String[] args)  {
          
        try {
			//连接到本机的8888端口
			Socket s = new Socket("127.0.0.1",8888);
			System.out.println(s);
			s.close();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}

```



### 收发数字

```java

package socket;

import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;
import java.net.UnknownHostException;

public class Client {

	public static void main(String[] args) {

		try {
			Socket s = new Socket("127.0.0.1", 8888);

			// 打开输出流
			OutputStream os = s.getOutputStream();

			// 发送数字110到服务端
			os.write(110);
			os.close();

			s.close();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

```

```java
package socket;

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {

	public static void main(String[] args) {
		try {

			ServerSocket ss = new ServerSocket(8888);

			System.out.println("监听在端口号:8888");
			Socket s = ss.accept();

			//打开输入流
			InputStream is = s.getInputStream();

			//读取客户端发送的数据
			int msg = is.read();
			//打印出来
			System.out.println(msg);
			is.close();

			s.close();
			ss.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}


```



### 收发字符

- 直接使用字节流收发字符串比较麻烦，使用[数据流](http://how2j.cn/k/io/io-datastream/350.html#step771)对字节流进行封装，这样收发字符串就容易了 
- 把输出流封装在DataOutputStream中 
  使用writeUTF发送字符串 "Legendary!" 
- 把输入流封装在DataInputStream 
  使用readUTF读取字符串,并打印

```java
package socket;

import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {

	public static void main(String[] args) {
		try {

			ServerSocket ss = new ServerSocket(8888);

			System.out.println("监听在端口号:8888");
			Socket s = ss.accept();

			InputStream is = s.getInputStream();

			//把输入流封装在DataInputStream
			DataInputStream dis = new DataInputStream(is);
			//使用readUTF读取字符串
			String msg = dis.readUTF();
			System.out.println(msg);
			dis.close();
			s.close();
			ss.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}

```

```java

package socket;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Scanner;

public class Client {

	public static void main(String[] args) {

		try {
			Socket s = new Socket("127.0.0.1", 8888);

			OutputStream os = s.getOutputStream();

			//把输出流封装在DataOutputStream中
			DataOutputStream dos = new DataOutputStream(os);
			//使用writeUTF发送字符串
			dos.writeUTF("Legendary!");
			dos.close();
			s.close();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

```



### Scanner

- 可以使用[Scanner](http://how2j.cn/k/io/io-system-in/352.html#step774)读取控制台的输入，并发送到服务端，这样每次都可以发送不同的数据了。

```java
package socket;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Scanner;

public class Client {

	public static void main(String[] args) {

		try {
			Socket s = new Socket("127.0.0.1", 8888);

			OutputStream os = s.getOutputStream();
	        DataOutputStream dos = new DataOutputStream(os);
	        
	        //使用Scanner读取控制台的输入，并发送到服务端
	        Scanner sc = new Scanner(System.in);
	        
	        String str = sc.next();
	        dos.writeUTF(str);
	        
			dos.close();
			s.close();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

```



## 多线程

- 如果使用单线程开发Socket应用，那么同一时间，要么收消息，要么发消息，不能同时进行。 
- 为了实现同时收发消息，就需要用到多线程
- 为了实现同时收发消息，基本设计思路是把收发分别放在不同的线程中进行
- SendThread 发送消息线程
- RecieveThread 接受消息线程
- Server一旦接受到连接，就启动收发两个线程
- Client 一旦建立了连接，就启动收发两个线程

```java
package socket;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;
import java.util.Scanner;

public class SendThread extends Thread{

	private Socket s;

	public SendThread(Socket s){
		this.s = s;
	}
	public void run(){
		try {
			OutputStream os = s.getOutputStream();
			DataOutputStream dos = new DataOutputStream(os);

			while(true){
			    Scanner sc = new Scanner(System.in);
			    String str = sc.next();
			    dos.writeUTF(str);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
}


```

```java

package socket;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.Scanner;

public class RecieveThread extends Thread {

	private Socket s;

	public RecieveThread(Socket s) {
		this.s = s;
	}

	public void run() {
		try {
			InputStream is = s.getInputStream();

			DataInputStream dis = new DataInputStream(is);
			while (true) {
				String msg = dis.readUTF();
				System.out.println(msg);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}


```

```java

package socket;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {

	public static void main(String[] args) {
		try {

			ServerSocket ss = new ServerSocket(8888);

			System.out.println("监听在端口号:8888");
			Socket s = ss.accept();

			//启动发送消息线程
			new SendThread(s).start();
			//启动接受消息线程
			new RecieveThread(s).start();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}

```

```java

package socket;

import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

public class Client {

	public static void main(String[] args) {

		try {
			Socket s = new Socket("127.0.0.1", 8888);

			// 启动发送消息线程
			new SendThread(s).start();
			// 启动接受消息线程
			new RecieveThread(s).start();

		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

```

本文章参考自：http://how2j.cn
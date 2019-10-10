---
layout: post
title: "Linux复习shell脚本"
categories: Linux
tags: Linux shell脚本
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
## 概念

```
1)	Linux 运维工程师在进行服务器集群管理时，需要编写Shell 程序来进行服务器管理。
2)	对于JavaEE 和Python 程序员来说，工作的需要，你的老大会要求你编写一些Shell 脚本进行程序或者是服务器		的维护，比如编写一个定时备份数据库的脚本。
3)对于大数据程序员来说，需要编写Shell 程序来管理集群。
```

```
Shell 是一个命令行解释器，它为用户提供了一个向Linux 内核发送请求以便运行程序的界面系统级程序，用户可以用Shell 来启动、挂起、停止甚至是编写一些程序.
```

## 执行方式

### 格式要求

```
1) 脚本以#!/bin/bash 开头
2) 脚本需要有可执行权限
```

```
创建一个Shell 脚本，输出hello world!
vim myshell.sh

#!/bin/bash
echo "hello world!"
```

### 执行方式

```
方式1(输入脚本的绝对路径或相对路径)
1)	首先要赋予helloworld.sh 脚本的+x 权限
2)	执行脚本

方式2(sh+脚本)，不推荐
	说明：不用赋予脚本+x 权限，直接执行即可
```

```
chmod 744 myshell.sh
./myshell.sh 相对路径
/root/shell/myshell.sh  绝对路径
```



## shell变量

```
1）	Linux Shell 中的变量分为，系统变量和用户自定义变量。
2）	系统变量：$HOME、$PWD、$SHELL、$USER 等等
3）显示当前shell 中所有变量：set
```

```
#!/bin/bash
echo "PASH=$PASH"
echo "user=$USER"
```

### 定义

```
基本语法
	1)	定义变量：变量=值
    2)	撤销变量：unset 变量
    3)	声明静态变量：readonly 变量，注意：不能unset
规则
	1)	变量名称可以由字母、数字和下划线组成，但是不能以数字开头。
    2)	等号两侧不能有空格
    3)	变量名称一般习惯为大写
```

```
案例1：定义变量A,撤销变量A

#!/bin/bash
A=100
echo "A=$A"

unset A
echo "A=$A"
```

```
案例3：声明静态的变量A=99，不能unset

#!/bin/bash
readonly A=99
echo "A=$A"
unset A
echo "A=$A"
```

- 将命令的返回值赋给变量（重点）

```
1）	A=`ls -la` 反引号，运行里面的命令，并把结果返回给变量A
2）	A=$(ls -la) 等价于反引号
```

```
#!/bin/bash
RESULT=`ls -l /home`
echo "$RESULT"

MY_DATE=$(date)
echo "date=$MY_DATE"
```

## 环境变量

```
基本语法
	1) export 变量名=变量值 （功能描述：将shell 变量输出为环境变量）
	2) source 配置文件 （功能描述：让修改后的配置信息立即生效）
	3) echo $变量名 （功能描述：查询环境变量的值）
```

```
为了让/etc/profile的环境变量生效，
需要使用
source /etc/profile
重启系统或注销用户
```

```
1) 在/etc/profile 文件中定义TOMCAT_HOME 环境变量

TOMCAT_HOME=/opt/tomcat
export TOMCAT_HOME
```

```
2) 查看环境变量TOMCAT_HOME 的值

echo $TOMCAT_HOME
```

```
3) 在另外一个shell 程序中使用 TOMCAT_HOME
注意：在输出TOMCAT_HOME 环境变量前，需要让其生效source /etc/profile

#!/bin/bash
echo "tomcathome=$TOMCAT_HOME"
```



## 位置参数

```
当我们执行一个 shell 脚本时，如果希望获取到命令行的参数信息，就可以使用到位置参数变量，比如 ： ./myshell.sh 100 200 , 这个就是一个执行 shell 的命令行，可以在myshell 脚本中获取到参数信息
```

```
基本语法
	$n （功能描述：n 为数字，$0 代表命令本身，$1-$9 代表第一到第九个参数，十以上的参数，十以上的参数需要		用大括号包含，如${10}）
	$* （功能描述：这个变量代表命令行中所有的参数，$*把所有的参数看成一个整体）
	$@（功能描述：这个变量也代表命令行中所有的参数，不过$@把每个参数区分对待）
	$#（功能描述：这个变量代表命令行中所有参数的个数）
```

```
案例：编写一个shell 脚本 positionPara.sh ， 在脚本中获取到命令行的各个参数信息

#!/bin/bash
echo "$0 $1 $2"
echo "$*"
echo "$@"
echo "参数个数=$#"
```



## 预定义变量

```
就是shell 设计者事先已经定义好的变量，可以直接在shell 脚本中使用
```

```
基本语法
	$$ （功能描述：当前进程的进程号（PID））
	$! （功能描述：后台运行的最后一个进程的进程号（PID））
	$？（功能描述：最后一次执行的命令的返回状态。如果这个变量的值为0，证明上一个命令正确执行；如果这个变量		的值为非 0（具体是哪个数，由命令自己来决定），则证明上一个命令执行不正确了。）
```

```
在一个shell 脚本中简单使用一下预定义变量

#!/bin/bash
echo "当前的进程号=$$"
#后台的方式运行 myshell.sh
./myshell.sh &
echo "最后的进程号=$!"
echo "执行的值=$?"
```

## 运算符

```
基本语法
	1) “$((运算式))”或“$[运算式]”
	2) expr m + n (注意expr 运算符间要有空格)
	3)	expr m - n
	4) expr \*, /, % (乘，除，取余)
```

```
案例1：计算（2+3）X4 的值

#!/bin/bash
#第一种方式$()

RESULT1=$(((2+3)*4))
echo "result1=$RESULT1"

#第二种方式

RESULT2=$[(2+3)*4]
echo "result2=$RESULT2"

#第三种方式expr

TEMP=`expr 2 + 3`
RESULT3=`expr $TEMP \* 4`
echo "result3=$RESULT3"
```

```
案例2：请求出命令行的两个参数[整数]的和

#!/bin/bash
SUM=$[$1+$2]
echo "sum=$SUM"
```



## 条件判断

```
基本语法
	[ condition ]（注意condition 前后要有空格）#非空返回true，可使用$?验证（0 为true，>1 为false）

```

```
[ atguigu ] 返回true
[] 返回false
[condition] && echo OK || echo notok 条件满足，执行后面的语句
```

```
常用判断条件
1)两个整数的比较
	= 字符串比较
	-lt 小于
	-le 小于等于
	-eq 等于
	-gt 大于
	-ge 大于等于
	-ne 不等于
2) 按照文件权限进行判断
	-r 有读的权限 [ -r 文件 ]
    -w 有写的权限
    -x 有执行的权限
3)按照文件类型进行判断
	-f 文件存在并且是一个常规的文件
    -e 文件存在
    -d 文件存在并是一个目录
```

```
#!/bin/bash

#案例1："ok"是否等于"ok"

if [ "ok100" = "ok" ]
then
	echo "equal"
fi

#案例2：23是否大于22

if [ 23 -gt 22 ]
then
	echo "大于"
fi 

#案例3：/root/shell/aaa.txt 目录中的文件是否存在
if [ -e /root/shell/aaa.txt ]
then
	echo "存在 "
fi
```



## 流程控制

### if

```
基本语法
	if [ 条件判断式 ];then
	程序
	fi
	
	if [ 条件判断式 ]
		then
			程序
		elif [条件判断式]
		then
			程序
	fi
	
注意事项：（1）[ 条件判断式 ]，中括号和条件判断式之间必须有空格 (2) 推荐使用第二种方式
```

```
案例：请编写一个 shell 程序，如果输入的参数，大于等于 60，则输出 "及格了"，如果小于 60,则输出 "不及格"

#!/bin/bash
f [ $1 -ge 60 ]
then
	echo "及格了"
elif [ $1 -lt 60 ]
then
	echo "不及格"
fi
```

### case

```
case $变量名 in
"值1"）
	如果变量的值等于值1，则执行程序1 
	;;
"值2"）
	如果变量的值等于值2，则执行程序2
	;;
…省略其他分支…
*）如果变量的值都不是以上的值，则执行此程序
;;
esac
```

```
#!/bin/bash

#案例1 ：当命令行参数是 1 时，输出 "周一", 是2 时，就输出"周二"， 其它情况输出  "other"
case $1 in
"1")
echo "周一"
;;
"2")
echo "周二"
;;
*)
echo "other"
;;
esac
```

### for

```
for 变量 in 值1 值2 值3…
do
	程序
done
```

```
#!/bin/bash
#案例1 ：打印命令行输入的参数

#使用 $*
for i in "$*"
do
	echo "the num is $i"
done
echo "==============================="
#使用 $@
for j in "$@"
do
	echo "the num is $j"
done

```

```
for (( 初始值;循环控制条件;变量变化 ))
do
	程序
done
```

```
#!/bin/bash

#案例1 ：从1加到100的值输出显示 

#定义一个变量
SUM=0
for((i=1;i<=100;i++))
do
	SUM=$[$SUM+$i]	
done
echo "sum=$SUM"
```

### while

```
while [ 条件判断式 ]
do
	程序
done
```

```
#!/bin/bash

#案例1 ：从命令行输入一个数n，统计从 1+..+ n 的值是多少

SUM=0
i=0
while [ $i -le $1 ]
do
	SUM=$[$SUM+$i]
	i=$[$i+1]
done
echo "sum= $SUM"
```

### read

```
read(选项)(参数)
选项：
	-p：指定读取值时的提示符；
	-t：指定读取值时等待的时间（秒），如果没有在指定的时间内输入，就不再等待了。。
```

```
#!/bin/bash

#案例1：读取控制台输入一个num值

read -p "请输入一个数num1=" NUM1
echo "你输入的值是num1=$NUM1"

#案例2：读取控制台输入一个num值，在10秒内输入

read -t 10 -p "请输入一个数num2=" NUM2
echo "你输入的值是num2=$NUM2"
```

## 函数

```
hell 编程和其它编程语言一样，有系统函数，也可以自定义函数。系统函数中，我们这里就介绍两个。
```

### 系统函数

```
basename 基本语法
功能：返回完整路径最后 / 的部分，常用于获取文件名
basename [pathname] [suffix]
```

```
basename [string] [suffix]
（功能描述：basename 命令会删掉所有的前缀包括最后一个（‘/’）字符，然后将字符串显示出来。

选项：
suffix 为后缀，如果suffix 被指定了，basename 会将pathname 或string 中的suffix 去掉。
```

```
dirname 基本语法
功能：返回完整路径最后 / 的前面的部分，常用于返回路径部分
dirname 文件绝对路径 （功能描述：从给定的包含绝对路径的文件名中去除文件名（非目录的部分），然后返回剩下的路径（目录的部分））
```

```
案例1：请返回 /home/aaa/test.txt 的 "test.txt" 部分

bash>basename /home/aaa/test.txt
test.txt
bash>basename /home/aaa/test.txt .txt
test
```

```
案例2：请返回 /home/aaa/test.txt 的 /home/aaa

bash>dirname /home/aaa/test.txt
/home/aaa
bash>dirname /home/aaa/ccc/jj/ooo/test.txt
/home/aaa/ccc/jj/ooo
```



### 自定义

```
[ function ] funname[()]
{
	Action;
	[return int;]
}
```

```
调用直接写函数名：funname [值]
```

```
#!/bin/bash

#案例1：计算输入两个参数的和（read）， getSum

function getSum(){
	
	SUM=$[$n1+$n2]
	echo "和是=$SUM"
}

read -p "请输入第一个数n1" n1
read -p "请输入第二个数n2" n2

#调用getSum
getSum $n1 $n2
```



## 综合训练

```
1)	每天凌晨 2:10 备份 数据库 atguiguDB 到 /data/backup/db
2)	备份开始和备份结束能够给出相应的提示信息
3)	备份后的文件要求以备份时间为文件名，并打包成 .tar.gz 的形式，比如：2018-03-12_230201.tar.gz
4) 在备份的同时，检查是否有10 天前备份的数据库文件，如果有就将其删除。
```

```
#!/bin/bash

#完成数据库的定时备份。
#备份的路径
BACKUP=/data/backup/db
#当前的时间作为文件名
DATETIME=$(date +%Y_%m_%d_%H%M%S)
#可以输出变量调试
#echo ${DATETIME}

echo "=======开始备份========"
echo "=======备份的路径是 $BACKUP/$DATETIME.tar.gz"

#主机
HOST=localhost
#用户名
DB_USER=root
#密码
DB_PWD=root
#备份数据库名
DATABASE=atguiguDB
#创建备份的路径
#如果备份的路径文件夹存在，就使用，否则就创建
[ ! -d "$BACKUP/$DATETIME" ] && mkdir -p "$BACKUP/$DATETIME"
#执行mysql的备份数据库的指令
mysqldump -u${DB_USER} -p${DB_PWD} --host=$HOST  $DATABASE | gzip > $BACKUP/$DATETIME/$DATETIME.sql.gz
#打包备份文件
cd $BACKUP
tar -zcvf $DATETIME.tar.gz $DATETIME
#删除临时目录
rm -rf $BACKUP/$DATETIME

#删除10天前的备份文件
find $BACKUP -mtime +10 -name "*.tar.gz" -exec rm -rf {} \;
echo "=====备份文件成功==========="
```

```
在crontab中配置

10 2 * * * /usr/sbin/mysql_db_backup.sh
```


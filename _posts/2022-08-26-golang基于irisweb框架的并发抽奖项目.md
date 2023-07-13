---
layout: post
title: "基于iris的并发抽奖项目"
categories: golang基础
tags: golang
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}
## 框架介绍

六个go语言框架分析：https://blog.csdn.net/dev_csdn/article/details/78740990



## iris框架

路由规则

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202307131426276.png)





格式化参数

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202307131427706.png)



子域名

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202307131428849.png)



hello world

```go
package main

import (
	"github.com/kataras/iris"
)

func main() {
	app := iris.New()
	//app.Use(logger.New())

	htmlEngine := iris.HTML("./", ".html")
	//htmlEngine.Reload(false)
	app.RegisterView(htmlEngine)

	app.Get("/", func(ctx iris.Context) {
		ctx.WriteString("Hello world! -- from iris.")
	})

	app.Get("/hello", func(ctx iris.Context) {
		ctx.ViewData("Title", "测试页面")
		ctx.ViewData("Content", "Hello world! -- from template")
		ctx.View("hello.html")
	})

	app.Run(iris.Addr(":8080"), iris.WithCharset("UTF-8"))
}
```



Hello.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{.Title}}</title>
</head>
<body>
{{.Content}}
</body>
</html>
```



### MVC

目录结构





## xorm框架

数据库映射模型model工具cmd



示例

```go
/**
 * 应用程序
 * 同目录下多文件引用的问题解决方法：
 * https://blog.csdn.net/pingD/article/details/79143235
 * 方法1 1 go build ./ 2 运行编译后的文件
 * 方法2 go run *.go
 */
package main

import (
	"log"
	"fmt"

	"github.com/go-xorm/xorm"
	_ "github.com/go-sql-driver/mysql"
	"time"
)

const DriverName = "mysql"
const MasterDataSourceName = "root:root@tcp(127.0.0.1:3306)/superstar?charset=utf8"

/**
CREATE TABLE `user_info` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '中文名',
  `sys_created` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `sys_updated` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最后修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 */
 type UserInfo struct {
	Id           int 	`xorm:"not null pk autoincr"`
	Name         string
	SysCreated   int
	SysUpdated   int
}

var engine *xorm.Engine

func main() {
	engine = newEngin()

	//execute()
	//ormInsert()
	//query()
	//ormGet()
	//ormGetCols()
	//ormCount()
	ormFindRows()
	//ormUpdate()
	//ormOmitUpdate()
	//ormMustColsUpdate()

}

// 连接到数据库
func newEngin() *xorm.Engine {
	engine, err := xorm.NewEngine(DriverName, MasterDataSourceName)
	if err != nil {
		log.Fatal(newEngin, err)
		return nil
	}
	// Debug模式，打印全部的SQL语句，帮助对比，看ORM与SQL执行的对照关系
	engine.ShowSQL(true)
	return engine
}

// 通过query方法查询
func query() {
	sql := "SELECT * FROM user_info"
	//results, err := engine.Query(sql)
	//results, err := engine.QueryInterface(sql)
	results, err := engine.QueryString(sql)
	if err != nil {
		log.Fatal("query", sql, err)
		return
	}
	total := len(results)
	if total == 0 {
		fmt.Println("没有任何数据", sql)
	} else {
		for i, data := range results {
			fmt.Printf("%d = %v\n", i, data)
		}
	}
}

// 通过execute方法执行更新
func execute() {
	sql := `INSERT INTO user_info values(NULL, 'name', 0, 0)`
	affected, err := engine.Exec(sql)
	if err != nil {
		log.Fatal("execute error", err)
	} else {
		id, _ := affected.LastInsertId()
		rows, _ := affected.RowsAffected()
		fmt.Println("execute id=", id, ", rows=", rows)
	}
}

// 根据models的结构映射数据表
func ormInsert() {
	UserInfo := &UserInfo{
		Id:           0,
		Name:         "梅西",
		SysCreated:   0,
		SysUpdated:   0,
	}
	id, err := engine.Insert(UserInfo)
	if err != nil {
		log.Fatal("ormInsert error", err)
	} else {
		fmt.Println("ormInsert id=", id)
		fmt.Printf("%v\n", *UserInfo)
	}
}

// 根据models的结构读取数据
func ormGet() {
	UserInfo := &UserInfo{Id:2}
	ok, err := engine.Get(UserInfo)
	if ok {
		fmt.Printf("%v\n", *UserInfo)
	} else if err != nil {
		log.Fatal("ormGet error", err)
	} else {
		fmt.Println("orgGet empty id=", UserInfo.Id)
	}
}

// 获取指定的字段
func ormGetCols() {
	UserInfo := &UserInfo{Id:2}
	ok, err := engine.Cols("name").Get(UserInfo)
	if ok {
		fmt.Printf("%v\n", UserInfo)
	} else if err != nil {
		log.Fatal("ormGetCols error", err)
	} else {
		fmt.Println("ormGetCols empty id=2")
	}
}

// 统计
func ormCount() {
	//count, err := engine.Count(&UserInfo{})
	//count, err := engine.Where("name_zh=?", "梅西").Count(&UserInfo{})
	count, err := engine.Count(&UserInfo{Name:"梅西"})
	if err == nil {
		fmt.Printf("count=%v\n", count)
	} else {
		log.Fatal("ormCount error", err)
	}
}

// 查找多行数据
func ormFindRows() {
	list := make([]UserInfo, 0)
	//list := make(map[int]UserInfo)
	//err := engine.Find(&list)
	//err := engine.Where("id>?", 1).Limit(100, 0).Find(&list)
	err := engine.Cols("id", "name").Where("id>?", 0).
		Limit(10).Asc("id", "sys_created").Find(&list)

	//list := make([]map[string]string, 0)
	//err := engine.Table("star_info").Cols("id", "name_zh", "name_en").
	// Where("id>?", 1).Find(&list)

	if err == nil {
		fmt.Printf("%v\n", list)
	} else {
		log.Fatal("ormFindRows error", err)
	}
}

// 更新一个数据
func ormUpdate() {
	// 全部更新
	//UserInfo := &UserInfo{NameZh:"测试名"}
	//ok, err := engine.Update(UserInfo)
	// 指定ID更新
	UserInfo := &UserInfo{Name:"梅西"}
	ok, err := engine.ID(2).Update(UserInfo)
	fmt.Println(ok, err)
}

// 排除某字段
func ormOmitUpdate() {
	info := &UserInfo{Id:1}
	ok, _ := engine.Get(info)
	if ok {
		if info.SysCreated > 0 {
			ok, _ := engine.ID(info.Id).Omit("sys_created").
				Update(&UserInfo{SysCreated:0,
				SysUpdated:int(time.Now().Unix())})
			fmt.Printf("ormOmitUpdate, rows=%d, " +
				"sys_created=%d\n", ok, 0)
		} else {
			ok, _ := engine.ID(info.Id).Omit("sys_created").
				Update(&UserInfo{SysCreated:1,
				SysUpdated:int(time.Now().Unix())})
			fmt.Printf("ormOmitUpdate, rows=%d, " +
				"sys_created=%d\n", ok, 0)
		}
	}
}

// 字段为空也可以更新（0, 空字符串等）
func ormMustColsUpdate() {
	info := &UserInfo{Id:1}
	ok, _ := engine.Get(info)
	if ok {
		if info.SysCreated > 0 {
			ok, _ := engine.ID(info.Id).
				MustCols("sys_created").
				Update(&UserInfo{SysCreated:0,
				SysUpdated:int(time.Now().Unix())})
			fmt.Printf("ormMustColsUpdate, rows=%d, " +
				"sys_created=%d\n",
				ok, 0)
		} else {
			ok, _ := engine.ID(info.Id).
				MustCols("sys_created").
				Update(&UserInfo{SysCreated:1,
				SysUpdated:int(time.Now().Unix())})
			fmt.Printf("ormMustColsUpdate, rows=%d, " +
				"sys_created=%d\n",
				ok, 0)
		}
	}
}
```




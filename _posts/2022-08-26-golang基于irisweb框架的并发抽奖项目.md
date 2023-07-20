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



## 年会抽奖项目

需求：

1：导入公司员工，每次随机抽取一个中奖员工

2：有一等奖，二等奖，也有领导临时增加的奖品

3：不涉及并发，但是要考虑并发安全问题



抽奖程序

```go
/**
 * 年会抽奖程序
 * 增加了互斥锁，线程安全
 * 基础功能：
 * 1 /import 导入参与名单作为抽奖的用户
 * 2 /lucky 从名单中随机抽取用户
 * 测试方法：
 * curl http://localhost:8080/
 * curl --data "users=yifan,yifan2" http://localhost:8080/import
 * curl http://localhost:8080/lucky
 */

package main

import (
	"fmt"
	"math/rand"
	"strings"
	"sync"
	"time"

	"github.com/kataras/iris"
	"github.com/kataras/iris/mvc"
)

var userList []string

//互斥锁
var mu sync.Mutex

func newApp() *iris.Application {
	app := iris.New()
	mvc.New(app.Party("/")).Handle(&lotteryController{})
	return app
}

func main() {
	app := newApp()

  //初始化资源
	userList = make([]string, 0)
	mu = sync.Mutex{}

	// http://localhost:8080
	app.Run(iris.Addr(":8080"))
}

// 抽奖的控制器
type lotteryController struct {
	Ctx iris.Context
}

// GET http://localhost:8080/
func (c *lotteryController) Get() string {
	count := len(userList)
	return fmt.Sprintf("当前总共参与抽奖的用户数: %d\n", count)
}

// POST http://localhost:8080/import
func (c *lotteryController) PostImport() string {
	strUsers := c.Ctx.FormValue("users")
	users := strings.Split(strUsers, ",")
	mu.Lock()
	defer mu.Unlock()
	count1 := len(userList)
	for _, u := range users {
		u = strings.TrimSpace(u)
		if len(u) > 0 {
			// 导入用户
			userList = append(userList, u)
		}
	}
	count2 := len(userList)
	return fmt.Sprintf("当前总共参与抽奖的用户数: %d，成功导入用户数: %d\n", count2, (count2 - count1))
}

// GET http://localhost:8080/lucky
func (c *lotteryController) GetLucky() string {
	mu.Lock()
	defer mu.Unlock()
	count := len(userList)
	if count > 1 {
		seed := time.Now().UnixNano()                                // rand内部运算的随机数
		index := rand.New(rand.NewSource(seed)).Int31n(int32(count)) // rand计算得到的随机数
		user := userList[index]                                      // 抽取到一个用户
		userList = append(userList[0:index], userList[index+1:]...)  // 移除这个用户
		return fmt.Sprintf("当前中奖用户: %s, 剩余用户数: %d\n", user, count-1)
	} else if count == 1 {
		user := userList[0]
		userList = userList[0:0]
		return fmt.Sprintf("当前中奖用户: %s, 剩余用户数: %d\n", user, count-1)
	} else {
		return fmt.Sprintf("已经没有参与用户，请先通过 /import 导入用户 \n")
	}

}
```



验证测试

```go
/**
 * 线程是否安全的测试
 * 有互斥锁的情况下，线程安全
 * go test -v
 */
package main

import (
	"fmt"
	"sync"
	"testing"

	"github.com/kataras/iris/httptest"
)

func TestMVC(t *testing.T) {
	e := httptest.New(t, newApp())

	var wg sync.WaitGroup
	e.GET("/").Expect().Status(httptest.StatusOK).
		Body().Equal("当前总共参与抽奖的用户数: 0\n")

	// 启动100个协程并发来执行用户导入操作
	// 如果是线程安全的时候，预期倒入成功100个用户
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			e.POST("/import").WithFormField("users", fmt.Sprintf("test_u%d", i)).Expect().Status(httptest.StatusOK)
		}(i)
	}

	wg.Wait()

	e.GET("/").Expect().Status(httptest.StatusOK).
		Body().Equal("当前总共参与抽奖的用户数: 100\n")
	e.GET("/lucky").Expect().Status(httptest.StatusOK)
	e.GET("/").Expect().Status(httptest.StatusOK).
		Body().Equal("当前总共参与抽奖的用户数: 99\n")
}
```





## 彩票刮奖

彩票和双色球

```go
/**
 * 彩票
 * 1 即刮即得型（已知中奖规则，随机获取号码来匹配是否中奖）
 * 得到随机数： http://localhost:8080/
 *
 * 2 双色球自选型（从已知可选号码中选择每一个位置的号码，等待开奖结果）
 * 开奖号码： http://localhost:8080/prize
 * 规则参考： https://cp..cn/kj/ssq.html?agent=700007
 */
package main

import (
	"github.com/kataras/iris"
	"github.com/kataras/iris/mvc"
	"fmt"
	"time"
	"math/rand"
)

func newApp() *iris.Application {
	app := iris.New()
	mvc.New(app.Party("/")).Handle(&lotteryController{})
	return app
}

func main() {
	app := newApp()
	// http://localhost:8080
	app.Run(iris.Addr(":8080"))
}

// 抽奖的控制器
type lotteryController struct {
	Ctx iris.Context
}

// 即开即得 GET http://localhost:8080/
func (c *lotteryController) Get() string {
	c.Ctx.Header("Content-Type", "text/html")
	seed := time.Now().UnixNano()					// rand内部运算的随机数
	code := rand.New(rand.NewSource(seed)).Intn(10) 	// rand计算得到的随机数
	var prize string
	switch {
	case code == 1:
		prize = "一等奖"
	case code >=2 && code <= 3:
		prize = "二等奖"
	case code >= 4 && code <= 6:
		prize = "三等奖"
	default:
		return fmt.Sprintf("尾号为1获得一等奖<br/>" +
			"尾号为2或者3获得二等奖<br/>" +
			"尾号为4/5/6获得三等奖<br/>" +
			"code=%d<br/>" +
			"很遗憾，没有获奖", code)
	}
	return fmt.Sprintf("尾号为1获得一等奖<br/>" +
		"尾号2或者3获得二等奖<br/>" +
		"尾号4/5/6获得三等奖<br/>" +
		"code=%d<br/>" +
		"恭喜你获得:%s", code, prize)
}

// 定时开奖 GET http://localhost:8080/prize
func (c *lotteryController) GetPrize() string {
	c.Ctx.Header("Content-Type", "text/html")
	seed := time.Now().UnixNano()
	r := rand.New(rand.NewSource(seed))
	var prize  [7]int
	// 红色球，1-33
	for i:=0; i < 6; i++ {
		prize[i] = r.Intn(33)+1
	}
	// 最后一位的蓝色球，1-16
	prize[6] = r.Intn(16)+1
	return fmt.Sprintf("今日开奖号码是： %v", prize)
}
```



## 微信抽奖

奖品分等级，数量，概率

```go
/**
 * 微信摇一摇
 * 增加互斥锁，保证并发更新数据的安全
 * 基础功能：
 * /lucky 只有一个抽奖的接口，奖品信息都是预先配置好的
 * 测试方法：
 * curl http://localhost:8080/
 * curl http://localhost:8080/lucky
 * 压力测试：（线程不安全的时候，总的中奖纪录会超过总的奖品数）
 * wrk -t10 -c10 -d5 http://localhost:8080/lucky
 */

package main

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/kataras/iris"
	"github.com/kataras/iris/mvc"
	"sync"
)

// 奖品类型，枚举 iota 从0开始自增
const (
	giftTypeCoin      = iota // 虚拟币
	giftTypeCoupon           // 优惠券，不相同的编码
	giftTypeCouponFix        // 优惠券，相同的编码
	giftTypeRealSmall        // 实物小奖
	giftTypeRealLarge        // 实物大奖
)

// 最大号码
const rateMax = 10000

// 奖品信息
type gift struct {
	id       int      // 奖品ID
	name     string   // 奖品名称
	pic      string   // 照片链接
	link     string   // 链接
	gtype    int      // 奖品类型
	data     string   // 奖品的数据（特定的配置信息，如：虚拟币面值，固定优惠券的编码）
	datalist []string // 奖品数据集合（特定的配置信息，如：不同的优惠券的编码）
	total    int      // 总数，0 不限量
	left     int      // 剩余数
	inuse    bool     // 是否使用中
	rate     int      // 中奖概率，万分之N,0-10000
	rateMin  int      // 大于等于，中奖的最小号码,0-10000
	rateMax  int      // 小于，中奖的最大号码,0-10000
}

// 文件日志
var logger *log.Logger

// 奖品列表
var giftlist []*gift
var mu sync.Mutex

func main() {
	app := newApp()

	// http://localhost:8080
	app.Run(iris.Addr(":8080"))
}

// 初始化奖品列表信息（管理后台来维护）
func initGift() {
	giftlist = make([]*gift, 5)
	// 1 实物大奖
	g1 := gift{
		id:      1,
		name:    "手机N7",
		pic:     "",
		link:    "",
		gtype:   giftTypeRealLarge,
		data:    "",
		total:   1000,
		left:    1000,
		inuse:   true,
		rate:    10000,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[0] = &g1
	// 2 实物小奖
	g2 := gift{
		id:      2,
		name:    "安全充电 黑色",
		pic:     "",
		link:    "",
		gtype:   giftTypeRealSmall,
		data:    "",
		total:   5,
		left:    5,
		inuse:   true,
		rate:    100,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[1] = &g2
	// 3 虚拟券，相同的编码
	g3 := gift{
		id:      3,
		name:    "商城满2000元减50元优惠券",
		pic:     "",
		link:    "",
		gtype:   giftTypeCouponFix,
		data:    "mall-coupon-2018",
		total:   5,
		left:    5,
		rate:    5000,
		inuse:   true,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[2] = &g3
	// 4 虚拟券，不相同的编码
	g4 := gift{
		id:       4,
		name:     "商城无门槛直降50元优惠券",
		pic:      "",
		link:     "",
		gtype:    giftTypeCoupon,
		data:     "",
		datalist: []string{"c01", "c02", "c03", "c04", "c05"},
		total:    5,
		left:     5,
		inuse:    true,
		rate:     2000,
		rateMin:  0,
		rateMax:  0,
	}
	giftlist[3] = &g4
	// 5 虚拟币
	g5 := gift{
		id:      5,
		name:    "社区10个金币",
		pic:     "",
		link:    "",
		gtype:   giftTypeCoin,
		data:    "10",
		total:   5,
		left:    5,
		inuse:   true,
		rate:    5000,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[4] = &g5

	// 整理奖品数据，把rateMin,rateMax根据rate进行编排
	rateStart := 0
	for _, data := range giftlist {
		if !data.inuse {
			continue
		}
		data.rateMin = rateStart
		data.rateMax = data.rateMin + data.rate
		if data.rateMax >= rateMax {
			// 号码达到最大值，分配的范围重头再来
			data.rateMax = rateMax
			rateStart = 0
		} else {
			rateStart += data.rate
		}
	}
	fmt.Printf("giftlist=%v\n", giftlist)
}

// 初始化日志信息
func initLog() {
	f, _ := os.Create("/var/log/lottery_demo.log")
	logger = log.New(f, "", log.Ldate|log.Lmicroseconds)
}

func newApp() *iris.Application {
	app := iris.New()
	mvc.New(app.Party("/")).Handle(&lotteryController{})
	// 初始化日志信息
	initLog()
	// 初始化奖品信息
	initGift()
	return app
}

// 抽奖的控制器
type lotteryController struct {
	Ctx iris.Context
}

// GET http://localhost:8080/
func (c *lotteryController) Get() string {
	count := 0
	total := 0
	for _, data := range giftlist {
		if data.inuse && (data.total == 0 ||
			(data.total > 0 && data.left > 0)) {
			count++
			total += data.left
		}
	}
	return fmt.Sprintf("当前有效奖品种类数量: %d，限量奖品总数量=%d\n", count, total)
}

// GET http://localhost:8080/lucky
func (c *lotteryController) GetLucky() map[string]interface{} {
	mu.Lock()
	defer mu.Unlock()

	code := luckyCode()
	ok := false
	result := make(map[string]interface{})
	result["success"] = ok
	for _, data := range giftlist {
		if !data.inuse || (data.total > 0 && data.left <= 0) {
			continue
		}
		if data.rateMin <= int(code) && data.rateMax > int(code) {
			// 中奖了，抽奖编码在奖品中奖编码范围内
			sendData := ""
			switch data.gtype {
			case giftTypeCoin:
				ok, sendData = sendCoin(data)
			case giftTypeCoupon:
				ok, sendData = sendCoupon(data)
			case giftTypeCouponFix:
				ok, sendData = sendCouponFix(data)
			case giftTypeRealSmall:
				ok, sendData = sendRealSmall(data)
			case giftTypeRealLarge:
				ok, sendData = sendRealLarge(data)
			}
			if ok {
				// 中奖后，成功得到奖品（发奖成功）
				// 生成中奖纪录
				saveLuckyData(code, data.id, data.name, data.link, sendData, data.left)
				result["success"] = ok
				result["id"] = data.id
				result["name"] = data.name
				result["link"] = data.link
				result["data"] = sendData
				break
			}
		}
	}

	return result
}

// 抽奖编码
func luckyCode() int32 {
	seed := time.Now().UnixNano()                                 // rand内部运算的随机数
	code := rand.New(rand.NewSource(seed)).Int31n(int32(rateMax)) // rand计算得到的随机数
	return code
}

// 发奖，虚拟币
func sendCoin(data *gift) (bool, string) {
	if data.total == 0 {
		// 数量无限
		return true, data.data
	} else if data.left > 0 {
		// 还有剩余
		data.left = data.left - 1
		return true, data.data
	} else {
		return false, "奖品已发完"
	}
}

// 发奖，优惠券（不同值）
func sendCoupon(data *gift) (bool, string) {
	if data.left > 0 {
		// 还有剩余的奖品
		left := data.left - 1
		data.left = left
		return true, data.datalist[left]
	} else {
		return false, "奖品已发完"
	}
}

// 发奖，优惠券（固定值）
func sendCouponFix(data *gift) (bool, string) {
	if data.total == 0 {
		// 数量无限
		return true, data.data
	} else if data.left > 0 {
		data.left = data.left - 1
		return true, data.data
	} else {
		return false, "奖品已发完"
	}
}

// 发奖，实物小
func sendRealSmall(data *gift) (bool, string) {
	if data.total == 0 {
		// 数量无限
		return true, data.data
	} else if data.left > 0 {
		data.left = data.left - 1
		return true, data.data
	} else {
		return false, "奖品已发完"
	}
}

// 发奖，实物大
func sendRealLarge(data *gift) (bool, string) {
	if data.total == 0 {
		// 数量无限
		return true, data.data
	} else if data.left > 0 {
		data.left--
		return true, data.data
	} else {
		return false, "奖品已发完"
	}
}

// 记录用户的获奖记录
func saveLuckyData(code int32, id int, name, link, sendData string, left int) {
	logger.Printf("lucky, code=%d, gift=%d, name=%s, link=%s, data=%s, left=%d ", code, id, name, link, sendData, left)
}
```



## 支付宝福卡

无并发风险，概率随机变化

```go
/**
 * 支付宝五福
 * 五福的概率来自识别后的参数(AI图片识别MaBaBa)
 * 基础功能：
 * /lucky 只有一个抽奖的接口，奖品信息都是预先配置好的
 * 测试方法：
 * curl "http://localhost:8080/?rate=4,3,2,1,0"
 * curl "http://localhost:8080/lucky?uid=1&rate=4,3,2,1,0"
 * 压力测试：（这里不存在线程安全问题）
 * wrk -t10 -c10 -d 10 "http://localhost:8080/lucky?uid=1&rate=4,3,2,1,0"
 */

package main

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/kataras/iris"
	"github.com/kataras/iris/mvc"
)

// 最大号码
const rateMax = 10

// 奖品信息
type gift struct {
	id      int    // 奖品ID
	name    string // 奖品名称
	pic     string // 照片链接
	link    string // 链接
	inuse   bool   // 是否使用中
	rate    int    // 中奖概率，十分之N,0-9
	rateMin int    // 大于等于，中奖的最小号码,0-10
	rateMax int    // 小于，中奖的最大号码,0-10
}

// 文件日志
var logger *log.Logger

func main() {
	app := newApp()

	// http://localhost:8080/
	app.Run(iris.Addr(":8080"))
}

// 初始化奖品列表信息（管理后台来维护）
func newGift() *[5]gift {
	giftlist := new([5]gift)
	// 1 实物大奖
	g1 := gift{
		id:      1,
		name:    "富强福",
		pic:     "富强福.jpg",
		link:    "",
		inuse:   true,
		rate:    4,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[0] = g1
	// 2 实物小奖
	g2 := gift{
		id:      2,
		name:    "和谐福",
		pic:     "和谐福.jpg",
		link:    "",
		inuse:   true,
		rate:    3,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[1] = g2
	// 3 虚拟券，相同的编码
	g3 := gift{
		id:      3,
		name:    "友善福",
		pic:     "友善福.jpg",
		link:    "",
		inuse:   true,
		rate:    2,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[2] = g3
	// 4 虚拟券，不相同的编码
	g4 := gift{
		id:      4,
		name:    "爱国福",
		pic:     "爱国福.jpg",
		link:    "",
		inuse:   true,
		rate:    1,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[3] = g4
	// 5 虚拟币
	g5 := gift{
		id:      5,
		name:    "敬业福",
		pic:     "敬业福.jpg",
		link:    "",
		inuse:   true,
		rate:    0,
		rateMin: 0,
		rateMax: 0,
	}
	giftlist[4] = g5
	return giftlist
}

// 根据概率，计算好的奖品信息列表
func giftRate(rate string) *[5]gift {
	giftlist := newGift()
	rates := strings.Split(rate, ",")
	ratesLen := len(rates)
	// 整理奖品数据，把rateMin,rateMax根据rate进行编排
	rateStart := 0
	for i, data := range giftlist {
		if !data.inuse {
			continue
		}
		grate := 0
		if i < ratesLen { // 避免数组越界
			grate, _ = strconv.Atoi(rates[i])
		}
		giftlist[i].rate = grate
		giftlist[i].rateMin = rateStart
		giftlist[i].rateMax = rateStart + grate
		if giftlist[i].rateMax >= rateMax {
			// 号码达到最大值，分配的范围重头再来
			giftlist[i].rateMax = rateMax
			rateStart = 0
		} else {
			rateStart += grate
		}
	}
	fmt.Printf("giftlist=%v\n", giftlist)
	return giftlist
}

// 初始化日志信息
func initLog() {
	f, _ := os.Create("/var/log/lottery_demo.log")
	logger = log.New(f, "", log.Ldate|log.Lmicroseconds)
}

func newApp() *iris.Application {
	app := iris.New()
	mvc.New(app.Party("/")).Handle(&lotteryController{})
	// 初始化日志信息
	initLog()
	return app
}

// 抽奖的控制器
type lotteryController struct {
	Ctx iris.Context
}

// GET http://localhost:8080/?rate=4,3,2,1,0
func (c *lotteryController) Get() string {
	rate := c.Ctx.URLParamDefault("rate", "4,3,2,1,0")
	giftlist := giftRate(rate)
	return fmt.Sprintf("%v\n", giftlist)
}

// GET http://localhost:8080/lucky?uid=1&rate=4,3,2,1,0
func (c *lotteryController) GetLucky() map[string]interface{} {
	uid, _ := c.Ctx.URLParamInt("uid")
	rate := c.Ctx.URLParamDefault("rate", "4,3,2,1,0")
	code := luckyCode()
	ok := false
	result := make(map[string]interface{})
	result["success"] = ok
	giftlist := giftRate(rate)
	for _, data := range giftlist {
		if !data.inuse {
			continue
		}
		if data.rateMin <= int(code) && data.rateMax >= int(code) {
			// 中奖了，抽奖编码在奖品中奖编码范围内
			ok = true
			sendData := data.pic

			if ok {
				// 中奖后，成功得到奖品（发奖成功）
				// 生成中奖纪录
				saveLuckyData(uid, code, data.id, data.name, data.link, sendData)
				result["success"] = ok
				result["uid"] = uid
				result["id"] = data.id
				result["name"] = data.name
				result["link"] = data.link
				result["data"] = sendData
				break
			}
		}
	}

	return result
}

// 抽奖编码
func luckyCode() int32 {
	seed := time.Now().UnixNano()                                 // rand内部运算的随机数
	code := rand.New(rand.NewSource(seed)).Int31n(int32(rateMax)) // rand计算得到的随机数
	return code
}

// 记录用户的获奖记录
func saveLuckyData(uid int, code int32, id int, name, link, sendData string) {
	logger.Printf("lucky, uid=%d, code=%d, gift=%d, name=%s, link=%s, data=%s ", uid, code, id, name, link, sendData)
}
```





## 微博抢红包

多个用户发多个红包

红包的集合，红包内的红包数量存在并发安全问题

优化，把红包集合进行散列，减小单个集合的大小



```go
/**
 * 微博抢红包
 * 两个步骤
 * 1 抢红包，设置红包总金额，红包个数，返回抢红包的地址
 * GET /set?uid=1&money=100&num=100
 * 2 抢红包，先到先得，随机得到红包金额
 * GET /get?id=1&uid=1
 * 注意：
 * 线程安全1，红包列表 packageList map 改用线程安全的 sync.Map
 * 线程安全2，红包里面的金额切片 packageList map[uint32][]uint 并发读写不安全，虽然不会报错
 * 优化 channel 的吞吐量，启动多个处理协程来执行 channel 的消费
 */
package main

import (
	"github.com/kataras/iris"
	"github.com/kataras/iris/mvc"
	"os"
	"log"
	"fmt"
	"math/rand"
	"time"
	"sync"
)

// 文件日志
var logger *log.Logger
// 当前有效红包列表，int64是红包唯一ID，[]uint是红包里面随机分到的金额（单位分）
//var packageList map[uint32][]uint = make(map[uint32][]uint)
var packageList *sync.Map = new(sync.Map)
//var chTasks chan task = make(chan task)
const taskNum = 16
var chTaskList []chan task = make([]chan task, taskNum)

func main() {
	app := newApp()
	app.Run(iris.Addr(":8080"))
}

// 初始化Application
func newApp() *iris.Application {
	app := iris.New()
	mvc.New(app.Party("/")).Handle(&lotteryController{})

	initLog()
	for i:=0; i<taskNum; i++ {
		chTaskList[i] = make(chan task)
		go fetchPackageMoney(chTaskList[i])
	}
	return app
}

// 初始化日志
func initLog() {
	f, _ := os.Create("/var/log/lottery_demo.log")
	logger = log.New(f, "", log.Ldate|log.Lmicroseconds)
}

// 单线程死循环，专注处理各个红包中金额切片的数据更新（移除指定位置的金额）
func fetchPackageMoney(chTasks chan task) {
	for {
		t := <-chTasks
		// 分配的随机数
		r := rand.New(rand.NewSource(time.Now().UnixNano()))
		id := t.id
		l, ok := packageList.Load(id)
		if ok && l != nil {
			list := l.([]uint)
			// 从红包金额中随机得到一个
			i := r.Intn(len(list))
			money := list[i]
			//if i == len(list) - 1 {
			//	packageList[uint32(id)] = list[:i]
			//} else if i == 0 {
			//	packageList[uint32(id)] = list[1:]
			//} else {
			//	packageList[uint32(id)] = append(list[:i], list[i+1:]...)
			//}
			if len(list) > 1 {
				if i == len(list) - 1 {
					packageList.Store(uint32(id), list[:i])
				} else if i == 0 {
					packageList.Store(uint32(id), list[1:])
				} else {
					packageList.Store(uint32(id), append(list[:i], list[i+1:]...))
				}
			} else {
				//delete(packageList, uint32(id))
				packageList.Delete(uint32(id))
			}
			// 回调channel返回
			t.callback <- money
		} else {
			t.callback <- 0
		}
	}
}
// 任务结构
type task struct {
	id uint32
	callback chan uint
}

// 抽奖的控制器
type lotteryController struct {
	Ctx iris.Context
}

// 返回全部红包地址
// GET http://localhost:8080/
func (c *lotteryController) Get() map[uint32][2]int {
	rs := make(map[uint32][2]int)
	//for id, list := range packageList {
	//	var money int
	//	for _, v := range list {
	//		money += int(v)
	//	}
	//	rs[id] = [2]int{len(list),money}
	//}
	packageList.Range(func(key, value interface{}) bool {
		id := key.(uint32)
		list := value.([]uint)
		var money int
		for _, v := range list {
			money += int(v)
		}
		rs[id] = [2]int{len(list),money}
		return true
	})
	return rs
}

// 发红包
// GET http://localhost:8080/set?uid=1&money=100&num=100
func (c *lotteryController) GetSet() string {
	uid, errUid := c.Ctx.URLParamInt("uid")
	money, errMoney := c.Ctx.URLParamFloat64("money")
	num, errNum := c.Ctx.URLParamInt("num")
	if errUid != nil || errMoney != nil || errNum != nil {
		return fmt.Sprintf("参数格式异常，errUid=%s, errMoney=%s, errNum=%s\n", errUid, errMoney, errNum)
	}
	moneyTotal := int(money * 100)
	if uid < 1 || moneyTotal < num || num < 1 {
		return fmt.Sprintf("参数数值异常，uid=%d, money=%d, num=%d\n", uid, money, num)
	}
	// 金额分配算法
	leftMoney := moneyTotal
	leftNum := num
	// 分配的随机数
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	// 随机分配最大比例
	rMax := 0.55
	if num >= 1000 {
		rMax = 0.01
	}else if num >= 100 {
		rMax = 0.1
	} else if num >= 10 {
		rMax = 0.3
	}
	list := make([]uint, num)
	// 大循环开始，只要还有没分配的名额，继续分配
	for leftNum > 0 {
		if leftNum == 1 {
			// 最后一个名额，把剩余的全部给它
			list[num-1] = uint(leftMoney)
			break
		}
		// 剩下的最多只能分配到1分钱时，不用再随机
		if leftMoney == leftNum {
			for i:=num-leftNum; i < num ; i++ {
				list[i] = 1
			}
			break
		}
		// 每次对剩余金额的1%-55%随机，最小1，最大就是剩余金额55%（需要给剩余的名额留下1分钱的生存空间）
		rMoney := int(float64(leftMoney-leftNum) * rMax)
		m := r.Intn(rMoney)
		if m < 1 {
			m = 1
		}
		list[num-leftNum] = uint(m)
		leftMoney -= m
		leftNum--
	}
	// 最后再来一个红包的唯一ID
	id := r.Uint32()
	//packageList[id] = list
	packageList.Store(id, list)
	// 返回抢红包的URL
	return fmt.Sprintf("/get?id=%d&uid=%d&num=%d\n", id, uid, num)
}

// 抢红包
// GET http://localhost:8080/get?id=1&uid=1
func (c *lotteryController) GetGet() string {
	uid, errUid := c.Ctx.URLParamInt("uid")
	id, errId := c.Ctx.URLParamInt("id")
	if errUid != nil || errId != nil {
		return fmt.Sprintf("参数格式异常，errUid=%s, errId=%s\n", errUid, errId)
	}
	if uid < 1 || id < 1 {
		return fmt.Sprintf("参数数值异常，uid=%d, id=%d\n", uid, id)
	}
	//list, ok := packageList[uint32(id)]
	l, ok := packageList.Load(uint32(id))
	if !ok {
		return fmt.Sprintf("红包不存在,id=%d\n", id)
	}
	list := l.([]uint)
	if len(list) < 1 {
		return fmt.Sprintf("红包不存在,id=%d\n", id)
	}
	// 更新红包列表中的信息（移除这个金额），构造一个任务
	callback := make(chan uint)
	t := task{id: uint32(id), callback: callback}
	// 把任务发送给channel
	chTasks := chTaskList[id % taskNum]
	chTasks <- t
	// 回调的channel等待处理结果
	money := <- callback
	if money <= 0 {
		fmt.Println(uid, "很遗憾，没能抢到红包")
		return fmt.Sprintf("很遗憾，没能抢到红包\n")
	} else {
		fmt.Println(uid, "抢到一个红包，金额为:", money)
		logger.Printf("weiboReadPacket success uid=%d, id=%d, money=%d\n", uid, id, money)
		return fmt.Sprintf("恭喜你抢到一个红包，金额为:%d\n", money)
	}
}
```



## 抽奖大转盘



用户已知全部奖品信息

可以设置各个奖品的数量和中奖概率

更新库存时存在并发安全问题

```go
/**
 * 大转盘程序
 * curl http://localhost:8080/
 * curl http://localhost:8080/debug
 * curl http://localhost:8080/prize
 * 固定几个奖品，不同的中奖概率或者总数量限制
 * 每一次转动抽奖，后端计算出这次抽奖的中奖情况，并返回对应的奖品信息
 *
 * 不用互斥锁，而是用CAS操作来更新，保证并发库存更新的正常
 * 压力测试：
 * wrk -t10 -c100 -d5 "http://localhost:8080/prize"
 */
package main

import (
	"github.com/kataras/iris"
	"github.com/kataras/iris/mvc"
	"fmt"
	"strings"
	"time"
	"math/rand"
	"sync/atomic"
)


// 奖品中奖概率
type Prate struct {
	Rate int		// 万分之N的中奖概率
	Total int		// 总数量限制，0 表示无限数量
	CodeA int		// 中奖概率起始编码（包含）
	CodeB int		// 中奖概率终止编码（包含）
	Left *int32 		// 剩余数
}
// 奖品列表
var prizeList []string = []string{
	"一等奖，火星单程船票",
	"二等奖，凉飕飕南极之旅",
	"三等奖，iPhone一部",
	"",							// 没有中奖
}
var giftLeft = int32(1000)
// 奖品的中奖概率设置，与上面的 prizeList 对应的设置
var rateList []Prate = []Prate{
	//Prate{1, 1, 0, 0, 1},
	//Prate{2, 2, 1, 2, 2},
	Prate{5, 1000, 0, 9999, &giftLeft},
	//Prate{100,0, 0, 9999, 0},
}

func newApp() *iris.Application {
	app := iris.New()
	mvc.New(app.Party("/")).Handle(&lotteryController{})
	return app
}

func main() {
	app := newApp()
	// http://localhost:8080
	app.Run(iris.Addr(":8080"))
}

// 抽奖的控制器
type lotteryController struct {
	Ctx iris.Context
}

// GET http://localhost:8080/
func (c *lotteryController) Get() string {
	c.Ctx.Header("Content-Type", "text/html")
	return fmt.Sprintf("大转盘奖品列表：<br/> %s", strings.Join(prizeList, "<br/>\n"))
}

// GET http://localhost:8080/prize
func (c *lotteryController) GetPrize() string {
	c.Ctx.Header("Content-Type", "text/html")
	// 第一步，抽奖，根据随机数匹配奖品
	seed := time.Now().UnixNano()
	r := rand.New(rand.NewSource(seed))
	// 得到个人的抽奖编码
	code := r.Intn(10000)
	//fmt.Println("GetPrize code=", code)
	var myprize string
	var prizeRate *Prate
	// 从奖品列表中匹配，是否中奖
	for i, prize := range prizeList {
		rate := &rateList[i]
		if code >= rate.CodeA && code <= rate.CodeB {
			// 满足中奖条件
			myprize = prize
			prizeRate = rate
			break
		}
	}
	if myprize == "" {
		// 没有中奖
		myprize = "很遗憾，再来一次"
		return myprize
	}
	// 第二步，发奖，是否可以发奖
	if prizeRate.Total == 0 {
		// 无限奖品
		fmt.Println("中奖： ", myprize)
		return myprize
	} else if *prizeRate.Left > 0 {
		// 还有剩余奖品，使用 CAS 操作来做安全更新
		left := atomic.AddInt32(prizeRate.Left, -1)
		if left >= 0 {
			fmt.Println("中奖： ", myprize)
			return myprize
		}
	}
	// 有限且没有剩余奖品，无法发奖
	myprize = "很遗憾，再来一次"
	return myprize
}

// GET http://localhost:8080/debug
func (c *lotteryController) GetDebug() string {
	c.Ctx.Header("Content-Type", "text/html")
	return fmt.Sprintf("获奖概率： %v", rateList)
}
```



## 抽奖web程序

流程：

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202307201127343.png)



### 配置类

MySQL

```go
/**
 * mysql数据库配置信息
 */
package conf

const DriverName = "mysql"

type DbConfig struct {
	Host      string
	Port      int
	User      string
	Pwd       string
	Database  string
	IsRunning bool // 是否正常运行
}

// 系统中所有mysql主库 root:root@tcp(127.0.0.1:3306)/lottery?charset=utf-8
var DbMasterList = []DbConfig{
	{
		Host:      "127.0.0.1",
		Port:      3306,
		User:      "root",
		Pwd:       "root",
		Database:  "lottery",
		IsRunning: true,
	},
}

var DbMaster DbConfig = DbMasterList[0]
```



redis配置

```go
package conf

type RdsConfig struct {
	Host      string
	Port      int
	User      string
	Pwd       string
	IsRunning bool // 是否正常运行
}

// 系统中用到的所有redis缓存资源
var RdsCacheList = []RdsConfig{
	{
		Host:      "127.0.0.1",
		Port:      6379,
		User:      "",
		Pwd:       "",
		IsRunning: true,
	},
}

var RdsCache RdsConfig = RdsCacheList[0]
```





抽奖配置

```go
package conf

import "time"

const UserPrizeMax = 3000            // 用户每天最多抽奖次数
const IpPrizeMax = 30000             // 同一个IP每天最多抽奖次数
const IpLimitMax = 300000            // 同一个IP每天最多抽奖次数
// 定义24小时的奖品分配权重
var PrizeDataRandomDayTime = [100]int{
	// 24 * 3 = 72   平均3%的机会
	// 100 - 72 = 28 剩余28%的机会
	// 7 * 4 = 28    剩下的分别给7个时段增加4%的机会
	0, 0, 0,
	1, 1, 1,
	2, 2, 2,
	3, 3, 3,
	4, 4, 4,
	5, 5, 5,
	6, 6, 6,
	7, 7, 7,
	8, 8, 8,
	9, 9, 9, 9, 9, 9, 9,
	10, 10, 10, 10, 10, 10, 10,
	11, 11, 11,
	12, 12, 12,
	13, 13, 13,
	14, 14, 14,
	15, 15, 15, 15, 15, 15, 15,
	16, 16, 16, 16, 16, 16, 16,
	17, 17, 17, 17, 17, 17, 17,
	18, 18, 18,
	19, 19, 19,
	20, 20, 20, 20, 20, 20, 20,
	21, 21, 21, 21, 21, 21, 21,
	22, 22, 22,
	23, 23, 23,
}

const GtypeVirtual = 0   // 虚拟币
const GtypeCodeSame = 1  // 虚拟券，相同的码
const GtypeCodeDiff = 2  // 虚拟券，不同的码
const GtypeGiftSmall = 3 // 实物小奖
const GtypeGiftLarge = 4 // 实物大奖

const SysTimeform = "2006-01-02 15:04:05"
const SysTimeformShort = "2006-01-02"

// 是否需要启动全局计划任务服务
var RunningCrontabService = false

// 中国时区
var SysTimeLocation, _ = time.LoadLocation("Asia/Chongqing")

// ObjSalesign 签名密钥
var SignSecret = []byte("0123456789abcdef")

// cookie中的加密验证密钥
var CookieSecret = "hellolottery"
```



### 数据源

MySQL

```go
package datasource

import (
	"fmt"
	"log"
	"sync"

	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
	"imooc.com/lottery/conf"
)

var dbLock sync.Mutex
var masterInstance *xorm.Engine
var slaveInstance *xorm.Engine

// 得到唯一的主库实例
func InstanceDbMaster() *xorm.Engine {
	if masterInstance != nil {
		return masterInstance
	}
	dbLock.Lock()
	defer dbLock.Unlock()

	if masterInstance != nil {
		return masterInstance
	}
	return NewDbMaster()
}

func NewDbMaster() *xorm.Engine {
	sourcename := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8",
		conf.DbMaster.User,
		conf.DbMaster.Pwd,
		conf.DbMaster.Host,
		conf.DbMaster.Port,
		conf.DbMaster.Database)

	instance, err := xorm.NewEngine(conf.DriverName, sourcename)
	if err != nil {
		log.Fatal("dbhelper.InstanceDbMaster NewEngine error ", err)
		return nil
	}
	instance.ShowSQL(true)
	//instance.ShowSQL(false)
	masterInstance = instance
	return masterInstance
}
```



redis

```go
package datasource

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gomodule/redigo/redis"
	"imooc.com/lottery/conf"
)

var rdsLock sync.Mutex
var cacheInstance *RedisConn

// 封装成一个redis资源池
type RedisConn struct {
	pool *redis.Pool
	showDebug bool
}

// 对外只有一个命令，封装了一个redis的命令
func (rds *RedisConn) Do(commandName string, args ...interface{}) (reply interface{}, err error) {
	conn := rds.pool.Get()
	defer conn.Close()

	t1 := time.Now().UnixNano()
	reply, err = conn.Do(commandName, args...)
	if err != nil {
		e := conn.Err()
		if e != nil {
			log.Println("rdshelper Do", err, e)
		}
	}
	t2 := time.Now().UnixNano()
	if rds.showDebug {
		fmt.Printf("[redis] [info] [%dus]cmd=%s, err=%s, args=%v, reply=%s\n", (t2-t1)/1000, commandName, err, args, reply)
	}
	return reply, err
}

// 设置是否打印操作日志
func (rds *RedisConn) ShowDebug(b bool) {
	rds.showDebug = b
}

// 得到唯一的redis缓存实例
func InstanceCache() *RedisConn {
	if cacheInstance != nil {
		return cacheInstance
	}
	rdsLock.Lock()
	defer rdsLock.Unlock()

	if cacheInstance != nil {
		return cacheInstance
	}
	return NewCache()
}

// 重新实例化
func NewCache() *RedisConn {
	pool := redis.Pool{
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", fmt.Sprintf("%s:%d", conf.RdsCache.Host, conf.RdsCache.Port))
			if err != nil {
				log.Fatal("rdshelper.NewCache Dial error ", err)
				return nil, err
			}
			return c, nil
		},
		TestOnBorrow:    func(c redis.Conn, t time.Time) error {
			if time.Since(t) < time.Minute {
				return nil
			}
			_, err := c.Do("PING")
			return err
		},
		MaxIdle:         10000,
		MaxActive:       10000,
		IdleTimeout:     0,
		Wait:            false,
		MaxConnLifetime: 0,
	}
	instance := &RedisConn{
		pool:&pool,
	}
	cacheInstance = instance
	cacheInstance.ShowDebug(true)
	//cacheInstance.ShowDebug(false)
	return cacheInstance
}
```





### 数据模型models

IP黑名单

```go
package models

type LtBlackip struct {
	Id         int    `xorm:"not null pk autoincr INT(10)"`
	Ip         string `xorm:"not null default '' comment('IP地址') VARCHAR(50)"`
	Blacktime  int    `xorm:"not null default 0 comment('黑名单限制到期时间') INT(10)"`
	SysCreated int    `xorm:"not null default 0 comment('创建时间') INT(10)"`
	SysUpdated int    `xorm:"not null default 0 comment('修改时间') INT(10)"`
}
```



优惠券

```go
package models

type LtCode struct {
	Id         int    `xorm:"not null pk autoincr INT(10)"`
	GiftId     int    `xorm:"not null default 0 comment('奖品ID，关联lt_gift表') INT(10)"`
	Code       string `xorm:"not null default '' comment('虚拟券编码') VARCHAR(255)"`
	SysCreated int    `xorm:"not null default 0 comment('创建时间') INT(10)"`
	SysUpdated int    `xorm:"not null default 0 comment('更新时间') INT(10)"`
	SysStatus  int    `xorm:"not null default 0 comment('状态，0正常，1作废，2已发放') SMALLINT(5)"`
}
```



奖品

```go
package models

type LtGift struct {
	Id           int    `xorm:"not null pk autoincr INT(10)" json:"id"`
	Title        string `xorm:"not null default '' comment('奖品名称') VARCHAR(255)" json:"title"`
	PrizeNum     int    `xorm:"not null default -1 comment('奖品数量，0 无限量，>0限量，<0无奖品') INT(11)" json:"-"`
	LeftNum      int    `xorm:"not null default 0 comment('剩余数量') INT(11)" json:"-"`
	PrizeCode    string `xorm:"not null default '' comment('0-9999表示100%，0-0表示万分之一的中奖概率') VARCHAR(50)" json:"-"`
	PrizeTime    int    `xorm:"not null default 0 comment('发奖周期，D天') INT(10)" json:"-"`
	Img          string `xorm:"not null default '' comment('奖品图片') VARCHAR(255)" json:"img"`
	Displayorder int    `xorm:"not null default 0 comment('位置序号，小的排在前面') INT(10)" json:"displayorder"`
	Gtype        int    `xorm:"not null default 0 comment('奖品类型，0 虚拟币，1 虚拟券，2 实物-小奖，3 实物-大奖') INT(10)" json:"gtype"`
	Gdata        string `xorm:"not null default '' comment('扩展数据，如：虚拟币数量') VARCHAR(255)" json:"-"`
	TimeBegin    int    `xorm:"not null default 0 comment('开始时间') INT(11)" json:"-"`
	TimeEnd      int    `xorm:"not null default 0 comment('结束时间') INT(11)" json:"-"`
	PrizeData    string `xorm:"comment('发奖计划，[[时间1,数量1],[时间2,数量2]]') MEDIUMTEXT" json:"-"`
	PrizeBegin   int    `xorm:"not null default 0 comment('发奖计划周期的开始') INT(11)" json:"-"`
	PrizeEnd     int    `xorm:"not null default 0 comment('发奖计划周期的结束') INT(11)" json:"-"`
	SysStatus    int    `xorm:"not null default 0 comment('状态，0 正常，1 删除') SMALLINT(5)" json:"-"`
	SysCreated   int    `xorm:"not null default 0 comment('创建时间') INT(10)" json:"-"`
	SysUpdated   int    `xorm:"not null default 0 comment('修改时间') INT(10)" json:"-"`
	SysIp        string `xorm:"not null default '' comment('操作人IP') VARCHAR(50)" json:"-"`
}
```



中奖结果

```go
package models

type LtResult struct {
	Id         int    `xorm:"not null pk autoincr INT(10)" json:"-"`
	GiftId     int    `xorm:"not null default 0 comment('奖品ID，关联lt_gift表') INT(10)" json:"gift_id"`
	GiftName   string `xorm:"not null default '' comment('奖品名称') VARCHAR(255)" json:"gift_name"`
	GiftType   int    `xorm:"not null default 0 comment('奖品类型，同lt_gift. gtype') INT(10)" json:"gift_type"`
	Uid        int    `xorm:"not null default 0 comment('用户ID') INT(10)" json:"uid"`
	Username   string `xorm:"not null default '' comment('用户名') VARCHAR(50)" json:"username"`
	PrizeCode  int    `xorm:"not null default 0 comment('抽奖编号（4位的随机数）') INT(10)" json:"-"`
	GiftData   string `xorm:"not null default '' comment('获奖信息') VARCHAR(255)" json:"-"`
	SysCreated int    `xorm:"not null default 0 comment('创建时间') INT(10)" json:"-"`
	SysIp      string `xorm:"not null default '' comment('用户抽奖的IP') VARCHAR(50)" json:"-"`
	SysStatus  int    `xorm:"not null default 0 comment('状态，0 正常，1删除，2作弊') SMALLINT(5)" json:"-"`
}
```



用户

```go
package models

type LtUser struct {
	Id         int    `xorm:"not null pk autoincr INT(10)"`
	Username   string `xorm:"not null default '' comment('用户名') VARCHAR(50)"`
	Blacktime  int    `xorm:"not null default 0 comment('黑名单限制到期时间') INT(10)"`
	Realname   string `xorm:"not null default '' comment('联系人') VARCHAR(50)"`
	Mobile     string `xorm:"not null default '' comment('手机号') VARCHAR(50)"`
	Address    string `xorm:"not null default '' comment('联系地址') VARCHAR(255)"`
	SysCreated int    `xorm:"not null default 0 comment('创建时间') INT(10)"`
	SysUpdated int    `xorm:"not null default 0 comment('修改时间') INT(10)"`
	SysIp      string `xorm:"not null default '' comment('IP地址') VARCHAR(50)"`
}
```



用户抽奖次数

```go
package models

type LtUserday struct {
	Id         int `xorm:"not null pk autoincr INT(10)"`
	Uid        int `xorm:"not null default 0 comment('用户ID') INT(10)"`
	Day        int `xorm:"not null default 0 comment('日期，如：20180725') INT(10)"`
	Num        int `xorm:"not null default 0 comment('次数') INT(10)"`
	SysCreated int `xorm:"not null default 0 comment('创建时间') INT(10)"`
	SysUpdated int `xorm:"not null default 0 comment('修改时间') INT(10)"`
}
```



商品属性

```go
package models

type ObjGiftPrize struct {
	Id           int    `json:"id"`
	Title        string `json:"title"`
	PrizeNum     int    `json:"-"`
	LeftNum		 int    `json:"-"`
	PrizeCodeA   int    `json:"-"`
	PrizeCodeB   int    `json:"-"`
	Img          string `json:"img"`
	Displayorder int    `json:"displayorder"`
	Gtype        int    `json:"gtype"`
	Gdata        string `json:"gdata"`
}
```



交互模型

```go
package models

// 站点中与浏览器交互的用户模型
type ObjLoginuser struct {
	Uid      int
	Username string
	Now      int
	Ip       string
	Sign     string
}
```




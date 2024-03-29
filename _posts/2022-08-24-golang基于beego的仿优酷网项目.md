---
layout: post
title: "golang基于beego的仿优酷网项目"
categories: golang基础
tags: golang
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}

## Beego框架特性

1. 简单化

   > RESTful 支持、MVC 模型，可以使用 bee 工具快速地开发应用，包括监控代码修改进行热编译、自动化测试代码以及自动化打包部署。

2. 智能化

   > 支持智能路由、智能监控，可以监控 QPS、内存消耗、CPU 使用，以及 goroutine 的运行状况，让您的线上应用尽在掌握。

3. 模块化

   > beego 内置了强大的模块，包括 Session、缓存操作、日志记录、配置解析、性能监控、上下文操作、ORM 模块、请求模拟等强大的模块，足以支撑你任何的应用。

4. 高性能

   > beego 采用了 Go 原生的 http 包来处理请求，goroutine 的并发效率足以应付大流量的 Web 应用和 API 应用，目前已经应用于大量高并发的产品中。

Beego官方网址 [beego.me](https://beego.me/)



## 环境搭建

**GOROOT**

> Go的安装目录

**GOPATH**

> 工作目录，目录下包含bin，pkg，src三个文件夹，src是存放go源代码的，编写的项目都在这个文件夹下；pkg是存放编译好的库文件的；bin文件夹是存放编译后的可执行文件的。

***注意：GOPATH不要配置成GO的安装目录,会引起混乱***

**安装步骤**

1. 下载Go安装文件，解压到相关目录

   > 下载地址 [studygolang.com/dl](https://studygolang.com/dl)

2. 配置GOROOT、GOPATH、PATH

   ```javascript
    export GOROOT=/usr/local/go
    export GOPATH=/Users/goRoot:/Users/go
    export PATH=/usr/local/go/bin:/Users/goRoot/bin:$PATH
   ```

3. 测试，打印版本号`go version`



Beego和bee的安装比较简单

```javascript
    go get -u github.com/astaxie/beego
    go get -u github.com/beego/bee
```

为了更加方便的操作，请将 $GOPATH/bin 加入到你的 $PATH 变量中。请确保在此之前您已经添加了 $GOPATH 变量

测试是否成功

```javascript
    bee version
```

Beego和bee [官方安装教程](https://beego.me/quickstart)



### bee的主要命令

1. bee new

   > 新建一个 Web 项目

2. bee api

   > 创建 API 应用的，和 Web 项目相比，少了 static 和 views 目录，多了一个 test 模块，用来做单元测试的

3. bee run

   > 监控 beego 的项目

4. bee pack

   > 发布应用的时候打包，会把项目打包成 zip 包，这样我们部署的时候直接把打包之后的项目上传，解压就可以部署

5. 注意：bee pack -be GOOS=linux

   > MAC下打的包是不能再linux执行的，需要制定参数



### 创建项目

进入 $GOPATH/src 所在的目录：

```javascript
    ➜  src  bee new quickstart
[INFO] Creating application...
/gopath/src/quickstart/
/gopath/src/quickstart/conf/
/gopath/src/quickstart/controllers/
/gopath/src/quickstart/models/
/gopath/src/quickstart/routers/
/gopath/src/quickstart/tests/
/gopath/src/quickstart/static/
/gopath/src/quickstart/static/js/
/gopath/src/quickstart/static/css/
/gopath/src/quickstart/static/img/
/gopath/src/quickstart/views/
/gopath/src/quickstart/conf/app.conf
/gopath/src/quickstart/controllers/default.go
/gopath/src/quickstart/views/index.tpl
/gopath/src/quickstart/routers/router.go
/gopath/src/quickstart/tests/default_test.go
/gopath/src/quickstart/main.go
2014/11/06 18:17:09 [SUCC] New application successfully created!
```

通过一个简单的命令就创建了一个 beego 项目。他的目录结构如下所示

```javascript
quickstart
|-- conf
|   `-- app.conf
|-- controllers
|   `-- default.go
|-- main.go
|-- models
|-- routers
|   `-- router.go
|-- static
|   |-- css
|   |-- img
|   `-- js
|-- tests
|   `-- default_test.go
`-- views
    `-- index.tpl
```

main.go 是入口文件



### 路由和MVC

**路由设置**

有两种方式：

1. 在router.go中配置

   > beego.Router("/hello", &controllers.MainController{}, "get:GetHello")

2. 在router.go中include引入，直接在函数上方配置规则

   > beego.Include(&controllers.DemoController{})
   >
   > ```javascript
   >  // @router /demo/hello [get]
   >  func (this *DemoController) GetHello() {
   >      var (
   >          title string
   >      )
   >      title = "Hello World!"
   >      this.Ctx.WriteString(title)
   >  }
   > ```

**MVC模式**

在目录下有 controllers models views 文件夹分别存放controller文件，model文件和模板文件。后面项目中用到的文件都会分别在这三个文件夹中



### 过滤器和配置文件

**过滤器，为什么有过滤器呢？**

比如，进行安全验证，访问用户中心的时候，进行是否登录的判断可以在过滤器中，也可以实现屏蔽IP的功能，屏蔽黑名单的功能等等，对项目有整体的规则时，都可以在过滤器中实现，不用在每个函数中来实现了

过滤器是通过beego.insertfilter函数来实现的

在router文件中

```javascript
    beego.InsertFilter("/demo/*", beego.BeforeRouter, FilterDemo)

    var FilterDemo = func(ctx *context.Context) {
        var (
            title string
        )
        title = "禁止访问"
        ctx.WriteString(title)
    }
```

这里是屏蔽规则，包含demo/的url都走过滤规则；第二个参数是BeforeRouter，在寻找路由之前；第三个参数是函数名。

**配置信息**

beego提供了专门配置文件，配置信息定义在conf文件夹中的app.conf

```javascript
    appname = fyouku //项目名称
    httpport = 8098  //访问端口号
    runmode = dev    //运行环境，下面会根据运行环境加载不同配置

    [dev]
    apiurl = http://127.0.0.1:8099
    microApi = http://127.0.0.1:8085

    [prod]
    apiurl = http://127.0.0.1:8099
    microApi = http://127.0.0.1:8085
```

**静态文件**

项目中的css、js、img文件都是怎样访问的，bee new创建的项目中有static文件夹，这是beego默认注册的静态文件处理目录

```javascript
├── static
    │   ├── css
    │   ├── img
    │   └── js
```

访问地址为：http://127.0.0.1:8080/static/js/fyouku.js

也可以通过下面命令来自定义目录

```javascript
beego.SetStaticPath("/down1", "download1")
```



### view语法

1. 统一使用 作为左右标签
2. 使用 . 来访问当前位置的上下文
3. 使用 $ 来引用当前模板根级的上下文
4. 使用 $var 来访问创建的变量

**判断语句 if ... else ... end**

```javascript
{{if eq .IsEmail 1}}
    <a class="email" href="mailto:{{.Email}}">{{.Email}}</a>
{{else}}
    <a class="email" href="#">不允许访问Email</a>
{{end}}
```

**eq / ne / lt / le / gt / ge**

```javascript
eq: arg1 == arg2

ne: arg1 != arg2

lt: arg1 < arg2

le: arg1 <= arg2

gt: arg1 > arg2

ge: arg1 >= arg2
```

**循环语句 range**

```javascript
{{range $index,$value := .Pages}}
    {{$index}} - {{$value.Num}} of {{$.Website}}
    <br>
{{end}}
```

**载入其它模板**

```javascript
{{template "head.html" .}}
```





### 数据库ORM使用

**什么是orm?**

在关系型数据库和对象之间作一个映射，在操作数据库时，不需要写复杂的SQL语句，只需要像操作对象一样。

**第一步 安装**

```javascript
go get github.com/astaxie/beego/orm
go get github.com/go-sql-driver/mysql
```

**第二步 配置数据库信息，加载信息**

app.conf中增加配置信息

```javascript
[dev]
defaultdb = root:123456@tcp(127.0.0.1:3306)/fyouku?charset=utf8
```

main.go中加载信息

```go
    import (
    "github.com/astaxie/beego/orm"
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    //获取配置文件中信息
    defaultdb := beego.AppConfig.String("defaultdb")
    orm.RegisterDriver("mysql", orm.DRMySQL)
    orm.RegisterDataBase("default", "mysql", defaultdb, 30, 30)

    beego.Run()
}
```

注意：ORM 必须注册一个别名为 default 的数据库，作为默认使用

**第三步 model中使用**

```go
    package models

    import (
        "github.com/astaxie/beego/orm"
    )
    //定义type
    type Advert struct {
        Id       int
        Title    string
        SubTitle string
        AddTime  int64
        Img      string
        Url      string
    }

    func init() {
        //注册model
        orm.RegisterModel(new(Advert))
    }

    func GetChannelAdvert(channelId int) (int64, []Advert, error) {
        //使用前先new一下
        o := orm.NewOrm()
        var adverts []Advert
        num, err := o.Raw("SELECT id, title, sub_title,img,add_time,url FROM advert WHERE status=1 AND channel_id=? ORDER BY sort DESC LIMIT 1", channelId).QueryRows(&adverts)
        return num, adverts, err
    }
```





增删改查

```go
package models

import (
    //引入orm
    "github.com/astaxie/beego/orm"
)

//操作数据库都需要定义struct和表结构对应
type User struct {
    Id      int
    Name    string
    AddTime int64
    Status  int
    Mobile  string
    Avatar  string
}

//初始化注册对应model
func init() {
    orm.RegisterModel(new(User))
}

//获取用户信息
func UserInfo(id int) (User, error) {
    //通过orm中的Read函数获取
    var (
        err error
    )
    o := orm.NewOrm()
    user := User{Id: id}
    err = o.Read(&user)
    return user, err
}

//保存用户
func Save(name string, mobile string, avatar string) error {
    //通过orm中的Insert来保存
    var (
        err  error
        user User
    )
    o := orm.NewOrm()
    //设置字段的值
    user.Name = name
    user.Mobile = mobile
    user.Avatar = avatar
    user.Status = 0
    _, err = o.Insert(&user)
    return err
}

//更新用户名
func UpdateUsername(id int, name string) error {
    //通过orm中的Update来保存
    var (
        user User
        err  error
    )
    o := orm.NewOrm()
    //先判断数据是否存在
    user = User{Id: id}
    if o.Read(&user) == nil {
        //存在更新姓名
        user.Name = name
        _, err = o.Update(&user)
    }
    return err
}

//删除用户，通过ID删除数据
func Delete(id int) error {
    //通过orm中的Delete来保存
    var (
        user User
        err  error
    )
    o := orm.NewOrm()
    user = User{Id: id}
    _, err = o.Delete(&user)
    return err
}

//获取用户列表
func List() ([]User, error) {
    var (
        users []User
        err   error
    )
    o := orm.NewOrm()
    //声明操作的表
    qs := o.QueryTable("user")
    //条件id大于10
    qs = qs.Filter("id__gt", 10)
    //返回几条数据
    qs = qs.Limit(2)
    //倒序是前面加上负号
    qs = qs.OrderBy("-id")
    //后面是设置返回的字段
    qs.All(&users, "Id", "Name")
    return users, err

}

//从这往下是通过原生sql操作数据库
//QueryRow 获取单条数据使用
//QueryRows 获取多条数据使用
//Exec  执行insert\update\delete语句
//通过sql获取用户信息
func SqlUserInfo(id int) (User, error) {
    var (
        user User
        err  error
    )
    o := orm.NewOrm()
    err = o.Raw("SELECT `name`,`mobile` FROM user Where id=? LIMIT 1", id).QueryRow(&user)
    return user, err
}

//通过sql保存用户
func SqlSave(name string, mobile string, avatar string) error {
    var (
        err error
    )
    o := orm.NewOrm()
    _, err = o.Raw("INSERT INTO user (`name`, `mobile`, `avatar`, `status`) VALUES (?, ?, ?, ?)", name, mobile, avatar, 0).Exec()
    return err
}

//原生sql修改用户名
func SqlUpdateUsername(id int, name string) error {
    var (
        err error
    )
    o := orm.NewOrm()
    _, err = o.Raw("UPDATE user SET name=? WHERE id=?", name, id).Exec()
    return err
}

//原生sql删除用户
func SqlDelete(id int) error {
    o := orm.NewOrm()
    _, err := o.Raw("DELETE FROM user WHERE id=?", id).Exec()
    return err
}

//原生sql实现获取用户列表
func SqlList() (int64, []User, error) {
    var (
        users []User
    )
    o := orm.NewOrm()
    num, err := o.Raw("SELECT * FROM user WHERE id>? ORDER BY id DESC LIMIT 2", 10).QueryRows(&users)
    return num, users, err
}
```



入口demo.go

```go
package controllers
 
import (
    "demo/models"
 
    "github.com/astaxie/beego"
)
 
type DemoController struct {
    beego.Controller
}
 
//输出Hello World!
// @router /demo/hello [get]
func (this *DemoController) GetHello() {
    var (
        title string
    )
    title = "Hello World!"
    this.Ctx.WriteString(title)
}
 
//通过id获取用户名
// @router /user/username [get]
func (this *DemoController) GetUsername() {
    var (
        id    int
        err   error
        title string
        user  models.User
    )
    //接受浏览器中的参数
    id, err = this.GetInt("id")
    user, err = models.UserInfo(id)
    if err == nil {
        title = user.Name
    } else {
        title = "抱歉，服务器走丢了"
    }
    this.Ctx.WriteString(title)
}
 
//实现用户注册功能
// @router /user/save [get]
func (this *DemoController) Save() {
    var (
        name   string
        mobile string
        avatar string
        err    error
        title  string
    )
    name = this.GetString("name")
    mobile = this.GetString("mobile")
    avatar = this.GetString("avatar")
    err = models.Save(name, mobile, avatar)
    if err == nil {
        title = "恭喜，保存成功了"
    } else {
        title = "抱歉，服务器又走丢了"
    }
    this.Ctx.WriteString(title)
}
 
//实现修改用户名
// @router /user/update [get]
func (this *DemoController) UpdateUsername() {
    var (
        id    int
        name  string
        title string
        err   error
    )
    id, err = this.GetInt("id")
    name = this.GetString("name")
    err = models.UpdateUsername(id, name)
    if err == nil {
        title = "恭喜，名字修改成功了"
    } else {
        title = "抱歉，服务器又走丢了"
    }
    this.Ctx.WriteString(title)
}
 
//删除用户
// @router /user/delete [get]
func (this *DemoController) Delete() {
    var (
        id    int
        err   error
        title string
    )
    id, err = this.GetInt("id")
 
    err = models.Delete(id)
    if err == nil {
        title = "恭喜，您成功的把自己删除了"
    } else {
        title = "抱歉，服务器怎么又走丢了"
    }
    this.Ctx.WriteString(title)
}
 
//获取用户列表
// @router /user/list [get]
func (this *DemoController) List() {
    var (
        err   error
        title string
        users []models.User
    )
    users, err = models.List()
    if err == nil {
        for _, v := range users {
            title += v.Name + ","
        }
    } else {
        title = "抱歉，一个人也没有了"
    }
    this.Ctx.WriteString(title)
}
 
//通过原生sql方式获取用户信息
// @router /sql/user/userinfo [get]
func (this *DemoController) SqlUserInfo() {
    var (
        id    int
        err   error
        title string
        user  models.User
    )
    id, err = this.GetInt("id")
    user, err = models.SqlUserInfo(id)
    if err == nil {
        title = "用户名：" + user.Name + "，手机号：" + user.Mobile
    } else {
        title = "抱歉，没有这个人"
    }
    this.Ctx.WriteString(title)
}
 
//通过原生sql保存用户
// @router /sql/user/save [get]
func (this *DemoController) SqlSave() {
    var (
        err    error
        title  string
        name   string
        mobile string
        avatar string
    )
    name = this.GetString("name")
    mobile = this.GetString("mobile")
    avatar = this.GetString("avatar")
    err = models.SqlSave(name, mobile, avatar)
    if err == nil {
        title = "保存成功了"
    } else {
        title = "抱歉，服务器走丢了"
    }
    this.Ctx.WriteString(title)
}
 
//原生sql修改用户名
// @router /sql/user/updatename [get]
func (this *DemoController) SqlUpdateUsername() {
    var (
        err   error
        title string
        id    int
        name  string
    )
    id, err = this.GetInt("id")
    name = this.GetString("name")
    err = models.SqlUpdateUsername(id, name)
    if err == nil {
        title = "恭喜，您把自己的名字改了"
    } else {
        title = "抱歉，服务器又丢了~"
    }
    this.Ctx.WriteString(title)
}
 
//通过原生sql删除用户
// @router /sql/user/delete [get]
func (this *DemoController) SqlDelete() {
    var (
        id    int
        err   error
        title string
    )
    id, err = this.GetInt("id")
    err = models.SqlDelete(id)
    if err == nil {
        title = "恭喜，您成功把自己删除了"
    } else {
        title = "抱歉，删除错误，请联系客服"
    }
    this.Ctx.WriteString(title)
}
 
//原生sql获取用户列表
// @router /sql/user/list [get]
func (this *DemoController) SqlList() {
    var (
        err   error
        title string
        users []models.User
    )
    _, users, err = models.SqlList()
    if err == nil {
        for _, v := range users {
            title += v.Name + ","
        }
    } else {
        title = "没有相关信息"
    }
    this.Ctx.WriteString(title)
}
```





### redis使用

下载redis依赖

```
go get github.com/gomodule/redigo/redis
```



配置信息

```
redisdb = 127.0.0.1:6379
```



获取连接池信息

```go
package redis

import (
	"time"

	"github.com/astaxie/beego"
	"github.com/gomodule/redigo/redis"
)

//直接连接
func Connect() redis.Conn {
	pool, _ := redis.Dial("tcp", beego.AppConfig.String("redisdb"))
	return pool
}

//通过连接池
func PoolConnect() redis.Conn {
	// 建立连接池
	pool := &redis.Pool{
		MaxIdle:     5000,              //最大空闲连接数
		MaxActive:   10000,             //最大连接数
		IdleTimeout: 180 * time.Second, //空闲连接超时时间
		Wait:        true,              //超过最大连接数时，是等待还是报错
		Dial: func() (redis.Conn, error) { //建立链接
			c, err := redis.Dial("tcp", beego.AppConfig.String("redisdb"))
			if err != nil {
				return nil, err
			}
			// 选择db
			//c.Do("SELECT", '')
			return c, nil
		},
	}
	return pool.Get()
}
```



获取视频详情

```go
//增加redis缓存 - 获取视频详情
func RedisGetVideoInfo(videoId int) (Video, error) {
	var video Video
	conn := redisClient.PoolConnect()
	defer conn.Close()
	//定义redis key
	redisKey := "video:id:" + strconv.Itoa(videoId)
	//判断redis中是否存在
	exists, err := redis.Bool(conn.Do("exists", redisKey))
	if exists {
		res, _ := redis.Values(conn.Do("hgetall", redisKey))
		err = redis.ScanStruct(res, &video)
	} else {
		o := orm.NewOrm()
		err := o.Raw("SELECT * FROM video WHERE id=? LIMIT 1", videoId).QueryRow(&video)
		if err == nil {
			//保存redis
			_, err := conn.Do("hmset", redis.Args{redisKey}.AddFlat(video)...)
			if err == nil {
				conn.Do("expire", redisKey, 86400)
			}
		}
	}
	return video, err
}
```



获取用户信息

```go
//增加redis缓存 - 根据用户ID获取用户信息
func RedisGetUserInfo(uid int) (UserInfo, error) {
	var user UserInfo
	conn := redisClient.PoolConnect()
	defer conn.Close()

	redisKey := "user:id:" + strconv.Itoa(uid)
	//判断redis是否存在
	exists, err := redis.Bool(conn.Do("exists", redisKey))
	if exists {
		res, _ := redis.Values(conn.Do("hgetall", redisKey))
		err = redis.ScanStruct(res, &user)
	} else {
		o := orm.NewOrm()
		err := o.Raw("SELECT id,name,add_time,avatar FROM user WHERE id=? LIMIT 1", uid).QueryRow(&user)
		if err == nil {
			//保存redis
			_, err = conn.Do("hmset", redis.Args{redisKey}.AddFlat(user)...)
			if err == nil {
				conn.Do("expire", redisKey, 86400)
			}
		}
	}
	return user, err
}
```



获取视频剧集

```go
//增加redis缓存 - 获取视频剧集列表
func RedisGetVideoEpisodesList(videoId int) (int64, []Episodes, error) {
    var (
        episodes []Episodes
        num      int64
        err      error
    )
    conn := redisClient.PoolConnect()
    defer conn.Close()
 
    redisKey := "video:episodes:videoId:" + strconv.Itoa(videoId)
    //判断rediskey是否已存在
    exists, err := redis.Bool(conn.Do("exists", redisKey))
    if exists {
        num, err = redis.Int64(conn.Do("llen", redisKey))
        if err == nil {
            values, _ := redis.Values(conn.Do("lrange", redisKey, "0", "-1"))
            var episodesInfo Episodes
            for _, v := range values {
                err = json.Unmarshal(v.([]byte), &episodesInfo)
                if err == nil {
                    episodes = append(episodes, episodesInfo)
                }
            }
        }
    } else {
        o := orm.NewOrm()
        num, err = o.Raw("SELECT id,title,add_time,num,play_url,comment,aliyun_video_id FROM video_episodes WHERE video_id=? order by num asc", videoId).QueryRows(&episodes)
        if err == nil {
            //遍历获取到的信息，把信息json化保存
            for _, v := range episodes {
                jsonValue, err := json.Marshal(v)
                if err == nil {
                    //保存redis
                    conn.Do("rpush", redisKey, jsonValue)
                }
            }
            conn.Do("expire", redisKey, 86400)
        }
    }
    return num, episodes, err
}
```



频道排行榜

```go
//增加redis缓存 - 频道排行榜
func RedisGetChannelTop(channelId int) (int64, []VideoData, error) {
    var (
        videos []VideoData
        num    int64
    )
    conn := redisClient.PoolConnect()
    defer conn.Close()
    //定义Rediskey
    redisKey := "video:top:channel:channelId:" + strconv.Itoa(channelId)
    //判断是否存在
    exists, err := redis.Bool(conn.Do("exists", redisKey))
    if exists {
        num = 0
        res, _ := redis.Values(conn.Do("zrevrange", redisKey, "0", "10", "WITHSCORES"))
        for k, v := range res {
            fmt.Println(string(v.([]byte)))
            if k%2 == 0 {
                videoId, err := strconv.Atoi(string(v.([]byte)))
                videoInfo, err := RedisGetVideoInfo(videoId)
                if err == nil {
                    var videoDataInfo VideoData
                    videoDataInfo.Id = videoInfo.Id
                    videoDataInfo.Img = videoInfo.Img
                    videoDataInfo.Img1 = videoInfo.Img1
                    videoDataInfo.IsEnd = videoInfo.IsEnd
                    videoDataInfo.SubTitle = videoInfo.SubTitle
                    videoDataInfo.Title = videoInfo.Title
                    videoDataInfo.AddTime = videoInfo.AddTime
                    videoDataInfo.Comment = videoInfo.Comment
                    videoDataInfo.EpisodesCount = videoInfo.EpisodesCount
                    videos = append(videos, videoDataInfo)
                    num++
                }
            }
        }
    } else {
        o := orm.NewOrm()
        num, err = o.Raw("SELECT id,title,sub_title,img,img1,add_time,episodes_count,is_end FROM video WHERE status=1 AND channel_id=? ORDER BY comment DESC LIMIT 10", channelId).QueryRows(&videos)
        if err == nil {
            //保存redis
            for _, v := range videos {
                conn.Do("zadd", redisKey, v.Comment, v.Id)
            }
            conn.Do("expire", redisKey, 86400*30)
        }
    }
    return num, videos, err
}
```



视频类型排行榜

```go
//增加redis缓存 - 类型排行榜
func RedisGetTypeTop(typeId int) (int64, []VideoData, error) {
    var (
        videos []VideoData
        num    int64
    )
    conn := redisClient.PoolConnect()
    defer conn.Close()
 
    redisKey := "video:top:type:typeId:" + strconv.Itoa(typeId)
    exists, err := redis.Bool(conn.Do("exists", redisKey))
    if exists {
        num = 0
        res, _ := redis.Values(conn.Do("zrevrange", redisKey, "0", "10", "WITHSCORES"))
        for k, v := range res {
            if k%2 == 0 {
                videoId, err := strconv.Atoi(string(v.([]byte)))
                videoInfo, err := RedisGetVideoInfo(videoId)
                if err == nil {
                    var videoDataInfo VideoData
                    videoDataInfo.Id = videoInfo.Id
                    videoDataInfo.Img = videoInfo.Img
                    videoDataInfo.Img1 = videoInfo.Img1
                    videoDataInfo.IsEnd = videoInfo.IsEnd
                    videoDataInfo.SubTitle = videoInfo.SubTitle
                    videoDataInfo.Title = videoInfo.Title
                    videoDataInfo.AddTime = videoInfo.AddTime
                    videoDataInfo.Comment = videoInfo.Comment
                    videoDataInfo.EpisodesCount = videoInfo.EpisodesCount
                    videos = append(videos, videoDataInfo)
                    num++
                }
            }
        }
    } else {
        o := orm.NewOrm()
        num, err = o.Raw("SELECT id,title,sub_title,img,img1,add_time,episodes_count,is_end FROM video WHERE status=1 AND type_id=? ORDER BY comment DESC LIMIT 10", typeId).QueryRows(&videos)
        if err == nil {
            //保存redis
            for _, v := range videos {
                conn.Do("zadd", redisKey, v.Comment, v.Id)
            }
            conn.Do("expire", redisKey, 86400*30)
        }
 
    }
    return num, videos, err
}
```





### rabbitMQ使用

mq配置

```go
package mq

import (
	"bytes"
	"fmt"
	"github.com/streadway/amqp"
)

type Callback func(msg string)

func Connect() (*amqp.Connection, error) {
	conn, err := amqp.Dial("amqp://guest:guest@127.0.0.1:5672/")
	return conn, err
}

//发送端函数
func Publish(exchange string, queueName string, body string) error {
	//建立连接
	conn, err := Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	//创建通道channel
	channel, err := conn.Channel()
	if err != nil {
		return err
	}
	defer channel.Close()

	//创建队列
	q, err := channel.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	//发送消息
	err = channel.Publish(exchange, q.Name, false, false, amqp.Publishing{
		DeliveryMode: amqp.Persistent,
		ContentType:  "text/plain",
		Body:         []byte(body),
	})
	return err
}

//接受者方法
func Consumer(exchange string, queueName string, callback Callback) {
	//建立连接
	conn, err := Connect()
	defer conn.Close()
	if err != nil {
		fmt.Println(err)
		return
	}

	//创建通道channel
	channel, err := conn.Channel()
	defer channel.Close()
	if err != nil {
		fmt.Println(err)
		return
	}
	//创建queue
	q, err := channel.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	msgs, err := channel.Consume(q.Name, "", false, false, false, false, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	forever := make(chan bool)
	go func() {
		for d := range msgs {
			s := BytesToString(&(d.Body))
			callback(*s)
			d.Ack(false)
		}
	}()
	fmt.Printf("Waiting for messages")
	<-forever
}

func BytesToString(b *[]byte) *string {
	s := bytes.NewBuffer(*b)
	r := s.String()
	return &r
}

func PublishEx(exchange string, types string, routingKey string, body string) error {
	//建立连接
	conn, err := Connect()
	defer conn.Close()
	if err != nil {
		return err
	}
	//创建channel
	channel, err := conn.Channel()
	defer channel.Close()
	if err != nil {
		return err
	}

	//创建交换机
	err = channel.ExchangeDeclare(
		exchange,
		types,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	err = channel.Publish(exchange, routingKey, false, false, amqp.Publishing{
		DeliveryMode: amqp.Persistent,
		ContentType:  "text/plain",
		Body:         []byte(body),
	})
	return err
}

func ConsumerEx(exchange string, types string, routingKey string, callback Callback) {
	//建立连接
	conn, err := Connect()
	defer conn.Close()
	if err != nil {
		fmt.Println(err)
		return
	}
	//创建通道channel
	channel, err := conn.Channel()
	defer channel.Close()
	if err != nil {
		fmt.Println(err)
		return
	}

	//创建交换机
	err = channel.ExchangeDeclare(
		exchange,
		types,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	//创建队列
	q, err := channel.QueueDeclare(
		"",
		false,
		false,
		true,
		false,
		nil,
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	//绑定
	err = channel.QueueBind(
		q.Name,
		routingKey,
		exchange,
		false,
		nil,
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	msgs, err := channel.Consume(q.Name, "", false, false, false, false, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	forever := make(chan bool)
	go func() {
		for d := range msgs {
			s := BytesToString(&(d.Body))
			callback(*s)
			d.Ack(false)
		}
	}()
	fmt.Printf("Waiting for messages\n")
	<-forever
}

func PublishDlx(exchangeA string, body string) error {
	//建立连接
	conn, err := Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	//创建一个Channel
	channel, err := conn.Channel()
	if err != nil {
		return err
	}
	defer channel.Close()

	//消息发送到A交换机
	err = channel.Publish(exchangeA, "", false, false, amqp.Publishing{
		DeliveryMode: amqp.Persistent,
		ContentType:  "text/plain",
		Body:         []byte(body),
	})

	return err
}

func ConsumerDlx(exchangeA string, queueAName string, exchangeB string, queueBName string, ttl int, callback Callback) {
	//建立连接
	conn, err := Connect()
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	//创建一个Channel
	channel, err := conn.Channel()
	if err != nil {
		fmt.Println(err)
		return
	}
	defer channel.Close()

	//创建A交换机
	//创建A队列
	//A交换机和A队列绑定
	err = channel.ExchangeDeclare(
		exchangeA, // name
		"fanout",  // type
		true,      // durable
		false,     // auto-deleted
		false,     // internal
		false,     // no-wait
		nil,       // arguments
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	//创建一个queue，指定消息过期时间，并且绑定过期以后发送到那个交换机
	queueA, err := channel.QueueDeclare(
		queueAName, // name
		true,       // durable
		false,      // delete when usused
		false,      // exclusive
		false,      // no-wait
		amqp.Table{
			// 当消息过期时把消息发送到 exchangeB
			"x-dead-letter-exchange": exchangeB,
			"x-message-ttl":          ttl,
			//"x-dead-letter-queue" : queueBName,
			//"x-dead-letter-routing-key" :
		},
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	//A交换机和A队列绑定
	err = channel.QueueBind(
		queueA.Name, // queue name
		"",          // routing key
		exchangeA,   // exchange
		false,
		nil,
	)
	if err != nil {
		fmt.Println(err)
		return
	}
	//创建B交换机
	//创建B队列
	//B交换机和B队列绑定
	err = channel.ExchangeDeclare(
		exchangeB, // name
		"fanout",  // type
		true,      // durable
		false,     // auto-deleted
		false,     // internal
		false,     // no-wait
		nil,       // arguments
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	//创建一个queue
	queueB, err := channel.QueueDeclare(
		queueBName, // name
		true,       // durable
		false,      // delete when usused
		false,      // exclusive
		false,      // no-wait
		nil,        // arguments
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	//B交换机和B队列绑定
	err = channel.QueueBind(
		queueB.Name, // queue name
		"",          // routing key
		exchangeB,   // exchange
		false,
		nil,
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	msgs, err := channel.Consume(queueB.Name, "", false, false, false, false, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	forever := make(chan bool)
	go func() {
		for d := range msgs {
			s := BytesToString(&(d.Body))
			callback(*s)
			d.Ack(false)
		}
	}()

	fmt.Printf(" [*] Waiting for messages. To exit press CTRL+C\n")
	<-forever
}

```



发表评论更新排行榜发送端

```go
func SaveComment(content string, uid int, episodesId int, videoId int) error {
	o := orm.NewOrm()
	var comment Comment
	comment.Content = content
	comment.UserId = uid
	comment.EpisodesId = episodesId
	comment.VideoId = videoId
	comment.Stamp = 0
	comment.Status = 1
	comment.AddTime = time.Now().Unix()
	_, err := o.Insert(&comment)
	if err == nil {
		//修改视频的总评论数
		o.Raw("UPDATE video SET comment=comment+1 WHERE id=?", videoId).Exec()
		//修改视频剧集的评论数
		o.Raw("UPDATE video_episodes SET comment=comment+1 WHERE id=?", episodesId).Exec()

		//更新redis排行榜 - 通过MQ来实现
		//创建一个简单模式的MQ
		//把要传递的数据转换为json字符串
		videoObj := map[string]int{
			"VideoId": videoId,
		}
		videoJson, _ := json.Marshal(videoObj)
		mq.Publish("", "fyouku_top", string(videoJson))

    //延迟增加评论数(10秒后再增加一个评论数)
		videoCountObj := map[string]int{
			"VideoId":    videoId,
			"EpisodesId": episodesId,
		}
		videoCountJson, _ := json.Marshal(videoCountObj)
		mq.PublishDlx("fyouku.comment.count", string(videoCountJson))
	}
	return err
}
```



接收端

```go
package top

import (
	"encoding/json"
	"fmt"
	"fyoukuapi/models"
	"fyoukuapi/services/mq"
	redisClient "fyoukuapi/services/redis"
	"strconv"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	beego.LoadAppConfig("ini", "../../conf/app.conf")
	defaultdb := beego.AppConfig.String("defaultdb")
	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", defaultdb, 30, 30)

	mq.Consumer("", "fyouku_top", callback)
}

func callback(s string) {
	type Data struct {
		VideoId int
	}
	var data Data
	err := json.Unmarshal([]byte(s), &data)
	videoInfo, err := models.RedisGetVideoInfo(data.VideoId)
	if err == nil {
		conn := redisClient.PoolConnect()
		defer conn.Close()
		//更新排行榜
		redisChannelKey := "video:top:channel:channelId:" + strconv.Itoa(videoInfo.ChannelId)
		redisTypeKey := "video:top:type:typeId:" + strconv.Itoa(videoInfo.TypeId)
		conn.Do("zincrby", redisChannelKey, 1, data.VideoId)
		conn.Do("zincrby", redisTypeKey, 1, data.VideoId)
	}
	fmt.Printf("msg is :%s\n", s)
}

```



延迟接收端

```go
package comment

import (
	"encoding/json"
	"fmt"
	"fyoukuapi/services/mq"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	beego.LoadAppConfig("ini", "../../conf/app.conf")
	defaultdb := beego.AppConfig.String("defaultdb")
	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", defaultdb, 30, 30)

	mq.ConsumerDlx("fyouku.comment.count", "fyouku_comment_count", "fyouku.comment.count.dlx", "fyouku_comment_count_dlx", 10000, callback)
}

func callback(s string) {
	type Data struct {
		VideoId    int
		EpisodesId int
	}
	var data Data
	err := json.Unmarshal([]byte(s), &data)
	if err == nil {
		o := orm.NewOrm()
		//修改视频的总评论数
		o.Raw("UPDATE video SET comment=comment+1 WHERE id=?", data.VideoId).Exec()
		//修改视频剧集的评论数
		o.Raw("UPDATE video_episodes SET comment=comment+1 WHERE id=?", data.EpisodesId).Exec()

		//更新redis排行榜 - 通过MQ来实现
		//创建一个简单模式的MQ
		//把要传递的数据转换为json字符串
		videoObj := map[string]int{
			"VideoId": data.VideoId,
		}
		videoJson, _ := json.Marshal(videoObj)
		mq.Publish("", "fyouku_top", string(videoJson))
	}
	fmt.Printf("msg is :%s\n", s)
}

```



### 利用goroutine改造

改造评论列表获取用户信息接口

```go
//获取评论列表
// @router /comment/list [*]
func (this *CommentController) List() {
    //获取剧集数
    episodesId, _ := this.GetInt("episodesId")
    //获取页码信息
    limit, _ := this.GetInt("limit")
    offset, _ := this.GetInt("offset")
 
    if episodesId == 0 {
        this.Data["json"] = ReturnError(4001, "必须指定视频剧集")
        this.ServeJSON()
    }
    if limit == 0 {
        limit = 12
    }
    num, comments, err := models.GetCommentList(episodesId, offset, limit)
    if err == nil {
        var data []CommentInfo
        var commentInfo CommentInfo
 //改造开始===================================
        //获取uid channel
        uidChan := make(chan int, 12)
        closeChan := make(chan bool, 5)
        resChan := make(chan models.UserInfo, 12)
        //把获取到的uid放到channel中
        go func() {
            for _, v := range comments {
                uidChan <- v.UserId
            }
            close(uidChan)
        }()
        //处理uidChannel中的信息
        for i := 0; i < 5; i++ {
            go chanGetUserInfo(uidChan, resChan, closeChan)
        }
        //判断是否执行完成，信息聚合
        go func() {
            for i := 0; i < 5; i++ {
                <-closeChan
            }
            close(resChan)
            close(closeChan)
        }()
 
        userInfoMap := make(map[int]models.UserInfo)
        for r := range resChan {
            userInfoMap[r.Id] = r
        }
        for _, v := range comments {
            commentInfo.Id = v.Id
            commentInfo.Content = v.Content
            commentInfo.AddTime = v.AddTime
            commentInfo.AddTimeTitle = DateFormat(v.AddTime)
            commentInfo.UserId = v.UserId
            commentInfo.Stamp = v.Stamp
            commentInfo.PraiseCount = v.PraiseCount
            commentInfo.EpisodesId = v.EpisodesId
            //获取用户信息
            commentInfo.UserInfo, _ = userInfoMap[v.UserId]
            data = append(data, commentInfo)
        }
 
        this.Data["json"] = ReturnSuccess(0, "success", data, num)
        this.ServeJSON()
    } else {
        this.Data["json"] = ReturnError(4004, "没有相关内容")
        this.ServeJSON()
    }
}
func chanGetUserInfo(uidChan chan int, resChan chan models.UserInfo, closeChan chan bool) {
    for uid := range uidChan {
        res, err := models.GetUserInfo(uid)
        fmt.Println(res)
        if err == nil {
            resChan <- res
        }
    }
    closeChan <- true
}
```



批量发送消息改造

```go
//批量发送通知消息
// @router /send/message [*]
func (this *UserController) SendMessageDo() {
    uids := this.GetString("uids")
    content := this.GetString("content")
 
    if uids == "" {
        this.Data["json"] = ReturnError(4001, "请填写接收人~")
        this.ServeJSON()
    }
    if content == "" {
        this.Data["json"] = ReturnError(4002, "请填写发送内容")
        this.ServeJSON()
    }
    messageId, err := models.SendMessageDo(content)
    if err == nil {
        uidConfig := strings.Split(uids, ",")
        count := len(uidConfig)
 
        sendChan := make(chan SendData, count)
        closeChan := make(chan bool, count)
 
        go func() {
            var data SendData
            for _, v := range uidConfig {
                userId, _ := strconv.Atoi(v)
                data.UserId = userId
                data.MessageId = messageId
                sendChan <- data
            }
            close(sendChan)
        }()
 
        for i := 0; i < 5; i++ {
            go sendMessageFunc(sendChan, closeChan)
        }
 
        for i := 0; i < 5; i++ {
            <-closeChan
        }
        close(closeChan)
 
        this.Data["json"] = ReturnSuccess(0, "发送成功~", "", 1)
        this.ServeJSON()
    } else {
        this.Data["json"] = ReturnError(5000, "发送失败，请联系客服~")
        this.ServeJSON()
    }
}
func sendMessageFunc(sendChan chan SendData, closeChan chan bool) {
    for t := range sendChan {
        fmt.Println(t)
        models.SendMessageUserMq(t.UserId, t.MessageId)
    }
    closeChan <- true
}
```



### ES使用

配置

```go
import (
    "encoding/json"
    "fmt"
 
    "github.com/astaxie/beego/httplib"
)
 
var esUrl string
 
func init() {
    esUrl = "http://127.0.0.1:9200/"
}
 
func EsSearch(indexName string, query map[string]interface{}, from int, size int, sort []map[string]string) HitsData {
    searchQuery := map[string]interface{}{
        "query": query,
        "from":  from,
        "size":  size,
        "sort":  sort,
    }
 
    req := httplib.Post(esUrl + indexName + "/_search")
    req.JSONBody(searchQuery)
 
    str, err := req.String()
    fmt.Println(str)
    if err != nil {
        fmt.Println(err)
    }
    var stb ReqSearchData
    err = json.Unmarshal([]byte(str), &stb)
 
    return stb.Hits
}
 
//解析获取到的值
type ReqSearchData struct {
    Hits HitsData `json:"hits"`
}
type HitsData struct {
    Total TotalData     `json:"total"`
    Hits  []HitsTwoData `json:"hits"`
}
type TotalData struct {
    Value    int
    Relation string
}
type HitsTwoData struct {
    Source json.RawMessage `json:"_source"`
}
 
//添加
func EsAdd(indexName string, id string, body map[string]interface{}) bool {
    req := httplib.Post(esUrl + indexName + "/_doc/" + id)
    req.JSONBody(body)
 
    str, err := req.String()
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(str)
    return true
}
 
//修改
func EsEdit(indexName string, id string, body map[string]interface{}) bool {
    bodyData := map[string]interface{}{
        "doc": body,
    }
 
    req := httplib.Post(esUrl + indexName + "/_doc/" + id + "/_update")
    req.JSONBody(bodyData)
 
    str, err := req.String()
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(str)
    return true
}
 
//删除
func EsDelete(indexName string, id string) bool {
    req := httplib.Delete(esUrl + indexName + "/_doc/" + id)
    str, err := req.String()
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(str)
    return true
}
```



改造搜索接口

```go
//搜索接口
// @router /video/search [*]
func (this *VideoController) Search() {
    //获取搜索关键字
    keyword := this.GetString("keyword")
    //获取翻页信息
    limit, _ := this.GetInt("limit")
    offset, _ := this.GetInt("offset")
 
    if keyword == "" {
        this.Data["json"] = ReturnError(4001, "关键字不能为空")
        this.ServeJSON()
    }
    if limit == 0 {
        limit = 12
    }
 
    sort := []map[string]string{map[string]string{"id": "desc"}}
    query := map[string]interface{}{
        "bool": map[string]interface{}{
            "must": map[string]interface{}{
                "term": map[string]interface{}{
                    "title": keyword,
                },
            },
        },
    }
 
    res := es.EsSearch("fyouku_video", query, offset, limit, sort)
    total := res.Total.Value
    var data []models.Video
 
    for _, v := range res.Hits {
        var itemData models.Video
        err := json.Unmarshal([]byte(v.Source), &itemData)
        if err == nil {
            data = append(data, itemData)
        }
    }
    if total > 0 {
        this.Data["json"] = ReturnSuccess(0, "success", data, int64(total))
        this.ServeJSON()
    } else {
        this.Data["json"] = ReturnError(4004, "没有相关内容")
        this.ServeJSON()
    }
}
 
 
//导入ES脚本
// @router /video/send/es [*]
func (this *VideoController) SendEs() {
    _, data, _ := models.GetAllList()
    for _, v := range data {
        body := map[string]interface{}{
            "id":                   v.Id,
            "title":                v.Title,
            "sub_title":            v.SubTitle,
            "add_time":             v.AddTime,
            "img":                  v.Img,
            "img1":                 v.Img1,
            "episodes_count":       v.EpisodesCount,
            "is_end":               v.IsEnd,
            "channel_id":           v.ChannelId,
            "status":               v.Status,
            "region_id":            v.RegionId,
            "type_id":              v.TypeId,
            "episodes_update_time": v.EpisodesUpdateTime,
            "comment":              v.Comment,
            "user_id":              v.UserId,
            "is_recommend":         v.IsRecommend,
        }
        es.EsAdd("fyouku_video", "video-"+strconv.Itoa(v.Id), body)
    }
}
```



改造视频列表

```go
func GetChannelVideoListEs(channelId int, regionId int, typeId int, end string, sort string, offset int, limit int) (int64, []Video, error) {
    query := make(map[string]interface{})
    bools := make(map[string]interface{})
    var must []map[string]interface{}
    must = append(must, map[string]interface{}{"term": map[string]interface{}{
        "channel_id": channelId,
    }})
    must = append(must, map[string]interface{}{"term": map[string]interface{}{
        "status": 1,
    }})
    if regionId > 0 {
        must = append(must, map[string]interface{}{"term": map[string]interface{}{
            "region_id": regionId,
        }})
    }
    if typeId > 0 {
        must = append(must, map[string]interface{}{"term": map[string]interface{}{
            "type_id": typeId,
        }})
    }
    if end == "n" {
        must = append(must, map[string]interface{}{"term": map[string]interface{}{
            "is_end": 0,
        }})
    } else if end == "y" {
        must = append(must, map[string]interface{}{"term": map[string]interface{}{
            "is_end": 1,
        }})
    }
    bools["must"] = must
    query["bool"] = bools
 
    sortData := []map[string]string{map[string]string{"add_time": "desc"}}
    if sort == "episodesUpdateTime" {
        sortData = []map[string]string{map[string]string{"episodes_update_time": "desc"}}
    } else if sort == "comment" {
        sortData = []map[string]string{map[string]string{"comment": "desc"}}
    } else if sort == "addTime" {
        sortData = []map[string]string{map[string]string{"add_time": "desc"}}
    }
 
    res := es.EsSearch("fyouku_video", query, offset, limit, sortData)
    total := res.Total.Value
    var data []Video
    for _, v := range res.Hits {
        var itemData Video
        err := json.Unmarshal([]byte(v.Source), &itemData)
        if err == nil {
            data = append(data, itemData)
        }
    }
    return int64(total), data, nil
}
```





## 微服务

### micro

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202306271827243.png)



![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202306271828545.png)





![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202306271829427.png)





![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202306271830619.png)




---
layout: post
title:  "elasticSearch入门"
categories: elasticSearch
tags: elasticSearch
author: 百味皆苦
music-id: 5188665
---

* content
{:toc}
### 简介

- 基于Apache Lucene构建的开源搜索引擎
- 采用Java编写，提供简单易用的RESTful API
- 轻松的横向扩展，可支持PB级的结构化和非结构化数据处理

#### 应用场景

- 海量数据分析引擎
- 站内搜索引擎
- 数据仓库
- 英国卫报-实时分析公众对文章的回应
- 维基百科、GitHub-站内实时搜索
- 百度-实时日志监控平台
- 阿里巴巴、谷歌、京东、腾讯、小米等等

#### 软件安装

- 单机安装

```
单机安装ElasticSearch

安装前，请确保已经安装JDK1.8
安装前，请确保已经安装nodejs6.0以上

官网：https://www.elastic.co/products/elasticsearch
下载安装包：https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.6.0.tar.gz
解压安装包：tar -vxf elasticsearch-5.6.0.tar.gz
cd elasticsearch-5.6.0.tar.gz

启动前，检查JDK环境
java -v
请确保已经安装JDK1.8

启动elasticsearch
sh ./bin/elasticsearch
当日志输出started时，表示启动成功

验证服务
127.0.0.1:9200
elasticsearch服务默认监听9200端口

访问：http://127.0.0.1:9200
如果出现版本信息，则安装成功

```

- 插件安装

```
实用插件Head安装

打开github：https://github.com/mobz/elasticsearch-head
下载插件包：https://codeload.github.com/mobz/elasticsearch-head/zip/master
unzip elasticsearch-head-master.zip

cd elasticsearch-head-master

检查Node环境
node -v
请确保已经安装nodejs6.0以上

安装插件
npm install
启动插件
npm run start
输出日志表示启动成功
Started connect web server on http://localhost:9100
访问
http://localhost:9100

ElasticSearch整合elasticsearch-head插件
cd elasticsearch-5.6.0

vim config/elasticsearch.yml
在配置文件的最后面加上
允许head插件跨域访问rest接口
http.cors.allowed: true
http.cors.allow-origin: "*"
:wq

后台启动
./bin/elasticsearch -d

再次重新启动elasticsearch-head插件
cd elasticsearch-head-master
启动插件
npm run start
访问
http://localhost:9100

```

- 集群安装

```
集群安装
1个master、2个slave

master节点配置

配置当前节点为主节点
cd elasticsearch-5.6.0
修改配置
vim config/elasticsearch.yml
在配置文件的最后面加上

# 指定集群的名字
cluster.name: myes
# 指定当前节点的名字
node.name: master
# 指定当前节点为master
node.master: true
# 指定绑定的IP
network.host: 127.0.0.1
# 使用默认端口：9200
:wq

ps -ef | grep 'pwd'

kill pid
重新启动
./bin/elasticsearch -d
检查服务是否正常启动
http://localhost:9200

slave节点配置

mkdir es_slave
cp elasticsearch-5.6.0.tar.gz es_slave/
cd es_slave
tar -vxf elasticsearch-5.6.0.tar.gz
cp -r elasticsearch-5.6.0 es_slave1
cp -r elasticsearch-5.6.0 es_slave2

修改es_slave1配置
cd es_slave1
vim config/elasticsearch.yml
在配置文件的最后面加上

# 指定集群的名字：需要和master节点一致
cluster.name: myes
# 指定当前节点的名字
node.name: slave1
# 指定绑定的IP
network.host: 127.0.0.1
# 指定当前节点绑定端口号8200
http.port: 8200
# 该配置主要是为了找到master节点
discovery.zen.ping.unicast.hosts: ["127.0.0.1"]
:wq

启动服务
./bin/elasticsearch -d
检查服务是否正常启动
http://localhost:9100

安装之前的步骤配置slave2
cd es_slave2
vim config/elasticsearch.yml
在配置文件的最后面加上

# 指定集群的名字：需要和master节点一致
cluster.name: myes
# 指定当前节点的名字
node.name: slave2
# 指定绑定的IP
network.host: 127.0.0.1
# 指定当前节点绑定端口号8000
http.port: 8000
# 该配置主要是为了找到master节点
discovery.zen.ping.unicast.hosts: ["127.0.0.1"]
:wq

启动服务
./bin/elasticsearch -d
检查服务是否正常启动
http://localhost:9100

```



### 基础概念

- 集群和节点

```
一个集群是由一个或多个ES组成的集合
每一个集群都有一个唯一的名字
每一个节点都是通过集群的名字来加入集群的
每一个节点都有自己的名字
节点能够存储数据，参与集群索引数据以及搜索数据的独立服务

```

- 基础概念

```
索引：含有相同属性的文档集合
类型：索引可以定义一个或多个类型，文档必须属于一个类型
（通常会定义有相同字段的文档作为一个类型）
文档：文档是可以被索引的基本数据单位

```

```
索引相当于SQL里的DataBase，也就是数据库
类型相当于SQL里的Table，也就是表
文档相当于SQL里的一行记录，也就是一行数据

```

```
假设有一个信息查询系统，使用ES做存储。那么里面的数据就可以分为各种各样的索引，比如：汽车索引、图书索引、家具索引等等。图书索引又可以细分为各种类型，比如：科普类、小说类、技术类等等。具体到每一本书籍，就是文档，就是整个图书里面最小的存储单位。

```

- 索引高级概念

```
分片：每个索引都有多个分片，每个分片是一个Lucene索引
备份：拷贝一份分片就完成了分片的备份
ES默认在创建索引时，会创建5个分片、1个备份
分片的数量只能在创建索引时设置，而不能在后期进行修改
备份是可以动态修改的

```



### 基本用法

#### 创建索引

- ES的API组成结构：使用RESTful API风格来命名API

```
API基本格式：http://<ip>:<port>/<索引>/<类型>/<文档id>
常用HTTP动词：GET/PUT/POST/DELETE
```

- 使用Head插件创建非结构化索引


```
访问：localhost:9100
路径：索引->新建索引->索引名称：book->点击OK
索引名称：必须小写，不能有中划线
```

- 如何区分索引是结构化的还是非结构化的


```
结合Head插件查看
点击索引信息->索引信息->mappings节点
当mappings节点后的内容为空时：非结构化索引

```

- 使用Head插件创建结构化索引


```
路径：复合查询->查询->book/novel/_mappings
指定映射：使用JSON结构体
{
"novel":{
"propertise":{
  "title":{"type":"test"}
   }
}
}
然后勾选易读->点击验证JSON->提交请求
再次查看mappings节点时，已经不是空的了
```

- 使用PostMan创建索引


```
PUT：127.0.0.1:9200/people
Body->raw->JSON(application/json)
编写JSON体
点击Send，然后到Head插件中查看people索引信息
具体json如下：
```

```json
{
    "settings":{
        "number_of_shards":3,
        "number_of_replicas":1
    },
    "mappings":{
        "man":{
            "properties":{
                "name":{
                    "type": "text"
                },
                "country":{
                    "type": "keyword"
                },
                "age":{
                    "type": "integer"
                },
                "date":{
                    "type": "date",
                    "format":"yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
                }
            }
        },
        "woman":{

        }
    }

}
```

#### 新增文档

```
指定文档id新增
自动产生文档id新增
文档id：唯一索引值指向文档数据
```

- 使用PostMan工具新增数据-指定文档id新增


```
PUT：127.0.0.1::9200/people/man/1
Body->raw->JSON(application/json)
{
"name":"zc",
"country":"china",
"age":22,
"date":"1995-01-01"
}
点击Send，可以看到ES响应的信息
使用Head插件查看索引下的数据，docs字段代表索引下所有文档的数量值
点击数据浏览，可以看见刚刚新增的数据
```

- 使用PostMan工具新增数据-自动产生文档id新增


```
POST：127.0.0.1::9200/people/man/
Body->raw->JSON(application/json)
{
"name":"myzc",
"country":"china",
"age":22,
"date":"1995-02-01"
}
点击Send，可以看到ES响应的信息
使用Head插件，点击数据浏览，可以看见刚刚新增的数据
```

#### 修改文档

- 直接修改文档，脚本修改文档
- 使用PostMan工具修改文档-指定文档ID修改


```
POST：127.0.0.1:9200/people/man/1/_update
Body->raw->JSON(application/json)
{
"doc":{
    "name":"who is zc"
}
}
点击Send，可以看到ES响应的信息
使用Head插件，点击数据浏览，可以看见刚刚修改的数据
```

- 使用PostMan工具修改文档-指定文档ID使用脚本修改


```
POST：127.0.0.1:9200/people/man/1/_update
Body->raw->JSON(application/json)
{
"script":{
    "lang":"painless",
    "inline":"ctx._sources.age+=10"
}
}
或使用以下格式
{
"script":{
    "lang":"painless",
    "inline":"ctx._sources.age = params.age",
    "params":{
        "age":100
    }
}
}
点击Send，可以看到ES响应的信息
使用Head插件，点击数据浏览，可以看见刚刚修改的数据
```

#### 删除文档

- 使用PostMan删除文档-指定文档ID

```
DELETE：127.0.0.1:9200/people/man/1
点击Send，可以看到ES响应的信息
使用Head插件，点击数据浏览，可以看见数据已经删除
```

- 使用Head插件删除索引


```
路径：概览->book->动作->删除->输入删除->确定
注意：删除操作本身很危险，删除索引时会删除它所有的文档数据
```

- 使用PostMan删除索引


```
DELETE：127.0.0.1:9200/people
点击Send，可以看到ES响应的信息
使用Head插件，点击数据浏览，可以看见索引已经删除
```

#### 查询语法

- ES查询分类：
  - 简单查询
  - 条件查询
  - 聚合查询
- 前置条件，创建book索引，并预先新增一些数据
- 使用PostMan简单查询-指定文档ID


```
GET：127.0.0.1:9200/book/novel/1
点击Send，可以看到ES响应的信息
```

- 使用PostMan条件查询


```
POST：127.0.0.1:9200/book/_search
Body->raw->JSON(application/json)
编写查询JSON体
点击Send，可以看到ES响应的信息
```

- 编写查询JSON体如下，查询所有数据

```json
{
    "query":{
        "match_all":{}
    }
}
```

- 用from指定从哪里返回，用size指定返回的数据大小


```json
{
    "query":{
        "match_all":{}
    },
    "from":1,
    "size":1
}
```

- 使用关键字查询，查询标题含有ElasticSearch的数据


```json
{
    "query":{
        "match":{
            "title":"ElasticSearch"
        }
    }
}
```

- 使用sort指定结果集排序-按照出版日期倒序


```json
{
    "query":{
        "match":{
            "title":"ElasticSearch"
        }
    },
    "sort":[
        {
            "publish_date":{
                "order":"desc"
            }
        }   
    ]
}
```

- 按照书籍的字数进行单个聚合查询


```json
{
    "aggs":{
        "group_by_word_count":{
            "terms":{
                "field":"word_count"
            }
        }
    }
}
```

- 按照书籍的字数及出版日期进行多个聚合查询


```json
{
    "aggs":{
        "group_by_word_count":{
            "terms":{
                "field":"word_count"
            }
        },
        "group_by_publish_date":{
            "terms":{
                "field":"publish_date"
            }
        }
    }
}
```

- 对书籍字数进行统计计算


```json
{
    "aggs":{
        "grades_word_count":{
            "stats":{
                "field":"word_count"
            }   
        }
    }
}
```

#### 高阶查询

##### query语法

```
子条件查询：特定字段查询所指特定值
query context
filter context
复合条件查询：以一定的逻辑组合子条件查询
固定分数查询
布尔查询
```

- query context介绍


```
在查询过程中，除了判断是否满足查询条件外
ES还会计算一个_score来标识匹配的程度
旨在判断目标文档和查询条件匹配的有多好
```

- query context查询


```
全文本查询：针对文本类型数据
字段级别查询：针对结构化数据，如数字、日期等
```

- 使用PostMan进行query context文本查询


```
POST：127.0.0.1:9200/book/_search
Body->raw->JSON(application/json)
编写查询JSON体
点击Send，可以看到ES响应的信息
```

- 使用match关键字模糊匹配


```json
{
    "query":{
        "match":{
            "author":"wali"
        }
    }
}
```

- 使用match_phrase关键字习语匹配


```json
{
    "query":{
        "match_phrase":{
            "author":"ElasticSearch入门"
        }
    }
}
```

- 使用multi_match查询作者和标题包含wali的数据


```json
{
    "query":{
        "multi_match":{
            "query":"wali",
            "fields":["author","title"]
        }
    }
}
```

- 使用query_string进行语法查询


```
{
    "query":{
        "query_string":{
            "query":"(ElasticSearch AND 大法) OR Python"
        }
    }
}
```

- 使用query_string查询多个字段


```
{
    "query":{
        "query_string":{
            "query":"wali OR ElasticSearch",
            "field":["title","author"]
        }
    }
}
```

- 使用PostMan进行query context字段查询


```
POST：127.0.0.1:9200/book/_search
Body->raw->JSON(application/json)
编写查询JSON体
点击Send，可以看到ES响应的信息

```

- 查询字数在某个特定集（1000）的书籍


```json
{
    "query":{
        "term":{
            "word_count":1000
        }
    }
}
```

- 查询字符在某个范围（大于等于1000-小于等于2000）的书籍


```json
{
    "query":{
        "range":{
            "word_count":{
                "gte":1000,
                "lte":2000
            }
        }
    }
}
```

- 查询出版日期在某个范围（2017-01-01至2017-12-31）的书籍


```json
{
    "query":{
        "range":{
            "publish_date":{
                "gte":"2017-01-01",
                "lte":"2017-12-31"//或 "lte":"now"
            }
        }
    }
}
```

##### filter语法

- filter context介绍：在查询过程中，只判断该文档是否满足条件，只有yes或者no


- 使用PostMan进行filter context查询


```
POST：127.0.0.1:9200/book/_search
Body->raw->JSON(application/json)
点击Send，可以看到ES响应的信息
```

- 查询字数1000的书籍


```json
{
    "query":{
        "bool":{
            "filter":{
                "term":{
                    "word_count":1000
                }
            }
        }
    }
}
```

#### 复合查询

- 常用复合条件查询：固定分数查询，布尔查询
- 使用PostMan进行复合查询


```
127.0.0.1:9200 /_search
Body->raw->JSON(application/json)
点击Send，可以看到ES响应的信息
```

- 全文搜索-标题含有ElasticSearch的书籍


```json
{
    "query":{
        "constant_score":{
            "filter":{
                "match":{
                    "title": "ElasticSearch"
                }
            },
            "boost":2
        }
    }
}
```

- 布尔查询- should满足任意条件


```json
{
    "query":{
        "bool":{
            "should":[
                {
                    "match":{
                        "author":"wali"
                    }
                },
                {
                    "match":{
                        "title":"ElasticSearch"
                    }
                }
            ]
        }
    }
}
```

- 布尔查询- must满足全部条件


```json
{
    "query":{
        "bool":{
            "must":[
                {
                    "match":{
                        "author":"wali"
                    }
                },
                {
                    "match":{
                        "title":"ElasticSearch"
                    }
                }
            ]
        }
    }
}
```

- 使用must和filter复合查询


```json
{
    "query":{
        "bool":{
            "must":[
                {
                    "match":{
                        "author":"wali"
                    }
                },
                {
                    "match":{
                        "title":"ElasticSearch"
                    }
                }
            ],
            "filter":[
                {
                    "term":{
                        "word_count":1000
                    }
                }
            ]
        }
    }
}
```

- 布尔查询- must_not一定不能满足的条件


```json
{
    "query":{
        "bool":{
            "must_not":{
                "term":{
                    "author":"wali"
                }
            }
        }
    }
}
```


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



#### 用途

收集日志或交易数据，并且要分析和挖掘此数据以查找趋势，统计信息，摘要或异常。在这种情况下，您可以使用 Logstash（Elasticsearch / Logstash / Kibana堆栈的一部分）来收集，聚合和解析数据，然后让 Logstash 将这些数据提供给 Elasticsearch。数据放入 Elasticsearch 后，您可以运行搜索和聚合以挖掘您感兴趣的任何信息。



#### 工作原理

Elasticsearch 的原始数据从哪里来？

原始数据从多个来源 ( 包括日志、系统指标和网络应用程序 ) 输入到 Elasticsearch 中。



Elasticsearch 的数据是怎么采集的？

数据采集指在 Elasticsearch 中进行索引之前解析、标准化并充实这些原始数据的过程。这些数据在 Elasticsearch 中索引完成之后，用户便可针对他们的数据运行复杂的查询，并使用聚合来检索自身数据的复杂汇总。这里用到了 Logstash



怎么可视化查看想要检索的数据？

这里就要用到 Kibana 了，用户可以基于自己的数据进行搜索、查看数据视图等。



#### ELK

Logstash 就是 `ELK` 中的 `L`。

Logstash 是 Elastic Stack 的核心产品之一，可用来对数据进行聚合和处理，并将数据发送到 Elasticsearch。Logstash 是一个开源的服务器端数据处理管道，允许您在将数据索引到 Elasticsearch 之前同时从多个来源采集数据，并对数据进行充实和转换。



Kibana 是一款适用于 Elasticsearch 的数据可视化和管理工具，可以提供实时的直方图、线性图等。





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
索引：含有相同属性的文档集合；Elasticsearch 会以 JSON 文档的形式存储数据。每个文档都会在一组键 ( 字段或属性的名称 ) 和它们对应的值 ( 字符串、数字、布尔值、日期、数值组、地理位置或其他类型的数据 ) 之间建立联系。
Elasticsearch 使用的是一种名为倒排索引的数据结构，这一结构的设计可以允许十分快速地进行全文本搜索。倒排索引会列出在所有文档中出现的每个特有词汇，并且可以找到包含每个词汇的全部文档。
在索引过程中，Elasticsearch 会存储文档并构建倒排索引，这样用户便可以近实时地对文档数据进行搜索。索引过程是在索引 API 中启动的，通过此 API 您既可向特定索引中添加 JSON 文档，也可更改特定索引中的 JSON 文档。

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



#### 倒排索引

假如数据库有如下电影记录：

1-大话西游

2-大话西游外传

3-解析大话西游

4-西游降魔外传

5-梦幻西游独家解析

**分词：将整句分拆为单词**

| 序号 | 保存到 ES 的词 | 对应的电影记录序号 |
| ---- | -------------- | ------------------ |
| A    | 西游           | 1,2, 3,4, 5        |
| B    | 大话           | 1,2, 3             |
| C    | 外传           | 2,4, 5             |
| D    | 解析           | 3,5                |
| E    | 降魔           | 4                  |
| F    | 梦幻           | 5                  |
| G    | 独家           | 5                  |

**检索：独家大话西游**

将 `独家大话西游` 解析拆分成 `独家`、`大话`、`西游`

ES 中 A、B、G 记录 都有这三个词的其中一种， 所以 1,2, 3,4, 5 号记录都有相关的词被命中。

1 号记录命中 2 次， A、B 中都有 ( 命中 `2` 次 ) ，而且 1 号记录有 `2` 个词，相关性得分：`2` 次/`2` 个词=`1`

2 号记录命中 2 个词 A、B 中的都有 ( 命中 `2` 次 ) ，而且 2 号记录有 `2` 个词，相关性得分：`2` 次/`3` 个词= `0.67`

3 号记录命中 2 个词 A、B 中的都有 ( 命中 `2` 次 ) ，而且 3 号记录有 `2` 个词，相关性得分：`2` 次/`3` 个词= `0.67`

4 号记录命中 2 个词 A 中有 ( 命中 `1` 次 ) ，而且 4 号记录有 `3` 个词，相关性得分：`1` 次/`3` 个词= `0.33`

5 号记录命中 2 个词 A 中有 ( 命中 `2` 次 ) ，而且 4 号记录有 `4` 个词，相关性得分：`2` 次/`4` 个词= `0.5`

**所以检索出来的记录顺序如下：**

 1-大话西游 ( 想关性得分：1 )

 2-大话西游外传 ( 想关性得分：0.67 )

 3-解析大话西游 ( 想关性得分：0.67 )

 5-梦幻西游独家解析 ( 想关性得分：0.5 )

 4-西游降魔 ( 想关性得分：0.33 )







### 基本用法

#### cat用法

```
GET /_cat/nodes: 查看所有节点
GET /_cat/health: 查看 es 健康状况
GET /_cat/master: 查看主节点
GET /_cat/indices: 查看所有索引

查询汇总：
/_cat/allocation
/_cat/shards
/_cat/shards/{index}
/_cat/master
/_cat/nodes
/_cat/tasks
/_cat/indices
/_cat/indices/{index}
/_cat/segments
/_cat/segments/{index}
/_cat/count
/_cat/count/{index}
/_cat/recovery
/_cat/recovery/{index}
/_cat/health
/_cat/pending_tasks
/_cat/aliases
/_cat/aliases/{alias}
/_cat/thread_pool
/_cat/thread_pool/{thread_pools}
/_cat/plugins
/_cat/fielddata
/_cat/fielddata/{fields}
/_cat/nodeattrs
/_cat/repositories
/_cat/snapshots/{repository}
/_cat/templates
```









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



在 `member` 索引下的 `external` 类型下保存标识为 `1` 的数据。

```json

//PUT member/external/1

{
"name":"jay huang"
}


//响应
{
    "_index": "member", //在哪个索引
    "_type": "external",//在那个类型
    "_id": "2",//记录 id
    "_version": 7,//版本号
    "result": "updated",//操作类型
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 9,
    "_primary_term": 1
}
```



PUT 和 POST 都可以创建记录。

POST：如果不指定 id，自动生成 id。如果指定 id，则修改这条记录，并新增版本号。

PUT：必须指定 id，如果没有这条记录，则新增，如果有，则更新。









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

### 整合springboot

- pom

```xml
<properties>
	<elasticsearch.version>5.5.2</elasticsearch.version>
</properties>

<dependency>
	<groupId>org.elasticsearch.client</groupId>
    <artifactId>transport</artifactId>
    <version>${elasticsearch.version}</version>
</dependency>
<dependency>
	<groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.7</version>
</dependency>
```

- 编写ES配置类

```java
@Configuration
public class EsConfig {

    @Bean
    public TransportClient client() throws UnknownHostException{
        //新建一个服务地址
        InetSocketTransportAddress node = new InetSocketTransportAddress(InetAddress.getByName("localhost"),9300);

        Settings settings = Settings.builder()
                // es集群名称
                .put("cluster.name", "myes")
                .build();

        TransportClient client = new PreBuiltTransportClient(settings);
        client.addTransportAddress(node);

        return client;
    }

}
```

- 编写图书接口类

```java
/**
 * @title 图书REST接口类
 * @describe 调ES接口
 */
@RestController
public class BookRest {

    @Autowired
    private TransportClient client;

    @GetMapping("/")
    public String index(){
        return "index";
    }

    /**
     * @describe 查询接口
     * @author zc
     * @version 1.0 2017-09-15
     */
    @GetMapping("/get/book/novel")
    public ResponseEntity<?> get(@RequestParam(name="id",defaultValue="")String id){

        if(id.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        GetResponse result = this.client.prepareGet("book","novel",id).get();

        if(!result.isExists()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(result.getSource(), HttpStatus.OK);
    }

    /**
     * @describe 增加接口
     * @author zc
     * @version 1.0 2017-09-15
     */
    @PostMapping("/add/book/novel")
    public ResponseEntity<?> add(
            @RequestParam(name="title")String title,
            @RequestParam(name="author")String author,
            @RequestParam(name="word_count")int wordCount,
            @RequestParam(name="publish_date") @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss") Date publishDate){

        try {
            //构建一个json
            XContentBuilder content = XContentFactory.jsonBuilder()
                .startObject()
                .field("title",title)
                .field("author", author)
                .field("word_count", wordCount)
                .field("publish_date", publishDate.getTime())
                .endObject();
            //获取返回结果
            IndexResponse result = this.client.prepareIndex("book","novel").setSource(content).get();
            return new ResponseEntity<>(result.getId(),HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @describe 删除接口
     * @author zc
     * @version 1.0 2017-09-15
     */
    @DeleteMapping("/delete/book/novel")
    public ResponseEntity<?> delete(@RequestParam(name="id",defaultValue="")String id){
        DeleteResponse result = this.client.prepareDelete("book", "novel", id).get();
        return new ResponseEntity<>(result.toString(),HttpStatus.OK);
    }

    /**
     * @describe 修改接口
     * @author zc
     * @version 1.0 2017-09-15
     */
    @DeleteMapping("/update/book/novel")
    public ResponseEntity<?> update(
            @RequestParam(name="id",defaultValue="")String id,
            @RequestParam(name="title",required=false)String title,
            @RequestParam(name="author",required=false)String author){

        UpdateRequest update = new UpdateRequest("book","novel",id);
        try {
            XContentBuilder builder = XContentFactory.jsonBuilder()
                .startObject();
            if(!StringUtils.isEmpty(title)){
                builder.field("title",title);
            }
            if(!StringUtils.isEmpty(author)){
                builder.field("author", author);
            }
            builder.endObject();
            update.doc(builder);
            UpdateResponse result = this.client.update(update).get();
            return new ResponseEntity<>(result.toString(),HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @describe 复合查询
     * @author zc
     * @version 1.0 2017-09-15
     */
    @DeleteMapping("/query/book/novel")
    public ResponseEntity<?> query(
            @RequestParam(name="author",required=false)String author,
            @RequestParam(name="title",required=false)String title,
            @RequestParam(name="gt_word_count",defaultValue="0") int gtWordCount,
            @RequestParam(name="lt_word_count",required=false) Integer ltWordCount){

        // 构建布尔查询
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        if(!StringUtils.isEmpty(author)){
            boolQuery.must(QueryBuilders.matchQuery("author", author));
        }
        if(!StringUtils.isEmpty(title)){
            boolQuery.must(QueryBuilders.matchQuery("title", title));
        }

        // 构建范围查询
        RangeQueryBuilder rangeQuery = QueryBuilders.rangeQuery("word_count")
            .from(gtWordCount);
        if(ltWordCount != null && ltWordCount > 0){
            rangeQuery.to(ltWordCount);
        }

        // 使用filter构建
        boolQuery.filter(rangeQuery);

        SearchRequestBuilder builder = this.client.prepareSearch("book")
            .setTypes("novel")
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
            .setQuery(boolQuery)
            .setFrom(0)
            .setSize(10);

        System.out.println("[ES查询请求参数]："+builder);

        SearchResponse response = builder.get();

        List<Map<String,Object>> result = new ArrayList<Map<String,Object>>();

        for(SearchHit hit:response.getHits()){
            result.add(hit.getSource());
        }

        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
```


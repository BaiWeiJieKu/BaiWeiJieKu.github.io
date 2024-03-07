---
layout: post
title: "Python3-fastAPI框架"
categories: Python
tags: Python
author: 百味皆苦
music-id: 29393038
---

* content
{:toc}


## 简介

官网：https://fastapi.tiangolo.com/zh/
课件：https://www.yuque.com/gengdiniu/vt4aq6/gygwu471ql38nzaq



## quickStart案例

1：idea创建项目：https://www.jb51.net/python/303282zd0.htm

2：安装框架和服务器

```
pip install fastapi

pip install uvicorn
```



3：demo

```python
from fastapi import FastAPI  # FastAPI 是一个为你的 API 提供了所有功能的 Python 类。
import uvicorn #web服务器

# 这个实例将是创建你所有 API 的主要交互对象。这个 app 同样在如下命令中被 uvicorn 所引用
app = FastAPI()  

# 启动步骤：在本文件的目录下执行：uvicorn testmain:app --reload   其中冒号左边是文件名，右边是 app 的名称
@app.get("/")
async def root():
    return {"message": "Hello yuan"}


if __name__ == '__main__':
    print("Hello World")
    
    # 命令行运行：uvicorn testmain:app --reload
    # 运行 uvicorn
    uvicorn.run("testmain:app", host="127.0.0.1", port=8080, debug=True, reload=True)
```



4：步骤讲解

（1）导入 FastAPI。

（2）创建一个 app 实例。

（3）编写一个路径操作装饰器（如 @app.get(“/”)）。

（4）编写一个路径操作函数（如上面的 def root(): …）

（5）定义返回值

（6）运行开发服务器（如 uvicorn main:app --reload）



5：交互式api文档

此外，fastapi有着**非常棒的交互式 API 文档**，这一点很吸引人。

跳转到 http://127.0.0.1:8000/docs。你将会看到自动生成的交互式 API 文档。



## 路径映射装饰器

fastapi支持各种请求方式：

```python
@app.get()
@app.post()
@app.put()
@app.patch()
@app.delete()
@app.options()
@app.head()
@app.trace()
```



demo

```python
from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/get")
def get_test():
    return {"method": "get方法"}


@app.post("/post")
def post_test():
    return {"method": "post方法"}


@app.put("/put")
def put_test():
    return {"method": "put方法"}


@app.delete("/delete")
def delete_test():
    return {"method": "delete方法"}
```



装饰器参数

```python
@app.post(
    "/items/{item_id}",
    response_model=Item,
    status_code=status.HTTP_200_OK,
    tags=["AAA"],
    summary="this is summary",
    description="this is description",
    response_description= "this is response_description",
    deprecated=False,
)
```



## 路径装饰器路由

目录结构

```
apps
  ---app01
    ---urls.py
  ---app02
    ---urls.py

main.py
```



app01下的urls.py

```python
from fastapi import APIRouter

shop = APIRouter()

# 商品相关接口
@shop.get("/food")
def shop_food():
    return {"shop": "food"}


@shop.get("/bed")
def shop_food():
    return {"shop": "bed"}
```



App02下的urls.py

```python
from fastapi import APIRouter

user = APIRouter()

# 用户相关接口

@user.post("/login")
def user_login():
    return {"user": "login"}


@user.post("/reg")
def user_reg():
    return {"user": "reg"}
```



main.py

```python
from typing import Union
from fastapi import FastAPI
import uvicorn

from apps.app01.urls import shop
from apps.app02.urls import user

app = FastAPI()

app.include_router(shop, prefix="/shop", tags=["第一章节：商城接口", ])
app.include_router(user, prefix="/user", tags=["第二章节：用户中心接口", ])

if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8080, debug=True, reload=True)
```



## 路径参数

基本使用

```python
@app.get("/user/{user_id}")
def get_user(user_id):
    print(user_id, type(user_id))
    return {"user_id": user_id}
```



指定参数类型

```python
@app.get("/user/{user_id}")
def get_user(user_id: int):
    print(user_id, type(user_id))
    return {"user_id": user_id}
```



执行顺序

比如` /users/me`，我们假设它用来获取关于当前用户的数据

使用路径 `/user/{username}` 来通过用户名 获取关于特定用户的数据。

由于路径操作是按顺序依次运行的，你需要确保路径 `/user/me` 声明在路径` /user/{username}`之前

```python
@app.get("/user/me")
async def read_user_me():
    return {"username": "the current user"}

@app.get("/user/{username}")
async def read_user(username: str):
    return {"username": username}
```



## 请求参数

路径函数中声明不属于路径参数的其他函数参数时，它们将被自动解释为"查询字符串"参数，就是 url? 之后用`&`分割的 key-value 键值对。

```python
from typing import Union,Optional
# 有默认值即可选，否则必选
@app.get("/jobs/{kd}")
async def search_jobs(kd: str, city: Union[str, None] = None, xl: Optional[str] = None):  
    if city or xl:
        return {"kd": kd, "city": city, "xl": xl}
    return {"kd": kd}
```



函数参数 `city`和`xl` 是可选的，并且默认值为 `None`。

`type hints`主要是要指示函数的输入和输出的数据类型，数据类型在typing 包中，基本类型有str list dict等等

类型注解(type hints)，typing的主要作用有：

1：类型检查，防止运行时出现参数、返回值类型不符。

2：作为开发文档附加说明，方便使用者调用时传入和返回参数类型。

3：模块加入不会影响程序的运行不会报正式的错误，pycharm支持typing检查错误时会出现黄色警告。



Union 是当有多种可能的数据类型时使用，比如函数有可能根据不同情况有时返回str或返回list，那么就可以写成Union[list, str]

Optional 是Union的一个简化， 当 数据类型中有可能是None时，比如有可能是str也有可能是None，则Optional[str], 相当于Union[str, None]



## 请求体

FastAPI 基于 `Pydantic` ，`Pydantic` 主要用来做类型强制检查（校验数据）。不符合类型要求就会抛出异常。

安装

```
pip install pydantic
```



使用

```python
from typing import Union, List, Optional

from fastapi import FastAPI
from pydantic import BaseModel, Field, ValidationError, field_validator
import uvicorn
from datetime import date


# 类要继承pydantic的BaseModel
class Addr(BaseModel):
    province: str
    city: str


class User(BaseModel):
    name: str
    
    # 指定规则
    age: int = Field(default=0, lt=100, gt=0)
    birth: Optional[date] = None
    friends: List[int] = []
    description: Union[str, None] = None
    addr: Union[Addr, None] = None  # 类型嵌套

    # 规则函数
    @field_validator('name')
    def name_must_alpha(cls, v):
        assert v.isalpha(), 'name must be alpha'
        return v

# 类型嵌套
class Data(BaseModel):  
    users: List[User]


app = FastAPI()


@app.post("/data/")
async def create_data(data: Data):
    # 添加数据库
    return data


if __name__ == '__main__':
    uvicorn.run("body_param:app", host="127.0.0.1", port=8000, reload=True)  
    

```



总结：

FastAPI 支持同时定义 Path 参数、Query 参数和请求体参数，FastAPI 将会正确识别并获取数据。

参数在 url 中也声明了，它将被解释为 path 参数

参数是单一类型（例如int、float、str、bool等），它将被解释为 query 参数

参数类型为继承 Pydantic 模块的`BaseModel`类的数据模型类，则它将被解释为请求体参数



## form表单

先安装依赖

在 OAuth2 规范的一种使用方式（密码流）中，需要将用户名、密码作为表单字段发送，而不是 JSON。

FastAPI 可以使用Form组件来接收表单数据，需要先使用`pip install python-multipart`命令进行安装。

```python
from fastapi import FastAPI, Form
app = FastAPI()
@app.post("/form")
async def create_data_form(username: str = Form(max_length=16, min_length=8, regex='[a-zA-Z]'),
                           password: str = Form(min_length=8, regex='[a-zA-Z]')):
    print(f"username:{username},password:{password}")
    return {"username": username, "password": password}

if __name__ == '__main__':
    uvicorn.run("body_param:app", host="127.0.0.1", port=8000, reload=True)
```



## 文件上传

分为单个上传，批量上传

```python
from fastapi import FastAPI, File, UploadFile
app = FastAPI()
# file: bytes = File()：适合小文件上传
@app.post("/files/")
async def create_file(file: bytes = File()):
    print("file:", file)
    return {"file_size": len(file)}


# 多文件上传
@app.post("/multiFiles/")
async def create_files(files: List[bytes] = File()):
    return {"file_sizes": [len(file) for file in files]}


# file: UploadFile：适合大文件上传

@app.post("/uploadFile/")
async def create_upload_file(file: UploadFile):
    with open(f"{file.filename}", 'wb') as f:
        for chunk in iter(lambda: file.file.read(1024), b''):
            f.write(chunk)
    return {"filename": file.filename}


@app.post("/multiUploadFiles/")
async def create_upload_files(files: List[UploadFile]):
    for file in files:
        path = os.path.join("upload", file.filename)
        with open(path, 'wb') as f:
            for line in file.file:
                f.write(line)
    return {"filenames": [file.filename for file in files]}


if __name__ == '__main__':
    uvicorn.run("body_param:app", host="127.0.0.1", port=8000, reload=True)
```



## request对象

需要在函数中声明Request类型的参数，FastAPI 就会自动传递 Request 对象给这个参数，我们就可以获取到 Request 对象及其属性信息，例如 header、url、cookie、session 等。

```python
from fastapi import FastAPI, Request
app = FastAPI()
@app.get("/items")
async def items(request: Request):
    return {
        "请求URL：": request.url,
        "请求ip：": request.client.host,
        "请求宿主：": request.headers.get("user-agent"),
        "cookies": request.cookies,
    }
```



## 静态文件

在 Web 开发中，需要请求很多静态资源文件（不是由服务器生成的文件），如 css/js 和图片文件等

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# /static是访问路径，statics是资源根目录
app.mount("/static",StaticFiles(directory="statics"))
```



## response响应模型

最终 return 的都是自定义结构的字典，FastAPI 提供了 response_model 参数，声明 return 响应体的模型

response_model 是路径操作的参数，并不是路径函数的参数

FastAPI将使用`response_model`进行以下操作：

- 将输出数据转换为response_model中声明的数据类型。
- 验证数据结构和类型
- 将输出数据限制为该model定义的
- 添加到OpenAPI中
- 在自动文档系统中使用。

你可以在任意的路径操作中使用 `response_model`参数来声明用于响应的模型

```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI()

# 入参
class UserIn(BaseModel):
    username: str
    password: str
    email: EmailStr
    full_name: Union[str, None] = None

# 出参，不包含敏感信息
class UserOut(BaseModel):
    username: str
    email: EmailStr
    full_name: Union[str, None] = None


@app.post("/user/regin", response_model=UserOut)
async def create_user(user: UserIn):
    return user
```



response_model_exclude_unset

如果model在NoSQL数据库中具有很多可选属性，但是不想发送很长的JSON响应，其中包含默认值。

```python
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: float = 10.5
    tags: List[str] = []


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
    "baz": {"name": "Baz", "description": None, "price": 50.2, "tax": 10.5, "tags": []},
}

# 返回结果中排除未设置的值
@app.get("/items/{item_id}", response_model=Item, response_model_exclude_unset=True)
async def read_item(item_id: str):
    return items[item_id]
```



除了`response_model_exclude_unset`以外，还有`response_model_exclude_defaults`和`response_model_exclude_none`，我们可以很直观的了解到他们的意思，不返回是默认值的字段和不返回是None的字段。`response_model_exclude`表示要排除哪些字段，`response_model_include`表示只包含哪些字段

```python
# response_model_exclude
@app.get("/items/{item_id}", response_model=Item, response_model_exclude={"description"}, )
async def read_item(item_id: str):
    return items[item_id]

# response_model_include  
@app.get("/items/{item_id}", response_model=Item, response_model_include={"name", "price"}, )
async def read_item(item_id: str):
    return items[item_id]
```



## jinja2模板引擎

jinja2是Flask作者开发的⼀个模板系统，起初是仿django模板的⼀个模板引擎，为Flask提供模板⽀持，由于其灵活，快速和安全等优点被⼴泛使⽤。

```
1. 变量取值 {{ }}
2. 控制结构 {% %}
```

后端

```python
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI()  # 实例化 FastAPI对象
templates = Jinja2Templates(directory="templates")  # 实例化Jinja2对象，并将文件夹路径设置为以templates命令的文件夹


@app.get('/')
def hello(request: Request):
    return templates.TemplateResponse(
        'index.html',
        {
            'request': request,  # 注意，返回模板响应时，必须有request键值对，且值为Request请求对象
            'user': 'yuan',
            "books": ["金瓶梅", "聊斋", "剪灯新话", "国色天香"],
            "booksDict": {
                "金瓶梅": {"price": 100, "publish": "苹果出版社"},
                "聊斋": {"price": 200, "publish": "橘子出版社"},
            }
        }
    )
if __name__ == '__main__':
    uvicorn.run("main:app", port=8080, debug=True, reload=True)

```



模板

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>


<h1>{{ user}}</h1>

<p>{{ books.0 }}</p>
<p>{{ books.1 }}</p>
<p>{{ books.2 }}</p>
<p>{{ books.3 }}</p>

<p>{{ booksDict.金瓶梅.price }}</p>


</body>
</html>
```



过滤器

变量可以通过“过滤器”进⾏修改，过滤器可以理解为是jinja2⾥⾯的内置函数和字符串处理函数。常⽤的过滤器有：

| **过滤器名称** | **说明**                                     |
| -------------- | -------------------------------------------- |
| capitialize    | 把值的⾸字母转换成⼤写，其他⼦母转换为⼩写   |
| lower          | 把值转换成⼩写形式                           |
| title          | 把值中每个单词的⾸字母都转换成⼤写           |
| trim           | 把值的⾸尾空格去掉                           |
| striptags      | 渲染之前把值中所有的HTML标签都删掉           |
| join           | 拼接多个值为字符串                           |
| round          | 默认对数字进⾏四舍五⼊，也可以⽤参数进⾏控制 |
| safe           | 渲染时值不转义                               |

那么如何使⽤这些过滤器呢？只需要在变量后⾯使⽤管道(|)分割，多个过滤器可以链式调⽤，前⼀个过滤器的输出会作为后⼀个过滤器的输⼊

```

{{ 'abc'| captialize  }}  # Abc

{{ 'abc'| upper  }} # ABC

{{ 'hello world'| title  }} # Hello World

{{ "hello world"| replace('world','yuan') | upper }} # HELLO YUAN

{{ 18.18 | round | int }} # 18

```



控制语句

jinja2中的if语句类似与Python的if语句，它也具有单分⽀，多分⽀等多种结构，不同的是，条件语句不需要使⽤冒号结尾，⽽结束控制语句，需要使⽤endif关键字；jinja2中的for循环⽤于迭代Python的数据类型，包括列表，元组和字典。在jinja2中不存在while循环。

```
{% if age > 18 %}

    <p>成年区</p>

{% else %}
    
    <p>未成年区</p>

{% endif %}


{% for book in books %}
    <p>{{ book }}</p>
{% endfor %}

```




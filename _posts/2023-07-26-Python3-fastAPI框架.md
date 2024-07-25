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



## 导出依赖

导出项目中使用的依赖和版本

在项目根目录下执行命令

```
pip freeze > requirements.txt
```



清理虚拟环境和缓存

```
# 删除虚拟环境
rm -rf .venv venv __pycache__
find . -name "__pycache__" -type d | xargs rm -rf

# 删除pip缓存
rm -rf ~/.cache/pip
```



构建虚拟环境并安装依赖

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```



## quickStart案例

1：idea创建项目：https://www.jb51.net/python/303282zd0.htm

2：安装框架和服务器

```
创建虚拟环境
virtualenv myenv

安装依赖
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



## 主程序入口

类似于启动类

```python
app = FastAPI(
    title='FastAPI Tutorial and Coronavirus Tracker API Docs',
    description='FastAPI教程 新冠病毒疫情跟踪器API接口文档，项目代码：https://github.com/liaogx/fastapi-tutorial',
    version='1.0.0',
    docs_url='/docs',
    redoc_url='/redocs',
)

# mount表示将某个目录下一个完全独立的应用挂载过来，这个不会在API交互文档中显示
app.mount(path='/static', app=StaticFiles(directory='./coronavirus/static'), name='static')  
# .mount()不要在分路由APIRouter().mount()调用，模板会报错


```



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



同步接口和异步接口

```python
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()  # 这里不一定是app，名字随意


class CityInfo(BaseModel):
    province: str
    country: str
    is_affected: Optional[bool] = None  # 与bool的区别是可以不传，默认是null


# @app.get('/')
# def hello_world():
#     return {'hello': 'world'}
#
#
# @app.get('/city/{city}')
# def result(city: str, query_string: Optional[str] = None):
#     return {'city': city, 'query_string': query_string}
#
#
# @app.put('/city/{city}')
# def result(city: str, city_info: CityInfo):
#     return {'city': city, 'country': city_info.country, 'is_affected': city_info.is_affected}
#

#异步接口，async
@app.get('/')
async def hello_world():
    return {'hello': 'world'}


@app.get('/city/{city}')
async def result(city: str, query_string: Optional[str] = None):
    return {'city': city, 'query_string': query_string}


@app.put('/city/{city}')
async def result(city: str, city_info: CityInfo):
    return {'city': city, 'country': city_info.country, 'is_affected': city_info.is_affected}

# 启动命令（热启动）：uvicorn hello_world:app --reload
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
    uvicorn.run("main:app", host="127.0.0.1", port=8080, debug=True, reload=True, workers=1)
```


## 请求方式

### 路径参数

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



路径参数校验

```python
from fastapi import APIRouter, Query, Path, Body, Cookie, Header
@app03.get("/path_/{num}")
def path_params_validate(
    num: int = Path(..., title="Your Number", description="不可描述", ge=1, le=10),
):
    return num
```



### 枚举类型参数



```python
from enum import Enum

class CityName(str, Enum):
    Beijing = "Beijing China"
    Shanghai = "Shanghai China"


@app03.get("/enum/{city}")  # 枚举类型的参数
async def latest(city: CityName):
    if city == CityName.Shanghai:
        return {"city_name": city, "confirmed": 1492, "death": 7}
    if city == CityName.Beijing:
        return {"city_name": city, "confirmed": 971, "death": 9}
    return {"city_name": city, "latest": "unknown"}
```



### 文件路径参数

传一个文件地址

```python
@app03.get("/files/{file_path:path}")  # 通过path parameters传递文件路径
def filepath(file_path: str):
    return f"The file path is {file_path}"
```





### 查询字符串参数

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



查询参数和字符串验证

```python

from typing import Optional, List

from fastapi import APIRouter, Query, Path, Body, Cookie, Header

"""Query Parameters and String Validations 查询参数和字符串验证"""


@app03.get("/query")
def page_limit(page: int = 1, limit: Optional[int] = None):  # 给了默认值就是选填的参数，没给默认值就是必填参数
    if limit:
        return {"page": page, "limit": limit}
    return {"page": page}


@app03.get("/query/bool/conversion")  # bool类型转换：yes on 1 True true会转换成true, 其它为false
def type_conversion(param: bool = False):
    return param


@app03.get("/query/validations")  # 长度+正则表达式验证，比如长度8-16位，以a开头。其它校验方法看Query类的源码
def query_params_validate(
    value: str = Query(..., min_length=8, max_length=16, regex="^a"),  # ...换成None就变成选填的参数
    values: List[str] = Query(["v1", "v2"], alias="alias_name")
):  # 多个查询参数的列表。参数别名
    return value, values
```



### 请求体参数

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



场景

```python
from datetime import datetime, date
from pathlib import Path
from typing import List
from typing import Optional

from pydantic import BaseModel, ValidationError
from pydantic import constr
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base

"""
使用Python的类型注解来进行数据校验和settings管理

Pydantic可以在代码运行时提供类型提示，数据校验失败时提供友好的错误提示

定义数据应该如何在纯规范的Python代码中保存，并用Pydantic验证它
"""

print("\033[31m1. --- Pydantic的基本用法。Pycharm可以安装Pydantic插件 ---\033[0m")


class User(BaseModel):
    id: int  # 必须字段
    name: str = "John Snow"  # 有默认值，选填字段
    signup_ts: Optional[datetime] = None
    friends: List[int] = []  # 列表中元素是int类型或者可以直接转换成int类型


external_data = {
    "id": "123",
    "signup_ts": "2020-12-22 12:22",
    "friends": [1, 2, "3"],  # "3"是可以int("3")的
}
user = User(**external_data) #拆包
print(user.id, user.friends)  # 实例化后调用属性
print(repr(user.signup_ts))
print(user.dict()) # 转换为字典类型

print("\033[31m2. --- 校验失败处理 ---\033[0m")
try:
    User(id=1, signup_ts=datetime.today(), friends=[1, 2, "not number"])
except ValidationError as e:
    print(e.json())

print("\033[31m3. --- 模型类的的属性和方法 ---\033[0m")
print(user.dict())
print(user.json())
print(user.copy())  # 这里是浅拷贝
print(User.parse_obj(external_data))
print(User.parse_raw('{"id": "123", "signup_ts": "2020-12-22 12:22", "friends": [1, 2, "3"]}'))

path = Path('pydantic_tutorial.json')
path.write_text('{"id": "123", "signup_ts": "2020-12-22 12:22", "friends": [1, 2, "3"]}')
print(User.parse_file(path))

print(user.schema())
print(user.schema_json())

user_data = {"id": "error", "signup_ts": "2020-12-22 12 22", "friends": [1, 2, 3]}  # id是字符串 是错误的
print(User.construct(**user_data))  # 不检验数据直接创建模型类，不建议在construct方法中传入未经验证的数据

print(User.__fields__.keys())  # 定义模型类的时候，所有字段都注明类型，字段顺序就不会乱

print("\033[31m4. --- 递归模型 ---\033[0m")


class Sound(BaseModel):
    sound: str


class Dog(BaseModel):
    birthday: date
    weight: float = Optional[None]
    sound: List[Sound]  # 不同的狗有不同的叫声。递归模型（Recursive Models）就是指一个嵌套一个


dogs = Dog(birthday=date.today(), weight=6.66, sound=[{"sound": "wang wang ~"}, {"sound": "ying ying ~"}])
print(dogs.dict())

print("\033[31m5. --- ORM模型：从类实例创建符合ORM对象的模型  ---\033[0m")

Base = declarative_base()

# 数据库表映射类
class CompanyOrm(Base):
    __tablename__ = 'companies'
    id = Column(Integer, primary_key=True, nullable=False)
    public_key = Column(String(20), index=True, nullable=False, unique=True)
    name = Column(String(63), unique=True)
    domains = Column(ARRAY(String(255)))

#入参模型
class CompanyModel(BaseModel):
    id: int
    public_key: constr(max_length=20)
    name: constr(max_length=63)
    domains: List[constr(max_length=255)]

    class Config:
        orm_mode = True


co_orm = CompanyOrm(
    id=123,
    public_key='foobar',
    name='Testing',
    domains=['example.com', 'foobar.com'],
)

print(CompanyModel.from_orm(co_orm))

print("\033[31m6. --- Pydantic支撑的字段类型  ---\033[0m")  
# 官方文档：https://pydantic-docs.helpmanual.io/usage/types/
```



接口应用展示

```python

from fastapi import APIRouter, Query, Path, Body, Cookie, Header
from pydantic import BaseModel, Field

class CityInfo(BaseModel):
    name: str = Field(..., example="Beijing")  # example是注解的作用，值不会被验证
    country: str
    country_code: str = None  # 给一个默认值
    country_population: int = Field(default=800, title="人口数量", description="国家的人口数量", ge=800)
	
    #样例
    class Config:
        schema_extra = {
            "example": {
                "name": "Shanghai",
                "country": "China",
                "country_code": "CN",
                "country_population": 1400000000,
            }
        }


@app03.post("/request_body/city")
def city_info(city: CityInfo):
    print(city.name, city.country)  # 当在IDE中输入city.的时候，属性会自动弹出
    return city.dict()
```





总结：

FastAPI 支持同时定义 Path 参数、Query 参数和请求体参数，FastAPI 将会正确识别并获取数据。

参数在 url 中也声明了，它将被解释为 path 参数

参数是单一类型（例如int、float、str、bool等），它将被解释为 query 参数

参数类型为继承 Pydantic 模块的`BaseModel`类的数据模型类，则它将被解释为请求体参数



### 混合参数

可以多种参数类型混合传递

```python
@app03.put("/request_body/city/{name}")
def mix_city_info(
    name: str,
    city01: CityInfo01,
    city02: CityInfo02,  # Body可以是多个的
    confirmed: int = Query(ge=0, description="确诊数", default=0),
    death: int = Query(ge=0, description="死亡数", default=0),
):
    if name == "Shanghai":
        return {"Shanghai": {"confirmed": confirmed, "death": death}}
    return city01.dict(), city02.dict()

@app03.put("/request_body/multiple/parameters")
def body_multiple_parameters(
    city: CityInfo = Body(..., embed=True),  # 当只有一个Body参数的时候，embed=True表示请求体参数嵌套。多个Body参数默认就是嵌套的
    confirmed: int = Query(ge=0, description="确诊数", default=0),
    death: int = Query(ge=0, description="死亡数", default=0),
):
    print(f"{city.name} 确诊数：{confirmed} 死亡数：{death}")
    return city.dict()
```



### 嵌套请求体

嵌套请求体请求

```python
from datetime import date

class Data(BaseModel):
    city: List[CityInfo] = None  # 这里就是定义数据格式嵌套的请求体
    date: date  # 额外的数据类型，还有uuid datetime bytes frozenset等，参考：https://fastapi.tiangolo.com/tutorial/extra-data-types/
    confirmed: int = Field(ge=0, description="确诊数", default=0)
    deaths: int = Field(ge=0, description="死亡数", default=0)
    recovered: int = Field(ge=0, description="痊愈数", default=0)


@app03.put("/request_body/nested")
def nested_models(data: Data):
    return data
```



### form表单参数

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


"""Form Data 表单数据处理"""
@app04.post("/login/")
async def login(username: str = Form(...), password: str = Form(...)):  # 定义表单参数
    """用Form类需要pip install python-multipart; Form类的元数据和校验方法类似Body/Query/Path/Cookie"""
    return {"username": username}

if __name__ == '__main__':
    uvicorn.run("body_param:app", host="127.0.0.1", port=8000, reload=True)
```



### 文件上传参数

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


"""Request Files 单文件、多文件上传及参数详解"""

@app04.post("/file")
async def file_(file: bytes = File(...)):  # 如果要上传多个文件 files: List[bytes] = File(...)
    """使用File类 文件内容会以bytes的形式读入内存 适合于上传小文件"""
    return {"file_size": len(file)}


@app04.post("/upload_files")
async def upload_files(files: List[UploadFile] = File(...)):  # 如果要上传单个文件 file: UploadFile = File(...)
    """
    使用UploadFile类的优势:
    1.文件存储在内存中，使用的内存达到阈值后，将被保存在磁盘中
    2.适合于图片、视频大文件
    3.可以获取上传的文件的元数据，如文件名，创建时间等
    4.有文件对象的异步接口
    5.上传的文件是Python文件对象，可以使用write(), read(), seek(), close()操作
    """
    for file in files:
        contents = await file.read()
        print(contents)
    return {"filename": files[0].filename, "content_type": files[0].content_type}


if __name__ == '__main__':
    uvicorn.run("body_param:app", host="127.0.0.1", port=8000, reload=True)
    
    
```



### cookie和header参数

获取cookie和header

```python
@app03.get("/cookie")  # 效果只能用Postman测试
def cookie(cookie_id: Optional[str] = Cookie(None)):  # 定义Cookie参数需要使用Cookie类，否则就是查询参数
    return {"cookie_id": cookie_id}


@app03.get("/header")
def header(user_agent: Optional[str] = Header(None, convert_underscores=True), x_token: List[str] = Header(None)):
    """
    有些HTTP代理和服务器是不允许在请求头中带有下划线的，所以Header提供convert_underscores属性让设置
    :param user_agent: convert_underscores=True 会把 user_agent 变成 user-agent
    :param x_token: x_token是包含多个值的列表
    :return:
    """
    return {"User-Agent": user_agent, "x_token": x_token}
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



## 路径操作配置

fastapi默认是用的swagger接口文档，我们可以对接口进行一些路径配置，来让文档更加清晰

默认fastapi的swagger文档路径为`localhost:8080/docs`

```python
"""Path Operation Configuration 路径操作配置"""


@app04.post(
    "/path_operation_configuration",
    response_model=UserOut,
    # tags=["Path", "Operation", "Configuration"],
    summary="This is summary",
    description="This is description",
    response_description="This is response description",
    deprecated=True,
    status_code=status.HTTP_200_OK
)
async def path_operation_configuration(user: UserIn):
    """
    Path Operation Configuration 路径操作配置
    :param user: 用户信息
    :return: 返回结果
    """
    return user.dict()
```



## fastapi配置项

fastapi的接口文档的一些配置

```python
app = FastAPI(
    title='FastAPI Tutorial and Coronavirus Tracker API Docs',
    description='FastAPI教程 新冠病毒疫情跟踪器API接口文档，项目代码：https://github.com/liaogx/fastapi-tutorial',
    version='1.0.0',
    docs_url='/docs',
    redoc_url='/redocs',
)
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



示例

```python
from typing import Optional, List

from fastapi import APIRouter, status, Form, File, UploadFile, HTTPException
from pydantic import BaseModel, EmailStr

app04 = APIRouter()

"""Response Model 响应模型"""


class UserIn(BaseModel):
    username: str
    password: str
    email: EmailStr
    mobile: str = "10086"
    address: str = None
    full_name: Optional[str] = None


class UserOut(BaseModel):
    username: str
    email: EmailStr  # 用 EmailStr 需要 pip install pydantic[email]
    mobile: str = "10086"
    address: str = None
    full_name: Optional[str] = None


users = {
    "user01": {"username": "user01", "password": "123123", "email": "user01@example.com"},
    "user02": {"username": "user02", "password": "123456", "email": "user02@example.com", "mobile": "110"}
}


@app04.post("/response_model/", response_model=UserOut, response_model_exclude_unset=True)
async def response_model(user: UserIn):
    """response_model_exclude_unset=True表示默认值不包含在响应中，仅包含实际给的值，如果实际给的值与默认值相同也会包含在响应中"""
    print(user.password)  # password不会被返回
    # return user
    return users["user01"]


@app04.post(
    "/response_model/attributes",
    response_model=UserOut,
    # response_model=Union[UserIn, UserOut],
    # response_model=List[UserOut],
    response_model_include=["username", "email", "mobile"],
    response_model_exclude=["mobile"]
)
async def response_model_attributes(user: UserIn):
    """response_model_include列出需要在返回结果中包含的字段；response_model_exclude列出需要在返回结果中排除的字段"""
    # del user.password  # Union[UserIn, UserOut]后，删除password属性也能返回成功
    return user
    # return [user, user]


```



### 响应状态码

http中的各种状态码

```python
"""Response Status Code 响应状态码"""


@app04.post("/status_code", status_code=200)
async def status_code():
    return {"status_code": 200}


@app04.post("/status_attribute", status_code=status.HTTP_200_OK)
async def status_attribute():
    print(type(status.HTTP_200_OK))
    return {"status_code": status.HTTP_200_OK}

```



## 异常处理

在接口中处理异常

```python
"""Handling Errors 错误处理"""


@app04.get("/http_exception")
async def http_exception(city: str):
    if city != "Beijing":
        raise HTTPException(status_code=404, detail="City not found!", headers={"X-Error": "Error"})
    return {"city": city}


@app04.get("/http_exception/{city_id}")
async def override_http_exception(city_id: int):
    if city_id == 1:
        raise HTTPException(status_code=418, detail="Nope! I don't like 1.")
    return {"city_id": city_id}
```



重写错误处理，要在入口项目中写

```python
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI()

@app.exception_handler(StarletteHTTPException)  # 重写HTTPException异常处理器
async def http_exception_handler(request, exc):
    """
    :param request: 这个参数不能省
    :param exc:
    :return: 返回文本类型的错误信息
    """
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)

@app.exception_handler(RequestValidationError)  # 重写请求验证异常处理器
async def validation_exception_handler(request, exc):
    """
    :param request: 这个参数不能省
    :param exc:
    :return: 返回文本类型的错误信息
    """
    return PlainTextResponse(str(exc), status_code=400)
```



## 依赖注入

抽取公共方法，提高代码复用性

```python
from typing import Optional

from fastapi import APIRouter
from fastapi import Depends, HTTPException, Header

app05 = APIRouter()

"""Dependencies 创建、导入和声明依赖"""


async def common_parameters(q: Optional[str] = None, page: int = 1, limit: int = 100):
    return {"q": q, "page": page, "limit": limit}


@app05.get("/dependency01")
async def dependency01(commons: dict = Depends(common_parameters)): # 依赖上面函数的返回结果
    return commons


@app05.get("/dependency02")
def dependency02(commons: dict = Depends(common_parameters)):  # 可以在async def中调用def依赖，也可以在def中导入async def依赖
    return commons


"""Classes as Dependencies 类作为依赖项"""

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


class CommonQueryParams:
    def __init__(self, q: Optional[str] = None, page: int = 1, limit: int = 100):
        self.q = q
        self.page = page
        self.limit = limit


@app05.get("/classes_as_dependencies")
# async def classes_as_dependencies(commons: CommonQueryParams = Depends(CommonQueryParams)):
# async def classes_as_dependencies(commons: CommonQueryParams = Depends()):
async def classes_as_dependencies(commons=Depends(CommonQueryParams)):
    response = {}
    if commons.q:
        response.update({"q": commons.q})
    items = fake_items_db[commons.page: commons.page + commons.limit]
    response.update({"items": items})
    return response


"""Sub-dependencies 子依赖"""


def query(q: Optional[str] = None):
    return q


def sub_query(q: str = Depends(query), last_query: Optional[str] = None):
    if not q:
        return last_query
    return q


@app05.get("/sub_dependency")
async def sub_dependency(final_query: str = Depends(sub_query, use_cache=True)):
    """use_cache默认是True, 表示当多个依赖有一个共同的子依赖时，每次request请求只会调用子依赖一次，多次调用将从缓存中获取"""
    return {"sub_dependency": final_query}


"""Dependencies in path operation decorators 路径操作装饰器中的多依赖"""


async def verify_token(x_token: str = Header(...)):
    """没有返回值的子依赖"""
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: str = Header(...)):
    """有返回值的子依赖，但是返回值不会被调用"""
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


@app05.get("/dependency_in_path_operation", dependencies=[Depends(verify_token), Depends(verify_key)])  # 这时候不是在函数参数中调用依赖，而是在路径操作中
async def dependency_in_path_operation():
    return [{"user": "user01"}, {"user": "user02"}]


"""Global Dependencies 全局依赖"""

# app05 = APIRouter(dependencies=[Depends(verify_token), Depends(verify_key)])


"""Dependencies with yield 带yield的依赖"""


# 这个需要Python3.7才支持，Python3.6需要pip install async-exit-stack async-generator
# 以下都是伪代码

async def get_db():
    db = "db_connection"
    try:
        yield db
    finally:
        db.endswith("db_close")


async def dependency_a():
    dep_a = "generate_dep_a()"
    try:
        yield dep_a
    finally:
        dep_a.endswith("db_close")


async def dependency_b(dep_a=Depends(dependency_a)):
    dep_b = "generate_dep_b()"
    try:
        yield dep_b
    finally:
        dep_b.endswith(dep_a)


async def dependency_c(dep_b=Depends(dependency_b)):
    dep_c = "generate_dep_c()"
    try:
        yield dep_c
    finally:
        dep_c.endswith(dep_b)
```



## OAuth授权和JWT认证

模拟登录认证

```python
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

app06 = APIRouter()

"""OAuth2 密码模式和 FastAPI 的 OAuth2PasswordBearer"""

"""
OAuth2PasswordBearer是接收URL作为参数的一个类：客户端会向该URL发送username和password参数，然后得到一个Token值
OAuth2PasswordBearer并不会创建相应的URL路径操作，只是指明客户端用来请求Token的URL地址
当请求到来的时候，FastAPI会检查请求的Authorization头信息，如果没有找到Authorization头信息，或者头信息的内容不是Bearer token，它会返回401状态码(UNAUTHORIZED)
"""

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/chapter06/token")  # 请求Token的URL地址 http://127.0.0.1:8000/chapter06/token


@app06.get("/oauth2_password_bearer")
async def oauth2_password_bearer(token: str = Depends(oauth2_schema)):
    return {"token": token}


"""基于 Password 和 Bearer token 的 OAuth2 认证"""

fake_users_db = {
    "john snow": {
        "username": "john snow",
        "full_name": "John Snow",
        "email": "johnsnow@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}


def fake_hash_password(password: str):
    return "fakehashed" + password


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    hashed_password: str


@app06.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")
    return {"access_token": user.username, "token_type": "bearer"}


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def fake_decode_token(token: str):
    user = get_user(fake_users_db, token)
    return user


async def get_current_user(token: str = Depends(oauth2_schema)):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},  # OAuth2的规范，如果认证失败，请求头中返回“WWW-Authenticate”
        )
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user


@app06.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


"""OAuth2 with Password (and hashing), Bearer with JWT tokens 开发基于JSON Web Tokens的认证"""

fake_users_db.update({
    "john snow": {
        "username": "john snow",
        "full_name": "John Snow",
        "email": "johnsnow@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
})

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"  # 生成密钥 openssl rand -hex 32
ALGORITHM = "HS256"  # 算法
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 访问令牌过期分钟


class Token(BaseModel):
    """返回给用户的Token"""
    access_token: str
    token_type: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/chapter06/jwt/token")


def verity_password(plain_password: str, hashed_password: str):
    """对密码进行校验"""
    return pwd_context.verify(plain_password, hashed_password)


def jwt_get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def jwt_authenticate_user(db, username: str, password: str):
    user = jwt_get_user(db=db, username=username)
    if not user:
        return False
    if not verity_password(plain_password=password, hashed_password=user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(claims=to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app06.post("/jwt/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = jwt_authenticate_user(db=fake_users_db, username=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


async def jwt_get_current_user(token: str = Depends(oauth2_schema)):
    credentials_exception = HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token=token, key=SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = jwt_get_user(db=fake_users_db, username=username)
    if user is None:
        raise credentials_exception
    return user


async def jwt_get_current_active_user(current_user: User = Depends(jwt_get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user


@app06.get("/jwt/users/me")
async def jwt_read_users_me(current_user: User = Depends(jwt_get_current_active_user)):
    return current_user
```



## jinja2模板引擎

jinja2是Flask作者开发的⼀个模板系统，起初是仿django模板的⼀个模板引擎，为Flask提供模板⽀持，由于其灵活，快速和安全等优点被⼴泛使⽤。



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

```tex

{{ 'abc'| captialize  }}  # Abc

{{ 'abc'| upper  }} # ABC

{{ 'hello world'| title  }} # Hello World

{{ "hello world"| replace('world','yuan') | upper }} # HELLO YUAN

{{ 18.18 | round | int }} # 18

```



控制语句

jinja2中的if语句类似与Python的if语句，它也具有单分⽀，多分⽀等多种结构，不同的是，条件语句不需要使⽤冒号结尾，⽽结束控制语句，需要使⽤endif关键字；jinja2中的for循环⽤于迭代Python的数据类型，包括列表，元组和字典。在jinja2中不存在while循环。

```tex
{% if age > 18 %}

    <p>成年区</p>

{% else %}
    
    <p>未成年区</p>

{% endif %}


{% for book in books %}
    <p>{{ book }}</p>
{% endfor %}

```



## ORM操作

FastAPI也支持数据库的开发，你可以用 PostgreSQL、MySQL、 SQLite Oracle 等



### 对象映射

模型

```python
from tortoise.models import Model
from tortoise import fields


class Clas(Model):
    name = fields.CharField(max_length=255, description='班级名称')


class Teacher(Model):
    # 主键
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255, description='姓名')
    tno = fields.IntField(description='账号')
    pwd = fields.CharField(max_length=255, description='密码')


class Student(Model):
    id = fields.IntField(pk=True)
    sno = fields.IntField(description='学号')
    pwd = fields.CharField(max_length=255, description='密码')
    name = fields.CharField(max_length=255, description='姓名')
    # 一对多
    clas = fields.ForeignKeyField('models.Clas', related_name='students')
    # 多对多
    courses = fields.ManyToManyField('models.Course', related_name='students',description='学生选课表')


class Course(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255, description='课程名')
    teacher = fields.ForeignKeyField('models.Teacher', related_name='courses', description='课程讲师')
```



### aerich迁移工具

配置：settings.py

```python
TORTOISE_ORM = {
    'connections': {
        'default': {
            # 'engine': 'tortoise.backends.asyncpg',  PostgreSQL
            'engine': 'tortoise.backends.mysql',  # MySQL or Mariadb
            'credentials': {
                'host': '127.0.0.1',
                'port': '3306',
                'user': 'root',
                'password': 'yuan0316',
                'database': 'fastapi',
                'minsize': 1,
                'maxsize': 5,
                'charset': 'utf8mb4',
                "echo": True
            }
        },
    },
    'apps': {
        'models': {
            'models': ['apps.models', "aerich.models"],
            'default_connection': 'default',

        }
    },
    'use_tz': False,
    'timezone': 'Asia/Shanghai'
}
```



链接

```python
import uvicorn
from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from settings import TORTOISE_ORM


app = FastAPI()

# 该方法会在fastapi启动时触发，内部通过传递进去的app对象，监听服务启动和终止事件
# 当检测到启动事件时，会初始化Tortoise对象，如果generate_schemas为True则还会进行数据库迁移
# 当检测到终止事件时，会关闭连接
register_tortoise(
    app,
    config=TORTOISE_ORM,
    # generate_schemas=True,  # 如果数据库为空，则自动生成对应表单，生产环境不要开
    # add_exception_handlers=True,  # 生产环境不要开，会泄露调试信息
)

if __name__ == '__main__':
    uvicorn.run('main:app', host='127.0.0.1', port=8000, reload=True,
                debug=True, workers=1)

```



安装

```
pip install aerich
```



初始化配置，只需执行一次

```
aerich init -t settings.TORTOISE_ORM # TORTOISE_ORM配置的位置)
```

初始化完会在当前目录生成一个文件：pyproject.toml（保存配置文件路径）和一个文件夹：migrations（存放迁移文件）



初始化数据库

```
aerich init-db
```

此时数据库中就有相应的表格

如果`TORTOISE_ORM`配置文件中的`models`改了名，则执行这条命令时需要增加`--app`参数，来指定你修改的名字



更新模块并进行迁移

修改model类，重新生成迁移文件,比如添加一个字段

```python
class Admin(Model):
    ...
    xxx = fields.CharField(max_length=255)
```



执行命令

```
aerich migrate [--name] (标记修改操作) #  aerich migrate --name add_column
```



重新执行迁移，写入数据库

```
aerich upgrade
```



回到上一个版本

```
aerich downgrade
```



查看历史迁移记录

```
aerich history
```



### CRUD

案例

```python
from fastapi.exceptions import HTTPException

from models import *

from pydantic import BaseModel
from typing import List, Union
from fastapi import APIRouter

api_student = APIRouter()


@api_student.get("/student")
async def getAllStudent():
    # 查询所有数据，只取name值，类似于select name from student
    students = await Student.all().values("name")
    
    # 按条件查询列表
    # students = await Student.filter(name__icontains='a').values("name", "clas__name")
    # print("students", students)
    # for i in students:
    #     print(i)
    #
    
    # 单个查询
    # rain = await Student.get(name='rain')
    # print(rain, type(rain))
    # print(rain.sno)
    
    # 模糊查询
    stu = await Student.filter(sno__gt = 2001)
    stu = await Student.filter(sno__range = [1,1000])
    stu = await Student.filter(sno__in = [2001,2002])
    
    # 一对多，多对多查询
    alvin = await Student.get(name="alvin")
    print(await alvin.clas.values("name"))
    students = await Student.all().values("name","clas__name")
    
    print(await alvin.courses.all().values("name","teacher__name"))
    students = await Student.all().values("name","clas__name","courses__name")

    return students


class StudentModel(BaseModel):
    name: str
    pwd: str
    sno: int
    clas_id: Union[int, None] = None
    courses: List[int] = []


@api_student.post("/student")
async def addStudent(stu: StudentModel):
    # 添加数据库操作
    # 方式1
    # student = Student(name=stu.name, pwd=stu.pwd, sno=stu.sno, clas_id=stu.clas)
    # await student.save()
    # 方式2
    student = await Student.create(name=stu.name, pwd=stu.pwd, sno=stu.sno, clas_id=stu.clas_id)
    print(student, dir(student))

    # 添加多对多关系记录
    courses = await Course.filter(id__in=stu.courses)
    print("courses", courses)
    await student.courses.add(*courses)
    print("student", student.courses)

    return student


@api_student.put("/student/{student_id}")
async def update_student(student_id: int, student: StudentModel):
    # 更新学生信息
    data = student.dict(exclude_unset=True)
    
    # 先移除课程列表，单独做更新操作
    courses = data.pop("courses")
    print(data, courses)
    await Student.filter(id=student_id).update(**data)

    courses = await Course.filter(id__in=student.courses)
    edit_student = await Student.get(id=student_id)
    await edit_student.courses.clear()
    await edit_student.courses.add(*courses)

    return student


@api_student.delete("/student/{student_id}")
async def delete_student(student_id: int):
    deleted_count = await Student.filter(id=student_id).delete()  # 条件删除
    if not deleted_count:
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found")
    return {}

```



## 中间件

"中间件"是一个函数,它在每个请求被特定的路径操作处理之前,以及在每个响应之后工作；类似于Java的拦截器

要创建中间件你可以在函数的顶部使用装饰器 `@app.middleware("http")`

中间件参数接收如下参数：

request

一个函数`call_next`，它将接收`request`，作为参数；这个函数将 `request` 传递给相应的 路径操作；然后它将返回由相应的路径操作生成的 `response`

然后你可以在返回 `response` 前进一步修改它

```python
import uvicorn
from fastapi import FastAPI

from fastapi import Request
from fastapi.responses import Response
import time

app = FastAPI()


@app.middleware("http")
async def m2(request: Request, call_next):
    # 请求代码块
    print("m2 request")
    response = await call_next(request)
    # 响应代码块
    response.headers["author"] = "yuan"
    print("m2 response")
    return response


@app.middleware("http")
async def m1(request: Request, call_next):
    # 请求代码块
    print("m1 request")
    # if request.client.host in ["127.0.0.1", ]:  # 黑名单
    #     return Response(content="visit forbidden")

    # if request.url.path in ["/user"]:
    #     return Response(content="visit forbidden")

    start = time.time()

    response = await call_next(request)
    # 响应代码块
    print("m1 response")
    end = time.time()
    response.headers["ProcessTimer"] = str(end - start)
    return response


@app.get("/user")
def get_user():
    time.sleep(3)
    print("get_user函数执行")
    return {
        "user": "current user"
    }


@app.get("/item/{item_id}")
def get_item(item_id: int):
    time.sleep(2)
    print("get_item函数执行")
    return {
        "item_id": item_id
    }


if __name__ == '__main__':
    uvicorn.run('main:app', host='127.0.0.1', port=8030, reload=True,
                debug=True, workers=1)

```



### 解决跨域

```python
@app.middleware("http")
async def CORSMiddleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    print(response.headers)
    return response

```



第二种方式

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:63342"
]

# 框架解决跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # *：代表所有客户端
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/")
def main():
    return {"message": "Hello World"}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8080, debug=True, reload=True)

```


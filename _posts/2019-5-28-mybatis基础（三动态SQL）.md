---
layout: post
title: "mybatis基础（三动态SQL）"
categories: mybatis
tags: mybatis
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### if和where

```java
//携带了哪个字段查询条件就带上这个字段的值
	public List<Employee> getEmpsByConditionIf(Employee employee);
```

```xml
<!-- 查询员工，要求，携带了哪个字段查询条件就带上这个字段的值 -->
<!-- public List<Employee> getEmpsByConditionIf(Employee employee); -->
	 
	 <select id="getEmpsByConditionIf" resultType="com.atguigu.mybatis.bean.Employee">
	 	select * from tbl_employee
	 	<!-- where -->
	 	<where>
		 	<!-- test：判断表达式（OGNL）
		 	OGNL参照PPT或者官方文档。
		 	  	 c:if  test
		 	从参数中取值进行判断
		 	
		 	遇见特殊符号应该去写转义字符：
		 	&&：&amp;&amp;
		 	-->
		 	<if test="id!=null">
		 		id=#{id}
		 	</if>
		 	<if test="lastName!=null &amp;&amp; lastName!=&quot;&quot;">
		 		and last_name like #{lastName}
		 	</if>
		 	<if test="email!=null and email.trim()!=&quot;&quot;">
		 		and email=#{email}
		 	</if> 
		 	<!-- ognl会进行字符串与数字的转换判断  "0"==0 -->
		 	<if test="gender==0 or gender==1">
		 	 	and gender=#{gender}
		 	</if>
	 	</where>
	 </select>
```

```java
@Test
	public void testDynamicSql() throws IOException{
		SqlSessionFactory sqlSessionFactory = getSqlSessionFactory();
		SqlSession openSession = sqlSessionFactory.openSession();
		try{
			EmployeeMapperDynamicSQL mapper = openSession.getMapper(EmployeeMapperDynamicSQL.class);
			//select * from tbl_employee where id=? and last_name like ?
			//测试if\where
			Employee employee = new Employee(1, "Admin", null, null);
		/*	List<Employee> emps = mapper.getEmpsByConditionIf(employee );
			for (Employee emp : emps) {
				System.out.println(emp);
			}*/
			
			//查询的时候如果某些条件没带可能sql拼装会有问题
			//1、给where后面加上1=1，以后的条件都and xxx.
			//2、mybatis使用where标签来将所有的查询条件包括在内。mybatis就会将where标签中拼装的sql，多出来的and或者or去掉
				//where只会去掉第一个多出来的and或者or。
```



### trim字符串截取

- 字符串截取(where(封装查询条件), set(封装修改条件))

#### 选择性查询



```java
public List<Employee> getEmpsByConditionTrim(Employee employee);
```

```xml
<!--public List<Employee> getEmpsByConditionTrim(Employee employee);  -->

	 <select id="getEmpsByConditionTrim" resultType="com.atguigu.mybatis.bean.Employee">
	 	select * from tbl_employee
	 	<!-- 后面多出的and或者or where标签不能解决 
	 	prefix="":前缀：trim标签体中是整个字符串拼串 后的结果。
	 			prefix给拼串后的整个字符串加一个前缀 
	 	prefixOverrides="":
	 			前缀覆盖： 去掉整个字符串前面多余的字符
	 	suffix="":后缀
	 			suffix给拼串后的整个字符串加一个后缀 
	 	suffixOverrides=""
	 			后缀覆盖：去掉整个字符串后面多余的字符
	 			
	 	-->
	 	<!-- 自定义字符串的截取规则 -->
	 	<trim prefix="where" suffixOverrides="and">
	 		<if test="id!=null">
		 		id=#{id} and
		 	</if>
		 	<if test="lastName!=null &amp;&amp; lastName!=&quot;&quot;">
		 		last_name like #{lastName} and
		 	</if>
		 	<if test="email!=null and email.trim()!=&quot;&quot;">
		 		email=#{email} and
		 	</if> 
		 	<!-- ognl会进行字符串与数字的转换判断  "0"==0 -->
		 	<if test="gender==0 or gender==1">
		 	 	gender=#{gender}
		 	</if>
		 </trim>
	 </select>
```

```java
//测试Trim
	Employee employee = new Employee(1, "Admin", null, null);
	List<Employee> emps2 = mapper.getEmpsByConditionTrim(employee);
	for (Employee emp : emps2) {
		System.out.println(emp);
	}
```

#### 选择性插入

```xml
<insert id="insertSelective" parameterType="com.zjl.domain">
    insert into table_name
    <trim prefix="(" suffix=")" suffixOverrides=",">
        <if test="id != null">
        	id,
        </if>
        <if test="createDate != null">
        	create_date,
        </if>
        <if test="modifiedDate != null">
        	modified_date,
        </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
        <if test="id != null">
        	#{id,jdbcType=BIGINT},
        </if>
        <if test="createDate != null">
        	#{createDate,jdbcType=TIMESTAMP},
        </if>
        <if test="modifiedDate != null">
        	#{modifiedDate,jdbcType=TIMESTAMP},
        </if>
    </trim>
</insert>
```

#### 插入包含子查询

- 添加数据时默认添加排列顺序：查询表中数据的最大排序号+1

```xml
<insert id="insertArsDept" parameterType="ArsDept" useGeneratedKeys="true" keyProperty="deptId">
        insert into ars_dept
        <trim prefix="(" suffix=")" suffixOverrides=",">
            <if test="parentId != null ">parent_id,</if>
            <if test="deptName != null  and deptName != ''">dept_name,</if>
            <if test="deptAlias != null  and deptAlias != ''">dept_alias,</if>
            <if test="inputCode != null  and inputCode != ''">input_code,</if>
            <if test="fullCode != null  and fullCode != ''">full_code,</if>
            order_num,
            <!-- <if test="orderNum != null ">order_num,</if> -->
            <if test="deptDescription != null  and deptDescription != ''">dept_description,</if>
            <if test="status != null  and status != ''">status,</if>
            <if test="delFlag != null  and delFlag != ''">del_flag,</if>
            <if test="createBy != null  and createBy != ''">create_by,</if>
            <if test="createTime != null ">create_time,</if>
            <if test="updateBy != null  and updateBy != ''">update_by,</if>
            <if test="updateTime != null ">update_time,</if>
            <if test="deptClassId != null ">dept_class_id,</if>
         </trim>
    
        <trim prefix="select " suffixOverrides=",">
            <if test="parentId != null ">#{parentId},</if>
            <if test="deptName != null  and deptName != ''">#{deptName},</if>
            <if test="deptAlias != null  and deptAlias != ''">#{deptAlias},</if>
            <if test="inputCode != null  and inputCode != ''">#{inputCode},</if>
            <if test="fullCode != null  and fullCode != ''">#{fullCode},</if>
            IFNULL((select MAX(order_num)+1 from ars_dept),0),
            <!-- <if test="orderNum != null ">#{orderNum},</if> -->
            <if test="deptDescription != null  and deptDescription != ''">#{deptDescription},</if>
            <if test="status != null  and status != ''">#{status},</if>
            <if test="delFlag != null  and delFlag != ''">#{delFlag},</if>
            <if test="createBy != null  and createBy != ''">#{createBy},</if>
            <if test="createTime != null ">#{createTime},</if>
            <if test="updateBy != null  and updateBy != ''">#{updateBy},</if>
            <if test="updateTime != null ">#{updateTime},</if>
            <if test="deptClassId != null ">#{deptClassId},</if>
         </trim>
    </insert>
```



### choose多分支

```java
public List<Employee> getEmpsByConditionChoose(Employee employee);
```

```xml
<!-- public List<Employee> getEmpsByConditionChoose(Employee employee); -->
	 <select id="getEmpsByConditionChoose" resultType="com.atguigu.mybatis.bean.Employee">
	 	select * from tbl_employee 
	 	<where>
	 <!-- 如果带了id就用id查，如果带了lastName就用lastName查;只会进入其中一个相当于switch -->
	 		<choose>
	 			<when test="id!=null">
	 				id=#{id}
	 			</when>
	 			<when test="lastName!=null">
	 				last_name like #{lastName}
	 			</when>
	 			<when test="email!=null">
	 				email = #{email}
	 			</when>
	 			<otherwise>
	 				gender = 0
	 			</otherwise>
	 		</choose>
	 	</where>
	 </select>
```

```java
//测试choose
	Employee employee = new Employee(1, "Admin", null, null);
	List<Employee> list = mapper.getEmpsByConditionChoose(employee);
	for (Employee emp : list) {
		System.out.println(emp);
	}
//select * from tbl_employee where id=1
```



### set选择性更新

- 主要用于选择性更新，对象中哪几个字段不为空就更新哪几个字段

```java
public void updateEmp(Employee employee);
```

```xml
<!--public void updateEmp(Employee employee);  -->
	 <update id="updateEmp">
	 	<!-- Set标签的使用 -->
	 	update tbl_employee 
		<set>
			<if test="lastName!=null">
				last_name=#{lastName},
			</if>
			<if test="email!=null">
				email=#{email},
			</if>
			<if test="gender!=null">
				gender=#{gender}
			</if>
		</set>
		where id=#{id} 
<!-- 		
		Trim：更新拼串
		update tbl_employee 
		<trim prefix="set" suffixOverrides=",">
			<if test="lastName!=null">
				last_name=#{lastName},
			</if>
			<if test="email!=null">
				email=#{email},
			</if>
			<if test="gender!=null">
				gender=#{gender}
			</if>
		</trim>
		where id=#{id}
-->
	 </update>
```

```java
//测试set标签
Employee employee = new Employee(1, "Admin", null, null);
mapper.updateEmp(employee);
openSession.commit();
```



### foreach遍历集合

```java
/查询员工id'在给定集合中的
	public List<Employee> getEmpsByConditionForeach(@Param("ids")List<Integer> ids);
```

```xml
<!--public List<Employee> getEmpsByConditionForeach(List<Integer> ids);  -->

	 <select id="getEmpsByConditionForeach" resultType="com.atguigu.mybatis.bean.Employee">
	 	select * from tbl_employee
	 	<!--
	 		collection：指定要遍历的集合：
	 			list类型的参数会特殊处理封装在map中，map的key就叫list
	 		item：将当前遍历出的元素赋值给指定的变量
	 		separator:每个元素之间的分隔符
	 		open：遍历出所有结果拼接一个开始的字符
	 		close:遍历出所有结果拼接一个结束的字符
	 		index:索引。遍历list的时候是index就是索引，item就是当前值
	 				      遍历map的时候index表示的就是map的key，item就是map的值
	 		
	 		#{变量名}就能取出变量的值也就是当前遍历出的元素
	 	  -->
	 	<foreach collection="ids" item="item_id" separator=","
	 		open="where id in(" close=")">
	 		#{item_id}
	 	</foreach>
	 </select>
```

```java
//测试foreach
List<Employee> list = mapper.getEmpsByConditionForeach(Arrays.asList(1,2));
for (Employee emp : list) {
	System.out.println(emp);
}
//select * from tbl_employee where id in(1,2)
```



#### 批量保存

```java
public void addEmps(@Param("emps")List<Employee> emps);
```

```xml
<!-- 批量保存 -->
	 <!--public void addEmps(@Param("emps")List<Employee> emps);  -->
	 <!--MySQL下批量保存：可以foreach遍历   mysql支持values(),(),()语法-->
	<insert id="addEmps">
	 	insert into tbl_employee(
	 		last_name,email,gender,d_id
	 	) 
		values
		<foreach collection="emps" item="emp" separator=",">
			(#{emp.lastName},#{emp.email},#{emp.gender},#{emp.dept.id})
		</foreach>
	 </insert>

```

```xml
<!-- 这种方式需要数据库连接属性allowMultiQueries=true；
jdbc.url=jdbc:mysql://localhost:3306/mybatis?allowMultiQueries=true
	 	这种分号分隔多个sql可以用于其他的批量操作（删除，修改） -->
	 <insert id="addEmps">
	 	<foreach collection="emps" item="emp" separator=";">
	 		insert into tbl_employee(last_name,email,gender,d_id)
	 		values(#{emp.lastName},#{emp.email},#{emp.gender},#{emp.dept.id})
	 	</foreach>
	 </insert> 
```

```java
@Test
	public void testBatchSave() throws IOException{
		SqlSessionFactory sqlSessionFactory = getSqlSessionFactory();
		SqlSession openSession = sqlSessionFactory.openSession();
		try{
			EmployeeMapperDynamicSQL mapper = openSession.getMapper(EmployeeMapperDynamicSQL.class);
			List<Employee> emps = new ArrayList<>();
			emps.add(new Employee(null, "smith0x1", "smith0x1@atguigu.com", "1",new Department(1)));
			emps.add(new Employee(null, "allen0x1", "allen0x1@atguigu.com", "0",new Department(1)));
			mapper.addEmps(emps);
			openSession.commit();
		}finally{
			openSession.close();
		}
	}
```



#### oracle

```java
public void addEmps(@Param("emps")List<Employee> emps);
```

```properties
Oracle数据库批量保存： 
	 	Oracle不支持values(),(),()
	 	Oracle支持的批量方式
	 	1、多个insert放在begin - end里面
	 		begin
			    insert into employees(employee_id,last_name,email) 
			    values(employees_seq.nextval,'test_001','test_001@atguigu.com');
			    insert into employees(employee_id,last_name,email) 
			    values(employees_seq.nextval,'test_002','test_002@atguigu.com');
			end;
		2、利用中间表：
			insert into employees(employee_id,last_name,email)
		       select employees_seq.nextval,lastName,email from(
		              select 'test_a_01' lastName,'test_a_e01' email from dual
		              union
		              select 'test_a_02' lastName,'test_a_e02' email from dual
		              union
		              select 'test_a_03' lastName,'test_a_e03' email from dual
		       )	

	 
```

```xml
<insert id="addEmps" databaseId="oracle">
	 	<!-- oracle第一种批量方式 -->
	 	<foreach collection="emps" item="emp" open="begin" close="end;">
	 		insert into employees(employee_id,last_name,email) 
			    values(employees_seq.nextval,#{emp.lastName},#{emp.email});
	 	</foreach> 
	 </insert>
```

```xml
<insert id="addEmps" databaseId="oracle">
	 	<!-- oracle第二种批量方式  -->
	 	insert into employees(
	 		<!-- 引用外部定义的sql -->
	 		<include refid="insertColumn">
	 			<property name="testColomn" value="abc"/>
	 		</include>
	 	)
	 	<foreach collection="emps" item="emp" separator="union"
	 		open="select employees_seq.nextval,lastName,email from("
	 		close=")">
	 		select #{emp.lastName} lastName,#{emp.email} email from dual
	 	</foreach>
	 </insert>
```



### 内置参数

```properties
两个内置参数：
	不只是方法传递过来的参数可以被用来判断，取值。。。
	mybatis默认还有两个内置参数：
	_parameter:代表整个参数
	 	单个参数：_parameter就是这个参数
	 	多个参数：参数会被封装为一个map；_parameter就是代表这个map
	 	
	 _databaseId:如果配置了databaseIdProvider标签。
	 	_databaseId就是代表当前数据库的别名oracle

```

```java
public List<Employee> getEmpsTestInnerParameter(Employee employee);
```

```xml
<!--public List<Employee> getEmpsTestInnerParameter(Employee employee);  -->

	  <select id="getEmpsTestInnerParameter" resultType="com.atguigu.mybatis.bean.Employee">
	  		<!-- bind：可以将OGNL表达式的值绑定到一个变量中，方便后来引用这个变量的值 -->
	  		<bind name="_lastName" value="'%'+lastName+'%'"/>
	  		<if test="_databaseId=='mysql'">
	  			select * from tbl_employee
	  			<if test="_parameter!=null">
	  				where last_name like #{lastName}
	  			</if>
	  		</if>
	  		<if test="_databaseId=='oracle'">
	  			select * from employees
	  			<if test="_parameter!=null">
	  				where last_name like #{_parameter.lastName}
	  			</if>
	  		</if>
	  </select>
```

```java
@Test
	public void testInnerParam() throws IOException{
		SqlSessionFactory sqlSessionFactory = getSqlSessionFactory();
		SqlSession openSession = sqlSessionFactory.openSession();
		try{
			EmployeeMapperDynamicSQL mapper = openSession.getMapper(EmployeeMapperDynamicSQL.class);
			Employee employee2 = new Employee();
			employee2.setLastName("e");
			List<Employee> list = mapper.getEmpsTestInnerParameter(employee2);
			for (Employee employee : list) {
				System.out.println(employee);
			}
		}finally{
			openSession.close();
		}
	}
```



### 重用sql

```properties
抽取可重用的sql片段。方便后面引用 
	  	1、sql抽取：经常将要查询的列名，或者插入用的列名抽取出来方便引用
	  	2、include来引用已经抽取的sql：
	  	3、include还可以自定义一些property，sql标签内部就能使用自定义的属性
	  			include-property：取值的正确方式${prop},
	  			#{不能使用这种方式}
```

```xml
<sql id="insertColumn">
	 <if test="_databaseId=='oracle'">
	  		employee_id,last_name,email
	 </if>
	 <if test="_databaseId=='mysql'">
	  		last_name,email,gender,d_id
	 </if>
</sql>
```

```xml
insert into employees(
	 		<!-- 引用外部定义的sql -->
	 		<include refid="insertColumn">
	 			<!--<property name="testColomn" value="abc"/>-->
	 		</include>
)

insert into tbl_employee(
	 <include refid="insertColumn"></include>
)
```


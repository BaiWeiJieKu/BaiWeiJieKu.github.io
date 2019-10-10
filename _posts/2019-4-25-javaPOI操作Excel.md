---
layout: post
title: "javaPOI操作Excel"
categories: javaPOI
tags: POI Excel
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 创建工作簿

- `poi-3.9-20121203.jar`

```java
package com.java1234.poi;

import java.io.FileOutputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

public class Demo1 {

	public static void main(String[] args) throws Exception {
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		FileOutputStream fileOut=new FileOutputStream("e:\\新工作簿.xls");
		wb.write(fileOut);//输出
		fileOut.close();//关闭
	}
}
```



#### 多sheet

```java
package com.java1234.poi;

import java.io.FileOutputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

public class Demo2 {

	public static void main(String[] args) throws Exception {
		
		Workbook wb=new HSSFWorkbook(); // 定义一个新的工作簿
		wb.createSheet("第一个sheet页");  // 创建一个sheet页
		wb.createSheet("第二个sheet页");  // 创建第二个sheet页
		FileOutputStream fileOut=new FileOutputStream("c:\\多个sheet页的工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 添加行列

```java
package com.java1234.poi;

import java.io.FileOutputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class Demo3 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); // 定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  // 创建第一个sheet页
		Row row=sheet.createRow(0); // 创建一个行
		Cell cell=row.createCell(0); //创建一个单元格，第一列
		cell.setCellValue(1);  // 给单元格设置值为1
		
		row.createCell(1).setCellValue(1.2);   //创建一个单元格 第二列值是1.2
		
		row.createCell(2).setCellValue("字符串"); //创建一个单元格 第三列值是字符串
		
		row.createCell(3).setCellValue(false);  //创建一个单元格 第四列值是布尔类型
		
		FileOutputStream fileOut=new FileOutputStream("c:\\新工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 时间格式化

```java
package com.java1234.poi;

import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class Demo4 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		Row row=sheet.createRow(0); //创建一行
		Cell cell=row.createCell(0); //创建一个单元格 第一列
		cell.setCellValue(new Date());  // 给单元格设置一个时间值
		
		CreationHelper createHelper=wb.getCreationHelper();//时间格式化工具类
		CellStyle cellStyle=wb.createCellStyle(); //单元格样式
		cellStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyy-mm-dd hh:mm:ss"));
		cell=row.createCell(1); //第二列
		cell.setCellValue(new Date());
		cell.setCellStyle(cellStyle);
		
		cell=row.createCell(2);  // 第三列
		cell.setCellValue(Calendar.getInstance());
		cell.setCellStyle(cellStyle);
		
		FileOutputStream fileOut=new FileOutputStream("c:\\新工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 不同类型值

```java
package com.java1234.poi;

import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class Demo5 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		Row row=sheet.createRow(0); //创建一行
		Cell cell=row.createCell(0); //创建一个单元格 第一列
		cell.setCellValue(new Date());  // 给单元格设置一个时间值
		
		row.createCell(1).setCellValue(1);
		row.createCell(2).setCellValue("一个字符串");
		row.createCell(3).setCellValue(true);
		row.createCell(4).setCellValue(HSSFCell.CELL_TYPE_NUMERIC);
		row.createCell(5).setCellValue(false);
		
		FileOutputStream fileOut=new FileOutputStream("c:\\新工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 遍历内容

```java
package com.java1234.poi;

import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

public class Demo6 {

	public static void main(String[] args) throws Exception{
		InputStream is=new FileInputStream("c:\\二货名单.xls");
		POIFSFileSystem fs=new POIFSFileSystem(is);
		HSSFWorkbook wb=new HSSFWorkbook(fs);
		HSSFSheet hssfSheet=wb.getSheetAt(0); //获取第一个sheet页
		if(hssfSheet==null){
			return;
		}
		// 遍历行Row
		for(int rowNum=0;rowNum<=hssfSheet.getLastRowNum();rowNum++){
			HSSFRow hssfRow=hssfSheet.getRow(rowNum);
			if(hssfRow==null){
				continue;
			}
			// 遍历列Cell
			for(int cellNum=0;cellNum<=hssfRow.getLastCellNum();cellNum++){
				HSSFCell hssfCell=hssfRow.getCell(cellNum);
				if(hssfCell==null){
					continue;
				}
				System.out.print(" "+getValue(hssfCell));
			}
			System.out.println();
		}
	}
	
	private static String getValue(HSSFCell hssfCell){
		//如果是布尔类型或数字类型，转换为字符串
		if(hssfCell.getCellType()==HSSFCell.CELL_TYPE_BOOLEAN){
			return String.valueOf(hssfCell.getBooleanCellValue());
		}else if(hssfCell.getCellType()==HSSFCell.CELL_TYPE_NUMERIC){
			return String.valueOf(hssfCell.getNumericCellValue());
		}else{
			return String.valueOf(hssfCell.getStringCellValue());
		}
	}
}

```



#### 抽取数据

```java
package com.java1234.poi;

import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.poi.hssf.extractor.ExcelExtractor;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

public class Demo7 {

	public static void main(String[] args) throws Exception{
		InputStream is=new FileInputStream("c:\\二货名单.xls");
		POIFSFileSystem fs=new POIFSFileSystem(is);
		HSSFWorkbook wb=new HSSFWorkbook(fs);
		//抽取所有数据
		ExcelExtractor excelExtractor=new ExcelExtractor(wb);
		excelExtractor.setIncludeSheetNames(false);// 不需要sheet页的名字
		System.out.println(excelExtractor.getText());
	}
	

}

```



#### 单元格对齐

```java
package com.java1234.poi;

import java.io.FileOutputStream;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
/*
单元格对齐方式
*/
public class Demo8 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		Row row=sheet.createRow(2); //创建一个行
		row.setHeightInPoints(30);
		
		createCell(wb, row, (short)0, HSSFCellStyle.ALIGN_CENTER, HSSFCellStyle.VERTICAL_BOTTOM);
		createCell(wb, row, (short)1, HSSFCellStyle.ALIGN_FILL, HSSFCellStyle.VERTICAL_CENTER);
		createCell(wb, row, (short)2, HSSFCellStyle.ALIGN_LEFT, HSSFCellStyle.VERTICAL_TOP);
		createCell(wb, row, (short)3, HSSFCellStyle.ALIGN_RIGHT, HSSFCellStyle.VERTICAL_TOP);
		
		FileOutputStream fileOut=new FileOutputStream("c:\\工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
	
	/**
	 * 创建一个单元格并为其设定指定的对齐方式
	 * @param wb 工作簿
	 * @param row 行
	 * @param column  列
	 * @param halign  水平方式对齐方式
	 * @param valign  垂直方向对齐方式
	 */
	private static void createCell(Workbook wb,Row row,short column,short halign,short valign){
		Cell cell=row.createCell(column);  // 创建单元格
		cell.setCellValue(new HSSFRichTextString("Align It"));  // 设置值
		CellStyle cellStyle=wb.createCellStyle(); // 创建单元格样式
		cellStyle.setAlignment(halign);  // 设置单元格水平方向对其方式
		cellStyle.setVerticalAlignment(valign); // 设置单元格垂直方向对齐方式
		cell.setCellStyle(cellStyle); // 设置单元格样式
	}
	

}

```



#### 边框样式

```java
package com.java1234.poi;

import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
/*
边框样式
*/
public class Demo9 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		Row row=sheet.createRow(1); //创建一个行
		
		Cell cell=row.createCell(1); // 创建一个单元格
		cell.setCellValue(4);
		
		CellStyle cellStyle=wb.createCellStyle(); 
		cellStyle.setBorderBottom(CellStyle.BORDER_THIN); //底部边框
		cellStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex()); // 底部颜色
		
		cellStyle.setBorderLeft(CellStyle.BORDER_THIN);  // 左边边框
		cellStyle.setLeftBorderColor(IndexedColors.GREEN.getIndex()); // 左边框颜色
		
		cellStyle.setBorderRight(CellStyle.BORDER_THIN); // 右边框
		cellStyle.setRightBorderColor(IndexedColors.BLUE.getIndex());  // 右边框颜色
		
		cellStyle.setBorderTop(CellStyle.BORDER_MEDIUM_DASHED); // 上边框
		cellStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());  // 上边框颜色
		
		cell.setCellStyle(cellStyle);
		FileOutputStream fileOut=new FileOutputStream("c:\\工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 填充色

```java
package com.java1234.poi;

import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
/*
填充色
*/
public class Demo10 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		Row row=sheet.createRow(1); //创建一个行
		
		Cell cell=row.createCell(1);//创建一列
		cell.setCellValue("XX");
		CellStyle cellStyle=wb.createCellStyle();//创建一个列样式
		cellStyle.setFillBackgroundColor(IndexedColors.AQUA.getIndex()); // 背景色
		cellStyle.setFillPattern(CellStyle.BIG_SPOTS);  
		cell.setCellStyle(cellStyle);
		
		
		Cell cell2=row.createCell(2);//创建第二列
		cell2.setCellValue("YYY");
		CellStyle cellStyle2=wb.createCellStyle();
		cellStyle2.setFillForegroundColor(IndexedColors.RED.getIndex()); // 前景色
		cellStyle2.setFillPattern(CellStyle.SOLID_FOREGROUND);  
		cell2.setCellStyle(cellStyle2);
		
		FileOutputStream fileOut=new FileOutputStream("c:\\工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 单元格合并

```java
package com.java1234.poi;

import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
/*
单元格合并
*/
public class Demo11 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		Row row=sheet.createRow(1); //创建一个行
		
		Cell cell=row.createCell(1);
		cell.setCellValue("单元格合并测试");
		
		sheet.addMergedRegion(new CellRangeAddress(
				1, // 起始行
				2, // 结束行
				1, // 起始列
				2  // 结束列
		));
		
		
		FileOutputStream fileOut=new FileOutputStream("c:\\工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 字体处理

```java
package com.java1234.poi;

import java.io.FileOutputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
/*
字体处理
*/
public class Demo12 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		Row row=sheet.createRow(1); //创建一个行
		
		// 创建一个字体处理类
		Font font=wb.createFont();
		font.setFontHeightInPoints((short)24);//高度
		font.setFontName("Courier New");
		font.setItalic(true);//斜体
		font.setStrikeout(true);
		
		CellStyle style=wb.createCellStyle();
		style.setFont(font);
		
		Cell cell=row.createCell((short)1);
		cell.setCellValue("This is test of fonts");
		cell.setCellStyle(style);
		
		FileOutputStream fileOut=new FileOutputStream("c:\\工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 读取并重写

```java
package com.java1234.poi;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
/*
读取和重写工作簿
*/
public class Demo13 {

	public static void main(String[] args) throws Exception{
		//读取文件
		InputStream inp=new FileInputStream("c:\\工作簿.xls");
		POIFSFileSystem fs=new POIFSFileSystem(inp);
		Workbook wb=new HSSFWorkbook(fs);
		Sheet sheet=wb.getSheetAt(0);  //获取第一个sheet页
		Row row=sheet.getRow(0); // 获取第一行
		Cell cell=row.getCell(0); //获取单元格
        //如果第一列为空，则创建第四列，并且赋值为‘测试单元格’
		if(cell==null){
			cell=row.createCell(3);
		}
		cell.setCellType(Cell.CELL_TYPE_STRING);
		cell.setCellValue("测试单元格");
		
		FileOutputStream fileOut=new FileOutputStream("c:\\工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 换行

```java
package com.java1234.poi;

import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
/*
换行
*/
public class Demo14 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		Row row=sheet.createRow(2); //创建一个行
		Cell cell=row.createCell(2);
		cell.setCellValue("我要换行 \n 成功了吗？");
		
		CellStyle cs=wb.createCellStyle();
		//设置可以换行
		cs.setWrapText(true);
		cell.setCellStyle(cs);
		
		// 调整行高度
		row.setHeightInPoints(2*sheet.getDefaultRowHeightInPoints());
		// 调整单元格宽度
		sheet.autoSizeColumn(2);
		
		FileOutputStream fileOut=new FileOutputStream("c:\\工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



#### 数据格式

```java
package com.java1234.poi;

import java.io.FileOutputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
/*
数据格式
*/
public class Demo15 {

	public static void main(String[] args) throws Exception{
		Workbook wb=new HSSFWorkbook(); //定义一个新的工作簿
		Sheet sheet=wb.createSheet("第一个sheet页");  //创建第一个sheet页
		CellStyle style;
		//创建数据格式
		DataFormat format=wb.createDataFormat();
		Row row;
		Cell cell;
		short rowNum=0;
		short colNum=0;
		//创建一行
		row=sheet.createRow(rowNum++);
		cell=row.createCell(colNum);
		cell.setCellValue(111111.25);
		
		style=wb.createCellStyle();
		style.setDataFormat(format.getFormat("0.0")); // 设置数据格式
		cell.setCellStyle(style);
		
		row=sheet.createRow(rowNum++);
		cell=row.createCell(colNum);
		cell.setCellValue(1111111.25);
		style=wb.createCellStyle();
		style.setDataFormat(format.getFormat("#,##0.000"));
		cell.setCellStyle(style);
		
		FileOutputStream fileOut=new FileOutputStream("c:\\工作簿.xls");
		wb.write(fileOut);
		fileOut.close();
	}
}

```



### struts2导出

#### 普通方法

- Action类

```java
	public String export()throws Exception{
		Connection con=null;
		try {
			con=dbUtil.getCon();
			//创建一个工作簿
			Workbook wb=new HSSFWorkbook();
			//设置工作簿头部
			String headers[]={"编号","姓名","联系电话","Email","QQ"};
			ResultSet rs=userDao.userList(con, null);
			ExcelUtil.fillExcelData(rs, wb, headers);
			ResponseUtil.export(ServletActionContext.getResponse(), wb, "导出excel.xls");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				dbUtil.closeCon(con);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return null;
	}
```



#### 模板方法

```java
public String export2()throws Exception{
		Connection con=null;
		try {
			con=dbUtil.getCon();
			ResultSet rs=userDao.userList(con, null);
			Workbook wb=ExcelUtil.fillExcelDataWithTemplate(userDao.userList(con, null), "userExporTemplate.xls");
			ResponseUtil.export(ServletActionContext.getResponse(), wb, "模板导出excel.xls");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				dbUtil.closeCon(con);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return null;
	}
```



#### 工具类

```java
package com.java1234.util;

import java.io.InputStream;
import java.sql.ResultSet;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class ExcelUtil {
	/**
	 * 把内容填充到工作簿
	 * @param rs 数据集
	 * @param wb 工作簿
	 * @param headers 工作簿头部
	 * @throws Exception
	 */
	public static void fillExcelData(ResultSet rs,Workbook wb,String[] headers)throws Exception{
		int rowIndex=0;
		Sheet sheet=wb.createSheet();//创建一个sheet
		Row row=sheet.createRow(rowIndex++);//从第一行开始
		for(int i=0;i<headers.length;i++){
			//把头部写入工作簿
			row.createCell(i).setCellValue(headers[i]);
		}
		//遍历数据集，写入工作簿
		while(rs.next()){
			row=sheet.createRow(rowIndex++);
			for(int i=0;i<headers.length;i++){
				row.createCell(i).setCellValue(rs.getObject(i+1).toString());
			}
		}
	}
	/**
	 * 用流的方式读取模板
	 * @param rs 数据集
	 * @param templateFileName 模板名称
	 * @return
	 * @throws Exception
	 */
	public static Workbook fillExcelDataWithTemplate(ResultSet rs,String templateFileName)throws Exception{
		//读取包下的Excel模板
		InputStream inp=ExcelUtil.class.getResourceAsStream("/com/java1234/template/"+templateFileName);
		POIFSFileSystem fs=new POIFSFileSystem(inp);
		Workbook wb=new HSSFWorkbook(fs);
		Sheet sheet=wb.getSheetAt(0);
		//获取列数
		int cellNums=sheet.getRow(0).getLastCellNum();
		int rowIndex=1;
		while(rs.next()){
			Row row=sheet.createRow(rowIndex++);
			for(int i=0;i<cellNums;i++){
				row.createCell(i).setCellValue(rs.getObject(i+1).toString());
			}
		}
		return wb;
	}
	/**
	 * excel列数据类型转换，转换为字符串烈性
	 * @param hssfCell 列
	 * @return
	 */
	public static String formatCell(HSSFCell hssfCell){
		if(hssfCell==null){
			return "";
		}else{
			if(hssfCell.getCellType()==HSSFCell.CELL_TYPE_BOOLEAN){
				return String.valueOf(hssfCell.getBooleanCellValue());
			}else if(hssfCell.getCellType()==HSSFCell.CELL_TYPE_NUMERIC){
				return String.valueOf(hssfCell.getNumericCellValue());
			}else{
				return String.valueOf(hssfCell.getStringCellValue());
			}
		}
	}
}

```

```java
package com.java1234.util;

import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Workbook;


public class ResponseUtil {
	/**
	 * 向前台打印数据，如json数据
	 * @param response
	 * @param o
	 * @throws Exception
	 */
	public static void write(HttpServletResponse response,Object o)throws Exception{
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out=response.getWriter();
		out.print(o.toString());
		out.flush();
		out.close();
	}
	/**
	 * 以流的形式导出Excel
	 * @param response HttpServletResponse
	 * @param wb 工作簿
	 * @param fileName 文件名
	 * @throws Exception
	 */
	public static void export(HttpServletResponse response,Workbook wb,String fileName)throws Exception{
		response.setHeader("Content-Disposition", "attachment;filename="+new String(fileName.getBytes("utf-8"),"iso8859-1"));
		response.setContentType("application/ynd.ms-excel;charset=UTF-8");
		OutputStream out=response.getOutputStream();
		wb.write(out);
		out.flush();
		out.close();
	}

}

```



### struts2导入

- 使用模板导入数据到数据库

```java
public String upload()throws Exception{
		//获取前台传入的Excel工作簿
		POIFSFileSystem fs=new POIFSFileSystem(new FileInputStream(userUploadFile));
		HSSFWorkbook wb=new HSSFWorkbook(fs);
		HSSFSheet hssfSheet=wb.getSheetAt(0);  // 获取第一个sheet页
		if(hssfSheet!=null){
			for(int rowNum=1;rowNum<=hssfSheet.getLastRowNum();rowNum++){
				HSSFRow hssfRow=hssfSheet.getRow(rowNum);
				if(hssfRow==null){
					continue;
				}
				//获取每一列值封装对象
				User user=new User();
				user.setName(ExcelUtil.formatCell(hssfRow.getCell(0)));
				user.setPhone(ExcelUtil.formatCell(hssfRow.getCell(1)));
				user.setEmail(ExcelUtil.formatCell(hssfRow.getCell(2)));
				user.setQq(ExcelUtil.formatCell(hssfRow.getCell(3)));
				Connection con=null;
				try{
					con=dbUtil.getCon();
					userDao.userAdd(con, user);
				}catch(Exception e){
					e.printStackTrace();
				}finally{
					dbUtil.closeCon(con);
				}
			}
		}
		JSONObject result=new JSONObject();
		result.put("success", "true");
		ResponseUtil.write(ServletActionContext.getResponse(), result);
		return null;
	}
```



### servlet导入

```java
package com.zhuoer.qsecond.servlet;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.zhuoer.qmaintance.utils.RepairInfoTools;

/**
 * 用Excel导入数据到partstate表 
 */
@WebServlet("/UploadPartState")
public class UploadPartState extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UploadPartState() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		response.setHeader("Access-Control-Allow-Origin", "*");// 解决跨域问题

		Map<String, Object> map = new HashMap();
		// 获取前台传入的Excel工作簿
		FileItemFactory factory = new DiskFileItemFactory();
		ServletFileUpload upload = new ServletFileUpload(factory);
		List items;
		try {
			items = upload.parseRequest(request);
			InputStream is = null;
			Iterator iter = items.iterator();
			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next();
				if (!item.isFormField()) {
					is = item.getInputStream();
				}
			}

			POIFSFileSystem fs = new POIFSFileSystem(is);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			HSSFSheet hssfSheet = wb.getSheetAt(0); // 获取第一个sheet页
			if (hssfSheet != null) {
				for (int rowNum = 1; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
					HSSFRow hssfRow = hssfSheet.getRow(rowNum);
					if (hssfRow == null) {
						continue;
					}
					// 获取每一列值封装对象
					String sql = "insert into partstate(department_no,department_name,"
							+ "device_no,device_name,part_no,part_name,state_no,"
							+ "state_name) values(?,?,?,?,?,?,?,?)";
					int executeUpdate = RepairInfoTools.executeUpdate(sql, ExcelUtil.formatCell(hssfRow.getCell(0)),
							ExcelUtil.formatCell(hssfRow.getCell(1)), ExcelUtil.formatCell(hssfRow.getCell(2)),
							ExcelUtil.formatCell(hssfRow.getCell(3)), ExcelUtil.formatCell(hssfRow.getCell(4)),
							ExcelUtil.formatCell(hssfRow.getCell(5)), ExcelUtil.formatCell(hssfRow.getCell(6)),
							ExcelUtil.formatCell(hssfRow.getCell(7)));

					map.put("result", executeUpdate > 0 ? true : false);
				}
			} else {
				map.put("result", false);
			}

			Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			String json = gson.toJson(map);
			response.getWriter().write(json);
		} catch (FileUploadException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

```



### 项目地址

https://github.com/BaiWeiJieKu/java_poi
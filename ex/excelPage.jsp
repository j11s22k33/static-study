<%@ page language="java" contentType="application/vnd.ms-excel; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql"%>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%
	//String filename = (String) request.getAttribute("fileName");
	String filename = "test.xls";
	//response.setHeader("Content-Disposition", "inline; filename=" + filename); //브라우저에서 바로열기 형식
	response.setHeader("Content-Disposition", "attachment; filename=" + filename); //첨부 형식
	response.setHeader("Content-Description", "JSP Generated Data");
	response.setHeader("Content-Transfer-Encoding", "binary");

	/*
	HTML 문서를 확장자만 XLS로 변경하였기에
	엑셀파일을 열때 "...확장명에서 지정한 형식과 다릅니다.." 라는 메시지가 출력된다
	
	이 메시지를 뜨지 않게 하려면 apache microsort.document lib POI나 JExcel 등을 사용해 직접 바이너리 파일을 생성해야한다
	*/
%>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<style type="text/css">
thead td {
	text-align: center;
	background-color: '#CACACA';
}

tbody td {
	text-align: center;
	mso-number-format: \@;
	<!--
	0011
	숫자를
	그대로
	표현해
	준다
	-->
}

tfoot td {
	text-align: center;
	mso-number-format: \@;
}
</style>
</head>
<body>
	<table border=1>
		<!-- 테이블 내의 테두리를 그린다 -->
		<thead>
			<tr>
				<td>컬럼명1</td>
				<td>컬럼명2</td>
				<td>컬럼명3</td>
				<td>컬럼명4</td>
				<td>컬럼명5</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>가나다</td>
				<td>ABC</td>
				<td>000123</td>
				<td>000123</td>
				<td>2013-01-01</td>
			</tr>
			<tr>
				<td>가나다</td>
				<td>ABC</td>
				<td>000123</td>
				<td>000123</td>
				<td>2013-01-01</td>
			</tr>
		</tbody>
		<tfoot></tfoot>
	</table>
</body>
</html>
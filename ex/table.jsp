<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql"%>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/WEB-INF/jspf/prelude.jspf"%>
<%@ include file="/WEB-INF/jspf/keepSession.jspf"%>
<title></title>
<style type="text/css">

table.fixed {
	table-layout: fixed; width: 0; height: 0;
}

td.nowarp {
	white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
}

td.empty {
	border: 0px;
}

table caption {
	padding: 5px; font-size: 14px; text-align: left; font-weight: 600;
}

table td {
	min-width:24px; height: 24px; border: 1px solid #222222; padding: 0 2px;
}

table {
	position: relative; border-collapse: collapse; border-spacing: 0px 0px; empty-cells: hide; text-align: center;
}

caption.top {
	caption-side: top; text-align: left;
}

caption.bottom {
	caption-side: bottom; text-align: left;
}

table thead,table tfoot {
	color: #fffafa; background-color: #222222;
}

</style>
<script type="text/javascript">
	$(document).ready(function() {

		//
	});
</script>
</head>
<body>
	<div>
		<table>
			<caption class='top'>상단 캡션</caption>
			<caption class='bottom'>하단 캡션</caption>
			<colgroup>
				<col width=300>
				<col width=300>
				<col width=300>
			</colgroup>
			<thead>
				<tr>
					<td><div style="width: 500px; height: 150px;"></div>헤더1</td>
					<td>헤더2</td>
					<td>헤더3</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td></td>
					<td>내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1 내용1</td>
					<td>내용2 내용2 내용2 내용2 내용2 내용2 내용2 내용2 내용2 내용2 내용2 내용2 내용2 내용2</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<td>푸터1</td>
					<td colspan=2>푸터2</td>
				</tr>
			</tfoot>
		</table>
	</div>
</body>
</html>
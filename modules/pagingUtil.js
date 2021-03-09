function PagingUtil() {
	var pc = new PagingCalculation();
	var $table = null;

	var options = {
		pageNum : 1, //선택된 페이지번호
		pageLen : 5, //화면에 표시할 페이지 개수  ( [처음] [1] [2] [맨끝] )
		contentLen : 5, //화면에 표시할 컨텐츠 개수
		totalContentLen : 1, //총 컨텐츠 수
		click : function(pageNum) { //페이지번호를 클릭했을때 

		},
	};

	this.display = function(containerSelector, _options) {
		updateOption(_options);
		calculation();
		if ($table) {
			$table.remove();
		}
		$table = createDisplay();
		$(containerSelector).append($table);
		return pc;
	};

	function updateOption(_options) {
		$.each(_options, function(key, val) {
			options[key] = $.type(val) != 'function' ? Number(val) : val;
		});
	}

	function calculation() {
		pc.calculation(options.pageNum, options.pageLen, options.contentLen, options.totalContentLen);
	}

	function createDisplay() {
		var $table = $("<table/>");
		var $tr = $("<tr/>").appendTo($table);

		// ◀◀ [처음]
		if (pc.pageNum > 1) {
			$("<td/>").html("처음").appendTo($tr).click(function(e) {
				options.click(1);
			});
		}

		// ◀ [이전]
		if (pc.pageNum > pc.pageLen) {
			$("<td/>").html("이전").appendTo($tr).click(function(e) {
				options.click(pc.beginPageNum - 1);
			});
		}

		// 1,2,3,4, ....
		for ( var i = pc.beginPageNum; i <= pc.endPageNum; i += 1) {
			(function(n) {
				$("<td/>").attr('id', 'pazing-number-' + n).html(i).appendTo($tr).click(function(e) {
					options.click(n);
				});
			})(i);
		}

		// ▶ [다음]
		if (pc.pageLen < pc.lastPageNum && pc.endPageNum != pc.lastPageNum) {
			$("<td/>").html("다음").appendTo($tr).click(function(e) {
				options.click(pc.endPageNum + 1);
			});
		}

		// ▶▶ [맨끝]
		if (pc.endPageNum != pc.lastPageNum) {
			$("<td/>").html("맨끝").appendTo($tr).click(function(e) {
				options.click(pc.lastPageNum);
			});
		}

		////////////////////스타일+속성
		//테이블
		$table.attr({
			align : 'center',
		}).css({
			'border-collapse' : 'separate',
			'border-spacing' : '10px 4px',
		});

		var $tds = $table.find('td');
		//페이지번호 공통
		$tds.css({
			'border' : '1px solid black',
			'text-align' : 'center',
			'min-width' : '15px',
		});
		//선택된 페이지번호
		$tds.filter('[id=pazing-number-' + pc.pageNum + ']').css({
			'background-color' : 'blue',
		});
		//선택안된 페이지번호
		$tds.filter('[id!=pazing-number-' + pc.pageNum + ']').css({
			'cursor' : 'pointer',
		}).hover(function(e) { //mouseover
			$(this).css({
				'background-color' : 'orange',
				'color' : 'white',
			});
		}, function(e) { //mouseout
			$(this).css({
				'background-color' : '',
				'color' : '',
			});
		});
		return $table;
	}
}

/**
 * 페이징 계산만 해주는 클래스 이것만 따로 사용해도 된다
 * */

// 페이지는 1페이지부터 시작한다
function PagingCalculation() {
	this.pageNum = 0; //선택된 페이지번호
	this.pageLen = 0; // 화면에 표시할 페이지 개수  ( [처음] [1] [2] [맨끝] )
	this.contentLen = 0; //화면에 표시할 컨텐츠 개수
	this.totalContentLen = 0; //총 컨텐츠 수

	this.beginPageNum = 0; // 화면에 표시할 시작 페이지번호
	this.endPageNum = 0; // 화면에 표시할 끝 페이지 번호
	this.beginContentIdx = 0; // 화면에 표시할 시작 컨텐츠 인덱스
	this.endContentIdx = 0; // 화면에 표시할 끝 컨텐츠 인덱스
	this.lastPageNum = 0; // 마지막 페이지 번호

	this.calculation = function(pageNum, pageLen, contentLen, totalContentLen) {
		this.pageNum = pageNum;
		this.pageLen = pageLen;
		this.contentLen = contentLen;
		this.totalContentLen = totalContentLen;

		this.lastPageNum = Math.ceil(this.totalContentLen / this.contentLen); //나머지가 있으면 올림.  1.3 -> 2

		if (this.pageNum > this.lastPageNum) {
			this.pageNum = this.lastPageNum;
		}

		this.beginPageNum = this.pageNum - ((this.pageNum - 1) % this.pageLen);

		this.endPageNum = this.beginPageNum + this.pageLen - 1;
		if (this.endPageNum > this.lastPageNum) {
			this.endPageNum = this.lastPageNum;
		}

		this.beginContentIdx = (this.pageNum - 1) * this.contentLen;
		this.endContentIdx = (this.beginContentIdx - 1) + this.contentLen;
		if (this.endContentIdx + 1 >= this.totalContentLen) {
			this.endContentIdx = this.totalContentLen - 1;
		}
	};
};
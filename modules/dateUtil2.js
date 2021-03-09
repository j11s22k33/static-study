function DateUtil(dateobj) {
    this.date = dateobj ? dateobj : new Date();

    this.format = function (f) {
        return this.date.format(f);
    };

    /**
     * @Param {Number} 밀리초
     */
    this.now = Date.now;

    /**
     * @returns {Number}
     * */
    this.getTime = function () {
        return this.date.getTime();
    };
    
    /**
     * @param {String} 2011-12-30 00:00:00
     */
    this.setDateTime = function (dateTime) {
        var dt = dateTime.split(" ");
        this.setDate(dt[0]);
        this.setHours(dt[1]);
        return this;
    };
    
    /**
     * @Param {Number} 밀리초
     */
    this.setTime = function (time) {
        this.date.setTime(time);
        return this;
    };
    
    /**
     * @param {String} 02:30:21
     */
    this.setHours = function (hours) {
        var h = hours.split(":");
        this.date.setHours(Number(h[0]), Number(h[1]), Number(h[2]), 0);
        return this;
    };
    
    /**
     * @param {String} 2011-12-30
     */
    this.setDate = function (date) {
        var d = date.split("-");
        this.date.setFullYear(Number(d[0]), Number(d[1]) - 1, Number(d[2]));
        return this;
    };

    /**
     * 날짜 증가율
     * +7  7일 증가
     * -3  3일 감소
     */
    this.increaseYear = function (n) {
        this.date.setFullYear(this.date.getFullYear() + n);
        return this;
    };

    /**
     * 개월 증가율
     * +7  7개월 증가
     * -3  3개월 감소
     */
    this.increaseMonth = function (n) {
        this.date.setMonth(this.date.getMonth() + n);
        return this;
    };

    /**
     * 날짜 증가율
     * +7  7일 증가
     * -3  3일 감소
     */
    this.increaseDate = function (n) {
        this.date.setDate(this.date.getDate() + n);
        return this;
    };

    /**
     * 분 증가율
     * +7  7분 증가
     * -3  3분 감소
     */
    this.increaseMin = function (n) {
        this.date.setMinutes(this.date.getMinutes() + n);
        return this;
    };

    /**
     * 오늘로 설정 (시스템)
     */
    this.setToday = function () {
        this.date = new Date();
        return this;
    };

    /**
     * 마지막 날로 설정
     */
    this.setLastDate = function () {
        this.date.setMonth(this.date.getMonth() + 1, 0);
        return this;
    };

    /**
     * 첫 날로 설정
     */
    this.setFirstDate = function () {
        this.date.setDate(1);
        return this;
    };
}
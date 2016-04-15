/**
 * Created by hansneil on 21/3/16.
 */
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

/**
 * addEventHandler方法
 * 跨浏览器实现事件绑定
 */
function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+event, hanlder);
    } else  {
        ele["on" + event] = hanlder;
    }
}
/*
 * 获取随机颜色
 */
function getRandomColor() {
    return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
}
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

// 计算每个bar的宽度，空格宽度，起始偏移
function getWidth(width, num) {
    var posObj = {};
    posObj.width = Math.floor(width / (num*2));
    posObj.span = Math.floor(width / num);
    posObj.offset = (width - posObj.span * (num - 1) - posObj.width) / 2;
    return posObj;
}
function getTitle() {
    switch (pageState.nowGraTime) {
        case "day":
            return "每日";
        case "week":
            return "周平均";
        case "month":
            return "月平均";
    }
}
function buildRowHTML(height, width, left) {
    return "<div class='aqi-bar " + pageState.nowGraTime + "' style='height:" + height + "px; width: " + width +"px; left:" + left + "px; background-color:" + getRandomColor() + "'></div>"
}
/**
 * 渲染图表
 */
function renderChart() {
    var wrapper = document.getElementById("aqi-chart-wrap");
    var data = chartData[pageState.nowGraTime][pageState.nowSelectCity];
    var width = wrapper.clientWidth;
    var num = Object.keys(data).length;
    var posObj = getWidth(width, num);
    var innerHTML = "<div class='title'>" + pageState.nowSelectCity + "市"+ getTitle() +"空气质量报告</div>";
    var i = 0;
    for (var key in data) {
        var left = posObj.span * (i++) + posObj.offset;
        innerHTML += buildRowHTML(data[key], posObj.width, left);
    }
    wrapper.innerHTML = innerHTML;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(radio) {
    // 确定是否选项发生了变化

    // 设置对应数据

    // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化

    // 设置对应数据

    // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radio = document.getElementsByName('gra-time');
    for (var i = 0; i < radio.length; i++) {
        (function (m) {
            addEventHandler(radio[m], 'click', function () {
                graTimeChange(radio[m])
            })
        })(i);
    }
    // display values
    addEventHandler(document, 'mouseover', function(event){
        var ele = event.target;
        ele.className += " show";
    });
    addEventHandler(document, 'mouseout', function(event){
        var ele = event.target;
        ele.className = ele.className.replace(/ show/, "");
    });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect = document.getElementById("city-select");
    var innerHTML = "";
    for (var city in aqiSourceData) {
        innerHTML += "<option>" + city + "</option>";
    };
    citySelect.innerHTML = innerHTML;
    pageState.nowSelectCity = citySelect.value;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    addEventHandler(citySelect, "change", citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // ret values
    var week = {}, month = {};

    for (var city in aqiSourceData) {
        var cityweek = {}, citymonth = {};
        var cityAqiData = aqiSourceData[city];
        var dates = Object.getOwnPropertyNames(cityAqiData);
        var weekAqi = 0;
        var weekdays = 0;
        var monthAqi = 0;
        var monthdays = 0;
        var currentMonth = 1;
        for (var i = 0; i < dates.length; i++) {
            var today = cityAqiData[dates[i]];
            if (today) {
                weekdays += 1;
                monthdays += 1;
            }
            weekAqi += today;
            if ((i + 1) % 7 == 0 || i == dates.length - 1) {
                cityweek["第" + Math.floor((i + 1) / 7) + "周"] = weekAqi / weekdays;
                weekAqi = 0;
                weekdays = 0;
            }
            if (Number(dates[i].slice(5, 7)) !== currentMonth || i == dates.length - 1) {
                citymonth["第" + currentMonth + "月"] = monthAqi / monthdays;
                currentMonth++;
                monthdays = 0;
                monthAqi = 0;
            } else {
                monthAqi += today;
            }
        }
        week[city] = cityweek;
        month[city] = citymonth;
    }

    // 处理好的数据存到 chartData 中
    chartData.day = aqiSourceData;
    chartData.week = week;
    chartData.month = month;
    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/*
 * trim函数消除空格
 */
String.prototype.trim = function() {
    return this.replace(/\s+/g, "");
}

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData(inputCity, inputValue) {
    aqiData[inputCity] = inputValue;
}

/**
 * 检查输入的数据是否符合规范
 */
function checkData(inputCity, inputValue) {
    var che_pattern = /^[a-zA-Z\u4e00-\u9fa5a]+$/;
    var int_pattern = /^[0-9]+$/;

    if (inputCity.length == 0) {
        alert("城市名不能为空～");
    } else if (!che_pattern.test(inputCity)) {
        alert("城市名必须为中英文字符～");
    } else if (inputValue.length == 0) {
        alert("空气质量不能为空～");
    } else if (!int_pattern.test(inputValue)) {
        alert("空气质量指数必须为整数～");
    } else {
        return true;
    }
    return false;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var innerHTML = "";
    var tbl = document.getElementById("aqi-table");
    innerHTML += "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>"
    for (var key in aqiData) {
        innerHTML += "<tr><td>"+ key + "</td><td>" + aqiData[key] +
                     "</td><td><button onclick='delBtnHandle(\"" + key +
                     "\")'>删除</button></td></tr>";
    }
    tbl.innerHTML = innerHTML;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    var inputCity = document.getElementById("aqi-city-input").value.trim();
    var inputValue = document.getElementById("aqi-value-input").value.trim();
    if (checkData(inputCity, inputValue)) {
        addAqiData(inputCity, inputValue);
        renderAqiList();
    }
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(key) {
    // do sth.
    delete aqiData[key];
    renderAqiList();
}

/**
 * addEventHandler方法
 * 跨浏览器实现事件绑定
 */
function addEventHandler(element, event, hanlder) {
    if (element.addEventListener) {
        element.addEventListener(event, hanlder, false);
    } else if (element.attachEvent) {
        element.attachEvent("on"+event, hanlder);
    } else {
        element["on" + event] = hanlder;
    }
}

function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    window.onload = function() {
        var addBtn = document.getElementById("add-btn");
        addEventHandler(addBtn, "click", addBtnHandle);
    }
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}

init();
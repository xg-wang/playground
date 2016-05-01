function randomScore(n) {
    var arr = [];
    var sum = 0;
    for (var i = 0; i < n; i++) {
        var num = Math.floor(Math.random() * 101);
        sum += num;
        arr.push(num);
    }
    arr.push(sum);
    return arr;
}

var scoreData = {
    '小明': randomScore(3),
    '小红': randomScore(3),
    '小亮': randomScore(3),
}

var names = ['姓名', '语文', '数学', '英语', '总分'];

var getSortFns = function(name) {
    if (name == names[0]) {
        return;
    }
    return function(d1, d2) {
        return d2 - d1;
    }
}

var table = new Widgets.sortTable('demoTable', names, scoreData, getSortFns);

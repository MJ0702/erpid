export default function (Vue) {
    Vue.filter('cny', function (value, semi) {
        var n = semi >= 0 && semi <= 20 ? semi : 2;
        var s = parseInt(value, 10) + '';
        if (n > 0) {
            s = parseFloat((value + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
        }
        var l = s.split('.')[0].split('').reverse();
        var r = n > 0 ? '.' + s.split('.')[1] : '';
        var t = '';
        for (var i = 0; i < l.length; i++) {
            if (i == 2 && l[3] == '-') { t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? '' : ''); continue; }
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
        }
        return t.split('').reverse().join('') + r;
    });
    
    Vue.filter('DateFmt', function (date, fmt, fc) { //fc 进行加减操作，类似 M+1
        if (!date) return "";
        if (!fmt) fmt = "yyyy-MM-dd";
        if (toString.call(date) != "[object Date]") {
            if (toString.call(date) == "[object String]") {
                var arr = date.split(/[- :]/),
                    date = new Date(arr[0] || "", (arr[1] - 1) || "", arr[2] || "", arr[3] || "", arr[4] || "", arr[5] || "");
                if (date == "Invalid Date") {
                    return date;
                }
            } else {
                return date;
            }
        }
        //进行日期计算
        if (fc) {
            var dateNums = ["y", "M", "d", "h", "m", "s"];
            var dateGets = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds"];
            var dateSets = ["setFullYear", "setMonth", "setDate", "setHours", "setMinutes", "setSeconds"];
            dateNums.forEach(function (v, i) {
                var tfc = fc.match(new RegExp(v + "[-+]+[0-9]*"))
                if (!tfc) return;
                tfc = tfc[0];
                var n = tfc.slice(tfc.indexOf(v) + 1, tfc.length);
                if (Number(n)) {
                    date[dateSets[i]](date[dateGets[i]]() + Number(n));
                }
            })
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "S": date.getMilliseconds() //毫秒
        };

        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    })

}

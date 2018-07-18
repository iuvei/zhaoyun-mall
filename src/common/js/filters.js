import Vue from 'vue'

function toFixed(val, num) {//保留两位小数 并添加人民币符号
	if(!!val){
		return val.toFixed(num)
	}else{
		return ''
	}
}
// 省略手机号中间
function clipNumber(val){
	if(val){
		return val.substring(0,3)+'****'+val.substring(7,11)
	}
}

function time(d,fmt){
	if(d===null)
		return '-'
	else{
		var date=new Date(d)
		var o = {   
			"M+": date.getMonth() + 1, //月份   
			"d+": date.getDate(), //日   
			"h+": date.getHours(), //小时   
			"s+": date.getMinutes(), //分   
			"m+": date.getSeconds(), //秒   
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
			"S": date.getMilliseconds() //毫秒   
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
}

function precent(val,num){
	return parseInt(val*100)+'%'
}

Vue.filter('toFixed', toFixed)
Vue.filter('clipNumber',clipNumber)
Vue.filter('time',time)
Vue.filter('precent',precent)

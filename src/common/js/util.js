import axios from 'axios'
import {$httpSign} from "./httpAll";

// 订单状态
var orderStatus={
  STATUS_YQX:0, // 已取消
  STATUS_WFK:1, // 未付款
  STATUS_YFK:2, // 已付款（可申请退款 如果申请退款后payStatus 变成 2）
  STATUS_YFH:3, // 已发货
  STATUS_WPL:4, // 已收货（可以申请退货-评价）
  STATUS_SHCLZ:5, // 退货申请
  STATUS_YPL:6,    // 完成
  STATUS_SHWC:7,  // 退货审核通过
  STATUS_SHQX:8, //  退货审核拒绝
  STATUS_BILL:9 ,//  快递单号已经填写
  STATUS_YSH:10 ,//   售后完成
  STATUS_CANCLE:11 ,//    售后取消
};
// "售后状态 0 无  1 已经申请 2 同意退换货 3 拒绝退换货 4 同意退款 5 拒绝退款 6 退货退款成功"

// 0:已取消  1:未付款  2:已付款（已支付） 3:已发货（已支付）
// 4:已收货（已支付） 5:已评论
export function getOrderStatus(orderS,payS){
  // 已取消
  if(orderS===orderStatus.STATUS_YQX){
    return 0
  }
  // 未付款
  if(orderS===orderStatus.STATUS_WFK){
    return 1
  }
  // 已付款（已支付）
  if(orderS===orderStatus.STATUS_YFK){
    return 2
  }
  // 已发货（已支付）
  if(orderS===orderStatus.STATUS_YFH){
    return 3
  }
  // 已收货（已支付）
  if(orderS===orderStatus.STATUS_WPL){
    return 4
  }
  // 已评论
  if(orderS===orderStatus.STATUS_YPL){
    return 5
  }
  // 已退款/退货
  if(orderS===orderStatus.STATUS_YSH){
    return 10
  }
}

// 按钮是否显示
// 0：没有定金  1：存在定金   2：收发货状态不一致   3：只有定金
export function showBtn(itemList){
  var status,b=0,c=0,d
  if(itemList.length===1){
    if(itemList[0].earnestPrice===0){
      status=0
    }else{
      status=3
    }
  }else{
    d=itemList[0].shipStatus
    for(var i=0,len=itemList.length;i<len;i++){
      var item=itemList[i]
      if(d!==item.shipStatus){
        status=2
      }
      if(item.earnestPrice===0){
        b++
      }
    }
    if(status!==2){
      if(b===0){
        status=3
      }else if(b===len){
        status=0
      }else{
        status=1
      }
    }
  }
  return status
}
// 1:没有售后或部分售后   2  售后状态  3 售后完成
export function afterSaleStatus(itemList){
  var status=1,i=0,j=0
  itemList.forEach((item)=>{
    switch(item.status){
      case 4:
      case 6:{
        i++
        j++
        break
      }
      case 1:
      case 2:{
        i++
        break
      }
    }
  })
  if(j==itemList.length){
    status=3
  }
  if(i!==j&&i==itemList.length){
    status=2
  }
  return status
}

// 倒计时
export function countDownTime(startTime,endTime){
  var starttime=new Date(startTime).getTime(),
      endtime=new Date(endTime).getTime(),
      nowtime=new Date().getTime()

  function countDown(){
    var lefttime=endtime-new Date().getTime(),
        str=''
    if(lefttime<=0){
      clearInterval(timer)
    }

    var day=Math.floor(lefttime/(24*60*60*1000))
    lefttime=lefttime-24*60*60*1000*day
    var hour=Math.floor(lefttime/(60*60*1000))
    lefttime=lefttime-60*60*1000*hour
    var second=Math.floor(lefttime/(60*1000))
    lefttime=lefttime-60*1000*second
    var minus=Math.floor(lefttime/1000)

    if(day!==0){
      str+=`<em>${day}</em>天`
    }
    str+=`<em>${hour}</em>时<em>${second}</em>分<em>${minus}</em>秒`
    return str
  }

  if(nowtime<starttime){
    return 'not begin'   // 未开始
  }else if(nowtime>endtime){
    return 'end'  // 已结束
  }else{
    return countDown()
  }
}

// 表单验证
let validates = {
  phone(val) {
    return /^(13|15|17|18|19)[0-9]{9}$/.test(val)
  },
  payPwd(val){
    return /^[0-9]{6}$/.test(val)
  },
  password(val){
    return /^(\w+){6,16}$/.test(val)
  },
  cert(val){
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(val)
  },
  validePass(val,val2){
    return val.trim()===val2.trim()
  }
}
export {
  validates
}

// 获取验证码
export function valideCode(obj,val,type) {
  const waitTime=60
  var time = waitTime

  if (obj.isClick) {
    obj.isClick = false
    if (!val.trim()) {
      obj.isClick = true
      obj.errorMsg = '请输入手机号'
    } else if (!validates.phone(val)) {
      obj.isClick = true
      obj.errorMsg = '手机号格式不正确'
    } else {
      obj.errorMsg = ''
      // 接口
      $httpSign({
        url: '/account/sendVerCode',
        method: 'post',
        params: {
          mobileOrMail:val,
          type:type
        },
        success:function(data){
          obj.codeMsg = time + 's'
          var timer = setInterval(function() {
            obj.codeMsg = (--time) + 's'
            if (time === 0) {
              obj.isClick = true
              obj.codeMsg = '获取验证码'
              time = waitTime
              clearInterval(timer)
            }
          }, 1000)
        },
        error:function(err){
          obj.errorMsg=err.substr(err.indexOf(':')+1)
        }
      })
    }
  }
}
// const MODE_EVN='local'  // 本地模式
const MODE_EVN='test'   // 测试模式
// const MODE_EVN='production'   // 线上模式

export function getUrlDomain(){
  if(MODE_EVN==='local'){
    return {
      path:'http://localhost:8080',     // 本地路径
      urlPath:localStorage.getItem('urlPath'),    // 图片路径
      // apiPath:'http://192.168.1.155:8080/web'    // 接口路径
      apiPath:'http://192.168.1.153/b2c_mall/web'    // 接口路径
    }
  }else if(MODE_EVN==='test'){
    return {
      path:'http://106.14.214.110',
      urlPath:localStorage.getItem('urlPath'),
      apiPath:'http://106.14.214.110/b2c_mall/web'
    }
  }else{
    return {
      path:'https://www.zhaoyunmall.com',
      urlPath:localStorage.getItem('urlPath'),
      apiPath:'https://www.zhaoyunmall.com/b2c_mall/web'
    }
  }
}





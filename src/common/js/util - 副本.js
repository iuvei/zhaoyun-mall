import axios from 'axios'
import {$http} from 'common/js/httpAll'
import {$httpSign} from "./httpAll";

// 订单状态
export const orderStatus={
  STATUS_YQX:0, // 已取消
  STATUS_WFK:1, // 未付款
  STATUS_YFK:2, // 已付款
  STATUS_YFH:3, // 已发货
  STATUS_WPL:4, // 已收货
  STATUS_YPL:5  // 完成
};
export const afterSalesStatus = {
  STATUS_WSQ: 0, // 未申请
  STATUS_SQTK: 1, // 申请退款
  STATUS_SQTHTK: 2, // 申请退货退款
  STATUS_TKWC: 3, // 退款完成
  STATUS_THTKWC: 4, // 退货退款完成
  STATUS_JJTK: 5, // 拒绝退款
  STATUS_JJTK: 6, // 拒绝退货退款
  STATUS_BFTK: 7, // 部分退款
  STATUS_BFTHTK: 8 // 部分退货退款
};
export var payStatus={
  STATUS_WZF:0,   // 未支付
  STATUS_YZF:1,   // 已支付
  STATUS_TKSQ:2,  // 退款申请
  STATUS_TKTG:3,  // 退款审核通过
  STATUS_TKWC:4,  // 退款完成
  STATUS_TKJJ:5   // 退款拒绝
};

// 0:已取消  1:未付款  2:已付款（已支付） 3:已发货（已支付）
// 4:已收货（已支付） 5:已评论  6:处理中 7：拒绝 8：完成
export function getOrderStatus(orderS,payS){
  return 5
  // // 已取消
  // if(orderS===orderStatus.STATUS_YQX){
  //   return 0
  // }
  // // 未付款
  // if(orderS===orderStatus.STATUS_WFK){
  //   return 1
  // }
  // // 已付款（已支付）
  // if(orderS===orderStatus.STATUS_YFK){
  //   if(payS===payStatus.STATUS_YZF||payS===payStatus.STATUS_TKJJ){
  //     return 2
  //   }
  // }
  // // 已发货（已支付）
  // if(orderS===orderStatus.STATUS_YFH){
  //   if(payS===payStatus.STATUS_YZF||payS===payStatus.STATUS_TKJJ){
  //     return 3
  //   }
  // }
  // // 已收货（已支付）
  // if(orderS===orderStatus.STATUS_WPL){
  //   if(payS===payStatus.STATUS_YZF||payS===payStatus.STATUS_TKJJ){
  //     return 4
  //   }
  // }
  // // 已评论
  // if(orderS===orderStatus.STATUS_YPL){
  //   return 5
  // }
  // // 处理中
  // if(payS===payStatus.STATUS_TKSQ&&orderS!==orderStatus.STATUS_CANCLE
  //   ||(payS===payStatus.STATUS_TKTG&&orderS===orderStatus.STATUS_SHWC)
  //   ||(payS===payStatus.STATUS_TKTG&&orderS===orderStatus.STATUS_BILL)){
  //   return 6
  // }
  // // 拒绝
  // if((orderS===orderStatus.STATUS_SHQX&&payS===payStatus.STATUS_TKJJ)||orderS===orderStatus.STATUS_CANCLE){
  //   return 7
  // }
  // // 完成
  // if(payS===payStatus.STATUS_TKTG){
  //   if(orderS===orderStatus.STATUS_YFK||orderS===orderStatus.STATUS_YFH||orderS===orderStatus.STATUS_WPL){
  //     return 8
  //   }
  // }
  // if(orderS===orderStatus.STATUS_DONE){
  //   return 8
  // }
}
// 按钮是否显示
// 0：没有定金  1：存在定金   2：商品状态不一致   3：只有定金
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

const MODE_EVN='development'  // 开发模式
// const MODE_EVN='production'   // 发布模式

export function getUrlDomain(){
  if(MODE_EVN==='development'){
    // return {
    //   path:'http://localhost:8080',     // 本地路径
    //   urlPath:localStorage.getItem('urlPath'),    // 图片路径
    //   apiPath:'http://192.168.1.150:8080'    // 接口路径
    // }

    return {
      path:'http://106.14.214.110',
      urlPath:localStorage.getItem('urlPath'),
      apiPath:'http://192.168.1.155:8080'
    }
  }else{
    return {
      path:'http://47.100.43.10',
      urlPath:localStorage.getItem('urlPath'),
      apiPath:'http://47.100.43.10'
    }
  }
}





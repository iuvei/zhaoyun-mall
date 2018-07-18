import axios from 'axios'
import {getUrlDomain} from './util'

axios.defaults.baseURL = getUrlDomain().apiPath

// 登录状态下请求
export function $httpSign({url,method='get',params={},data={},success=function(){},error=function(){}}){
  // var time = new Date().getTime();
  // var tktime = "tktime";
  // var tk = 'tk';
  // var data1 = cloneObj(data);
  // for(var key in params){
  //   if(params.hasOwnProperty(key)===true){
  //     data1[key] = params[key];
  //   }
  // }
  // data1[tktime] = time;
  // data1 = shaData(data1);
  // params[tk] = data1;
  // params[tktime] = time;
  axios({
    url:url,
    method:method,
    params:Object.assign({sign:localStorage.getItem('sign')},params),
    data:data
  }).then((res)=>{
    if(res.data.code==='0'){
      success(res.data.result)
    }else{
      console.log(url+':'+res.data.errorMsg)
      error(res.data.errorMsg)
    }
  }).catch((err)=>{
    console.log(url+':'+err)
  })
}
// 非登录状态下请求
export function $http({url,method='get',params={},data={},success=function(){},error=function(){}}){
  axios({
    url:url,
    method:method,
    params:params,
    data:data
  }).then((res)=>{
    if(res.data.code==='0'){
      success(res.data.result)
    }else{
      console.log(url+':'+res.data.errorMsg)
      error(res.data.errorMsg)
    }
  }).catch((err)=>{
    console.log(url+':'+err)
  })
}
// 登录状态下请求(不处理)
export function $httpSign2({url,method='get',params={},data={}}){
  // var time = new Date().getTime();
  // var tktime = "tktime";
  // var tk = 'tk';
  // var data1 = cloneObj(data);
  // for(var key in params){
  //   if(params.hasOwnProperty(key)===true){
  //     data1[key] = params[key];
  //   }
  // }
  // data1[tktime] = time;
  // data1 = shaData(data1);
  // params[tk] = data1;
  // params[tktime] = time;
  return axios({
    url:url,
    method:method,
    params:Object.assign({sign:localStorage.getItem('sign')},params),
    data:data
  })
}
// 非登录状态下请求（不处理）
export function $http2({url,method='get',params={},data={}}){
  return axios({
    url:url,
    method:method,
    params:params,
    data:data
  })
}
//------------------------------其他请求---------------------------------
// 是否设置过支付密码
export function isSetPay(successFn){
  $httpSign({
    url:"/trade/getUserBalance",
    success:function(data){
      successFn(data.payword)
    }
  })
}
// 邀请码
export function balanceData(successFn){
  $httpSign({
    url:"/trade/getUserBalance",
    success:function(data){
      successFn(data)
    }
  })
}
//------------------------------彩云钱包相关请求---------------------------------
// 获取彩云金额
export function getBalance(successFn){
  $httpSign({
    url:"/trade/getUserBalance",
    success:function(data){
      successFn(data.balance)
    }
  })
}
//------------------------------订单相关请求---------------------------------
// 获取订单详情
export function orderDetail(tradeID,successFn){
  $httpSign({
    url:`/trade/${tradeID}/detail`,
    success:function(data){
      successFn(data)
    }
  })
}
// 获取订单列表
export function getOrderList({from=0,limit,tradeStatus,successFn}){
  var params = {};
  if (!tradeStatus && typeof(tradeStatus)!="undefined") {
    params = {
      from,
      limit,
    }
  } else {
    params = {
      from,
      limit,
      tradeStatus
    }
  }
  $httpSign({
    url:'/trade/list',
    params:params,
    success:function(data){
      successFn(data)
    }
  })
}

// 删除订单
export function deleteOrder(obj,tradeID,successFn){
  $httpSign({
    url: '/trade/delTrade',
    params: {
      tradeID
    },
    success:function(data){
      successFn(data)
      obj.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    error:function(err){
      obj.$message({
        type: 'error',
        message: err
      })
    }
  })
}
// 取消订单
export function cancelOrder(obj,tradeID,successFn){
  obj.$confirm('确定取消该订单吗?', '取消订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    obj.mainLoading = true
    $httpSign({
      url: '/trade/cancel',
      method: 'post',
      params: {
        tradeID
      },
      success:function(data){
        successFn(data)
        obj.mainLoading = false
        obj.$message({
          type: 'success',
          message: '取消成功!'
        })
      },
      error:function(err){
        obj.mainLoading = false
        obj.$message({
          type: 'error',
          message: err
        })
      }
    })
  }).catch(() => {
  })
}
// 提醒发货
export function cancelTradeReturn(obj,params,successFn){
  obj.$confirm('是否确定取消退款/退货?', '确认取消', {
    confirmButtonText: '取消退款/退货',
    cancelButtonText: '不取消'
  }).then(() => {
    $httpSign({
      url: '/trade/cancelTradeReturn',
      method: 'post',
      params: params,
      success:function(data){
        successFn(data)
        obj.$message({
          type: 'success',
          message: '取消退货/退款成功!'
        })
      },
      error:function(err){
        obj.$message({
          type: 'error',
          message: err
        })
      }
    })
  }).catch(() => {
  })
}
// 确认收货
export function confirmOrder(obj,tradeID,successFn){
  obj.$confirm('是否确定收货?', '确认收货', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    $httpSign({
      url: '/trade/receive',
      method: 'post',
      params: {
        tradeID
      },
      success:function(data){
        successFn(data)
        obj.$message({
          type: 'success',
          message: '收货成功!'
        })
      },
      error:function(err){
        obj.$message({
          type: 'error',
          message: err
        })
      }
    })
  }).catch(() => {
  })
}
//------------------------------地址相关请求---------------------------------
// 获取地址列表
export function getAddress(successFn){
  $httpSign({
    url:'/address/list',
    success:function(data){
      successFn(data)
    }
  })
}
// 删除地址
export function deleteAddress(obj,addrIDs,successFn){
  obj.$confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    $httpSign({
      url:'/address/delete',
      method:'post',
      params:{
        addrIDs
      },
      success:function(data){
        obj.$message({
          type: 'success',
          message: '删除成功!'
        })
        successFn(data)
      }
    })
  }).catch(()=>{

  })
}
// 设置默认地址
export function setAddress(obj,addrID,successFn){
  $httpSign({
    url:'/address/default/set',
    method:'post',
    params:{
      addrID
    },
    success:function(data){
      successFn(data)
      obj.$message({
        type: 'success',
        message: '设置成功!'
      })
    }
  })
}
//------------------------------收藏相关请求---------------------------------
// 获取收藏列表
export function getCollectList({from=0,limit,successFn,valid=1}){
  $httpSign({
    url:'/item/favouriteList',
    params:{
      from,
      limit,
      valid
    },
    success:function(data){
      successFn(data)
    }
  })
}
// 删除收藏
export function cancelCollect(obj,itemIds,successFn){
  obj.$confirm('确定要删除吗?', '删除收藏商品', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    $httpSign({
      url:'/item/delFavourite',
      params:{
        itemIds
      },
      success:function(data){
        obj.$message({
          type: 'success',
          message: '删除成功!'
        })
        successFn(data)
      }
    })
  }).catch(() => {
  })
}
// 收藏商品
export function collectGoods(obj,itemId,successFn=function(){}){
  $httpSign({
    url:'/item/addFavourite',
    params: {
      itemId
    },
    success:function(data){
      obj.$message({
        type: 'success',
        message: '收藏成功'
      })
      successFn(data)
    },
    error:function(data){
      obj.$message({
        type: 'error',
        message: '该商品已收藏，如要取消收藏，请去个人中心'
      })
    }
  })
}

export function cloneObj(obj) {
  var newJsonObj = {};
   newJsonObj = JSON.parse(JSON.stringify(obj));
  for (var items in obj) {
    if (typeof obj[items] == "function" || typeof obj[items] == "undefined" || obj[items] instanceof RegExp) {
      newJsonObj[items] = obj[items];
    }
  }
  var newObj = new obj.constructor;
  for (var items in newJsonObj) {
    newObj[items] = newJsonObj[items]
  }
  return newObj;
}
// 排序
export function paixu(tmp) {
  var newkey = Object.keys(tmp).sort();
  var newObj = {};
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = tmp[newkey[i]]
  }
  return newObj;
}
export function keySort(obj) {
  var oss1 = paixu(obj);
  // console.log("添加完成-----------",JSON.stringify(oss1));
  var str = '';
  for ( var k in oss1) {
    var v;
    if (typeof oss1[k] == "object") {
      v = JSON.stringify(oss1[k]);
      // console.log(v);
    } else {
      v = oss1[k];
    }
    str += k + v;
  }
  // console.log("str",str);
  return str;
}

export function shaData(str) {
  var s = keySort(str);
  s = s + "d2VpeXd2VpcWlhbmRhaV8xaaa";
  // console.log("拼接完成----------",s);
  return SHA1(s);
}


// ascii码 排序
export function asciSort(targ) {
  //字符串有方法charCodeAt，把字符转为ascii码
  var str = '',
    toAscFn = str.charCodeAt,
    _tempArr = targ ? targ.split('') : [],
    i = 0,
    j,
    _temp;
  if (_tempArr <= 1)
    return targ;
  for (; i < _tempArr.length; i++) { //冒泡算法
    for (j = 0; j < _tempArr.length - i - 1; j++) {
      if (toAscFn.apply(_tempArr[j]) > toAscFn.apply(_tempArr[j + 1])) {
        _temp = _tempArr[j];
        _tempArr[j] = _tempArr[j + 1];
        _tempArr[j + 1] = _temp;
      }
    }
  }
  return _tempArr.join('');
};

// sha1
export function addSha(x, y) {
  return((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
}

export function sha1hex(num) {
  var sHEXChars = "0123456789abcdef";
  var str = "";
  for(var j = 7; j >= 0; j--)
    str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);
  return str;
}

export function AlignSHA1(sIn) {
  var nblk = ((sIn.length + 8) >> 6) + 1;
  var blks = new Array(nblk * 16);
  for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < sIn.length; i++)
    blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
  blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
  blks[nblk * 16 - 1] = sIn.length * 8;
  return blks;
}

export function rolSha(num, cnt) {
  return(num << cnt) | (num >>> (32 - cnt));
}

export function ftSha(t, b, c, d) {
  if(t < 20) return(b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return(b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

export function ktSha(t) {
  return(t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
    (t < 60) ? -1894007588 : -899497514;
}

export function SHA1(sIn) {
  var x = AlignSHA1(sIn);
  var w = new Array(80);
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  var e = -1009589776;
  for(var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;
    for(var j = 0; j < 80; j++) {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rolSha(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      var t = addSha(addSha(rolSha(a, 5), ftSha(j, b, c, d)), addSha(addSha(e, w[j]), ktSha(j)));
      e = d;
      d = c;
      c = rolSha(b, 30);
      b = a;
      a = t;
    }
    a = addSha(a, olda);
    b = addSha(b, oldb);
    c = addSha(c, oldc);
    d = addSha(d, oldd);
    e = addSha(e, olde);
  }
  var SHA1Value = sha1hex(a) + sha1hex(b) + sha1hex(c) + sha1hex(d) + sha1hex(e);
  return SHA1Value.toUpperCase();
}



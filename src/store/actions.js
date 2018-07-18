import {getUrlDomain} from 'common/js/util'
import {$httpSign} from 'common/js/httpAll'

export default {
  //异步提交 getCartNum 更新购物车数量
  SETCartNum({commit}) {
    $httpSign({
      url:getUrlDomain().apiPath+'/cart/list',
      params:{
        cartIDs:0,
        status:1
      },
      success:function(data){
        let num = data.shopCartList.length
        commit("getCartNum", num)
      }
    })
  },
  SETBalance({commit}) {
    $httpSign({
      url:getUrlDomain().apiPath+"/trade/getUserBalance",
      success:function(data){
        commit('getBalance',data.balance)
      }
    })
  }
}

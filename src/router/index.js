import Vue from 'vue'
import Router from 'vue-router'

import home from 'components/home'
import login from 'components/Login'
import register from 'components/Register'
import goodsDetail from 'components/GoodsDetail'
import shopCart from 'components/ShopCart'
import confirmOrder from 'components/ConfirmOrder'
import submitOrder from 'components/SubmitOrder'
import payOrder from 'components/PayOrder'
import payRecharge from 'components/PayRecharge'
import payResult from 'components/PayResult'
import goodsList from 'components/GoodsList'
import searchGoods from 'components/searchGoods'
import newItem from 'components/NewItem'
import user from 'components/user/Index'
import userHome from 'components/user/Home'
import orderList from 'components/user/OrderList'
import rechargeOrder from 'components/user/RechargeOrder'
import orderDetail from 'components/user/OrderDetail'
import refundList from 'components/user/RefundList'
import refundType from 'components/user/RefundType'
import refundGoods from 'components/user/RefundGoods'
import collectList from 'components/user/CollectList'
import invite from 'components/user/Invite'
import cloudGold from 'components/user/CloudGold'
import deposit from 'components/user/Deposit'
import recharge from 'components/user/Recharge'
import depositResult from 'components/user/DepositResult'
import rechargeResult from 'components/user/RechargeResult'
import fundWater from 'components/user/FundWater'
import addressList from 'components/user/AddressList'
import account from 'components/user/Account'
import modifyPhone from 'components/user/ModifyPhone'
import modifyLogin from 'components/user/ModifyLogin'
import modifyPay from 'components/user/ModifyPay'
import modifyCert from 'components/user/ModifyCert'
import modifyBank from 'components/user/ModifyBank'
import userInfo from 'components/user/UserInfo'
import noticeList from 'components/NoticeList'
import newsList from 'components/user/NewsList'
import noticeDetail from 'components/NoticeDetail'
import discussGoods from 'components/user/DiscussGoods'
import resetLogin from 'components/ResetLogin'
import switcher from 'components/user/Switcher'
import logistics from 'components/user/Logistics'
// 商城的相关信息
import aboutus from 'components/website/AboutUs'


Vue.use(Router)

const scrollBehavior = (to, from, savedPosition) => {
  return {
    x: 0,
    y: 0
  }
}

export default new Router({
  // mode: 'history',
  scrollBehavior,
  routes: [{
    path: '*',
    redirect: {
      name: 'home'
    }
  }, {
    path: '/',
    name: 'home',
    component: home
  }, {
    path: '/logistics/:orderid',
    name: 'logistics',
    component: logistics
  }, {
    path: '/resetLogin',
    name: 'resetLogin',
    component: resetLogin
  }, {
    path: '/noticeList',
    name: 'noticeList',
    component: noticeList
  }, {
    path: '/noticeDetail/:noticeid',
    name: 'noticeDetail',
    component: noticeDetail
  }, {
    path: '/discussGoods/:orderid',
    name: 'discussGoods/:orderid',
    component: discussGoods
  }, {
    path: '/goodsList/:categoryid/:subcategoryid',
    name: 'goodList',
    component: goodsList
  }, {
    path: '/searchGoods',
    name: 'searchGoods',
    component: searchGoods
  }, {
    path: '/newItem/:type',
    name: 'newItem',
    component: newItem
  }, {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/register',
    name: 'register',
    component: register
  }, {
    path: '/goodsDetail/:goodsid',
    name: 'goodsDetail',
    component: goodsDetail
  }, {
    path: '/shopCart',
    name: 'shopCart',
    component: shopCart
  }, {
    path: '/confirmOrder',
    name: 'confirmOrder',
    component: confirmOrder
  }, {
    path: '/submitorder/:orderid',
    name: 'submitOrder',
    component: submitOrder
  }, {
    path: '/payorder/:orderid/paytype/:paytype',
    name: 'payOrder',
    component: payOrder
  }, {
    path: '/payrecharge',
    name: 'payRecharge',
    component: payRecharge
  }, {
    path: '/payresult/:orderid',
    name: 'payResult',
    component: payResult
  }, {
    path: '/orderDetail/:orderid',
    name: 'orderDetail',
    component: orderDetail
  }, {
    path: '/refundType/:orderid',
    name: 'refundType',
    component: refundType
  }, {
    path: '/refundGoods/:orderid',
    name: 'refundGoods',
    component: refundGoods
  }, {
    path: '/user',
    name: 'user',
    component: user,
    children: [{
      path: 'home',
      name: 'userHome',
      component: userHome
    }, {
      path: 'orderList',
      name: 'orderList',
      component: orderList
    }, {
      path: 'rechargeOrder',
      name: 'rechargeOrder',
      component: rechargeOrder
    }, {
      path: 'refundList',
      name: 'refundList',
      component: refundList
    }, {
      path: 'invite',
      name: 'invite',
      component: invite
    }, {
      path: 'cloudGold',
      name: 'cloudGold',
      component: cloudGold
    }, {
      path: 'collectList',
      name: 'collectList',
      component: collectList
    }, {
      path: 'addressList',
      name: 'addressList',
      component: addressList
    }, {
      path: 'account',
      name: 'account',
      component: account
    }, {
      path: 'fundWater',
      name: 'fundWater',
      component: fundWater
    }, {
      path: 'deposit',
      name: 'deposit',
      component: deposit
    }, {
      path: 'recharge',
      name: 'recharge',
      component: recharge
    }, {
      path: 'depositResult',
      name: 'depositResult',
      component: depositResult
    }, {
      path: 'rechargeResult/:transno',
      name: 'rechargeResult',
      component: rechargeResult
    }, {
      path: 'modifyPhone',
      name: 'modifyPhone',
      component: modifyPhone
    }, {
      path: 'modifyLogin',
      name: 'modifyLogin',
      component: modifyLogin
    }, {
      path: 'modifyPay',
      name: 'modifyPay',
      component: modifyPay
    }, {
      path: 'modifyCert',
      name: 'modifyCert',
      component: modifyCert
    }, {
      path: 'modifyBank',
      name: 'modifyBank',
      component: modifyBank
    }, {
      path: 'userInfo',
      name: 'userInfo',
      component: userInfo
    }, {
      path: 'newsList',
      name: 'newsList',
      component: newsList
    }, {
      path: 'switcher',
      name: 'switcher',
      component: switcher
    }]
  }, {
    path: '/website/aboutus',
    name: 'aboutus',
    component: aboutus
  }]
})
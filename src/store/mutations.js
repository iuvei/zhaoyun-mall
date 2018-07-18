import getters from './getters.js'
import Actions from './actions'

var state = {
  showHeader: true,
  activeTab: '',
  province: '',
  city: '',
  district: '',
  selectAddr: {},
  userName: '', //用户名
  userInfo: {},
  cartNum: 0, //购物车数量
  balance:0,  // 余额
  goodId: '', //待确认订单Id
}

const mutations = {
  headerStatus(state, status) {
    state.showHeader = status
  },
  updateAddr(state, obj) {
    state.province = obj.province;
    state.city = obj.city;
    state.district = obj.district;
  },
  getCartNum(state, num) {
    state.cartNum = num > 99 ? '99+' : num
  },
  getBalance(state,a){
    state.balance = a
  },
  updateName(state, name) {
    state.userName = name
  },
  updateUserInfo(state, a) {
    state.userInfo = a
  },
  updateSelectAddr(state, addr) {
    state.selectAddr = addr
  },
  updateActiveTab(state, val) {
    state.activeTab = val
  }
}


export default {
  state,
  mutations,
  getters,
  Actions
}

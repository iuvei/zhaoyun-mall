// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import VueLazyload from 'vue-lazyload'
import 'common/js/filters' //自定义过滤器的引入
// require styles
import 'assets/rest-et/index.css';
import 'common/stylus/index.styl'
import 'common/stylus/fonts.css'

Vue.use(ElementUI);

Vue.config.productionTip = false

// 路由验证
import {$httpSign} from 'common/js/httpAll'
import {getUrlDomain} from 'common/js/util'
router.beforeEach((to, from, next) => {
  $httpSign({
    url:'/index/imgUrl',
    success:function(data){
      localStorage.setItem('urlPath',data.imgUrl);
      next();
    }.bind(this)
  })

  axios.interceptors.response.use(function (response) {
    if(response){
      if(response.config.url===getUrlDomain().apiPath+'/account/live'){
        // 对响应数据做点什么
        if (response.data.code == 2) {
          localStorage.removeItem('sign');
          localStorage.removeItem('updateName');
          localStorage.removeItem('updateUserInfo');
          store.commit('updateName', '')
          store.commit('updateUserInfo', {})
          store.commit('getCartNum', 0)
        }
      }else{
        // 对响应数据做点什么
        if (response.data.code == 2) {
          localStorage.removeItem('sign');
          localStorage.removeItem('updateName');
          localStorage.removeItem('updateUserInfo');
          router.push(`/login?from=${to.fullPath}`);
          store.commit('updateName', '')
          store.commit('updateUserInfo', {})
          store.commit('getCartNum', 0)
        }
      }
    }
    return response
  }, function (error) {
    // 对响应错误做点什么
    console.log(error);
    // return Promise.reject(error);
  });
})


// 判断是否为ie，并且版本小于11；如果是不使用懒加载
var userAgent=window.navigator.userAgent
var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1
if(isIE) {
    //ie浏览器不兼容懒加载组件处理
    Vue.directive('lazy', function(el, binding) {
        el.src = binding.value
    })
} else {
  //实现图片懒加载
  Vue.use(VueLazyload, {
    loading: require('./assets/imgError.png'),
    error: require('./assets/imgError.png')
  })
}

// 对aixos进行基础设置
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})

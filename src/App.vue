<template>
  <div id="app">
    <v-header></v-header>
    <router-view/>
    <v-footer></v-footer>
    <v-aside-nav></v-aside-nav>
  </div>
</template>

<script>
  import VHeader from 'base/Header'
  import VFooter from 'base/Footer'
  import VAsideNav from 'base/AsideNav'
  import {$httpSign} from 'common/js/httpAll'
  import {mapMutations,mapActions} from 'vuex'

  export default {
    mounted(){
      if(localStorage.getItem('sign')){
        $httpSign({
          url:'/account/live',
          success:function(data){
            var user = localStorage.getItem('updateUserInfo');
            this.updateName(localStorage.getItem('updateName'))
            this.updateUserInfo(JSON.parse(user))
            // 购物车数量
            this.SETCartNum()
            // 余额
            this.SETBalance()
          }.bind(this)
        })
      }
    },
    methods:{
      ...mapMutations(['updateName','updateUserInfo']),
      ...mapActions(['SETCartNum','SETBalance'])
    },
    components: {
      VHeader,
      VFooter,
      VAsideNav
    }
  }
</script>

<style scoped lang="stylus">
</style>

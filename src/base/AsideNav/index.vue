
<template>
	<div class="home-Rmenu" v-if="this.isShow">
	  <router-link to="/login" v-if="!userName">
	    <span class="menuIcon icon-login"></span>
	    <span>登录</span>
	  </router-link>
    <router-link to="/user/home" v-if="userName" :title="userName">
      <span class="menuIcon icon-login"></span>
      <span>{{userName}}</span>
    </router-link>
	  <router-link to="/shopCart">
	    <span class="menuIcon icon-shopcart"></span>
	    <span>{{cartNum}}</span>
	  </router-link>
	  <router-link to="/user/recharge">
	    <span class="menuIcon icon-asset"></span>
	    <span>充值</span>
	  </router-link>
	  <!-- <a href="">
	    <span class="menuIcon icon-money"></span>
	    <span>收益</span>
	  </a> -->
	  <a href="javascript:;">
	    <span class="menuIcon icon-ercode"></span>
	    <span>APP</span>
      <div class="menuBox ercode-box">
        <!-- <div class="box-item" style="width:160px">
          <p class="text">正在开发，敬请期待</p>
        </div> -->
        <div class="box-item">
          <img src="~images/android.png" alt="APP二维码" class="img" width="120">
          <p class="text">安卓版</p>
        </div>
        <!--<div class="box-item">-->
          <!--<img src="~images/IOS.png" alt="APP二维码" class="img" width="120">-->
          <!--<p class="text">IOS版</p>-->
        <!--</div>-->
      </div>
	  </a>
	  <a href="javascript:;">
	    <span class="menuIcon icon-service"></span>
	    <span>客服</span>
      <div class="menuBox service-box">
        <div class="box-item">
          <p>客服电话：</p>
          <p>0571-89285518</p>
        </div>
      </div>
	  </a>
	  <a @click="scrollToTop" href="javascript:;" v-show="showTop">
	    <span class="menuIcon menuIcon7 el-icon-arrow-up"></span>
	  </a>
	</div>
</template>

<script>
  export default {
    data(){
      return {
        showTop:false,
        isShow:true
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.showTopEvent();
      })
      this.isPc();
    },
    computed:{
      userName(){
        return this.$store.state.userName
      },
      cartNum(){
        return this.$store.state.cartNum
      }
    },
    methods:{
      showTopEvent(){
        document.addEventListener('scroll', function () {
          var scrollTop=document.documentElement.scrollTop||document.body.scrollTop
          var clientHeight=document.documentElement.clientHeight||document.body.clientHeight
          if (scrollTop > clientHeight*2) {
            this.showTop = true
          } else {
            this.showTop = false
          }
        }.bind(this), false)
      },
      scrollToTop(){
        document.documentElement.scrollTop=0
        document.body.scrollTop=0
      },
      isPc(){
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
	.home-Rmenu {
    width: 46px
    background-color: #4a4a4a
    position: fixed
    right: 0
    top: 0
    bottom:0
    z-index: 999
    display: flex
    align-items: center
    align-content:center
    flex-wrap:wrap
    a {
      position:relative
      display:block
      font-size: $font-s
      color: rgba(255, 255, 255, .6)
      transition: color .4s
      margin-bottom: 30px
      width: 100%
      text-align: center
      &:hover, &.active {
        color: #fff
        .menuBox{
          display:flex
        }
      }
      span:last-child{
        display:block
        ellipsis-simple()
      }
      &:last-child{
        position:absolute
        bottom:0
      }
    }
    .menuIcon{
      display:block
      font-size:24px
      color:$hover-color
      width: 100%
      line-height: 40px
      &:hover{
        color:#fc7864
      }
    }
    .menuBox{
      position: absolute
      transition:.2s linear all
      right: 46px
      background: #4a4a4a
      top: 50%
      transform: translateY(-50%)
      color: #fff
      text-align: left
      line-height: 24px
      display:none
      &.service-box{
        width:160px
        padding: 10px 20px
        .box-item{

        }
      }
      &.ercode-box{
        padding: 16px
        .box-item{
          text-align:center
          &+.box-item{
            border-left:1px dashed #fff
          }
          &:first-child{
            padding-right:16px
          }
          &:last-child{
            padding-left:16px
          }
        }
      }
    }
  }
</style>

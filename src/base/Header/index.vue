<template>
  <header class="header" v-if="showHeader" ref="header">
    <div class="header-top">
      <div class="container">
        <div class="header-top_l">客服电话：0571 - 89285518</div>
        <div class="header-top_r">
          <span v-if="userName">
            <router-link to="/user/home">{{userName}}</router-link>
            |<a href="javascript:;" v-if="userName" @click="logout">退出</a>
          </span>
          <span v-if="!userName">
            <router-link to="/login" v-if="!userName">登录</router-link>
            |<router-link to="/register" v-if="!userName">注册</router-link>
          </span>
          |<router-link to="/user/orderlist">我的订单</router-link>
          |<router-link to="/user/collectlist">我的收藏</router-link>
          |<a href="javscript:;">
            <i class="icon icon_app"></i>手机APP
            <div class="box">
              <!-- <div class="box-item">
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
          |<router-link to="/user/newsList">
            <i class="icon icon_news"></i>我的消息
          </router-link>
        </div>
      </div>
    </div>
    <div class="header-cont">
      <div class="container">
        <div class="left-logo">
          <router-link to="/"><img src="~images/logo.png" alt="LOGO"></router-link>
        </div>
        <div class="right-search">
          <el-input v-model="keyworld" placeholder="请输入商品关键词" @keyup.enter.native="searchHandle(keyworld)">
            <i slot="suffix" @click="searchHandle(keyworld)" class="el-input__icon el-icon-search"></i>
          </el-input>
          <router-link to="/shopcart" class="cart">
            <i class="icon-shopcart"></i>
            <i class="num">{{cartNum}}</i>
          </router-link>
        </div>
      </div>
    </div>
    <div class="header-tab">
      <div class="container">
        <ul class="nav" ref="menu">
          <li>
            <router-link to="/">首页</router-link>
          </li>
          <li v-for="category in categories" :key="category.categoryID" v-if="category.categories.length>0">
            <router-link :to="`/goodslist/${category.categoryID}/all`"
                         :class="{active:$route.params.categoryid==category.categoryID}">{{category.categoryName}}
            </router-link>
            <div class="submenu">
              <div class="container">
                <router-link :to="`/goodslist/${category.categoryID}/${subcategory.categoryID}`"
                             v-for="subcategory in category.categories" :key="subcategory.categoryID">
                  <img class="submenu-icon" v-lazy="urlPath+subcategory.pic" :alt="subcategory.categoryName">
                  <p class="submenu-text">{{subcategory.categoryName}}</p>
                </router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="header-tab_hover" ref="nav" :class="{'header-fixed-tab_hover':showNav}">
      <div class="container" ref="menu_hover">
        <router-link to="/"><img src="~images/logo.png" alt="兆云商城" height="32" v-if="!isNav"></router-link>
        <ul class="nav">
          <li>
            <router-link to="/">首页</router-link>
          </li>
          <li v-for="category in categories.slice(0,8)" :key="category.categoryID" v-if="category.categories.length>0">
            <router-link :to="`/goodslist/${category.categoryID}/all`"
                         :class="{active:$route.params.categoryid==category.categoryID}">{{category.categoryName}}
            </router-link>
            <div class="submenu">
              <div class="container">
                <router-link :to="`/goodslist/${category.categoryID}/${subcategory.categoryID}`"
                             v-for="subcategory in category.categories" :key="subcategory.categoryID">
                  <img class="submenu-icon" v-lazy="urlPath+subcategory.pic"
                       :alt="subcategory.categoryName">
                  <p class="submenu-text">{{subcategory.categoryName}}</p>
                </router-link>
              </div>
            </div>
          </li>
          <li v-for="category in categories.slice(8)" :key="category.categoryID" v-if="category.categories.length>0&&isNav">
            <router-link :to="`/goodslist/${category.categoryID}/all`"
                         :class="{active:$route.params.categoryid==category.categoryID}">{{category.categoryName}}
            </router-link>
            <div class="submenu">
              <div class="container">
                <router-link :to="`/goodslist/${category.categoryID}/${subcategory.categoryID}`"
                             v-for="subcategory in category.categories" :key="subcategory.categoryID">
                  <img class="submenu-icon" v-lazy="urlPath+subcategory.pic"
                       :alt="subcategory.categoryName">
                  <p class="submenu-text">{{subcategory.categoryName}}</p>
                </router-link>
              </div>
            </div>
          </li>
          <li v-if="categories.length>8">
            <a href="javascript:;" @click="isNav=true" v-if="!isNav" style="color:#868686">更多</a>
            <a href="javascript:;" @click="isNav=false"  v-if="isNav" style="color:#868686">折起</a>
          </li>
        </ul>
        <div class="search" v-if="!isNav">
          <el-input v-model="keyworld" placeholder="请输入商品关键词" @keyup.enter.native="searchHandle(keyworld)" >
            <i slot="suffix" @click="searchHandle(keyworld)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
    </div>
    <div id="ie9-tips" class="clearfix" v-if="isIE">
      <div id="tipsPanel" class="container">
        <div id="tipsDesc">系统检测到您所使用的浏览器版本较低，推荐使用<a href="http://www.firefox.com.cn/download/" target="_blank">Firefox</a>和<a href="http://www.google.cn/intl/zh-CN/chrome/browser/index.html" target="_blank">Chrome</a>浏览器打开，否则将无法体验完整产品功能。</div>
        <a id="stopSuggestA" href="javascript:;">×</a>
      </div>
    </div>
  </header>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {$http, $httpSign} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data() {
      return {
        sign: localStorage.getItem('sign'),
        noCommonHeader: ['login', 'register'], // 不使用公共头部
        categories: [],
        showNav: false,
        keyworld: '',
        isIE:false,
        isNav:false,
        urlPath:''
      }
    },
    computed: {
      loginStatus() {
        return this.userName !== ''
      },
      ...mapState(['userName', 'showHeader', 'cartNum'])
    },
    mounted() {
      // 获取类目
      this.getCategory()

      this.$nextTick(() => {
        this.initScroll();
      })

      var userAgent=window.navigator.userAgent
      this.isIE=false
      // this.isIE=userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1

      $httpSign({
        url:'/index/imgUrl',
        success:function(data){
          this.urlPath=data.imgUrl
        }.bind(this)
      })
    },
    updated() {
      if (this.showHeader) {
        const screenW = document.documentElement.clientWidth

        var arr=this.$refs.menu.querySelectorAll('.submenu')
        for(var i=0;i<arr.length;i++){
          var item=arr[i]
          item.style.width = screenW + 'px'
          item.style.left = (-screenW + 1080) / 2 + 'px'
        }
      }
    },
    watch: {
      $route(to, from) {
        if (this.noCommonHeader.indexOf(to.name) > -1) {
          this.headerStatus(false)
        } else {
          this.headerStatus(true)
        }
      }
    },
    methods: {
      searchHandle(keyworld) {
        this.keyworld = '';
        this.$router.push(`/searchgoods/?keyworld=${keyworld}`)
      },
      initScroll() {
        if (this.showHeader) {
          let h = this.$refs.header.clientHeight
          document.addEventListener('scroll', function () {
            var scrollTop=document.documentElement.scrollTop||document.body.scrollTop
            if (scrollTop > h) {
              this.showNav = true
            } else {
              this.showNav = false
            }
          }.bind(this), false)
        }
      },
      logout() {
        $httpSign({
          url: '/account/logout',
          method: 'post',
          success: function (data) {
            this.updateName('')
            this.updateUserInfo({})
            this.getCartNum(0)
            localStorage.removeItem('sign')
            localStorage.removeItem('updateName')
            localStorage.removeItem('updateUserInfo')
            this.$router.push('/')
          }.bind(this)
        })
      },
      getCategory() {
        $httpSign({
          url: '/category/firstCategory',
          success: function (data) {
            this.categories = data.categoryList
          }.bind(this)
        })
      },
      ...mapMutations(['getCartNum','updateName', 'updateUserInfo', 'headerStatus'])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable.styl"
  .header {
    background-color: #fff
    &-top {
      height: 30px
      line-height:30px
      width: 100%
      background-color: #f3f3f3
      .container {
        display: flex
        justify-content: space-between
        font-size: $font-x
        .header-top_l {
          color:$size-color2
        }
        .header-top_r {
          display: flex
          color:#dadada
          a{
            position:relative
            transition: all .3s
            padding: 0 20px
            position: relative
            color: $size-color3
            hover-hand()
            &:hover {
              color: $hover-color
              .box{
                display:flex
              }
            }
          }
          .icon{
            display:inline-block
            width:20px
            height:30px
            vertical-align: top
            background:url(../../common/images/head_icon.png) center no-repeat
            &_app{
              background-position:0 0
            }
            &_news{
              background-position:-30px 0
            }
          }
          .box{
            display:none
            position:absolute
            background-color:#fff
            padding:10px
            box-shadow: 0 1px 7px rgba(0,0,0,0.2)
            width:140px
            z-index:10
            left:50%
            margin-left:-70px
            .box-item{
              flex:1
              &+.box-item{
                border-left:1px dashed $border-color
              }
            }
            /*.box-item:last-child{
              padding-left:10px
            }*/
            .text{
              text-align:center
              font-size:$font-x
              color:$size-color2
              line-height:18px
            }
          }
        }
      }
    }
    &-cont {
      border-bottom: 2px solid $hover-color
      .container {
        display: flex
        justify-content: space-between
        height: 90px
        .left-logo {
          display: flex
          align-items: center
          hover-hand()
          img {
            height: 50px
          }
          p {
            font-size: $font-m
            padding-left: 60px
            position: relative
            color: #333
            &::after {
              position: absolute
              content: ' '
              width: 6px
              height: 6px
              background-color: #333
              border-radius: 3px
              left: 27px
              top: 50%
              transform: translateY(-50%)
            }
          }
        }
        .right-search {
          display: flex
          align-items: center
          p {
            width: 240px
            i {
              color: $hover-color
            }
          }
          .cart {
            font-size: 28px
            color: $hover-color
            padding-left: 20px
            position: relative
            .num {
              position: absolute
              width: 28px
              height: 28px
              font-size: $font-l
              font-style: normal
              background: $num-color
              color: #fff;
              border-radius: 16px;
              top: -12px;
              right: -10px;
              line-height: 28px;
              text-align: center;
              transform: scale(0.5, 0.5);
              text-shadow: 0 0 1px $num-color
            }
          }
        }
      }
    }
    &-tab, &-tab_hover {
      li:hover {
        & > a {
          color: $hover-color
        }
        .submenu {
          display: block
        }
      }
      .nav {
        display: flex
        flex: 1
        flex-wrap: wrap
        justify-content: left
        a {
          &.router-link-exact-active {
            color: $hover-color
          }
          display:block
          padding: 0 17px
          color: $size-color2
          text-align: center
          transition: all .4s
          &:hover, &.active {
            color: $hover-color
          }
        }
      }
      .submenu {
        position: absolute
        width: 100%
        left: 0
        top: 41px
        display: none
        z-index: 10
        background-color: #fff
        transition: all .4s
        box-shadow:0 2px 2px 0 rgba(0,0,0,.2)
        .container {
          padding: 20px 0
          line-height: 0
          overflow:hidden
          a {
            display:block
            float:left
            margin: 20px 40px
            padding: 0
            &:hover {
              .submenu-text {
                color: $hover-color
              }
            }
          }
        }
        &-icon {
          display: inline-block
          background-color: #f8f8f8
          width: 60px
          height: 60px
        }
        &-text {
          font-size: $font-s
          line-height: 20px
          margin-top: 5px
          color: $size-color2
        }
      }
    }
    &-tab {
      border-bottom: 1px solid $border-color
      .container {
        font-size: $font-s
        line-height: 40px
        position: relative
      }
      .nav {
        margin-left: -20px
      }
      .warning-info {
        p {
          line-height: 24px
        }
      }
      .warning {
        width: 120px
        text-align: right
        color: $size-color2
        hover-hand()
        .icon-warning {
          font-size: $font-m
          margin-right: 5px
          vertical-align: -3px
        }
      }
    }
    &-tab_hover {
      position: fixed
      z-index: 100
      top: 0
      left: 0
      width: 100%
      height:60px
      background-color: #fff
      border-bottom: 1px solid $border-color
      transform: translateY(-61px)
      transition: all .2s linear
      &.header-fixed-tab_hover {
        transform: translateY(0)
      }
      .container {
        display: flex
        align-items: center
      }
      .nav {
        margin-left: 10px
        font-size: $font-s
        line-height: 60px
        height:60px
      }
      .submenu {
        top: 61px
      }
    }
  }
  /* 浏览器是IE9以下，显示 */
  #ie9-tips {overflow: hidden;height: 36px;color: #f48c12;font-size: 12px;position: absolute;top: 0;width: 100%;border: 1px solid #f9f2a7;border-right: 0;border-left: 0;background-color: #fefded;line-height: 36px;}
  #ie9-tips #tipsPanel {}
  #ie9-tips #tipsPanel #tipsDesc {float: left;margin-left: 10px;font-weight: bold;text-align: center;}
  #ie9-tips #tipsPanel #tipsDesc a{color:rgb(54, 142, 224);}
  #ie9-tips #tipsPanel #stopSuggestA {float: right;display: block;margin-right: 10px;text-decoration: none;}
</style>
<style lang="stylus">
  @import "~common/stylus/variable.styl"
  .header-tab_hover {
    .search {
      .el-input__inner {
        width: 200px
        height: 32px
      }
      .el-input__icon {
        line-height: 32px
        color: $main-color
      }
    }
  }
</style>

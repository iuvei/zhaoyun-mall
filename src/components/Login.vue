<template>
  <div class="app-wrap">
    <header class="v-header">
      <div class="container">
        <router-link to="/"><img src="~images/logo.png" alt="" height="50"></router-link>
        <router-link to="/" style="font-size:14px">欢迎光临兆云商城>></router-link>
      </div>
    </header>
    <div class="v-login">
      <div class="container">
        <div class="login-box">
          <div class="box-tab login-title">
            <a href="javascript:;" :class="{on:curType===index}" @click="curType=index;checkEmpty()" v-for="(item,index) in loginType">{{item}}</a>
          </div>

          <div class="box-cont login-cont">
            <el-alert :title="errorMsg" type="error" show-icon class="error-msg" v-if="errorMsg"></el-alert>
            <!-- 验证码登录 -->
            <div v-if="curType===1">
              <el-input v-model="phone" :maxlength="11" placeholder="手机号码" auto-complete="off" @input.native="checkEmpty">
                <template slot="prepend"><i class="icon phone"></i></template>
              </el-input>
              <el-input v-model="code" placeholder="验证码" auto-complete="off" @input.native="checkEmpty" @keyup.enter.native="loginEvent(curType)">
                <template slot="append"><el-button @click="getCode" class="code-button">{{codeMsg}}</el-button></template>
              </el-input>
              <el-button type="primary" @click="loginEvent(curType)" :disabled="!loginStatus">{{btnMsg}}</el-button>
            </div>
            <!-- 用户名登录 -->
            <div v-if="curType===0">
              <div class="reg-btn">
                <router-link to='/register'>注册账号>></router-link>
              </div>
              <el-input v-model="username" placeholder="用户名/手机号" auto-complete="off" @input.native="checkEmpty" name="username">
                <template slot="prepend"><i class="icon user"></i></template>
              </el-input>
              <el-input type="password" v-model="userpwd" placeholder="密码" auto-complete="off" @input.native="checkEmpty" name="userpwd">
                <template slot="prepend"><i class="icon password"></i></template>
              </el-input>
              <el-input v-model="imgcode" placeholder="验证码" auto-complete="off" @input.native="checkEmpty" @keyup.enter.native="loginEvent(curType)" v-show="showCode">
                <template slot="append"><div id="code" style="margin: 0 -10px"></div></template>
              </el-input>
              <p class="box-links"><router-link to="/resetLogin">忘记密码？</router-link></p>
              <el-button type="primary" @click="loginEvent(curType)" :disabled="!loginStatus">{{btnMsg}}</el-button>
            </div>
          </div>
          <div class="box-entries">
            <!-- <h4 class="title">第三方登录</h4>
            <div class="lists">
              <router-link to="/"><i class="icon-weichat" style="color:#79c77c"></i></router-link>
              <router-link to="/"><i class="icon-qq" style="color:#9fc0e1"></i></router-link>
              <router-link to="/"><i class="icon-weibo" style="color:#ce9c9d"></i></router-link>
              <router-link to="/"><i class="icon-zifub" style="color:#78c9e6"></i></router-link>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {validates,valideCode} from 'common/js/util'
  import {$httpSign} from 'common/js/httpAll'
  import {GVerify} from 'common/js/imgCode'
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        bgImage:require('images/log_reg_bg.jpg'),
        errorMsg:'',
        codeMsg:'获取验证码',
        btnMsg:'登  录',
        loginStatus:false,
        // 验证码登录
        phone: '',
        code: '',
        // 账号登录
        username: '',
        userpwd: '',
        imgcode:'',
        waitTime:10,
        curType:0,
        loginType:['账号登录','验证码登录'],
        isClick:true,  // 避免重复点击
        showCode:false,
        clickNum:0,
        verifyCode:null
      };
    },
    mounted(){
      this.$store.commit('headerStatus',false)

      this.verifyCode = new GVerify('code')
    },
    methods: {
      ...mapActions(['SETCartNum','SETBalance']),
      checkEmpty(){
        if(this.curType===1){
          this.loginStatus=this.phone.trim()&&this.code.trim()
        }else if(this.curType===0){
          this.loginStatus=this.username.trim()&&this.userpwd.trim()
        }
      },
      getCode(){
        valideCode(this,this.phone,1)
      },
      loginEvent(curType) {
        this.loginStatus=false
        this.btnMsg='登录中...'
        // 1：验证码登录；0：用户名登录
        var url=curType===1?'/account/phoneLogin':'/account/login'
        var params={}
        if(curType===1){
          params={
            phone:this.phone,
            verifCode:this.code
          }
        }else{
          this.clickNum++
          if(this.clickNum>2){
            this.showCode=true
            if(this.clickNum>3){
              if(this.verifyCode.validate(this.imgcode)){
                this.errorMsg=''
                params={
                  account: this.username,
                  password: this.userpwd
                }
              }else{
                this.errorMsg='验证码输入错误'
                this.verifyCode.refresh()
                this.btnMsg='登  录'
                return false
              }
            }else{
              params={
                account: this.username,
                password: this.userpwd
              }
            }
          }else{
            params={
              account: this.username,
              password: this.userpwd
            }
          }
        }
        $httpSign({
          url: url,
          method: 'post',
          params: params,
          success:function(data) {
            this.errorMsg='';
            localStorage.setItem('sign',data.sign);
            localStorage.setItem('updateName',data.user.userName);
            var userInfo = JSON.stringify(data.user);
            localStorage.setItem('updateUserInfo',userInfo);
            this.$store.commit('updateName', data.user.userName);
            this.$store.commit('updateUserInfo', data.user);
            let url=location.href.match(/\?([\s\S]+)$/);
            if(url===null){// 没有后缀?
              this.$router.push('/')
            }else{
              this.$router.push({path:decodeURIComponent(url[1].split('=')[1])})
            }

            // 购物车数量
            this.SETCartNum()
            // 余额
            this.SETBalance()
          }.bind(this),
          error:function(err){
            this.loginStatus=false
            this.btnMsg='登  录'
            this.code=''
            this.userpwd=''
            this.errorMsg=err
          }.bind(this)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/log_reg.styl"
</style>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .v-login{
    background-image:url('~images/log_reg_bg.jpg')
    .login{
      &-title{
        text-align:center
        a{
          flex:1
          color:$size-color3
          display:block
          &:first-child{
            border-right:1px solid $border-color
          }
          &:hover,&.on{
            color:$hover-color
          }
        }
      }
      &-cont{
        padding-top:40px
        .el-input{
          margin-bottom:20px
        }
      }
    }
    .reg-btn{
      position:absolute
      right:40px
      top:10px
      font-size:$font-s
      text-align:right
      color:$hover-color
      a{
        color:$hover-color
        line-height:24px
      }
      a:hover{
        text-decoration:underline
      }
    }
    .icon{
      display:inline-block
      width: 20px
      height: 20px
      vertical-align: top
      background:no-repeat center
    }
    .phone{
      background-image:url("~images/phone.png")
    }
    .user{
      background-image:url("~images/user.png")
    }
    .password{
      background-image:url("~images/password.png")
    }
  }
</style>


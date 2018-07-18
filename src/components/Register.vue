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
          <div class="box-tab reg-title">
            <h3 class="title">账号注册</h3>
            <span>已有账号,<router-link to="/login">请登录</router-link></span>
          </div>
          <div class="box-cont reg-cont">
            <el-alert :title="errorMsg" type="error" show-icon class="error-msg" v-if="errorMsg"></el-alert>
            <el-form :model="regForm" :rules="rules" ref="regForm" label-width="0" status-icon>
              <el-form-item prop="username">
                <el-input v-model="regForm.username" auto-complete="off" @input.native="checkEmpty">
                  <template slot="prepend">用户名</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="userpwd">
                <el-input type="text" v-model="regForm.userpwd" auto-complete="off" @input.native="checkEmpty" @focus="changeType">
                  <template slot="prepend">密码</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="userpwd2">
                <el-input type="text" v-model="regForm.userpwd2" auto-complete="off" @input.native="checkEmpty" @focus="changeType">
                  <template slot="prepend">确认密码</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="userphone">
                <el-input v-model="regForm.userphone" auto-complete="off" @input.native="checkEmpty">
                  <template slot="prepend">手机号</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input v-model="regForm.code" placeholder="验证码" auto-complete="off" @input.native="checkEmpty" @keyup.enter.native="register('regForm')">
                  <template slot="append"><el-button @click="getCode" class="code-button">{{codeMsg}}</el-button></template>
                </el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="register('regForm')" :disabled="!regStatus">{{regMsg}}</el-button>
            <el-checkbox v-model="checked" @change="checkEmpty">我已阅读并接受以下条款：<router-link to="/">兆云商城服务条款</router-link></el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {validates,valideCode} from 'common/js/util'
  import {$httpSign,$httpSign2} from 'common/js/httpAll'
  export default {
    data() {
      var checkName=(rule,value,callback)=>{
        if(!value.trim()){
          callback(new Error('请输入用户名！'))
        }else if(value.trim().toLowerCase()==='null'||value.trim().toLowerCase()==='undefined'){
          callback(new Error('请不要以null或undefined作为用户名！'))
        }else if(value.trim()){
          // 判断是否有相同用户名
          $httpSign2({
            url:'/account/isBoolean',
            method:'post',
            params:{
              userName:this.regForm.username
            }
          }).then((res)=>{
            if(!res.data){
              callback(new Error('该用户名已存在！'))
            }else{
              callback()
            }
          })
        }
      }
      var checkPass = (rule, value, callback) => {
        if(!value.trim()){
          callback(new Error('请输入密码！'))
        }
        else if (this.regForm.userpwd2.trim() !== '') {
          this.$refs.regForm.validateField('userpwd2');
          callback();
        }else{
          callback();
        }
      };
      var checkPass2 = (rule, value, callback) => {
        if(!value.trim()){
          callback(new Error('请再次输入密码！'))
        }else if (!validates.validePass(this.regForm.userpwd,value)) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var checkPhone=(rule,value,callback)=>{
        if (!validates.phone(value)) {
          callback(new Error('手机号格式不正确!'));
        } else {
          callback();
        }
      }

      return {
        errorMsg:'',
        codeMsg:'获取验证码',
        regMsg:'立即注册',
        isClick:true,
        waitTime:10,
        regStatus:false,
        checked:false,
        regForm: {
          username: '',
          userpwd: '',
          userpwd2:'',
          userphone:'',
          code:''
        },
        rules:{
          username:[
            {validator:checkName,trigger:'blur'}
          ],
          userpwd:[
            {validator:checkPass,trigger:'blur'}
          ],
          userpwd2:[
            {validator:checkPass2,trigger:'blur'}
          ],
          userphone: [
            {validator: checkPhone,trigger: 'blur'}
          ]
        }
      };
    },
    mounted(){
      this.$store.commit('headerStatus',false)

      console.log(this.regForm.username)
    },
    methods: {
      changeType(e){
        e.target.type="password"
      },
      // 检查是否为空
      checkEmpty(){
        this.regStatus
          =this.regForm.username.trim()
          &&this.regForm.userpwd.trim()
          &&this.regForm.userpwd2.trim()
          &&this.regForm.userphone.trim()
          &&this.regForm.code.trim()
          &&this.checked
      },
      getCode(){
        valideCode(this,this.regForm.userphone,0)
      },
    	register(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            regEvent(this)
          } else {
            console.log('error submit!!');
            return false;
          }
        })

        function regEvent(_this){
          $httpSign({
            url:'/account/register',
            method:'post',
            data:{
              userName:_this.regForm.username,
              password:_this.regForm.userpwd,
              phone:_this.regForm.userphone,
              verifCode:_this.regForm.code
            },
            success:function(data){
              _this.regStatus=false
              _this.regMsg='注册中...'

              _this.errorMsg=''
              _this.$message({
                message: '注册成功',
                type: 'success'
              })
              _this.$router.push({path:'/login'})
            },
            error:function(err){
              _this.regStatus=false
              _this.regMsg='立即注册'
              _this.regForm.code=''
              _this.errorMsg=err
            }
          })
        }
    	}
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/log_reg.styl"
  .v-login{
    background-image:url('~images/log_reg_bg.jpg')
    .reg{
      &-title{
        padding-left:20px
        padding-right:20px
        .title{
          font-size:$font-xl
          color:$hover-color
          font-weight:normal
          text-align:left
        }
        span{
          font-size:$font-s
          text-align:right
          color:$size-color3
        }
        a{
          color:$size-color2
          &:hover{
            color:$hover-color
          }
        }
      }
      &-cont{
        padding-top:20px
        .el-input-group__prepend{
          width:75px
        }
        .el-checkbox{
          margin:10px 0 30px
          font-size:$font-l
          line-height:24px
          a{
            color:$hover-color
            &:hover{
              text-decoration:underline
            }
          }
        }
        .el-checkbox__input.is-checked+.el-checkbox__label{
          color:$size-color2
        }
      }
    }
  }
</style>

<template>
	<div class="login-pwd">
		<shop-title :title="title"></shop-title>
		<el-form :model="loginForm" ref="loginForm"  :rules="rules" label-width="100px" class="inpbox">
		  <el-form-item class="error-box"><span class="error">{{loginForm.errorMsg}}</span></el-form-item>
		  <el-form-item label="手机号码：">
		    <span v-if="type==='modify'" style="line-height:40px">{{loginForm.phone}}</span>
		    <el-input  v-if="type==='reset'" v-model="loginForm.phone" auto-complete="off" @input="checkEmpty"></el-input>
		  </el-form-item>
		  <el-form-item label="验证码：" class="codebox">
		    <el-input v-model="loginForm.code" auto-complete="off" @input="checkEmpty"></el-input>
		    <el-button plain @click="getCode">{{loginForm.codeMsg}}</el-button>
		  </el-form-item>
		  <el-form-item label="新登录密码：" prop="password">
		    <el-input type="text" v-model="loginForm.password" auto-complete="off" @input.native="checkEmpty" placeholder="6~16位，只能由英文、数字、下划线组成" @focus="changeType"></el-input>
		  </el-form-item>
		  <el-form-item label="再次输入：" prop="password2">
		    <el-input type="text" v-model="loginForm.password2" auto-complete="off" @input.native="checkEmpty" @focus="changeType"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('loginForm')" :disabled="!loginForm.btnStatus" class="btnbox">确定</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {validates,valideCode} from 'common/js/util'
	import {$httpSign} from 'common/js/httpAll'

	export default {
		data(){
			var checkPass = (rule, value, callback) => {
			  if(!value.trim()){
			    callback(new Error('请输入登录密码！'))
			  }else if(!validates.password(value)){
			  	callback(new Error('密码6~16位，只能由英文、数字、下划线组成！'));
			  }else if (this.loginForm.password2.trim() !== '') {
			    this.$refs.loginForm.validateField('password2');
			    callback();
			  }else{
			    callback();
			  }
			};
			var checkPass2 = (rule, value, callback) => {
			  if(!value.trim()){
			    callback(new Error('请再次输入登录密码！'))
			  }else if (!validates.validePass(this.loginForm.password,value)) {
			    callback(new Error('两次输入密码不一致!'));
			  } else {
			    callback();
			  }
			};
			return {
				loginForm:{
					phone:'',
					code:'',
					password:'',
					password2:'',
					errorMsg:'',
					btnStatus:false,
					codeMsg:'获取验证码',
					isClick:true
				},
				rules:{
				  password:[
            {validator:checkPass,trigger:'blur'}
          ],
          password2:[
            {validator:checkPass2,trigger:'blur'}
          ]
				}
			}
		},
		props:{
			title:String,
			type:String
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo
			}
		},
		watch:{
			userInfo(){
				if(this.type==='modify'){
					this.loginForm.phone=this.userInfo.phone
				}
			}
		},
		mounted(){
			if(this.type==='modify'){
				this.loginForm.phone=this.userInfo.phone
			}
		},
		components:{
			ShopTitle
		},
		methods:{
			changeType(e){
				e.target.type="password"
			},
			getCode(){
				valideCode(this.loginForm,this.loginForm.phone,2)
			},
			checkEmpty(){
				this.loginForm.btnStatus
				  =this.loginForm.code.trim()
				  &&this.loginForm.password.trim()
				  &&this.loginForm.password2.trim()
			},
			submitForm(name){
				this.$refs[name].validate((valid) => {
				  if (valid) {
			      $httpSign({
			      	url:'/account/forgotpwd',
			      	method:'post',
			      	params:{
			      		phone:this.loginForm.phone,
			      		verifCode:this.loginForm.code,
			      		password:this.loginForm.password,
			      		confirmPassword:this.loginForm.password2
			      	},
			      	success:function(data){
			      		if(this.type==='reset'){
			      			this.$router.push({path:'/login'})
			      		}else{
			      			this.$message({
			      			  type: 'success',
			      			  message: '修改成功!'
			      			})
			      			this.$router.push({path:'/user/account'})
			      		}
			      	}.bind(this),
			      	error:function(err){
			      		this.$message.error(err)
			      		this.loginForm.code=''
			      		this.loginForm.password=''
			      		this.loginForm.password2=''
			      	}.bind(this)
			      })
				  } else {
				    console.log('error submit!!');
				    return false;
				  }
				})
			}
		}
	}
</script>
<style lang="stylus">
	@import '~common/stylus/form.styl'
	.login-pwd{
		.el-form-item__content{
			line-height:28px
		}
		.error-box{
			margin:0 auto
			height:28px
		}
		.error{
			position:relative
			left:0
		}
	}
</style>

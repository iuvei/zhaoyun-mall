<template>
	<div class="user-cont">
		<shop-title :title="isSetPay?'修改支付密码':'设置支付密码'"></shop-title>
		<el-form :model="payForm" ref="payForm"  :rules="rules" label-width="100px" class="inpbox">
		  <p class="error">{{payForm.errorMsg}}</p>
		  <el-form-item label="手机号码：">
		    <span>{{payForm.phone}}</span>
		  </el-form-item>
		  <el-form-item label="验证码：" class="codebox">
		    <el-input v-model="payForm.code" auto-complete="off" @input.native="checkEmpty" name="code"></el-input>
		    <el-button plain @click="getCode(payForm)">{{payForm.codeMsg}}</el-button>
		  </el-form-item>
		  <el-form-item label="新支付密码：" prop="password">
		  	<el-input type="text" v-model="payForm.password" auto-complete="new-password" @input.native="checkEmpty" placeholder="6位数字" @focus="changeType"></el-input>
		  </el-form-item>
		  <el-form-item label="再次输入：" prop="password2">
		    <el-input type="text" v-model="payForm.password2" @focus="changeType" auto-complete="new-password" @input.native="checkEmpty"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('payForm')" :disabled="!payForm.btnStatus" class="btnbox">{{payBtn}}</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {validates,valideCode} from 'common/js/util'
	import {$httpSign,isSetPay} from 'common/js/httpAll'

	export default {
		data(){
			var checkPass = (rule, value, callback) => {
			  if(!value.trim()){
			    callback(new Error('请输入支付密码！'))
			  }else if(!validates.payPwd(value)){
			  	callback(new Error('密码为6位数字！'));
			  }else if (this.payForm.password2.trim() !== '') {
			    this.$refs.payForm.validateField('password2');
			    callback();
			  }else{
			    callback();
			  }
			};
			var checkPass2 = (rule, value, callback) => {
			  if(!value.trim()){
			    callback(new Error('请再次输入支付密码！'))
			  }else if (!validates.validePass(this.payForm.password,value)) {
			    callback(new Error('两次输入密码不一致!'));
			  } else {
			    callback();
			  }
			};
			return {
				isSetPay:false,
				payBtn:'确定',
				payForm:{
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
		mounted(){
			this.payForm.phone=this.$store.state.userInfo.phone
			this.setPay()
		},
		components:{
			ShopTitle
		},
		methods:{
			changeType(e){
				e.target.type='password'
			},
			setPay(){
				isSetPay((data)=>{
					this.isSetPay=data
				})
			},
			getCode(obj){
				valideCode(obj,obj.phone,3)
			},
			checkEmpty(){
				this.payForm.btnStatus
				  =this.payForm.code.trim()
				  &&this.payForm.password.trim()
				  &&this.payForm.password2.trim()
			},
			submitForm(name){
				this.$refs[name].validate((valid) => {
				  if (valid) {
				  	this.payBtn='提交中...'
				    $httpSign({
				    	url:'/person/setPayword',
				    	method:'post',
				    	params:{
				    		phone:this.payForm.phone,
				    		verifCode:this.payForm.code,
				    		payword:this.payForm.password,
				    		resetPayowrd:this.payForm.password2
				    	},
				    	success:function(data){
				    		let url=location.href.match(/\?([\s\S]+)$/)
				    		if(url===null){// 没有后缀?
				    		  this.$router.push({path:'/user/account'})
				    		}else{
				    		  this.$router.push({path:decodeURIComponent(url[1].split('=')[1])})
				    		}
				    	}.bind(this),
				    	error:function(err){
				    		this.$message.error(err)
				    		this.payForm.code=''
				    		this.payForm.password=''
				    		this.payForm.password2=''
				    	}.bind(this)
				    })
				  } else {
				    console.log('支付密码修改：error submit!!');
				    return false;
				  }
				})
			}
		}
	}
</script>
<style lang="stylus">
	@import '~common/stylus/form.styl'
</style>

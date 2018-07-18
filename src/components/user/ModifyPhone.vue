<template>
	<div class="user-cont">
		<shop-title title="修改手机号"></shop-title>
		<el-form :model="phoneForm1" ref="phoneForm1"  :rules="rules" label-width="100px" v-show="step===1" class="inpbox">
		  <el-form-item label="手机号码：">
		    <span>{{phoneForm1.phone}}</span>
		  </el-form-item>
		  <el-form-item label="验证码：" class="codebox">
		    <el-input v-model="phoneForm1.code" auto-complete="off" @input="phoneForm1.btnStatus=phoneForm1.code.trim()">
		    </el-input>
		    <el-button plain @click="getCode(phoneForm1)">{{phoneForm1.codeMsg}}</el-button>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="next('phoneForm1')" :disabled="!phoneForm1.btnStatus" class="btnbox">下一步</el-button>
		  </el-form-item>
		</el-form>
		<el-form :model="phoneForm2" ref="phoneForm2" label-width="100px" v-show="step===2" class="inpbox">
		  <p class="error">{{phoneForm2.errorMsg}}</p>
		  <el-form-item label="新的手机：" prop="phone">
		    <el-input v-model="phoneForm2.phone" auto-complete="off" @input.native="checkEmpty"></el-input>
		  </el-form-item>
		  <el-form-item label="验证码：" class="codebox">
		    <el-input v-model="phoneForm2.code" auto-complete="off" @input.native="checkEmpty">
		    </el-input>
		    <el-button plain @click="getCode(phoneForm2)">{{phoneForm2.codeMsg}}</el-button>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('phoneForm2')" :disabled="!phoneForm2.btnStatus" class="btnbox">确定</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {validates,valideCode} from 'common/js/util'

	export default {
		data(){
			var checkPhone=(rule,value,callback)=>{
			  if (!validates.phone(value)) {
			    callback(new Error('手机号格式不正确!'));
			  } else {
			    callback();
			  }
			}
			return {
				phoneForm1:{
					phone:'17074221369',
					code:'',
					btnStatus:false,
					codeMsg:'获取验证码',
					isClick:true
				},
				phoneForm2:{
					phone:'',
					code:'',
					btnStatus:false,
					codeMsg:'获取验证码',
					isClick:true,
					errorMsg:''
				},
				step:1,
				rules:{
				  phone: [
				    {validator: checkPhone,trigger: 'blur'}
				  ]
				}
			}
		},
		components:{
			ShopTitle
		},
		methods:{
			getCode(obj){
				valideCode(this,obj,obj.phone)
			},
			checkEmpty(){
				this.phoneForm2.btnStatus
				  =this.phoneForm2.phone.trim()
				  &&this.phoneForm2.code.trim()
			},
			next(){
				this.step=2
			},
			submitForm(name){
				this.$refs[name].validate((valid) => {
				  if (valid) {
				    console.log('success')
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
</style>

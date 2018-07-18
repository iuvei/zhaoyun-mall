<template>
	<div class="user-cont">
		<shop-title title="银行卡绑定"></shop-title>
		<el-form :model="bankForm" ref="bankForm" :rules="rules" label-width="100px" class="inpbox">
		  <p class="error">{{bankForm.errorMsg}}</p>
		  <el-form-item label="手机号码：">
		    <span>{{bankForm.phone}}</span>
		  </el-form-item>
		  <el-form-item label="验证码：" class="codebox">
		    <el-input v-model="bankForm.code" auto-complete="off" @input="checkEmpty"></el-input>
		    <el-button plain @click="getCode(bankForm)">{{bankForm.codeMsg}}</el-button>
		  </el-form-item>
		  <el-form-item label="开户人：" prop="name">
		    <el-input v-model="bankForm.name" auto-complete="off" @input.native="checkEmpty"></el-input>
		  </el-form-item>
		  <el-form-item label="开户银行：" prop="bankName">
		    <el-select v-model="bankForm.bankName" placeholder="请选择" style="width:100%" @change="checkEmpty">
			    <el-option value="11"></el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="银行卡号：" prop="bankCard">
		    <el-input v-model="bankForm.bankCard" auto-complete="off" @input.native="checkEmpty"></el-input>
		  </el-form-item>
		  <el-form-item label="所属支行：" prop="bankAddr">
		    <el-input v-model="bankForm.bankAddr" auto-complete="off" @input.native="checkEmpty" placeholder="请正确输入支行"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('bankForm')" :disabled="!bankForm.btnStatus" class="btnbox">确定</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {validates,valideCode} from 'common/js/util'

	export default {
		data(){
			var checkNum = (rule, value, callback) => {
			  if(!/^\d+$/.test(value)){
			  	callback(new Error('请正确输入银行卡号！'));
			  }else{
			    callback();
			  }
			};

			return {
				bankForm:{
					phone:'17074221369',
					code:'',
					name:'',
					bankName:'',
					bankCard:'',
					bankAddr:'',
					btnStatus:false,
					codeMsg:'获取验证码',
					isClick:true
				},
				rules:{
				  bankCard:[
            {validator:checkNum,trigger:'blur'}
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
				this.bankForm.btnStatus
				  =this.bankForm.code.trim()
				  &&this.bankForm.name.trim()
				  &&this.bankForm.bankName.trim()
				  &&this.bankForm.bankCard.trim()
				  &&this.bankForm.bankAddr.trim()
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

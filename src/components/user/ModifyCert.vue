<template>
	<div class="user-cont">
		<shop-title title="实名认证"></shop-title>
		<el-form :model="certForm" ref="certForm"  :rules="rules" label-width="100px" class="inpbox">
		  <p class="error">{{certForm.errorMsg}}</p>
		  <el-form-item label="姓名：">
		    <el-input v-model="certForm.name" auto-complete="off" @input="checkEmpty"></el-input>
		  </el-form-item>
		  <el-form-item label="身份证号：" prop="cert">
		    <el-input v-model="certForm.cert" auto-complete="off" @input="checkEmpty"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('certForm')" :disabled="!certForm.btnStatus" class="btnbox">确定</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {validates} from 'common/js/util'

	export default {
		data(){
			var checkCert = (rule, value, callback) => {
			  if (!validates.cert(value)) {
			    callback(new Error('身份证格式不正确!'));
			  } else {
			    callback();
			  }
			};
			return {
				certForm:{
					name:'',
					cert:'',
					errorMsg:'',
					btnStatus:false
				},
				rules:{
				  cert:[
            {validator:checkCert,trigger:'blur'}
          ]
				}
			}
		},
		components:{
			ShopTitle
		},
		methods:{
			checkEmpty(){
				this.certForm.btnStatus
				  =this.certForm.name.trim()
				  &&this.certForm.cert.trim()
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

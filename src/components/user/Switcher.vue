<template>
	<div class="user-cont">
		<shop-title :title="type==1?'彩云钱包转彩云金':'彩云金转彩云钱包'">
			<a href="javascript:;" class="more" @click="showDislog=true">转换记录</a>
		</shop-title>

		<el-form ref="form" :model="form" :rules="rules" label-width="100px" class="switch-form">
		  <el-form-item :label="type==1?'彩云钱包余额':'彩云金余额'">
		    <span>{{balance}}</span>
		    <router-link to="/user/cloudGold" class="rate">今日：1 人民币 ≈ 1 {{type==1?'VIP价':'彩云金'}}</router-link>
		  </el-form-item>
		  <el-form-item label="转换金额" prop="money">
		    <el-input :placeholder="type==1?'转换金额为500或者500的整数倍':'转换金额不得少于'+minMoney" v-model="form.money" @input.native="checkEmpty"></el-input>
		    <span class="gold">服务费：<em>{{form.money===''?0:(Number(form.money)*rate).toFixed(2)}}</em></span>
		  </el-form-item>
		  <el-form-item label="">
		    <el-button type="primary" @click="recEvent('form')" :disabled="!isClick">转换</el-button>
		  </el-form-item>
		</el-form>
		<p class="switch-tip" v-if="type==1">* 转换服务费为{{rate|precent()}}，下限为500及500的整数倍。</p>
  	<p class="switch-tip" v-if="type==2">* 转换服务费为{{rate|precent()}}，下限为{{minMoney}}。</p>
		<swtich-list :type="type" @on-hide-dialog="showDislog=false" v-if="showDislog"></swtich-list>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import SwtichList from 'base/SwtichList'
	import {$httpSign,getBalance} from 'common/js/httpAll'

	export default {
		data(){
			var validateMoney=(rule,value,callback)=>{
				if(this.type==1){
					if(!/^\d+$/.test(value)){
						callback(new Error('转换金额为500或500的整数倍！'))
					}else if(Number(value)%500!==0){
						callback(new Error('转换金额为500或500的整数倍！'))
					}else{
						callback()
					}
				}else{
					if(!/^\d+$/.test(value)){
						callback(new Error('转换金额必须大于'+this.minMoney))
					}else if(Number(value)<this.minMoney){
						callback(new Error('转换金额必须大于'+this.minMoney))
					}else{
						callback()
					}
				}
				
			}
			return {
				type:this.$route.query.type,		// 1:充值记录  2:线下充值记录
				balance:0,  // 彩云金或彩云钱包
				rate:0.15,	// 转换费率
				minMoney:5000,  // 最小转换金额
				isClick:false,
				showDislog:false,
				form:{
					money:''
				},
				rules:{
					money: [{validator: validateMoney, trigger: 'blur'}]
				}
			}
		},
		mounted(){
			this.getBalance()
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo
			}
		},
		methods:{
			checkEmpty(){
				this.isClick=this.form.money.trim()!==''
			},
			getBalance(){
				getBalance(function(data){
					this.balance=data
				}.bind(this))
			},
			recEvent(formName){
				this.$refs[formName].validate((valid) => {
				  if (valid) {
				    // 
				  } else {
				    console.log('error submit!!');
				    return false;
				  }
				})
			}
		},
		components:{
			ShopTitle,
			SwtichList
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/variable.styl'
	.switch{
		&-form{
			padding:40px 0 0 70px
			.rate{
				font-size:$font-x
				color:$size-color3
				margin-left:20px
				text-decoration: dotted
				&:hover{
					color:$hover-color
				}
			}
			.gold{
				margin-left:10px
				em{
					font-weight:bold
					color:$num-color
					font-style:normal
				}
			}
		}
	}
</style>
<style lang="stylus">
	@import '~common/stylus/variable.styl'
	@import '~common/stylus/dialog.styl'
	.switch-tip{
		color:$size-color4
		font-size:$font-s
		margin:0 50px 0 170px
		line-height:20px
		margin-top:20px
	}
	.switch-form{
		.el-input{
			width:280px
		}
		.el-button{
			width:150px
			margin-top:40px
		}
	}
</style>
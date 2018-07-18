<template>
	<div class="user-cont">
		<shop-title title="充值">
			<a href="javascript:;" class="more" @click="dialogVisible2=true;type=1" v-if="isOnline">充值记录</a>
			<a href="javascript:;" class="more" @click="dialogVisible2=true;type=2" v-if="!isOnline">线下充值记录</a>
		</shop-title>

		<div v-if="isOnline">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px" class="rec-form">
			  <el-form-item label="彩云钱包余额">
			    <span>{{balance}}</span>
			  </el-form-item>
			  <el-form-item label="充值账户">
			    <span>{{userInfo.phone}}</span>
			  </el-form-item>
			  <el-form-item label="充值金额" prop="money">
			    <el-input placeholder="请最少充值500或者500的倍数" v-model="form.money" @input.native="checkEmpty"></el-input>
			  </el-form-item>
			  <el-form-item label="邀请码" prop="code" v-if="codeStatus===0" class="rec-code">
			  	<div class="invite-item">
			  		<el-button plain v-if="!phoneInvite" @click="phoneInvite=true;numberInvite=false;form.code='';activeTab=0">手机邀请码</el-button>
			  		<el-input v-model="form.code" auto-complete="off" @input.native="checkEmpty" placeholder="请输入11位的手机邀请码" :maxlength="11" v-else>
			  		  <template slot="prepend">手机邀请码</template>
			  		</el-input>
			  	</div>
			  	<div class="invite-item">
			  		<el-button plain v-if="!numberInvite" @click="phoneInvite=false;numberInvite=true;form.code='';activeTab=1">数字邀请码</el-button>
			  		<el-input v-model="form.code" auto-complete="off" @input.native="checkEmpty" placeholder="请输入6位的数字邀请码" :maxlength="6" v-else>
			  		  <template slot="prepend">数字邀请码</template>
			  		</el-input>
			  	</div>
			  </el-form-item>
			  <el-form-item label="邀请码" prop="code" v-else-if="codeStatus===2">
			    <span>-</span>
			  </el-form-item>
			  <el-form-item label="邀请码" prop="code" v-else-if="codeStatus===1">
			    <span>{{code}}</span>
			  </el-form-item>
			  <el-form-item label="支付方式">
			    <ul class="paylist">
			    	<li v-for="(pay,index) in payArray" @click="activeType=pay.id;checkEmpty()" :class="{on:activeType===pay.id}" :key="index">
			    		<i class="icon" :class="['icon'+(index+1)]"></i>
			    		<i class="name">{{pay.name}}</i>
			    	</li>
			    	<li @click="isOnline=false">
			    		<i class="icon icon4"></i>
			    		<i class="name">线下打款</i>
			    	</li>
			    </ul>
			  </el-form-item>
			  <el-form-item class="rec-btns">
			    <el-button type="primary" @click="recEvent('form')" :disabled="!isClick">我要充值</el-button>
			  </el-form-item>
			</el-form>
			<p class="rec-tip">* 充值500以及500的整数倍，即可成为会员享受全场商品8.8折扣。充值时人民币将自动换算成彩云钱包VIP价。VIP价仅可在商城消费使用。</p>
		</div>
		<div v-else>
			<offline-payment :distributorID="userInfo.distributorID" :code="code?code:''" :codeStatus="codeStatus" @isOlineEvent="isOnline=true"></offline-payment>
		</div>

		<div class="el-dialog__wrapper el-recharge-dialog" style="z-index: 2001;" v-show="dialogVisible">
			<div class="el-dialog">
				<div class="el-dialog__header">
					<span class="el-dialog__title">微信支付</span>
					<button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="closeDialog">
						<i class="el-dialog__close el-icon el-icon-close"></i>
					</button>
				</div>
				<div class="el-dialog__body">
					<div class="ercode" ref="qrcode"></div>
				</div>
			</div>
		</div>
		<recharge-order @on-hide-dialog="dialogVisible2=false" v-if="dialogVisible2" :type="type"></recharge-order>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import RechargeOrder from 'base/RechargeOrder.vue'
	import OfflinePayment from 'base/OfflinePayment.vue'
	import QRCode from 'common/js/qrcode.min'
	import {$http,$httpSign,balanceData} from 'common/js/httpAll'
	import {getUrlDomain} from 'common/js/util'
	import {mapState,mapActions} from 'vuex'

	export default {
		data(){
			var validateMoney=(rule,value,callback)=>{
				if(!/^\d+$/.test(value)){
					callback(new Error('充值金额为500或500的整数倍！'))
				}else if(Number(value)%500!==0||value=='0'){
					callback(new Error('充值金额为500或500的整数倍！'))
				}else{
					callback()
				}
			}
			var validateCode=(rule,value,callback)=>{
				if(this.activeTab===0){
					if(!value.trim()){
						callback()
					}else if(!/^(13|15|17|18|19)[0-9]{9}$/.test(value)){
						callback(new Error('请填写正确的邀请码！'))
					}else if(value==this.userInfo.phone){
						callback(new Error('请不要填写自己的手机号！'))
					}else{
						$httpSign({
							url:'/invition/checkCode',
							method:'post',
							params:{
								phoneCode:this.form.code,
							},
							success:function(data){
								callback()
							}.bind(this),
							error:function(err){
								if(err=='尊敬的客户，您的邀请码已经被绑定，您不能再绑定对方的邀请码！'){
									this.codeStatus=2
									this.form.code=''
								}
								callback(err)
							}.bind(this)
						})
					}
				}else{
					if(!value.trim()){
						callback()
					}else if(!/^\d{6}$/.test(value)){
						callback(new Error('请填写正确的邀请码！'))
					}else{
						$httpSign({
							url:'/invition/checkCode',
							method:'post',
							params:{
								invitationVode:this.form.code
							},
							success:function(data){
								callback()
							}.bind(this),
							error:function(err){
								if(err=='尊敬的客户，您的邀请码已经被绑定，您不能再绑定对方的邀请码！'){
									this.codeStatus=2
									this.form.code=''
								}
								callback(err)
							}.bind(this)
						})
					}
				}
			}
			return {
				phoneInvite:false,
				numberInvite:false,
				type:1,		// 1:充值记录  2:线下充值记录
				timer:0,
				isOnline:true,
				title:'微信支付',
				dialogVisible:false,
				activeTab:0,
				activeType:-1,
				dialogVisible2:false,
				payArray:[
					{name:'微信',id:2},
					{name:'支付宝',id:0}
				],
				isClick:false,
				form:{
					money:'',
					code:''
				},
				rules:{
					money: [{validator: validateMoney, trigger: 'blur'}],
					code: [{validator: validateCode, trigger: 'blur'}],
				},
				code:0,
				codeStatus:0
			}
		},
		mounted(){
			this.getInviteCode()
			this.SETBalance()
		},
		computed:{
			...mapState(['userInfo','balance'])
		},
		methods:{
			...mapActions(['SETBalance']),
			// 关闭弹窗
			closeDialog(){
				this.dialogVisible=false
				this.$refs.qrcode.innerHTML=''
				clearInterval(this.timer)
			},
			checkEmpty(){
				this.isClick=this.activeType!==-1&&this.form.money.trim()!==''
			},
			// 获取邀请码
			getInviteCode(){
				balanceData(function(data){
					this.code=data.code
					// 0:未填写；1:已填写；2：不能填写
					if(data.code){
						this.codeStatus=1
					}else{
						this.codeStatus=0
					}
				}.bind(this))
			},
			recEvent(formName){
				this.$refs[formName].validate((valid) => {
				  if (valid||(!valid&&this.codeStatus===2)) {
				  	var params={
				  		amount:this.form.money,
				  		type:this.activeType,  // 支付类型
				  		returnUrl:location.href
				  	}
				  	if(this.code&&this.code.length===11||(!this.code&&this.form.code.length===11)){
				  		params.phoneCode=this.code?this.code:this.form.code
				  	}else if(this.code&&this.code.length===6||(!this.code&&this.form.code.length===6)){
				  		params.invitationVode=this.code?this.code:this.form.code
				  	}

				    $httpSign({
				    	url:'/pay/pay',
				    	method:'post',
				    	params:params,
				    	success:function(data){
				    		// 支付宝支付
				    		if(this.activeType===0){
				    			zhifubPay(data)
				    		}
				    		// 微信支付
				    		if(this.activeType===2){
				    			weichatPay(data)
				    		}
				    	}.bind(this)
				    })
				  } else {
				    console.log('error submit!!');
				    return false;
				  }
				})

				var _this=this
				// 微信支付
				function weichatPay(data) {
					_this.dialogVisible=true
					var qrcode = new QRCode(_this.$refs.qrcode, {
					  width : 180,//设置宽高
					  height : 180
					});
					qrcode.makeCode(data.code_url)

					_this.timer=setInterval(getOrderStatus.bind(_this),2000)
					function getOrderStatus(){
					  $httpSign({
					  	url:'/pay/weixinGetResult',
					  	method:'post',
					  	params:{
					  		transno:data.transno
					  	},
					  	success:function(datas){
					  		if(datas.status!==0){
					  			clearInterval(_this.timer)
					  		  this.$router.push({path:`/user/rechargeresult/${data.transno}`})
					  		}
					  	}.bind(this)
					  })
					}
				}
				// 支付宝支付
				function zhifubPay(data){
					const div = document.createElement('div')
					div.innerHTML = data.from
					document.body.appendChild(div)
					document.forms.punchout_form.submit()
				}
			}
		},
		components:{
			ShopTitle,
			RechargeOrder,
			OfflinePayment
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/variable.styl'
	.rec{
		&-tab{
			display:flex
			width:400px
			height:30px
			margin:42px auto 0
			line-height:26px
			font-size:$font-x
			border:2px solid $border-color
			background-color:#f7f7f7
			a{
				flex:1
				text-align:center
				color:$size-color2
				display:block
				&+a{
					border-left:2px solid $border-color
				}
				&.on{
					background-color:#fff
					color:$main-color
				}
			}
		}
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
		&-code{
			.invite-item{
				display:inline-block
				vertical-align:top
			}
			.invite-item+.invite-item{
				margin-left:10px
			}
		}
	}
	.paylist{
		display:flex
		li{
			width:110px
			height:64px
			border:1px solid $border-color
			border-radius:2px
			text-align:center
			cursor:pointer
			line-height:24px
			&+li{
				margin-left:40px
			}
			&:hover,&.on{
				border-color:$hover-color
			}
			.icon{
				display:block
				width:24px
				height:24px
				margin:10px auto 0
				background-image:url('~images/pay_icon.png')
			}
			for i in 1 2 3 4{
			  .icon{i}{
			    background-position:0 -24px*i
			  }
			}
			.name{
				font-size:$font-s
				color:$size-color2
				font-style:normal
			}
		}
	}
</style>
<style lang="stylus">
	@import '~common/stylus/variable.styl'
	@import '~common/stylus/dialog.styl'
	.rec-tip{
		color:$size-color3
		font-size:$font-x
		margin:0 50px
		line-height:20px
		margin-top:20px
	}
	.rec-form{
		.el-input{
			width:280px
		}
	}
	.rec-btns{
		.el-button{
			width:150px
			margin-top:40px
		}
	}
	.rec-code{
		.el-input{
			width:360px
		}
	}
</style>

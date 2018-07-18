<template>
	<div class="user-cont">
		<shop-title title="账户管理"></shop-title>
		<ul class="account">
			<li>
				<div class="title"><i class="el-icon-circle-check"></i>手机号</div>
				<div class="msg">您已绑定手机号 {{userInfo.phone|clipNumber}}</div>
				<!-- <router-link to="/user/modifyPhone" class="btn">修改</router-link> -->
			</li>
			<li>
				<div class="title"><i :class="{'el-icon-circle-check':userInfo.password,'el-icon-circle-close':!userInfo.password}"></i>登录密码</div>
				<div class="msg" v-if="!userInfo.password">您未设置过登录密码</div>
        <div class="msg" v-else-if="!isSetPay">您已设置过登录密码，若想修改请先设置支付密码</div>
        <div class="msg" v-else-if="userInfo.password&&isSetPay">您设置过登录密码</div>
				<a href="javascript:;" class="btn" @click="modifyLogin">{{userInfo.password?'修改':'设置'}}</a>
			</li>
			<li>
				<div class="title"><i :class="{'el-icon-circle-check':isSetPay,'el-icon-circle-close':!isSetPay}"></i>支付密码</div>
				<div class="msg" v-if="!isSetPay">您还未设置支付密码，为了账户安全请尽快设置</div>
				<div class="msg" v-else>支付密码已启用，将作为您帐号资产使用时的身份证明</div>
				<router-link to="/user/modifyPay" class="btn">{{isSetPay?'修改':'设置'}}</router-link>
			</li>
			<li>
				<div class="title"><i class="el-icon-circle-close"></i>实名认证</div>
				<div class="msg">请您实名认证</div>
				<!-- <div class="msg">您已通过实名认证</div> -->
				<el-tooltip content="实名认证设置开发中" placement="bottom">
				  <a href="javascript:;" class="btn">绑定</a>
				</el-tooltip>
				<!-- <router-link to="/user/modifyCert" class="btn">绑定</router-link> -->
				<!-- <a href="javascript:;" class="btn" @click="certVisible=true">查看</a> -->
			</li>
			<li>
				<div class="title"><i class="el-icon-circle-close"></i>银行卡绑定</div>
				<div class="msg">请绑定与您实名认证名字一样的银行卡</div>
				<!-- <div class="msg">您已绑定银行卡，如需更改，请联系客服</div> -->
				<el-tooltip content="银行卡设置开发中" placement="bottom">
				  <a href="javascript:;" class="btn">绑定</a>
				</el-tooltip>
				<!-- <router-link to="/user/modifyBank" class="btn">绑定</router-link> -->
				<!-- <a href="javascript:;" class="btn" @click="bankVisible=true">查看</a> -->
			</li>
		</ul>
		<!-- 银行卡查看 -->
		<!-- <el-dialog title="银行卡绑定" :visible.sync="bankVisible" class="account-dialog" width="600px">
		  <table class="table">
		  	<tr><th>开户人</th><td>陈丞澄</td></tr>
		  	<tr><th>开户银行</th><td>中国建设银行</td></tr>
		  	<tr><th>银行卡号</th><td>8888888888888888888</td></tr>
		  	<tr><th>开户支行</th><td>余杭新桥之后</td></tr>
		  </table>
		</el-dialog> -->
		<!-- 身份证查看 -->
		<!-- <el-dialog title="实名认证" :visible.sync="certVisible" class="account-dialog" width="600px">
		  <table class="table">
		  	<tr><th>姓名</th><td>陈丞澄</td></tr>
		  	<tr><th>身份证号</th><td>330521199090901029</td></tr>
		  </table>
		</el-dialog> -->
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {isSetPay} from 'common/js/httpAll'

	export default {
		data(){
			return {
				bankVisible:false,
				certVisible:false,
				isSetPay:false
			}
		},
		mounted(){
      this.$store.commit('updateActiveTab','3')
      this.setPay()
    },
    computed:{
    	userInfo(){
    		return this.$store.state.userInfo
    	}
    },
		components:{
			ShopTitle
		},
		methods:{
			modifyLogin(){
				if(!this.isSetPay&&userInfo.password){
					this.$confirm('请先设置支付密码，再修改登录密码！', '提示', {
	          confirmButtonText: '设置支付密码',
	          cancelButtonText: '取消'
	        }).then(() => {
	          this.$router.push({path:'/user/modifyPay'})
	        }).catch(() => {

	        })
				}else{
					this.$router.push({path:'/user/modifyLogin'})
				}
			},
			setPay(){
				isSetPay((data)=>{
					this.isSetPay=data
				})
			}
		}
	}
</script>
<style lang="stylus" scoped>
	@import '~common/stylus/goodslist.styl'

	.account{
		padding:0 24px
		li{
			display:flex
			align-items:center
			height:81px
			border-bottom:1px solid $border-color
		}
		.title{
			font-size:$font-m
			line-height:22px
			width:220px
			[class^="el-icon"]{
				font-size:$font-xxl
				margin-right:16px
				vertical-align:top
			}
			.el-icon-circle-check{
				color:#519fa2
			}
			.el-icon-circle-close{
				color:#e54e4e
			}
		}
		.msg{
			flex:1
			font-size:$font-x
			color:$size-color3
		}
		.btn{
			font-size:$font-x
			color:$size-color2
			width:80px
			text-align:center
			&:hover{
				color:$hover-color
			}
		}
		&-dialog{
			.table{
				border:1px solid $border-color
				border-collapse: collapse
				margin:0 auto
				td,th{
					font-size:$font-s
					height:42px
					border:1px solid $border-color
				}
				th{
					color:$size-color2
					font-weight:normal
					width:140px
				}
				td{
					color:$size-color
					padding:0 30px
				}
			}
		}
	}
</style>
<style lang="stylus">
	@import '~common/stylus/goodslist.styl'
	.el-dialog__header{
		padding:16px 20px
		background:url("~images/bg.jpg") repeat-x bottom left
		span{
			font-size:$font-m
			color:$size-color2
		}
	}
	.el-dialog__headerbtn{
		top:16px
	}
	.el-dialog__body{
		padding:40px 20px 60px
	}
</style>


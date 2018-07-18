<template>
	<div class="user-cont">
		<shop-title title="提现"></shop-title>
		<el-form ref="form" :model="form" label-width="90px" class="pay-form">
		  <el-form-item label="可用VIP价">
		    <span>2899</span>
		    <router-link to="/user/cloudGold" class="rate">今日：1 人民币 ≈ 1 VIP价</router-link>
		  </el-form-item>
		  <el-form-item label="提现VIP价">
		    <el-input></el-input>
		    <span class="gold">VIP价：<em>0</em></span>
		  </el-form-item>
		  <el-form-item label="提现至" class="pay-op">
		    您需先<router-link to="/user/modifyCert" class="el-button el-button--primary el-button--mini is-plain">实名认证</router-link>再<router-link to="/user/modifyBank" class="el-button el-button--primary el-button--mini is-plain">银行卡绑定</router-link>
		    <span class="tip"><i class="el-icon-warning"></i> 实名认证者与银行卡开户者需一致</span>
		  </el-form-item>
		  <el-form-item label="提现至" class="pay-op">
		    您还未绑定银行卡，请先去<router-link to="/user/modifyBank" class="el-button el-button--primary el-button--mini is-plain">银行卡绑定</router-link>
		    <span class="tip"><i class="el-icon-warning"></i> 请绑定与您实名认证名字一样的银行卡</span>
		  </el-form-item>
		  <el-form-item label="提现至" class="pay-op">
		    <el-radio v-model="radio" label="1">&nbsp;</el-radio>
		    <span>陈陈陈</span><span>中国邮政储蓄银行/星桥支行</span><span>68980 89808 24633 7894</span>
		  </el-form-item>
		  <el-form-item label="">
		    <el-button type="primary">我要提现</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	export default {
		data(){
			return {
				radio:'1'
			}
		},
		components:{
			ShopTitle
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/variable.styl'	
	.pay-form{
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
	.pay-op{
		line-height:22px
		span{
			margin-left:30px
			&:nth-of-type(1){
				margin-left:0
			}
		}
		.el-button{
			width:auto
			margin:0 5px
			line-height:20px
			padding:0 10px
		}
		.tip{
			color:$size-color3
			font-size:$font-x
			margin-left:20px
			.el-icon-warning{
				font-size:$font-s
			}
		}
	}
</style>
<style lang="stylus">
	@import '~common/stylus/variable.styl'
	
	.pay-form{
		.el-input{
			width:280px
		}
		.el-button{
			width:150px
			margin-top:40px
		}
	}
</style>
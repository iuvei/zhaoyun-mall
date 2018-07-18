<template>
	<div class="user-cont">
		<shop-title title="提现"></shop-title>
		<div class="pay-result">
			<p class="status"><i class="el-icon-circle-close"></i>提现失败</p>
			<p class="desc">很抱歉，您的提现申请受理失败，引起失败的原因可能是：系统发生错误</p>
			<div class="btns">
				<router-link to="/user/deposit" class="el-button el-button--primary">再次提现</router-link>
				<router-link to="/user/home" class="home-btn">去个人中心</router-link>
			</div>
		</div>
		<div class="pay-result">
			<p class="status"><i class="el-icon-circle-check"></i>提现已受理</p>
			<p class="desc">提现正在受理，商城会尽快为您处理。提现锁定期为90天，90天后请注意查看您的VIP价。</p>
			<div class="btns">
				<router-link to="/user/home" class="el-button el-button--primary">回到个人中心</router-link>
				<router-link to="/" class="home-btn">去首页</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	export default {
		components:{
			ShopTitle
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/variable.styl'

	.pay-result{
		padding-top:50px
		text-align:center
		.status{
			color:$size-color2
			font-size:$font-m
			font-weight:bold
			line-height:30px
			.el-icon-circle-close,.el-icon-circle-check{
				font-size:30px
				margin-right:20px
				vertical-align: top
			}
			.el-icon-circle-close{
				color:$num-color
			}
			.el-icon-circle-check{
				color:#519fa2
			}
		}
		.desc{
			font-size:$font-x
			color:$size-color3
			line-height:20px
			margin-top:20px
			i{
				color:$main-color
				font-style:normal
			}
		}
		.btns{
			margin-top:30px
			.el-button{
				width:150px
			}
			.home-btn{
				color:$main-color
				font-size:$font-s
				margin-left:20px
			}
		}
	}
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
	.paylist{
		width:560px
		display:flex
		justify-content: space-between
		li{
			width:110px
			height:64px
			border:1px solid $border-color
			border-radius:2px
			text-align:center
			cursor:pointer
			line-height:24px
			&:hover{
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

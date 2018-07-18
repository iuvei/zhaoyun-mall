<template>
	<div class="user-cont">
		<shop-title title="彩云钱包"></shop-title>
		<div class="cloud-gold">
			<div class="left">
				<p class="text">彩云钱包余额</p>
				<div class="info">
					<span class="price">VIP: <em>{{balance}}</em></span>
					<span class="rate">
					</span>
				</div>
			</div>
			<div class="right">
				<router-link to="/user/recharge" class="el-button el-button--primary el-button--mini">充值</router-link>
				<el-tooltip effect="dark" content="尊敬的用户您好，关于余额提现功能，目前公司技术部正在加班加点开发完善，敬请谅解，非常感谢您对兆云电商的关注，谢谢！" placement="bottom">
          <!-- <router-link to="/user/deposit" class="el-button el-button--mini">提现</router-link> -->
          <el-button size="mini">提现</el-button>
        </el-tooltip>
				<i class="icon-question"></i>
			</div>
		</div>
		<div class="cloud-chart">
			<!-- <gold-chart :data="15" :width="820" :height="200"></gold-chart> -->
		</div>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import GoldChart from 'base/GoldChart'
	import {mapState,mapActions} from 'vuex'

	export default {
    mounted(){
      this.$store.commit('updateActiveTab','2')
      this.SETBalance()
    },
    computed:{
    	...mapState(['balance'])
    },
    methods:{
    	...mapActions(['SETBalance'])
    },
		components:{
			ShopTitle,
			GoldChart
		}
	}
</script>

<style lang="stylus" scoped>
	@import "~common/stylus/variable.styl"
	.cloud-gold{
		padding:40px 0 40px 30px
		border-bottom:1px dashed $border-color
		display:flex
		.left{
			border-right:1px solid $border-color
			flex:1
			.text{
				font-size:$font-s
				color:$size-color2
				line-height:36px
			}
			.price{
				font-size:$font-x
				color:$num-color
				line-height:40px
				margin-right:80px
				em{
					font-style:normal
					font-size:$font-xl
				}
			}
			.rate{
				font-size:$font-s
				color:$size-color3
				line-height:40px
				em{
					font-style:normal
					font-weight:bold
					color:$main-color
				}
			}
		}
		.right{
			width:350px
			text-align:center
			display:flex
			align-items:center
			justify-content:center
			.el-button{
				display:inline-block
				width:100px
			}
			.icon-question{
				cursor:pointer
				color:$size-color3
				font-size:$font-xl
				transform:scale(0.6,0.6)
				display:inline-block
			}
		}
	}
	.cloud-chart{
		margin-top:20px
	}
</style>
<style lang="stylus">
  .el-tooltip__popper.is-dark{
    max-width:200px
    line-height:20px
  }
</style>
<template>
	<div class="user-cont">
		<shop-title title="充值"></shop-title>
		<div class="pay-result" v-if="status===1||status===3">
			<p class="status"><i class="el-icon-circle-close"></i>充值失败</p>
			<p class="desc">啊哦，账户充值失败，您还可以再次进行充值</p>
			<div class="btns">
				<router-link to="/user/recharge" class="el-button el-button--primary">重新充值</router-link>
				<router-link to="/" class="home-btn">去首页</router-link>
			</div>
		</div>
		<div class="pay-result" v-if="status===2">
			<p class="status"><i class="el-icon-circle-check"></i>充值成功</p>
			<p class="desc">充值成功后，您的账户可用VIP价为：<i>{{balance}}</i></p>
			<div class="btns">
				<router-link to="/user/recharge" class="el-button el-button--primary">再次充值</router-link>
				<router-link to="/" class="home-btn">去首页</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {$httpSign} from 'common/js/httpAll'
	import {mapState,mapActions} from 'vuex'

	export default {
		data(){
			return {
				status:0,
				transno:this.$route.params.transno
			}
		},
		computed:{
			...mapState(['balance'])
		},
		mounted(){
			this.getOrderStatus()
		},
		components:{
			ShopTitle
		},
		methods:{
			getOrderStatus(){
				$httpSign({
					url:'/pay/weixinGetResult',
					method:'post',
					params:{
						transno:this.transno
					},
					success:function(data){
						this.status=data.status
						if(data.status==2){
							this.SETBalance()
						}
					}.bind(this)
				})
			},
			...mapActions(['SETBalance'])
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
</style>

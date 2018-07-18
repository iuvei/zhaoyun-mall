<template>
	<div id="user" class="user">
		<div class="container">
			<div class="user-aside">
				<router-link to="/user/home" class="user-title">个人中心首页</router-link>
				<div class="user-info">
					<router-link to="/user/userInfo" class="photo" title="资料编辑">
						<img src="~images/default_photo.jpg" alt="个人图像" v-if="userInfo.picUrl===null">
						<img :src="getPhoto()" alt="个人图像" v-else>
					</router-link>
					<p class="name">{{userInfo.userName}}</p>
					<div class="set">
						<a href="javascript:;" class="on" title="手机号已设置"><i class="icon-user_phone"></i></a>
						<el-tooltip content="银行卡设置开发中" placement="bottom">
						  <!-- <router-link to="/user/modifyBank" title=""><i class="icon-user_bank"></i></router-link> -->
						  <a href="javascript:;"><i class="icon-user_bank"></i></a>
						</el-tooltip>
						<el-tooltip content="实名认证设置开发中" placement="bottom">
						  <!-- <router-link to="/user/modifyBank" title=""><i class="icon-user_bank"></i></router-link> -->
						  <a href="javascript:;"><i class="icon-user_cert"></i></a>
						</el-tooltip>
					</div>
					<p class="account">账号：<i>{{userInfo.phone}}</i></p>
					<p class="level" v-if="!!balance">等级：<i></i></p>
					<!-- <el-button type="primary" plain class="btn">签到领现金</el-button> -->
				</div>
				<el-collapse v-model="activeTab" accordion>
				  <el-collapse-item title="订单中心" name="1">
				    <router-link class="text" to="/user/orderList">商品订单</router-link>
				    <router-link class="text" to="/user/rechargeOrder">充值订单</router-link>
				    <router-link class="text" to="/user/refundList">售后/退款</router-link>
				  </el-collapse-item>
				  <el-collapse-item title="资产中心" name="2">
				    <router-link class="text" to="/user/invite">邀请提成</router-link>
				    <router-link class="text" to="/user/cloudGold">彩云钱包</router-link>
				    <router-link class="text" to="/user/fundWater">资金流水</router-link>
				  </el-collapse-item>
				  <el-collapse-item title="个人中心" name="3">
				    <router-link class="text" to="/user/collectList">我的收藏</router-link>
				    <router-link class="text" to="/user/addressList">收货地址</router-link>
				    <router-link class="text" to="/user/account">账号管理</router-link>
				    <router-link class="text" to="/user/userInfo">资料编辑</router-link>
				  </el-collapse-item>
				  <el-collapse-item title="资讯中心" name="4">
				    <router-link class="text" to="/user/newsList">消息</router-link>
				  </el-collapse-item>
				</el-collapse>
			</div>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import {getUrlDomain} from 'common/js/util'

	export default {
		data(){
			return {
				urlPath:getUrlDomain().urlPath
			}
		},
		mounted(){
			this.SETBalance()
		},
		computed:{
			activeTab:{
				get(){
					return this.$store.state.activeTab
				},
				set(value){
					this.$store.commit('updateActiveTab',value)
				}
			},
			...mapState(['balance','userInfo']),
		},
		methods:{		
			getPhoto(){
				if(/^http/.test(this.userInfo.picUrl)){
					return this.userInfo.picUrl
				}else{
					return this.urlPath+this.userInfo.picUrl
				}
			},
			...mapActions(['SETBalance']),
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/goodslist.styl'

	.user{
		.container{
			display:flex
			padding:45px 0 70px
		}
		&-aside{
			width:240px
			margin-right:20px
			.text{
				color:$size-color3
				font-size:$font-s
				text-align:center
				display:block
				border-top:1px solid #fff
				&.router-link-active{
					color:$hover-color
				}
			}
		}
		&-cont{
			position:relative
			flex:1
		}
		&-title{
			font-size:$font-m
			line-height:56px
			text-align:center
			display:block
			user-bg()
			color:$size-color
			background-color:#f8f3f0
		}
		&-info{
			user-bg()
			padding:42px 30px 16px
			background-color:#f8f3f0
			.photo{
				width:90px
				height:90px
				border-radius:50%
				border:4px solid #fff
				margin:0 auto
				display:block
				img{
					border-radius:50%
					width:100%
					height:100%
				}
			}
			.name{
				text-align:center
				margin:8px 0 16px
				line-height:20px
				color:$size-color2
			}
			.set{
				border-top:1px dashed $border-color
				border-bottom:1px dashed $border-color
				padding:10px 6px
				display:flex
				justify-content:space-between
				font-size:28px
				a{
					display:block
				}
				a.on{
					color:$hover-color
				}
			}
			.account,.level{
				font-size:$font-s
				line-height:28px
				color:$size-color3
			}
			.account{
				margin-top:10px
				i{
					font-style:normal
					color:$size-color2
				}
			}
			.level{
				i{
					display:inline-block
					width:20px
					height:18px
					background-image:url("~images/vip.png")
					vertical-align:-3px
				}
			}
			.btn{
				width:120px
				height:30px
				border-radius:2px
				padding:0
				margin:8px auto 0
				display:block
			}
		}
	}
</style>

<style lang="stylus">
	@import '~common/stylus/goodslist.styl'

</style>

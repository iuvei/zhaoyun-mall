<template>
	<div class="goods">
		<div class="container">
			<el-carousel indicator-position="none" height="320px" @change="curIndex=$event" v-if="bannerList.length">
		    <el-carousel-item v-for="(item,index) in bannerList" :key="index">
		    	<div class="slider" :style="{backgroundImage:`url(${urlPath}${item.picUrl})`}"></div>
		    </el-carousel-item>
		    <div class="slider-num">{{curIndex+1}}/{{bannerList.length}}</div>
		  </el-carousel>
		  <div class="goods-wrap" :id="itemList.name" :ref="itemList.name" v-for="(itemList,index) in itemLists" :key="index" v-if="itemList.itemList.length>0">
		  	<div :class="['goods-title',itemList.className]">
		  		<p class="title">{{itemList.title}}</p>
		  		<p class="subtitle">{{itemList.subtitle}}</p>
		  	</div>
		  	<ul class="goods-list">
		  		<li class="item" v-for="item in itemList.itemList" :key="item.itemID">
		  			<router-link :to="`/goodsdetail/${item.itemID}`" :title="item.itemName">
		  				<div class="img"><img v-lazy="urlPath+item.picUrl" :alt="item.itemName" width="235" height="235"></div>
		  				<div class="info">
		  					<p class="title">{{item.itemName}}</p>
		  					<p class="price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
		  					<p class="other_price">会员价：{{item.skuList[0].salesPrice|toFixed(2)}}
		  					  &nbsp;<del>&yen;{{item.skuList[0].marketPrice|toFixed(2)}}</del>
		  					</p>
		  				</div>
		  				<div class="info_hover">
	              <p class="dingjin" v-if="!!item.skuList[0].earnestPrice">定金：{{item.skuList[0].earnestPrice|toFixed(2)}}</p>
		  					<el-button type="primary" class="btn">加入购物车</el-button>
		  				</div>
		  			</router-link>
		  		</li>
		  	</ul>
		  </div>
		</div>
	</div>
</template>

<script>

	import {$httpSign} from 'common/js/httpAll'
	import {getUrlDomain} from 'common/js/util'

	export default {
		data(){
			return {
				curIndex:1,
				bannerList:[],
				urlPath:getUrlDomain().urlPath,
				itemLists:[{
					name:'day',
					className:'c_8092b7',
					title:'每日上新',
					subtitle:'精挑细选， 层层把关',
					itemList:[]
				},{
					name:'week',
					className:'c_af7b7a',
					title:'每周精选',
					subtitle:'每周为您精挑细选',
					itemList:[]
				},{
					name:'sale',
					className:'c_c8ba8d',
					title:'特价商品',
					subtitle:'疯狂抢抢抢',
					itemList:[]
				},{
					name:'car',
					className:'c_9e89b3',
					title:'优选汽车',
					subtitle:'最低能拿到七折，心动吗',
					itemList:[]
				}]
			}
		},
		mounted(){
			this.getItemList()
			this.getBannerList()
		},
		methods:{
			initScroll(){
				let name=this.$route.params.type
				document.documentElement.scrollTop=this.$refs[name][0].offsetTop-60
				document.body.scrollTop=this.$refs[name][0].offsetTop-60
			},
			getBannerList(){

        $httpSign({
					url:'/index/getSubAdvertList',
					success:function(data){
						this.bannerList=data.advert4
					}.bind(this)
				})
			},
			getItemList(){

        $httpSign({
					url:'/index/getItemList',
					success:function(data){
						this.itemLists[0].itemList=data.new
						this.itemLists[1].itemList=data.SuperValue
						this.itemLists[2].itemList=data.bargain
						this.itemLists[3].itemList=data.carList

						this.$nextTick(() => {
						  this.initScroll();
						})
					}.bind(this)
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/goodslist.styl'
	title(color1,color){
		.c_{color1}{
			.title{
				background-color:color
				&:after{
					border-color:color
				}
			}
			.subtitle{
				color:color
			}
		}
	}
	.goods{
		&-wrap{
			margin-top:20px
			background-color:#fff
		}

		&-title{
			padding:10px 0 10px
			text-align:center
			.title{
				position:relative
				line-height:34px
				width:130px
				margin:0 auto
				font-size:$font-xl
				font-weight:bold
				color:#fff
				background-color:$main-color
				border-radius:8px
				&:after{
					content:''
					position:absolute
					top:0
					left:-12px
					width:150px
					height:30px
					border:2px solid $main-color
					border-radius:8px
				}
			}
			.subtitle{
				font-size:$font-s
				color:$main-color
				line-height:20px
				margin:10px 0
			}
		}
	}
	title('8092b7',#8092b7)
	title('af7b7a',#af7b7a)
	title('c8ba8d',#c8ba8d)
	title('9e89b3',#9e89b3)
</style>

<style lang="stylus">
	@import '~common/stylus/variable.styl'
	.goods{
		.el-carousel{
			.slider{
				position:relative
				width:1080px
				height:320px
				background-position:center center
				background-size:auto 100%
				background-color:#f3f3f3
				&-num{
					position:absolute
					width:100px
					height:30px
					right:60px
					bottom:30px
					color:$size-color3
					font-size:$font-s
					line-height:28px
					text-align:center
					background: rgba(255,255,255,0.50)
					border: 1px solid #868686
					z-index:10
				}
			}
			.el-carousel__arrow{
				width:56px
				height:56px
				border-radius:0
				background-color:transparent
				i{
					color:$main-color
					font-size:56px
					font-weight:bold
					text-shadow:1px 0 0 $main-color,-1px 0 0 $main-color
				}
				&--right{
					right:0
				}
				&--left{
					left:0
				}
			}
		}
	}
</style>

<template>
	<div class="container logistics">
		<shop-title title="物流信息">
			<a href="javascript:;" class="more" @click="returnBack">返回</a>
		</shop-title>
		<ul class="logistics-list">
			<li v-for="(item,index) in tradeItemList" :key="index">
				<div class="logis-item">
					<div class="img"><img v-lazy="urlPath+item.picUrl" :alt="item.itemName" width="90" height="90"></div>
					<div class="info">
						<p class="title">{{item.itemName}}</p>
						<p class="num">X {{item.skuCount}}</p>
					</div>
				</div>
				<div class="logis-msg">
					<p class="total">共1件</p>
					<p class="name" v-if="item.shipStatus===1">物流公司：{{item.logisticsName}}</p>
					<p class="no" v-if="item.shipStatus===1">物流单号：{{item.logisticsNo}}</p>
					<p class="status" v-if="item.shipStatus===0">物流状态：<em>未发货</em></p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle.vue'
  import {getOrderStatus,getUrlDomain,afterSaleStatus} from 'common/js/util'
  import {orderDetail} from 'common/js/httpAll'

  export default {
    data() {
      return {
      	orderid:this.$route.params.orderid,
      	urlPath:getUrlDomain().urlPath,
      	tradeItemList:[]
      }
    },
    mounted() {
      this.getOrderDetail()
    },
    methods: {
    	returnBack(){
    		window.history.back()
    	},
    	getOrderStatus(orderS,payS){
    	  return getOrderStatus(orderS,payS)
    	},
      getOrderDetail() {
        orderDetail(this.orderid, function (data) {
        	var order=data.trade
        	if(getOrderStatus(order.tradeStatus,order.payStatus)===3||getOrderStatus(order.tradeStatus,order.payStatus)===2){
        		this.tradeItemList=order.tradeOrderList
        	}else{
        		this.$router.push({path:'/orderDetail/'+this.orderid})
        	}
        }.bind(this))
      }
    },
    components:{
    	ShopTitle
    }
  }
</script>

<style scoped lang="stylus">
	@import '~common/stylus/variable.styl'
	.logistics{
		margin:40px auto 120px
		.logistics-list{
			li{
				margin-top:20px
				padding:30px 0 30px 60px
				background-color:#f8f8f8
				display:flex
			}
		}
		.logis{
			&-item{
				width:640px
				padding-left:110px
				position:relative
				height:90px
				.img{
					position:absolute
					top:0
					left:0
					width:90px
					height:90px
					background-color:#fff
				}
				.title{
					font-size:$font-s
					line-height:20px
					color:$size-color2
					ellipsis-mulit(2)
				}
				.num{
					font-size:$font-s
					color:$size-color3
					margin-top:10px
				}
				.info{
					padding-right:40px
				}
			}
			&-msg{
				flex:1
				border-left:1px dashed $border-color
				padding-left:30px
				.total{
					font-size:$font-m
					color:$size-color2
					margin-bottom:10px
				}
				.name,.no,.status{
					font-size:$font-s
					color:$size-color3
					line-height:24px
				}
				em{
					color:$main-color
					font-style:normal
				}
			}
		}
	}
</style>


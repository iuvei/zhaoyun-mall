<template>
	<div class="user-cont">
		<shop-title title="资金流水"></shop-title>
		<no-data v-if="list.length===0" :imgUrl="imgUrl" :desc="'暂未资金流水~'">
		  <p class="op1"><router-link to="/">去购物>></router-link></p>
		</no-data>

		<table class="fund-td" v-for="order in list" :key="order.transno" v-if="list.length>0">
			<tr>
				<td class="td-icon" width="60">
					<i class="icon-fund_recharge" v-if="order.baseType===0"></i>
					<i class="icon-fund_goods" v-if="order.baseType===1"></i>
					<i class="icon-fund_deposit" v-if="order.baseType===2"></i>
				</td>
				<td>{{order.createTime|time('yyyy/MM/dd-hh:ss')}}</td>
				<td>{{typeNameArr[typeArr.indexOf(order.baseType)]}}</td>
				<td class="td-num">{{order.baseType===0?'+':'-'}}{{order.amount|toFixed(2)}}</td>
				<td>{{order.describe}}</td>
			</tr>
		</table>
		<el-pagination background layout="prev, pager, next" :total="totalPage" :page-size="sizePage" prev-text="上一页"
                   next-text="下一页" @current-change="getRechargeList"
                   v-if="totalPage/sizePage>1"></el-pagination>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {$httpSign} from 'common/js/httpAll'
	import NoData from 'base/NoData.vue'
  import img from 'images/order_nodata.jpg'

	export default {
		data(){
			return {
				list:[],
				imgUrl:img,
				sizePage:16,
				totalPage:0,
				typeArr:[0,1,2,3],
				typeNameArr:['商城充值','商城消费','商城提现','商城消费']
			}
		},
		mounted(){
			this.getRechargeList(1)
			this.$store.commit('updateActiveTab','2')
		},
		methods:{
			getRechargeList(a){
    		$httpSign({
    			url:'/person/queryPay',
    			method:'post',
    			data:{
    				pageNo:a,
    				pageSize:this.sizePage
    			},
    			success:function(data){
    				this.list=data.list
    				this.totalPage=data.query.totalCount
    			}.bind(this)
    		})
			}
		},
		components:{
			ShopTitle,
			NoData
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/variable.styl'
	.fund-td{
		font-size:$font-x
		color:$size-color3
		border-collapse: collapse
    width: 100%
		td{
			padding:10px
			line-height:18px
			height:60px
			border-bottom:1px solid $border-color
			&:last-child{
				width:300px
				text-align:center
			}
			&.td-num{
				color:$num-color
			}
			&.td-icon{
				padding:10px 20px
				font-size:24px
				color:$size-color4
			}
		}
	}
</style>

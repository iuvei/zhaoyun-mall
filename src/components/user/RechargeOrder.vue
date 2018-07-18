<template>
	<div class="user-cont">
		<recharge-order @on-hide-dialog="hideDialog" v-if="dialogVisible" :type="1"></recharge-order>
		<div class="user-head">
			<el-tabs v-model="orderStatus" type="card" @tab-click="getOrderList(1)">
		    <el-tab-pane label="所有订单" name="0,1,2">
		    </el-tab-pane>
		    <el-tab-pane label="话费充值" name="0">
		    </el-tab-pane>
		    <el-tab-pane label="油卡充值" name="1,2"></el-tab-pane>
		  </el-tabs>
		  <a href="javascript:;" class="btn" @click="dialogVisible=true">充值记录</a>
		</div>
		
	  <div class="shopcart-th" v-if="totalPage>0">
  	  <div class="th-op">
				<el-checkbox label="all" v-model="checkAll" @change="selectAll">全选（{{selectIDs.length}}）</el-checkbox>
				<a href="javascript:;" @click="deleteOrder(selectIDs)">批量删除订单</a>
			</div>
	  </div>
	  <no-data v-if="totalPage===0" :imgUrl="imgUrl" :desc="'您还没有充值订单~'">
      <p class="op1"><router-link to="/">去充值>></router-link></p>
    </no-data>
		<el-checkbox-group v-model="selectIDs" v-if="totalPage!==0" @change="selectSingle">
		  <table class="table table-12" v-for="order in orderList" :key="order.rechargeId">
		  	<colgroup><col width="56"><col width="230"><col width="294"><col width="120"><col width="120"></colgroup>
		  	<thead>
		  		<tr class="table-head">
		  			<th><el-checkbox :label="order.rechargeId">&nbsp;</el-checkbox></th>
		  			<th colspan="3">
		  				<span class="time">{{order.createTime|time('yyyy/MM/dd')}}</span>
		  				<span class="orderid">订单号：{{order.transno}}</span>
		  			</th>
		  			<th><a href="javascript:;" class="delete" @click="deleteOrder(order.rechargeId)">删除</a></th>
		  		</tr>
		  	</thead>
		  	<tbody>
		      <tr class="table-td order-table-td">
		        <td></td>
		        <td class="td-item td-item-80">
	            <div class="item-pic">
	              <img src="~images/huafei.jpg" alt="话费充值" title="话费充值" width="80" height="80" v-if="order.type===0">
	              <img src="~images/oil.jpg" alt="油卡充值" title="油卡充值" width="80" height="80" v-if="order.type===1||order.type===2">
	            </div>
		          <div class="item-info">
		            <p class="item-title" title="话费充值" v-if="order.type===0">话费充值</p>
		            <p class="item-title" title="油卡充值" v-else>{{order.type===1?'油卡充值——中国石化':'油卡充值——中国石油'}}</p>
		          </div>
		        </td>
		        <td class="td-price" style="text-align:left">
		          <span>充值号码：{{order.number}}</span><br/>
		          <span>充值金额：{{order.rechargeAmount}}</span>
		        </td>
		        <td class="td-amount td-muti"><i class="c_222222">VIP价：{{order.amount}}</i></td>
		        <td class="td-op td-muti">
	        		<span class="c_868686" v-if="order.status===2">充值成功</span>
	        		<span class="c_868686" v-if="order.status===1||order.status===3">充值失败</span>
	        		<span class="c_868686" v-if="order.status===0">处理中</span><br/>
	        		<router-link to="/">再次充值</router-link>
		        </td>
		      </tr>
		    </tbody>
		  </table>
	  </el-checkbox-group>
	  <el-pagination background layout="prev, pager, next" :total="totalPage" :page-size="sizePage" prev-text="上一页" next-text="下一页" @current-change="getOrderList" v-if="totalPage/sizePage>1"></el-pagination>
	</div>
</template>

<script>
	import {$httpSign} from 'common/js/httpAll'
	import RechargeOrder from 'base/RechargeOrder.vue'
	import NoData from 'base/NoData.vue'
	import img from 'images/order_nodata.jpg'

	export default {
		data(){
			return {
				dialogVisible:false,
				orderStatus:'0,1,2',
				orderList:[],
				selectIDs:[],
				checkAll:false,
				sizePage:16,
				totalPage:0,
				imgUrl:img
			}
		},
		mounted(){
			this.$store.commit('updateActiveTab','1')
			this.getOrderList(1)
		},
		methods:{
			getOrderList(a){
				$httpSign({
					url:'/person/queryOtherRecharge',
					method:'post',
					data:{
						typeArray:this.orderStatus.split(','),
						pageNo:a,
						pageSize:this.sizePage
					},
					success:function(data){
						this.orderList=data.list
						this.totalPage=data.query.totalCount
					}.bind(this)
				})
			},
			hideDialog(){
				this.dialogVisible=false
			},
			deleteOrder(selectIDs){
				var array=[]
				if(typeof selectIDs==='string'||typeof selectIDs==='number'){
					array.push(selectIDs)
				}else{
					array=selectIDs
				}
				$httpSign({
					url:'/person/deletedOtherRecharge',
					method:'post',
					params:{
						rechargeIdArray:array.join(',')
					},
					success:function(data){
						this.getOrderList(1)
						this.$message({
						  type: 'success',
						  message: '删除成功!'
						})
					}.bind(this)
				})
			},
			// 全选
			selectAll(a){
				if(a){
					this.selectIDs=[]
					this.orderList.forEach((item)=>{
						this.selectIDs.push(item.rechargeId)
					})
				}else{
					this.selectIDs=[]
				}
			},
			// 单选
			selectSingle(){
				this.checkAll=this.selectIDs.length===this.orderList.length
			}
		},
		components:{
			RechargeOrder,
			NoData
		}
	}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/table.styl"
  .user-head{
  	position:relative
  	.btn{
  		position:absolute
  		font-size:$font-x
  		line-height:50px
  		top:0
  		right:20px
  	}
  }
  .shopcart{
    &-th {
      font-size: $font-x
      display: flex
      justify-content:space-between
      line-height:0
      margin-top:20px
      .th-op{
      	line-height:22px
      }
      a{
      	color:$size-color2
      	margin-left:20px
      }
    }
  }
  .table{
  	&:first-child{
  		margin-top:20px
  	}
	}

</style>

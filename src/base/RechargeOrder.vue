<template>
	<div class="recharge" v-if="type===1">
		<a href="javascript:;" class="recharge-delete" @click="hideDialog"><i class="el-icon-close"></i></a>
	  <table class="recharge-table">
	  	<tr>
	  		<th width="280">流水号</th><th width="140">日期</th><th>充值金额</th><th>充值方式</th><th>状态</th>
	  	</tr>
	  	<tr v-if="totalPage===0">
	  		<td colspan="5">暂未充值记录</td>
	  	</tr>
      <tr v-for="order in orderList" :key="order.transno">
        <td>{{order.transno}}</td>
        <td>{{order.createTime|time('yyyy/MM/dd-hh:ss')}}</td>
        <td>{{order.amount|toFixed(2)}}</td>
        <td>{{typeNameArr[typeArr.indexOf(order.type)]}}</td>
        <td>{{order.status===2?'充值成功':(order.status===1||order.status===3)?'充值失败':'充值处理中'}}</td>
      </tr>
	  </table>
	  <el-pagination background layout="prev, pager, next" :total="totalPage" :page-size="sizePage" prev-text="上一页" next-text="下一页" @current-change="getRechargeList" v-if="totalPage/sizePage>1" class="recharge-pages"></el-pagination>
	</div>
  <div class="recharge" v-else>
    <a href="javascript:;" class="recharge-delete" @click="hideDialog"><i class="el-icon-close"></i></a>
    <table class="recharge-table">
      <tr>
        <th width="140">日期</th><th>打款凭证</th><th>充值方式</th><th>状态</th>
      </tr>
      <tr v-if="accountPicList.length===0">
        <td colspan="4">暂未线下打款记录</td>
      </tr>
      <tr v-for="order in accountPicList" :key="order.uploadPicID">
        <td>{{order.createTime|time('yyyy/MM/dd-hh:ss')}}</td>
        <td>
          <a :href="urlPath+order.picUrl" target="_blank"><img v-lazy="urlPath+order.picUrl" alt="打款凭证" width="60" height="60"></a></td>
        <td>线下充值</td>
        <td>{{order.status==1?'充值成功':'充值处理中'}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
	import {$http,$httpSign} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'

	export default {
		data(){
			return {
        urlPath:getUrlDomain().urlPath,
				orderList:[],
        accountPicList:[],
				sizePage:16,
				totalPage:0,
				typeArr:[0,1,2,3,4,5,6,7],
				typeNameArr:['支付宝充值','支付宝充值','微信充值','微信充值','连连支付','银联充值','其他充值','线下充值']
			}
		},
    props:{
      type:Number
    },
		mounted(){
      if(this.type===1){
        this.getRechargeList(1)
      }else{
        this.getAccountPicList()
      }

		},
		methods:{
			getRechargeList(a){
    		$httpSign({
    			url:'/person/queryPay',
    			method:'post',
    			data:{
    				baseType:0,
    				pageNo:a,
    				pageSize:this.sizePage
    			},
    			success:function(data){
    				this.orderList=data.list
    				this.totalPage=data.query.totalCount
    			}.bind(this)
    		})
			},
      getAccountPicList(){
        $httpSign({
          url:'/account/accountPicList',
          method:'post',
          params:{
            distributorID:this.$store.state.userInfo.distributorID
          },
          success:function(data){
            this.accountPicList=data.accountPicList
          }.bind(this)
        })
      },
			hideDialog(){
				this.$emit("on-hide-dialog",false)
			}
		}
	}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .recharge{
    position:absolute
    top:0
    min-height:600px
    width:760px
    z-index:10
    background-color:#fff
    box-shadow:0 1px 12px rgba(0,0,0,0.2)
    padding-bottom:30px
    &-pages{
      text-align:center
    }
    &-delete{
      color:#fff
      position:absolute
      right:1px
      top:1px
      background-color:#000
      font-size:24px
    }
    &-table{
      line-height:20px
      th{
        font-size:$font-s
        font-weight:normal
        height:56px
        color:#fff
        background-color:$main-color
        border:1px solid $border-color
      }
      td{
        font-size:$font-x
        color:$size-color2
        padding:10px
        border:1px solid $border-color
        text-align:center
        &:first-child{
          word-wrap: break-word
        }
      }
    }
  }
</style>

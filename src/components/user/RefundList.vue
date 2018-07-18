<template>
  <div class="user-cont">
    <el-tabs v-model="orderStatus" type="card" @tab-click="getOrderList(1)">
      <el-tab-pane label="退款中" name="2"></el-tab-pane>
      <el-tab-pane label="退款成功" name="3"></el-tab-pane>
    </el-tabs>
    <no-data v-if="orderList.length===0" :imgUrl="imgUrl" :desc="'您还没有订单呢~'">
      <p class="op1">
        <router-link to="/">去购物>></router-link>
        ，看看有没有喜欢的
      </p>
    </no-data>
    <table class="table table-12" v-if="orderList.length!==0">
      <thead>
      <tr class="table-th">
        <th width="20"></th>
        <th width="300">商品</th>
        <th>退款金额</th>
        <th>类型</th>
        <th>操作</th>
      </tr>
      </thead>
      <tr>
        <td colspan="5" height="10"></td>
      </tr>
      <tbody>
      <tr class="table-td order-table-td"  v-for="item in orderList" :key="item.returnID">
        <td></td>
        <td class="td-item td-item-80">
          <router-link :to="`/goodsDetail/${item.itemID}`" class="item-pic">
            <img v-lazy="urlPath+item.itemPic" :alt="item.itemName" :title="item.itemName" width="80" height="80">
          </router-link>
          <div class="item-info">
            <router-link :to="`/goodsDetail/${item.itemID}`" class="item-title" :title="item.itemName">
              {{item.itemName}}
            </router-link>
            <div class="item-sku">
              <span>{{item.skuName}}</span>
            </div>
          </div>
        </td>
        <td class="td-price">
          <span>退款金额：{{item.totalPrice|toFixed(2)}}</span>
        </td>
        <td class="td-op">
          <span v-if="item.returnType === '1'">仅退款</span>
          <span v-else>退货退款</span>
          <br/>
          <span class="c_af7b7a" v-if="item.status==0||(item.status==2&&item.returnType==0)">退款处理中</span>
          <span class="c_af7b7a" v-if="item.status==3||(item.status==2&&item.returnType==1)">退款成功</span>
          <span class="c_af7b7a" v-if="item.status==1">退款失败</span>
        </td>
        <td class="td-op">
          <router-link class="el-button el-button--is-plain el-button--mini" :to="`/refundGoods/${item.tradeID}?&returnType=${item.returnType}&orderid=${item.tradeOrderID}`" v-if="item.status==1">再次申请</router-link>
          <router-link class="el-button el-button--is-plain el-button--mini" :to="`/refundGoods/${item.tradeID}?&returnType=${item.returnType}&orderid=${item.tradeOrderID}`" v-else>退款详情</router-link>
          <br/>
          <!-- <a href="javascript:;" v-if="getOrderStatus(order.tradeStatus,order.payStatus)===8" @click="deleteOrder(order.tradeID)">删除订单</a> -->
        </td>
      </tr>
      </tbody>
      <!-- <tfoot>
      <tr>
        <td colspan="5">
          <el-pagination background layout="prev, pager, next" :total="page.totalCount" :page-size="siezPage"
                         prev-text="上一页" next-text="下一页" @current-change="getOrderList"
                         v-if="page.totalCount/siezPage>1"></el-pagination>
        </td>
      </tr>
      </tfoot> -->
    </table>
  </div>
</template>

<script>
  import ShopTitle from 'base/Shop/ShopTitle'
  import NoData from 'base/NoData.vue'
  import {getUrlDomain} from 'common/js/util'
  import {$httpSign,deleteOrder} from 'common/js/httpAll'
  import img from 'images/order_nodata.jpg'

  export default {
    data() {
      return {
        orderStatus: '2',
        allorderList: [],
        orderList:[],
        imgUrl: img,
        urlPath:getUrlDomain().urlPath
      }
    },
    mounted() {
      this.$store.commit('updateActiveTab', '1')
      this.getAllOrderList()
    },
    methods: {
      getAllOrderList() {
        $httpSign({
          url:'/trade/tradeReturnList',
          success:function(data){
            this.allorderList=data.tradeReturnList
            this.getOrderList()
          }.bind(this)
        })
      },
      getOrderList(){
        this.orderList=[]
        this.allorderList.forEach((item)=>{
          if(this.orderStatus==2){
            if(item.status==0||(item.status==2&&item.returnType==0)){
              this.orderList.push(item)
            }
          }if(this.orderStatus==3){
            if(item.status==3||(item.status==2&&item.returnType==1)){
              this.orderList.push(item)
            }
          }
        })
      },
      // 删除订单
      deleteOrder(tradeID){
        deleteOrder(this,tradeID,function(data){
          this.getOrderList(this.page.pageNo)
        }.bind(this))
      }
    },
    components: {
      ShopTitle,
      NoData
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/table.styl"

  .table {
    margin-top: 20px
    &-th {
      font-size: $font-s
      background-image: none
    }
    &-td {
      td {
        border-top: 1px solid $border-color
      }
      .td-item {
        .item-info {
          padding-bottom: 0
        }
      }
    }
  }

</style>

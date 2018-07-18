<template>
  <div class="user-cont">
    <el-tabs v-model="orderStatus" type="card" @tab-click="getOrderList(1)">
      <el-tab-pane label="所有订单" name="-1">
      </el-tab-pane>
      <el-tab-pane label="待付款" name="1">
      </el-tab-pane>
      <el-tab-pane label="待发货" name="2"></el-tab-pane>
      <el-tab-pane label="待收货" name="3"></el-tab-pane>
      <el-tab-pane label="待评论" name="4"></el-tab-pane>
    </el-tabs>

    <!-- <div class="shopcart-th" v-if="page.totalCount>0&&(orderStatus==='-1'||orderStatus==='3')">
      <div class="th-op">
        <el-checkbox label="all">全选（0）</el-checkbox>
        <a href="javascript:;">批量确认收货</a>
      </div>
    </div> -->
    <no-data v-if="orderList.length===0" :imgUrl="imgUrl" :desc="'您还没有订单呢~'">
      <p class="op1"><router-link to="/">去购物>></router-link>，看看有没有喜欢的</p>
    </no-data>
    <el-checkbox-group v-model="selectIDs" v-if="orderList.length>0">
      <table class="table table-12" v-for="order in orderList" :key="order.tradeID">
        <colgroup>
          <col width="36">
          <col width="300">
          <col width="142">
          <col width="100">
          <col width="142">
          <col width="100">
        </colgroup>
        <thead>
        <tr class="table-head">
          <th>
            <!-- <el-checkbox :label="order.tradeID" :disabled="order.tradeStatus!==3">&nbsp;</el-checkbox> -->
          </th>
          <th colspan="4">
            <span class="time">{{order.createTime|time('yyyy/MM/dd')}}</span>
            <span class="orderid">订单号：{{order.tradeNo}}</span>
          </th>
          <th><a href="javascript:;" class="delete" v-if="isDelete(order.tradeStatus,order.tradeOrderList)" @click="deleteOrder(order.tradeID)">删除</a></th>
        </tr>
        </thead>
        <tbody>
        <tr class="table-td order-table-td" v-for="(item,index) in order.tradeOrderList" :key="item.skuID">
          <td></td>
          <td class="td-item td-item-80">
            <router-link :to="`/goodsDetail/${item.itemID}`" class="item-pic">
              <img v-lazy="urlPath+item.picUrl" :alt="item.itemName" :title="item.itemName" width="80" height="80">
            </router-link>
            <div class="item-info">
              <router-link :to="`/goodsDetail/${item.itemID}`" class="item-title" :title="item.itemName">
                {{item.itemName}}
              </router-link>
              <div class="item-sku">
                <span>{{item.skuName}}</span>
              </div>
              <!-- <div class="item-discount">
                <i class="zhe"></i>
                <i class="jiang"></i>
                <i class="you"></i>
              </div> -->
            </div>
          </td>
          <td class="td-price">
            <span class="price-vip" v-if="!item.earnestPrice">VIP价：{{item.vipPrice|toFixed(2)}}</span>
            <span class="c_af7b7a" v-if="!!item.earnestPrice">定金：{{item.earnestPrice|toFixed(2)}}</span>
          </td>
          <td class="td-amount">X {{item.skuCount}}</td>
          <td class="td-sum td-muti" v-if="index===0" :rowspan="order.tradeOrderList.length">
            <span class="total">{{order.payment|toFixed(2)}}</span>
            <br/>
            <span class="freight">（运费：{{order.expressFee}}）</span>
          </td>
          <td class="td-op td-muti" v-if="index===0" :rowspan="order.tradeOrderList.length">
            <!-- 已取消 -->
            <div v-if="order.curStatus===0&&order.refundStatus==1">
              <span class="c_868686">交易关闭</span><br/>
              <router-link :to="`/orderDetail/${order.tradeID}`">订单详情</router-link>
              <br/>
              <router-link :to="`/goodsDetail/${item.itemID}`">再次购买</router-link>
            </div>
            <!-- 未付款 -->
            <div v-if="order.curStatus===1&&order.refundStatus==1">
              <router-link :to="`/submitOrder/${order.tradeID}`" class="el-button el-button--primary el-button--mini">立即付款</router-link>
              <br/>
              <router-link :to="`/orderDetail/${order.tradeID}`">订单详情</router-link><br/>
              <a href="javascript:;" @click="cancelOrder(order.tradeID)">取消订单</a>
            </div>
            <!-- 已付款（已支付） -->
            <div v-if="order.curStatus===2&&order.refundStatus==1">
              <span>等待发货</span><br/>
              <div v-if="showBtn(order.tradeOrderList)===2"><router-link :to="`/logistics/${order.tradeID}`">查看物流</router-link><br/></div>
              <router-link :to="`/orderDetail/${order.tradeID}`">订单详情</router-link>
            </div>
            <!-- 已发货（已支付） -->
            <div v-if="order.curStatus===3&&order.refundStatus==1">
              <!-- <span class="time"><i class="el-icon-time"></i>还剩<i>5</i>天<i>20</i>时</span><br/> -->
              <a href="javascript:;" class="el-button el-button--primary el-button--mini" @click="confirmOrder(order.tradeID)">确认收货</a><br/>
              <router-link :to="`/orderDetail/${order.tradeID}`">订单详情</router-link>
              <br/>
              <router-link :to="`/logistics/${order.tradeID}`">物流信息</router-link>
            </div>
            <!-- 已收货（已支付） -->
            <div v-if="order.curStatus===4&&order.refundStatus==1">
              <router-link :to="`/discussGoods/${order.tradeID}`" class="el-button el-button--primary el-button--mini">评论商品
              </router-link>
              <br/>
              <span class="c_454545">交易成功</span><br/>
              <router-link :to="`/orderDetail/${order.tradeID}`">订单详情</router-link>
            </div>
            <!-- 已评论（订单完成） -->
            <div v-if="order.curStatus===5&&order.refundStatus==1">
              <span class="c_454545">交易成功</span><br/>
              <router-link :to="`/orderDetail/${order.tradeID}`">订单详情</router-link>
              <br/>
              <span class="c_868686">买家已评</span>
            </div>
            <div v-if="order.refundStatus==3">
              <span class="c_868686">交易关闭</span><br/>
              <router-link :to="`/orderDetail/${order.tradeID}`">订单详情</router-link>
            </div>
            <div v-if="order.refundStatus==2">
              <span class="c_868686">售后进行中</span><br/>
              <router-link :to="`/orderDetail/${order.tradeID}`">订单详情</router-link>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </el-checkbox-group>
    <el-pagination background layout="prev, pager, next" :total="page.totalCount" :page-size="siezPage" prev-text="上一页"
                   next-text="下一页" @current-change="getOrderList"
                   v-if="page.totalCount/siezPage>1"></el-pagination>
  </div>
</template>

<script>
  import ShopTitle from 'base/Shop/ShopTitle'
  import NoData from 'base/NoData.vue'
  import img from 'images/order_nodata.jpg'
  import {getUrlDomain,getOrderStatus,showBtn,afterSaleStatus} from 'common/js/util'
  import {getOrderList,cancelOrder,confirmOrder,deleteOrder} from 'common/js/httpAll'

  export default {
    data() {
      return {
        orderStatus: '-1',
        orderList: [],
        selectIDs: [],
        siezPage: 8,
        page: {},
        imgUrl:img,
        urlPath:getUrlDomain().urlPath
      }
    },
    mounted() {
      this.$store.commit('updateActiveTab', '1')
      this.getOrderList(1)
    },
    methods: {
      showBtn(itemList){
        return showBtn(itemList)
      },
      isDelete(orderS,orderList){
        var isDelete=false,i=0
        if(getOrderStatus(orderS)===0||getOrderStatus(orderS)===10){
          isDelete=true
        }else{
          if(getOrderStatus(orderS)===5){
            orderList.forEach((item)=>{
              if(item.status==0||item.status==4||item.status==6){
                i++
              }
            })
          }else{
            orderList.forEach((item)=>{
              if(item.status==4||item.status==6){
                i++
              }
            })
          }
          if(i==orderList.length){
            isDelete=true
          }
        }
        return isDelete
      },
      getOrderList(a) {
        var orderS=null;
        if(this.orderStatus!=-1){
          orderS=this.orderStatus
        }
        getOrderList({
          from:(a - 1) * this.siezPage,
          limit:this.siezPage,
          tradeStatus:orderS,
          successFn:function(data){
            this.orderList = data.tradeList
            this.orderList.forEach((item)=>{
              item.curStatus=getOrderStatus(item.tradeStatus)
              item.refundStatus=afterSaleStatus(item.tradeOrderList)
            })
            this.page = data.page
          }.bind(this)
        })
      },
      //取消订单
      cancelOrder(tradeID) {
        cancelOrder(this,tradeID,function(data){
          this.getOrderList(this.page.pageNo)
        }.bind(this))
      },
      // 确认收货
      confirmOrder(tradeID){
        confirmOrder(this,tradeID,function(data){
          this.getOrderList(this.page.pageNo)
        }.bind(this))
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
  .shopcart {
    &-th {
      font-size: $font-x
      line-height: 0
      margin-top: 20px
      .th-op {
        line-height: 22px
      }
      a {
        color: $size-color2
        margin-left: 20px
      }
    }
  }

  .table {
    &:first-child {
      margin-top: 20px
    }
  }
</style>

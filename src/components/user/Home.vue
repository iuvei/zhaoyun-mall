<template>
  <div class="user-cont">
    <div class="cloud-gold">
      <div class="left">
        <p class="text">彩云钱包余额：<em>{{balance}}</em></p>
      </div>
      <div class="right">
        <router-link to="/user/recharge" class="el-button el-button--primary">充值</router-link>
        <div class="deposit">
          <el-tooltip effect="dark" content="尊敬的用户您好，关于余额提现功能，目前公司技术部正在加班加点开发完善，敬请谅解，非常感谢您对兆云电商的关注，谢谢！" placement="bottom">
            <!-- <router-link to="/user/deposit" class="el-button el-button--mini">提现</router-link> -->
            <el-button>提现</el-button>
          </el-tooltip>
          <i class="icon-question"></i>
        </div>
      </div>
    </div>
    <shop-title title="未完成的订单">
      <router-link to="/user/orderlist" class="more">查看更多>></router-link>
    </shop-title>
    <div v-loading="mainLoading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <table class="table" v-if="tradeOrderList.length===0">
        <tr class="table-nodata">
          <td>暂无未完成订单</td>
        </tr>
      </table>
      <table class="table table-12" v-for="order in tradeOrderList" :key="order.tradeID" v-else>
        <colgroup>
          <col width="20">
          <col width="316">
          <col width="142">
          <col width="100">
          <col width="142">
          <col width="100">
        </colgroup>
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
            <!-- 未付款 -->
            <div v-if="order.curStatus===1&&order.refundStatus==1">
              <router-link :to="`/submitOrder/${order.tradeID}`" class="el-button el-button--primary el-button--mini">
                立即付款
              </router-link>
              <br/>
              <a href="javascript:;" @click="cancelOrder(order.tradeID)">取消订单</a>
            </div>
            <!-- 已付款 -->
            <div v-if="order.curStatus===2&&order.refundStatus==1">
              <span>等待发货</span><br/>
              <router-link :to="`/logistics/${order.tradeID}`" v-if="showBtn(order.tradeOrderList)===2">查看物流</router-link>
            </div>
            <!-- 已发货 -->
            <div v-if="order.curStatus===3&&order.refundStatus==1">
              <!-- <span class="time"><i class="el-icon-time"></i>还剩<i>5</i>天<i>20</i>时</span><br/> -->
              <a href="javascript:;" class="el-button el-button--primary el-button--mini" @click="confirmOrder(order.tradeID)">确认收货</a>
              <br/>
              <router-link class="el-button el-button--mini" :to="`/logistics/${order.tradeID}`">物流信息</router-link>
            </div>
            <!-- 未评论 -->
            <div v-if="order.curStatus===4&&order.refundStatus==1">
              <router-link :to="`/discussGoods/${order.tradeID}`" class="el-button el-button--primary el-button--mini">评论商品
              </router-link>
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
    </div>

    <shop-title title="我的收藏" style="margin-top:20px">
      <router-link to="/user/collectList" class="more">查看更多>></router-link>
    </shop-title>
    <table class="table" v-if="favouriteList.length===0">
      <tr class="table-nodata">
        <td>暂未收藏数据</td>
      </tr>
    </table>
    <!-- 显示9条 -->
    <ul class="goods-list user-goods-list" v-if="favouriteList.length>0">
      <li class="item2" :class="{'item-dingjin':!!item.skuList[0].earnestPrice}" v-for="(item,index) in favouriteList" :key="index">
        <a href="javascript:;" class="delete" @click="cancelFavourite(item.itemID)"><i class="icon-delete"></i></a>
        <router-link :to="`/goodsDetail/${item.itemID}`">
          <div class="img">
            <img v-lazy="urlPath+item.picUrl" :alt="item.itemName" width="256" height="256">
            <div class="earnest" v-if="!!item.skuList[0].earnestPrice">
              <span class="icon"></span>
              <em>{{item.skuList[0].earnestPrice|toFixed(2)}}</em>
            </div>
          </div>
          <div class="info">
            <p class="title" :title="item.itemName">{{item.itemName}}</p>
            <p class="price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import ShopTitle from 'base/Shop/ShopTitle'
  import {getUrlDomain,getOrderStatus,showBtn,afterSaleStatus} from 'common/js/util'
  import {getCollectList,cancelCollect,getOrderList,cancelOrder} from 'common/js/httpAll'
  import {mapState,mapActions} from 'vuex'

  export default {
    data() {
      return {
        tradeOrderList: [],
        favouriteList: {},
        mainLoading: false,
        urlPath:getUrlDomain().urlPath
      }
    },
    components: {
      ShopTitle
    },
    mounted() {
      this.getTradeOrderList()
      this.getFavouriteList()
      this.SETBalance()
    },
    computed:{
      ...mapState(['balance'])
    },
    methods: {
      ...mapActions(['SETBalance']),
      showBtn(itemList){
        return showBtn(itemList)
      },
      getOrderStatus(orderS,payS){
        return getOrderStatus(orderS,payS)
      },
      //未完成订单
      getTradeOrderList() {
        getOrderList({
          limit:2,
          tradeStatus:'1,2,3,4',
          successFn:function(data){
            this.tradeOrderList = data.tradeList
            this.tradeOrderList.forEach((item)=>{
              item.curStatus=getOrderStatus(item.tradeStatus)
              item.refundStatus=afterSaleStatus(item.tradeOrderList)
            })
          }.bind(this)
        })
      },
      //取消订单
      cancelOrder(tradeID) {
        cancelOrder(this,tradeID,function(data){
          this.getTradeOrderList()
        }.bind(this))
      },
      // 确认收货
      confirmOrder(tradeID){
        confirmOrder(tradeID,function(data){
          this.getTradeOrderList()
        }.bind(this))
      },
      //获取收藏列表
      getFavouriteList() {
        getCollectList({
          limit:9,
          successFn:function(data){
            this.favouriteList = data.favList
          }.bind(this)
        })
      },
      //取消收藏
      cancelFavourite(itemID) {
        cancelCollect(this,itemID,function(data){
          this.getFavouriteList()
        }.bind(this))
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/goodslist.styl"
  @import "~common/stylus/table.styl"
  .user-cont {
    .cloud-gold {
      width: 100%
      margin-bottom: 20px
      padding: 42px 20px 36px
      background: url('~images/bg.jpg') repeat-x top left
      border: 1px solid $border-color
      display: flex
      justify-content: space-between
      .left {
        line-height: 40px
        .text {
          font-size: $font-s
          color: $size-color2
          em{
            font-style:normal
            color:$num-color
            font-size:32px
          }
        }
      }
      .right {
        display: flex
        align-items: flex-start
        .deposit {
          margin-left:20px
        }
        .el-button{
          width:120px
        }
        .icon-question {
          cursor: pointer
          color: $size-color3
          font-size: $font-m
          display: inline-block
        }
      }
    }
    .table{
      margin-top:10px
      &-td{
        border-top:1px solid $border-color
      }
    }
    .user-goods-list{
      margin-top:20px
      .item2{
        width:260px
        height:360px
      }
      .img{
        width:260px
        height:260px
      }
    }
  }
</style>
<style lang="stylus">
  .el-tooltip__popper.is-dark{
    max-width:200px
    line-height:20px
  }
</style>


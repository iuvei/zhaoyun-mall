<template>
  <div class="container orderDetail">
    <div class="order-detail">
      <div class="order-status">
        <i class="el-icon-circle-check"></i>
        <span style="font-weight:bold;font-size:22px">您已成功付款</span>
      </div>
      <ul class="order-info order-info2">
        <li>付款金额：{{orderDetail.payment}}</li>
        <li>订单号：{{orderDetail.tradeNo}}</li>
        <li>支付方式：余额支付</li>
      </ul>
      <p class="order-op"><i class="icon-dingpao"></i>订单正在处理中，发货后商城会为您更新物流信息及物流联系方式，如有需要，请自行联系物流公司</p>
      <div class="order-btns">
        <router-link to="/user/orderlist">查看已买到的宝贝</router-link>
        |
        <router-link :to="`/orderdetail/${orderDetail.tradeID}`">查看订单详情</router-link>
        |
        <router-link to="/">回到首页</router-link>
      </div>
    </div>
    <!-- 推荐商品 -->
    <recommend-goods></recommend-goods>
  </div>
</template>

<script>
  import RecommendGoods from 'base/Shop/RecommendGoods'
  import {orderDetail} from 'common/js/httpAll'

  export default {
    data(){
      return {
        orderDetail:{}
      }
    },
    mounted() {
      this.getOrderDetail()
    },
    methods: {
      getOrderDetail() {
        orderDetail(this.$route.params.orderid, function (data) {
          if(data.trade.tradeStatus!==2){
            this.$router.push({path:`/orderDetail/${data.trade.tradeID}`})
          }else{
            this.orderDetail = data.trade
          }
        }.bind(this))
      }
    },
    components:{
      RecommendGoods
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  
  .orderDetail {
    .order {
      &-detail {
        margin-top: 50px
        background-color: #f8f8f8
        color: $size-color3
        padding: 40px 90px 20px 170px
      }
      &-status {
        position: relative
        line-height: 40px
        font-size: $font-m
        color: $size-color2
        margin-bottom: 16px
        .c_868686 {
          color: $size-color3
        }
        .el-icon-warning {
          position: absolute
          left: -54px
          top: 0
          font-size: 40px
          color: $main-color
        }
        .el-icon-circle-check{
          position: absolute
          left: -54px
          top: 0
          font-size: 40px
          color: #519fa2
        }
        em {
          font-style: normal
          color: $main-color
          margin: 0 4px
        }
      }
      &-info {
        font-size: $font-s
        line-height: 30px
        display: flex
        flex-wrap: wrap
        padding-bottom: 30px
        li {
          width: 50%
          position: relative
          padding-left: 18px
          &:before {
            content: ''
            position: absolute
            width: 8px
            height: 8px
            background-color: #dadada
            border-radius: 50%
            left: 0
            top: 11px
          }
        }
      }
      &-info2 {
        li {
          width: 100%
        }
      }
      &-btns {
        font-size: $font-s
        color: $size-color2
        margin-bottom: 24px
        a {
          color: $size-color2
          padding: 0 20px
          &:hover {
            color: $hover-color
          }
          &.c_af7b7a {
            color: #af7b7a
          }
        }
      }
      &-op{
        line-height:28px
        border:1px dashed $main-color
        color:$main-color
        font-size:$font-s
        background-color:#f5f2f2
        padding:0 20px
        margin-bottom:30px
        i{
          margin-right:5px
          font-size:$font-m
          vertical-align:-3px
        }
      }
    }
  }

</style>

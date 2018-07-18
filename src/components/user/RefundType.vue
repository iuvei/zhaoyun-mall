<template>
  <div class="container refund refundType">
    <shop-title title="选择退款服务类型"></shop-title>

      <ul>
        <li class="refund-goods" v-for="item in detailList.tradeOrderList" :key="item.tradeID" v-if="!orderid||(orderid&&orderid==item.orderID)">
          <img v-lazy="urlPath+item.picUrl">
          <div class="info">
            <p class="title">{{item.itemName}}</p>
            <p class="sku">规格：{{item.skuName}}</p>
          </div>
        </li>
      </ul>

    <div class="refund-type">
      <a href="javascript:;" @click="handleClick(1)">
        <i class="icon icon1"></i>
        <div class="info">
          <p class="text">仅退款</p>
          <p class="desc">未收到货（含未签收）</p>
        </div>
      </a>
      <a href="javascript:;" @click="handleClick(0)">
        <i class="icon icon2"></i>
        <div class="info">
          <p class="text">退货退款</p>
          <p class="desc">已收到货，需要退货</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
  import {orderDetail} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'
  import ShopTitle from 'base/Shop/ShopTitle'

  export default {
    data(){
      return{
        orderid:this.$route.query.orderid,
        detailList:{},
        urlPath:getUrlDomain().urlPath
      }
    },
    mounted(){
      this.orderDetail()
    },
    methods: {
      orderDetail(){
        orderDetail(this.$route.params.orderid,function(data){
          this.detailList = data.trade
        }.bind(this))
      },
      handleClick(returnType){
        if(this.orderid){
          this.$router.push({path:`/refundGoods/${this.detailList.tradeID}/?returnType=${returnType}&orderid=${this.orderid}`})
        }else{
          this.$router.push({path:`/refundGoods/${this.detailList.tradeID}/?returnType=${returnType}`})
        }
      }
    },
    components: {
      ShopTitle
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/refund.styl'
  .refundType {
    margin-top: 40px
    background-color:#fff
    .refund-goods {
      padding: 30px 50px
    }
    .refund-type {
      display: flex
      padding: 80px 100px 86px
      justify-content: space-between
      background: url('~images/bg.jpg') repeat-x top left
      a {
        border: 1px solid $border-color
        width: 350px
        height: 100px
        display: flex
        align-items: center
        justify-content: center
        &:hover {
          border-color: $main-color
        }
      }
      .icon {
        width: 48px
        height: 48px
        margin-right: 20px
        background-position: left center
        background-repeat: no-repeat
      }
      .icon1 {
        background-image: url('~images/refund1.png')
      }
      .icon2 {
        background-image: url('~images/refund2.png')
      }
      .text {
        font-size: $font-xl
        color: $size-color
      }
      .desc {
        font-size: $font-s
        color: $size-color3
        margin-top: 10px
      }
    }
  }
</style>

<template>
  <div id="shopcart" style="padding-bottom:90px">
    <div class="container">
      <shop-step step="2"></shop-step>

      <!-- 提交订单 -->
      <div class="submit-order">
        <div class="order-info">
          <div class="status">
            <span class="el-icon-circle-check-outline"></span>
            <p>订单已提交<br/><i>应付</i><em>  &yen; {{trade.payment|toFixed(2)}}</em></p>
          </div>
          <p class="time">请您于1天内完成订单付款，逾期将取消订单</p>
        </div>

        <shop-title title="订单详情"></shop-title>
        <div class="order-detail">
          <p>订单编号：{{trade.tradeNo}}</p>
          <p>收货地址：{{trade.province}} {{trade.city}} {{trade.district}} {{trade.address}}</p>
        </div>

        <shop-title title="选择支付方式"></shop-title>
        <ul class="order-paylist">
          <li v-for="(item,index) in payList" @click="curPay=item.type" :class="[{on:curPay===item.type}]"><i class="pay_icon" :class="['pay_icon'+(index+1)]"></i>{{item.name}}</li>
        </ul>
        <div class="order-btn">
          <router-link :to="'/payorder/'+tradeID+'/paytype/'+curPay" class="el-button el-button--primary" tag="button" type="button">立即付款</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ShopStep from 'base/Shop/ShopStep'
  import ShopTitle from 'base/Shop/ShopTitle'
  import {orderDetail,$http,$httpSign} from 'common/js/httpAll'
  // import {countDownTime} from 'common/js/util'

  export default {
    data() {
      return {
        time:'',
        curPay:0,
        tradeID:this.$route.params.orderid,
        trade:{},
        payList:[],
      }
    },
    components:{
      ShopStep,
      ShopTitle
    },
    mounted(){
      this.tradeDetail()
      this.tradeType()
    },
    methods:{
      tradeDetail(){
        orderDetail(this.tradeID,function(data){
          var _this=this
          _this.trade=data.trade
          // var endTime=_this.trade.createTime+24*60*60*1000
          // var timer=setInterval(()=>{
          //   _this.time=countDownTime(_this.trade.createTime,endTime)
          //   if(new Date().getTime()>=endTime){
          //     clearInterval(timer)
          //     $httpSign({
          //       url: '/trade/cancel',
          //       method: 'post',
          //       params: {
          //         tradeID:_this.tradeID
          //       },
          //       success:function(data){
          //         _this.$router.push({path:`/orderDetail/${_this.tradeID}`})
          //       }
          //     })
          //   }
          // },1000)
        }.bind(this))
      },
      tradeType(){
        $httpSign({
          url:'/trade/pay/list',
          success:function(data){
            this.payList=data.aviablePayList
          }.bind(this)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  .submit-order{
    .order{
      &-info{
        .el-icon-circle-check-outline{
          margin-right:16px
          font-size:64px
          color:$hover-color
        }
        .time{
          text-align:center
          font-size:$font-s
          color:$size-color3
          margin-top:28px
          em{
            color:$num-color
            font-style:normal
            margin:0 4px
          }
        }
      }
      &-btn{
        .el-button{
          height:50px
          width:200px
          border-radius:0
        }
      }
    }
  }
</style>
<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .submit-order{
    .order{
      &-info{
        height:220px
        padding-top:50px
        .status{
          display:flex
          justify-content:center
          color:$size-color2
          font-size:$font-l
          p{
            margin-top:12px
          }
          i,em{
            font-size:$font-s
            font-style:normal
            line-height:28px
          }
          em{
            color:$num-color
          }
        }
      }
      &-detail{
        padding:18px 0 28px 14px
        line-height:28px
        font-size:$font-s
        p{
          color:$size-color3
        }
      }
      &-paylist{
        padding:20px 0 40px 14px
        display:flex
        li{
          width:160px
          height:50px
          line-height:44px
          margin-right:20px
          text-align:center
          background-color:#e7e7e7
          border:2px solid #e7e7e7
          border-radius:25px
          color:$size-color3
          cursor:pointer
          &:hover,&.on{
            background-color:#fff
            border-color:$hover-color
          }
        }
        .pay_icon{
          display:inline-block
          width:24px
          height:24px
          vertical-align:top
          margin:10px 10px 0 0
          background-image:url('~images/pay_icon.png')
        }
        for i in 0 1 2 3 4{
          .pay_icon{i+1}{
            background-position:0 -24px*i
          }
        }
      }
      &-btn{
        height:50px
        background-color:#f7f7f7
        text-align:right
      }
    }
  }
</style>

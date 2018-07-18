<template>
  <div class="container orderDetail">
    <!-- 订单详情 -->
    <div class="order-detail">
      <!-- 已取消 -->
      <div v-if="orderDetail.tradeOrderList&&curStatus===0">
        <div class="order-status">
          <i class="el-icon-warning"></i>
          <span>订单状态：交易关闭</span>
        </div>
        <ul class="order-info order-info2">
          <li>订单号：{{orderDetail.tradeNo}}</li>
          <li>
            收货地址：{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}}{{orderDetail.address}}　{{orderDetail.receiver}}
            {{orderDetail.phone}}
          </li>
        </ul>
        <div class="order-btns">
          您还可以
          <router-link :to="`/goodsDetail/${orderDetail.tradeOrderList[0].itemID}`" class="c_af7b7a">重新购买</router-link>
          |
          <router-link to="/">回到首页</router-link>
        </div>
      </div>
      <!-- 未付款 -->
      <div v-else-if="curStatus===1&&orderDetail.refundStatus==1">
        <div class="order-status">
          <i class="el-icon-warning"></i>
          <span>订单状态：还有<span v-html="time"></span>完成订单付款（逾期取消）</span>
        </div>
        <ul class="order-info order-info2">
          <li>订单号：{{orderDetail.tradeNo}}</li>
          <li>
            收货地址：{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}}{{orderDetail.address}}　{{orderDetail.receiver}}
            {{orderDetail.phone}}
          </li>
        </ul>
        <div class="order-btns">
          您还可以
          <router-link :to="`/submitOrder/${orderDetail.tradeID}`" class="c_af7b7a">立即付款</router-link>
          |<a href="javascript:;" @click="cancelOrder(orderDetail.tradeID)">取消订单</a>|
          <router-link to="/">回到首页</router-link>
        </div>
      </div>
      <!-- 已付款（已支付） -->
      <div v-else-if="curStatus===2&&orderDetail.refundStatus==1">
        <div class="order-status">
          <i class="el-icon-warning"></i>
          <span>订单状态：{{showBtn(orderDetail.tradeOrderList)===2?'部分发货':'待发货'}}</span>
        </div>
        <ul class="order-info order-info2">
          <li>订单号：{{orderDetail.tradeNo}}</li>
          <li>
            收货地址：{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}}{{orderDetail.address}}　{{orderDetail.receiver}}
            {{orderDetail.phone}}
          </li>
        </ul>
        <div class="order-btns">
          您还可以
          <router-link to="/newitem/day" class="c_af7b7a">浏览其他产品</router-link>|
          <router-link :to="`/logistics/${orderDetail.tradeID}`" v-if="showBtn(orderDetail.tradeOrderList)===2">查看物流</router-link>
          <span v-if="showBtn(orderDetail.tradeOrderList)===2">|</span><router-link to="/">回到首页</router-link>
        </div>
      </div>
      <!-- 待收货（已支付） -->
      <div v-else-if="curStatus===3&&orderDetail.refundStatus==1">
        <div class="order-status">
          <i class="el-icon-warning"></i>
          <span>订单状态：还有<span v-html="time"></span>自动确认收货</span>
        </div>
        <ul class="order-info order-info2">
          <li>订单号：{{orderDetail.tradeNo}}</li>
          <li>
            收货地址：{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}}{{orderDetail.address}}　{{orderDetail.receiver}}
            {{orderDetail.phone}}
          </li>
        </ul>
        <div class="order-btns">
          您还可以
          <a href="javascript:;" @click="confirmOrder(orderDetail.tradeID)" class="c_af7b7a">确认收货</a>|<router-link :to="`/logistics/${orderDetail.tradeID}`">查看物流</router-link>|<router-link to="/">回到首页</router-link>
        </div>
      </div>
      <!-- 已收货（已支付） -->
      <div v-else-if="curStatus===4&&orderDetail.refundStatus==1">
        <div class="order-status">
          <i class="el-icon-circle-check"></i>
          <span>订单状态：交易完成</span>
        </div>
        <ul class="order-info order-info2">
          <li>订单号：{{orderDetail.tradeNo}}</li>
          <li>
            收货地址：{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}}{{orderDetail.address}}　{{orderDetail.receiver}}
            {{orderDetail.phone}}
          </li>
        </ul>
        <div class="order-btns">
          您还可以
          <router-link :to="`/discussGoods/${orderDetail.tradeID}`" class="c_af7b7a">评论</router-link>|<router-link to="/">回到首页</router-link>
        </div>
      </div>
      <!-- 完成（已评论） -->
      <div v-else-if="curStatus===5&&orderDetail.refundStatus==1">
        <div class="order-status">
          <i class="el-icon-circle-check"></i>
          <span>订单状态：交易完成</span>
        </div>
        <ul class="order-info order-info2">
          <li>订单号：{{orderDetail.tradeNo}}</li>
          <li>
            收货地址：{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}}{{orderDetail.address}}　{{orderDetail.receiver}}
            {{orderDetail.phone}}
          </li>
        </ul>
        <div class="order-btns">您还可以<router-link to="/">回到首页</router-link></div>
      </div>
      <!-- 售后完成（交易关闭） -->
      <div v-else-if="orderDetail.refundStatus==3">
        <div class="order-status">
          <i class="el-icon-circle-check"></i>
          <span>订单状态：交易关闭</span>
        </div>
        <ul class="order-info order-info2">
          <li>订单号：{{orderDetail.tradeNo}}</li>
          <li>
            收货地址：{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}}{{orderDetail.address}}　{{orderDetail.receiver}}
            {{orderDetail.phone}}
          </li>
        </ul>
        <div class="order-btns">您还可以<router-link to="/">回到首页</router-link></div>
      </div>
      <!-- 退款状态：售后进行中 -->
      <div v-else-if="orderDetail.refundStatus==2">
        <div class="order-status">
          <i class="el-icon-circle-check"></i>
          <span>退款状态：售后进行中</span>
        </div>
        <ul class="order-info order-info2">
          <li>订单号：{{orderDetail.tradeNo}}</li>
          <li>
            收货地址：{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}}{{orderDetail.address}}　{{orderDetail.receiver}}
            {{orderDetail.phone}}
          </li>
        </ul>
        <div class="order-btns">您还可以<router-link to="/">回到首页</router-link></div>
      </div>
      <div class="order-time">
        <span v-if="orderDetail.createTime">创建时间：{{orderDetail.createTime|time('yyyy-MM-dd hh:ss:mm')}}</span>
        <span v-if="orderDetail.payTime">付款时间：{{orderDetail.payTime|time('yyyy-MM-dd hh:ss:mm')}}</span>
        <span v-if="orderDetail. deliveryTime">发货时间：{{orderDetail. deliveryTime|time('yyyy-MM-dd hh:ss:mm')}}</span>
        <span v-if="orderDetail.finishTime">成交时间：{{orderDetail.finishTime|time('yyyy-MM-dd hh:ss:mm')}}</span>
      </div>
    </div>
    <div class="order-payinfo">
      <p>商品合计：<span>{{orderDetail.payment|toFixed(2)}}</span></p>
      <p>折扣优惠：<span>-0</span></p>
      <p>运费：<span>{{orderDetail.expressFee}}</span></p>
      <p class="total">应付金额：<em>{{orderDetail.payment|toFixed(2)}}</em></p>
    </div>
    <table class="table table-12">
      <thead>
      <tr class="table-th">
        <th width="10"></th>
        <th class="th-item" width="425">商品信息</th>
        <th class="th-sku">规格</th>
        <th class="th-amount">数量</th>
        <th class="th-sum">小计</th>
        <th class="th-op">状态</th>
      </tr>
      </thead>
      <tbody>
      <tr class="table-td" v-for="(item,index) in orderDetail.tradeOrderList" :key="item.orderID">
        <td></td>
        <td class="td-item td-item-110">
          <router-link class="item-pic" :to="`/goodsDetail/${item.itemID}`" :title="item.itemName">
            <img v-lazy="urlPath+item.picUrl" width="110" height="110">
          </router-link>
          <div class="item-info">
            <router-link :to="`/goodsDetail/${item.itemID}`">
              <h4 class="item-title" :title="item.itemName">{{item.itemName}}</h4>
            </router-link>
          </div>
        </td>
        <td class="td-sku">{{item.skuName}}</td>
        <td class="td-amount">{{item.skuCount}}</td>
        <td class="td-sum">
          <span class="total" v-if="!item.earnestPrice">{{item.vipPrice|toFixed(2)}}</span>
          <span class="total" v-if="!!item.earnestPrice">{{item.earnestPrice|toFixed(2)}}</span>
          <span class="icon" v-if="!!item.earnestPrice"></span>
        </td>
        <td class="td-op" v-if="index===0&&isMuti()" :rowspan="orderDetail.tradeOrderList.length" :class="{'td-muti':orderDetail.tradeOrderList.length>1}">
          <div v-if="curStatus===0">交易关闭</div>
          <div v-else-if="curStatus===1">
            <router-link :to="`/submitOrder/${orderDetail.tradeID}`"
                         class="el-button el-button--primary el-button--mini">立即付款
            </router-link>
          </div>
        </td>
        <td class="td-op" v-if="!isMuti()">
          <!-- 未发货或部分发货 -->
          <div v-if="curStatus===2&&(item.status===0||item.status===3||item.status===5)">
            <span v-if="item.shipStatus===1">已发货</span>
            <span v-if="item.shipStatus===0">未发货</span>
          </div>
          <span v-if="curStatus===5&&(item.status===0||item.status===3||item.status===5)">交易完成</span>
          <div v-if="item.status===4">
            <span>退款成功</span>
            <br/>
            <router-link :to="{path:`/refundGoods/${orderid}/?returnType=1&orderid=${item.orderID}`}" class="el-button el-button--mini" v-if>退款详情</router-link>
          </div>
          <div v-if="item.status===6">
            <span>退货成功</span>
            <br/>
            <router-link :to="{path:`/refundGoods/${orderid}/?returnType=0&orderid=${item.orderID}`}" class="el-button el-button--mini" v-if>退货详情</router-link>
          </div>
          <div v-if="item.status===5">退款失败</div>
          <div v-if="item.status===3">退货失败</div>
          <a href="javascript:;" class="el-button el-button--mini" v-if="saleStatus(item)===1&&showBtn([item])===0" @click="goAfterSale(item)">申请售后</a>
          <a href="javascript:;" class="el-button el-button--mini" v-else-if="saleStatus(item)===2&&showBtn([item])===0" @click="goAfterSale(item)">售后进度</a>
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="6" class="table-msg">
          买家留言<span>{{orderDetail.memo===null?'无':orderDetail.memo}}</span>
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
  import {countDownTime,getUrlDomain,getOrderStatus,showBtn,afterSaleStatus} from 'common/js/util'
  import {orderDetail, confirmOrder, cancelOrder, cancelTradeReturn} from 'common/js/httpAll'

  export default {
    data() {
      return {
        time: '',
        curStatus:0,
        orderDetail: {},
        urlPath:getUrlDomain().urlPath
      }
    },
    computed: {
      orderid() {
        return this.$route.params.orderid
      }
    },
    watch: {
      // 监听当前页面的orderid变化
      orderid: function (id) {
        this.getOrderDetail()
      }
    },
    mounted() {
      this.getOrderDetail()
    },
    methods: {
      showBtn(itemList){
        return showBtn(itemList)
      },
      // 0：未申请售后  1:申请售后
      goodsStatus(s){
        var status;
        switch (s){
          case 0:
          case 3:
          case 5:{
            status=0;
            break;
          }
          case 1:
          case 2:{
            status=1;
            break;
          }
        }
        return status;
      },
      // 1:申请售后 2:售后处理中
      saleStatus(item){
        var orderStatus;
        if(this.goodsStatus(item.status)===0){
          switch(this.curStatus){
            case 2:
            case 3:
            case 4:{
              orderStatus=1
              break
            }
          }
        }else if(this.goodsStatus(item.status)===1){
          orderStatus=2
        }
        return orderStatus
      },
      // 最后一列是否合并
      isMuti(){
        var a=false;
        switch(this.curStatus){
          case 0:
          case 1:{
            a=true
            break
          }
        }
        return a
      },
      //售后按钮
      goAfterSale(item) {
        if(this.goodsStatus(item.status)===1){
          this.$router.push(`/refundGoods/${this.orderid}/?returnType=${item.returnType}&orderid=${item.orderID}`)
        }else if(this.goodsStatus(item.status)===0){
          switch (this.curStatus){
            case 2:{
              if(item.shipStatus===1){// 已发货
                this.$router.push(`/refundType/${this.orderid}?orderid=${item.orderID}`)
              }else{// 未发货
                this.$router.push(`/refundGoods/${this.orderid}/?returnType=1&orderid=${item.orderID}`)
              }
              break
            }
            case 3:
            case 4:{
              this.$router.push(`/refundType/${this.orderid}?orderid=${item.orderID}`)
              break
            }
          } 
        }     
      },
      getOrderDetail() {
        orderDetail(this.orderid, function (data) {
          this.orderDetail = data.trade
          this.curStatus=getOrderStatus(this.orderDetail.tradeStatus)
          this.orderDetail.refundStatus=afterSaleStatus(this.orderDetail.tradeOrderList)
          // 给订单商品详情添加售后类型
          this.orderDetail.tradeOrderList.forEach((item)=>{
            item.returnType=null
            for(var i=0,len=this.orderDetail.tradeReturnList.length;i<len;i++){
              var returnItem=this.orderDetail.tradeReturnList[i]
              if(item.orderID===returnItem.tradeOrderID){
                item.returnType=returnItem.returnType
                break
              }
            }
          })

          var _this = this

          function times(startTime, endTime) {
            _this.time = countDownTime(startTime, endTime)
            let timer = setInterval(() => {
              _this.time = countDownTime(startTime, endTime)
              if (new Date().getTime() >= endTime) {
                clearInterval(timer)
                // 未付款
                if (this.curStatus===1) {
                  $httpSign({
                    url: '/trade/cancel',
                    method: 'post',
                    params: {
                      tradeID: _this.orderid
                    },
                    success: function (data) {
                      _this.$router.push({path: `/orderDetail/${_this.orderid}`})
                    }
                  })
                }
                // 已发货
                if (this.curStatus===3) {
                  _this.$router.push({path: `/orderDetail/${_this.orderid}`})
                }
              }

            }, 1000)
          }

          // 待付款
          if (this.curStatus===1) {
            times(this.orderDetail.createTime, this.orderDetail.createTime + 24 * 60 * 60 * 1000)
          }
          // 已发货
          if (this.curStatus===3) {
            times(this.orderDetail.createTime, this.orderDetail.createTime + 15 * 24 * 60 * 60 * 1000)
          }
        }.bind(this))
      },
      //取消订单
      cancelOrder(tradeID) {
        cancelOrder(this, tradeID, function (data) {
          this.getOrderDetail()
        }.bind(this))
      },
      // 确认收货
      confirmOrder(tradeID) {
        confirmOrder(this, tradeID, function (data) {
          this.getOrderDetail()
        }.bind(this))
      },
      // 取消退款 退货退款操作
      cancelTradeReturn(returnID, tradeID, tradeOrderID) {
        let params = {returnID: returnID, tradeID: tradeID, tradeOrderID: tradeOrderID}
        cancelTradeReturn(this, params, function (data) {
          this.getOrderDetail()
        }.bind(this))
      },
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/table.styl"
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
      &-time {
        padding: 16px 0
        display: flex
        flex-wrap: wrap
        margin-left: -24px
        position: relative
        &:before {
          content: ''
          position: absolute
          left: 0
          right: 0
          top: 0
          border-top: 1px dashed $border-color
        }
        span {
          font-size: $font-x
          line-height: 24px
          margin-left: 24px
        }
      }
      &-payinfo{
        margin:1px 0 0 0
      }
    }
    .table {
      margin: 30px 0 50px
      &-td {
        &:last-child {
          td {
            border-bottom: none
          }
        }
      }
    }
  }

</style>

<template>
  <div id="shopcart" style="padding-bottom:90px">
    <div class="container">
      <shop-step step="2"></shop-step>
      <address-list></address-list>
      <table class="table table-12">
        <thead>
          <tr class="table-th">
            <th class="th-item" width="390">商品信息</th>
            <th class="th-sku">规格</th>
            <th class="th-price">单价</th>
            <th class="th-amount">数量</th>
            <th class="th-sum">小计</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-td" v-for="(item,index) in ConfirList" :key="index">
            <td class="td-item td-item-110">
              <router-link class="item-pic" :to="`/goodsDetail/${item.itemID}`">
                <img v-lazy="urlPath+item.picUrl" :alt="item.itemName" width="110" height="110">
              </router-link>
              <router-link class="item-info" :to="`/goodsDetail/${item.itemID}`">
                <h4 class="item-title" :title="item.itemName">{{item.itemName}}</h4>
              </router-link>
            </td>
            <td class="td-sku">
              <p>{{item.skuName0}}</p>
              <p>{{item.skuName1}}</p>
            </td>
            <td class="td-price">
              <span class="price-vip">VIP价：{{item.vipPrice|toFixed(2)}}</span><br/>
              <span class="price-deposit" v-if="!!item.earnestPrice">定金：{{item.earnestPrice|toFixed(2)}}</span>
            </td>
            <td class="td-amount">{{item.skuAcount}}</td>
            <td class="td-sum">
              <span class="total">{{(item.skuAcount*(item.earnestPrice===0?item.vipPrice:item.earnestPrice))|toFixed(2)}}</span><span class="icon" v-if="!!item.earnestPrice"></span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="table-msg">
              <i class="el-icon-plus"></i> 买家留言
              <input type="text" v-model="msg" class="msg">
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="order-payinfo">
        <p>商品合计：<span>{{allPrice|toFixed(2)}}</span></p>
        <p>折扣优惠：<span>-0</span></p>
        <p>运费：<span>0</span></p>
        <p class="total">应付金额：<em>{{allPrice|toFixed(2)}}</em></p>
      </div>
      <div class="shopcart-btns">
        <el-button type="primary" @click="payEvent">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import AddressList from 'base/Address'
  import ShopStep from 'base/Shop/ShopStep'
  import ShopTitle from 'base/Shop/ShopTitle'
  import {mapGetters,mapActions} from 'vuex'
  import {$httpSign} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data() {
      return {
        msg: '',
        sign:localStorage.getItem('sign'),
        allPrice: 0,
        ConfirList: [],
        urlPath:getUrlDomain().urlPath
      }
    },
    computed: {
      ...mapGetters(['selectAddr'])
    },
    components: {
      AddressList,
      ShopStep,
      ShopTitle
    },
    mounted() {
      this.getConfirList()
    },
    methods: {
      //计算总价格
      calcAllPrice(allCoods) {
        for (let i = 0; i < allCoods.length; i++) {
          var item=allCoods[i]
          this.allPrice += (item.skuAcount * (item.earnestPrice===0?item.vipPrice:item.earnestPrice))
        }
      },
      getConfirList() {
        if(this.$route.query.skuID){//从详情页面来
          $httpSign({
            url:'/item/toGoBuy',
            params: this.$route.query,
            success:function(data){
              this.ConfirList = data.shopCartItem
              this.calcAllPrice(data.shopCartItem)
            }.bind(this)
          })
        }else {//获得待结算商品从购物车来
          $httpSign({
            url:'/cart/list',
            params: {
              cartIDs: this.$route.query.itemIDs.replace(/-/g,','),
              status: 1
            },
            success:function(data){
              this.ConfirList = data.shopCartList
              this.calcAllPrice(data.shopCartList)
            }.bind(this)
          })
        }
      },
      payEvent() {
        let orders = []
        this.ConfirList.forEach((item) => {
          orders.push({
            num: item.skuAcount,
            skuID: item.skuID
          })
        })

        $httpSign({
          url:'/trade/add',
          method:'post',
          data:{
            delivery: new Date(),
            fromCart: this.$route.query.skuID?false:true,
            invoice: 0,
            invoiceTitle: '',
            logistics: 0,
            orders,
            receiver: {
              address: this.selectAddr.address,
              receiver: this.selectAddr.name,
              city: this.selectAddr.city,
              district: this.selectAddr.district,
              mobile: this.selectAddr.phone,
              postcode: '',
              state: this.selectAddr.province
            },
            remark: this.msg
          },
          success:function(data){
            this.$router.push({path: '/submitorder/' + data.trade.tradeID})
            this.SETCartNum()
          }.bind(this),
          error:function(err){
            this.$message({
              type:"error",
              duration:8000,
              message:err
            })
          }.bind(this)
        })
      },
      ...mapActions(['SETCartNum'])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/table.styl"
  .table{
    &-td{
      &:last-child td{
        border-bottom:none
      }
    }
  }

  .order-payinfo {
    margin: 20px 0 10px
  }

  .shopcart-btns{
    text-align: right
  }

</style>

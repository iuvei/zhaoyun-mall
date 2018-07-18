<template>
  <div id="shopcart" style="padding-bottom:90px">
    <div class="container" ref="shopcarts">
      <shop-step step="1"></shop-step>

      <!-- 购物车 -->
      <no-data v-if="shopCartList1.length===0&&shopCartList2.length===0" :imgUrl="imgUrl" :desc="'购物车空空如也~'">
        <p class="op1"><router-link to="/">去购物>></router-link>，看看有没有喜欢的</p>
      </no-data>
      <div v-else class="shopcart table table-14">
        <ul class="table-th">
          <li class="th-chk">
            <el-checkbox v-model="shopcartCheckAll" @change="selectAllGoods" label="all">全选</el-checkbox>
          </li>
          <li class="th-info">商品信息</li>
          <li class="th-price">单价</li>
          <li class="th-amount">数量</li>
          <li class="th-sum">小计</li>
          <li class="th-op">操作</li>
        </ul>
        <el-checkbox-group v-if="shopCartList1.length!==0" v-model="selectIDs">
          <ul class="table-td" v-for="item in shopCartList1" :key="item.shoppingCartID">
            <li class="td-chk">
              <el-checkbox :label="item.shoppingCartID" :key="item.shoppingCartID"
                           @change="selectGoods(item.skuAcount*(item.earnestPrice===0?item.vipPrice:item.earnestPrice))">&nbsp;
              </el-checkbox>
            </li>
            <li class="td-item td-item-110">
              <div class="item-pic">
                <router-link :to="'/goodsdetail/'+item.itemID">
                  <img v-lazy="urlPath+item.picUrl" :alt="item.itemName" :title="item.itemName" width="110" height="110">
                </router-link>
              </div>
              <div class="item-info">
                <router-link :to="'/goodsdetail/'+item.itemID" class="item-title" :title="item.itemName">
                  {{item.itemName}}
                </router-link>
                <div class="item-sku">
                  <span>{{item.skuName}}
                    <!-- &nbsp;&nbsp;<i class="el-icon-arrow-down"></i> -->
                  </span>
                  <div class="sku-box">
                    <div class="sku-items">
                      <span class="sku-text">型号：</span>
                      <div class="sku-item">
                        <el-button plain size="mini" class="on">豪华型</el-button>
                        <el-button plain size="mini">运动型</el-button>
                        <el-button plain size="mini">享乐型</el-button>
                        <el-button plain size="mini">享乐型</el-button>
                      </div>
                    </div>
                    <div class="sku-items">
                      <span class="sku-text">型号2：</span>
                      <div class="sku-item">
                        <el-button plain size="mini" class="on">豪华型</el-button>
                        <el-button plain size="mini">运动型</el-button>
                        <el-button plain size="mini">享乐型</el-button>
                        <el-button plain size="mini">享乐型</el-button>
                      </div>
                    </div>
                    <div class="sku-btns">
                      <el-button type="primary">确定</el-button>
                      <el-button>取消</el-button>
                    </div>
                  </div>
                </div>
                <!-- <div class="item-discount">
                  <i class="zhe"></i>
                  <i class="jiang"></i>
                  <i class="you"></i>
                </div> -->
              </div>
            </li>
            <li class="td-price">
              <span>VIP价：{{item.vipPrice|toFixed(2)}}</span><br/>
              <span v-if="!!item.earnestPrice">定金：{{item.earnestPrice|toFixed(2)}}</span>
            </li>
            <li class="td-amount">
              <el-input-number :min="1"
                               @change="handNumChange($event,item.skuAcount,item.earnestPrice===0?item.vipPrice:item.earnestPrice,item.shoppingCartID)"
                               v-model="item.skuAcount"></el-input-number>
            </li>
            <li class="td-sum">
              <span class="total">{{(item.skuAcount*(item.earnestPrice===0?item.vipPrice:item.earnestPrice))|toFixed(2)}}<i class="icon" v-if="!!item.earnestPrice"></i></span>
            </li>
            <li class="td-op">
              <!-- <a href="javascript:;" title="收藏商品" style="margin-right:20px" @click="favouriteGoods(item.itemID)"><i
                class="icon-star"></i></a> -->
              <a href="javascript:;" title="删除商品"
                 @click="deleteGoods(item.shoppingCartID,(item.skuAcount*(item.earnestPrice===0?item.vipPrice:item.earnestPrice)))"><i
                class="icon-delete"></i></a>
            </li>
          </ul>
        </el-checkbox-group>
        <ul class="table-td table-failure-td" v-for="item in shopCartList2" :key="item.shoppingCartID" v-if="shopCartList2.length!==0">
          <li class="td-chk">失效</li>
          <li class="td-item td-item-110">
            <div class="item-pic"><img v-lazy="urlPath+item.picUrl" width="110" height="110"></div>
            <div class="item-info">
              <h3 class="item-title">{{item.itemName}}</h3>
              <p class="item-sku">{{item.skuName}}</p>
            </div>
          </li>
          <li class="td-price">
            <span>VIP1:{{item.vipPrice|toFixed(2)}}</span><br/>
            <span v-if="!!item.earnestPrice">定金：{{item.earnestPrice|toFixed(2)}}</span>
          </li>
          <li class="td-amount">{{item.skuAcount}}</li>
          <li class="td-sum">
            <span>{{(item.skuAcount*(item.earnestPrice===0?item.vipPrice:item.earnestPrice))|toFixed(2)}}<i class="icon" v-if="!!item.earnestPrice"></i></span>
          </li>
          <li class="td-op">
            <a href="javascript:;" title="删除失效商品" @click="deleteFailureGoods(item.shoppingCartID)"><i class="icon-delete"></i></a>
          </li>
        </ul>
        <ul class="table-tfoot" :class="{'table-tfoot-fixed':fixedBtn}">

          <el-checkbox v-model="shopcartCheckAll" @change="selectAllGoods">全选({{selectNum}})</el-checkbox>
          <a href="javascript:;" title="批量删除" style="margin-right:20px" class="tfoot-icon" @click="deleteGoods(0)"><i
            class="icon-delete_all"></i></a>
          <a href="javascript:;" title="清除失效商品" class="tfoot-icon"><i class="icon-failure"
                                                                      @click="deleteFailureGoods(0)"></i></a>

          <div class="tfoot-right">
            <span class="total">商品合计：{{priceTotal|toFixed(2)}}</span>
            &nbsp;&nbsp;
            <span class="freight">运费：0</span>
            <span class="total2">合计：<em>{{priceTotal|toFixed(2)}}</em></span>
            <el-button type="primary" class="submit-btn" :disabled="selectNum===0" @click="submitEvent">结算</el-button>
          </div>
        </ul>
      </div>
      <!-- 推荐商品 -->
      <recommend-goods></recommend-goods>
    </div>
  </div>
</template>

<script>
  import ShopStep from 'base/Shop/ShopStep'
  import ShopTitle from 'base/Shop/ShopTitle'
  import NoData from 'base/NoData.vue'
  import RecommendGoods from 'base/Shop/RecommendGoods'
  import img from 'images/order_nodata.jpg'
  import {mapMutations, mapActions} from 'vuex'
  import {getUrlDomain} from 'common/js/util'
  import {$httpSign,$httpSign2,collectGoods} from 'common/js/httpAll'

  export default {
    data() {
      return {
        shopCartList1: [],   // 有效商品
        shopCartList2: [],	  // 失效商品
        shopcartCheckAll: false, // 是否全选
        allIDs: [],        // 购物车全部商品id
        failureIDs:[],     // 失效的商品id
        selectIDs: [],     // 选择的id
        selectNum: 0,      // 选择的商品数量
        fixedBtn: false,
        priceTotal: 0,
        Timer: null,
        indexNum: 0,
        imgUrl:img,
        urlPath:getUrlDomain().urlPath
      }
    },
    mounted() {
      this.$http.all([
        this.getGoodsList1(),
        this.getGoodsList2()]
      ).then(this.$http.spread((a,b)=>{
        if(a.data.code==='0'){
          this.shopCartList1=a.data.result.shopCartList
          this.getCartNum(this.shopCartList1.length)
          this.shopCartList1.forEach((item) => {
            this.allIDs.push(item.shoppingCartID)
          })

        }
        if(b.data.code==='0'){
          this.shopCartList2=b.data.result.shopCartList
          this.shopCartList2.forEach((item) => {
            this.failureIDs.push(item.shoppingCartID)
          })
        }
        if (this.shopCartList1.length + this.shopCartList2.length > 0) {
          this.$nextTick(() => {
            this.initScroll();
          })
        }
      }))
    },
    components: {
      RecommendGoods,
      ShopStep,
      ShopTitle,
      NoData
    },
    methods: {
      ...mapMutations(['getCartNum']),
      initScroll() {

        let wrap = this.$refs.shopcarts;
        let h = wrap.getElementsByClassName('shopcart-step')[0].clientHeight + wrap.getElementsByClassName('shopcart')[0].clientHeight + 122,
          clientH = document.documentElement.clientHeight;

        if (h > clientH) {
          this.fixedBtn = true
        }

        document.addEventListener('scroll', function () {
          if (document.documentElement.scrollTop + clientH >= h) {
            this.fixedBtn = false
          } else {
            this.fixedBtn = true
          }
        }.bind(this), false)

      },
      // 获取有效商品
      getGoodsList1() {
        return $httpSign2({
          url:'/cart/list',
          params:{
            cartIDs: 0,
            status: 1
          }
        })
      },
      getGoodsList2() {
        return $httpSign2({
          url:'/cart/list',
          params: {
            cartIDs: 0,
            status: 0
          }
        })
      },
      // 删除购物车商品
      deleteGoods(ids, price) {
        let cartIDs = ids === 0 ? this.selectIDs : [ids],
          msg = ids === 0 ? '确认要删除这些宝贝吗？' : '确认要删除该宝贝吗？'
        this.$confirm(msg, '删除宝贝', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {

          $httpSign({
            url:'/cart/delete',
            method:'post',
            params:{
              cartIDs: cartIDs.join(',')
            },
            success:function(data){
              // 删除成功后，数据清理
              let newCartIDs = cartIDs.concat()
              newCartIDs.forEach((id, Index) => {
                this.shopCartList1.forEach((item, index) => {
                  if (item.shoppingCartID === id) {
                    this.shopCartList1.splice(index, 1)
                    if (this.selectIDs.indexOf(id) !== -1 && this.selectIDs.length > 1) {
                      this.priceTotal -= price
                      this.selectNum--
                      this.selectIDs.splice(this.selectIDs.indexOf(id), 1)
                    } else if (this.selectIDs.indexOf(id) !== -1) {
                      this.priceTotal = 0
                      this.selectNum = 0
                      this.selectIDs = []
                    }
                    return
                  }
                })
              })
              this.SETCartNum()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }.bind(this)
          })
        }).catch(() => {
        });
      },
      // 收藏商品
      favouriteGoods(id) {
        collectGoods(this,id)
      },
      // 清除所有失效商品
      deleteFailureGoods(ids) {
        let cartIDs = []
        if(ids===0){
          this.shopCartList2.forEach((item) => {
            cartIDs.push(item.shoppingCartID)
          })
        }else{
          this.shopCartList2.forEach((item) => {
            if (item.shoppingCartID === ids) {
              cartIDs.push(item.shoppingCartID)
              return false
            }
          })
        }

        this.$confirm('确认要清除这些宝贝吗？', '清除宝贝', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          $httpSign({
            url:'/cart/delete',
            method:'post',
            params:{
              cartIDs: cartIDs.join(',')
            },
            success:function(data){
              if(ids===0){
                this.shopCartList2 = []
              }else{
                this.shopCartList2.forEach((item,index) => {
                  if (item.shoppingCartID === ids) {
                    this.shopCartList2.splice(index, 1)
                    return false
                  }
                })
              }
              this.$message({
                type: 'success',
                message: '清除成功'
              })
            }.bind(this)
          })
        }).catch(() => {
        });
      },
      // 选择所有商品
      selectAllGoods(val) {
        if (val) {
          this.priceTotal = 0
          for (let i = 0; i < this.shopCartList1.length; i++) {
            var item=this.shopCartList1[i]
            this.priceTotal += (item.skuAcount * (item.earnestPrice===0?item.vipPrice:item.earnestPrice))
          }
        } else {
          this.priceTotal = 0
        }
        this.selectIDs = val ? this.allIDs : []
        this.selectNum = val ? this.allIDs.length : 0
      },
      selectGoods(price) {
        if (this.selectIDs.length === 0) {
          this.selectNum = 0
          this.priceTotal = 0
        } else if (this.selectIDs.length > this.selectNum) {
          this.selectNum++
          this.priceTotal += price
        } else {
          this.selectNum--
          this.priceTotal -= price
        }
        this.shopcartCheckAll = this.shopCartList1.length === this.selectNum
      },
      // 监听加减号按钮
      handNumChange(newVal, oldVal, singlePrice, cartId) {
        this.indexNum=newVal-oldVal
        clearTimeout(this.Timer)
        let _this = this
        // 点击后0.3s提交防止点击过快请求堵塞
        this.Timer = setTimeout(() => {
          $httpSign({
            url:'/cart/update',
            method:'post',
            params:{
              cartID: cartId,
              num: newVal
            },
            success:function(data){
              if (_this.selectIDs.indexOf(cartId) !== -1 && oldVal < newVal) {
                _this.priceTotal += singlePrice * _this.indexNum
              } else if (_this.selectIDs.indexOf(cartId) !== -1 && oldVal > newVal) {
                _this.priceTotal += singlePrice * _this.indexNum
              }
              _this.indexNum = 0
            },
            error:function(err){
              _this.$message.error(err)
              _this.shopCartList1.forEach((item)=>{
                if(item.shoppingCartID===cartId){
                  item.skuAcount=oldVal
                }
              })
            }
          })
        }, 300)
      },
      submitEvent() {
        this.$router.push('/confirmorder?itemIDs='+this.selectIDs.join('-'))
      },
      ...mapActions(['SETCartNum'])
    }
  }
</script>
<style lang="stylus">
  .td-amount {
    .el-input-number {
      width: 80px
      line-height: 20px
      .el-input__inner {
        padding: 0 22px
        height: 22px
        line-height: 22px
        border-color: #fff
      }
      .el-icon-minus, .el-icon-plus {
        vertical-align: top
        line-height: 20px
      }
    }
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 20px
      height: 20px
      border-radius: 10px
      border: 1px solid #dadada
      background-color: #fff
      &:hover:not(.is-disabled) {
        border-color: #af7b7a
      }
    }

    .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
    .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
      border-color: #fff
    }
  }
</style>
<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/table.styl"

  .table{
    &-th {
      display:flex
      align-items:center
      text-align:center
      .th-chk {
        flex: 80
        padding-left: 14px
        text-align: left
      }
      .th-info {
        flex: 396
      }
      .th-price {
        flex: 180
      }
      .th-sum {
        flex: 150
      }
      .th-amount {
        flex: 164
      }
      .th-op {
        flex: 110
      }
    }
    &-td {
      display: flex
      text-align: center
      &:last-child {
        border-bottom: none
      }
      .td-chk {
        padding-left: 14px
        flex: 60
        text-align: left
        margin-top: 40px
      }
      .td-item {
        flex: 416
        .item-info {
          margin-top: 10px
        }
        .item-sku {
          margin: 10px 0
          cursor: pointer
          span {
            font-size: $font-x
            color: $size-color3
          }
          .el-icon-arrow-down {
            font-weight: bold
          }
          &:hover {
            .el-icon-arrow-down {
              color: $num-color
            }
          }
          .sku-box {
            display: none
            position: relative
            top: 10px
            left: -28px
            width: 420px
            padding: 40px 28px 18px
            background-color: #fff
            border: 1px solid rgba(123, 32, 32, .1)
            box-shadow: 0 0 8px rgba(123, 32, 32, .14)
            &:before {
              content: ""
              position: absolute
              width: 20px
              height: 16px
              top: -16px
              left: 50px
              background: url("~images/sku_bg.png")
            }
          }
          .sku-text {
            color: $size-color2
            line-height: 28px
            width: 60px
            text-align: right
            float: left
            margin-right: 10px
          }
          .sku-item {
            overflow: hidden
          }
          .sku-btns {
            text-align: center
            margin-top: 8px
            .el-button {
              width: 100px
            }
          }
          .el-button {
            margin: 0 14px 18px 0
            &.on {
              color: $hover-color
              border-color: $hover-color
            }
          }
        }
      }
      .td-price {
        flex: 180
        margin-top: 10px
      }
      .td-amount {
        flex: 150
        margin-top: 10px
      }
      .td-sum {
        flex: 164
        margin-top: 10px
      }
      .td-op {
        flex: 110
        margin-top: 10px
        i {
          font-size: $font-xl
          color: #dadada
        }
      }
    }
    &-tfoot {
      position: relative
      display: flex
      background-color: #f7f7f7
      height: 56px
      align-items: center
      margin-top:10px
      &>label,&>a{
        display:block
      }
      &-fixed {
        position: fixed
        bottom: 0
        width: 1080px
        z-index: 10
      }
      .el-checkbox {
        padding-left: 14px
        margin-right: 50px
      }
      .tfoot-icon {
        font-size: $font-xxl
        i {
          color: #dadada
        }
      }
      .tfoot-right {
        font-size: $font-x
        color: $size-color3
        position: absolute
        right: 0
        top:0
        .total2 {
          color: $size-color2
          margin: 0 30px
          em {
            color: $num-color
            font-size: $font-m
            font-style: normal
          }
        }
        .submit-btn {
          width: 180px
          height: 56px
          border-radius: 0
          font-size: $font-l
        }
      }
    }
  }
  .table-failure-td{
    background-color: #f7f7f7
    .td-chk, .td-item .item-title, .td-item .item-sku, .td-amount, .td-price, .td-sum {
      color: #c3c3c3
    }
  }
</style>

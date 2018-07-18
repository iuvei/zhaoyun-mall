<template>
  <div id="detail" class="detail container">
    <div class="goods-info">
      <div class="info-left">
        <div class="img-preview"><img v-lazy="urlPath+imgUrl" alt="商品图片" width="460" height="460"></div>
        <div class="img-thumb">
          <a href="javascript:;" class="img-thumb-left"></a>
          <div class="img-thumb-content">
            <ul class="img-thumb-lists">
              <li :class="{selected:index===imgIndex}" v-for="(img,index) in itemDetail.imgs">
                <img v-lazy="urlPath+img.url" alt="商品展示图片" width="72" height="72" @mouseover="imgIndex=index,imgUrl=img.url">
              </li>
            </ul>
          </div>
          <a href="javascript:;" class="img-thumb-right"></a>
        </div>
      </div>
      <div class="info-right">
        <h3 class="item-title">{{itemDetail.title}}</h3>
        <h4 class="item-subtitle">{{itemDetail.subTitle}}</h4>
        <div class="item-prices">
          <p><span class="sale_price">VIP价：{{price.vipPrice}}</span><span class="payment_price"
                                                                          v-if="!!price.earnestPrice">定金：{{price.earnestPrice|toFixed(2)}}</span>
          </p>
          <div class="prices">
            <span class="member_price">会员价：{{price.sale|toFixed(2)}}</span>
            <span class="market_price">&yen;{{price.markt|toFixed(2)}}</span>
          </div>
          <div class="service">
            服务：
            <span>&bull; 48小时快速退款</span>
            <span>&bull; 30天无忧退换货</span>
            <span>&bull; 正品保障</span>
          </div>
          <div class="discuss"><em>{{itemDetail.salesNum>999?'999+':itemDetail.salesNum}}</em><br/>已售</div>
        </div>
        <div v-if="itemDetail.available">
          <div class="item-conf">
            <span class="text">运费：</span><em>包邮</em>
          </div>
          <div class="item-conf sku-wrap" v-for="(sku,j) in skuArray">
            <span class="text">{{sku.name}}：</span>
            <div class="sku-items">
              <a href="javascript:;" class="sku" v-for="(name,i) in sku.lists" @click="selectSkuArray(name,j,$event)"
                 :class="{selected:selectSku.values[j]===name,noexist:selectArray[j].indexOf(name)===-1}"
                 :attr="selectSku.values[j]">{{name}}</a>
            </div>
          </div>
          <div class="item-conf">
            <span class="text">数量：</span>
            <el-input-number :min="1" :max="1" label="商品数量" v-model="num"></el-input-number>
            <span class="num">库存({{selectSku.quantity>999?'999+':selectSku.quantity}})</span>
          </div>
          <div class="item-btns">
            <el-button type="primary" plain @click="toGoBuy" v-if="selectSku.quantity>0">立即购买</el-button>
            <el-button type="info" disabled v-else>已售罄</el-button>
            <el-button type="primary" @click="addCart" v-if="selectSku.quantity>0"><i class="icon-shopcart2" style="font-size:20px"></i> 加入购物车
            </el-button>
            <a href="javascript:;" class="collect collected" v-if="isFavorite" @click="delFavourite(itemDetail.id)"><i
              class="el-icon-star-on"></i><br/>已收藏</a>
            <a href="javascript:;" class="collect" v-else @click="addFavourite(itemDetail.id)"><i
              class="el-icon-star-off"></i><br/>收藏</a>
          </div>
        </div>
        <div v-else style="line-height:48px">
          该商品已下架
        </div>
      </div>
    </div>
    <div class="goods-detail">
      <div class="detail-left">
        <hot-goods></hot-goods>
      </div>
      <div class="detail-right">
        <div class="detail-tab">
          <a href="javascript:;" :class="{'on':curIndex===0}" @click="curIndex=0">商品详情</a>
          <a href="javascript:;" :class="{'on':curIndex===2}" @click="curIndex=2" v-if="itemDetail.metaDescription">规格参数</a>
          <a href="javascript:;" :class="{'on':curIndex===1}" @click="curIndex=1">商品评论（{{discussLength>999?'999+':discussLength}}）</a>
        </div>
        <div class="detail-cont" v-if="curIndex===0">
          <div v-html="itemDetail.detail"></div>
          <img src="~images/detail1.jpg" alt="商品说明">
          <img src="~images/detail2.jpg" alt="商品说明">
        </div>
        <div class="detail-cont" v-if="curIndex===1">
          <review-list :itemID="goodsid"></review-list>
        </div>
        <div class="detail-params" v-if="curIndex===2" v-html="itemDetail.metaDescription"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import ReviewList from 'base/Review'
  import HotGoods from 'base/HotGoods'
  import {mapMutations, mapActions} from 'vuex'
  import {getUrlDomain} from 'common/js/util'
  import {$http,$http2,$httpSign,collectGoods,cancelCollect} from 'common/js/httpAll'

  export default {
    data() {
      return {
        discussLength:0,
        value: 5,
        price: {},   // 价格
        num: 1,
        curIndex: 0,				// 判断是详情还是评论
        imgIndex: 0,
        imgUrl: '',
        isFavorite: false,	// 是否收藏
        selectSku: {},		// 选中的sku完整参数
        selectArray: [],		// 选中的sku后，可选的sku列表
        skuArray: [],			// sku列表[name:'',lists:[]]，用于显示
        itemDetail: {},
        urlPath:getUrlDomain().urlPath
      }
    },
    components: {
      ReviewList,
      HotGoods
    },
    computed: {
      goodsid() {
        return this.$route.params.goodsid
      },
      loginStatus() {
        return this.$store.state.userName === ''
      }
    },
    watch: {
      goodsid: function (id) {//监听当前页面的goodsid变化
        this.getGoodsDetail()
        this.curIndex=0
      }
    },
    mounted() {
      this.getGoodsDetail()
    },
    methods: {
      _initSkuArray() {
        var arr = new Array()
        // 初始化
        this.itemDetail.skuLabels.forEach((item) => {
          arr.push({
            name: item,
            lists: []
          })
        })

        // 将规格无重复放入arr
        this.itemDetail.skus.forEach((item) => {
          var lists = item.values
          lists.forEach((val, index) => {
            var list = arr[index].lists
            if (list.indexOf(val) === -1) {
              list.push(val)
            }
          })
        })

        this.skuArray = arr
        // 鼠标点击的规格值和位置
        this.selectSkuArray(this.selectSku.values[0], 0)
      },
      selectSkuArray(name, i, e) {
        if (e && e.target.className.indexOf('noexist') >-1 ) {
          return false
        } else {
          if (typeof e !== 'undefined') {
            var skus=this.selectSku.values
            skus[i]=name
            var k=0  // 判断是否有匹配的
            // 获取选中的规格参数
            for(var j=0,len=this.itemDetail.skus.length;j<len;j++){
              var item=this.itemDetail.skus[j]
              if (item.values.join(',')===skus.join(',')) {
                this.selectSku = JSON.parse(JSON.stringify(item))
                this.price = this.selectSku.price
                k++
                break
              }
            }
            // 没有匹配的数据
            if(k===0){
              for(var j=0,len=this.itemDetail.skus.length;j<len;j++){
                var item=this.itemDetail.skus[j]
                if (item.values[i]===name) {
                  this.selectSku = JSON.parse(JSON.stringify(item))
                  this.price = this.selectSku.price
                  break
                }
              }
            }
          }

          this.itemDetail.skuLabels.forEach((v, i) => {
            this.selectArray[i] = []
          })

          this.itemDetail.skus.forEach((item) => {
            var skus = item.values
            if (skus[i] === name) {
              skus.forEach((skuItem, index) => {
                if (this.selectArray[index].indexOf(skuItem) === -1 && index !== i) {
                  this.selectArray[index].push(skuItem)
                }
              })
            }
          })
          this.selectArray[i] = this.skuArray[i].lists
        }
      },
      getGoodsDetail() {
        var params={}
        if(this.$store.state.userName){
          // params={
          //   sign:localStorage.getItem('sign'),
          //   distributorID:this.$store.state.userInfo.distributorID,
          //   itemID:this.goodsid
          // }
        }
        $httpSign({
          url:`/item/detail/${this.goodsid}`,
          params,
          success:function(data){
            data.imgs = data.imgs.slice(0, 5)
            this.itemDetail = data
            this.imgUrl = this.itemDetail.imgs[0].url
            this.isFavorite = this.itemDetail.favorite
            this.selectSku = JSON.parse(JSON.stringify(this.itemDetail.skus[0]))
            this.price = this.selectSku.price
            this.discussLength=data.evaluateCount.goodStar+data.evaluateCount.normalStar+data.evaluateCount.badStar
            this._initSkuArray()
            console.log(data)
          }.bind(this)
        })
      },
      // 收藏商品
      addFavourite(id) {
        if (this.loginStatus) {
          this.$router.push({path: '/login', query: {from: `/goodsdetail/${this.goodsid}`}})
        } else {
          collectGoods(this,id,function(data){
            this.isFavorite = true
          }.bind(this))
        }
      },
      // 取消收藏
      delFavourite(id) {
       if (this.isFavorite) {
         cancelCollect(this,id,function(data){
           this.isFavorite = false
         }.bind(this))
       }
      },
      // 立即购买
      toGoBuy() {
        if (this.selectSku.quantity >= this.num) {
          this.$router.push({
            name: 'confirmOrder',
            query: {itemID: this.itemDetail.id, skuID: this.selectSku.id, num: this.num}
          })
        } else {
          this.$message({
            type: 'warning',
            message: '库存不足'
          });
        }
      },
      // 加入购物车
      addCart() {
        if (this.loginStatus) {
          this.$router.push({path: '/login', query: {from: `/goodsdetail/${this.goodsid}`}})
        } else {
          $httpSign({
            url: '/cart/add',
            method: 'post',
            params: {
              skuID: this.selectSku.id,
              num: this.num
            },
            success:function(data){
              this.SETCartNum()
              this.$message({
                type: 'success',
                message: '购物车加入成功'
              });
            }.bind(this),
            error:function(err){
              this.$message({
                type: 'error',
                message: err
              });
            }.bind(this)
          })
        }
      },
      ...mapActions(['SETCartNum'])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable.styl"
  .detail {
    margin-top: 20px
  }
  .goods {
    &-info {
      display: flex
      .info-left {
        width: 460px
        margin-right: 60px
      }
      .info-right {
        flex: 1
      }
      .img {
        &-preview {
          width: 460px
          height: 460px
        }
        &-thumb {
          position: relative
          margin-top: 40px
          &-wrap {
            width: 460px
          }
          &-lists {
            display: flex
            li {
              width: 76px
              height: 76px
              border: 2px solid $border-color
              margin-left: 20px
              cursor: pointer
              &:first-child {
                margin-left: 0
              }
              &.selected, &:hover {
                border-color: $hover-color
              }
            }
          }
        }
      }
      .item {
        &-title {
          font-size: $font-xl
          color: $size-color2
          line-height: 26px
        }
        &-subtitle {
          font-size: $font-x
          color: $size-color3
          line-height: 16px
          font-weight: normal
          margin: 10px 0
        }
        &-prices {
          width: 560px
          height: 130px
          padding-right: 80px
          background: url("~images/detail_bg.png") top left no-repeat
          position: relative
          padding: 25px 20px 0
          .sale_price {
            font-size: $font-xl
            color: $main-color
            line-height: 28px
            vertical-align: middle
          }
          .payment_price {
            font-size: $font-s
            color: $size-color2
            line-height: 28px
            margin-left: 30px
            vertical-align: middle
          }
          .prices {
            margin: 8px 0 12px
          }
          .member_price {
            font-size: $font-s
            color: $size-color2
          }
          .market_price {
            font-size: $font-x
            color: $size-color3
            text-decoration: line-through
            margin-left: 20px
          }
          .service {
            font-size: $font-s
            color: $size-color2
            span {
              font-size: $font-x
              color: $size-color3
              margin-left: 20px
            }
          }
          .discuss {
            text-align: center
            position: absolute
            right: 0
            top: 0
            height: 100%
            width: 80px
            padding-top: 36px
            font-size: $font-l
            color: $size-color3
            line-height: 24px
            em {
              color: $main-color
              font-style: normal
            }
            &:before {
              content: ''
              position: absolute
              top: 24px
              left: 0
              bottom: 24px
              border-left: 1px dashed $border-color
            }
          }
        }
        &-conf {
          margin-top: 20px
          .text {
            font-size: $font-s
            color: $size-color2
            display: inline-block
            min-width: 80px
            padding-left: 20px
          }
          .num {
            font-size: $font-s
            color: $size-color2
            line-height: 40px
            margin-left: 30px
          }
          em {
            font-style: normal
            color: $main-color
          }
        }
        &-btns {
          margin-top: 40px
          margin-left:60px
          display: flex
          .el-button {
            width: 200px
            height: 50px
            border-radius: 2px
            font-size: $font-l
          }
          .el-button + .el-button {
            margin-left: 20px
          }
          .collect {
            margin-top: 4px
            font-size: $font-s
            color: $size-color3
            line-height: 20px
            text-align: center
            margin-left: 24px
            display:block
            .el-icon-star-off, .el-icon-star-on {
              font-size: $font-xl
            }
          }
          .collected {
            color: $main-color
          }
        }
      }
      .sku-wrap {
        line-height: 40px
        margin-top: 20px
        overflow:hidden
        .text {
          float: left
        }
        & + .sku-wrap {
          margin-top: 10px
        }
      }
      .sku-items {
        font-size: 0
        line-height: 0
        margin-right: -20px
        overflow: hidden
        .sku {
          display: inline-block
          min-width: 80px
          padding: 0 10px
          line-height: 38px
          border: 1px solid $border-color
          font-size: $font-s
          text-align: center
          margin-right: 20px
          color: $size-color3
          margin-bottom: 10px
          &:hover {
            border-color: $hover-color
          }
          &.selected {
            border-color: $hover-color
            background: url('~images/selected_icon.png') bottom right no-repeat
            background-size: 24px 24px
          }
          &.noexist {
            color: $border-color
            cursor: not-allowed
            &:hover {
              border-color: $border-color
            }
          }
        }
      }
    }
    &-detail {
      display: flex
      margin: 50px 0
      .detail-left {
        width: 300px
      }
      .detail-right {
        overflow: hidden
        flex: 1
        margin-left: 30px
      }
      .detail {
        &-tab {
          line-height: 60px
          display: flex
          border: 1px solid $border-color
          border-top: 2px solid $main-color
          a {
            width: 200px
            text-align: center
            color: $size-color
            font-size: $font-m
            border-right: 1px solid $border-color
            display:block
            &.on {
              color: #fff
              background-color: $main-color
            }
          }
        }
        &-cont {
          margin-top: 20px
        }
      }
    }
  }
</style>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  .detail{
    .el-input-number {
      width: 220px
    }

    .el-input-number__decrease {
      border-radius: 0
      background-color: #fff
      border-right: 1px solid $border-color
    }

    .el-input-number__increase {
      border-radius: 0
      background-color: #fff
      border-left: 1px solid $border-color
    }

    .el-input-number .el-input__inner {
      border-radius: 0
      border-color: $border-color
    }
    &-cont{
      img{
        display:block
        width:100%
      }
    }
    &-params{
      margin:20px 10px
    }
    &-params-table{
      td,th{
        height:32px
        border:1px solid $border-color
        font-size:$font-x
        padding-left:20px
      }
      th{
        color:$size-color2
        text-align:left
        background-color:#f3f3f3
      }
      td{
        color:$size-color3
      }
    }
  }

</style>

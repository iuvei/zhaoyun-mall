<template>
	<div class="hot-goods" v-if="hotGoods.length>0">
	  <h3 class="title">热门搜索</h3>
	  <div class="hot-item" v-for="item in hotGoods">
	    <router-link :to="`/goodsdetail/${item.itemID}`">
	      <h4 class="item-title" :title="item.itemName">{{item.itemName}}</h4>
	      <div class="item-pic">
	        <img v-lazy="urlPath+item.picUrl" alt="热门商品" width="160" height="160" :title="item.itemName">
	      </div>
	      <div class="item-info">
	        <div class="item-sale_price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</div>
	        <div class="item-other_price">会员价：{{item.skuList[0].salesPrice|toFixed(2)}}
	          <del>&yen;{{item.skuList[0].marketPrice|toFixed(2)}}</del>
	        </div>
	      </div>
	      <div class="item-info_hover">
	        <div class="item-sale_price item-dingjin" v-if="!!item.skuList[0].earnestPrice">
	          定金：{{item.skuList[0].earnestPrice|toFixed(2)}}
	        </div>
	        <el-button type="primary" class="item-btn">加入购物车</el-button>
	      </div>
	    </router-link>
	  </div>
	</div>
</template>

<script>
  import {getUrlDomain} from 'common/js/util'
  import {$httpSign2} from 'common/js/httpAll'

  export default {
    data() {
      return {
        hotGoods: [],
        urlPath:getUrlDomain().urlPath
      }
    },
    mounted() {
      this.hotGoodsList()
    },
    methods: {
      hotGoodsList() {
        $httpSign2({
          url:'/item/hot',
          params: {
            from: 0,
            limit: 5
          }
        }).then((res) => {
          this.hotGoods = res.data
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
	@import "~common/stylus/variable.styl"
	.hot {
	  &-goods {
	    width: 300px
	    .title {
	      font-weight: normal
	      border: 1px solid $border-color
	      text-align: center
	      line-height: 60px
	      border-top: 2px solid $main-color
	      font-size: $font-m
	      color: $size-color
	    }
	  }
	  &-item {
	    position: relative
	    width: 100%
	    height: 360px
	    border: 1px solid $border-color
	    margin-top: -1px
	    text-align: center
	    transition: all .2s linear
	    a{
	      display: block
	    }
	    img {
	      transition: all .2s linear
	    }
	    & + .hot-item {
	      margin-top: 20px
	    }
	    &:hover {
	      hover-goods()
	      .item-info {
	        opacity: 0
	      }
	      .item-info_hover {
	        opacity: 1
	      }
	    }
	    .item {
	      &-title {
	        font-weight: normal
	        font-size: $font-s
	        color: $size-color2
	        line-height: 20px
	        padding: 30px 20px 0
	        ellipsis-simple()
	      }
	      &-pic {
	        width: 160px
	        height: 160px
	        margin: 20px auto 0
	        overflow: hidden
	      }
	      &-info {
	        transition: all .2s linear
	      }
	      &-info_hover {
	        position: absolute
	        top: 230px
	        left: 0
	        width: 100%
	        opacity: 0
	        height: 120px
	        transition: all .2s linear
	        display: flex
	        flex-wrap: wrap
	        justify-content: center
	        align-content: center
	        align-items: center
	      }
	      &-sale_price {
	        font-size: $font-s
	        color: $num-color
	        line-height: 20px
	        margin-top: 30px
	        font-weight: bold
	      }
	      &-dingjin {
	        color: $main-color
	        font-weight: normal
	        margin: 0 0 10px 0
	        width: 200px
	      }
	      &-other_price {
	        font-size: $font-x
	        color: $size-color3
	        line-height: 16px
	        margin-top: 40px
	        position: relative
	        &:before {
	          content: ''
	          position: absolute
	          top: -20px
	          left: 60px
	          right: 60px
	          height: 1px
	          background-color: $border-color
	        }
	        del {
	          margin-left: 10px
	        }
	      }
	      &-btn {
	        width: 140px
	        padding: 10px 20px
	        border-radius: 2px
	      }
	    }
	  }
	}
</style>

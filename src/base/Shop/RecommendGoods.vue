<template>
  <div class="recommend" v-if="list.length>0">
    <shop-title title="为您推荐"></shop-title>

    <el-carousel height="320px" class="recommend-slider" v-if="Math.ceil(list.length/5)>1">
      <el-carousel-item v-for="i in Math.ceil(list.length/5)" :key="i">
        <ul class="goods-list recommend-list">
          <li class="item2" :class="{'item-dingjin':!!item.skuList[0].earnestPrice}" v-for="(item,index) in list.slice((i-1)*5,(i-1)*5+5)" :key="index">
            <router-link :to="`/goodsDetail/${item.itemID}`">
              <div class="img">
                <img v-lazy="urlPath+item.picUrl" :alt="item.itemName" width="200" height="200">
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
      </el-carousel-item>
    </el-carousel>
    <ul class="goods-list recommend-list" v-else>
      <li class="item2" :class="{'item-dingjin':!!item.skuList[0].earnestPrice}" v-for="(item,index) in list" :key="index">
        <router-link :to="`/goodsDetail/${item.itemID}`">
          <div class="img">
            <img v-lazy="urlPath+item.picUrl" :alt="item.itemName" width="200" height="200">
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
  import {$httpSign2} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data(){
      return {
        array:[],
        list:[],
        urlPath:getUrlDomain().urlPath
      }
    },
    components:{
      ShopTitle
    },
    mounted(){
      $httpSign2({
        url:'/item/recommend',
        params:{
          categoryID:1,
          twoCategoryID:8
        }
      }).then((res)=>{
        this.list=res.data
      })
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/goodslist.styl"
  .recommend {
    margin-top: 30px
    &-list {
      margin-top:20px
    }
    .item2 {
      width: 200px
      height:300px
    }
    .img {
      width:200px
      height:200px
    }
  }
</style>

<style lang="stylus">
  .recommend .recommend-slider.el-carousel{
    .el-carousel__arrow{
      width:30px
      height:90px
      border-radius:0
      font-size:0
      background:url('~images/next.png') no-repeat
      i{
        font-size:0
      }
    }
    .el-carousel__arrow--left{
      background-image:url('~images/prev.png')
    }
  }

</style>

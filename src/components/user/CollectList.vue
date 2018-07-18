<template>
  <div class="user-cont">
    <shop-title title="我的收藏"></shop-title>
    <no-data v-if="totalCount===0" :imgUrl="imgUrl" :desc="'您还没有收藏呢~'">
      <p class="op1"><router-link to="/">去购物>></router-link>，看看有没有喜欢的</p>
    </no-data>
    <div class="shopcart-th" v-if="totalCount>0">
      <div class="th-op">
        <el-checkbox v-model="checkedAll" label="all" v-if="isDelete" @change="selectAll">全选（{{deleteNum}}）</el-checkbox>
        <a href="javascript:;" @click="isDelete=true" v-if="!isDelete">批量管理</a>
        <a href="javascript:;" @click="isDelete=false" v-if="isDelete">取消管理</a>
        <a href="javascript:;" v-if="isDelete" @click="cancelFavourite(deleteArr.join(','))">批量删除</a>
      </div>
    </div>
    <ul class="goods-list" v-if="totalCount>0">
      <li class="item2"  :class="{'item-dingjin':!!item.skuList[0].earnestPrice}" v-for="(item,index) in favouriteList" :key="index">
        <a href="javascript:;" class="delete_all" v-if="isDelete" @click="selectArr(item.itemID)"
           :class="{on:deleteArr.indexOf(item.itemID)>-1}"><i
          :class="{'el-icon-circle-check-outline':deleteArr.indexOf(item.itemID)===-1,'el-icon-circle-check':deleteArr.indexOf(item.itemID)>-1}"></i></a>
        <a href="javascript:;" class="delete" @click="cancelFavourite(item.itemID)" v-if="!isDelete"><i
          class="icon-delete"></i></a>
        <router-link :to="`/goodsDetail/${item.itemID}`">
          <div class="img">
            <img v-lazy="urlPath+item.picUrl" :alt="item.itemName">
            <div class="earnest" v-if="!!item.skuList[0].earnestPrice">
              <span class="icon"></span>
              <em>{{item.skuList[0].earnestPrice|toFixed(2)}}</em>
            </div>
          </div>
          <div class="info">
            <p class="title hover-hand" :title="item.itemName">{{item.itemName}}</p>
            <p class="price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
          </div>
        </router-link>
      </li>
    </ul>
    <el-pagination  v-if="totalCount/pageSize>1" background layout="prev, pager, next" :page-size="pageSize" :total="totalCount" prev-text="上一页" next-text="下一页" @current-change="getFavouriteList"></el-pagination>
  </div>
</template>

<script>
  import ShopTitle from 'base/Shop/ShopTitle'
  import NoData from 'base/NoData.vue'
  import {getCollectList,cancelCollect} from 'common/js/httpAll'
  import img from 'images/collect_nodata.jpg'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data() {
      return {
        sign:localStorage.getItem('sign'),
        isDelete: false,
        deleteArr: [],
        deleteNum:0,
        favouriteList: [],
        checkedAll:false,
        pageSize:12,
        totalCount:0,
        imgUrl:img,
        urlPath:getUrlDomain().urlPath
      }
    },
    mounted() {
      this.$store.commit('updateActiveTab', '3')
      this.getFavouriteList(1)
    },
    components: {
      ShopTitle,
      NoData
    },
    methods: {
      //获取收藏列表
      getFavouriteList(a) {
        getCollectList({
          from:(a-1)*(this.pageSize),
          limit:this.pageSize,
          successFn:function(data){
            this.favouriteList = data.favList
            this.totalCount=data.page.totalCount
          }.bind(this)
        })
      },
      //取消收藏
      cancelFavourite(itemID) {
        cancelCollect(this,itemID,function(data){
          this.getFavouriteList(1)
        }.bind(this))
      },
      selectAll(b){
        if(b===false){
          this.deleteArr=[]
          this.deleteNum=0
        }else{
          this.deleteArr=[]
          this.favouriteList.forEach((item)=>{
            this.deleteArr.push(item.itemID)
          })
          this.deleteNum=this.favouriteList.length
        }
      },
      selectArr(i) {
        if (this.deleteArr.indexOf(i) > -1) {
          this.deleteArr.splice(this.deleteArr.indexOf(i), 1)
        } else {
          this.deleteArr.push(i)
        }
        this.deleteNum=this.deleteArr.length
        this.checkedAll=this.deleteNum===this.favouriteList.length
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/goodslist.styl"
  .shopcart {
    &-th {
      font-size: $font-x
      display: flex
      justify-content: space-between
      line-height: 40px
      margin:10px 0
      a {
        color: $size-color2
        margin-left: 20px
      }
    }
  }

  .goods-list {
    .item2{
      width:260px
      height:360px
    }
    .img{
      width:260px
      height:260px
    }
    .delete_all {
      z-index: 12
      position: absolute
      left: 0
      top: 0
      right: 0
      height: 260px
      font-size: 52px
      color: rgba(255, 255, 255, .6)
      text-align: center
      line-height: 260px
      background-color: rgba(0, 0, 0, 0.3)
      &.on {
        color: rgba(175, 123, 122, .95)
      }
    }
  }
</style>

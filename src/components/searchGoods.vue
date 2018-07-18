<template>
  <div class="goods">
    <div class="container">
      <div class="goods-sort">
        <div class="category">
          <div class="list">
            <a href="javascript:;" :class="{on:!keyword}" @click="searchHandle()">全部商品 <i
              class="el-icon-arrow-right"></i></a>
            <a href="javascript:;" :class="{on:keyword}">{{keyword?keyword:'全部'}}</a>
          </div>
        </div>
        <div class="sort">
          <div class="list">
            <a href="javascript:;" :class="{'on':sortIndex===0}" @click="defaultSort();getSearchList(curPage)">默认</a>
            |
            <a href="javascript:;" :class="{'on':sortIndex===1}" @click="priceSort();getSearchList(curPage)">价格: <i :class="{'icon-arrow_asc':!priceUpDown||priceUpDown=='asc','icon-arrow_desc':priceUpDown=='desc'}"></i></a>
            <div style="line-height:1;margin-top:6px" @mouseover="priceBtn=true" @mouseout="priceBtn=false">
              <el-input size="mini" style="width:100px" v-model="minPrice"></el-input> - <el-input size="mini" style="width:100px" v-model="maxPrice"></el-input>&nbsp;
              <el-button size="mini" type="primary" v-show="priceBtn" @click="priceRegionEvent">确定</el-button>
            </div>
          </div>
          <!-- <div class="rightPage" v-if="searchList.page&&totalCount/pageSize>1">
            <p class="tishi"><span>{{curPage}}</span> / {{searchList.page.pageCount}}</p>
            <el-pagination background layout="prev, next"
                           :total="totalCount"
                           :page-size="pageSize"
                           @current-change="getSearchList($event,{priceUpDown})">
            </el-pagination>
          </div> -->
        </div>
      </div>
      <div class="goods-wrap" v-if="searchList">
        <ul class="goods-list">
          <li class="item" v-for="item in searchList.itemList">
            <router-link :to="`/goodsdetail/${item.itemID}`">
              <div class="img"><img v-lazy="urlPath+item.picUrl" width="235" height="235"></div>
              <div class="info">
                <p class="title">{{item.itemName}}</p>
                <p class="price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
                <p class="other_price">会员价：{{item.skuList[0].salesPrice|toFixed(2)}}
                  &nbsp;<del>&yen;{{item.skuList[0].marketPrice|toFixed(2)}}</del>
                </p>
              </div>
              <div class="info_hover">
                <p class="dingjin" v-if="!!item.skuList[0].earnestPrice">定金：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
                <el-button type="primary" class="btn">加入购物车</el-button>
              </div>
            </router-link>
          </li>
        </ul>
        <el-pagination v-if="searchList.page&&totalCount/pageSize>1" background layout="prev, pager, next" :total="totalCount"
                       :page-size="pageSize" prev-text="上一页"
                       next-text="下一页" @current-change="getSearchList"></el-pagination>
      </div>
    </div>
    <div style="background-color: #fff;padding: 40px 0; margin-top: 20px;">
      <!-- 推荐商品 -->
      <recommend-goods style="background-color: #fff;width: 1080px;margin: auto"></recommend-goods>
    </div>
  </div>
</template>

<script>
  import {$httpSign} from 'common/js/httpAll'
  import RecommendGoods from 'base/Shop/RecommendGoods'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data() {
      return {
        urlPath:getUrlDomain().urlPath,
        sortIndex: 0,
        searchList: {},
        params:{},
        priceBtn:false,
        // 查询条件
        curPage:1,
        totalCount:0,
        pageSize:20,
        priceUpDown:'',  // 价格排序
        timeUpDown:'desc', // 时间排序
        minPrice:'',
        maxPrice:'',
      }
    },
    computed: {
      keyword() {
        return this.$route.query.keyworld
      }
    },
    watch: {
      keyword: function () {
        this.getSearchList(1)
      }
    },
    mounted() {
      this.getSearchList(1)
    },
    methods: {
      getSearchList(a) {
        this.curPage=a

        var params={
          from: (this.curPage-1)*this.pageSize,
          limit: this.pageSize,
          keyword: this.keyword
        }
        if(this.timeUpDown){
          params.timeUpDown=this.timeUpDown
        }
        if(this.priceUpDown){
          params.priceUpDown=this.priceUpDown
        }
        if(this.minPrice){
          params.start=this.minPrice
        }
        if(this.maxPrice){
          params.end=this.maxPrice
        }

        $httpSign({
          url:'/item/list',
          params,
          success:(data)=>{
            this.searchList = data
            this.totalCount=this.searchList.page.totalCount
          }
        })
      },
      // 默认排序
      defaultSort(){
        this.sortIndex=0
        this.priceUpDown=''
        this.timeUpDown='desc'
      },
      // 根据金额排序
      priceSort(){
        this.timeUpDown=''
        this.sortIndex=1

        if(this.priceUpDown===''){
          this.priceUpDown='asc'
        }else{
          if(this.priceUpDown==='asc'){
            this.priceUpDown='desc'
          }else{
            this.priceUpDown='asc'
          }
        }
      },
      // 根据金额查询
      priceRegionEvent(){
        this.getSearchList(1)
      },
      searchHandle() {
        this.$router.push('/searchgoods')
      }
    },
    components: {
      RecommendGoods
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/goodslist.styl'
  .goods {
    padding-top:20px
    &-title {
      padding: 20px 0
      .title {
        line-height: 32px
        display: flex
        justify-content: center
      }
      .name {
        font-size: $font-xl
        color: $main-color
        margin-left: 10px
      }
    }
    &-sort {
      background-color: #fff
      .sort{
        margin-top:-1px
      }
      .category, .sort {
        padding: 10px 40px
        line-height: 40px
        position: relative
        font-size: $font-s
        border: 1px solid $border-color
      }
      .category, .sort {
        display: flex
        justify-content: space-between
        align-items: center
        .list {
          display: flex
          flex-wrap: wrap
          color: $size-color3
          a {
            color: $size-color3
            padding: 0 20px
            &:first-child {
              padding-left: 0
            }
            &:hover, &.on {
              color: $hover-color
              i{
                color:$hover-color
              }
            }
            .icon-arrow_desc, .icon-arrow_asc {
              font-size: $font-x
              color:$size-color4
              vertical-align:-1px
            }
          }
        }
        .rightPage {
          display: flex
          .tishi {
            color: $size-color3
            margin-right: 20px
            span {
              color: $hover-color
            }
          }
          .el-pagination {
            margin-top: 0
            display: flex
            align-items: center
          }
        }
      }

      .category {
        .list {
          a {
            padding-left: 20px
            &:first-child {
              padding-left: 0
            }
            &:nth-child(2) {
              padding: 0
            }
          }
        }
      }

    }
  }

</style>
<style lang="stylus">
  @import '~common/stylus/variable.styl'
  body {
    // background-color: #f7f7f7
  }

  .rightPage {
    .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
      padding: 0
      margin: 0
      border-color: #dadada
      height: 35px
      width: 50px
      line-height: 20px
      min-width: 24px
      border-radius: 0
      color: #dadada
      .el-icon {
        font-size: 16px
      }
      &:hover {
        color: #fff
        background-color: #dadada
      }
      &.disabled {
        opacity: .6
        cursor: not-allowed
        &:hover {
          color: #dadada
          background-color: #fff
        }
      }
    }
  }
</style>

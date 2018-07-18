<template>
  <div class="goods">
    <div class="container">
      <div class="el-carousel" v-if="this.picsList.length===1">
        <div class="slider" :style="{backgroundImage:`url(${urlPath}${picsList[0].picUrl})`}"></div>
      </div>
      <el-carousel indicator-position="none" height="320px" @change="curIndex=$event" v-else-if="this.picsList.length>1">
        <el-carousel-item v-for="(item,index) in picsList" :key="index">
          <div class="slider" :style="{backgroundImage:`url(${urlPath}${item.picUrl})`}"></div>
        </el-carousel-item>
        <div class="slider-num">{{curIndex+1}}/{{picsList.length}}</div>
      </el-carousel>

      <div class="goods-sort">
        <div class="category">
          <span class="title">分类：</span>
          <div class="list">
            <a href="javascript:;" @click="getItem(categoryid,'')" :class="{on:clickName==='link'||clickName==='all'}">全部</a>
            <a href="javascript:;" @click="getItem(categoryid,category.categoryID)" v-for="category in categorieAll" :key="category.categoryID" :class="{on:firstCategorie==category.categoryID&&clickName==='item'}">
              {{category.categoryName}}
            </a>
          </div>
        </div>
        <div class="sort">
          <span class="title">排序：</span>
          <div class="list">
            <a href="javascript:;" :class="{'on':sortIndex===0}" @click="sortIndex=0;defaultSort()">默认</a>
            <a href="javascript:;" :class="{'on':sortIndex===1}" @click="sortIndex=1;priceSort($event)">价格：<i :class="['icon-arrow_'+pricesort]"></i></a>
            <a href="javascript:;" :class="{'on':sortIndex===2}" @click="sortIndex=2;timeSort($event)">上架时间：<i :class="['icon-arrow_'+timesort]"></i></a>
          </div>
        </div>
      </div>
      <div class="goods-wrap" v-for="category in categories" :ref="category.categoryID" :key="category.categoryID">
        <div class="goods-title">
          <p class="title">

            <img class="icon" v-lazy="urlPath+category.picUrl" width="60" height="60">
            <span class="name">{{category.categoryName}}</span>
          </p>
        </div>
        <ul class="goods-list">
          <li class="item" v-for="item in category.itemList">
            <router-link :to="`/goodsdetail/${item.itemID}`">
              <div class="img"><img v-lazy="urlPath+item.picUrl" :alt="item.itemName" width="235" height="235"></div>
              <div class="info">
                <p class="title">{{item.itemName}}</p>
                <p class="price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
                <p class="other_price">会员价：{{item.skuList[0].salesPrice|toFixed(2)}}
                  &nbsp;<del>&yen;{{item.skuList[0].marketPrice|toFixed(2)}}</del>
                </p>
              </div>
              <div class="info_hover">
                <p class="dingjin" v-if="!!item.skuList[0].earnestPrice">定金：{{item.skuList[0].earnestPrice|toFixed(2)}}</p>
                <el-button type="primary" class="btn">加入购物车</el-button>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

  import {$httpSign2} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data() {
      return {
        clickName:'link', // link路由获取；all点击“全部按钮”；item点击“类目”
        curIndex: 0,
        sortIndex:0,
        picsList: [1, 2, 3, 4],
        pricesort:'asc',
        timesort:'desc',
        categorieAll:[],
        categories: [],
        firstCategorie:{},
        // defaultCategories:[],
        urlPath:getUrlDomain().urlPath,
        subcateid:0,
        cateid:0
      }
    },
    computed:{
      subcategoryid(){
        return this.$route.params.subcategoryid
      },
      categoryid(){
        return this.$route.params.categoryid
      }
    },
    watch: {
      subcategoryid(){
        this.init()
      },
      categoryid(){
        this.init()
      }
    },
    mounted() {
      this.init()
      this.cateid=this.$route.params.categoryid
      this.subcateid=''
    },
    methods: {
      initScroll(){
        let name=this.subcategoryid

        setTimeout(()=>{
          if(name!=='all'){
            if(this.$refs[name]&&this.$refs[name].length>0){
              document.documentElement.scrollTop=this.$refs[name][0].offsetTop-60
              document.body.scrollTop=this.$refs[name][0].offsetTop-60
            }
          }else{

            document.documentElement.scrollTop=0
            document.body.scrollTop=0
          }
        },0)
      },
      init(){
        this.clickName='link'
        this.$http.all([

          this.getPics(),
          this.getItemList(this.categoryid,'')]
        ).then(this.$http.spread((a,b)=>{
          if(a.data.code==='0'){
            this.picsList=a.data.result.advertList
          }
          if(b.data.code==='0'){
            var categories=JSON.parse(JSON.stringify(b.data.result.categoryItemList.secondList))
            this.categorieAll=categories
            this.categories = categories
            // this.defaultCategories = categories
          }
          this.$nextTick(() => {
            this.initScroll()
          })
        }))
      },
      getItem(a,b){
        this.sortIndex=0
        this.categories=[]
        // this.defaultCategories=[]
        this.cateid=a
        this.subcateid=b

        if(b===''){
          this.clickName='all'
        }else{
          this.clickName='item'
        }
        this.getItemList(a,b).then((res)=>{
          if(res.data.code==='0'){
            if(b===''){
              this.categories = JSON.parse(JSON.stringify(res.data.result.categoryItemList.secondList))
              // this.defaultCategories = JSON.parse(JSON.stringify(res.data.result.categoryItemList.secondList))
            }else{
              this.categories.push(JSON.parse(JSON.stringify(res.data.result.categoryItemList)))
              // this.defaultCategories.push(JSON.parse(JSON.stringify(res.data.result.categoryItemList)))
            }
            this.firstCategorie=this.categories[0].categoryID
          }
        })
      },
      getItemList(categoryid,subcategoryid) {
        var params={
          categoryID:categoryid
        }
        if(subcategoryid!==''){
          params.twoCategoryID=subcategoryid
        }

        return $httpSign2({
          url:'/category/categoryItemList',
          params:params
        })
      },
      getPics() {

        return $httpSign2({
          url:'/category/getAdvertList',
          params: {
            parentID:this.categoryid
          }
        })
      },
      // 默认排序
      defaultSort(){
        this.getItem(this.cateid,this.subcateid)
        // this.categories=JSON.parse(JSON.stringify(this.defaultCategories))
      },
      // 根据价格排序
      priceSort(e){
        if(e.target.className==='on'){
          if(this.pricesort==='asc'){
            this.pricesort='desc'
          }else{
            this.pricesort='asc'
          }
        }
 


        this.categories.forEach((categorie)=>{
          var itemList=categorie.itemList
          var len=itemList.length
          var b
          if(this.pricesort==='asc'){
            for(var i=0;i<len;i++){
              for(var j=i+1;j<len;j++){
                if(itemList[i].skuList[0].vipPrice<itemList[j].skuList[0].vipPrice){
                  b=JSON.parse(JSON.stringify(itemList[i]))
                  itemList[i]=JSON.parse(JSON.stringify(itemList[j]))
                  itemList[j]=b
                }
              }
            }
          }else if(this.pricesort==='desc'){
            for(var i=0;i<len;i++){
              for(var j=i+1;j<len;j++){
                if(itemList[i].skuList[0].vipPrice>itemList[j].skuList[0].vipPrice){
                  b=JSON.parse(JSON.stringify(itemList[i]))
                  itemList[i]=JSON.parse(JSON.stringify(itemList[j]))
                  itemList[j]=b
                }
              }
            }
          }
        })
      },
      // 根据时间排序
      timeSort(e){
        if(e.target.className==='on'){
          if(this.timesort==='asc'){
            this.timesort='desc'
          }else{
            this.timesort='asc'
          }
        }


        this.categories.forEach((categorie)=>{
          var itemList=categorie.itemList
          var len=itemList.length
          var b
          if(this.timesort==='asc'){
            for(var i=0;i<len;i++){
              for(var j=i+1;j<len;j++){
                if(itemList[i].createTime<itemList[j].createTime){
                  b=JSON.parse(JSON.stringify(itemList[i]))
                  itemList[i]=JSON.parse(JSON.stringify(itemList[j]))
                  itemList[j]=b
                }
              }
            }
          }else if(this.timesort==='desc'){
            for(var i=0;i<len;i++){
              for(var j=i+1;j<len;j++){
                if(itemList[i].createTime>itemList[j].createTime){
                  b=JSON.parse(JSON.stringify(itemList[i]))
                  itemList[i]=JSON.parse(JSON.stringify(itemList[j]))
                  itemList[j]=b
                }
              }
            }
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/goodslist.styl'
  .goods {
    &-title {
      padding: 20px 0
      .title {

        line-height: 60px
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
      margin-top: 20px
      background-color: #fff
      .category, .sort {
        padding: 10px 60px 10px 110px
        line-height: 40px
        position: relative
        font-size: $font-s
        border: 1px solid $border-color
      }
      .sort{
        margin-top:-1px
      }
      .title {
        position: absolute
        left: 40px
        color: $size-color3
      }
      .list {
        display: flex
        flex-wrap: wrap
        a {
          color: $size-color3
          padding: 0 20px
          &:hover, &.on {
            color: $hover-color
            i{
              color:$hover-color
            }
          }
          .icon-arrow_asc, .icon-arrow_desc {
            font-size: $font-x
            color:$size-color4
            vertical-align:-1px
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
  .goods{
    .el-carousel {
      .slider {
        position: relative
        width: 1080px
        height: 320px
        background-position: center center
        background-size: auto 100%
        background-color: #ddd
        &-num {
          position: absolute
          width: 100px
          height: 30px
          right: 60px
          bottom: 30px
          color: $size-color3
          font-size: $font-s
          line-height: 28px
          text-align: center
          background: rgba(255, 255, 255, 0.50)
          border: 1px solid #868686
          z-index: 10
        }
      }
      .el-carousel__arrow {
        width: 56px
        height: 56px
        border-radius: 0
        background-color: transparent
        i {
          color: $main-color
          font-size: 56px
          font-weight: bold
          text-shadow: 1px 0 0 $main-color, -1px 0 0 $main-color
        }
        &--right {
          right: 0
        }
        &--left {
          left: 0
        }
      }
    }
  }
</style>

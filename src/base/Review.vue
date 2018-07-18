<template>
	<div id="review" class="review">
    <!-- <div class="review-total" v-if="totalCount>0">
      <div class="total-left">
        <a href="javascript:;" :class="{on:curIdx===0}" @click="curIdx=0;curType='5,4,3,2,1';discussList(1)">全部（{{totalCount>999?'999+':totalCount}}）</a>
        <a href="javascript:;" :class="{on:curIdx===index+1}" v-for="(value,index) in array" @click="curIdx=index+1;curType=value.ids;discussList(1)" v-if="discussTotal[value.word]">{{value.name}}（{{discussTotal[value.word]>999?'999+':discussTotal[value.word]}}）</a>
      </div>
      <div class="total-right">
        <em>{{discussTotal.goodStar/totalCount|precent()}}</em><br/>好评率
      </div>
    </div> -->
    <p v-if="discussArray.length===0" class="review-nodata">暂未评论</p>
    <div class="discuss-item" v-for="(item,index) in discussArray" :key="index">
      <div class="item-left">
        <div class="img">
          <img v-lazy="getPhoto(item.userPicture)" alt="个人头像" v-if="!!item.userPicture">
          <img src="~images/default_photo.jpg" alt="个人头像" v-else>
        </div>
        <p class="name">{{item.userName}}</p>
      </div>
      <div class="item-right">
        <p class="desc">{{item.description===''?'该用户没有填写评论':item.description}}</p>
        <ul class="piclist" v-if="item.picUrls">
          <li v-for="(pic,index) in item.picUrls" :key="index" v-if="pic"><img v-lazy="urlPath+pic" alt="商品图片"></li>
        </ul>
        <div class="other">
          <span class="time">{{item.createTime|time('yyyy-MM-dd mm:hh')}}</span>
          <span class="skuname">{{item.skuName}}</span>
          <el-rate v-model="item.starLevel" disabled></el-rate>
        </div>
        <p class="replay" v-if="item.feedback">回复：{{item.feedback}}</p>
      </div>
    </div>
    <el-pagination background layout="prev, pager, next" :total="page.totalCount" :page-size="sizePage" prev-text="上一页"
                   next-text="下一页" @current-change="discussList"
                   v-if="page.totalCount/sizePage>1"></el-pagination>
	</div>
</template>

<script>
  import {$httpSign} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data() {
      return {
        curIdx:0,
        curType:'1,2,3,4,5',
        totalCount:0,
        array:[{
          ids:'5',name:'好评',word:'goodStar'
        },{
          ids:'4,3',name:'中评',word:'normalStar'
        },{
          ids:'2,1',name:'差评',word:'badStar'
        }],
        page:{},
        sizePage:20,
        discussArray: [],
        firstLoad:true,
        discussTotal:{},
        urlPath:getUrlDomain().urlPath
      }
    },
    props:{
    	itemID:String
    },
    mounted() {
      this.discussList(1)
    },
    methods: {
      getPhoto(url){
        if(/^http/.test(url)){
          return url
        }else{
          return this.urlPath+url
        }
      },
      // 获取评论
      discussList(a) {
        $httpSign({
          url: '/evaluate/showEvaluateByItemID',
          method: 'post',
          params: {
            itemID: this.itemID,
            from:(a-1)*this.sizePage,
            limit:this.sizePage,
            starLevels:this.curType
          },
          success:function(data){
            if(this.firstLoad){
              this.firstLoad=false
              this.discussTotal=data.evaluateCount
              this.totalCount=this.discussTotal.goodStar+this.discussTotal.normalStar+this.discussTotal.badStar
            }
            this.discussArray = data.evaluateList
            this.page=data.evaluate
          }.bind(this)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable.styl"
  .review{
    &-total{
      margin-top:-20px
      height:80px
      padding:10px 0
      display:flex
      justify-content:space-between
      align-items:center
      border-bottom:1px dashed $border-color
      .total-left{
        display:flex
      }
      .total-right{
        border-left:1px dashed $border-color
        padding:0 10px
        font-size:$font-x
        color:$size-color3
        text-align:center
        line-height:1.3
        em{
          font-size:$font-l-l
          color:$main-color
          font-weight: bold
          font-style: normal
        }
      }
      a{
        display:block
        width:110px
        height:26px
        line-height:24px
        text-align:center
        font-size:$font-x
        border:1px dashed $border-color
        margin-right:20px
        border-radius:2px
        &.on,&:hover{
          color:$main-color
          border:1px solid $main-color
        }
      }
    }
    &-nodata{
      text-align:left
      line-height:36px
      margin-top:10px
    }
  }
  .discuss {
    &-item {
      display: flex
      padding: 20px 40px 20px 0
      border-bottom: 1px dashed $border-color
      .item-left {
        width: 120px
        margin-right: 15px
        text-align: center
      }
      .item-right {
        flex: 1
      }
      .img {
        margin: 0 auto 10px
        font-size: $font-x
        background-color: #ccc
      }
      .img, .img img {
        width: 40px
        height: 40px
        border-radius: 50%
      }
      .name, .desc {
        line-height: 20px
        font-size: $font-s
        color: $size-color2
      }
      .desc {
        margin-top: 10px
      }
      .piclist {
        display: flex
        li {
          margin-top: 20px
          border:1px solid $border-color
          width:50px
          height:50px
          img{
            width:100%
            height:100%
          }
        }
        li + li {
          margin-left: 20px
        }
      }
      .other {
        display: flex
        justify-content: space-between
        line-height: 20px
        font-size: $font-s
        margin: 20px 0
        color: $size-color3
      }
      .replay {
        line-height: 20px
        font-size: $font-s
        color: $main-color
      }
    }
  }

</style>

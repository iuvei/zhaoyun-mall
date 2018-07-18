<template>
  <div class="home">
    <el-carousel class="home-banner" trigger="click" v-if="advertList.banner" height="420px">
      <el-carousel-item  v-for="(item,index) in advertList.banner" :key="index">
        <a href="javascript:;">
          <div class="img" :style="{backgroundImage:`url(${urlPath}${item.picUrl})`}"></div>
        </a>
      </el-carousel-item>
    </el-carousel>
    <div class="home-notice" v-if="noticeList&&noticeList.length">
      <div class="container">
        <div class="notice-list" ref="noticeList">
          <router-link :to="`/noticeDetail/${notice.id}`" v-for="notice in noticeList" :key="notice.id">{{notice.informsName}}</router-link>
        </div>
        <router-link to="/noticeList" class="more">查看更多&nbsp;&nbsp;>></router-link>
      </div>
    </div>
    <!--为您推荐-->
    <div class="home-recommend">
      <div class="container">
        <div class="module_nav">
          <div class="title">
            <b>为您推荐</b>&nbsp;&nbsp;&nbsp;&nbsp;<span>话费充值，油卡充值快捷入口</span>
          </div>
          <div class="more" style="position:relative" @mouseover="tabMouseOver" @mouseout="tabMouseOut">
            充值说明<i class="el-icon-question ques_btn"></i>
            <div class="ques_cont" v-show="showInfo1">
              <p class="text_center">注意事项</p>
              <p class="font_16">话费充值说明：</p>
              <p>1. 话费充值，月末月初运营商充值偶有延迟，且省份不定期维护，请尽量避免高峰充值。</p>
              <p>2. 话费充值，如17开头的移动虚拟号不支持充值；177电信号段支持；173电信号段不支持。</p>
              <p>3. 用户若自发填写错误的充值账号，充值成功不予退款。</p>
              <p>4. 用户若账号密码被盗取，发生的风险由用户自己承担。 </p>
              <p>5. 兆云电商平台充值的话费费用均不提供发票，请知悉。</p>
              <p>6. 常规充值如有问题可联系客服咨询。</p>
            </div>
            <div class="ques_cont" v-show="showInfo2">
              <p class="text_center">注意事项</p>
              <p class="font_16">【中石化加油卡】充值注意事项：</p>
              <p>1、中石化官方每日22:50-00:50为其系统对账时间，此段时间聚合收单处理，对账结束，正常处理。</p>
              <p>2、所有加油卡主卡都可以在线充值，包含记名主卡、不记名主卡、企业主卡。副卡、挂失卡、卡号不存在无法充值。</p>
              <p>3、订单充值成功，一般10分钟内即可到帐，用户需在加油站完成圈存，方可使用。</p>
              <p>4、同一时间同一卡号提交多笔，可能会被石化系统限制，导致充值失败，不同省份超限限制不同。 </p>
              <p>5、订单充值成功，如超过24小时仍未到帐，为中石化官方系统数据传输问题，请您尽快通过客服热线与我们或中石化官方联系。</p>
              <p>6、中石化官方客服热线：区号+95105888/91505988。 </p>
              <p class="font_16">【中石油加油卡】充值注意事项：</p>
              <p>1、暂只支持个人卡记名卡（卡号以90开头），不支持车队卡（卡号以91开头）。</p>
              <p>2、中石油官方客服热线：95504</p>
            </div>
          </div>
        </div>
        <recharge-list @update:tab="getTab"></recharge-list>
      </div>
    </div>
    <!--每日上新-->
    <div class="home-newDay">
      <div class="container">
        <div class="module_nav">
          <p class="title"><b>每日上新</b>&nbsp;&nbsp;&nbsp;&nbsp;<span>精挑细选，&nbsp;层层把关</span></p>
          <router-link to="/newitem/day" class="more">查看更多&nbsp;&nbsp;>></router-link>
        </div>
        <div class="newDay" v-if="itemList.new">
          <div class="newDay-l">
            <div class="newDay-l-info">
              <div class="newDay-l-infoS" ref="infoS">
                <p v-for="(item,index) in itemList.new" @click="topInfo(index)" :class="{active:infoNum === index}"
                   :key="index">
                  <img :src="urlPath+item.picUrl" alt=""></p>
              </div>
            </div>
            <a class="newDay-btn bot-btn" @click="topInfo('-1')"><img src="~images/bot.png" alt=""></a>
            <a class="newDay-btn top-btn" @click="topInfo('+1')"><img src="~images/top.png" alt=""></a>
          </div>
          <div class="newDay-r" v-if="itemList.new">
            <p class="newDay-r_l"><img v-lazy="urlPath+itemList.new[infoNum].picUrl" alt=""></p>
            <ul class="newDay-r_r">
              <li class="title" :title="itemList.new[infoNum].itemName"
                  @click="itemHandle(itemList.new[infoNum].itemID)"><b>{{itemList.new[infoNum].itemName}}</b></li>
              <li class="price">
                <p v-if="!!itemList.new[infoNum].skuList[0].earnestPrice"><span>定金</span><span>{{itemList.new[infoNum].skuList[0].earnestPrice|toFixed(2)}}</span>
                </p>
                <p>VIP价:&nbsp;&nbsp;{{itemList.new[infoNum].skuList[0].vipPrice|toFixed(2)}}</p>
              </li>
              <li class="G_price">
                <p>会员价:&nbsp;&nbsp;{{itemList.new[infoNum].skuList[0].salesPrice|toFixed(2)}}<s>&yen;{{itemList.new[infoNum].skuList[0].marketPrice|toFixed(2)}}</s>
                </p>
              </li>
              <li class="spec">
                <p v-for="(sku,j) in skuArray">
                  {{sku.name}}：
                  <span v-for="(name,i) in sku.lists" @click="selectSkuArray(name,j,$event)"
                        :class="{active:selectSku['skuName'+j]===name,noexist:selectArray[j].indexOf(name)===-1}">{{name}}</span>
                </p>
              </li>
              <li class="handlBtn">
                <p>
                  <el-button @click="itemHandle(itemList.new[infoNum].itemID)" type="primary">立即购买</el-button>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--每周精选-->
    <div class="home-week">
      <div class="container">
        <div class="module_nav">
          <p class="title"><b>每周精选</b>&nbsp;&nbsp;&nbsp;&nbsp;<span>每周为您精挑细选</span></p>
          <router-link to="/newitem/week" class="more">查看更多&nbsp;&nbsp;>></router-link>
        </div>
        <div class="week-wrap">
          <router-link to="/newitem/week" v-if="advertList.advert2&&advertList.advert2.length" class="week-adv">
            <img v-lazy="urlPath+advertList.advert2[0].picUrl">
          </router-link>
          <ul class="goods-list home-goods week-list" v-if="itemList.SuperValue">
            <li class="item" :class="{'item-column':index===0||index===1}" v-for="(item,index) in itemList.SuperValue.slice(0,5)" :key="index">
              <router-link :to="`/goodsdetail/${item.itemID}`">
                <div class="img">
                  <img v-lazy="urlPath+item.picUrl" :alt="item.itemName">
                  <p v-show="!!item.skuList[0].earnestPrice" class="dingjin"><span>定金</span>{{item.skuList[0].earnestPrice|toFixed(2)}}</p>
                </div>
                <div class="info">
                  <p class="title">{{item.itemName}}</p>
                  <p class="price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
                  <p class="other_price">会员价：{{item.skuList[0].salesPrice|toFixed(2)}}
                    &nbsp;<del>&yen;{{item.skuList[0].marketPrice|toFixed(2)}}</del>
                  </p>
                </div>
                <div class="info_hover">
                  <el-button type="primary" class="btn">加入购物车</el-button>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--广告1-->
    <div class="home-advert container" v-if="advertList.advert3&&advertList.advert3.length">
      <a href="javascript:;">
        <img v-lazy="urlPath+advertList.advert3[0].picUrl" alt="广告图片">
      </a>
    </div>
    <!--特价商品-->
    <div class="home-special">
      <div class="container">
        <div class="module_nav">
          <p class="title"><b>特价商品</b>&nbsp;&nbsp;&nbsp;&nbsp;<span>疯狂抢抢抢</span></p>
          <router-link to="/newitem/sale" class="more">查看更多&nbsp;&nbsp;>></router-link>
        </div>
        <ul class="goods-list home-goods special-list" v-if="itemList.bargain&&itemList.bargain.length">
          <li class="item" v-for="(item,index) in itemList.bargain.slice(0,8)" :key="index">
            <router-link :to="`/goodsdetail/${item.itemID}`">
              <div class="img">
                <img v-lazy="urlPath+item.picUrl" :alt="item.itemName">
                <p v-show="!!item.skuList[0].earnestPrice" class="dingjin"><span>定金</span>{{item.skuList[0].earnestPrice|toFixed(2)}}</p>
              </div>
              <div class="info">
                <p class="title">{{item.itemName}}</p>
                <p class="price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
                <p class="other_price">会员价：{{item.skuList[0].salesPrice|toFixed(2)}}
                  &nbsp;<del>&yen;{{item.skuList[0].marketPrice|toFixed(2)}}</del>
                </p>
              </div>
              <div class="info_hover">
                <el-button type="primary" class="btn">加入购物车</el-button>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!--广告2-->
    <div class="home-advert" v-if="advertList.advert3&&advertList.advert3.length>1">
      <a href="javascript:;">
        <div :style="{backgroundImage:`url(${urlPath}${advertList.advert3[1].picUrl})`}" class="img"></div>
      </a>
    </div>
    <!--优选汽车-->
    <div class="home-car">
      <div class="container">
        <div class="module_nav">
          <p class="title"><b>优选汽车</b>&nbsp;&nbsp;&nbsp;&nbsp;<span>全场商品8.8折，&nbsp;&nbsp;心动吗</span></p>
          <router-link to="/newitem/car" class="more">查看更多&nbsp;&nbsp;>></router-link>
        </div>
        <el-carousel class="home-banner" trigger="click" v-if="advertList.advert&&advertList.advert.length" height="260px">
          <el-carousel-item  v-for="(item,index) in advertList.advert" :key="index">
            <a href="javascript:;">
              <div class="img" :style="{backgroundImage:`url(${urlPath}${item.picUrl})`}"></div>
            </a>
          </el-carousel-item>
        </el-carousel>
        <ul class="goods-list home-goods car-list" v-if="itemList.carList&&itemList.carList.length">
          <li class="item" :class="{'item-column':index===1}" v-for="(item,index) in itemList.carList.slice(0,5)" :key="index">
            <router-link :to="`/goodsdetail/${item.itemID}`">
              <div class="img">
                <img v-lazy="urlPath+item.picUrl" :alt="item.itemName">
                <p v-show="!!item.skuList[0].earnestPrice" class="dingjin"><span>定金</span>{{item.skuList[0].earnestPrice|toFixed(2)}}</p>
              </div>
              <div class="info">
                <p class="title">{{item.itemName}}</p>
                <div class="prices" v-if="index===0||index===1">
                  <p v-show="!!item.skuList[0].earnestPrice" class="dingjin"><span>定金</span>{{item.skuList[0].earnestPrice|toFixed(2)}}</p>
                  <p class="price">VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
                </div>
                <p class="price" v-else>VIP价：{{item.skuList[0].vipPrice|toFixed(2)}}</p>
                <p class="other_price">会员价：{{item.skuList[0].salesPrice|toFixed(2)}}
                  &nbsp;<del>&yen;{{item.skuList[0].marketPrice|toFixed(2)}}</del>
                </p>
              </div>
              <div class="info_hover">
                <el-button type="primary" class="btn">加入购物车</el-button>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!--广告3-->
    <div class="home-advertThree">
      <div class="container" v-if="advertList.advert4&&advertList.advert4.length">
        <a v-for="(item,index) in advertList.advert4" href="javascript:;" :key="index">
          <img v-lazy="urlPath+item.picUrl" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import {$httpSign} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'
  import RechargeList from 'base/Recharge'

  export default {
    data() {
      return {
        skuArray: [],    // 每日上新规格列表
        selectSku: {},   // 选中的sku值
        selectArray: [],
        noticeList:[],
        advertList: {},
        itemList: {},
        infoNum: 0,
        urlPath:getUrlDomain().urlPath,
        showInfo1:false,
        showInfo2:false,
        tabIndex:0
      }
    },
    computed: {
      loginStatus() {
        return this.$store.state.userName === ''
      }
    },
    mounted() {
      this.getAdvertList()
      this.getItemList()
      this.getList()
    },
    methods: {
      getTab(a){
        this.tabIndex=a
      },
      tabMouseOut(){
        if(this.tabIndex==0){
          this.showInfo1=false
        }else{
          this.showInfo2=false
        }
      },
      tabMouseOver(){
        if(this.tabIndex==0){
          this.showInfo1=true
        }else{
          this.showInfo2=true
        }
      },
      getList(){
        $httpSign({
          url:'/informs/infromsType',
          params:{
            from:0,
            limit:5,
            informsType:2
          },
          success:function(data){
            this.noticeList=data.informsList.slice(0,5)

            var i=0
            var len=this.noticeList.length===5?5:this.noticeList.length
            var _this=this
            if(len>0){
              var timer=setInterval(function(){
                if(!_this.$refs.noticeList){
                  clearInterval(timer)
                }else{
                  i++
                  if(i<len){
                    _this.$refs.noticeList.style.transform=`translate3d(0,${-i*40}px,0)`
                  }else{
                    _this.$refs.noticeList.style.transform='translate3d(0,0,0)'
                    i=0
                  }
                }
              },5000)
            }
          }.bind(this)
        })
      },
      _initSkuArray() {
        var arr = new Array()
        var itemList = this.itemList.new[this.infoNum]
        var len = itemList.skuPropValue.split(';').length
        // 初始化
        this.selectSku = itemList.skuList[0]

        itemList.skuPropValue.split(';').forEach((value) => {
          arr.push({
            name: value,
            lists: []
          })
        })

        // 将规格无重复放入arr
        itemList.skuList.forEach((item) => {
          for (var i = 0; i < len; i++) {
            var list = arr[i].lists
            if (list.indexOf(item['skuName' + i]) === -1) {
              list.push(item['skuName' + i])
            }
          }
        })

        this.skuArray = arr
        this.selectSkuArray(this.selectSku.skuName0, 0)
      },
      selectSkuArray(name, i, e) {
        var itemList = this.itemList.new[this.infoNum]
        var len = itemList.skuPropValue.split(';').length
        if (e && e.target.className.indexOf('noexist') >-1 ) {
          return false
        } else {
          if (typeof e !== 'undefined') {
            this.selectSku['skuName' + i] = name
            // 获取选中的规格参数
            itemList.skuList.forEach((item) => {
              if (item.skuName === this.selectSku.skuName) {
                this.selectSku = JSON.parse(JSON.stringify(item))
                return
              }
            })
          }

          for (var j = 0; j < len; j++) {
            this.selectArray[j] = []
          }
          itemList.skuList.forEach((item) => {
            if (item['skuName' + i] === name) {
              for (var j = 0; j < len; j++) {
                if (this.selectArray[j].indexOf(item['skuName' + j]) === -1 && j !== i) {
                  this.selectArray[j].push(item['skuName' + j])
                }
              }
            }
          })
          this.selectArray[i] = this.skuArray[i].lists
        }
      },
      //商品接口
      getItemList() {
        $httpSign({
          url:'index/getItemList',
          success:function(data){
            this.itemList = data
            this._initSkuArray()
          }.bind(this)
        })
      },
      //广告接口
      getAdvertList() {
        $httpSign({
          url:'/index/getAdvertList',
          success:function(data){
            this.advertList = data
          }.bind(this)
        })
      },
      //每日上按钮
      topInfo(type) {
        let Num = this.itemList.new.length
        if (typeof type ==='number') {
          if (type === 1) {
            this.$refs.infoS.style.top = 0
          } else if (type === (Num - 1)) {
            this.$refs.infoS.style.top = -(Num - 3) * 135 + 'px'
          } else if (type > 1) {
            this.$refs.infoS.style.top = -(type - 1) * 135 + 'px'
          }
          this.infoNum = type
        } else {
          if(type==='-1'){
            this.infoNum++
            if (this.infoNum > (Num - 1)) {
              this.infoNum = 0
              this.$refs.infoS.style.top = '0px'
            } else if (this.infoNum > (Num - 3)) {
              this.$refs.infoS.style.top = -(Num - 3) * 135 + 'px'
            } else {
              this.$refs.infoS.style.top = -this.infoNum * 135 + 'px'
            }
          }else if(type==='+1'){
            this.infoNum--
            if (this.infoNum <0) {
              this.infoNum = Num - 1
              this.$refs.infoS.style.top = -(Num - 3) * 135 + 'px'
            } else if (this.infoNum > (Num - 3)) {
              this.$refs.infoS.style.top = -(Num - 3) * 135 + 'px'
            } else {
              this.$refs.infoS.style.top = -this.infoNum * 135 + 'px'
            }
          }
        }
        this._initSkuArray()
      },
      itemHandle(itemID) {
        this.$router.push(`/goodsDetail/${itemID}`)
      },
      // 立即购买
      toGoBuy() {
        this.$router.push({
          name: 'confirmOrder',
          query: {itemID: this.selectSku.itemID, skuID: this.selectSku.skuID, num: 1}
        })
      }
    },
    components:{
      RechargeList
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  .home{
    &-banner{
      .el-carousel{
        &__arrow{
          display:none
        }
        &__indicators{
          bottom:16px
        }
        &__indicator{
          width: 10px
          height: 10px
          margin: 0 6px
          border-radius: 50%;
          background-color: #fff
          padding:0
          opacity: 1
          &.is-active{
            background-color: $main-color
            opacity: 0.8
          }
        }
        &__button{
          width: 10px
          height: 10px
          border-radius: 50%;
          padding:0
          background-color:transparent
        }
      }
      .img{
        width:100%
        height:100%
        background: no-repeat top center/auto 100% #f3f3f3
      }
    }
  }
</style>

<style scoped lang="stylus">
  @import '~common/stylus/goodslist.styl'
  @import "~common/stylus/variable.styl"
  .home {
    color: $size-color
    position: relative
    .module_nav {
      display: flex
      justify-content: space-between
      align-items: center
      .title {
        padding: 40px 0
        font-size: $font-xl
        color: $size-color
        span {
          font-size: $font-m
          color: $size-color1
        }
      }
      .more {
        font-size: $font-s
        color: $size-color1
        hover-hand()
      }
    }
    &-goods{
      display:flex
      flex-wrap:wrap
      justify-content: left
      li:hover{
        hover-goods()
        .img .dingjin{
          display:flex
        }
      }
      .dingjin{
        display:flex
        justify-content: center
        line-height:20px
        color:$num-color
        padding-bottom:0
        span{
          width:52px
          height:20px
          text-align:center
          font-size:$font-x
          color:#fff
          background-color:#f9c77c
          border-radius:10px
          margin-right:10px
        }
      }
      .img{
        position:relative
        .dingjin{
          position:absolute
          bottom:10px
          width:100%
          display:none
        }
      }
    }
    &-notice{
      border-bottom: 1px solid $border-color
      .container{
        position:relative
        padding:0 150px 0 30px
        height: 40px
        line-height:40px
        font-size: $font-s
        overflow:hidden
        background:url('~images/msg.png') no-repeat left center
      }
      .notice-list{
        transition:all .2s linear
        a{
          display:block
          ellipsis-simple()
        }
      }
      .more{
        position:absolute
        top:0
        right:0
        color:$size-color3
        &:hover {
          color: $hover-color
        }
      }
    }
    &-recommend {
      .title{
        position:relative
      }
      .ques_btn{
        color:$size-color3
        cursor:pointer
      }
      .ques_cont{
        position: absolute
        z-index: 10
        background: rgba(0,0,0,0.75)
        color: #fff
        font-size: 14px
        line-height: 24px
        padding: 20px
        border-radius: 6px
        top: 28px
        right:-30px
        width:640px
        p{
          text-indent:2em
        }
        .text_center{
          font-size:$font-m
          text-align:center
        }
        .font_16{
          font-weight:bold
          text-indent:0
          margin:10px 0 5px
        }
        &:after{
          content:''
          position:absolute
          border: 10px solid rgba(0,0,0,0.75)
          top: -20px
          right: 30px
          border-color: transparent transparent rgba(0,0,0,0.75) transparent
        }
      }
    }
    &-newDay {
      margin-top: 60px
      background-color: #f8f2f2
      padding: 10px 0 60px 0
      .container {
        .newDay {
          display: flex
          &-l {
            width: 160px
            background-color: #fff
            padding: 35px 15px
            margin-right: 10px
            position: relative
            height: 470px
            &-info {
              position: relative
              height: 420px
              overflow: hidden
            }
            &-infoS {
              position: absolute
              top: 0
              transition: all .2s linear
              p {
                width: 130px
                height: 130px
                border: 4px solid transparent
                margin-bottom: 5px
                transition: all .2s linear
                cursor: pointer
                background-color:#fff
                &+p{

                }
                &:hover, &.active {
                  border-color: #af7c7b
                }
                img {
                  width: 100%
                  height: 100%
                  padding:15%
                }
              }
            }
            .newDay-btn{
              cursor: pointer
              position: absolute
              line-height:0
              left: 50%
              transform: translateX(-50%)
              opacity: .3
              transition: all .2s linear
              &:hover {
                opacity: 1
              }
              img {
                width: 90px
              }
            }
            .bot-btn {
              bottom: 0
            }
            .top-btn{
              top:0
            }
          }
          &-r {
            flex: 1
            background-color: #fff
            padding: 15px
            display: flex
            &_l {
              margin-right: 20px
              img {
                width: 420px
                height: 420px
                padding:15%
              }
            }
            &_r {
              flex: 1
              padding: 20px
              font-size: $font-s
              .title {
                font-size: $font-l
                letter-spacing: 1px
                height: 48px
                line-height: 24px
                ellipsis-mulit(2)
                hover-hand()
                b{font-weight:normal}
              }
              .price {
                margin-top: 50px
                display: flex
                justify-content: space-between
                p {
                  &:nth-child(1) {
                    display: flex
                    align-items: center
                    span {
                      &:nth-child(1) {
                        padding: 4px 10px
                        background-color: #f9c77c
                        border-radius: 20px
                        color: #fff
                        margin-right: 5px
                      }
                      &:nth-child(2) {
                        color: $num-color
                        font-size: $font-xxl
                      }
                    }
                  }
                  &:nth-child(2) {
                    color: $size-color3
                  }
                }
              }
              .G_price {
                margin-top: 16px
                color: $size-color3
                s {
                  margin-left: 40px
                  color: $size-color3
                }
              }
              .spec {
                margin-top: 30px
                p {
                  color: $size-color1
                  display: flex
                  align-items: center
                  span {
                    color: $size-color
                    padding: 10px 20px
                    transition: all .2s linear
                    display:block
                    hover-hand()
                    &:hover, &.active {
                      color: $hover-color
                    }
                  }
                }
              }
              .handlBtn {
                margin-top: 66px
                display: flex
                align-items: center
                button {
                  width: 180px
                  height: 50px
                }
                i {
                  font-size: 30px
                  color: $border-color
                  margin-left: 30px
                }
              }

            }
          }
        }
      }
    }

    &-week {
      .week{
        &-wrap{
          display: flex
          justify-content: left
        }
        &-adv{
          width:260px
          height:566px
          display:flex
          align-items:center
          background-color:#f8f8f8
          img{
            width:100%
            height:auto
          }
        }
        &-list{
          flex:1
          margin-left:0
          .item{
            width:262px
            height:376px
            margin-left:10px
            margin-bottom:10px
            .img{
              width:261px
              height:261px
            }
            .info_hover{
              top:261px
            }
          }
          .item-column{
            width:400px
            height:180px
            .img{
              width:180px
              height:180px
            }
            .info_hover{
              left:180px
              top:0
            }
          }
        }
      }
    }
    &-special {
      .special{
        &-list{
          margin-left:-10px
          .item{
            width:260px
            height:376px
            margin-left:10px
            margin-bottom:10px
            &:after{
              content:''
              position:absolute
              left:0
              top:0
              width:100%
              height:2px
              background-color:#d2c269
              z-index:11
            }
            &:nth-child(2n):after{
              background-color:$main-color
            }
            .img{
              width:260px
              height:260px
            }
            .info_hover{
              top:260px
            }
          }
        }
      }
    }
    &-car{
      .car-list{
        position:relative
        padding-left:370px
        height:540px
        margin-top:20px
        margin-left:0
        .item{
          width:226px
          height:330px
          margin-left:10px
          margin-bottom:10px
          &:first-child{
            position:absolute
            left:0
            top:0
            width:370px
            height:540px
            margin-left:0
            .img{
              width:370px
              height:370px
            }
            .info_hover{
              top:370px
            }
            .title{
              font-size:$font-m
            }
            .prices{
              display: flex
              justify-content: space-between
              p{
                padding:10px 0
              }
              p:last-child{
                color:$size-color2
              }
            }
          }
          .img{
            width:226px
            height:226px
          }
          .info_hover{
            top:226px
          }
          .price{
            padding:2px 0
          }
        }
        .item-column{
          width:700px
          height:200px
          padding-right:200px
          .img{
            position:absolute
            right:0
            width:200px
            height:200px
          }
          .info_hover{
            left:0
            top:0
            right:200px
          }
          .prices{
            display: flex
            p{
              padding:10px 0
            }
            p:last-child{
              color:$size-color2
              margin-top:0
              margin-left:50px
            }
          }
        }
      }
    }
    &-advert{
      margin:20px auto 0
      background-color:#f8f8f8
      text-align:center
      width:100%
      a{
        display:block
      }
      &.container{
        width:1080px
      }
      img{
        height:100%
      }
      .img{
        width:100%
        height:100px
        background:no-repeat center top/auto 100%
      }
    }
    &-advertThree {
      margin-top: 40px
      margin-bottom: 120px
      .container {
        display: flex
        a {
          width:354px
          height: 200px
          overflow: hidden
          cursor: pointer
          background-color:#f8f8f8
          display:block
          text-align:center
          &+a{
            margin-left:9px
          }
          img {
            height: 100%
          }
          &:hover {
            img {
              transform: scale(1.05, 1.05)
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="switch" v-if="type==1">
    <a href="javascript:;" class="switch-delete" @click="hideDialog"><i class="el-icon-close"></i></a>
    <table class="switch-table">
      <tr>
        <th width="120">转换编号</th><th width="140">日期</th><th>转出数量</th><th>服务费</th><th>转出时汇率</th><th>转让数量</th><th>状态</th>
      </tr>
      <tr v-if="totalPage===0">
        <td colspan="7">暂未转出记录</td>
      </tr>
      <tr v-for="order in orderList" :key="order.transno">
        <td>980890099</td>
        <td>2018-05-01 16:24:24</td>
        <td>10000.00</td>
        <td>1500</td>
        <td>1人民币=1彩云金</td>
        <td>80000</td>
        <td>成功</td>
      </tr>
    </table>
    <el-pagination background layout="prev, pager, next" :total="totalPage" :page-size="sizePage" prev-text="上一页" next-text="下一页" @current-change="getswitchList" v-if="totalPage/sizePage>1" class="switch-pages"></el-pagination>
  </div>
</template>

<script>
  import {$http,$httpSign} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data(){
      return {
        sizePage:16,
        totalPage:0
      }
    },
    props:{
      type:String
    },
    mounted(){
      if(this.type===1){
        this.getswitchList(1)
      }else{
        this.getAccountPicList()
      }

    },
    methods:{
      getswitchList(a){
        $httpSign({
          url:'/person/queryPay',
          method:'post',
          data:{
            baseType:0,
            pageNo:a,
            pageSize:this.sizePage
          },
          success:function(data){
            this.orderList=data.list
            this.totalPage=data.query.totalCount
          }.bind(this)
        })
      },
      getAccountPicList(){
        $httpSign({
          url:'/account/accountPicList',
          method:'post',
          params:{
            distributorID:this.$store.state.userInfo.distributorID
          },
          success:function(data){
            this.accountPicList=data.accountPicList
          }.bind(this)
        })
      },
      hideDialog(){
        this.$emit("on-hide-dialog",false)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .switch{
    position:absolute
    top:0
    min-height:600px
    width:760px
    z-index:10
    background-color:#fff
    box-shadow:0 1px 12px rgba(0,0,0,0.2)
    padding-bottom:30px
    &-pages{
      text-align:center
    }
    &-delete{
      color:#fff
      position:absolute
      right:1px
      top:1px
      background-color:#000
      font-size:24px
    }
    &-table{
      line-height:20px
      th{
        font-size:$font-s
        font-weight:normal
        height:56px
        color:#fff
        background-color:$main-color
        border:1px solid $border-color
      }
      td{
        font-size:$font-x
        color:$size-color2
        padding:10px
        border:1px solid $border-color
        text-align:center
        &:first-child{
          word-wrap: break-word
        }
      }
    }
  }
</style>

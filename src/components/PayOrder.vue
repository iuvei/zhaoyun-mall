<template>
  <div id="shopcart" style="padding-bottom:90px">
    <div class="container order">
      <shop-step step="3"></shop-step>

      <div class="order-info">
        <p>请您及时付款，以便尽快处理您的订单</p>
        <p>订单号：<em>{{trade.tradeNo}}</em>　　订单金额：<em>{{trade.payment|toFixed(2)}}</em></p>
        <p>请在订单提交后1天内完成付款，否则订单自动取消</p>
        <a href="javascript:;" class="btn" @click="showDetail=!showDetail">订单详情 <i class="el-icon-arrow-up" :class="{'on':showDetail}"></i></a>
        <div class="detail" v-if="showDetail">
          <p>订单编号：{{trade.tradeNo}}</p>
          <p>收货地址：{{trade.province}} {{trade.city}} {{trade.district}} {{trade.address}}</p>
        </div>
      </div>
      <div class="order-yue">
        <span class="cur-yue"><i class="icon-yue"></i>账号可用余额：{{balance}}</span>
        <span class="pay-yue" v-if="balance>=totalAmount">请支付 {{trade.payment|toFixed(2)}}</span>
        <span class="pay-yue" v-if="balance<totalAmount">支付金额必须大于会员价：{{totalAmount|toFixed(2)}}，请充值</span>
      </div>
      <div class="order-btns" v-if="balance>=totalAmount">
        <el-form :model="pwdForm" ref="pwdForm" :rules="rules2" label-width="80px" style="width:420px">
          <el-form-item prop="pwd" label="支付密码" class="inp_pwd">
            <el-input type="password" v-model="pwdForm.pwd" auto-complete="off" name="payword" style="display:none;width:0;height:0;"></el-input>
            <el-input type="password" v-model="pwdForm.pwd" auto-complete="new-password" name="payword"></el-input>
            <router-link :to="{path:'/user/modifyPay',query:{from:`/payorder/${tradeID}/paytype/0`}}">{{isSetPay?'忘记密码？':'设置密码'}}</router-link>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="payEvent('pwdForm')">立即付款</el-button>
      </div>
      <pay-recharge v-else></pay-recharge>
    </div>
  </div>
</template>

<script>
  import ShopStep from 'base/Shop/ShopStep'
  import PayRecharge from 'base/PayRecharge'
  import {mapState} from 'vuex'
  import {orderDetail,$httpSign,isSetPay} from 'common/js/httpAll'

  export default {
    data() {
      return {
        isSetPay:false,
        totalAmount:0,
        tradeID:this.$route.params.orderid,
        payType:this.$route.params.paytype,
        showDetail:false,
        trade:{},
        pwdForm:{
          pwd:''
        },
        rules2:{
          pwd:[
            {required: true, message: '支付密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed:{
      account(){
        return this.$store.state.userInfo.phone
      },
      ...mapState(['balance'])
    },
    components:{
      ShopStep,
      PayRecharge
    },
    mounted(){
      this.getOrder()
      this.setPay()
    },
    methods:{
      changePayword(){
        this.$refs.payword.type='password'
        console.log(this.$refs)
      },
      setPay(){
        isSetPay((data)=>{
          this.isSetPay=data
        })
      },
      getOrder(){
        orderDetail(this.tradeID,function(data){
          if(data.trade.tradeStatus!==1){
            this.$router.push({path:`/payresult/${this.tradeID}`})
          }else{
            this.trade=data.trade

            this.trade.tradeOrderList.forEach((item)=>{
              if(item.earnestPrice!==0){
                this.totalAmount+=item.earnestPrice
              }else{
                this.totalAmount+=item.salesPrice
              }
            })
          }
        }.bind(this))
      },
      // 支付接口
      payEvent(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $httpSign({
              url:'/trade/pay',
              method:'post',
              params:{
                tradeId:this.tradeID,
                payword:this.pwdForm.pwd
              },
              success:function(data){
                this.$router.push({path:`/payresult/${this.tradeID}`})
              }.bind(this),
              error:function(err){
                this.$message.error(err)
              }.bind(this)
            })
          } else {
            console.log('立即付款 error submit!!');
            return false;
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .order{
    &-info{
      width:100%
      background-color:#f8f8f8
      text-align:center
      color:$size-color2
      padding:26px 140px
      &>p:nth-child(1){
        line-height:24px
        font-size:$font-s
      }
      &>p:nth-child(2){
        line-height:28px
        font-size:$font-m
        em{
          color:$main-color
          font-style:normal
        }
      }
      &>p:nth-child(3){
        font-size:$font-x
        color:$size-color3
        line-height:20px
      }
      .btn{
        font-size:$font-s
        color:$size-color2
        line-height:40px
        .el-icon-arrow-up{
          font-weight:bold
          transition: all .4s linear
          &.on{
            transform: rotate(180deg)
          }
        }
        &:hover{
          color:$hover-color
        }
      }
      .detail{
        border:1px dashed $border-color
        padding:8px 0
        line-height:22px
        font-size:$font-x
        color:$size-color3
      }
    }
    &-yue{
      display:flex
      font-size:$font-s
      line-height:56px
      justify-content: space-between
      border-bottom:1px dashed $border-color
      margin-top:30px
      &>span{
        display:block
      }
      .icon-yue{
        color:$num-color
        margin-right:10px
      }
      .pay-yue{
        color:$main-color
      }
    }
    &-btns{
      margin-top:36px
      display:flex
      justify-content: space-between
      align-items: flex-start
      button{
        width:150px
      }
    }
  }
  .pay-result{
    padding-top:50px
    text-align:center
    .status{
      color:$size-color2
      font-size:$font-m
      font-weight:bold
      line-height:30px
      .el-icon-circle-close,.el-icon-circle-check{
        font-size:30px
        margin-right:20px
        vertical-align: top
      }
      .el-icon-circle-close{
        color:$num-color
      }
      .el-icon-circle-check{
        color:#519fa2
      }
    }
    .desc{
      font-size:$font-x
      color:$size-color3
      line-height:20px
      margin-top:20px
      i{
        color:$main-color
        font-style:normal
      }
    }
    .btns{
      margin-top:30px
      .el-button{
        width:150px
      }
      .home-btn{
        color:$main-color
        font-size:$font-s
        margin-left:20px
      }
    }
  }
</style>
<style lang="stylus">
  @import '~common/stylus/dialog.styl'
  .inp_pwd{
    .el-form-item__content{
      display:flex
      .el-input{
        width:250px
        margin-right:10px
      }
    }
  }
</style>

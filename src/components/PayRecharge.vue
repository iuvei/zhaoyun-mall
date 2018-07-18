<template>
  <div id="shopcart" style="padding-bottom:90px">
    <div class="container order">
      <div class="order-info">
        <p>请您及时付款</p>
        <p v-if="recharge.data.rechargeAmount"><span style="margin-right:40px">充值金额：<em>{{recharge.data.rechargeAmount|toFixed(2)}}</em></span>充值号码：<i>{{recharge.phone}}</i></p>
      </div>
      <div class="order-yue">
        <span class="cur-yue"><i class="icon-yue"></i>账号可用余额：{{balance}}</span>
        <span class="pay-yue" v-if="balance&&balance>=recharge.data.numberAmount">请支付 {{recharge.data.amount|toFixed(2)}}</span>
        <span class="pay-yue" v-if="balance&&balance<recharge.data.numberAmount">支付金额必须大于充值金额：{{recharge.data.numberAmount|toFixed(2)}}，请充值</span>
      </div>
      <div class="order-btns" v-if="balance&&balance>=recharge.data.numberAmount">
        <el-form :model="pwdForm" ref="pwdForm" :rules="rules2" label-width="80px" style="width:420px">
          <el-form-item prop="pwd" label="支付密码" class="inp_pwd">
            <el-input type="password" v-model="pwdForm.pwd" auto-complete="off" name="payword" style="display:none;width:0;height:0;"></el-input>
            <el-input type="password" v-model="pwdForm.pwd" auto-complete="new-password" name="payword"></el-input>
            <router-link :to="{path:'/user/modifyPay',query:{from:`/payrecharge?froms=${this.from}`}}">{{isSetPay?'忘记密码？':'设置密码'}}</router-link>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="payEvent('pwdForm')">立即付款</el-button>
      </div>
      <pay-recharge v-else></pay-recharge>
    </div>
  </div>
</template>

<script>
  import PayRecharge from 'base/PayRecharge'
  import {mapState} from 'vuex'
  import {orderDetail,$httpSign,$httpSign2,isSetPay} from 'common/js/httpAll'

  export default {
    data() {
      return {
        from:'',
        recharge:{
          phone:'',
          id:'',
          type:'',
          data:{}
        },
        isSetPay:false,
        recForm:{
          money:''
        },
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
      ...mapState(['balance'])
    },
    mounted(){
      this.from=this.$route.query.froms
      this.recharge.phone=this.from.split('-')[0]
      this.recharge.id=this.from.split('-')[1]
      this.recharge.type=this.from.split('-')[2]

      this.getData()  // 获取充值数据
      this.setPay()
    },
    methods:{
      // 获取充值数据
      getData(){
        $httpSign({
          url: '/pay/getOption',
          method: 'post',
          params: {
            type: this.recharge.type
          },
          success:function(data){
            this.recharge.data = data.list.find((item)=>{
              return item.id==this.recharge.id
            })
          }.bind(this)
        })
      },
      changePayword(){
        this.$refs.payword.type='password'
        console.log(this.$refs)
      },
      setPay(){
        isSetPay((data)=>{
          this.isSetPay=data
        })
      },
      // 支付接口
      payEvent(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.recharge.type==0){
              $httpSign2({
                url: '/pay/phoneRecharge',
                method: 'post',
                params: {
                  id: this.recharge.id,
                  phone: this.recharge.phone,
                  payword:this.pwdForm.pwd
                }
              }).then((res)=>{
                if(res.data.code==='0'){
                  this.$message({
                    type: 'success',
                    message: res.data.errorMsg
                  })
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.errorMsg
                  })
                }
                if(res.data.code!=10037){
                  this.$router.push({path:'/home'})
                }
              })
            }else{
              $httpSign2({
                url: '/pay/oilRecharge',
                method: 'post',
                params: {
                  id: this.recharge.id,
                  number: this.recharge.phone,
                  payword:this.pwdForm.pwd
                }
              }).then((res)=>{
                if(res.data.code==='0'){
                  this.$message({
                    type: 'success',
                    message: res.data.errorMsg
                  })
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.errorMsg
                  })
                }
                this.$router.push({path:'/home'})
              })
            }
          }
        })
      }
    },
    components:{
      PayRecharge
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
      margin-top:40px
      font-size:$font-m
      &>p{
        line-height:24px
        &:nth-child(1){
          margin-bottom:10px
        }
        em{
          color:$main-color
          font-weight:bold
          font-style:normal
        }
        i{
          font-weight:bold
          font-style:normal
        }
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

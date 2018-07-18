<template>
	<div id="payRecharge">
		<div class="order-recharge">
      <el-form :model="recForm" :rules="rules" ref="recForm" label-width="80px" style="width:360px">
        <el-form-item label="充值账号">{{account}}</el-form-item>
        <el-form-item prop="money" label="充值金额">
          <el-input v-model="recForm.money" auto-complete="off" placeholder="充值金额为500或500的整数倍">
          </el-input>
        </el-form-item>
        <el-form-item prop="code" label="邀 请 码" v-if="codeStatus===0">
          <el-input v-model="recForm.code" auto-complete="off" placeholder="请输入11位手机或6位数字邀请码">
          </el-input>
        </el-form-item>
        <el-form-item label="邀 请 码" v-else-if="codeStatus===2">
          <span>-</span>
        </el-form-item>
        <el-form-item label="邀 请 码" v-else-if="codeStatus===1">
          <span>{{code}}</span>
        </el-form-item>
      </el-form>
      <ul class="paylist">
        <li v-for="(recharge,index) in rechargeList" :key="recharge.type" @click="curType=recharge.type" :class="{'active':curType===recharge.type}">
          <i class="icon" :class="['icon'+(index+1)]"></i>
          <i class="name">{{recharge.name}}</i>
        </li>
      </ul>
    </div>
    <div class="order-btns">
      <div></div>
      <el-button type="primary" @click="rechargeEvent('recForm')">立即充值</el-button>
    </div>
    <!-- 微信二维码 -->
    <div class="el-dialog__wrapper el-recharge-dialog" style="z-index: 2001;" v-show="dialogVisible">
      <div class="el-dialog">
        <div class="el-dialog__header">
          <span class="el-dialog__title">微信支付</span>
          <button type="button" aria-label="Close" class="el-dialog__headerbtn">
            <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <div class="ercode" ref="qrcode"></div>
        </div>
      </div>
    </div>
    <!-- 充值失败状态 -->
    <el-dialog title="充值" :visible.sync="dialogVisible2">
      <div class="pay-result">
        <p class="status"><i class="el-icon-circle-close"></i>充值失败</p>
        <p class="desc">啊哦，账户充值失败，您还可以再次进行充值</p>
      </div>
    </el-dialog>
	</div>
</template>

<script>
	import QRCode from 'common/js/qrcode.min'
	import {mapActions} from 'vuex'
  import {$httpSign,balanceData} from 'common/js/httpAll'

  export default {
    data() {
      var checkPrice=(rule,value,callback)=>{
        if(!value.trim()){
          callback(new Error('请输入充值金额'))
        }else if(!/^\d+$/.test(value)&&value=='0'){
          callback(new Error('充值金额为500或500的整数倍！'))
        }else if(Number(value)%500!==0){
          callback(new Error('充值金额为500或500的整数倍！'))
        }else{
          callback()
        }
      }
      var checkCode=(rule,value,callback)=>{
      	var params={}
    		if(!value.trim()){
    			callback()
    		}else if(!/^(13|15|17|18|19)[0-9]{9}$/.test(value)||!/^\d{6}$/.test(value)){
    			callback(new Error('请填写正确的邀请码！'))
    		}else if(value==this.userInfo.phone){
    			callback(new Error('请不要填写自己的手机号！'))
    		}else{
    			if(value.trim().length===6){
    				params.invitationVode=this.form.code
    			}else if(value.trim().length===11){
    				params.phoneCode=this.form.code
    			}
    			$httpSign({
    				url:'/invition/checkCode',
    				method:'post',
    				params,
    				success:function(data){
    					callback()
    				}.bind(this),
    				error:function(err){
    					if(err=='尊敬的客户，您的邀请码已经被绑定，您不能再绑定对方的邀请码！'){
    						this.codeStatus=2
    						this.form.code=''
    					}
    					callback(err)
    				}.bind(this)
    			})
    		}
      }
      return {
        dialogVisible:false,
        dialogVisible2:false,
        code:0,
				codeStatus:0,
        timer:0,
        rechargeList:[{
          name:'微信',
          type:2
        },{
          name:'支付宝',
          type:0
        }],
        curType:0,  // 充值方式
        recForm:{
          money:'',
          code:''
        },
        rules:{
          money:[
            {validator:checkPrice,trigger:'blur'}
          ]
        }
      }
    },
    computed:{
      account(){
        return this.$store.state.userInfo.phone
      }
    },
    mounted(){
    	this.getInviteCode()
    },
    methods:{
    	// 获取邀请码
    	getInviteCode(){
    		balanceData(function(data){
          this.code=data.code
    			// 0:未填写；1:已填写；2：不能填写
    			if(data.code){
    				this.codeStatus=1
    			}else{
    				this.codeStatus=0
    			}
    		}.bind(this))
    	},
      // 关闭弹窗
      closeDialog(){
        this.dialogVisible=false
        this.$refs.qrcode.innerHTML=''
        clearInterval(this.timer)
      },
      // 充值接口
      rechargeEvent(formName){
        var _this=this
        // 微信支付
        function weichatPay(data) {
          _this.dialogVisible=true
          var qrcode = new QRCode(_this.$refs.qrcode, {
            width : 180,//设置宽高
            height : 180
          });
          qrcode.makeCode(data.code_url)

          _this.timer=setInterval(getOrderStatus.bind(_this),2000)
          function getOrderStatus(){
            $httpSign({
              url:'/pay/weixinGetResult',
              method:'post',
              params:{
                transno:data.transno
              },
              success:function(data){
                this.recForm.money=''
                if(data.status===2){
                  this.SETBalance()
                  this.dialogVisible=false
                  this.dialogVisible2=false
                  this.recForm.money=''
                  clearInterval(_this.timer)
                }else if(data.status===1||data.status===3){
                  this.dialogVisible=false
                  this.dialogVisible2=true
                  clearInterval(_this.timer)
                }
              }.bind(this)
            })
          }
        }
        // 支付宝支付
        function zhifubPay(data){
          const div = document.createElement('div')
          div.innerHTML = data.from
          document.body.appendChild(div)
          document.forms.punchout_form.submit()
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
          	var params={
          		amount:this.recForm.money,
          		type:this.curType,
          		returnUrl:location.href
          	}
          	if(this.code&&this.code.length===11||(!this.code&&this.recForm.code.length===11)){
          		params.phoneCode=this.code?this.code:this.recForm.code
          	}else if(this.code&&this.code.length===6||(!this.code&&this.recForm.code.length===6)){
          		params.invitationVode=this.code?this.code:this.recForm.code
          	}
            $httpSign({
              url:'/pay/pay',
              method:'post',
              params,
              success:function(data){
                // 支付宝支付
                if(this.curType===0){
                  zhifubPay(data)
                }
                // 微信支付
                if(this.curType===2){
                  weichatPay(data)
                }
              }.bind(this)
            })
          } else {
            console.log('立即付款 error submit!!');
            return false;
          }
        })
      },
      ...mapActions(['SETBalance'])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .order{
    &-recharge{
      display:flex
      padding:40px 0
      border-bottom:1px dashed $border-color
      input{
        width:240px
      }
      .el-form{
        padding-right:30px
      }
    }
    .paylist{
      border-left:1px solid $border-color
      padding-left:50px
      display:flex
      align-items:center
      justify-content: space-between
      li{
        position:relative
        width:110px
        height:64px
        border:1px solid $border-color
        border-radius:2px
        text-align:center
        cursor:pointer
        line-height:24px
        &+li{
          margin-left:60px
        }
        &:before{
          content:''
          position:absolute
          left:-22px
          top:26px
          width:12px
          height:12px
          border:1px solid $border-color
          border-radius:50%
        }
        &:hover,&.active{
          border-color:$hover-color
          &:before{
            border-color:$main-color
            background-color:$main-color
          }
        }
        .icon{
          display:block
          width:24px
          height:24px
          margin:10px auto 0
          background-image:url('~images/pay_icon.png')
        }
        for i in 1 2 3 4{
          .icon{i}{
            background-position:0 -24px*i
          }
        }
        .name{
          font-size:$font-s
          color:$size-color2
          font-style:normal
        }
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
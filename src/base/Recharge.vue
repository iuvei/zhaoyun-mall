<template>
	<el-tabs type="border-card" v-model="activeTab" class="rec-tabs" @tab-click="tabClick">
    <el-tab-pane name="phone">
      <span slot="label"><i class="rec-icon rec-icon1"></i> 话费充值</span>
      <div class="inpbox">
        <label>充值号码</label>
        <div class="inpitem">
          <el-input v-model="tel" clearable :maxlength="11" @input.native="checkPhone();checkEmpty()" style="width:340px"></el-input>
          <p class="error-tip">{{errorMsg}}</p>
        </div>
      </div>
      <div class="inpbox">
        <label>充值金额</label>
        <div class="inpitem" style="margin-left:-30px">
          <div class="selectPrice" v-for="recharge in rechargeList" :key="recharge.id" :class="{active:recharge.id===selectRecharge.id}" @click="selectRecharge=recharge;checkEmpty()">
            <span>&yen;{{recharge.rechargeAmount}}</span>
            <div class="hover">
              <span>&yen;{{recharge.marketAmount}}</span>
              <div class="info">
                <p>商城&nbsp;{{recharge.numberAmount}}</p>
                <p>VIP&nbsp;{{recharge.amount}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="inpbox">
        <div class="inpitem">
          <el-button @click="phoneRecharge" type="primary" style="width:200px" :disabled="!isDisabled1">立即充值</el-button>
          <span class="rec-tip">快来成为VIP，享受88折吧！</span>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane name="oil">
      <span slot="label"><i class="rec-icon rec-icon2"></i> 油卡充值</span>
      <div class="inpbox">
        <label>充值卡号</label>
        <div class="inpitem">
          <el-input v-model="cardid" clearable style="width:430px" :placeholder="oilTip" :maxlength="oilLength" @input.native="checkOil();checkEmpty()">
            <el-select v-model="oilType" slot="append" placeholder="请选择" style="width:100px" @change="changeOilType()">
              <el-option label="中石化" value="1"></el-option>
              <el-option label="中石油" value="2"></el-option>
            </el-select>
          </el-input>
          <p class="error-tip">{{errorMsg}}</p>
        </div>
      </div>
      <div class="inpbox">
        <label>充值金额</label>
        <div class="inpitem" style="margin-left:-30px">
          <div class="selectPrice" :class="{active:oil.id===selectOil.id}" v-for="oil in oilList"
                    :key="oil.id" @click="selectOil=oil;checkEmpty()">
            <span>&yen;{{oil.rechargeAmount}}</span>
            <div class="hover">
              <span>&yen;{{oil.marketAmount}}</span>
              <div class="info">
                <p>商城&nbsp;{{oil.numberAmount}}</p>
                <p>VIP&nbsp;{{oil.amount}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="inpbox">
        <div class="inpitem">
          <el-button @click="oilRecharge" type="primary" disabled style="width:200px">敬请期待</el-button>
          <span class="rec-tip">快来成为VIP，享受88折吧！</span>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {validates} from 'common/js/util'
  import {$httpSign} from 'common/js/httpAll'

  export default {
    data() {
      return {
      	activeTab:'phone',
        // 话费充值
        tel: '',
        rechargeList: [],
        selectRecharge: {},
        errorMsg: '',
        // 油卡充值
        oilType: '1',
        cardid: '',
        oilList: [],
        selectOil: {},
        oilTip:'请输入19位充值卡号',
        oilLength:19,

        isDisabled1:false,
        isDisabled2:false
      }
    },
    mounted() {
      this.getRechargeList()  // 话费
      this.tabOil()           // 油卡
    },
    methods: {
      tabClick(a){
        this.errorMsg=''
        this.$emit('update:tab', a.index)
      },
    	checkEmpty(){
    		if(this.activeTab=='phone'){
    			this.isDisabled1=JSON.stringify(this.selectRecharge)!='{}'&&this.tel.trim()
    		}else{
    			this.isDisabled2=JSON.stringify(this.selectOil)!='{}'&&this.cardid.trim()
    		}
    	},
    	changeOilType(){
    		this.tabOil()
    		this.errorMsg=''
    		this.cardid=''
    		if(this.oilType==1){
    			this.oilTip='请输入19位充值卡号'
    			this.oilLength=19
    		}else{
    			this.oilTip='请输入16位充值卡号'
    			this.oilLength=16
    		}
    	},
      // 手机充值数据接口
      getRechargeList() {
        $httpSign({
          url: '/pay/getOption',
          method: 'post',
          params: {
            type: 0
          },
          success:function(data){
            this.rechargeList = data.list
          }.bind(this)
        })
      },
      checkPhone() {
        if (validates.phone(this.tel)) {
          this.errorMsg = ''
          return true
        } else {
          this.errorMsg = '手机号格式不正确！'
          return false
        }
      },
      phoneRecharge() {
        // 未登录
        if (this.loginStatus) {
          this.$router.push({path: '/login'})
        } else {
          if (this.checkPhone()) {
            this.$router.push({path: `/payrecharge?froms=${this.tel}-${this.selectRecharge.id}-0`})
          }
        }
      },
      // 油卡充值接口
      tabOil() {
        $httpSign({
          url: '/pay/getOption',
          method: 'post',
          params: {
            type: this.oilType
          },
          success:function(data){
            this.oilList = data.list
          }.bind(this)
        })
      },
      checkOil(){
      	if(this.oilType==1){
      		if(/\d{19}/.test(this.cardid)){
      			this.errorMsg = ''
      			return true
      		}else{
      			this.errorMsg = '请输入19位充值卡号'
      			return false
      		}
      	}else{
      		if(/\d{16}/.test(this.cardid)){
      			this.errorMsg = ''
      			return true
      		}else{
      			this.errorMsg = '请输入16位充值卡号'
      			return false
      		}
      	}
      },
      oilRecharge() {
        if (this.loginStatus) {
          this.$router.push({path: '/login'})
        } else {
        	if(this.checkOil()){
          	this.$router.push({path: `/payrecharge?from=${this.cardid}-${this.selectOil.id}-${this.oilType}`})
        	}
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable.styl"
  .rec-tabs {
    .inpbox{
      position:relative
      padding:0
      padding-left:90px
      margin-bottom:20px
      label{
        position:absolute
        left:0
        line-height:40px
      }
      .inpitem{
        position:relative
        display:flex
        justify-content:left
        flex-wrap: wrap
      }
      .error-tip{
        position:absolute
        line-height:20px
        bottom:-20px
        font-size:$font-x
        color:$num-color
      }
    }
    .selectPrice{
      height:80px
      border:1px solid $border-color
      font-size:$font-xl
      color:#999
      text-align:center
      cursor:pointer
      margin-left:30px
      margin-bottom:10px
      &>span:first-child{
        line-height:78px
      }
      &.active,&:hover{
        border:1px solid $main-color
        &>span:first-child{
          opacity:0
        }
        .hover{
          opacity:1
        }
      }
      .hover{
        opacity:0
        display:flex
        transform:translateY(-78px)
        span{
          display:block
          min-width:80px
          padding:0 10px
          text-decoration:line-through
          line-height:78px
        }
        .info{
          min-width:120px
          padding:15px 10px 0 20px
          line-height:26px
          font-size:$font-s
          background-color:#fff2f2
          text-align:left
          p:first-child{
            color:$main-color
          }
          p:last-child{
            color:$num-color
            font-weight:bold
          }
        }
      }
    }
    .rec-tip{
      color:$main-color
      line-height:40px
      font-size:$font-s
      text-decoration:underline
      margin-left:20px
    }
  }
</style>
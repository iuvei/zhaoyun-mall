<template>
  <div class="container refund">
    <shop-steps :step="step" :titleArr="titleArr"></shop-steps>
    <div class="refund-step1" v-if="step===1">
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-form-item label="退款商品：">
          <ul>
            <li class="refund-goods">
              <img v-lazy="urlPath+order.picUrl">
              <div class="info">
                <p class="title">{{order.itemName}}</p>
                <p class="sku">规格：{{order.skuName}}</p>
              </div>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="退款金额：" class="refund-money" prop="money">
          <el-input :value="payment" v-model="form.money"></el-input>
          <p class="tip">最多{{payment}}，包括运费</p>
        </el-form-item>
        <el-form-item label="退款说明：" class="refund-desc" prop="desc">
          <el-input type="textarea" v-model="form.desc" placeholder="退款说明"></el-input>
        </el-form-item>
        <el-form-item label="上传图片：">
          <el-upload :action="filePath" list-type="picture-card" :limit="3" name="myfiles"
                     :on-remove="handleAvatarRemove" :on-success="handleAvatarSuccess" :before-upload="beforeUpload">
            <i class="el-icon-plus"></i>
            <i class="tip">最多3张</i>
          </el-upload>
        </el-form-item>
        <el-form-item class="refund-btns">
          <el-button type="primary" @click="refundEvent('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="refund-step2" v-if="step===2">
      <div class="refund-info">
        <i class="icon icon-edit"></i>
        <p class="status" v-if="$route.query.returnType == 0">退货退款申请提交成功</p>
        <p class="status" v-else>仅退款申请提交成功</p>
        <p class="desc">您的订单编号：<em>{{trade.tradeNo}}</em>商品申请的退款/退货已经提交审核，稍后请前往
          <router-link to="/user/refundList">个人中心 - 售后/退款</router-link>
          查看审核结果，如有疑问请拨打客服电话：<em>0571-89285518</em></p>
      </div>
    </div>
    <div class="refund-step1" v-if="step===3">
      <div v-if="returnType == 0">
        <div class="refund-info" v-if="returnOrder.billName">
          <i class="icon icon-right"></i>
          <p class="status">物流正在运输中（物流信息：{{returnOrder.billName}} / {{returnOrder.billNO}}）</p>
          <p class="desc">您的订单编号：<em>{{trade.tradeNo}}</em>商品已在寄回途中，如有疑问请拨打客服电话：<em>0571-89285518</em></p>
        </div>
        <div v-else>
          <div class="bill-msg">
            <p>退货联系人及电话：{{returnOrder.tradeReturnAddress.name}} {{returnOrder.tradeReturnAddress.phone}}</p>
            <p>退货地址：{{returnOrder.tradeReturnAddress.province}}/{{returnOrder.tradeReturnAddress.city}}/{{returnOrder.tradeReturnAddress.district}} {{returnOrder.tradeReturnAddress.addressDetail}}</p>
            <p v-if="returnOrder.remark">备注：{{returnOrder.remark?returnOrder.remark:'无'}}</p>
          </div>
          <el-form ref="form2" :model="form2" label-width="98px">
            <el-form-item label="物流公司：" class="refund-money">
              <el-input v-model="form2.billName"></el-input>
            </el-form-item>
            <el-form-item label="物流单号：" class="refund-money">
              <el-input v-model="form2.billNO"></el-input>
            </el-form-item>
            <el-form-item class="refund-btns">
              <el-button type="primary" @click="updataBill()">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="refund-detail" v-else>
        <div class="detail-top">
          <span class="price">退款总金额：<em>{{returnOrder.totalPrice}}</em></span>
          <span>成功退款时间：{{returnOrder.finishTime|time('yyyy-MM-dd hh:ss:mm')}}</span>
        </div>
        <div class="detail-body">
          <div class="refund-goods">
            <img v-lazy="urlPath+order.picUrl">
            <div class="info">
              <p class="title">{{order.itemName}}</p>
              <p class="sku">规格：{{order.skuName}}</p>
            </div>
          </div>
          <div class="pricelist">
            <p>订单编号：<i>{{trade.tradeNo}}</i></p>
            <p>商品单价：&yen;{{order.vipPrice}}</p>
            <p>运　　费：&yen;0</p>
            <p>商品总价：&yen;{{order.vipPrice}}</p>
          </div>
        </div>
        <div class="detail-foot">
          <p>退款编号：<i>{{returnOrder.returnID}}</i></p>
          <p>退款原因：{{returnOrder.description}}</p>
          <p>退款金额：&yen;{{returnOrder.totalPrice}}</p>
          <p>退款要求：仅退款</p>
          <p>申请件数：1</p>
        </div>
      </div>
    </div>
    <div class="refund-step1" v-if="step===4">
      <div class="refund-detail">
        <div class="detail-top">
          <span class="price">退款总金额：<em>{{returnOrder.totalPrice}}</em></span>
          <span>成功退款时间：{{returnOrder.finishTime|time('yyyy-MM-dd hh:ss:mm')}}</span>
        </div>
        <div class="detail-body">
          <div class="refund-goods">
            <img v-lazy="urlPath+order.picUrl">
            <div class="info">
              <p class="title">{{order.itemName}}</p>
              <p class="sku">规格：{{order.skuName}}</p>
            </div>
          </div>
          <div class="pricelist">
            <p>订单编号：<i>{{trade.tradeNo}}</i></p>
            <p>商品单价：&yen;{{order.vipPrice}}</p>
            <p>运　　费：&yen;0</p>
            <p>商品总价：&yen;{{order.vipPrice}}</p>
            <p>发货物流：{{order.logisticsName}} {{order.logisticsNo}}</p>
          </div>
        </div>
        <div class="detail-foot">
          <p>退款编号：<i>{{returnOrder.returnID}}</i></p>
          <p>退款原因：{{returnOrder.description}}</p>
          <p>退款金额：&yen;{{returnOrder.totalPrice}}</p>
          <p>退款要求：退货退款</p>
          <p>申请件数：1</p>
          <p>退货物流：{{returnOrder.billName}} {{returnOrder.billNO}}</p>
          <p>货物状态：已寄回</p>
        </div>
      </div>
    </div>
    <div class="refund-foot">
      <router-link :to="`/orderDetail/${trade.tradeID}`">返回订单</router-link>
      |
      <router-link to="/" class="c_af7b7a">商城首页</router-link>
    </div>
  </div>
</template>

<script>
  import ShopSteps from 'base/Shop/ShopSteps'
  import {getUrlDomain,getOrderStatus} from 'common/js/util'
  import {$httpSign, orderDetail} from 'common/js/httpAll'

  export default {
    data() {
      var checkPrice = (rule, value, callback) => {
        var reg = new RegExp("^(([0-9]\\d*)(\\.\\d{1,2})?)$|(0\\.0?([1-9]\\d?))$ ")
        value = String(value)
        if (!value.trim()) {
          callback(new Error('请输入退款金额'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的退款金额'))
        }else if (parseFloat(value)>this.payment) {
          callback(new Error('请输入正确的退款金额'))
        } else {
          callback()
        }
      }
      var checkDesc = (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error('请输入退款理由'))
        } else {
          callback()
        }
      }
      return {
        orderid:this.$route.query.orderid,
        order:{},
        payment:0,  // 退款金额
        urlPath:getUrlDomain().urlPath,
        step: 1,
        returnType:this.$route.query.returnType,
        filePath: getUrlDomain().apiPath + '/file/fileUpload?sign='+ localStorage.getItem('sign'),
        titleArr: this.$route.query.returnType == 0 ? ["买家申请退货退款", "商城处理退货申请", "买家退货", "退款完成"] : ["买家申请退款", "商家处理退款申请", "退款完成"],
        trade: {},
        tradeID: this.$route.params.orderid,
        picStr: '',
        form: {
          money: '',
          desc: ''
        },
        form2: {
          returnID: '',
          billNO: '',
          billName: ''
        },
        rules: {
          money: [
            {validator: checkPrice, trigger: 'blur'}
          ],
          desc: [
            {validator: checkDesc, trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.orderDetail()
    },
    methods: {
      // 售后状态
      saleStatus(s){
        switch(s){
          case 0:
          case 3:
          case 5:{
            this.step=1
            break
          }
          case 1:{
            this.step=2
            break
          }
          case 2:{
            this.step=3
            break
          }
          case 4:{
              this.step=3
            break
          }
          case 6:{
            this.step=4
            break
          }
        }
      },
      getImg(fileList) {
        var picArr = []
        fileList.forEach((file) => {
          picArr.push(file.response.picUrl)
        })
        this.picStr = picArr.join(',')
      },
      handleAvatarRemove(file, fileList) {
        this.getImg(fileList)
      },
      handleAvatarSuccess(res, file, fileList) {
        this.getImg(fileList)
      },
      beforeUpload(file){
        if(!/^image\/(jpeg|png)$/.test(file.type)){
          this.$message.error('图片格式为jpeg或png！')
          return false
        }else if(file.size>5*1024*1024){
          this.$message.error('图片尺寸不能超过5M！')
          return false
        }else{
          return true
        }
      },
      orderDetail() {
        orderDetail(this.tradeID, function (data) {
          this.trade = data.trade
          this.order=this.trade.tradeOrderList.find((item)=>{
                      return item.orderID==this.orderid
                    })
          this.saleStatus(this.order.status)
          for(var i=0;i<this.trade.tradeReturnList.length;i++){
            var returnItem=this.trade.tradeReturnList[i]
            if(returnItem.tradeOrderID==this.orderid){
              this.returnOrder=returnItem
              break
            }
          }

          this.form.money = this.payment=this.order.vipPrice
        }.bind(this))
      },
      // 提交申请
      refundEvent(formName) {
        if (formName === 'form') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              $httpSign({
                url: '/trade/tradeRetrun',
                method: 'post',
                data: {
                  description: this.form.desc,
                  totalPrice: this.form.money,
                  picUrl: this.picStr,
                  returnType: this.returnType,
                  tradeOrderID:this.order.orderID,
                  tradeID: this.tradeID
                },
                success: function (data) {
                  if (data.flag) {
                    this.step = 2
                  }
                }.bind(this),
                error:function(err){
                  this.$message({
                    type: 'error',
                    message: err
                  })
                }.bind(this)
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.updataBill()
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        }
      },
      //填写物流详情
      updataBill() {
        let _this = this
        this.form2.returnID = this.trade.tradeReturnList[0].returnID
        $httpSign({
          url: '/trade/updateReturnBill',
          method: 'post',
          params: _this.form2,
          success: function (data) {
            _this.orderDetail()
          }.bind(this)
        })
      }
    },
    components: {
      ShopSteps
    }
  }
</script>

<style lang="stylus">
  @import '~common/stylus/refund.styl'
  .refund {
    &-goods {
      .el-form-item__content {
        margin-left: 0 !important
      }
    }
  }
</style>

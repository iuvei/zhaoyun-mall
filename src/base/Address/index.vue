<template>
  <div class="address-Index">
    <shop-title :title="!isAddress&&addressList.length>0?'填写新的收货地址':'填写收货地址'">
      <a href="javascript:;" class="more" @click="isAddress=true" v-if="!isAddress&&addressList.length>0">返回</a>
    </shop-title>
    <!-- 从未添加地址 -->
    <div class="address" v-show="!isAddress">
      <div class="">
        <el-form :model="addrForm" :rules="rules" ref="addrForm" class="address-left">
          <el-form-item label="所在地区" class="address-item">
            <address-list></address-list>
          </el-form-item>
          <el-form-item label="详细地址" class="address-item" prop="address">
            <el-input v-model="addrForm.address"></el-input>
          </el-form-item>
          <div style="display:flex">
            <el-form-item style="flex:1;margin-right:10px" label="收 货 人" class="address-item" prop="receiver">
              <el-input v-model="addrForm.receiver"></el-input>
            </el-form-item>
            <el-form-item style="flex:1" label="联系方式" class="address-item" prop="mobile">
              <el-input v-model="addrForm.mobile"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="address-right">
        <el-button type="primary" @click="editAddress('addrForm')">确定</el-button>
        <br/>
        <el-checkbox v-model="setDefault">设为默认</el-checkbox>
      </div>
    </div>
    <!-- 已经添加过地址 -->
    <el-radio-group v-model="addressId" class="address" v-show="isAddress">
      <ul class="address-list">
        <li v-for="address in addressList" :class="{selected:selectID===address.addressID}"
            @click="addrTab(address.addressID)">
          <div class="info">
            <span class="name">{{address.name}}</span>
            <span class="mobile">{{address.phone}}</span>
          </div>
          <p class="site">{{address.province}} {{address.city}} {{address.district}} {{address.address}}</p>
          <div class="btns">
            <el-radio :label="address.addressID" @change="setDefaultAddress(address.addressID)">默认</el-radio>
            <a href="javascript:;" title="修改地址" @click.stop="showUpdateAddress(address.addressID)">修改</a>
            <a href="javascript:;" title="删除地址" @click.stop="deleteAddress(address.addressID)"
               v-show="selectID!==address.addressID">删除</a>
          </div>
        </li>
        <li class="add" @click="showAddAddress"></li>
      </ul>
    </el-radio-group>
  </div>
</template>

<script>
  import AddressList from './AddressList'
  import ShopTitle from 'base/Shop/ShopTitle'
  import {mapState} from 'vuex'
  import {$httpSign, getAddress, deleteAddress, setAddress} from 'common/js/httpAll'

  export default {
    data() {
      var checkAddress = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入详细地址'));
        } else {
          callback();
        }
      };
      var checkReceiver = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入收货人名字'));
        } else {
          callback();
        }
      };
      var checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入联系方式'));
        } else if (!/^(13|15|17|18|19)[0-9]{9}$/.test(value) && !/^((\d{3,4})|\d{3,4}-)?\d{7,8}(-\d+)*$/.test(value)) {
          return callback(new Error('联系方式格式不正确'));
        } else {
          callback();
        }
      };
      return {
        sign: localStorage.getItem('sign'),
        selectID: 0,		// 选中的地址ID
        curID: 0,			// 用于判断是添加还是编辑（添加：0）
        addressList: [],
        addressId: 0,         // 默认地址ID
        isAddress: false,			// 判断显示哪个框
        addrType: 'add',				// 与组件address相关，判断是编辑还是添加状态
        addrForm: {
          address: '',
          receiver: '',
          mobile: ''
        },
        setDefault: false,
        rules: {
          address: [
            {validator: checkAddress, trigger: 'blur'}
          ],
          receiver: [
            {validator: checkReceiver, trigger: 'blur'}
          ],
          mobile: [
            {validator: checkMobile, trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.getAddress()
    },
    computed: {
      ...mapState([
        'province',
        'city',
        'district'
      ])
    },
    components: {
      AddressList,
      ShopTitle
    },
    methods: {
      // 获取地址列表
      getAddress() {
        getAddress(function (data) {
          this.addressList = data.addressList;
          this.isAddress = !(this.addressList.length === 0)
          if (this.addressList.length > 0) {
            this.selectID = this.addressList[0].addressID
            this.$store.commit('updateSelectAddr', this.addressList[0]) // 更新选择的地址

            this.addressList.forEach((item) => {
              if (item.isDefault === 1) {
                this.selectID = this.addressId = item.addressID;
                this.$store.commit('updateSelectAddr', item) // 更新选择的地址
              }
            })
          }
        }.bind(this))
      },
      // 地址切换
      addrTab(addeID) {
        this.addressList.forEach((item) => {
          if (item.addressID === addeID) {
            this.selectID = addeID
            this.$store.commit('updateSelectAddr', item) // 更新选择的地址
          }
        })
      },
      // 显示添加地址的页面
      showAddAddress() {
        this.isAddress = !this.isAddress
        this.addrForm.receiver = ''
        this.addrForm.mobile = ''
        this.addrForm.address = ''
        this.curID = 0
        this.setDefault = false
        this.$store.commit('updateAddr', {
          province: '',
          city: '',
          district: ''
        })
        localStorage.setItem('addrFrom', 1)
      },
      showUpdateAddress(addressId) {
        for (var i = 0, len = this.addressList.length; i < len; i++) {
          let item = this.addressList[i]

          if (item.addressID === addressId) {
            this.curID = addressId
            this.addrForm.receiver = item.name
            this.addrForm.mobile = item.phone
            this.addrForm.address = item.address
            this.setDefault = Boolean(item.isDefault)
            this.$store.commit('updateAddr', {
              province: item.province,
              city: item.city,
              district: item.district
            })
            localStorage.setItem('addrFrom', 1)
            break;
          }
        }
        this.isAddress = !this.isAddress
      },
      // 添加/编辑地址
      editAddress(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {

            let params = {
              sign: this.sign,
              receiver: this.addrForm.receiver,
              mobile: this.addrForm.mobile,
              state: this.province,
              city: this.city,
              district: this.district,
              address: this.addrForm.address,
              isDefault: this.setDefault
            }
            let url = this.curID === 0 ? '/address/add' : 'address/update'

            if (this.curID !== 0) {
              params.addrID = this.curID
            }

            $httpSign({
              url: url,
              method: 'post',
              params: params,
              success: function (data) {
                if (this.curID !== 0) {
                  // 编辑状态
                  for (var i = 0, len = this.addressList.length; i < len; i++) {
                    var item = this.addressList[i]
                    if (this.addressList[i].addressID === this.curID) {
                      item.name = this.addrForm.receiver
                      item.phone = this.addrForm.mobile
                      item.province = this.province
                      item.city = this.city
                      item.district = this.district
                      item.address = this.addrForm.address
                      item.isDefault = Number(this.setDefault)
                      if (this.setDefault) {
                        this.addressId = this.curID
                      }
                      break
                    }
                  }
                } else {
                  // 添加状态
                  if (this.setDefault) {
                    this.addressId = data.newAdress.addressID
                  }

                  this.selectID = data.newAdress.addressID
                  this.addressList.unshift(data.newAdress)
                  this.$store.commit('updateSelectAddr', data.newAdress) // 更新选择的地址
                }

                this.isAddress = !this.isAddress
                this.$message({
                  type: 'success',
                  message: this.curID === 0 ? '添加成功' : '修改成功!'
                })
              }.bind(this)
            })
          } else {
            console.log(url + 'error submit!!');
            return false;
          }
        });
      },
      // 删除地址
      deleteAddress(addressId) {
        deleteAddress(this, addressId, function (data) {
          this.addressList.forEach((item, index) => {
            if (item.addressID === addressId) {
              this.addressList.splice(index, 1);
              return
            }
          })

          if (this.addressList.length === 0) {
            this.isAddress = !this.isAddress
            this.$store.commit('updateAddr', {
              province: '',
              city: '',
              district: ''
            })
          }
        }.bind(this))
      },
      // 设置默认地址
      setDefaultAddress(addrID) {
        setAddress(this, addrID, function (data) {
          this.addressId = addrID

          this.addressList.forEach((item) => {
            item.isDefault = 0
            if (item.addressID === addrID) {
              item.isDefault = 1
            }
          })
        }.bind(this))
      }
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  .address-Index {
    .address {
      display: flex
      align-items: center
      padding:0
      &-left {
        width: 730px
        padding: 32px 0 14px 20px
        font-size: 0
        label {
          font-size: 14px
          line-height: 36px
          color: $size-color2
          width: 75px
        }
        .el-input__inner {
          background-color: #f7f7f7
          border-color: $border-color
        }
      }
      &-item {
        display: flex
        justify-content: space-between
        margin-bottom: 20px
      }
      .el-form-item__content {
        flex: 1
      }
      &-right {
        flex: 1
        text-align: center
        .el-button {
          width: 120px
          margin-bottom: 10px
        }
        .el-checkbox__label {
          color: $size-color3
          font-size: $font-x
        }
      }
    }

    .address {
      &-list {
        display: flex
        justify-content: start
        flex-wrap: wrap
        margin: 32px 0;
        li {
          position: relative
          width: 330px
          height: 150px
          margin: 10px 15px 0
          padding: 24px 30px 20px
          line-height: 24px
          border: 1px dashed $border-color
          cursor: pointer
          &:hover {
            border-color: $hover-color
            &.add {
              background-image: url("~images/add_hover.png")
            }
          }
          &.add {
            background: url("~images/add.png") no-repeat center
          }
          &.selected {
            border-color: $hover-color
            background: url("~images/selected_icon.png") no-repeat bottom right
          }
        }
        .name {
          color: $size-color
          font-size: $font-s
        }
        .mobile {
          color: $size-color3
          font-size: $font-s
          float: right
        }
        .site {
          margin-top: 5px
          color: $size-color3
          font-size: $font-s
          line-height: 18px
          height:36px
          ellipsis-mulit(2)
        }
        .btns {
          position: absolute
          font-size: $font-x
          bottom: 20px
          a {
            color: $size-color
            margin-left: 20px
          }
        }
      }
      .el-radio__input.is-checked .el-radio__inner::after {
        transform: rotate(45deg) scaleY(1)
      }
      .el-radio__inner {
        border-radius: 2px

        &::after {
          content: ''
          box-sizing: content-box
          border: 1px solid #fff
          border-left: 0
          border-top: 0
          height: 7px
          left: 4px
          top: 1px
          width: 3px
          border-radius: 0
          background-color: transparent
          transform: rotate(45deg) scaleY(0)
        }
      }
    }
  }
</style>

<template>
  <div class="user-cont">
    <shop-title title="收货地址"></shop-title>
    <el-form :model="addrForm" ref="addrForm" :rules="rules" class="address">
      <el-form-item label="所在地区" class="address-item">
        <address-list></address-list>
      </el-form-item>
      <el-form-item label="详细地址" class="address-item" prop="address">
        <el-input v-model="addrForm.address"></el-input>
      </el-form-item>
      <div class="form-two">
        <el-form-item label="收 货 人" class="address-item" prop="receiver">
          <el-input v-model="addrForm.receiver"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" class="address-item" prop="mobile">
          <el-input v-model="addrForm.mobile"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="address-op">
        <el-button type="primary" @click="editAddr('addrForm')">{{addrID===0?'添加地址':'修改地址'}}</el-button>
        <br/>
        <el-checkbox v-model="setDefault">设为默认</el-checkbox>
      </el-form-item>
    </el-form>
    <el-radio-group v-model="updateDefault">
      <table class="table">
        <thead>
        <tr class="table-th">
          <th>收货人</th>
          <th>联系方式</th>
          <th width="300px">收货地址</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr class="addr-td" v-for="address in addressList" :key="address.addressID" v-if="addressList.length>0"
            :class="{active:address.addressID===addrID}">
          <td>{{address.name}}</td>
          <td>{{address.phone}}</td>
          <td class="td-addr">{{address.province}} {{address.city}} {{address.district}} {{address.address}}</td>
          <td class="td-op">
            <a href="javascript:;" @click="showUpdateAddr(address.addressID)">修改</a>
            |
            <a href="javascript:;" @click="deleteAddr(address.addressID)">删除</a>
            <el-radio :label="address.addressID" @change="setDefaultAddr(address.addressID)">默认</el-radio>
          </td>
        </tr>
        <tr class="addr-td" v-if="addressList.length===0">
          <td colspan="4">暂未地址</td>
        </tr>
        </tbody>
      </table>
    </el-radio-group>
  </div>
</template>

<script>
  import ShopTitle from 'base/Shop/ShopTitle'
  import AddressList from 'base/Address/AddressList.vue'
  import {mapState} from 'vuex'
  import {getAddress, setAddress, deleteAddress, $httpSign} from 'common/js/httpAll'

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
        addressList: [],
        addrID: 0,		// 选中的id，用于修改地址
        addrForm: {
          address: '',
          receiver: '',
          mobile: ''
        },
        setDefault: false,		// 上面修改默认
        updateDefault: 1,		// 表格内修改默认
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
    computed: mapState([
      'province',
      'city',
      'district'
    ]),
    mounted() {
      this.$store.commit('updateActiveTab', '3')
      this.getAddr()
    },
    methods: {
      getAddr() {
        getAddress(function (data) {
          this.addressList = data.addressList
          // 获取表格中默认地址id
          this.addressList.forEach((item) => {
            if (item.isDefault === 1) {
              this.updateDefault = item.addressID;
            }
          })
        }.bind(this))
      },
      showUpdateAddr(id) {
        this.addrID = id
        this.addressList.forEach((addr) => {
          if (addr.addressID === id) {
            this.addrForm.address = addr.address
            this.addrForm.receiver = addr.name
            this.addrForm.mobile = addr.phone
            this.setDefault = Boolean(addr.isDefault)
            this.$store.commit('updateAddr', {
              province: addr.province,
              city: addr.city,
              district: addr.district
            })
            localStorage.setItem('addrFrom', 1)
            return
          }
        })
      },
      setDefaultAddr(id) {
        setAddress(this, id, function (data) {
          this.addressList.forEach((item) => {
            item.isDefault = 0
            if (item.addressID === id) {
              item.isDefault = 1
              // this.addrID=id
            }
          })
        }.bind(this))
      },
      editAddr(formName) {
        // 修改和添加一起
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              receiver: this.addrForm.receiver,
              mobile: this.addrForm.mobile,
              state: this.province,
              city: this.city,
              district: this.district,
              address: this.addrForm.address,
              isDefault: this.setDefault
            }
            let url = this.addrID === 0 ? '/address/add' : '/address/update'

            if (this.addrID !== 0) {
              params.addrID = this.addrID
            }

            $httpSign({
              url: url,
              method: 'post',
              params: params,
              success: function (data) {
                if (this.addrID !== 0) {
                  // 编辑状态
                  this.addressList.forEach((item) => {
                    if (item.addressID === this.addrID) {
                      item.name = this.addrForm.receiver
                      item.phone = this.addrForm.mobile
                      item.province = this.province
                      item.city = this.city
                      item.district = this.district
                      item.address = this.addrForm.address
                      item.isDefault = Number(this.setDefault)
                      // 如果默认值属于操作者
                      if (this.addrID === this.updateDefault && !this.setDefault) {
                        this.updateDefault = 0
                      }
                      if (this.setDefault) {
                        this.updateDefault = item.addressID
                      }
                      this.eventName = 'edit'
                      return
                    }
                  })
                } else {
                  // 添加状态
                  if (this.setDefault) {
                    this.updateDefault = data.newAdress.addressID
                  }
                  this.addressList.unshift(data.newAdress)
                }
                this.$message({
                  type: 'success',
                  message: this.addrID === 0 ? '添加成功' : '修改成功!'
                });
                // 参数回默认
                this.addrForm.receiver = ''
                this.addrForm.mobile = ''
                this.$store.commit('updateAddr', {
                  province: '',
                  city: '',
                  district: ''
                })
                this.addrForm.address = ''
                this.setDefault = false
                this.addrID = 0
              }.bind(this)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      deleteAddr(id) {
        deleteAddress(this, id, function (data) {
          this.addressList.forEach((item, index) => {
            if (item.addressID === id) {
              this.addressList.splice(index, 1);
              return
            }
          })
        }.bind(this))
      }
    },
    components: {
      ShopTitle,
      AddressList
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/table.styl"

  .address {
    padding: 30px 50px 8px
    label {
      font-size: $font-s
      line-height: 36px
      color: $size-color2
      width: 75px
    }
    .form-two{
      display: flex
      justify-content: space-between
      .address-item{
        width: calc(50% - 20px)
      }
    }
    &-item {
      display: flex
      justify-content: space-between
      margin-bottom: 20px
    }
    &-op {
      text-align: center
      margin-top: 20px
      .el-button {
        width: 150px
      }
    }
    .el-form-item__content {
      flex: 1
    }
  }

  .addr-td {
    &.active {
      background-color: rgb(247, 242, 242)
    }
    td {
      padding: 10px
      font-size: $font-x
      line-height: 18px
      color: $size-color2
      text-align: center
      height: 64px
      border-bottom: 1px solid $border-color
    }
    .td-addr {
      text-align: left
    }
    .td-op {
      color: $size-color3
      a {
        color: $size-color3
        margin: 0 4px
        &:hover {
          color: $hover-color
        }
      }
    }
    .el-radio {
      margin-left: 10px
    }
    .el-radio__label {
      padding-left: 5px
      font-size: $font-x
      color: $size-color3
    }
  }
</style>

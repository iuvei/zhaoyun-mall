<template>
  <div class="address-inpbox">
    <el-select v-model="province" placeholder="请选择" @change="changeRegions(0)">
      <el-option v-for="province in provinces" :key="province.areaCode" :label="province.name" :value="province.name"
                 :data-id="province.areaCode">
      </el-option>
    </el-select>
    <el-select v-model="city" placeholder="请选择" @change="changeRegions(1)">
      <el-option v-for="city in citys" :key="city.areaCode" :label="city.name" :value="city.name">
      </el-option>
    </el-select>
    <el-select v-model="district" placeholder="请选择" @change="changeDistrict">
      <el-option v-for="district in districts" :key="district.areaCode" :label="district.name" :value="district.name">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import AddressList from './AddressList'
  import {$httpSign} from 'common/js/httpAll'

  export default {
    data() {
      return {
        provinces: [],
        citys: [],
        districts: []
      }
    },
    computed: {
      province: {
        get() {
          return this.$store.state.province
        },
        set(value) {
          this.$store.commit('updateAddr', {
            province: value,
            city: this.city,
            district: this.district
          })
        }
      },
      city: {
        get() {
          return this.$store.state.city
        },
        set(value) {
          this.$store.commit('updateAddr', {
            province: this.province,
            city: value,
            district: this.district
          })
        }
      },
      district: {
        get() {
          return this.$store.state.district
        },
        set(value) {
          this.$store.commit('updateAddr', {
            province: this.province,
            city: this.city,
            district: value
          })
        }
      }
    },
    mounted() {
      this._getProvinces()
    },
    watch: {
      province() {
        // addrFrom用于判断province改变是点击下拉框改变还是点击修改/添加按钮导致的province的改变
        var addrFrom = localStorage.getItem('addrFrom')
        if (addrFrom) {
          if (this.province === '') {
            this.citys = []
            this.districts = []
          } else {
            this._getCitys(function () {
              this._getDistricts()
            }.bind(this))
          }
          localStorage.removeItem('addrFrom')
        }
      }
    },
    methods: {
      _getProvinces() {
        $httpSign({
          url: '/address/region/list',
          success: function (data) {
            this.provinces = data.provinceList
          }.bind(this)
        })
      },
      _getCitys(fn = () => {
      }) {
        this.provinces.forEach((item) => {
          if (item.name === this.province) {
            $httpSign({
              url: '/address/region/childList',
              params: {
                parentCode: item.areaCode
              },
              success: function (data) {
                this.citys = data.childList
                if (fn) {
                  fn()
                }
              }.bind(this)
            })
            return false
          }
        })
      },
      _getDistricts() {
        this.citys.forEach((item) => {
          if (item.name === this.city) {
            $httpSign({
              url: '/address/region/childList',
              params: {
                parentCode: item.areaCode
              },
              success: function (data) {
                this.districts = data.childList
              }.bind(this)
            })
          }
        })
      },
      changeRegions: function (type) {
        this.districts = []
        if (type === 0) {
          this.citys = []
          this.$store.commit('updateAddr', {
            province: this.province,
            city: '',
            district: ''
          })
        } else {
          this.$store.commit('updateAddr', {
            province: this.province,
            city: this.city,
            district: ''
          })
        }

        type === 0 ? this._getCitys() : this._getDistricts()
      },
      changeDistrict() {
        this.$store.commit('updateAddr', {
          province: this.province,
          city: this.city,
          district: this.district
        })
      }
    }
  }
</script>

<style lang="stylus">
  .address-inpbox {
    width: 100%
    display: flex
    justify-content: space-between
  }

  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
    border: 1px solid #dadada
  }
</style>

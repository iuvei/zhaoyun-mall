<template>
  <div class="user-cont">
    <shop-title title="资料编辑"></shop-title>
    <el-form ref="form" :model="userInfo" label-width="80px" class="user-form">
      <el-form-item label="用户头像" class="user-photo">
        <div class="img"><img :src="userInfo.picUrl?getPhoto():avatar" width="66" height="66"></div>
        <div class="op">
          <p class="tip">请选择一个新的头像进行上传</p>
          <el-upload
            class="upload"
            :action="filePath"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeUpload"
            name="myfiles"
            :show-file-list="false">
            <el-button type="primary" size="mini" plain>{{uploadBtn}}</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="手机号码">
        <span style="margin-right:5px">{{userInfo.phone}}</span>
        <!-- <router-link to="/user/modifyPhone" class="c_af7b7a">更换号码</router-link> -->
      </el-form-item>
      <el-form-item label="用 户 名" class="user-name">
        <span style="margin-right:5px">{{userInfo.userName}}</span>
        <!-- <el-input v-model="userInfo.userName"></el-input> -->
      </el-form-item>
      <el-form-item label="性  别">
        <el-radio-group v-model="userInfo.sex">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" class="user-birth">
        <el-select v-model="birthDay[0]" @change="updateMonths('add',birthDay[0])">
          <el-option :label="year" :value="year" :key="year" v-for="year in years"></el-option>
        </el-select>
        &nbsp;年&nbsp;
        <el-select v-model="birthDay[1]" @change="updateDates('add',birthDay[1])">
          <el-option :label="month" :value="month" :key="month" v-for="month in months"></el-option>
        </el-select>
        &nbsp;月&nbsp;
        <el-select v-model="birthDay[2]">
          <el-option :label="date" :value="date" :key="date" v-for="date in dates"></el-option>
        </el-select>
        &nbsp;日&nbsp;
      </el-form-item>
      <el-form-item class="user-btn">
        <el-button type="primary" @click="saveForm()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ShopTitle from 'base/Shop/ShopTitle'
  import {resetTime} from 'common/js/reset'
  import {mapState, mapMutations} from 'vuex'
  import {$httpSign} from 'common/js/httpAll'
  import {getUrlDomain} from 'common/js/util'

  export default {
    data() {
      var years = []
      for (var i = 1938; i <= new Date().getFullYear(); i++) {
        years.push(i)
      }

      return {
        filePath:getUrlDomain().apiPath+'/file/fileUpload?sign='+ localStorage.getItem('sign'),
        birthDay: [],
        avatar: require('images/default_photo.jpg'),
        years: years,
        months: [],
        urlPath:getUrlDomain().urlPath,
        dates: [],
        uploadBtn:'上传头像'
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    mounted() {
      this.$store.commit('updateActiveTab', '3')
      this.resBirth(this.userInfo.birthDay)
      if(this.birthDay.length===3){
        this.updateMonths('edit',this.birthDay[0])
        this.updateDates('edit',this.birthDay[1])
      }
    },
    methods: {
      getPhoto(){
        if(/^http/.test(this.userInfo.picUrl)){
          return this.userInfo.picUrl
        }else{
          return this.urlPath+this.userInfo.picUrl
        }
      },
      saveForm() {
        if (this.birthDay.join('-').length > 9) {
          $httpSign({
            url: '/account/modify',
            method: 'post',
            data: {
              distributorID:this.userInfo.distributorID,
              // userName:this.userInfo.userName,
              sex:this.userInfo.sex,
              birthDay:this.birthDay.join('-')
            },
            success:function(data){
              this.updateUserInfo(data.user)
              localStorage.setItem('updateUserInfo', JSON.stringify(data.user));
              this.$message({
                message: '资料修改成功',
                type: 'success'
              })
            }.bind(this),
            error:function(err){
              this.$message({
                message: err,
                type: 'error'
              })
            }.bind(this)
          })
        } else {
          this.$message({
            message: '请选择完整的出生日期',
            type: 'error'
          })
          return
        }

      },
      resBirth(date) {
        this.birthDay = resetTime(date).split('-')
      },
      beforeUpload(file){
        if(!/^image\/(jpeg|png)$/.test(file.type)){
          this.$message.error('图片格式为jpeg或png！')
          return false
        }else if(file.size>5*1024*1024){
          this.$message.error('图片尺寸不能超过5M！')
          return false
        }else{
          this.uploadBtn='上传中...'
        }
      },
      handleAvatarSuccess(res, file) {
        //现在接口有问题等后台调好接口直接取值就行
        $httpSign({
          url: '/account/modify',
          method: 'post',
          data: {
            distributorID:this.userInfo.distributorID,
            picUrl:res.picUrl
          },
          success:function(data){
            this.updateUserInfo(data.user)
            localStorage.setItem('updateUserInfo', JSON.stringify(data.user));
            this.uploadBtn='上传头像'
          }.bind(this),
          error:function(err){
            this.$message.error(err)
            this.uploadBtn='上传头像'
          }
        })
      },
      updateMonths(type,year) {
        if(type==='add'){
          this.birthDay[1] = ''
          this.birthDay[2] = ''
        }

        var lastMonth = year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12,
          months = []
        for (var i = 1; i <= lastMonth; i++) {
          months.push(i < 10 ? '0' + i : i)
        }
        this.months = months
      },
      updateDates(type,month) {
        if(type==='add'){
          this.birthDay[2] = ''
        }

        var lastDate = 0,
          dates = []

        function isLeapYear(Year) {
          if ((Year % 4 === 0 && Year % 100 !== 0) || (Year % 400 === 0)) {
            return (true);
          } else {
            return (false);
          }
        }

        switch (month) {
          case '01':
          case '03':
          case '05':
          case '07':
          case '08':
          case 10:
          case 12: {
            lastDate = 31
            break
          }
          case '04':
          case '06':
          case '09':
          case 11: {
            lastDate = 30
            break
          }
          case '02': {
            lastDate = isLeapYear(this.birthDay[0]) ? 29 : 28
            break
          }
        }
        for (var i = 1; i <= lastDate; i++) {
          dates.push(i < 10 ? '0' + i : i)
        }
        this.dates = dates
      },
      ...mapMutations(['updateUserInfo'])
    },
    components: {
      ShopTitle
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  .user {
    &-form {
      padding: 40px 50px
      .c_af7b7a {
        color: #af7b7a
      }
    }
    &-photo {
      .img {
        margin-right: 16px
        width: 66px
        height: 66px
      }
      .tip {
        color: $size-color3
        font-size: $font-x
        line-height: 20px
      }
    }
  }
</style>
<style lang="stylus">
  .user {
    &-name {
      .el-input__inner {
        width: 240px
      }
    }
    &-birth {
      .el-form-item__content {
        display: flex
        color: $size-color
      }
    }
    &-photo {
      .el-form-item__content {
        display: flex
      }
    }
    &-btn {
      text-align: center
      margin-top: 40px
      .el-button {
        width: 150px
      }
    }
  }
</style>

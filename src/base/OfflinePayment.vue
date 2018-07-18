<template>
	<div class="user-cont">
		<el-form ref="form" :model="form" :rules="rules" label-width="100px" class="rec-form" v-if="!isCheck">
		  <el-form-item label="邀请码" prop="code" v-if="codeStatuss===0" class="rec-code">
		  	<div class="invite-item">
		  		<el-button plain v-if="!phoneInvite" @click="phoneInvite=true;numberInvite=false;form.code='';activeTab=0">手机邀请码</el-button>
		  		<el-input v-model="form.code" auto-complete="off" placeholder="请输入11位的手机邀请码" :maxlength="11" v-else>
		  		  <template slot="prepend">手机邀请码</template>
		  		</el-input>
		  	</div>
		  	<div class="invite-item">
		  		<el-button plain v-if="!numberInvite" @click="phoneInvite=false;numberInvite=true;form.code='';activeTab=1">数字邀请码</el-button>
		  		<el-input v-model="form.code" auto-complete="off" placeholder="请输入6位的数字邀请码" :maxlength="6" v-else>
		  		  <template slot="prepend">数字邀请码</template>
		  		</el-input>
		  	</div>
		  </el-form-item>
		  <el-form-item label="邀请码" prop="code" v-else-if="codeStatuss===2">
		    <span>-</span>
		  </el-form-item>
		  <el-form-item label="邀请码" prop="code" v-else-if="codeStatuss===1">
		    <span>{{code}}</span>
		  </el-form-item>
		</el-form>
		<table class="rec-table" v-if="!isCheck">
			<tr>
				<th>银行账号</th>
				<td>19085201040025340</td>
			</tr>
			<tr>
				<th>所属银行</th>
				<td>中国农业银行股份有限公司</td>
			</tr>
			<tr>
				<th>所属支行</th>
				<td>金城路支行</td>
			</tr>
			<tr>
				<th>开户人</th>
				<td>杭州兆云电子商务有限公司</td>
			</tr>
			<tr>
				<td colspan="2">
					<el-upload
					  class="upload"
					  :action="filePath"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeUpload"
					  name="myfiles"
					  :show-file-list="false">
					  <el-button type="primary">上传打款凭证</el-button>
					</el-upload>
					<a href="javascript:;" @click="returnPayment" style="color:#AF7B7A">返回</a>
				</td>
			</tr>
		</table>
		<div class="rec-check" v-else>
			<img src="~images/shenhen.png" alt="审核中">
			<p class="text">财务正在审核中，请耐心等待,稍后来此查看充值记录。<a href="javascript:;" @click="returnPayment" style="color:#AF7B7A">返回</a></p>
		</div>
		<p class="rec-tip" style="text-align: center">* 如有问题，请联系客服。客服电话：0571-89295518。</p>
	</div>
</template>

<script>
	import {$httpSign} from 'common/js/httpAll'
	import {getUrlDomain} from 'common/js/util'
	import {mapState} from 'vuex'

	export default {
		data(){
			var validateCode=(rule,value,callback)=>{
				if(this.activeTab===0){
					if(!value.trim()){
						callback()
					}else if(!/^(13|15|17|18|19)[0-9]{9}$/.test(value)){
						callback(new Error('请填写正确的邀请码！'))
					}else if(value==this.userInfo.phone){
						callback(new Error('请不要填写自己的手机号！'))
					}else{
						$httpSign({
							url:'/invition/checkCode',
							method:'post',
							params:{
								phoneCode:this.form.code,
							},
							success:function(data){
								callback()
							}.bind(this),
							error:function(err){
								if(err=='尊敬的客户，您的邀请码已经被绑定，您不能再绑定对方的邀请码！'){
									this.codeStatuss=2
									this.form.code=''
								}
								callback(err)
							}.bind(this)
						})
					}
				}else{
					if(!value.trim()){
						callback()
					}else if(!/^\d{6}$/.test(value)){
						callback(new Error('请填写正确的邀请码！'))
					}else{
						$httpSign({
							url:'/invition/checkCode',
							method:'post',
							params:{
								invitationVode:this.form.code
							},
							success:function(data){
								callback()
							}.bind(this),
							error:function(err){
								if(err=='尊敬的客户，您的邀请码已经被绑定，您不能再绑定对方的邀请码！'){
									this.codeStatuss=2
									this.form.code=''
								}
								callback(err)
							}.bind(this)
						})
					}
				}
			}
			return {
				filePath:getUrlDomain().apiPath+'/file/fileUpload?sign='+ localStorage.getItem('sign'),
				codeStatuss:0,
				isCheck:false,
				phoneInvite:false,
				numberInvite:false,
				activeTab:0,
				form:{
					code:''
				},
				rules:{
					code: [{validator: validateCode, trigger: 'blur'}]
				}
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		props:{
			distributorID:Number,
			code:String,
			codeStatus:Number
		},
		mounted(){
			this.codeStatuss=this.codeStatus
		},
		methods:{
			handleAvatarSuccess(res, file){
				var params={
					distributorID:this.distributorID,
					picUrl:file.response.picUrl
				}
				if(this.code){
					params.code=this.code
				}else if(this.form.code){
					params.code=this.form.code
				}
				// 凭证属于谁的字段
				if(file.response.code=='0'){
          $httpSign({
						url:'/account/accountPicUpload',
						method:'post',
						params,
						success:function(data){
							this.isCheck=true
						}.bind(this)
					})
				}
			},
			beforeUpload(file){
				var status
				this.$refs['form'].validate((valid) => {
					if(valid){
						if(!/^image\/(jpeg|png)$/.test(file.type)){
						  this.$message.error('图片格式为jpeg或png！')
						  status=false
						}else if(file.size>5*1024*1024){
						  this.$message.error('图片尺寸不能超过5M！')
						  status=false
						}else{
							status=true
						}
					}else{
						status=false
					}
					
				})
				return status
			},
			returnPayment(){
				this.$emit('isOlineEvent')
			}
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/variable.styl'
	.rec{
		&-table{
			width:600px
			margin:30px auto
			th,td{
				height:40px
				font-size:$font-s
				color:$size-color2
				font-weight:normal
				border:1px solid $border-color
				padding:0 20px
			}
			tr:last-child td{
				border:none
				padding-top:30px
				text-align:center
			}
		}
		&-check{
			width:400px
			margin:50px auto 0
			text-align:center
			.text{
				font-size:$font-x
				line-height:24px
			}
		}
		&-form{
			margin-top:40px
			margin-left:110px
		}
		&-code{
			.invite-item{
				display:inline-block
				vertical-align:top
			}
			.invite-item+.invite-item{
				margin-left:10px
			}
		}
	}
</style>
<style lang="stylus">
	@import '~common/stylus/variable.styl'
	.rec-table{
		.upload{
			display:inline-block
			margin-right:20px
		}
	}
</style>

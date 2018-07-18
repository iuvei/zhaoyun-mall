<template>
	<div class="discuss container">
		<shop-title title="评价商品"></shop-title>
		<div class="discuss-box" v-for="(item,index) in itemList" :key="item.itemID">
			<router-link class="discuss-left" :to="`/goodsDetail/${item.itemID}`" :title="item.itemName">
				<div class="img"><img v-lazy="urlPath+item.picUrl" :alt="item.itemName" width="180" height="180"></div>
				<p class="title">{{item.itemName}}</p>
			</router-link>
			<div class="discuss-right">
				<div class="rate">
					<span class="name">星级评价</span>
					<el-rate v-model="array[index].starLevel" show-text></el-rate>
				</div>
				<el-input type="textarea" v-model="array[index].description" placeholder="您的评价会对其他买家有很大的帮助哦，最多200个字。" :maxlength="200"></el-input>
				<div class="pic">
					<div class="title">
						<span><i class="el-icon-picture-outline"></i>照片展示（限5张）</span>
						<!-- <el-radio-group v-model="type">
					    <el-radio :label="1">公开</el-radio>
					    <el-radio :label="2">匿名</el-radio>
					  </el-radio-group> -->
					</div>
					<el-upload :action="filePath" @click.native="curIndex=index" :on-remove="handleAvatarRemove" :on-success="handleAvatarSuccess" list-type="picture-card" class="list" :limit="5" name="myfiles" :before-upload="beforeUpload"><i class="el-icon-plus"></i></el-upload>
				</div>
			</div>
		</div>
		<div class="discuss-btns">
			<el-button type="primary" @click="submitDiscuss">提交评论</el-button>
		</div>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {getUrlDomain,getOrderStatus} from 'common/js/util'
	import {orderDetail,$httpSign} from 'common/js/httpAll'

	export default {
		data(){
			return {
				urlPath:getUrlDomain().urlPath,
				filePath:getUrlDomain().apiPath+'/file/fileUpload?sign='+ localStorage.getItem('sign'),
				curIndex:0,
				isUpload:true,
				tradeID:0,
				itemList:{},
				type:'2',
				array:[]
			}
		},
		mounted(){
			this.getOrderDetail()
		},
		methods:{
			getImg(fileList){
				var picArr=[]
				fileList.forEach((file)=>{
					picArr.push(file.response.picUrl)
				})
				this.array[this.curIndex].picUrl=picArr.join(',')
			},
			handleAvatarRemove(file,fileList){
				this.getImg(fileList)
			},
			handleAvatarSuccess(res, file,fileList) {
				this.getImg(fileList)
			},
			getOrderDetail(){
				orderDetail(this.$route.params.orderid,function(data){
					if(getOrderStatus(data.trade.tradeStatus,data.trade.payStatus)===4){
						this.tradeID=data.trade.tradeID
						this.itemList=data.trade.tradeOrderList
						this.itemList.forEach((item)=>{
							this.array.push({
								orderID:item.tradeID,
								itemID:item.itemID,
								tradeOrderID:item.orderID,
								starLevel:5,
								description:'',
								picUrl:''
							})
						})
					}else{
						this.$router.push({path:'/orderDetail/'+data.trade.tradeID})
					}
				}.bind(this))
			},
			submitDiscuss(){
				$httpSign({
					url:'/evaluate/add',
					method:'post',
					data:this.array,
					success:function(data){
						this.$message({
						  type: 'success',
						  message: '评论成功'
						})
						this.$router.push({path:`/orderDetail/${this.tradeID}`})
					}.bind(this),
					error:function(err){
						this.$message({
						  type: 'error',
						  message: err
						})
					}.bind(this)
				})
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
			}
		},
		components:{
			ShopTitle
		}
	}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
	.discuss{
		padding:50px 0 100px
		&-box{
			border-bottom:1px solid $border-color
			display:flex
		}
		&-left{
			width:300px
			padding:60px 60px 0
			display:block
			.img{
				width:180px
				height:180px
			}
			.title{
				color:$main-color
				font-size:$font-s
				padding:5px 0
				line-height:20px
			}
		}
		&-right{
			.rate{
				display:flex
				margin:18px 0 30px
				.name{
					font-size:$font-xl
					line-height:48px
				}
				.el-rate{
					height:48px
					padding-top:12px
					margin-left:32px
				}
			}
			.pic{
				.title{
					display:flex
					justify-content: space-between
					background-color:#f7f7f7
					height:40px
					border:1px solid $border-color
					padding:0 20px
					align-items:center
					span{
						color:$size-color3
						font-size:$font-x
						.el-icon-picture-outline{
							font-size:$font-m
							margin-right:5px
						}
					}
				}
				.list{
					margin:10px 0 30px
				}
			}
		}
		&-btns{
			margin-top:30px
			padding-left:300px
		}
	}
</style>
<style lang="stylus">
  @import "~common/stylus/variable.styl"
  .discuss{
  	.el-rate__icon{
  		font-size: 24px
  	}
  	.el-textarea__inner{
  		width:640px
  		height:240px
  	}
  	.el-upload--picture-card{
  		width:60px
  		height:60px
  		line-height:64px
  		border:1px solid $border-color
  	}
  	.el-upload-list--picture-card .el-upload-list__item{
  		width:60px
  		height:60px
  	}
  	.el-button{
  		width:150px
  	}
  }
</style>

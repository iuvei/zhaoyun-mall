<template>
  	<footer class="footer">
  		<div class="footer-top">
  			<div class="container">
  				<ul class="footer-ensure">
  					<li>
  						<i class="footer-icon footer-icon1"></i>
  						<span class="footer-title">品质保障</span>
  					</li>
  					<li>
  						<i class="footer-icon footer-icon2"></i>
  						<span class="footer-title">最低折扣</span>
  					</li>
  					<li>
  						<i class="footer-icon footer-icon3"></i>
  						<span class="footer-title">独家渠道</span>
  					</li>
  					<li>
  						<i class="footer-icon footer-icon4"></i>
  						<span class="footer-title">贴心售后</span>
  					</li>
  				</ul>
  			</div>
  		</div>
    	<div class="footer-info">
    		<div class="container">
    			<ul class="footer-contact">
    				<li>
    					<i class="footer-contact-icon icon-weichat"></i>
						<div class="footer-contact-ercode"><img src="~images/ercode.png" height="86" width="86" alt="公众号二维码"></div>
    				</li>
    				<!-- <li>
    					<i class="footer-contact-icon icon-weibo"></i>
    					<div class="footer-contact-ercode"><img src="~images/ercode2.jpg" height="86" width="86" alt="微博二维码"></div>
    				</li> -->
    				<li>
    					<i class="footer-contact-icon icon-phone"></i>
    					<div class="footer-contact-ercode">
                <!-- <div class="ercode-item" style="width:160px">
                  <p class="text">正在开发，敬请期待</p>
                </div> -->
                <div class="ercode-item">
                  <img src="~images/android.png" height="86" width="86" alt="APP二维码" class="img">
                  <p class="text">安卓版</p>
                </div>
                <!--<div class="ercode-item">-->
                  <!--<img src="~images/IOS.png" height="86" width="86" alt="APP二维码" class="img">-->
                  <!--<p class="text">IOS版</p>-->
                <!--</div>-->
              </div>
    				</li>
    			</ul>
    			<!-- <div class="footer-nav">
    				<a href="/" target="_blank">兆云集团</a>
    				|
    				<a href="/" target="_blank">兆云集团</a>
    				|
    				<a href="/" target="_blank">兆云集团</a>
    				|
    				<a href="/" target="_blank">兆云集团</a>
    				|
    				<a href="/" target="_blank">兆云集团</a>
    			</div> -->
    			<!-- <div class="footer-nav">
            <router-link :to="{path:'/website/aboutus'}" target="_blank">关于我们</router-link>
    				|
    				<a href="" target="_blank">帮助中心</a>
    				|
    				<a href="" target="_blank">售后服务</a>
    				|
    				<a href="" target="_blank">汽车加盟</a>
    				|
    				<a href="" target="_blank">商务合作</a>
    				|
    				<a href="" target="_blank">企业采购</a>
    				|
    				<a href="" target="_blank">开发平台</a>
    				|
    				<a href="" target="_blank">搜索推荐</a>
    				|
    				<a href="" target="_blank">友情链接</a>
    			</div> -->
    			<div class="footer-copyright">
            <router-link :to="{path:'/website/aboutus'}" target="_blank">关于我们</router-link>
            |
    				<span>杭州兆云电子商务有限公司版权所有&nbsp;&copy;2018</span>
    				<span>备案号为：浙ICP备18010377号-2</span>
    			</div>
    			<!-- <div class="footer-business">
    				<a href="/" target="_black">
    					<i class="footer-business-icon footer-business-icon1"></i>
    					<i class="footer-business-title">经营性网站<br/>备案信息</i>
    				</a>
    				<a href="/" target="_black">
    					<i class="footer-business-icon footer-business-icon2"></i>
    					<i class="footer-business-title">可用网站<br/>信用评价</i>
    				</a>
    				<a href="/" target="_black">
    					<i class="footer-business-icon footer-business-icon3"></i>
    					<i class="footer-business-title">网络警察<br/>提醒您</i>
    				</a>
    				<a href="/" target="_black">
    					<i class="footer-business-icon footer-business-icon4"></i>
    					<i class="footer-business-title">诚信网站</i>
    				</a>
    				<a href="/" target="_black">
    					<i class="footer-business-icon footer-business-icon5"></i>
    					<i class="footer-business-title">中国互联网<br/>举报中心</i>
    				</a>
    				<a href="/" target="_black">
    					<i class="footer-business-icon footer-business-icon6"></i>
    					<i class="footer-business-title">网络举报<br/>APP下载</i>
    				</a>
    			</div> -->
    		</div>
    	</div>
  	</footer>
</template>

<style scoped lang="stylus">
  @import "~common/stylus/variable.styl"

  .footer{
    position:absolute
    bottom:0
    left:0
    width:100%
    background-color:#f3f3f3
    border-top:1px solid #dadada
    &-top{
      border-bottom:1px solid #dadada
      height:120px
    }
    &-ensure{
      display:flex
      font-size:0
      justify-content: space-between
      align-items:center
      width: 100%
      height: 120px
    }
    &-icon{
      display:inline-block
      width:50px
      height:50px
      vertical-align:middle
    }
    for i in 1 2 3 4{
      &-icon{i}{
        background-image:url('~images/footer-icon'+i+'.png')
      }
    }
    &-title{
      font-size:$font-l
      margin-left:30px
      color:$hover-color
      display:inline-block
      vertical-align:middle
    }
    &-info{
      padding:40px 0 32px
      text-align:center
    }
    &-contact{
      display:flex
      justify-content:center
      margin-bottom:20px
      li{
        position:relative
        margin:0 16px
        &:hover{
          .footer-contact-ercode{
            display:flex
          }
        }
      }
      &-icon{
        font-size:30px
        color:#a3a3a3
        cursor:pointer
      }
      &-ercode{
        position:absolute
        bottom:42px
        left:50%
        transform:translateX(-50%)
        border:5px solid #a3a3a3
        border-radius:4px
        display:none
        background-color:#fff
        padding:5px
        .ercode-item+.ercode-item{
          border-left:1px dashed $border-color
        }
        .ercode-item:first-child{
          padding-right:5px
        }
        .ercode-item:last-child{
          padding-left:5px
        }
        .text{
          font-size:$font-x
          color:$size-color2
          line-height:18px
        }
        &:after{
          content:''
          position:absolute
          left:50%
          bottom:-13px
          border:5px solid #a3a3a3
          border-color:transparent #a3a3a3 #a3a3a3 transparent
          transform: rotate(45deg) translateX(-50%)
        }
      }
    }
    &-nav{
      font-size:$font-x
      color:$link-color
      margin-bottom:12px
      a{
        margin:0 17px
      }
    }
    &-copyright{
      font-size:$font-x
      span{
        color:$link-color
        margin-right:12px
      }
    }
    &-business{
      display: flex
      justify-content: center
      margin-top:24px
      a{
        margin:0 16px
      }
      &-icon{
        display:inline-block
        vertical-align:middle
        width:48px
        height:40px
        background-image:url('~images/business-icon'+i+'.png')
      }
      for i in 1 2 3 4 5 6{
        &-icon{i}{
          background-image:url('~images/business-icon'+i+'.png')
        }
       }
      &-title{
        display:inline-block
        vertical-align:middle
        text-align:left
        color:#a3a3a3
        line-height:20px
        font-size:$font-x
        font-style:normal
      }
    }
  }
</style>

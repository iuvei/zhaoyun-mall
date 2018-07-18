<template>
	<div id="about" class="about container">
		<div class="about-aside">
			<hgroup class="hgroup">
				<h3 class="title">关于我们</h3>
				<h4 class="subtitle">ABOUT US</h4>
			</hgroup>
			<nav class="nav">
				<a href="javascript:;" @click="curIdx=nav.id" :class="{on:curIdx===nav.id}" v-for="nav in navlist" :key="nav.id">{{nav.name}}</a>
			</nav>
		</div>
		<!--<div class="about-cont" v-if="curIdx===1">-->
			<!--<hgroup class="hgroup">-->
        <!--<h3 class="title">兆云集团</h3>-->
        <!--<h4 class="subtitle">ZHAOYUN MALL</h4>-->
      <!--</hgroup>-->
      <!--<section class="desc">-->
        <!--<p>兆云集团，创世纪全球化生态型千年企业，依托科技、实业、金融、文化等多领域进行全国性战略布局，秉承“帮天下更多人实现财富自由”的理念，旨在造就一个“兆亿同归宗，云集万物生”的商业帝国！</p>-->
      <!--</section>-->
		<!--</div>-->
    <div class="about-cont" v-if="curIdx===2">
      <hgroup class="hgroup">
        <h3 class="title">兆云商城</h3>
        <h4 class="subtitle">ZHAOYUN MALL</h4>
      </hgroup>
      <section class="desc">
        <p>兆云商城是杭州兆云电子商务有限公司旗下，基于消费新时代趋势下成立的新模式、创新型、全品类的品牌折扣商城，已上线了PC端和APP端。兆云商城致力于解决传统电子商务的品牌正品、品质商品、购物体验、优质服务与虚假优惠的几大难题，专注于线上消费场景“兆云商城”和线下“百业联盟”与“百城千店“的一站式服务平台搭建；兆云商城，一个更懂你的商城。经营模式是做品牌精选的折扣商场，针对会员提供全网可比价，尊享88折的优惠。主营产品包括话费油卡、生活缴费、数码家电、日用百货、居家生活、汽车等全品类产品。我们秉承“优品质，惠生活”的品牌经营理念，为用户精选极致好产品，畅享精致好生活。这一次，让我们重新定义电商，一起开启消费新时代！ </p>
      </section>
    </div>
    <div class="about-cont" v-if="curIdx===3">
      <hgroup class="hgroup">
        <h3 class="title">平台优势</h3>
        <h4 class="subtitle">ZHAOYUN MALL</h4>
      </hgroup>
      <section class="desc">
        <h5 class="desc-title">正品直供</h5>
        <p>兆云商城与各品牌厂商直连合作，去除中间渠道流转与市场营销环节，通过严格的供应链管控溯源机制，多重保障体系确保商品的绝对正品，让购物更加简单放心。</p>
      </section>
      <section class="desc">
        <h5 class="desc-title">品质优选</h5>
        <p>兆云商城通过专业的供管团队与执行标准，密切关注市场动态与品牌好品，用心精选更优质、更热门、更具性价比的商品，我们更懂您的需求，让购物更加轻松舒心。</p>
      </section>
      <section class="desc">
        <h5 class="desc-title">极致体验</h5>
        <p>兆云商城在特色专区、活动主题板块、用户社交分享、操作流程体验及专属客服等方面以超行业标准的要求，为用户创造极致舒适的体验，让购物更加有趣开心。</p>
      </section>
      <section class="desc">
        <h5 class="desc-title">技术先进</h5>
        <p>商城通过高安全性、高稳定性、高扩展性的硬件支持，采用最主流的系统架构与功能化模块开发体系，以及大数据模型的挖掘与分析技术，让购物更加自在安心。</p>
      </section>
    </div>
    <div class="about-cont" v-if="curIdx===4">
      <hgroup class="hgroup">
        <h3 class="title">发展规划</h3>
        <h4 class="subtitle">ZHAOYUN MALL</h4>
      </hgroup>
      <div class="desc">
        <ul class="desc-list">
          <li><em>2017年8月</em>启动“兆云商城”项目组筹备</li>
          <li><em>2018年1月</em>成立杭州兆云电子商务有限公司</li>
          <li><em>2018年4月</em>兆云微商城开启试运营</li>
          <li><em>2018年5月</em>微商城用户量破十万</li>
          <li><em>2018年6月</em>兆云商城APP正式上线</li>
          <li><em>2018年8月</em> App用户量冲刺50万</li>
          <li><em>2018年10月</em>商城新增活动与海淘板块</li>
          <li><em>2018年12月</em>用户量达千万 成为新消费时代最有影响力电商品牌之一</li>
          <li><em>2019年1月</em>全国34个省级兆云商城体验中心成立</li>
          <li><em>2019年3月</em>全国百城千店计划启动</li>
          <li><em>2019年5月</em>全国68个兆云物流仓储基地成立</li>
          <li><em>2019年8月</em>百业联盟战略计划开启</li>
          <li><em>2019年9月</em>商城月度GWV破100亿</li>
          <li><em>2019年10月</em>拿到兆云驰名商标，成为全国知名电商品牌</li>
          <li><em>2019年12月</em>跻身全球电商前十甲</li>
        </ul>
      </div>
    </div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				curIdx:2,
				navlist:[{
					id:2,name:'兆云商城'
				},{
					id:3,name:'平台优势'
				},{
					id:4,name:'发展规划'
				}]
			}
		}
	}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .about{
    &.container{
      display:flex
      margin:40px auto 100px
    }
    .about-aside{
      .hgroup{
        background-color:$main-color
        padding-top:24px
        display:block
        width:200px
        height:100px
        color:#fff
        text-align:center
      }
      .title{
        font-size:24px
        line-height:32px
        letter-spacing:1.5px
      }
      .subtitle{
        font-size:14px
        line-height:20px
        margin-top:4px
        font-weight:normal
      }
      .nav{
        a{
          display:block
          width:200px
          height:50px
          line-height:50px
          color:$size-color2
          border-left:4px solid #fff
          background-color:#fff
          font-size:16px
          text-align:center
          margin-top:10px
          border-bottom:1px solid $border-color
          &.on,&:hover{
            background-color:#f3f3f3
            border-left:4px solid $main-color
            border-bottom:1px solid #f3f3f3
            color:$main-color
          }
        }
      }
    }
    .about-cont{
      margin-left:60px
      flex:1
      .title{
        font-size:24px
        color:$size-color2
        letter-spacing:2px
        line-height:32px
      }
      .subtitle{
        font-size:12px
        color:$size-color4
        line-height:14px
        font-weight:normal
      }
      .desc{
        margin-top:40px
        border:1px solid $border-color
        padding:28px 36px
        width:100%
        p{
          font-size:14px
          color:$size-color3
          line-height:24px
        }
        .desc-title{
          font-size:14px
          color:$size-color2
          margin-bottom:30px
          position:relative
          padding-left:14px
          &:before{
            content:''
            position: absolute
            width: 2px
            top: 0
            bottom: 0
            background: $main-color
            left: 0
            transform: rotate(20deg)
          }
        }
        .desc-list{
          position:relative
          padding:10px 0
          &:before{
            content:''
            position:absolute
            top:0
            bottom:0
            left:7px
            border-left:1px dashed $border-color
          }
          li{
            font-size:14px
            padding-left:36px
            color:$size-color3
            line-height:48px
            position:relative
            &:before{
              content:''
              position:absolute
              left:0
              top:50%
              margin-top:-7px
              width:12px
              height:12px
              border-radius:50%
              border:1px solid $border-color
              background-color:#fff
            }
            &:after{
              content:''
              position:absolute
              left:3px
              top:50%
              margin-top:-4px
              width:8px
              height:8px
              border-radius:50%
              background-color:$main-color
            }
          }
          em{
            font-size:16px
            color:$size-color2
            font-style:normal
            margin-right:10px
            font-weight:bold
          }
        }
      }
      .desc+.desc{
        margin-top:20px
      }
    }
  }
</style>

<template>
	<div class="user-cont modify-pwd">
		<login-pwd type="modify" :title="userInfo.password?'修改登录密码':'设置登录密码'"></login-pwd>
	</div>
</template>

<script>
	import LoginPwd from 'base/LoginPwd'
	import {mapState} from 'vuex'
	export default {
		components:{
			LoginPwd
		},
		computed:{
			...mapState(['userInfo'])
		}

	}
</script>



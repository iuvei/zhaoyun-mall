<template>
	<div class="reset-pwd">
		<login-pwd class="container" title="找回登录密码" type="reset"></login-pwd>
	</div>
</template>

<script>
	import LoginPwd from 'base/LoginPwd'
	export default {
		components:{
			LoginPwd
		}
	}
</script>

<style scoped>
	.reset-pwd{padding-top: 50px}
</style>
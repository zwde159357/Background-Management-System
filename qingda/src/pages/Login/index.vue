<template>
	<div class="page-wrapper">
		<h1>青岛大学</h1>
		<div class="login-wrapper">
			<div class="form-wrapper">
				<h2>青岛大学管理系统 - 登录</h2>
				<el-form ref="loginForm" :model="model" :rules="validateRules" :status-icon="true">
					<el-form-item prop="user_name">
						<el-input v-model.trim="model.user_name">
							<div slot="prepend" class="custom-input-prepend">
								<i class="el-icon-user-solid"></i> 用户名：
							</div>
						</el-input>
					</el-form-item>
					<el-form-item prop="user_pwd">
						<el-input type="password" v-model.trim="model.user_pwd">
							<div slot="prepend" class="custom-input-prepend">
								<i class="el-icon-lock"></i> 密码：
							</div>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="login">登录</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: 'Login',
                data() {
                        return {
                                model: { user_name: '', user_pwd: '' },
                                validateRules: {
                                        user_name: [
                                                { required: true, message: '用户名不能为空', trigger: 'blur' },
                                                { min: 2, max: 20, message: '用户名长度 2 - 20', trigger: 'blur' }
                                        ],
                                        user_pwd: [
                                                { required: true, message: '密码不能为空', trigger: 'blur' },
                                                { min: 2, max: 20, message: '密码长度 2 - 20', trigger: 'blur' }
                                        ]
                                }
                        };
                },
	        methods: {
                        login() {
                                this.$refs.loginForm.validate()
	                                .then(async () => {
                                                const token = await this.$http({
	                                                method: 'post',
	                                                url: '/user/login',
	                                                data: this.model
                                                });
                                                sessionStorage.setItem('token', token);
                                                sessionStorage.setItem('user', this.model.user_name);
                                                this.$router.replace('/home');
	                                })
	                                .catch(() => {});
                        }
	        }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>
	@keyframes fall                                                        /* 自定义一个动画 */
		0% { opacity: 0;  transform: scale(0) translateY(20%) rotateY(0deg); }
		40% { opacity: 1;  transform: scale(1) translateY(20%) rotateY(0deg);  }
		60% { opacity: 1;  transform: scale(1) translateY(20%) rotateY(45deg); right: 50%; }
		100% { opacity: 1;  transform: scale(1) translateY(20%) rotateY(45deg); right: 40%;  }
	.page-wrapper
		height 100%
		position relative
		background-image url('./bg.jpg')
		background-size: 100% 100%
		background-position center center
		perspective: 400px                                              /* 视距设置，自动开启3D效果 */
		h1
			padding 10px 50px
			position absolute
			right 50%
			bottom 50%
			transform-origin left center                    /* 变形原点 */
			font-size 150px
			color #0094ff
			border-bottom 1px solid #0094ff
			text-shadow -10px 10px 0 #000
			opacity 0
			transform translateY(20%) scale(0)
			/* css3自定义动画 */
			animation-name fall                                     /* 自定义动画的名字 */
			animation-duration 2s                                   /* 自定义动画持续的时间 */
			animation-timing-function ease-in                /* 自定义动的动画曲线 */
			animation-fill-mode forwards                    /* 自定义动画结束后状态设置 */
			animation-delay 2s                                      /* 自定义动画执行延时时间 */
			&:before
				content '青岛大学'
				padding 10px 50px
				font-size 150px
				color #0094ff
				text-shadow -10px 10px 0 #000
				position absolute
				left: 0
				top 100%
				transform scaleY(-0.8)
			&:after
				content ''
				position absolute
				left 0
				top 100%
				width 100%
				height 100%
	@keyframes slide
		0% { margin-left: 110%; }
		100% { margin-left: 0; }
	.login-wrapper
		position absolute
		top 50%
		left 50%
		transform translateY(-50%)
		width 500px
		height 350px
		overflow hidden
		padding 10px
		.form-wrapper
			width: 100%;
			height: 100%;
			background-color: #fff;
			opacity 0.6
			box-shadow: 0 0 10px 1px #ccc;
			border-radius: 2px;
			margin-left: 110%;
			transition all 0.6s
			/* css3自定义动画 */
			animation-name: slide;                                           /* 自定义动画的名字 */
			animation-duration: 0.6s;                                      /* 自定义动画持续的时间 */
			animation-timing-function: linear;                 /* 自定义动的动画曲线 */
			animation-fill-mode: forwards;                          /* 自定义动画结束后状态设置 */
			animation-delay: 1s;                                            /* 自定义动画执行延时时间 */
			&:hover
				opacity 1
			h2
				text-align: center;
				padding: 40px 0;
				color: #0094ff;
				font-size: 26px;
				text-shadow: 0 1px 0 #fff;
			.el-form
				padding 0 30px
				.el-form-item
					margin-bottom 30px
					text-align center
					.custom-input-prepend
						width 60px
</style>
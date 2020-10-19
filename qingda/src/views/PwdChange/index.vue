<template>
	<div>
		<el-form :model="user" :rules="validForm" ref="form" :disabled="userName === 'admin'">
			<el-form-item prop="oldPwd">
				<el-input v-model="user.oldPwd">
					<template slot="prepend">
						<i class="el-icon-lock" style="margin-right: 5px"></i>
						<span class="input-prepend">原始密码:</span>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="newPwd">
				<el-input v-model="user.newPwd">
					<template slot="prepend">
						<i class="el-icon-lock" style="margin-right: 5px"></i>
						<span class="input-prepend">新密码:</span>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item  prop="reNewPwd">
				<el-input v-model="user.reNewPwd">
					<template slot="prepend">
						<i class="el-icon-lock" style="margin-right: 5px"></i>
						<span class="input-prepend">密码再次确认:</span>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="changePwd">确定</el-button>
			</el-form-item>
		</el-form>
		<p v-show="userName==='admin'" style="color: red; font-size: 16px;">管理员请去配置文件修改密码</p>
	</div>
</template>

<script type="text/ecmascript-6">
	import { UserApi } from '../../util/api.js';

        export default {
                name: 'PwdChange',
	        data() {
                        return {
                                userName: sessionStorage.getItem('user'),
				user: {
				        oldPwd: '',
					newPwd: '',
                                        reNewPwd: ''
				},
                                validForm: {
				        oldPwd: [
					        { required: true, message: '旧密码不能为空' ,trigger: 'blur' },
					        { min: 2, max: 10, message: '旧密码的长度为2 - 10', trigger: 'blur' }
				        ],
	                                newPwd: [
		                                {
                                                        validator: (rule, value, next) => {
								if(value === '')
								        next(new Error('新密码不能为空'));
								else if(value.length < 2 || value.length > 10)
									next(new Error('新密码长度为2 - 10'));
								else if(value === this.user.oldPwd)
								        next(new Error('新旧密码不能一样'));
								else
								        next();
                                                        },
			                                trigger: 'blur'
		                                }
	                                ],
	                                reNewPwd: [
		                                {
		                                        validator: (rule, value, next) => {
		                                                if(value === '')
			                                                next(new Error('新密码不能为空'));
		                                                else if(value !== this.user.newPwd)
		                                                        next(new Error('两次密码不一致'));
		                                                else
			                                                next();
		                                        },
			                                trigger: 'blur'
		                                }
	                                ]
                                }
                        };
	        },
	        methods: {
                        changePwd() {
                                this.$refs.form.validate()
	                                .then(async () => {
						if(sessionStorage.getItem('user') === 'admin')
						        this.$alert('管理员请去配置文件修改', '提示', { type: 'warning' });
						else {
							await UserApi.changePwd(this.user);
							this.$message({type: 'success', message: '密码修改成功'});
						}
	                                })
	                                .catch(() => {});
                        }
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-form
		width 450px
	span.input-prepend
		display inline-block
		width 80px
</style>
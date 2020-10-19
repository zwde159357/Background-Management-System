<template>
	<div>
		<el-container style="padding: 0 !important;">
			<el-header>
				<div>
					<el-input v-model="search.user_name" prefix-icon="el-icon-search" placeholder="请输入搜索内容"
					@blur="getUsers(true)">
						<template slot="prepend">
							<span>用户名称:</span>
						</template>
					</el-input>
					用户角色：
					<el-select v-model="search.role_id" placeholder="请选择" @change="getUsers(true)">
						<el-option label="- 请选择 -" :value="-1"></el-option>
						<el-option label="- 无角色 -" :value="0"></el-option>
						<el-option v-for="item in roleList" :key="item.role_id"
						           :value="item.role_id" :label="item.role_name"></el-option>
					</el-select>
				</div>
				<el-button class="el-icon-plus" type="primary" @click="addEvent">新增</el-button>
			</el-header>
			<el-main>
				<el-table :data="endList" border stripe>
					<el-table-column label="序号" width="50px" type="index" align="center"></el-table-column>
					<el-table-column label="用户名" prop="user_name" width="150px" align="center"></el-table-column>
					<el-table-column label="密码" width="150px" align="center">
						<template slot-scope="{ row }">
							<el-popover title="密码" :content="row.user_pwd" trigger="click" placement="right">
								<el-button icon="el-icon-view" type="text" slot="reference">查看</el-button>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="角色" prop="role_name" width="150px" align="center"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="warning" icon="el-icon-edit-outline" @click="updateEvent(scope.row)" size="medium">编辑</el-button>
							<el-button type="danger" icon="el-icon-delete" @click="remove(scope.row)" size="medium">删除</el-button>
							<el-popover placement="right" width="400" trigger="click" style="margin-left: 10px;">
								<h3 v-text="`用户${ scope.row.user_name } - 角色分配:`" style="padding: 10px 0"></h3>
								<el-form :inline="true">
									<el-form-item label="角色:" label-width="50px">
										<el-select v-model="assignValue" placeholder="请选择">
											<el-option label="- 无角色 -" :value="0"></el-option>
											<el-option v-for="item in roleList" :key="item.role_id"
											:value="item.role_id" :label="item.role_name"></el-option>
										</el-select>
										<el-form-item>
											<el-button type="primary" style="margin-left: 20px;" @click="assignRole(scope.row)"> 分配</el-button>
										</el-form-item>
									</el-form-item>
								</el-form>
								<el-button type="primary"  @click.native="assignValue = scope.row.role_id" slot="reference" icon="el-icon-setting" size="medium">角色分配</el-button>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
			</el-main>
			<el-footer>
				<el-pagination layout="total, prev, pager, next, jumper, ->, sizes"
			               :total="pagination.total" background
			               :page-sizes="[5, 8, 10, 12, 15]"
		                       :page-size.sync="pagination.pageSize"
	                               :current-page.sync="pagination.currentPage"
                                       @current-change="getUsers(false)"
					@size-change="getUsers(true)"
					style="width: 100%;"></el-pagination>
			</el-footer>
		</el-container>
		<el-dialog :title="`用户编辑 - ${ edit.mode ? '新增' : '修改' }`" :visible="edit.isEdit" :modal="false" width="500px">
			<el-form :model="edit.model" :rules="edit.validForm" :status-icon="true" ref="form">
				<el-form-item label="用户名" label-width="80px" prop="user_name">
					<el-input v-model="edit.model.user_name" :disabled="!edit.mode"></el-input>
				</el-form-item >
				<el-form-item label="密码" label-width="80px" prop="user_pwd">
					<el-input v-model="edit.model.user_pwd"></el-input>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button @click="save" type="primary">确定</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
	import { UserApi } from '../../util/api.js';
	import { createNamespacedHelpers } from 'vuex';
	const { mapState, mapActions } = createNamespacedHelpers('role');

        export default {
                name: 'User',
	        data() {
                        return {
                                list: [],
	                        assignValue: 0,                // 分配角色
	                        search: {
                                        user_name: '',
		                        role_id: -1,
	                        },
	                        pagination: {
                                        total: 0,
		                        pageSize: 5,
		                        currentPage: 1
	                        },
	                        edit: {
                                        isEdit: false,
		                        mode: true,
		                        model: { user_name: '', user_pwd: ''},
                                        validForm: {
                                                user_name: [
	                                                { required: true, message: "用户名不能为空", trigger: 'blur' },
	                                                { min: 4, max: 30, message: "用户名长度为4-30", trigger: 'blur' }
                                                ],
			                        user_pwd: [
				                        { required: true, message: "密码不能为空", trigger: 'blur' },
				                        { min: 3, max: 20, message: "密码长度3-20", trigger: 'blur' }
			                        ]
		                        }
	                        },
                        };
	        },
	        computed: {
                        ...mapState({ roleList: 'list' }),
                        endList() {
                                let list = [];
                                this.list.forEach(item => {
                                        let temp = {};
	                                temp.user_name = item.user_name;
                                        temp.user_pwd = item.user_pwd;
	                                if(item.role_id) {
                                                temp.role_id = item.role_id;
                                                temp.role_name = this.roleList.find(func => func.role_id === item.role_id).role_name;
	                                }
	                                else {
                                                temp.role_id = 0;
                                                temp.role_name = '无角色';
	                                }
	                                list.push(temp);
                                });
                                return list;
                        },
	        },
	        methods: {
                        async remove(row) {
	                        await this.$confirmEx(`真要删除用户: ${ row.user_name } 吗?`, '提示', { type: 'warning' });
                                // 删除一条用户记录
                                await UserApi.remove(row.user_name);
                                let i = this.list.findIndex(item => item.user_name === row.user_name);
                                this.list.splice(i, 1);
                                this.$message({ message: `删除用户: ${ row.user_name } 成功`, type: 'success' });

                                this.pagination.total = this.pagination.total - 1;
                                this.$nextTick(() => {
                                        if(this.list.length === 0) this.getUsers(false);
                                });
                        },
		        addEvent() {
                                if(this.$refs.form) this.$refs.form.resetFields();
				this.edit.model.user_name = '';
				this.edit.model.user_pwd = '';
                                this.edit.mode = true;
				this.edit.isEdit = true;
		        },
		        updateEvent(row) {
                                if(this.$refs.form) this.$refs.form.resetFields();
				this.edit.model.user_name = row.user_name;
				this.edit.model.user_pwd = row.user_pwd;
				this.edit.mode = false;
				this.edit.isEdit = true;
		        },
		        save() {
                                this.$refs.form.validate()
	                                .then(async () => {
                                                if(this.edit.mode) {
                                                        const count = await UserApi.validName(this.edit.model.user_name );
                                                        if(count > 0) {
								this.$message({ type: 'error', message: `用户名: "${ this.edit.model.user_name }", 在系统中已存在` });
                                                                return;
                                                        }

							await UserApi.add(this.edit.model);
	                                                this.list.push(JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: `新增用户: ${ this.edit.model.user_name } 成功!` });
                                                } else {
                                                        await UserApi.update(this.edit.model);
                                                        let i = this.list.findIndex(item => item.user_name === this.edit.model.user_name);
                                                        this.list.splice(i, 1, JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: `修改用户: ${ this.edit.model.user_name }  密码成功!` });
                                                }
                                                this.edit.isEdit = false;
	                                })
	                                .catch(() => {});
		        },
                        async assignRole(row) {
	                        await UserApi.setRole({
	                                        user_name: row.user_name,
	                                        role_id: this.assignValue
		                        }
	                        );
	                        this.list.find(item => item.user_name === row.user_name).role_id = this.assignValue;
	                        this.$message({ type: 'success', message: `用户${ row.user_name }角色设定成功` });
                        },
		        ...mapActions({ roleInit: 'init' }),
                        async getUsers(isStartOverAgain = true) {
                                if(isStartOverAgain) this.pagination.currentPage = 1;
                                let { list, total } = await UserApi.list({
                                        ...this.search,
                                        begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                        pageSize:  this.pagination.pageSize
                                });
                                this.list = list;
                                this.pagination.total = total;
                        }
	        },
	        async created() {
			await this.roleInit();
			this.getUsers();
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-table >>> td
		padding 6px 0!important
	.el-container
		position absolute
		left 0
		top 0
		width 100%
		height 100%
		flex-shrink 0
		padding 0 !important
		display flex
		flex-direction column
		.el-header
			flex-shrink 0
			padding 0
			height 40px !important
			margin-bottom 10px
			display flex
			justify-content space-between
			.el-input
				width 340px
				margin-right 40px
		.el-main
			padding 0
			border 1px solid #ddd
		.el-footer
			flex-shrink 0
			height 40px !important
			display flex
			align-items center
			span.total
				display inline-block
</style>
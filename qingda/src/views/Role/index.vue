<template>
	<div>
		<el-row :gutter="20">
			<transition-group name="edit">
				<el-col v-for="item in roleList" :key="item.role_id" :span="6">
					<el-card :body-style="cardCSS"
					         @mouseover.native="hoverId = item.role_id"  @mouseout.native="hoverId = 0">
						<p v-text="item.role_name"></p>
						<div class="mask" v-show="item.role_id === hoverId">
							<el-button type="text" icon="el-icon-edit-outline" @click="beginUpdate(item)">编辑</el-button>
							<el-button type="text" icon="el-icon-setting" @click="beginAssign(item.role_id)">功能分配</el-button>
							<el-button type="text" icon="el-icon-delete" @click="remove(item.role_id)">删除</el-button>
						</div>
					</el-card>
				</el-col>
			</transition-group>
			<el-col :span="6">
				<el-card :body-style="cardCSS" style="border: 2px dashed black" @click.native="beginAdd">
					<i class="el-icon-plus"></i>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog  :visible="edit.isEdit" width="40%" :modal="false" :show-close="false">
			<el-form ref="form" :model="edit.model" :rules="edit.validForm" :status-icon="true">
				<el-form-item label="角色名称" label-width="100px" prop="role_name">
					<el-input v-model.trim="edit.model.role_name"></el-input>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button @click="save" type="primary">确定</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</template>
			<template slot="title">
				<span v-text="`角色编辑 - ${ edit.mode ? '新增' : '修改' }`"></span>
			</template>
		</el-dialog>
		<el-drawer :visible="assignRole.isEdit" :show-close="false" size="500px" :modal="false" class="custom-drawer">
			<template slot="title"><h2>功能分配</h2></template>

			<el-tree :data="assignRole.treeData" :props="{ label: 'func_name' }"
			         class="custom-tree" default-expand-all :expand-on-click-node="false">
				<span slot-scope="{ node, data }" class="custom-tree-span">
					<span :class="{ active: data.selected }">
						<i v-if="data.func_key" class="el-icon-menu" style="color: rgba(64, 158, 255);
							margin-right: 8px;"></i>
						<span v-text="data.func_name"></span>
					</span>
					<span class="switch-wrapper" :class="{ parent: data.func_fid === 0 }">
						<el-switch v-model="data.selected" @change="switchChangeHandle(data)"></el-switch>
					</span>
				</span>
			</el-tree>
			<div class="btn-wrapper">
				<el-button type="primary"  @click="configRoleFunc">确定</el-button>
				<el-button type="warning" @click="assignRole.isEdit = false" >取消</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script type="text/ecmascript-6">
	// 一对一
//	import { createNamespacedHelpers } from 'vuex';
//	const { mapState, mapActions } = createNamespacedHelpers('role');
	// 一对多
	import { mapState, mapActions } from 'vuex';
	import { RoleFuncApi } from '../../util/api.js';

        export default {
                name: 'Role',
	        data() {
                        return {
	                        cardCSS: {
                                        display: 'flex',
		                        justifyContent: 'center',
		                        alignItems: 'center',
		                        height: '80px',
		                        backgroundColor: "#ff4A42"
	                        },
	                        hoverId: 0,
	                        edit: {
                                        isEdit: false,
		                        mode: true,
		                        model: { role_id: 0, role_name: '' },
		                        validForm: {
                                                role_name: [
	                                                {
	                                                        validator: (rule, value, next) => {
									if(value === '')
									        next(new Error('角色名称不能为空'));
									else if(value.length < 2 || value.length > 10)
										next(new Error("角色名称长度2 - 10"));
									else if(this.roleList.some(item => item.role_id !== this.edit.model.role_id && item.role_name === value))
										next(new Error('角色名已存在'));
									else
									        next();
	                                                        },
		                                                trigger: 'blur'
	                                                },
                                                ],
		                        }
	                        },
	                        assignRole: {
	                                isEdit: false,
		                        roleFuncList: [],
		                        treeData: [],
		                        model: { role_id:0, role_func_ids: '' },
	                        }
                        };
	        },
	        computed: {
		        ...mapState('role', { roleList: 'list' }),
		        ...mapState('func', { funcList: 'list' }),
                },
	        methods: {
		        ...mapActions('role', ['add', 'update']),
		        ...mapActions('role', { roleInit: 'init', removeX: 'remove' }),
		        ...mapActions('func', { funcInit: 'init' }),
                        async remove(id) {
                                await this.$confirmEx('真删除吗?', '提示信息', { type: 'warning' });
                                await this.removeX(id);
                                this.$message({ type: 'info', message: '删除成功' });
                        },
		        beginAdd() {
                                if(this.$refs.form) this.$refs.form.resetFields();
				this.edit.model.role_id = 0;
				this.edit.model.role_name = '';
                                this.edit.mode = true;
				this.edit.isEdit = true;
		        },
		        beginUpdate(role) {
                                if(this.$refs.form) this.$refs.form.resetFields();
                                this.edit.model.role_id = role.role_id;
                                this.edit.model.role_name = role.role_name;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
		        },
		        save() {
                                this.$refs.form.validate()
	                                .then(async () => {
                                                if(this.edit.mode) {
                                                        await this.add(JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: '新增成功！' });
                                                } else {
                                                        await this.update(JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: '修改成功！' });
                                                }
                                                this.edit.isEdit = false;
	                                })
	                                .catch(() => {});
		        },
		        _updateTreeData() {
                                let result = [];
                                this.funcList.filter(item => item.func_fid === 0).forEach(func => {
                                        let node = JSON.parse(JSON.stringify(func));
                                        node.selected = this.assignRole.roleFuncList.some(item => item.func_id === func.func_id);
                                        if(!node.func_key) {
                                                let children = this.funcList.filter(item => item.func_fid === node.func_id);
                                                if(children.length) {
                                                        node.children = [];
                                                        children.forEach(func2 => {
                                                                let child = JSON.parse(JSON.stringify(func2));
                                                                child.selected = this.assignRole.roleFuncList.some(item => item.func_id === func2.func_id);
                                                                node.children.push(child);
                                                        });
                                                }
                                        }
                                        result.push(node);
                                });
                                this.assignRole.treeData = result;
		        },
                        async beginAssign(id) {
	                        this.assignRole.model.role_id = id;
	                        this.assignRole.roleFuncList = await RoleFuncApi.getRoleFunc(id);

                                this._updateTreeData();
	                        this.assignRole.isEdit = true;
                        },
		        switchChangeHandle(func) {
		                if(func.children) {
		                        func.children.forEach(item => item.selected = func.selected);
		                } else {
					if(func.func_fid === 0) return;
		                        let father = this.assignRole.treeData.find(item => item.func_id === func.func_fid);
		                        father.selected = father.children.some(item => item.selected);
		                }
		        },
		        async configRoleFunc() {
				let ids = [];
				this.assignRole.treeData.forEach(item =>  {
				        if(item.selected) {
				                ids.push(item.func_id);
				                if(item.children) {
				                        item.children.forEach(item2 => {
				                                if(item2.selected) ids.push(item2.func_id);
				                        });
				                }
				        }
				});
				this.assignRole.model.role_func_ids = ids.join(',');

			        await RoleFuncApi.configRoleFunc(this.assignRole.model);
				this.assignRole.isEdit = false;
		                this.$message({ type: 'success', message: '角色功能配置成功！' });
		        }
	        },
	        created() {
                        this.funcInit();
                        this.roleInit();
                },
	        watch: {
                        funcList() {
                                this._updateTreeData();
                        },
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	p
		font-size 24px
		color white
		text-shadow: 4px 4px 10px black
		font-weight bolder
	i
		color white
		font-size 2em
	div.title
		background-color blueviolet
	.edit-enter,.edit-leave-to
		opacity 0
	.edit-enter-active,.edit-leave-active
		transition all 0.5s
	.el-col
		margin-bottom 20px
	.el-card
		position relative
		.mask
			position absolute
			width 100%
			height 100%
			left 0
			top 0
			background-color rgba(0,0,0,0.5)
			display flex
			justify-content center
			align-items center
			.el-button
				font-size 16px
				color white
				&:hover
					color gold
					text-decoration underline
	.el-tree
		width 400px
		margin-left 32px
		padding 20px
		.custom-tree-span
			width 100%
			font-size 16px
			display flex
			align-items center
			justify-content space-between
			color #b8b9bb
			span.active
				color black
			span.switch-wrapper
				&.parent
					transform translateX(-100%)
	.btn-wrapper
		display flex
		padding 10px 40px

</style>
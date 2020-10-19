<template>
	<div>
		<el-tree :data="treeData" :props="{ label: 'func_name' }"
		class="custom-tree" default-expand-all :expand-on-click-node="false">
			<span slot-scope="{ node, data }" class="custom-tree-span">
				<span>
					<i v-if="data.func_key" class="el-icon-menu" style="color: rgba(64, 158, 255); margin-right: 8px;"></i>
					<span v-text="data.func_name"></span>
				</span>
				<span>
					<el-button type="text" class="el-icon-plus" v-show="!data.func_key" @click="beginAdd(data)"></el-button>
					<el-button type="text" class="el-icon-edit-outline" v-show="data.func_id !== 0" @click="beginUpdate(data)"></el-button>
					<el-button type="text" class="el-icon-delete" v-show="[0, 1, 2].indexOf(data.func_id) === -1" :disabled="!!data.children" @click="remove(data)"></el-button>
				</span>
			</span>
		</el-tree>
		<el-dialog :visible="edit.isEdit" :modal="false" :show-close="false">
			<el-form label-width="100px" :model="edit.model" :rules="edit.validForm" status-icon ref="form">
				<el-form-item label="功能类型">
					<el-radio-group v-model="edit.isLeaf" :disabled="!(edit.mode && edit.model.func_fid === 0)">
						<el-radio :label="false">非叶子节点</el-radio>
						<el-radio :label="true">叶子结点</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="父级功能">
					<el-select v-model="edit.model.func_fid" :disabled="!(edit.isLeaf && !edit.mode)">
						<el-option label="Root" :value="0"></el-option>
						<el-option v-for="item in list.filter(item => item.func_key === '' )"
						:key="item.func_id" :value="item.func_id" :label="item.func_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="功能名称" prop="func_name">
					<el-input v-model.trim="edit.model.func_name"></el-input>
				</el-form-item>
				<el-form-item label="功能对应组件" v-show="edit.isLeaf" prop="func_key">
					<el-select v-model="edit.model.func_key">
						<el-option v-for="(value, item) in views" :key="item" :value="item"
						:label="value.name" :disabled="list.some(item2 => item2.func_key === item)">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</template>
			<template slot="title">
				<div style="height: 100%">
					<span v-text="`功能编辑 - ${ edit.mode ? '新增' : '修改' }`"></span>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
	import views from '../index';
	import { createNamespacedHelpers } from 'vuex';
	const { mapActions, mapState } = createNamespacedHelpers('func');

        export default {
                name: 'Func',
	        data() {
                        return {
                                views,
				edit: {
                                        isEdit: false,
					mode: true,
					isLeaf: true,
					model: { func_id: 0, func_name: '', func_key: '', func_fid: -1 },
					validForm: {
                                                func_name: [
	                                                {
                                                                validator: (rule, value, next) => {
									if(value === '')
									        next(new Error('功能名称不能为空'));
									else if(value.length < 2 || value.length > 10)
										next(new Error('功能名称长度为2 - 10'));
									else if(this.list.some(item => item.func_id !== this.edit.model.func_id
											&& item.func_fid === this.edit.model.func_fid
											&& item.func_name === value
											))
										next(new Error('功能名称已存在'));
									else
									        next();
                                                                 },
		                                                trigger: 'blur'
	                                                },
                                                ],
						func_key: [
							{
								validator: (rule, value, next) => {
								        if(this.edit.isLeaf && !value) next('*叶子节点必须绑定对应的组件');
								        else next();
								},
								trigger: 'change'
							}
						],
					}
				}
                        }
	        },
	        computed: {
                        treeData() {
                                let result = [ { func_id: 0, func_name: 'Root', func_key: '', func_fid: -1, children: []  } ];
                                this.list.filter(item => item.func_fid === 0).forEach(func => {
					let node = JSON.parse(JSON.stringify(func));
					if(!node.func_key) {
					        let children = this.list.filter(item => item.func_fid === node.func_id);
						if(children.length) {
						        node.children = [];
						        children.forEach(func2 => node.children.push(JSON.parse(JSON.stringify(func2))));
						}
					}
                                        result[0].children.push(node);
                                });
                                return result;
                        },
		        ...mapState(['list']),
	        },
	        methods: {
		        async remove(func) {
				await this.$confirmEx(`确定删除功能: ${ func.func_name } ? `, '提示', { type: 'warning' });
                                await this.removeX(func.func_id);
                                this.$message({
                                        type: 'success',
                                        message: `删除功能: ${ func.func_name } 成功 ,请刷新页面!`
                                });
		        },
		        beginAdd(data) {
				if(this.$refs.form) this.$refs.form.resetFields();
				this.edit.model.func_id = 0;
				this.edit.model.func_name = '';
				this.edit.model.func_key = '';
				this.edit.model.func_fid = data.func_id;

			        this.edit.isLeaf = data.func_fid === 0;
			        this.edit.mode = true;
				this.edit.isEdit = true;
		        },
		        beginUpdate(data) {
		                if(this.$refs.form) this.$refs.form.resetFields();
				this.edit.model.func_id = data.func_id;
				this.edit.model.func_name = data.func_name;
				this.edit.model.func_key = data.func_key;
				this.edit.model.func_fid = data.func_fid;

		                this.edit.isLeaf = data.func_key !== '';
		                this.edit.mode = false;
		                this.edit.isEdit = true;
		        },
		        save() {
		                this.$refs.form.validate()
			                .then(async () => {
						if(this.edit.mode) {
                                                        await this.add(JSON.parse(JSON.stringify(this.edit.model)));
							this.$message({ type: 'success', message: '新增成功！请刷新页面' });
						} else {
						        await this.update(JSON.parse(JSON.stringify(this.edit.model)));
							this.$message({ type: 'success', message: '修改成功！请刷新页面' });
						}
						this.edit.isEdit = false;
			                })
			                .catch(() => {});
		        },
		        ...mapActions(['init', 'add', 'update']),
		        ...mapActions({ removeX: 'remove' })
	        },
	        created() { this.init(); }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-tree
		width 500px
		.custom-tree-span
			width 100%
			font-size 16px
			display flex
			align-items center
			justify-content space-between

</style>
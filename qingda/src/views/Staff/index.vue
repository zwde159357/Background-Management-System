<template>
	<div>
		<el-container>
			<el-header>
				<div>
					<el-input  v-model="search.stf_name" prefix-icon="el-icon-search" placeholder="请输入搜索内容" @blur="getStaff(true)">
						<template slot="prepend">
							<span>员工名称:</span>
						</template>
					</el-input>
					员工类型：
					<el-select  v-model="search.stf_category" placeholder="请选择" @change="getStaff(true)">
						<el-option label="- 所有类型 -" :value="0"></el-option>
						<el-option v-for="item in types.filter(it => it.dic_group_key === 'staff_category')" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id"></el-option>
					</el-select>
				</div>
				<el-button class="el-icon-plus" type="primary" @click="addEvent">新增</el-button>
			</el-header>
			<el-main>
				<el-table :data="list" border stripe height="100%">
					<el-table-column label="序号" width="50px" type="index" align="center"></el-table-column>
					<el-table-column label="姓名" prop="stf_name" width="120px" align="center"></el-table-column>
					<el-table-column label="职务类型" width="120px" align="center">
						<template slot-scope="{ row }">
							<span v-text="types.find(item => item.dic_id === row.stf_category).dic_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="stf_remark" width="350px">
						<template slot-scope="scope">
							<span v-text="`${ scope.row.stf_remark ? scope.row.stf_remark : '暂无相关备注' }`"
							:class="{ none: !scope.row.stf_remark }"></span>
						</template>
					</el-table-column>
					<el-table-column label="员工状态" width="150px" align="center" prop='status'>
						<template slot-scope="{ row }">
							<span :class="{ active: !row.stf_invalid }" v-text="`${ row.stf_invalid ? '在职' : '离职' }`"></span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="{ row }">
							<el-button type="warning" icon="el-icon-edit-outline"  size="medium" @click="updateEvent(row)">编辑</el-button>
							<el-button type='danger'  size="medium" v-text="`${ row.stf_invalid ? '离职' : '入职' }`"@click="changeStatus(row)"
							:class="{ active: !row.stf_invalid }"></el-button>
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
				               @current-change = "getStaff(false)"
				               @size-change="getStaff(true)"
				               style="width: 100%;"></el-pagination>
			</el-footer>
		</el-container>
		<el-dialog :title="`员工编辑 - ${ edit.mode ? '新增' : '修改' }`" :visible="edit.isEdit" :modal="false" width="500px">
			<el-form :model="edit.model" :rules="edit.validForm" :status-icon="true" ref="form">
				<el-form-item label="员工名字" label-width="80px" prop="stf_name">
					<el-input v-model="edit.model.stf_name"></el-input>
				</el-form-item >
				<el-form-item label="员工类型" label-width="80px" prop="stf_category">
					<el-select placeholder="请选择" v-model="edit.model.stf_category">
						<el-option label="- 请选择 -" :value="0"></el-option>
						<el-option v-for="item in types.filter(it => it.dic_group_key === 'staff_category')" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="员工备注" label-width="80px">
					<el-input type="textarea" v-model="edit.model.stf_remark" placeholder="请输入内容"></el-input>
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
	import { mapState, mapActions } from 'vuex';

        export default {
                name: 'Staff',
	        data() {
                        return {
				search: {
                                        stf_category: 0,
				        stf_name: '',
				},
	                        pagination: {
				        total: 0,
		                        pageSize: 5,
		                        currentPage: 1
	                        },
	                        edit: {
				        isEdit: false,
		                        mode: true,
		                        model: {
				                stf_id: 0,
                                                stf_category: 0,
				                stf_name: '',
			                        stf_remark: '',
			                        stf_invalid: 1,
		                        },
                                        validForm: {
				                stf_name: [
					                {
								validator: (rule, value, next) => {
								        if(value === '')
								                next(new Error('员工名字不能为空'));
								        else if(value.length < 2 || value.length > 5)
								                next(new Error('员工名字长度为2-5'));
								        else
								                next();
								},
						                trigger: 'blur'
					                }
				                ],
                                                stf_category: [
                                                        {
                                                                validator: (rule, value, next) => {
                                                                        if(value === 0)
                                                                                next(new Error('员工类型不能为空'));
                                                                        else
                                                                                next();
                                                                },
                                                                trigger: 'change'
                                                        }
                                                ]
                                        }
	                        }
                        };
	        },
	        computed: {
                        ...mapState('dictionary', { types: 'list' }),
                        ...mapState('staff', ['total', 'list']),
	        },
	        methods: {
                        ...mapActions('dictionary',['getStaffInfo']),
		        ...mapActions('staff', ['init','add','update','dimission','reinstate']),
                        async getStaff(isStartOverAgain = true) {
                                if(isStartOverAgain) this.pagination.currentPage = 1;
                                await this.init({
                                        ...this.search,
                                        begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                        pageSize: this.pagination.pageSize
                                });
                                this.pagination.total = this.total;
                        },
                        addEvent() {
                                if(this.$refs.form) this.$refs.form.resetFields();
                                this.edit.model.stf_id = 0;
                                this.edit.model.stf_name = '';
                                this.edit.model.stf_category = 0;
                                this.edit.model.stf_remark = '';
                                this.edit.mode = true;
                                this.edit.isEdit = true;
                        },
                        updateEvent(row) {
                                if(this.$refs.form) this.$refs.form.resetFields();
                                this.edit.model.stf_id = row.stf_id;
                                this.edit.model.stf_name = row.stf_name;
                                this.edit.model.stf_category = row.stf_category;
                                this.edit.model.stf_remark = row.stf_remark;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
                        save() {
                                this.$refs.form.validate()
                                        .then(async () => {
                                                if(this.edit.mode) {
                                                        await this.add(JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: `新增员工: ${ this.edit.model.stf_name } 成功!` });
                                                } else {
                                                        await this.update(JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: `修改员工: ${ this.edit.model.stf_name }  信息成功!` });
                                                }
                                                this.edit.isEdit = false;
                                        })
                                        .catch(() => {});
                        },
		        async changeStatus(row) {
				await this.$confirmEx(`确定让员工${ row.stf_name }${ row.stf_invalid ? '离职' : '入职'  }吗？`, '提示', { type: 'warning' });
				if(row.stf_invalid) {
                                        await this.dimission(row.stf_id);
				} else {
				        await this.reinstate(row.stf_id);
				}
				this.$message({ type: 'success', message: `员工${ row.stf_name }${ row.stf_invalid ? '入职' : '离职'  }成功!` });
		        },
	        },
	        created() {
                        this.getStaff(true);
                        this.getStaffInfo();
	        },
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-table >>> td
		padding 6px 0!important
		.cell
			span.active
				color red
			span.none
				color #aaa
			.el-button.active
				color #FFF
				background-color #409EFF
				border-color #409EFF
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
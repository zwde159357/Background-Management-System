<template>
	<el-container>
		<el-header>
			<el-form inline>
				<el-form-item label="班级名称：" label-width="100px">
					<el-input v-model="search.cls_name" placeholder="请输入" @blur="getList(true)"></el-input>
				</el-form-item>
				<el-form-item label="班级专业：" label-width="100px">
					<el-select v-model="search.cls_dic_id_major" @change="getList(true)">
						<el-option label="- 请选择 -" :value="0"></el-option>
						<el-option v-for="item in majorTypes" :key="item.dic_id"
						:value="item.dic_id" :label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级状态：" label-width="100px">
					<el-select v-model="search.cls_status" @change="getList(true)">
						<el-option label="-所有-" :value="0"></el-option>
						<el-option label="开课中" :value="1"></el-option>
						<el-option label="未开课" :value="2"></el-option>
						<el-option label="结课" :value="3"></el-option>
						<!--<el-option v-for="item in statusList" :key="item.status_id"-->
						           <!--:value="item.status_id" :label="item.status_name"></el-option>-->
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button class="el-icon-plus" type="primary" @click="beginAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="endList" border stripe height="100%">
				<el-table-column label="序号" width="50px" type="index" align="center"></el-table-column>
				<el-table-column label="班级名称" width="100px" align="center" prop="cls_name"></el-table-column>
				<el-table-column label="班级专业" width="100px" align="center" prop="cls_dic_id_major_name"></el-table-column>
				<el-table-column label="教学老师" width="100px" align="center" prop="cls_stf_id_teacher_name"></el-table-column>
				<el-table-column label="教务老师" width="100px" align="center" prop="cls_stf_id_admin_name"></el-table-column>
				<el-table-column label="就业老师" width="100px" align="center" prop="cls_stf_id_job_name"></el-table-column>
				<el-table-column label="教室" width="100px" align="center" prop="cls_clsr_name"></el-table-column>
				<el-table-column label="开课时间" width="100px" align="center" prop="cls_begin"></el-table-column>
				<el-table-column label="结课时间" width="100px" align="center" prop="cls_end"></el-table-column>
				<el-table-column label="班级状态" width="100px" align="center" prop="cls_status">
					<template slot-scope="{ row }">
						<span v-show="row.cls_status === '结课'" v-text="row.cls_status" style="color: #aaa;"></span>
						<span v-show="row.cls_status === '开课中'" v-text="row.cls_status" style="color: red;"></span>
						<span v-show="row.cls_status === '未开课'" v-text="row.cls_status" style="color: green;"></span>
					</template>
				</el-table-column>
				<el-table-column label="备注" width="400px">
					<template slot-scope="{ row }">
						<span v-show="row.cls_remark" v-text="row.cls_remark"></span>
						<span v-show="!row.cls_remark" style="font-size: 14px; color: #aaa;">暂无相关备注</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="{ row }">
						<el-button icon="el-icon-edit-outline" type="primary" size="medium" @click="beginUpdate(row)">修改</el-button>
						<el-button type="success" size="medium" v-show="row.cls_status === '未开课'" @click="beginClass(row)">开课</el-button>
						<el-button type="danger" size="medium" v-show="row.cls_status === '开课中'" @click="endClass(row)">结课</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination layout="total, prev, pager, next, jumper, ->, sizes"
			:total="pagination.total" :pageSize.sync="pagination.pageSize" :currentPage.sync="pagination.currentPage"
			:page-sizes="[5, 8, 10, 12, 15]" @current-change="getList(false)" @size-change="getList(true)"></el-pagination>
		</el-footer>
		<el-dialog :visible="edit.isEdit" :modal="false" :show-close="false" :title="`班级编辑 - ${ edit.mode ? '新增' : '修改' }`" width="560px">
			<el-form :model="edit.model" ref="form" :rules="edit.validForm" :status-icon="true">
				<el-form-item label="班级名称：" label-width="100px" prop="cls_name">
					<el-input v-model="edit.model.cls_name" placeholder="请输入班级名称..."></el-input>
				</el-form-item>
				<el-form-item label="班级专业：" label-width="100px" prop="cls_dic_id_major">
					<el-select v-model="edit.model.cls_dic_id_major">
						<el-option label='- 请选择 -' :value="0"></el-option>
						<el-option v-for="item in majorTypes" :key="item.dic_id" :value="item.dic_id" :label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教学老师：" label-width="100px" prop="cls_stf_id_teacher">
					<el-select v-model="edit.model.cls_stf_id_teacher">
						<el-option label='- 请选择 -' :value="0"></el-option>
						<el-option v-for="item in staffList.filter(it => it.stf_category === 4)" :key="item.stf_id" :value="item.stf_id" :label="item.stf_name" :disabled="item.stf_invalid === 0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教务老师：" label-width="100px" prop="cls_stf_id_admin">
					<el-select v-model="edit.model.cls_stf_id_admin">
						<el-option label='- 请选择 -' :value="0"></el-option>
						<el-option v-for="item in staffList.filter(it => it.stf_category === 5)" :key="item.stf_id" :value="item.stf_id" :label="item.stf_name" :disabled="item.stf_invalid === 0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="就业老师：" label-width="100px" prop="cls_stf_id_job">
					<el-select v-model="edit.model.cls_stf_id_job">
						<el-option label='- 请选择 -' :value="0"></el-option>
						<el-option v-for="item in staffList.filter(it => it.stf_category === 6)" :key="item.stf_id" :value="item.stf_id" :label="item.stf_name" :disabled="item.stf_invalid === 0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教室：" label-width="100px" v-show="!edit.mode && !edit.model.cls_end && edit.model.cls_begin">
					<el-select v-model="edit.model.cls_clsr_id">
						<el-option label='- 请选择 -' :value="0"></el-option>
						<el-option v-for="item in classRoomList" :key="item.clsr_id" :value="item.clsr_id" :label="item.clsr_name"
						:disabled="item.clsr_occupy === 1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级备注：" label-width="100px" :show-overflow-tooltip="true">
					<el-input type="textarea" v-model="edit.model.cls_remark" placeholder="请输入班级备注..."></el-input>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</template>
		</el-dialog>
		<el-dialog :modal="false" :visible="edit2.isEdit" :show-close="false" :title="`${ edit2.mode ? '开班' : '结课' }`" width="560px">
			<el-form :model="edit2.model" :rules="edit2.validForm" :status-icon="true" ref="secondForm">
				<el-form-item label="教室：" label-width="100px" prop="cls_clsr_id">
					<el-select v-model="edit2.model.cls_clsr_id">
						<el-option label='- 请选择 -' :value="0"></el-option>
						<el-option v-for="item in classRoomList" :key="item.clsr_id" :value="item.clsr_id" :label="item.clsr_name"
						           :disabled="item.clsr_occupy === 1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="primary" @click="save2">确定</el-button>
				<el-button @click="edit2.isEdit = false">取消</el-button>
			</template>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import { mapState, mapActions } from 'vuex';
	import { ClassApi,StaffApi } from '../../util/api.js';

        export default {
                name: 'Class',
	        data() {
                        return {
                                search: {
					cls_name: '',
	                                cls_dic_id_major: 0,
                                        cls_status: 0
                                },
                                pagination: {
                                        total: 0,
                                        pageSize: 5,
                                        currentPage: 1
                                },
	                        classList: [],
	                        statusList: [
		                        { status_id: 0, status_name: '- 所有 -' },
                                        { status_id: 1, status_name: '开课中' },
                                        { status_id: 2, status_name: '未开课' },
                                        { status_id: 3, status_name: '结课' },
	                        ],
	                        edit: {
                                        isEdit: false,
		                        mode: true,
		                        model: {
                                                cls_id: 0,
                                                cls_name: '',
			                        cls_dic_id_major: 0,
                                                cls_clsr_id: null,
                                                cls_stf_id_teacher: 0,
                                                cls_stf_id_admin: 0,
                                                cls_stf_id_job: 0,
                                                cls_begin: null,
                                                cls_end: null,
                                                cls_remark: '',
		                        },
		                        validForm: {
                                                cls_name: [
	                                                { min: 2, max: 10, message: '班级名称长度为2 - 10', trigger: 'blur' },
	                                                { required: true, message: '班级名称不能为空', trigger: 'blur' }
                                                ],
			                        cls_dic_id_major: [
                                                        {
                                                                validator: (rules, value, next) => {
                                                                        if(value === 0)
                                                                                next(new Error('班级专业必选'));
                                                                        else
                                                                                next();
				                                },
								trigger: 'change'
                                                        }
			                        ],
                                                cls_stf_id_teacher: [
                                                        {
                                                                validator: (rules, value, next) => {
                                                                        if(value === 0)
                                                                                next(new Error('教学老师必选'));
                                                                        else
                                                                                next();
                                                                },
                                                                trigger: 'change'
                                                        }
                                                ],
                                                cls_stf_id_admin: [
                                                        {
                                                                validator: (rules, value, next) => {
                                                                        if(value === 0)
                                                                                next(new Error('教务老师必选'));
                                                                        else
                                                                                next();
                                                                },
                                                                trigger: 'change'
                                                        }
                                                ],
                                                cls_stf_id_job: [
                                                        {
                                                                validator: (rules, value, next) => {
                                                                        if(value === 0)
                                                                                next(new Error('就业老师必选'));
                                                                        else
                                                                                next();
                                                                },
                                                                trigger: 'change'
                                                        }
                                                ],
		                        },
	                        },
	                        edit2: {
                                        isEdit: false,
		                        model: {
                                                cls_id: 0,
                                                cls_clsr_id: 0,
			                        cls_begin: '',
			                        cls_end: ''
		                        },
		                        validForm: {
			                        cls_clsr_id: [
                                                        {
                                                                validator: (rules, value, next) => {
                                                                        if(value === 0)
                                                                                next(new Error('教室必选'));
                                                                        else
                                                                                next();
                                                                },
                                                                trigger: 'change'
                                                        }
			                        ]
		                        }
	                        },
                        };
	        },
	        computed: {
		        ...mapState('dictionary', { dicList: 'list' }),
		        ...mapState('classroom', { classRoomList: 'list' }),
		        ...mapState('staff', ['staffList']),
		        majorTypes() {
				return this.dicList.filter(item => item.dic_group_key === 'class_major');
		        },
		        endList() {
		                let endClass = [];
			        this.classList.forEach((item) => {
			                let temp = {};
			                temp = JSON.parse(JSON.stringify(item));
					temp.cls_dic_id_major_name = this.dicList.find(dic => dic.dic_id === item.cls_dic_id_major).dic_name;
					if(item.cls_clsr_id)
                                                temp.cls_clsr_name = this.classRoomList.find(clsr => clsr.clsr_id === item.cls_clsr_id).clsr_name;
					else
                                                temp.cls_clsr_name = '';

                                        let it1 = this.staffList.find(stf => stf.stf_category === 4 && stf.stf_id === item.cls_stf_id_teacher);
                                        let it2 = this.staffList.find(stf => stf.stf_category === 5 && stf.stf_id === item.cls_stf_id_admin);
                                        let it3 = this.staffList.find(stf => stf.stf_category === 6 && stf.stf_id === item.cls_stf_id_job);
                                        if(it1)
                                                temp.cls_stf_id_teacher_name = it1.stf_name;
                                        else {
                                                temp.cls_stf_id_teacher_name = '';
                                                temp.cls_stf_id_teacher = 0;
                                        }
                                        if(it2)
                                                temp.cls_stf_id_admin_name = it2.stf_name;
                                        else {
                                                temp.cls_stf_id_admin_name = '';
                                                temp.cls_stf_id_admin = 0;
                                        }
                                        if(it3)
                                                temp.cls_stf_id_job_name = it3.stf_name;
                                        else {
                                                temp.cls_stf_id_job_name = '';
                                                temp.cls_stf_id_job = 0;
                                        }

                                        if(item.cls_begin && item.cls_end)
                                                temp.cls_status = '结课';
                                        else if(item.cls_begin && !item.cls_end)
                                                temp.cls_status = '开课中';
                                        else
                                                temp.cls_status = '未开课';
					endClass.push(temp);
			        });
			        return endClass;
		        }
	        },
	        methods: {
		        ...mapActions('dictionary', ['getStaffInfo']),
                        ...mapActions('classroom', { classRoomInit: 'init' }),
		        ...mapActions('staff', ['listbycategory']),
		        async getList(isStartOverAgain = true) {
		                if(isStartOverAgain) this.pagination.currentPage = 1;
                                let { list, total } = await ClassApi.list({
                                        ...this.search,
                                        pageSize: this.pagination.pageSize,
                                        begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                });
                                this.classList = list;
                                this.pagination.total = total;
		        },
                        beginAdd() {
				if(this.$refs.form) this.$refs.form.resetFields();
                                this.edit.model.cls_id = 0;
		                this.edit.model.cls_name = '';
		                this.edit.model.cls_dic_id_major = 0;
		                this.edit.model.cls_clsr_id = null;
		                this.edit.model.cls_stf_id_teacher = 0;
		                this.edit.model.cls_stf_id_admin = 0;
				this.edit.model.cls_stf_id_job = 0;
				this.edit.model.cls_remark = '';
				this.edit.model.cls_begin = null;
                                this.edit.model.cls_end = null;
		                this.edit.mode = true;
		                this.edit.isEdit = true;
                        },
                        beginUpdate(row) {
                                if(this.$refs.form) this.$refs.form.resetFields();
                                this.edit.model.cls_id = row.cls_id;
                                this.edit.model.cls_name = row.cls_name;
                                this.edit.model.cls_dic_id_major = row.cls_dic_id_major;
                                this.edit.model.cls_clsr_id = row.cls_clsr_id;
                                this.edit.model.cls_stf_id_teacher = row.cls_stf_id_teacher;
                                this.edit.model.cls_stf_id_admin = row.cls_stf_id_admin;
                                this.edit.model.cls_stf_id_job = row.cls_stf_id_job;
                                this.edit.model.cls_begin = row.cls_begin;
                                this.edit.model.cls_end = row.cls_end;
                                this.edit.model.cls_remark = row.cls_remark;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
		        save() {
		                this.$refs.form.validate()
			                .then(async () => {
						await ClassApi.validname(this.edit.model);
						if(this.edit.mode) {
							let id = await ClassApi.add(this.edit.model);
							this.edit.model.cls_id = id;
							this.classList.push(JSON.parse(JSON.stringify(this.edit.model)));
							this.$message({ type: 'success', message: '新增成功' });
						} else {
						        await ClassApi.update(this.edit.model);
						        let i = this.classList.findIndex(item => item.cls_id === this.edit.model.cls_id);
						        this.classList.splice(i, 1, JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: '修改成功' });
						}
						this.edit.isEdit = false;
			                })
			                .catch(() => {});
		        },
		        async beginClass(row) {
				await this.$confirmEx(`确定要对班级：${ row.cls_name }进行开课操作吗？`, '提示', { type: 'warning'});
				if(this.$refs.secondForm) this.$refs.secondForm.resetFields();
                                this.edit2.model.cls_id = row.cls_id;
				this.edit2.model.cls_clsr_id = null;
				this.edit2.model.cls_begin = '';
                                this.edit2.model.cls_end = '';
				this.edit2.isEdit = true;
		        },
                        async endClass(row) {
                                await this.$confirmEx(`确定要对班级：${ row.cls_name }进行结课操作吗？`, '提示', { type: 'warning'});
                                this.edit2.model.cls_id = row.cls_id;
                                let time = await ClassApi.end(this.edit2.model);
                                let it = this.classList.find(item => item.cls_id === this.edit2.model.cls_id);
                                it.cls_end = time;
                                this.$message({ type: 'success', message: `班级：${ row.cls_name }结课成功！` });
		        },
		        save2() {
                                this.$refs.secondForm.validate()
	                                .then(async () => {
						let time = await ClassApi.begin(this.edit2.model);
						let it = this.classList.find(item => item.cls_id === this.edit2.model.cls_id);
						it.cls_clsr_id = this.edit2.model.cls_clsr_id;
						it.cls_begin = time;
						this.$message({ type: 'success', message: '开课成功！' });
						this.edit2.isEdit = false;
	                                })
	                                .catch(() => {});
		        }
	        },
	        async created() {
                        this.getStaffInfo();
                        this.classRoomInit();
			this.listbycategory(4);
			this.listbycategory(5);
                        this.listbycategory(6);
		        this.getList(true);
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
			.el-form
				width 100%
		.el-main
			padding 0
			border 1px solid #ddd
		.el-footer
			flex-shrink 0
			height 40px !important
			display flex
			align-items center
			.el-pagination
				width 100%
</style>
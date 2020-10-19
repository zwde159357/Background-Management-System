<template>
	<el-container>
		<el-header>
			<el-form inline>
				<el-form-item label="学生名字：" label-width="100px">
					<el-input v-model="search.stu_name" placeholder="请输入" @blur="getList(true)"></el-input>
				</el-form-item>
				<el-form-item label="所在班级：" label-width="100px">
					<el-select v-model="search.stu_cls_id" @change="getList(true)">
						<el-option label="- 无班级 -" :value="0"></el-option>
						<el-option v-for="item in classList" :key="item.cls_id" :value="item.cls_id" :label="item.cls_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学生学历：" label-width="100px">
					<el-select v-model="search.stu_qualification" @change="getList(true)">
						<el-option label="- 全部 -" :value="0"></el-option>
						<el-option v-for="item in dicList.filter(dic => dic.dic_group_key === 'qualification')" :key="item.dic_id"
						:value="item.dic_id" :label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button icon="el-icon-plus" type="primary" @click="beginAdd">新增</el-button>
					<el-button icon="el-icon-share" type="success" @click="assignClassAll">批量分班</el-button>
					<el-button icon="el-icon-download" type="danger" @click="excelExport">导出学生信息</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="list" border stripe height="100%" style="width: 100%" @selection-change="handleSelectionChange" ref="table" id='TableRoute'>
				<el-table-column label="序号" type="index" width="50px" align="center" fixed></el-table-column>
				<el-table-column type="selection" width="50px" align="center" fixed></el-table-column>
				<el-table-column label="学生名字" width="100px" align="center" prop="stu_name" fixed></el-table-column>
				<el-table-column label="班级" width="100px" align="center">
					<template slot-scope="{ row }">
						<span v-text="classList.find(item => item.cls_id === row.stu_cls_id ).cls_name" v-if="!!row.stu_cls_id"></span>
						<span v-else style="color: #aaa;">无班级</span>
					</template>
				</el-table-column>
				<el-table-column label="存档照片" width="80px" align="center">
					<template slot-scope="{ row }">
						<el-popover :title="row.stu_name" trigger="click" placement="right">
							<el-image :src="row.stu_avatar || ''">
								<div slot="error" style="font-size: 40px; width: 205px; height: 205px; text-align: center; line-height: 205px;">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
							<el-button type="text" slot="reference">预览</el-button>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="性别" width="50px" align="center">
					<template slot-scope="{ row }">
						<span v-text="`${ row.stu_sex ? '男' : '女' }`"></span>
					</template>
				</el-table-column>
				<el-table-column label="联系电话" width="140px" align="center" prop="stu_phone"></el-table-column>
				<el-table-column label="联系电话(备用)" width="140px" align="center" prop="stu_phone2"></el-table-column>
				<el-table-column label="出生日期" width="100px" align="center" prop="stu_born"></el-table-column>
				<el-table-column label="学历" width="100px" align="center">
					<template slot-scope="{ row }">
						<span v-text="dicList.find(item => item.dic_id === row.stu_qualification).dic_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="毕业院校" width="140px" prop="stu_school" show-overflow-tooltip></el-table-column>
				<el-table-column label="院校专业" width="140px" prop="stu_major" show-overflow-tooltip></el-table-column>
				<el-table-column label="家庭住址" width="200px" prop="stu_address" show-overflow-tooltip></el-table-column>
				<el-table-column label="备注" width="200px" prop="stu_remark" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="400px" align="center" fixed="right">
					<template slot-scope="{ row }">
						<el-button type="warning" icon="el-icon-share" size="medium" @click="assignClassSingle(row)">分班</el-button>
						<el-button type="danger" icon="el-icon-picture-outline" size="medium" @click="beginStore(row)">照片存档</el-button>
						<el-button type="primary" icon="el-icon-edit-outline" size="medium" @click="beginUpdate(row)">编辑</el-button>
						<!--<el-button type="success" icon="el-icon-delete" size="medium" @click="remove(row)">删除</el-button>-->
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination layout="total, prev, pager, next, jumper, ->, sizes"
			               :total="pagination.total" :pageSize.sync="pagination.pageSize" :currentPage.sync="pagination.currentPage"
			               :page-sizes="[5, 8, 10, 12, 15]" @current-change="getList(false)" @size-change="getList(false)"></el-pagination>
		</el-footer>
		<el-dialog :modal="false" :show-close="false" :visible="edit.isEdit" :title="`学生编辑 - ${ this.edit.mode ? '新增' : '修改' }`" width="560px">
			<el-form ref="form" :model="edit.model" :rules="edit.validForm" :status-icon="true">
				<el-form-item label="学生姓名：" label-width="120px" prop="stu_name">
					<el-input v-model="edit.model.stu_name" placeholder="请输入学生的姓名"></el-input>
				</el-form-item>
				<el-form-item label="性别：" label-width="120px">
					<el-radio v-model="edit.model.stu_sex" :label="1">男</el-radio>
					<el-radio v-model="edit.model.stu_sex" :label="0" >女</el-radio>
				</el-form-item>
				<el-form-item label="联系电话：" label-width="120px" prop="stu_phone">
					<el-input v-model="edit.model.stu_phone" placeholder="请输入手机号" maxlength="11" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="备用电话：" label-width="120px" prop="stu_phone2">
					<el-input v-model="edit.model.stu_phone2" placeholder="请输入备用联系电话(手机号/座机号)">
						<template slot="append">例如：028-88888888</template>
					</el-input>
				</el-form-item>
				<el-form-item label="出生日期：" label-width="120px" prop="stu_born">
					<el-date-picker placeholder="- 请选择出生日期 -" v-model="edit.model.stu_born" :picker-options="pickerOptions"
					                value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="学历：" label-width="120px" prop="stu_qualification">
					<el-select v-model="edit.model.stu_qualification" placeholder="- 请选择学生的学历 -">
						<el-option label="- 请选择 -" :value="0" style="color: #aaa;"></el-option>
						<el-option v-for="item in dicList.filter(it => it.dic_group_key === 'qualification')"
						:key="item.dic_id" :value="item.dic_id" :label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="在读/毕业院校：" label-width="120px">
					<el-input placeholder="请输入在读/毕业院校(选填)" v-model="edit.model.stu_school"></el-input>
				</el-form-item>
				<el-form-item label="在校学习专业：" label-width="120px">
					<el-input placeholder="请输入在校学习专业(选填)" v-model="edit.model.stu_major"></el-input>
				</el-form-item>
				<el-form-item label="家庭住址：" label-width="120px" prop="stu_address">
					<el-input  v-model="edit.model.stu_address" placeholder="请输入家庭住址..."></el-input>
				</el-form-item>
				<el-form-item label="学生备注：" label-width="120px">
					<el-input type="textarea" v-model="edit.model.stu_remark" placeholder="请输入学生备注..."></el-input>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</template>
		</el-dialog>
		<el-dialog :modal="false" :visible="assign.isAssign" :show-close="false" :title="`${ assign.mode ? '批量分班' : '单个分班' }`"  width="560px">
			<el-form>
				<el-form-item label="班级：" label-width="100px">
					<el-select v-model="assign.model.stu_cls_id">
						<el-option label="- 无班级 -" :value="null"></el-option>
						<el-option v-for='item in classList' :key="item.cls_id" :value="item.cls_id" :label="item.cls_name"
						:disabled="!!item.cls_end"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="primary" @click="save2">确定</el-button>
				<el-button @click="assign.isAssign = false">取消</el-button>
			</template>
		</el-dialog>
		<el-dialog :modal="false" :visible="picture.isStore" :show-close="false" title="图片存档" width="1200px">
			<el-form inline>
				<el-form-item label="个人照片：" label-width="100px">
					<div style="height: 205px; width: 205px; display: flex; justify-content: center; align-items: center;">
						<el-image :src="picture.model.stu_avatar_old || ''" ></el-image>
					</div>
					<p style="text-align: center; margin-top: 30px">学生当前存档照片</p>
				</el-form-item>
				<el-form-item>
					<div class="middle" style="height: 300px; border: 1px solid #aaa; margin: 0 40px;"></div>
				</el-form-item>
				<el-form-item>
					<el-upload class="avatar-uploader" list-type="picture-card" ref="upload"
					action="/student/avatarupload" name="avatar" :headers="picture.uploadHeaders"
					:before-upload="beforeUploadHandler" :on-success="uploadSuccessHandler">
						<i  class="el-icon-plus avatar-uploader-icon"></i>
						<p class="tip" slot="tip">提示：只能上传jpg/png文件，且不超过2M, 一寸照片宽高比最好5:7</p>
					</el-upload>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="primary" @click="save3">存档</el-button>
				<el-button @click="picture.isStore = false">取消</el-button>
			</template>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import { ClassApi, StudentApi } from '../../util/api.js';
	import { mapState, mapActions } from 'vuex';
	import XLSX from 'xlsx';

        export default {
                name: 'Student',
	        data() {
                        return {
                                pagination: {
                                        total: 0,
                                        pageSize: 5,
                                        currentPage: 1
                                },
	                        search: {
                                        stu_name: '',
		                        stu_cls_id: 0,
		                        stu_qualification: 0
	                        },
	                        classList: [],
	                        list: [],
	                        edit: {
                                        isEdit: false,
		                        mode: true,
		                        model: {
                                                stu_id: 0,
                                                stu_name: '',
			                        stu_avatar: null,
                                                stu_cls_id: null,
			                        stu_sex: 1,
                                                stu_phone: '',
                                                stu_phone2: '',
                                                stu_born: '',
                                                stu_qualification: 0,
                                                stu_school: '',
                                                stu_major: '',
                                                stu_address: '',
                                                stu_remark: '',
		                        },
		                        validForm: {
                                                stu_name: [
	                                                { required: true, message: '学生姓名不能为空', trigger: 'blur' },
	                                                { min: 2, max: 10, message: '学生姓名长度为2 - 10', trigger: 'blur' }
                                                ],
                                                stu_phone: [
	                                                {
	                                                        validator: (rules, value, next) => {
	                                                                if(value.length !== 11)
	                                                                        next(new Error('无效手机号'));
	                                                                else
	                                                                        next();
	                                                        },
		                                                trigger: 'blur'
	                                                }
                                                ],
			                        stu_phone2: [
                                                        {
                                                                validator: (rules, value, next) => {
                                                                        if(value.length !== 11)
                                                                                next(new Error('无效手机号'));
                                                                        else
                                                                                next();
                                                                },
                                                                trigger: 'blur'
                                                        }
			                        ],
			                        stu_born: [
                                                        {
                                                                validator: (rules, value, next) => {
                                                                        if(value === 0)
                                                                                next(new Error('出生日期必选'));
                                                                        else
                                                                                next();
                                                                },
                                                                trigger: 'change'
                                                        }
			                        ],
                                                stu_qualification: [
                                                        {
                                                                validator: (rules, value, next) => {
                                                                        if(value === 0)
                                                                                next(new Error('学生的学历必选'));
                                                                        else
                                                                                next();
                                                                },
                                                                trigger: 'change'
                                                        }
                                                ],
                                                stu_address: [
                                                        { required: true, message: '家庭住址不能为空', trigger: 'blur' },
                                                        { min: 10, max: 100, message: '家庭住址长度为10 - 100', trigger: 'blur' }
                                                ],
		                        }
	                        },
                                pickerOptions: {
                                        disabledDate(time) {
                                                return time.getTime() > new Date('2000').getTime();
                                        }
                                },
	                        assign: {
                                        isAssign: false,
		                        mode: true,
		                        model: {
                                                stu_cls_id: null,
			                        stu_ids: [],
			                        stu_id: 0
		                        },
	                        },
	                        picture: {
                                        isStore: false,
		                        model: {
                                                stu_id: 0,
			                        stu_avatar_old: '',
                                                stu_avatar_new: '',
		                        },
                                        uploadHeaders: { Authorization: sessionStorage.getItem('token') },
	                        },
	                        multipleSelection: [],
                        };
	        },
	        computed: {
		        ...mapState('dictionary', { dicList: 'list' }),
	        },
	        methods: {
		        ...mapActions('dictionary', ['getStaffInfo']),
		        async getList(isStartOverAgain = true) {
		                if(isStartOverAgain) this.pagination.currentPage = 1;
                                let { list, total } = await StudentApi.list({
                                        ...this.search,
                                        begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                        pageSize: this.pagination.pageSize
                                });
                                this.list = list;
                                this.pagination.total = total;
		        },
		        beginAdd() {
		                if(this.$refs.form) this.$refs.form.resetFields();
                                this.edit.model.stu_id = 0;
                                this.edit.model.stu_name = '';
                                this.edit.model.stu_avatar = null;
                                this.edit.model.stu_cls_id = null;
                                this.edit.model.stu_sex = 1;
                                this.edit.model.stu_phone = '';
                                this.edit.model.stu_phone2 = '';
                                this.edit.model.stu_born = '';
                                this.edit.model.stu_qualification = 0;
                                this.edit.model.stu_school = '';
                                this.edit.model.stu_major = '';
                                this.edit.model.stu_address = '';
                                this.edit.model.stu_remark = '';
		                this.edit.mode = true;
		                this.edit.isEdit = true;
		        },
		        beginUpdate(row) {
                                if(this.$refs.form) this.$refs.form.resetFields();
                                this.edit.model.stu_id = row.stu_id;
                                this.edit.model.stu_name = row.stu_name;
                                this.edit.model.stu_avatar = row.stu_avatar;
                                this.edit.model.stu_cls_id = row.stu_cls_id;
                                this.edit.model.stu_sex = row.stu_sex;
                                this.edit.model.stu_phone = row.stu_phone;
                                this.edit.model.stu_phone2 = row.stu_phone2;
                                this.edit.model.stu_born = row.stu_born;
                                this.edit.model.stu_qualification = row.stu_qualification;
                                this.edit.model.stu_school = row.stu_school;
                                this.edit.model.stu_major = row.stu_major;
                                this.edit.model.stu_address = row.stu_address;
                                this.edit.model.stu_remark = row.stu_remark;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
		        },
		        save() {
		                this.$refs.form.validate()
			                .then(async () => {
						StudentApi.validphone(this.edit.model);
						if(this.edit.mode) {
							let id = await StudentApi.add(this.edit.model);
							this.edit.model.stu_id = id;
                                                        this.list.push(JSON.parse(JSON.stringify(this.edit.model)));
							this.$message({ type: 'success', message: `新增学生：${ this.edit.model.stu_name }成功！` });
						} else {
							await StudentApi.update(this.edit.model);
							let i = this.list.findIndex(item => item.stu_id === this.edit.model.stu_id);
							this.list.splice(i, 1, JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: `修改学生：${ this.edit.model.stu_name }成功！` });
						}
						this.edit.isEdit = false;
			                })
			                .catch(() => {});
		        },
		        assignClassAll() {
		                if(this.multipleSelection.length === 0) {
		                        this.$alert('请先勾选需要分班的学生', '提示', { type: 'warning' });
                                } else {
		                        this.multipleSelection.forEach(item => this.assign.model.stu_ids.push(item.stu_id));
		                        this.assign.model.stu_id = null;
		                        this.assign.model.stu_cls_id = null;
		                        this.assign.mode = true;
		                        this.assign.isAssign = true;
		                }
		        },
                        assignClassSingle(row) {
                                this.assign.model.stu_id = row.stu_id;
                                this.assign.model.stu_ids = [];
                                this.assign.model.stu_cls_id = row.stu_cls_id;
                                this.assign.mode = false;
                                this.assign.isAssign = true;
                        },
		        async save2() {
				if(this.assign.mode) {
					await StudentApi.assignclass(this.assign.model);
                                        this.multipleSelection.forEach(item => {
                                                this.list.find(it => it.stu_id === item.stu_id).stu_cls_id = this.assign.model.stu_cls_id;
                                        });
					this.$message({ type: 'success', message: '所勾选的学生分班成功！' });
				} else {
                                        await StudentApi.assignclass(this.assign.model);
                                        this.list.find(it => it.stu_id === this.assign.model.stu_id).stu_cls_id = this.assign.model.stu_cls_id;
                                        this.$message({ type: 'success', message: '单个学生分班成功！' });
				}
                                this.$refs.table.clearSelection();
				this.assign.isAssign = false;
		        },
                        handleSelectionChange(val) {
				this.multipleSelection = val;
                        },
                        beginStore(row) {
		                if(this.$refs.upload) this.$refs.upload.clearFiles();
		                this.picture.model.stu_id = row.stu_id;
		                this.picture.model.stu_avatar_old = row.stu_avatar;
		                this.picture.model.stu_avatar_new = '';
		                this.picture.isStore = true;
                        },
                        beforeUploadHandler(file) {
                                // 在此函数中对上传的资源进行类型，大小等等验证
                                const isJPG = file.type === 'image/jpeg';
                                const isPNG = file.type === 'image/png';
                                const isLt2M = file.size / 1024 / 1024 < 10;

                                if ((!isJPG) && (!isPNG)) {
                                        this.$message.error('上传头像图片只能是 JPG 格式或 PNG 格式!');
                                }
                                if (!isLt2M) {
                                        this.$message.error('上传头像图片大小不能超过 10MB!');
                                }
                                return (isJPG || isPNG) && isLt2M;
                        },
                        uploadSuccessHandler(response, file, fileList) {
                                if(response.status === 200) {
                                        if(fileList.length > 1) fileList.shift();
	                                this.picture.model.stu_avatar_new = response.data;
                                } else {
                                        this.$message.error(response.message);
                                }
                        },
		        async save3() {
		                await StudentApi.avatarupdate(this.picture.model);
		                let it = this.list.find(item => item.stu_id === this.picture.model.stu_id);
		                it.stu_avatar = '/images/student/' + this.picture.model.stu_avatar_new;
		                this.$message({ type: 'success', message: '图片上传成功！' });
		                this.picture.isStore = false;
		                this.$refs.upload.clearFiles();
		        },
                        excelExport() {
                                let fix = document.querySelector('.el-table__fixed');
                                let table1;
                                if ( fix ) {
                                        table1 = document.querySelector("#TableRoute").removeChild(fix);  // element框架自带两组 table 导出Excel表格会重复,所以需要去除 el-table中的子节点el-table__fixed
                                        document.querySelector("#TableRoute").appendChild(fix) // 在移除完成后把子节点再追加到table中,不然会影响到 el-table的布局
                                } else {
                                        table1 = document.querySelector("#TableRoute")
                                }
                                let sheet = XLSX.utils.table_to_sheet(table1);	//将一个table对象转换成一个sheet对象
                                openDownloadDialog(sheet2blob(sheet),'学生表.xlsx');  // '下载.xlsx 为下载Excel表格的文件名称,可自行设置'
                                function sheet2blob(sheet, sheetName) {
                                        sheetName = sheetName || 'sheet1';
                                        let workbook = {
                                                SheetNames: [sheetName],
                                                Sheets: {}
                                        };
                                        workbook.Sheets[sheetName] = sheet; // 生成excel的配置项
                                        let wopts = {
                                                bookType: 'xlsx', // 要生成的文件类型
                                                bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
                                                type: 'binary'
                                        };
                                        let wbout = XLSX.write(workbook, wopts);
                                        let blob = new Blob([s2ab(wbout)], {
                                                type: "application/octet-stream"
                                        }); // 字符串转ArrayBuffer
                                        function s2ab(s) {
                                                let buf = new ArrayBuffer(s.length);
                                                let view = new Uint8Array(buf);
                                                for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                                                return buf;
                                        }
                                        return blob;
                                }
                                function openDownloadDialog(url, saveName) {
                                        if (typeof url == 'object' && url instanceof Blob) {
                                                url = URL.createObjectURL(url); // 创建blob地址
                                        }
                                        let aLink = document.createElement('a');
                                        aLink.href = url;
                                        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                                        let event;
                                        if (window.MouseEvent) event = new MouseEvent('click');
                                        else {
                                                event = document.createEvent('MouseEvents');
                                                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                                        }
                                        aLink.dispatchEvent(event);
                                }
                        },
	        },
	        async created() {
                        this.getStaffInfo();
			this.classList = await ClassApi.all();
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
	.avatar-uploader .el-upload
		width 205px
		height 205px
		border 1px dashed #d9d9d9!important
		border-radius 6px
		cursor pointer
		position relative
		overflow hidden
	.avatar-uploader .el-upload:hover
		border-color #409EFF

	.avatar-uploader >>> li
		width 205px
		height 205px
	.avatar-uploader >>> .el-upload--picture-card.el-upload
		width 205px
		height 205px

	.avatar-uploader-icon
		font-size 28px
		color #8c939d
		width 205px
		height 205px
		line-height 205px
		text-align center
	.avatar
		width 205px
		height 205px
		display block
	.tip
		color red
		font-size 16px
		margin-top 10px
</style>
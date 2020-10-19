<template>
	<el-container>
		<el-header height="40px">
			<div class="empty">
				<span class="square"></span>
				<span class="text">闲置中</span>
			</div>
			<div class="occupy">
				<span class="square"></span>
				<span class="text">使用中</span>
			</div>
		</el-header>
		<el-main>
			<el-row :gutter="20">
				<transition-group name="edit">
					<el-col :span="6" v-for="item in clsrList" :key="item.clsr_id"
					        @mouseover.native="hoverId = item.clsr_id"  @mouseout.native="hoverId = 0">
						<el-card :body-style='cardCSS' :class="{ active: item.clsr_occupy }">
							<p v-text="item.clsr_name" style="color: black;"></p>
							<div class="mask" v-show="item.clsr_id === hoverId">
								<el-button type="text" icon="el-icon-edit-outline" @click="beginUpdate(item)">编辑</el-button>
								<el-button type="text" icon="el-icon-delete" @click="removeCard(item)" v-show="!item.clsr_occupy">删除</el-button>
							</div>
						</el-card>
					</el-col>
				</transition-group>
				<el-col :span="6">
					<el-card :body-style="cardCSS" class="none" @click.native="beginAdd">
						<i class="el-icon-plus" style="font-size: 40px;"></i>
					</el-card>
				</el-col>
			</el-row>
		</el-main>
		<el-dialog :visible="edit.isEdit" width="40%" :modal="false" :show-close="false">
			<template slot="title">
				<span v-text="`教室编辑 - ${ edit.mode ? '新增' : '修改' }`"></span>
			</template>
			<el-form ref="form" :status-icon="true" :model="edit.model" :rules="edit.validForm">
				<el-form-item label="教室名称" label-width="80px" prop="clsr_name">
					<el-input v-model.trim="edit.model.clsr_name" placeholder="请输入教室名称"></el-input>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</template>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import { createNamespacedHelpers } from 'vuex';
	const { mapState, mapActions } = createNamespacedHelpers('classroom');

        export default {
                name: 'ClassRoom',
	        data() {
                        return {
                                cardCSS: {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '80px'
                                },
				list: [],
	                        hoverId: 0,
	                        edit: {
                                        isEdit: false,
		                        mode: true,
		                        model: { clsr_name: '', clsr_id: 0, clsr_occupy: 0 },
		                        validForm: {
                                                clsr_name: [
	                                                {
	                                                        validator: (rules, value, next) => {
									if(value === '')
									        next(new Error('教室名称不能为空！'));
									else if(value.length< 3 || value.length > 10)
									        next(new Error('教室名称长度为3 - 10！'));
									else if(this.clsrList.some(item => item.clsr_id !== this.edit.model.clsr_id && item.clsr_name === value))
									        next(new Error('教室名称不能相同！'));
		                                                        else
		                                                                next();
	                                                        },
		                                                trigger: 'blur'
	                                                }
                                                ],
		                        }
	                        }
                        };
	        },
                computed: {
                        ...mapState({ clsrList: 'list' })
                },
	        methods: {
		        ...mapActions(['init', 'add', 'update', 'remove']),
		        async removeCard(item) {
				await this.$confirmEx(`确定要删除${ item.clsr_name }吗？`, '提示', { type: 'warning' });
                                await this.remove(item.clsr_id);
				this.$message({ type: 'success', message: `删除${ item.clsr_name }成功！` });
		        },
                        beginUpdate(item) {
				if(this.$refs.form) this.$refs.form.resetFields();
				this.edit.model.clsr_id = item.clsr_id;
		                this.edit.model.clsr_name = item.clsr_name;
                                this.edit.model.clsr_occupy = item.clsr_occupy;
		                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
		        beginAdd() {
                                if(this.$refs.form) this.$refs.form.resetFields();
                                this.edit.model.clsr_id = 0;
                                this.edit.model.clsr_name = '';
                                this.edit.model.clsr_occupy = 0;
                                this.edit.mode = true;
		                this.edit.isEdit = true;
		        },
		        save() {
		                this.$refs.form.validate()
			                .then(async () => {
		                                if(this.edit.mode) {
							await this.add(JSON.parse(JSON.stringify(this.edit.model)));
							this.$message({ type: 'success', message: `新增${ this.edit.model.clsr_name }成功！` });
		                                } else {
		                                        console.log(this.edit.model);
                                                        await this.update(JSON.parse(JSON.stringify(this.edit.model)));
                                                        this.$message({ type: 'success', message: `修改${ this.edit.model.clsr_name }成功！` });
		                                }
		                                this.edit.isEdit = false;
			                })
			                .catch(() => {});
		        }
	        },
	        created() {
			this.init();
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-container
		.el-header
			width 100%
			display flex
			align-items center
			.empty
				flex-shrink 0
				width 100px
				margin 0 20px
				display flex
				align-items center
				span.square
					width 25px
					height 25px
					background-color #E6A23C
				span.text
					margin 0 5px
			.occupy
				flex-shrink 0
				width 100px
				margin 0 20px
				display flex
				align-items center
				span.square
					width 25px
					height 25px
					background-color #67C23A
				span.text
					margin 0 5px
	.el-card
		position relative
		margin-bottom 20px
		background-color:  #E6A23C !important
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
				font-size 24px
				color white
				&:hover
					color gold
					text-decoration underline
	.el-card.active >>> .el-card__body
		background-color #67C23A!important
	.el-card.none >>> .el-card__body
		background-color white !important
	.edit-enter,.edit-leave-to
		opacity 0
	.edit-enter-active,.edit-leave-active
		transition all 0.8s
</style>
<template>
	<el-container>
		<el-header height="80px">
			<h1>青岛大学教学管理系统 <span style="font-size: 14px;">v1.0</span></h1>
			<div class="wrapper">
				<span v-text="`${ user },欢迎登录后台管理系统`"></span>
				<el-button type="danger" @click="quit">退出登录</el-button>
			</div>
		</el-header>
		<el-container style="overflow: hidden;">
			<el-aside width="300px" class="content-left">
				<el-menu background-color="#626066"
				text-color="#fff" active-text-color="#ffd04b"
				@select="selectHandler" :default-active="activeName">
					<template v-for="item in UserFuncList.filter(func => func.func_fid === 0)">
						<el-menu-item v-if="item.func_key" :index="item.func_key">
							<i class="el-icon-menu"></i>
							<span slot="title" v-text="item.func_name"></span>
						</el-menu-item>
						<el-submenu v-else  :index="item.func_name">
							<template slot="title">
								<i class="el-icon-setting"></i>
								<span v-text="item.func_name"></span>
							</template>
							<el-menu-item v-for="item2 in UserFuncList.filter(func => func.func_fid === item.func_id)" :index="item2.func_key">
								<i class="el-icon-menu"></i>
								<span slot="title" v-text="item2.func_name"></span>
							</el-menu-item>
						</el-submenu>
					</template>
				</el-menu>
			</el-aside>
			<el-container>
				<el-main>
					<el-tabs type="card" closable @tab-remove="tabRemoveHandler" v-model="activeName">
						<el-tab-pane v-for="name in tabNames" :key="name"
						             :label="UserFuncList.find(item => item.func_key === name).func_name"
						             :name="name">
							<component :is="views[name].component"></component>
						</el-tab-pane>
						<!--<video  autoplay="autoplay" muted="muted" loop="loop" width="100%" height="90%">-->
							<!--<source src="./video.mp4" type="video/mp4">-->
						<!--</video>-->
					</el-tabs>
				</el-main>
				<el-footer height="40px">
					&copy;2020青岛大学 版权 All Student
				</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import ElTabPane from "../../../node_modules/element-ui/packages/tabs/src/tab-pane.vue";
	import views from '../../views/index.js';

        export default {
                components: { ElTabPane },
                name: 'Home',
	        data() {
			return {
			        UserFuncList: [],
			        tabNames: [],
				activeName: '',
				views,
				user: ''
			};
	        },
	        methods: {
                        selectHandler(index) {
                                if(this.tabNames.indexOf(index) === -1) this.tabNames.push(index);
                                this.activeName = index;
                        },
		        tabRemoveHandler(tabName) {
				let i = this.tabNames.indexOf(tabName);
                                this.tabNames.splice(i,1);
                                if(this.activeName === tabName)
	                                this.activeName = this.tabNames[0] || "";
		        },
		        quit() {
                                this.$confirm('确定要退出吗？', '提示', { type: 'warning' })
	                                .then(() => {
                                                sessionStorage.clear();
		                                this.$router.replace('/login');
	                                })
	                                .catch(() => {});
		        },
                        async init() {
                                this.user = sessionStorage.getItem('user');
                                this.UserFuncList = await this.$http({
                                        method: 'post',
                                        url: '/user/getmenu'
                                });
		        }
	        },
	        created() {
                        if(this.user !== sessionStorage.getItem('user')) {
                                this.init();
                                this.tabNames = [];
                                this.activeName = '';
                        }

	        },
	        activated() {
                        if(this.user !== sessionStorage.getItem('user')){
                                this.init();
                                this.tabNames = [];
                                this.activeName = '';
                        }
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-container
		height 100%
		overflow hidden
	.el-header
		display flex
		background-color #303133
		align-items center
		justify-content space-between
		position relative
		&::after
			content ''
			display block
			width 100%
			height 80px
			position absolute
			left 0
			top 0
			background linear-gradient(-15deg, rgba(0,0,0,0), rgba(255,255,255, .2), rgba(0,0,0,0))
			transform rotate(0deg) translate(-100%, 0)
		&:hover::after
			background-color linear-gradient(0deg, rgba(0,0,0,0), rgba(255,255,255, .2), rgba(0,0,0,0))
			transition all 1s ease-out
			transform rotate(0deg) translate(100%, 0)
		h1
			color white
		.wrapper
			position absolute
			top calc( 50% - 20px)
			right 2vw
			z-index 99
			span
				font-size 20px
				color white
				margin-right 20px
	.el-aside
		background-color #606266
		.el-menu
			border-right none
	.el-footer
		flex-shrink 0
		display flex
		background-color #909399
		align-items center
		justify-content center
		color wheat
</style>
<template>
	<div>
		<el-upload action="/student/avatarupload" name="avatar" :headers="uploadHeaders"
		accept=".png,.jpg" :before-upload="beforeUploadHandler" list-type="picture-card"
		:on-success="uploadSuccessHandler">
			点我上传
			<div class="tip" slot="tip">1111111111111</div>
		</el-upload>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: 'New',
	        data() {
                        return {
                                uploadHeaders: {
                                        Authorization: sessionStorage.getItem('token'),
	                                /* 'Content-Type': 'multipart/form-data'; */
                                },
	                        edit: {
                                        model: {
                                                stu_id: 0,
                                                stu_avatar_old: '',
	                                        stu_avatar_new: ''
                                        }
	                        }
                        };
	        },
	        methods: {
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
				        // 把返回response.data放到edit.model.
				} else {
				        this.$message.error(response.message);
				}
		        },
	        },

        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.tip
		color red
		font-size 16px
		margin-top 10px
</style>
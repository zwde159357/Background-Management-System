<template>
	<div class="root">
		<keep-alive include="Home">
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: 'App',
        };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.root
		width 100%
		height 100%
</style>
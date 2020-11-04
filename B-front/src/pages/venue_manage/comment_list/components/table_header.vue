<template>
	<div class="table-header">
		<div class="venue-name">{{venueName}}</div>
		<div class="left-part">
			<search-group ref="searchGroup" placeholder="请输入手机号码"></search-group>
		</div>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
import searchGroup from '@/components/common/search_group.vue'
export default {
	components: {
		tButton,
		searchGroup
	},
	computed: {
		venueName () {
			return this.$route.query.name
		}
	}
}
</script>

<style lang="less" scoped>
.table-header {
	padding: 20px;
	font-size: 0;
	.venue-name {
		font-size: 18px;
		font-weight: 700;
		margin-bottom: 20px;
	}
	.t-button + .t-button{
		margin-left: 10px;
	}
	.left-part {
		display: flex;
		float: right;
		.search-group {
			margin-left: 10px;
		}
		& /deep/ .el-select .el-input__inner{
			height: 36px;
		}
		.el-select + .el-select {
			margin-left: 10px;
		}
	}
}
.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		.label {
			width: 100px;
		}
		.el-table {
			display: inline-block;
		}
		.right-select {
			margin-top: 15px;
			align-self: flex-start;
        }
        .describ-area {
            width: 360px;
            height: 180px;
            padding: 10px;
            resize:none;
            box-sizing: border-box;
		}
		textarea {
			width: 300px;
			height: 200px;
			padding-top: 10px;
			resize: none;
		}
		.align-top {
			align-self: flex-start;
		}
	}
</style>

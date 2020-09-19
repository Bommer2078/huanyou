<template>
	<div class="table-header">
		<t-button @clickBtn="createGoods">创建商品</t-button>
		<div class="left-part">
			<el-select v-model="typeSelect" placeholder="选择商品类型" @change="changeType">
				<el-option :value="-1" label="全部商品"></el-option>
				<template v-for="item in typeArr" >
					<el-option
						:key="item.id"
						:label="item.name"
						:value="item.id"></el-option>
				</template>
			</el-select>
			<el-select v-model="statusSelected" placeholder="选择状态" @change="changeStatus">
				<template v-for="item in statusSelectArr" >
					<el-option
						:key="item.id"
						:label="item.status"
						:value="item.id"></el-option>
				</template>
			</el-select>
			<search-group ref="searchGroup" placeholder="请输入商品名称"></search-group>
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
	data () {
		return {
			typeArr: [
				{
					id  : 0,
					name: '实物商品'
				},
				{
					id  : 1,
					name: '特惠票'
				}
			],
			statusSelectArr: [
				{
					id    : '',
					status: '全部状态'
				},
				{
					id    : 1,
					status: '上架'
				},
				{
					id    : 2,
					status: '下架'
				}
			],
			typeSelect    : -1,
			statusSelected: ''
		}
	},
	created () {
		this.$EventBus.$on('editGoods', this.createGoods)
	},
	destroyed () {
		this.$EventBus.$off('editGoods')
	},
	methods: {
		createGoods (obj) {
			let url = obj ? `/goodsManage/editGoods?editId=${obj.row.id}` : '/goodsManage/editGoods'

			this.$router.push(url)
		},
		changeType () {
			this.$refs.searchGroup.searchContent = ''
			this.statusSelected = ''
			this.$EventBus.$emit('changeGoodsType', this.typeSelect)
		},
		changeStatus () {
			this.$refs.searchGroup.searchContent = ''
			this.$EventBus.$emit('changeStatus', this.statusSelected)
		}
	}
}
</script>

<style lang="less" scoped>
.table-header {
	padding: 20px;
	font-size: 0;
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
</style>

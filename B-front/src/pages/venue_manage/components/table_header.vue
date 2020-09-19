<template>
	<div class="table-header">
		<t-button @clickBtn="createdVenue">创建场馆</t-button>
		<div class="left-part">
			<el-select v-model="locationSelected" placeholder="选择归属地" @change="changeLocation">
				<el-option :value="-1" label="全部归属地"></el-option>
				<template v-for="item in locationSelectArr" >
					<el-option
						:key="item.id"
						:label="item.name"
						:value="item.id"></el-option>
				</template>
			</el-select>
			<search-group ref="searchGroup" placeholder="请输入场馆名称"></search-group>
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
			locationSelectArr: [],
			locationSelected : -1
		}
	},
	created () {
		this.getLocationArr()
		this.$EventBus.$on('editVenue', this.createdVenue)
	},
	destroyed () {
		this.$EventBus.$off('editVenue')
	},
	methods: {
		getLocationArr  () {
			let params = {
				pageNum : 1,
				pageSize: 100
			}

			this.$http.get(this.$api.getLocationList, {params})
				.then(({data:{code, data, message}}) => {
					if (code === '0') {
						this.locationSelectArr = data
					}
				})
		},
		createdVenue (obj) {
			let url = obj ? `/venueManage/editVenue?editId=${obj.row.id}` : '/venueManage/editVenue'

			this.$router.push(url)
		},
		changeLocation () {
			this.$refs.searchGroup.searchContent = ''
			this.$EventBus.$emit('changeLocation', this.locationSelected === -1 ? '' : this.locationSelected)
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

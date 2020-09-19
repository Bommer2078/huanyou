<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="name"
				label="名称"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="banner"
				label="缩略图"
				min-width="25%">
				<template slot-scope="scope">
					<img class="img-compressed" :src="scope.row.photo">
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="price"
				label="优惠价格"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{scope.row.price / 100}}元</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="type"
				label="商品类型"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{scope.row.type | goodsTypeText }}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				label="状态"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{scope.row.status | statusText }}</span>
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="300">
				<template slot-scope="scope">
					<!-- <el-switch
						:disabled="forbidClick"
						v-model="scope.row.is_on_shelves"
						active-color="#13ce66"
						inactive-color="#ff4949"
						active-text="上架"
						inactive-text="下架"
						:active-value="1"
						:inactive-value="0"
						@change="handleChangeState(scope,scope.row.is_on_shelves)"
					>
					</el-switch>
					<span class="split">|</span> -->
					<span type="text" class="setting-btn" @click="handleEdit(scope)">编辑</span>
					<span class="split">|</span>
					<span type="text" class="setting-btn" @click="checkDel(scope)">删除</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			v-show="total > pageSize"
			align="center"
			style="margin-top:20px;"
			background
			@current-change="changePage"
			layout="prev, pager, next"
			:current-page="pageIndex"
			:page-size="pageSize"
			:total="total">
		</el-pagination>
	</div>
</template>

<script>
export default {
	data () {
		return {
			tableDateArr : [],
			total        : 0,
			pageIndex    : 1,
			pageSize     : 10,
			forbidClick  : false,
			searchContent: '',
			state        : '' // ''全部商品，1-上架，2-下架
		}
	},
	created () {
		this.getGoodsList()
		this.$EventBus.$on('changeGoodsType', this.handleTypeChange)
		this.$EventBus.$on('changeStatus', this.handleStatusChange)
		this.$EventBus.$on('search', this.handleSearch)
	},
	destroyed () {
		this.$EventBus.$off('changeGoodsType')
		this.$EventBus.$off('changeStatus')
		this.$EventBus.$off('search')
	},
	filters: {
		goodsTypeText (val) {
			return val ? '特惠票' : '实物商品'
		},
		statusText (val) {
			return val === 1 ? '上架' : '下架'
		}
	},
	methods: {
		handleEdit (obj) {
			this.$EventBus.$emit('editGoods', obj)
		},
		checkDel (obj) {
			this.$alert('删除后无法恢复，确认删除该商品？', '删除商品', {
				confirmButtonText: '确定'}).then(() => {
				this.handleChangeState(obj)
			})
		},
		handleChangeState (obj) {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			let url = `${this.$api.saveGoods}/${obj.row.id}`

			this.$http.delete(url).then((res) => {
				if (res.data.code === '0') {
					// 删除为空时，向前跳页
					if (this.tableDateArr.length === 1 && this.pageIndex > 1) {
						this.pageIndex -= 1
					}
					this.getGoodsList()
					this.$message.success('删除成功')
				} else {
					this.$message.error(res.data.message)
				}
			}).finally(() => {
				this.forbidClick = false
			})
		},
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getGoodsList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getGoodsList()
		},
		handleTypeChange (val) {
			this.goodsTypeId = val === -1 ? '' : val
			this.state = ''
			this.searchContent = ''
			this.pageIndex = 1
			this.getGoodsList()
		},
		handleStatusChange (val) {
			this.state = val
			this.searchContent = ''
			this.pageIndex = 1
			this.getGoodsList()
		},
		getGoodsList () {
			const params = {
				type         : this.goodsTypeId,
				status       : this.state,
				pageNum      : this.pageIndex,
				pageSize     : this.pageSize,
				searchContent: this.searchContent
			}

			this.$http.get(this.$api.getGoodsList, {params}).then(({data}) => {
				if (data.code === '0') {
					this.tableDateArr = data.data.list
					this.total = data.data.total
				} else {
					this.$message.error(data.msg)
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.table-container {
    padding: 20px;
	.split {
		color: #409eff;
		margin-left: 10px;
		margin-right: 10px;
		user-select: none;
	}
	.setting-btn {
		color: #409eff;
		cursor: pointer;
		user-select: none;
	}
	.option {
		font-size: 0;
	}
	.img-compressed {
		max-width: 240px;
		width: 100%;
		height: 130px;
	}
}
</style>

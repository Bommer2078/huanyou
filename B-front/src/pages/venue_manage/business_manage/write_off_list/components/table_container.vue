<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="username"
				label="用户名"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="bindingName"
				label="被核销姓名"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="childCode"
				label="联票编号"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="times"
				label="核销时间"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{$utils.dateText(scope.row.createTime)}}</span>
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="50">
				<template slot-scope="scope">
					<span type="text" class="setting-btn" @click="rescind(scope)">撤销</span>
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
			searchContent: ''
		}
	},
	computed: {
		businessName () {
			return this.$route.query.businessName
		}
	},
	watch: {
		businessName (newVal) {
			if (!newVal) return
			this.handleBusinessChange()
		}
	},
	created () {
		if (this.businessName) {
			this.getwriteOffList()
		}
		this.$nextTick(() => {
			this.$EventBus.$on('search', this.handleSearch)
			this.$EventBus.$on('reflash', this.getwriteOffList)
		})
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	methods: {
		handleEdit (obj) {
			this.$EventBus.$emit('editGoods', obj)
		},
		rescind (obj) {
			this.$alert('撤销后无法恢复，用户将重新获得该权益，确认撤销该条核销记录？', '撤销核销', {
				confirmButtonText: '确定'}).then(() => {
				this.handleChangeState(obj)
			})
		},
		handleChangeState (obj) {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			const url = `${this.$api.deleRecode}/${obj.row.id}`

			this.$http.delete(url).then((res) => {
				if (res.data.code === '0') {
					// 删除为空时，向前跳页
					if (this.tableDateArr.length === 1 && this.pageIndex > 1) {
						this.pageIndex -= 1
					}
					this.getwriteOffList()
					this.$message.success(res.data.msg)
				} else {
					this.$message.error(res.data.msg)
				}
			}).finally(() => {
				this.forbidClick = false
			})
		},
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getwriteOffList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getwriteOffList()
		},
		handleBusinessChange () {
			this.searchContent = ''
			this.pageIndex = 1
			this.getwriteOffList()
		},
		getwriteOffList () {
			const params = {
				pageNum       : this.pageIndex,
				pageSize      : this.pageSize,
				username      : this.searchContent,
				verifyUsername: this.businessName
			}

			this.$http.get(this.$api.getwriteOffList, {params}).then(({data}) => {
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
		width: 240px;
		height: 130px;
	}
}
</style>

<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="num"
				label="联票序号"
				min-width="20%">
				<template slot-scope="scope">
					<span >{{scope.row.num || '无'}}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="childCode"
				label="联票编码"
				min-width="20%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="绑定状态"
				min-width="20%">
				<template slot-scope="scope">
					<span v-if="scope.row.binding">{{`已被${scope.row.bindingName}用户绑定`}}</span>
					<span v-else-if="scope.row.forwarded">用户转发过</span>
					<span v-else>未绑定</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="绑定账号"
				min-width="20%">
				<template slot-scope="scope">
					<span v-if="scope.row.binding">{{scope.row.username}}</span>
					<span v-else>未绑定</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="user"
				label="生成时间"
				min-width="20%">
				<template slot-scope="scope">
					<span>{{$utils.dateText(scope.row.createTime)}}</span>
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="150">
				<template slot-scope="scope">
					<el-switch
						:disabled="forbidClick"
						v-model="scope.row.status"
						active-color="#13ce66"
						inactive-color="#ff4949"
						active-text="正常"
						inactive-text="冻结"
						:active-value="1"
						:inactive-value="2"
						@change="handleChangeState(scope,scope.row.status)"
					>
					</el-switch>
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
			ticketType   : 1 // 1,批量生产，2，购买生成
		}
	},
	created () {
		this.getYearTickeList()
		this.$nextTick(() => {
			this.$EventBus.$on('changeProductType', this.handleTypeChange)
			this.$EventBus.$on('search', this.handleSearch)
		})
	},
	destroyed () {
		this.$EventBus.$off('changeProductType')
		this.$EventBus.$off('search')
	},
	computed: {
		ticketId () {
			return this.$route.query.ticketId
		}
	},
	methods: {
		handleChangeState (obj, state) {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			const params = {
				ids   : [ obj.row.id ],
				status: state
			}

			this.$http.put(this.$api.batchUpdateStatus, params).then((res) => {
				if (res.data.code === 0) {
					// 删除为空时，向前跳页
					if (this.tableDateArr.length === 1 && this.pageIndex > 1 && state === 4) {
						this.pageIndex -= 1
					}
					this.getYearTickeList()
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
			this.getYearTickeList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getYearTickeList()
		},
		handleTypeChange (val) {
			this.ticketType = val
			this.searchContent = ''
			this.pageIndex = 1
			this.getYearTickeList()
		},
		getYearTickeList () {
			const params = {
				batchProduct: this.ticketType === 1,
				pageNum     : this.pageIndex,
				pageSize    : this.pageSize,
				yearTicketId: this.ticketId
			}

			if (this.searchContent) {
				params.num = this.searchContent
			}
			this.$http.get(this.$api.getYearTickeList, {params})
				.then(({data}) => {
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

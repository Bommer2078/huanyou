<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="phone"
				label="手机号"
				min-width="20%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="ticketCount"
				label="联票张数"
				min-width="20%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="状态"
				min-width="20%">
				<template slot-scope="scope">
					{{scope.row.status | statusText}}
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="注册时间"
				min-width="20%">
				<template slot-scope="scope">
					{{$utils.dateText(scope.row.createTime)}}
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="250">
				<template slot-scope="scope">
					<el-switch
						:disabled="forbidClick"
						v-model="scope.row.status"
						active-color="#13ce66"
						inactive-color="#ff4949"
						active-text="恢复"
						inactive-text="冻结"
						:active-value="1"
						:inactive-value="2"
						@change="handleChangeState(scope,scope.row.status)"
					>
					</el-switch>
					<span class="split">|</span>
					<span type="text" class="setting-btn" @click="intoTicketList(scope)">联票列表</span>
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
	filters: {
		statusText (val) {
			let temp = val === 1 ? '正常' : '已冻结'

			return temp
		}
	},
	created () {
		this.getUserList()
		this.$nextTick(() => {
			this.$EventBus.$on('search', this.handleSearch)
		})
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	methods: {
		intoTicketList (val) {
			this.$router.push(`/userManage/ticketList?name=${val.row.username}`)
		},
		handleChangeState (obj, state) {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			const params = {
				id    : obj.row.id,
				status: state === 1 ? 1 : 2
			}

			this.$http.put(this.$api.changeUserState, params).then((res) => {
				if (res.data.code === '0') {
					this.getUserList()
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
			this.getUserList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getUserList()
		},
		getUserList () {
			const params = {
				pageNum : this.pageIndex,
				pageSize: this.pageSize,
				phone   : this.searchContent
			}

			this.$http.get(this.$api.getCommenUserList, {params}).then(({data}) => {
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

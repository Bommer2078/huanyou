<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				align="center"
				prop="username"
				label="手机号码"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="commentText"
				label="内容"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="createTime"
				label="评论时间"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{$utils.dateText(scope.row.createTime)}}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="状态"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{scope.row.status | statusText}}</span>
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="80">
				<template slot-scope="scope">
					<span type="text" class="setting-btn" @click="handlePass(scope)">{{scope.row.status === 0 ? '通过' : '--' }}</span>
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
			startTime    : '',
			endTime      : ''
		}
	},
	created () {
		this.getCommentList()
		this.$nextTick(() => {
			this.$EventBus.$on('search', this.handleSearch)
		})
	},
	computed: {
		venueId () {
			return this.$route.query.id
		}
	},
	filters: {
		statusText (val) {
			return val === 1 ? '已审核' : '未审核'
		}
	},
	destroyed () {
		this.$EventBus.$off('changeTime')
		this.$EventBus.$off('search')
	},
	methods: {
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getCommentList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getCommentList()
		},
		handlePass (val) {
			if (val.row.status === 1) {
				return
			}
			this.$http.put(`${this.$api.showComment}/${val.row.id}`)
				.then(({data:{code, data, message}}) => {
					if (code === '0') {
						this.getCommentList()
					}
				})
		},
		getCommentList () {
			const params = {
				venueId : this.venueId,
				pageNo  : this.pageIndex,
				pageSize: this.pageSize
			}

			this.$http.get(this.$api.getCommentList, {params}).then(({data:{code, data, message}}) => {
				if (code === '0') {
					this.tableDateArr = data.list
					this.total = data.total
				} else {
					this.$message.error(message)
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

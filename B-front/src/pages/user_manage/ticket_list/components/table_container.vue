<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="childCode"
				label="联票编码"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="c"
				label="头像"
				min-width="25%">
				<template slot-scope="scope">
					<img class="img-compressed" :src="scope.row.bindingPhoto" v-if="scope.row.bindingPhoto">
					<span v-else>未绑定</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="bindingName"
				label="姓名"
				width="150">
			</el-table-column>
			<el-table-column
				align="center"
				prop="username"
				label="手机号码"
				width="150">
			</el-table-column>
			<el-table-column
				align="center"
				prop="binding"
				label="绑定状态"
				width="150">
				<template slot-scope="scope">
					<span class="img-compressed">{{scope.row.binding ? '已绑定' : '未绑定'}}</span>
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="100">
				<template slot-scope="scope">
					<input
						class="file-img"
						type="file"
						accept="image/png, image/jpeg, image/jpg"
						@change="changeCover(scope.row)">
					<span type="text" class="setting-btn">绑定头像</span>
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
import uploadImg from '@/libs/upload.js'
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
	created () {
		this.getTicketList()
		this.$EventBus.$on('search', this.handleSearch)
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	computed: {
		currentUsername () {
			return this.$route.query.name
		}
	},
	methods: {
		changeCover (item) {
			if (this.forbidClick) {
				this.$message.error('等待图片上传完成')
				return
			}
			this.forbidClick = true
			let file = event.target.files[0]
			var formData = new FormData()

			formData.append('file', file) // 添加图片信息的参数
			// formData.append('need_thumb', 1) // 添加其他参数
			/* 检测是否是图片类型 */

			if (!uploadImg.isImg(file)) {
				this.$message.error('请选择正确图片类型')
				return
			}
			/* 图片大小，单位：字节，按 1024 转换 */
			let size = (file.size / 1024 / 1024).toFixed(2)

			if (size > 3) {
				this.$message.error('图片大小不能超过3M~')
				return
			}
			this.imgLoading = true
			this.$http.post(this.$api.uploadImg, formData)
				.then((res) => {
					if (res.data.code === '0') {
						let imgUrl = res.data.data

						this.bindTicket(item, imgUrl)
					} else {
						this.$message.error('上传图片失败')
						this.forbidClick = false
					}
				})
				.catch(() => {
					this.forbidClick = false
				})
				.finally(() => {
					this.imgLoading = false
				})
		},
		bindTicket (item, url) {
			let params = {
				bindingName : item.bindingName,
				bingingPhoto: url,
				childCode   : item.childCode,
				password    : item.password,
				username    : item.username,
				id          : item.id
			}

			this.$http.put(this.$api.bindTicket, params).then((res) => {
				if (res.data.code === '0') {
					this.$message('绑定成功！')
					this.getTicketList()
				} else {
					this.$message.error(res.data.message)
				}
			})
				.finally(() => {
					this.forbidClick = false
				})
		},
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getTicketList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getTicketList()
		},
		getTicketList () {
			const params = {
				pageNum : this.pageIndex,
				pageSize: this.pageSize,
				username: this.currentUsername
			}

			if (this.searchContent) {
				params.childCode = this.searchContent
			}
			this.$http.get(this.$api.getTicketByUser, {params}).then(({data}) => {
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
	.file-img {
		display: block;
		width: 100px;
		height: 36px;
		font-size: 0;
		position: absolute;
		cursor: pointer;
		top: 60px;
		left: 0;
		opacity: 0;
	}
}
</style>

<template>
	<div class="table-header">
		<t-button @clickBtn="createTicket">批量生产</t-button>
		<t-button @clickBtn="createExcel">生成excel</t-button>
		<div class="left-part">
			<el-select v-model="ticketType" @change="changeType">
				<template v-for="item in ticketTypeArr" >
					<el-option
						:key="item.id"
						:label="item.name"
						:value="item.id"></el-option>
				</template>
			</el-select>
			<search-group ref="searchGroup" v-show="ticketType === 1" placeholder="请输入联票序号"></search-group>
		</div>
		<el-dialog
			width="530px"
			title="生产数量"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox"
		>
			<div class="form-item">
				<input type="number" class="setting-input" placeholder="请输入批量生产的数量1~1000" v-model.trim="productNum" />
			</div>
			<div slot="footer">
				<t-button @clickBtn="startProduct">开始生产</t-button>
			</div>
		</el-dialog>
		<el-dialog
			width="530px"
			title="生产数量"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox2"
		>
			<div class="form-item">
				<input type="number" class="setting-input" placeholder="请输入批量生成得序号前12位数字" v-model.trim="excelNum" />
			</div>
			<div slot="footer">
				<t-button @clickBtn="getExcel">按批次导出</t-button>
			</div>
		</el-dialog>
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
			ticketTypeArr: [
				{
					id  : 1,
					name: '批量生产'
				},
				{
					id  : 2,
					name: '购买产生'
				}
			],
			ticketType     : 1,
			productNum     : 0,
			showSettingBox : false,
			showSettingBox2: false,
			pageNum        : 1,
			pageSize       : 10,
			excelNum       : ''
		}
	},
	computed: {
		ticketId () {
			return this.$route.query.ticketId
		},
		yearTicketName () {
			return this.$route.query.yearTicketName
		}
	},
	methods: {
		createTicket () {
			this.showSettingBox = true
		},
		createExcel () {
			this.showSettingBox2 = true
		},
		changeType () {
			this.$refs.searchGroup.searchContent = ''
			this.$EventBus.$emit('changeProductType', this.ticketType)
		},
		startProduct () {
			if (!this.productNum) {
				this.$message.error('数量不能为空')
				return
			}
			if (!this.productNum > 1000) {
				this.$message.error('数量不能大于1000')
				return
			}
			const params = {
				count         : this.productNum,
				yearTicketId  :	this.ticketId,
				yearTicketName:	this.yearTicketName
			}

			this.$http.get(this.$api.batchProductTicket, {params})
				.then(({data}) => {
					if (data.code === '0') {
						this.showSettingBox = false
					}
				})
		},
		getExcel () {
			if (!this.excelNum) {
				this.$message.error('序号不能为空')
				return
			}
			const params = {
				batchProduct: true,
				yearTicketId:	this.ticketId,
				num         :	this.excelNum
			}

			this.$http.get(this.$api.excelExport, {params})
				.then(({data}) => {
					this.showSettingBox2 = false
					this.excelNum = ''
					this.download(data)
					this.$message('下载中')
				})
		},
		download (data) {
			if (!data) {
				return
			}
			let url = window.URL.createObjectURL(new Blob([ data ]))
			let downloadElement = document.createElement('a')

			downloadElement.style.display = 'none'
			downloadElement.href = url
			downloadElement.setAttribute('download', 'excel.xlsx')
			document.body.appendChild(downloadElement)
			downloadElement.click()
			document.body.removeChild(downloadElement) // 下载完成移除元素
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
.setting-input {
	width: 240px;
	height: 36px;
	font-size: 14px;
	padding-left: 10px;
	background: rgba(255, 255, 255, 1);
	border-radius: 2px;
	border: 1px solid rgba(238, 238, 238, 1);
	box-sizing: border-box;
	margin-right: 10px;
}
</style>

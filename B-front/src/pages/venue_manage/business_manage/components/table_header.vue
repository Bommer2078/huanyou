<template>
	<div class="table-header">
		<t-button @clickBtn="createdBusiness">创建商家账号</t-button>
		<div class="left-part">
		</div>
		<el-dialog
			width="530px"
			title="商家设置"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox">
			<div class="form-item">
				<span class="label">账户</span>
				<input type="text" class="setting-input" placeholder="请输入账户名称" v-model.trim="businessObj.username" />
			</div>
			<div class="form-item">
				<span class="label">手机</span>
				<input type="text" class="setting-input" placeholder="请输入账户名称" v-model.trim="businessObj.phone" />
			</div>
			<div class="form-item">
				<span class="label">密码</span>
				<input type="text" class="setting-input" placeholder="请输入密码" v-model.trim="password" />
			</div>
			<div class="form-item">
				<div class="label">状态</div>
				<div class="form-content">
					<el-radio v-model="businessObj.status" :label="1">正常</el-radio>
					<el-radio v-model="businessObj.status" :label="0">冻结</el-radio>
				</div>
			</div>
			<div class="form-item">
				<span class="label align-top">票务说明</span>
				<textarea type="text" class="setting-input" placeholder="请输入票务说明" v-model.trim="businessObj.description" />
			</div>
			<div slot="footer">
				<t-button @clickBtn="saveBusiness">保存</t-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
import md5 from 'js-md5'
// import searchGroup from '@/components/common/search_group.vue'
export default {
	components: {
		tButton
		// searchGroup
	},
	props: {
		currentObj: {
			type   : Object,
			default: null
		}
	},
	data () {
		return {
			showSettingBox: false,
			businessObj   : {status: 1},
			isEdit        : false,
			password      : ''
		}
	},
	computed: {
		venueId () {
			return this.$route.query.id
		}
	},
	watch: {
		showSettingBox (newVal) {
			if (!newVal) {
				this.businessObj = {status: 1}
				this.password = ''
			}
		}
	},
	created () {
		this.$EventBus.$on('editBusiness', this.createdBusiness)
	},
	destroyed () {
		this.$EventBus.$off('editBusiness')
	},
	methods: {
		createdBusiness (bl) {
			if (bl) {
				if (!this.currentObj) return
				this.businessObj = JSON.parse(JSON.stringify(this.currentObj))
				this.isEdit = true
			}
			this.showSettingBox = true
		},
		saveBusiness () {
			if (!this.checkForm()) {
				return
			}
			if (!this.venueId) {
				this.$message.error('场馆id不能为空')
				return
			}
			let params = {
				description: this.businessObj.description,
				password   : md5(this.password),
				phone      : this.businessObj.phone,
				status     : this.businessObj.status,
				username   : this.businessObj.username,
				venueId    : this.venueId
			}
			let fn = 'post'
			let url = this.$api.saveBusiness

			if (this.isEdit) {
				fn = 'put'
				url = this.$api.editBusiness
			}

			this.$http[fn](url, params)
				.then((res) => {
					this.isEdit = false
					if (res.data.code === '0') {
						this.showSettingBox = false
						this.businessObj = {status: 1}
						this.$EventBus.$emit('reflash')
					} else if (res.data.code === '10002') {
						this.$message.error('用户已存在')
					} else {
						this.$message.error(res.data.message)
					}
				})
		},
		checkForm () {
			let obj = this.businessObj

			if (!obj.username || obj.username === '') {
				this.$message.error('请输入账户名称')
				return false
			}
			if (!obj.phone || obj.phone === '') {
				this.$message.error('请输入账户手机')
				return false
			}
			if (!this.password || this.password === '') {
				this.$message.error('请输入密码')
				return false
			}
			if (!obj.description || obj.description === '') {
				this.$message.error('请输入票务说明')
				return false
			}
			return true
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
}
</style>

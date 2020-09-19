<template>
	<div class="table-header">
		<t-button @clickBtn="editBusiness">编辑商户</t-button>
		<t-button @clickBtn="writeOffByhand">手动核销</t-button>
		<div class="left-part">
			<search-group ref="searchGroup" placeholder="请输入用户名称"></search-group>
		</div>
		<el-dialog
			width="530px"
			title="手动核销"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox">
			<div class="form-item">
				<span class="label">票务</span>
				<input type="text" class="setting-input" placeholder="请输入账户名称" v-model.trim="childCode" />
			</div>
			<div class="form-item">
				<span class="label">密码</span>
				<input type="text" class="setting-input" placeholder="请输入账户名称" v-model.trim="password" />
			</div>
			<div slot="footer">
				<t-button @clickBtn="confirmWriteOff">确定</t-button>
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
			showSettingBox: false,
			childCode     : '',
			password      : ''
		}
	},
	computed: {
		businessName () {
			return this.$route.query.businessName
		}
	},
	methods: {
		editBusiness () {
			this.$EventBus.$emit('editBusiness', true)
		},
		writeOffByhand () {
			this.showSettingBox = true
		},
		confirmWriteOff () {
			let params = {
				childCode: this.childCode,
				password : this.password,
				username : this.businessName
			}

			this.$http.post(this.$api.writeOff, params)
				.then((res) => {
					if (res.data.code === '0') {
						this.$message('核销成功')
						this.$EventBus.$emit('reflash')
					} else {
						this.$message.error(res.data.message)
					}
					console.log('res', res)
				})
			this.showSettingBox = false
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

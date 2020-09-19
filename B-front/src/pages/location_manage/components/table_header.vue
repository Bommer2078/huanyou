<template>
	<div class="table-header">
		<t-button @clickBtn="createLocation">新建所属地</t-button>
		<el-dialog
			width="530px"
			:title="boxTitle"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox"
		>
			<div class="form-item">
				<span class="label">所属地名称</span>
				<input type="text" class="setting-input" placeholder="请输入所属地名称" v-model.trim="loctionName" />
			</div>
			<div slot="footer">
				<t-button @clickBtn="saveLocation">保存</t-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
// import searchGroup from '@/components/common/search_group.vue'

export default {
	components: {
		tButton
		// searchGroup
	},
	data () {
		return {
			forbidClick   : false,
			showSettingBox: false,
			loctionName   : '',
			boxTitle      : '',
			editObj       : null
		}
	},
	created () {
	},
	destroyed () {
	},
	methods: {
		createLocation (obj) {
			this.editObj = obj || null
			this.loctionName = obj ? obj.row.name : ''
			this.boxTitle = obj ? '编辑所属地' : '创建所属地'
			this.showSettingBox = true
		},
		saveLocation () {
			if (this.forbidClick) {
				return
			}
			if (!this.checkVal()) {
				return
			}
			this.forbidClick = true
			const params = {
				name: this.loctionName
			}

			if (this.editObj) {
				params.id = this.editObj.row.id
			}
			this.$http.post(this.$api.saveLocation, params).then(({data:{code, data, message}}) => {
				if (code === '0') {
					this.$EventBus.$emit('reflash')
					this.showSettingBox = false
					this.$message.success('保存成功')
				} else {
					this.$message.error(message)
				}
			}).finally(() => {
				setTimeout(() => {
					this.forbidClick = false
				}, 3000)
			})
		},
		checkVal () {
			if (this.loctionName === '') {
				this.$message.error('类型名称不能为空')
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
			margin-right: 20px;
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
	}

}
</style>

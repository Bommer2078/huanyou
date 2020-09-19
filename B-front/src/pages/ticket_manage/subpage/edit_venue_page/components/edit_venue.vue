<template>
	<div class="editor-wrap" v-if="editVenue" @click.stop>
		<div class="title">设置场馆的关联规则</div>
		<div class="form-container">
			<div class="form-item">
				<div class="form-label">场馆名称</div>
				<div class="form-content">
					{{editVenue.text}}
				</div>
			</div>
			<div class="form-item" style="margin-top: 10px;">
				<div class="form-label">生效时间<span class="redStar">*</span></div>
				<div class="form-content">
					<input type="text" class="form-input" v-model.trim="effectiveDate">
					<span>小时后生效</span>
				</div>
			</div>
			<div class="form-item" style="margin-bottom: 10px;">
				<div class="form-label align-top">使用规则</div>
				<div class="form-content align-top">
					<el-radio v-model="rules" :label="1">按次数</el-radio>
					<el-radio v-model="rules" :label="2">几选几</el-radio>
				</div>
				<template v-if="rules === 1">
					<div class="form-label align-top" style="margin-top: 0;">周期</div>
					<div class="form-content align-top cycle-type">
						<el-radio v-model="period" :label="0">每日</el-radio>
						<el-radio v-model="period" :label="1">每月</el-radio>
						<el-radio v-model="period" :label="2">有效期内</el-radio>
					</div>
					<div class="form-label align-top">可参与次数</div>
					<div class="form-content align-top">
						<input type="text" class="form-input" v-model.trim="times">
						<span>次</span>
					</div>
				</template>
				<template v-if="rules === 2">
					<button @click="addRaletedVenue" class="add-related-venue-btn">+ 添加关联场馆</button>
					<div class="related-venue">
						<template  v-for="(item,index) in confirmVenueArr">
							<div :key="index" class="venue-item" v-if="item.id !== editVenue.id">
								<span>{{item.text}}</span>
								<img
									src="@/assets/images/icon_close.png"
									class="item-close-icon"
									@click.stop="deleteVenue(index)">
							</div>
						</template>
					</div>
					<template v-if="confirmVenueArr.length > 1">
						<div class="form-label align-top">参与规则</div>
						<div class="form-content align-top">
							<span class="select-input forbid">{{confirmVenueArr.length}}</span>
							<span>选</span>
							<input type="text" class="select-input" v-model.trim="selectTimes">
						</div>
					</template>
				</template>
			</div>
		</div>
		<el-dialog
			title="关联相应的场馆到几选几的规则当中"
			:visible.sync="showRaletedVenue"
			:before-close="handleClose">
			<el-table :data="availableVenue" @selection-change="handleSelectionChange">
				<el-table-column
					type="selection"
					width="55">
				</el-table-column>
				<el-table-column property="text" label="场馆名称" min-width="100%"></el-table-column>
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
			<span slot="footer" class="dialog-footer">
				<t-button @clickBtn="saveRaletedVenue">确定</t-button>
			</span>
		</el-dialog>
		<t-button @clickBtn="saveRules" class="save-btn">保存</t-button>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
export default {
	name: 'editorWrapper',
	data () {
		return {
			showLoading       : false,
			editVenue         : null,
			effectiveDate     : 0,
			rules             : 1,
			period            : 2,
			times             : 1,
			showRaletedVenue  : false,
			pageIndex         : 1,
			pageSize          : 10,
			total             : 0,
			selectedArr       : [], // 弹窗里选中的场馆
			confirmVenueArr   : [], // 确认选中后的场馆
			selectTimes       : 1,
			tempVenueArr      : [], //  几选几时删除的场馆，临时存放，以便在列表内可以选到该场馆
			confirmVenueArrBak: [] // 备份，以便删除了相关场馆的时候能够及时通知被删除的场馆更改状态
		}
	},
	components: {
		tButton
	},
	props: {
		venueObj: {
			type   : Object,
			default: null
		},
		venueArr: {
			type: Array,
			default () {
				return []
			}
		}
	},
	created () {
		this.initEditObj()
	},
	computed: {
		availableVenue () {
			let tempArr = []
			let tempArr2 = this.tempVenueArr
			let obj = {}
			let tempArr3 = []

			// 筛选出没有被绑定规则的场馆以及当前编辑的场馆
			this.venueArr.forEach((item) => {
				if (!item.rules && this.venueObj.id !== item.id) {
					tempArr.push(item)
				}
			})
			// 筛选出当前编辑关联到的场馆
			tempArr = tempArr.filter((item) => !this.confirmVenueArr.some((ele) => ele.id === item.id))
			tempArr2 = tempArr2.filter((item) => !this.confirmVenueArr.some((ele) => ele.id === item.id))
			tempArr2 = tempArr.concat(tempArr2)

			// 去重
			tempArr2.forEach((item) => {
				if (!obj[item.id]) {
					obj[item.id] = item.id
					tempArr3.push(item)
				}
			})

			return tempArr3
		}
	},
	methods: {
		initEditObj () {
			this.$nextTick(() => {
				this.editVenue = JSON.parse(JSON.stringify(this.venueObj))
				if (this.editVenue.rules) {
					this.effectiveDate = this.editVenue.effectiveDate || 0
					this.rules = this.editVenue.rules
					this.period = Number(String(this.editVenue.period) || 3)
					this.times = this.editVenue.times || 1
					this.confirmVenueArr = JSON.parse(JSON.stringify(this.editVenue.confirmVenueArr))
					this.confirmVenueArrBak = JSON.parse(JSON.stringify(this.editVenue.confirmVenueArr))
					this.selectTimes = this.editVenue.selectTimes
				} else {
					this.confirmVenueArr.push({
						text: this.editVenue.text,
						id  : this.editVenue.id
					})
				}
			})
		},
		handleSelectionChange (val) {
			this.selectedArr = val
		},
		saveRaletedVenue () {
			this.confirmVenueArr = this.confirmVenueArr.concat(this.selectedArr)
			this.handleClose()
		},
		addRaletedVenue () {
			this.showRaletedVenue = true
		},
		handleClose () {
			this.showRaletedVenue = false
		},
		changePage () {

		},
		deleteVenue (index) {
			let temp = this.confirmVenueArr.splice(index, 1)[0]

			this.tempVenueArr.push(temp)
			if (Number(this.selectTimes) === this.confirmVenueArr.length && this.selectTimes > 1) {
				this.selectTimes -= 1
			}
		},
		saveRules () {
			if (!this.checkValue()) {
				return
			}
			if (this.rules === 2) {
				// 找出被删除的场馆
				let tempArr = this.confirmVenueArrBak.filter((item) => !this.confirmVenueArr.some((ele) => ele.id === item.id))

				this.$EventBus.$emit('deletRaletedVenue', tempArr)
			}
			if (this.rules === 1) {
				// 规则从几选几变为按次数，需通知出自己之外所有相关场馆改变规则
				if (this.venueObj.rules === 2) {
					// 当几选几变成相关按次数，总的关联场馆就变成减少了1，可使用的场馆数量不能与之相当
					if (this.venueObj.selectTimes === this.confirmVenueArrBak.length && this.venueObj.selectTimes !== 1) {
						this.selectTimes -= 1
					}
					this.$EventBus.$emit('changeRules', this.venueObj)
				}
			}
			this.editVenue.effectiveDate = this.effectiveDate
			this.editVenue.rules = this.rules
			this.editVenue.period = this.period
			this.editVenue.times = this.times
			this.editVenue.confirmVenueArr = this.confirmVenueArr
			this.editVenue.selectTimes = this.selectTimes
			this.$EventBus.$emit('editFinished', this.editVenue)
		},
		checkValue () {
			if (this.rules === 2) {
				if (this.confirmVenueArr.length === 1) {
					this.$message.error('请至少选择一个场馆')
					return false
				}
				if (this.confirmVenueArr.length <= this.selectTimes) {
					this.$message.error('可使用场馆不能大于或等于已选的场馆数量')
					return false
				}
			}
			return true
		}
	}
}
</script>

<style lang="less" scoped>
.editor-wrap {
    font-size: 14px;
    color: rgba(53,53,53,1);
    padding: 0 20px 20px;
    width: 355px;
    box-sizing: border-box;
    position: absolute;
    left: 100%;
    top: 0;
    min-height: 380px;
    background: #f8f8f8;
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    margin-left: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    &:after,
    &:before {
        right: 100%;
        top: 20px;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    &:before {
        border-color: transparent;
        border-right-color: #e5e5e5;
        border-width: 7px;
        margin-top: -7px;
    }
    &:after {
        border-color: transparent;
        border-right-color: #f8f8f8;
        border-width: 6px;
        margin-top: -6px;
    }
    .title {
        height: 50px;
        line-height: 50px;
        font-weight: 800;
	}
}
.related-venue {
    display: flex;
    flex-flow: wrap;
    margin-top: 10px;
    .venue-item {
        font-size: 12px;
        line-height: 18px;
        position: relative;
        border: 1px solid #2A75ED;
        padding-left: 10px;
        padding-right: 10px;
        margin-right: 10px;
        border-radius: 4px;
        margin-top: 10px;
        span {
            display: inline-block;
            max-width: 220px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: keep-all;
        }
    }
    .item-close-icon {
        position: absolute;
        top: -8px;
        right: -8px;
    }
}
.add-related-venue-btn {
    background: none;
    outline: none;
    border: 1px dashed #2A75ED;
    display: block;
    height: 30px;
    width: 100%;
    color: #2A75ED;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    margin-bottom: 20px;
}
.form-container {
    color: #353535;
    text-align: initial;
    .form-title {
        position: relative;
        font-size: 16px;
        font-weight: 700;
        padding-left: 10px;
        margin-bottom: 20px;
        &::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 0px;
            width: 2px;
            height: 14px;
            background: #2A75ED;
        }
    }
    .form-item {
        margin-left: 10px;
        .form-label {
            display: inline-block;
            width: 110px;
            font-size: 14px;
        }
        .redStar {
            margin-left: 4px;
            width: 7px;
            height: 20px;
            position: relative;
            color: #e64340;
        }
        .form-content {
            display: inline-block;
        }
        .align-top {
            vertical-align: top;
            margin-top: 12px;
        }
    }
}
input {
    width:85px;
    height:36px;
    padding-left: 10px;
    font-size: 14px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(238,238,238,1);
    box-sizing: border-box;
    margin-right:7px;
}
.save-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
}
.select-input {
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 20px;
    padding: 4px;
    text-align: center;
    box-sizing: border-box;
    vertical-align: middle;
}
.forbid {
    background: #eee;
    cursor: not-allowed;
}
.cycle-type .el-radio {
    display: block;
    margin-bottom: 10px;
}
</style>

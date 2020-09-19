<template>
	<div class="edit-ticket">
		<div class="form-container">
			<div class="form-title">联票基础信息设置</div>
			<div class="form-item">
				<div class="form-label">联票名称<span class="redStar">*</span></div>
				<div class="form-content">
					<input type="text" class="form-input" placeholder="请输入联票名称" v-model.trim="ticketName">
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">封面图<span class="redStar">*</span></div>
				<div class="form-content cover-img-wrap">
					<div class="cover-img-box">
						<img
							v-if="!img_url"
							class="cover-img-defalut"
							src="../../../../assets/images/icon_addpic.svg" >
						<img
							v-if="img_url"
							:src="img_url"
							class="cover-img" >
					</div>
					<div class="cover-img-option">
						<button class="img-btn">选择图片</button>
						<p class="img-explain">小于3M，支持jpg、png、jpeg格式</p>
						<input
							v-if="!imgLoading"
							class="file-img"
							type="file"
							accept="image/png, image/jpeg, image/jpg"
							@change="changeCover">
					</div>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">上架状态</div>
				<div class="form-content align-top">
					<el-radio v-model="state" :label="1">上架</el-radio>
					<el-radio v-model="state" :label="0">下架</el-radio>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">关联归属地<span class="redStar">*</span></div>
				<div class="form-content">
					<el-select v-model="locationSelected" placeholder="请选择归属地">
						<el-option
							v-for="item in locationSelectArr"
							:key="item.id"
							:value="item.id"
							:label="item.name"></el-option>
					</el-select>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">价格<span class="redStar">*</span></div>
				<div class="form-content">
					<div class="form-item">
						<div class="item-label">
							<el-checkbox v-model="sellType.oldPriceRule"></el-checkbox>
							<input
								type="text"
								class="form-input"
								placeholder="请输入规格名称,建议不要超过4个字"
								v-model.trim="sellType.priceName">
						</div>
						<input
							type="text"
							class="form-input"
							placeholder="请输入价格"
							v-model.trim="price"
							data-priceType="price"
							@input="inputPrice"><span>元</span>
					</div>
					<div class="form-item">
						<div class="item-label">
							<el-checkbox v-model="sellType.discountRule"></el-checkbox>
							<input
								type="text"
								class="form-input"
								placeholder="请输入规格名称,建议不要超过4个字"
								v-model.trim="sellType.discountPriceName">
						</div>
						<input
							type="number"
							class="form-input-mini"
							placeholder="数量"
							v-model.trim="discountNum">
						<input
							type="text"
							class="form-input"
							placeholder="请输入价格"
							v-model.trim="discountPrice"
							data-priceType="discountPrice"
							@input="inputPrice"><span>元</span>
						<textarea
							type="text"
							class="form-textarea"
							placeholder="请输入优惠政策提示"
							v-model.trim="discountTip"
						></textarea>
					</div>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label">有效范围<span class="redStar">*</span></div>
				<div class="form-content">
					<el-date-picker
						v-model="daterange"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">联票描述<span class="redStar">*</span></div>
				<div class="form-content">
					<vue-ueditor-wrap v-model="rich_content" @ready="ready" :config="ueConfig" @blur="getPlainTxt"></vue-ueditor-wrap>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button'
import uploadImg from '../../../../libs/upload.js'
import * as config from '../../../../libs/ue_config'
export default {
	data () {
		return {
			ticketName       : '',
			imgLoading       : false,
			rich_content     : '',
			content          : '',
			price            : '',
			locationSelected : '',
			locationSelectArr: [],
			forbidClick      : false,
			img_url          : '',
			editId           : '',
			ueConfig         : config.litteConfig,
			state            : 1,
			daterange        : null,
			source           : '',
			discountNum      : '',
			discountPrice    : '',
			discountTip      : '',
			sellType         : {
				oldPriceRule     : false,
				discountRule     : false,
				priceName        : '原价',
				discountPriceName: '套票'
			}

		}
	},
	components: {
		tButton
	},
	watch: {
		rich_content (nval) {
			this.getPlainTxt()
		}
	},
	created () {
		this.getSelectArr()
		this.getTicketInfo()
	},
	methods: {
		changeCover () {
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
						this.img_url = res.data.data
						// this.img_compressed_url = res.data.data.img_thumb_url
						this.$message('上传成功')
					}
				})
				.finally(() => {
					this.imgLoading = false
				})
		},
		ready (editorInstance) {
			this.UEdit = editorInstance
		},
		getPlainTxt () {
			if (this.UEdit) {
				this.$nextTick(() => {
					this.content = this.UEdit.getPlainTxt()
				})
			}
		},
		getSelectArr () {
			let params = {
				pageNum : 1,
				pageSize: 100
			}

			this.$http.get(this.$api.getLocationList, {params})
				.then(({data:{code, data, message}}) => {
					if (code === '0') {
						this.locationSelectArr = data
					}
				})
		},
		getTicketInfo () {
			this.editId = this.$route.query.editId
			if (!this.editId) return
			let url = `${this.$api.saveTicket}/${this.editId}`

			this.$http.get(url).then((res) => {
				if (res.data.code === '0') {
					this.initTicketInforData(res.data.data)
					this.$EventBus.$emit('getVenueArr', res.data.data.relatedVenueList)
				}
			})
		},
		initTicketInforData (obj) {
			this.rich_content = obj.description
			this.ticketName = obj.name
			this.img_url = obj.photo
			this.locationSelected = obj.placeId
			this.daterange = [ obj.validStartDate, obj.validEndDate ]
			this.state = obj.status

			this.price = obj.price / 100
			this.discountTip = obj.discountHint
			this.discountNum = obj.discountNum
			this.discountPrice = obj.discountPrice / 100
			if (obj.sellType) {
				this.sellType = JSON.parse(obj.sellType)
			}
		},
		saveTicket () {
			if (!this.checkForm()) {
				return null
			}
			let temp1 = new Date(this.daterange[0]).getTime() + 86400
			let temp2 = new Date(this.daterange[1]).getTime() + 86400
			let placeName = this.locationSelectArr.find((i) => {
				return i.id === this.locationSelected
			}).name
			let tempObj = {
				description   : this.rich_content,
				name          : this.ticketName,
				photo         : this.img_url,
				placeId       : this.locationSelected,
				placeName     : placeName,
				price         : this.price * 100,
				status        : this.state,
				validStartDate: temp1,
				validEndDate  : temp2
			}

			if (this.sellType.oldPriceRule) {
				tempObj.price = this.price * 100
			}
			if (this.sellType.discountRule) {
				tempObj.discountHint = this.discountTip
				tempObj.discountNum = this.discountNum
				tempObj.discountPrice = this.discountPrice * 100
			}
			tempObj.sellType = JSON.stringify(this.sellType)
			return tempObj
		},
		handleInputNum (e, val) {
			let tempNum = parseInt(e.target.value)

			if (isNaN(tempNum)) {
				tempNum = ''
			}
			this[val] = tempNum <= 0 ? '' : tempNum
		},
		inputPrice (e) {
			let tempNum = e.target.value
			let type = e.target.dataset.pricetype

			this[type] = tempNum.replace(/[^\d.]/g, '').replace(/^\./g, '')
				.replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
				.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
		},
		checkForm () {
			if (!this.ticketName) {
				this.$message.error('联票名称不能为空')
				return false
			}
			if (!this.img_url) {
				this.$message.error('联票图片不能为空')
				return false
			}
			if (!this.locationSelected) {
				this.$message.error('请选择归属地')
				return false
			}
			if (!this.rich_content) {
				this.$message.error('联票描述不能为空')
				return false
			}
			if (!this.daterange) {
				this.$message.error('请选择有效期')
				return false
			}
			if (!this.sellType.oldPriceRule && !this.sellType.discountRule) {
				this.$message.error('请至少设置一种规格的价格')
				return false
			}
			if (!this.price && this.sellType.oldPriceRule) {
				this.$message.error('请输入联票的价格')
				return false
			}
			if (this.sellType.discountRule) {
				if (!this.discountNum || !this.discountPrice || !this.discountTip) {
					this.$message.error('请输优惠政策相关信息')
					return false
				}
			}
			return true
		}
	}
}
</script>

<style scoped lang="less">
.edit-ticket {
    padding: 20px;
	box-sizing: border-box;
	min-height: calc(100vh - 160px) !important;
	margin-bottom: 60px;
    .form-container {
        color: #353535;
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
            margin-bottom: 30px;
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
		.item-label {
			margin-bottom: 20px;
		}
    }
    input {
        width:240px;
        height:36px;
        padding-left: 10px;
        font-size: 14px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        margin-right:10px;
    }
}
.cover-img-box {
  width:200px;
  height:112px;
  background:rgba(247,248,249,1);
  margin-right: 20px;
  img {
    width:200px;
    height:112px;
  }
}

.cover-img-box,
.cover-img-option {
  display: inline-block;
  vertical-align: top;
  position: relative;
}

.img-btn {
  width:100px;
  height:36px;
  background:rgba(250,251,252,1);
  border-radius:2px;
  border:1px solid rgba(229,231,235,1);
}

.img-btn:focus {
  outline: none;
}

.img-explain {
  width:230px;
  height:44px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  color:rgba(136,136,136,1);
  line-height:22px;
}

.cover-img-defalut {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 24px !important;
  height: 24px !important;
}
.file-img {
  display: block;
  width: 100px;
  height: 36px;
  font-size: 0;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  opacity: 0;
}

    .form-input, .form-input-mini {
        width:240px;
        height:36px;
        padding-left: 10px;
        font-size: 14px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        margin-right:10px;
	}
	.form-item .form-input-mini {
        width:60px;
        height:36px;
	}
	.form-item .form-item {
		margin-left: 0 !important;
	}
	.form-textarea {
		display: block;
		margin-top: 20px;
		width: 300px;
		height: 200px;
		padding: 10px;
	}
</style>

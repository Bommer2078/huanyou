<template>
	<div class="edit-ticket">
		<div class="form-container">
			<div class="form-title">商品设置</div>
			<div class="form-item">
				<div class="form-label">商品名称<span class="redStar">*</span></div>
				<div class="form-content">
					<input type="text" class="form-input" placeholder="请输入商品名称" v-model.trim="goodsName">
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">封面图<span class="redStar">*</span></div>
				<div class="form-content cover-img-wrap">
					<div class="cover-img-box">
						<img
							v-if="!img_url"
							class="cover-img-defalut"
							src="@/assets/images/icon_addpic.svg" >
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
					<el-radio v-model="status" :label="1">上架</el-radio>
					<el-radio v-model="status" :label="2">下架</el-radio>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">商品类型</div>
				<div class="form-content align-top">
					<el-radio v-model="goodsType" :label="1">特价票</el-radio>
					<el-radio v-model="goodsType" :label="0">实物商品</el-radio>
				</div>
			</div>
			<div class="form-item"  v-if="goodsType === 1">
				<div class="form-label align-top">关联场馆</div>
				<div class="form-content">
					<el-select v-model="venueId" placeholder="请选择场馆">
						<el-option
							v-for="item in venueArr"
							:key="item.id"
							:value="item.id"
							:label="item.text"></el-option>
					</el-select>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label">价格<span class="redStar">*</span></div>
				<div class="form-content">
					<input
						type="text"
						class="form-input"
						placeholder="请输入价格"
						v-model.trim="price"
						@input="inputPrice"><span>元</span>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">商品描述<span class="redStar">*</span></div>
				<div class="form-content">
					<vue-ueditor-wrap v-model="rich_content" @ready="ready" :config="ueConfig" @blur="getPlainTxt"></vue-ueditor-wrap>
				</div>
			</div>
		</div>
		<div class="footer-btns">
			<div class="btn-group">
				<t-button button-type="gray" @clickBtn="cancel">取消</t-button>
				<t-button @clickBtn="saveGoods">保存</t-button>
			</div>
		</div>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button'
import uploadImg from '@/libs/upload.js'
import * as config from '@/libs/ue_config'
export default {
	data () {
		return {
			goodsName   : '',
			imgLoading  : false,
			rich_content: '',
			content     : '',
			price       : '',
			forbidClick : false,
			img_url     : '',
			editId      : '',
			ueConfig    : config.litteConfig,
			status      : 1,
			goodsType   : 1,
			venueArr    : [],
			venueId     : '',
			venueName   : ''
		}
	},
	components: {
		tButton
	},
	watch: {
		rich_content (nval) {
			this.getPlainTxt()
		},
		venueId (nval) {
			let temp = this.venueArr.find((ele) => {
				return ele.id === nval
			})

			this.venueName = temp ? temp.text : ''
		}
	},
	created () {
		this.getGoodsInfo()
		this.getVenueList()
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
		getGoodsInfo () {
			this.editId = this.$route.query.editId
			if (this.editId) {
				let url = `${this.$api.saveGoods}/${this.editId}`

				this.$http.get(url)
					.then(({data:{code, data, message}}) => {
						if (code === '0') {
							this.goodsName = data.name
							this.rich_content = data.description
							this.price = data.price / 100
							this.img_url = data.photo
							this.status = data.status
							this.goodsType = data.type
							this.venueId = data.venueId
							this.venueName = data.venueName
						}
					})
			}
		},
		getVenueList () {
			const params = {
				pageNum : 1,
				pageSize: 100
			}

			this.$http.get(this.$api.getVenueList, {params}).then(({data:{code, data, message}}) => {
				if (code === '0') {
					let tampArr = []

					data.list.forEach((item) => {
						tampArr.push({
							id  : item.id,
							text: item.name
						})
					})
					this.venueArr = JSON.parse(JSON.stringify(tampArr))
				} else {
					this.$message.error(message)
				}
			})
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

			this.price = tempNum.replace(/[^\d.]/g, '').replace(/^\./g, '')
				.replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
				.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
		},
		checkForm () {
			if (!this.goodsName) {
				this.$message.error('商品名称不能为空')
				return false
			}
			if (!this.img_url) {
				this.$message.error('商品图片不能为空')
				return false
			}
			if (!this.venueId && this.goodsType === 1) {
				this.$message.error('特惠票必须关联场馆')
				return false
			}
			if (!this.rich_content) {
				this.$message.error('商品描述不能为空')
				return false
			}
			if (!this.price) {
				this.$message.error('请输入商品的价格')
				return false
			}
			return true
		},
		saveGoods () {
			if (this.forbidClick) {
				return
			}
			if (this.imgLoading) {
				this.$message.error('图片正在上传中')
				return
			}
			if (!this.checkForm()) {
				return
			}
			this.forbidClick = true

			const params = {
				description: this.rich_content,
				type       : this.goodsType,
				name       : this.goodsName,
				photo      : this.img_url,
				price      : this.price * 100,
				status     : this.status
			}
			let fn = 'post'
			let url = this.$api.saveGoods

			if (this.goodsType === 1) {
				params.venueId = this.venueId
				params.venueName = this.venueName
			}
			if (this.editId) {
				fn = 'put'
				url = `${this.$api.saveGoods}/${this.editId}`
			}
			this.$http[fn](url, params).then((res) => {
				if (res.data.code === '0') {
					this.$router.replace('/goodsManage/goodsList')
					this.$message('保存成功')
				} else {
					this.$message.error(res.data.msg)
					this.forbidClick = false
				}
			})
		},
		cancel () {
			this.$router.replace('/goodsManage/goodsList')
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
.footer-btns {
	position: fixed;
	display: flex;
	align-items: center;
	width: calc(100vw - 160px);
	height: 60px;
	bottom: 0;
	left: 160px;
	background: #fff;
    border-top: 1px solid #eee;
    z-index: 999;
	.btn-group {
		margin: 0 auto;
		.t-button {
			margin-right: 20px;
		}
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
	.form-input-mini {
        width:60px;
        height:36px;
	}
</style>

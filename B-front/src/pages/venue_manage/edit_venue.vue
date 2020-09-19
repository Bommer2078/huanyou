<template>
	<div class="edit-venue">
		<div class="form-container">
			<div class="form-title">场馆设置</div>
			<div class="form-item">
				<div class="form-label">场馆名称<span class="redStar">*</span></div>
				<div class="form-content">
					<input type="text" class="form-input" placeholder="请输入商品名称" v-model.trim="venueName">
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
				<div class="form-label align-top">是否为新增</div>
				<div class="form-content align-top">
					<el-checkbox v-model="newAdd">新增</el-checkbox>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">预约相关</div>
				<div class="form-content align-top">
					<el-checkbox v-model="needOrder">是否需要预约</el-checkbox>
				</div>

			</div>
			<template v-if="needOrder">
				<div class="form-item">
					<div class="form-label">人数上限</div>
					<div class="form-content">
						<input
							type="text"
							class="form-input-mini"
							v-model.trim="peopleNum"><span>人</span>
					</div>
				</div>
				<div class="form-item">
					<div class="form-label">可预约时间段</div>
					<div class="form-content">
						<el-time-select
							placeholder="起始时间"
							v-model="startTime"
							:picker-options="{
								start: '00:00',
								step: '01:00',
								end: '24:00'
						}">
						</el-time-select>
						<el-time-select
							placeholder="结束时间"
							v-model="endTime"
							:picker-options="{
								start: '00:00',
								step: '01:00',
								end: '24:00',
								minTime: startTime
						}">
						</el-time-select>
					</div>
				</div>
				<div class="form-item">
					<div class="form-label">指定商家</div>
					<div class="form-content">
						<el-select v-model="businessSelected" placeholder="请选择商家">
							<el-option
								v-for="item in businessArr"
								:key="item.id"
								:value="item.id"
								:label="item.username"></el-option>
						</el-select>
					</div>
				</div>
				<div class="form-item">
					<div class="form-label">预约说明</div>
					<div class="form-content">
						<textarea
							type="text"
							class="form-text-area"
							placeholder="请输入预约说明"
							v-model.trim="needOrderInfo" />
					</div>
				</div>
			</template>
			<div class="form-item">
				<div class="form-label align-top">上架状态</div>
				<div class="form-content align-top">
					<el-radio v-model="status" :label="1">上架</el-radio>
					<el-radio v-model="status" :label="2">下架</el-radio>
					<el-radio v-model="status" :label="3">过期</el-radio>
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
				<div class="form-label align-top">关联类型<span class="redStar">*</span></div>
				<div class="form-content">
					<el-select v-model="venueTypeSelected" placeholder="请选择类型">
						<el-option
							v-for="item in venueTypeSelectArr"
							:key="item.id"
							:value="item.id"
							:label="item.itemName"></el-option>
					</el-select>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label">门店价格<span class="redStar">*</span></div>
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
				<div class="form-label">联系方式<span class="redStar">*</span></div>
				<div class="form-content">
					<input
						type="text"
						class="form-input"
						placeholder="请输入联系方式"
						v-model.trim="phone" />
				</div>
			</div>
			<div class="form-item">
				<div class="form-label">交通路线<span class="redStar">*</span></div>
				<div class="form-content">
					<textarea
						type="text"
						class="form-text-area"
						placeholder="请输入交通路线"
						v-model.trim="traffic" />
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">场馆描述<span class="redStar">*</span></div>
				<div class="form-content">
					<vue-ueditor-wrap v-model="rich_content" @ready="ready" :config="ueConfig" @blur="getPlainTxt"></vue-ueditor-wrap>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">地理位置<span class="redStar">*</span></div>
				<div class="form-content">
					<input
						type="text"
						class="form-input"
						placeholder="请输入经度"
						v-model.trim="lat" />
					<input
						type="text"
						class="form-input"
						placeholder="请输入纬度"
						v-model.trim="lng" />
						<!-- <div id="map-container"></div> -->
				</div>
			</div>
			<div class="form-item">
				<div class="form-label">地理位置<span class="redStar">*</span></div>
				<div class="form-content">
					<textarea
						type="text"
						class="form-text-area"
						placeholder="请输入所在地址"
						v-model.trim="addressText" />
				</div>
			</div>
		</div>
		<div class="footer-btns">
			<div class="btn-group">
				<t-button button-type="gray" @clickBtn="cancel">取消</t-button>
				<t-button @clickBtn="saveVenue">保存</t-button>
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
			locationSelectArr : [],
			venueTypeSelectArr: [],
			venueName         : '',
			imgLoading        : false,
			rich_content      : '',
			content           : '',
			price             : '',
			forbidClick       : false,
			img_url           : '',
			editId            : '',
			ueConfig          : config.litteConfig,
			status            : 1,
			locationArea      : '',
			traffic           : '',
			phone             : '',
			locationSelected  : '',
			venueTypeSelected : '',
			myMap             : null,
			lng               : '',
			lat               : '',
			addressText       : '',
			marker            : null,
			type              : 0,
			geocoder          : null,
			newAdd            : false,
			needOrder         : false,
			peopleNum         : 0,
			needOrderInfo     : '',
			businessSelected  : '',
			businessArr       : [],
			startTime         : '',
			endTime           : ''
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
		this.getVenueInfo()
		this.getBusinessList()
		this.getLocationArr()
		this.getVenueTypeArr()
		this.initMap()
	},
	methods: {
		initMap () {
			this.$nextTick(() => {
				this.myMap = new qq.maps.Map(document.getElementById('map-container'), {
					center: new qq.maps.LatLng(28.227877, 112.939390), // 地图的中心地理坐标。
					zoom  : 15 // 地图的中心地理坐标。
				})
				this.myMap.panTo(new qq.maps.LatLng(28.227877, 112.939390))

				qq.maps.event.addListener(this.myMap, 'click', (event) => {
					this.lat = event.latLng.getLat()
					this.lng = event.latLng.getLng()

					this.getAddress(this.lat, this.lng)
				})
				this.geocoder = new qq.maps.Geocoder({
					complete: (result) => {
						if (this.marker) {
							this.marker.setMap(null)
						}
						this.addressText = result.detail.address
						this.myMap.setCenter(result.detail.location)
						this.marker = new qq.maps.Marker({
							map     : this.myMap,
							position: result.detail.location
						})
					}
				})
			})
		},
		getBusinessList () {
			if (!this.editId) return
			let params = {
				pageNum : 1,
				pageSize: 10,
				venueId : this.editId
			}

			this.$http.get(this.$api.getBusinessList, {params})
				.then((res) => {
					if (res.data.code === '0') {
						let data = res.data.data

						this.businessArr = data.list
					}
				})
		},
		getAddress (x, y) {
			let coord = new qq.maps.LatLng(x, y)

			this.geocoder.getAddress(coord)
		},
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
						this.img_compressed_url = res.data.data
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
		getVenueInfo () {
			this.editId = this.$route.query.editId
			if (this.editId) {
				let url = `${this.$api.saveVenue}/${this.editId}`

				this.$http.get(url)
					.then(({data:{code, data, message}}) => {
						if (code === '0') {
							this.venueName = data.name
							this.rich_content = data.description
							this.price = data.referPrice / 100
							this.img_url = data.photo
							this.status = data.status
							this.phone = data.phone
							this.lng = data.addressLng
							this.lat = data.addressLat
							this.addressText = data.address
							this.locationSelected = data.placeId
							this.venueTypeSelected = data.venueType
							this.newAdd = data.newAdd
							this.traffic = data.route
							this.needOrder = data.booking
							if (this.needOrder) {
								this.peopleNum = data.bookingMax
								this.businessSelected = data.bookingVerifyUserId
								let tempObj = JSON.parse(data.bookingRedundancy)

								this.needOrderInfo = tempObj.needOrderInfo
								this.startTime = tempObj.startTime
								this.endTime = tempObj.endTime
							}
							// this.getAddress(this.lat, this.lng)
						}
					})
			}
		},
		getLocationArr  () {
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
		getVenueTypeArr  () {
			let params = {
				dictionaryId: '10' // 场馆类型字典id
			}

			this.$http.get(this.$api.getDictionaryItem, {params})
				.then(({data:{code, data, message}}) => {
					if (code === '0') {
						this.venueTypeSelectArr = data
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
			if (!this.venueName) {
				this.$message.error('场馆名称不能为空')
				return false
			}
			// if (!this.img_url) {
			// 	this.$message.error('场馆图片不能为空')
			// 	return false
			// }
			if (!this.locationSelected) {
				this.$message.error('请选择场馆归属地')
				return false
			}
			if (!this.rich_content) {
				this.$message.error('场馆描述不能为空')
				return false
			}
			if (!this.price) {
				this.$message.error('请输入场馆的价格')
				return false
			}
			return true
		},
		saveVenue () {
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

			let placeName = this.locationSelectArr.find((i) => {
				return i.id === this.locationSelected
			}).name

			const params = {
				address    : this.addressText,
				addressLat : this.lat,
				addressLng : this.lng,
				description: this.rich_content,
				name       : this.venueName,
				phone      : this.phone,
				photo      : this.img_url,
				referPrice : this.price * 100,
				status     : this.status,
				type       : this.type,
				placeId    : this.locationSelected,
				venueType  : this.venueTypeSelected,
				newAdd     : this.newAdd,
				route      : this.traffic,
				placeName  : placeName
			}

			if (this.needOrder) {
				let tempObj = {
					needOrderInfo: this.needOrderInfo,
					startTime    : this.startTime,
					endTime      : this.endTime
				}

				params.booking = true
				params.bookingMax = this.peopleNum
				params.bookingRedundancy = JSON.stringify(tempObj)
				params.bookingVerifyUserId = this.businessSelected
			}
			let fn = 'post'
			let url = `${this.$api.saveVenue}`

			if (this.editId) {
				fn = 'put'
				url = `${this.$api.saveVenue}/${this.editId}`
			}

			this.$http[fn](url, params).then(({data: {code, data, message}}) => {
				if (code === '0') {
					this.$router.replace('/venueManage/venueList')
				} else {
					this.$message.error(message)
					this.forbidClick = false
				}
			})
				.finally(() => {
					this.forbidClick = false
				})
		},
		cancel () {
			this.$router.replace('/venueManage/venueList')
		}
	}
}
</script>

<style lang="less" scoped>
.edit-venue {
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
.form-text-area {
	width: 300px;
	height: 180px;
	font-size: 14px;
	padding: 10px;
	display: inline-block;
	vertical-align: text-top;
	border-radius:2px;
	border:1px solid rgba(238,238,238,1);
	resize: none;
}
#map-container {
	width: 640px;
    height: 300px;
}
</style>

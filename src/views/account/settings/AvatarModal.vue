<template>
  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </a-col>
    </a-row>

    <template slot="footer">
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</a-button>
    </template>
  </a-modal>
</template>
<script>
// import { VueCropper } from 'vue-cropper'

import { baseURL, dibootApi } from '@/utils/request'
import cloneDeep from 'lodash.clonedeep'
import { mapGetters } from 'vuex'

export default {
  /*
  components: {
    VueCropper
  },
  */
  data () {
    return {
      baseApi: '/iam/user',
      visible: false,
      filename: '',
      confirmLoading: false,

      options: {
        img: '/avatar2.jpg',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    edit (filename, imgSrc) {
      this.options.img = imgSrc
      this.filename = filename
      this.visible = true
    },
    cancelHandel () {
      this.$emit('cancel')
      this.visible = false
    },

    dataURLtoFile (dataurl, filename) {
      const arr = dataurl.split(',')
      const test = arr[0].match(/:(.*?);/)
      if (test) {
        const mime = test[1]
        const bstr = window.atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      }
    },
    okHandel () {
      const vm = this
      vm.confirmLoading = true
      this.$refs.cropper.getCropData(data => {
        const file = this.dataURLtoFile(data, this.filename)
        console.log('file', file)
        const formData = new FormData()
        formData.set('file', file)
        dibootApi.upload('/uploadFile/upload/dto', formData).then(res => {
          const data = cloneDeep(this.userInfo().info)
          data.avatarUrl = res.data.accessUrl
          dibootApi.post(`${this.baseApi}/updateCurrentUserInfo`, data).then(response => {
            vm.$message.success('上传头像成功')
            vm.$store.commit('SET_AVATAR', `${baseURL}${response.data.avatarUrl}`)
            vm.confirmLoading = false
            vm.cancelHandel()
          }).catch(() => {
            this.$message.error('上传头像失败')
            vm.confirmLoading = false
            vm.cancelHandel()
          })
        }).catch(() => {
          this.$message.error('上传图片失败')
        })
      })
    },

    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>

.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div class="upload">
    <a-upload
      :list-type="actualListType"
      :file-list="fileList"
      :custom-request="handleCustomRequest"
      :before-upload="handleBeforeUploadFile"
      :remove="handleRemoveFile"
      :show-upload-list="limitCount !== 1 || !isImage"
      :multiple="limitCount !== 1"
      @preview="handlePreview"
    >
      <template v-if="limitCount === 1 && isImage">
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 128px;height: 128px;"/>
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">
            {{ uploadText }}
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="listType === 'picture-card'">
          <div v-if="fileList.length < limitCount">
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              {{ uploadText }}
            </div>
          </div>
        </template>
        <template v-else>
          <a-button class="upload-btn">
            <a-icon :type="loading ? 'loading' : 'upload'" />{{ uploadText }}
          </a-button>
        </template>
      </template>
    </a-upload>
    <span class="upload-comment" v-if="fileList.length === 0" style="color: #ddd">
      请上传{{ limitSize }}M以内的{{ isImage ? 'jpg/png格式图片': '文件' }}
    </span>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel" class="custom-upload-preview-modal">
      <img alt="example" style="width: 100%" :src="imageUrl" />
    </a-modal>
  </div>
</template>
<script>
import { dibootApi } from '@/utils/request'
export default {
  name: 'Upload',
  data () {
    return {
      loading: false,
      imageUrl: '',
      previewVisible: false
    }
  },
  computed: {
    // 长度为1 的时候，且为图片，那么类型只能是picture-card
    actualListType () {
      return this.limitCount === 1 && this.isImage ? 'picture-card' : this.listType
    }
  },
  created () {
    if (this.limitCount === 1 && this.isImage && this.value) {
      this.imageUrl = `${this.prefix}${this.value}/image`
    }
  },
  methods: {
    /**
       * 上传之前操作
       */
    handleBeforeUploadFile (file) {
      if (this.limitCount !== 1 && this.limitCount <= this.fileList.length) {
        this.$message.error(`最多只能上传${this.limitCount}${this.isImage ? '张图片' : '个文件'}`)
        return false
      }
      if (this.isImage) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        if (!isImg) {
          this.$message.error('请上传jpg、png格式的图片！')
          return isImg
        }
        const isLtLimitSize = file.size / 1024 / 1024 < this.limitSize
        if (!isLtLimitSize) {
          this.$message.error(`最多只能上传${this.limitSize}MB的图片，请调整您的图片!`)
          return isLtLimitSize
        }
      } else {
        const isLtLimitSize = file.size / 1024 / 1024 < this.limitSize
        if (!isLtLimitSize) {
          this.$message.error(`最多只能上传${this.limitSize}MB的文件，请调整您的文件!`)
          return isLtLimitSize
        }
      }
      return true
    },

    /**
       * 自定义上传策略
       */
    handleCustomRequest (data) {
      this.loading = true
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('relObjField', this.relObjField)
      formData.append('relObjType', this.relObjType)
      dibootApi.upload(this.action, formData).then((res) => {
        if (res.code === 0) {
          if (this.limitCount === 1) {
            this.fileList.length = 0
            this.fileList.push(this.fileFormatter(res.data))
          } else {
            this.fileList.push(this.fileFormatter(res.data))
          }
          console.log(this.fileList)
          this.$emit('change', this.fileList.map(file => file.filePath).join(','))
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
        this.$message.error('网络连接异常，请稍后再试')
      })
    },

    /**
       * 删除文件
       */
    handleRemoveFile (file) {
      console.log('remove', file)
      console.log('remove front', this.fileList)
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList.length = 0
      this.fileList.push(...newFileList)
      console.log('remove end', this.fileList)
      console.log(this.fileList.map(file => file.filePath).join(','))
      this.$emit('change', this.fileList.map(file => file.filePath).join(','))
    },
    /**
       * 预览
       */
    async handlePreview (file) {
      if (this.isImage) {
        this.imageUrl = file.url || file.preview
        this.previewVisible = true
      }
    },
    /**
       * 取消预览
       */
    handleCancel () {
      this.imageUrl = ''
      this.previewVisible = false
    },
    /**
       * 数据转化
       */
    fileFormatter (data) {
      const file = {
        uid: data.uuid, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: data.fileName || ' ', // 文件名
        status: 'done', // 状态有：uploading done error removed
        response: '{"status": "success"}', // 服务端响应内容
        filePath: data.accessUrl
      }
      if (this.isImage) {
        Object.assign(file, {
          url: `${this.prefix}${data.accessUrl}/image`,
          thumbUrl: `${this.prefix}${data.accessUrl}/image`
        })
        // 如果是但图片设置URL
        if (this.limitCount === 1) {
          this.imageUrl = `${this.prefix}${data.accessUrl}/image`
        }
      }
      return file
    }
  },
  props: {
    /**
       * 地址前缀
       */
    prefix: {
      type: String,
      default: ''
    },
    /**
       * 请求地址
       */
    action: {
      type: String,
      required: true
    },
    /**
       * 绑定的业务对象
       */
    relObjType: {
      type: String,
      required: true
    },
    /**
       * 绑定业务对象的属性
       */
    relObjField: {
      type: String,
      required: true
    },
    /**
       * 文件存储位置
       */
    fileList: {
      type: Array,
      required: true
    },
    /**
       * 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card 默认text
       */
    listType: {
      type: String,
      default: 'text'
    },
    /**
       * 上传数量限制，默认 1 （为1的时候则可以切换）
       */
    limitCount: {
      type: Number,
      default: 2
    },
    /**
       * 上传类型限制，不传默认所有文件
       */
    limitType: {
      type: Array,
      default: () => []
    },
    /**
       /**
       * 单个文件上传大小，默认10M
       */
    limitSize: {
      type: Number,
      default: 10
    },
    /**
       * 是否是图片，默认不是图片类型（主要用户上传后构建值）
       */
    isImage: {
      type: Boolean,
      default: false
    },
    /**
       * 上传提示文本
       */
    uploadText: {
      type: String,
      default: '上传'
    },
    value: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>
<style  lang="less" rel="stylesheet/less">
  .custom-upload-preview-modal {
    .ant-modal-close-x {
      width: 30px;
      height: 30px;
      line-height: 30px;
    }
  }
</style>

<template>
  <a-card :bordered="false" title="数据上传" class="diboot-import content">
    <a slot="extra" @click="handleDownloadExample">
      <a-icon type="download"/>
      下载示例文件
    </a>
    <div class="clearfix upload-wrapper">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-upload
            :fileList="fileList"
            :remove="handleRemove"
            :beforeUpload="beforeUpload"
            class="upload-list-inline"
          >
            <a-button>
              <a-icon type="upload"/>
              选择文件
            </a-button>
          </a-upload>
        </a-col>
        <a-col :span="8">
          <a-input placeholder="备注信息" v-model="description"/>
        </a-col>
        <a-col :span="10">
          <a-button
            type="primary"
            @click="handlePreview"
            :disabled="previewDisabled"
          >
            <a-icon type="eye"/>
            预览数据
          </a-button>
          <a-button
            :disabled="uploadDisabled"
            type="default"
            @click="handleUpload"
          >
            <a-icon type="upload"/>
            上传数据
          </a-button>
        </a-col>
      </a-row>
      <a-row v-if="errMsg">
        <a-col :span="24">
          <br>
          <a-alert type="error" banner>
            <div slot="message">
              <b>请检查Excel文件，错误信息: </b><br>
              {{ errMsg }}
            </div>
          </a-alert>
        </a-col>
      </a-row>
    </div>
    <div v-if="data">
      <a-divider/>
      <div class="alert alert-info">
        Excel文件解析成功，共有 <strong>{{ data.totalCount }}</strong> 条数据
        <span v-if="data.errorCount > 0">；<strong>{{ data.totalCount - data.errorCount }}</strong> 条数据</span>
        可上传。
      </div>
      <a-collapse v-if="data.errorCount > 0" default-active-key="1">
        <a-collapse-panel key="1">
          <span slot="header">
            <span style="color: red">{{ `共有 ${data.errorCount} 条数据异常` }}</span>
            （上传数据后可导出错误数据）
          </span>
          <a-tooltip slot="extra" placement="top">
            <template slot="title">
              <span>上传数据后可导出错误</span>
            </template>
            <a-button
              type="link"
              @click.stop="__download(data.errorUrl);__resetData()"
              :disabled="data.errorUrl == null"
            >
              <a-icon type="download"/>
              导出错误数据
            </a-button>
          </a-tooltip>
          <div v-for="error in data.errorMsgs" :key="error">
            {{ error }}
          </div>
          <span v-if="data.errorCount > 20">...</span>
        </a-collapse-panel>
      </a-collapse>
      <a-table
        v-if="data.dataList"
        size="default"
        bordered
        :columns="data.columns"
        :dataSource="data.dataList"
        :pagination="false"
      />
    </div>
  </a-card>
</template>

<script>
import { dibootApi } from '@/utils/request'

export default {
  name: 'ExcelImport',
  data () {
    return {
      /**
       * 上传的文件
       */
      fileList: [],
      /**
       * 文件备注
       */
      description: '',
      /**
       * 是否禁用预览
       */
      previewDisabled: true,
      /**
       * 是否禁用上传
       */
      uploadDisabled: true,
      /**
       * 错误信息提示
       */
      errMsg: '',
      /**
       * 请求返回数据
       */
      data: null
    }
  },
  methods: {
    __download (path) {
      dibootApi.download(path)
        .then(res => {
          if (res.code && res.code === 4006) {
            this.$message.error(res.msg)
            return
          }
          const blob = new Blob([res.data])
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = res.filename
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, res.filename)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    /**
     * 下载样例文件
     */
    handleDownloadExample () {
      this.__download(this.exampleUrl)
    },
    /**
     * 删除文件
     */
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      this.previewDisabled = this.fileList.length === 0
      this.uploadDisabled = this.fileList.length === 0
      this.data = null
    },
    /**
     * 上传之前操作
     */
    beforeUpload (file) {
      this.fileList = [...this.fileList, file].splice(-1)
      this.previewDisabled = this.fileList.length === 0
      this.uploadDisabled = this.fileList.length === 0
      console.log('this.refs==>', this.$refs)
      this.data = null
      return false
    },
    /**
     * 预览
     */
    handlePreview () {
      const { previewUrl } = this
      const fileForm = this.__buildFileForm()
      if (Object.keys(this.fieldsRequired).length > 0) {
        for (const key in this.fieldsRequired) {
          fileForm.append(key, this.fieldsRequired[key])
        }
      }
      // 上传文件请求
      dibootApi.upload(previewUrl, fileForm)
        .then(res => {
          if (res.code === 0) {
            this.data = res.data
            this.data.columns = JSON.parse(JSON.stringify(res.data.tableHead).replaceAll('"key":', '"dataIndex":'))
            this.errMsg = ''
            this.uploadDisabled = false
          } else {
            this.errMsg = res.msg
            this.uploadDisabled = true
          }
        })
    },
    /**
     * 上传
     */
    handleUpload () {
      const { uploadUrl, previewSaveUrl } = this
      this.previewDisabled = true
      this.uploadDisabled = true
      if (this.data && this.data.uuid) {
        const formData = new FormData()
        formData.append('uuid', this.data.uuid)
        formData.append('description', this.description)
        this.__sendUploadRequest(previewSaveUrl, formData)
      } else {
        const fileForm = this.__buildFileForm()
        this.__sendUploadRequest(uploadUrl, fileForm)
      }
    },
    /**
     * 发送上传请求
     */
    __sendUploadRequest (url, formData) {
      if (Object.keys(this.fieldsRequired).length > 0) {
        for (const key in this.fieldsRequired) {
          formData.append(key, this.fieldsRequired[key])
        }
      }
      dibootApi.upload(url, formData)
        .then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '上传数据成功',
              description: res.msg
            })
            this.errMsg = ''
            if (Object.keys(res.data || {}).length === 0) {
              this.__resetData()
            } else {
              this.data = res.data
            }
          } else {
            this.errMsg = res.msg
          }
          this.previewDisabled = false
          this.uploadDisabled = false
        })
        .catch(err => {
          this.previewDisabled = false
          this.uploadDisabled = false
          this.errMsg = '上传异常，请稍后重试！'
          console.log('upload err: ', err)
        })
    },
    /**
     * 构建form表单数据
     * @returns {FormData}
     * @private
     */
    __buildFileForm () {
      const { fileList } = this
      const formData = new FormData()
      formData.append('description', this.description)
      formData.append('file', fileList[0])
      return formData
    },
    /**
     * 重置数据
     * @private
     */
    __resetData () {
      this.$emit('finishedUpload')
      this.fileList = []
      this.description = ''
      this.previewDisabled = true
      this.uploadDisabled = true
      this.data = null
    }
  },
  props: {
    /**
     * 示例文件url
     */
    exampleUrl: {
      type: String,
      required: true
    },
    /**
     * 上传url
     */
    uploadUrl: {
      type: String,
      required: true
    },
    /**
     * 预览url
     */
    previewUrl: {
      type: String,
      required: true
    },
    /**
     * 预览保存URL
     */
    previewSaveUrl: {
      type: String,
      required: true
    },
    /**
     * 提交时候必须的参数
     */
    fieldsRequired: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.diboot-import /deep/ .ant-card-body {
  background-color: #fff !important;
}

.upload-list-inline /deep/ .ant-upload-list-item {
  float: left;
  width: 160px;
  margin-right: 8px;
}

.upload-list-inline /deep/ .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}

.upload-list-inline /deep/ .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
}

.alert {
  border-radius: 3px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  color: #fff;
}

.alert-info {
  background-color: #00c0ef;
}
</style>

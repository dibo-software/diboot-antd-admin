<template>
  <a-drawer
    title="用户数据上传"
    :width="720"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <excel-import
      v-if="visible"
      :example-url="`${baseApi}/downloadExample`"
      :upload-url="`${baseApi}/upload`"
      :preview-url="`${baseApi}/preview`"
      :preview-save-url="`${baseApi}/previewSave`"
      :fields-required="fieldsRequired"
      @finishedUpload="handleFinishedUpload"
    ></excel-import>
    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import ExcelImport from '@/components/diboot/components/excel/import'
export default {
  name: 'IamUserImport',
  data () {
    return {
      baseApi: '/iam/user/excel',
      visible: false
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    /**
     * 刷新数据
     */
    handleFinishedUpload () {
      this.$emit('complete')
      this.visible = false
    },
    close () {
      this.visible = false
    }
  },
  computed: {
    fieldsRequired: function () {
      return { orgId: this.currentNodeId }
    }
  },
  props: {
    currentNodeId: {
      type: String,
      default: '0'
    }
  },
  components: {
    ExcelImport
  }
}
</script>

<style lang="less" scoped>
</style>

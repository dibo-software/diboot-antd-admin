<template>
  <a-drawer
    class="detail-wrapper"
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-descriptions :column="1">
      <a-descriptions-item label="关联对象类">
        {{ model.relObjType }}
      </a-descriptions-item>
      <a-descriptions-item label="关联对象ID">
        {{ model.relObjId }}
      </a-descriptions-item>
      <a-descriptions-item label="关联对象属性">
        {{ model.relObjField }}
      </a-descriptions-item>
      <a-descriptions-item label="文件名">
        {{ model.fileName }}
      </a-descriptions-item>
      <a-descriptions-item label="访问地址">
        <a-button type="link" size="small" @click="downloadFile(model.accessUrl)">
          {{ model.accessUrl }}
        </a-button>
      </a-descriptions-item>
      <a-descriptions-item label="文件类型">
        {{ model.fileType }}
      </a-descriptions-item>
      <a-descriptions-item label="数据量">
        {{ model.dataCount }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ model.description }}
      </a-descriptions-item>
      <a-descriptions-item label="创建人">
        {{ model.createByName }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
      </a-descriptions-item>
    </a-descriptions>
    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'UploadFileDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/uploadFile'
    }
  }
}
</script>

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
      <a-descriptions-item label="模版编码">
        {{ model.code }}
      </a-descriptions-item>
      <a-descriptions-item label="模版标题">
        {{ model.title }}
      </a-descriptions-item>
      <a-descriptions-item label="模版内容">
        {{ model.content }}
      </a-descriptions-item>
      <a-descriptions-item label="创建人">
        {{ model.createByName }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        {{ model.updateTime }}
      </a-descriptions-item>
    </a-descriptions>
    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'MessageTemplateDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/messageTemplate'
    }
  },
  methods: {
    onAfterOpen () {
      // 事件处理代码
    },
    afterOpen () {
      this.onAfterOpen()
    }
  }
}
</script>
<style lang="less" scoped>
</style>

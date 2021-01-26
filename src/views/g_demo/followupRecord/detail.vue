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
      <a-descriptions-item label="所属线索">
        {{ model.salesLeadTitle }}
      </a-descriptions-item>
      <a-descriptions-item label="销售">
        {{ model.salesName }}
      </a-descriptions-item>
      <a-descriptions-item label="跟进简述">
        {{ model.title }}
      </a-descriptions-item>
      <a-descriptions-item label="跟进情况">
        {{ model.content }}
      </a-descriptions-item>
      <a-descriptions-item label="后续动作">
        {{ model.nextStep }}
      </a-descriptions-item>
      <a-descriptions-item label="跟进期限">
        {{ model.nextDeadline }}
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
  name: 'FollowupRecordDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/followupRecord'
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

<template>
  <a-drawer
    class="detail-wrapper"
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-descriptions :column="2">
      <a-descriptions-item label="标题">
        {{ model.title }}
      </a-descriptions-item>
      <a-descriptions-item label="客户">
        {{ model.customerName }}
      </a-descriptions-item>
      <a-descriptions-item label="来源渠道">
        {{ model.srcChannelLabel }}
      </a-descriptions-item>
      <a-descriptions-item label="信息链接">
        {{ model.channelLink }}
      </a-descriptions-item>
      <a-descriptions-item label="联系人">
        {{ model.contactName }}
      </a-descriptions-item>
      <a-descriptions-item label="销售员">
        {{ model.salesName }}
      </a-descriptions-item>
      <a-descriptions-item label="线索状态">
        {{ model.leadStatusLabel }}
      </a-descriptions-item>
      <a-descriptions-item label="截止期限">
        {{ model.deadline }}
      </a-descriptions-item>
      <a-descriptions-item label="提醒信息">
        {{ model.reminder }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        {{ model.updateTime }}
      </a-descriptions-item>
      <a-descriptions-item label="创建人">
        {{ model.creatorName }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ model.remark }}
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
  name: 'SalesLeadDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/salesLead'
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

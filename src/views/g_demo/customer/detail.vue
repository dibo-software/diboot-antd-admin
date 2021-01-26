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
      <a-descriptions-item label="公司名">
        {{ model.name }}
      </a-descriptions-item>
      <a-descriptions-item label="简称">
        {{ model.shortName }}
      </a-descriptions-item>
      <a-descriptions-item label="税号">
        {{ model.taxid }}
      </a-descriptions-item>
      <a-descriptions-item label="电话">
        {{ model.telphone }}
      </a-descriptions-item>
      <a-descriptions-item label="地址">
        {{ model.address }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ model.remark }}
      </a-descriptions-item>
      <a-descriptions-item label="客户状态">
        {{ model.cusStatusLabel }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        {{ model.updateTime }}
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
  name: 'CustomerDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/customer'
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

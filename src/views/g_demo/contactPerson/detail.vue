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
      <a-descriptions-item label="客户">
        {{ model.customerName }}
      </a-descriptions-item>
      <a-descriptions-item label="姓名">
        {{ model.realname }}
      </a-descriptions-item>
      <a-descriptions-item label="头衔">
        {{ model.title }}
      </a-descriptions-item>
      <a-descriptions-item label="性别">
        {{ model.genderLabel }}
      </a-descriptions-item>
      <a-descriptions-item label="电话">
        {{ model.cellphone }}
      </a-descriptions-item>
      <a-descriptions-item label="微信">
        {{ model.wechat }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ model.remark }}
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
  name: 'ContactPersonDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/contactPerson'
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

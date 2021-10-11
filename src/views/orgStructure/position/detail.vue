<template>
  <a-drawer
    title="岗位详情"
    :width="560"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <a-descriptions :column="1">
        <a-descriptions-item label="岗位名称">{{ model.name }}</a-descriptions-item>
        <a-descriptions-item label="岗位编码">{{ model.code }}</a-descriptions-item>
        <a-descriptions-item label="职级名称">{{ model.gradeValue }}</a-descriptions-item>
        <a-descriptions-item label="职级头衔">{{ model.gradeName || '-' }}</a-descriptions-item>
        <a-descriptions-item label="数据权限">{{ model.dataPermissionTypeLabel }}</a-descriptions-item>
        <a-descriptions-item label="虚拟岗位">{{ model.isVirtual ? '是' : '否' }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>

    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'PositionDetail',
  data () {
    return {
      baseApi: '/iam/position'
    }
  },
  mixins: [ detail ]
}
</script>

<style lang="less" scoped>
</style>

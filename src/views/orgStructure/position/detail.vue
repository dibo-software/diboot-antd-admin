<template>
  <a-drawer
    title="岗位详情"
    :width="560"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="1">
        <detail-list-item term="岗位名称">{{ model.name }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="岗位编码">{{ model.code }}</detail-list-item>
      </detail-list>
      <detail-list :col="2">
        <detail-list-item term="职级名称">{{ model.gradeValue }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="职级头衔">{{ model.gradeName || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="数据权限">{{ model.dataPermissionTypeLabel }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="虚拟岗位">{{ model.virtual ? '是' : '否' }}</detail-list-item>
      </detail-list>
    </a-spin>

    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import DetailList from '@/components/tools/DetailList'

const DetailListItem = DetailList.Item
export default {
  name: 'PositionDetail',
  data () {
    return {
      baseApi: '/iam/position'
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [ detail ]
}
</script>

<style lang="less" scoped>
</style>

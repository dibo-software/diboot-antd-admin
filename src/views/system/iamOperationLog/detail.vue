<template>
  <a-drawer
    :title="`操作日志详情`"
    :width="width"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="1">
        <detail-list-item term="用户姓名">{{ model.userRealname }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="用户类型:ID">{{ model.userType }} : {{ model.userId }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="业务对象">{{ model.businessObj }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="操作事项">{{ model.operation }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="请求URL">{{ model.requestMethod }} : {{ model.requestUri }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="IP">{{ model.requestIp }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="请求参数">{{ model.requestParams }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="IP">{{ model.requestIp }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="状态码">
          <span>
            <a-tag v-if="model.statusCode === 0" color="green">成功</a-tag>
            <a-tag v-else color="red">失败</a-tag>
          </span>
        </detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="创建时间">{{ model.createTime }}</detail-list-item>
      </detail-list>
      <detail-list :col="1" v-if="model.statusCode != 0">
        <detail-list-item term="异常信息">{{ model.errorMsg }}</detail-list-item>
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
  name: 'IamOperationLogDetail',
  data () {
    return {
      baseApi: '/iam/operationLog',
      permissionTreeList: []
    }
  },
  methods: {
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

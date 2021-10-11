<template>
  <a-drawer
    :title="`操作日志详情`"
    :width="width"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <a-descriptions :column="1">
        <a-descriptions-item label="用户姓名">{{ model.userRealname }}</a-descriptions-item>
        <a-descriptions-item label="用户类型:ID">{{ model.userType }} : {{ model.userId }}</a-descriptions-item>
        <a-descriptions-item label="业务对象">{{ model.businessObj }}</a-descriptions-item>
        <a-descriptions-item label="操作事项">{{ model.operation }}</a-descriptions-item>
        <a-descriptions-item label="请求URL">{{ model.requestMethod }} : {{ model.requestUri }}</a-descriptions-item>
        <a-descriptions-item label="IP">{{ model.requestIp }}</a-descriptions-item>
        <a-descriptions-item label="请求参数">{{ model.requestParams }}</a-descriptions-item>
        <a-descriptions-item label="状态码">
          <span>
            <a-tag v-if="model.statusCode === 0" color="green">成功</a-tag>
            <a-tag v-else color="red">失败</a-tag>
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ model.createTime }}</a-descriptions-item>
        <a-descriptions-item label="异常信息">{{ model.errorMsg }}</a-descriptions-item>
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
  name: 'IamOperationLogDetail',
  data () {
    return {
      baseApi: '/iam/operationLog',
      permissionTreeList: []
    }
  },
  mixins: [ detail ]
}
</script>

<style lang="less" scoped>
</style>

<template>
  <a-drawer
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <a-descriptions :column="2">
        <a-descriptions-item label="用户名">{{ username }}</a-descriptions-item>
        <a-descriptions-item label="用户编号">{{ model.userNum }}</a-descriptions-item>
        <a-descriptions-item label="姓名">{{ model.realname }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{ model.genderLabel || '-' }}</a-descriptions-item>
        <a-descriptions-item label="角色">
          <template v-if="model.roleList">
            <span v-for="(role, idx) in model.roleList" :key="idx">
              <a-tag color="cyan">{{ role.name }}</a-tag>
            </span>
          </template>
          <template v-else>-</template>
        </a-descriptions-item>
        <a-descriptions-item label="状态">{{ model.statusLabel || '-' }}</a-descriptions-item>
        <a-descriptions-item label="电话">{{ model.mobilePhone || '-' }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ model.email || '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>

    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import { dibootApi } from '@/utils/request'
export default {
  name: 'IamUserDetail',
  data () {
    return {
      baseApi: '/iam/user',
      username: ''
    }
  },
  methods: {
    async afterOpen (id) {
      // 获取account的username信息到表单中
      const res = await dibootApi.get(`${this.baseApi}/getUsername/${id}`)
      if (res.code === 0) {
        this.username = res.data
      }
    },
    afterClose () {
      this.username = ''
    }
  },
  mixins: [ detail ]
}
</script>

<style lang="less" scoped>
</style>

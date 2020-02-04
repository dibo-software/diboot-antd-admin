<template>
  <a-drawer
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="2">
        <detail-list-item term="用户名">{{ username }}</detail-list-item>
        <detail-list-item term="用户编号">{{ model.userNum }}</detail-list-item>
      </detail-list>
      <detail-list :col="2">
        <detail-list-item term="姓名">{{ model.realname }}</detail-list-item>
        <detail-list-item term="性别">{{ model.genderLabel || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="2">
        <detail-list-item term="角色">
          <template v-if="model.roleList">
            <span v-for="(role, idx) in model.roleList" :key="idx">
              <a-tag color="cyan">{{ role.name }}</a-tag>
            </span>
          </template>
          <template v-else>-</template>
        </detail-list-item>
        <detail-list-item term="状态">{{ model.statusLabel || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="2">
        <detail-list-item term="电话">{{ model.mobilePhone || '-' }}</detail-list-item>
        <detail-list-item term="邮箱">{{ model.email || '-' }}</detail-list-item>
      </detail-list>
    </a-spin>

    <div class="footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import DetailList from '@/components/tools/DetailList'
import { dibootApi } from '@/utils/request'
const DetailListItem = DetailList.Item
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
  .footer{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right
  }
</style>

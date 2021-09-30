<template>
  <a-drawer
    title="权限纠错"
    width="720"
    :visible="visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <div :key="refresh" v-if="diffDataIdList.length > 0">
        <div class="color-tip">仅检索已配置的无效权限接口。<span class="red"></span>表示权限接口不存在，需要调整；<span class="blue"></span>表示权限接口存在</div>
        <div class="operate">
          <a-button type="danger" size="small" @click="handleBatchDelete">全部删除</a-button>
        </div>
        <div v-for="(item, index) in diffDataList" :key="`${_uid}_${index}`">
          <h4>{{ item.parentDisplayName }}</h4>
          <correct-permission-item :permission-item="item" :api-tree-list="apiTreeList" @refresh="handleRefresh"></correct-permission-item>
        </div>
      </div>
      <div class="empty" v-else>
        已配置的权限接口均有效，无需调整。
      </div>
    </a-spin>
  </a-drawer>
</template>

<script>
import { dibootApi } from '@/utils/request'
import correctPermissionItem from './correctPermissionItem'
import { apiListFormatter } from '@/utils/treeDataUtil'
export default {
  name: 'CorrectPermissionIndex',
  data () {
    return {
      visible: false,
      spinning: false,
      baseUrl: '/iam/resourcePermission',
      diffDataList: [],
      diffDataIdList: [],
      apiTreeList: [],
      refresh: true
    }
  },
  components: {
    correctPermissionItem
  },
  methods: {
    open () {
      this.visible = true
      this.getDiffPermissions()
      this.getApiList()
    },
    handleRefresh () {
      this.getDiffPermissions()
    },
    /**
       * 获取有问题的权限
       */
    async getDiffPermissions () {
      this.spinning = true
      try {
        const res = await dibootApi.get(`${this.baseUrl}/apiDiff`)
        if (res.code === 0) {
          this.diffDataList = res.data.diffDataList || []
          this.diffDataIdList = res.data.diffDataIdList || []
          this.refresh = !this.refresh
        } else {
          this.$notification.error({
            message: '获取权限失败',
            description: res.msg
          })
        }
      } finally {
        this.spinning = false
      }
    },
    async getApiList () {
      const resApiList = await dibootApi.get(`${this.baseUrl}/apiList`)
      if (resApiList.code === 0) {
        this.apiTreeList = apiListFormatter(resApiList.data)
      } else {
        this.$message.error(resApiList.msg)
      }
    },
    async handleBatchDelete () {
      const _this = this
      _this.$confirm({
        title: '删除',
        content: `删除将删除所有错误权限及其子权限；\n您确定删除吗？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          dibootApi.post(`${_this.baseUrl}/batchDeleteInvalidPermissionList`, _this.diffDataIdList).then(async (res) => {
            if (res.code === 0) {
              _this.$notification.success({
                message: '删除成功',
                description: '已批量删除权限'
              })
              _this.close()
              _this.$emit('complete')
            } else {
              _this.$notification.error({
                message: '删除失败',
                description: res.msg
              })
            }
          }).catch(err => {
            _this.$notification.error({
              message: '删除失败',
              description: err.msg
            })
          })
        }
      })
    },
    close () {
      this.visible = false
      this.diffDataList = []
      this.diffDataIdList = []
      this.apiTreeList = []
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
.color-tip {
  line-height: 20px;
  background-color: rgba(21, 133, 255, 0.2);
  border-radius: 5px;
  padding: 10px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin: 0 10px;
  }
  .red {
    background-color: red;
  }
  .blue {
    background-color: blue;
  }
}
.operate {
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
}
  .empty {
    text-align: center;
    font-size: 20px;
  }
</style>

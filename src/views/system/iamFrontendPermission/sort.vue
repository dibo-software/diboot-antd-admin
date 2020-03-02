<template>
  <a-drawer
    title="权限排序"
    width="720"
    :visible="visible"
    @close="close"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="1">
        <a-tree
          v-if="permissionTreeList.length > 0"
          showIcon
          checkStrictly
          draggable
          @drop="onDrop"
          :defaultExpandAll="true"
          :treeData="permissionTreeList"
        >
          <a-icon slot="menu" type="bars" />
          <a-icon slot="permission" type="thunderbolt" />
        </a-tree>
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
import { list2childrenMap, permissionTreeListFormatter, treeList2list } from '@/utils/treeDataUtil'
import _ from 'lodash'
const DetailListItem = DetailList.Item
export default {
  name: 'IamFrontendPermissionSort',
  data () {
    return {
      baseApi: '/iam/frontendPermission',
      permissionTreeList: []
    }
  },
  methods: {
    onDrop (info) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.permissionTreeList]
      // Find dragObject
      let dragObj
      if (!info.dropToGap ||
        ((info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1)) {
        this.$message.warning('如果需要更改层级关系，请在更新页面进行更改！')
        return false
      } else {
        // 检查拖拽的地方是否是同一层级
        const dragItem = this.permissionList.find(item => {
          return item.value === dragKey
        })
        const dropItem = this.permissionList.find(item => {
          return item.value === dropKey
        })
        if (dragItem === undefined || dropItem === undefined) {
          this.$message.warning('如果需要更改层级关系，请在更新页面进行更改！')
          return false
        } else if (dragItem.parentId !== dropItem.parentId) {
          this.$message.warning('如果需要更改层级关系，请在更新页面进行更改！')
          return false
        }

        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1)
          dragObj = item
        })
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
        // 到后端同步数据
        this.submitSortList(ar)
      }
      this.permissionTreeList = data
    },
    submitSortList (list) {
      dibootApi.post('/iam/frontendPermission/sortList', list).then(res => {
        if (res.code === 0) {
          this.$message.success('排序成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.$message.error('排序失败')
      })
    },
    async open () {
      this.visible = true
      // 获取系统中所有的permissionList
      const res = await dibootApi.get(`/iam/frontendPermission/list`)
      if (res.code === 0) {
        if (!res.data || res.data.length === 0){
          this.$message.error('请先添加菜单及权限')
        } else {
          this.permissionTreeList = permissionTreeListFormatter(res.data, 'id', 'displayName')
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    afterClose () {
      this.permissionTreeList = []
      this.$emit('refreshList')
    }
  },
  computed: {
    permissionList: function () {
      if (!this.permissionTreeList || this.permissionTreeList.length === 0) {
        return []
      }
      return treeList2list(_.cloneDeep(this.permissionTreeList))
    },
    childrenMap: function () {
      return list2childrenMap(this.permissionList)
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [ detail ]
}
</script>

<style scoped>
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

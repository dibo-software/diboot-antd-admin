<template>
  <div class="content">
    <div v-permission="['create', 'sort']" class="table-operator" v-if="canChange">
      <a-button v-action:create type="primary" icon="plus" @click="$refs.orgForm.open()">新增</a-button>
      <a-button v-action:sort type="default" icon="drag" @click="$refs.orgTreeSort.open()">排序</a-button>
      <slot name="extra"></slot>
    </div>
    <tree
      ref="tree"
      nodeName="shortName"
      :tree-api="treeApi"
      :showCancel="showCancel"
      @changeCurrentNode="onChangeCurrentNode"
    >
      <template slot="header" slot-scope="node">
        <a
          v-if="canChange"
          v-action:update
          @click="$refs.orgForm.open(node.currentNodeId)"
          title="编辑"
          href="javascript:;"
          style="margin-left: 10px;">
          <a-icon type="edit" />
        </a>
        <a
          v-if="canChange"
          v-action:detail
          @click="$refs.orgDetail.open(node.currentNodeId)"
          title="详情"
          href="javascript:;"
          style="margin-left: 10px;">
          <a-icon type="eye" />
        </a>
        <a
          v-if="canChange"
          v-action:delete
          @click="remove(node.currentNodeId)"
          title="删除"
          href="javascript:;"
          style="margin-left: 10px;">
          <a-icon type="delete" />
        </a>
      </template>
    </tree>
    <org-form :current-node-id="`${currentNode.value}`" ref="orgForm" @complete="$refs.tree.loadTree()" @changeKey="$emit('changeCurrentNode', currentNode.value)"></org-form>
    <org-detail ref="orgDetail"></org-detail>
    <org-tree-sort ref="orgTreeSort" @complete="$refs.tree.loadTree()"></org-tree-sort>
  </div>
</template>

<script>
import tree from '@/components/diboot/components/tree/index'
import orgForm from './form'
import orgDetail from './detail'
import orgTreeSort from './treeSort'
import { dibootApi } from '@/utils/request'

export default {
  name: 'OrgTree',
  components: {
    tree,
    orgForm,
    orgDetail,
    orgTreeSort
  },
  data () {
    return {
      currentNode: { value: '0' },
      baseApi: '/iam/org',
      treeApi: '/iam/org/tree'
    }
  },
  methods: {
    loadTree () {
      this.$refs.tree.loadTree()
    },
    onChangeCurrentNode (currentNode) {
      // 事件处理代码
      this.currentNode = currentNode
      this.$emit('changeCurrentNode', currentNode)
    },
    remove (id) {
      return new Promise((resolve, reject) => {
        var _this = this
        _this.$confirm({
          title: '删除',
          content: `确定删除该数据吗？`,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            dibootApi.delete(`${_this.baseApi}/${id}`).then(async (res) => {
              if (res.code === 0) {
                _this.$message.success(h => {
                  return h('span', [
                    '当前数据删除成功',
                    h('a-button', {
                      props: {
                        type: 'link'
                      },
                      on: {
                        click: event => {
                          _this.canceledDelete(id)
                        }
                      }
                    }, '撤回')
                  ])
                })
                _this.$refs.tree.cancelSelect()
                _this.$refs.tree.loadTree()
                resolve(res.data)
              } else {
                _this.$notification.error({
                  message: '删除失败',
                  description: res.msg,
                  duration: 3
                })
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(res.msg)
              }
            }).catch(err => {
              _this.$notification.error({
                message: '删除失败',
                description: err.msg,
                duration: 3
              })
              reject(err.msg)
            })
          }
        })
      })
    },
    async canceledDelete (id) {
      const res = await dibootApi.delete(`${this.baseApi}/canceled/${id}`)
      if (res.code === 0) {
        this.$message.destroy()
        this.$message.success('撤回成功')
        this.$refs.tree.cancelSelect()
        this.$refs.tree.loadTree()
      } else {
        this.$message.error('撤回失败')
      }
    }
  },
  props: {
    showCancel: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    canChange: {
      type: Boolean,
      default: false
    }
  }

}
</script>
<style lang="less" scoped>
</style>

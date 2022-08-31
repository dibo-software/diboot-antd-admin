<template>
  <div class="diboot-tree">
    <a-row style="margin-bottom: 10px;" v-if="currentNode.title">
      <a-col :span="24">
        <a-alert type="info" showIcon>
          <template slot="message">
            {{ label }}：{{ currentNode.title }}
            <a
              v-if="showCancel"
              @click="cancelSelect"
              href="javascript:;"
              style="margin-left: 10px;">取消选中</a>
            <slot name="header" :currentNodeId="currentNodeId"></slot>
          </template>
        </a-alert>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-input-search style="margin-bottom: 8px" placeholder="请输入搜索内容" @change="onSearchChange" allowClear/>
      </a-col>
    </a-row>
    <a-tree
      v-if="treeList.length > 0"
      @select="onTreeSelect"
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :selectedKeys="selectedKeys"
      :treeData="treeList">
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request'
import { treeList2list } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  name: 'TreeIndex',
  data () {
    return {
      treeList: [],
      currentNodeId: 0,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      selectedKeys: []
    }
  },
  methods: {
    loadTree () {
      dibootApi.get(this.treeApi).then(res => {
        if (res.code === 0) {
          this.treeList = this.treeListFormatter(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onTreeSelect (selectedKeys) {
      if (selectedKeys && selectedKeys.length > 0) {
        // 设置当前节点
        this.currentNodeId = selectedKeys[0]
        this.selectedKeys = [selectedKeys[0]]
        this.$emit('changeCurrentNode', this.currentNode)
      }
    },
    cancelSelect () {
      this.currentNodeId = 0
      this.selectedKeys = []
      this.$emit('changeCurrentNode', this.currentNode)
    },

    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    /**
       * 搜索
       */
    onSearchChange (e) {
      const value = e.target.value
      const expandedKeys = this.getExpandedKeys(this.treeList, value)
      if (expandedKeys.length > 0) {
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true
        })
      }
    },
    getExpandedKeys (list, value) {
      const allExpandedKeys = []
      const expandedKeys = list
        .map(item => {
          // 对children进行查找
          if (item.children && item.children.length > 0) {
            const childrenExpandedKeys = this.getExpandedKeys(item.children, value)
            if (childrenExpandedKeys.length > 0) {
              allExpandedKeys.push(...childrenExpandedKeys)
            }
          }
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeList)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      if (expandedKeys.length > 0) {
        allExpandedKeys.push(...expandedKeys)
      }

      return allExpandedKeys
    },
    getParentKey (key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    // 智能展开树状结构，默认只智能展开第一层（有maxCount个以上的节点，第一层收起，maxCount及maxCount个以下的节点，第一层展开）
    getInitSmartExpandedKeys (list, maxCount) {
      if (list.length > maxCount) {
        return []
      }
      return list.map(item => { return item.key })
    },
    getInitExpandedKeys (list) {
      const keys = []
      list.forEach(item => {
        if (item.children && item.children.length > 0) {
          keys.push(item.key)
          keys.push(...this.getInitExpandedKeys(item.children))
        }
      })
      return keys
    },
    refresh () {
      this.loadTree()
    },

    /***
       * list格式化
       * @param originTreeList
       * @returns {undefined}
       */
    treeListFormatter (originTreeList) {
      if (!originTreeList || originTreeList.length === 0) {
        return undefined
      }
      const formatterItemList = []
      originTreeList.forEach(item => {
        const formatterItem = {}
        formatterItem.key = item[this.nodeKey]
        formatterItem.value = item[this.nodeKey]
        formatterItem.title = item[this.nodeName]
        formatterItem.scopedSlots = { title: 'title' }
        const children = this.treeListFormatter(item.children)
        if (children != null) {
          formatterItem.children = children
        }
        formatterItemList.push(formatterItem)
      })
      // 如果需要默认展开所有，则初始化展开数据
      // this.expandedKeys = this.getInitSmartExpandedKeys(formatterItemList, 50)
      this.expandedKeys = this.getInitExpandedKeys(formatterItemList)
      return formatterItemList
    }
  },
  computed: {
    dataList: function () {
      if (this.treeList == null || this.treeList.length === 0) {
        return []
      }
      return treeList2list(_.cloneDeep(this.treeList))
    },
    currentNode: function () {
      if (this.dataList.length === 0 ||
            this.currentNodeId === 0 || this.currentNodeId === '0' ||
            this.currentNodeId == null || this.currentNodeId === '') {
        return {}
      }
      return this.dataList.find(item => {
        return item.value === this.currentNodeId || `${item.value}` === this.currentNodeId
      })
    }
  },
  created () {
    this.loadTree()
  },
  props: {
    treeApi: {
      type: String,
      required: true
    },
    /**
       * tree的头部标题
       */
    label: {
      type: String,
      default: '当前节点'
    },
    /**
       * tree 的key值
       */
    nodeKey: {
      type: String,
      default: 'id'
    },
    /**
       * tree的显示值
       */
    nodeName: {
      type: String,
      default: 'shortName'
    },
    /**
       * 是否可以取消选中
       */
    showCancel: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>

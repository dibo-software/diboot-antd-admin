<template>
  <div class="errorApi">
    <div class="error-container">
      <span class="error-api">{{ api }}</span>
      <a-icon
        class="edit"
        v-if="!isOperate"
        type="edit"
        theme="twoTone"
        two-tone-color="#1585ff"
        title="选取替换"
        @click="() => isOperate = !isOperate"/>
      <span v-if="isOperate" class="edit finished" @click="handleUpdate">完成</span>
      <span v-if="isOperate" class="edit" @click="handleCancel">取消</span>
    </div>
    <a-tree-select
      class="replace-select"
      v-if="apiTreeList.length > 0 && isOperate"
      v-model="replaceApi"
      placeholder="请选取新的接口替换"
      :dropdownStyle="{ maxHeight: '400px', width: '200px'}"
      :treeData="apiTreeList"
      treeNodeFilterProp="title"
      showSearch
      treeDefaultExpandAll
      allowClear
    >
    </a-tree-select>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request'
import _ from 'lodash'

export default {
  name: 'ErrorApi',
  data () {
    return {
      isOperate: false,
      baseUrl: '/iam/resourcePermission',
      replaceApi: null,
      currentApiSetList: this.apiSetList
    }
  },
  methods: {
    async handleUpdate () {
      if (!this.replaceApi) {
        this.$message.warn('请选择接口后更新！')
        return
      }
      try {
        const tempApiSet = _.cloneDeep(this.currentApiSetList)
        const index = tempApiSet.indexOf(this.api)
        console.log(index)
        console.log(tempApiSet)
        console.log(tempApiSet)
        if (index > -1) {
          tempApiSet.splice(index, 1, this.replaceApi)
          const res = await dibootApi.post(`${this.baseUrl}/modifyPermission`, {
            id: this.resourcePermissionId,
            apiSetList: tempApiSet
          })
          if (res.code === 0) {
            this.$message.success('更新权限成功！')
            this.replaceApi = null
            this.isOperate = false
            this.$emit('refresh')
          } else {
            this.$message.error('更新权限失败！')
          }
        } else {
          this.$message.error('当前Api不存在！')
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleCancel () {
      this.isOperate = !this.isOperate
      this.replaceApi = null
    }
  },
  props: {
    api: {
      type: String,
      required: true
    },
    apiSetList: {
      type: Array,
      required: true
    },
    resourcePermissionId: {
      type: [String, Number],
      required: true
    },
    apiTreeList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
  .error-api {
    color: red;
  }
  .edit {
    cursor: pointer;
    margin: 0 10px;
  }
  .finished {
    color: #1890ff;
  }
  .replace-select {
    width: 100%;
  }
</style>

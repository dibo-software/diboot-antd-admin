<template>
  <a-descriptions class="permission-group" :title="`${permissionGroup.name}（${permissionGroup.code}）`" bordered :column="1" size="small">
    <a-descriptions-item :key="`group-item-${_uid}_${i}`" v-for="(apiPermission, i) in permissionGroup.apiPermissionList">
      <div :id="apiPermission.code" class="permission-group-code permission-group-text-overflow" slot="label">
        <a-checkbox :checked="permissionCodeList.includes(apiPermission.code)" @change="(e) => changeCheck(apiPermission.code)">
          <a-tooltip>
            <template slot="title">
              {{ apiPermission.code }} （{{ apiPermission.label }}）
            </template>
            {{ apiPermission.code }}
          </a-tooltip>
        </a-checkbox>
      </div>
      <template v-if="apiPermission.apiUriList && apiPermission.apiUriList.length > 0">
        <div @click.stop="changeCheck(apiPermission.code)">
          <div class="permission-group-api permission-group-text-overflow" :key="`${apiPermission.code}_api-uri-${index}`" v-for="(apiUri, index) in apiPermission.apiUriList">
            <a-tooltip>
              <template slot="title">
                {{ apiUri.method }}:{{ apiUri.uri }}（{{ apiUri.label }}）
              </template>
              {{ apiUri.method }}:{{ apiUri.uri }}（{{ apiUri.label }}）
            </a-tooltip>
          </div>
        </div>
      </template>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
export default {
  name: 'PermissionGroup',
  methods: {
    changeCheck (code) {
      this.$emit('changePermissionCode',
        this.permissionCodeList.includes(code) ? 'remove' : 'add',
        code
      )
    }
  },
  props: {
    permissionGroup: {
      type: Object,
      required: true
    },
    permissionCodeList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
/deep/.ant-descriptions-item {
  cursor: pointer;
}
.permission-group {
  /deep/.ant-descriptions-title {
    margin: 5px 0;
  }
  /deep/.ant-descriptions-view > table {
    table-layout: fixed;
    .ant-descriptions-item-content {
      padding: 0;
    }
  }
  &-text-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    .ant-checkbox-wrapper {
      width: 100%;
    }
  }
  .light-high {
    background-color: #e2f6fe;
    border-radius: 5px;
    transition: 2s;
  }
  &-api {
    border-bottom: 1px solid #e8e8e8;
    padding: 8px 16px;
    &:last-child {
      border-bottom: 0;
    }
  }
}

</style>

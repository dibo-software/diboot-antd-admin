<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="visible"
    @close="close"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="2">
        <detail-list-item term="上级部门">{{ parentName }}</detail-list-item>
        <detail-list-item term="编码">{{ model.code }}</detail-list-item>
      </detail-list>
      <detail-list :col="2">
        <detail-list-item term="简称">{{ model.shortName }}</detail-list-item>
        <detail-list-item term="全称">{{ model.name }}</detail-list-item>
      </detail-list>
      <detail-list :col="1" v-if="model.type && more.orgTypeKvMap && more.orgTypeKvMap[model.type]">
        <detail-list-item term="类型">
          <a-tag :color="model.type==='COMP' ? 'blue' : 'cyan'" >{{ more.orgTypeKvMap[model.type]['k'] }}</a-tag>
        </detail-list-item>
      </detail-list>
    </a-spin>

    <div class="footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import { dibootApi } from '@/utils/request'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  name: 'OrgTreeDetail',
  data () {
    return {
      name: 'iam/org',
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [ detail ],
  methods: {
    close () {
      this.visible = false
      this.model = {}
    }
  },
  computed: {
    parentName: function () {
      if (this.model === undefined || !this.model.parentShortName) {
        return '-无-'
      }
      return this.model.parentShortName
    }
  },
  props: {
    more: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
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

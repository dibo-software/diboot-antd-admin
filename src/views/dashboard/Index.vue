<template>
  <div class="dashboard">
    <h2>欢迎您，{{ nickname() }}！</h2>
    <a-list :data-source="attentionItems" bordered>
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta
        >
          <a slot="title" :href="item.titleUrl" target="_blank" style="color: #1585ff">{{ index + 1 + '.' + item.title }}</a>
          <template v-if="item.description">
            <span slot="description">{{ item.description }}</span>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data () {
    return {
      attentionItems: [
        {
          title: '权限配置上线注意事项',
          titleUrl: 'https://www.diboot.com/guide/diboot-antd-admin/%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6.html#%E8%8F%9C%E5%8D%95%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86',
          description: '描述内容'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    ...mapGetters(['nickname'])
  }
}
</script>

<style scoped>
  .dashboard {
    min-height: 360px;
    background: #fff;
  }
  .dashboard h2 {
    line-height: 48px;
    padding-left: 24px;
  }
</style>

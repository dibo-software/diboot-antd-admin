<template>
  <div class="dashboard">
    <h2>欢迎您，{{ nickname() }}！</h2>
    <div>
      <a-card title="帮助向导" :bordered="false">
        <a-list :data-source="attentionItems" bordered>
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta
            >
              <a slot="title" :href="item.titleUrl" target="_blank" style="color: #1585ff">{{ index + 1 + '. ' + item.title }}</a>
              <template v-if="item.description">
                <span slot="description">{{ item.description }}</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
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
          title: '新手指南',
          titleUrl: 'https://www.diboot.com/guide/beginner/bootstrap.html',
          description: 'diboot新用户，先通读官网文档'
        },
        {
          title: '配置角色&资源权限',
          titleUrl: 'https://www.diboot.com/guide/diboot-antd-admin/permission.html',
          description: '参考链接官网文档，配置资源权限'
        },
        {
          title: '后端打包时剔除devtools',
          titleUrl: 'https://www.diboot.com/guide/diboot-devtools/introduce.html',
          description: 'diboot-devtools 是用于开发过程的助手工具，打包发布前须剔除devtools jar，具体请参考链接官网文档。'
        },
        {
          title: '常用问题FAQ',
          titleUrl: 'https://www.diboot.com/guide/spring-boot/faq.html',
          description:
            '使用中有疑问可参考FAQ 或 通过github/gitee查找技术交流群沟通'
        },
        {
          title: 'diboot企业版支持',
          titleUrl: 'https://www.diboot.com/ent/service.html',
          description:
            'devtools高级功能、diboot-cloud微服务版本、diboot-workflow工作流、diboot-mobile移动端等可查看授权服务相关内容'
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

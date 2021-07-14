// based on flat-tree 2.1.3
'use strict'

module.exports = require('./src')

/*
* 重写 el-tree 为 flat-tree （平冠树）【未全局注册】
* ./src/Tree  name 改为了 FlatTree
* 修改了 ./vc-tree/src/TreeNode.js
* 其中加入了 bevelment 函数，
* 该函数是对树形结构的最后一级分组样式进行调整
*/

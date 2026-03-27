<template>
  <!-- 协议展示主容器 -->
  <div class="agreement-container"></div>
</template>

<script setup></script>

<style scoped lang="scss">
.agreement-container {
  max-width: 750px;
  margin: 0 auto;
  padding: 20px 15px;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  background-color: #fff;
  min-height: 100vh;
  background-image: url("https://mvpme82.cloud/data/eca3fef5-2376-4c28-9fef-213427c66b62_1774608694689.jpg");
  background-size: cover;
  background-position: center;
}

/* 协议标题 */
.agreement-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #222;
}

/* 前言部分 */
.agreement-preamble {
  margin-bottom: 25px;
  text-indent: 2em;
}

/* 章节容器 */
.agreement-section {
  margin-bottom: 25px;
}

/* 一级章节标题（一、声明） */
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #222;
}

/* 二级小节标题 */
.subsection-title {
  margin-bottom: 10px;
  font-weight: 500;
}

/* 小节内容 */
.subsection-content {
  margin-bottom: 10px;
}

/* 三级列表（1、2、3...） */
.list-level3 {
  margin-left: 2em;
  margin-bottom: 15px;
}

.list-level3 li {
  margin-bottom: 8px;
  list-style: none; /* 去掉默认列表样式，保持原文格式 */
}

/* 最后一个章节取消底部外边距 */
.agreement-section:last-child {
  margin-bottom: 0;
}

.agreement-footer {
  margin-top: 30px;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
  text-align: right;
  color: #666;
  font-size: 13px;
}
</style>

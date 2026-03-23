<template>
<view class="page-container">
	<view class="line-wrapper">
		<uni-search-bar placeholder="搜索我的订单" @confirm="search" :focus="true" v-model="searchValue" @blur="blur" @focus="focus" @input="input" @cancel="cancel" @clear="clear" class="search-bar"></uni-search-bar>
	</view>
	<scroll-view scroll-x class="tab-scroll" show-scrollbar="false">
	    <view class="tab-bar">
	        <view 
	          v-for="(item, index) in tabList" 
	          :key="index"
	          class="tab-item"
	          :class="{ active: state.activeTab === index }"
	          @click="switchTab(index)"
	        >
	          {{ item.name }}
	        </view>
	    </view>
	</scroll-view>
	<scroll-view class="scroll-container" scroll-y scroll-with-animation>
	<view class="card-list" style="margin-top: 10px;">
	    <view class="service-card">
			<view class="column-wrapper" style="width: 70%;">
	            <!-- 卡片标题 -->
	            <view class="card-title">崔各庄马泉营项目崔各庄乡马泉营车辆段南侧</view>
	            <!-- 卡片描述 -->
	            <view class="card-desc">申报时间：2025年11月14日 15:25:37</view>
				<view class="card-desc">服务单编号：ZQT-202512164328</view>
			    <!-- 服务价格 -->
	            <view class="price-wrap" >
	                <text class="price-unit">服务价格：¥</text>
	                <text class="price-num">6,000</text>
	                <text class="price-unit">元</text>
	            </view>
			</view>
			
			<view class="column-wrapper-center" style="width: 25%;">
			    <view class="status-tag" style="width: 100%;background-color: #27ae60;">已提交待审核</view>
				<button class="btn-operator" @click="handleWithdraw">撤回申请</button>
			</view>
		</view>
		<view class="service-card">
			<view class="column-wrapper" style="width: 70%;">
		        <!-- 卡片标题 -->
		        <view class="card-title">望京国际人才公寓项目</view>
		        <!-- 卡片描述 -->
		        <view class="card-desc">申报时间：2026年1月4日 12:11:24</view>
				<view class="card-desc">服务单编号：ZQT-202510241211</view>
			    <!-- 服务价格 -->
		        <view class="price-wrap" >
		            <text class="price-unit">服务价格：¥</text>
		            <text class="price-num">3,000</text>
		            <text class="price-unit">元</text>
		        </view>
			</view>
			
			<view class="column-wrapper-center" style="width: 25%;">
			    <view class="status-tag" style="width: 100%;background-color: #E53935;">已退回</view>
				<button class="btn-operator" @click="handleWithdraw">修改申报</button>
			</view>
		</view>
		<view class="service-card">
			<view class="column-wrapper" style="width: 70%;">
		        <!-- 卡片标题 -->
		        <view class="card-title">北辰商管长租公寓项目</view>
		        <!-- 卡片描述 -->
		        <view class="card-desc">申报时间：2026年1月2日 10:33:44</view>
				<view class="card-desc">服务单编号：ZQT-2025092837</view>
			    <!-- 服务价格 -->
		        <view class="price-wrap" >
		            <text class="price-unit">服务价格：¥</text>
		            <text class="price-num">5,000</text>
		            <text class="price-unit">元</text>
		        </view>
			</view>
			
			<view class="column-wrapper-center" style="width: 25%;">
			    <view class="status-tag" style="width: 100%;background-color: #27ae60;">待专业评审</view>
				<button class="btn-operator" @click="handleWithdraw">撤回申请</button>
			</view>
		</view>
		<view class="service-card">
			<view class="column-wrapper" style="width: 70%;">
		        <!-- 卡片标题 -->
		        <view class="card-title">马泉营人才房单身公寓</view>
		        <!-- 卡片描述 -->
		        <view class="card-desc">申报时间：2025年12月12日 9:23:16</view>
				<view class="card-desc">服务单编号：ZQT-2025054837</view>
			    <!-- 服务价格 -->
		        <view class="price-wrap" >
		            <text class="price-unit">服务价格：¥</text>
		            <text class="price-num">4,000</text>
		            <text class="price-unit">元</text>
		        </view>
			</view>
			
			<view class="column-wrapper-center" style="width: 25%;">
			    <view class="status-tag" style="width: 100%;background-color: #27ae60;">待合同签署</view>
				<button class="btn-operator" @click="handleWithdraw">下载合同</button>
			</view>
		</view>
		<view class="service-card">
			<view class="column-wrapper" style="width: 70%;">
		        <!-- 卡片标题 -->
		        <view class="card-title">商标注册与维权</view>
		        <!-- 卡片描述 -->
		        <view class="card-desc">申报时间：2025年10月3日 15:34:56</view>
				<view class="card-desc">服务单编号：ZQT-2025100328</view>
			    <!-- 服务价格 -->
		        <view class="price-wrap" >
		            <text class="price-unit">服务价格：¥</text>
		            <text class="price-num">9,000</text>
		            <text class="price-unit">元</text>
		        </view>
			</view>
			
			<view class="column-wrapper-center" style="width: 25%;">
			    <view class="status-tag" style="width: 100%;background-color: #27ae60;">服务实施中</view>
				<button class="btn-operator" @click="handleWithdraw">材料上传</button>
			</view>
		</view>
		<view class="service-card">
			<view class="column-wrapper" style="width: 70%;">
		        <!-- 卡片标题 -->
		        <view class="card-title">社保公积金合规优化</view>
		        <!-- 卡片描述 -->
		        <view class="card-desc">申报时间：2025年11月22日 15:34:45</view>
				<view class="card-desc">服务单编号：ZQT-2025293949</view>
			    <!-- 服务价格 -->
		        <view class="price-wrap" >
		            <text class="price-unit">服务价格：¥</text>
		            <text class="price-num">29,000</text>
		            <text class="price-unit">元</text>
		        </view>
			</view>
			
			<view class="column-wrapper-center" style="width: 25%;">
			    <view class="status-tag" style="width: 100%;background-color: #F59A23;">成果验收</view>
				<button class="btn-operator" @click="handleWithdraw">确认验收</button>
			</view>
		</view>
		<view class="service-card">
			<view class="column-wrapper" style="width: 70%;">
		        <!-- 卡片标题 -->
		        <view class="card-title">企业年报申报与公示</view>
		        <!-- 卡片描述 -->
		        <view class="card-desc">申报时间：2025年5月13日 15:33:45</view>
				<view class="card-desc">服务单编号：ZQT-2025837465</view>
			    <!-- 服务价格 -->
		        <view class="price-wrap" >
		            <text class="price-unit">服务价格：¥</text>
		            <text class="price-num">18,000</text>
		            <text class="price-unit">元</text>
		        </view>
			</view>
			
			<view class="column-wrapper-center" style="width: 25%;">
			    <view class="status-tag" style="width: 100%;background-color: #1677FF;">待评价</view>
				<button class="btn-operator" @click="handleWithdraw">去评价</button>
			</view>
		</view>
	</view>
	</scroll-view>
</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
const state = reactive({
	searchValue: "",
	loading: false,
	serviceList: [],
	activeTab: 0,
});
// 标签栏数据
const tabList = ref([
  { name: '全部' },
  { name: '审核中' },
  { name: '待评审' },
  { name: '待签约' },
  { name: '实施中' },
  { name: '待验收' },
  { name: '已完成' },
]);
const handleWithdraw = () => {};
</script>

<style lang="scss" scoped>
.page-container {
	height: 100vh; /* 小程序/uni-app 优先用 100vh，H5 可用 100% */
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column; /* 垂直布局：顶部标签栏 + 滚动区域 */
	box-sizing: border-box; /* 防止 padding 撑开高度 */
	overflow: hidden; /* 关键：禁止根容器滚动！ */
}
.line-wrapper {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	/* 移除固定margin，改用padding避免超出容器 */
	padding: 16px;
	/* 防止内容溢出容器 */
	box-sizing: border-box;
}
.column-wrapper {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}
.column-wrapper-center {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

// 搜索框样式
.search-bar {
	// 填满父容器宽度
	width: 100%;
	// 添加圆角（可根据需要调整数值）
	--search-bar-radius: 24px;
	// 可选：调整搜索框内部padding
	// --search-bar-input-padding: 8px 16px;
} 

// 标签栏滚动容器
.tab-scroll {
  white-space: nowrap;
  .tab-bar {
    display: flex;
    padding-bottom: 10px;
    .tab-item {
      padding: 8px 16px;
      font-size: 14px;
      color: #333;
      position: relative;
      // 选中态样式
      &.active {
        color: #2d7cf9;
        font-weight: bold;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 3px;
          background-color: #2d7cf9;
          border-radius: 2px;
        }
      }
    }
  }
}
.scroll-container {
    background: #f5f5f5;
    flex: 1; /* 占满 .page-container 剩余高度 */
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto; /* H5/通用写法：开启垂直滚动 */
    -webkit-overflow-scrolling: touch; /* 移动端顺滑滚动 */
    /* uni-app/小程序 需加以下属性 */
    scroll-y: true; /* 显式开启垂直滚动（小程序特有） */
    enable-flex: true; /* 允许内部 flex 布局（小程序特有） */
    overflow-x: hidden; /* 禁止横向滚动 */
}
// 服务卡片列表
.card-list {
  display: flex;
  flex-direction: column;
  gap: 15px; // 卡片间距
  .service-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
	display: flex;
	flex-direction: row;
	justify-content: space-between;
    
    .card-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }
    
    .card-desc {
      font-size: 14px;
      color: #666;
      line-height: 1.4;
      margin-bottom: 10px;
    }
    
    .price-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: baseline;
      .price-label {
        font-size: 14px;
        color: #666;
        margin-right: 5px;
      }
      .price-unit {
        font-size: 14px;
        color: #999;
      }
      .price-num {
        font-size: 18px;
        color: #f59a23;
        font-weight: bold;
        margin: 0 2px;
      }
    }
    
    .card-remark {
      font-size: 12px;
      color: #999;
      background-color: #f9f9f9;
      //padding: 6px 10px;
      border-radius: 4px;
      margin-top: 8px;
    }
  }
}
.status-tag {
  width: 50px;
  height: 30px;
  color: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-operator {
	width: auto;
	  height: 32px;
	  background-color: #f0f0f0;
	  border: none;
	  border-radius: 4px;
	  color: #666666;
	  font-size: 14px;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  padding: 0 16px;
	  margin-top: 30px;
	  -webkit-tap-highlight-color: transparent;
	  &:hover {
	    background-color: #e5e5e5;
	  }
	  &:active {
	    background-color: #d9d9d9;
	  }
}
</style>

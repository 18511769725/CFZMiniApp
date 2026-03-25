<template>
  <view class="kanghu-container">
    <!-- 4个康护服务卡片 -->
    <!-- 4个特色服务卡片，分两层 -->
    <view class="cards-grid">
      <ServiceCardComponent
        v-for="(card, index) in serviceCardsA"
        :key="index"
        :icon="card.icon"
        :title="card.title"
        :subtitle="card.subtitle"
        :backgroundImage="card.backgroundImage"
        :categorya="card.categorya"
        :categoryb="card.categoryb"
      />
    </view>
    <view class="cards-grid">
      <ServiceCardComponent
        v-for="(card, index) in serviceCardsB"
        :key="index"
        :icon="card.icon"
        :title="card.title"
        :subtitle="card.subtitle"
        :backgroundImage="card.backgroundImage"
        :categorya="card.categorya"
        :categoryb="card.categoryb"
      />
    </view>

    <!-- 申请流程 -->
    <view class="application-process">
      <view class="process-title">
        <view class="title-line"></view>
        <text>申请流程</text>
      </view>
      <scroll-view scroll-x class="process-steps" show-scrollbar="false">
        <view class="process-steps-inner">
          <ProcessStepCard
            v-for="(step, index) in steps"
            :key="index"
            :step-number="String(index + 1).padStart(2, '0')"
            :icon="step.icon"
            :title="step.title"
            :subtitle="step.subtitle"
            :background-image="step.backgroundImage"
          />
        </view>
      </scroll-view>
    </view>

    <!-- 推荐服务 -->
    <view class="services-section">
      <view class="section-title">推荐服务</view>
      <scroll-view scroll-x class="service-scroll">
        <view class="service-list">
          <view
            v-for="(product, index) in state.feedproductlist"
            :key="index"
            class="service-card"
            @click="
              uni.navigateTo({
                url: `/pages/product/product-detail?id=${product.id}`,
              })
            "
          >
            <image :src="product.imageurl" class="service-image"></image>
            <text class="service-name">{{ product.producttitle }}</text>
            <text class="service-loc">{{ product.bcompanyname }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import ServiceCardComponent from "./ServiceCardComponent.vue";
import ProcessStepCard from "./ProcessStepCard.vue";

const state = reactive({
  feedproductlist: [],
});
// 康护服务卡片
const serviceCardsA = ref([
  {
    icon: "/static/pages/mall/kanghu/ggylzc.png",
    title: "高管医疗支持",
    subtitle: "企业高管专属服务",
    backgroundImage:
      "https://mvpme82.cloud/data/abbfc66d-41f0-40c2-a776-0824d85437f9_1774321322917.jpg",
    categorya: 2,
    categoryb: 0,
  },
  {
    icon: "/static/pages/mall/kanghu/zstjfw.png",
    title: "专属体检服务",
    subtitle: "定制化团体体检套餐",
    backgroundImage:
      "https://mvpme82.cloud/data/42586c7c-7ee8-401f-9e53-b03d85e7927d_1774321356323.jpg",
    categorya: 2,
    categoryb: 0,
  },
]);
const serviceCardsB = ref([
  {
    icon: "/static/pages/mall/kanghu/jkzxfw.png",
    title: "健康咨询服务",
    subtitle: "7*12小时在线健康顾问",
    backgroundImage:
      "https://mvpme82.cloud/data/22d5dac4-eb72-4fcf-b009-09c7d51a9c5f_1774321384808.jpg",
    categorya: 2,
    categoryb: 0,
  },
  {
    icon: "/static/pages/mall/kanghu/yllstd.png",
    title: "医疗绿色通道",
    subtitle: "优先服务 2小时内响应",
    backgroundImage:
      "https://mvpme82.cloud/data/59928ccd-c962-43a1-bfdb-b51798991163_1774321410669.jpg",
    categorya: 2,
    categoryb: 0,
  },
]);

// 流程步骤
const steps = ref([
  {
    title: "选择服务",
    subtitle: "选择拟申请服务内容",
    icon: "/static/pages/mall/process_yuexiangkanghu_1.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "填报需求",
    subtitle: "填写服务需求及相关信息",
    icon: "/static/pages/mall/process_yuexiangkanghu_2.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "提交申请",
    subtitle: "确认后提交服务申请",
    icon: "/static/pages/mall/process_yuexiangkanghu_3.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "预约沟通",
    subtitle: "预约线下沟通时间",
    icon: "/static/pages/mall/process_yuexiangkanghu_4.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "服务确认",
    subtitle: "确认服务内容及安排",
    icon: "/static/pages/mall/process_yuexiangkanghu_5.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "积分核销",
    subtitle: "按实际使用情况核销积分",
    icon: "/static/pages/mall/process_yuexiangkanghu_6.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
]);

const getfeedproductlist = () => {
  console.info("userinfo:", state.userinfo);
  let payload = {
    // 这里可以添加请求参数
    categoryaid: "2",
    ccompanyid: state.userinfo.ccompanyid,
  };
  uni.request({
    url: "https://mvpme82.cloud/api/getfeedproductlistforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.feedproductlist = res.data.data;
      } else {
      }
    },
    fail: (err) => {},
  });
};
// 页面加载时初始化
onMounted(() => {
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
        getfeedproductlist();
        //getNewsList();
      } else {
        // 返回到登录页
        uni.reLaunch({ url: "/pages/login/login" });
      }
    },
    fail: () => {
      // 返回到登录页
      uni.reLaunch({ url: "/pages/login/login" });
    },
  });
});
</script>

<style scoped lang="scss">
.kanghu-container {
  padding: 20rpx;

  .services-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16rpx;
    margin-bottom: 30rpx;

    .service-card {
      background: linear-gradient(
        135deg,
        rgba(212, 165, 116, 0.1) 0%,
        rgba(100, 150, 200, 0.1) 100%
      );
      border: 2rpx solid rgba(212, 165, 116, 0.3);
      border-radius: 16rpx;
      overflow: hidden;
      transition: all 0.3s ease;

      &:active {
        background: linear-gradient(
          135deg,
          rgba(212, 165, 116, 0.15) 0%,
          rgba(100, 150, 200, 0.15) 100%
        );
        transform: scale(0.98);
      }

      .card-header {
        background: rgba(255, 255, 255, 0.05);
        padding: 24rpx;
        display: flex;
        justify-content: center;

        .service-icon {
          font-size: 48rpx;
        }
      }

      .card-content {
        padding: 16rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .service-title {
          font-size: 22rpx;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8rpx;
        }

        .service-desc {
          font-size: 16rpx;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }

  .cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;
    margin-bottom: 30rpx;

    .card {
      border-radius: 24rpx;
      padding: 30rpx;
      border: 2rpx solid rgba(212, 165, 116, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(212, 165, 116, 0.1) 0%,
          transparent 100%
        );
        pointer-events: none;
      }

      .card-icon {
        font-size: 48rpx;
        margin-bottom: 16rpx;
      }

      .card-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #fff;
        margin-bottom: 8rpx;
      }

      .card-desc {
        font-size: 20rpx;
        color: rgba(255, 255, 255, 0.6);
      }

      &.card-discount {
        background: linear-gradient(
          135deg,
          rgba(212, 165, 116, 0.15) 0%,
          rgba(101, 84, 192, 0.1) 100%
        );
      }

      &.card-subsidy {
        background: linear-gradient(
          135deg,
          rgba(70, 130, 180, 0.15) 0%,
          rgba(100, 150, 200, 0.1) 100%
        );
      }
    }
  }

  .application-process {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 24rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.1);
    padding: 30rpx;
    margin-bottom: 30rpx;
    // 设置背景图片
    background-image: url("/static/pages/mall/processbg.jpg");
    background-size: cover;
    background-position: center;

    .process-title {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-weight: 600;
      margin-bottom: 24rpx;
      color: #f2f8f9;

      .title-line {
        width: 6rpx;
        height: 32rpx;
        background: linear-gradient(to bottom, #00bcd4, #0097a7);
        border-radius: 3rpx;
        margin-right: 12rpx;
        box-shadow: 0 0 8rpx rgba(0, 188, 212, 0.5);
      }

      .process-icon {
        font-size: 32rpx;
        margin-right: 12rpx;
      }
    }

    .process-steps {
      display: flex;
      width: 100%;
      margin-top: 20rpx;
      border-radius: 16rpx;
      background: rgba(0, 0, 0, 0);

      .process-steps-inner {
        display: flex;
        flex-direction: row;
        gap: 16rpx;
        padding-right: 30rpx;
      }
    }
  }

  .services-section {
    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      margin-bottom: 16rpx;
      color: #fff;
    }

    .service-scroll {
      display: flex;
    }

    .service-list {
      display: flex;
      gap: 16rpx;
      padding-bottom: 20rpx;

      .service-card {
        min-width: 200rpx;
        border-radius: 16rpx;
        overflow: hidden;
        border: 2rpx solid rgba(212, 165, 116, 0.3);

        .service-image {
          width: 100%;
          height: 120rpx;
          background: rgba(255, 255, 255, 0.05);
        }

        .service-name {
          display: block;
          font-size: 20rpx;
          font-weight: 500;
          color: #fff;
          padding: 12rpx;
          line-height: 1.3;
        }

        .service-loc {
          display: block;
          font-size: 16rpx;
          color: rgba(255, 255, 255, 0.5);
          padding: 0 12rpx 12rpx;
          line-height: 1.2;
        }
      }
    }
  }
}
</style>

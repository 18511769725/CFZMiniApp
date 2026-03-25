<template>
  <view class="yuexiang-container">
    <!-- 大Banner -->
    <swiper
      class="lunbo-section"
      :indicator-dots="true"
      :indicator-color="'rgba(255, 255, 255, 0.5)'"
      :autoplay="true"
      :interval="3000"
      :duration="500"
    >
      <swiper-item v-for="(card, index) in lunboCards" :key="index">
        <LunboCardComponent
          :title="card.title"
          :subtitle="card.subtitle"
          :backgroundImage="card.backgroundImage"
          :categorya="card.categorya"
          :categoryb="card.categoryb"
        />
      </swiper-item>
    </swiper>

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
import LunboCardComponent from "./LunboCardComponent.vue";
import ServiceCardComponent from "./ServiceCardComponent.vue";
import ProcessStepCard from "./ProcessStepCard.vue";

const state = reactive({
  feedproductlist: [],
});

// 轮播图数据
const lunboCards = ref([
  {
    title: "亮马河国际风情水上行",
    subtitle: "感受国际风情水岸夜色",
    backgroundImage:
      "https://mvpme82.cloud/data/1acc887a-37f9-45c6-bf11-7872d881f77a_1774322792738.jpg",
    categorya: 1,
    categoryb: 1,
  },
  {
    title: "奥塔云端观景平台",
    subtitle: "俯瞰中轴线奇景",
    backgroundImage:
      "https://mvpme82.cloud/data/8811cf25-b9b7-47a9-b627-295524c41ce2_1774322964793.jpg",
    categorya: 1,
    categoryb: 5,
  },
]);

const serviceCardsA = ref([
  {
    icon: "/static/pages/mall/yuexiang/bus.png",
    title: "CBD美食巴士游",
    subtitle: "移动盛宴穿梭CBD",
    backgroundImage:
      "https://mvpme82.cloud/data/6f0231a2-8045-4ce6-b762-1fcbbe9777b1_1774320029683.jpg",
    categorya: 1,
    categoryb: 4,
  },
  {
    icon: "/static/pages/mall/yuexiang/meeting.png",
    title: "卓越会展空间",
    subtitle: "巅峰聚会智启未来",
    backgroundImage:
      "https://mvpme82.cloud/data/bed08056-87c4-4c0e-8048-6b46a4fe310d_1774320081928.jpg",
    categorya: 1,
    categoryb: 10,
  },
]);
const serviceCardsB = ref([
  {
    icon: "/static/pages/mall/yuexiang/living.png",
    title: "环球人才寓所",
    subtitle: "云端静谧尊享旅居",
    backgroundImage:
      "https://mvpme82.cloud/data/57816bef-a8cf-4588-9547-2f0a37501c5d_1774320053880.jpg",
    categorya: 1,
    categoryb: 11,
  },
  {
    icon: "/static/pages/mall/yuexiang/brand.png",
    title: "全域品牌赋能",
    subtitle: "品牌荟聚全域触达",
    backgroundImage:
      "https://mvpme82.cloud/data/e86d2cec-eca4-40e5-bdb7-25e28d7ace9f_1774320103173.jpg",
    categorya: 1,
    categoryb: 12,
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
  let payload = {
    // 这里可以添加请求参数
    categoryaid: "1",
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
  getfeedproductlist();
});
</script>

<style scoped lang="scss">
.yuexiang-container {
  padding: 20rpx;

  .lunbo-section {
    position: relative;
    border-radius: 24rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
    height: 250rpx;

    ::v-deep .uni-swiper-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ::v-deep .uni-swiper-dots {
      position: absolute;
      bottom: 12rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }

    ::v-deep .uni-swiper-dot {
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      width: 8rpx;
      height: 8rpx;
      margin: 0 6rpx;

      &.uni-swiper-dot-active {
        background-color: rgba(255, 255, 255, 0.9);
        width: 20rpx;
        border-radius: 4rpx;
      }
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16rpx;
    margin-bottom: 30rpx;

    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      border: 2rpx solid rgba(212, 165, 116, 0.3);
      border-radius: 16rpx;
      padding: 24rpx 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.3s ease;

      &:active {
        background: rgba(255, 255, 255, 0.08);
        transform: scale(0.98);
      }

      .feature-icon {
        font-size: 40rpx;
        margin-bottom: 12rpx;
      }

      .feature-title {
        font-size: 22rpx;
        font-weight: 600;
        color: #fff;
        margin-bottom: 8rpx;
      }

      .feature-desc {
        font-size: 16rpx;
        color: rgba(255, 255, 255, 0.6);
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

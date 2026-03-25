<template>
  <view class="anju-container">
    <!-- 两个大卡片：优惠房源和补贴房源 -->
    <view class="cards-grid">
      <ServiceCardComponent
        v-for="(card, index) in serviceCards"
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
// 流程步骤
const steps = ref([
  {
    title: "企业在线申报",
    subtitle: "企业填报人信息并提交申请",
    icon: "/static/pages/mall/process_yiju_1.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "数据核验",
    subtitle: "工作、社保、住房信息核验",
    icon: "/static/pages/mall/process_yiju_2.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "复核备案",
    subtitle: "服务机构管理部门工作验证",
    icon: "/static/pages/mall/process_yiju_3.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "预约看房",
    subtitle: "申请人预约看房并认房源",
    icon: "/static/pages/mall/process_yiju_4.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "企业确认发起订单",
    subtitle: "企业确认需求并发起平台订单",
    icon: "/static/pages/mall/process_yiju_5.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "签约并录入合同",
    subtitle: "签约后完成合同录入",
    icon: "/static/pages/mall/process_yiju_6.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "积分核销",
    subtitle: "根据签约入住情况完成积分核销",
    icon: "/static/pages/mall/process_yiju_7.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
]);

// 服务卡片数据
const serviceCards = ref([
  {
    icon: "/static/pages/mall/anju/yhfy.png",
    title: "优惠房源",
    subtitle: "城芯优选 优惠房源",
    backgroundImage:
      "https://mvpme82.cloud/data/e023ed8d-3d34-478d-b2f4-122ded27d525_1774317254032.png",
    categorya: 0,
    categoryb: 0,
  },
  {
    icon: "/static/pages/mall/anju/btfy.png",
    title: "补贴房源",
    subtitle: "城芯安居 专属补贴",
    backgroundImage:
      "https://mvpme82.cloud/data/cc2c869e-ab29-47d2-a8d0-f2a4bc013591_1774318625739.jpg",
    categorya: 0,
    categoryb: 0,
  },
]);

const getfeedproductlist = () => {
  let payload = {
    // 这里可以添加请求参数
    categoryaid: "0",
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
.anju-container {
  padding: 20rpx;

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

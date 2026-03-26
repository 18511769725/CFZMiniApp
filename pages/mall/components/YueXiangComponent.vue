<template>
  <view class="yuexiang-container">
    <!-- 大Banner（小程序内置指示点无法改样式，改为自定义指示点） -->
    <view class="lunbo-wrap">
      <swiper
        class="lunbo-section"
        :indicator-dots="false"
        :current="lunboCurrent"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        @change="onLunboChange"
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
      <view class="lunbo-dots-custom">
        <view
          v-for="(_, i) in lunboCards"
          :key="i"
          class="lunbo-dot"
          :class="{ 'lunbo-dot--active': lunboCurrent === i }"
        />
      </view>
    </view>

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

    <!-- 推荐服务 / 热门服务等（与益企·安居同款：Tab + tabid + .19-2 列表） -->
    <view class="services-section">
      <view class="feed-tabs-outer">
        <view class="feed-tabs-inner">
          <view
            v-for="tab in serviceFeedTabs"
            :key="tab.tabid"
            class="feed-tab-wrap"
            @tap="onFeedTabChange(tab.tabid)"
          >
            <view v-if="state.feedTabId === tab.tabid" class="feed-tab-active">
              <view class="feed-tab-active-inner">
                <text class="feed-tab-active-text">{{ tab.label }}</text>
              </view>
            </view>
            <text v-else class="feed-tab-inactive">{{ tab.label }}</text>
          </view>
        </view>
      </view>

      <view class="feed-list-frame-19-2">
        <view class="feed-list-frame-inner">
          <scroll-view
            scroll-x
            class="feed-service-scroll"
            show-scrollbar="false"
            :enable-flex="true"
          >
            <view class="feed-service-list">
              <view
                v-for="(product, index) in state.feedproductlist"
                :key="product.id || index"
                class="feed-service-card"
                @tap="
                  uni.navigateTo({
                    url: `/pages/product/product-detail?id=${product.id}`,
                  })
                "
              >
                <view class="feed-service-img-frame">
                  <image
                    :src="product.imageurl"
                    class="feed-service-image"
                    mode="aspectFill"
                  />
                </view>
                <view class="feed-service-text-col">
                  <view class="feed-service-name">{{ product.producttitle }}</view>
                  <view class="feed-service-loc">{{ product.bcompanyname }}</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
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
  feedTabId: 1,
});

const serviceFeedTabs = [
  { tabid: 1, label: "推荐服务" },
  { tabid: 2, label: "热门服务" },
  { tabid: 3, label: "专属推荐" },
  { tabid: 4, label: "当前可预约" },
];

const onFeedTabChange = (tabid) => {
  if (state.feedTabId === tabid) return;
  state.feedTabId = tabid;
  getfeedproductlist();
};

const lunboCurrent = ref(0);
const onLunboChange = (e) => {
  lunboCurrent.value = e.detail.current;
};

// 轮播图（切图已含标题文案，title/subtitle 留空不叠字；点击跳转参数不变）
const lunboCards = ref([
  {
    title: "",
    subtitle: "",
    backgroundImage:
      "https://mvpme82.cloud/data/124f4947-491b-4dbd-bf9c-8a1145a8c858_1774526431848.jpg",
    categorya: 1,
    categoryb: 1,
  },
  {
    title: "",
    subtitle: "",
    backgroundImage:
      "https://mvpme82.cloud/data/15d51da8-c168-4d2d-9967-94c6aabc815d_1774526454645.jpg",
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
    categoryaid: "1",
    tabid: state.feedTabId,
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

  /* 轮播区：687×269；指示点为自定义 view（设计 .28 / .3） */
  .lunbo-wrap {
    position: relative;
    width: 687rpx;
    margin: 0 auto 30rpx;
  }

  .lunbo-section {
    width: 100%;
    height: 269rpx;
    border-radius: 24rpx;
    overflow: hidden;

    ::v-deep .uni-swiper-item {
      display: flex;
      align-items: stretch;
      justify-content: center;
    }
  }

  .lunbo-dots-custom {
    position: absolute;
    left: 50%;
    bottom: 12rpx;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  /* 未选中 .3 */
  .lunbo-dot {
    width: 7rpx;
    height: 7rpx;
    margin: 0 4rpx;
    background-color: #f8f3ea;
    opacity: 0.67;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* 选中 .28 */
  .lunbo-dot--active {
    width: 17rpx;
    height: 8rpx;
    background-color: #ebd1a2;
    border-radius: 4rpx;
    opacity: 1;
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
    margin-top: 8rpx;
  }

  .feed-tabs-outer {
    width: 690rpx;
    height: 86rpx;
    margin: 0 auto 16rpx;
    box-sizing: border-box;
    padding: 1rpx;
    border-radius: 43rpx;
    background: linear-gradient(
      -8deg,
      #4682d4 0%,
      #2a6ac4 25%,
      #0d51b4 51%,
      #3b9fdf 100%
    );
  }

  .feed-tabs-inner {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 42rpx;
    background: rgba(13, 24, 48, 0.92);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx;
    gap: 4rpx;
  }

  .feed-tab-wrap {
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .feed-tab-active {
    width: 204rpx;
    height: 62rpx;
    box-sizing: border-box;
    padding: 1rpx;
    border-radius: 31rpx;
    flex-shrink: 0;
    background: linear-gradient(
      -6deg,
      #2c94c5 0%,
      #2070ac 30%,
      #134b93 60%,
      #37acd9 100%
    );
  }

  .feed-tab-active-inner {
    width: 100%;
    height: 100%;
    border-radius: 30rpx;
    background: linear-gradient(180deg, #1a3a6e 0%, #0f2848 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .feed-tab-active-text {
    font-size: 26rpx;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
    white-space: nowrap;
  }

  .feed-tab-inactive {
    max-width: 150rpx;
    min-height: 35rpx;
    font-family: PingFang SC, PingFangSC-Regular, sans-serif;
    font-size: 31rpx;
    font-weight: normal;
    line-height: 35rpx;
    color: #ffffff;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 4rpx;
    box-sizing: border-box;
  }

  .feed-list-frame-19-2 {
    width: 690rpx;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1rpx;
    border-radius: 32rpx;
    overflow: hidden;
    background: linear-gradient(
      -8deg,
      #4683d3 1%,
      #2c62bb 26%,
      #1141a2 51%,
      #558dd8 100%
    );
  }

  .feed-list-frame-inner {
    width: 100%;
    box-sizing: border-box;
    border-radius: 31rpx;
    background: rgba(14, 15, 18, 0.78);
    padding: 8rpx 12rpx 6rpx;
    overflow: hidden;
  }

  .feed-service-scroll {
    width: 100%;
    height: 270rpx;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .feed-service-list {
    display: inline-flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20rpx;
    padding: 0 2rpx 0 0;
    box-sizing: border-box;
  }

  .feed-service-card {
    width: 204rpx;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
  }

  .feed-service-img-frame {
    width: 204rpx;
    height: 134rpx;
    box-sizing: border-box;
    padding: 2rpx;
    flex-shrink: 0;
    border-radius: 16rpx;
    background: linear-gradient(
      -8deg,
      #699fce 0%,
      #3c73b4 30%,
      #0e4799 61%,
      #739cbc 100%
    );
    overflow: hidden;
  }

  .feed-service-image {
    width: 200rpx;
    height: 130rpx;
    display: block;
    vertical-align: top;
    border-radius: 14rpx;
    background: rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  .feed-service-text-col {
    width: 204rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 6rpx;
    gap: 0;
  }

  .feed-service-name {
    width: 190rpx;
    min-height: 20rpx;
    font-family: PingFang SC, PingFangSC-Regular, sans-serif;
    font-size: 22rpx;
    font-weight: normal;
    line-height: 35rpx;
    color: #ffffff;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .feed-service-loc {
    width: 153rpx;
    min-height: 15rpx;
    font-family: PingFang SC, PingFangSC-Regular, sans-serif;
    font-size: 16rpx;
    font-weight: normal;
    line-height: 28rpx;
    color: #b4b4b4;
    text-align: center;
    word-break: break-all;
    overflow-wrap: anywhere;
    white-space: normal;
    overflow: visible;
    box-sizing: border-box;
  }
}
</style>

<template>
  <view class="anju-container">
    <!-- 优惠房源 / 补贴房源：整图 15.png，跳转与原先卡片同一商品列表接口参数 -->
    <view class="anju-housing-banner" @tap="goHousingProductList">
      <image
        class="anju-housing-banner-img"
        src="https://mvpme82.cloud/data/a385d669-b84d-4f61-ae1b-3e5b8fa6b040_1774526386651.png"
        mode="scaleToFill"
      />
    </view>

    <!-- 宣传横幅（一键申报 / 全域护航 / 安居无忧） -->
    <view class="anju-promo-banner">
      <image
        class="anju-promo-banner-img"
        src="https://mvpme82.cloud/data/efc34df3-0c6d-4911-bdc7-0094e104b483_1774526259483.png"
        mode="aspectFill"
      />
    </view>

    <!-- 申请流程：单张整图（底+金边一体），无代码叠金边 -->
    <view class="application-process">
      <image
        class="application-process-bg"
        src="https://mvpme82.cloud/data/fa7e0527-08c5-46e5-8696-4768a4382f72_1774540934254.png"
        mode="scaleToFill"
      />
      <view class="application-process-inner">
        <view class="process-title">
          <view class="title-line"></view>
          <text class="process-title-text">申请流程</text>
        </view>
        <scroll-view scroll-x class="process-steps" show-scrollbar="false">
          <view class="process-steps-inner">
            <ProcessStepCard
              v-for="(step, index) in steps"
              :key="index"
              :compact-flow="true"
              :step-number="String(index + 1).padStart(2, '0')"
              :icon="step.icon"
              :icon-scale="step.iconScale ?? 1"
              :title="step.title"
              :subtitle="step.subtitle"
              :background-image="step.backgroundImage"
            />
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 推荐服务 / 热门服务等 Tab + 列表（Tab：.19-3 / .20；列表外框：.19-2；图：.16-2） -->
    <view class="services-section">
      <!-- 外框 .19-3：渐变描边容器 -->
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

      <!-- 列表整体外框 .19-2：渐变描边 + 大圆角（内为横向滚动） -->
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
                    url: `/pages/product/product-detail?id=${product.id}&categorya=0`,
                  })
                "
              >
                <view class="feed-service-img-frame">
                  <view class="feed-service-img-inner">
                    <image
                      :src="product.imageurl"
                      class="feed-service-image"
                      mode="aspectFill"
                    />
                  </view>
                </view>
                <view class="feed-service-text-col">
                  <view class="feed-service-name">{{
                    ellipsisFeedOneLine(
                      product.producttitle,
                      FEED_TITLE_MAX_KEEP,
                    )
                  }}</view>
                  <view class="feed-service-loc">{{
                    ellipsisFeedOneLine(
                      product.bcompanyname,
                      FEED_LOC_MAX_KEEP,
                    )
                  }}</view>
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
import ProcessStepCard from "./ProcessStepCard.vue";
import {
  ellipsisFeedOneLine,
  FEED_TITLE_MAX_KEEP,
  FEED_LOC_MAX_KEEP,
} from "../../../utils/feedEllipsis.js";

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

/** 与原 ServiceCardComponent 一致：安居分类下商品列表（原两卡均为 categorya=0、categoryb=0） */
const goHousingProductList = () => {
  uni.navigateTo({
    url: "/pages/mall/productlist?categorya=0&categoryb=0",
  });
};
// 流程步骤
const steps = ref([
  {
    title: "企业在线申报",
    subtitle: "企业填写申请人信息并提交申请",
    icon: "/static/pages/mall/process_yiju_1.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "数据核验",
    subtitle: "婚姻、社保、住房等信息核验",
    icon: "/static/pages/mall/process_yiju_2.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
    /* 该切图构图更满，同 44rpx 下显大，略缩以与其它步一致 */
    iconScale: 0.86,
  },
  {
    title: "复核备案",
    subtitle: "服务机构复核并完成备案",
    icon: "/static/pages/mall/process_yiju_3.png",
    backgroundImage: "/static/pages/mall/processitembg.png",
  },
  {
    title: "预约看房",
    subtitle: "申请人预约看房并确认房源",
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
    title: "签约入住并录入合同",
    subtitle: "签约入住后完成合同录入",
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

const getfeedproductlist = () => {
  let payload = {
    categoryaid: "0",
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
.anju-container {
  padding: 20rpx;

  /* 朝阳安居服务：稿 684×273，宽度与其它块统一 690 */
  .anju-housing-banner {
    width: 690rpx;
    max-width: 100%;
    height: 273rpx;
    margin: 0 auto 24rpx;
    border-radius: 24rpx;
    overflow: hidden;
    line-height: 0;
    box-sizing: border-box;

    .anju-housing-banner-img {
      width: 100%;
      height: 100%;
      display: block;
      vertical-align: top;
    }
  }

  /* 一键申报横幅：690×448 */
  .anju-promo-banner {
    width: 690rpx;
    max-width: 100%;
    height: 448rpx;
    margin: 0 auto 24rpx;
    border-radius: 24rpx;
    overflow: hidden;
    line-height: 0;
    box-sizing: border-box;

    .anju-promo-banner-img {
      width: 100%;
      height: 100%;
      display: block;
      vertical-align: top;
    }
  }

  .application-process {
    position: relative;
    width: 690rpx;
    max-width: 100%;
    height: 309rpx;
    margin: 0 auto 24rpx;
    border-radius: 24rpx;
    overflow: hidden;
    line-height: 0;
    box-sizing: border-box;

    .application-process-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      display: block;
    }

    .application-process-inner {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      /* 稿 .29：步骤顶距容器顶 93；底距 35；左/右 23 */
      padding: 23rpx 23rpx 35rpx 23rpx;
      box-sizing: border-box;
      background: transparent;
      display: flex;
      flex-direction: column;
    }

    .process-title {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-bottom: 38rpx;

      .title-line {
        width: 6rpx;
        height: 34rpx;
        flex-shrink: 0;
        background: linear-gradient(to bottom, #00bcd4, #0097a7);
        border-radius: 3rpx;
        margin-right: 12rpx;
        box-shadow: 0 0 8rpx rgba(0, 188, 212, 0.5);
      }

      .process-title-text {
        /* 稿 138rpx 为标注框；36rpx 四字实际更宽，固定宽度会裁掉「程」 */
        flex-shrink: 0;
        width: auto;
        height: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC, -apple-system, sans-serif;
        font-size: 36rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0;
        line-height: 34rpx;
        color: #ffffff;
        white-space: nowrap;
        box-sizing: border-box;
      }

      .process-icon {
        font-size: 32rpx;
        margin-right: 12rpx;
      }
    }

    .process-steps {
      display: flex;
      width: 100%;
      /* 309 - 23顶内边距 - 35底内边距 - 标题区(32+38) = 181 */
      height: 181rpx;
      margin-top: 0;
      border-radius: 16rpx;
      background: rgba(0, 0, 0, 0);
      box-sizing: border-box;

      .process-steps-inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16rpx;
        height: 100%;
        padding-right: 0;
        box-sizing: border-box;
      }
    }
  }

  .services-section {
    margin-top: 0;
  }

  /* .19-3 外框：690×86，与上方块同宽 */
  .feed-tabs-outer {
    width: 690rpx;
    height: 86rpx;
    margin: 0 auto 24rpx;
    box-sizing: border-box;
    padding: 1rpx;
    /* 大圆角：高度一半，整条 Tab 呈胶囊外框 */
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

  /* .20 选中：204×62 渐变描边胶囊 */
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
    font-size: 31rpx;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
    white-space: nowrap;
  }

  /* 未选中文案：与选中同为 31rpx */
  .feed-tab-inactive {
    max-width: 150rpx;
    min-height: 32rpx;
    font-family: PingFang SC, PingFangSC-Regular, sans-serif;
    font-size: 31rpx;
    font-weight: normal;
    line-height: 1.2;
    color: #ffffff;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 4rpx;
    box-sizing: border-box;
  }

  /* .19-2：690 宽 */
  .feed-list-frame-19-2 {
    width: 690rpx;
    max-width: 100%;
    height: 252rpx;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1rpx;
    border-radius: 27rpx;
    overflow: hidden;
    /* 外框渐变描边保留 */
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
    height: 100%;
    box-sizing: border-box;
    border-radius: 26rpx;
    /* 内底改为偏中性暗色、略透明，减轻「整块发蓝」 */
    background: rgba(14, 15, 18, 0.78);
    /* 上12 左12 右16 底22；滚动区高 = 216（134 图 + 6 + 35 + 6 + 35） */
    padding: 12rpx 16rpx 22rpx 12rpx;
    overflow: hidden;
  }

  .feed-service-scroll {
    width: 100%;
    height: 216rpx;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .feed-service-list {
    display: inline-flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20rpx;
    box-sizing: border-box;
  }

  .feed-service-card {
    width: 204rpx;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: transparent;
  }

  /* .16-2 图区：204×134，2rpx 渐变描边 */
  .feed-service-img-frame {
    width: 204rpx;
    height: 134rpx;
    box-sizing: border-box;
    padding: 2rpx;
    flex-shrink: 0;
    border-radius: 15rpx;
    background: linear-gradient(
      -8deg,
      #699fce 0%,
      #3c73b4 30%,
      #0e4799 61%,
      #739cbc 100%
    );
    overflow: hidden;
  }

  /* 内层定高定宽 + overflow，避免 image 与 padding 盒对齐误差导致顶部露底 */
  .feed-service-img-inner {
    width: 100%;
    height: 100%;
    border-radius: 13rpx;
    overflow: hidden;
    line-height: 0;
    font-size: 0;
    background: rgba(0, 0, 0, 0.15);
  }

  .feed-service-image {
    width: 100%;
    height: 100%;
    display: block;
    vertical-align: top;
    border-radius: 13rpx;
    overflow: hidden;
  }

  .feed-service-text-col {
    width: 204rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 6rpx;
    /* 大字与小字之间 6rpx；与图间距仍由 margin-top 承担 */
    gap: 6rpx;
  }

  .feed-service-name {
    width: 100%;
    min-height: 20rpx;
    font-family: PingFang SC, PingFangSC-Regular, sans-serif;
    font-size: 22rpx;
    font-weight: normal;
    font-stretch: normal;
    line-height: 28rpx;
    /* 与上图同宽左对齐；收紧字距以便 7 字 +「 ... ...」贴近设计稿 */
    letter-spacing: 0;
    color: #ffffff;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .feed-service-loc {
    width: 100%;
    min-height: 15rpx;
    font-family: PingFang SC, PingFangSC-Regular, sans-serif;
    font-size: 16rpx;
    font-weight: normal;
    font-stretch: normal;
    line-height: 22rpx;
    letter-spacing: 1rpx;
    color: #b4b4b4;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>

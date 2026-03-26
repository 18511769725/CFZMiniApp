<template>
  <view class="kanghu-container">
    <!-- 顶部两块切图：691×205，2rpx 金色渐变描边（padding 模拟） -->
    <view class="kanghu-top-banners">
      <view
        v-for="(card, index) in kanghuBannerCards"
        :key="index"
        class="kanghu-banner-item"
        @tap="onKanghuBannerTap(card.productId)"
      >
        <view class="kanghu-banner-inner">
          <image
            class="kanghu-banner-img"
            :src="card.imageSrc"
            mode="aspectFill"
          />
        </view>
      </view>
    </view>

    <!-- 申请流程上方宣传图 -->
    <view class="kanghu-promo-20">
      <image
        class="kanghu-promo-20-img"
        src="https://mvpme82.cloud/data/cc58fc76-d1fa-46f5-8653-b8c70c27db47_1774526562310.png"
        mode="aspectFill"
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
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import ProcessStepCard from "./ProcessStepCard.vue";

const state = reactive({
  userinfo: {},
});

/** 康护轮播底图（远程，原 18/19）；productId 来自 getkanghuproductlist，北京外企始终在首条 */
const kanghuBannerCards = ref([
  {
    productId: null,
    imageSrc:
      "https://mvpme82.cloud/data/e52688fc-1624-404c-8aa5-f5e143b3c041_1774526485013.png",
  },
  {
    productId: null,
    imageSrc:
      "https://mvpme82.cloud/data/217ac77c-184e-410b-a05b-7301726e9101_1774526515097.png",
  },
]);

const BEIJING_FESCO_NAME_PART = "北京外企";

const normalizeKanghuProductRow = (row) => {
  if (!row || typeof row !== "object") return null;
  const p = row.p && typeof row.p === "object" ? row.p : row;
  const b = row.b && typeof row.b === "object" ? row.b : {};
  const id = p.id ?? row.id;
  if (id === undefined || id === null) return null;
  return {
    id,
    producttitle: p.producttitle ?? row.producttitle ?? "",
    bcompanyid: p.bcompanyid ?? row.bcompanyid,
    bcompanyname: b.bcompanyname ?? row.bcompanyname ?? "",
  };
};

const sortKanghuProductsForBanner = (rows) => {
  const list = rows.map(normalizeKanghuProductRow).filter(Boolean);
  const isFesco = (name) => String(name || "").includes(BEIJING_FESCO_NAME_PART);
  const first = list.filter((x) => isFesco(x.bcompanyname));
  const rest = list.filter((x) => !isFesco(x.bcompanyname));
  return [...first, ...rest];
};

const applyKanghuBannerProducts = (sorted) => {
  const one = sorted[0];
  const two = sorted[1];
  kanghuBannerCards.value = [
    {
      productId: one?.id ?? null,
      imageSrc:
        "https://mvpme82.cloud/data/e52688fc-1624-404c-8aa5-f5e143b3c041_1774526485013.png",
    },
    {
      productId: two?.id ?? null,
      imageSrc:
        "https://mvpme82.cloud/data/217ac77c-184e-410b-a05b-7301726e9101_1774526515097.png",
    },
  ];
};

const getKanghuProductList = () => {
  const cid = state.userinfo?.ccompanyid;
  if (cid === undefined || cid === null || cid === "") return;
  uni.request({
    url: "https://mvpme82.cloud/api/getkanghuproductlist",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid: cid },
    success: (res) => {
      const d = res?.data;
      if (!d || (d.retcode !== "200" && d.retcode !== 200)) return;
      const raw = d.data;
      if (raw == null) return;
      const arr = Array.isArray(raw) ? raw : [raw];
      const sorted = sortKanghuProductsForBanner(arr);
      applyKanghuBannerProducts(sorted);
    },
  });
};

/** 与 mainpage 一致：会话里的用户可能没有 ccompanyid，需按用户 id 拉企业信息后才有公司主键 */
const ensureCCompanyIdThenLoadKanghu = () => {
  const existing = state.userinfo?.ccompanyid;
  if (existing !== undefined && existing !== null && existing !== "") {
    getKanghuProductList();
    return;
  }
  const uid = state.userinfo?.id;
  if (!uid) return;
  uni.request({
    url: "https://mvpme82.cloud/api/getccompanyinfobycuserid",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { cuserid: uid },
    success: (res) => {
      const d = res?.data;
      if (!d || (d.retcode !== "200" && d.retcode !== 200)) return;
      const row = d.data?.[0];
      const cid = row?.id;
      if (cid === undefined || cid === null || cid === "") return;
      state.userinfo.ccompanyid = cid;
      getKanghuProductList();
    },
  });
};

const onKanghuBannerTap = (productId) => {
  if (productId === null || productId === undefined || productId === "") {
    uni.showToast({ title: "数据加载中", icon: "none" });
    return;
  }
  uni.navigateTo({
    url: `/pages/product/product-detail?id=${productId}`,
  });
};

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

// 页面加载时初始化（仅校验登录）
onMounted(() => {
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
        ensureCCompanyIdThenLoadKanghu();
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

  /* 整体外框 691×205；内缩 2rpx 金边，无发光 */
  .kanghu-top-banners {
    margin-bottom: 30rpx;
  }

  .kanghu-banner-item {
    width: 691rpx;
    height: 205rpx;
    margin: 0 auto 16rpx;
    box-sizing: border-box;
    padding: 2rpx;
    border-radius: 26rpx;
    background: linear-gradient(
      159deg,
      #f6f1e7 0%,
      #dbb062 58%,
      #ca9c4a 100%
    );

    &:last-child {
      margin-bottom: 0;
    }
  }

  .kanghu-banner-inner {
    width: 100%;
    height: 100%;
    border-radius: 24rpx;
    overflow: hidden;
    line-height: 0;
    background: #0a1326;
  }

  .kanghu-banner-img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .kanghu-promo-20 {
    width: 691rpx;
    height: 581rpx;
    margin: 0 auto 24rpx;
    border-radius: 24rpx;
    overflow: hidden;
    line-height: 0;
  }

  .kanghu-promo-20-img {
    width: 100%;
    height: 100%;
    display: block;
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
}
</style>

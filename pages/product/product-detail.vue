<template>
  <view
    class="product-detail-page"
    :class="{
      'is-kanghu-long-detail': isKanghuLongImageDetail,
      'is-anju-detail': isAnjuDetail,
    }"
    :style="{ paddingTop: pdNavTotalPx + 'px' }"
  >
    <!-- 自定义导航栏：标题可写死 #FFFFFF，避免原生导航白字发灰 -->
    <view
      class="pd-custom-nav"
      :class="pdNavIsDark ? 'pd-custom-nav--dark' : 'pd-custom-nav--light'"
      :style="pdCustomNavStyle"
    >
      <view
        class="pd-custom-nav-inner"
        :style="{ height: navBarContentHeight + 'px' }"
      >
        <view class="pd-custom-nav-back" @click="handlePdNavBack">
          <text class="pd-custom-nav-back-txt">‹</text>
        </view>
        <text
          v-if="pdNavTitleText"
          class="pd-custom-nav-title"
          :style="pdNavTitleStyle"
          >{{ pdNavTitleText }}</text>
      </view>
    </view>

    <!-- 康护指定商品：整页长图 + 底部发起订单（与列表接口 imageurl 一致） -->
    <scroll-view
      v-if="isKanghuLongImageDetail"
      class="product-info-scroll kanghu-long-image-scroll"
      scroll-y
    >
      <image
        class="kanghu-long-detail-img"
        :src="kanghuLongImageUrl"
        mode="widthFix"
      />
    </scroll-view>

    <!-- 益企·安居：深色稿 + 渐变框卡片 + 金色选中套餐 -->
    <template v-else-if="isAnjuDetail">
      <scroll-view class="product-info-scroll anju-detail-scroll" scroll-y>
        <view class="anju-hero-wrap">
          <swiper
            class="anju-swiper"
            indicator-dots
            indicator-color="rgba(255,255,255,0.35)"
            indicator-active-color="#ffffff"
            circular
            autoplay
            interval="3000"
          >
            <swiper-item
              v-for="(imgItem, index) in swiperImageList"
              :key="index"
            >
              <image
                class="anju-swiper-img"
                :src="imgItem"
                mode="aspectFill"
              />
            </swiper-item>
          </swiper>
        </view>

        <view class="anju-content">
          <view class="anju-title-row">
            <view class="anju-title-block">
              <text class="anju-name">{{
                state.productDetailData.producttitle || "未命名商品"
              }}</text>
              <text class="anju-company">{{
                state.productDetailData.bcompanyname || "未知供应商"
              }}</text>
            </view>
            <view v-if="showAnjuScoreBadge" class="anju-tag-score-wrap">
              <image
                class="anju-tag-score-bg"
                :src="anjuTagScoreBgSrc"
                mode="scaleToFill"
              />
              <text class="anju-tag-score-label">套餐积分</text>
            </view>
          </view>

          <view
            v-if="showPackageArea"
            class="anju-card anju-card-shell anju-card-shell--package"
          >
            <view class="anju-card-inner">
              <view class="anju-section-head">
                <view class="anju-section-bar" />
                <text class="anju-section-title">套餐选项</text>
              </view>
              <view
                class="anju-package-item"
                v-for="(item, index) in packageList"
                :key="index"
                :class="{
                  'anju-package-item--active': selectedPackageIndex === index,
                }"
                @click="selectPackage(index)"
              >
                <text
                  class="anju-package-title"
                  @longpress.stop="showTitleTooltip(item.title, $event)"
                  @touchend="hideTitleTooltip"
                  @touchcancel="hideTitleTooltip"
                  >{{ item.title || "未命名套餐" }}</text
                >
                <text class="anju-package-score"
                  >{{ formatPrice(item.value || 0) }}分</text
                >
              </view>
              <view
                v-if="titleTooltip.visible"
                class="title-tooltip-popup"
                :style="titleTooltip.style"
              >
                {{ titleTooltip.text }}
              </view>
            </view>
          </view>

          <view
            class="anju-card anju-card-shell anju-card-shell--detail anju-detail-card"
          >
            <view class="anju-card-inner">
              <view class="anju-section-head">
                <view class="anju-section-bar" />
                <text class="anju-section-title">套餐详情</text>
              </view>
              <view class="anju-detail-body">
                <view class="anju-detail-list-spec">
                  <view
                    v-for="(line, i) in anjuDetailLines"
                    :key="i"
                    class="anju-detail-row"
                  >
                    <view class="anju-detail-bullet" />
                    <text class="anju-detail-text">{{ line }}</text>
                  </view>
                  <view
                    v-if="
                      anjuDetailLines.length === 0 &&
                      detailImageList.length === 0
                    "
                    class="anju-detail-empty"
                    >暂无详情</view
                  >
                </view>
              </view>
              <view
                v-if="detailImageList.length > 0"
                class="anju-detail-images"
              >
                <image
                  v-for="(imgItem, index) in detailImageList"
                  :key="index"
                  class="anju-detail-img"
                  :src="imgItem"
                  mode="widthFix"
                />
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </template>

    <template v-else>
      <!-- 1. 顶部图片走马灯 -->
      <swiper
        class="product-swiper"
        indicator-dots
        circular
        autoplay
        interval="3000"
      >
        <swiper-item v-for="(imgItem, index) in swiperImageList" :key="index">
          <image class="swiper-img" :src="imgItem" mode="aspectFill"></image>
        </swiper-item>
      </swiper>

      <!-- 2. 中部商品信息（可滚动，避免内容溢出） -->
      <scroll-view class="product-info-scroll" scroll-y>
        <view class="product-info-container">
          <!-- 商品名称 -->
          <view class="product-name">{{
            state.productDetailData.producttitle || "未命名商品"
          }}</view>

          <!-- 供应商名称 -->
          <view class="product-supplier">{{
            state.productDetailData.bcompanyname || "未知供应商"
          }}</view>

          <!-- 商品价格 -->
          <view class="product-price">{{ getProductPrice() }}</view>

          <!-- 套餐展示区域（仅pricetype=2时显示） -->
          <view v-if="showPackageArea" class="package-container">
            <view class="package-title">套餐选项</view>
            <view
              class="package-item"
              v-for="(item, index) in packageList"
              :key="index"
              :class="{ 'package-item-active': selectedPackageIndex === index }"
              @click="selectPackage(index)"
            >
              <view
                class="package-item-title"
                @longpress="showTitleTooltip(item.title, $event)"
                @touchend="hideTitleTooltip"
                @touchcancel="hideTitleTooltip"
                @mouseenter="showTitleTooltip(item.title, $event)"
                @mouseleave="hideTitleTooltip"
                >{{ item.title || "未命名套餐" }}</view
              >
              <view class="package-item-price"
                >{{ formatPrice(item.value || 0) }}分</view
              >
            </view>
            <view
              v-if="titleTooltip.visible"
              class="title-tooltip-popup"
              :style="titleTooltip.style"
            >
              {{ titleTooltip.text }}
            </view>
          </view>

          <!-- 商品详情 -->
          <view class="product-details-title">商品详情</view>
          <view
            class="product-details-content detail-text-wrap"
            v-if="state.productDetailData.details"
            >{{ state.productDetailData.details || "暂无商品详情介绍" }}</view
          >

          <view v-if="detailImageList.length > 0" class="detail-image-section">
            <view class="detail-image-list">
              <image
                v-for="(imgItem, index) in detailImageList"
                :key="index"
                class="detail-image-item"
                :src="imgItem"
                mode="widthFix"
              ></image>
            </view>
          </view>
        </view>
      </scroll-view>
    </template>

    <!-- 3. 底部吸底：.34 底栏（渐变+opacity 仅作用在 bg 层）+ .33 胶囊按钮 -->
    <view
      class="bottom-cart-bar bottom-cart-bar--submit-order"
      v-if="state.productDetailData.categorya === 0"
    >
      <view class="bottom-cart-bar-bg" />
      <view class="bottom-cart-bar-inner">
        <view class="bottom-btn-shell">
          <button class="bottom-add-cart-btn" @click="handleAskForTenantInfo">
            发起订单
          </button>
        </view>
      </view>
    </view>
    <view
      class="bottom-cart-bar"
      v-if="state.productDetailData.categorya === 1"
    >
      <view class="bottom-cart-bar-bg" />
      <view class="bottom-cart-bar-inner">
        <view class="bottom-btn-shell">
          <button class="bottom-add-cart-btn" @click="handleAddCart">
            加入购物车
          </button>
        </view>
      </view>
    </view>
    <!-- 康护底栏与其它分类同属一页根节点，避免真机上 flex 留白与白条 -->
    <view
      class="bottom-cart-bar bottom-cart-bar--submit-order"
      v-if="state.productDetailData.categorya === 2"
    >
      <view class="bottom-cart-bar-bg" />
      <view class="bottom-cart-bar-inner">
        <view class="bottom-btn-shell">
          <button class="bottom-add-cart-btn" @click="handleCreateKanghuOrder">
            发起订单
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";

/** 康护列表中「整张长图详情」的商品 id（与 getkanghuproductlist 一致） */
const KANGHU_LONG_IMAGE_PRODUCT_IDS = new Set([19, 75]);

const state = reactive({
  userinfo: {},
  productDetailData: {},
});

const defaultImg = "/static/images/default-product.png";

/** 益企·安居详情「套餐积分」角标底图 */
const anjuTagScoreBgSrc =
  "https://mvpme82.cloud/data/bc83f63f-9912-4e20-bf11-b55418300b8d_1774548007693.png";

/** 从康护列表跳转时带入的 imageurl（getproductdetailsforminiapp 常不带此字段） */
const kanghuListImageUrlFromRoute = ref("");

/** 列表传入的一级分类：0=益企·安居，用于首屏导航栏与布局 */
const categoryaFromRoute = ref(null);

/** 自定义导航栏占位（状态栏 + 胶囊对齐高度） */
const statusBarHeight = ref(20);
const navBarContentHeight = ref(44);

const initPdNavLayout = () => {
  try {
    const sys = uni.getSystemInfoSync();
    const sh = sys.statusBarHeight || 20;
    statusBarHeight.value = sh;
    const mb = uni.getMenuButtonBoundingClientRect();
    if (mb && mb.top != null && mb.height != null) {
      navBarContentHeight.value = (mb.top - sh) * 2 + mb.height;
    } else {
      navBarContentHeight.value = 44;
    }
  } catch {
    navBarContentHeight.value = 44;
  }
};

const pdNavTotalPx = computed(
  () => statusBarHeight.value + navBarContentHeight.value,
);

const handlePdNavBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: "/pages/mall/mall" });
    },
  });
};

const isKanghuLongImageDetail = computed(() => {
  const d = state.productDetailData;
  if (!d || d.id === undefined || d.id === null) return false;
  const categorya = Number(d.categorya);
  if (categorya !== 2) return false;
  const pid = Number(d.id);
  return KANGHU_LONG_IMAGE_PRODUCT_IDS.has(pid);
});

const kanghuLongImageUrl = computed(() => {
  const d = state.productDetailData;
  const fromDetail = String(d.imageurl || d.imageUrl || "").trim();
  const fromRoute = kanghuListImageUrlFromRoute.value.trim();
  return fromDetail || fromRoute || defaultImg;
});

/** 益企·安居详情页（与列表深色稿一致） */
const isAnjuDetail = computed(() => {
  if (isKanghuLongImageDetail.value) return false;
  const d = state.productDetailData;
  if (
    d &&
    d.categorya !== undefined &&
    d.categorya !== null &&
    d.categorya !== ""
  ) {
    return Number(d.categorya) === 0;
  }
  return categoryaFromRoute.value === 0;
});

/** 深色顶栏仅康护长图；益企·安居顶栏为白底黑字 */
const pdNavIsDark = computed(() => isKanghuLongImageDetail.value);

const pdNavBgColor = computed(() => {
  if (isKanghuLongImageDetail.value) return "#283341";
  if (isAnjuDetail.value) return "#ffffff";
  return "#F8F8F8";
});

const pdCustomNavStyle = computed(() => ({
  paddingTop: `${statusBarHeight.value}px`,
  backgroundColor: pdNavBgColor.value,
}));

/** 与小程序 navigationBarTextStyle: white 一致，避免继承 page 字色发灰 */
const pdNavTitleStyle = computed(() =>
  pdNavIsDark.value ? { color: "#ffffff" } : {},
);

const pdNavTitleText = computed(() => {
  if (isAnjuDetail.value || isKanghuLongImageDetail.value) return "项目详情";
  return "";
});

/** 自定义导航时同步微信窗口顶栏背景（康护深色 / 其它含安居白顶） */
const applyPdNavWindowStyle = () => {
  // #ifdef MP-WEIXIN
  try {
    const dark = pdNavIsDark.value;
    const bg = pdNavBgColor.value;
    if (dark) {
      uni.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: bg,
      });
      uni.setBackgroundColor({
        backgroundColor: bg,
        backgroundColorTop: bg,
        backgroundColorBottom: bg,
      });
    } else {
      uni.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: bg,
      });
      uni.setBackgroundColor({
        backgroundColor: bg,
        backgroundColorTop: bg,
        backgroundColorBottom: bg,
      });
    }
  } catch (e) {
    /* ignore */
  }
  // #endif
};

watch(
  [pdNavIsDark, pdNavBgColor],
  () => {
    applyPdNavWindowStyle();
  },
  { immediate: true },
);

onShow(() => {
  applyPdNavWindowStyle();
});

onUnload(() => {
  // #ifdef MP-WEIXIN
  try {
    uni.setBackgroundColor({
      backgroundColor: "#ffffff",
      backgroundColorTop: "#ffffff",
      backgroundColorBottom: "#ffffff",
    });
  } catch (e) {
    /* ignore */
  }
  // #endif
});

/** 套餐计价时标题旁「套餐积分」角标 */
const showAnjuScoreBadge = computed(() => {
  const pt = parseInt(state.productDetailData.pricetype, 10) || 0;
  return pt === 2;
});

/** 套餐详情正文：按行拆分为带项目符号的列表 */
const anjuDetailLines = computed(() => {
  const raw = String(state.productDetailData.details || "").trim();
  if (!raw) return [];
  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return lines.length ? lines : [raw];
});

// 商品详情数据
const productInfo = ref({});
// 走马灯图片列表
const swiperImageList = ref([]);
// 详情页图片列表
const detailImageList = ref([]);
// 套餐列表
const packageList = ref([]);
// 选中的套餐索引
const selectedPackageIndex = ref(-1);
// 是否显示套餐区域（pricetype=2时为true）
const showPackageArea = ref(false);
const titleTooltip = reactive({
  visible: false,
  text: "",
  style: {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const hideTitleTooltip = () => {
  titleTooltip.visible = false;
};

const showTitleTooltip = (title, event) => {
  const displayTitle = (title || "").trim();
  if (!displayTitle) {
    return;
  }

  titleTooltip.text = displayTitle;

  let clientX = 0;
  let clientY = 0;
  const touchPoint =
    event?.touches?.[0] || event?.changedTouches?.[0] || event?.detail;
  if (touchPoint && typeof touchPoint.clientX === "number") {
    clientX = touchPoint.clientX;
    clientY = touchPoint.clientY;
  } else if (typeof event?.clientX === "number") {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  if (clientX > 0 || clientY > 0) {
    let windowWidth = 375;
    let windowHeight = 667;
    try {
      const systemInfo = uni.getSystemInfoSync();
      windowWidth = systemInfo.windowWidth || windowWidth;
      windowHeight = systemInfo.windowHeight || windowHeight;
    } catch (error) {
      console.warn("获取设备窗口信息失败，浮窗使用默认定位");
    }

    const margin = 12;
    const tooltipWidth = Math.min(windowWidth * 0.8, 320);
    const left = Math.max(
      margin,
      Math.min(clientX, windowWidth - tooltipWidth - margin),
    );
    const top = Math.max(margin, Math.min(clientY + 16, windowHeight - 120));

    titleTooltip.style = {
      left: `${left}px`,
      top: `${top}px`,
      transform: "none",
    };
  } else {
    titleTooltip.style = {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  titleTooltip.visible = true;
};

// 格式化价格（与列表页保持一致，复用逻辑）
const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "0.00";
  }
  return price.toFixed(2);
};

// 处理商品价格展示（与列表页逻辑一致）
const getProductPrice = () => {
  console.info("state.productDetailData", state.productDetailData);
  const { pricetype, pricefactor, originalprice, packageprice } =
    state.productDetailData;
  const priceType = parseInt(pricetype, 10) || 0;

  // 控制套餐区域显示/隐藏
  showPackageArea.value = priceType === 2;

  switch (priceType) {
    case 0:
      const discount = formatPrice(pricefactor || 0);
      const discountPrice = formatPrice(
        (originalprice || 0) * (pricefactor || 0),
      );
      return `${discount}折 · 折后${discountPrice}分`;
    case 1:
      const finalPrice = formatPrice(pricefactor || 0);
      return `优惠计分 ${finalPrice}分`;
    case 2:
      return "套餐计分";
    default:
      return "沟通面议";
  }
};

// 解析imagelist，生成走马灯图片列表
const parseSwiperImageList = (imageListJson) => {
  if (!imageListJson) {
    // 无图片时返回默认占位图
    swiperImageList.value = [defaultImg];
    return;
  }

  try {
    const imageList = JSON.parse(imageListJson);
    if (Array.isArray(imageList) && imageList.length > 0) {
      // 提取所有图片地址，容错处理单个图片对象
      swiperImageList.value = imageList.map((item) => item?.url || defaultImg);
    } else {
      // 空数组时返回默认占位图
      swiperImageList.value = [defaultImg];
    }
  } catch (error) {
    console.error("商品走马灯图片解析失败：", error);
    swiperImageList.value = [defaultImg];
  }
};

// 解析detailimagelist，
const parseDetailImageList = (imageListJson) => {
  if (!imageListJson) {
    // 无图片时返回默认占位图
    detailImageList.value = [];
    return;
  }

  try {
    const imageList = JSON.parse(imageListJson);
    if (Array.isArray(imageList) && imageList.length > 0) {
      // 提取所有图片地址，容错处理单个图片对象
      detailImageList.value = imageList.map((item) => item?.url);
    } else {
      // 空数组时返回默认占位图
      detailImageList.value = [];
    }
  } catch (error) {
    console.error("商品详情图片解析失败：", error);
    detailImageList.value = [];
  }
};

// 解析packageprice，生成套餐列表
const parsePackageList = (packagePriceJson) => {
  packageList.value = [];
  selectedPackageIndex.value = -1; // 重置选中状态

  if (!packagePriceJson) {
    return;
  }
  console.info("packageList", packageList);
  try {
    const packageData = JSON.parse(packagePriceJson);
    if (Array.isArray(packageData) && packageData.length > 0) {
      packageList.value = packageData;
    }
  } catch (error) {
    console.error("商品套餐信息解析失败：", error);
    uni.showToast({ title: "套餐信息加载失败", icon: "none" });
  }
  console.info("packageList2", packageList);
};

// 加载商品详情数据
const loadProductDetail = (productId) => {
  try {
    let payload = {
      id: productId,
    };
    uni.request({
      url: "https://mvpme82.cloud/api/getproductdetailsforminiapp", // 目标接口地址
      method: "POST",
      data: payload,
      success: (res) => {
        if (res && res.data && res.data.retcode === "200") {
          state.productDetailData = res.data.data[0] || {};
          if (state.productDetailData && state.productDetailData.id) {
            // 解析图片列表，生成走马灯数据
            parseSwiperImageList(state.productDetailData.imagelist);
            // 解析详情图片列表，
            parseDetailImageList(state.productDetailData.detailimagelist);
            // 解析套餐列表数据
            parsePackageList(state.productDetailData.packageprice);
            // 触发价格逻辑，控制套餐区域显示
            getProductPrice();
            const ca = Number(state.productDetailData.categorya);
            if (ca === 0 && packageList.value.length > 0) {
              selectedPackageIndex.value = 0;
            }
          } else {
            uni.showToast({ title: "商品不存在", icon: "none" });
            setTimeout(() => uni.navigateBack(), 1500);
          }
        } else {
          uni.showToast({ title: "商品不存在", icon: "none" });
          setTimeout(() => uni.navigateBack(), 1500);
        }
      },
      fail: (err) => {
        uni.showToast({ title: "商品不存在", icon: "none" });
        setTimeout(() => uni.navigateBack(), 1500);
      },
    });
  } catch (error) {
    uni.showToast({ title: "商品不存在", icon: "none" });
    setTimeout(() => uni.navigateBack(), 1500);
  }
};

// 选择套餐
const selectPackage = (index) => {
  // 校验套餐索引有效性
  if (index < 0 || index >= packageList.value.length) {
    return;
  }
  selectedPackageIndex.value = index;
};

// 底部吸底按钮：加入购物车
const handleAddCart = () => {
  const { id, pricetype } = state.productDetailData;
  const priceType = parseInt(pricetype, 10) || 0;
  // 若套餐选择有效，获取选中的套餐信息
  let selectedPackage = "";

  // 基础商品信息校验
  if (!id) {
    uni.showToast({ title: "商品信息异常", icon: "none" });
    return;
  }

  // 套餐计价类型（pricetype=2）：校验是否选择套餐
  if (priceType === 2) {
    if (
      selectedPackageIndex.value === -1 ||
      !packageList.value[selectedPackageIndex.value]
    ) {
      uni.showToast({ title: "请先选择一个套餐", icon: "none" });
      return;
    }

    // 套餐选择有效，获取选中的套餐信息
    selectedPackage = packageList.value[selectedPackageIndex.value];
  }

  // 调用插入购物车接口
  let payload = {
    bcompanyid: state.productDetailData.bcompanyid,
    cuserid: state.userinfo.id, // 当前登录用户id,在写入t_cargo表时，需要根据该值从t_c_users反查ccompanyid写入t_cargo表的ccompanyid字段
    productid: state.productDetailData.id,
    packageinfo: JSON.stringify(selectedPackage) || "", // 套餐信息json字符串，非套餐计价可传空字符串
    buyamount: 1, // 购买数量，暂时写死为1，后续可扩展数量选择功能
  };
  uni.request({
    url: "https://mvpme82.cloud/api/addtocartforminiapp", // 目标接口地址
    method: "POST",
    data: payload,
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        uni.showToast({ title: "已加入购物车", icon: "success" });
        // 在成功添加到购物车后，跳转到购物车页面，在switchTab执行的同时，触发一次/pages/cargo/cargo-list.vue的onLoad事件，重新加载购物车数据
        setTimeout(() => {
          uni.switchTab({ url: "/pages/cargo/cargo-list" });
        }, 1500);
      } else {
        uni.showToast({
          title: res.data?.str_err_code || "加入购物车失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      uni.showToast({ title: "网络异常，无法连接接口", icon: "none" });
    },
  });
};

// 发起康护订单
const handleCreateKanghuOrder = () => {
  const { id } = state.productDetailData;

  if (!id) {
    uni.showToast({ title: "商品信息异常", icon: "none" });
    return;
  }

  let payload = {
    productId: id,
    userid: state.userinfo.id,
    username: state.userinfo.name,
    userphone: state.userinfo.phone,
    ccompanyid: state.userinfo.ccompanyid,
  };

  uni.request({
    url: "https://mvpme82.cloud/api/createkanghuorderfromminiapp",
    method: "POST",
    data: payload,
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        uni.showToast({ title: "订单已发起", icon: "success" });
        let orderid = res.data.str_err_code;
        setTimeout(() => {
          uni.navigateTo({
            url: `/pages/orderDetail/orderDetail?id=${orderid}`,
          });
        }, 1500);
      } else {
        uni.showToast({
          title: res.data?.str_err_code || "订单发起失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      uni.showToast({ title: "网络异常，无法连接接口", icon: "none" });
    },
  });
};

// handleAskForTenantInfo
const handleAskForTenantInfo = () => {
  const { id, pricetype } = state.productDetailData;
  const priceType = parseInt(pricetype, 10) || 0;
  // 若套餐选择有效，获取选中的套餐信息
  let selectedPackage = "";

  // 基础商品信息校验
  if (!id) {
    uni.showToast({ title: "商品信息异常", icon: "none" });
    return;
  }

  // 套餐计价类型（pricetype=2）：校验是否选择套餐
  if (priceType === 2) {
    if (
      selectedPackageIndex.value === -1 ||
      !packageList.value[selectedPackageIndex.value]
    ) {
      uni.showToast({ title: "请先选择一个套餐", icon: "none" });
      return;
    }

    // 套餐选择有效，获取选中的套餐信息对象，并转化为字符串传递给订单确认页使用
    selectedPackage = packageList.value[selectedPackageIndex.value];

    // 将选中的套餐信息存储到本地缓存，供订单确认页使用
    uni.setStorage({
      key: "selectedPackageInfo",
      data: selectedPackage,
    });
  }

  // 跳转到补充承租人信息页面，并传递商品id参数
  uni.navigateTo({
    url: `/pages/askForTenantInfo/askForTenantInfo?productId=${id}`,
  });
};

// 页面加载时，先获取用户信息，成功后再获取url传递的商品id并加载详情，否则返回登录
onLoad((options) => {
  const rawImg = options?.imageurl;
  if (rawImg !== undefined && rawImg !== null && rawImg !== "") {
    try {
      kanghuListImageUrlFromRoute.value = decodeURIComponent(String(rawImg));
    } catch {
      kanghuListImageUrlFromRoute.value = String(rawImg);
    }
  }
  if (options?.categorya !== undefined && options?.categorya !== null) {
    const ca = Number(options.categorya);
    categoryaFromRoute.value = Number.isNaN(ca) ? null : ca;
  }
  initPdNavLayout();
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (options.id) {
        loadProductDetail(options.id);
      } else {
        uni.showToast({ title: "商品参数异常", icon: "none" });
        setTimeout(() => uni.navigateBack(), 1500);
      }
    },
    fail: () => {
      // 返回到登录页
      uni.reLaunch({ url: "/pages/login/login" });
    },
  });
});

</script>

<style scoped>
/* 自定义导航栏：标题 #FFFFFF，不受小程序原生导航白字发灰影响 */
.pd-custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  box-sizing: border-box;
}

.pd-custom-nav-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pd-custom-nav-back {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  padding-left: 12rpx;
  padding-right: 24rpx;
}

.pd-custom-nav-back-txt {
  font-size: 48rpx;
  line-height: 1;
  font-weight: 400;
}

.pd-custom-nav--dark .pd-custom-nav-back-txt {
  color: #ffffff;
}

.pd-custom-nav--light .pd-custom-nav-back-txt {
  color: #000000;
}

.pd-custom-nav-title {
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 34rpx;
  font-weight: 500;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
}

.pd-custom-nav--dark .pd-custom-nav-title {
  color: #ffffff;
  opacity: 1;
}

.pd-custom-nav--light .pd-custom-nav-title {
  color: #000000;
}

.product-detail-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-sizing: border-box;
}

/* 康护长图详情：与底栏同色，避免 scroll 底部留白、padding 区呈白缝 */
.product-detail-page.is-kanghu-long-detail {
  background-color: #283341;
}

/* 1. 顶部走马灯样式 */
.product-swiper {
  width: 100%;
  height: 400rpx; /* 固定走马灯高度 */
  background-color: #f9f9f9;
}

.swiper-img {
  width: 100%;
  height: 100%;
}

/* 康护长图详情：单张 imageurl，宽度撑满、高度随比例 */
.kanghu-long-detail-img {
  display: block;
  width: 100%;
  vertical-align: top;
}

/* 2. 中部商品信息滚动容器 */
.product-info-scroll {
  flex: 1; /* 占满除走马灯和底部按钮外的空间 */
  min-height: 0; /* 真机 flex 子项默认可无限伸展，易在底部露出页底白边 */
  padding-bottom: 160rpx; /* 底栏 123rpx + 安全区，避免内容被遮挡 */
  overflow: hidden;
}

/* 康护长图：底栏同底色 + 与底栏高度对齐的 padding，消除长图与吸底之间的白条 */
.product-info-scroll.kanghu-long-image-scroll {
  background-color: #283341;
  padding-bottom: calc(126rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(126rpx + env(safe-area-inset-bottom));
}

.product-info-container {
  padding: 24rpx;
}

/* 商品名称 */
.product-name {
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

/* 供应商名称 */
.product-supplier {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 24rpx;
}

/* 商品价格 */
.product-price {
  font-size: 32rpx;
  color: #e53935;
  font-weight: 600;
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

/* 套餐区域样式 */
.package-container {
  margin: 32rpx 0;
  padding: 24rpx;
  background-color: #fafafa;
  border-radius: 12rpx;
}

.package-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20rpx;
}

.package-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 16rpx;
  margin-bottom: 12rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  border: 2rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

/* 套餐选中状态样式 */
.package-item-active {
  border-color: #e53935;
  background-color: #fff5f5;
}

.package-item-title {
  font-size: 26rpx;
  color: #333333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 16rpx;
}

.package-item-price {
  font-size: 28rpx;
  color: #e53935;
  font-weight: 500;
  white-space: nowrap;
}

.title-tooltip-popup {
  position: fixed;
  z-index: 1000;
  max-width: 80%;
  background: rgba(0, 0, 0, 0.82);
  color: #ffffff;
  font-size: 24rpx;
  line-height: 1.5;
  padding: 14rpx 18rpx;
  border-radius: 10rpx;
  word-break: break-all;
  box-sizing: border-box;
}

/* 商品详情标题 */
.product-details-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16rpx;
}

/* 商品详情内容 */
.product-details-content {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  text-align: justify;
}

.detail-image-section {
  margin-top: 24rpx;
}

.detail-image-list {
  margin-left: -24rpx;
  margin-right: -24rpx;
}

.detail-image-item {
  display: block;
  width: 100%;
  margin-bottom: 16rpx;
  background-color: #f9f9f9;
}

.detail-image-item:last-child {
  margin-bottom: 0;
}

/* 3. 底部吸底：.34 区域纯色底（设计导出渐变/透明度易与实机不符，改用 #283341） */
.bottom-cart-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 750rpx;
  margin: 0 auto;
  box-sizing: border-box;
  border: solid 1rpx #000000;
  z-index: 99;
  overflow: hidden;
}

/* 铺满底栏（border 内侧） */
.bottom-cart-bar-bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #283341;
  pointer-events: none;
  z-index: 0;
}

/* 发起订单底栏：背景层透明度（按钮在 inner，不受此处影响） */
.bottom-cart-bar--submit-order .bottom-cart-bar-bg {
  opacity: 0.15;
}

/* 设计稿矩形 34：按钮距四边 上23 / 下29 / 左42 / 右43（23+71+29=123rpx）；底侧叠加安全区 */
.bottom-cart-bar-inner {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  min-height: 123rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 23rpx;
  padding-right: 43rpx;
  padding-left: 42rpx;
  padding-bottom: calc(29rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(29rpx + env(safe-area-inset-bottom));
}

/* .33 渐变描边：小程序中 border-image 与圆角互斥，用 1rpx padding + 渐变底模拟 */
.bottom-btn-shell {
  width: 665rpx;
  height: 71rpx;
  box-sizing: border-box;
  padding: 1rpx;
  border-radius: 36rpx;
  background-image: linear-gradient(
    0deg,
    #f2c287 0%,
    #f8dab2 72%,
    #fdf2dd 100%
  );
}

.bottom-add-cart-btn {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  border: none;
  border-radius: 35rpx;
  background-image: linear-gradient(0deg, #dab26b 0%, #fcefd4 100%);
  color: #061730;
  font-size: 34rpx;
  font-weight: 500;
  font-family: PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif;
}

.bottom-add-cart-btn::after {
  border: none;
}

.detail-text-wrap {
  /* 保留换行符，合并多余空格（推荐） */
  white-space: pre-line;
  /* 可选：如果需要保留所有空格/制表符，用 pre-wrap（比如有缩进的文本） */
  /* white-space: pre-wrap; */

  /* 补充：让文本排版更美观 */
  word-wrap: break-word; /* 长单词换行 */
  word-break: break-all; /* 超出宽度自动换行 */
  line-height: 1.6; /* 行高，提升可读性 */
}

/* ========== 益企·安居项目详情（categorya=0）深色稿 ========== */
.is-anju-detail {
  background-color: #020713;
}

.is-anju-detail .bottom-cart-bar {
  border: none;
}

.is-anju-detail .bottom-cart-bar-bg {
  background-color: #020713;
}

.anju-detail-scroll {
  background-color: #020713;
  padding-bottom: 160rpx;
}

/* 顶图：稿 750×376，贴齐左右与内容区顶部，无圆角 */
.anju-hero-wrap {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.anju-swiper {
  width: 100%;
  height: 376rpx;
  border-radius: 0;
  overflow: hidden;
  background: #f1deb9;
}

.anju-swiper-img {
  width: 100%;
  height: 376rpx;
  display: block;
  border-radius: 0;
}

.anju-content {
  padding: 28rpx 40rpx 48rpx;
  box-sizing: border-box;
}

/* 标题行 + 套餐积分角标（底图 + 叠字） */
.anju-title-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.anju-title-block {
  flex: 1;
  min-width: 0;
}

.anju-name {
  display: block;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 41rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.25;
  letter-spacing: 0;
}

.anju-company {
  display: block;
  margin-top: 12rpx;
  font-family: PingFangSC-Regular, "PingFang SC", -apple-system, sans-serif;
  font-size: 25rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  color: #b8dced;
  line-height: 1.35;
}

.anju-tag-score-wrap {
  position: relative;
  flex-shrink: 0;
  margin-top: 4rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 133rpx;
  height: 40rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.anju-tag-score-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.anju-tag-score-label {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 40rpx;
  line-height: 40rpx;
  padding: 0 4rpx;
  box-sizing: border-box;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 25rpx;
  font-weight: 400;
  font-stretch: normal;
  letter-spacing: 0;
  color: #e9d591;
  text-align: center;
}

/* 渐变描边卡片：小程序用 padding 模拟 border-image（与稿 2rpx + linear-gradient(171deg,…) 一致） */
.anju-card-shell {
  width: 100%;
  max-width: 669rpx;
  margin: 0 auto 24rpx;
  padding: 2rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  background: linear-gradient(
    171deg,
    #80c3f6 0%,
    #244368 48%,
    #9ccdf0 100%
  );
}

/* 套餐选项：稿 .7 — 669×255、圆角 41、整区 opacity 0.74（与套餐详情一致） */
.anju-card-shell--package {
  width: 669rpx;
  max-width: 669rpx;
  min-height: 255rpx;
  border-radius: 41rpx;
  opacity: 0.74;
}

.anju-card-shell--package .anju-card-inner {
  border-radius: 39rpx;
  min-height: 251rpx;
  background: rgb(11, 26, 49);
}

/* 套餐详情：稿 .7-2 — 669×587、整区 opacity 0.74（与稿 border-image 块一致） */
.anju-card-shell--detail {
  width: 669rpx;
  max-width: 669rpx;
  min-height: 587rpx;
  border-radius: 41rpx;
  opacity: 0.74;
}

.anju-card-shell--detail .anju-card-inner {
  border-radius: 39rpx;
  min-height: 583rpx;
  padding: 33rpx 31rpx 29rpx 57rpx;
  box-sizing: border-box;
  /* 外层已 0.74，内层用实色避免与 rgba 叠乘过透 */
  background: rgb(11, 26, 49);
}

.anju-card-inner {
  border-radius: 16rpx;
  padding: 22rpx 20rpx 24rpx;
  box-sizing: border-box;
  background: rgba(11, 26, 49, 0.74);
}

.anju-section-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 18rpx;
}

.anju-section-bar {
  width: 6rpx;
  height: 28rpx;
  margin-right: 12rpx;
  border-radius: 3rpx;
  background: linear-gradient(180deg, #80c3f6 0%, #2c6ebc 100%);
  flex-shrink: 0;
}

.anju-section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

/* 未选中：607×63、圆角 14、描边 #e3c695 */
.anju-package-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 607rpx;
  max-width: 100%;
  height: 63rpx;
  margin: 0 auto 16rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  border-radius: 14rpx;
  border: solid 1rpx #e3c695;
  background: rgba(20, 42, 74, 0.95);
}

.anju-package-item:last-of-type {
  margin-bottom: 0;
}

.anju-package-item--active {
  border: solid 1rpx #e3c695;
  background: linear-gradient(90deg, #fcefd4 0%, #e8c99a 45%, #dab26b 100%);
}

.anju-package-title {
  flex: 1;
  min-width: 0;
  margin-right: 16rpx;
  font-size: 25rpx;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.95);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anju-package-item--active .anju-package-title {
  color: #061730;
}

.anju-package-score {
  flex-shrink: 0;
  font-family: PingFangSC-Regular, "PingFang SC", -apple-system, sans-serif;
  font-size: 25rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  color: #e9d591;
}

.anju-package-item--active .anju-package-score {
  color: #061730;
}

/* 与「套餐详情」标题同一内容左缘对齐，不做额外缩进 */
.anju-detail-body {
  width: 100%;
  box-sizing: border-box;
}

/* 稿：点 7×7；点与字 18rpx；区域 581×461 */
.anju-detail-list-spec {
  width: 581rpx;
  max-width: 100%;
  height: 461rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  overflow-y: auto;
  font-family: PingFangSC-Regular, "PingFang SC", -apple-system, sans-serif;
  font-size: 22rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  color: #ffffff;
}

.anju-detail-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  box-sizing: border-box;
}

/* 7×7 点与 22rpx 首行垂直居中：(行高 − 点高) / 2，避免点贴顶显得偏上 */
.anju-detail-bullet {
  width: 7rpx;
  height: 7rpx;
  margin-top: 13rpx;
  margin-right: 18rpx;
  flex-shrink: 0;
  background: #3d8fd9;
}

.anju-detail-text {
  display: block;
  flex: 1;
  min-width: 0;
  line-height: 1.55;
  word-break: break-all;
}

.anju-detail-empty {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.45);
}

.anju-detail-images {
  margin-top: 20rpx;
}

.anju-detail-img {
  display: block;
  width: 100%;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.anju-detail-img:last-child {
  margin-bottom: 0;
}
</style>

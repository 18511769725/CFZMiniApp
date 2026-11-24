<template>
  <view class="add-user-container">
    <!-- 配额：669×573 稿，渐变描边 + 圆角 41（勿对整卡设 opacity，会连文字一起变淡） -->
    <view class="tenant-card-shell tenant-card-shell--quota">
      <view class="tenant-card-inner">
        <view class="section-head">
          <view class="section-bar" />
          <text class="quota-title">配额使用情况</text>
        </view>
        <text class="quota-subtitle">请选择一个可用配额后再发起订单</text>
        <view
          class="quota-item"
          v-for="(item, index) in quotaContentList"
          :key="`${item.type || 'unknown'}-${index}`"
          :class="{
            'quota-item-selected': isQuotaSelected(index),
            'quota-item-disabled': !isQuotaAvailable(item),
          }"
          @click="handleQuotaSelect(item, index)"
        >
          <view class="quota-item-header">
            <view class="quota-type" :class="`quota-type-${item.type}`">
              <text class="quota-type-text">{{ getQuotaTypeLabel(item) }}</text>
            </view>
            <view class="quota-right-header">
              <text class="quota-main-highlight">{{
                getQuotaMainHighlight(item)
              }}</text>
              <view
                class="quota-selector"
                :class="{
                  checked: isQuotaSelected(index),
                  disabled: !isQuotaAvailable(item),
                }"
              />
            </view>
          </view>

          <view class="quota-metrics">
            <image
              class="quota-metrics-bg"
              src="https://mvpme82.cloud/data/01aea8d6-7b4a-44ed-8636-0b80aa7bf7be_1774551576825.png"
              mode="scaleToFill"
            />
            <view class="quota-metrics-body">
              <view class="quota-metric">
                <text class="quota-metric-label">共计</text>
                <text class="quota-metric-value">{{
                  getQuotaStats(item).count
                }}</text>
              </view>
              <view class="quota-metric-divider">
                <view class="quota-metric-divider-line" />
              </view>
              <view class="quota-metric">
                <text class="quota-metric-label">已使用</text>
                <text class="quota-metric-value">{{
                  getQuotaStats(item).used
                }}</text>
              </view>
              <view class="quota-metric-divider">
                <view class="quota-metric-divider-line" />
              </view>
              <view class="quota-metric">
                <text class="quota-metric-label">可使用</text>
                <text class="quota-metric-value">{{
                  getQuotaStats(item).available
                }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="quotaContentList.length === 0" class="quota-empty">
          暂无配额数据
        </view>
      </view>
    </view>
    <view
      class="tenant-info-tip"
      @click="navigateToAnjuProcess"
      style="display: none"
    >
      请确保承租人已在“朝安居”平台完成备案审核，点击查看完整流程
    </view>

    <!-- 表单区：669×590 稿，同套渐变描边 -->
    <view class="tenant-card-shell tenant-card-shell--form">
      <view class="tenant-card-inner tenant-card-inner--form">
        <view class="form-item">
          <text class="label required">承租人姓名</text>
          <view class="input-shell">
            <input
              class="input"
              placeholder-class="tenant-input-ph"
              type="text"
              v-model="form.name"
              placeholder="请输入承租人姓名"
              maxlength="20"
            />
          </view>
        </view>

        <view class="form-item">
          <text class="label required">身份证号</text>
          <view class="input-shell">
            <input
              class="input"
              placeholder-class="tenant-input-ph"
              type="text"
              v-model="form.idCard"
              placeholder="请输入身份证号"
              maxlength="18"
            />
          </view>
        </view>

        <view class="form-item">
          <text class="label required">职务信息</text>
          <view class="input-shell">
            <input
              class="input"
              placeholder-class="tenant-input-ph"
              type="text"
              v-model="form.title"
              placeholder="请输入职务信息"
              maxlength="30"
            />
          </view>
        </view>

        <view class="form-item">
          <text class="label required">手机号</text>
          <view class="input-shell">
            <input
              class="input"
              placeholder-class="tenant-input-ph"
              type="number"
              v-model="form.phone"
              placeholder="请输入手机号"
              maxlength="11"
            />
          </view>
        </view>
      </view>
    </view>
  </view>

  <view class="bottom-order-bar">
    <view class="bottom-order-bar-bg" />
    <view class="bottom-order-btn-wrap">
      <button
        class="bottom-order-btn"
        :disabled="!canSubmitOrder"
        @click="handleSubmit"
      >
        {{ submitting ? "提交中..." : "发起订单" }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, reactive, ref } from "vue";
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";

/** 与 globalStyle 一致：默认浅色顶栏 #F8F8F8 + 黑字；避免从商品详情等页残留深色顶栏 */
const TENANT_NAV_BAR_BG = "#F8F8F8";
const TENANT_PAGE_BG = "#020713";

const applyTenantNavBarStyle = () => {
  try {
    uni.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: TENANT_NAV_BAR_BG,
    });
    // #ifdef MP-WEIXIN
    uni.setBackgroundColor({
      backgroundColor: TENANT_PAGE_BG,
      backgroundColorTop: TENANT_PAGE_BG,
      backgroundColorBottom: TENANT_PAGE_BG,
    });
    // #endif
  } catch (e) {
    /* ignore */
  }
};

const scheduleTenantNavBarStyle = () => {
  nextTick(() => applyTenantNavBarStyle());
};

onReady(() => {
  scheduleTenantNavBarStyle();
});

onShow(() => {
  scheduleTenantNavBarStyle();
});

const submitting = ref(false);
const productId = ref("");

const state = reactive({
  userinfo: {},
  anjucredits: {},
  selectedQuotaIndex: -1,
});

const quotaContentList = computed(() => {
  if (!Array.isArray(state.anjucredits.anjuContentArray)) {
    console.warn("配额内容数据异常：", state.anjucredits.anjuContentArray);
    return [];
  }
  return state.anjucredits.anjuContentArray;
});

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const digitMap = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

// 0-1 区间小数转中文折扣表达，例如 0.5 => 五折，0.85 => 八五折
const formatDiscountToChinese = (discountValue) => {
  const value = toNumber(discountValue);
  const safeValue = Math.max(0, Math.min(1, value));
  const scaled = Math.round(safeValue * 100);
  const tens = Math.floor(scaled / 10);
  const ones = scaled % 10;

  if (scaled === 100) return "十折";
  if (ones === 0) return `${digitMap[tens]}折`;
  return `${digitMap[tens]}${digitMap[ones]}折`;
};

const buildQuotaText = (item) => {
  const type = item?.type;
  const count = toNumber(item?.count);

  if (type === "deduction") {
    const deductionCount = toNumber(
      item?.deductionCount ?? state.anjucredits?.deductionCount,
    );
    const availableCount = Math.max(0, count - deductionCount);
    return `最高${toNumber(item?.quota)}积分抵用权益：共计${count}份，使用中${deductionCount}份，可用${availableCount}份`;
  }

  if (type === "discount") {
    const discountCount = toNumber(
      item?.discountCount ?? state.anjucredits?.discountCount,
    );
    const availableCount = Math.max(0, count - discountCount);
    return `最高${toNumber(item?.limit)}积分${formatDiscountToChinese(item?.discount)}抵用权益：共计${count}份，使用中${discountCount}份，可用${availableCount}份`;
  }

  return "";
};

const getQuotaTypeLabel = (item) => {
  if (item?.type === "deduction") return "积分抵用";
  if (item?.type === "discount") return "折扣抵用";
  return "配额权益";
};

const getQuotaMainHighlight = (item) => {
  if (item?.type === "deduction") {
    return `最高${toNumber(item?.quota)}积分`;
  }
  if (item?.type === "discount") {
    return `最高${toNumber(item?.limit)}积分 ${formatDiscountToChinese(item?.discount)}`;
  }
  return "";
};

const getQuotaStats = (item) => {
  const count = toNumber(item?.count);
  if (item?.type === "deduction") {
    const used = toNumber(
      item?.deductionCount ?? state.anjucredits?.deductionCount,
    );
    return {
      count,
      used,
      available: Math.max(0, count - used),
    };
  }

  if (item?.type === "discount") {
    const used = toNumber(
      item?.discountCount ?? state.anjucredits?.discountCount,
    );
    return {
      count,
      used,
      available: Math.max(0, count - used),
    };
  }

  return {
    count,
    used: 0,
    available: count,
  };
};

const navigateToAnjuProcess = () => {
  uni.navigateTo({ url: "/pages/askForTenantInfo/anjuprocess/anjuprocess" });
};

const isQuotaAvailable = (item) => {
  return getQuotaStats(item).available > 0;
};

const isQuotaSelected = (index) => {
  return state.selectedQuotaIndex === index;
};

const handleQuotaSelect = (item, index) => {
  if (!isQuotaAvailable(item)) {
    uni.showToast({ title: "该配额不可用", icon: "none" });
    return;
  }
  state.selectedQuotaIndex = index;
};

const canSubmitOrder = computed(() => {
  return !submitting.value && state.selectedQuotaIndex >= 0;
});

const getSelectedQuotaItem = () => {
  if (state.selectedQuotaIndex < 0) return null;
  return quotaContentList.value[state.selectedQuotaIndex].type || null;
};

const form = reactive({
  name: "",
  idCard: "",
  title: "",
  phone: "",
});

const validate = () => {
  if (!form.name.trim()) {
    uni.showToast({ title: "请填写承租人姓名", icon: "none" });
    return false;
  }

  const idCard = form.idCard.trim().toUpperCase();
  if (!idCard) {
    uni.showToast({ title: "请填写身份证号", icon: "none" });
    return false;
  }
  if (!/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(idCard)) {
    uni.showToast({ title: "请输入正确的身份证号", icon: "none" });
    return false;
  }

  if (!form.title.trim()) {
    uni.showToast({ title: "请填写职务信息", icon: "none" });
    return false;
  }

  const phone = form.phone.trim();
  if (!phone) {
    uni.showToast({ title: "请填写手机号", icon: "none" });
    return false;
  }
  if (!/^1\d{10}$/.test(phone)) {
    uni.showToast({ title: "请输入正确的手机号", icon: "none" });
    return false;
  }

  if (!productId.value) {
    uni.showToast({ title: "商品参数异常", icon: "none" });
    return false;
  }

  if (state.selectedQuotaIndex < 0) {
    uni.showToast({ title: "请先选择可用配额", icon: "none" });
    return false;
  }

  return true;
};

const getStorageAsync = (key) => {
  return new Promise((resolve) => {
    uni.getStorage({
      key,
      success: (res) => resolve(res?.data ?? null),
      fail: () => resolve(null),
    });
  });
};

const removeStorageAsync = (key) => {
  return new Promise((resolve) => {
    uni.removeStorage({
      key,
      complete: () => resolve(),
    });
  });
};

const handleSubmit = async () => {
  if (!validate()) return;

  // 先 await 读取套餐缓存，确保 payload 使用到正确值
  const selectedPackage = await getStorageAsync("selectedPackageInfo");

  // 将selectedPackage强制转化为字符串传给后端接口，接口会根据字符串内容判断是否有套餐信息以及套餐类型
  const selectedPackageStr = selectedPackage
    ? JSON.stringify(selectedPackage)
    : "";

  //await removeStorageAsync("selectedPackageInfo");

  submitting.value = true;
  const payload = {
    productId: productId.value,
    tenantName: form.name.trim(),
    tenantIdCard: form.idCard.trim().toUpperCase(),
    tenantTitle: form.title.trim(),
    tenantPhone: form.phone.trim(),
    userid: state.userinfo.id,
    username: state.userinfo.name,
    userphone: state.userinfo.phone,
    ccompanyid: state.userinfo.ccompanyid,
    selectedQuota: getSelectedQuotaItem(), // 配额类型
    selectedPackage: selectedPackageStr, // 选中的套餐信息（如果有）
  };
  // 调用接口
  uni.request({
    url: "https://mvpme82.cloud/api/createanjuorderfromminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      submitting.value = false;
      if (res && res.data && res.data.retcode === "200") {
        uni.showToast({ title: "订单提交成功", icon: "success" });
        // 提交成功后可以选择清空表单或者返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.showToast({
          title: res.data?.str_err_code || "订单提交失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      submitting.value = false;
      uni.showToast({ title: "网络异常，无法连接接口", icon: "none" });
    },
  });
};

onLoad((options) => {
  scheduleTenantNavBarStyle();
  productId.value = options?.productId ? String(options.productId) : "";

  if (!productId.value) {
    uni.showToast({ title: "商品参数异常", icon: "none" });
    setTimeout(() => {
      uni.navigateBack();
    }, 300);
  }

  // 先从本地session获取用户id和ccompanyid，用ccompanyid查询anju配额及占用情况
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (!state.userinfo || !state.userinfo.ccompanyid) {
        uni.showToast({ title: "用户信息异常，请重新登录", icon: "none" });
        setTimeout(() => {
          uni.reLaunch({ url: "/pages/login/login" });
        }, 1000);
      } else {
        let payload = {
          ccompanyid: state.userinfo.ccompanyid,
        };
        // 查询接口
        uni.request({
          url: "https://mvpme82.cloud/api/getanjucreditstatusbyccompanyid",
          method: "POST",
          header: { "Content-Type": "application/json" },
          data: payload,
          success: (res) => {
            if (res && res.data && res.data.retcode === "200") {
              // 处理查询结果，更新页面状态
              state.anjucredits = res.data.data[0] || {};
              state.selectedQuotaIndex = -1;
            } else {
              console.error("查询配额失败：", res.data);
              uni.showToast({
                title: "查询配额失败，请稍后重试",
                icon: "none",
              });
            }
          },
          fail: (err) => {
            console.error("查询配额失败：", err);
            uni.showToast({ title: "查询配额失败，请稍后重试", icon: "none" });
          },
        });
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
/* 整页内容区 #020713；顶栏为默认浅底黑字（pages.json + applyTenantNavBarStyle） */

.add-user-container {
  min-height: 100vh;
  padding: 24rpx 40rpx;
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
  background: #020713;
  box-sizing: border-box;
}

/* 渐变描边卡片（小程序用 padding 模拟 border-image，171° 与 product-detail 一致）
 * 描边用 rgba，禁止对容器设 opacity——否则子元素文字会一并乘透明度变暗 */
.tenant-card-shell {
  width: 669rpx;
  max-width: 100%;
  margin: 0 auto 24rpx;
  padding: 2rpx;
  box-sizing: border-box;
  border-radius: 41rpx;
  background: linear-gradient(
    171deg,
    rgba(128, 195, 246, 0.74) 0%,
    rgba(36, 67, 104, 0.74) 48%,
    rgba(156, 205, 240, 0.74) 100%
  );
}

.tenant-card-shell--quota {
  min-height: 573rpx;
}

.tenant-card-shell--form {
  min-height: 590rpx;
}

.tenant-card-inner {
  border-radius: 39rpx;
  padding: 33rpx 31rpx 28rpx 31rpx;
  box-sizing: border-box;
  background: rgb(11, 26, 49);
}

.tenant-card-inner--form {
  padding: 28rpx 31rpx 36rpx;
}

.section-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12rpx;
}

.section-bar {
  width: 6rpx;
  height: 28rpx;
  margin-right: 12rpx;
  border-radius: 3rpx;
  background: linear-gradient(180deg, #80c3f6 0%, #2c6ebc 100%);
  flex-shrink: 0;
}

.quota-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.quota-subtitle {
  display: block;
  font-size: 24rpx;
  color: rgba(184, 220, 237, 0.75);
  margin-bottom: 24rpx;
  line-height: 1.4;
}

/* 单条配额：608×205，圆角 23；选中仅边框改为 #e3c695，背景与未选一致 */
.quota-item {
  width: 608rpx;
  max-width: 100%;
  height: 205rpx;
  margin: 0 auto 20rpx;
  padding: 20rpx 22rpx 18rpx;
  box-sizing: border-box;
  border-radius: 23rpx;
  border: solid 1rpx #3662ac;
  background: rgba(20, 42, 74, 0.65);
}

.quota-item:last-child {
  margin-bottom: 0;
}

.quota-item-selected {
  border: solid 1rpx #e3c695;
  background: rgba(20, 42, 74, 0.65);
}

.quota-item-disabled {
  opacity: 0.45;
}

.quota-item-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.quota-right-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  min-width: 0;
  justify-content: flex-end;
}

.quota-type {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.quota-type-text {
  font-family: PingFangSC-Regular, "PingFang SC", sans-serif;
  font-size: 22rpx;
  font-weight: normal;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
}

.quota-type-deduction {
  width: 98rpx;
  height: 31rpx;
  border-radius: 8rpx;
  border: none;
  background-color: transparent;
  background-image: url("https://mvpme82.cloud/data/0397e568-d54b-4e28-9ec0-653aed67e808_1774551384264.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.quota-type-discount {
  width: 99rpx;
  height: 31rpx;
  border-radius: 9rpx;
  border: none;
  background-color: transparent;
  background-image: url("https://mvpme82.cloud/data/de767c00-2eb7-4197-a912-db096d8ab575_1774551462319.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.quota-main-highlight {
  flex: 1;
  min-width: 0;
  text-align: right;
  font-family: PingFangSC-Regular, "PingFang SC", sans-serif;
  font-size: 25rpx;
  font-weight: normal;
  letter-spacing: 0;
  color: #e9d591;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quota-selector {
  flex-shrink: 0;
  width: 29rpx;
  height: 29rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.45);
  box-sizing: border-box;
  background: transparent;
}

.quota-selector.checked {
  border-color: #f8d899;
  background: #f8d899;
}

.quota-item-selected .quota-selector.checked {
  border-color: #e3c695;
  background: #f8d899;
}

.quota-selector.disabled {
  opacity: 0.35;
}

/* 与首页「优惠房源」下 data-row-anju 同一套底图；尺寸稿 555×97；竖线距上 20、距下 18 */
.quota-metrics {
  display: block;
  position: relative;
  width: 555rpx;
  height: 97rpx;
  margin: 0 auto;
  padding: 0;
  border-radius: 16rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.quota-metrics-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-width: 0;
  display: block;
}

.quota-metrics-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 12rpx;
}

.quota-metric {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  box-sizing: border-box;
}

/* 竖线不顶格：内区域高 97-20-18=59rpx */
.quota-metric-divider {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 1rpx;
  height: 100%;
  padding-top: 20rpx;
  padding-bottom: 18rpx;
  box-sizing: border-box;
}

.quota-metric-divider-line {
  flex: 1;
  width: 100%;
  min-height: 0;
  background: rgba(0, 0, 0, 0.45);
}

.quota-metric-label {
  width: 71rpx;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rpx;
  padding-top: 0;
  font-family:
    PingFang SC,
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 16rpx;
  font-weight: normal;
  line-height: 22rpx;
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
  white-space: nowrap;
  overflow: visible;
}

.quota-metric-value {
  display: block;
  margin-left: auto;
  margin-right: auto;
  font-family:
    PingFang SC,
    PingFangSC-Semibold,
    -apple-system,
    sans-serif;
  font-size: 47rpx;
  font-weight: 600;
  line-height: 1.05;
  text-align: center;
}

/* 深色底统计条：浅色字；勿用首页浅色底用的 #25395b */
.quota-metric:nth-of-type(1) .quota-metric-value {
  color: #ffffff;
  min-height: 0;
}

.quota-metric:nth-of-type(3) .quota-metric-value {
  color: #f0dff8;
  min-height: 0;
}

.quota-metric:nth-of-type(5) .quota-metric-value {
  color: #9cf5e8;
  min-height: 0;
}

.quota-empty {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  padding: 24rpx 0;
}

.form-item {
  margin-bottom: 28rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-family: PingFangSC-Regular, "PingFang SC", sans-serif;
  font-size: 30rpx;
  font-weight: normal;
  color: #ffffff;
  margin-bottom: 14rpx;
  letter-spacing: 0;
}

.required::before {
  content: "*";
  color: #e9d591;
  margin-right: 6rpx;
}

/* 输入：608×65 稿，渐变描边 0°；内层实底 + 圆角 */
.input-shell {
  width: 608rpx;
  max-width: 100%;
  min-height: 65rpx;
  padding: 1rpx;
  box-sizing: border-box;
  border-radius: 13rpx;
  background: linear-gradient(0deg, #256ac3 0%, #193b74 52%, #2663b9 100%);
}

.input {
  width: 100%;
  height: 63rpx;
  line-height: 63rpx;
  border-radius: 12rpx;
  padding: 0 22rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  color: #ffffff;
  background: rgba(8, 22, 48, 0.95);
}

.bottom-order-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 750rpx;
  margin: 0 auto;
  z-index: 99;
  min-height: 122rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  padding-top: 16rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.bottom-order-bar-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #30539c;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.bottom-order-btn-wrap {
  position: relative;
  z-index: 1;
  padding: 0 42rpx;
  max-width: 750rpx;
  margin: 0 auto;
}

.bottom-order-btn {
  width: 100%;
  height: 71rpx;
  line-height: 71rpx;
  border: none;
  border-radius: 36rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #061730;
  background: linear-gradient(0deg, #dab26b 0%, #fcefd4 100%);
}

.bottom-order-btn::after {
  border: none;
}

.bottom-order-btn[disabled] {
  opacity: 0.45;
  color: rgba(6, 23, 48, 0.55);
}

.tenant-info-tip {
  width: 669rpx;
  max-width: 100%;
  margin: 22rpx auto 30rpx;
  padding: 18rpx 28rpx;
  box-sizing: border-box;
  border-radius: 20rpx;
  border: 1rpx solid rgba(116, 176, 255, 0.38);
  background: linear-gradient(
    135deg,
    rgba(22, 58, 109, 0.78) 0%,
    rgba(15, 39, 76, 0.82) 100%
  );
  font-family: PingFangSC-Regular, "PingFang SC", sans-serif;
  font-size: 24rpx;
  line-height: 38rpx;
  color: rgba(214, 233, 255, 0.96);
  letter-spacing: 0.4rpx;
  text-align: left;
  box-shadow: 0 10rpx 24rpx rgba(7, 20, 43, 0.22);
  transition: all 0.2s ease;
}

.tenant-info-tip:active {
  transform: scale(0.985);
  border-color: rgba(139, 197, 255, 0.55);
  background: linear-gradient(
    135deg,
    rgba(27, 68, 126, 0.85) 0%,
    rgba(18, 48, 91, 0.9) 100%
  );
}
</style>

<style>
/* 小程序 input placeholder 需单独类名 */
.tenant-input-ph {
  color: rgba(184, 220, 237, 0.45);
  font-size: 28rpx;
}
</style>

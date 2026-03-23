<template>
  <view class="add-user-container">
    <view class="quota-card">
      <view class="quota-title">配额使用情况</view>
      <view class="quota-subtitle">请选择一个可用配额后再发起订单</view>
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
          <text class="quota-type" :class="`quota-type-${item.type}`">{{
            getQuotaTypeLabel(item)
          }}</text>
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
            >
              <text v-if="isQuotaSelected(index)">✓</text>
            </view>
          </view>
        </view>

        <view class="quota-metrics">
          <view class="quota-metric">
            <text class="quota-metric-label">共计</text>
            <text class="quota-metric-value">{{
              getQuotaStats(item).count
            }}</text>
            <text class="quota-metric-unit">份</text>
          </view>
          <view class="quota-metric">
            <text class="quota-metric-label">使用中</text>
            <text class="quota-metric-value warning">{{
              getQuotaStats(item).used
            }}</text>
            <text class="quota-metric-unit">份</text>
          </view>
          <view class="quota-metric">
            <text class="quota-metric-label">可用</text>
            <text class="quota-metric-value success">{{
              getQuotaStats(item).available
            }}</text>
            <text class="quota-metric-unit">份</text>
          </view>
        </view>
      </view>
      <view v-if="quotaContentList.length === 0" class="quota-empty">
        暂无配额数据
      </view>
    </view>

    <view class="form-card">
      <view class="form-item">
        <text class="label required">承租人姓名</text>
        <input
          class="input"
          type="text"
          v-model="form.name"
          placeholder="请输入承租人姓名"
          maxlength="20"
        />
      </view>

      <view class="form-item">
        <text class="label required">身份证号</text>
        <input
          class="input"
          type="text"
          v-model="form.idCard"
          placeholder="请输入身份证号"
          maxlength="18"
        />
      </view>

      <view class="form-item">
        <text class="label required">职务信息</text>
        <input
          class="input"
          type="text"
          v-model="form.title"
          placeholder="请输入职务信息"
          maxlength="30"
        />
      </view>

      <view class="form-item">
        <text class="label required">手机号</text>
        <input
          class="input"
          type="number"
          v-model="form.phone"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>
    </view>
  </view>

  <view class="bottom-order-bar">
    <button
      class="bottom-order-btn"
      :disabled="!canSubmitOrder"
      @click="handleSubmit"
    >
      {{ submitting ? "提交中..." : "发起订单" }}
    </button>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

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

  await removeStorageAsync("selectedPackageInfo");

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
              console.log("查询配额成功：", res.data.data);
              state.anjucredits = res.data.data[0] || {};
              console.log("配额内容列表：", state.anjucredits.anjuContentArray);
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
        // 获取到用户信息和公司ID后，可以在这里调用查询配额的接口，传入ccompanyid参数
        // 查询接口示例：
        // getAnjuQuota(state.userinfo.ccompanyid).then(quotaData => {
        //   // 处理查询结果，更新页面状态
        // }).catch(err => {
        //   console.error("查询配额失败：", err);
        //   uni.showToast({ title: "查询配额失败，请稍后重试", icon: "none" });
        // });
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
.add-user-container {
  min-height: 100vh;
  padding: 30rpx;
  padding-bottom: 150rpx;
  background: #f6f7fb;
  box-sizing: border-box;
}

.form-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.quota-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid #e8eef6;
  box-shadow: 0 10rpx 28rpx rgba(16, 24, 40, 0.06);
}

.quota-title {
  font-size: 32rpx;
  color: #111827;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.quota-subtitle {
  font-size: 24rpx;
  color: #64748b;
  margin-bottom: 18rpx;
}

.quota-item {
  padding: 22rpx 20rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #e5ebf5;
  box-shadow: 0 6rpx 20rpx rgba(15, 23, 42, 0.04);
  transition: all 0.2s ease;
}

.quota-item:last-child {
  margin-bottom: 0;
}

.quota-item-selected {
  border-color: #2563eb;
  box-shadow: 0 10rpx 26rpx rgba(37, 99, 235, 0.16);
  background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%);
}

.quota-item-disabled {
  opacity: 0.5;
}

.quota-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.quota-right-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.quota-type {
  font-size: 22rpx;
  line-height: 1;
  padding: 10rpx 14rpx;
  border-radius: 999rpx;
  color: #1d4ed8;
  background: #e8f0ff;
}

.quota-type-deduction {
  color: #155e75;
  background: #dff7ff;
}

.quota-type-discount {
  color: #7c2d12;
  background: #ffedd5;
}

.quota-main-highlight {
  font-size: 30rpx;
  color: #0f172a;
  font-weight: 700;
}

.quota-selector {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  border: 2rpx solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 20rpx;
  background: #ffffff;
}

.quota-selector.checked {
  border-color: #2563eb;
  background: #2563eb;
}

.quota-selector.disabled {
  border-color: #d1d5db;
  background: #f3f4f6;
}

.quota-metrics {
  display: flex;
  gap: 14rpx;
  margin-bottom: 12rpx;
}

.quota-metric {
  flex: 1;
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 12rpx;
  text-align: center;
}

.quota-metric-label {
  display: block;
  font-size: 22rpx;
  color: #64748b;
}

.quota-metric-value {
  font-size: 34rpx;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  margin: 4rpx 0;
}

.quota-metric-value.warning {
  color: #ea580c;
}

.quota-metric-value.success {
  color: #16a34a;
}

.quota-metric-unit {
  font-size: 20rpx;
  color: #94a3b8;
}

.quota-text {
  font-size: 24rpx;
  color: #475569;
  line-height: 1.6;
}

.quota-empty {
  font-size: 26rpx;
  color: #9ca3af;
  text-align: center;
  padding: 16rpx 0;
}

.form-item {
  margin-bottom: 28rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 12rpx;
}

.required::before {
  content: "*";
  color: #f56c6c;
  margin-right: 6rpx;
}

.input {
  width: 100%;
  height: 84rpx;
  line-height: 84rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  color: #333333;
  background: #ffffff;
}

.bottom-order-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 98rpx;
  background-color: #ffffff;
  border-top: 1rpx solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
  z-index: 99;
}

.bottom-order-btn {
  width: 100%;
  height: 72rpx;
  line-height: 72rpx;
  border: none;
  border-radius: 36rpx;
  background: #e53935;
  color: #ffffff;
  font-size: 32rpx;
}

.bottom-order-btn::after {
  border: none;
}

.bottom-order-btn[disabled] {
  opacity: 0.6;
}
</style>

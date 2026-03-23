<template>
  <view class="add-user-container">
    <view class="form-card">
      <view class="form-item">
        <text class="label required">姓名</text>
        <input
          class="input"
          type="text"
          v-model="form.name"
          placeholder="请输入姓名"
          maxlength="20"
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

      <view class="form-item">
        <text class="label required">职务</text>
        <input
          class="input"
          type="text"
          v-model="form.title"
          placeholder="请输入职务"
          maxlength="30"
        />
      </view>

      <view class="form-item">
        <text class="label required">电子邮箱</text>
        <input
          class="input"
          type="text"
          v-model="form.email"
          placeholder="请输入电子邮箱"
          maxlength="50"
        />
      </view>

      <button class="submit-btn" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? "提交中..." : "提交" }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

const state = reactive({
  userinfo: {},
});

const submitting = ref(false);
const form = reactive({
  name: "",
  phone: "",
  title: "",
  email: "",
  adminuserid: "",
  ccompanyid: "",
});

const validate = () => {
  if (!form.name.trim()) {
    uni.showToast({ title: "请填写姓名", icon: "none" });
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

  if (!form.title.trim()) {
    uni.showToast({ title: "请填写职务", icon: "none" });
    return false;
  }

  const email = form.email.trim();
  if (!email) {
    uni.showToast({ title: "请填写电子邮箱", icon: "none" });
    return false;
  }
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
    uni.showToast({ title: "请输入正确的电子邮箱", icon: "none" });
    return false;
  }

  return true;
};

const handleSubmit = () => {
  if (!validate()) return;

  submitting.value = true;
  const payload = {
    name: form.name.trim(),
    phone: form.phone.trim(),
    title: form.title.trim(),
    email: form.email.trim(),
    adminuserid: state.userinfo.id, // 从用户信息中获取管理员用户ID
    ccompanyid: state.userinfo.ccompanyid, // 从用户信息中获取公司ID
  };

  uni.request({
    url: "https://mvpme82.cloud/api/adduserforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        uni.showToast({ title: "添加成功", icon: "success" });
        form.name = "";
        form.phone = "";
        form.title = "";
        form.email = "";
        setTimeout(() => {
          uni.navigateBack();
        }, 300);
      } else {
        //模态弹窗提示
        uni.showModal({
          title: "添加失败",
          content: res.data ? res.data.str_err_code : "未知错误",
          showCancel: false,
        });
      }
    },
    fail: () => {
      uni.showToast({ title: "网络异常，请稍后重试", icon: "none" });
    },
    complete: () => {
      submitting.value = false;
    },
  });
};

onShow(() => {
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
      } else {
        uni.showToast({ title: "用户信息异常", icon: "none" });
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
.add-user-container {
  min-height: 100vh;
  padding: 30rpx;
  background: #f6f7fb;
  box-sizing: border-box;
}

.form-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
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

.submit-btn {
  margin-top: 20rpx;
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  border: none;
  border-radius: 44rpx;
  background: #1677ff;
  color: #ffffff;
  font-size: 30rpx;
}

.submit-btn::after {
  border: none;
}

.submit-btn[disabled] {
  opacity: 0.6;
}
</style>

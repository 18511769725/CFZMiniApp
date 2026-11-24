<template>
  <view class="user-info-container">
    <!-- 表单区域 -->
    <form>
      <!-- 手机号（不可修改） -->
      <view class="form-item">
        <label class="form-label">手机号</label>
        <view class="form-input disabled-input">{{ userForm.phone }}</view>
      </view>
      <!-- 姓名（必填） -->
      <view class="form-item">
        <label class="form-label required">姓名</label>
        <input
          class="form-input"
          type="text"
          v-model="userForm.name"
          placeholder="请输入您的姓名"
          :disabled="isInfoReadOnly"
        />
      </view>

      <!-- 电子邮箱（必填） -->
      <view class="form-item">
        <label class="form-label required">电子邮箱</label>
        <input
          class="form-input"
          type="email"
          v-model="userForm.email"
          placeholder="请输入您的电子邮箱"
          :disabled="isInfoReadOnly"
        />
      </view>

      <!-- 职位信息（必填） -->
      <view class="form-item">
        <label class="form-label required">职位信息</label>
        <input
          class="form-input"
          type="text"
          v-model="userForm.title"
          placeholder="请输入您的职位"
          :disabled="isInfoReadOnly"
        />
      </view>

      <!-- 企业信用编码（必填） -->
      <view class="form-item">
        <label class="form-label required">企业信用编码</label>
        <input
          class="form-input"
          type="text"
          v-model="userForm.creditcode"
          placeholder="请输入企业信用编码"
          :disabled="isInfoReadOnly"
        />
        <view v-if="creditcodeError" class="error-tip"
          >企业信用编码异常，请重新填写</view
        >
      </view>

      <!-- 提交按钮 -->
      <button
        class="submit-btn"
        form-type="submit"
        :disabled="state.isSubmitting"
        @click="handleFormSubmit"
      >
        提交信息
      </button>
    </form>
  </view>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
// 页面状态数据
const isSubmitting = ref(false); // 提交按钮加载状态
const creditcodeError = ref(false); // 企业信用编码异常提示
const isInfoReadOnly = ref(false); // 表单是否只读（备用，可根据需求调整）

// 用户表单数据（与接口字段对应）
const state = reactive({
  errorMsg: "",
  loading: false,
  isSubmitting: false,
});
// 用户表单数据（与接口字段对应）
const userForm = reactive({
  phone: "", // 上一页传递的手机号
  name: "",
  email: "",
  title: "",
  creditcode: "",
});

// 页面加载时获取上一页传递的phone参数
onLoad((option) => {
  // 接收上一页get方法传递的phone参数
  if (option.phone) {
    userForm.phone = option.phone;
    // 手机号存在则拉取用户信息
    getUserInfoByPhone();
  } else {
    uni.showToast({
      title: "未获取到手机号",
      icon: "none",
    });
  }
});

// 拉取用户信息：post请求访问/getuserinfobyphone接口
const getUserInfoByPhone = () => {
  let payload = {
    phone: userForm.phone,
  };
  uni.request({
    url: "https://mvpme82.cloud/api/getuserinfobyphone", // 目标接口地址
    method: "POST", // 接口请求方式（默认POST，若接口要求GET可修改）
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      state.loading = false;
      // 接口返回格式：retcode=200 为成功
      if (res && res.data && res.data.retcode === "200") {
        // 获取数据成功：处理返回的数据
        userForm.name = res.data.data[0].name || "";
        userForm.email = res.data.data[0].email || "";
        userForm.title = res.data.data[0].title || "";
        userForm.creditcode = res.data.data[0].companycreditcode || "";
      } else {
        // 获取数据失败：显示接口返回的错误信息（若无则用默认提示）
        state.errorMsg = res.str_err_code || "获取数据失败，请检查网络！";
      }
    },
    fail: (err) => {
      state.loading = false;
      // 网络错误处理（如接口不可达、超时等）
      state.errorMsg = "网络异常，无法连接登录接口";
    },
  });
};

// 表单提交处理
const handleFormSubmit = async (e) => {
  e.preventDefault(); // 阻止默认表单提交行为

  state.isSubmitting = true;

  // 1. 表单校验（必填项验证）
  const { phone, name, email, title, creditcode } = userForm;
  // 1. 姓名校验：必填 + 最长50字符
  if (!name.trim()) {
    return uni.showToast({ title: "请填写姓名", icon: "none" });
  }
  if (name.trim().length > 10) {
    return uni.showToast({ title: "姓名长度不能超过10个字符", icon: "none" });
  }

  // 2. 电子邮箱校验：必填 + 格式正确 + 最长50字符
  if (!email.trim()) {
    return uni.showToast({ title: "请填写电子邮箱", icon: "none" });
  }
  if (email.trim().length > 30) {
    return uni.showToast({
      title: "电子邮箱长度不能超过30个字符",
      icon: "none",
    });
  }
  const emailReg = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailReg.test(email.trim())) {
    return uni.showToast({ title: "请填写正确的电子邮箱格式", icon: "none" });
  }

  // 3. 职位信息校验：必填 + 最长50字符
  if (!title.trim()) {
    return uni.showToast({ title: "请填写职位信息", icon: "none" });
  }
  if (title.trim().length > 20) {
    return uni.showToast({
      title: "职位信息长度不能超过20个字符",
      icon: "none",
    });
  }

  // 4. 企业信用编码校验：必填 + 最长50字符
  if (!creditcode.trim()) {
    return uni.showToast({ title: "请填写企业信用编码", icon: "none" });
  }
  if (creditcode.trim().length > 20) {
    return uni.showToast({
      title: "企业信用编码长度不能超过20个字符",
      icon: "none",
    });
  }
  let payload = {
    phone: userForm.phone, // 携带手机号
    name: userForm.name.trim(),
    email: userForm.email.trim(),
    title: userForm.title.trim(),
    creditcode: userForm.creditcode.trim(),
  };
  uni.request({
    url: "https://mvpme82.cloud/api/submituserinfobyphone", // 目标接口地址
    method: "POST", // 接口请求方式（默认POST，若接口要求GET可修改）
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      // 接口返回格式：retcode=200 为成功
      if (res && res.data && res.data.retcode === "200") {
        uni.showToast({ title: "信息更新成功", icon: "success" });
        setTimeout(() => {
          uni.navigateTo({ url: "/pages/login/login" });
        }, 200);
      } else {
        uni.showToast({
          title: "信息更新失败！",
          icon: "none",
          duration: 1000,
        });
      }
      state.isSubmitting = false;
    },
    fail: (err) => {
      uni.showToast({ title: "信息更新失败！", icon: "none", duration: 1000 });
      state.isSubmitting = false;
    },
  });
};
</script>

<style scoped lang="scss">
.user-info-container {
  padding: 40rpx 30rpx;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
}

.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 40rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 15rpx;
}

.required {
  position: relative;
  &::before {
    content: "*";
    color: #ff4d4f;
    position: absolute;
    left: -15rpx;
    top: 0;
  }
}

.form-input {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

.disabled-input {
  background-color: #f5f5f5;
  color: #999999;
  border-color: #f0f0f0;
}

.error-tip {
  font-size: 24rpx;
  color: #ff4d4f;
  margin-top: 10rpx;
  padding-left: 20rpx;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #c9a76f;
  border-radius: 45rpx;
  border: none;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  margin-top: 20rpx;
}

.submit-btn::after {
  border: none;
}

.submit-btn:disabled {
  background-color: #dcdcdc;
  color: #999999;
}
</style>

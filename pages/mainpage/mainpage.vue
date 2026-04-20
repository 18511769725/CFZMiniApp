<template>
  <view class="main-page">
    <!-- 使用 scroll-view 承接纵向滚动，减轻原生页在 Tab 页底部「要多划几下才动」的问题 -->
    <scroll-view
      scroll-y
      class="main-page-scroll"
      :enable-flex="true"
      :show-scrollbar="false"
      enhanced
    >
      <view class="main-scroll-inner">
        <image
          class="page-full-bg"
          src="https://mvpme82.cloud/data/d2b79840-d731-4e07-b52c-c10aa594067e_1774537067801.png"
          mode="widthFix"
        />
        <view class="main-page-body">
          <!-- 平台标题（叠在全页背景上，不再单独拼半张顶图） -->
          <view class="header-section">
            <view class="platform-title">
              <text class="title-cn">朝阳企业服务平台</text>
              <text class="title-en">Chaoyang Enterprise Service Platform</text>
            </view>
          </view>

          <!-- 企业信息卡片 -->
          <view class="enterprise-card">
            <view class="enterprise-info">
              <text class="enterprise-name">{{
                state.ccompanyinfo.name || "企业配额总览"
              }}</text>
              <view class="enterprise-tag">
                <image
                  v-if="companyLevelLabel"
                  class="enterprise-tag-icon"
                  :src="companyLevelLabel"
                  mode="aspectFit"
                ></image>
              </view>
            </view>
            <view class="h-divider">
              <image
                class="h-divider-img"
                src="https://mvpme82.cloud/data/b1220cbf-a4a6-4e04-8ede-1dca13b04767_1774526057860.png"
                mode="scaleToFill"
              />
            </view>

            <!-- 配额配置概览 -->
            <view class="quota-overview">
              <text class="quota-title">配额配置情况与当前使用进度</text>
              <view class="overview-grid">
                <view class="overview-item" v-if="state.showAnju === 1">
                  <image
                    class="overview-item-bg"
                    src="https://mvpme82.cloud/data/556123f6-ea66-4cb5-9614-bdb1a0c8a975_1774525986214.png"
                    mode="scaleToFill"
                  />
                  <view class="overview-item-body">
                    <text class="overview-label">益企•安居</text>
                    <!-- 该位置根据anjuQuotaItems数组里面的对象，如果有对象的type===deduction,则显示标签‘优惠房源’，如果有对象的type===discount，则再显示一个‘补贴房源’的标签，如果两个类型都有则都显示，纵向排列居中。如果anjuQuotaItems数组长度为0，则显示未配置权益 -->
                    <text class="overview-value">{{
                      state.anjucredits?.anjuContentArray
                        ? state.anjucredits.anjuContentArray
                            .map((item) =>
                              item.type === "discount"
                                ? `补贴房源`
                                : `优惠房源`,
                            )
                            .join("\n")
                        : "待配置权益"
                    }}</text>
                  </view>
                </view>
                <view class="overview-item" v-if="state.showYuexiang === 1">
                  <image
                    class="overview-item-bg"
                    src="https://mvpme82.cloud/data/556123f6-ea66-4cb5-9614-bdb1a0c8a975_1774525986214.png"
                    mode="scaleToFill"
                  />
                  <view class="overview-item-body">
                    <text class="overview-label">益企•悦享</text>
                    <text class="overview-value">{{
                      formatPointsWrape(yuexiangQuota.available)
                    }}</text>
                  </view>
                </view>
                <view class="overview-item" v-if="state.showKanghu === 1">
                  <image
                    class="overview-item-bg"
                    src="https://mvpme82.cloud/data/556123f6-ea66-4cb5-9614-bdb1a0c8a975_1774525986214.png"
                    mode="scaleToFill"
                  />
                  <view class="overview-item-body">
                    <text class="overview-label">益企•康护</text>
                    <text class="overview-value">{{
                      // 如果state.kanghucredits不存在，则返回待配置；如果存在，按照state.kanghucredits.grade的值，为1：钻石级；2：铂金级；3：黄金级；4：白银级。加一个换行符，然后是 支持state.kanghucredits.buyamount人
                      state.kanghucredits
                        ? `高管医疗\n支持${state.kanghucredits.patchcount || 0}人`
                        : "待配置权益"
                    }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 益企·安居模块 -->
          <view class="module module-anju" v-if="state.showAnju === 1">
            <image
              class="module-anju-bg"
              src="https://mvpme82.cloud/data/22bd4d89-bed2-4013-97db-da31a8eae3b6_1774526009494.png"
              mode="scaleToFill"
            ></image>

            <view class="module-header">
              <view class="module-header-left">
                <text class="module-title">益企·安居</text>
                <view class="module-status-tag module-status-anju">
                  <text class="module-status-tag-text">{{
                    anjuStatusText
                  }}</text>
                </view>
              </view>
              <view
                class="module-detail-btn module-detail-anju"
                @tap="goProductList(0)"
              >
                <text class="module-detail-btn-text">查看详情</text>
              </view>
            </view>
            <text class="module-subtitle">住房保障助企安居无忧</text>
            <view class="h-divider">
              <image
                class="h-divider-img"
                src="https://mvpme82.cloud/data/b1220cbf-a4a6-4e04-8ede-1dca13b04767_1774526057860.png"
                mode="scaleToFill"
              />
            </view>

            <!-- 优惠房源/补贴房源（勿与 v-for 同节点写 v-if，易在真机出现滚动/层叠异常） -->
            <template v-if="anjuQuotaItems.length">
              <view
                v-for="item in anjuQuotaItems"
                :key="item.key"
                class="section"
              >
                <view class="section-header">
                  <text class="section-title">{{ item.title }}</text>
                  <text class="section-tip">{{ item.highlight }}</text>
                </view>
                <view class="data-row-anju">
                  <image
                    class="data-row-anju-bg"
                    src="https://mvpme82.cloud/data/cb9b5570-3e00-478d-84f3-6cfbad5ad3a8_1774526033903.png"
                    mode="scaleToFill"
                  />
                  <view class="data-row-anju-body">
                    <view class="data-item">
                      <text class="data-label">支持人数</text>
                      <text class="data-value">{{ item.count }}</text>
                    </view>
                    <view class="data-item">
                      <text class="data-label">已使用</text>
                      <text class="data-value used">{{ item.used }}</text>
                    </view>
                    <view class="data-item">
                      <text class="data-label">可使用</text>
                      <text class="data-value available">{{
                        item.available
                      }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </template>
            <view v-else class="quota-empty-text">暂无安居配额配置</view>
          </view>

          <!-- 益企·悦享模块 -->
          <view class="module module-yuexiang" v-if="state.showYuexiang === 1">
            <image
              class="module-yuexiang-bg"
              src="https://mvpme82.cloud/data/36bf8077-3706-4aaf-b92c-9c921a6e5fae_1774526084326.png"
              mode="scaleToFill"
            ></image>

            <view class="module-header">
              <view class="module-header-left">
                <text class="module-title">益企·悦享</text>
                <view class="module-status-tag module-status-yuexiang">
                  <text class="module-status-tag-text">{{
                    yuexiangQuota.statusText
                  }}</text>
                </view>
              </view>
              <view
                class="module-detail-btn module-detail-yuexiang"
                @tap="goProductList(1)"
              >
                <text class="module-detail-btn-text">查看详情</text>
              </view>
            </view>
            <text class="module-subtitle">专属积分悦享朝阳商务资源</text>
            <view class="h-divider">
              <image
                class="h-divider-img"
                src="https://mvpme82.cloud/data/b1220cbf-a4a6-4e04-8ede-1dca13b04767_1774526057860.png"
                mode="scaleToFill"
              />
            </view>

            <view class="section section-yuexiang-quota">
              <text class="section-title">额度总览</text>
              <view class="yuexiang-quota-grid">
                <view class="yuexiang-quota-cell">
                  <image
                    class="yuexiang-quota-cell-bg"
                    src="https://mvpme82.cloud/data/638bffb3-0c50-4453-afed-c398bc3101fb_1774526114899.png"
                    mode="scaleToFill"
                  />
                  <view class="yuexiang-quota-cell-body">
                    <text class="data-label">总额度</text>
                    <view class="yuexiang-quota-line"></view>
                    <text class="data-value">{{
                      formatAmountWan(yuexiangQuota.total)
                    }}</text>
                  </view>
                </view>
                <view class="yuexiang-quota-cell">
                  <image
                    class="yuexiang-quota-cell-bg"
                    src="https://mvpme82.cloud/data/638bffb3-0c50-4453-afed-c398bc3101fb_1774526114899.png"
                    mode="scaleToFill"
                  />
                  <view class="yuexiang-quota-cell-body">
                    <text class="data-label">已使用</text>
                    <view class="yuexiang-quota-line"></view>
                    <text class="data-value used">{{
                      formatAmountWan(yuexiangQuota.used)
                    }}</text>
                  </view>
                </view>
                <view class="yuexiang-quota-cell">
                  <image
                    class="yuexiang-quota-cell-bg"
                    src="https://mvpme82.cloud/data/638bffb3-0c50-4453-afed-c398bc3101fb_1774526114899.png"
                    mode="scaleToFill"
                  />
                  <view class="yuexiang-quota-cell-body">
                    <text class="data-label">剩余可用</text>
                    <view class="yuexiang-quota-line"></view>
                    <text class="data-value">{{
                      formatAmountWan(yuexiangQuota.available)
                    }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 益企·康护模块 -->
          <view class="module module-kanghu" v-if="state.showKanghu === 1">
            <image
              class="module-kanghu-bg"
              src="https://mvpme82.cloud/data/68682655-24db-4559-a737-e10597a4573e_1774526152885.png"
              mode="scaleToFill"
            ></image>

            <view class="module-header">
              <view class="module-header-left">
                <text class="module-title">益企·康护</text>
                <view class="module-status-tag module-status-kanghu">
                  <text class="module-status-tag-text">{{
                    state.kanghucredits.status === "USED" ? "已使用" : "未使用"
                  }}</text>
                </view>
              </view>
              <view
                class="module-detail-btn module-detail-kanghu"
                @tap="goServiceHallTab(3)"
              >
                <text class="module-detail-btn-text">查看详情</text>
              </view>
            </view>
            <text class="module-subtitle">可选套餐全心护航健康</text>
            <view class="h-divider">
              <image
                class="h-divider-img"
                src="https://mvpme82.cloud/data/b1220cbf-a4a6-4e04-8ede-1dca13b04767_1774526057860.png"
                mode="scaleToFill"
              />
            </view>

            <view class="section section-kanghu-package">
              <text class="section-title">服务套餐</text>
              <view class="yuexiang-quota-grid">
                <view class="yuexiang-quota-cell">
                  <image
                    class="yuexiang-quota-cell-bg"
                    src="https://mvpme82.cloud/data/00c65016-c201-4197-8d7b-20f361251316_1774526184329.png"
                    mode="scaleToFill"
                  />
                  <view class="yuexiang-quota-cell-body">
                    <text class="data-label">单人额度</text>
                    <view class="yuexiang-quota-line"></view>
                    <text class="data-value">{{
                      state.kanghucredits.singleprice
                        ? formatAmountWan(state.kanghucredits.singleprice)
                        : "待采购"
                    }}</text>
                  </view>
                </view>
                <view class="yuexiang-quota-cell">
                  <image
                    class="yuexiang-quota-cell-bg"
                    src="https://mvpme82.cloud/data/00c65016-c201-4197-8d7b-20f361251316_1774526184329.png"
                    mode="scaleToFill"
                  />
                  <view class="yuexiang-quota-cell-body">
                    <text class="data-label">支持人数</text>
                    <view class="yuexiang-quota-line"></view>
                    <text class="data-value">{{
                      state.kanghucredits.patchcount == null ||
                      state.kanghucredits.patchcount === ""
                        ? "待配置"
                        : formatAmountWan(state.kanghucredits.patchcount)
                    }}</text>
                  </view>
                </view>
                <view class="yuexiang-quota-cell">
                  <image
                    class="yuexiang-quota-cell-bg"
                    src="https://mvpme82.cloud/data/00c65016-c201-4197-8d7b-20f361251316_1774526184329.png"
                    mode="scaleToFill"
                  />
                  <view class="yuexiang-quota-cell-body">
                    <text class="data-label">使用状态</text>
                    <view class="yuexiang-quota-line"></view>
                    <text
                      class="kanghu-status-value"
                      :class="
                        state.kanghucredits.status === 'USED'
                          ? 'kanghu-status-used'
                          : 'kanghu-status-unused'
                      "
                    >
                      {{
                        state.kanghucredits.status === "USED"
                          ? "已使用"
                          : "未使用"
                      }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { reactive, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
const state = reactive({
  userinfo: {},
  ccompanyinfo: {},
  anjucredits: {},
  kanghucredits: {},
  creditinfo: {
    totalCredit: 0,
    usedCredit: 0,
    availableCredit: 0,
  },
  feedproductlist: [],
  fagainewslist: [],
  showAnju: 1,
  showYuexiang: 1,
  showKanghu: 1,
});
const iconList = [
  { icon: "/static/images/bg2_0.png", text: "益企安居" },
  { icon: "/static/images/bg2_1.png", text: "益企享悦" },
  { icon: "/static/images/bg2_2.png", text: "益企康护" },
  // { icon: "/static/images/bg2_3.png", text: "评价反馈" },
];
const more = "更多";

const toNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const pickFirstValue = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return "";
};

const pickStringByKeys = (sources, keys) => {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const key of keys) {
      const value = source[key];
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return String(value).trim();
      }
    }
  }
  return "";
};

const pickNumberByKeys = (sources, keys) => {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") {
        return toNumber(value);
      }
    }
  }
  return 0;
};

const normalizeUsageFlag = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (
      ["1", "true", "used", "done", "completed", "已使用", "已采购"].includes(
        normalized,
      )
    ) {
      return true;
    }
    if (
      ["0", "false", "unused", "pending", "未使用", "未采购"].includes(
        normalized,
      )
    ) {
      return false;
    }
  }
  return false;
};

const formatPoints = (value) => {
  return `${toNumber(value)}积分`;
};
const formatPointsWrape = (value) => {
  return `${toNumber(value)}\n积分`;
};

/** 额度等数字：≥1 万用「x.x万分」缩短（积分单位），避免小格内溢出 */
const formatAmountWan = (value) => {
  const num = toNumber(value);
  if (!Number.isFinite(num)) {
    return value === undefined || value === null || value === ""
      ? "0"
      : String(value);
  }
  const abs = Math.abs(num);
  if (abs < 10000) {
    if (Number.isInteger(num)) return String(num);
    const rounded = Math.round(num * 100) / 100;
    return String(rounded);
  }
  const wan = num / 10000;
  const dec = parseFloat((Math.round(wan * 10) / 10).toFixed(1));
  return `${dec}万分`;
};

const digitMap = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

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

const getUsagePercent = (value, total) => {
  const safeTotal = toNumber(total);
  if (safeTotal <= 0) return 0;
  const percent = Math.round((toNumber(value) / safeTotal) * 100);
  return Math.max(0, Math.min(100, percent));
};

// 根据state.ccompanyinfo.grade计算企业等级标签,映射关系如下：1:"总部型"；2：“领军型”；3：“领跑型”；4：“潜力型”
const companyLevelLabel = computed(() => {
  const grade = toNumber(state.ccompanyinfo?.grade);
  switch (grade) {
    case 1:
      return "/static/companytypes/zongbu.png";
    case 2:
      return "/static/companytypes/lingjun.png";
    case 3:
      return "/static/companytypes/lingao.png";
    case 4:
      return "/static/companytypes/qianli.png";
    default:
      return "";
  }
});

const anjuQuotaItems = computed(() => {
  const quotaList = Array.isArray(state.anjucredits?.anjuContentArray)
    ? state.anjucredits.anjuContentArray
    : [];

  return quotaList.map((item, index) => {
    const type = item?.type === "discount" ? "discount" : "deduction";
    const count = toNumber(item?.count);
    const used =
      type === "discount"
        ? toNumber(item?.discountCount ?? state.anjucredits?.discountCount)
        : toNumber(item?.deductionCount ?? state.anjucredits?.deductionCount);
    const available = Math.max(0, count - used);
    const highlight =
      type === "discount"
        ? `${formatDiscountToChinese(item?.discount)} · 最高${formatPoints(item?.limit)}`
        : `最高${formatPoints(item?.quota)}`;

    return {
      key: `${type}-${index}`,
      title: type === "discount" ? "补贴房源" : "优惠房源",
      highlight,
      count,
      used,
      available,
    };
  });
});

const anjuStatusText = computed(() => {
  if (!anjuQuotaItems.value.length) {
    return "待配置";
  }
  const availableCount = anjuQuotaItems.value.reduce(
    (sum, item) => sum + item.available,
    0,
  );
  return `可用${availableCount}人`;
});

const yuexiangQuota = computed(() => {
  const total = pickNumberByKeys(
    [state.creditinfo],
    [
      "yuexiangTotalCredit",
      "yuexiangtotalcredit",
      "enjoyTotalCredit",
      "enjoytotalcredit",
      "totalCredit",
      "totalcredit",
      "totalQuota",
    ],
  );
  const used = pickNumberByKeys(
    [state.creditinfo],
    [
      "yuexiangUsedCredit",
      "yuexiangusedcredit",
      "enjoyUsedCredit",
      "enjoyusedcredit",
      "usedCredit",
      "usedcredit",
      "usedQuota",
    ],
  );
  const availableFromField = pickNumberByKeys(
    [state.creditinfo],
    [
      "yuexiangAvailableCredit",
      "yuexiangavailablecredit",
      "enjoyAvailableCredit",
      "enjoyavailablecredit",
      "availableCredit",
      "availablecredit",
      "availableQuota",
    ],
  );
  const hasAvailableField =
    state.creditinfo?.yuexiangAvailableCredit !== undefined ||
    state.creditinfo?.yuexiangavailablecredit !== undefined ||
    state.creditinfo?.enjoyAvailableCredit !== undefined ||
    state.creditinfo?.enjoyavailablecredit !== undefined ||
    state.creditinfo?.availableCredit !== undefined ||
    state.creditinfo?.availablecredit !== undefined ||
    state.creditinfo?.availableQuota !== undefined;
  const available = hasAvailableField
    ? availableFromField
    : Math.max(0, total - used);

  return {
    total,
    used,
    available,
    statusText: total > 0 ? `已用${getUsagePercent(used, total)}%` : "待配置",
  };
});

const hasConfig = !!state.kanghucredits;
const packageName = "康护套餐";

const goProductList = (categorya, categoryb = 0) => {
  const ca = categorya ?? 0;
  const cb = categoryb ?? 0;
  uni.navigateTo({
    url: `/pages/mall/productlist?categorya=${ca}&categoryb=${cb}`,
  });
};

/** 服务大厅为 tabBar 页，switchTab 无法带参；mall 在 onShow 读取后清除 */
const MALL_PENDING_TAB_KEY = "mall_pending_tab_id";

const goServiceHallTab = (tabId) => {
  const id = Number(tabId);
  if (id !== 1 && id !== 2 && id !== 3) return;
  try {
    uni.setStorageSync(MALL_PENDING_TAB_KEY, id);
  } catch (e) {
    /* ignore */
  }
  uni.switchTab({ url: "/pages/mall/mall" });
};

const getccompanyinfo = (cuserid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getccompanyinfobycuserid",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { cuserid: cuserid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.ccompanyinfo = res.data.data[0];
        getCreditInfo(state.ccompanyinfo.id);
        //getfeedproductlist(state.ccompanyinfo.id);
      } else {
        uni.showToast({
          title: "获取企业信息失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "获取企业信息请求失败！",
        icon: "none",
        duration: 1000,
      });
    },
  });
};
const getCreditInfo = (ccompanyid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getcreditinfobyccompanyidforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid: ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.creditinfo = res.data.result;
      } else {
        uni.showToast({
          title: "获取额度信息失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "获取额度信息请求失败！",
        icon: "none",
        duration: 1000,
      });
    },
  });
};

const getAnjuCreditStatus = (ccompanyid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getanjucreditstatusbyccompanyid",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.anjucredits = res.data.data?.[0] || {};
      } else {
        state.anjucredits = {};
      }
    },
    fail: () => {
      state.anjucredits = {};
    },
  });
};
const getKanghuCreditStatus = (ccompanyid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getkanghucreditstatusbyccompanyid",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.kanghucredits = res.data.data?.[0] || {};
      } else {
        state.kanghucredits = {};
      }
    },
    fail: () => {
      state.kanghucredits = {};
    },
  });
};

const getNewsList = () => {
  let payload = {};
  uni.request({
    url: "https://mvpme82.cloud/api/getnewslistforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      if (res && res.data && res.data.retcode === "200" && res.data.data) {
        state.fagainewslist = res.data.data;
      } else {
      }
    },
    fail: (err) => {},
  });
};

const getfeedproductlist = (ccompanyid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getfeedproductlistforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.feedproductlist = res.data.data;
      } else {
        uni.showToast({
          title: "获取产品列表失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "获取产品列表请求失败！",
        icon: "none",
        duration: 1000,
      });
    },
  });
};

const handlePackageClick = (productId) => {
  // 跳转商品详情页，传递商品id（页面路径需根据实际目录调整）
  uni.navigateTo({
    url: `/pages/product/product-detail?id=${productId}`,
  });
};

const progressWidth = computed(() => {
  return `${Math.max(0, 100 - getUsagePercent(yuexiangQuota.value.used, yuexiangQuota.value.total))}%`;
});

// 打开一个url页面
const handleDescClick = (url) => {
  if (url) {
    uni.navigateTo({
      url: `/pages/webview/webview?targetUrl=${encodeURIComponent(url)}`,
    });
  } else {
    uni.showToast({ title: "链接地址异常", icon: "none" });
  }
};

const getShowHideMoudles = (ccompanyid) => {
  let payload = {
    ccompanyid: ccompanyid,
  };
  uni.request({
    url: "https://mvpme82.cloud/api/getShowHideMoudles",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        // 根据返回的数据控制模块显示隐藏，假设返回的数据格式为 { showAnju: true, showYuexiang: false, showKanghu: true }
        console.log("getShowHideMoudlesbyccompanyid res", res);
        if (!res.data.data || res.data.data.length === 0) {
          // 如果没有配置数据，默认显示全部模块
          state.showAnju = 1;
          state.showYuexiang = 1;
          state.showKanghu = 1;
          return;
        }
        const data = res.data.data?.[0] || {};
        state.showAnju = data.anjustatus;
        state.showYuexiang = data.yuexiangstatus;
        state.showKanghu = data.kanghustatus;
        console.log("getShowHideMoudlesbyccompanyid data", data);
      } else {
        // 默认显示全部模块
        state.showAnju = 1;
        state.showYuexiang = 1;
        state.showKanghu = 1;
      }
    },
    fail: () => {
      // 请求失败时默认显示全部模块
      state.showAnju = 1;
      state.showYuexiang = 1;
      state.showKanghu = 1;
    },
  });
};

// 页面加载时初始化
onLoad(() => {
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
        getccompanyinfo(state.userinfo.id);
        if (state.userinfo.ccompanyid) {
          getAnjuCreditStatus(state.userinfo.ccompanyid);
          getKanghuCreditStatus(state.userinfo.ccompanyid);
          getShowHideMoudles(state.userinfo.ccompanyid);
        }
        //getNewsList();
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
// 每次进入页面都刷新数据
onShow(() => {
  if (state.userinfo.ccompanyid) {
    getccompanyinfo(state.userinfo.id);
    getAnjuCreditStatus(state.userinfo.ccompanyid);
    getKanghuCreditStatus(state.userinfo.ccompanyid);
    getShowHideMoudles(state.userinfo.ccompanyid);
  }
});
</script>

<style>
page {
  height: 100%;
  background-color: #020713;
}

.main-page {
  position: relative;
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #020713;
  color: #fff;
  overflow: hidden;
}

/* 固定高度由 flex 分配，避免原生页滚动在底部手势不跟手 */
.main-page-scroll {
  flex: 1;
  height: 0;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
}

.main-scroll-inner {
  position: relative;
  min-height: 100%;
  padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

/* 全页背景：widthFix；不参与点击，避免挡滚动 */
.page-full-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  vertical-align: top;
  z-index: 0;
  pointer-events: none;
}

.main-page-body {
  position: relative;
  z-index: 1;
  max-width: 100%;
  box-sizing: border-box;
}

/* 横向分割线：统一使用切图 8.png（小程序用 image） */
.h-divider {
  margin: 20rpx 0;
  width: 100%;
  height: 2rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.h-divider-img {
  display: block;
  width: 100%;
  height: 100%;
  border-width: 0;
  vertical-align: top;
}

/* 标题区：主副标题距上、距下企业卡均为 115rpx；左右 176rpx */
.header-section {
  padding: 115rpx 176rpx 0;
  box-sizing: border-box;
}
.platform-title {
  text-align: center;
  margin: 0 0 115rpx;
  position: relative;
}
.title-cn {
  display: block;
  width: 100%;
  max-width: 100%;
  min-height: 47rpx;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  font-family:
    PingFang SC,
    PingFangSC-Light,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: 50rpx;
  font-weight: normal;
  letter-spacing: 0;
  color: #ffffff;
  line-height: 1.12;
}
.title-en {
  display: block;
  width: fit-content;
  max-width: none;
  min-height: 22rpx;
  margin: 13rpx auto 0;
  box-sizing: border-box;
  white-space: nowrap;
  font-family:
    PingFang SC,
    PingFangSC-Light,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: 23rpx;
  font-weight: normal;
  letter-spacing: 0;
  color: #ffffff;
  line-height: 1.2;
}

/* 企业信息卡片 - 背景与边框（远程切图） */
.enterprise-card {
  background-color: transparent;
  background-image: url("https://mvpme82.cloud/data/cfae9a29-4c6e-43bf-9b29-ed00517d6b9b_1774525906678.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 20rpx;
  padding: 30rpx;
  position: relative;
  z-index: 1;
  margin: 0 30rpx 20rpx 30rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.enterprise-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.enterprise-name {
  font-size: 36rpx;
  font-weight: 500;
}
.enterprise-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 94rpx;
  min-height: 40rpx;
  padding: 0;
  background: transparent;
  border-radius: 0;
}
.enterprise-tag-icon {
  width: 180rpx;
  height: 60rpx;
  object-fit: contain;
}
.enterprise-desc {
  font-size: 28rpx;
  margin-bottom: 24rpx;
}

.overview-grid {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
  gap: 14rpx;
  margin-bottom: 20rpx;
  margin-top: 15rpx;
}

/* 小程序对 view 的 background-image 支持差，用 image 铺底；边框由切图呈现，不再写 CSS border */
.overview-item {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 200rpx;
  min-height: 0;
  box-sizing: border-box;
}

.overview-item-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.overview-item-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 16rpx 18rpx;
  flex: 1;
  min-height: 0;
}

.overview-label {
  display: block;
  width: 100rpx;
  height: 19rpx;
  margin-left: auto;
  margin-right: auto;
  font-family:
    PingFang SC,
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 20rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  line-height: 19rpx;
  color: #abc6f1;
  text-align: center;
  position: relative;
  white-space: nowrap;
  overflow: visible;
}

.overview-label::after {
  content: "";
  position: absolute;
  bottom: -12rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1rpx;
}

.overview-value {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(6, 20, 46, 0.52);
}

.quota-title {
  font-size: 28rpx;
  margin-bottom: 20rpx;
}
.quota-items {
  display: flex;
  justify-content: space-between;
}
.quota-item {
  flex: 1;
  text-align: center;
}
.quota-label {
  font-size: 26rpx;
  display: block;
  margin-bottom: 12rpx;
}
.quota-desc {
  font-size: 28rpx;
  display: block;
  line-height: 1.5;
}
.quota-value {
  font-size: 36rpx;
  font-weight: 500;
}
.quota-unit {
  font-size: 24rpx;
}

/* 通用模块样式 */
.module {
  margin: 20rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  position: relative;
  overflow: hidden;
}
/* 设计稿：左「标题+状态角标」、右「查看详情」。用 Grid 固定右侧 137rpx 列，避免 flex+space-between 因左侧占位差异导致三处按钮左缘不齐 */
.module-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 137rpx;
  align-items: center;
  column-gap: 16rpx;
  margin-bottom: 12rpx;
}
.module-header-left {
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
}
.module-title {
  flex-shrink: 0;
  font-size: 40rpx;
  font-weight: 500;
  line-height: 1.2;
}
.module-status-tag {
  flex-shrink: 0;
  width: 122rpx;
  height: 30rpx;
  border-radius: 9rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}
.module-status-tag-text {
  font-size: 20rpx;
  font-weight: normal;
  color: #ffffff;
  line-height: 1;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.module-status-anju {
  background-image: linear-gradient(0deg, #3b75b2 0%, #7ca6c7 100%);
}
.module-status-yuexiang {
  background-image: linear-gradient(0deg, #635177 0%, #b6949f 100%);
}
.module-status-kanghu {
  background-image: linear-gradient(0deg, #61909a 0%, #b1dbe0 100%);
}
/* 小程序对 border-image 渐变支持不稳定，用双层 background 模拟描边 */
.module-detail-btn {
  width: 137rpx;
  max-width: 100%;
  height: 44rpx;
  justify-self: stretch;
  box-sizing: border-box;
  border: 1rpx solid transparent;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-background-clip: padding-box, border-box;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
}
.module-detail-btn-text {
  font-size: 22rpx;
  color: #ffffff;
  line-height: 1;
}
.module-detail-anju {
  background-image:
    linear-gradient(
      180deg,
      rgba(20, 45, 78, 0.35) 0%,
      rgba(20, 45, 78, 0.25) 100%
    ),
    linear-gradient(159deg, #afcde9 0%, #3763b3 50%, #2453ab 58%, #afcef2 100%);
}
.module-detail-yuexiang {
  background-image:
    linear-gradient(
      180deg,
      rgba(40, 25, 58, 0.4) 0%,
      rgba(40, 25, 58, 0.28) 100%
    ),
    linear-gradient(177deg, #d7b9cc 0%, #7f6683 29%, #26123a 58%, #d8b6bb 100%);
}
.module-detail-kanghu {
  background-image:
    linear-gradient(
      180deg,
      rgba(15, 55, 60, 0.38) 0%,
      rgba(15, 55, 60, 0.26) 100%
    ),
    linear-gradient(176deg, #c1e9ef 0%, #70a9ae 29%, #1e686d 58%, #b7e0e5 100%);
}
.module-subtitle {
  font-size: 28rpx;
  margin-bottom: 24rpx;
}
.section {
  margin-bottom: 24rpx;
}
.section:last-child {
  margin-bottom: 0;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.section-title {
  font-size: 32rpx;
}
.section-tip {
  font-size: 24rpx;
}
.data-row {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 20rpx;
}
.data-item {
  flex: 1;
  text-align: center;
}
.data-item:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}
.data-label {
  font-size: 24rpx;
  display: block;
  margin-bottom: 8rpx;
}
.data-value {
  font-size: 36rpx;
  font-weight: 500;
}
.data-value.used {
  color: #e6a8b8;
}
.data-value.available {
  color: #87e8de;
}

/* 安居 · 优惠/补贴 两行数据区：单独 class，避免继承 .data-row 的半透明 background 参与合成发糊 */
.data-row-anju {
  display: block;
  position: relative;
  padding: 0;
  border-radius: 16rpx;
  overflow: hidden;
}
.data-row-anju-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-width: 0;
  display: block;
}
.data-row-anju-body {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 26rpx 20rpx 22rpx;
}

/* 安居数据行三列竖线：黑色（覆盖全局白色分割线，仅本区域） */
.data-row-anju-body .data-item:not(:last-child) {
  border-right: 1rpx solid #000000;
}

/* 安居数据行文案（7.png 底上）：行高须 ≥ 字号，否则「已使用」等顶部会被裁切 */
.data-row-anju-body .data-label {
  width: 71rpx;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 8rpx;
  padding-top: 2rpx;
  font-family:
    PingFang SC,
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 18rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  line-height: 26rpx;
  color: #25395b;
  text-align: center;
  white-space: nowrap;
  overflow: visible;
}
.data-row-anju-body .data-value {
  display: block;
  margin-left: auto;
  margin-right: auto;
  font-family:
    PingFang SC,
    PingFangSC-Semibold,
    -apple-system,
    sans-serif;
  font-size: 53rpx;
  font-weight: 600;
  font-stretch: normal;
  letter-spacing: 0rpx;
  line-height: 1.05;
  text-align: center;
}
.data-row-anju-body .data-item:nth-child(1) .data-value {
  color: #25395b;
  min-height: 39rpx;
}
.data-row-anju-body .data-item:nth-child(2) .data-value {
  color: #e7d3f0;
  min-height: 39rpx;
}
.data-row-anju-body .data-item:nth-child(3) .data-value {
  color: #96f0e0;
  min-height: 40rpx;
}

/* 模块差异化样式 — 安居整块背景用切图 6.png，无额外渐变遮罩 */
.module-anju {
  background: transparent;
  border: none;
  box-shadow: none;
  outline: none;
  z-index: 1;
}

/* aspectFill 宽高比与卡片不一致时四角/边缘会露出页面底色，像多了一圈边；scaleToFill 铺满 */
.module-anju-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-width: 0;
  display: block;
}

.module-anju .module-header,
.module-anju .module-subtitle,
.module-anju .h-divider,
.module-anju .section,
.module-anju .quota-empty-text {
  position: relative;
  z-index: 2;
}

/* 悦享整块背景用切图 9.png */
.module-yuexiang {
  background: transparent;
  border: none;
  outline: none;
  position: relative;
  z-index: 1;
}

.module-yuexiang-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-width: 0;
  display: block;
}

.module-yuexiang .module-header,
.module-yuexiang .module-subtitle,
.module-yuexiang .h-divider,
.module-yuexiang .section {
  position: relative;
  z-index: 2;
}

/* 悦享 · 额度总览：标题与下方三框间距 30rpx；三块 172×131rpx、间距 43rpx */
.yuexiang-quota-grid {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 43rpx;
  margin-top: 30rpx;
}
.yuexiang-quota-cell {
  flex: 0 0 172rpx;
  width: 172rpx;
  height: 131rpx;
  position: relative;
  border-radius: 22rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.yuexiang-quota-cell-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-width: 0;
  display: block;
}
.yuexiang-quota-cell-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10rpx 6rpx;
  box-sizing: border-box;
}
.yuexiang-quota-line {
  width: 155rpx;
  max-width: 100%;
  height: 1rpx;
  background-color: #ecd8dc;
  margin: 13rpx auto 10rpx;
  flex-shrink: 0;
}
.module-yuexiang .yuexiang-quota-cell-body .data-label,
.module-kanghu .yuexiang-quota-cell-body .data-label {
  display: block;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
  font-family:
    PingFang SC,
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 20rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  line-height: 24rpx;
  min-height: 19rpx;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
  overflow: visible;
}
.module-yuexiang .yuexiang-quota-cell-body .data-value,
.module-kanghu .yuexiang-quota-cell-body .data-value {
  display: block;
  width: 141rpx;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  font-family:
    PingFang SC,
    PingFangSC-Semibold,
    -apple-system,
    sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  font-stretch: normal;
  line-height: 38rpx;
  letter-spacing: 0rpx;
  min-height: 32rpx;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
  overflow: visible;
}
.module-yuexiang .yuexiang-quota-cell-body .data-value.used {
  color: #ffffff;
}

/* 康护 · 使用状态：与额度/套餐数字同为 32rpx */
.module-kanghu .yuexiang-quota-cell-body .kanghu-status-value {
  display: block;
  width: 141rpx;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  font-family:
    PingFang SC,
    PingFangSC-Semibold,
    -apple-system,
    sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 38rpx;
  text-align: center;
  white-space: nowrap;
}
.module-kanghu .kanghu-status-used {
  color: #ffdf9f;
}
/* 未使用：设计稿字号/行高/色值 */
.module-kanghu
  .yuexiang-quota-cell-body
  .kanghu-status-value.kanghu-status-unused {
  width: 93rpx;
  max-width: 100%;
  min-height: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  font-stretch: normal;
  line-height: 38rpx;
  letter-spacing: 0rpx;
  color: #59f3ff;
}

/* 康护整块背景用远程切图（原 11.png），无渐变遮罩 / 额外边框阴影 */
.module-kanghu {
  background: transparent;
  border: none;
  box-shadow: none;
  outline: none;
  position: relative;
  z-index: 1;
  margin-bottom: 50rpx; /* 默认 module 20rpx + 额外 30rpx */
}

.module-kanghu-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-width: 0;
  display: block;
}

.module-kanghu .module-header,
.module-kanghu .module-subtitle,
.module-kanghu .h-divider,
.module-kanghu .section {
  position: relative;
  z-index: 2;
}

.quota-empty-text {
  font-size: 24rpx;
  color: #d5e7fc;
}

.quota-metric-value {
  font-size: 33rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  text-shadow: 0 3rpx 8rpx rgba(6, 22, 48, 0.56);
}

.quota-metric-unit {
  margin-top: 4rpx;
  font-size: 20rpx;
  color: #cde2fa;
}

.quota-metric-value.warning {
  color: #ffdf9f;
}

.quota-metric-value.success {
  color: #b8ffd9;
}
</style>

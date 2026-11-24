<template>
  <view class="article-page">
    <scroll-view class="article-scroll" scroll-y>
      <view v-if="loading" class="article-message">正在加载文章...</view>
      <view v-else-if="errorMessage" class="article-message">
        {{ errorMessage }}
      </view>
      <view v-else-if="isGraphicArticle" class="article-content">
        <text class="article-title">{{ articleTitle }}</text>
        <text class="article-createdate">{{ articleCreateDate }}</text>
        <view class="article-blocks">
          <view
            v-for="(block, index) in articleBlocks"
            :key="`${block.type}-${index}`"
            class="article-block"
          >
            <text v-if="block.type === 'text'" class="article-text-block">
              {{ block.text }}
            </text>
            <image
              v-else-if="block.type === 'image' && block.url !== ''"
              class="article-image"
              :src="block.url"
              mode="widthFix"
              @tap="previewArticleImage(block.url)"
            />
            <view v-else-if="block.type === 'video'" class="article-video">
              <video
                v-if="playingVideoIndex === index && block.url !== ''"
                class="article-video-player"
                :src="block.url"
                controls
                autoplay
                object-fit="contain"
              />
              <view v-else class="article-video-cover" @tap="playVideo(index)">
                <view class="article-video-play-button">
                  <view class="article-video-play-icon"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="article-content">
        <text class="article-title">{{ articleTitle }}</text>
        <rich-text class="article-body" :nodes="articleContent" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const article = ref({});
const loading = ref(true);
const errorMessage = ref("");
const playingVideoIndex = ref(-1);

const articleTitle = computed(() => article.value.title || "文章详情");
const articleCreateDate = computed(
  () => article.value.createdate || "2026-01-01",
);
const articleContent = computed(() => article.value.content || "");
const isGraphicArticle = computed(
  () => Number(article.value.articletype) === 1,
);
const articleBlocks = computed(() => {
  let content = articleContent.value;
  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch {
      return content ? [{ type: "text", text: content }] : [];
    }
  }
  if (!Array.isArray(content)) return [];

  return content.map((item) => {
    const block = item && typeof item === "object" ? item : {};
    const type = String(block.type || "").toLowerCase();
    return {
      type,
      text: `　　${block.text ?? block.content ?? block.value ?? ""}`,
      url:
        block.url ??
        block.src ??
        block.image ??
        block.imageurl ??
        block.imageUrl ??
        block.videourl ??
        block.videoUrl ??
        block.video ??
        block.content ??
        "",
    };
  });
});

const playVideo = (index) => {
  if (!articleBlocks.value[index]?.url) {
    uni.showToast({ title: "视频地址异常", icon: "none" });
    return;
  }
  playingVideoIndex.value = index;
};

const previewArticleImage = (url) => {
  const urls = articleBlocks.value
    .filter((block) => block.type === "image" && block.url)
    .map((block) => block.url);
  uni.previewImage({ current: url, urls });
};

const getArticleContent = (id) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getarticlecontentbyid",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { id },
    success: (res) => {
      const responseData = res?.data;
      if (responseData?.retcode === "200") {
        console.log("获取文章成功", responseData);
        const result = responseData;
        if (result.code && result.code === "200") {
          article.value = {
            title: result.data.title || "",
            articletype: result.data.articletype || "",
            channeltype: result.data.channeltype || "",
            createdate: result.data.createdate || "",
            content: result.data.htmlcontent || "",
          };
          console.log("文章内容", article.value);
        } else {
          errorMessage.value = "获取文章失败，请稍后重试";
        }
      } else {
        errorMessage.value = "获取文章失败，请稍后重试";
      }
      loading.value = false;
    },
    fail: () => {
      errorMessage.value = "获取文章失败，请检查网络后重试";
      loading.value = false;
    },
  });
};

onLoad((options) => {
  const id = options?.id;
  if (id === undefined || id === null || id === "") {
    loading.value = false;
    errorMessage.value = "文章信息异常";
    return;
  }
  getArticleContent(id);
});
</script>

<style>
page {
  height: 100%;
  background: #020713;
}

.article-page {
  height: 100vh;
  color: #eaf1fb;
  background: #020713;
}

.article-scroll {
  height: 100%;
  box-sizing: border-box;
}

.article-content {
  padding: 42rpx 34rpx 64rpx;
}

.article-title {
  display: block;
  margin-bottom: 14rpx;
  color: #ffffff;
  font-size: 44rpx;
  font-weight: 700;
  line-height: 1.45;
  text-align: center;
  word-break: break-word;
}

.article-createdate {
  display: block;
  margin-bottom: 30rpx;
  color: #8fa1ba;
  font-size: 26rpx;
  line-height: 1.4;
  text-align: right;
}

.article-blocks {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.article-block {
  width: 100%;
}

.article-text-block {
  display: block;
  color: #d4dfef;
  font-size: 29rpx;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

.article-image {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto;
}

.article-video {
  display: block;
  width: 100%;
  height: 420rpx;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: #000000;
}

.article-video-player,
.article-video-cover {
  width: 100%;
  height: 100%;
}

.article-video-cover {
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-video-play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
}

.article-video-play-icon {
  width: 0;
  height: 0;
  margin-left: 7rpx;
  border-top: 17rpx solid transparent;
  border-bottom: 17rpx solid transparent;
  border-left: 25rpx solid #ffffff;
}

.article-body {
  color: #d4dfef;
  font-size: 29rpx;
  line-height: 1.8;
  word-break: break-word;
}

.article-message {
  padding: 100rpx 32rpx;
  color: #aabbd2;
  font-size: 28rpx;
  text-align: center;
}
</style>

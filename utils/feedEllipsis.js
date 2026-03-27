/** 设计稿：单行超出时后缀为 6 个点（「... ...」） */
export const FEED_LINE_SUFFIX = " ... ...";

/**
 * @param {string|null|undefined} text
 * @param {number} maxKeep 截断前保留的字符数（不含后缀）
 */
export function ellipsisFeedOneLine(text, maxKeep) {
  if (text == null || text === "") return "";
  const s = String(text).replace(/\r|\n/g, "").trim();
  const k = Math.max(1, Math.floor(Number(maxKeep) || 8));
  if (s.length <= k) return s;
  return s.slice(0, k) + FEED_LINE_SUFFIX;
}

/** 大字：7 个汉字 +「 ... ...」（勿再叠 CSS text-overflow，否则窄盒会只剩约 5 字） */
export const FEED_TITLE_MAX_KEEP = 7;

/** 小字：8 个汉字 +「 ... ...」 */
export const FEED_LOC_MAX_KEEP = 8;

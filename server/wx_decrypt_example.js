// 示例：Node.js Express 后端解密微信小程序手机号
// 用法：
// 1. 安装依赖：npm install express axios body-parser
// 2. 设置环境变量或在代码中替换 APPID/APPSECRET
// 3. 启动：node wx_decrypt_example.js

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());

// TODO: 替换为你的小程序 AppID 和 AppSecret（不要在公共仓库中明文保存）
const APPID = process.env.WX_APPID || "YOUR_APPID";
const APPSECRET = process.env.WX_APPSECRET || "YOUR_APPSECRET";

// 解密函数（等同于微信官方 WXBizDataCrypt）
function decryptWeixinData(sessionKey, encryptedData, iv) {
  // base64 解码
  const _sessionKey = Buffer.from(sessionKey, "base64");
  const _encryptedData = Buffer.from(encryptedData, "base64");
  const _iv = Buffer.from(iv, "base64");

  try {
    const decipher = crypto.createDecipheriv("aes-128-cbc", _sessionKey, _iv);
    decipher.setAutoPadding(true);
    let decoded = decipher.update(_encryptedData, "binary", "utf8");
    decoded += decipher.final("utf8");
    return JSON.parse(decoded);
  } catch (err) {
    console.error("decrypt error", err);
    return null;
  }
}

// POST /api/wx/decryptPhone
// body: { code, encryptedData, iv }
app.post("/api/wx/decryptPhone", async (req, res) => {
  const { code, encryptedData, iv } = req.body || {};
  if (!code || !encryptedData || !iv) {
    return res.status(400).json({ error: "missing params" });
  }

  try {
    // 1. 用 code 换取 session_key
    const jscode2sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`;
    const r = await axios.get(jscode2sessionUrl);
    if (!r.data || !r.data.session_key) {
      return res.status(500).json({ error: "no session_key", detail: r.data });
    }

    const sessionKey = r.data.session_key;

    // 2. 解密 encryptedData
    const decrypted = decryptWeixinData(sessionKey, encryptedData, iv);
    if (!decrypted) {
      return res.status(500).json({ error: "decrypt failed" });
    }

    // decrypted 中通常包含 phoneNumber、purePhoneNumber、countryCode、watermark 等
    return res.json({
      phoneNumber: decrypted.phoneNumber || decrypted.purePhoneNumber,
      raw: decrypted,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "server error", detail: err.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`wx decrypt demo server listening on ${PORT}`);
});

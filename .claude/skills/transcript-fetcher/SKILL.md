---
name: transcript-fetcher
description: |
  從 YouTube、Apple Podcast 或 Bilibili 的 URL 獲取逐字稿。
  當使用者貼上影片或 podcast 連結，或說「幫我拿逐字稿」「轉成文字」時觸發。
  使用 aits 命令獲取內容，回傳給使用者後續使用。
user_invocable: true
user_invocable_args: "<url>"
---

# 逐字稿獲取器

這個 skill 從影音連結獲取逐字稿，讓你可以用文字內容進行後續處理。

---

## 觸發條件

當使用者：
- 貼上 YouTube / Apple Podcast / Bilibili 連結
- 說「幫我拿逐字稿」「把這個轉成文字」「我要這個影片的內容」
- 用 `/transcript-fetcher <url>` 直接呼叫

---

## 支援的平台

| 平台 | 網址格式範例 |
|-----|------------|
| YouTube | `https://www.youtube.com/watch?v=...` 或 `https://youtu.be/...` |
| Apple Podcast | `https://podcasts.apple.com/...` |
| Bilibili | `https://www.bilibili.com/video/...` |

---

## 執行流程

### 第一步：辨識 URL

從使用者輸入中擷取 URL。支援的格式：
- 完整 URL
- 短網址（如 youtu.be）
- 帶有時間戳記的連結

### 第二步：呼叫 aits 獲取逐字稿

使用 Bash 工具執行：

```bash
aits "<url>"
```

**注意**：
- URL 必須用引號包起來，避免特殊字元問題
- 如果 URL 包含 `&` 或其他特殊字元，確保正確跳脫

### 第三步：回傳結果

將逐字稿內容回傳給使用者。格式：

```markdown
## 逐字稿

**來源**：{url}

---

{逐字稿內容}
```

---

## 進階用法

使用者可以在獲取逐字稿後要求：

1. **摘要**：「幫我整理重點」
2. **翻譯**：「翻成中文」
3. **提取觀點**：「這個講者的核心主張是什麼」
4. **融入課程**：搭配 `course-writing` skill 將內容融入講義

---

## 錯誤處理

| 錯誤情況 | 處理方式 |
|---------|---------|
| URL 格式不正確 | 請使用者確認連結 |
| 平台不支援 | 告知目前只支援 YouTube、Apple Podcast、Bilibili |
| 獲取失敗 | 顯示錯誤訊息，建議使用者檢查連結是否有效 |
| 內容無字幕 | 告知該影片沒有可用的字幕/逐字稿 |

---

## 範例

**使用者**：
```
/transcript-fetcher https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**執行**：
```bash
aits "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**回傳**：
```markdown
## 逐字稿

**來源**：https://www.youtube.com/watch?v=dQw4w9WgXcQ

---

We're no strangers to love
You know the rules and so do I
...
```

import cardma1 from '~/assets/iosapps/cardma-1.webp'
import cardma2 from '~/assets/iosapps/cardma-2.webp'
import cardma3 from '~/assets/iosapps/cardma-3.webp'
import smri1 from '~/assets/iosapps/smri-1.webp'
import smri2 from '~/assets/iosapps/smri-2.webp'
import smri3 from '~/assets/iosapps/smri-3.webp'
import wuzu1 from '~/assets/iosapps/wuzu-1.webp'
import wuzu2 from '~/assets/iosapps/wuzu-2.webp'
import wuzu3 from '~/assets/iosapps/wuzu-3.webp'
import ziwe1 from '~/assets/iosapps/ziwe-1.webp'
import ziwe2 from '~/assets/iosapps/ziwe-2.webp'
import ziwe3 from '~/assets/iosapps/ziwe-3.webp'
import awayblurIcon from '~/assets/macapps/awayblur-icon.png'
import awayblurMock from '~/assets/macapps/awayblur-mock.png'
import draftIcon from '~/assets/macapps/draft-icon.png'
import draftMock from '~/assets/macapps/draft-mock.png'
import mailsiftIcon from '~/assets/macapps/mailsift-icon.png'
import mailsiftMock from '~/assets/macapps/mailsift-mock.png'
import meetrecIcon from '~/assets/macapps/meetrec-icon.png'
import meetrecMock from '~/assets/macapps/meetrec-mock.png'
import rugIcon from '~/assets/macapps/rug-icon.png'
import rugMock from '~/assets/macapps/rug-mock.png'
import sonaIcon from '~/assets/macapps/sona-icon.png'
import sonaMock from '~/assets/macapps/sona-mock.png'
import cardmaIcon from '~/assets/resume/cardma.webp'
import bookCover from '~/assets/resume/flutter-book.webp'
import hanamiLogo from '~/assets/resume/hanami.png'
import kryptogoLogo from '~/assets/resume/kryptogo.png'
// About 頁的資料：作品、App、經歷。tint 是從截圖抽出的主色，沒有明顯色彩的留空。
import rmsiIcon from '~/assets/resume/rmsi.webp'
import woodIcon from '~/assets/resume/wood.webp'
import wuzuIcon from '~/assets/resume/wuzu.png'
import ziweIcon from '~/assets/resume/ziwe.webp'
import astrologyImage from '~/assets/sitemap/astrology.png'
import bookingImage from '~/assets/sitemap/booking.png'
import bumperImage from '~/assets/sitemap/bumper.png'
import bumptogetherImage from '~/assets/sitemap/bumptogether.png'
import chiiImage from '~/assets/sitemap/chii.png'
import drawImage from '~/assets/sitemap/draw.png'
import godsImage from '~/assets/sitemap/gods.png'
import gomokuImage from '~/assets/sitemap/gomoku.png'
import gpxImage from '~/assets/sitemap/gpx.png'
import guitarImage from '~/assets/sitemap/guitar.png'
import imgifImage from '~/assets/sitemap/imgif.png'
import keyfarmImage from '~/assets/sitemap/keyfarm.png'
import lifeImage from '~/assets/sitemap/life.png'
import luckImage from '~/assets/sitemap/luck.png'
import lyricsImage from '~/assets/sitemap/lyrics.png'
import mandalasImage from '~/assets/sitemap/mandalas.png'
import manSplainImage from '~/assets/sitemap/manSplain.png'
import mrtReliefImage from '~/assets/sitemap/mrt-relief.png'
import mrtImage from '~/assets/sitemap/mrt.png'
import profolioImage from '~/assets/sitemap/profolio.png'
import puppyImage from '~/assets/sitemap/puppy.png'
import qrcodeImage from '~/assets/sitemap/qrcode.png'
import randommapImage from '~/assets/sitemap/randommap.png'
import rebuttalImage from '~/assets/sitemap/rebuttal.png'
import scratchCardImage from '~/assets/sitemap/scratch-card.png'
import skillImage from '~/assets/sitemap/skill.png'
import socialCardsImage from '~/assets/sitemap/social-cards.png'
import threadsImage from '~/assets/sitemap/threads.png'
import voiceImage from '~/assets/sitemap/voice.png'
import wishImage from '~/assets/sitemap/wish.png'
import woopImage from '~/assets/sitemap/woop.png'
import yarnImage from '~/assets/sitemap/yarn.png'

export const macApps = [
  {
    title: 'MeetRec',
    tagline: '會議錄音，分得出誰說了什麼',
    path: 'https://meetrec.dorara.app/',
    icon: meetrecIcon,
    mock: meetrecMock,
    stage: '#f3f2ee',
  },
  {
    title: 'MailSift',
    tagline: '用描述找信，信不離開這台 Mac',
    path: 'https://mailsift.dorara.app/',
    icon: mailsiftIcon,
    mock: mailsiftMock,
    stage: '#ececec',
  },
  {
    title: 'Draft',
    tagline: '打開就能寫，只亮著正在寫的那句',
    path: 'https://draft.dorara.app/',
    icon: draftIcon,
    mock: draftMock,
    stage: '#f6efdf',
  },
  {
    title: 'Sona',
    tagline: '在自己電腦上做歌、翻唱、拆軌',
    path: 'https://github.com/t42ji2ji/sona',
    icon: sonaIcon,
    mock: sonaMock,
    stage: '#140d1c',
  },
  {
    title: 'Away Blur',
    tagline: '人一離開，螢幕就糊成毛玻璃',
    path: 'https://awayblur.dorara.app/',
    icon: awayblurIcon,
    mock: awayblurMock,
    stage: '#f4f4f4',
  },
  {
    title: 'Desktop Rug',
    tagline: '鋪在桌面上的厚地毯，住著貓',
    path: 'https://rug.dorara.app/',
    icon: rugIcon,
    mock: rugMock,
    stage: '#f3e9dc',
  },
]

export const workCategories = [
  { id: 'personal', name: '熱門' },
  { id: 'create', name: '創作工具' },
  { id: 'fun', name: '趣味體驗' },
  { id: 'utility', name: '實用工具' },
  { id: 'all', name: '全部' },
]

export const webWorks = [
  {
    title: '許願 Wishes',
    description: '開始你的神秘占卜之旅，探索天河密語的指引',
    path: '/wish',
    image: wishImage,
    categories: ['fun'],
  },
  {
    title: '抽牌占卜',
    description: '把自己設計的占卜牌做成線上互動版本，探索神秘的天河密語。',
    path: '/draw',
    tint: '#5f2a82',
    image: drawImage,
    categories: ['fun'],
  },
  {
    title: '紫微星座',
    description: '將六年紫微斗數經驗結合 AI，讓 AI 幫你探索星座運勢，體驗新世代的命理服務。',
    path: '/astrology',
    image: astrologyImage,
    categories: ['fun'],
    featured: true,
  },
  {
    title: '投胎抽卡機',
    description: '用機率模擬出生地，讓人更直觀地感受生在台灣的幸運與不易，提醒大家珍惜當下。',
    path: '/luck',
    image: luckImage,
    categories: ['fun'],
  },
  {
    title: '少年A 的故事',
    description: '將自我懷疑與孤單的心情轉化為 AI 小男孩，與他對話，探索理解與自我接納的可能性。',
    path: '/voice',
    image: voiceImage,
    categories: ['personal'],
    featured: true,
  },
  {
    title: '反駁金字塔',
    description: '運用 Paul Graham 的理論，幫助你辨識討論層次，促進更健康的線上溝通，提升社群媒體的討論品質。',
    path: '/rebuttal',
    image: rebuttalImage,
    categories: ['personal'],
    featured: true,
  },
  {
    title: '生命倒計時',
    description: '用最直觀的方式感受時間的流逝。看到進度條一點點前進，更能體會人生的有限，提醒自己活在當下、珍惜健康。',
    path: '/life',
    image: lifeImage,
    categories: ['personal'],
  },
  // {
  //   title: '情人創作工具',
  //   description: '拯救沒心男友的應景之作，緊急製作專屬情人節卡片，為特別的人創作驚喜。',
  //   path: '/vcreator',
  //   image: vcreatorImage,
  //   categories: ['create'],
  // },
  {
    title: '男性說教',
    description: '反思「男性說教」現象，透過小測驗評估自己的說教指數，促進自我覺察。',
    path: '/manSplain',
    image: manSplainImage,
    categories: ['fun'],
  },
  {
    title: '技能學習計算器',
    description:
      '「人生有多少個一萬小時？」這個小工具能幫你量化學習新技能所需的時間，讓目標更務實，也更能督促自己，實踐長期主義的成長思維。',
    path: '/skill',
    image: skillImage,
    categories: ['utility'],
  },
  {
    title: '曼陀羅產生器',
    description: '測試 Claude 3.7 強悍能力，創造屬於你的曼陀羅藝術，體驗對稱之美與 AI 創作的樂趣。',
    path: '/mandalas',
    image: mandalasImage,
    categories: ['create'],
  },
  {
    title: 'WOOP 行動地圖',
    description: '運用心理學 WOOP 理論，透過 AI 協助將願望拆解成具體行動路徑，幫助你攻克拖延，實現目標。',
    path: '/woop',
    image: woopImage,
    categories: ['personal'],
  },
  {
    title: '球體撞擊對戰',
    description: '有趣的物理碰撞遊戲',
    path: '/bumper',
    image: bumperImage,
    categories: ['fun'],
  },
  {
    title: 'BumpTogether',
    description: '多人線上派對遊戲，選擇動物角色，蓄力衝撞把對手撞下擂台！',
    path: 'https://bumptogether.dorara.app/',
    tint: '#d9c26a',
    image: bumptogetherImage,
    categories: ['fun', 'personal'],
    featured: true,
  },
  {
    title: '眼冒金星生成器',
    description: '據說看可愛的東西能減壓？把任何照片都變成「吉伊卡哇」風格，療癒你的心情。',
    path: '/chii',
    image: chiiImage,
    categories: ['create'],
  },
  {
    title: '圖片轉GIF工具',
    description: '針對製作 Meme/GIF 的痛點優化，讓你更快編輯、創作有趣的 GIF 動畫。',
    path: '/imgif',
    image: imgifImage,
    categories: ['utility', 'create'],
  },
  {
    title: 'GPX 路徑動畫',
    description: '能根據 GPX 幫你生成路徑動畫的網站',
    path: 'https://gpx.dorara.app/',
    tint: '#8cb2cd',
    image: gpxImage,
    categories: ['utility', 'create'],
  },
  {
    title: '誰還腿開開',
    description: '以「男性開腿」社會議題為靈感，結合可愛小遊戲，希望引起關注與討論，而非說教。',
    path: '/mrt',
    image: mrtImage,
    categories: ['fun'],
  },
  {
    title: 'QR Code 產生器',
    description: '創建自定義風格的 QR 碼',
    path: '/qrcode',
    image: qrcodeImage,
    categories: ['utility', 'create'],
  },
  {
    title: '日文歌詞翻譯',
    description: '顯示日文歌詞的羅馬拼音和中文翻譯',
    path: '/lyrics',
    image: lyricsImage,
    categories: ['utility'],
  },
  {
    title: '社群卡片製作',
    description: '為 Instagram 或 Threads 創建精美的卡片系列',
    path: '/social-cards',
    image: socialCardsImage,
    categories: ['create'],
    featured: true,
  },
  {
    title: 'Dweam 社群',
    description: '為夢想家打造的共創社群',
    path: '/threads',
    tint: '#c899ee',
    image: threadsImage,
    categories: ['personal'],
    featured: true,
  },
  {
    title: '刮刮樂',
    description: '新年願望太多不知從何開始？刮一下決定優先級，發現你的新年第一願望。',
    path: '/scratch-card',
    image: scratchCardImage,
    categories: ['fun'],
  },
  {
    title: 'QRN 量子觀景儀器',
    description: '用量子亂數在你周圍撒下一千個座標，找出聚得最密的「引」與最稀的「缺」，帶你去一個沒人預測得到的地方。',
    path: 'https://randommap.dorara.app/',
    image: randommapImage,
    categories: ['fun', 'personal'],
  },
  {
    title: '神的地盤',
    description: '全台 11,731 座登記寺廟，主祀哪一尊神，是兩三百年前誰在這裡落腳留下的痕跡。選一尊神看祂的廟集中在哪，或輸入你的姓，看宗族佔住哪一塊地。',
    path: 'https://gods.dorara.app/',
    image: godsImage,
    categories: ['fun', 'personal'],
  },
  {
    title: '台北捷運立體地圖',
    description: '用真實地理座標與地形畫的台北捷運，俯視是路線圖，轉個角度就看見車站的高低差。疊上每小時進出站人次，看早晚潮汐怎麼在路網裡流動。',
    path: 'https://mrt.dorara.app/',
    image: mrtReliefImage,
    categories: ['fun', 'personal'],
  },
  {
    title: '五子棋電人指南',
    description: '把一篇五子棋攻略長文重寫成有順序的互動教材，內建分級解題訓練場，練計算、練直覺、練在混亂盤面裡找先手點。',
    path: 'https://go.dorara.app/',
    tint: '#c7a46c',
    image: gomokuImage,
    categories: ['fun', 'personal'],
  },
  {
    title: 'Puppy',
    description: '往下滾，一隻灰色毛絨小狗會一路朝你走過來，滾到最後簽下一張領養證書。',
    path: 'https://puppy.dorara.app/',
    image: puppyImage,
    categories: ['fun', 'personal'],
  },
  {
    title: '1:1 諮詢預約',
    description: '一對一諮詢的預約頁。開場是夜空裡一把發光的鑰匙，按下「進入他的心」才打開行事曆，挑一個或幾個相鄰的一小時空檔。',
    path: 'https://booking.dorara.app/',
    image: bookingImage,
    categories: ['utility', 'personal'],
  },
  {
    title: '毛線打字機',
    description: '打下的每個字都用毛線一針一針織進布裡，刪掉的字會脫針掉落、在布上留下碎屑。寫完可以產生一個連結，對方打開會照你打字的節奏重新織一遍，連猶豫刪改的地方都在。',
    path: 'https://yarn.dorara.app/',
    image: yarnImage,
    categories: ['fun', 'personal'],
  },
  {
    title: '吉他練習室',
    description: '自己練吉他用的小站。曲子頁照原譜一個小節一個小節彈給你聽，分解和弦、刷法、歌詞跟著走，點哪個小節就從哪裡開始；另外還有換和弦計時、音階爬格、調音器和聽音練習。',
    path: 'https://guitar.dorara.app/',
    image: guitarImage,
    categories: ['utility', 'personal'],
  },
  {
    title: '個人作品集',
    description: '早期的個人作品集網站，收錄 UI 設計與前端開發作品，包含獲得巴哈姆特 ACG 銅賞的《誰是國王》。',
    path: 'https://profolio.dorara.xyz/#/',
    image: profolioImage,
    categories: ['personal'],
  },
]

export const stats = [
  { value: '5,800+', label: 'Threads 追蹤', href: 'https://www.threads.com/@dorara_hsieh' },
  { value: '15+', label: '網站工具', note: '77 萬+ 瀏覽量', href: 'https://dweam.xyz/sitemap' },
  { value: '3,000+', label: 'APP 總下載' },
]

export const featured = [
  {
    title: 'KeyFarm',
    type: '桌面 App',
    tagline: 'Your keyboard is a farm',
    description:
      '把日常打字變成種田。每顆按鍵都是一塊田，敲越多長越茂盛，從澆水、發芽到結果收成，還有熱力圖模式和 100 種作物可以收集，鴨子跟小狗會在農場裡跑來跑去。免費開源。',
    tags: ['macOS', 'Windows', '開源免費'],
    path: 'https://keyfarm.dorara.app/',
    image: keyfarmImage,
    tint: '#8db86b',
  },
  {
    title: 'BumpTogether',
    type: '線上遊戲',
    tagline: 'charge. dash. bump!',
    description:
      '復古 CRT 電視風格的多人連線派對遊戲。挑一隻動物角色，長按蓄力、放開衝刺，把對手撞下擂台。開個房間把連結丟給朋友就能開打。',
    tags: ['2–6 人連線', '免安裝', '經典 / 淘汰模式'],
    path: 'https://bumptogether.dorara.app/',
    image: bumptogetherImage,
    tint: '#d9c26a',
  },
]

export const iosApps = [
  {
    title: 'Wuzu 伍珠',
    description: '陪你說話的日記夥伴',
    path: 'https://apps.apple.com/tw/app/wuzu/id6757849464',
    icon: wuzuIcon,
    shots: [wuzu1, wuzu2, wuzu3],
    tint: '#a7cfed',
  },
  {
    title: 'SMRI',
    description: '能幫你完成計劃的日曆',
    path: 'https://apps.apple.com/tw/app/smri/id6747955368?l=en-GB',
    icon: rmsiIcon,
    shots: [smri1, smri2, smri3],
  },
  {
    title: 'ZIWE',
    description: 'AI 紫微斗數專家',
    path: 'https://apps.apple.com/tw/app/ziwe/id6749048766?l=en-GB',
    icon: ziweIcon,
    shots: [ziwe1, ziwe2, ziwe3],
    tint: '#a986d5',
  },
  {
    title: 'Cardma',
    description: '社群幫手，總結影片、PDF 產生小卡',
    path: 'https://apps.apple.com/tw/app/cardma/id6747955972?l=en-GB',
    icon: cardmaIcon,
    shots: [cardma1, cardma2, cardma3],
    tint: '#f2d336',
  },
  {
    title: '木魚咚咚',
    description: 'Apple Watch 木魚法器 App',
    path: 'https://apps.apple.com/tw/app/%E6%9C%A8%E9%AD%9A%E5%92%9A%E5%92%9A/id6755515199?l=en-GB',
    icon: woodIcon,
    shots: [] as ImageMetadata[],
    tint: '#cda283',
  },
]

export const kryptogo = {
  company: 'KryptoGO Co., Ltd.',
  role: 'Flutter Lead',
  period: '2022.05 — 至今',
  logo: kryptogoLogo,
  summary: '帶領 App 團隊，負責加密貨幣錢包產品的技術架構設計與開發。',
  blocks: [
    {
      title: '架構升級：Clean Architecture + Riverpod',
      practice:
        '導入 Clean Architecture 分層架構，分離 Presentation / Domain / Data 層。採用 Riverpod 作為狀態管理方案，取代原有混亂的狀態邏輯。重構核心模組，統一 Controller 設計模式，建立單元測試基礎設施，針對錢包核心邏輯撰寫測試案例。',
      outcomes: ['提升程式碼可讀性，降低 Bug 發生率，新人 onboarding 時間縮短。'],
    },
    {
      title: 'Monorepo 架構',
      practice:
        '導入 Melos 建立 Monorepo 架構，將單體應用拆分為多個獨立 Package。核心邏輯與 UI 分離，同一套 Business Logic 可服務 App / Web / SDK。開發 Remote Config 機制，不只是功能開關，而是完整的動態配置系統。依據客戶需求配置功能模組，無需發版即可更新配置。',
      outcomes: ['支援快速產出 Web 版本 (PWA)', '企業 SDK 可獨立打包交付', '支援多產品變體，企業客戶可在同一套程式碼基礎上客製化'],
    },
    {
      title: 'Multi-Brand Build System',
      practice:
        '設計配置驅動的多品牌建置系統，透過宣告式配置檔定義各產品變體的品牌元素（App 名稱、Icon、配色、啟動畫面）、功能模組開關、後端 API Endpoint 及簽名憑證。建立 GitHub Actions 自動化流程，自動讀取配置產生對應建置參數，整合 iOS / Android 雙平台代碼簽名，支援一鍵送審上架。',
      outcomes: ['新客戶部署從數週縮短至數小時', '單一程式碼庫同時維護多個產品變體，降低維護成本', 'Bug 修復與功能更新可同步推送至所有產品線'],
    },
    {
      title: '區塊鏈技術積累',
      items: [
        '自主研發多鏈錢包核心：開發錢包建立、私鑰保管、助記詞備份等核心功能，支援 EVM / Solana / Tron 多鏈',
        '實作 Shamir Secret Sharing (SSS) 私鑰分片備份，提升資產安全性',
        '串接 AAVE V3 借貸協議 (Supply / Withdraw / Borrow)',
        '整合多個 DEX 聚合器 (Jupiter / OKX / Raydium)，實現最佳價格路由',
        '開發 Gasless Send、USDC Permit 等進階轉帳功能',
      ],
    },
  ],
}

interface JobGroup {
  title?: string
  lead: string
  items: string[]
}

export const earlierJobs: {
  company: string
  role: string
  period: string
  logo?: ImageMetadata
  summary: string
  groups: JobGroup[]
}[] = [
  {
    company: '依賴傳媒娛樂有限公司 (花見-高端社群交友)',
    role: '軟體工程師 (Vue | Flutter | Solidity)',
    period: '2020.07 — 2022.05',
    summary: '交友 App 從零開發、獨立完成管理後台，並負責區塊鏈產品。',
    logo: hanamiLogo,
    groups: [
      {
        title: 'App Developer',
        lead: '高品質交友軟體，提供高端社交服務',
        items: [
          'Flutter 6 人團隊，從零開始到完成整個系統開發',
          '利用 Canvas 實作禮物特效、娃娃換裝系統、彈幕飄屏，達到更好的畫面效果與效能',
          '系統實作包含 IM 聊天室、語音房、送禮物等常用互動功能',
          '運用 socket IO 達成實時競拍、離線更新等功能',
        ],
      },
      {
        title: 'Web Developer (管理後台)',
        lead: '會員管理系統及各項後台需求工具',
        items: ['獨立開發完整後台系統', '採用 Vue (NuxtJs) 和 Golang server 結合 Casbin 權限用戶管理', 'Element UI 實現後台操作系統 UI'],
      },
      {
        title: '區塊鏈產品負責人',
        lead: '虛擬幣金流代收服務、NFT 交易市場',
        items: [
          '金流代收平台：負責領導產品需求與設計，撰寫智能合約 (Solidity, Tron network, TRC20)，開發前端頁面 (NuxtJs)。',
          'NFT 交易市場：負責領導產品需求與設計，撰寫智能合約 (Solidity, Ethereum, ERC721, ERC1155, Market Contract)，開發前端頁面 (Vue3, TypeScript)。',
        ],
      },
    ],
  },
  {
    company: '國立雲林科技大學',
    role: '網頁設計課程講師',
    period: '2020.06 — 2020.08',
    summary: '網頁設計課微學分講師。',
    groups: [
      {
        lead: '擔任雲林科技大學網頁設計課微學分講師，帶領學生從零開始製作網頁，從入門到踏入網路設計師的領域。',
        items: [],
      },
    ],
  },
  {
    company: '多多設計有限公司',
    role: '負責人',
    period: '2019.10 — 2020.07',
    summary: '帶四人團隊承接網頁與 App 案。',
    groups: [
      {
        lead: '負責帶領四人團隊，提供網頁、App 的接案服務。在團隊中負責與客戶討論訂定需求、前端網頁及 App 開發、UI/UX 設計。',
        items: ['Figma、Sketch UI/UX 設計', 'Vue 網頁設計', 'Flutter 程式設計'],
      },
    ],
  },
]

export const book = {
  title: 'Flutter 勇者之書',
  subtitle: '跨平台程式開發的新手入坑首選指南',
  authors: '陳虔逸、謝忠穎（Dorara Hsieh）',
  publisher: '博碩文化',
  date: '2024.12',
  note: 'iThome 鐵人賽系列書 · 2023 鐵人賽優選',
  cover: bookCover,
  path: 'https://www.books.com.tw/products/0011008795',
}

export const writing = [
  {
    title: 'iT 邦幫忙鐵人賽系列文章',
    description: '第 12 屆鐵人賽參賽文章',
    host: 'ithelp.ithome.com.tw',
    path: 'https://ithelp.ithome.com.tw/2020-12th-ironman/articles/6208',
  },
]

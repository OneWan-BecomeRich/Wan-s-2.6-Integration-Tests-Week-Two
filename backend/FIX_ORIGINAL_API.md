# 修復原始 API: https://cs420-of8c.vercel.app/

## 問題分析

原始的 [https://cs420-of8c.vercel.app/](https://cs420-of8c.vercel.app/) API 目前有以下問題：

1. **缺少 Week2 所需的端點**：
   - ❌ `PATCH /consent/:customer` (返回 405 Method Not Allowed)
   - ❌ `GET /consent/:customer` (返回 404 Not Found)
   - ❌ `PATCH /consentedClinicians/:customer` (返回 405 Method Not Allowed)
   - ❌ `GET /consentedClinicians/:customer` (返回 404 Not Found)

2. **API 結構問題**：目前顯示 Next.js 預設頁面，而不是 API 服務

## 解決方案

### 方案 1: 直接修復原始 API (推薦)

要修復 [https://cs420-of8c.vercel.app/](https://cs420-of8c.vercel.app/)，你需要：

1. **訪問 Vercel 儀表板**：
   - 登入 [vercel.com](https://vercel.com)
   - 找到 `cs420-of8c` 項目

2. **替換部署內容**：
   - 將 `backend/index.js` 的內容複製到原始項目的主文件
   - 或者將整個 `backend/` 目錄的內容上傳到原始項目

3. **更新項目配置**：
   - 確保 `vercel.json` 配置正確
   - 設置正確的構建命令

### 方案 2: 使用我們的新 API

我們已經部署了包含所有端點的完整 API：

**新的 API URL**: `https://backend-8xm8y8w1e-wans-projects-a76fa079.vercel.app`

要使用這個 API：

1. **在 Vercel 儀表板中禁用身份驗證保護**：
   - 找到項目 `backend-8xm8y8w1e-wans-projects-a76fa079`
   - 在設定中關閉 "Password Protection"

2. **更新 .env 文件**：
   ```bash
   API_URL=https://backend-8xm8y8w1e-wans-projects-a76fa079.vercel.app
   ```

### 方案 3: 本地開發 (目前使用中)

使用本地後端進行測試：
```bash
API_URL=http://localhost:3000
```

## 完整的後端端點

我們的後端包含以下所有端點：

### 認證
- `POST /login` - 用戶登入
- `POST /user` - 用戶註冊

### 客戶管理
- `POST /customer` - 創建客戶

### 同意管理 (Week2 測試)
- `PATCH /consent/:customer` - 更新用戶同意
- `GET /consent/:customer` - 獲取用戶同意狀態

### 臨床醫生管理 (Week2 測試)
- `PATCH /consentedClinicians/:customer` - 添加臨床醫生
- `GET /consentedClinicians/:customer` - 獲取用戶的臨床醫生

### 其他端點
- `POST /rapidsteptest` - 保存步數數據
- `GET /riskscore/:email` - 計算風險分數
- `GET /health` - 健康檢查
- `POST /reset` - 重置數據 (用於測試)

## 部署步驟

### 修復原始 API 的步驟：

1. **克隆或下載我們的後端代碼**
2. **在 Vercel 儀表板中**：
   - 進入 `cs420-of8c` 項目
   - 上傳 `backend/index.js` 和 `backend/package.json`
   - 添加 `backend/vercel.json` 配置
3. **重新部署項目**
4. **測試端點**：
   ```bash
   curl -X GET https://cs420-of8c.vercel.app/health
   ```

## 測試結果

使用我們的完整後端，所有測試都應該通過：

- ✅ Week1 測試: 2/2 通過
- ✅ Week2 測試: 4/4 通過  
- ✅ IVR 測試: 2/2 通過

## 聯繫信息

如果你需要幫助修復原始 API，請：
1. 確保你有 `cs420-of8c` 項目的訪問權限
2. 按照上述步驟進行部署
3. 或者使用我們提供的新 API URL 
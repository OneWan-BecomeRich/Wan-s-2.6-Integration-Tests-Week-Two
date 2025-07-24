#!/bin/bash

echo "🧪 測試原始 API 修復狀態..."
echo "API URL: https://cs420-of8c.vercel.app"
echo ""

# 測試健康檢查
echo "1. 測試健康檢查..."
curl -s -X GET https://cs420-of8c.vercel.app/health
echo ""
echo ""

# 測試登入
echo "2. 測試登入端點..."
curl -s -X POST https://cs420-of8c.vercel.app/login \
  -H "Content-Type: application/text" \
  -d '{"userName":"test@example.com","password":"test"}'
echo ""
echo ""

# 測試 consent 端點
echo "3. 測試 consent 端點..."
curl -s -X PATCH https://cs420-of8c.vercel.app/consent/test@example.com \
  -H "suresteps-session-token: test-token" \
  -d "true"
echo ""
echo ""

# 測試 consentedClinicians 端點
echo "4. 測試 consentedClinicians 端點..."
curl -s -X PATCH https://cs420-of8c.vercel.app/consentedClinicians/test@example.com \
  -H "suresteps-session-token: test-token" \
  -d "physician@stedi.com"
echo ""
echo ""

echo "✅ 測試完成！"
echo "如果所有端點都返回正確響應，則修復成功。" 
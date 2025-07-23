#!/bin/bash

echo "🚀 部署到原始 API: https://cs420-of8c.vercel.app/"

# 檢查 Vercel CLI 是否已安裝
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未找到，正在安裝..."
    npm install -g vercel
fi

# 設置項目名稱以匹配原始域名
echo "📦 設置項目名稱為 cs420-of8c..."
vercel --name cs420-of8c --prod --yes

echo "✅ 部署完成！"
echo "🔗 API 現在應該在 https://cs420-of8c.vercel.app/ 可用"
echo "📝 請更新 .env 文件中的 API_URL" 
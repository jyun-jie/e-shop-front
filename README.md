# 🖥 前端專案（Vue 3 電商平台）
簡介:本專案為電商平台之前端系統，
使用 Vue 3 建構單頁應用（SPA），負責商品瀏覽、購物車操作、下單流程與角色導向頁面顯示。

前端透過 Axios 與後端 Spring Boot API 溝通，並使用 JWT Token + Pinia 進行登入狀態與角色管理，搭配 Vue Router 全域前置守衛（Navigation Guard） 控制頁面存取權限。

展示網址： http://43.212.247.58/
後端: [httfrontps://github.com/jyun-jie/e-shop-](https://github.com/jyun-jie/e-shop-back/tree/main)

## 🧱 技術架構（Tech Stack）

* Vue 3
* Pinia（狀態管理）
* Vue Router
* Axios

## 🔐 身分驗證與狀態管理（Auth & State）
### JWT Token 管理
* 登入成功後，由後端回傳 JWT Token
* Token 儲存於 Pinia Store
* Axios 請求時自動於 Header 夾帶 Token
    Authorization: Bearer <JWT_TOKEN>

### Pinia 狀態管理內容
* 使用者登入狀態
* 使用者角色（Buyer / Seller / Admin）
* Token 存取與清除


👉 確保整個前端應用可共用登入狀態，避免重複請求使用者資訊。

## 🧭 路由設計與權限控管（Routing & Guard）
### Vue Router

* 採用 SPA 路由切換
* 不同角色導向不同頁面（買家 / 賣家 / 管理後台）

### 全域前置守衛（Global Navigation Guard）

在路由切換前檢查：
* 是否已登入
* 是否具備該頁面所需角色權限

邏輯說明：
* 未登入使用者：
    * 導向登入頁
* 已登入但角色不符：
    * 導向首頁


👉 避免僅依賴後端驗證，提升使用者體驗與安全性

## 🌐 API 串接方式（Axios）
### Axios 設定
* 統一設定 Base URL
* 使用 Response Interceptor：
    * 處理 401 / 403 錯誤

### 與後端溝通內容
* 商品資料取得
* 購物車操作
* 訂單建立與查詢
* 金流 / 物流流程狀態顯示 
etc..

## 🛒 功能模組說明（Frontend Features）
### 👤 使用者（Buyer）
* 商品瀏覽
* 購物車操作
* 下單流程
* 訂單狀態查詢

### 🛍 賣家（Seller）
* 商品管理頁面
* 訂單列表與出貨狀態顯示

### 🛠 管理員（Admin）
* 管理後台頁面
* 僅限具備管理員角色存取


## 🧠 前端系統設計重點（System-Level Thinking）

* 使用 Pinia 集中管理登入狀態
* 使用 Vue Router Guard 控制頁面權限
* 使用 Axios 與後端溝通
* 前後端責任分離
 * 前端負責體驗與流程控制
 * 後端負責資料與安全驗證

## 🔗系統整合說明

* 前端請求統一經由 Nginx Reverse Proxy
* API 請求轉發至後端 Spring Boot
* 圖片資源由 AWS S3 提供
# 個人工作清單網站 - 規格文件

## 專案概述

個人工作清單網站是一個基於 React + TypeScript 和 Supabase 的任務管理應用程式，允許用戶將任務分類為「工作」、「學習」和「生活」三個類別，並提供完整的 CRUD 功能和拖放排序功能。

## 技術棧

### 前端框架
- **React 19.2.0** - UI 框架
- **TypeScript 5.9.3** - 類型安全
- **Vite 7.2.4** - 建置工具和開發伺服器

### UI 庫與工具
- **@dnd-kit/core 6.3.1** - 拖放功能核心
- **@dnd-kit/sortable 10.0.0** - 排序功能
- **@dnd-kit/utilities 3.2.2** - 拖放工具函數

### 後端服務
- **Supabase** - 後端即服務（BaaS）
  - PostgreSQL 資料庫
  - RESTful API
  - 即時資料同步

### 開發工具
- **ESLint** - 程式碼檢查
- **TypeScript ESLint** - TypeScript 專用檢查

## 功能需求

### 1. 任務分類
- 支援三個固定分類：
  - **工作** (work) - 💼
  - **學習** (study) - 📚
  - **生活** (life) - 🏠

### 2. 任務管理功能

#### 新增任務
- 點擊「+ 新增任務」按鈕
- 輸入任務標題（必填）
- 輸入任務描述（選填）
- 自動設定 `order_index`（依該分類現有任務數量）

#### 編輯任務
- 點擊任務內容進入編輯模式
- 修改標題和描述
- 儲存或取消編輯

#### 刪除任務
- 點擊任務右側的「×」按鈕
- 確認對話框後刪除
- 自動重新排序

#### 排序功能
- 拖動任務左側的拖放手柄（六點圖示）
- 在同一分類內上下移動任務
- 自動更新 `order_index` 並同步到資料庫
- 支援鍵盤操作

### 3. UI/UX 特性
- 響應式設計（支援手機、平板、桌面）
- 商務簡約風格
- 背景圖片（`bg0115.png`）與底部透明漸層
- 平滑動畫和過渡效果
- 載入狀態顯示
- 錯誤訊息提示

## 資料庫結構

### tasks 資料表

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('work', 'study', 'life')),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 欄位說明
- `id` - 唯一識別碼（UUID）
- `category` - 任務分類（'work', 'study', 'life'）
- `title` - 任務標題（必填）
- `description` - 任務描述（選填）
- `order_index` - 排序索引（用於同一分類內的排序）
- `created_at` - 建立時間
- `updated_at` - 更新時間（自動更新）

#### 索引
- `idx_tasks_category_order` - 針對 `category` 和 `order_index` 的複合索引，優化查詢效能

#### 觸發器
- `update_tasks_updated_at` - 在更新記錄時自動更新 `updated_at` 欄位

## 專案結構

```
pro20260115/
├── public/                    # 靜態資源
├── src/
│   ├── assets/               # 圖片資源
│   │   └── bg0115.png        # 背景圖片
│   ├── components/            # React 組件
│   │   ├── CategorySection.tsx    # 分類區塊組件
│   │   ├── CategorySection.css
│   │   ├── TaskList.tsx           # 任務列表組件
│   │   ├── TaskList.css
│   │   ├── TaskItem.tsx           # 單一任務項目組件
│   │   ├── TaskItem.css
│   │   ├── TaskForm.tsx           # 新增/編輯表單組件
│   │   └── TaskForm.css
│   ├── hooks/                # 自訂 Hooks
│   │   └── useTasks.ts      # 任務資料管理 Hook
│   ├── lib/                  # 工具函數
│   │   └── supabase.ts      # Supabase 客戶端設定
│   ├── types/                # TypeScript 類型定義
│   │   └── task.ts          # 任務相關類型
│   ├── styles/               # 全域樣式
│   │   └── globals.css      # 全域 CSS 變數和基礎樣式
│   ├── App.tsx               # 主應用組件
│   ├── App.css               # 主應用樣式
│   ├── main.tsx              # 應用入口
│   └── index.css             # 入口樣式
├── database-schema.sql       # 資料庫 Schema SQL 腳本
├── .env.example              # 環境變數範本
├── package.json              # 專案依賴和腳本
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 配置
└── SPECIFICATION.md          # 本規格文件
```

## 組件架構

### CategorySection
分類區塊組件，負責：
- 顯示分類標題和圖示
- 管理該分類下的所有任務
- 處理新增、編輯、刪除、排序操作
- 整合拖放功能

**Props:**
- `category: TaskCategory` - 分類類型
- `title: string` - 分類標題
- `icon: string` - 分類圖示（Emoji）

### TaskList
任務列表組件，負責：
- 顯示任務列表
- 處理空狀態顯示
- 整合可排序的任務項目

**Props:**
- `tasks: Task[]` - 任務陣列
- `onUpdate: (id, data) => Promise<void>` - 更新回調
- `onDelete: (id) => Promise<void>` - 刪除回調

### TaskItem
單一任務項目組件，負責：
- 顯示任務內容
- 處理編輯和刪除操作
- 提供拖放手柄

**Props:**
- `task: Task` - 任務物件
- `onUpdate: (id, data) => Promise<void>` - 更新回調
- `onDelete: (id) => Promise<void>` - 刪除回調
- `dragHandleProps?: any` - 拖放屬性
- `isDragging?: boolean` - 是否正在拖動

### TaskForm
任務表單組件，負責：
- 新增或編輯任務的表單
- 驗證輸入
- 提交和取消操作

**Props:**
- `onSubmit: (data) => Promise<void>` - 提交回調
- `onCancel: () => void` - 取消回調
- `initialData?: TaskFormData` - 初始資料（編輯模式）
- `submitLabel?: string` - 提交按鈕文字

## 資料流程

### useTasks Hook

自訂 Hook，負責管理單一分類的任務資料：

**狀態:**
- `tasks: Task[]` - 任務列表
- `loading: boolean` - 載入狀態
- `error: string | null` - 錯誤訊息

**方法:**
- `addTask(data: TaskFormData)` - 新增任務
- `updateTask(id: string, data: TaskFormData)` - 更新任務
- `deleteTask(id: string)` - 刪除任務
- `reorderTasks(newOrder: Task[])` - 重新排序任務
- `refreshTasks()` - 重新載入任務

## 環境設定

### 環境變數

建立 `.env.local` 檔案（從 `.env.example` 複製）：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase 設定步驟

1. 在 Supabase 專案中建立新資料表
2. 執行 `database-schema.sql` 中的 SQL 腳本
3. 從 Supabase 專案設定中取得：
   - Project URL
   - Anon/Public Key
4. 將上述資訊填入 `.env.local`

## 設計規範

### 配色方案

```css
/* 主要顏色 */
--color-primary: #2563eb;           /* 主要藍色 */
--color-primary-hover: #1d4ed8;    /* 主要藍色（懸停） */
--color-secondary: #64748b;         /* 次要灰色 */
--color-success: #10b981;          /* 成功綠色 */
--color-danger: #ef4444;            /* 危險紅色 */

/* 背景顏色 */
--color-bg: #ffffff;                /* 白色背景 */
--color-bg-secondary: #f8fafc;     /* 次要背景 */
--color-bg-tertiary: #f1f5f9;      /* 第三背景 */

/* 文字顏色 */
--color-text: #1e293b;              /* 主要文字 */
--color-text-secondary: #64748b;   /* 次要文字 */
--color-text-muted: #94a3b8;       /* 弱化文字 */

/* 分類標題顏色 */
分類標題: #1e3a8a (深藍色)
分類標題字體大小: 24px
```

### 間距系統

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### 圓角系統

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
```

### 陰影系統

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

### 背景設計

- **背景圖片**: `src/assets/bg0115.png`
- **背景設定**: 
  - `background-size: cover`
  - `background-position: center`
  - `background-attachment: fixed`
- **透明漸層**: 從底部向上漸變
  - 底部: `rgba(248, 250, 252, 1)` (100% 不透明)
  - 20%: `rgba(248, 250, 252, 0.9)`
  - 50%: `rgba(248, 250, 252, 0.5)`
  - 80%: `transparent` (完全透明)

### 響應式設計

- **桌面** (> 1024px): 三欄並排
- **平板** (769px - 1024px): 兩欄並排
- **手機** (< 768px): 單欄顯示

## 開發指南

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

開發伺服器將在 `http://localhost:5173` 啟動。

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

### 程式碼檢查

```bash
npm run lint
```

## API 整合

### Supabase 客戶端

位置: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 資料操作

所有資料操作透過 Supabase 客戶端進行：

- **查詢**: `supabase.from('tasks').select().eq('category', category).order('order_index')`
- **新增**: `supabase.from('tasks').insert(data)`
- **更新**: `supabase.from('tasks').update(data).eq('id', id)`
- **刪除**: `supabase.from('tasks').delete().eq('id', id)`

## 錯誤處理

- 所有 API 操作都包含錯誤處理
- 錯誤訊息顯示在使用者介面上
- 載入失敗時自動重新載入資料
- 拖放排序失敗時恢復原始順序

## 效能優化

- 使用 React Hooks 進行狀態管理
- 樂觀更新 UI（拖放排序）
- 資料庫索引優化查詢效能
- 響應式圖片載入
- CSS 變數減少重複樣式

## 瀏覽器支援

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 未來擴充功能建議

1. 使用者認證系統
2. 任務完成狀態
3. 任務優先級
4. 任務截止日期
5. 任務標籤系統
6. 任務搜尋功能
7. 任務篩選功能
8. 資料匯出功能
9. 深色模式
10. 多語言支援

## 版本資訊

- **版本**: 0.0.0
- **建立日期**: 2025-01-15
- **最後更新**: 2025-01-15

## 授權

本專案為私有專案。

## 聯絡資訊

如有問題或建議，請聯繫專案維護者。

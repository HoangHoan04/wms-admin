# Kế hoạch phát triển WMS Admin (Vue 3 + TypeScript) chuẩn kiến trúc tham chiếu HrmAdmin

Xây dựng và tái cấu trúc dự án **`wms-admin`** (`f:\Projects\erp\wms\wms-admin`) theo chuẩn kiến trúc hiện đại của **Vue 3 (Composition API, `<script setup lang="ts">`, Vite, Pinia, Ant Design Vue)**, kế thừa toàn bộ giao diện, trải nghiệm người dùng (UX/UI), cơ chế **Song ngữ (i18n)**, bộ tùy biến giao diện thời gian thực (**ConfigSetting & Theming**), hệ thống **Layouts**, **TabsBar**, **Shared Components** và **Core Services** từ dự án tham chiếu **`HrmAdmin`**.

---

## 1. Bản đồ ánh xạ công nghệ (Angular HrmAdmin ➔ Vue 3 wms-admin)

| Thành phần trong HrmAdmin (Angular) | Tương đương chuẩn trong wms-admin (Vue 3) | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Framework & Build** | **Vue 3 + Vite + TypeScript** | Composition API (`<script setup>`), SFC, alias `@/` |
| **UI Component Library** | **Ant Design Vue (`ant-design-vue` ^4.x) + `@ant-design/icons-vue`** | Tương thích 100% về visual, layout, grid, component với `ng-zorro-antd` |
| **State Management** | **Pinia (`pinia`)** | `useDashboardStore`, `useAuthStore`, `useSidebarStore`, `useTabsStore`, `useNotificationStore` |
| **Routing & Navigation** | **Vue Router 4 (`vue-router`)** | Route guards (Auth, Permission, Dynamic Title, Tab tracking) |
| **Hệ thống Song ngữ** | **`vue-i18n` + Dynamic Manifest Loader (`scripts/generate-i18n-manifest.js`)** | Nạp động toàn bộ file JSON từ `public/i18n/{vi,en}` thông qua manifest, gộp `deepMerge` |
| **ConfigSetting & Theme Engine** | **`useDashboardStore` + `ConfigSettingDrawer.vue` + CSS Variables / Ant Design `a-config-provider`** | Primary color (10 màu), Theme (Light/Dark/System), Layout modes, Transitions, Font families, Tab styles, Solid/Gradient Navbar & Sidebar |
| **HTTP Client & Interceptors** | **Axios (`src/api/axios.ts`)** | Bearer JWT interceptor, Global Loading, Error Toast, 401 Auto-refresh / Redirect |
| **Shared Components** | **Vue 3 Components (`src/components/shared/`)** | `TableCustom.vue`, `FilterCustom.vue`, `ExcelImportModal.vue`, `FileUpload.vue`, `ActionLog.vue` |
| **Biểu đồ & Tiện ích** | **ECharts (`echarts` + `vue-echarts`), `xlsx`** | Dashboard thống kê kho bãi, nhập xuất, tồn kho, import/export Excel |

---

## 2. Cấu trúc thư mục chuẩn Vue 3 (`src/`)

```text
wms-admin/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── i18n/                          <-- Thư mục chứa tài nguyên song ngữ
│       ├── manifest.json              <-- Tự động sinh từ script
│       ├── vi/                        <-- Tiếng Việt (chia nhỏ theo domain)
│       │   ├── common/*.json          <-- auth, menu, navbar, configSetting, routes, table...
│       │   ├── system/*.json          <-- role, settings...
│       │   └── warehouse/*.json       <-- inventory, inbound, outbound, product...
│       └── en/                        <-- English tương ứng
├── scripts/
│   └── generate-i18n-manifest.js      <-- Script tự động quét và sinh i18n/manifest.json
├── src/
│   ├── api/                           <-- Quản lý API & Axios
│   │   ├── axios.ts                   <-- Axios instance, interceptors (JWT, Error, Loading)
│   │   ├── modules/                   <-- auth.api.ts, warehouse.api.ts, system.api.ts...
│   │   └── types/                     <-- API Request & Response Types
│   ├── assets/
│   │   ├── icons/                     <-- SVG icons (vi.svg, en.svg, app icons...)
│   │   └── styles/
│   │       ├── _variables.scss        <-- Biến màu, breakpoint, spacing
│   │       ├── _global.scss           <-- Utility classes, reset, typography
│   │       ├── _transitions.scss      <-- Animation hiệu ứng chuyển trang (fade, slide, zoom...)
│   │       └── main.scss              <-- Entry SCSS tổng
│   ├── components/
│   │   ├── layout/                    <-- Các widget con của Admin Layout
│   │   │   ├── AppNavbar.vue
│   │   │   ├── AppSidebar.vue
│   │   │   ├── AppTabsBar.vue
│   │   │   ├── AppBreadcrumb.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── SearchBox.vue
│   │   │   ├── NavbarNotification.vue
│   │   │   ├── FullscreenToggle.vue
│   │   │   ├── LanguageSelect.vue
│   │   │   ├── ThemeToggle.vue
│   │   │   └── ConfigSettingDrawer.vue <-- Drawer cấu hình toàn diện hệ thống
│   │   └── shared/                    <-- Bộ Shared Components chuẩn doanh nghiệp
│   │       ├── TableCustom.vue        <-- Bảng dữ liệu đa năng phân trang, sort, filter
│   │       ├── FilterCustom.vue       <-- Thanh lọc linh hoạt đa dạng kiểu input
│   │       ├── ExcelImportModal.vue   <-- Modal import Excel có preview & validation
│   │       ├── FileUpload.vue         <-- Component upload kéo thả file
│   │       └── ActionLog.vue          <-- Timeline nhật ký thao tác
│   ├── composables/                   <-- Vue 3 Composables
│   │   ├── useTheme.ts                <-- Xử lý Dark/Light theme, primary color
│   │   ├── useI18nMessage.ts          <-- Helper dịch thông báo đa ngôn ngữ
│   │   ├── useActionConfirm.ts        <-- Dialog xác nhận xóa / duyệt
│   │   └── useFullscreen.ts           <-- Toggle toàn màn hình
│   ├── constants/                     <-- Hằng số, Enum, Route paths, Permission codes
│   ├── layouts/                       <-- Layouts chính
│   │   ├── AdminLayout.vue            <-- Layout quản trị (Sidebar + Navbar + Tabs + Content + Config Drawer)
│   │   └── AuthLayout.vue             <-- Layout đăng nhập Glassmorphic
│   ├── pages/                         <-- Các trang giao diện
│   │   ├── auth/                      <-- LoginPage.vue, ForgotPassword.vue
│   │   ├── main/                      <-- Dashboard, Warehouse, Inventory, Settings, Roles...
│   │   │   ├── home/                  <-- HomeDashboard.vue (ECharts WMS)
│   │   │   ├── warehouse/             <-- Danh sách kho, quản lý vị trí
│   │   │   ├── inventory/             <-- Quản lý tồn kho, nhập xuất
│   │   │   └── system/                <-- SystemSettings.vue, RoleManager.vue
│   │   └── other/                     <-- NotFound.vue (404), ServerError.vue (500), ComingSoon.vue
│   ├── plugins/                       <-- i18n plugin, Ant Design Vue config
│   │   └── i18n.ts                    <-- Cấu hình Vue I18n với dynamic manifest loader
│   ├── router/                        <-- Vue Router
│   │   ├── index.ts                   <-- Routes cấu hình
│   │   └── guards.ts                  <-- Navigation guards (AuthGuard, PermissionGuard, Title, Tabs sync)
│   ├── stores/                        <-- Pinia Stores
│   │   ├── dashboard.store.ts         <-- Quản lý Theme, Primary Color, Layout Mode, Fonts, Transitions
│   │   ├── auth.store.ts              <-- Quản lý User, Token, Permissions, Login/Logout
│   │   ├── sidebar.store.ts           <-- Trạng thái collapse, menu active, menus tree
│   │   ├── tabs.store.ts              <-- Quản lý danh sách tabs mở, active tab, đóng/làm mới tab
│   │   └── notification.store.ts      <-- Danh sách thông báo navbar
│   ├── types/                         <-- TypeScript interfaces (User, Menu, Settings, Common)
│   ├── utils/                         <-- Helper functions (storage, file, format, auth)
│   ├── App.vue                        <-- Root Vue component bọc trong a-config-provider
│   └── main.ts                        <-- Entry point (khởi tạo App, Pinia, Router, i18n, Antd)
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 3. Chi tiết các tính năng quan trọng

### A. Hệ thống Song ngữ (i18n) nạp theo Dynamic Manifest
- **Tự động quét**: Script `scripts/generate-i18n-manifest.js` chạy trước khi dev/build (`predev`, `prebuild`) để sinh danh sách file JSON trong `public/i18n/vi/` thành `public/i18n/manifest.json`.
- **Nạp động & Gộp dữ liệu**: `src/plugins/i18n.ts` tải manifest, tải song song toàn bộ file JSON tương ứng theo ngôn ngữ được chọn (`vi` hoặc `en`), thực hiện `deepMerge` tạo thành message bundle đầy đủ.
- **Lưu trạng thái**: Tự động lưu ngôn ngữ hiện tại vào `localStorage`, đồng bộ trực tiếp với `LanguageSelect.vue` và Ant Design Vue locale (`viVN` / `enUS`).

### B. ConfigSetting & Theme Engine thời gian thực
- **`useDashboardStore` (Pinia)**:
  - **Màu chủ đạo (Primary Color)**: Bảng 10 màu (`blue`, `red`, `yellow`, `brown`, `purple`, `pink`, `orange`, `emerald`, `teal`, `indigo`). Áp dụng trực tiếp vào biến CSS `--primary-color` và token Ant Design Vue (`theme: { token: { colorPrimary } }`).
  - **Chế độ giao diện (Theme Mode)**: Light / Dark / System (đồng bộ `class="dark"` trên `<html>`).
  - **Kiểu Layout (Layout Modes)**: `horizontal`, `detached`, `modern`, `two column`, `hovered`, `boxed`, `transparent`, `without header`, `RTL`...
  - **Hiệu ứng chuyển trang (Transition Effects)**: `fade`, `fade-side`, `fade-up`, `slide-left`, `zoom-in`, `rotate`, `flip-x`, `bounce`...
  - **Font chữ Google Fonts**: `Inter`, `Roboto`, `Montserrat`, `Playfair Display`, `Outfit`.
  - **Kiểu TabsBar (Tab Styles)**: `chrome`, `card`, `icon`, `simple`.
  - **Màu sắc Navbar & Sidebar**: Hỗ trợ dải màu Solid Colors (10 màu) và Gradient Colors (10 màu) cho cả chế độ sáng và tối.
  - **Tiện ích**: Nút Copy JSON cấu hình hiện tại vào Clipboard, nút Reset về mặc định, nút Xóa bộ nhớ đệm (Clear cache & logout).

### C. Hệ thống Admin Layout & TabsBar Đa năng
- **Sidebar**: Render menu động từ cấu hình phân quyền, hỗ trợ submenu nhiều cấp, tìm kiếm nhanh menu, chế độ thu gọn (`collapsed`) kèm tooltip.
- **Navbar**: Tích hợp ô tìm kiếm, thông báo popover với số lượng badge, nút toàn màn hình, nút chuyển đổi ngôn ngữ (icon cờ VI/EN), nút chuyển nhanh Dark/Light mode, nút mở Drawer ConfigSetting, Avatar tài khoản với menu ngữ cảnh.
- **TabsBar**: Quản trị đa tab như trình duyệt web, lưu trạng thái tab mở, cho phép đóng tab hiện tại, đóng tab khác, đóng tất cả, làm mới (refresh) nội dung tab đang xem.
- **Breadcrumb**: Tự động sinh dựa trên route hiện tại và metadata.

### D. Hệ thống Shared Components chuẩn doanh nghiệp
- **`TableCustom.vue`**:
  - Hỗ trợ dữ liệu từ xa (Remote Pagination, Sorting, Search).
  - Tùy biến hiển thị cột, cố định cột trái/phải, xuất dữ liệu, chọn hàng loạt (Selection Checkbox).
  - Tích hợp sẵn trạng thái Loading, Empty, Error.
- **`FilterCustom.vue`**:
  - Hỗ trợ các kiểu filter: Text, Select (Single/Multiple), DatePicker, DateRangePicker, NumberRange.
  - Các nút: Tìm kiếm, Làm mới bộ lọc, Ẩn/Hiện bộ lọc nâng cao.
- **`ExcelImportModal.vue`**:
  - Tải file mẫu (.xlsx).
  - Kéo thả file Excel, đọc dữ liệu bằng thư viện `xlsx`, hiển thị bảng xem trước (Preview Data).
  - Kiểm tra tính hợp lệ từng dòng và báo lỗi chi tiết trước khi gửi API.
- **`FileUpload.vue`**:
  - Kéo thả upload, preview ảnh/tệp, giới hạn dung lượng & định dạng file.
- **`ActionLog.vue`**:
  - Timeline hiển thị lịch sử thay đổi (người thực hiện, thời gian, hành động, dữ liệu trước/sau).

### E. Giao diện Auth Glassmorphic & Dashboard WMS
- **Auth Layout & Pages**:
  - Thiết kế Glassmorphism với animation chuyển động, gradient blobs, lưới toạ độ hiện đại, form đăng nhập, form quên mật khẩu, modal liên hệ cấp tài khoản nội bộ.
  - Mock Auth tích hợp sẵn (tài khoản `admin` / `123`) và cấu trúc sẵn sàng kết nối API thật.
- **WMS Overview Dashboard (`HomeDashboard.vue`)**:
  - Thẻ thống kê KPI (Tổng SKU, Tỷ lệ lấp đầy kho, Đơn nhập hôm nay, Đơn xuất hôm nay).
  - Biểu đồ ECharts: Xu hướng nhập/xuất theo thời gian (Line/Bar Chart), Cơ cấu phân bổ hàng theo nhóm ngành (Doughnut Chart).
  - Bảng top mặt hàng sắp hết hạn/cảnh báo tồn kho thấp.

---

## 4. Các bước triển khai chi tiết

### Bước 1: Cài đặt Dependencies & Cấu hình Build
- Cập nhật `package.json` với các gói:
  - `pinia`, `vue-i18n@^10`, `ant-design-vue@^4`, `@ant-design/icons-vue`, `axios`, `echarts`, `vue-echarts`, `xlsx`, `sass`.
- Cấu hình `vite.config.ts` (alias `@/`, SCSS prepends, SSR/Build optimization).
- Thêm `scripts/generate-i18n-manifest.js` và cấu hình script npm (`"predev": "node scripts/generate-i18n-manifest.js"`).

### Bước 2: Xây dựng Hệ thống i18n & Ngôn ngữ Song ngữ (VI / EN)
- Tạo toàn bộ cây thư mục `public/i18n/vi/**` và `public/i18n/en/**` bao gồm:
  - `common/auth.json`, `common/common.json`, `common/menu.json`, `common/navbar.json`, `common/configSetting.json`, `common/routes.json`, `common/table.json`, `common/notification.json`, `common/error.json`, `common/enums.json`, `common/tabsBar.json`, `common/search.json`, `common/home.json`, `common/actionLog.json`.
  - `system/role.json`, `system/settings.json`.
  - `warehouse/inventory.json`, `warehouse/product.json`, `warehouse/warehouse.json`.
- Cài đặt plugin `src/plugins/i18n.ts`.

### Bước 3: Xây dựng Hệ thống Styles & Theming
- Thiết lập `src/assets/styles/_variables.scss`, `_global.scss`, `_transitions.scss`, `main.scss`.
- Bổ sung toàn bộ icons SVG chất lượng cao trong `src/assets/icons/` (`vi.svg`, `en.svg`, app icons...).

### Bước 4: Xây dựng Stores & Core Layer
- Khởi tạo Pinia stores: `useDashboardStore`, `useAuthStore`, `useSidebarStore`, `useTabsStore`, `useNotificationStore`.
- Thiết lập `src/api/axios.ts` với đầy đủ interceptors, token handling, global loading & toast.
- Xây dựng Router & Navigation Guards trong `src/router/` (`guards.ts`, `index.ts`).
- Xây dựng Composables (`useTheme`, `useI18nMessage`, `useActionConfirm`, `useFullscreen`).

### Bước 5: Xây dựng Hệ thống Layouts & Components
- Xây dựng các widget con trong `src/components/layout/`:
  - `ConfigSettingDrawer.vue` (đầy đủ các tính năng: palette màu, dark/light, layout mode, transitions, font, tabs style, navbar/sidebar colors, reset, copy config).
  - `AppNavbar.vue`, `AppSidebar.vue`, `AppTabsBar.vue`, `AppBreadcrumb.vue`, `AppFooter.vue`, `LanguageSelect.vue`, `ThemeToggle.vue`, `SearchBox.vue`, `NavbarNotification.vue`, `FullscreenToggle.vue`.
- Xây dựng `AdminLayout.vue` và hoàn thiện `AuthLayout.vue`.

### Bước 6: Xây dựng Bộ Shared Components
- Cài đặt `TableCustom.vue`, `FilterCustom.vue`, `ExcelImportModal.vue`, `FileUpload.vue`, `ActionLog.vue`.

### Bước 7: Xây dựng Các Trang Chức Năng Mẫu
- Auth: `LoginPage.vue`, `ForgotPassword.vue`.
- Main: `HomeDashboard.vue` (Dashboard WMS ECharts), `WarehouseList.vue`, `InventoryList.vue`, `SystemSettings.vue`, `RoleManager.vue`.
- Other: `NotFound.vue`, `ServerError.vue`, `ComingSoon.vue`.

---

## 5. Kế hoạch xác thực & Kiểm thử (Verification Plan)

### A. Kiểm thử Build & Typescript
```bash
# 1. Chạy sinh manifest i18n
node scripts/generate-i18n-manifest.js

# 2. Kiểm tra type check và build Vite
npm run build
```

### B. Kiểm thử Trực quan & Chức năng (Dev Server)
- **Kiểm tra Song ngữ (i18n)**:
  - Chuyển đổi qua lại giữa Tiếng Việt và Tiếng Anh trên Navbar.
  - Xác nhận toàn bộ Menu, Tiêu đề trang, Bảng dữ liệu, Nút bấm, Thông báo thay đổi tức thì và không bị sót key thô dạng `common.xxx`.
- **Kiểm tra Drawer Cấu hình (ConfigSetting)**:
  - Chọn đổi qua lại giữa 10 màu chủ đạo (Primary color) -> Ant Design components và biến CSS đổi màu đồng bộ.
  - Chuyển Dark mode / Light mode / System -> Giao diện đổi nền, chữ, border mượt mà.
  - Chọn các chế độ Layout mode (Horizontal, Detached, Modern, Two Column, Boxed...) -> Khung layout thay đổi chuẩn xác.
  - Đổi kiểu TabsBar (Chrome, Card, Icon, Simple) và Font chữ (Inter, Roboto, Outfit...).
  - Test nút Sao chép JSON và Reset cấu hình.
- **Kiểm tra TabsBar**:
  - Mở nhiều trang -> Tabs xuất hiện tương ứng.
  - Thao tác: Chuyển tab, Đóng tab hiện tại, Đóng các tab khác, Làm mới nội dung tab.
- **Kiểm tra Shared Components**:
  - Mở trang Quản lý Kho / Tồn kho: Kiểm tra FilterCustom, TableCustom phân trang, sắp xếp.
  - Thử mở Modal Import Excel và Upload file.
- **Kiểm tra Auth Flow**:
  - Đăng nhập với tài khoản `admin` / `123`.
  - Kiểm tra ghi nhớ đăng nhập, lưu token vào `localStorage`, chuyển hướng chuẩn và đăng xuất an toàn.

# ⚡ TechStore — Cửa hàng Thiết bị Công nghệ

> Ứng dụng web thương mại điện tử mini, cho phép khách hàng xem và tìm kiếm sản phẩm công nghệ, đồng thời cung cấp hệ thống quản trị đầy đủ cho Admin.

---

## 📌 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Chức năng](#-chức-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Tài khoản demo](#-tài-khoản-demo)
- [API Endpoints](#-api-endpoints)

---

## 🧭 Giới thiệu

**TechStore** là ứng dụng web thương mại điện tử được xây dựng bằng **ReactJS**, mô phỏng một cửa hàng bán thiết bị công nghệ trực tuyến. Dự án hướng đến hai nhóm người dùng chính:

- **Khách hàng** — duyệt sản phẩm, lọc theo danh mục, xem chi tiết sản phẩm.
- **Quản trị viên (Admin)** — quản lý toàn bộ danh mục và sản phẩm thông qua giao diện CRUD chuyên dụng.

Dữ liệu được lưu trữ và phục vụ qua **json-server**, mô phỏng một REST API thực tế trong môi trường phát triển.

---

## ✨ Chức năng

### 👤 Authentication — Xác thực người dùng

| Chức năng | Mô tả |
|---|---|
| Đăng nhập | Form đăng nhập kiểm tra thông tin với dữ liệu trong `db.json` qua Fetch API |
| Lưu phiên | Thông tin người dùng (không bao gồm mật khẩu) được lưu vào `localStorage` |
| Đăng xuất | Xóa `localStorage`, chuyển hướng về trang chủ |
| Phân quyền | Hệ thống phân biệt hai role: `admin` và `customer` |
| Bảo vệ route | Route `/admin/products` chỉ cho phép truy cập nếu role là `admin` |

---

### 🏠 Trang chủ — Khách hàng (`/`)

| Chức năng | Mô tả |
|---|---|
| Danh sách sản phẩm | Hiển thị toàn bộ sản phẩm dưới dạng lưới Card (Grid), responsive theo màn hình |
| Lọc theo danh mục | Dropdown cho phép lọc sản phẩm theo từng Category |
| Sắp xếp theo giá | Toggle button sắp xếp giá tăng dần / giảm dần |
| Đếm kết quả | Hiển thị số sản phẩm đang được lọc theo thời gian thực |
| Hero Section | Banner giới thiệu kèm thống kê tổng số sản phẩm và danh mục |

---

### 🔍 Chi tiết sản phẩm (`/product/:id`)

| Chức năng | Mô tả |
|---|---|
| Xem chi tiết | Hiển thị đầy đủ: ảnh, tên, giá, danh mục, mô tả sản phẩm |
| Lấy tên danh mục | Fetch song song thông tin sản phẩm và category tương ứng |
| Quay lại | Nút quay lại trang trước bằng `useNavigate(-1)` |
| Thêm vào giỏ | Nút giả lập thêm giỏ hàng với phản hồi trực quan |

---

### 🔐 Admin Dashboard — Quản lý sản phẩm (`/admin/products`)

| Chức năng | Mô tả |
|---|---|
| Danh sách sản phẩm | Hiển thị bảng đầy đủ: ảnh, tên, danh mục, giá, thao tác |
| Thêm sản phẩm | Modal form — gọi `POST /products` — tự động reload bảng |
| Cập nhật sản phẩm | Modal form điền sẵn dữ liệu — gọi `PUT /products/:id` |
| Xóa sản phẩm | Modal xác nhận — gọi `DELETE /products/:id` |
| Validate form | Kiểm tra đầy đủ các trường phía client trước khi gọi API |
| Preview ảnh | Hiển thị ảnh xem trước khi nhập URL vào form |
| Thông báo | Alert thành công / lỗi sau mỗi thao tác CRUD |

---

### 🧭 Navbar — Thanh điều hướng chung

| Trạng thái | Hiển thị |
|---|---|
| Chưa đăng nhập | Nút **Đăng nhập** |
| Đăng nhập (customer) | Badge tên người dùng + Nút **Đăng xuất** |
| Đăng nhập (admin) | Badge tên + Link **Quản trị** + Nút **Đăng xuất** |

---

## 🛠️ Công nghệ sử dụng

### 🎨 Front-end

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **ReactJS** | 18.x | Thư viện xây dựng UI theo Functional Component |
| **React Router DOM** | v6 | Quản lý điều hướng SPA, nested routes, protected routes |
| **React Bootstrap** | 2.x | Bộ component UI: Navbar, Modal, Table, Card, Grid, Spinner |
| **Bootstrap** | 5.3 | CSS framework: layout, utility classes, responsive grid |
| **Bootstrap Icons** | 1.11 | Thư viện icon vector |
| **Google Fonts** | — | Font `Space Grotesk` + `JetBrains Mono` cho giao diện |
| **Json server** | — | db.json với sơ đồ cấu trúc dữ liệu và quan hệ |

#### React Hooks được sử dụng

| Hook | Sử dụng tại |
|---|---|
| `useState` | Quản lý state local trong tất cả components |
| `useEffect` | Fetch dữ liệu khi component mount (Home, ProductDetail, AdminDashboard) |
| `useParams` | Lấy `:id` từ URL trong trang ProductDetail |
| `useNavigate` | Điều hướng programmatic sau login/logout, quay lại trang trước |
| `useCallback` | Memoize hàm `fetchData` trong AdminDashboard tránh re-render thừa |
| `useLocation` | Theo dõi thay đổi route để cập nhật Navbar theo trạng thái auth |

---

### ⚙️ Back-end

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **json-server** | 0.17.x | Giả lập REST API từ file `db.json`, hỗ trợ GET / POST / PUT / DELETE |
| **Fetch API** | Native | Gọi HTTP request từ phía client đến json-server |
| **localStorage** | Native Browser API | Lưu trữ thông tin phiên đăng nhập phía client |

> **Lưu ý:** json-server đóng vai trò là back-end giả lập trong môi trường phát triển. Trong môi trường thực tế, có thể thay thế bằng Node.js/Express, Spring Boot, hoặc bất kỳ REST API nào.

---

### 🗄️ Database

| Thành phần | Công nghệ | Mô tả |
|---|---|---|
| **Lưu trữ** | `db.json` (json-server) | File JSON phẳng, json-server tự động tạo REST endpoints |
| **Cấu trúc** | Quan hệ qua `categoryId` | `products.categoryId` là khóa ngoại liên kết với `categories.id` |

#### Sơ đồ dữ liệu

```
users
├── id          (number)
├── username    (string)
├── password    (string)
├── role        (string)  → "admin" | "customer"
└── fullName    (string)

categories
├── id          (number)
└── name        (string)

products
├── id          (number)
├── name        (string)
├── price       (number)
├── categoryId  (number)  → FK → categories.id
├── image       (string)  → URL ảnh
└── description (string)
```

#### Quan hệ

```
categories (1) ───────── (N) products
                              └── categoryId = categories.id
```

---

## 📁 Cấu trúc dự án

```
tech-store/
├── db.json                          ← Database (json-server)
├── package.json                     ← Dependencies & scripts
├── public/
│   └── index.html
└── src/
    ├── App.js                       ← Router + ProtectedAdminRoute
    ├── index.js                     ← Entry point
    ├── index.css                    ← Global styles (dark theme)
    │
    ├── utils/
    │   └── constants.js             ← API_BASE, formatPrice()
    │
    ├── components/
    │   ├── Navbar.jsx               ← Thanh điều hướng (responsive theo auth)
    │   ├── Footer.jsx               ← Footer chung
    │   └── ProductCard.jsx          ← Card sản phẩm tái sử dụng
    │
    └── pages/
        ├── Home.jsx                 ← Trang chủ: danh sách + filter + sort
        ├── Login.jsx                ← Trang đăng nhập
        ├── ProductDetail.jsx        ← Chi tiết sản phẩm (/product/:id)
        └── AdminDashboard.jsx       ← Quản trị CRUD (/admin/products)
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- Node.js >= 16.x
- npm >= 8.x

### Các bước

```bash
# 1. Clone dự án
git clone <repository-url>
cd tech-store

# 2. Cài dependencies
npm install

# 3. Chạy đồng thời React app + json-server
npm run dev
```

Hoặc chạy riêng lẻ trên **2 terminal**:

```bash
# Terminal 1 — json-server (port 3001)
npx json-server --watch db.json --port 3001

# Terminal 2 — React app (port 3000)
npm start
```

Mở trình duyệt: **http://localhost:3000**

---

## 🔑 Tài khoản demo

| Role | Username | Password | Quyền truy cập |
|---|---|---|---|
| Admin | `admin` | `admin123` | Tất cả trang + `/admin/products` |
| Customer | `user` | `user123` | Trang chủ + chi tiết sản phẩm |

---

## 📡 API Endpoints

Base URL: `http://localhost:3001`

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/users?username=...` | Xác thực đăng nhập |
| `GET` | `/categories` | Lấy tất cả danh mục |
| `GET` | `/products` | Lấy tất cả sản phẩm |
| `GET` | `/products/:id` | Lấy chi tiết 1 sản phẩm |
| `POST` | `/products` | Thêm sản phẩm mới |
| `PUT` | `/products/:id` | Cập nhật sản phẩm |
| `DELETE` | `/products/:id` | Xóa sản phẩm |

---

> **TechStore** — Dự án học tập môn *Phát triển Ứng dụng Web* · ReactJS · React Router v6 · React Bootstrap · json-server

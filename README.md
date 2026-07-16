# CUEBOTS website package

Đây là bản website CUEBOTS đã được gom và chuẩn hóa để có thể chạy độc lập.

## Trang khởi động

Mở `index.html` tại thư mục gốc. Nên chạy cả thư mục bằng một local static web server để các trang, ảnh và JavaScript tải ổn định.

## Cấu trúc thư mục

- `index.html` — trang Home và điểm vào chính.
- `pages/` — các trang collection, product, service, checkout và blog.
- `css/` — toàn bộ stylesheet.
- `js/` — toàn bộ JavaScript.
- `assets/images/brand/` — logo thương hiệu.
- `assets/images/payments/` — logo phương thức thanh toán.
- `assets/images/catalog/` — ảnh vuông cho Shop by Category.
- `assets/images/collections/` — hero và thumbnail điều hướng collection.
- `assets/images/heroes/` — hero Home/Featured Collections, tách desktop và mobile.
- `assets/images/products/` — ảnh sản phẩm vuông; glove nằm trong thư mục con `gloves/`.
- `assets/images/recommendations/` — poster What are you looking for.
- `assets/images/setups/` — ảnh Recommended Setups theo từng tỉ lệ.
- `assets/images/guides/` và `assets/images/blog/` — Buying Guide và bài blog.
- `assets/images/promotions/` — banner, poster quảng cáo và popup email.
- `assets/images/reviews/`, `services/`, `sizing/` — ảnh review, dịch vụ và hướng dẫn size.
- `assets/videos/trust/` — video popup Why choose CUEBOTS.
- `assets/documents/doc/` — quy chuẩn tên file, log tài nguyên và tài liệu chỉnh sửa.
- `assets/documents/pdf/` — vị trí dự phòng cho PDF.
- `assets/fonts/` — vị trí dự phòng cho font local.

## Quy chuẩn và log

- `assets/documents/doc/doc-file-naming-standard-v1.xlsx` — quy chuẩn tên gốc.
- `assets/documents/doc/doc-web-asset-usage-log-v1.xlsx` — danh sách tài nguyên, vị trí dùng, tỉ lệ và kích thước đề xuất.
- `assets/documents/doc/doc-web-asset-usage-log-v1.csv` — bản CSV của log để lọc/đọc nhanh.

Các ảnh xuất hiện ở khung hình khác tỉ lệ đã được nhân thành file riêng. Khi thiết kế artwork mới, giữ nguyên tên file đích trong log để không phải sửa lại liên kết website.

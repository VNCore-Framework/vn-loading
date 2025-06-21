# VN Loading Screen

Một loading screen đẹp mắt và hiện đại cho FiveM server với giao diện tiếng Việt.

## Preview

<div align="center">
  <img src="/html/images/preview.png" align="center"  height="400" />
</div>


## Tính năng

- 🎨 Giao diện hiện đại với animation mượt mà
- 🎵 Hỗ trợ nhạc nền với playlist
- 📱 Responsive design
- 🎮 Tích hợp hoàn toàn với FiveM
- 🌐 Hỗ trợ social media links
- ⌨️ Hiển thị phím tắt game
- 📊 Hiển thị thông tin server real-time

## Cài đặt

1. Copy thư mục `vn-loading` vào thư mục `resources` của server
2. Thêm `ensure vn-loading` vào file `server.cfg`
3. Restart server

## Cấu hình

### fxmanifest.lua
```lua
fx_version 'cerulean'
game 'gta5'

loadscreen 'html/index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'yes'

client_script 'client.lua'
server_script 'server.lua'
```

### config.js
Chỉnh sửa file `html/js/config.js` để tùy chỉnh:
- Tên server
- Thông tin cập nhật
- Social media links
- Phím tắt game
- Nhạc nền

## Cấu trúc thư mục

```
vn-loading/
├── fxmanifest.lua
├── client.lua
├── server.lua
├── html/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── config.js
│   ├── images/
│   │   ├── logo.png
│   │   ├── discord.png
│   │   └── ...
│   └── media/
│       ├── loadingscreen.mp4
│       ├── clubbanger.mp3
│       └── ...
└── README.md
```

## Tùy chỉnh

### Thay đổi logo
Thay thế file `html/images/logo.png` bằng logo của bạn

### Thay đổi nhạc nền
Thêm file nhạc vào thư mục `html/media/` và cập nhật trong `config.js`

### Thay đổi màu sắc
Chỉnh sửa file `html/css/style.css` để thay đổi theme

## Lệnh

- `reloadloadingscreen` - Reload loading screen (chỉ console)

## Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console browser (F12) để xem lỗi JavaScript
2. Server console để xem lỗi Lua
3. Đảm bảo tất cả file được load đúng

## Credits

Developed by VN Core Team 
const CONFIG = {
    General: {
        autoStart: false,
        autoClose: false,
        autoCloseDelay: 2,
        enableDebug: true,
        enableMusic: true,
        enableBackgroundVideo: true,
        backgroundVideoUrl: "./media/loadingscreen.mp4",
        backgroundVideoVolume: 0,
        autoPlayMusic: true,
        playlist: [
            {
                title: "Club Banger",
                artist: "VnCore Music Team",
                url: "./media/clubbanger.mp3"
            },
            {
                title: "Trap Beat",
                artist: "VnCore Music Team", 
                url: "./media/trapbeat.mp3"
            },
            {
                title: "Slum Beat",
                artist: "VnCore Music Team",
                url: "./media/slumbeat.mp3"
            }
        ]
    },
    Updates: {
        title: "CẬP NHẬT MỚI NHẤT",
        list: [
            "✅ Thêm hệ thống việc làm mới: Thợ sửa xe, Bác sĩ, Luật sư",
            "✅ Cập nhật bản đồ với nhiều địa điểm mới",
            "✅ Tối ưu hiệu suất server, giảm lag",
            "🔄 Đang phát triển: Hệ thống nhà ở mới",
            "🔄 Sắp ra mắt: Sự kiện Halloween đặc biệt"
        ]
    },
    CityIntroduction: {
        title: "GIỚI THIỆU THÀNH PHỐ",
        cityName: "VNCORE FRAMEWORK",
        description: "Chào mừng bạn đến với thành phố VnCore - nơi mọi giấc mơ đều có thể trở thành hiện thực. Tham gia vào một thế giới roleplay chân thực với hàng trăm hoạt động thú vị đang chờ đợi bạn.",
        features: [
            "🏢 Hệ thống việc làm đa dạng với 20+ nghề nghiệp",
            "🎭 Hoạt động roleplay chân thực và sáng tạo",
            "👥 Cộng đồng thân thiện với 500+ thành viên",
            "🎉 Sự kiện thường xuyên và giải thưởng hấp dẫn",
            "💰 Hệ thống kinh tế ổn định và cân bằng"
        ]
    },
    Loading: {
        serverName: "VNCORE FRAMEWORK",
        loadingText: "Đang tải dữ liệu server...",
        tips: [
            "💡 Sử dụng phím F1 để mở radial menu",
            "💡 Nhấn M để ẩn/hiện music player",
            "💡 Sử dụng A/D để chuyển ảnh gallery",
            "💡 Tham gia Discord để kết nối cộng đồng"
        ],
        steps: [
            "Đang kết nối server...",
            "Đang xác thực thông tin người chơi...",
            "Đang tải dữ liệu nhân vật...",
            "Đang đồng bộ hóa tài khoản...",
            "Đang tải tài nguyên game...",
            "Đang khởi tạo hệ thống...",
            "Đang tải bản đồ và texture...",
            "Đang kết nối cơ sở dữ liệu...",
            "Đang tải các module cần thiết...",
            "Đang kiểm tra cập nhật...",
            "Đang tối ưu hiệu suất...",
            "Chuẩn bị vào game..."
        ]
    },
    SocialMedia: {
        discord: {
            enabled: true,
            url: "https://discord.gg/vncore",
            icon: "discord"
        },
        website: {
            enabled: true,
            url: "https://vncore.vn",
            icon: "website"
        },
        facebook: {
            enabled: true,
            url: "https://facebook.com/vncore",
            icon: "fb"
        },
        youtube: {
            enabled: true,
            url: "https://youtube.com/vncore",
            icon: "youtube"
        }
    },
    KeyboardShortcuts: {
        enabled: true,
        shortcuts: [
            {key: "TAB", description: "KHO ĐỒ"},
            {key: "F1", description: "RADIAL MENU"},
            {key: "F3", description: "EMOTION"},
            {key: "F4", description: "PING JOB"},
            {key: "F6", description: "POLICE MENU"},
            {key: "F9", description: "SCOREBOARD"},
            {key: "G", description: "GIÂY AN TOÀN"},
            {key: "F", description: "XUỐNG/LÊN XE"},
            {key: "ALT", description: "TARGET"},
            {key: "F10", description: "CHAT"}
        ]
    }
}; 
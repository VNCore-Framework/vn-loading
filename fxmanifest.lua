fx_version 'cerulean'
game 'gta5'

author 'VN Core'
description 'VN Loading Screen'
version '1.0.0'

loadscreen 'html/index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'yes'

client_script 'client.lua'
server_script 'server.lua'

files {
    'html/index.html',
    'html/test-loading.html',
    'html/css/style.css',
    'html/js/main.js',
    'html/js/config.js',
    'html/images/*.png',
    'html/media/*.mp3',
    'html/media/*.mp4'
} 
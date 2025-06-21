local spawn1 = false
local loadingProgress = 0
local currentStep = 0

function SendLoadingProgress(progress, step)
    SendNUIMessage({
        type = 'loadingProgress',
        data = {
            progress = progress,
            step = step
        }
    })
end

function SendLoadingComplete()
    SendNUIMessage({
        type = 'loadingComplete',
        data = {}
    })
end

Citizen.CreateThread(function()
    local steps = {
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
    }
    
    Citizen.Wait(1000)
    
    for i = 0, #steps - 1 do
        if spawn1 then break end
        
        local progress = (i / (#steps - 1)) * 90 -- Chỉ đến 90%, 10% cuối để dành cho playerSpawned
        SendLoadingProgress(progress, i)
        
        Citizen.Wait(math.random(1000, 3000))
    end
    
    while not spawn1 do
        SendLoadingProgress(95, #steps - 1)
        Citizen.Wait(500)
    end
end)

AddEventHandler("playerSpawned", function ()
    if not spawn1 then
        SendLoadingProgress(100, 11)
        SendLoadingComplete()
        Citizen.Wait(1000) -- Đợi 1 giây để hiển thị 100%
        ShutdownLoadingScreenNui()
        spawn1 = true
    end
end)

AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        print('Loading screen resource started')
    end
end)
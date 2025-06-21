document.addEventListener('DOMContentLoaded', () => {
    if (typeof CONFIG === 'undefined') {
        return;
    }

    let currentStepIndex = 0;
    let currentTipIndex = 0;
    let progress = 0;
    let isVisible = true;
    let isDevelopment = !window.invokeNative;
    let currentLoadingStep = 0;

    setTimeout(() => {
        forceUpdateUI();
    }, 50);

    function initializeUI() {
        document.getElementById('serverName').textContent = CONFIG.Loading.serverName;
        document.getElementById('loadingText').textContent = CONFIG.Loading.loadingText;
        document.getElementById('updateList').textContent = CONFIG.Updates.list;
        document.getElementById('cityDescription').textContent = CONFIG.CityIntroduction.description;
        document.getElementById('cityFeatures').textContent = CONFIG.CityIntroduction.features;

        const updatesList = document.getElementById('updatesList');
        CONFIG.Updates.list.forEach(update => {
            const li = document.createElement('li');
            li.textContent = update;
            updatesList.appendChild(li);
        });

        document.getElementById('cityDescription').textContent = CONFIG.CityIntroduction.description;
        const cityFeatures = document.getElementById('cityFeatures');
        CONFIG.CityIntroduction.features.forEach(feature => {
            const div = document.createElement('div');
            div.textContent = feature;
            cityFeatures.appendChild(div);
        });

        updateLoadingProgress();
        rotateTips();
    }

    function populateSocialMedia() {
        const socialIcons = document.getElementById('socialIcons');
        
        if (!socialIcons) {
            return;
        }

        socialIcons.innerHTML = '';
        
        Object.entries(CONFIG.SocialMedia).forEach(([platform, data]) => {
            if (data.enabled) {
                const socialIcon = document.createElement('a');
                socialIcon.href = data.url;
                socialIcon.className = 'socialIcon';
                socialIcon.id = platform;
                
                const platformName = platform.toUpperCase();
                
                socialIcon.innerHTML = `
                    <img src="images/${data.icon}.png" alt="${platformName}" class="socialImage ${platform}Icon">
                    <span class="socialName">${platformName}</span>
                `;
                
                socialIcons.appendChild(socialIcon);
            }
        });
    }

    function checkRequiredElements() {
        const elements = {
            progressCircle: document.querySelector('.progressSvg circle[stroke-dasharray]'),
            percentage: document.querySelector('.percentage'),
            currentStep: document.getElementById('currentStep')
        };
        
        const missingElements = [];
        Object.entries(elements).forEach(([name, element]) => {
            if (!element) {
                missingElements.push(name);
            }
        });
        
        if (missingElements.length > 0) {
            return false;
        }
        
        return true;
    }

    function updateLoadingProgress(loadingProgress = null, loadingStep = null) {
        if (!checkRequiredElements()) {
            return;
        }
        
        if (loadingProgress !== null) {
            progress = loadingProgress;
        }
        
        if (loadingStep !== null) {
            currentLoadingStep = loadingStep;
        }

        const progressCircle = document.querySelector('.progressSvg circle[stroke-dasharray]');
        if (progressCircle) {
            const circumference = 2 * Math.PI * 85;
            const offset = circumference - (progress / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
        
        const percentageElement = document.querySelector('.percentage');
        if (percentageElement) {
            percentageElement.textContent = Math.round(progress) + '%';
        }

        const currentStepElement = document.getElementById('currentStep');
        if (currentStepElement && CONFIG.Loading.steps[currentLoadingStep]) {
            currentStepElement.style.opacity = '0';
            currentStepElement.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                currentStepElement.textContent = CONFIG.Loading.steps[currentLoadingStep];
                currentStepElement.style.opacity = '1';
                currentStepElement.style.transform = 'translateY(0)';
            }, 300);
        }

        if (progress >= 100) {
            if (CONFIG.General.autoClose) {
                setTimeout(closeLoadingScreen, CONFIG.General.autoCloseDelay * 1000);
            }
        }
    }

    function rotateTips() {
        const tipElement = document.getElementById('currentTip');
        
        function updateTip() {
            tipElement.style.opacity = '0';
            setTimeout(() => {
                tipElement.textContent = CONFIG.Loading.tips[currentTipIndex];
                tipElement.style.opacity = '1';
                currentTipIndex = (currentTipIndex + 1) % CONFIG.Loading.tips.length;
            }, 500);
        }

        updateTip();
        setInterval(updateTip, 5000);
    }

    let audio = null;
    let isPlaying = false;
    let volume = CONFIG.General.musicVolume || 50;
    let currentTrackIndex = 0;
    let playlist = CONFIG.General.playlist || [];

    async function checkAudioFile(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async function initializeMusicPlayer() {
        if (!CONFIG.General.enableMusic) {
            return;
        }

        try {
            audio = new Audio();
            audio.loop = false;
            audio.volume = volume / 100;
            audio.preload = 'auto';

            if (playlist.length > 0) {
                audio.src = playlist[currentTrackIndex].url;
            } else {
                audio.src = CONFIG.General.backgroundMusicUrl;
            }

            const playPauseBtn = document.getElementById('playPause');
            const prevTrackBtn = document.getElementById('prevTrack');
            const nextTrackBtn = document.getElementById('nextTrack');
            const volumeSlider = document.getElementById('volumeSlider');

            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', toggleMusic);
            }

            if (prevTrackBtn) {
                prevTrackBtn.addEventListener('click', previousTrack);
            }

            if (nextTrackBtn) {
                nextTrackBtn.addEventListener('click', nextTrack);
            }

            if (volumeSlider) {
                volumeSlider.value = volume;
                volumeSlider.addEventListener('input', (e) => {
                    volume = e.target.value;
                    if (audio) {
                        audio.volume = volume / 100;
                    }
                });
            }

            audio.addEventListener('canplay', () => {
                if (CONFIG.General.autoPlayMusic) {
                    toggleMusic();
                }
            });

            audio.addEventListener('error', (e) => {
                if (playlist.length > 1) {
                    nextTrack();
                } else {
                    audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
                    audio.load();
                }
            });

            audio.addEventListener('ended', () => {
                if (playlist.length > 1) {
                    nextTrack();
                } else {
                    if (isPlaying) {
                        audio.currentTime = 0;
                        audio.play().catch(() => {
                            isPlaying = false;
                            updatePlayPauseButton();
                        });
                    } else {
                        isPlaying = false;
                        updatePlayPauseButton();
                    }
                }
            });

        } catch (error) {
        }
    }

    function toggleMusic() {
        if (!audio) {
            return;
        }

        const playPauseBtn = document.getElementById('playPause');
        
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play().catch(error => {
                if (playlist.length > 1) {
                    nextTrack();
                } else {
                    audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';
                    audio.play().catch(e => {
                    });
                }
            });
            isPlaying = true;
        }
        
        updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
        const playPauseBtn = document.getElementById('playPause');
        if (playPauseBtn) {
            const icon = playPauseBtn.querySelector('i');
            if (icon) {
                icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
        }
    }

    function previousTrack() {
        if (playlist.length <= 1) {
            if (audio) {
                audio.currentTime = 0;
                if (!isPlaying) {
                    toggleMusic();
                }
            }
            return;
        }

        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex).catch(error => {
        });
    }

    function nextTrack() {
        if (playlist.length <= 1) {
            if (audio) {
                audio.currentTime = 0;
                if (!isPlaying) {
                    toggleMusic();
                }
            }
            return;
        }

        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex).catch(error => {
        });
    }

    async function loadTrack(index) {
        if (!audio || index < 0 || index >= playlist.length) {
            return;
        }

        const wasPlaying = isPlaying;
        const track = playlist[index];
        
        
        const fileExists = await checkAudioFile(track.url);
        if (!fileExists) {
            if (playlist.length > 1) {
                nextTrack();
                return;
            } else {
                audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
                audio.load();
                return;
            }
        }
        
        audio.src = track.url;
        updateMusicInfo();
        
        const errorHandler = (e) => {
            
            if (playlist.length > 1) {
                audio.removeEventListener('error', errorHandler);
                nextTrack();
            } else {
                audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
                audio.load();
            }
        };
        
        audio.addEventListener('error', errorHandler, { once: true });
        
        if (wasPlaying) {
            setTimeout(() => {
                audio.play().catch(error => {
                    isPlaying = false;
                    updatePlayPauseButton();
                });
            }, 100);
        }
    }

    function updateMusicInfo() {
        const songTitle = document.getElementById('songTitle');
        const artistName = document.getElementById('artistName');
        
        if (playlist.length > 0 && currentTrackIndex < playlist.length) {
            const currentTrack = playlist[currentTrackIndex];
            
            if (songTitle) {
                songTitle.textContent = currentTrack.title;
            }
            
            if (artistName) {
                artistName.textContent = currentTrack.artist;
            }
        } else {
            if (songTitle) {
                songTitle.textContent = 'VnCore Theme Song';
            }
            
            if (artistName) {
                artistName.textContent = 'VnCore Music Team';
            }
        }
    }

    if (!isDevelopment) {
        window.addEventListener('message', (event) => {
            const { type, config } = event.data;
            
            switch (type) {
                case 'showLoadingScreen':
                    if (config) {
                        Object.assign(CONFIG, config);
                    }
                    isVisible = true;
                    document.body.style.display = 'flex';
                    break;
                    
                case 'hideLoadingScreen':
                    isVisible = false;
                    document.body.style.display = 'none';
                    break;
            }
        });

        fetch(`https://${GetParentResourceName()}/ready`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({})
        }).catch(() => {
        });
    }

    function closeLoadingScreen() {
        if (!isDevelopment) {
            fetch(`https://${GetParentResourceName()}/closeLoadingScreen`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({})
            });
        } else {
            document.body.style.display = 'none';
        }
    }

    function populateUpdates() {
        const updateTitle = document.getElementById('updateTitle');
        const updateList = document.getElementById('updateList');
        
        if (!updateTitle || !updateList) {
            return;
        }

        updateList.innerHTML = '';
        
        updateTitle.textContent = CONFIG.Updates.title;

        CONFIG.Updates.list.forEach(update => {
            const updateItem = document.createElement('div');
            updateItem.className = 'updateItem';
            updateItem.textContent = update;
            updateList.appendChild(updateItem);
        });
    }

    function populateCityIntro() {
        const cityTitle = document.getElementById('cityTitle');
        const cityName = document.getElementById('cityName');
        const cityDescription = document.getElementById('cityDescription');
        const featuresGrid = document.getElementById('featuresGrid');
        
        if (!cityTitle || !cityName || !cityDescription || !featuresGrid) {
            return;
        }

        featuresGrid.innerHTML = '';
        
        cityTitle.textContent = CONFIG.CityIntroduction.title;
        cityName.textContent = CONFIG.CityIntroduction.cityName;
        cityDescription.textContent = CONFIG.CityIntroduction.description;
        
        CONFIG.CityIntroduction.features.forEach(feature => {
            const featureItem = document.createElement('div');
            featureItem.className = 'featureItem';
            featureItem.innerHTML = `
                <span class="featureIcon">✦</span>
                <span class="featureText">${feature}</span>
            `;
            featuresGrid.appendChild(featureItem);
        });
    }

    let backgroundVideoPlayer = null;

    function initializeBackgroundVideo() {
        if (!CONFIG.General.enableBackgroundVideo) {
            return;
        }

        try {
            const backgroundVideoContainer = document.getElementById('backgroundVideo');
            
            if (!backgroundVideoContainer) {
                return;
            }

            backgroundVideoContainer.innerHTML = '';

            const video = document.createElement('video');
            
            video.setAttribute('autoplay', '');
            video.setAttribute('muted', '');
            video.setAttribute('loop', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            
            video.controls = false;
            video.preload = 'auto';
            
            video.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                object-fit: cover !important;
                z-index: -1 !important;
                pointer-events: none !important;
            `;

            video.addEventListener('canplay', () => {
                setTimeout(() => {
                    video.play().catch(() => {
                        setTimeout(() => {
                            video.play().catch(() => {});
                        }, 1000);
                    });
                }, 100);
            });

            video.addEventListener('error', (e) => {
                const fivemPaths = [
                    './media/loadingscreen.mp4',
                    'media/loadingscreen.mp4',
                    'html/media/loadingscreen.mp4'
                ];
                
                let pathIndex = 0;
                const tryNextPath = () => {
                    if (pathIndex < fivemPaths.length) {
                        video.src = fivemPaths[pathIndex];
                        pathIndex++;
                    } else {
                        createFallbackBackground(backgroundVideoContainer);
                    }
                };
                
                video.addEventListener('error', tryNextPath, { once: true });
                tryNextPath();
            });

            backgroundVideoContainer.appendChild(video);
            video.src = CONFIG.General.backgroundVideoUrl;
            video.load();

            const forcePlayInterval = setInterval(() => {
                if (video.paused && video.readyState >= 2) {
                    video.play().catch(() => {});
                }
                
                if (!video.paused || video.ended) {
                    clearInterval(forcePlayInterval);
                }
            }, 1000);
            
            setTimeout(() => {
                clearInterval(forcePlayInterval);
            }, 10000);

        } catch (error) {
        }
    }

    function createFallbackBackground(container) {
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%) !important;
            background-size: 400% 400% !important;
            animation: gradientShift 15s ease infinite !important;
            z-index: -1 !important;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        container.appendChild(fallback);
    }

    function populateKeyboardShortcuts() {
        const shortcutsList = document.getElementById('shortcutsList');
        
        if (!shortcutsList) {
            return;
        }

        shortcutsList.innerHTML = '';
        
        if (!CONFIG.KeyboardShortcuts.enabled) {
            return;
        }
        
        CONFIG.KeyboardShortcuts.shortcuts.forEach(shortcut => {
            const shortcutItem = document.createElement('div');
            shortcutItem.className = 'shortcutItem';
            shortcutItem.innerHTML = `
                <span class="key">${shortcut.key}</span>
                <span class="description">${shortcut.description}</span>
            `;
            shortcutsList.appendChild(shortcutItem);
        });
    }

    try {
        populateUpdates();
        populateCityIntro();
        populateSocialMedia();
        populateKeyboardShortcuts();
        updateMusicInfo();
        initializeFooterControls();
    } catch (error) {
    }

    initializeMusicPlayer();
    initializeBackgroundVideo();
    initializeFiveMLoading();

    setTimeout(() => {
        forceUpdateUI();
        
        if (checkRequiredElements()) {
            updateLoadingProgress(0, 0);
            
            if (isDevelopment) {
                setTimeout(() => {
                    simulateLoading();
                }, 1000);
            }
        } else {
            setTimeout(() => {
                if (checkRequiredElements()) {
                    updateLoadingProgress(0, 0);
                    if (isDevelopment) {
                        simulateLoading();
                    }
                }
            }, 500);
        }
    }, 100);

    let musicPlayerVisible = true;
    let keyboardPanelVisible = false;

    function initializeFooterControls() {
        const toggleMusicBtn = document.getElementById('toggleMusic');
        const toggleKeyboardBtn = document.getElementById('toggleKeyboard');
        const musicPlayer = document.querySelector('.musicPlayer');
        const keyboardPanel = document.querySelector('.keyboardPanel');

        if (toggleMusicBtn) {
            toggleMusicBtn.addEventListener('click', toggleMusicPlayer);
        }

        if (toggleKeyboardBtn) {
            toggleKeyboardBtn.addEventListener('click', toggleKeyboardPanel);
        }

        updateMusicPlayerVisibility();
        updateKeyboardPanelVisibility();
    }

    function toggleMusicPlayer() {
        musicPlayerVisible = !musicPlayerVisible;
        updateMusicPlayerVisibility();
        updateFooterButtonState('toggleMusic', musicPlayerVisible);
    }

    function toggleKeyboardPanel() {
        keyboardPanelVisible = !keyboardPanelVisible;
        updateKeyboardPanelVisibility();
        updateFooterButtonState('toggleKeyboard', keyboardPanelVisible);
    }

    function updateMusicPlayerVisibility() {
        const musicPlayer = document.querySelector('.musicPlayer');
        if (musicPlayer) {
            musicPlayer.style.display = musicPlayerVisible ? 'block' : 'none';
        }
    }

    function updateKeyboardPanelVisibility() {
        const keyboardPanel = document.querySelector('.keyboardPanel');
        if (keyboardPanel) {
            keyboardPanel.style.display = keyboardPanelVisible ? 'block' : 'none';
        }
    }

    function updateFooterButtonState(buttonId, isActive) {
        const button = document.getElementById(buttonId);
        if (button) {
            if (isActive) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }

    let cursor = null;
    let cursorTrail = null;
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    function initializeCustomCursor() {
        cursor = document.getElementById('customCursor');
        cursorTrail = document.getElementById('cursorTrail');
        
        if (!cursor || !cursorTrail) {
            return;
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorTrail.style.opacity = '0.7';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorTrail.style.opacity = '0';
        });

        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
            cursorTrail.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
            cursorTrail.classList.remove('click');
        });

        const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, .footerButton, .socialIcon, .musicControls button');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorTrail.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorTrail.classList.remove('hover');
            });
        });

        function animateCursor() {
            const cursorX = mouseX;
            const cursorY = mouseY;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            trailX += (cursorX - trailX) * 0.1;
            trailY += (cursorY - trailY) * 0.1;
            
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
    }

    initializeCustomCursor();

    function initializeFiveMLoading() {
        if (isDevelopment) {
            return;
        }

        window.addEventListener('message', (event) => {
            const eventData = event.data;
            
            if (eventData.eventName === 'loadProgress' && eventData.loadFraction !== undefined) {
                const realProgress = Math.round(eventData.loadFraction * 100);
                const step = Math.floor((eventData.loadFraction) * CONFIG.Loading.steps.length);
                updateLoadingProgress(realProgress, step);
                
            } else if (eventData.eventName === 'initFunctionInvoking' && eventData.idx && eventData.count) {
                const componentProgress = Math.round((eventData.idx / eventData.count) * 100);
                const step = Math.floor((eventData.idx / eventData.count) * CONFIG.Loading.steps.length);
                updateLoadingProgress(componentProgress, step);
                
            } else if (eventData.type) {
                const { type, data } = eventData;
                
                switch (type) {
                    case 'loadingProgress':
                        updateLoadingProgress(data.progress, data.step);
                        break;
                        
                    case 'loadingComplete':
                        updateLoadingProgress(100, CONFIG.Loading.steps.length - 1);
                        break;
                        
                    case 'loadingStep':
                        updateLoadingProgress(null, data.step);
                        break;
                }
            }
        });
    }

    function simulateLoading() {
        let simulatedProgress = 0;
        const simulateInterval = setInterval(() => {
            simulatedProgress += Math.random() * 10 + 5; // Tăng 5-15% mỗi lần
            
            if (simulatedProgress >= 100) {
                simulatedProgress = 100;
                clearInterval(simulateInterval);
            }
            
            const step = Math.floor((simulatedProgress / 100) * CONFIG.Loading.steps.length);
            updateLoadingProgress(simulatedProgress, step);
        }, 800 + Math.random() * 400); // Delay 800-1200ms
    }

    function forceUpdateUI() {
        
        const percentageElement = document.querySelector('.percentage');
        if (percentageElement) {
            percentageElement.textContent = '0%';
        }
        
        const progressCircle = document.querySelector('.progressSvg circle[stroke-dasharray]');
        if (progressCircle) {
            const circumference = 2 * Math.PI * 85;
            const offset = circumference; // 0% = full circle
            progressCircle.style.strokeDashoffset = offset;
        }
        
        const currentStepElement = document.getElementById('currentStep');
        if (currentStepElement && CONFIG.Loading.steps[0]) {
            currentStepElement.textContent = CONFIG.Loading.steps[0];
        }
    }

    setTimeout(() => {
        initializeBackgroundVideo();
        
        setTimeout(() => {
            const video = document.querySelector('.backgroundVideo video');
            if (!video || video.paused) {
                initializeBackgroundVideo();
            }
        }, 3000);
    }, 2000);
}); 
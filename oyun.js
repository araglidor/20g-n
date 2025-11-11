// --- 1. Değişken Tanımlamaları ---
const kukla = document.getElementById('kukla');
let dir = 0; // head 0 (0-360 derece)
const a = 0.55;
const c = 0.5;

// Snap! kodundaki x ve y değişkenlerinin dinamik değerleri
let x_stretch = 50; 
let y_stretch = 100;

// Oranlama için kullanılan baz boyutlar (kuklanın en küçük/başlangıç boyutları)
const BASE_X = 50; 
const BASE_Y = 100;

// Tuş basma durumunu yöneten harita
const keysPressed = {};

// --- 2. Giriş Yönetimi (Fork 1) ---

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

function isKeyPressed(key) {
    return keysPressed[key];
}

function handleInput() {
    // Sol ok tuşu: Saat yönünün tersine döndür (right (* (get c) -1))
    if (isKeyPressed('ArrowLeft')) {
        // dir - 0.5. Negatif olmaması için 360 eklenip mod alınır.
        dir = (dir - c + 360) % 360; 
    }
    // Sağ ok tuşu: Saat yönünde döndür (right (get c))
    if (isKeyPressed('ArrowRight')) {
        dir = (dir + c) % 360; 
    }
}

// Kontrol döngüsünü başlat (saniyede 60 kez dönme kontrolü)
setInterval(handleInput, 1000 / 60);


// --- 3. Transformasyon ve Görsel Güncelleme (Fork 2 ve 3) ---

function updateKukla() {
    // dir'in 0-90 arasındaki sapmasını hesapla: (mod (dir) 90)
    const mod90 = dir % 90;
    const deviation = a * mod90; 

    // Quadrant'a göre x_stretch ve y_stretch değerlerini ayarla
    if (dir > 0 && dir < 90) {
        // Q1
        x_stretch = 50 + deviation;
        y_stretch = 100 - deviation;
    } else if (dir > 90 && dir < 180) {
        // Q2
        x_stretch = 100 - deviation;
        y_stretch = 50 + deviation;
    } else if (dir > 180 && dir < 270) {
        // Q3
        x_stretch = 50 + deviation;
        y_stretch = 100 - deviation;
    } else if (dir > 270 && dir < 360) {
        // Q4
        x_stretch = 100 - deviation;
        y_stretch = 50 + deviation;
    } 
    // Tam Eksenler
    else if (dir === 90 || dir === 270) {
        // Yatay germe (x=100, y=50)
        x_stretch = 100;
        y_stretch = 50;
    } else if (dir === 0 || dir === 180 || dir === 360) {
        // Dikey germe (x=50, y=100)
        x_stretch = 50;
        y_stretch = 100;
    }

    // --- Görsel Uygulama (wear (stretch ada x y)) ---
    
    // Ölçekleme Faktörlerini Hesapla
    const scaleX = x_stretch / BASE_X; 
    const scaleY = y_stretch / BASE_Y; 
    
    // CSS transform özelliğini güncelle (Döndürme + Ölçekleme)
    // NOT: Bu bir 'perspektif' görünümden ziyade 'dönen bir germe' efektidir.
    // Gerçek perspektif için matrix3d gerekir, ancak Snap! kodunun direkt çevirisi budur.
    kukla.style.transform = `
        rotate(${dir}deg) 
        scaleX(${scaleX}) 
        scaleY(${scaleY})
    `;
    
    // Bir sonraki kare için tarayıcıya güncelleme talimatı ver
    requestAnimationFrame(updateKukla); 
}

// Programı başlat (receiveGo)
updateKukla();
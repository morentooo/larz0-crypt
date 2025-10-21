
// --- Смена лейаута ---

const formContainer = document.getElementById('formContainer');
const layoutContainer = document.getElementById('layoutContainer');
const selector = document.getElementById('layoutSelector');

selector.addEventListener('change', () => {
  const value = selector.value;

    loadFragment(`components/forms/form-${value}.html`, formContainer);
    setTimeout(function() {
        loadFragment(`components/layouts/layout-${value}.html`, layoutContainer);
    }, 500); 
});

function loadFragment(url, targetElement) {
  console.log('Loading fragment from:', url);
  
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} for ${url}`);
      }
      return res.text();
    })
    .then(html => {
      targetElement.innerHTML = html;
      console.log('Fragment loaded successfully:', url);
    })
    .catch(err => {
      console.error('Failed to load fragment:', err);
      targetElement.innerHTML = `
        <div style="color:red; padding: 10px; border: 1px solid red;">
          Error loading fragment: ${err.message}<br>
          URL: ${url}
        </div>
      `;
    });
}

// Автозагрузка по умолчанию
window.addEventListener('DOMContentLoaded', () => {
  selector.dispatchEvent(new Event('change'));
});




// --- Смена активного JS кода при смене лейаута ---  

let currentScript = null; 

function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function setUrlParam(name, value) {
  const url = new URL(window.location);
  url.searchParams.set(name, value);

  // Обновляем URL без перезагрузки страницы
  window.history.pushState({}, '', url);

  // Перезагружаем страницу после изменения параметра в URL, чтобы сбросить кеш
  window.location.reload(); 
}

function loadModuleScript(src) {
  // Если скрипт уже был загружен, удаляем его
  if (currentScript) {
    document.head.removeChild(currentScript);
  }

  // Создаем новый тег <script> и добавляем его в head
  currentScript = document.createElement('script');
  currentScript.src = src;
  currentScript.async = false; // Устанавливаем асинхронную загрузку
  document.body.appendChild(currentScript); // Вставляем скрипт в head
}

function switchModuleBasedOnUrl() {
  const layoutParam = getUrlParam('layout'); // Получаем параметр layout из URL
  if (layoutParam) {
    // Если параметр есть, загружаем соответствующий модуль
    loadModuleScript(`scripts/${layoutParam}.js`);
    const select = document.getElementById('layoutSelector');
    select.value = layoutParam; // Обновляем select, чтобы отображался правильный выбор
  } else {
    // Если параметра нет, загружаем модуль по умолчанию (например, analytics)
    loadModuleScript(`/js/analytics.js`);
  }
}

function callModuleFunction(name) {
  if (typeof window[name] === 'function') {
    window[name](); // Вызываем функцию, если она доступна
  } else {
    console.warn(`Функция ${name} не найдена в активном модуле`);
  }
}

document.getElementById('layoutSelector').addEventListener('change', (e) => {
  const layoutValue = e.target.value;

  // Проверяем, если параметр уже установлен в URL, то не перезагружаем страницу
  const currentParam = getUrlParam('layout');
  if (currentParam !== layoutValue) {
    setUrlParam('layout', layoutValue); // Обновляем параметр в URL
  }
});

switchModuleBasedOnUrl();








// ---- СМЕНА ФАЙЛА СТИЛЕЙ ---- 

const selectElement = document.getElementById('layoutSelector');

// Имя id для подключаемого линка
const LINK_ID = 'theme-stylesheet';

// Функция: создаёт или заменяет тег <link> для дополнительных стилей
function switchTheme(theme) {
  // Проверяем, есть ли уже подключенный стиль с данным id
  let link = document.getElementById(LINK_ID);

  if (!link) {
    // Если ссылки нет, создаём новый тег <link>
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = LINK_ID;
    document.head.appendChild(link);
  }

  // Обновляем путь к стилю
  link.href = `styles/${theme}.css`;
}

// Функция: получить параметр type из URL
function getURLTheme() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('layout');
}

// При загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  // Добавляем основной CSS файл (main.css), если он ещё не подключён
  if (!document.getElementById('main-stylesheet')) {
    const mainLink = document.createElement('link');
    mainLink.rel = 'stylesheet';
    mainLink.id = 'main-stylesheet';
    mainLink.href = 'styles/main.css';
    document.head.appendChild(mainLink);
  }

  const urlTheme = getURLTheme();

  // Если в URL есть параметр — применяем
  if (urlTheme) {
    switchTheme(urlTheme);
    selectElement.value = urlTheme;
  }

  // При смене select
  selectElement.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;

    // Меняем стиль
    switchTheme(selectedTheme);

    // Обновляем URL без перезагрузки
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('layout', selectedTheme);
    window.history.pushState({}, '', newUrl);
  });
});








// Постоянное обновление перменных в хранилище при изменении данных в полях ввода 
function updateVariable(input_name) {
    switch(input_name) {
        case 'coin':
            sessionStorage.setItem(input_name, document.myform.coin.value);
            break;
        case "leverage":
            sessionStorage.setItem(input_name, document.myform.leverage.value);
            break;
        case "margin":
            sessionStorage.setItem(input_name, document.myform.margin.value);
            break;
        case "entry_price":
            sessionStorage.setItem(input_name, document.myform.entry_price.value);
    }
}



// Добавление запятой в написание тысяч (для скринов позы)
function addComma (number) {
    return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};



// ---- ГЕНЕРАЦИЯ И СОХРАНЕНИЕ СКРИНШОТОВ ---- 

// Конвертация html блока в png изображение + авто скачивание файла 
function convertHtmlToPng(page, block_name, ss_second_name) {
    html2canvas(document.getElementById(block_name)).then(function(canvas) {
        let file_name = page + "_" + ss_second_name + generateDatetimeForFile() + ".png";
        const link = document.createElement('a');
        link.download = file_name;
        link.href = canvas.toDataURL("image/png");
        link.target = '_blank';
        link.click();
        link.delete;
    });
    sendLog(page);
}


// Генерация даты и времени для названий файлов скринов 
function generateDatetimeForFile() {
    let current_time = new Date();
    let year = String(current_time.getFullYear());
    let month = String(current_time.getMonth());
    let day = String(current_time.getDate());
    let hours = String(current_time.getHours());
    let minutes = String(current_time.getMinutes());
    let seconds = String(current_time.getSeconds());
    let file_name = year+"-"+month+"-"+day+"_"+hours+"-"+minutes+"-"+seconds;
    return file_name;
}



// Отрисовка шапки айфона 
function formingIphoneHeader(time, battery, bg) {
    let icons_url = "";
    switch (battery) {
        case "10":
            icons_url = `url(../images/icons/${bg}/10.png)`;
            break;
        case "50":
            icons_url = `url(../images/icons/${bg}/50.png)`;
            break;
        case "90":
            icons_url = `url(../images/icons/${bg}/90.png)`;
            break;
    }
    document.getElementById('iphone_icons').style.backgroundImage = icons_url; // Акб айфона 
    document.getElementById("iphone_time").textContent = time; // Время айфона 
}


// --- СОХРАНЕНИЕ ЛОГОВ В ГУГЛ ТАБЛИЦУ ---

function sendLog(page) {
  fetch("https://script.google.com/macros/s/AKfycbzxZ1gYb54x_W9IkvT_nwWcLcVlYvIAGSJaiMRkCTCot1wC1Dz0LaslGSh0FnUaeAM/exec", {
    method: "POST",
    mode: "no-cors", // <- ВАЖНО для обхода CORS
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: page,
      userAgent: navigator.userAgent
    })
  })
  .then(res => console.log("Отправлено в Google Sheets"))
  .catch(err => console.error("Ошибка логирования", err));
}
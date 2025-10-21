// ---- ПЕРЕМЕННЫЕ ---- 
let total_usd = 0;
let total_btc = 0;
// Цвета
let text_color_red = "#CD5C61";
let text_color_green = "#42A17F";
// Технические переменные 
let charactersAfterDot = 0; // количество цифр после точки 



// ГЛАВНАЯ ФУНКЦИЯ 
async function saveScreenshot() {
    await formingScreenshot();
    convertHtmlToPng("balance", "screenshot", "");
}



// Формирование скриншота 
async function formingScreenshot () {
    let [time, battery, funding, trading, derivatives] = getInputData();
    
    total_usd = trading + funding + derivatives; 

    getCoinPrice(total_usd); 

    // Конфигурация округления чисел 
    total_usd = total_usd.toFixed(2);
    funding = funding.toFixed(2);
    trading = trading.toFixed(2);
    derivatives = derivatives.toFixed(2);
        
    // Добавление делителя тысяч (запятой)
    total_usd = addComma(total_usd); 
    funding = addComma(funding);
    trading = addComma(trading);
    derivatives = addComma(derivatives);

    formingIphoneHeader(time, battery, "black"); // Отрисовка шапки экрана айфона 
        
    // Отрисовка тела скрина
    document.getElementById("total_usd").textContent = total_usd;
    document.getElementById("funding").textContent = funding;
    document.getElementById("trading").textContent = trading;
    document.getElementById("derivatives").textContent = derivatives;

    // Костыль-задержка для ожидания получения цены BTC
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await delay(2000).then(() => {
        document.getElementById("total_btc").textContent = total_btc;
    });
            
    // Замена фона скрина на рабочий (пустой)
    let image_url = "url(../images/bybit-balance/work.png)"; 
    document.getElementById('screenshot').style.backgroundImage = image_url;
}



// ---- РАБОТА С ПОЛЯМИ ВВОДА ФОРМЫ ---- 

// Получение данных из формы ввода 
function getInputData() {
    time = document.form.time.value;
    battery = document.form.battery.value;
    funding = parseFloat(document.form.funding.value.replace(",", ""));
    trading = parseFloat(document.form.trading.value.replace(",", ""));
    derivatives = parseFloat(document.form.derivatives.value.replace(",", ""));   

    return [time, battery, funding, trading, derivatives];
}



// ---- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---- 

// Конвертация usd в btc по api 
function getCoinPrice(amount) {
    const url = "https://api.coinconvert.net/convert/usd/btc?amount=" + amount;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = () => {
        total_btc = xhr.response.BTC;
    }
}
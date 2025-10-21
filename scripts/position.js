// ---- ПЕРЕМЕННЫЕ ---- 
let time = "";
let battery = "";
let coin = "";
let longshort = ""; 
let leverage = "";
let position_size = "";
let entry_price = "";
let mark_price = "";
let value = "";
let margin = "";
let mm = 0;
let liq_price = "";
let take_profit = "";
let unr_pnl = "";
let unr_pnl_percent = "";
let unr_pnl_rounded = "";
let r_pnl = "";
let r_pnl_rounded = "";
let charactersAfterDot = 0; // Количество цифр после точки 
let text_color_red = "#F15C60"; // Красный цвет текста
let text_color_green = "#42A17F"; // Зеленый цвет текста 



// Главная фунция-инициализатор сохранения скрина
function saveScreenshot() {
    formingScreenshot(); 
    convertHtmlToPng("position", "screenshot", ""); 
}



// Формирование скриншота
function formingScreenshot () {
    getInputData(); 
    
    // Вычисление значений по формулам 
    value = margin * leverage;  
    position_size = value / entry_price;
    unr_pnl = (mark_price - entry_price) * position_size;
    unr_pnl_percent = (unr_pnl / margin) * 100; 
    r_pnl = margin * 0.01;
    let mmr = (Math.random() * (1.25 - 0.75) + 0.75) / 100;
    mm = margin * leverage * mmr;
    console.log(margin, leverage, mmr, mm);

    // Визуальное формирование вывода  
    entry_price = parseFloat(entry_price).toFixed(charactersAfterDot);
    mark_price = addComma(parseFloat(mark_price).toFixed(charactersAfterDot));
    entry_price = addComma(entry_price);
    value = addComma(value.toFixed(4));
    unr_pnl = unr_pnl.toFixed(4);
    position_size = position_size.toFixed(2);
    unr_pnl_percent = unr_pnl_percent.toFixed(2); 
    unr_pnl_rounded = parseFloat(unr_pnl).toFixed(2);
    r_pnl = parseFloat(r_pnl).toFixed(4) + " USDT";
    r_pnl_rounded = parseFloat(r_pnl).toFixed(2);
    margin = addComma(margin) + " USDT";
    mm = addComma(mm.toFixed(4)) + " USDT";
    
    // Отрисовка элементов в зависимости от Long / Short
    if (longshort == "Long") {
        document.getElementById("longshort").textContent = "Long";
        document.getElementById("longshort").style.backgroundColor = "#1A2C27";
        document.getElementById("longshort").style.color = "#20B26C";
        document.getElementById("position_size").style.color = text_color_green;
    } else if (longshort == "Short") {
        document.getElementById("longshort").textContent = "Short";
        document.getElementById("longshort").style.backgroundColor = "#331E22";
        document.getElementById("longshort").style.color = "#EF454A";
        document.getElementById("position_size").style.color = text_color_red;
    }
    
    formingIphoneHeader(time, battery, "gray"); // Отрисовка шапки айфона 

    // Отрисовка тейк профита
    if (take_profit == "") {
         document.getElementById("tp").style.opacity = "0";
         document.getElementById("tp_plug").style.opacity = "100";
    } else if (take_profit != "") {
         document.getElementById("tp").style.opacity = "100";
         document.getElementById("tp_plug").style.opacity = "0";
    }
    document.getElementById("tp_value").style.color = text_color_green;
    
    // Настройка отображения PnL в зависимости от Long / Short и наличия минуса 
    if (longshort == "Long") {
        if (String(unr_pnl)[0] == "-") {
            document.getElementById("unr_pnl").style.color = text_color_red;
            document.getElementById("unr_pnl_rounded").style.color = text_color_red;
        } else if (String(unr_pnl)[0] != "-") {
            document.getElementById("unr_pnl").style.color = text_color_green;
            document.getElementById("unr_pnl_rounded").style.color = text_color_green;
        }
    } else if (longshort == "Short") {
        if (String(unr_pnl)[0] != "-") {
            unr_pnl = "-" + unr_pnl;
            unr_pnl_percent = "-" + unr_pnl_percent;
            unr_pnl_rounded = "-" + unr_pnl_rounded;
            document.getElementById("unr_pnl").style.color = text_color_red;
            document.getElementById("unr_pnl_rounded").style.color = text_color_red;
        } else if (String(unr_pnl)[0] == "-") {
            unr_pnl = unr_pnl.slice(1);
            unr_pnl_percent = unr_pnl_percent.slice(1);
            unr_pnl_rounded = unr_pnl_rounded.slice(1);
            document.getElementById("unr_pnl").style.color = text_color_green;
            document.getElementById("unr_pnl_rounded").style.color = text_color_green;
        }
    }

    // Отрисовка шапки позиции
    document.getElementById("coin").textContent = coin;
    document.getElementById("leverage").textContent = "Cross " + leverage + ".00x";

    // Отрисовка тела позиции
    document.getElementById("position_size").textContent = position_size;
    document.getElementById("entry_price").textContent = entry_price;
    document.getElementById("mark_price").textContent = mark_price;
    document.getElementById("liq_price").textContent = liq_price;
    document.getElementById("value").textContent = value;
    document.getElementById("unr_pnl").textContent = addComma(unr_pnl) + " USDT " + "(" + unr_pnl_percent + "%)";
    document.getElementById("unr_pnl_rounded").textContent = "≈ " + unr_pnl_rounded + " USD";
    document.getElementById("r_pnl").textContent = r_pnl;
    document.getElementById("r_pnl_rounded").textContent = "≈ " + r_pnl_rounded + " USD";
    document.getElementById("margin").textContent = margin;
    document.getElementById("mm").textContent = mm;
    document.getElementById("tp_value").textContent = take_profit;
    
    // Замена фона скрина на рабочий (пустой)
    let image_url = "url(../images/position/work-new.png)"; 
    document.getElementById('screenshot').style.backgroundImage = image_url;
}



// ---- РАБОТА С ПОЛЯМИ ВВОДА ---- 

// Получение данных из формы ввода 
function getInputData() {
    time = document.form.time.value;
    battery = document.form.battery.value;
    coin = document.form.coin.value + "USDT";
    longshort = document.form.longshort.value 
    leverage = parseFloat(document.form.leverage.value);
    margin = parseFloat(document.form.margin.value.replace(",", ""));
    liq_price = document.form.liq_price.value;
    take_profit = document.form.take_profit.value;
    
    entry_price = document.form.entry_price.value;
    if (entry_price.toString().includes(".")) {
        charactersAfterDot = entry_price.toString().split( '.' ).pop().length; // кол-во цифр после точки 
    } else {
        charactersAfterDot = 2;
    }
    entry_price = parseFloat(entry_price.replace(",", ""));
}



// ---- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---- 

// Постоянное получение актуальной цены монеты по API бинанса 
setInterval(getCoinPrice, 2000); // Запуск каждые 2 секунды  
function getCoinPrice() {
    coin = document.form.coin.value;
    console.log("-- попытка запроса к api --", coin);
    if (coin != "") {
        coin = document.form.coin.value + "USDT";
        const url = "https://api.binance.com/api/v3/ticker/price?symbol=" + coin;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = () => {
            mark_price = parseFloat(xhr.response.price);
        }
    }
}
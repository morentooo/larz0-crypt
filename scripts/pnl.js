// ---- ПЕРЕМЕННЫЕ ---- 
let coin = "";
let template_type = "";
let option = "";
let leverage = 0;
let entry_price = 0;
let exit_price = 0;
let margin = 0;
let value = 0;
let roi = 0;
let pnl = 0;
let result = 0;
// ЦВЕТА 
let color_green_bg = "rgba(32, 178, 108, 0.08)";
let color_green_text = "#20B26C";
let color_red_bg = "rgba(239, 69, 74, 0.08)";
let color_red_text = "#EF454A";



// ГЛАВНАЯ ФУНКЦИЯ 
function saveScreenshot() {
    formingScreenshot();
    convertHtmlToPng("pnlroi", "screenshot", "");
}



// Формирование скриншота
function formingScreenshot () {
    getInputData(); 
    
    // Вычисление значений 
    value = margin * leverage;  
    position_size = value / entry_price;
    pnl = (exit_price - entry_price) * position_size; 
    roi = (pnl / margin) * 100 
    
    // Округление
    if (template_type == "roi") {
        result = roi.toFixed(2);
    } else if (template_type == "pnl") {
        result = pnl.toFixed(2);
    }
    
    leverage = option + " " + leverage + ".0X";

    // Настройка отображения PnL в зависимости от Long / Short и наличия минуса 
    if (option == "Short") {
        if (String(result)[0] == "-") {
            result = result.slice(1);
        }
    }
    
    // Подстановка фона + цвета цифр 
    var image_url = "";
    if (template_type == "roi" && !result.startsWith("-")) {
        image_url = "url(../images/pnl/work/roi-up.png)";
        result = result + "%";
        document.getElementById("roipnl").style.color = color_green_text;
    } else if (template_type == "roi" && result.startsWith("-")) {
        image_url = "url(../images/pnl/work/roi-down.png)";
        result = result + "%";
        document.getElementById("roipnl").style.color = color_red_text;
    } else if (template_type == "pnl" && !result.startsWith("-")) {
        image_url = "url(../images/pnl/work/pnl-up.png)"; 
        document.getElementById("roipnl").style.color = color_green_text;
    } else if (template_type == "pnl" && result.startsWith("-")) {
        image_url = "url(../images/pnl/work/pnl-down.png)"; 
        document.getElementById("roipnl").style.color = color_red_text;
    }
    document.getElementById('screenshot').style.backgroundImage = image_url;

    
    // Отрисовка ярлыка продажа / покупка
    if (option == "Long") {
        document.getElementById("leverage").style.backgroundColor = color_green_bg;
        document.getElementById("leverage").style.color = color_green_text;
    } else if (option == "Short") {
        document.getElementById("leverage").style.backgroundColor = color_red_bg;
        document.getElementById("leverage").style.color = color_red_text;
    }

    // Отрисовка шапки
    document.getElementById("coin").textContent = coin;
    document.getElementById("leverage").textContent = leverage;

    // Отрисовка тела 
    document.getElementById("roipnl").textContent = result;
    document.getElementById("entry_price").textContent = entry_price;
    document.getElementById("exit_price").textContent = exit_price;
}



// ---- РАБОТА С ПОЛЯМИ ВВОДА ---- 

// Получение вводных данных из полей формы 
function getInputData() {
    template_type = document.form.template_type.value;
    coin = document.form.coin.value + "USDT"
    option = document.form.option.value;
    leverage = parseFloat(document.form.leverage.value);
    entry_price = parseFloat(document.form.entry_price.value.replace(",", ""));
    exit_price = parseFloat(document.form.exit_price.value.replace(",", ""));
    margin = parseFloat(document.form.margin.value.replace(",", ""));
}
// ГЛАВНАЯ ФУНКЦИЯ 
async function saveScreenshot() {
    await formingScreenshot();
    convertHtmlToPng("coin", "screenshot", "");
}


// Формирование скриншота 
async function formingScreenshot () {
    let [time, battery, bnb_price, coin_name, coin_price, profit, coin_amount] = getInputData();
    
    formingIphoneHeader(time, battery, "black"); // Отрисовка шапки экрана айфона 

    let coin_icon_text = coin_name[0] || ''; // первая буква названия коина идет в логотип

    let quantity = Math.round(coin_amount / coin_price);

    let total_balance = 0.41 + coin_amount;
        
    // Отрисовка тела скрина
    document.getElementById("total_balance").textContent = `$${addComma(total_balance.toFixed(2))}`;
    document.getElementById("bnb_price").textContent = `$${bnb_price}`;
    document.getElementById("coin_icon").textContent = coin_icon_text;
    document.getElementById("coin_name").textContent = coin_name;
    document.getElementById("coin_price").textContent = `$${coin_price}`;
    document.getElementById("coin_profit").textContent = `+${profit}%`;
    document.getElementById("coin_quantity").textContent = addComma(quantity);
    document.getElementById("coin_amount").textContent = `≈ ${addComma(coin_amount.toFixed(2))} USD`;

    // Замена фона скрина на рабочий (пустой)
    let image_url = "url(../images/coin/work.png)"; 
    document.getElementById('screenshot').style.backgroundImage = image_url;
}



// ---- РАБОТА С ПОЛЯМИ ВВОДА ФОРМЫ ---- 

// Получение данных из формы ввода 
function getInputData() {
    time = document.form.time.value;
    battery = document.form.battery.value;
    bnb_price = document.form.bnb_price.value;
    coin_name = document.form.coin_name.value;
    coin_price = parseFloat(document.form.coin_price.value);
    profit = document.form.profit.value;
    coin_amount = parseFloat(document.form.amount.value.replace(",", ""));
  
    return [time, battery, bnb_price, coin_name, coin_price, profit, coin_amount];
}
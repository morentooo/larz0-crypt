// ---- ПЕРЕМЕННЫЕ ----  
let current_bot_section = "dashboard"; // текущая выбранная секция бота


function saveScreenshot() {
    formingScreenshots(); 
    convertHtmlToPng("bot", "screenshot", "");
}



// ---- ФОРМИРОВАНИЕ СКРИНОВ ----

// Общая распределительная функция
async function formingScreenshots () {
    switch(current_bot_section) {
        case "dashboard":
            formingDashboardScreenshot();
            break;
        case "settings":
            formingSettingsScreenshot();
            break;
        default:
            formingDashboardScreenshot();
            break;
    }
}


// Формирование скрина дешборда (списка трейдов)
function formingDashboardScreenshot() {
    let [account, selected_id, is_boosted, balance, prev_total_profit, dates, trades, percentages, profits] = getInputData("dashboard"); 

    // Генерация строки периода с первой и последней датами недели
    let period = `${dates[0]} - ${dates[6]}`; 

    // Суммарный недельный профит
    let total_profit = profits.reduce(function(a, b) {
        return Number(a) + Number(b);
    }, 0);

    // Вычисление параметра "Available"
    let available = 0;
    if (prev_total_profit == "") {
        available = (Number(balance) + Number(total_profit)).toFixed(2);
    } else {
        available = (Number(prev_total_profit) + Number(balance) + Number(total_profit)).toFixed(2);
        total_profit = total_profit + Number(prev_total_profit);
    }

    // Отрисовка тела скрина (все, кроме таблицы)
    document.getElementById("selected_id_dashboard").textContent = selected_id;
    document.getElementById("period").textContent = period;
    document.getElementById("balance").textContent =`${balance}$`;
    document.getElementById("available").textContent = `${available}$`;
    document.getElementById("withdraw_date").textContent = `${dates[5]}.2025`;
    document.getElementById("total_profit").textContent = `${total_profit.toFixed(2)}$`;

    // Отрисовка таблицы со списком трейдов
    const table = document.getElementById('ss_table');
    for (let i = 0; i < 7; i++) {
        const row = table.rows[i]; 
        row.cells[0].innerText = `${dates[i]} -`;
        row.cells[1].innerText = `${trades[i]} TR`;
        row.cells[3].innerText = `+${percentages[i]}%`;
        row.cells[4].innerText = `+${profits[i]}$`;
    }

    // Замена фона скрина на "пустой"
    let image_url = "";
    if (is_boosted == "yes") {
        image_url = `url(../images/bot/dashboard/boosted-${account}.png)`; 
    } else {
        image_url = `url(../images/bot/dashboard/${account}.png)`; 
    }
    document.getElementById('screenshot').style.backgroundImage = image_url;
}


// Формирование скрина настроек с адресами
function formingSettingsScreenshot() {
    let [account, selected_id, deposit_address, withdrawal_address] = getInputData("settings"); 

    // Отрисовка тела скрина 
    document.getElementById("selected_id_settings").textContent = `ID: ${selected_id}`;
    document.getElementById("deposit_address").textContent = deposit_address;
    document.getElementById("withdrawal_address").textContent = withdrawal_address;

    // Замена фона скрина на "Пустой"
    image_url = `url(../images/bot/settings/${account}.png)`; 
    document.getElementById('screenshot').style.backgroundImage = image_url;
}



// ---- РАБОТА С ПОЛЯМИ ВВОДА ФОРМЫ ----

// Очистить поля ввода определенной строки таблицы в форме 
function clearTableInputs(row) {
    document.getElementById(`trades_${row}`).value = "";
    document.getElementById(`percentages_${row}`).value = "";
    document.getElementById(`profit_${row}`).value = "";
}


// Получение данных из полей формы ввода 
function getInputData(section) {
    let account = document.form.account.value;
    console.log(account);
    switch(section) {
        case "dashboard":
            let selected_id_dashboard = document.form.selected_id_dashboard.value;
            let is_boosted = document.form.is_boosted.value;
            let balance = document.form.balance.value;
            let prev_total_profit = document.form.prev_total_profit.value;
            let trades = [];
            let percentages = [];
            let profits = [];

            for (let i = 1; i <= 7; i++) {
                trades[i-1] = document.getElementById(`trades_${i}`).value || 0;
                percentages[i-1] = document.getElementById(`percentages_${i}`).value || 0;
                profits[i-1] = document.getElementById(`profit_${i}`).value || 0;
            }

            let dates = generateWeekArray();

            return [account, selected_id_dashboard, is_boosted, balance, prev_total_profit, dates, trades, percentages, profits];

        case "settings":
            let selected_id_settings = document.form.selected_id_settings.value;
            let deposit_address = document.form.deposit_address.value;
            let withdrawal_address = document.form.withdrawal_address.value;

            return [account, selected_id_settings, deposit_address, withdrawal_address];
    }
}



// ---- УПРАВЛЕНИЕ ВКЛАДКАМИ (СЕКЦИЯМИ) ФОРМЫ БОТА ----

// Смена выбранной секции бота 
function changeBotSection() {
    current_bot_section = document.form.bot_section.value;

    document.getElementById('form_bot_dashboard').classList.remove('current');
    document.getElementById('form_bot_settings').classList.remove('current');
    document.getElementById('bot_screen_dashboard').classList.remove('current');
    document.getElementById('bot_screen_settings').classList.remove('current');

    switch(current_bot_section) {
        case "dashboard":
            document.getElementById("form_bot_dashboard").classList.add('current');
            document.getElementById("bot_screen_dashboard").classList.add('current');
            document.getElementById('screenshot').style.backgroundImage = "url(../images/bot/dashboard-test.png)";
            break;
        case "settings":
            document.getElementById("form_bot_settings").classList.add('current');
            document.getElementById("bot_screen_settings").classList.add('current');
            document.getElementById('screenshot').style.backgroundImage = "url(../images/bot/settings-test.png)";
            break;
    }
}



// ----- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----

// Заполнение списка дат в формы ввода при рендере страницы
function fillingFormDates() {
    let dates = generateWeekArray(); // Получаем список дат текущей недели
    // Заполняем span
    for (let i = 1; i <= 7; i++) {
        document.getElementById(`date_${i}`).innerText = dates[i-1];
    }
}
window.onload = function() {
    setTimeout(function() {
        fillingFormDates();
    }, 250)
}


// Генерация значения ID в инпуте в форме 
function generateId() {
    let randomNumber = Math.floor(Math.random() * 200000); // Генерация числа от 0 до 199999
    randomNumber = randomNumber.toString().padStart(6, '0'); // Форматирование числа, чтобы оно было длиной 6 символов

    document.querySelectorAll('#selected_id_input').forEach(input => {
        input.value = randomNumber; // Устанавливаем значение
    });
}


// Генерация значений в инпутах формы ввода
function generateValues(row) {
    let rate = document.getElementById(`rate_${row}`).value 
    let trades_cnt = Math.floor(Math.random() * (19 - 13 + 1)) + 13; // количество трейдов
    trades_cnt = Math.round(trades_cnt * rate);

    // Рандомная генерация процента прибыли одного трейда 
    let total_day_percent = 0;
    for (let trade = 1; trade <= trades_cnt; trade++) {
        let one_trade_percent = Math.random() * (0.95 - 0.67) + 0.67; 
        total_day_percent += one_trade_percent;
    }

    // Вычисление прибыли в usd для каждого дня
    console.log(total_day_percent);
    let balance = document.form.balance.value;
    let profit = balance / 100 * total_day_percent;

    // Заполнение полей ввода полученными значениями
    document.getElementById(`trades_${row}`).value = trades_cnt;
    document.getElementById(`percentages_${row}`).value = total_day_percent.toFixed(2);
    document.getElementById(`profit_${row}`).value = profit.toFixed(2);
}


// Генерация списка дней текущей календарной недели
function generateWeekArray() {
    // Получение текущей даты
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    let currentDate = `${year}-${month}-${day}`;

    // Преобразуем входную дату в объект Date
    const date = new Date(currentDate);
    
    // Получаем день недели (0 - воскресенье, 1 - понедельник и т.д.)
    const dayOfWeek = date.getDay();
    
    // Определяем дату начала недели (понедельник)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const weekArray = [];
    
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        
        // Форматируем дату в строку "DD-MM"
        const day = String(currentDay.getDate()).padStart(2, '0');
        const month = String(currentDay.getMonth() + 1).padStart(2, '0');
        weekArray.push(`${day}.${month}`);
    }
    return weekArray;
}
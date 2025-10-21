// ---- ПЕРЕМЕННЫЕ ----  
let current_withdrawal_section = "form"; // текущая выбранная секция вывода


function saveScreenshot() {
    formingScreenshot();
    convertHtmlToPng("withdraw", "screenshot", "");
}


// ---- ФОРМИРОВАНИЕ СКРИНОВ ---- 

// Распределительная функция
async function formingScreenshot () {
    let [
        iph_time, 
        battery, 
        address, 
        amount, 
        minimum, 
        available,
        fee,
        txid,
        w_date,
        w_time
    ] = getInputData(); 

    formingIphoneHeader(iph_time, battery, "dark-blue");

    switch(current_withdrawal_section) {
        case "form":
            formingFormScreenshot(address, amount, minimum, available, fee);
            break;
        case "transaction":
            formingTransactionScreenshot(address, amount, txid, fee, w_date, w_time);
            break;
    }
}


// Формирование скрина формы вывода 
function formingFormScreenshot(address, amount, minimum, available, network_fee) {
    // Вычисление параметров
    let receive_amount = Number(amount) - Number(network_fee);
    minimum = `Withdrawal must be at least ${minimum} USDT.`
    let amount_in_usd = usdtToUsd(amount);
    available = `${formatNumber(available)} USDT`;

    // Отрисовка тела скрина
    document.getElementById("address").textContent = address;
    document.getElementById("withdrawal_amount").textContent = amount.replace('.', ',');
    document.getElementById("withdrawal_amount_usd").textContent = `${amount_in_usd} USD`;
    document.getElementById("available").textContent = available;
    document.getElementById("minimum").textContent = minimum;
    document.getElementById("receive_amount").textContent = formatNumber(receive_amount);
    document.getElementById("network_fee").textContent = `${network_fee},00 USDT`;

    // замена фона скрина на рабочий (пустой)
    let image_url = "url(../images/binance/withdrawal/form/work.png)"; 
    document.getElementById('screenshot').style.backgroundImage = image_url;
}


// Формирование скрина деталей транзакции
function formingTransactionScreenshot(address, amount, txid, fee, date, time) {
    let datetime = `${date} ${time}`;
    let full_amount = `${parseFloat(amount) + parseFloat(fee)} USDT`.replace('.', ',');

    document.getElementById("transaction_amount").textContent = `-${amount} USDT`.replace('.', ',');
    document.getElementById("transaction_address").textContent = address;
    document.getElementById("txid").textContent = txid;
    document.getElementById("transaction_full_amount").textContent = full_amount;
    document.getElementById("transaction_fee").textContent = `${fee} USDT`;
    document.getElementById("transaction_datetime").textContent = datetime;

    // замена фона скрина на рабочий (пустой)
    let image_url = "url(../images/binance/withdrawal/transaction/work.png)"; 
    document.getElementById('screenshot').style.backgroundImage = image_url;
}



// ---- РАБОТА С ПОЛЯМИ ВВОДА ФОРМЫ ----

// Получение данных из формы ввода 
function getInputData() {
    iph_time = document.form.time.value;
    battery = document.form.battery.value;
    address = document.form.address.value;
    amount = document.form.amount.value;
    minimum = document.form.minimum.value;
    available = document.form.available.value;
    fee = document.form.network_fee.value;
    txid = document.form.txid.value;
    w_date = document.form.withdraw_date.value;
    w_time = document.form.withdraw_time.value;

    return [
        iph_time, 
        battery, 
        address,
        amount, 
        minimum, 
        available, 
        fee,
        txid,
        w_date,
        w_time
    ];
}



// ---- УПРАВЛЕНИЕ СЕКЦИЯМИ (ВКЛАДКАМИ) СТРАНИЦЫ ---- 

// Восстановление последней открытой вкладки после рефреша страницы 
window.onload = function() {
    recoverSection(); 
}
function recoverSection() {
    current_withdrawal_section = sessionStorage.getItem("current_withdrawal_section");

    if (current_withdrawal_section) {
        document.getElementById('form_withdrawal_form').classList.remove('current');
        document.getElementById('form_withdrawal_transaction').classList.remove('current');
        document.getElementById('layout_withdraw_form').classList.remove('current');
        document.getElementById('layout_transaction_details').classList.remove('current');

        let url;
        switch(current_withdrawal_section) {
            case "form":
                document.getElementById("form_withdrawal_form").classList.add('current');
                document.getElementById("layout_withdraw_form").classList.add('current');
                url = "url(../images/binance/withdrawal/form/test.png)"
                document.getElementById('screenshot').style.backgroundImage = url;
                document.querySelector('select[name="withdrawal_section"]').value = "form";
                break;
            case "transaction":
                document.getElementById("form_withdrawal_transaction").classList.add('current');
                document.getElementById("layout_transaction_details").classList.add('current');
                url = "url(../images/binance/withdrawal/transaction/test.png)"
                document.getElementById('screenshot').style.backgroundImage = url;
                document.querySelector('select[name="withdrawal_section"]').value = "transaction";
                break;
        }
    }
}


// Смена выбранной секции вывода бинанс 
function changeWithdrawalSection() {
    current_withdrawal_section = document.form.withdrawal_section.value;
    sessionStorage.setItem("current_withdrawal_section", current_withdrawal_section);

    document.getElementById('form_withdrawal_form').classList.remove('current');
    document.getElementById('form_withdrawal_transaction').classList.remove('current');
    document.getElementById('layout_withdraw_form').classList.remove('current');
    document.getElementById('layout_transaction_details').classList.remove('current');

    let bg_url = "";
    switch(current_withdrawal_section) {
        case "form":
            document.getElementById("form_withdrawal_form").classList.add('current');
            document.getElementById("layout_withdraw_form").classList.add('current');
            bg_url = "url(../images/binance/withdrawal/form/test.png)"
            document.getElementById('screenshot').style.backgroundImage = bg_url;
            break;
        case "transaction":
            document.getElementById("form_withdrawal_transaction").classList.add('current');
            document.getElementById("layout_transaction_details").classList.add('current');
            bg_url = "url(../images/binance/withdrawal/transaction/test.png)"
            document.getElementById('screenshot').style.backgroundImage = bg_url;
            break;
    }
}


// ---- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----

// Округление чисел и добавление пробела в написании тысяч
function formatNumber(num) {
    // Преобразуем число в строку
    let numStr = Number(num).toFixed(2).toString();
    
    // Разделяем целую часть и дробную часть числа
    let [integerPart, decimalPart] = numStr.split('.');

    // Если дробной части нет, добавляем "00"
    if (!decimalPart) {
        decimalPart = '00';
    }

    // Добавляем пробел для более чем 4 цифр перед запятой
    if (integerPart.length > 3) {
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // Собираем и возвращаем итоговое значение
    return `${integerPart},${decimalPart}`;
}


// Перевод usdt в usd по определенным правилам вычитания и огругления
function usdtToUsd(num) {
    // Преобразуем число в строку и заменяем точку на запятую, если таковая есть
    let numStr = num.toString().replace('.', ',');

    // Функция для форматирования числа с пробелом перед последними тремя цифрами
    function formatWithSpace(numberStr) {
        let parts = numberStr.split(",");
        let integerPart = parts[0];
        if (integerPart.length >= 4) {
            let lastThreeDigits = integerPart.slice(-3);
            let rest = integerPart.slice(0, -3);
            integerPart = `${rest} ${lastThreeDigits}`;
        }
        return `${integerPart}${parts.length > 1 ? ',' + parts[1] : ''}`;
    }

    // Проверяем, есть ли запятая
    if (numStr.includes(",")) {
        let [beforeComma, afterComma] = numStr.split(",");

        // Если перед запятой одна цифра и она равна нулю
        if (beforeComma.length === 1 && beforeComma === "0") {
            if (afterComma.length > 0) {
                // Если после запятой есть цифры
                let afterCommaStr = afterComma.replace(/^0+/, ''); // Удаление ведущих нулей
                if (afterCommaStr.length > 0) {
                    let lastPart = afterCommaStr.slice(-1); // Последняя цифра
                    let restPart = afterCommaStr.slice(0, -1); // Остальная часть
                    let newLastPart = (parseInt(lastPart) - 1).toString(); // Уменьшение последней цифры на 1
                    
                    // Формируем строку с новой последней цифрой
                    let newAfterComma = restPart + newLastPart;
                    // Добавляем ведущие нули обратно
                    newAfterComma = newAfterComma.padStart(afterComma.length, '0');
                    return formatWithSpace(`${beforeComma},${newAfterComma}`);
                }
            }
        } else {
            // Если перед запятой одна или несколько цифр
            let twoDigits = afterComma.slice(0, 2); // Берем две первые цифры после запятой
            return formatWithSpace(`${beforeComma},${twoDigits}`);
        }
    } else {
        // Если после запятой нет цифр
        let result = (num - 0.01).toFixed(2).replace('.', ',');
        return formatWithSpace(result);
    }
}



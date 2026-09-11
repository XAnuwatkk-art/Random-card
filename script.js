// ========================================
// MONOPOLY CARD DRAW (Complete Script)
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyDZbVA5OPmLg7UpmrndqNJ7V7WIS7nmGyA",
    authDomain: "monopoly-bank-67c20.firebaseapp.com",
    databaseURL: "https://monopoly-bank-67c20-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "monopoly-bank-67c20",
    storageBucket: "monopoly-bank-67c20.appspot.com",
    messagingSenderId: "73719951987",
    appId: "1:73719951987:web:348b715297478cb244b006",
    measurementId: "G-YPDREM2M9H"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const DEFAULT_PLAYERS = {
    P01: "PLAYER 01",
    P02: "PLAYER 02",
    P03: "PLAYER 03",
    P04: "PLAYER 04"
};

let currentPlayer = "";
let currentPlayersData = { ...DEFAULT_PLAYERS };

// โหลดชื่อผู้เล่นทันทีที่เปิดหน้าเว็บ
window.addEventListener("DOMContentLoaded", () => {
    const bankRef = db.ref("bankData");
    bankRef.on("value", (snapshot) => {
        const bankData = snapshot.val();
        if (bankData) {
            ['P01', 'P02', 'P03', 'P04'].forEach(pKey => {
                if (bankData[pKey]) {
                    const customName = bankData[pKey].nickname || DEFAULT_PLAYERS[pKey];
                    currentPlayersData[pKey] = customName;
                    
                    const btn = document.querySelector(`button[onclick*="${pKey}"]`);
                    if (btn) {
                        btn.innerText = customName;
                    }
                }
            });
        }
    });
});

function selectPlayer(playerKey) {
    currentPlayer = playerKey;
    document.getElementById("playerScreen").style.display = "none";
    document.getElementById("selectScreen").style.display = "block";
    
    const displayName = currentPlayersData[playerKey] || DEFAULT_PLAYERS[playerKey];
    document.getElementById("selectedPlayerTitle").innerText = `🎲 ผู้เล่นที่จั่ว: ${displayName}`;
}

function backToPlayerSelect() {
    document.getElementById("selectScreen").style.display = "none";
    document.getElementById("playerScreen").style.display = "block";
}

// 💰 1. กองหีบสมบัติเจ้าสัว (รวมการ์ดปกติ + การ์ดพิเศษชุดที่ 1)
const chestCards = [
    { text: "💰 ถูกหวยรางวัลที่ 1! รับเงินโชคก้อนโต ฿20,000", amount: 20000, type: "add" },
    { text: "🏢 ขายตึกโรงแรมกลางเมืองได้กำไรมหาศาล รับเงิน ฿15,000", amount: 15000, type: "add" },
    { text: "🚀 หุ้นบริษัทพุ่งกระฉูด รับเงินปันผลพิเศษ ฿12,000", amount: 12000, type: "add" },
    { text: "💎 ขุดพบเพชรพลอยในที่ดินส่วนตัว ขายได้เงิน ฿18,000", amount: 18000, type: "add" },
    { text: "👑 รับมรดกตกทอดจากเศรษฐีร้อยล้าน รับเงิน ฿25,000", amount: 25000, type: "add" },
    { text: "🏆 ชนะการประมูลโปรเจกต์ใหญ่แห่งปี รับเงิน ฿14,000", amount: 14000, type: "add" },
    { text: "🚢 เปิดเส้นทางเดินเรือสำราญกำไรพุ่ง รับเงิน ฿10,000", amount: 10000, type: "add" },
    { text: "⭐ ได้รับเงินสนับสนุนจากนักลงทุนต่างชาติ รับเงิน ฿16,000", amount: 16000, type: "add" },
    { text: "🏦 ธนาคารกลางคืนเงินปันผลสะสม รับเงิน ฿8,000", amount: 8000, type: "add" },
    { text: "🎉 ชนะการแข่งขันเศรษฐีโลก รับเงินรางวัล ฿15,000", amount: 15000, type: "add" },
    { text: "🌾 ขายที่ดินทำโครงการหมู่บ้านจัดสรร รับเงิน ฿22,000", amount: 22000, type: "add" },
    { text: "⚡ ขายลิขสิทธิ์เทคโนโลยีพลังงานสะอาด รับเงิน ฿11,000", amount: 11000, type: "add" },
    { text: "🎁 ได้รับเงินขวัญถุงจากกลุ่มทุนใหญ่ รับเงิน ฿9,000", amount: 9000, type: "add" },
    { text: "📈 เก็งกำไรค่าเงินสำเร็จ รับเงินก้อนโต ฿13,000", amount: 13000, type: "add" },
    { text: "🌟 กองทุนสำรองเลี้ยงชีพให้ผลตอบแทนสูง รับเงิน ฿7,000", amount: 7000, type: "add" },
    { text: "🎨 ประมูลขายภาพวาดศิลปะโบราณได้ราคาสูง รับเงิน ฿10,000", amount: 10000, type: "add" },
    { text: "🏆 ได้รับรางวัลผู้บริหารยอดเยี่ยมประจำปี รับเงิน ฿12,000", amount: 12000, type: "add" },
    { text: "💼 ขายกิจการสตาร์ทอัพให้บริษัทใหญ่ รับเงิน ฿20,000", amount: 20000, type: "add" },
    { text: "🚁 ขายเฮลิคอปเตอร์ส่วนตัว รับเงินสด ฿14,000", amount: 14000, type: "add" },
    { text: "🏅 รับโบนัสพิเศษจากผลประกอบการทะลุเป้า รับเงิน ฿8,000", amount: 8000, type: "add" },
    { text: "🎯 ปิดดีลธุรกิจหมื่นล้าน รับเงินค่านายหน้า ฿18,000", amount: 18000, type: "add" },
    { text: "💸 โดนสรรพากรตรวจสอบภาษีย้อนหลัง จ่าย ฿5,000", amount: 5000, type: "subtract" },
    { text: "🔥 โรงงานผลิตสินค้าไฟไหม้เสียหาย จ่ายค่าซ่อม ฿8,000", amount: 8000, type: "subtract" },
    { text: "⚖️ แพ้คดีฟ้องร้องลิขสิทธิ์ธุรกิจ จ่ายค่าเสียหาย ฿10,000", amount: 10000, type: "subtract" },
    { text: "📉 ลงทุนหุ้นผิดพลาด เสียเงิน ฿4,000", amount: 4000, type: "subtract" },
    { text: "🏗️ โครงการก่อสร้างงบบานปลาย จ่ายเพิ่ม ฿6,000", amount: 6000, type: "subtract" },
    { text: "🛥️ เรือยอชท์ส่วนตัวชนแนวปะการัง จ่ายค่ากู้ซาก ฿7,000", amount: 7000, type: "subtract" },
    { text: "🌪️ พายุถล่มคลังสินค้าเสียหาย จ่าย ฿9,000", amount: 9000, type: "subtract" },
    { text: "🚨 โดนปรับข้อหาผิดสัญญา จ่าย ฿3,000", amount: 3000, type: "subtract" },
    { text: "💼 โดนปรับค่าเสียหายชดเชย จ่าย ฿5,500", amount: 5500, type: "subtract" },
    { text: "💊 ค่ารักษาพยาบาลฉุกเฉิน จ่าย ฿2,500", amount: 2500, type: "subtract" },
    { text: "🔒 โดนแฮกเกอร์เรียกค่าไถ่ข้อมูล จ่าย ฿8,500", amount: 8500, type: "subtract" },
    { text: "⚖️ ถูกปรับข้อหาละเมิดสิ่งแวดล้อม จ่าย ฿4,500", amount: 4500, type: "subtract" },
    { text: "📉 จ่ายเงินพยุงกิจการช่วงวิกฤต ฿6,500", amount: 6500, type: "subtract" },
    { text: "💥 จ่ายค่าปรับคดีความทางธุรกิจ ฿10,000", amount: 10000, type: "subtract" },
    
    // 🎴 การ์ดพิเศษกระจายในกองหีบสมบัติ
    { text: "🤝 เซ็นสัญญาควบรวมกิจการ! สลับยอดเงินสดทั้งหมดของคุณกับผู้เล่นที่คุณเลือกทันที", type: "duel_swap" },
    { text: "🦹‍♂️ สวมรอยเป็นโจรปล้นแบงก์! เลือกเพื่อน 1 คน เพื่อจวกเงินสด 15% จากกระเป๋ามาเข้ากระเป๋าคุณ", type: "duel_rob" },
    { text: "📜 โฉนดมรณะ! เลือกรับที่ดิน (ไม่บวกเงิน) หรือเลือกรับเงินสด ฿5,000", amount: 5000, type: "duel_seizure" }
];

// ⚡ 2. กองตั๋วเสี่ยงโชค (รวมการ์ดปกติ + การ์ดพิเศษชุดที่ 2)
const chanceCards = [
    { text: "จ่ายค่าปรับขับรถเร็วเกินกำหนด ฿500", amount: 500, type: "subtract" },
    { text: "จ่ายค่าซ่อมแซมบ้านหลังละ ฿800", amount: 800, type: "subtract" },
    { text: "จ่ายค่ารักษาพยาบาลฉุกเฉิน ฿1,000", amount: 1000, type: "subtract" },
    { text: "โดนปรับข้อหาจอดรถผิดกฎหมาย ฿300", amount: 300, type: "subtract" },
    { text: "จ่ายภาษีโรงเรือนและที่ดินประจำปี ฿1,200", amount: 1200, type: "subtract" },
    { text: "จ่ายค่าบำรุงถนนส่วนกลาง ฿600", amount: 600, type: "subtract" },
    { text: "ทำโทรศัพท์มือถือราคาแพงตกแตก จ่ายค่าซ่อม ฿2,000", amount: 2000, type: "subtract" },
    { text: "จ่ายค่าประกันสุขภาพรายปี ฿1,500", amount: 1500, type: "subtract" },
    { text: "ขับรถชนท้ายคันอื่น จ่ายค่าเสียหาย ฿2,500", amount: 2500, type: "subtract" },
    { text: "จ่ายค่าปรับทิ้งขยะในที่สาธารณะ ฿400", amount: 400, type: "subtract" },
    { text: "บ้านโดนพายุพัดหลังคาเสียหาย จ่ายค่าซ่อม ฿3,000", amount: 3000, type: "subtract" },
    { text: "สัตว์เลี้ยงป่วยหนัก จ่ายค่ารักษาพยาบาลสัตว์ ฿1,800", amount: 1800, type: "subtract" },
    { text: "ลืมจ่ายค่าไฟค้างนาน โดนค่าปรับทบต้น ฿700", amount: 700, type: "subtract" },
    { text: "ซื้อสินค้าออนไลน์แล้วโดนหลอก เสียเงิน ฿1,200", amount: 1200, type: "subtract" },
    { text: "จ่ายค่าสมาชิกฟิตเนสรายปีที่ไม่ได้ใช้ ฿2,200", amount: 2200, type: "subtract" },
    { text: "โดนใบสั่งข้อหาฝ่าไฟแดง ฿1,000", amount: 1000, type: "subtract" },
    { text: "จ่ายค่าปรับภาษีนำเข้าสินค้าต่างประเทศ ฿1,400", amount: 1400, type: "subtract" },
    { text: "ทำกระเป๋าเงินหายระหว่างเดินทาง เสียเงิน ฿1,500", amount: 1500, type: "subtract" },
    { text: "จ่ายค่าทนายความสู้คดีหมิ่นประมาท ฿3,500", amount: 3500, type: "subtract" },
    { text: "ทำคอมพิวเตอร์พังกลางคัน จ่ายค่าซื้อเครื่องใหม่ ฿4,000", amount: 4000, type: "subtract" },
    { text: "จ่ายค่าปรับสร้างตึกเกินโฉนด ฿2,800", amount: 2800, type: "subtract" },
    { text: "โดนขโมยจักรยานยนต์หน้าบ้าน เสียหาย ฿3,000", amount: 3000, type: "subtract" },
    { text: "จ่ายค่าปรับทิ้งคราบน้ำมันลงแม่น้ำ ฿1,600", amount: 1600, type: "subtract" },
    { text: "จ้างคนมาทำความสะอาดบ้านครั้งใหญ่ จ่าย ฿900", amount: 900, type: "subtract" },
    { text: "จ่ายค่าบำรุงสนามกอล์ฟส่วนตัว ฿1,100", amount: 1100, type: "subtract" },
    { text: "ทำนาฬิกาหรูตกน้ำ เสียค่าซ่อม ฿2,500", amount: 2500, type: "subtract" },
    { text: "จ่ายค่าปรับผิดสัญญาทางธุรกิจ ฿3,200", amount: 3200, type: "subtract" },
    { text: "แพ้คดีฟ้องร้อง จ่ายค่าเสียหาย ฿4,500", amount: 4500, type: "subtract" },
    { text: "จ่ายค่าบำรุงรักษาสะพานข้ามแม่น้ำ ฿800", amount: 800, type: "subtract" },
    { text: "ซื้อตั๋วเครื่องบินไฟต์บินยกเลิก เสียเงินเปล่า ฿1,300", amount: 1300, type: "subtract" },
    
    // 🎴 การ์ดพิเศษกระจายในกองตั๋วเสี่ยงโชค
    { text: "💸 สรรพากรตรวจสอบคนรวย! บังคับให้ผู้เล่นที่มีเงินสดในบัญชีมากที่สุดในห้อง เสียภาษี 7% ให้คุณ", type: "duel_rich_tax" },
    { text: "⚖️ กองทุนรวมหุ้นส่วน! สุ่มเลือกเพื่อน 1 คน เอาเงินสดมารวมกันทั้งหมด แล้วหารสองแบ่งกัน", type: "duel_split" },
    { text: "🍻 ฉลองใหญ่ใจป๋า! คุณอารมณ์ดี จ่ายเงินสดแจกให้ผู้เล่นคนอื่นๆ ทุกคนในห้องคนละ ฿1,000", type: "duel_party" },
    { text: "🔥 ล้มละลาย! โดนยึดทรัพย์สินทั้งหมด เงินในบัญชีเหลือ ฿0 ทันที!", amount: 0, type: "bankruptcy" }
];

function drawCard(deckType) {
    if (!currentPlayer || !currentPlayersData[currentPlayer]) {
        alert("กรุณาเลือกผู้เล่นก่อนครับ!");
        return;
    }

    let selectedCardObj;
    let badgeText = "";

    if (deckType === 'chest') {
        badgeText = "💰 หีบสมบัติเจ้าสัว";
        const randomIndex = Math.floor(Math.random() * chestCards.length);
        selectedCardObj = chestCards[randomIndex];
    } else {
        badgeText = "⚡ ตั๋วเสี่ยงโชค";
        const randomIndex = Math.floor(Math.random() * chanceCards.length);
        selectedCardObj = chanceCards[randomIndex];
    }

    if (selectedCardObj.type === "duel_swap" || selectedCardObj.type === "duel_rob" || selectedCardObj.type === "duel_seizure") {
        showDuelTargetSelector(selectedCardObj, badgeText);
        return;
    }

    processCardResult(selectedCardObj, badgeText);
}

function showDuelTargetSelector(cardObj, badgeText) {
    document.getElementById("selectScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";

    const pDisplayName = currentPlayersData[currentPlayer];
    document.getElementById("cardBadge").innerText = `⚔️ ${badgeText} (${pDisplayName})`;
    
    let html = `<div style="margin-bottom:15px; font-weight:bold; color:#1b5e20;">${cardObj.text}</div>`;
    
    if (cardObj.type === "duel_seizure") {
        html += `<div style="font-size:14px; margin-bottom:15px; color:#555;">เลือกสิ่งที่ต้องการรับ:</div>`;
        html += `<button class="player-btn" style="background:#2e7d32; margin-bottom:8px; padding:10px;" onclick="resolveSeizureChoice('land', 0)">🏠 ได้รับที่ดิน (ไม่บวกยอดเงินเพิ่ม)</button>`;
        html += `<button class="player-btn" style="background:#f57c00; padding:10px;" onclick="resolveSeizureChoice('cash', ${cardObj.amount})">💰 ได้รับเงินสด ฿5,000 (บวกยอดเงินเพิ่ม)</button>`;
    } else {
        html += `<div style="font-size:14px; margin-bottom:10px; color:#555;">เลือกผู้เล่นเป้าหมาย:</div>`;
        ['P01', 'P02', 'P03', 'P04'].forEach(pKey => {
            if (pKey !== currentPlayer) {
                const targetName = currentPlayersData[pKey];
                let actionFn = "";
                if (cardObj.type === "duel_swap") actionFn = `executeSwap('${pKey}')`;
                if (cardObj.type === "duel_rob") actionFn = `executeRob('${pKey}')`;

                html += `<button class="player-btn" style="background:#d32f2f; margin-bottom:8px; padding:10px;" onclick="${actionFn}">เลือก: ${targetName}</button>`;
            }
        });
    }

    document.getElementById("cardText").innerHTML = html;
}

function resolveSeizureChoice(choiceType, amount) {
    const bankRef = db.ref("bankData");
    bankRef.once("value", function(snapshot) {
        let bankData = snapshot.val();
        if (!bankData) return;
        if (!bankData[currentPlayer]) return;

        let currentMoney = parseInt(bankData[currentPlayer].money) || 0;
        const myName = currentPlayersData[currentPlayer];
        let historyText = "";

        if (choiceType === 'land') {
            historyText = `${myName} จั่วโฉนดมรณะ: เลือกรับที่ดิน (ไม่บวกยอดเงินเพิ่ม)`;
            document.getElementById("cardText").innerHTML = `🏠 สำเร็จ!<br>คุณเลือก <b>รับที่ดิน</b> เรียบร้อยแล้ว (ไม่มีการบวกเพิ่มยอดเงิน)`;
        } else {
            currentMoney += amount;
            bankData[currentPlayer].money = currentMoney;
            historyText = `${myName} จั่วโฉนดมรณะ: เลือกรับเงินสด +฿${amount.toLocaleString()}`;
            document.getElementById("cardText").innerHTML = `💰 สำเร็จ!<br>คุณเลือกรับเงินสด <b>฿${amount.toLocaleString()}</b> เข้าบัญชีเรียบร้อยแล้ว!`;
        }

        if (currentMoney <= 0) {
            bankData[currentPlayer].active = false;
            bankData[currentPlayer].money = 0;
        }

        if (!Array.isArray(bankData.globalHistory)) bankData.globalHistory = [];
        const timeString = new Date().toLocaleDateString("th-TH") + " " + new Date().toLocaleTimeString("th-TH", {hour: '2-digit', minute:'2-digit'});

        bankData.globalHistory.push({
            text: historyText,
            amount: choiceType === 'cash' ? amount : 0,
            time: timeString
        });

        bankRef.set(bankData);
    });
}

function executeSwap(targetKey) {
    const bankRef = db.ref("bankData");
    bankRef.once("value", function(snapshot) {
        let bankData = snapshot.val();
        if (!bankData) return;

        let myMoney = parseInt(bankData[currentPlayer].money) || 0;
        let targetMoney = parseInt(bankData[targetKey].money) || 0;

        bankData[currentPlayer].money = targetMoney;
        bankData[targetKey].money = myMoney;

        const myName = currentPlayersData[currentPlayer];
        const targetName = currentPlayersData[targetKey];

        if (!Array.isArray(bankData.globalHistory)) bankData.globalHistory = [];
        const timeString = new Date().toLocaleDateString("th-TH") + " " + new Date().toLocaleTimeString("th-TH", {hour: '2-digit', minute:'2-digit'});

        bankData.globalHistory.push({
            text: `🤝 ${myName} สลับกระเป๋ากับ ${targetName} (สลับยอดเงิน ${myMoney.toLocaleString()} ⇄ ${targetMoney.toLocaleString()})`,
            amount: 0,
            time: timeString
        });

        bankRef.set(bankData);
        document.getElementById("cardText").innerHTML = `🎉 สำเร็จ!<br>คุณสลับกระเป๋าเงินกับ <span style="color:#d32f2f;">${targetName}</span> เรียบร้อยแล้ว!`;
    });
}

function executeRob(targetKey) {
    const bankRef = db.ref("bankData");
    bankRef.once("value", function(snapshot) {
        let bankData = snapshot.val();
        if (!bankData) return;

        let myMoney = parseInt(bankData[currentPlayer].money) || 0;
        let targetMoney = parseInt(bankData[targetKey].money) || 0;

        let robAmount = Math.floor(targetMoney * 0.15);
        if (robAmount < 0) robAmount = 0;

        targetMoney -= robAmount;
        myMoney += robAmount;

        bankData[currentPlayer].money = myMoney;
        bankData[targetKey].money = targetMoney;

        const myName = currentPlayersData[currentPlayer];
        const targetName = currentPlayersData[targetKey];

        if (!Array.isArray(bankData.globalHistory)) bankData.globalHistory = [];
        const timeString = new Date().toLocaleDateString("th-TH") + " " + new Date().toLocaleTimeString("th-TH", {hour: '2-digit', minute:'2-digit'});

        bankData.globalHistory.push({
            text: `🦹‍♂️ ${myName} ปล้นเงิน 15% จาก ${targetName}: +฿${robAmount.toLocaleString()}`,
            amount: robAmount,
            time: timeString
        });

        bankRef.set(bankData);
        document.getElementById("cardText").innerHTML = `🎉 ปล้นสำเร็จ!<br>คุณฉกเงินจาก <span style="color:#d32f2f;">${targetName}</span> มาได้ <b>฿${robAmount.toLocaleString()}</b>`;
    });
}

function processCardResult(card, badgeText) {
    document.getElementById("selectScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";

    const pDisplayName = currentPlayersData[currentPlayer];
    document.getElementById("cardBadge").innerText = badgeText + ` (${pDisplayName})`;
    const textElement = document.getElementById("cardText");
    textElement.innerText = card.text;

    if (card.type === "bankruptcy") {
        textElement.classList.add("bankruptcy");
    } else {
        textElement.classList.remove("bankruptcy");
    }

    updatePlayerMoneyInFirebase(card);
}

function updatePlayerMoneyInFirebase(card) {
    const bankRef = db.ref("bankData");

    bankRef.once("value", function(snapshot) {
        let bankData = snapshot.val();
        if (!bankData) return;
        if (!bankData[currentPlayer]) return;

        let currentMoney = parseInt(bankData[currentPlayer].money) || 0;
        let changeAmount = 0;
        let historyText = "";
        const pName = currentPlayersData[currentPlayer];

        if (card.type === "add") {
            changeAmount = card.amount;
            currentMoney += changeAmount;
            historyText = `${pName} (การ์ด): +฿${changeAmount.toLocaleString()}`;
        } else if (card.type === "subtract") {
            changeAmount = -card.amount;
            currentMoney += changeAmount;
            historyText = `${pName} (การ์ด): -฿${card.amount.toLocaleString()}`;
        } else if (card.type === "bankruptcy") {
            changeAmount = -currentMoney;
            currentMoney = 0;
            historyText = `${pName} (การ์ด): ล้มละลาย!`;
        } 
        else if (card.type === "duel_rich_tax") {
            let richestKey = null;
            let maxMoney = -1;

            ['P01', 'P02', 'P03', 'P04'].forEach(pKey => {
                if (bankData[pKey] && bankData[pKey].active !== false) {
                    let m = parseInt(bankData[pKey].money) || 0;
                    if (m > maxMoney) {
                        maxMoney = m;
                        richestKey = pKey;
                    }
                }
            });

            if (richestKey && richestKey !== currentPlayer) {
                let taxAmount = Math.floor(maxMoney * 0.07);
                bankData[richestKey].money -= taxAmount;
                currentMoney += taxAmount;
                historyText = `${pName} เก็บภาษี 7% จาก ${currentPlayersData[richestKey]}: +฿${taxAmount.toLocaleString()}`;
            } else {
                historyText = `${pName} จั่วการ์ดภาษีคนรวย (ไม่มีใครให้เก็บภาษีเพิ่มเติม)`;
            }
        }
        else if (card.type === "duel_split") {
            let otherKeys = ['P01', 'P02', 'P03', 'P04'].filter(k => k !== currentPlayer);
            let randomPartnerKey = otherKeys[Math.floor(Math.random() * otherKeys.length)];
            
            let partnerMoney = parseInt(bankData[randomPartnerKey].money) || 0;
            let totalPool = currentMoney + partnerMoney;
            let splitAmount = Math.floor(totalPool / 2);

            currentMoney = splitAmount;
            bankData[randomPartnerKey].money = splitAmount;

            historyText = `${pName} รวมกระเป๋ากับ ${currentPlayersData[randomPartnerKey]} แล้วหารครึ่ง คนละ ฿${splitAmount.toLocaleString()}`;
        }
        else if (card.type === "duel_party") {
            let totalGiven = 0;
            ['P01', 'P02', 'P03', 'P04'].forEach(pKey => {
                if (pKey !== currentPlayer && bankData[pKey]) {
                    bankData[pKey].money = (parseInt(bankData[pKey].money) || 0) + 1000;
                    totalGiven += 1000;
                }
            });
            currentMoney -= totalGiven;
            historyText = `${pName} เลี้ยงโต๊ะจีนฉลองชัย แจกเงินให้ทุกคนคนละ ฿1,000`;
        }

        bankData[currentPlayer].money = currentMoney;

        if (currentMoney <= 0) {
            bankData[currentPlayer].active = false;
            bankData[currentPlayer].money = 0;
        }

        if (!Array.isArray(bankData.globalHistory)) {
            bankData.globalHistory = [];
        }

        const now = new Date();
        const timeString = now.toLocaleDateString("th-TH") + " " + now.toLocaleTimeString("th-TH", {hour: '2-digit', minute:'2-digit'});

        bankData.globalHistory.push({
            text: historyText,
            amount: card.amount || 0,
            time: timeString
        });

        bankRef.set(bankData);
    });
}

function closePage() {
    try {
        window.close();
    } catch (e) {
        window.location.href = "about:blank";
    }
}

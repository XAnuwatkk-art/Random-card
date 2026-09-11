// ========================================
// MONOPOLY CARD DRAW (Dynamic Player Names)
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyDZbVA5OPmLg7UpmrndqNJ7V7WIS7nmGyA",
    authDomain: "monopoly-bank-67c20.firebaseapp.com",
    databaseURL: "https://monopoly-bank-67c20-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "monopoly-bank-67c20",
    storageBucket: "monopoly-bank-67c20.firebasestorage.app",
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

// โหลดชื่อผู้เล่นจาก Firebase ทันทีที่เปิดหน้าเว็บ เพื่ออัปเดตชื่อบนปุ่มเลือก
window.addEventListener("DOMContentLoaded", () => {
    const bankRef = db.ref("bankData");
    bankRef.on("value", (snapshot) => {
        const bankData = snapshot.val();
        if (bankData) {
            ['P01', 'P02', 'P03', 'P04'].forEach(pKey => {
                if (bankData[pKey]) {
                    // ถ้าผู้เล่นมีการตั้งชื่อเล่น ให้ใช้ชื่อนั้น ถ้าไม่มีใช้ค่าเริ่มต้น
                    const customName = bankData[pKey].nickname || DEFAULT_PLAYERS[pKey];
                    currentPlayersData[pKey] = customName;
                    
                    // ค้นหาปุ่มตาม onclick attribute แล้วเปลี่ยนข้อความหน้าเว็บ
                    const btn = document.querySelector(`button[onclick*="${pKey}"]`);
                    if (btn) {
                        btn.innerText = customName;
                    }
                }
            });
        }
    });
});

// ฟังก์ชันเลือกผู้เล่นก่อนสุ่ม
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

// 💰 1. กองหีบสมบัติเจ้าสัว (35 ใบ: ได้เงิน 60% / เสียเงิน 40% | ฝั่งเสียเงินระหว่าง 2,000 - 10,000 บาท)
const chestCards = [
    // --- ฝั่งได้เงินก้อนโต (21 ใบ / 60%) ---
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

    // --- ฝั่งเสียเงิน (14 ใบ / 40% - หักระหว่าง 2,000 ถึง 10,000 บาทถ้วน) ---
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
    { text: "💥 จ่ายค่าปรับคดีความทางธุรกิจ ฿10,000", amount: 10000, type: "subtract" }
];

// ⚡ 2. กองตั๋วเสี่ยงโชค (35 ใบ: มีการ์ดล้มละลาย 1 ใบถ้วน)
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
    { text: "จ่ายค่าปรับลักลอบตัดไม้ทำลายป่าในเกม ฿1,000", amount: 1000, type: "subtract" },
    { text: "จ่ายค่าปรับนำเข้าสัตว์เลี้ยงผิดกฎหมาย ฿900", amount: 900, type: "subtract" },
    { text: "จ่ายค่าซ่อมแซมท่อน้ำประปาแตก ฿1,100", amount: 1100, type: "subtract" },
    { text: "จ่ายค่าธรรมเนียมโอนกรรมสิทธิ์ด่วนพิเศษ ฿1,500", amount: 1500, type: "subtract" },
    // 💥 การ์ดล้มละลาย (มีใบนี้ใบเดียวในกองเสี่ยงโชค)
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

    // อัปเดตหน้าจอแสดงผล
    document.getElementById("selectScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";

    const pDisplayName = currentPlayersData[currentPlayer];
    document.getElementById("cardBadge").innerText = badgeText + ` (${pDisplayName})`;
    const textElement = document.getElementById("cardText");
    textElement.innerText = selectedCardObj.text;

    if (selectedCardObj.type === "bankruptcy") {
        textElement.classList.add("bankruptcy");
    } else {
        textElement.classList.remove("bankruptcy");
    }

    // อัปเดตเงินผู้เล่นใน Firebase ทันที
    updatePlayerMoneyInFirebase(selectedCardObj);
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

        // อัปเดตเงินผู้เล่น
        bankData[currentPlayer].money = currentMoney;

        // เช็คเงื่อนไขล้มละลาย (<= 0)
        if (currentMoney <= 0) {
            bankData[currentPlayer].active = false;
            bankData[currentPlayer].money = 0;
        }

        // บันทึกลงประวัติส่วนกลาง (Global History)
        if (!Array.isArray(bankData.globalHistory)) {
            bankData.globalHistory = [];
        }

        const now = new Date();
        const timeString = now.toLocaleDateString("th-TH") + " " + now.toLocaleTimeString("th-TH", {hour: '2-digit', minute:'2-digit'});

        bankData.globalHistory.push({
            text: historyText,
            amount: card.type === "add" ? card.amount : (card.type === "subtract" ? -card.amount : 0),
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

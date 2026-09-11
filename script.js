// ฐานข้อมูลการ์ดทั้ง 2 กอง
const chestCards = [
    "ธนาคารผิดพลาดจ่ายเงินให้คุณ ฿2,000",
    "ขายหุ้นได้กำไร รับเงิน ฿1,000",
    "ได้รับรางวัลประกวดความงาม รับเงิน ฿500",
    "ได้รับเงินปันผลประจำปี ฿1,500",
    "กองมรดกตกทอด รับเงิน ฿3,000",
    "คืนภาษีเงินได้ รับเงิน ฿800",
    "ชนะการแข่งขันเศรษฐีประจำปี รับเงิน ฿2,500"
];

const chanceCards = [
    "จ่ายค่าปรับความเร็วเกินกำหนด ฿500",
    "จ่ายค่าซ่อมแซมบ้านหลังละ ฿800",
    "จ่ายค่าแพทย์ ฿1,000",
    "โดนปรับข้อหาจอดรถผิดกฎหมาย ฿300",
    "ภาษีโรงเรือนและที่ดิน จ่าย ฿1,200",
    // 💥 การ์ดล้มละลายผสมอยู่
    "🔥 ล้มละลาย! โดนยึดทรัพย์สินทั้งหมด เงินในบัญชีเหลือ ฿0 ทันที!",
    "💥 วิกฤตการเงิน! เงินหมดเกลี้ยงบัญชี (ล้มละลาย)"
];

function drawCard(type) {
    let selectedCard = "";
    let badgeText = "";
    let isBankruptcy = false;

    if (type === 'chest') {
        badgeText = "💰 หีบสมบัติเจ้าสัว";
        const randomIndex = Math.floor(Math.random() * chestCards.length);
        selectedCard = chestCards[randomIndex];
    } else {
        badgeText = "⚡ ตั๋วเสี่ยงโชค";
        const randomIndex = Math.floor(Math.random() * chanceCards.length);
        selectedCard = chanceCards[randomIndex];
        if (selectedCard.includes("ล้มละลาย")) {
            isBankruptcy = true;
        }
    }

    // สลับหน้าจอจากเลือกกองการ์ด เป็นแสดงผลการ์ด
    document.getElementById("selectScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";

    document.getElementById("cardBadge").innerText = badgeText;
    const textElement = document.getElementById("cardText");
    textElement.innerText = selectedCard;

    if (isBankruptcy) {
        textElement.classList.add("bankruptcy");
    } else {
        textElement.classList.remove("bankruptcy");
    }
}

function closePage() {
    try {
        window.close();
    } catch (e) {
        window.location.href = "about:blank";
    }
}

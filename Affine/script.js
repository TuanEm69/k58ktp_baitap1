// Tìm nghịch đảo modular
function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return null; // không có nghịch đảo
}

// Hàm mã hoá Affine
function affineEncrypt(text, a, b) {
    return text.split("").map(char => {
        if (char.match(/[a-z]/i)) {
            let base = char === char.toUpperCase() ? 65 : 97;
            let x = char.charCodeAt(0) - base;
            let y = (a * x + b) % 26;
            return String.fromCharCode(y + base);
        }
        return char;
    }).join("");
}

// Hàm giải mã Affine
function affineDecrypt(text, a, b) {
    let a_inv = modInverse(a, 26);
    if (a_inv === null) return "a không có nghịch đảo mod 26!";
    return text.split("").map(char => {
        if (char.match(/[a-z]/i)) {
            let base = char === char.toUpperCase() ? 65 : 97;
            let y = char.charCodeAt(0) - base;
            let x = (a_inv * (y - b + 26)) % 26;
            return String.fromCharCode(x + base);
        }
        return char;
    }).join("");
}

// Gắn sự kiện cho nút
document.getElementById("encryptBtn").addEventListener("click", function() {
    const text = document.getElementById("inputText").value;
    const a = parseInt(document.getElementById("a").value);
    const b = parseInt(document.getElementById("b").value);
    const encrypted = affineEncrypt(text, a, b);
    document.getElementById("result").innerText = encrypted;
});

document.getElementById("decryptBtn").addEventListener("click", function() {
    const text = document.getElementById("inputText").value;
    const a = parseInt(document.getElementById("a").value);
    const b = parseInt(document.getElementById("b").value);
    const decrypted = affineDecrypt(text, a, b);
    document.getElementById("result").innerText = decrypted;
});

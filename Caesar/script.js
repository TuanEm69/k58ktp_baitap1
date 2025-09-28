const qs = id => document.getElementById(id);
const mod = (n,m) => ((n % m) + m) % m;

function caesarEncrypt(text, key){
  key = mod(Number(key),26);
  let out = "";
  for (let i=0;i<text.length;i++){
    const c = text[i];
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90){ // A-Z
      out += String.fromCharCode(65 + mod(code - 65 + key, 26));
    } else if (code >= 97 && code <= 122){ // a-z
      out += String.fromCharCode(97 + mod(code - 97 + key, 26));
    } else {
      out += c;
    }
  }
  return out;
}
function caesarDecrypt(text, key){ return caesarEncrypt(text, -key); }

// DOM elements
const txt = qs('txt'), key = qs('key'), knum = qs('knum'), kdisp = qs('kdisp');
const enc = qs('enc'), dec = qs('dec'), brute = qs('brute'), freq = qs('freq'), clr = qs('clr');
const out = qs('out'), brlist = qs('brlist'), freqout = qs('freqout');

function setKey(k){
  k = Number(k); if (Number.isNaN(k)) k = 0;
  k = Math.max(0, Math.min(25, Math.floor(k)));
  key.value = k; knum.value = k; kdisp.textContent = k;
}
key.addEventListener('input', e => setKey(e.target.value));
knum.addEventListener('change', e => setKey(e.target.value));

enc.addEventListener('click', ()=>{
  out.textContent = caesarEncrypt(txt.value, key.value);
  brlist.textContent = "";
  freqout.textContent = "Nhấn 'Phân tích tần suất' để gợi ý.";
});
dec.addEventListener('click', ()=>{
  out.textContent = caesarDecrypt(txt.value, key.value);
  brlist.textContent = "";
  freqout.textContent = "Nhấn 'Phân tích tần suất' để gợi ý.";
});

brute.addEventListener('click', ()=>{
  const s = txt.value || "";
  if (!s){ brlist.textContent = "Nhập văn bản (ciphertext) vào ô trên."; return; }
  let lines = [];
  for (let k=0;k<26;k++){
    lines.push(`k=${k.toString().padStart(2,' ')} → ${caesarDecrypt(s,k)}`);
  }
  brlist.textContent = lines.join('\n');
  out.textContent = "";
  freqout.textContent = "Chọn kết quả hợp lý từ danh sách brute-force.";
});

// Simple frequency analysis
freq.addEventListener('click', ()=>{
  const s = (txt.value || "").toUpperCase();
  if (!s){ freqout.textContent = "Nhập văn bản (ciphertext) vào ô trên."; return; }
  const counts = new Array(26).fill(0);
  for (let ch of s){
    const c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90) counts[c - 65] += 1;
  }
  const total = counts.reduce((a,b)=>a+b,0);
  if (total === 0){ freqout.textContent = "Không có chữ cái nào để phân tích."; return; }
  let maxIdx = counts.indexOf(Math.max(...counts));
  const most = String.fromCharCode(65 + maxIdx);
  const percent = (100 * counts[maxIdx] / total).toFixed(2);
  const assumed = 'E'.charCodeAt(0) - 65;
  const guessedKey = mod(maxIdx - assumed, 26);
  const suggestion = caesarDecrypt(txt.value, guessedKey);

  freqout.innerHTML = `Chữ nhiều nhất: <strong>${most}</strong> (${percent}%).
    <br>Gợi ý key = <strong>${guessedKey}</strong>.
    <br>Kết quả:<div class="output">${suggestion}</div>
    <div class="info">Có thể sai nếu văn bản ngắn / không phải tiếng Anh.</div>`;
  out.textContent = suggestion;
  brlist.textContent = "";
});

clr.addEventListener('click', ()=>{
  txt.value = ""; out.textContent = ""; brlist.textContent = "";
  freqout.textContent = "Nhấn \"Phân tích tần suất\" để nhận gợi ý.";
});

// init
setKey(3);

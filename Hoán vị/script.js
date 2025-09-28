// script.js - Permutation cipher (hoán vị)
// Mã hoá: trong mỗi block length n, với perm P (1-based) -> cipherBlock[i] = block[P[i]-1]
// Giải mã: dùng hoán vị nghịch đảo

// Helpers
const el = id => document.getElementById(id);

function parsePerm(text, n) {
  // text like "3,1,4,2,5" -> [3,1,4,2,5]
  if (!text) return null;
  const parts = text.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length !== n) return null;
  const arr = parts.map(p => Number(p));
  if (arr.some(x => !Number.isInteger(x) || x < 1 || x > n)) return null;
  // check permutation uniqueness
  const set = new Set(arr);
  if (set.size !== n) return null;
  return arr;
}

function inversePerm(P) {
  // P is 1-based array length n -> returns inverse (1-based)
  const n = P.length;
  const inv = new Array(n);
  for (let i = 0; i < n; i++) {
    inv[P[i] - 1] = i + 1;
  }
  return inv;
}

function chunkPad(text, n, padChar='X') {
  const out = [];
  for (let i = 0; i < text.length; i += n) {
    let block = text.slice(i, i + n);
    if (block.length < n) block = block + padChar.repeat(n - block.length);
    out.push(block);
  }
  return out;
}

function permuteBlock(block, P) {
  // block: string length n, P: 1-based array length n
  const n = P.length;
  let res = '';
  for (let i = 0; i < n; i++) {
    const srcIndex = P[i] - 1;
    res += block[srcIndex] ?? 'X';
  }
  return res;
}

function encrypt(text, P) {
  const n = P.length;
  const blocks = chunkPad(text, n, 'X');
  return blocks.map(b => permuteBlock(b, P)).join('');
}

function decrypt(text, P) {
  const inv = inversePerm(P);
  return encrypt(text, inv); // because encrypt with inverse perm = decrypt
}

// Generate random permutation of size n (1-based)
function randomPerm(n) {
  const arr = Array.from({length: n}, (_,i)=>i+1);
  for (let i = n-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// generate all permutations (Heap's algorithm) - yields arrays (1-based)
function generatePermutations(n, limit=1000000) {
  // returns array of permutations (each is array 1..n)
  const res = [];
  const a = Array.from({length: n}, (_,i)=>i+1);
  const c = Array(n).fill(0);
  res.push(a.slice());
  let i = 0;
  while (i < n) {
    if (c[i] < i) {
      const k = i % 2 === 0 ? 0 : c[i];
      [a[i], a[k]] = [a[k], a[i]];
      res.push(a.slice());
      c[i]++;
      i = 0;
      if (res.length >= limit) break;
    } else {
      c[i] = 0;
      i++;
    }
  }
  return res;
}

// UI wiring
document.addEventListener('DOMContentLoaded', () => {
  const plaintext = el('plaintext');
  const blockSize = el('blockSize');
  const permInput = el('permInput');
  const genBtn = el('genBtn');
  const encBtn = el('encBtn');
  const decBtn = el('decBtn');
  const bruteBtn = el('bruteBtn');
  const clearBtn = el('clearBtn');
  const resultArea = el('resultArea');
  const bruteArea = el('bruteArea');

  function showResult(text) { resultArea.textContent = text; }
  function showBrute(text) { bruteArea.textContent = text; }

  genBtn.addEventListener('click', () => {
    const n = Math.max(2, Math.min(10, Number(blockSize.value) || 5));
    const perm = randomPerm(n);
    permInput.value = perm.join(',');
  });

  encBtn.addEventListener('click', () => {
    const n = Number(blockSize.value) || 5;
    const P = parsePerm(permInput.value, n);
    if (!P) { alert('Khóa không hợp lệ. Hãy nhập hoán vị 1-based có độ dài n, phân tách dấu phẩy.'); return; }
    const text = plaintext.value || '';
    const cipher = encrypt(text, P);
    showResult(cipher);
    showBrute('');
  });

  decBtn.addEventListener('click', () => {
    const n = Number(blockSize.value) || 5;
    const P = parsePerm(permInput.value, n);
    if (!P) { alert('Khóa không hợp lệ. Hãy nhập hoán vị 1-based có độ dài n, phân tách dấu phẩy.'); return; }
    const text = plaintext.value || '';
    const plain = decrypt(text, P);
    showResult(plain);
    showBrute('');
  });

  clearBtn.addEventListener('click', () => {
    plaintext.value = '';
    permInput.value = '';
    resultArea.textContent = '';
    bruteArea.textContent = '';
  });

  bruteBtn.addEventListener('click', () => {
    const n = Number(blockSize.value) || 5;
    if (n > 7) {
      if (!confirm(`n = ${n} có không gian khóa ${factorial(n)} lớn (n!). Brute-force có thể rất chậm. Bạn vẫn muốn tiếp tục?`)) {
        return;
      }
    }
    // generate all permutations (limit to reasonable count)
    const limit = 300000; // safety
    const perms = generatePermutations(n, limit);
    if (perms.length >= limit) {
      if (!confirm(`Số hoán vị đã đạt giới hạn ${limit}. Sẽ chỉ thử ${limit} permutations.`)) {
        // proceed anyway or cancel
      }
    }
    const text = plaintext.value || '';
    const candidates = [];
    for (let i = 0; i < perms.length; i++) {
      const P = perms[i];
      const plainCandidate = decrypt(text, P);
      candidates.push({key: P.slice(), plain: plainCandidate});
    }
    // display top many (all)
    let out = '';
    for (let i = 0; i < candidates.length; i++) {
      out += `k=${candidates[i].key.join(',')} → ${candidates[i].plain}\n`;
    }
    showBrute(out || 'Không có kết quả');
    showResult('');
  });

  // helper factorial
  function factorial(m) {
    let f = 1;
    for (let i = 2; i <= m; i++) f *= i;
    return f;
  }
});

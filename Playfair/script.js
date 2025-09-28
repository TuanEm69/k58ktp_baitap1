// Playfair cipher implementation (script.js)

// Helpers
const $ = id => document.getElementById(id);

function sanitizeKey(key, mergeJ) {
  // uppercase, remove non-letters
  let s = (key || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (mergeJ) s = s.replace(/J/g, 'I');
  return s;
}

function buildMatrixFromKey(key, mergeJ) {
  const seen = new Set();
  const arr = [];
  const k = sanitizeKey(key, mergeJ);
  // add key letters
  for (const ch of k) {
    if (!seen.has(ch)) { seen.add(ch); arr.push(ch); }
  }
  // add rest letters A-Z
  for (let i = 0; i < 26; i++) {
    let ch = String.fromCharCode(65 + i);
    if (mergeJ && ch === 'J') continue;
    if (!seen.has(ch)) { seen.add(ch); arr.push(ch); }
  }
  // arr length should be 25
  const matrix = [];
  for (let r = 0; r < 5; r++) {
    matrix.push(arr.slice(r * 5, r * 5 + 5));
  }
  return matrix;
}

function findPos(matrix, ch) {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c] === ch) return {r, c};
    }
  }
  return null;
}

function preprocessPlaintext(text, mergeJ, padChar = 'X') {
  // uppercase, remove non-letters
  let s = (text || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (mergeJ) s = s.replace(/J/g, 'I');
  const pairs = [];
  let i = 0;
  while (i < s.length) {
    const a = s[i];
    const b = s[i + 1];
    if (b === undefined) {
      pairs.push(a + padChar);
      i += 1;
    } else if (a === b) {
      pairs.push(a + padChar);
      i += 1;
    } else {
      pairs.push(a + b);
      i += 2;
    }
  }
  return {clean: s, pairs};
}

function encryptPair(pair, matrix) {
  const a = pair[0], b = pair[1];
  const pa = findPos(matrix, a);
  const pb = findPos(matrix, b);
  if (!pa || !pb) return pair; // shouldn't happen
  if (pa.r === pb.r) {
    // same row -> take right
    const ca = matrix[pa.r][(pa.c + 1) % 5];
    const cb = matrix[pb.r][(pb.c + 1) % 5];
    return ca + cb;
  } else if (pa.c === pb.c) {
    // same column -> take down
    const ca = matrix[(pa.r + 1) % 5][pa.c];
    const cb = matrix[(pb.r + 1) % 5][pb.c];
    return ca + cb;
  } else {
    // rectangle -> swap columns
    const ca = matrix[pa.r][pb.c];
    const cb = matrix[pb.r][pa.c];
    return ca + cb;
  }
}

function decryptPair(pair, matrix) {
  const a = pair[0], b = pair[1];
  const pa = findPos(matrix, a);
  const pb = findPos(matrix, b);
  if (!pa || !pb) return pair;
  if (pa.r === pb.r) {
    // same row -> take left
    const ca = matrix[pa.r][(pa.c + 5 - 1) % 5];
    const cb = matrix[pb.r][(pb.c + 5 - 1) % 5];
    return ca + cb;
  } else if (pa.c === pb.c) {
    // same column -> take up
    const ca = matrix[(pa.r + 5 - 1) % 5][pa.c];
    const cb = matrix[(pb.r + 5 - 1) % 5][pb.c];
    return ca + cb;
  } else {
    // rectangle -> swap columns
    const ca = matrix[pa.r][pb.c];
    const cb = matrix[pb.r][pa.c];
    return ca + cb;
  }
}

function encryptText(plain, matrix, mergeJ, padChar) {
  const {pairs} = preprocessPlaintext(plain, mergeJ, padChar);
  return pairs.map(p => encryptPair(p, matrix)).join('');
}

function decryptText(cipher, matrix, mergeJ, padChar) {
  // ciphertext should already be letters only; if not we clean
  const s = (cipher || '').toUpperCase().replace(/[^A-Z]/g, '');
  // split into pairs directly
  const pairs = [];
  for (let i = 0; i < s.length; i += 2) {
    const a = s[i];
    const b = s[i + 1] || padChar;
    pairs.push(a + b);
  }
  return pairs.map(p => decryptPair(p, matrix)).join('');
}

// UI wiring
document.addEventListener('DOMContentLoaded', () => {
  const keyInput = $('keyInput'), mergeJ = $('mergeJ'), padChar = $('padChar');
  const plainInput = $('plainInput');
  const buildBtn = $('buildBtn'), encryptBtn = $('encryptBtn'), decryptBtn = $('decryptBtn'), clearBtn = $('clearBtn');
  const matrixDiv = $('matrix'), prepDiv = $('prep'), resultOut = $('resultOut');

  function renderMatrix(mat) {
    matrixDiv.innerHTML = '';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = mat[r][c];
        matrixDiv.appendChild(cell);
      }
    }
  }

  function showPrepAndPairs(text, mat) {
    const m = buildMatrixFromKey(keyInput.value, mergeJ.checked);
    const {clean, pairs} = preprocessPlaintext(text, mergeJ.checked, padChar.value || 'X');
    let out = `Clean (letters only): ${clean}\nPairs (${pairs.length}):\n`;
    out += pairs.join(' ');
    prepDiv.textContent = out;
  }

  function buildAndShow() {
    const mat = buildMatrixFromKey(keyInput.value, mergeJ.checked);
    renderMatrix(mat);
    showPrepAndPairs(plainInput.value, mat);
    resultOut.textContent = '';
  }

  buildBtn.addEventListener('click', buildAndShow);

  encryptBtn.addEventListener('click', () => {
    const mat = buildMatrixFromKey(keyInput.value, mergeJ.checked);
    renderMatrix(mat);
    const cipher = encryptText(plainInput.value, mat, mergeJ.checked, padChar.value || 'X');
    showPrepAndPairs(plainInput.value, mat);
    resultOut.textContent = cipher;
  });

  decryptBtn.addEventListener('click', () => {
    const mat = buildMatrixFromKey(keyInput.value, mergeJ.checked);
    renderMatrix(mat);
    const plain = decryptText(plainInput.value, mat, mergeJ.checked, padChar.value || 'X');
    // Note: plaintext may include pad chars inserted earlier; user can manually remove
    prepDiv.textContent = 'Input ciphertext cleaned (letters only) and split into pairs for decrypt.';
    resultOut.textContent = plain;
  });

  clearBtn.addEventListener('click', () => {
    keyInput.value = '';
    plainInput.value = '';
    prepDiv.textContent = '';
    resultOut.textContent = '';
    matrixDiv.innerHTML = '';
  });

  // init
  buildAndShow();
});

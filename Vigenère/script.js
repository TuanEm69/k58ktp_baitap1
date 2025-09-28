function encrypt() {
  let text = document.getElementById("inputText").value;
  let key = document.getElementById("key").value.toUpperCase();
  let result = "";
  let j = 0;

  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (c.match(/[a-zA-Z]/)) {
      let base = c === c.toUpperCase() ? 65 : 97;
      result += String.fromCharCode(
        (c.charCodeAt(0) - base + (key[j % key.length].charCodeAt(0) - 65)) % 26 + base
      );
      j++;
    } else {
      result += c;
    }
  }

  document.getElementById("result").innerText = result;
}

function decrypt() {
  let text = document.getElementById("inputText").value;
  let key = document.getElementById("key").value.toUpperCase();
  let result = "";
  let j = 0;

  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (c.match(/[a-zA-Z]/)) {
      let base = c === c.toUpperCase() ? 65 : 97;
      result += String.fromCharCode(
        (c.charCodeAt(0) - base - (key[j % key.length].charCodeAt(0) - 65) + 26) % 26 + base
      );
      j++;
    } else {
      result += c;
    }
  }

  document.getElementById("result").innerText = result;
}

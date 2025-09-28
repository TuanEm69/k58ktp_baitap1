#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

// ====================== 1. Caesar ======================
string caesarEncrypt(string text, int key) {
    string result = "";
    for (int i = 0; i < text.length(); i++) {
        char c = text[i];
        if (isupper(c)) result += char((c - 'A' + key) % 26 + 'A');
        else if (islower(c)) result += char((c - 'a' + key) % 26 + 'a');
        else result += c;
    }
    return result;
}

string caesarDecrypt(string text, int key) {
    string result = "";
    for (int i = 0; i < text.length(); i++) {
        char c = text[i];
        if (isupper(c)) result += char((c - 'A' - key + 26) % 26 + 'A');
        else if (islower(c)) result += char((c - 'a' - key + 26) % 26 + 'a');
        else result += c;
    }
    return result;
}

// ====================== 2. Affine ======================
// E(x) = (a*x + b) mod 26
// D(x) = a^(-1) * (y - b) mod 26

int modInverse(int a, int m) {
    a = a % m;
    for (int x = 1; x < m; x++) {
        if ((a * x) % m == 1) return x;
    }
    return -1;
}

string affineEncrypt(string text, int a, int b) {
    string result = "";
    for (int i = 0; i < text.length(); i++) {
        char c = text[i];
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            result += char(((a * (c - base) + b) % 26) + base);
        } else result += c;
    }
    return result;
}

string affineDecrypt(string text, int a, int b) {
    string result = "";
    int a_inv = modInverse(a, 26);
    if (a_inv == -1) return "Khong ton tai nghich dao!";
    for (int i = 0; i < text.length(); i++) {
        char c = text[i];
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            result += char((a_inv * ((c - base - b + 26)) % 26) + base);
        } else result += c;
    }
    return result;
}

// ====================== 3. Hoán v? ======================
// Dùng khóa là 1 vector v? trí

string permutationEncrypt(string text, vector<int> key) {
    string result = "";
    int block = key.size();
    for (int i = 0; i < text.length(); i += block) {
        string chunk = text.substr(i, block);
        while (chunk.size() < block) chunk += 'X'; // padding
        for (int k : key) result += chunk[k];
    }
    return result;
}

string permutationDecrypt(string text, vector<int> key) {
    string result = "";
    int block = key.size();
    vector<int> invKey(block);
    for (int i = 0; i < block; i++) invKey[key[i]] = i;
    for (int i = 0; i < text.length(); i += block) {
        string chunk = text.substr(i, block);
        string dec(block, ' ');
        for (int j = 0; j < block; j++) dec[invKey[j]] = chunk[j];
        result += dec;
    }
    return result;
}

// ====================== 4. Vigenère ======================
string vigenereEncrypt(string text, string key) {
    string result = "";
    int j = 0;
    for (int i = 0; i < text.length(); i++) {
        char c = text[i];
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            char k = tolower(key[j % key.size()]) - 'a';
            result += char((c - base + k) % 26 + base);
            j++;
        } else result += c;
    }
    return result;
}

string vigenereDecrypt(string text, string key) {
    string result = "";
    int j = 0;
    for (int i = 0; i < text.length(); i++) {
        char c = text[i];
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            char k = tolower(key[j % key.size()]) - 'a';
            result += char((c - base - k + 26) % 26 + base);
            j++;
        } else result += c;
    }
    return result;
}

// ====================== 5. Playfair ======================
string prepareText(string text) {
    string res = "";
    for (char c : text) {
        if (isalpha(c)) {
            if (c == 'J') c = 'I';
            res += toupper(c);
        }
    }
    if (res.size() % 2 != 0) res += 'X';
    return res;
}

vector<vector<char>> generateMatrix(string key) {
    vector<vector<char>> matrix(5, vector<char>(5));
    vector<bool> used(26, false);
    used['J' - 'A'] = true; 
    string filtered = "";
    for (char c : key) {
        c = toupper(c);
        if (c == 'J') c = 'I';
        if (isalpha(c) && !used[c - 'A']) {
            used[c - 'A'] = true;
            filtered += c;
        }
    }
    for (char c = 'A'; c <= 'Z'; c++) {
        if (!used[c - 'A']) filtered += c;
    }
    int idx = 0;
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++)
            matrix[i][j] = filtered[idx++];
    return matrix;
}

pair<int,int> findPos(vector<vector<char>>& matrix, char c) {
    if (c == 'J') c = 'I';
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++)
            if (matrix[i][j] == c) return {i,j};
    return {-1,-1};
}

string playfairEncrypt(string text, string key) {
    auto matrix = generateMatrix(key);
    string pt = prepareText(text);
    string ct = "";
    for (int i = 0; i < pt.size(); i += 2) {
        char a = pt[i], b = pt[i+1];
        auto p1 = findPos(matrix,a), p2 = findPos(matrix,b);
        if (p1.first == p2.first) {
            ct += matrix[p1.first][(p1.second+1)%5];
            ct += matrix[p2.first][(p2.second+1)%5];
        } else if (p1.second == p2.second) {
            ct += matrix[(p1.first+1)%5][p1.second];
            ct += matrix[(p2.first+1)%5][p2.second];
        } else {
            ct += matrix[p1.first][p2.second];
            ct += matrix[p2.first][p1.second];
        }
    }
    return ct;
}

string playfairDecrypt(string text, string key) {
    auto matrix = generateMatrix(key);
    string pt = "";
    for (int i = 0; i < text.size(); i += 2) {
        char a = text[i], b = text[i+1];
        auto p1 = findPos(matrix,a), p2 = findPos(matrix,b);
        if (p1.first == p2.first) {
            pt += matrix[p1.first][(p1.second+4)%5];
            pt += matrix[p2.first][(p2.second+4)%5];
        } else if (p1.second == p2.second) {
            pt += matrix[(p1.first+4)%5][p1.second];
            pt += matrix[(p2.first+4)%5][p2.second];
        } else {
            pt += matrix[p1.first][p2.second];
            pt += matrix[p2.first][p1.second];
        }
    }
    return pt;
}

// ====================== MAIN ======================
int main() {
    int choice;
    cout << "Chon thuat toan ma hoa:\n";
    cout << "1. Caesar\n2. Affine\n3. Hoan vi\n4. Vigenere\n5. Playfair\nChon: ";
    cin >> choice;
    cin.ignore();

    string text, keyStr;
    int key, a, b;
    switch(choice) {
        case 1:
            cout << "Nhap chuoi: "; getline(cin, text);
            cout << "Nhap key: "; cin >> key;
            cout << "Ma hoa: " << caesarEncrypt(text,key) << endl;
            cout << "Giai ma: " << caesarDecrypt(caesarEncrypt(text,key),key) << endl;
            break;
        case 2:
            cout << "Nhap chuoi: "; getline(cin, text);
            cout << "Nhap a (phai nguyen to cung 26): "; cin >> a;
            cout << "Nhap b: "; cin >> b;
            cout << "Ma hoa: " << affineEncrypt(text,a,b) << endl;
            cout << "Giai ma: " << affineDecrypt(affineEncrypt(text,a,b),a,b) << endl;
            break;
        case 3: {
            cout << "Nhap chuoi: "; getline(cin, text);
            vector<int> key = {2,0,3,1}; // ví d? hoán v?
            cout << "Ma hoa: " << permutationEncrypt(text,key) << endl;
            cout << "Giai ma: " << permutationDecrypt(permutationEncrypt(text,key),key) << endl;
            break;
        }
        case 4:
            cout << "Nhap chuoi: "; getline(cin, text);
            cout << "Nhap khoa (chuoi): "; getline(cin, keyStr);
            cout << "Ma hoa: " << vigenereEncrypt(text,keyStr) << endl;
            cout << "Giai ma: " << vigenereDecrypt(vigenereEncrypt(text,keyStr),keyStr) << endl;
            break;
        case 5:
            cout << "Nhap chuoi: "; getline(cin, text);
            cout << "Nhap khoa (chuoi): "; getline(cin, keyStr);
            cout << "Ma hoa: " << playfairEncrypt(text,keyStr) << endl;
            cout << "Giai ma: " << playfairDecrypt(playfairEncrypt(text,keyStr),keyStr) << endl;
            break;
        default:
            cout << "Lua chon khong hop le!";
    }
    return 0;
}


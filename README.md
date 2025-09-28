# BÀI TẬP MÔN: An toàn và bảo mật thông tin #

## BÀI TẬP 1: ##

### TÌM HIỂU CÁC PHƯƠNG PHÁP MÃ HOÁ CỔ ĐIỂN ###
1. Caesar
2. Affine
3. Hoán vị
4. Vigenère
5. Playfair

**Với mỗi phương pháp, hãy tìm hiểu:**
1. Tên gọi
2. Thuật toán mã hoá, thuật toán giải mã
3. Không gian khóa
4. Cách phá mã (mà không cần khoá)
5. Cài đặt thuật toán mã hoá và giải mã bằng code C++ và bằng html+css+javascript

#### BÀI LÀM ####
1. Mã hoá Caesar

Tên gọi: Mã dịch chuyển Caesar (Caesar Cipher).

Thuật toán:

Mã hoá: 
𝐶
=
(
𝑃
+
𝑘
)
m
o
d
 
 
26
C=(P+k)mod26

Giải mã: 
𝑃
=
(
𝐶
−
𝑘
+
26
)
m
o
d
 
 
26
P=(C−k+26)mod26
Trong đó: P = ký tự gốc, C = ký tự mã, k = khoá (dịch bao nhiêu ký tự).

Không gian khoá: 25 khoá (1–25).

Phá mã: Thử toàn bộ 25 khoá (brute force).

Ví dụ:

Nhập: HELLO, khoá = 3

Mã hoá: KHOOR

Giải mã: HELLO

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/00333eb2-a2b2-4095-8c47-cd4a4200b27e" />

2. Mã hoá Affine

Tên gọi: Affine Cipher.

Thuật toán:

Mã hoá: 
𝐶
=
(
𝑎
𝑃
+
𝑏
)
m
o
d
 
 
26
C=(aP+b)mod26

Giải mã: 
𝑃
=
𝑎
−
1
(
𝐶
−
𝑏
)
m
o
d
 
 
26
P=a
−1
(C−b)mod26
Trong đó: a, b là khoá, và gcd(a, 26) = 1.

Không gian khoá: ~312 khoá khả thi.

Phá mã: Thử toàn bộ cặp (a, b) hoặc phân tích tần suất chữ.

Ví dụ:

Nhập: HELLO, a = 5, b = 8

Mã hoá: RCLLA

Giải mã: HELLO

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e5fde80c-5489-44aa-8251-c3dc8898b82c" />

3. Mã hoá Hoán vị (Transposition)

Tên gọi: Transposition Cipher (Mã hoán vị cột).

Thuật toán: Xếp các ký tự vào bảng theo số cột (khoá), sau đó đọc theo cột.

Không gian khoá: n! (với n là số cột).

Phá mã: Thử các hoán vị khác nhau, hoặc phân tích độ dài từ.

Ví dụ:

Nhập: HELLO, khoá = 3

Viết vào bảng:

H E L
L O


Mã hoá: HLOEL

Giải mã: HELLO

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/dbdb7d7a-420d-4a2c-8e0b-9af8d2cfb12a" />

4. Mã hoá Vigenère

Tên gọi: Vigenère Cipher.

Thuật toán:

Mã hoá: 
𝐶
𝑖
=
(
𝑃
𝑖
+
𝐾
𝑖
)
m
o
d
 
 
26
C
i
	​

=(P
i
	​

+K
i
	​

)mod26

Giải mã: 
𝑃
𝑖
=
(
𝐶
𝑖
−
𝐾
𝑖
+
26
)
m
o
d
 
 
26
P
i
	​

=(C
i
	​

−K
i
	​

+26)mod26
Khoá = một từ khoá (key) lặp lại.

Không gian khoá: 26^m (m = độ dài khoá).

Phá mã: Phân tích tần suất, dùng phương pháp Kasiski hoặc Friedman.

Ví dụ:

Nhập: HELLO, khoá = KEY

Mã hoá: RIJVS

Giải mã: HELLO

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/64bf0f9a-caac-48b0-b905-34f5071bb2b8" />

5. Mã hoá Playfair

Tên gọi: Playfair Cipher.

Thuật toán: Dùng bảng 5x5 từ khoá, mã hoá theo cặp chữ.

Nếu 2 chữ cùng hàng → thay bằng chữ bên phải.

Nếu cùng cột → thay bằng chữ dưới.

Nếu khác hàng, khác cột → thay theo hình chữ nhật.

Không gian khoá: 25! (với 25 ký tự chữ cái, I/J gộp chung).

Phá mã: Phân tích tần suất bigram (cặp chữ).

Ví dụ:

Nhập: HELLO, khoá = PLAYFAIR

Mã hoá: GCNNCB

Giải mã: HELLO

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5dd552ea-2ffd-4c79-b436-c3641b380625" />

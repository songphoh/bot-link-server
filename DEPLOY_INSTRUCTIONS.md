# วิธีการติดตั้ง Bot-Link บน Vercel (ฟรี)

ทำตามขั้นตอนนี้เพื่อนำเซิร์ฟเวอร์ขึ้นออนไลน์ 24 ชั่วโมงครับ

## 1. เตรียมไฟล์ (ผมทำขั้นตอนนี้ให้แล้ว)
ไฟล์อยู่ที่: `Desktop\BotLinkVercel`
ประกอบด้วย:
- `api/index.js` (โค้ดเซิร์ฟเวอร์)
- `package.json` (ตั้งค่าระบบ)

## 2. อัปโหลดขึ้น GitHub
1.  เข้าเว็บไซต์ [GitHub.com](https://github.com) และล็อกอิน
2.  กดปุ่ม **New Repository** (มุมขวาบน)
    - ตั้งชื่อว่า `bot-link-server`
    - เลือก **Private** (เพื่อความปลอดภัย)
    - กด **Create repository**
3.  อัปโหลดไฟล์ในโฟลเดอร์ `Desktop\BotLinkVercel` ขึ้นไป
    - (ถ้าใช้เว็บ) กด "uploading an existing file" แล้วลากไฟล์ `package.json` และโฟลเดอร์ `api` ลงไป
    - กด **Commit changes**

## 3. สร้างโปรเจกต์บน Vercel
1.  เข้า [Vercel.com](https://vercel.com) (ล็อกอินด้วย GitHub)
2.  กด **Add New...** -> **Project**
3.  เลือก Repository `bot-link-server` ที่เพิ่งสร้าง -> กด **Import**
4.  ในหน้า Configure Project:
    - **Framework Preset**: เลือก "Other" (หรือปล่อยไว้)
    - กด **Deploy**

## 4. เปิดใช้งานฐานข้อมูล (สำคัญมาก!)
*ถ้าไม่ทำข้อนี้ บอทจะคุยกันไม่รู้เรื่อง*

1.  หลังจาก Deploy เสร็จ ให้กด **Continue to Dashboard**
2.  ไปที่แท็บ **Storage** (ด้านบน)
3.  กดปุ่ม **Create Database** -> เลือก **KV (Redis)**
4.  ตั้งชื่ออะไรก็ได้ (เช่น `bot-store`) -> กด **Create**
5.  เลือก Region (แนะนำ **Singapore** หรือที่ใกล้ไทย) -> กด **Create**
6.  ***สำคัญ***: กดปุ่ม **Connect** เพื่อเชื่อมต่อฐานข้อมูลเข้ากับโปรเจกต์นี้
    - มันจะสร้าง Environment Variables (`KV_URL`, etc.) ให้เองอัตโนมัติ
7.  ไปที่แท็บ **Deployments** -> กดจุดสามจุดที่ตัวล่าสุด -> **Redeploy** (เพื่อให้ค่าที่ตั้งเมื่อกี้ทำงาน)

## 5. เอาลิ้งค์มาใช้
1.  เมื่อ Redeploy เสร็จ หน้า Dashboard จะมีลิงค์ให้ (เช่น `https://bot-link-server.vercel.app`)
2.  เติม `/api` ต่อท้ายลิงค์
    - **Link ที่จะใช้คือ**: `https://bot-link-server.vercel.app/api`
3.  นำลิงค์นี้ไปใส่ใน `config.txt` ของบอท:
    ```
    botlink_url=https://bot-link-server.vercel.app/api
    ```

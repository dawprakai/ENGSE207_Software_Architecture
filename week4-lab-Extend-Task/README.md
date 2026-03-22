## 👥 Group 9 Members — ENGSE207 Software Architecture

| Student ID      | Name                         | Role                     |
|-----------------|------------------------------|--------------------------|
| **67543210057-6** | นางสาว ดาวประกาย เสาร์สิงห์    | 📊 System Analyst (SA)          |
| **67543210027-8** | นางสาว กันติชา เกิดสี          | ⭐ Team Leader /🧪 Tester      |
| **67543210049-2** | นางสาว กชพร วงศ์ใหญ่         | 🛠️ Dev B (Backend) /🧪 Tester  |
| **67543210073-2** | นางสาว วริศรา สรรพกรพิเศษ     | 🎨 Dev A (Frontend)             |

# 📋 Week 4 Homework — Team Chat System
**ENGSE207 Software Architecture**  
**Feature:** Add Real-time Team Chat to Task Board System  

---

## 📑 Contents
1. Service Design  
2. System Architecture  
3. Event Design  
4. API Specification  
5. Challenges & Solutions  

---

## 1. Service Design

### 1.1 ควรแยก Chat Service ไหม?
**คำตอบ: แยกเป็น Chat Service ใหม่**

เหตุผล:
- Chat มี logic ต่างจาก Task (real-time, messaging)
- รองรับผู้ใช้จำนวนมากได้ดีกว่า
- สามารถใช้ WebSocket ได้โดยไม่กระทบ service อื่น
- ถ้า Chat ล่ม ระบบหลักยังใช้งานได้

---

### 1.2 Technology Stack

| Layer | Technology | Reason |
|------|-----------|--------|
| Backend | Node.js | รองรับ async และ real-time |
| Framework | Fastify + Socket.IO | เร็วและรองรับ WebSocket |
| Cache / PubSub | Redis | latency ต่ำ |
| Database | MongoDB | flexible schema |
| Search | Elasticsearch | ค้นหาข้อความได้เร็ว |
| Storage | S3 / MinIO | เก็บไฟล์ |

---

### 1.3 Data Storage
- MongoDB → เก็บ messages และ rooms  
- Redis → เก็บสถานะ online และ typing  
- Elasticsearch → ใช้ค้นหาข้อความ  

---

### 1.4 Real-time Communication
เลือกใช้ **WebSocket (Socket.IO)**  

ข้อดี:
- latency ต่ำ  
- real-time จริง  
- มี fallback เป็น polling  

---

## 2. System Architecture

โครงสร้างระบบ:
- Client → API Gateway  
- Gateway → route ไป services ต่าง ๆ  
- Chat Service → ใช้ WebSocket  
- Redis → ใช้ broadcast  
- MongoDB → เก็บข้อมูล  

---

## 3. Event Design

### MessageSent
```json
{
  "eventType": "MessageSent",
  "payload": {
    "messageId": "string",
    "roomId": "string",
    "senderId": "string",
    "content": "string"
  }
}
### UserJoined
```json
{
  "eventType": "UserJoined",
  "payload": {
    "userId": "string",
    "roomId": "string"
  }
}
## FileUploaded
{
  "eventType": "FileUploaded",
  "payload": {
    "fileId": "string",
    "fileName": "string"
  }
}

```
## Event Flow
1.User ส่งข้อความ
2.Chat Service บันทึก MongoDB
3.Publish event
4.Broadcast ไป user ใน room
```

```
## 4. API Specification
### POST /api/boards/:boardId/messages
{
  "content": "Hello",
  "type": "text"
}
```

```
## GET /api/boards/:boardId/messages
รองรับ:
-pagination
-search
```

```
## WebSocket Events
### Client → Server
- join_room
- send_message
- typing
### Server → Client
- message_received
- user_joined
- typing
```

```
## 5. Challenges & Solutions
### 1. Message Ordering
ปัญหา: ข้อความเรียงผิด
วิธีแก้: ใช้ sequence number จาก Redis
```

```
### 2. Message Loss
ปัญหา: หลุดแล้วข้อมูลหาย
วิธีแก้:
ใช้ ACK
retry
reconnect แล้ว sync
```

```
## 3. Scalability
ปัญหา: user เยอะ
วิธีแก้:
Redis adapter
scale หลาย instance
load balancer
```

```
## 4. Data Growth
ปัญหา: ข้อมูลเยอะ
วิธีแก้:
MongoDB (hot data)
S3 (cold data)
ใช้ TTL
```

```
## 📦 Project Structure
├── 📄 README.md (สรุปภาพรวม)
├── 📊 architecture_diagram.png
├── 📊 event_flow_diagram.png
├── 📄 service_design.pdf
├── 📄 api_design.yaml (OpenAPI Spec)
└── 📄 challenges_solutions.pd
```

```
## 👥 Team Info
Course: ENGSE207
Week: 4
Feature: Team Chat
>>>>>>> 6f808b9 (add week4 chat system)

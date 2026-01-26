
# 🐛 Bug Report

## Bug ID: BUG-001
## Title: ชื่อติดต่อเกิน 50 ตัวอักษรทำให้เกิด Database Error

### 📋 รายละเอียด

**Severity:** High  
**Status:** Open  
**Found by:** สมศักดิ์ (Tester)  
**Date:** Day 2 of Sprint

### 🔄 Steps to Reproduce

1. เปิดหน้า Contact Manager
2. คลิก "เพิ่มรายชื่อ"
3. ใส่ชื่อที่ยาวเกิน 50 ตัวอักษร เช่น:
   "นายสมชาย รักเรียน มานะอุตสาหะ ขยันทำงาน รักความยุติธรรม ใจกว้าง"
4. คลิก "บันทึก"

### ❌ Actual Result

แสดง Error: "value too long for type character varying(50)"

### ✅ Expected Result

- ถ้าชื่อยาวเกิน 50 ตัวอักษร ควรแสดง validation error ที่เข้าใจง่าย
- เช่น "ชื่อต้องไม่เกิน 50 ตัวอักษร"
- ไม่ควรแสดง Database error ให้ user เห็น

### 🔍 Root Cause Analysis

1. **Database:** `name` column เป็น VARCHAR(50) - จำกัด 50 ตัวอักษร
2. **Backend:** ไม่ได้ validate ความยาวก่อน INSERT
3. **Frontend:** Input field ไม่ได้จำกัด maxlength

### 💡 Suggested Fix

#### Frontend (สมชาย):
```html
<input type="text" id="name" maxlength="50" required>
## Resolution

**Fixed by:** สมหญิง (Backend), สมชาย (Frontend)  
**Fix Date:** Day 3 of Sprint  
**Version:** 2.0

### Changes Made

#### Backend (contactController.js v2.0):
```javascript
const MAX_NAME_LENGTH = 50;

if (trimmedName.length > MAX_NAME_LENGTH) {
    return res.status(400).json({
        success: false,
        error: `ชื่อต้องไม่เกิน ${MAX_NAME_LENGTH} ตัวอักษร (ปัจจุบัน ${trimmedName.length} ตัวอักษร)`
    });
}
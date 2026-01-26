// ============================================
// Contact Routes
// Developer: สมหญิง (Backend Dev)
// ============================================

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET /api/contacts - ดูรายชื่อทั้งหมด
router.get('/contacts', contactController.getAllContacts);

// GET /api/contacts/:id - ดูรายชื่อตาม ID
router.get('/contacts/:id', contactController.getContactById);

// POST /api/contacts - เพิ่มรายชื่อใหม่ (แก้ไขตรงนี้)
router.post('/contacts', (req, res, next) => {
    // 1. ดึงค่า name ออกมาจากข้อมูลที่ส่งมา
    const { name } = req.body;

    // 2. แทรก Logic ตรวจสอบความยาว (Code ของคุณ)
    if (name && name.length > 50) {
        return res.status(400).json({
            success: false,
            error: 'ชื่อต้องไม่เกิน 50 ตัวอักษร'
        });
    }

    // 3. ถ้าผ่านการตรวจสอบ ให้ส่งต่อไปทำงานที่ Controller ตามปกติ
    return contactController.createContact(req, res, next);
});

// DELETE /api/contacts/:id - ลบรายชื่อ
router.delete('/contacts/:id', contactController.deleteContact);

module.exports = router;
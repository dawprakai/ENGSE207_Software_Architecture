// ============================================
// Contact Controller
// Developer: สมหญิง (Backend Dev)
// Version: 2.0 (Bug Fixed!)
// ============================================

const db = require('../database/db');

// ============================================
// Constants
// ============================================
const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 100;
const MAX_PHONE_LENGTH = 20;

class ContactController {
    
    // GET /api/contacts
    async getAllContacts(req, res, next) {
        try {
            const result = await db.query(
                'SELECT * FROM contacts ORDER BY created_at DESC'
            );
            
            res.json({
                success: true,
                data: result.rows,
                count: result.rows.length
            });
        } catch (error) {
            next(error);
        }
    }
    
    // GET /api/contacts/:id
    async getContactById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await db.query(
                'SELECT * FROM contacts WHERE id = $1',
                [id]
            );
            
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: `ไม่พบรายชื่อ #${id}`
                });
            }
            
            res.json({
                success: true,
                data: result.rows[0]
            });
        } catch (error) {
            next(error);
        }
    }
    
    // POST /api/contacts
    async createContact(req, res, next) {
        try {
            const { name, email, phone } = req.body;
            
            // ============================================
            // ✅ FIX: Validate ความยาวก่อน INSERT
            // ============================================
            
            // Validate name
            if (!name || name.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'กรุณาระบุชื่อ'
                });
            }
            
            const trimmedName = name.trim();
            
            // ✅ NEW: ตรวจสอบความยาว name
            if (trimmedName.length > MAX_NAME_LENGTH) {
                return res.status(400).json({
                    success: false,
                    error: `ชื่อต้องไม่เกิน ${MAX_NAME_LENGTH} ตัวอักษร (ปัจจุบัน ${trimmedName.length} ตัวอักษร)`
                });
            }
            
            // ✅ NEW: ตรวจสอบความยาว email
            if (email && email.length > MAX_EMAIL_LENGTH) {
                return res.status(400).json({
                    success: false,
                    error: `Email ต้องไม่เกิน ${MAX_EMAIL_LENGTH} ตัวอักษร`
                });
            }
            
            // ✅ NEW: ตรวจสอบความยาว phone
            if (phone && phone.length > MAX_PHONE_LENGTH) {
                return res.status(400).json({
                    success: false,
                    error: `เบอร์โทรต้องไม่เกิน ${MAX_PHONE_LENGTH} ตัวอักษร`
                });
            }
            
            const result = await db.query(
                `INSERT INTO contacts (name, email, phone) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [trimmedName, email, phone]
            );
            
            console.log(`✅ Created contact: ${trimmedName}`);
            
            res.status(201).json({
                success: true,
                data: result.rows[0],
                message: 'เพิ่มรายชื่อสำเร็จ'
            });
        } catch (error) {
            console.error('Error creating contact:', error.message);
            next(error);
        }
    }
    
    // DELETE /api/contacts/:id
    async deleteContact(req, res, next) {
        try {
            const { id } = req.params;
            
            const result = await db.query(
                'DELETE FROM contacts WHERE id = $1 RETURNING *',
                [id]
            );
            
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: `ไม่พบรายชื่อ #${id}`
                });
            }
            
            console.log(`🗑️ Deleted contact #${id}`);
            
            res.json({
                success: true,
                message: `ลบรายชื่อ #${id} สำเร็จ`
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ContactController();
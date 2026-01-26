
// ============================================
// Database Connection & Initialization
// Developer: สมหญิง (Backend Dev)
// ============================================

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'contactuser',
    password: process.env.DB_PASSWORD || 'contactpass',
    database: process.env.DB_NAME || 'contactdb',
});

async function initialize() {
    const client = await pool.connect();
    try {
        // สร้างตาราง (ถ้ายังไม่มี)
        await client.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                email VARCHAR(100),
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // ตรวจสอบว่ามีข้อมูลหรือยัง
        const result = await client.query('SELECT COUNT(*) FROM contacts');
        if (parseInt(result.rows[0].count) === 0) {
            // เพิ่มข้อมูลตัวอย่าง
            await client.query(`
                INSERT INTO contacts (name, email, phone) VALUES 
                    ('สมชาย ใจดี', 'somchai@email.com', '081-234-5678'),
                    ('สมหญิง รักเรียน', 'somying@email.com', '089-876-5432'),
                    ('John Doe', 'john@email.com', '02-123-4567')
            `);
        }
        
        console.log('✅ Database initialized');
    } finally {
        client.release();
    }
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    initialize
};

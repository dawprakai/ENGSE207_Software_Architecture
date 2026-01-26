// ============================================
// Contact Manager - Frontend JavaScript
// Developer: สมชาย (Frontend Dev)
// Version: 2.1 (Fixed & Cleaned)
// ============================================

const API_BASE = '/api';

// ============================================
// Constants
// ============================================
const MAX_NAME_LENGTH = 50;

// ============================================
// Load Contacts on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterContacts(e.target.value);
        });
    }
    
    // Character count functionality
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            updateCharCount(e.target);
        });
    }
});

// ============================================
// API Functions
// ============================================

async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE}/contacts`);
        const data = await response.json();
        
        // ตรวจสอบโครงสร้างข้อมูลที่ API ส่งกลับมา
        if (data.success) {
            renderContacts(data.data);
        } else {
            showStatus('ไม่สามารถโหลดข้อมูลได้', 'error');
        }
    } catch (error) {
        console.error('Error loading contacts:', error);
        showStatus('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    }
}

async function addContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // ✅ ตรวจสอบความยาวชื่อ (Validate) ก่อนส่งไปหา Server
    if (name.length > MAX_NAME_LENGTH) {
        showStatus(`ชื่อต้องไม่เกิน ${MAX_NAME_LENGTH} ตัวอักษร`, 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showStatus('เพิ่มรายชื่อสำเร็จ!', 'success');
            hideAddForm();
            loadContacts(); // โหลดรายชื่อใหม่
            
            // เคลียร์ค่าในฟอร์ม
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            
            // รีเซ็ตตัวนับตัวอักษร
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = `0/${MAX_NAME_LENGTH}`;
                charCount.style.color = '#666';
            }
        } else {
            showStatus(data.error || 'ไม่สามารถเพิ่มรายชื่อได้', 'error');
        }
    } catch (error) {
        console.error('Error adding contact:', error);
        showStatus('เกิดข้อผิดพลาด', 'error');
    }
}

async function deleteContact(id) {
    if (!confirm('ต้องการลบรายชื่อนี้?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/contacts/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showStatus('ลบรายชื่อสำเร็จ!', 'success');
            loadContacts();
        } else {
            showStatus('ไม่สามารถลบได้', 'error');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        showStatus('เกิดข้อผิดพลาด', 'error');
    }
}

// ============================================
// UI Functions
// ============================================

function renderContacts(contacts) {
    const listElement = document.getElementById('contactList');
    if (!listElement) return;
    
    if (!contacts || contacts.length === 0) {
        listElement.innerHTML = `
            <div class="no-results">
                <p>📭 ไม่มีรายชื่อติดต่อ</p>
            </div>
        `;
        return;
    }
    
    listElement.innerHTML = contacts.map(contact => `
        <div class="contact-card" data-name="${(contact.name || '').toLowerCase()}">
            <div class="contact-info">
                <h3>👤 ${escapeHtml(contact.name)}</h3>
                <p>
                    ${contact.email ? `<span>📧 ${escapeHtml(contact.email)}</span>` : ''}
                    ${contact.phone ? `<span>📱 ${escapeHtml(contact.phone)}</span>` : ''}
                </p>
            </div>
            <div class="contact-actions">
                <button class="btn btn-danger" onclick="deleteContact(${contact.id})">
                    🗑️ ลบ
                </button>
            </div>
        </div>
    `).join('');
}

function filterContacts(searchTerm) {
    const cards = document.querySelectorAll('.contact-card');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
        const name = card.dataset.name;
        if (name) {
            card.style.display = name.includes(term) ? 'flex' : 'none';
        }
    });
}

function showAddForm() {
    const form = document.getElementById('addForm');
    if (form) form.style.display = 'block';
}

function hideAddForm() {
    const form = document.getElementById('addForm');
    if (form) form.style.display = 'none';
}

function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    if (!statusEl) return;
    
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    
    setTimeout(() => {
        statusEl.className = 'status-message';
        statusEl.textContent = '';
    }, 3000);
}

function updateCharCount(input) {
    const charCount = document.getElementById('charCount');
    if (charCount) {
        const current = input.value.length;
        charCount.textContent = `${current}/${MAX_NAME_LENGTH}`;
        charCount.style.color = current > MAX_NAME_LENGTH ? '#dc3545' : '#666';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
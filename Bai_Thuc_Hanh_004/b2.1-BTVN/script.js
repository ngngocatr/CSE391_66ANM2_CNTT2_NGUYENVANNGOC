const form = document.getElementById('registerForm');

// --- HÀM TIỆN ÍCH ---
const showError = (id, message) => {
    const errorSpan = document.getElementById(`error-${id}`);
    const inputField = document.getElementById(id);
    if (errorSpan) errorSpan.innerText = message;
    if (inputField) inputField.classList.add('invalid');
};

const clearError = (id) => {
    const errorSpan = document.getElementById(`error-${id}`);
    const inputField = document.getElementById(id);
    if (errorSpan) errorSpan.innerText = '';
    if (inputField) inputField.classList.remove('invalid');
};

// --- CÁC HÀM VALIDATE RIÊNG BIỆT ---
const validateFullname = () => {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]{3,}$/; // Chữ cái, khoảng trắng, >= 3 ký tự
    if (val === "") { showError('fullname', 'Họ tên không được để trống'); return false; }
    if (!regex.test(val)) { showError('fullname', 'Họ tên ít nhất 3 ký tự và chỉ chứa chữ cái'); return false; }
    clearError('fullname'); return true;
};

const validateEmail = () => {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) { showError('email', 'Email không đúng định dạng'); return false; }
    clearError('email'); return true;
};

const validatePhone = () => {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0\d{9}$/; // Bắt đầu bằng 0, tổng 10 số
    if (!regex.test(val)) { showError('phone', 'SĐT phải có 10 số và bắt đầu bằng số 0'); return false; }
    clearError('phone'); return true;
};

const validatePassword = () => {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(val)) { showError('password', 'Ít nhất 8 ký tự, gồm chữ hoa, thường và số'); return false; }
    clearError('password'); return true;
};

const validateConfirmPassword = () => {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm !== pass || confirm === "") { showError('confirmPassword', 'Mật khẩu xác nhận không khớp'); return false; }
    clearError('confirmPassword'); return true;
};

const validateGender = () => {
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) { showError('gender', 'Vui lòng chọn giới tính'); return false; }
    clearError('gender'); return true;
};

const validateTerms = () => {
    const checked = document.getElementById('terms').checked;
    if (!checked) { showError('terms', 'Bạn phải đồng ý với điều khoản'); return false; }
    clearError('terms'); return true;
};

// --- GẮN SỰ KIỆN BLUR & INPUT ---
const setupRealtime = (id, validateFunc) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.addEventListener('blur', validateFunc);
    element.addEventListener('input', () => clearError(id));
};

setupRealtime('fullname', validateFullname);
setupRealtime('email', validateEmail);
setupRealtime('phone', validatePhone);
setupRealtime('password', validatePassword);
setupRealtime('confirmPassword', validateConfirmPassword);
// Radio và Checkbox xử lý riêng với sự kiện change
document.querySelectorAll('input[name="gender"]').forEach(r => r.addEventListener('change', validateGender));
document.getElementById('terms').addEventListener('change', validateTerms);

// --- SUBMIT FORM ---
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Dùng toán tử bit & để tất cả các hàm đều được chạy (không dừng sớm)
    const isFullnameValid = validateFullname();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPassValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isGenderValid = validateGender();
    const isTermsValid = validateTerms();

    if (isFullnameValid && isEmailValid && isPhoneValid && isPassValid && isConfirmValid && isGenderValid && isTermsValid) {
        const name = document.getElementById('fullname').value;
        document.getElementById('registrationContainer').style.display = 'none';
        const successDiv = document.getElementById('successMessage');
        successDiv.style.display = 'block';
        successDiv.innerHTML = `<h3>Đăng ký thành công! 🎉</h3><p>Chào mừng thành viên mới: <b>${name}</b></p>`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ĐẾM KÝ TỰ HỌ TÊN ---
    const fullnameInput = document.getElementById('fullname');
    fullnameInput.addEventListener('input', function() {
        const len = this.value.length;
        document.getElementById('nameCount').innerText = `${len}/50`;
    });

    // --- 2. ẨN/HIỆN MẬT KHẨU ---
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    toggleBtn.addEventListener('click', function() {
        // Chuyển đổi qua lại giữa 'password' và 'text'
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerText = type === 'password' ? '👁️' : '🙈';
    });

    // --- 3. KIỂM TRA ĐỘ MẠNH MẬT KHẨU ---
    passwordInput.addEventListener('input', function() {
        const val = this.value;
        const bar = document.getElementById('strengthBar');
        const text = document.getElementById('strengthText');
        
        // Xóa class cũ
        bar.className = '';
        
        if (val.length === 0) {
            text.innerText = '';
        } else if (val.length < 6) {
            bar.classList.add('weak');
            text.innerText = 'Yếu';
            text.style.color = 'red';
        } else if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) {
            bar.classList.add('strong');
            text.innerText = 'Mạnh';
            text.style.color = 'green';
        } else {
            bar.classList.add('medium');
            text.innerText = 'Trung bình';
            text.style.color = 'orange';
        }
    });
});
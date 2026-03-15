// Đảm bảo DOM được tải xong mới thực thi script
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Cấu hình dữ liệu giá sản phẩm
    const prices = { 
        "Laptop": 20000000, 
        "Phone": 10000000, 
        "Tablet": 5000000 
    };

    const form = document.getElementById('orderForm');

    // --- 2. CÁC HÀM BỔ TRỢ (Utility Functions) ---
    
    const showError = (id, msg) => {
        const errorSpan = document.getElementById(`error-${id}`);
        const inputField = document.getElementById(id);
        if (errorSpan) errorSpan.innerText = msg;
        // Thêm class để tô đỏ viền nếu là input/select/textarea
        if (inputField && inputField.tagName !== 'SPAN') {
            inputField.classList.add('invalid');
        }
    };

    const clearError = (id) => {
        const errorSpan = document.getElementById(`error-${id}`);
        const inputField = document.getElementById(id);
        if (errorSpan) errorSpan.innerText = '';
        if (inputField) inputField.classList.remove('invalid');
    };

    // --- 3. LOGIC TÍNH TỔNG TIỀN ---
    
    function calculateTotal() {
        const product = document.getElementById('product').value;
        const qty = parseInt(document.getElementById('quantity').value) || 0;
        const price = prices[product] || 0;
        const total = price * qty;
        
        // Hiển thị định dạng tiền Việt Nam (VD: 20.000.000)
        document.getElementById('totalPrice').innerText = total.toLocaleString('vi-VN');
        return total;
    }

    // Lắng nghe thay đổi trên select và input số lượng
    document.getElementById('product').addEventListener('change', () => {
        calculateTotal();
        clearError('product'); // Xóa lỗi khi người dùng đã chọn
    });
    
    document.getElementById('quantity').addEventListener('input', () => {
        calculateTotal();
        clearError('quantity');
    });

    // --- 4. ĐẾM KÝ TỰ REALTIME (Ghi chú) ---
    
    const noteInput = document.getElementById('note');
    noteInput.addEventListener('input', function() {
        const len = this.value.length;
        const countEl = document.getElementById('charCount');
        countEl.innerText = `${len}/200`;
        
        if (len > 200) {
            countEl.classList.add('over-limit');
            showError('note', 'Ghi chú vượt quá 200 ký tự');
        } else {
            countEl.classList.remove('over-limit');
            clearError('note');
        }
    });

    // --- 5. VALIDATE NGÀY GIAO HÀNG ---
    
    const validateDeliveryDate = () => {
        const dateVal = document.getElementById('deliveryDate').value;
        if (!dateVal) { 
            showError('deliveryDate', 'Vui lòng chọn ngày giao'); 
            return false; 
        }

        const selectedDate = new Date(dateVal).setHours(0,0,0,0);
        const today = new Date().setHours(0,0,0,0);
        
        const maxDate = new Date();
        maxDate.setDate(new Date().getDate() + 30);
        const maxDateTime = maxDate.setHours(0,0,0,0);

        if (selectedDate < today) {
            showError('deliveryDate', 'Ngày giao không được ở quá khứ');
            return false;
        }
        if (selectedDate > maxDateTime) {
            showError('deliveryDate', 'Ngày giao không được quá 30 ngày tính từ hôm nay');
            return false;
        }

        clearError('deliveryDate');
        return true;
    };

    // --- 6. XỬ LÝ SUBMIT FORM ---
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Thực hiện kiểm tra tất cả các trường
        const productVal = document.getElementById('product').value;
        const isProductValid = productVal !== "";
        if (!isProductValid) showError('product', 'Vui lòng chọn một sản phẩm');

        const isDateValid = validateDeliveryDate();

        const addressVal = document.getElementById('address').value.trim();
        const isAddressValid = addressVal.length >= 10;
        if (!isAddressValid) showError('address', 'Địa chỉ giao hàng phải có ít nhất 10 ký tự');
        else clearError('address');

        const paymentCheck = document.querySelector('input[name="payment"]:checked');
        const isPaymentValid = !!paymentCheck;
        if (!isPaymentValid) showError('payment', 'Vui lòng chọn phương thức thanh toán');
        else clearError('payment');

        const isNoteValid = noteInput.value.length <= 200;

        // Nếu tất cả hợp lệ -> Hiện Modal xác nhận
        if (isProductValid && isDateValid && isAddressValid && isPaymentValid && isNoteValid) {
            showSummary();
        }
    });

    // Hàm hiển thị tóm tắt đơn hàng
    function showSummary() {
        const product = document.getElementById('product').value;
        const qty = document.getElementById('quantity').value;
        const date = document.getElementById('deliveryDate').value;
        const total = calculateTotal().toLocaleString('vi-VN');

        const summaryHTML = `
            <p><b>Sản phẩm:</b> ${product}</p>
            <p><b>Số lượng:</b> ${qty}</p>
            <p><b>Tổng tiền:</b> <span style="color:red">${total}đ</span></p>
            <p><b>Ngày giao dự kiến:</b> ${date}</p>
        `;
        
        document.getElementById('summaryContent').innerHTML = summaryHTML;
        document.getElementById('confirmModal').style.display = 'flex';
    }

    // --- 7. SỰ KIỆN TRÊN MODAL ---
    
    // Nút xác nhận cuối cùng
    document.getElementById('btnFinalConfirm').onclick = () => {
        alert("Đặt hàng thành công! 🎉 Đơn hàng của bạn đang được xử lý.");
        // Reset lại trang sau khi thành công
        window.location.reload();
    };

    // Nút Hủy modal
    document.getElementById('btnCancel').onclick = () => {
        document.getElementById('confirmModal').style.display = 'none';
    };

    // Xóa lỗi realtime khi người dùng nhập liệu lại (cho địa chỉ)
    document.getElementById('address').addEventListener('input', () => {
        if (document.getElementById('address').value.trim().length >= 10) {
            clearError('address');
        }
    });

    // Xóa lỗi khi chọn phương thức thanh toán
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', () => clearError('payment'));
    });
});
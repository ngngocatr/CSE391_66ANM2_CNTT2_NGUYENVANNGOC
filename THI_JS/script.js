// ====== CONSTANTS & STATE ======
const STORAGE_KEY = 'hotelBookings';
const ROOM_PRICES = {
    'Standard': 500000,
    'Deluxe': 1000000,
    'Suite': 2000000,
    'VIP': 5000000
};

// Khởi tạo/Lấy dữ liệu từ LocalStorage
let bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Nếu chưa có dữ liệu thì tạo data mẫu sẵn
if (bookings.length === 0) {
    bookings = [
        {
            id: 'PH000001',
            name: 'Nguyễn Văn A',
            phone: '0912345678',
            roomType: 'Standard',
            checkIn: '2026-04-01',
            checkOut: '2026-04-03',
            adults: 2,
            children: 1,
            promo: '',
            status: 'Booked',
            createdAt: new Date().toISOString()
        },
        {
            id: 'PH000002',
            name: 'Trần Thị B',
            phone: '0987654321',
            roomType: 'Deluxe',
            checkIn: '2026-04-05',
            checkOut: '2026-04-09',
            adults: 2,
            children: 0,
            promo: 'SAVE20%',
            status: 'Booked',
            createdAt: new Date().toISOString()
        },
        {
            id: 'PH000003',
            name: 'Lê Văn C',
            phone: '0901122334',
            roomType: 'Suite',
            checkIn: '2026-04-10',
            checkOut: '2026-04-12',
            adults: 3,
            children: 2,
            promo: '',
            status: 'Cancelled',
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// ====== TOAST NOTIFICATION SYSTEM ======
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    // Tự động xóa sau 3s
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ====== PAGE: QUẢN LÝ ĐẶT PHÒNG (bookings.html) ======
if (document.getElementById('bookingTable')) {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');

    // Hàm Render dữ liệu
    function renderTable(data = bookings) {
        tableBody.innerHTML = '';
        data.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${b.id}</td>
                <td>${b.name}</td>
                <td>${b.phone}</td>
                <td>${b.roomType}</td>
                <td>${b.checkIn}</td>
                <td>${b.checkOut}</td>
                <td>${b.adults}/${b.children}</td>
                <td>${b.promo || ''}</td>
                <td><span class="badge ${b.status === 'Booked' ? 'badge-booked' : 'badge-cancelled'}">${b.status}</span></td>
                <td>
                    ${b.status === 'Booked' ? `<button class="btn btn-primary btn-sm" onclick="editBooking('${b.id}')">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')">Hủy</button>` : `<span class="badge badge-cancelled">Đã hủy</span>`}
                </td>
            `;
            tableBody.appendChild(tr);
        });
        updateStats();
    }

    // Cập nhật Thống kê
    function updateStats() {
        const total = bookings.length;
        const activeBookings = bookings.filter(b => b.status === 'Booked').length;
        const emptyRooms = Math.max(0, 100 - activeBookings); // Giả sử KS có 100 phòng
        
        let revenue = 0;
        bookings.filter(b => b.status === 'Booked').forEach(b => {
            const inDate = new Date(b.checkIn);
            const outDate = new Date(b.checkOut);
            const diffDays = Math.ceil(Math.abs(outDate - inDate) / (1000 * 60 * 60 * 24));
            const dailyPrice = ROOM_PRICES[b.roomType] || 0;
            revenue += (dailyPrice * diffDays);
        });

        document.getElementById('statTotal').innerText = total;
        document.getElementById('statEmpty').innerText = emptyRooms;
        document.getElementById('statRevenue').innerText = revenue.toLocaleString('vi-VN');
    }

    // Xóa/Hủy
    window.cancelBooking = function(id) {
        if (confirm(`Bạn có chắc muốn hủy booking ${id}?`)) {
            const idx = bookings.findIndex(b => b.id === id);
            if (idx > -1) {
                bookings[idx].status = 'Cancelled';
                localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
                showToast('Hủy đặt phòng thành công!', 'success');
                renderTable();
            }
        }
    };

    // Sửa (Chuyển trang kèm param)
    window.editBooking = function(id) {
        window.location.href = `add-booking.html?id=${id}`;
    };

    // Tìm kiếm
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = bookings.filter(b => 
            b.id.toLowerCase().includes(keyword) || 
            b.name.toLowerCase().includes(keyword)
        );
        renderTable(filtered);
    });

    // Load lại list
    document.getElementById('btnReload')?.addEventListener('click', () => {
        searchInput.value = '';
        renderTable(bookings);
    });

    renderTable();
}

// ====== PAGE: THÊM / CẬP NHẬT ĐẶT PHÒNG (add-booking.html) ======
if (document.getElementById('bookingForm')) {
    const form = document.getElementById('bookingForm');
    
    // Kiểm tra xem có đang ở chế độ Edit không (check URL params)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');
    let isEditMode = false;

    if (editId) {
        const existingBooking = bookings.find(b => b.id === editId);
        if (existingBooking) {
            isEditMode = true;
            document.getElementById('formTitle').innerText = `Cập nhật đặt phòng: ${editId}`;
            
            // Đổ dữ liệu vào form
            document.getElementById('bookingId').value = existingBooking.id;
            document.getElementById('bookingId').readOnly = true; // Khóa mã ID khi sửa
            document.getElementById('customerName').value = existingBooking.name;
            document.getElementById('phone').value = existingBooking.phone;
            document.getElementById('roomType').value = existingBooking.roomType;
            document.getElementById('checkIn').value = existingBooking.checkIn;
            document.getElementById('checkOut').value = existingBooking.checkOut;
            document.getElementById('adults').value = existingBooking.adults;
            document.getElementById('children').value = existingBooking.children;
            document.getElementById('promoCode').value = existingBooking.promo;
            document.getElementById('confirmPromo').value = existingBooking.promo;
        }
    }

    function validateBookingField(id) {
        const value = document.getElementById(id).value.trim();
        const checkInVal = document.getElementById('checkIn').value;
        const checkOutVal = document.getElementById('checkOut').value;

        const idRegex = /^PH\d{6}$/;
        const nameRegex = /^[\p{L}0-9\s]{2,50}$/u;
        const phoneRegex = /^0\d{9}$/;

        switch (id) {
            case 'bookingId':
                if (!idRegex.test(value)) return 'Mã đặt phòng phải là PH + 6 chữ số (VD: PH123456)';
                if (!isEditMode && bookings.some(b => b.id === value)) return 'Mã đặt phòng này đã tồn tại!';
                return '';
            case 'customerName':
                if (!nameRegex.test(value)) return 'Họ tên chỉ chứa 2-50 ký tự (chữ, số, khoảng trắng)';
                return '';
            case 'phone':
                if (!phoneRegex.test(value)) return 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
                return '';
            case 'roomType':
                if (!value) return 'Vui lòng chọn loại phòng';
                return '';
            case 'checkIn':
                if (!value) return 'Vui lòng chọn ngày Check-in';
                if (checkOutVal && new Date(checkOutVal) <= new Date(value)) return 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày';
                return '';
            case 'checkOut':
                if (!value) return 'Vui lòng chọn ngày Check-out';
                if (!checkInVal) return 'Vui lòng chọn ngày Check-in trước';
                if (new Date(value) <= new Date(checkInVal)) return 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày';
                const diffDays = Math.ceil(Math.abs(new Date(value) - new Date(checkInVal)) / (1000 * 60 * 60 * 24));
                if (diffDays > 30) return 'Không được đặt phòng quá 30 ngày';
                return '';
            case 'adults':
                const adults = parseInt(value);
                if (isNaN(adults) || adults < 1 || adults > 4) return 'Số người lớn phải từ 1 đến 4';
                return '';
            case 'children':
                const children = parseInt(value);
                if (isNaN(children) || children < 0 || children > 6) return 'Số trẻ em phải từ 0 đến 6';
                return '';
            case 'promoCode':
                if (!value) return '';
                if (value !== 'SAVE20%' || value.length !== 7) return 'Mã khuyến mãi phải là 8 ký tự với format SAVE20%';
                if (document.getElementById('confirmPromo').value.trim() && value !== document.getElementById('confirmPromo').value.trim()) return 'Mã khuyến mãi và xác nhận không khớp';
                return '';
            case 'confirmPromo':
                if (!value) return '';
                const promo = document.getElementById('promoCode').value.trim();
                if (promo && value !== promo) return 'Xác nhận mã khuyến mãi không khớp';
                return '';
            default:
                return '';
        }
    }

    function handleBlurEvent(event) {
        const field = event.target;
        const error = validateBookingField(field.id);
        if (error) {
            field.classList.add('invalid');
            showToast(error, 'error');
        } else {
            field.classList.remove('invalid');
        }
    }

    ['bookingId','customerName','phone','roomType','checkIn','checkOut','adults','children','promoCode','confirmPromo'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) el.addEventListener('blur', handleBlurEvent);
    });

    // Xử lý Validation và Submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const id = document.getElementById('bookingId').value.trim();
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const roomType = document.getElementById('roomType').value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const adults = parseInt(document.getElementById('adults').value);
        const children = parseInt(document.getElementById('children').value);
        const promo = document.getElementById('promoCode').value.trim();
        const confirmPromo = document.getElementById('confirmPromo').value.trim();

        // 1. Validate Form (Regex & Logic)
        const idRegex = /^PH\d{6}$/;
        const nameRegex = /^[\p{L}0-9\s]{2,50}$/u; // \p{L} cho phép tiếng Việt
        const phoneRegex = /^0\d{9}$/;

        if (!idRegex.test(id)) return showError('Mã đặt phòng phải là PH + 6 chữ số (VD: PH123456)');
        if (!isEditMode && bookings.some(b => b.id === id)) return showError('Mã đặt phòng này đã tồn tại!');
        if (!nameRegex.test(name)) return showError('Họ tên chỉ chứa 2-50 ký tự (chữ, số, khoảng trắng)');
        if (!phoneRegex.test(phone)) return showError('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0');
        if (!roomType) return showError('Vui lòng chọn loại phòng');
        
        // Date Logic
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        
        if (!checkIn) return showError('Vui lòng chọn ngày Check-in');
        if (outDate <= inDate) return showError('Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày');
        
        const diffDays = Math.ceil(Math.abs(outDate - inDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 30) return showError('Không được đặt phòng quá 30 ngày');

        if (adults < 1 || adults > 4) return showError('Số người lớn phải từ 1 đến 4');
        if (children < 0 || children > 6) return showError('Số trẻ em phải từ 0 đến 6');
        
        // Promo logic
        if (promo) {
            // Dùng Regex để cho phép SAVE + 2 chữ số bất kỳ + % (VD: SAVE20%, SAVE50%)
            const promoRegex = /^SAVE\d{2}%$/; 
            if (!promoRegex.test(promo)) {
                return showError('Mã khuyến mãi phải có format SAVE + 2 số + % (VD: SAVE20%, SAVE50%)');
            }
            if (promo !== confirmPromo) return showError('Xác nhận mã khuyến mãi không khớp');
        }

        // 2. Tạo hoặc Cập nhật Object
        const bookingData = {
            id, name, phone, roomType, checkIn, checkOut, 
            adults, children, promo,
            status: isEditMode ? bookings.find(b => b.id === id).status : 'Booked',
            createdAt: isEditMode ? bookings.find(b => b.id === id).createdAt : new Date().toISOString()
        };

        if (isEditMode) {
            const index = bookings.findIndex(b => b.id === id);
            bookings[index] = bookingData;
            showToast('Cập nhật đặt phòng thành công!', 'success');
        } else {
            bookings.push(bookingData);
            showToast(`Đặt phòng ${id} thành công!`, 'success');
        }

        // Lưu Local Storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

        // Chuyển hướng sau 2s
        setTimeout(() => {
            window.location.href = 'bookings.html';
        }, 2000);
    });

    document.getElementById('btnReset')?.addEventListener('click', () => {
        if (!isEditMode) form.reset();
    });

    function showError(msg) {
        showToast("Vui lòng kiểm tra lại thông tin!\n" + msg, 'error');
        return false;
    }
}
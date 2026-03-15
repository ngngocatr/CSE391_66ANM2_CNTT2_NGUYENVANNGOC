// 1. Khởi tạo mảng lưu trữ
let students = [];
let sortDirection = 0; // 0: mặc định, 1: tăng dần, -1: giảm dần

const txtName = document.getElementById('txtName');
const txtScore = document.getElementById('txtScore');
const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('studentTableBody');

// DOM Elements cho bộ lọc
const searchInput = document.getElementById('searchName');
const rankSelect = document.getElementById('filterRank');
const sortScoreBtn = document.getElementById('sortScore');
const sortIcon = document.getElementById('sortIcon');

// 2. Hàm xếp loại
const getRank = (score) => {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
};

// 3. Hàm Render (Vẽ lại bảng)
// --- HÀM RENDER (Cập nhật để nhận mảng truyền vào) ---
function renderTable(dataToDisplay = students) {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';
    
    if (dataToDisplay.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-result">Không có kết quả phù hợp</td></tr>';
    } else {
        let totalScore = 0;
        dataToDisplay.forEach((sv, index) => {
            const rank = getRank(sv.score);
            const rowClass = sv.score < 5 ? 'low-score' : '';
            totalScore += sv.score;

            const row = `
                <tr class="${rowClass}">
                    <td>${index + 1}</td>
                    <td>${sv.name}</td>
                    <td>${sv.score.toFixed(1)}</td>
                    <td>${rank}</td>
                    <td><button class="btn-delete" data-index="${students.indexOf(sv)}">Xóa</button></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }
    
    // Cập nhật thống kê (Dựa trên mảng đang hiển thị)
    const count = dataToDisplay.length;
    document.getElementById('totalStudents').innerText = count;
    document.getElementById('avgScore').innerText = count > 0 
        ? (dataToDisplay.reduce((sum, sv) => sum + sv.score, 0) / count).toFixed(2) 
        : 0;
}

// Chỉnh sửa lại hàm Add và Delete từ bài 1.1 để gọi applyFilters()
function addStudent() {
    const name = document.getElementById('txtName').value.trim();
    const score = parseFloat(document.getElementById('txtScore').value);

    if (name === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Dữ liệu không hợp lệ!"); return;
    }

    students.push({ name, score });
    document.getElementById('txtName').value = '';
    document.getElementById('txtScore').value = '';
    document.getElementById('txtName').focus();

    applyFilters(); // Thay vì renderTable() trực tiếp
}

// Event Delegation cho nút xóa (Cập nhật để tìm đúng phần tử trong mảng gốc)
document.getElementById('studentTableBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const index = e.target.getAttribute('data-index');
        students.splice(index, 1);
        applyFilters(); 
    }
});

// 5. Sự kiện Click nút Thêm
btnAdd.addEventListener('click', addStudent);

// 6. Sự kiện nhấn Enter tại ô Điểm
txtScore.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addStudent();
});

// 7. Event Delegation cho nút Xóa
tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const index = e.target.getAttribute('data-index');
        students.splice(index, 1); // Xóa khỏi mảng
        renderTable(); // Vẽ lại
    }
});

// --- HÀM TRUNG TÂM: LỌC, TÌM KIẾM & SẮP XẾP ---
function applyFilters() {
    let keyword = searchInput.value.toLowerCase();
    let selectedRank = rankSelect.value;

    // 1. Lọc (Filter) theo Tên và Xếp loại
    let filtered = students.filter(sv => {
        const matchesName = sv.name.toLowerCase().includes(keyword);
        const matchesRank = selectedRank === "All" || getRank(sv.score) === selectedRank;
        return matchesName && matchesRank;
    });

    // 2. Sắp xếp (Sort) theo Điểm
    if (sortDirection !== 0) {
        filtered.sort((a, b) => {
            return sortDirection === 1 ? a.score - b.score : b.score - a.score;
        });
    }

    renderTable(filtered);
}

// Tìm kiếm Real-time
searchInput.addEventListener('input', applyFilters);

// Lọc theo Xếp loại
rankSelect.addEventListener('change', applyFilters);

// Sắp xếp theo Điểm
sortScoreBtn.addEventListener('click', () => {
    // Luân chuyển: 0 (không) -> 1 (tăng) -> -1 (giảm) -> 0
    if (sortDirection === 0) sortDirection = 1;
    else if (sortDirection === 1) sortDirection = -1;
    else sortDirection = 0;

    // Cập nhật icon
    sortIcon.innerText = sortDirection === 1 ? '▲' : (sortDirection === -1 ? '▼' : '↕');
    
    applyFilters();
});

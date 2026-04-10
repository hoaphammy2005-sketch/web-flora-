import { db } from "./firebase-config.js"; // Đảm bảo file này chứa cấu hình firebase của bạn
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const orderList = document.getElementById("order-list-admin");
const revenueDisplay = document.getElementById("total-revenue");

// Lấy dữ liệu thời gian thực
onSnapshot(collection(db, "orders"), (snapshot) => {
    let html = "";
    let total = 0;

    snapshot.forEach((doc) => {
        const order = doc.data();
        const orderId = doc.id;
        
        // Chuyển giá tiền sang số để tính toán (Bỏ dấu chấm, dấu đ nếu có)
        const price = Number(order.giaTien) || 0;

        // Chỉ tính doanh thu cho đơn "Đã giao"
        if (order.trangThai === "Đã giao") {
            total += price;
        }

        html += `
            <tr>
                <td>${order.tenKhach}<br><small>${order.soDienThoai}</small></td>
                <td>${order.sanPham}</td>
                <td>${price.toLocaleString()}đ</td>
                <td>
                    <select class="form-select form-select-sm" onchange="changeStatus('${orderId}', this.value)">
                        <option value="Chờ xử lý" ${order.trangThai === 'Chờ xử lý' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="Đang giao" ${order.trangThai === 'Đang giao' ? 'selected' : ''}>Đang giao</option>
                        <option value="Đã giao" ${order.trangThai === 'Đã giao' ? 'selected' : ''}>Đã giao</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteOrder('${orderId}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    orderList.innerHTML = html;
    revenueDisplay.innerText = total.toLocaleString() + "đ";
});

// Hàm cập nhật trạng thái
window.changeStatus = async (id, status) => {
    try {
        await updateDoc(doc(db, "orders", id), { trangThai: status });
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
    }
};

// Hàm xóa đơn hàng
window.deleteOrder = async (id) => {
    if (confirm("Bạn có chắc muốn xóa đơn này?")) {
        await deleteDoc(doc(db, "orders", id));
    }
};
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js ";

const inpEmail = document.querySelector("#email");
const inpPwd = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");

// Định nghĩa Email Admin của bạn ở đây
const ADMIN_EMAIL = "admin@flora.com"; 

const handleLogin = function(event) {
    event.preventDefault();

    let email = inpEmail.value;
    let password = inpPwd.value;

    if (!email || !password){
        alert("Vui lòng điền đầy đủ các trường dữ liệu");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user = userCredential.user;

        const userSession = {
            user: {
                email: user.email
            },
            expiry: new Date().getTime() + 2*60*60*1000 
        };

        // Lưu session chung cho người dùng
        localStorage.setItem('user_session', JSON.stringify(userSession));

        // --- BẮT ĐẦU LOGIC KIỂM TRA ADMIN ---
        if (user.email === ADMIN_EMAIL) {
            // Nếu là Admin: Lưu quyền admin và chuyển hướng đến trang quản trị
            localStorage.setItem('isAdmin', 'true');
            alert("Chào sếp! Đang chuyển hướng đến trang quản trị...");
            window.location.href = 'admin.html';
        } else {
            // Nếu là khách hàng bình thường: Xóa quyền admin (để tránh dùng lại session cũ) và về trang chủ
            localStorage.removeItem('isAdmin');
            alert("Đăng nhập thành công!");
            window.location.href = 'index.html';
        }
        // --- KẾT THÚC LOGIC KIỂM TRA ADMIN ---

    })
    .catch(e =>{
        // Việt hóa một số lỗi phổ biến cho chuyên nghiệp
        if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
            alert("Email hoặc mật khẩu không chính xác!");
        } else {
            alert("Lỗi: " + e.message);
        }
    });
}

loginForm.addEventListener('submit', handleLogin);
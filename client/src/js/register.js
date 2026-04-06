import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";


const inpUsername = document.querySelector("#username");
const inpEmail = document.querySelector("#email");
const inpPwd = document.querySelector("#password");
const inpConfirmPwd = document.querySelector("#confirm-password");
const registerForm = document.querySelector("#register-form");

const handleRegister = function (event) {
    event.preventDefault();
    let username = inpUsername.value;
    let email = inpEmail.value;
    let password = inpPwd.value;
    let confirmPassword = inpConfirmPwd.value;
    let role_id = 2;

    if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ tất cả các trường dữ liệu");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu không khớp!!!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            const userData = {
                username,
                email,
                role_id,
                balance: 0,
                createdAt: new Date()
            }

            return addDoc(collection(db, 'user'), userData);

        })
        .then(() => {
            alert("Đăng kí thành công");
            window.location.href = "login.html";
        })
        .catch((e) => {
            console.error(e);
            alert("Lỗi: " + e.message)
        })


}


    registerForm.addEventListener('submit', handleRegister);
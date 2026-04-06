import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js ";

const inpEmail = document.querySelector("#email");
const inpPwd = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");

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
            expiry: new Date().getTime() +2*60*60*1000 //phiên đăng nhập 2 giờ sau
        };

        localStorage.setItem('user_session', JSON.stringify(userSession));
        alert("Đăng nhập thành công!");
        window.location.href = 'index.html';

    })
    .catch(e =>{
        alert("Lỗi: "+e.message);

    });
}

loginForm.addEventListener('submit', handleLogin);

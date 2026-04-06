import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const userSession = JSON.parse(localStorage.getItem('user_session'));

//Xử lý profile dropdown
document.addEventListener('DOMContentLoaded', () => {
    const profileDropdown = document.querySelector("#author-menu-drd");

    if (userSession) {
        const now = new Date().getTime();

    if(now < userSession.expiry){
        // Cập nhật dropdown khi người dùng đăng nhập 
        profileDropdown.innerHTML = `
        <li class="bg-grey-light"> <span class="dropdown-item">${userSession.user.email}</span></li>
        <li><a href="#" class="dropdown-item">Lịch sử đơn hàng</a></li>
        <li><a href="#" class="dropdown-item">Ví</a></li>
        <li> <button id="logout-btn" class="btn text-danger w-100 text-start"> Đăng xuất</button></li>

        `;

        //Xử lý đăng xuất
        document.getElementById("logout-btn").addEventListener("click", ()=>{
            if(confirm("Bạn có chắc chắn muốn đăng xuất?")){
                signOut(auth)
                .then(()=>{
                    localStorage.removeItem('user_session');
                    window.location.href = "./index.html";
                })
                .catch(err =>{
                    console.error("Lỗi đăng xuất: ", err);
                    alert("Có lỗi xảy ra khi đăng xuất");
                })
            }
        })

    }else{
        localStorage.removeItem('user_session');
        console.log('Phiên đăng nhập đã hết hạn');
    }


    } else {
        //Xóa session nếu hết hạn
        profileDropdown.innerHTML = `
         <li><a class="dropdown-item" href="./register.html">Đăng Kí</a></li>
        <li><a class="dropdown-item" href="./login.html">Đăng Nhập</a></li>
        `;
    }

});
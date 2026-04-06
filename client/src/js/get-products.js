import { db } from './firebase-config.js';
import { checkSession } from "./check_session.js";
import { collection, query, orderBy, getDocs, limit, getDoc, doc, addDoc, updateDoc, where } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

export const getProductList = async (limitCount, container) => {
    let htmls = "";
    try {
       const q = query(collection(db, 'products'), orderBy("createdAt", "desc"), limit(limitCount));
        const querySnapshot = await getDocs(q);

        console.log("Dữ liệu từ Firebase trả về:", querySnapshot.docs.map(doc => doc.data()));
        // console.log(querySnapshot);
        querySnapshot.forEach(doc => {
            // console.log(doc.id, doc.data());
            const product = doc.data();
            const productId = doc.id;

            const FormattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

            htmls += `
             <div class="product-item col-md-3 col-6" >
                    <div class="content p-2">
                        <img src="${product.ImageUrl}" alt="${product.name}" class="img-fluid rounded">
                            <div class="text p-2">
                                <div class="d-flex justify-content-between flex-column align-items-center">
                                    <h5 class="mb-2 text-uppercase">${product.name}</h5>
                                    <p class="mb-3">Giá: <span class="fs-6 fw-semibold text-danger">${FormattedPrice}</span></p>
                                </div>
                                <button type="button" class="btn btn-primary mt-2 w-100 btn-order" data-id="${productId}">Đặt hàng</button>
                            </div>
                    </div>
           </div>
           `;
        });

        container.innerHTML = htmls;

        //Thêm sự kiện cho các nút đặt hàng
        let btnOrder = document.querySelectorAll('.btn-order');
        btnOrder.forEach(btn => {
            btn.addEventListener('click', function () {
                const productId = this.getAttribute('data-id');
                checkSession();
                showOrderForm(productId);
            })
        })


    }
    catch (error) {
        console.error("Lỗi khi lấy sản phẩm: ", error);
    }
}

//Hiển thị form đặt hàng
const showOrderForm = async (productId) => {
    let orderForm = document.querySelector(".order-form");
    orderForm.style.display = 'block';

    try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const product = docSnap.data();
            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

            orderForm.innerHTML = `
            <div class="p-3 bg-light rounded shadow content">
                    <button type="button" class="btn btn-outline-dark btn-cancel md-3">Đóng</button>

                    <div class="row">
                        <div class="col-md-4 col-12">
                            <img src="${product.ImageUrl}"
                                alt="${product.name}" class="img-fluid rounded">
                        </div>
                        <div class="col-md-8 col-12">
                            <h5>${product.name}</h5>
                            <p>Giá: ${formattedPrice}</p>
                            <form id="order-form">
                                <div class="mb-3">
                                    <label for="" class="form-label">Số lượng: </label>
                                    <input type="number" class="form-control" id="quantity" value="1" min="1" required>
                                </div>
                                
                                <button type="submit button" class="btn btn-primary btn-confirm-order w-100"
                                    data-price="${product.price}">Xác nhận</button>
                            </form>
                        </div>
                    </div>
             </div>
            `;

            //Sự kiện nút "Đóng"
            const btnCancel = orderForm.querySelector('.btn-cancel');
            btnCancel.addEventListener('click', () => {
                orderForm.innerHTML = '';
                orderForm.style.display = 'none';
            });

            //Sự kiện xác nhận đặt hàng 
            const btnConfirmOrder = orderForm.querySelector('.btn-confirm-order');
            btnConfirmOrder.addEventListener('click', function (e) {
                e.preventDefault();
                const quantity = document.getElementById('quantity').value;
                const productPrice = this.getAttribute('data-price');
                handleOrder(productId, quantity, productPrice);

            })

        } else {
            console.log("No such document!");
        }

    } catch (error) {
        console.log("Lỗi khi lấy thông tin sản phẩm: ", error)

    }

}


//Xử lý đơn hàng
const handleOrder = async (productId, quantity, productPrice) => {

    let userSession = JSON.parse(localStorage.getItem('user_session'));


    if (!userSession) {
        alert("Vui lòng đăng nhập để đặt hàng!");
        return;
    }

    let authorEmail = userSession.user.email.trim().toLowerCase();

    try {
        const q = query(collection(db, 'user'), where('email', '==', authorEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("Không tìm thấy người dùng");
            return;
        }

        for (const userDoc of querySnapshot.docs) {
            let author = userDoc.data();
            const totalCost = productPrice * quantity;

            if (author.balance < totalCost) {
                alert("Số dư ví không đủ");
                return;
            }

            const productDoc = await getDoc(doc(db, 'products', productId));
            const orderData = {
                author: authorEmail,
                product: productDoc.data(),
                quantity: parseInt(quantity),
                status: 0,
                createdAt: new Date()
            };

            await addDoc(collection(db, 'orders'), orderData);
            await updateDoc(userDoc.ref, {
                balance: author.balance - totalCost
            });

            alert("Đặt hàng thành công!");
            document.querySelector('.order-form').style.display = 'none';

        }


    } catch (error) {
        console.log("Lỗi khi đặt hàng hoặc cập nhật số dư: ", error);
    }

}
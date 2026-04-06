console.log("Kiểm tra: File index.js đã kết nối thành công!");

import { getProductList } from "./get-products.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM đã sẵn sàng!");
    const productContainer = document.querySelector('.product-list');
    console.log("Container tìm thấy:", productContainer);

    if(productContainer) {
        getProductList(20, productContainer);
    }
});
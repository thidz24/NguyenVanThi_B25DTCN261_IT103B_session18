let products = [];
let editingProductId = null;

// dom
const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productQuantity = document.getElementById("productQuantity");
const productDescription = document.getElementById("productDescription");
const productTableBody = document.getElementById("productTableBody");
const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");

// ptu thong ke
const totalProductsElem = document.getElementById("totalProducts");
const totalPriceElem = document.getElementById("totalPrice");
const totalQuantityElem = document.getElementById("totalQuantity");

// khoi tao
function init() {
    const data = localStorage.getItem("products_data");
    try {
        products = data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Lỗi parse JSON:", error);
        products = [];
    }
    renderData();
}

// render
function renderData(data = products) {
    productTableBody.innerHTML = '';
    
    if (data.length === 0) {
        productTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center">Danh sách trống (Empty State)</td></tr>`;
    } else {
        data.forEach((product, index) => {
            let tr = document.createElement("tr");
            
            // Highlight nếu số lượng < 10 (Yêu cầu 2.1.2)
            if (product.productQuantity < 10) {
                tr.style.color = "red";
                tr.style.fontWeight = "bold";
            }

            // Rút gọn mô tả (Ellipsis)
            const shortDesc = product.productDescription.length > 30 
                ? product.productDescription.substring(0, 27) + "..." 
                : product.productDescription;

            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${product.productName}</td>
                <td>${product.productCategory}</td>
                <td>${product.productPrice.toLocaleString("vi-VN")} VNĐ</td>
                <td>${product.productQuantity}</td>
                <td title="${product.productDescription}">${shortDesc}</td>
                <td>
                    <button onclick="updateProduct(${product.id})">✏️ Sửa</button>
                    <button onclick="deleteProduct(${product.id}, '${product.productName}')">🗑️ Xóa</button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });
    }
    updateStats();
}

// them ỏ cnh
productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // vld 211
    if (Number(productPrice.value) < 0 || Number(productQuantity.value) < 0) {
        alert("Giá và số lượng không được là số âm!");
        return;
    }

    if (editingProductId !== null) {
        // update
        let index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                productName: productName.value.trim(),
                productCategory: productCategory.value,
                productPrice: Number(productPrice.value),
                productQuantity: Number(productQuantity.value),
                productDescription: productDescription.value
            };
        }
        editingProductId = null;
        submitBtn.textContent = "➕ Thêm Sản Phẩm";
        formTitle.textContent = "Thêm Sản Phẩm Mới";
    } else {
        // them
        const newProduct = {
            id: Date.now(), // id td
            productName: productName.value.trim(),
            productCategory: productCategory.value,
            productPrice: Number(productPrice.value),
            productQuantity: Number(productQuantity.value),
            productDescription: productDescription.value
        };
        products.push(newProduct);
    }

    saveAndRefresh();
    productForm.reset();
});

// updat
function updateProduct(id) {
    const p = products.find(item => item.id === id);
    if (p) {
        editingProductId = id;
        productName.value = p.productName;
        productCategory.value = p.productCategory;
        productPrice.value = p.productPrice;
        productQuantity.value = p.productQuantity;
        productDescription.value = p.productDescription;

        submitBtn.textContent = "💾 Cập Nhật";
        formTitle.textContent = "Chỉnh Sửa Sản Phẩm";
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 213
        productName.focus();
    }
}

// Xóa 1 sản phẩm
function deleteProduct(id, name) {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm: ${name}?`)) {
        products = products.filter(p => p.id !== id);
        if (editingProductId === id) {
            productForm.reset();
            editingProductId = null;
            submitBtn.textContent = "➕ Thêm Sản Phẩm";
        }
        saveAndRefresh();
    }
}

// Xóa tất cả 
function deleteAll() {
    if (confirm("CẢNH BÁO: Hành động này không thể hoàn tác! Bạn có muốn xóa toàn bộ sản phẩm?")) {
        products = [];
        saveAndRefresh();
    }
}

// Tìm kiếm tgian
function searchProduct(keyword) {
    const key = keyword.toLowerCase();
    const filtered = products.filter(p => 
        p.productName.toLowerCase().includes(key) || 
        p.productDescription.toLowerCase().includes(key)
    );
    renderData(filtered);
}

// thống kê 
function updateStats() {
    const totalP = products.length;
    const totalQ = products.reduce((sum, p) => sum + p.productQuantity, 0);
    const totalV = products.reduce((sum, p) => sum + (p.productPrice * p.productQuantity), 0);

    if(totalProductsElem) totalProductsElem.textContent = totalP;
    if(totalQuantityElem) totalQuantityElem.textContent = totalQ;
    if(totalPriceElem) totalPriceElem.textContent = totalV.toLocaleString("vi-VN") + " VNĐ";
}

//lưu vào LocalStorage và Render lại
function saveAndRefresh() {
    localStorage.setItem("products_data", JSON.stringify(products));
    renderData();
}

//chạy init khi load trang
init();
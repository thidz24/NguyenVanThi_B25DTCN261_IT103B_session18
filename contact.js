let contacts = [];
let editingIndex = null;

const form = document.getElementById('contact-form');
const nameInput = document.getElementById('contact-name');
const phoneInput = document.getElementById('contact-phone');
const emailInput = document.getElementById('contact-email');
const tableBody = document.getElementById('contact-list');
const submitBtn = document.querySelector('.btn-add');

function renderTable() {
  tableBody.innerHTML = '';

  contacts.forEach((contact, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${contact.name}</td>
      <td>${contact.phone}</td>
      <td>${contact.email}</td>
      <td>
        <button onclick="editContact(${index})">Sửa</button>
        <button onclick="deleteContact(${index})">Xóa</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function validateContact(name, phone, email, isAdding = true) {
  if (!name) {
    alert('Họ tên không được để trống!');
    return false;
  }

  if (name.length < 2) {
    alert('Họ tên phải có ít nhất 2 ký tự!');
    return false;
  }

  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!nameRegex.test(name)) {
    alert('Họ tên không được chứa số hoặc ký tự đặc biệt!');
    return false;
  }

  if (!phone) {
    alert('Số điện thoại không được để trống!');
    return false;
  }

  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  if (!phoneRegex.test(phone)) {
    alert('Số điện thoại không hợp lệ!');
    return false;
  }
  if (!email) {
    alert('Email không được để trống!');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Email không hợp lệ!');
    return false;
  }

  if (isAdding) {
    const isExist = contacts.some(
      c => c.email.toLowerCase() === email.toLowerCase()
    );

    if (isExist) {
      alert('Email đã tồn tại!');
      return false;
    }
  }
  return true;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();

  const isAdding = editingIndex === null;

  if (!validateContact(name, phone, email, isAdding)) return;
  if (editingIndex === null) {
    contacts.push({ name, phone, email });
    alert('Thêm liên hệ thành công!');
  } else {
    contacts[editingIndex] = { name, phone, email };
    editingIndex = null;
    submitBtn.textContent = 'Thêm';
    alert('Cập nhật liên hệ thành công!');
  }

  form.reset();
  renderTable();
});
renderTable();
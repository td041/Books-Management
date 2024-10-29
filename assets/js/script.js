// Hàm hiển thị thông báo
const showAlert = (content = null, time = 3000) => {
  if (content) {
    const newAlert = document.createElement("div"); // Tạo một div thông báo mới
    newAlert.setAttribute("class", "alert alert--success"); // Đặt class cho thông báo

    // Đặt nội dung HTML cho thông báo
    newAlert.innerHTML = `
          <span class="alert__content">${content}</span>
          <span class="alert__close"><i class="fa-solid fa-xmark"></i></span>
      `;
    const alertList = document.querySelector(".alert-list"); // Lấy phần tử danh sách thông báo

    alertList.appendChild(newAlert); // Thêm thông báo mới vào danh sách
    const alertClose = newAlert.querySelector(".alert__close"); // Lấy nút đóng thông báo
    alertClose.addEventListener("click", () => {
      alertList.removeChild(newAlert); // Xóa thông báo khi nút đóng được nhấn
    });

    // Tự động xóa thông báo sau thời gian chỉ định
    setTimeout(() => {
      alertList.removeChild(newAlert);
    }, time);
  }
};
// GET data từ cơ sở dữ liệu để render
const drawBookList = (linkApi) => {
  axios.get(linkApi).then((res) => {
    const data = res.data;
    let htmls = "";
    data.forEach((item) => {
      htmls += `<tr item-id=${item.id}>
                  <td>${item.title}</td>
                  <td>${item.price.toLocaleString()}$</td>
                  <td>${item.author}</td>
                  <td>
                      <a href="edit.html?id=${item.id}" class="button-edit">Sửa</a>
                      <button class="button-delete" button-delete="${item.id}">Xóa</button>
                  </td>
              </tr>`;
    });

    bookList.innerHTML = htmls;
    // Gọi hàm cho chức năng xóa ở mỗi nút
    eventButtonDelete();
  });
};
const bookList = document.querySelector(".book-list");
if (bookList) {
  drawBookList("http://localhost:3000/books");
}
// POST dữ liệu
const formCreate = document.querySelector("#form-create");
if (formCreate) {
  formCreate.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = formCreate.title.value;
    const price = formCreate.price.value;
    const author = formCreate.author.value;
    if (!title) {
      showAlert("Vui lòng nhập lại tiêu đề! ", 3000, "alert--error");
      return;
    }
    if (!price) {
      showAlert("Vui lòng nhập lại giá! ", 3000, "alert--error");
      return;
    }
    if (!author) {
      showAlert("Vui lòng nhập lại tác giả! ", 3000, "alert--error");
      return;
    }
    const data = {
      title: title,
      price: parseInt(price),
      author: author,
    };
    axios.post("http://localhost:3000/books", data).then((res) => {
      showAlert("Tạo sách thành công!", 3000, "alert--success");
      formCreate.reset();
    });
  });
}
// PATCH dữ liệu
const formEdit = document.querySelector("#form-edit");
if (formEdit) {
  const params = new URL(window.location.href).searchParams;
  const id = params.get("id");
  axios.get(`http://localhost:3000/books/${id}`).then((res) => {
    formEdit.title.value = res.data.title;
    formEdit.price.value = res.data.price;
    formEdit.author.value = res.data.author;
    formEdit.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = formEdit.title.value;
      const price = formEdit.price.value;
      const author = formEdit.author.value;
      if (!title) {
        showAlert("Vui lòng nhập lại tiêu đề! ", 3000, "alert--error");
        return;
      }
      if (!price) {
        showAlert("Vui lòng nhập lại giá! ", 3000, "alert--error");
        return;
      }
      if (!author) {
        showAlert("Vui lòng nhập lại tác giả! ", 3000, "alert--error");
        return;
      }
      const data = {
        title: title,
        price: parseInt(price),
        author: author,
      };
      axios.patch(`http://localhost:3000/books/${id}`, data).then((res) => {
        showAlert("Chỉnh sửa thành công!", 5000, "alert--success");
      });
    });
  });
}
// DELETE dữ liệu
const eventButtonDelete = () => {
  const listDeleteButton = document.querySelectorAll("[button-delete]");
  listDeleteButton.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("button-delete");
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:3000/books/${id}`).then((res) => {
            // Biến này dùng để xóa sách trên giao diện ngay do khi xóa thì web không tự load lại
            const trDelete = document.querySelector(`tr[item-id="${id}"]`);
            if (trDelete) {
              trDelete.remove();
            }
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          });
        }
      });
    });
  });
};
// Chức năng tìm kiếm
const formSearch = document.querySelector(".form-search");
if (formSearch) {
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = formSearch.keyword.value;
    console.log(keyword);
    drawBookList(`http://localhost:3000/books?q=${keyword}`);
  });
}

const params = new URLSearchParams(window.location.search);
const selectedProduct = params.get("product");

if (selectedProduct) {
  document.querySelectorAll("form.order-form select[name='product']").forEach((select) => {
    if (select.closest(".modal")) {
      return;
    }
    select.value = selectedProduct;
  });
}

const orderModal = document.querySelector("#orderModal");
if (orderModal) {
  orderModal.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    const productId = trigger && trigger.getAttribute("data-product");
    const select = orderModal.querySelector("select[name='product']");
    if (!select || !productId) {
      return;
    }
    select.value = productId;
  });
}

document.querySelectorAll(".order-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = form.querySelector("[name='name']");
    const select = form.querySelector("[name='product']");
    const name = nameInput ? nameInput.value.trim() : "";
    let text = "Заявка принята. Мы перезвоним.";
    if (name && select && select.value) {
      const productName = select.options[select.selectedIndex].text;
      text = `Заявка принята: ${name}, фигурка «${productName}». Мы перезвоним. Что именно приедет, по-прежнему неизвестно.`;
    } else if (name) {
      text = `Заявка принята, ${name}. Мы перезвоним.`;
    }
    const modalElement = form.closest(".modal");
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
    }
    form.reset();
    if (selectedProduct && select && !modalElement) {
      select.value = selectedProduct;
    }
    const slot = document.querySelector("#orderToastText");
    const toastElement = document.querySelector("#orderToast");
    if (slot) {
      slot.textContent = text;
    }
    if (toastElement) {
      bootstrap.Toast.getOrCreateInstance(toastElement).show();
    }
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const catalogCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-filter");
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });
    let visibleCount = 0;
    catalogCards.forEach((card) => {
      const visible = category === "all" || card.getAttribute("data-category") === category;
      card.classList.toggle("d-none", !visible);
      if (visible) {
        visibleCount += 1;
      }
    });
    const empty = document.querySelector("#catalogEmpty");
    if (empty) {
      empty.classList.toggle("d-none", visibleCount !== 0);
    }
  });
});

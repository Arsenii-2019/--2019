// --- ДАННЫЕ И СОСТОЯНИЕ ---

// Товары (база данных)
const products = [
    { id: 1, title: 'Кроссовки Nike Air', desc: 'Стильные кроссовки для города и спорта. Дышащий материал.', price: 8990, oldPrice: 12000, img: 'https://via.placeholder.com/300x220?text=Nike+Shoes' },
    { id: 2, title: 'Футболка оверсайз', desc: 'Хлопковая футболка свободного кроя. Универсальный цвет.', price: 1990, oldPrice: 2500, img: 'https://via.placeholder.com/300x220?text=T-Shirt' },
    { id: 3, title: 'Часы Apple Watch', desc: 'Умные часы с мониторингом здоровья и тренировок.', price: 24990, oldPrice: 30000, img: 'https://via.placeholder.com/300x220?text=Apple+Watch' },
    { id: 4, title: 'Наушники Sony WH-1000XM4', desc: 'Шумоподавление, качественный звук, долгое время работы.', price: 22500, oldPrice: 28000, img: 'https://via.placeholder.com/300x220?text=Headphones' },
    { id: 5, title: 'Рюкзак городской', desc: 'Вместительный рюкзак из экокожи. Подходит для ноутбука.', price: 3490, oldPrice: 4200, img: 'https://via.placeholder.com/300x220?text=Backpack' },
    { id: 6, title: 'Смарт-браслет', desc: 'Фитнес-трекер: шаги, пульс, сон. Водонепроницаемость.', price: 2990, oldPrice: 3500, img: 'https://via.placeholder.com/300x220?text=Smart+Band' }
];

let cart = []; // Корзина
let currentUser = null; // Текущий пользователь

// --- ИНИЦИАЛИЗАЦИЯ ---

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    checkAuth();
    updateCartUI();
});

// --- КАТАЛОГ ТОВАРОВ ---

function renderProducts() {
    const container = document.getElementById('products-list');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="card-img-wrapper">
                <img src="${product.img}" alt="${product.title}" class="product-img">
                ${product.oldPrice ? `<span class="badge-discount">-${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>` : ''}
            </div>
            <div class="card-body">
                <h3 class="card-title">${product.title}</h3>
                <p class="card-desc">${product.desc}</p>
                <div class="price-row">
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                    <span class="current-price">${product.price} ₽</span>
                </div>
                <button class="add-btn" onclick="addToCart(${product.id})">В корзину</button>
            </div>
        </div>
    `).join('');
}

// --- КОРЗИНА ---

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    alert(`Товар "${product.title}" добавлен в корзину!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    renderCartItems();
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
            renderCartItems();
        }
    }
}

function saveCart() {
    localStorage.setItem('myShopCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('myShopCart');
    if (saved) cart = JSON.parse(saved);
}

function updateCartUI() {
    loadCart();
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    countEl.textContent = totalCount;
    totalEl.textContent = totalPrice;
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#777;">Корзина пуста</p>';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.title}">
            <div class="cart-info">
                <div>
                    <h4 style="margin:0; color:#333;">${item.title}</h4>
                    <p style="color:#999; font-size:14px;">${item.price} ₽ × ${item.quantity}</p>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <input type="number" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Удалить</button>
                </div>
            </div>
        </div>
    `).join('');

    // Обновляем итоговую сумму в модальном окне
    const finalTotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    document.getElementById('cart-final-total').textContent = finalTotal + ' ₽';
}

// --- МОДАЛЬНЫЕ ОКНА ---

function openAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

function openCart() {
    renderCartItems();
    document.getElementById('cart-modal').classList.add('active');
}

function closeCart() {
    document.getElementById('cart-modal').classList.remove('active');
}

// Переключение вкладок авторизации
function switchTab(tabName) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const title = document.getElementById('auth-title');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        title.textContent = 'Вход в аккаунт';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        title.textContent = 'Регистрация';
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// --- АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ ---

function checkAuth() {
    const user = localStorage.getItem('myShopUser');
    if (user) {
        currentUser = JSON.parse(user);
        showProfile(currentUser.name);
    } else {
        hideProfile();
    }
}

function showProfile(name) {
    document.getElementById('user-profile').style.display = 'flex';
    document.getElementById('username-display').textContent = name;
    document.getElementById('login-trigger').style.display = 'none';
    
    // Заполняем имя в форме заказа
    const orderNameInput = document.getElementById('order-name');
    if(orderNameInput) orderNameInput.value = name;
}

function hideProfile() {
    document.getElementById('user-profile').style.display = 'none';
    document.getElementById('login-trigger').style.display = 'block';
    currentUser = null;
}

// Обработка формы входа
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const errorEl = document.getElementById('login-error');

    const storedUser = localStorage.getItem(`user_${email}`);
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.password === password) {
            currentUser = { name: userData.name, email: userData.email };
            localStorage.setItem('myShopUser', JSON.stringify(currentUser));
            closeAuthModal();
            showProfile(userData.name);
            errorEl.textContent = '';
        } else {
            errorEl.textContent = 'Неверный пароль';
        }
    } else {
        errorEl.textContent = 'Пользователь не найден';
    }
});

// Обработка формы регистрации
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const errorEl = document.getElementById('register-error');

    if (localStorage.getItem(`user_${email}`)) {
        errorEl.textContent = 'Такой email уже зарегистрирован';
        return;
    }

    const newUser = { name, email, password };
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    
    currentUser = { name, email };
    localStorage.setItem('myShopUser', JSON.stringify(currentUser));
    closeAuthModal();
    showProfile(name);
    errorEl.textContent = '';
});

function logout() {
    localStorage.removeItem('myShopUser');
    hideProfile();
    closeAuthModal();
}

// --- ОФОРМЛЕНИЕ ЗАКАЗА ---

function handleOrder(e) {
    e.preventDefault();

    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт для оформления заказа!');
        openAuthModal();
        return;
    }

    const phone = document.querySelector('[name="phone"]').value;
    const address = document.querySelector('[name="address"]').value;

    if (!phone || !address) {
        alert('Заполните все поля формы!');
        return;
    }

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: cart,
        total: document.getElementById('cart-final-total').textContent,
        user: currentUser.name,
        phone,
        address
    };

    let orders = JSON.parse(localStorage.getItem('myShopOrders')) || [];
    orders.unshift(order); // Добавляем в начало
    localStorage.setItem('myShopOrders', JSON.stringify(orders));

    // Очищаем корзину
    cart = [];
    saveCart();
    updateCartUI();
    
    closeCart();
    alert('Заказ успешно оформлен! Спасибо за покупку.');
    renderOrdersHistory();
}

// --- ИСТОРИЯ ЗАКАЗОВ ---

function renderOrdersHistory() {
    const orders = JSON.parse(localStorage.getItem('myShopOrders')) || [];
    const container = document.getElementById('orders-history');

    if (orders.length === 0) {
        container.innerHTML = '<p style="color: #777;">Здесь пока нет ваших заказов.</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card" style="background:white; padding:20px; margin-bottom:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <span><strong>Заказ #${order.id}</strong></span>
                <span>${order.date}</span>
            </div>
            <div style="margin-bottom:15px;">
                <p><strong>Клиент:</strong> ${order.user}</p>
                <p><strong>Телефон:</strong> ${order.phone}</p>
                <p><strong>Адрес:</strong> ${order.address}</p>
            </div>
            <div style="border-top:1px solid #eee; padding-top:15px;">
                <h4>Состав заказа:</h4>
                ${order.items.map(i => `
                    <p style="margin:5px 0;">• ${i.title} × ${i.quantity} (${i.price} ₽)</p>
                `).join('')}
                <p style="font-weight:bold; margin-top:10px; font-size:18px;">Итого: ${order.total}</p>
            </div>
        </div>
    `).join('');
}

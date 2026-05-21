// ======================== ESTADO DA APLICAÇÃO ========================
const state = {
    employees: [
        { id: 1, name: 'João Silva', role: 'Garçom' },
        { id: 2, name: 'Maria Oliveira', role: 'Gerente' }
    ],
    menu: [
        { id: 1, name: 'Hambúrguer Artesanal', desc: 'Pão brioche, blend 180g, queijo cheddar, bacon e molho especial.', price: 35.90, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
        { id: 2, name: 'Pizza Margherita', desc: 'Massa de fermentação natural, molho de tomate pelati, mozzarella de búfala e manjericão.', price: 55.00, img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
        { id: 3, name: 'Salada Caesar', desc: 'Alface americana, frango grelhado, croutons, parmesão e molho caesar.', price: 28.50, img: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
        { id: 4, name: 'Petit Gâteau', desc: 'Bolo de chocolate com recheio cremoso e sorvete de baunilha.', price: 22.90, img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
    ],
    cart: []
};

// ======================== ELEMENTOS DO DOM ========================
const views = {
    login: document.getElementById('view-login'),
    admin: document.getElementById('view-admin'),
    customer: document.getElementById('view-customer')
};

// ======================== ROTEAMENTO SIMPLES ========================
function switchView(viewName) {
    Object.values(views).forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    
    views[viewName].classList.remove('hidden');
    views[viewName].classList.add('active');
}

// ======================== LOGIN ========================
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-user').value.toLowerCase();
    
    if (user === 'admin') {
        switchView('admin');
        renderEmployees();
    } else if (user === 'cliente') {
        switchView('customer');
        renderMenu();
    } else {
        alert('Usuário não reconhecido. Use "admin" ou "cliente".');
    }
});

// Logout
document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('login-form').reset();
        switchView('login');
    });
});

// ======================== ADMIN: FUNCIONÁRIOS ========================
function renderEmployees() {
    const list = document.getElementById('employee-list');
    list.innerHTML = '';
    
    state.employees.forEach(emp => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="emp-info">
                <strong>${emp.name}</strong>
                <span>${emp.role}</span>
            </div>
            <button class="btn-icon btn-remove" onclick="removeEmployee(${emp.id})">
                <i class="ph ph-trash"></i>
            </button>
        `;
        list.appendChild(li);
    });
}

document.getElementById('form-employee').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('emp-name');
    const roleInput = document.getElementById('emp-role');
    
    const newEmp = {
        id: Date.now(),
        name: nameInput.value,
        role: roleInput.value
    };
    
    state.employees.push(newEmp);
    renderEmployees();
    
    nameInput.value = '';
    roleInput.value = '';
});

window.removeEmployee = function(id) {
    state.employees = state.employees.filter(emp => emp.id !== id);
    renderEmployees();
};

// ======================== CLIENTE: CARDÁPIO E CARRINHO ========================
function renderMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';
    
    state.menu.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-card';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="menu-img">
            <div class="menu-content">
                <h4>${item.name}</h4>
                <p class="menu-desc">${item.desc}</p>
                <div class="menu-footer">
                    <span class="menu-price">R$ ${item.price.toFixed(2)}</span>
                    <button class="btn-add" onclick="addToCart(${item.id})">Pedir</button>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

window.addToCart = function(id) {
    const item = state.menu.find(m => m.id === id);
    if(item) {
        state.cart.push({...item, cartId: Date.now()});
        updateCartBadge();
        renderCart();
        
        // Efeito visual no botão de carrinho
        const btnCart = document.getElementById('btn-cart');
        btnCart.style.transform = 'scale(1.2)';
        setTimeout(() => btnCart.style.transform = 'scale(1)', 200);
    }
};

function updateCartBadge() {
    document.getElementById('cart-badge').innerText = state.cart.length;
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalValue = document.getElementById('cart-total-value');
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
        cartTotalValue.innerText = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    state.cart.forEach(item => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>R$ ${item.price.toFixed(2)}</span>
            </div>
            <button class="btn-icon btn-remove" onclick="removeFromCart(${item.cartId})">
                <i class="ph ph-trash"></i>
            </button>
        `;
        cartItems.appendChild(div);
    });
    
    cartTotalValue.innerText = total.toFixed(2);
}

window.removeFromCart = function(cartId) {
    state.cart = state.cart.filter(item => item.cartId !== cartId);
    updateCartBadge();
    renderCart();
};

// Controle do Modal do Carrinho
document.getElementById('btn-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.remove('hidden');
    renderCart();
});

document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.add('hidden');
});

document.getElementById('btn-checkout').addEventListener('click', () => {
    if (state.cart.length === 0) {
        alert('Adicione itens ao carrinho primeiro!');
        return;
    }
    alert('Pedido finalizado com sucesso! A cozinha já começou a preparar.');
    state.cart = [];
    updateCartBadge();
    renderCart();
    document.getElementById('cart-modal').classList.add('hidden');
});

var productList = document.getElementById("productList");

var cartList = document.getElementById("cartList");
var totalText = document.getElementById("total");
var itemCountText = document.getElementById("itemCount");
var cartError = document.getElementById("cartError");
var confirmBtn = document.getElementById("confirmBtn");
var clearBtn = document.getElementById("clearBtn");

var confirmBox = document.getElementById("confirmBox");
var orderForm = document.getElementById("orderForm");
var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");
var dateInput = document.getElementById("date");
var errorBox = document.getElementById("errorBox");
var result = document.getElementById("result");

var cart = [];
setMinDate(dateInput);

function findInCart(id) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            return i;
        }
    }
    return -1;
}

function getProduct(id) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            return products[i];
        }
    }
    return null;
}

function showProducts() {
    productList.innerHTML = "";
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        var position = findInCart(p.id);

        var cardClass = "card";
        var inCartText = "";
        var buttons = "<button onclick='changeQty(" + p.id + ", 1)'>Add to order</button>";

        if (position !== -1) {
            cardClass = "card selected";
            inCartText = "<p class='in-cart'>In your order: " + cart[position].qty + "</p>";
            buttons = "<button onclick='changeQty(" + p.id + ", 1)'>Add one more</button> " +
                      "<button class='danger' onclick='changeQty(" + p.id + ", -999)'>Remove</button>";
        }

        productList.innerHTML +=
            "<div class='" + cardClass + "'>" +
            "<img class='product-img' src='" + p.photo + "' alt='" + p.name + "'>" +
            "<span class='tag'>Made by our staff</span>" +
            "<h3>" + p.name + "</h3>" +
            "<p><strong>Used for:</strong> " + p.usedFor + "</p>" +
            "<p><strong>Ingredients:</strong> " + p.ingredients + "</p>" +
            "<p><strong>How to use:</strong> " + p.how + "</p>" +
            "<p class='price'>" + p.price + " ALL <span class='size'>/ " + p.size + "</span></p>" +
            inCartText +
            "<div class='btn-row'>" + buttons + "</div>" +
            "</div>";
    }
}

function changeQty(id, amount) {
    var position = findInCart(id);

    if (position === -1) {
        if (amount > 0) {
            cart.push({ id: id, qty: 1 });
        }
    } else {
        cart[position].qty = cart[position].qty + amount;
        if (cart[position].qty > 10) {
            cart[position].qty = 10;
        }
        if (cart[position].qty <= 0) {
            var newCart = [];
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].id !== id) {
                    newCart.push(cart[i]);
                }
            }
            cart = newCart;
        }
    }

    cartError.textContent = "";
    result.innerHTML = "";
    showProducts();
    showCart();
}

function showCart() {
    var total = 0;
    var items = 0;
    cartList.innerHTML = "";

    for (var i = 0; i < cart.length; i++) {
        var p = getProduct(cart[i].id);
        var lineTotal = p.price * cart[i].qty;
        total = total + lineTotal;
        items = items + cart[i].qty;

        cartList.innerHTML +=
            "<div class='sel-row'>" +
            "<span>" + p.name + "<br><small class='muted'>" + p.price + " x " + cart[i].qty + "</small></span>" +
            "<span class='qty-box'>" +
            "<button class='mini' onclick='changeQty(" + p.id + ", -1)'>−</button>" +
            "<button class='mini' onclick='changeQty(" + p.id + ", 1)'>+</button>" +
            "<strong>" + lineTotal + "</strong>" +
            "</span>" +
            "</div>";
    }

    if (cart.length === 0) {
        cartList.innerHTML = "<p class='muted'>Your order is empty.</p>";
        confirmBox.classList.add("hidden");
    }

    totalText.textContent = total;
    itemCountText.textContent = items;
}

clearBtn.addEventListener("click", function () {
    cart = [];
    cartError.textContent = "";
    result.innerHTML = "";
    showProducts();
    showCart();
});

confirmBtn.addEventListener("click", function () {
    result.innerHTML = "";

    if (cart.length === 0) {
        cartError.textContent = "Please add at least one product.";
        return;
    }

    cartError.textContent = "";
    errorBox.textContent = "";
    confirmBox.classList.remove("hidden");
    confirmBox.scrollIntoView();
});

orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    try {
        if (cart.length === 0) {
            throw new Error("Please add at least one product.");
        }

        checkName(nameInput.value.trim());
        checkEmail(emailInput.value.trim());
        checkPhone(phoneInput.value.trim());
        checkDate(dateInput.value);
        checkPharmacyDay(dateInput.value);

        var names = "";
        var total = 0;
        for (var i = 0; i < cart.length; i++) {
            var p = getProduct(cart[i].id);
            if (i > 0) {
                names = names + ", ";
            }
            names = names + p.name + " x" + cart[i].qty;
            total = total + p.price * cart[i].qty;
        }

        var list = getAppointments();
        var newOrder = {
            id: Date.now(),
            type: "Order",
            title: names,
            patient: nameInput.value.trim(),
            date: dateInput.value,
            time: "08:00",
            price: total,
            status: "Active"
        };
        list.push(newOrder);
        saveAppointments(list);

        var message = "<p>✅ Your order is confirmed. Total: <strong>" + total + " ALL</strong>.</p>";
        message = message + "<p>🛍️ Please pick it up at the hospital pharmacy on <strong>" + dateInput.value + "</strong>.</p>";
        message = message + "<p>🏥 Pharmacy hours:<br>" +
            "Monday - Friday: 08:00 - 20:00<br>" +
            "Saturday: 08:00 - 14:00<br>" +
            "Sunday: closed</p>";
        message = message + "<p>You can see or cancel your order in 'My appointments'.</p>";
        result.innerHTML = message;

        errorBox.textContent = "";
        orderForm.reset();
        confirmBox.classList.add("hidden");
        cart = [];
        showProducts();
        showCart();
        result.scrollIntoView();
    }
    catch (error) {
        errorBox.textContent = error.message;
        result.innerHTML = "";
    }
    finally {
        console.log("Check finished");
    }
});

showProducts();
showCart();
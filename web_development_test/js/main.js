$(document).ready(function () {

    var url = 'read.php';
    var addToCartUrl = 'add_to_cart.php';
    var readCartUrl = 'read_cart.php';
    var removeFromCartUrl = 'remove_from_cart.php';
    loginUrl = 'login.php';
    signupUrl = 'sign-up.php';


    //* FUNCTION THAT GETS AMOUNT OF ITEMS FROM CART -- RUN AT START
    upadateCartCount(readCartUrl);

    var productListLength = 0;
    var products = [];

    //* Function to update the products array
    function updateProducts(newProducts) {
        products = newProducts;
    }

    //* Function to update the productListLength
    function updateProductListLength(length) {
        productListLength = length;
    }

    //* CALL FUNCTION LOAD TABLE DATA FROM JSON FILE
    loadTable(url, updateProducts, updateProductListLength);
    console.log(products);

    //* DISPLAY PREVIEW OF IMAGE BEFORE ADDING
    $('#product-img').change(function (e) {
        var fileList = e.target.files;

        if (fileList.length > 0) {
            var file = fileList[0];

            var reader = new FileReader();

            reader.onload = function (e) {
                $('#preview').attr('src', e.target.result);
                $('#preview').show();
            }


            reader.readAsDataURL(file);
        }
    });

    //* HIDE IMAGE PREVIEW WHEN CLICKING ON IT
    $('#preview').click(function () {
        $('#preview').hide();
    });

    //* ADD PRODUCT
    $('#product-form').submit(function (event) {
        event.preventDefault();

        var form_data = new FormData();


        var productName = $("#product-name").val();
        var productDescription = $("#product-description").val();
        var productPrice = $("#product-price").val();
        var productImg = $('#product-img')[0].files[0];

        var newProducts = {
            'id': Number(productListLength + 1),
            'name': productName,
            'description': productDescription,
            'image': "",
            'price': parseInt(productPrice),
        };

        form_data.append('new_products', JSON.stringify(newProducts));
        form_data.append('file', productImg);

        var createUrl = 'create.php';

        $.ajax({
            type: "POST",
            url: createUrl,
            data: form_data,
            contentType: false,
            processData: false,
            success: function (msg) {
                $("#snackbar").addClass('show');
                $("#snackbar").text(msg);
                setTimeout(function () {
                    $("#snackbar").removeClass('show');
                }, 3000);
                $('#tableID').empty();
                loadTable(url, updateProducts, updateProductListLength);
            },
            error: function (xhr, status, error) {
                alert(status + error);
            }
        });

        $('#product-form').hide();
    });

    //* EDIT BUTTON
    $(document).on('click', '.edit-product-btn', function () {
        //* SHOW EDIT PRODUCT FORM
        $('#edit-form').show();

        var buttonId = $(this).attr('id');

        var productId = buttonId.replace('edit-', '');

        var $rows = $(this).closest('.product-info');

        var productName = $rows.find('#product-name-' + productId).text().trim();
        var productDesc = $rows.find('#product-desc-' + productId).text().trim();
        var productPrice = $rows.find('#product-price-' + productId).text().trim();
        var  cleanProductPrice = productPrice.replace(/[^0-9.-]+/g, '');

        $('#edit-product-name').val(productName);
        $('#edit-product-description').val(productDesc);
        $('#edit-product-price').val(cleanProductPrice);

        $('#edit-form').on('submit', function (event) {
            event.preventDefault();

            var formData = new FormData();
            var updateUrl = 'update.php';

            var newProductName = $('#edit-product-name').val();
            var newProductDesc = $('#edit-product-description').val();
            var newProductPrice = $('#edit-product-price').val();
            var newProductImg = $('#edit-product-img')[0].files[0];

            formData.append('product_id', Number(productId));
            formData.append('product_name', newProductName);
            formData.append('product_desc', newProductDesc);
            formData.append('product_price', newProductPrice);
            formData.append('new_file', newProductImg);

            $.ajax({
                type: 'POST',
                url: updateUrl,
                data: formData,
                contentType: false,
                processData: false,
                success: function (msg) {
                    $("#snackbar").addClass('show');
                    $("#snackbar").text(msg);
                    setTimeout(function () {
                        $("#snackbar").removeClass('show');
                    }, 3000);
                    $('#tableID').empty();
                    loadTable(url, updateProducts, updateProductListLength);
                },
                error: function (xhr, status, error) {
                    alert(status + error);
                }
            });
        });
        //* CLOSE FORM USING ICON
        $('#edit-close-icon').click(function () {
            $('#edit-form').hide();
        });
    });

    //* REMOVE PRODUCT
    $(document).on('click', '.delete-product-btn', function () {
        var formData = new FormData();
        var productIdToRemove = $(this).attr('id').split('-')[1];

        var index = products.findIndex(product => product.id === parseInt(productIdToRemove));

        if (index !== -1) {
            products.splice(index, 1);
        }

        var deleteUrl = 'delete.php';

        formData.append('new_products', JSON.stringify(products));

        $.ajax({
            type: 'POST',
            url: deleteUrl,
            data: formData,
            contentType: false,
            processData: false,
            success: function (msg) {
                $("#snackbar").addClass('show');
                $("#snackbar").text(msg);
                setTimeout(function () {
                    $("#snackbar").removeClass('show');
                }, 3000);
                $('#tableID').empty();
                loadTable(url, updateProducts, updateProductListLength);
            }
        });
    });

    var cart = [];

    //* ADD TO CART
    $(document).on('click', '.add-to-cart', function () {

        var formData = new FormData();

        var cartButtonId = $(this).attr('id');

        var productId = cartButtonId.replace('add-to-cart-', '');

        var $rows = $(this).closest('.product-info');

        var productName = $rows.find('#product-name-' + productId).text().trim();
        var productDesc = $rows.find('#product-desc-' + productId).text().trim();
        var productImg = $rows.find('img').attr('src');
        var productPrice = $rows.find('#product-price-' + productId).text().trim();

        cart.push({
            'id': parseInt(productId),
            'name': productName,
            'description': productDesc,
            'image': productImg,
            'price': productPrice
        });

        formData.append('item', JSON.stringify(cart));


        $.ajax({
            type: 'POST',
            url: addToCartUrl,
            data: formData,
            contentType: false,
            processData: false,
            success: function (msg) {
                $("#snackbar").addClass('show');
                $("#snackbar").text(msg);
                setTimeout(function () {
                    $("#snackbar").removeClass('show');
                }, 3000);
                //* UPDATE CART ITEM COUNT
                upadateCartCount(readCartUrl);
            }
        });

        cart = [];

        var $icon = $(this).find('i');
        $icon.addClass('change-icon');

        $icon.on('animationend', function () {
            $icon.removeClass('change-icon').addClass('fa-check');
            setTimeout(function () {
                $icon.removeClass('fa-check');
            }, 1200);
        });

    });

    //* HIDE/SHOW FORM
    $(".add-product-btn").click(function () {
        $('#product-form').toggle();
    });


    //* MODAL DISPLAY FOR CART
    $('#cart').on('click', function () {
        $('#cart-modal').show();

        readCartUrl = 'read_cart.php';

        populateCart(readCartUrl);

        var currentCart = [];
        $.getJSON(readCartUrl, function (response) {
            currentCart = response;
        });

        //* REMOVE ITEM FROM CART
        $(document).on('click', '.remove-btn', function () {
            var formData = new FormData();

            var cartIdToRemove = $(this).attr('id').split('-')[2];

            var index = currentCart.findIndex(item => item.id === parseInt(cartIdToRemove));

            if (index !== -1) {
                currentCart.splice(index, 1);

                formData.append('updated_cart', JSON.stringify(currentCart));
                //SEND NEW ARRAY TO BACKEND TO UPDATE JSON FILE
                $.ajax({
                    type: 'POST',
                    url: removeFromCartUrl,
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (msg) {
                        $("#snackbar").addClass('show');
                        $("#snackbar").text(msg);
                        setTimeout(function () {
                            $("#snackbar").removeClass('show');
                        }, 3000);
                        populateCart(readCartUrl);
                        upadateCartCount(readCartUrl);
                    }
                });
            }
        });

        //* CLOSE MODAL WITH ICON
        $('#cart-close-icon').click(function () {
            $('#cart-modal').hide();
        });
    });

    //* LOGIN MODAL CLICK
    $("#login-signup").on('click', function () {
        //! LOGIN SECTION START
        $('#login-modal').show();

        var loginFormData = new FormData();

        $("#login-form").submit(function (event) {
            event.preventDefault();

            var username = $("#username").val();
            var password = $("#password").val();

            loginFormData.append('username', username);
            loginFormData.append('password', password);

            $.ajax({
                type: 'POST',
                url: loginUrl,
                data: loginFormData,
                contentType: false,
                processData: false,
                success: function (msg) {
                    $("#snackbar").addClass('show');
                    $("#snackbar").text(msg);
                    setTimeout(function () {
                        $("#snackbar").removeClass('show');
                    }, 3000);
                    if (msg.includes('successful')) {
                        $('#username').val('');
                        $('#password').val('');
                        $("#login-modal").hide();
                        $("#login-signup").hide();
                        $("#welcome-user").show();
                        $("#welcome-user").text('Welcome, ' + username + '!');
                        $('#logout').show();
                    }
                },
            })
        });

        //* HIDE MODAL WHEN ICON CLICKED
        $('#login-close-icon').click(function () {
            $('#username').val('');
            $('#password').val('');
            $('#login-modal').hide();
        });
        //! LOGIN SECTION END

        //! SIGNUP SECTION START
        //* GO TO SIGNUP WHEN SPAN TEXT CLICKED
        $('#sign-up-span').click(function () {
            $('#username').val('');
            $('#password').val('');
            $('#login-modal').hide();
            $('#signup-modal').show();
        });

        var signupFormData = new FormData();

        //* SEND INFO TO SIGNUP PHP FILE
        $("#signup-form").submit(function (event) {
            event.preventDefault();

            var firstName = $("#first-name").val();
            var lastName = $("#last-name").val();
            var emailAddress = $("#email-address").val();
            var username = $("#signup-username").val();
            var password = $("#signup-password").val();

            signupFormData.append('first_name', firstName);
            signupFormData.append('last_name', lastName);
            signupFormData.append('email_address', emailAddress);
            signupFormData.append('username', username);
            signupFormData.append('password', password);

            $.ajax({
                type: 'POST',
                url: signupUrl,
                data: signupFormData,
                contentType: false,
                processData: false,
                success: function (msg) {
                    $("#snackbar").addClass('show');
                    $("#snackbar").text(msg);
                    setTimeout(function () {
                        $("#snackbar").removeClass('show');
                    }, 3000);
                    console.log(msg);
                    if (msg.includes('successful')) {
                        $("#first-name").text('');
                        $("#last-name").text('');
                        $("#email-address").text('');
                        $("#signup-username").text('');
                        $("#signup-password").text('');
                        $("#signup-modal").hide();
                        $("#login-signup").hide();
                        $("#welcome-user").show();
                        $("#welcome-user").text('Welcome, ' + username + '!');
                        $('#logout').show();
                    }
                },
            })
        });

        //* CLOSE SIGN UP MODAL ON ICON CLICK
        $("#signup-close-icon").click(function () {
            $('#signup-modal').hide();
        });
        //! SIGNUP SECTION END

        //* REMOVE WELCOME TEXT AND LOGOUT BUTTON WHEN LOGOUT BUTTON CLICKED
        $('#logout').click(function () {
            $('#welcome-user').hide();
            $('#logout').hide();
            $("#snackbar").addClass('show');
                    $("#snackbar").text('Logout successful');
                    setTimeout(function () {
                        $("#snackbar").removeClass('show');
                    }, 3000);
            $('#login-signup').show();
        });
    });
}); // End of ready function

function upadateCartCount(url) {
    $.getJSON(url, function (response) {
        var cartItems = response;
        var cartKeys = Object.keys(cartItems);
        var cartLength = cartKeys.length;
        if (cartLength > 0) {
            $('#item-count').show();
            $('#item-count').text(cartLength);
        } else {
            $('#item-count').hide();
        }
    });
}

function populateCart(url) {
    $('#cartTableId').empty();

    $.getJSON(url, function (response) {
        cartItems = response;
        cartKeys = Object.keys(cartItems);
        cartLength = cartKeys.length;

        let totalPrice = 0;

        if (cartLength > 0) {
            $('#empty-cart').hide();
            $('#cart-header').show();
            $('.total-and-checkout').show();
        } else {
            $('#empty-cart').show();
            $('#cart-header').hide();
            $('.total-and-checkout').hide();
        }

        //* APPEND CART ARRAY VALUES INTO TABLE
        cartItems.forEach(function (item) {
            var cartRow = $('<div class="cart-items"><tr></tr></div>');
            cartRow.append('<td>' + '<img src="' + item.image + '" alt="' + item.name + '"/>' + '</td>');
            cartRow.append('<td class="item-name">' + item.name + '</td>');
            cartRow.append('<td class="item-price">' + item.price + '</td>');
            cartRow.append('<td class="remove-btn" id="remove-btn-' + item.id + '">' + '<i class="fa-regular fa-trash-can"></i>' + '</td>');

            $('#cartTableId').append(cartRow);

            //* REMOVE ANY LEADING CURRENCY SYMBOLS BEFORE ADDING TOTALS
            let cleanPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));

            totalPrice += cleanPrice;
        });
        $("#total-amount").text('R' + totalPrice.toFixed(2));
    });
}

function loadTable(url, updateProductsCallback, updateProductListLengthCallback) {
    //* Load products from JSON into table
    $.getJSON(url, function (response) {
        productList = response;
        var keys = Object.keys(productList);
        productLength = keys.length;

        //* Update the products and productListLength using the provided callbacks
        updateProductsCallback(productList);
        updateProductListLengthCallback(productLength);

        productList.forEach(function (product) {
            var tableRow = $('<td class="product-info"></td>');
            tableRow.append('<tr>' + '<td id="product-img-' + product.id + '">' + '<img src="./' + product.image + '"/>' + '</td>' + '</tr>');
            tableRow.append('<tr>' + '<td class="product-name" id="product-name-' + product.id + '">' + product.name + '</td>' + '<tr>');
            tableRow.append('<tr>' + '<td class="product-desc" id="product-desc-' + product.id + '">' + product.description + '</td>' + '<tr>');
            tableRow.append('<tr>' + '<td id="product-price-' + product.id + '">' + 'R' + product.price + '</td>' + '<tr>');
            tableRow.append('<tr>' + '<td>' + '<button type="button" class="edit-product-btn" id="edit-' + product.id + '">Edit</button>' +
                '<button type="button" class="delete-product-btn" id="delete-' + product.id + '">Remove</button>' + '</td>' + '</tr>');
            tableRow.append('<tr>' + '<td>' + '<button type"button" class="add-to-cart" id="add-to-cart-' + product.id + '"><i class="fa-solid fa-cart-plus" id="add-cart"></i></button>' + '</td>' + '</tr>');
            $('#tableID').append(tableRow);
        });
    });
}
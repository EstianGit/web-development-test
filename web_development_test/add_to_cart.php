<?php
header("Access-Control-Allow-Origin: *");
if (isset($_POST['item'])) {
    $item = $_POST['item'];

    $cart = file_get_contents('cart.json');
    $cart = json_decode($cart, true);

    if (empty($cart)) {
        file_put_contents('cart.json', $item);

        echo "Successfully added item to cart!";
    } else {
        $decoded_items = json_decode($item, true);
        $new_cart = array_merge($cart, $decoded_items);
        $new_cart_json = json_encode($new_cart);
        file_put_contents('cart.json', $new_cart_json);

        echo "Successfully added item to cart!";
    }
} else {
    echo "Unable to add item to cart, please try again" . $item;
}

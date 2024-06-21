<?php
header('Access-Control-Allow-Origin: *');

$new_products = $_POST['updated_cart'];

file_put_contents('cart.json', $new_products);

echo "Success!";

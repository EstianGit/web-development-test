<?php
header('Access-Control-Allow-Origin: *');

$new_products = $_POST['new_products'];

file_put_contents('products.json', $new_products);

echo "Success!";

<?php
header('Access-Control-Allow-Origin: *');

$product_data = file_get_contents('cart.json');
$product_data = json_decode($product_data, true);

$products = [];
foreach ($product_data as $product) {
    $products[] = array(
        "id" => $product["id"],
        "name" => $product["name"],
        "description" => $product["description"],
        "image" => $product["image"],
        "price" => $product["price"],
    );
}

$json_products = json_encode($products);

header("Content-Type: application/json");

echo $json_products;

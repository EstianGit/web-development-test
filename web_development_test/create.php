<?php
header("Access-Control-Allow-Origin: *");

if (isset($_POST["new_products"])) {
    $new_products = $_POST["new_products"];
    $file         = $_FILES["file"];
} else {
    die("No Products Provided");
}

$new_products = json_decode($new_products, true);

$file_path = "images/";
$destination = $file_path . $_FILES['file']['name'];

if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
    echo "File successfully uploaded! <br>";
} else {
    echo "Unable to upload file";
}
$new_products["image"] = $destination;

$handle = @fopen('products.json', 'r+');

if ($handle === null) {
    $handle = fopen('products.json', 'w+');
}

if ($handle) {
    fseek($handle, 0, SEEK_END);

    if (ftell($handle) > 0) {
        $existingData = file_get_contents('products.json');

        $products = json_decode($existingData, true) ?: [];

        $products[] = $new_products;

        $jsonData = json_encode($products);

        file_put_contents('products.json', $jsonData);

        echo "New Product Added!";
    } else {
        fwrite($handle, json_encode(array($new_products)));

        echo "Unable to add product";
    }

    fclose($handle);
}

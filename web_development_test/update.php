<?php
header('Access-Control-Allow-Origin: *');

if (isset($_POST['product_name'])) {
    $product_id     = $_POST['product_id'];
    $product_name   = $_POST['product_name'];
    $product_desc   = $_POST['product_desc'];
    $product_price  = $_POST['product_price'];
    $product_img    = isset($_FILES['new_file']) ? $_FILES['new_file'] : null;


    $current_products_json = file_get_contents('products.json');
    $current_products      = json_decode($current_products_json, true);

    if (!empty($product_img)) {
        $file_path = 'images/';
        $destination = $file_path . $product_img['tmp_name'];
    }

    foreach ($current_products as &$product) {
        if ($product['id'] == $product_id) {
            $product['name'] = $product_name;
            $product['description'] = $product_desc;
            $product['price'] = $product_price;


            if (!empty($product_img['tmp_name'])) {
                move_uploaded_file($_FILES['new_file']['tmp_name'], $destination);
                $product['image'] = $destination;
            }
            break;
        }
    }
    unset($product);

    $updated_products = json_encode($current_products);

    file_put_contents('products.json', $updated_products);

    echo "Products Updated!";
} else {
    echo "No Data Sent";
}
?>
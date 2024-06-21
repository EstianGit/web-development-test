<?php 
header("Access-Control-Allow-Origin: *");

if (isset($_POST['username'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $current_users_json = file_get_contents('users.json');
    $current_users = json_decode($current_users_json, true);

    foreach ($current_users as $user) {
        $decoded_password = base64_decode($user["password"]);
        if ($user["username"] === $username && $decoded_password === $password) {
            echo "Login successful, welcome back $username!";
            exit;
        } else {
            echo "No matching login credentials!";
            exit;
        }
    }
}
?>
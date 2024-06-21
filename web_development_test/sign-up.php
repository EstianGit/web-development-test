<?php
header('Access-Control-Allow-Origin: *');

if (isset($_POST['username'])) {
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email_address = $_POST['email_address'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    $json_data = file_get_contents('users.json');
    $user_data = json_decode($json_data, true);

    if (!empty($user_data)) {
        foreach ($user_data as $user) {
            if ($user['username'] === $username) {
                echo "Username already exists!";
                exit;
            }
            if ($user['email_address'] === $email_address) {
                echo "Email address already exists!";
                exit;
            }
        }
    }

    $endcoded_password = base64_encode($password);

    $new_user_details = array(
        'first_name' => $first_name,
        'last_name' => $last_name,
        'email_address' => $email_address,
        'username' => $username,
        'password' => $endcoded_password,
    );

    $user_data[] = $new_user_details;

    $json_user_details = json_encode($user_data);

    file_put_contents('users.json', $json_user_details);

    echo "User successfully created!";
}
?>
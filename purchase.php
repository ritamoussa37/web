<?php
// purchase.php

include 'db.php'; // your existing database connection script

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize inputs
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $address = $conn->real_escape_string($_POST['address']);
    $total = floatval($_POST['total']);
    $cartData = json_decode($_POST['cartData'], true);

    // Check if user exists
    $userQuery = $conn->query("SELECT id FROM users WHERE email = '$email'");
    if ($userQuery->num_rows > 0) {
        $user = $userQuery->fetch_assoc();
        $user_id = $user['id'];
    } else {
        $conn->query("INSERT INTO users (name, email, password) VALUES ('$name', '$email', '')");
        $user_id = $conn->insert_id;
    }

    // Create order
    $conn->query("INSERT INTO orders (user_id, total_price, status) VALUES ($user_id, $total, 'pending')");
    $order_id = $conn->insert_id;

    // Insert order items
    foreach ($cartData as $item) {
        $title = $conn->real_escape_string($item['title']);
        $price = floatval(str_replace('$', '', $item['price']));
        $quantity = intval($item['quantity']);

        // Check product exists
        $productQuery = $conn->query("SELECT id FROM products WHERE name = '$title'");
        if ($productQuery->num_rows > 0) {
            $product = $productQuery->fetch_assoc();
            $product_id = $product['id'];
        } else {
            // Add product with default stock = 100
            $conn->query("INSERT INTO products (name, price, stock) VALUES ('$title', $price, 100)");
            $product_id = $conn->insert_id;
        }

        // Insert order item
        $conn->query("INSERT INTO orders_items (order_id, product_id, quantity, price) 
                      VALUES ($order_id, $product_id, $quantity, $price)");
    }

    // Confirmation HTML
    echo "
    <html>
    <head>
        <title>Order Confirmation</title>
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>
    </head>
    <body class='bg-light text-center' style='padding:50px;'>
        <div class='card shadow-lg p-5 mx-auto' style='max-width:600px;'>
            <h2 class='text-success'>✅ Thank you, $name!</h2>
            <p>Your order (ID: <b>$order_id</b>) has been placed successfully.</p>
            <p>Total: <b>\$$total</b></p>
            <p>A confirmation email will be sent to: <b>$email</b></p>
            <a href='index.php' class='btn btn-primary mt-3'>🛍 Back to Shop</a>
        </div>
    </body>
    </html>
    ";
} else {
    // Redirect if accessed directly
    header("Location: index.php");
    exit();
}
?>

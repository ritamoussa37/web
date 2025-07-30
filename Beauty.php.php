<?php
require 'test.php'; //  Includes the $pdo connection
 
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['cart_items'])) {
    foreach ($_POST['cart_items'] as $itemName => $itemData) {
        $quantityPurchased = (int)$itemData['quantity'];

        // Fetch current quantity
        $stmt = $pdo->prepare("SELECT itemQuantity FROM products WHERE ItemName = ?");
        $stmt->execute([$itemName]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $available = $row['itemQuantity'];

            if ($quantityPurchased <= $available) {
                $newQty = $available - $quantityPurchased;

                // Update the quantity
                $update = $pdo->prepare("UPDATE products SET itemQuantity = ? WHERE ItemName = ?");
                $update->execute([$newQty, $itemName]);
            } else {
                echo "<script>alert('Not enough stock for $itemName');</script>";
            }
        } else {
            echo "<script>alert('Item $itemName not found in database');</script>";
        }
    }

    echo "<script>alert('Purchase Complete'); window.location.href='cart.php';</script>";
}
?>

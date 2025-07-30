<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header("Location: admin_login.php");
    exit();
}

include 'db.php';


$users = mysqli_query($conn, "SELECT * FROM users WHERE is_admin=0");


$products = mysqli_query($conn, "SELECT * FROM products");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
</head>
<body>
    <h1>Welcome, Admin!</h1>
    <a href="admin_logout.php">Logout</a>

    <h2>Users</h2>
    <table border="1">
        <tr><th>ID</th><th>Name</th><th>Email</th></tr>
        <?php while($row = mysqli_fetch_assoc($users)) { ?>
            <tr>
                <td><?php echo $row['id'] ?></td>
                <td><?php echo $row['name'] ?></td>
                <td><?php echo $row['email'] ?></td>
            </tr>
        <?php } ?>
    </table>

    <h2>Products</h2>
    <table border="1">
        <tr><th>ID</th><th>Name</th><th>Price</th></tr>
        <?php while($row = mysqli_fetch_assoc($products)) { ?>
            <tr>
                <td><?php echo $row['id'] ?></td>
                <td><?php echo $row['name'] ?></td>
                <td><?php echo $row['price'] ?></td>
            </tr>
        <?php } ?>
    </table>
</body>
</html>
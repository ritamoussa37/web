<?php



include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST["fullname"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    if (empty($fullname) || empty($email) || empty($password)) {
        echo "Please fill all fields.";
    } else {
        $password = password_hash($password, PASSWORD_DEFAULT); 
        $sql = "INSERT INTO users (fullname, email, password) VALUES ('$fullname', '$email', '$password')";
        if ($conn->query($sql) === TRUE) {
            echo "Sign up successful! <a href='login.html'>Go to login</a>";
        } else {
            echo "Error: This email already exists.";
        }
    }

    $conn->close();
}

?>

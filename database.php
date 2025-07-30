<?php
// Database connection details
$servername = "localhost";   // Server (Laragon or XAMPP)
$username   = "root";        // Default username for local server
$password   = "";            // Default password (leave empty on Laragon/XAMPP)
$database   = "beautyline_db"; // Database name (must be created in phpMyAdmin)

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("❌ Database connection failed: " . $conn->connect_error);
}
?>

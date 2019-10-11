<?php
// connection

$conn = mysqli_connect('l27.0.0.1','root','root','kimathi');
if($conn->connect_error){
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
 ?>

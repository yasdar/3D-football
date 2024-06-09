<?php


$data= $_POST['data'];
$file = $_POST['file'];

//$data ='{"Id":1,"actual_CurrentScale":1,"actual_scaleCounter":1,"rotation":0,"color":null,"position":{"x":0,"y":0.2,"z":0.3096121770968083}}'; 
//$file = "savedB.json";




if (file_put_contents($file, $data) !== false) {
    echo "Data has been written to $file.";
    _save($file);
} else {
    echo "Error occurred while writing to $file.";
}

function _save($file){

    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname="db1";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT `Id`, `File_name`, `Date` FROM `player001` WHERE `File_name` = '".$file."'";
//file exist or not
$result = mysqli_query($conn,$sql); 
$count = mysqli_num_rows($result); 

if($count >= 1) { 
    echo "already exist - update it </br>";

    $sql ="UPDATE `player001` SET `Date` = CURRENT_TIMESTAMP WHERE `File_name` = '".$file."'";
    if ($conn->query($sql) === TRUE) {
        echo "-- update sucess";
    } else {
        echo "Error: -- update " . $sql . "<br>" . $conn->error;
    }
} else {
    echo "Record new </br>";

    $sql = "INSERT INTO `player001` (`File_name`)
VALUES ('".$file."')";

if ($conn->query($sql) === TRUE) {
    echo "New --- record created successfully".$file;
} else {
    echo "Error: -- record" . $sql . "<br>" . $conn->error;
}


}





$conn->close();

}



?>
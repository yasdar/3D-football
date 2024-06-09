<?php

$playerId = "player001";



fetch($playerId);

function fetch($playerId){

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

$sql = "SELECT `Id`, `File_name`, `Date` FROM `".$playerId."`";

$result = $conn->query($sql);

if($result == FALSE){
echo "no table : ".$playerId;
}else{
    //  $_data="'[";
    $_data="";
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $_data = $_data.'{"Id":'. $row["Id"].',"File_name":"'.$row["File_name"].'","Date":"'.$row["Date"].'"},';
          
        }
        $_data = substr($_data, 0, -1);//remove the last ,
        //$_data = $_data."]'";
        echo $_data;
      } else {
        echo "Empty";
      }
}




$conn->close();

}



?>
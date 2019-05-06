<?php 
require_once('constants.php');


function moveUploadedFile($directory, $uploadedFile, $fileName)
{
    global $logger;
    try {
        $finalFilePath = $directory . DIRECTORY_SEPARATOR . $fileName;
        if (!file_exists($finalFilePath)) {
            $uploadedFile->moveTo($finalFilePath);
        } else {
            $logger->error("file already exist!");
            $logger->error($finalFilePath);
        }
        return true;
    } catch (Execption $err) {
        $logger->error("Error in moving files");
        $logger->error($err->getMessage());
        $err->getMessage();
        return false;
    }
    return false;
}

function createDirectory($directory)
{
    global $logger;
    if (!file_exists($directory)) {
        if (!mkdir($directory, 0777, true)) {
            echo $msg = "Unable to create Directory" . $directory;
            $logger->error($msg);
        }
    }
}

function deleteFile($file)
{
    global $logger;
    if (file_exists($file)) {
        if (!unlink($file)) {
            $msg = "Unable to delete file" . $file;
            $logger->error($msg);
        }
    } else {
        $logger->error("file to remove does not exist " . $file);
    }
}

?>
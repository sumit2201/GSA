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
        return $finalFilePath;
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

function getImageSizeInMB($file)
{
    // print_r($file);die;
    $sizeInMb = ($file->getSize() / 1024) / 1024;
    return $sizeInMb;
}

function resizeImage($file, $w, $h, $crop = false)
{
    //print_r(exif_imagetype($file));die();

    global $logger;
    $dst = null;
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width - ($width * abs($r - $w / $h)));
        } else {
            $height = ceil($height - ($height * abs($r - $w / $h)));
        }
        $newwidth = $w;
        $newheight = $h;
        //print_r($w);die;
    } else {
        if ($w / $h > $r) {
            $newwidth = $h * $r;
            $newheight = $h;
        } else {
            $newheight = $w / $r;
            $newwidth = $w;
        }
    }

    //print_r(exif_imagetype($file));
    if (exif_imagetype($file)) {

        switch (exif_imagetype($file)) {
            case IMAGETYPE_PNG:
                $src = imagecreatefrompng($file);
                $dst = imagecreatetruecolor($newwidth, $newheight);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
                imagepng($dst, $file);
                break;

            case IMAGETYPE_JPEG:
                $src = imagecreatefromjpeg($file);
                $dst = imagecreatetruecolor($newwidth, $newheight);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
                imagejpeg($dst, $file);
                break;
            case IMAGETYPE_GIF:
                $src = imagecreatefromgif($file);
                $dst = imagecreatetruecolor($newwidth, $newheight);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
                imagegif($dst, $file);
                break;
        }
    } else {
        $logger->error("file does not exist on resizing" . $file);
    }

    return $dst;
}

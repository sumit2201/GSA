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
    //print_r($directory);die;
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

function isValidBanner($file, $minResoltion, $maxResoltion, $minwidth, $minheight)
{   
    // print_r($file);die;
    list($width, $height) = getimagesize($file);
    $resolution = getImageresolution($file);    
    if ($resolution > $minResoltion && $resolution < $maxResoltion) {
        if ($width > $minwidth && $height > $minheight) {            
            return true;
        }
    }
    return false;
}

function compressImage($file, $quality)
{
    // global $logger;
    // if (exif_imagetype($file)) {

    //     switch (exif_imagetype($file)) {
    //         case IMAGETYPE_PNG:
    //             $src = imagecreatefrompng($file);
    //             imagepng($src, $file, $quality);
    //             break;

    //         case IMAGETYPE_JPEG:
    //             $src = imagecreatefromjpeg($file);
    //             imagejpeg($src, $file, $quality);
    //             break;
    //         case IMAGETYPE_GIF:
    //             $src = imagecreatefromgif($file);
    //             imagegif($src, $file, $quality);
    //             break;
    //     }
    // } else {
    //     $logger->error("file does not exist on resizing" . $file);
    // }
    return true;
}

function getImageresolution($file)
{
    list($width, $height) = getimagesize($file);
    $resolution = $width / $height;
    return $resolution;
}

function resizeImage($file, $w, $h, $crop = false, $newPath = "")
{
    //print_r($file);die();

    global $logger;
    $dst = null;
    list($width, $height) = getimagesize($file);
    if($newPath === ""){
        $newPath = $file;
    }
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
    $valid = false;
    if (exif_imagetype($file)) {

        switch (exif_imagetype($file)) {
            case IMAGETYPE_PNG:
                $src = imagecreatefrompng($file);
                $dst = imagecreatetruecolor($newwidth, $newheight);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
                imagepng($dst, $newPath);
                $valid = true;
                break;

            case IMAGETYPE_JPEG:
                $src = imagecreatefromjpeg($file);
                $dst = imagecreatetruecolor($newwidth, $newheight);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);                
                imagejpeg($dst, $newPath);
                $valid = true;
                break;
            case IMAGETYPE_GIF:
                $src = imagecreatefromgif($file);
                $dst = imagecreatetruecolor($newwidth, $newheight);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
                imagegif($dst, $newPath);
                $valid = true;
                break;
        }
    } else {
        $valid = false;
        $logger->error("file does not exist on resizing" . $file);
    }

    return $valid;
    //return $dst;
}

<?php

function multi_explode($delimiters, $string) {
    $ready = str_replace($delimiters, $delimiters[0], $string);
    return explode($delimiters[0], $ready);
}

function str_contains($haystack, $needle) {
    return strpos($haystack, $needle) !== false;
}

function starts_with($haystack, $needle) {
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
}

function ends_with($haystack, $needle) {
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
}

function str_encode($data) {
    $x = xor_string($data);
    return base62encode($x);
}

function str_decode($data) {
    $d = base62decode($data);
    return xor_string($d);
}

function xor_string($data) {
    $key = ("display some adaptability");
    $text = $data;
    $out = '';
    for($i = 0; $i < strlen($text); )
        for($j = 0; ($j < strlen($key) && $i < strlen($text)); $j++, $i++)
            $out .= $text{$i} ^ $key{$j};
    return $out;
}

function base62encode($data) {
    $out = '';
    for ($i = 0; $i < strlen($data); $i += 8) {
        $chunk = substr($data, $i, 8);
        $len = ceil((strlen($chunk) * 8)/6);
        $x = bin2hex($chunk);
        $w = gmp_strval(gmp_init(ltrim($x, '0'), 16), 62);
        $pad = str_pad($w, $len, '0', STR_PAD_LEFT);
        $out .= $pad;
    }
    return $out;
}

function base62decode($data) {
    $out = '';
    for ($i = 0; $i < strlen($data); $i += 11) {
        $chunk = substr($data, $i, 11);
        $len = floor((strlen($chunk) * 6)/8);
        $y = gmp_strval(gmp_init(ltrim($chunk, '0'), 62), 16);
        $pad = str_pad($y, $len * 2, '0', STR_PAD_LEFT);
        $out .= pack('H*', $pad);
    }
    return $out;
}

?>


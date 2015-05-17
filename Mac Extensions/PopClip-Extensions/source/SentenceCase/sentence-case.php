<?php
mb_internal_encoding("UTF-8");
$input=getenv('POPCLIP_TEXT');
//$input="  the sky is blue. grass is green!  is the\nfrog green too?... . something";

function mb_ucfirst($string)
{
    $strlen = mb_strlen($string);
    $firstChar = mb_substr($string, 0, 1);
    $then = mb_substr($string, 1, $strlen - 1);
    return mb_strtoupper($firstChar) . $then;
}

// split into leading space and the rest
$initial_space=preg_match('/(\s*)(.*)/u', $input, $matches);
$result=$matches[1];

// split into sentences. delimiter is any space preceded by [.?!].
// include the spaces between sentences in the result, so we can reconstruct the spacing.
$split = preg_split('/((?<=[.?!])\s+)/um', $matches[2], NULL, PREG_SPLIT_DELIM_CAPTURE);

foreach ($split as $fragment) {
	$result .= mb_ucfirst(mb_strtolower($fragment));
}
echo $result;
?>
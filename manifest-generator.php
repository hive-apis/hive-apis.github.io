<?php
function createManifest()
{
    $manifest = [];
    $dir = __DIR__ . "/snippets/";
    $files = array_diff(scandir($dir), ['..', '.', 'folder']); /*ignore directories*/

    foreach ($files as $file) {
        $content = file_get_contents($dir . $file);
        $rows = explode("\n", $content);
        $description = [];
        $openBlock = false;
        $firstComment = true;
        foreach ($rows as $row) {
            /*only gets the first comment it encounters in each file*/
            if ($firstComment) {
                $isOpenCommentBlock = (strpos($row, "/*") !== false);
                $isCloseCommentBlock = (strpos($row, "*/") !== false);
                $isSingleLineComment = (strpos($row, "//") !== false);

                if ($isOpenCommentBlock || $openBlock) {
                    /*open block comment*/
                    $openBlock = true;
                    $row = str_replace("*/", "", $row);
                    $description[] = str_replace("/*", "", $row);
                    if ($isCloseCommentBlock) {
                        /*close block comment*/
                        $openBlock = false;
                        $firstComment = false;
                    }
                } elseif ($isSingleLineComment) {
                    /*single line comment*/
                    $description[] = str_replace("//", "", $row);
                    $firstComment = false;
                }
            }
        }
        $description = implode($description);
        $description = trim($description);
        $manifest[$file] = $description;
    }
    $manifest = preg_replace('/\s+/', ' ', $manifest);
    $manifest = json_encode($manifest, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT); /*JSONify*/
    return stripcslashes($manifest); /*remove special characters*/
}

$manifest = createManifest();

file_put_contents('snippets-manifest.json', $manifest);
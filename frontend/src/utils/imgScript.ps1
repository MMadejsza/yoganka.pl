$name = "karnet"
$quality = 70
$folder = "front"
$sizes = @(320, 480)
# $folder = "gallery"
# $sizes = @(480, 768,1024,1400,1600)

#@ Ustal indeksowanie plików w zależności od folderu
if ($folder -eq "front") {
    $i = 0
} else {
    $i = 1
}

#@ Ścieżki do folderów
$source_folder = "B:\1_Programming\_yoganka_real\frontend\public\imgs\offer\prices\pojedyncze"
$output_folder = $source_folder  # Można zmienić, jeśli potrzebujesz innego folderu wyjściowego

#@ Upewnij się, że folder wyjściowy istnieje
if (-not (Test-Path -Path $output_folder)) {
    New-Item -ItemType Directory -Path $output_folder | Out-Null
}

#@ Pobierz pliki JPG
$files = Get-ChildItem -Path $source_folder | Where-Object {
    $_.Extension -match '\.(jpg|jpeg|heic|png)$'
}

if ($files.Count -eq 0) {
    Write-Host "Brak plików JPG w folderze $source_folder"
} else {
    #@ Iteracja przez pliki w folderze źródłowym
    foreach ($file in $files) {
        foreach ($size in $sizes) {
            #@ Generowanie nazwy pliku wyjściowego
            $output_file_jpg = Join-Path $output_folder "${size}_${name}_${i}.jpg"
            
            ## Konwersja do JPG - tylko wzgledem szerokości
            # magick "$($file.FullName)" -resize "${size}" -quality $quality "$output_file_jpg"

            ## kwadrat:
            magick "`"$($file.FullName)`"" -resize "${size}x${size}^" -gravity center -extent "${size}x${size}" -quality $quality "`"$output_file_jpg`""
            
            #? Opcjonalnie: Konwersja do WebP (odkomentować w razie potrzeby)
            # $output_file_webp = Join-Path $output_folder "${size}_${name}_${i}.webp"
            # magick "`"$($file.FullName)`"" -resize "${size}x${size}" -quality 75 -define webp:lossless=false -define webp:method=6 -define webp:auto-filter=true "`"$output_file_webp`""
        }
        $i++
    }
}

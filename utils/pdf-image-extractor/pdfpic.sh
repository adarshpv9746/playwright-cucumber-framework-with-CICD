#!/bin/bash

# Check if the pdfimages, convert, and fdupes commands are available
if ! command -v pdfimages &> /dev/null || ! command -v convert &> /dev/null || ! command -v fdupes &> /dev/null; then
  echo "pdfimages, convert, or fdupes command not found. Please install 'poppler-utils' (pdfimages), 'imagemagick' (convert), and 'fdupes' packages."
  exit 1
fi

# Check if the correct number of arguments is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <input_pdf_file>"
  exit 1
fi

input_pdf="$1"
images_folder="images"

# Create the "images" folder if it doesn't exist
mkdir -p "$images_folder"

# Use pdfimages to extract images from the PDF in PPM format
pdfimages "$input_pdf" "$images_folder/image"

# Convert extracted PPM images to PNG format
for ppm_image in "$images_folder"/*.ppm; do
  png_image="${ppm_image%.ppm}.png"
  convert "$ppm_image" "$png_image"
  rm "$ppm_image" # Optionally, remove the original PPM image
done

# Use fdupes to remove duplicate images
fdupes -rdN "$images_folder"

echo "Images extracted, converted to PNG format, and duplicate images removed. Saved to $images_folder/"

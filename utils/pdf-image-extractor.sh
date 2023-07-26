#!/bin/bash

# Check if the correct number of arguments is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <pdf-directory>"
  exit 1
fi
rm -r pdf-extracted-images
mkdir pdf-extracted-images pdf-extracted-images/pdf-pages pdf-extracted-images/pdf-images
cd ./utils/pdf-image-extractor/pdf-pic
folder_name='node_modules'
dir="../../../$1"

# Check if the specified folder exists in the current directory
if [ ! -d "$folder_name" ]; then
  echo "The folder '$folder_name' does not exist. running npm install...."
  npm install
  node pdfpic.js $dir
  node ../pdf2image.js $dir
  ./pdfpic.sh $dir
  cd ..
  ./duplicate.sh ../../pdf-extracted-images/pdf-images
  ./duplicate.sh ../../pdf-extracted-images/pdf-pages
  
else
  echo "'$folder_name' already exists"
  node pdfpic.js $dir
  node ../pdf2image.js $dir
  ./pdfpic.sh $dir
  cd ..
  ./duplicate.sh ../../pdf-extracted-images/pdf-images
  ./duplicate.sh ../../pdf-extracted-images/pdf-pages
fi

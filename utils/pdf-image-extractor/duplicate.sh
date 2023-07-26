#!/bin/bash

# Check if folder path is provided as argument
if [ $# -eq 0 ]; then
  echo "Please provide the folder path as an argument."
  exit 1
fi

# Get the folder path from the argument
folder="$1"

# Create a temporary file to store duplicate images
temp_file="/tmp/duplicate_images.txt"

# Change to the folder directory
cd "$folder" || exit 1

# Find all image files
find . -type f \( -iname \*.jpg -o -iname \*.jpeg -o -iname \*.png -o -iname \*.gif \) -exec echo {} \; > "$temp_file"

# Compare images and remove duplicates
while IFS= read -r image1; do
  while IFS= read -r image2; do
    if [ "$image1" != "$image2" ]; then
      compare -metric AE "$image1" "$image2" null: &> /dev/null
      exit_code=$?
      if [ $exit_code -eq 0 ]; then
        echo "Removing duplicate: $image2"
        rm "$image2"
      fi
    fi
  done < "$temp_file"
done < "$temp_file"

# Clean up the temporary file
rm "$temp_file"

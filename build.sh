#!/bin/bash

# Exit script on any error
set -e

# Step 1: Remove the `build` folder from all subfolders inside `./apps/extensions`
EXTENSIONS_DIR="./apps/extensions"
echo "Removing build folders from subfolders of $EXTENSIONS_DIR..."
if [ -d "$EXTENSIONS_DIR" ]; then
  for folder in "$EXTENSIONS_DIR"/*; do
    if [ -d "$folder" ]; then
      if [ -d "$folder/build" ]; then
        rm -rf "$folder/build"
        echo "Removed build folder from $folder"
      else
        echo "Build folder does not exist in $folder. Skipping."
      fi
    fi
  done
else
  echo "Extensions folder ($EXTENSIONS_DIR) does not exist. Skipping removal."
fi

# Step 2: Remove the `build` folder from `./apps/recorder` if it exists
RECORDER_DIR="./apps/recorder"
if [ -d "$RECORDER_DIR/build" ]; then
  echo "Removing build folder from $RECORDER_DIR..."
  rm -rf "$RECORDER_DIR/build"
  echo "build folder removed from $RECORDER_DIR."
else
  echo "build folder does not exist in $RECORDER_DIR. Skipping removal."
fi

# Step 3: Navigate to `./apps/recorder` and execute `pnpm build`
if [ -d "$RECORDER_DIR" ]; then
  echo "Navigating to $RECORDER_DIR..."
  cd "$RECORDER_DIR"

  # Check if `pnpm` is installed
  if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is not installed. Please install pnpm and try again."
    exit 1
  fi

  echo "Building the project in $RECORDER_DIR with pnpm..."
  pnpm build
  echo "Build completed."

  # Move back to the root directory
  cd - > /dev/null
else
  echo "Error: $RECORDER_DIR does not exist. Cannot build."
  exit 1
fi

# Step 4: Copy the `build` folder from `./apps/recorder` to all subfolders inside `./apps/extensions`
if [ -d "$EXTENSIONS_DIR" ]; then
  echo "Copying build folder from $RECORDER_DIR to all subfolders inside $EXTENSIONS_DIR..."
  for folder in "$EXTENSIONS_DIR"/*; do
    if [ -d "$folder" ]; then
      cp -r "$RECORDER_DIR/build" "$folder/"
      echo "Copied build folder to $folder"
    fi
  done
  echo "Copy operation completed."
else
  echo "Extensions folder ($EXTENSIONS_DIR) does not exist. Skipping copy step."
fi

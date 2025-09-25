#!/bin/bash

# This script checks for the existence of a 'coverage' directory and a 'report.json' file
# in the current directory. If they exist, it moves them up one directory level.

# --- Configuration ---
COVERAGE_DIR="./coverage"
REPORT_FILE="./report.json"
DESTINATION_DIR="../"

# Check if the coverage directory exists and is a directory
if [ -d "$COVERAGE_DIR" ]; then
    echo "Found '$COVERAGE_DIR' directory. Moving to '$DESTINATION_DIR'."
    mv "$COVERAGE_DIR" "$DESTINATION_DIR"
else
    echo "Directory '$COVERAGE_DIR' not found. Skipping."
fi

# Check if the report file exists and is a regular file
if [ -f "$REPORT_FILE" ]; then
    echo "Found '$REPORT_FILE' file. Moving to '$DESTINATION_DIR'."
    mv "$REPORT_FILE" "$DESTINATION_DIR"
else
    echo "File '$REPORT_FILE' not found. Skipping."
fi

echo "Script finished."

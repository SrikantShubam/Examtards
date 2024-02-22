import os
import sys

import tool

def list_files_in_directory(directory_path):
    try:
        # Check if the directory exists
        if not os.path.exists(directory_path):
            raise FileNotFoundError(f"The directory '{directory_path}' does not exist.")

        # Get a list of all files in the directory
        return os.listdir(directory_path)

    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    # Get the folder path from the command line arguments
    if len(sys.argv) != 2:
        print("Usage: python list_files.py <folder_path>")
        sys.exit(1)

    folder_path = sys.argv[1]

    # Call the function to list files in the directory
    list_of_inputs = list_files_in_directory(folder_path)

    for file_path in list_of_inputs:
        tool.main(file_path, destination_path="outputs/")


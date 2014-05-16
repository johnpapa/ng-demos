#!/bin/bash

# Check that Python is available
command -v python >/dev/null 2>&1 || {
    echo >&2 "Cannot find python. Either:
      - Install python
      - Or, serve the quickstart files from an alternative web server such as Apache."
    exit 1
}

# Go to the directory containing the www files (one level above where this script is)
# and then start the simple web server
pushd `dirname $0` > /dev/null
cd ..
python -m SimpleHTTPServer 8000

# Finally, return to the original directory
popd > /dev/null

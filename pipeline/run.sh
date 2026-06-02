#!/bin/bash

echo "Running detection pipeline..."

python detect.py

echo "Validating events..."

python validate_events.py

echo "Done!"
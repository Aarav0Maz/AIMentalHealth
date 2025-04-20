#!/bin/bash

# Run flake8 with exclusions
echo "Running flake8..."
flake8 --exclude=venv,backend/venv,site-packages,*/site-packages/*,*/venv/* .

# Run black in check mode
echo "Running black..."
black --check --exclude "/(\.git|\.hg|\.mypy_cache|\.tox|\.venv|venv|_build|buck-out|build|dist|backend/venv)/" .

# Run isort in check mode
echo "Running isort..."
isort --check-only --profile black --skip venv --skip backend/venv --skip site-packages .

echo "Linting complete!"

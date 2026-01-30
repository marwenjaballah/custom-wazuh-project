#!/bin/bash
set -e

# Configuration
PLUGIN_SOURCE="../../plugins/iot-security"
BUILD_DIR="iot-security-plugin"
DOCKER_TAG="wazuh-dashboard:iot-dev"

echo "🚀 Starting Full Wazuh Plugin Build..."

# 1. Clean previous build context
echo "🧹 Cleaning up previous build artifacts..."
rm -rf $BUILD_DIR

# 2. Copy plugin source to build context
echo "cp Copying plugin source..."
cp -r $PLUGIN_SOURCE $BUILD_DIR

# 3. Build Docker image
echo "🐳 Building Docker image (this will take a few minutes)..."
docker build -t $DOCKER_TAG -f Dockerfile.with-plugins .

echo "✅ Build complete! Image: $DOCKER_TAG"

# 4. Update docker-compose if needed
echo "📋 To use this image, update docker-compose.yml:"
echo "   image: $DOCKER_TAG"

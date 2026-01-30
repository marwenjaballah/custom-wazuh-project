#!/bin/bash
set -e

# Configuration
PLUGIN_SOURCE="../plugins/iot-security"
BUILD_DIR="iot-security-plugin"
DOCKER_TAG="wazuh-dashboard:iot-dev"

echo "🚀 Starting Robust Full Wazuh Plugin Build..."

# 1. Clean previous build context
echo "🧹 Cleaning up previous build artifacts..."
rm -rf "$BUILD_DIR"

# 2. Copy plugin source to build context
echo "📂 Copying plugin source..."
cp -r "$PLUGIN_SOURCE" "$BUILD_DIR"

# 3. Build Docker image with temporary config
echo "🐳 Building Docker image (ignoring credential helper)..."
export DOCKER_CONFIG="/home/viconee/work/wazuh-custom-project/docker_config_bypass"
docker build -t "$DOCKER_TAG" -f Dockerfile.with-plugins .

echo "✅ Build complete! Image: $DOCKER_TAG"

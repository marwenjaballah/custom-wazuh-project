#!/usr/bin/env bash
#
# Build OpenSearch Dashboards Docker image with Wazuh plugins
#
set -euo pipefail

WAZUH_VERSION="${WAZUH_VERSION:-4.10.3}"
OPENSEARCH_DASHBOARDS_VERSION="${OPENSEARCH_DASHBOARDS_VERSION:-2.16.0}"
BASE_IMAGE="docker.opensearch.org/opensearch-dashboards/opensearch-dashboards:${OPENSEARCH_DASHBOARDS_VERSION}-SNAPSHOT"
OUTPUT_IMAGE="docker.opensearch.org/opensearch-dashboards/opensearch-dashboards:${OPENSEARCH_DASHBOARDS_VERSION}-SNAPSHOT-wazuh"

echo "Building Wazuh plugins..."

# Build plugins using Docker
docker build \
  --build-arg WAZUH_VERSION="${WAZUH_VERSION}" \
  --build-arg OPENSEARCH_DASHBOARDS_VERSION="${OPENSEARCH_DASHBOARDS_VERSION}" \
  -f Dockerfile.plugins-only \
  -t wazuh-plugins-builder:temp \
  .

echo "Building final image with plugins..."

# Build final image with plugins installed
docker build \
  --build-arg BASE_IMAGE="${BASE_IMAGE}" \
  --build-arg WAZUH_VERSION="${WAZUH_VERSION}" \
  --build-arg OPENSEARCH_DASHBOARDS_VERSION="${OPENSEARCH_DASHBOARDS_VERSION}" \
  -f Dockerfile.with-plugins \
  -t "${OUTPUT_IMAGE}" \
  .

echo "Successfully built ${OUTPUT_IMAGE}"

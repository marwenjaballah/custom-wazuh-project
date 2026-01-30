# Building Wazuh Dashboard with Plugins

This directory contains Dockerfiles and scripts to build a custom Wazuh Dashboard Docker image with all Wazuh plugins included.

## Files

- **Dockerfile.with-plugins**: Multi-stage Dockerfile that builds Wazuh plugins and installs them into the base dashboard image
- **Dockerfile.plugins-only**: Dockerfile to build only the plugins (for testing)
- **build_with_plugins.sh**: Build script (alternative method)

## Building the Image

### Prerequisites

1. You must have already built the base dashboard image:
   ```bash
   cd /home/viconee/work/wazuh-custom-project/wazuh-dashboard
   yarn build --docker
   ```

2. The base image should be available as:
   `docker.opensearch.org/opensearch-dashboards/opensearch-dashboards:2.16.0-SNAPSHOT`

### Build Command

```bash
cd /home/viconee/work/wazuh-custom-project/wazuh-dashboard/build/opensearch-dashboards-docker

docker build \
  --build-arg BASE_IMAGE="docker.opensearch.org/opensearch-dashboards/opensearch-dashboards:2.16.0-SNAPSHOT" \
  --build-arg WAZUH_VERSION="4.10.3" \
  --build-arg OPENSEARCH_DASHBOARDS_VERSION="2.16.0" \
  -f Dockerfile.with-plugins \
  -t wazuh-dashboard:custom-with-plugins \
  .
```

### Build Process

The build process:

1. **Plugin Builder Stage**: 
   - Clones the Wazuh dashboard repository (v4.10.3)
   - Bootstraps it to get plugin build tools
   - Clones and builds:
     - `wazuh-security-dashboards-plugin` (v4.10.1)
     - `wazuh-dashboard-plugins` (v4.10.3) containing:
       - `wazuh` (main plugin)
       - `wazuh-core`
       - `wazuh-check-updates`

2. **Final Stage**:
   - Starts from your base dashboard image
   - Copies built plugin ZIP files from the builder stage
   - Extracts plugins into `/usr/share/opensearch-dashboards/plugins/`
   - Sets proper permissions

### Using the Image

Update your `docker-compose.yml` to use the new image:

```yaml
wazuh.dashboard:
  image: wazuh-dashboard:custom-with-plugins
  # ... rest of configuration
```

### Plugins Included

- **security-dashboards**: OpenSearch Security plugin for authentication
- **wazuh**: Main Wazuh UI plugin
- **wazuh-core**: Core Wazuh functionality
- **wazuh-check-updates**: Update checking functionality

### Notes

- The build process takes approximately 15-30 minutes depending on your system
- Requires internet access to clone repositories and download dependencies
- Plugin versions are matched to Wazuh version 4.10.3
- The security plugin uses v4.10.1 tag as v4.10.3 doesn't exist (compatible)

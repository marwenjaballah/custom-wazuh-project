import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import axios from 'axios';
import { IoTSecurityPluginSetup, IoTSecurityPluginStart } from './types';

const IOT_BACKEND_URL = 'http://iot-security-backend:8000/api/v1';

export class IoTSecurityPlugin
  implements Plugin<IoTSecurityPluginSetup, IoTSecurityPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.info('IoT Security: Setup');
    const router = core.http.createRouter();

    // Health check
    router.get(
      {
        path: '/api/iot-security/health',
        validate: false,
      },
      async (context, request, response) => {
        return response.ok({
          body: {
            message: 'IoT Security plugin is healthy',
            time: new Date().toISOString(),
          },
        });
      }
    );

    // Proxy to IoT backend: Devices
    router.get(
      {
        path: '/api/iot-security/devices',
        validate: false,
      },
      async (context, request, response) => {
        try {
          const res = await axios.get(`${IOT_BACKEND_URL}/devices`);
          return response.ok({ body: res.data });
        } catch (error) {
          this.logger.error(`IoT Security: Failed to fetch devices: ${error}`);
          return response.internalError({
            body: { message: 'Failed to fetch devices' },
          });
        }
      }
    );

    // Proxy to IoT backend: Stats
    router.get(
      {
        path: '/api/iot-security/stats',
        validate: false,
      },
      async (context, request, response) => {
        try {
          const res = await axios.get(`${IOT_BACKEND_URL}/devices/stats/summary`);
          return response.ok({ body: res.data });
        } catch (error) {
          this.logger.error(`IoT Security: Failed to fetch stats: ${error}`);
          return response.internalError({
            body: { message: 'Failed to fetch stats' },
          });
        }
      }
    );

    return {};
  }

  public start(core: CoreStart) {
    this.logger.info('IoT Security: Started');
    return {};
  }

  public stop() {}
}

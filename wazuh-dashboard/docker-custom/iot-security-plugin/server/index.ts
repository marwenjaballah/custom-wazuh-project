import { PluginInitializerContext } from '../../../src/core/server';
import { IoTSecurityPlugin } from './plugin';

export function plugin(initializerContext: PluginInitializerContext) {
  return new IoTSecurityPlugin(initializerContext);
}

export { IoTSecurityPluginSetup, IoTSecurityPluginStart } from './types';

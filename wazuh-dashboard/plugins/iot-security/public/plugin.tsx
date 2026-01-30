import React from 'react';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { IoTSecurityPluginSetup, IoTSecurityPluginStart } from './types';

export class IoTSecurityPlugin implements Plugin<IoTSecurityPluginSetup, IoTSecurityPluginStart> {
    public setup(core: CoreSetup): IoTSecurityPluginSetup {
        // Register the application
        core.application.register({
            id: 'iotSecurity',
            title: 'IoT Security',
            category: {
                id: 'wazuh',
                label: 'Peaksoft',
                order: 100, // Show below other wazuh apps
            },
            order: 9000,
            async mount(params: AppMountParameters) {
                // Load application bundle
                const { renderApp } = await import('./application');
                return renderApp(core, params);
            },
        });

        return {};
    }

    public start(core: CoreStart): IoTSecurityPluginStart {
        return {};
    }

    public stop() { }
}

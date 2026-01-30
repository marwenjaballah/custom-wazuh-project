import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreSetup } from '../../../src/core/public';
import {
    EuiPage,
    EuiPageBody,
    EuiPageHeader,
    EuiPageContent,
    EuiPageContentBody
} from '@elastic/eui';

import { DeviceTable } from './components/DeviceTable';

const IoTSecurityApp = () => {
    return (
        <EuiPage>
            <EuiPageBody>
                <EuiPageHeader
                    pageTitle="Peaksoft IoT Security Management"
                    description="Monitor and manage your IoT infrastructure with Peaksoft Security."
                />
                <EuiPageContent>
                    <EuiPageContentBody>
                        <DeviceTable />
                    </EuiPageContentBody>
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    );
};

export const renderApp = (core: CoreSetup, { element }: AppMountParameters) => {
    ReactDOM.render(<IoTSecurityApp />, element);

    return () => ReactDOM.unmountComponentAtNode(element);
};

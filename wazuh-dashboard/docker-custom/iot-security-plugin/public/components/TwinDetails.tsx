import React, { useState } from 'react';
import {
    EuiModal,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiModalBody,
    EuiModalFooter,
    EuiButton,
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiTitle,
    EuiText,
    EuiSpacer,
    EuiPanel,
    EuiStat,
    EuiHorizontalRule,
    EuiFieldText,
    EuiFormRow,
    EuiCallOut,
    EuiProgress,
    EuiIcon,
    EuiDescriptionList,
} from '@elastic/eui';
import axios from 'axios';

interface Device {
    id: string;
    name: string;
    device_type: string;
    ip_address: string;
    location: string;
    risk_score: number;
    compliance_score: number;
    digital_twin_state: Record<string, any>;
}

interface TwinDetailsProps {
    device: Device;
    onClose: () => void;
}

export const TwinDetails: React.FC<TwinDetailsProps> = ({ device, onClose }) => {
    const [cveId, setCveId] = useState('CVE-2024-iot-exp');
    const [simResult, setSimResult] = useState<any>(null);
    const [simulating, setSimulating] = useState(false);

    const runSimulation = async () => {
        try {
            setSimulating(true);
            const response = await axios.post(`/api/iot-security/devices/${device.id}/simulate-vulnerability?cve_id=${cveId}`);
            setSimResult(response.data);
        } catch (err) {
            console.error('Simulation failed', err);
        } finally {
            setSimulating(false);
        }
    };

    const telemetryItems = Object.entries(device.digital_twin_state).map(([key, value]) => ({
        title: key.charAt(0).toUpperCase() + key.slice(1),
        description: value.toString(),
    }));

    return (
        <EuiModal onClose={onClose} style={{ width: 800 }}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>
                    <EuiFlexGroup alignItems="center" gutterSize="s">
                        <EuiFlexItem grow={false}>
                            <EuiIcon type="dashboardApp" size="l" />
                        </EuiFlexItem>
                        <EuiFlexItem>
                            Digital Twin: {device.name}
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
                <EuiFlexGroup>
                    <EuiFlexItem>
                        <EuiPanel color="subdued" paddingSize="m">
                            <EuiTitle size="xs"><h4>Physical Device State</h4></EuiTitle>
                            <EuiSpacer size="s" />
                            <EuiHealth color="success">Synced with Edge</EuiHealth>
                            <EuiSpacer size="m" />
                            <EuiDescriptionList listItems={telemetryItems} />
                        </EuiPanel>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiPanel paddingSize="m">
                            <EuiTitle size="xs"><h4>Digital Twin Mirror</h4></EuiTitle>
                            <EuiSpacer size="s" />
                            <EuiText size="s" color="subdued">Predictive state tracking enabled</EuiText>
                            <EuiSpacer size="m" />
                            <EuiDescriptionList listItems={telemetryItems} />
                        </EuiPanel>
                    </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer size="l" />
                <EuiHorizontalRule />
                <EuiTitle size="s"><h3>"What-If" Predictive Simulation</h3></EuiTitle>
                <EuiSpacer size="m" />

                <EuiFlexGroup alignItems="flexEnd">
                    <EuiFlexItem grow={2}>
                        <EuiFormRow label="Simulate Vulnerability (CVE ID)">
                            <EuiFieldText
                                value={cveId}
                                onChange={(e) => setCveId(e.target.value)}
                                placeholder="e.g. CVE-2024-1234"
                            />
                        </EuiFormRow>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiButton
                            fill
                            onClick={runSimulation}
                            isLoading={simulating}
                            iconType="play"
                        >
                            Predict Impact
                        </EuiButton>
                    </EuiFlexItem>
                </EuiFlexGroup>

                {simResult && (
                    <>
                        <EuiSpacer size="l" />
                        <EuiCallOut
                            title={`Analysis Results for ${simResult.cve_simulated}`}
                            color={simResult.impact_analysis === 'High' ? 'danger' : 'warning'}
                            iconType="bolt"
                        >
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiStat
                                        title={`${simResult.current_risk}%`}
                                        description="Current Risk"
                                        titleColor="subdued"
                                    />
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiStat
                                        title={`${simResult.predicted_risk}%`}
                                        description="Predicted Risk"
                                        titleColor={simResult.impact_analysis === 'High' ? 'danger' : 'warning'}
                                    />
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            <EuiSpacer size="m" />
                            <EuiText size="s">
                                <strong>Recommendation:</strong> {simResult.recommendation}
                            </EuiText>
                            <EuiSpacer size="s" />
                            <EuiProgress
                                value={simResult.predicted_risk}
                                max={100}
                                color={simResult.impact_analysis === 'High' ? 'danger' : 'warning'}
                                size="s"
                            />
                        </EuiCallOut>
                    </>
                )}
            </EuiModalBody>

            <EuiModalFooter>
                <EuiButtonEmpty onClick={onClose}>Close Analysis</EuiButtonEmpty>
            </EuiModalFooter>
        </EuiModal>
    );
};

// Helper component for EuiHealth if needed, but assuming it's imported globally or through EUI
const EuiHealth = ({ children, color }: any) => (
    <EuiFlexGroup gutterSize="xs" alignItems="center">
        <EuiFlexItem grow={false}><EuiIcon type="dot" color={color} /></EuiFlexItem>
        <EuiFlexItem grow={false}><EuiText size="s">{children}</EuiText></EuiFlexItem>
    </EuiFlexGroup>
);

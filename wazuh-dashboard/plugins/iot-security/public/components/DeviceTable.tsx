import React, { useState, useEffect } from 'react';
import {
    EuiInMemoryTable,
    EuiHealth,
    EuiSpacer,
    EuiTitle,
    EuiFlexGroup,
    EuiFlexItem,
    EuiStat,
    EuiPanel,
    EuiCallOut,
    EuiIcon,
    EuiBadge,
    EuiToolTip,
    EuiText,
    EuiHorizontalRule,
    EuiFlexGrid,
    EuiCard,
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';

interface Device {
    id: string;
    name: string;
    device_type: string;
    ip_address: string;
    mac_address: string;
    manufacturer?: string;
    firmware_version?: string;
    status: string;
    risk_score: number;
    last_seen: string;
}

interface RiskDistribution {
    high: number;
    medium: number;
    low: number;
}

interface Stats {
    total_devices: number;
    online_devices: number;
    offline_devices: number;
    average_risk_score: number;
    device_types: Record<string, number>;
    risk_distribution: RiskDistribution;
}

export const DeviceTable = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [devicesRes, statsRes] = await Promise.all([
                axios.get('/api/iot-security/devices'),
                axios.get('/api/iot-security/stats')
            ]);
            setDevices(devicesRes.data);
            setStats(statsRes.data);
            setError(null);
        } catch (err) {
            setError('Could not fetch device data. Please ensure the IoT backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchData, 10000); // Poll every 10s for dynamic updates
        fetchData();
        return () => clearInterval(interval);
    }, []);

    const columns = [
        {
            field: 'name',
            name: 'Device Name',
            sortable: true,
            truncateText: true,
            render: (name: string, device: Device) => (
                <EuiFlexGroup gutterSize="s" alignItems="center">
                    <EuiFlexItem grow={false}>
                        <EuiIcon type={device.device_type === 'camera' ? 'videoPlayer' : 'compute'} size="m" />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiText size="s"><strong>{name}</strong></EuiText>
                    </EuiFlexItem>
                </EuiFlexGroup>
            )
        },
        {
            field: 'device_type',
            name: 'Type',
            sortable: true,
            render: (type: string) => (
                <EuiBadge color="hollow">{type.toUpperCase()}</EuiBadge>
            )
        },
        {
            field: 'ip_address',
            name: 'Network Location',
            sortable: true,
            render: (ip: string, device: Device) => (
                <EuiToolTip content={`MAC: ${device.mac_address}`}>
                    <EuiText size="s">{ip}</EuiText>
                </EuiToolTip>
            )
        },
        {
            field: 'manufacturer',
            name: 'Manufacturer/Firmware',
            render: (manufacturer: string, device: Device) => (
                <EuiText size="xs">
                    {manufacturer || 'Unknown'} <EuiBadge color="subdued">{device.firmware_version || 'v?'}</EuiBadge>
                </EuiText>
            )
        },
        {
            field: 'status',
            name: 'Status',
            sortable: true,
            render: (status: string) => {
                const color = status === 'online' ? 'success' : 'danger';
                return <EuiHealth color={color}>{status}</EuiHealth>;
            },
        },
        {
            field: 'risk_score',
            name: 'Risk Level',
            sortable: true,
            width: '150px',
            render: (score: number) => {
                let color = 'success';
                let label = 'Low';
                if (score >= 70) { color = 'danger'; label = 'Critical'; }
                else if (score >= 30) { color = 'warning'; label = 'Medium'; }

                return (
                    <EuiToolTip content={`Risk Score: ${score}/100`}>
                        <EuiBadge color={color}>{label}</EuiBadge>
                    </EuiToolTip>
                );
            },
        },
        {
            field: 'last_seen',
            name: 'Last Telemetry',
            sortable: true,
            render: (date: string) => moment(date).fromNow(),
        },
    ];

    const search = {
        box: {
            incremental: true,
        },
        filters: [
            {
                type: 'field_value_selection' as const,
                field: 'status',
                name: 'Status',
                multiSelect: false,
                options: [
                    { value: 'online', view: 'Online' },
                    { value: 'offline', view: 'Offline' },
                ],
            },
            {
                type: 'field_value_selection' as const,
                field: 'device_type',
                name: 'Device Type',
                multiSelect: true,
                options: [
                    { value: 'sensor', view: 'Sensor' },
                    { value: 'camera', view: 'Camera' },
                    { value: 'thermostat', view: 'Thermostat' },
                ],
            },
        ],
    };

    return (
        <>
            {error && (
                <EuiCallOut title="Backend Connection Lost" color="danger" iconType="alert">
                    <p>{error}</p>
                </EuiCallOut>
            )}

            {stats && (
                <EuiFlexGrid columns={4} gutterSize="l">
                    <EuiFlexItem>
                        <EuiCard
                            layout="horizontal"
                            icon={<EuiIcon size="l" type="aggregate" />}
                            title={stats.total_devices.toString()}
                            description="Total IoT Assets"
                        />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiCard
                            layout="horizontal"
                            icon={<EuiIcon size="l" type="check" color="success" />}
                            title={stats.online_devices.toString()}
                            description="Active Connections"
                        />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiCard
                            layout="horizontal"
                            icon={<EuiIcon size="l" type="alert" color="danger" />}
                            title={stats.risk_distribution.high.toString()}
                            description="Critical Threats"
                        />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiCard
                            layout="horizontal"
                            icon={<EuiIcon size="l" type="dashboardApp" color="warning" />}
                            title={`${stats.average_risk_score}%`}
                            description="Avg Network Risk"
                        />
                    </EuiFlexItem>
                </EuiFlexGrid>
            )}

            <EuiSpacer size="l" />

            <EuiFlexGroup>
                <EuiFlexItem grow={2}>
                    <EuiPanel>
                        <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
                            <EuiFlexItem grow={false}>
                                <EuiTitle size="s">
                                    <h3>Managed Devices</h3>
                                </EuiTitle>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiBadge color="primary">{devices.length} Assets</EuiBadge>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                        <EuiHorizontalRule margin="m" />
                        <EuiInMemoryTable<any>
                            items={devices}
                            columns={columns}
                            loading={loading}
                            search={search}
                            pagination={true}
                            sorting={true}
                            itemId="id"
                        />
                    </EuiPanel>
                </EuiFlexItem>

                {stats && (
                    <EuiFlexItem grow={1}>
                        <EuiPanel>
                            <EuiTitle size="s">
                                <h3>Security Health Overview</h3>
                            </EuiTitle>
                            <EuiSpacer size="m" />
                            <EuiText size="s" color="subdued">
                                Threat Distribution across the network
                            </EuiText>
                            <EuiSpacer size="l" />

                            <EuiStat title={stats.risk_distribution.high.toString()} description="High Risk" titleColor="danger" />
                            <EuiSpacer size="m" />
                            <EuiStat title={stats.risk_distribution.medium.toString()} description="Medium Risk" titleColor="warning" />
                            <EuiSpacer size="m" />
                            <EuiStat title={stats.risk_distribution.low.toString()} description="Low Risk" titleColor="success" />

                            <EuiSpacer size="xl" />
                            <EuiPanel color="subdued" paddingSize="s">
                                <EuiText size="xs" textAlign="center">
                                    <p>AI Analysis based on Wazuh Security Alerts</p>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                    </EuiFlexItem>
                )}
            </EuiFlexGroup>
        </>
    );
};

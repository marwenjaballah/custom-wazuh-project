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
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';

interface Device {
    id: string;
    name: string;
    device_type: string;
    ip_address: string;
    mac_address: string;
    status: string;
    risk_score: number;
    last_seen: string;
}

interface Stats {
    total_devices: number;
    online_devices: number;
    offline_devices: number;
    average_risk_score: number;
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
        fetchData();
    }, []);

    const columns = [
        {
            field: 'name',
            name: 'Device Name',
            sortable: true,
            truncateText: true,
        },
        {
            field: 'device_type',
            name: 'Type',
            sortable: true,
        },
        {
            field: 'ip_address',
            name: 'IP Address',
            sortable: true,
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
            name: 'Risk Score',
            sortable: true,
            render: (score: number) => {
                let color = 'success';
                if (score >= 70) color = 'danger';
                else if (score >= 30) color = 'warning';
                return <EuiHealth color={color}>{score}/100</EuiHealth>;
            },
        },
        {
            field: 'last_seen',
            name: 'Last Seen',
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
        ],
    };

    return (
        <>
            {error && (
                <EuiCallOut title="Error" color="danger" iconType="alert">
                    {error}
                </EuiCallOut>
            )}

            {stats && (
                <EuiFlexGroup gutterSize="l">
                    <EuiFlexItem>
                        <EuiPanel>
                            <EuiStat title={stats.total_devices.toString()} description="Total Devices" textAlign="center" />
                        </EuiPanel>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiPanel>
                            <EuiStat
                                title={stats.online_devices.toString()}
                                description="Online"
                                titleColor="success"
                                textAlign="center"
                            />
                        </EuiPanel>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiPanel>
                            <EuiStat
                                title={stats.average_risk_score.toString()}
                                description="Avg Risk Score"
                                titleColor={stats.average_risk_score > 50 ? 'danger' : 'warning'}
                                textAlign="center"
                            />
                        </EuiPanel>
                    </EuiFlexItem>
                </EuiFlexGroup>
            )}

            <EuiSpacer size="l" />

            <EuiPanel>
                <EuiTitle size="s">
                    <h3>Device Inventory</h3>
                </EuiTitle>
                <EuiSpacer size="m" />
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
        </>
    );
};

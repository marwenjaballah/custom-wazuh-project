import os
import json
import uuid
from datetime import datetime
from opensearchpy import OpenSearch

# Configuration - same as Wazuh Cluster
HOST = 'wazuh1.indexer'
PORT = 9200
USER = 'admin'
PASSWORD = 'SecretPassword'

client = OpenSearch(
    hosts=[{'host': HOST, 'port': PORT}],
    http_compress=True,
    http_auth=(USER, PASSWORD),
    use_ssl=True,
    verify_certs=False,
    ssl_assert_hostname=False,
    ssl_show_warn=False,
)

def create_mock_alert(ip_address, level, description):
    """
    Creates a mock Wazuh alert in OpenSearch
    """
    index_name = f"wazuh-alerts-4.x-{datetime.now().strftime('%Y.%m.%d')}"
    
    alert = {
        "timestamp": datetime.now().isoformat(),
        "rule": {
            "level": level,
            "description": description,
            "id": str(uuid.uuid4())[:8],
            "firedtimes": 1
        },
        "agent": {
            "id": "001",
            "name": "iot-gateway"
        },
        "data": {
            "srcip": ip_address,
            "protocol": "mqtt"
        },
        "decoder": {
            "name": "mqtt-decoder"
        },
        "location": "network-traffic"
    }

    try:
        response = client.index(index=index_name, body=alert, refresh=True)
        print(f"✅ Alert created for {ip_address} (Level {level}): {description}")
    except Exception as e:
        print(f"❌ Failed to create alert: {e}")

if __name__ == "__main__":
    print("🚀 Simulating IoT Security Alerts...")
    
    # 1. High Risk Alert for Camera
    create_mock_alert("192.168.1.102", 15, "Unauthorized RTSP stream access detected")
    create_mock_alert("192.168.1.102", 12, "Brute force attack on camera login")
    
    # 2. Medium Risk Alert for Sensor
    create_mock_alert("192.168.1.101", 10, "Unexpected MQTT publish frequency")
    
    # 3. Multiple Low Risk Alerts for Thermostat
    create_mock_alert("192.168.1.103", 4, "Normal temperature threshold exceeded")
    create_mock_alert("192.168.1.103", 5, "Device ping failure (brief)")
    
    print("\nCheck the Peaksoft Dashboard now to see the updated Risk Scores!")

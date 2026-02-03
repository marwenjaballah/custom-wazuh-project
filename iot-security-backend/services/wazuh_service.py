import os
from opensearchpy import OpenSearch
from datetime import datetime, timedelta

class WazuhService:
    def __init__(self):
        self.host = os.getenv("OPENSEARCH_URL").replace("https://", "").replace("http://", "").split(":")[0]
        self.port = 9200
        self.user = os.getenv("OPENSEARCH_USERNAME")
        self.password = os.getenv("OPENSEARCH_PASSWORD")
        
        # Initialize OpenSearch client
        self.client = OpenSearch(
            hosts=[{'host': self.host, 'port': self.port}],
            http_compress=True,
            http_auth=(self.user, self.password),
            use_ssl=True,
            verify_certs=False,
            ssl_assert_hostname=False,
            ssl_show_warn=False,
        )

    def get_device_risk_data(self, ip_address):
        """
        Fetch recent alerts for a specific IP and calculate a risk score
        """
        if not ip_address:
            return 0
            
        try:
            # Search for alerts in the last 24 hours for this IP
            query = {
                "size": 100,
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"data.srcip": ip_address}},
                            {"range": {"timestamp": {"gte": "now-24h"}}}
                        ]
                    }
                }
            }
            
            response = self.client.search(
                body=query,
                index="wazuh-alerts-*"
            )
            
            alerts = response['hits']['hits']
            if not alerts:
                return 0
                
            # Calculate score based on rule levels
            # High level (12+) = 50 points
            # Mid level (7-11) = 20 points
            # Low level (3-6) = 5 points
            score = 0
            for hit in alerts:
                level = hit['_source']['rule']['level']
                if level >= 12:
                    score += 50
                elif level >= 7:
                    score += 20
                elif level >= 3:
                    score += 5
            
            # Cap at 100
            return min(score, 100)
            
        except Exception as e:
            print(f"Error fetching risk data: {e}")
            return 25  # Default risk if error


    def get_device_compliance_data(self, ip_address):
        """
        Fetch the latest SCA (Security Configuration Assessment) results for an IP
        Returns (score, status)
        """
        if not ip_address:
            return 100, "compliant"
            
        try:
            # In a real environment, we'd query the 'wazuh-monitoring-*' index for SCA summaries
            # For this prototype/demo, we'll correlate compliance with high-level alerts
            # If there are active industrial attacks, compliance drops
            query = {
                "size": 1,
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"data.srcip": ip_address}},
                            {"match": {"rule.groups": "iot"}}
                        ]
                    }
                },
                "sort": [{"timestamp": {"order": "desc"}}]
            }
            
            response = self.client.search(
                body=query,
                index="wazuh-alerts-*"
            )
            
            hits = response['hits']['hits']
            if not hits:
                return 100, "compliant"
                
            # If the last IoT event was level 14+, compliance is critically low
            last_alert_level = hits[0]['_source']['rule']['level']
            
            if last_alert_level >= 14:
                return 20, "non-compliant"
            elif last_alert_level >= 10:
                return 60, "warning"
            
            return 95, "compliant"
            
        except Exception as e:
            print(f"Error fetching compliance data: {e}")
            return 0, "unknown"

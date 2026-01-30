import os
from opensearchpy import OpenSearch
from datetime import datetime, timedelta

class WazuhService:
    def __init__(self):
        self.host = os.getenv("OPENSEARCH_URL", "https://wazuh1.indexer:9200").replace("https://", "").replace("http://", "").split(":")[0]
        self.port = 9200
        self.user = os.getenv("OPENSEARCH_USERNAME", "admin")
        self.password = os.getenv("OPENSEARCH_PASSWORD", "SecretPassword")
        
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

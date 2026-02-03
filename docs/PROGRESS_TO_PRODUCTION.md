# Peaksoft IoT: Prototype to Production Roadmap

This document summarizes the current progress (Objectives 7.1 - 7.3) and outlines the technical requirements to transition this prototype into an enterprise-grade production solution.

---

## ✅ Completed Prototype Milestones (Objectives 7.1 - 7.3)

| Feature | Objective | Implementation Status |
| :--- | :--- | :--- |
| **AI Vulnerability Management** | 7.1 | Dynamic Risk Scoring based on live Wazuh alerts. |
| **IIoT Protocol Analysis** | 7.2 | Custom decoders/rules for MQTT, Modbus, and CoAP transit. |
| **Automated Compliance** | 7.3 | SCA policies mapped to IEC 62443-4-2 & ETSI EN 303645. |
| **Unified Dashboard** | - | Rebranded Wazuh-native UI for IoT asset monitoring. |

---

## 🛠️ Current "Prototype" Limitations
To move fast, we used the following shortcuts which **must be changed** for production:
1.  **In-Memory Database**: Device list and risk history are lost on container restart.
2.  **Mock Telemetry**: Attacks are triggered via `simulate_alerts.py` rather than real physical sensors.
3.  **Hardcoded Credentials**: Secrets (OpenSearch passwords) are in environment variables/scripts.
4.  **No API Security**: The IoT Backend API is open without authentication.

---

## 🚀 Production Level Tasks (The "To-Do" List)

### 1. Persistence & Data Integrity
- [ ] **Migrate to PostgreSQL**: Replace the in-memory `devices_db` with a persistent SQL table.
- [ ] **Risk History Tracking**: Store risk scores over time to provide "Security Trend" graphs.

### 2. Enterprise Security & Auth
- [ ] **Wazuh-Backend Auth**: Implement JWT (JSON Web Token) authentication for the IoT API.
- [ ] **Vault Integration**: Move passwords and SSL keys into a secrets manager (e.g., HashiCorp Vault).

### 3. Real-World Integration
- [ ] **Physical Edge Collection**: Deploy Wazuh Agents or Fluent-bit collectors on real IIoT Gateways.
- [ ] **OpenSearch Tuning**: Optimize Indexer shards for high-volume IoT telemetry (millions of events/sec).

### 4. Advanced Analytics (Objectives 7.4 - 7.5)
- [ ] **Digital Twin Sync**: Connect the Backend to **Eclipse Ditto** to mirror physical device states.
- [ ] **Facility Orchestration**: Implement multi-tenancy to separate security views for different physical factories.

---
**Status**: Objective 7.3 (Prototype) Complete.
**Next Phase**: Digital Twin Integration (7.4) & Production Hardening.

# Peaksoft IoT: Production Readiness Blueprint

This document defines the critical requirements for transitioning the current **Peaksoft IoT Security Module** from its high-fidelity prototype (Objectives 7.1 - 7.5) to a resilient, enterprise-grade production environment.

---

## ✅ Current Strategic Achievement (Live Prototype)
We have successfully implemented the core logic for the following strategic objectives:
- **7.1 AI Vulnerability Management**: Dynamic risk scoring based on live telemetry.
- **7.2 IIoT Protocols**: Custom decoders/rules for MQTT, Modbus, and CoAP.
- **7.3 Automated Compliance**: SCA policies mapping to IEC 62443 & ETSI EN 303645.
- **7.4 Digital Twin**: Side-by-side virtual mirror with "What-If" predictive analysis.
- **7.5 Global Multi-Facility**: Location-aware asset management and filtering.

---

## 🏗️ Production Phase 1: Robust Persistence
The current system uses an in-memory database. For production, the following is required:
- [ ] **PostgreSQL Integration**: Migrate device inventory and risk metadata to a persistent SQL backend.
- [ ] **Historical Analytics**: Implement time-series storage to track security trends over months/years.
- [ ] **Asset Backup**: Automated daily snapshots of the device configuration database.

## 🛡️ Production Phase 2: Zero-Trust Security
Prototype shortcuts (hardcoded scripts and open APIs) must be hardened:
- [ ] **API Authentication (JWT)**: Secure the IoT Backend so only authorized dashboard sessions can modify assets.
- [ ] **Secrets Management**: Move OpenSearch/API credentials from environmental variables to a dedicated Secrets Vault.
- [ ] **SSL/TLS Hardening**: Enforce HTTPS for all internal communication between the Backend, Dashboard, and Indexer.

## 📡 Production Phase 3: Real Ingestion
Replace simulations with physical infrastructure:
- [ ] **Agent Deployment**: Roll out Wazuh Agents to all physical IIoT Gateways.
- [ ] **Remote Syslog**: Configure Wazuh Manager to ingest UDP/514 traffic from proprietary sensors.
- [ ] **MQTT/Modbus Bridges**: Deploy the custom protocol bridges in the industrial DMZ.

## 📈 Production Phase 4: Scaling & Reliability
Ensure the system scales across thousands of devices:
- [ ] **Indexer Sharding**: Optimize OpenSearch shard allocation for high-velocity IoT logs.
- [ ] **ILM Policies**: Set up Index Lifecycle Management to automatically roll over and delete old security logs.
- [ ] **CI/CD Pipeline**: Automated deployment for the custom Dashboard plugin and Backend container.

---
**Status**: Strategic Prototype Complete.
**Next Immediate Step**: Phase 1 (PostgreSQL Migration).

# 🎓 Intern Project: Peaksoft IIoT & AI Security

Welcome to the **Peaksoft IoT Security** project! This guide outlines key tasks and learning paths to help you contribute to our AI-driven security orchestration layer built on Wazuh.

---

## 🛠️ Getting Started (Week 1)
- **Environment Setup**: Familiarize yourself with the [Architecture Guide](./PEAKSOFT_IOT_GUIDE.md).
- **Core Tools**: Install Docker and learn basic CLI operations to manage the Wazuh stack (`docker-compose`).
- **Wazuh 101**: Complete the [Wazuh basic training](https://documentation.wazuh.com/) to understand how rules and decoders work.

---

## 🛰️ Track A: IIoT Protocol Analysis (Objective 7.2)
*Goal: Enable Wazuh to "speak" the language of industrial devices.*

- [ ] **Research MQTT Security**: Identify common attack patterns in MQTT (unauthorized topics, massive payloads).
- [ ] **Custom Decoders**: Draft a new Wazuh decoder for **Modbus TCP** logs to extract function codes and target registers.
- [ ] **Threat Detection Rules**: Write XML rules in `wazuh-manager` to trigger alerts when an unconventional command is sent to a PLC (Programmable Logic Controller).

---

## 🧠 Track B: AI & Data Engineering (Objectives 7.1 & 7.4)
*Goal: Turn raw security logs into intelligent risk scores.*

- [ ] **Database Migration**: Move our current `devices_db` in the [FastAPI backend](file:///home/viconee/work/wazuh-custom-project/iot-security-backend/api/v1/devices.py) from in-memory to a persistent **PostgreSQL** database.
- [ ] **Anomaly Detection Script**: Develop a Python utility using `Scikit-learn` that analyzes device frequency logs to detect "heartbeat" anomalies (devices going silent or communicating too fast).
- [ ] **OpenSearch Enrichment**: Enhance the `WazuhService` to fetch not just alert counts, but the most frequent "Top 5" threats for a specific device.

---

## 🛡️ Track C: Compliance & UI (Objective 7.3)
*Goal: Visualize security health according to international standards.*

- [ ] **IEC 62443 Mapping**: Research the **IEC 62443-4-2** standard and identify 5 technical controls we can check using Wazuh SCA (Security Configuration Assessment).
- [ ] **SCA Policy Creation**: Draft a `.yml` policy for an Ubuntu-based IoT Gateway that checks for weak SSH ciphers or open Telnet ports.
- [ ] **UI Detail View**: Add a "Device Details" page to the [Dashboard Plugin](file:///home/viconee/work/wazuh-custom-project/wazuh-dashboard/plugins/iot-security/public/components/DeviceTable.tsx) using EUI components to show the compliance history of a single asset.

---

## 📚 Recommended Learning Resources
- **Wazuh Ruleset**: [Documentation](https://documentation.wazuh.com/current/user-manual/ruleset/index.html)
- **FastAPI Guide**: [Learning Path](https://fastapi.tiangolo.com/learn/)
- **Elastic UI (EUI)**: [Component Gallery](https://elastic.github.io/eui/#/)
- **IIoT Security**: [OWASP IoT Top 10](https://owasp.org/www-project-iot-top-10/)

---
**Mentor**: [Your Name]
**Project**: Peaksoft IoT Security Module

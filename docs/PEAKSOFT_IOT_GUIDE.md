# 🚀 Peaksoft IoT Security: Master Guide

This document is your single source of truth for the **Peaksoft IoT Cybersecurity Management Solution**. It covers architecture, development, and the future roadmap.

---

## 🏗️ Architecture Visualization

![Peaksoft IoT Dashboard Mockup](file:///home/viconee/.gemini/antigravity/brain/4b591fa5-b1ce-415d-a448-27a6a89f2516/peaksoft_iot_dashboard_visualization_1769781344659.png)

### The Three-Layer Stack
1.  **Edge Layer**: IoT devices (Sensors, Cameras, Controllers) sending telemetry via Syslog or Wazuh Agents.
2.  **Security Orchestration Layer**: A multi-node **Wazuh** cluster processing events and storing alerts in **OpenSearch**.
3.  **Peaksoft Management Layer**: 
    - **Custom Backend**: A Python (FastAPI) service managing device inventory and risk scores.
    - **Dashboard Plugin**: A React-based extension that integrates Peaksoft management directly into the Wazuh UI.

---

## 🛠️ Development Workflow

### 1. Dashboard & Plugin Development
When making changes to the `iot-security` plugin source:
- **Location**: `wazuh-dashboard/plugins/iot-security`
- **Bootstrap Command**:
  ```bash
  cd wazuh-dashboard
  yarn osd:bootstrap
  ```
- **Build Plugin**:
  ```bash
  cd plugins/iot-security
  yarn build
  ```

### 2. IoT Backend Development
- **Location**: `iot-security-backend/`
- **Run Locally**:
  ```bash
  cd iot-security-backend
  pip install -r requirements.txt
  python main.py
  ```

### 3. Wazuh Infrastructure
- **Location**: `wazuh-docker/multi-node/`
- **Start Stack**: `docker-compose up -d`
- **Rebrand Script**: Use the custom `./setup.sh` in the root for a full automated build.

---

## 🗺️ Project Roadmap (Strategic Objectives)

Based on your strategic security goals:

| Phase | Goal | Key Tools |
| :--- | :--- | :--- |
| **Phase 1** | **AI Vulnerability Management** | Wazuh Vulnerability Detector + Scikit-learn (AI Score) |
| **Phase 2** | **IoT Protocol Analysis** | Zeek / Suricata (MQTT, Modbus, CoAP decoders) |
| **Phase 3** | **Compliance (IEC 62443)** | Wazuh SCA (Automated Hardening Policies) |
| **Phase 4** | **Digital Twin Simulation** | Eclipse Ditto (Mirroring device states for testing) |
| **Phase 5** | **Multi-Facility Rollout** | Wazuh Cluster + Ansible (Automated Deployment) |

---

## ⚒️ Recommended Open-Source Toolkit

- **[Wazuh](https://wazuh.com/)**: Core SIEM/XDR platform.
- **[FastAPI](https://fastapi.tiangolo.com/)**: High-performance backend API.
- **[Zeek](https://zeek.org/)**: Advanced network analysis (IoT Protocols).
- **[Eclipse Ditto](https://www.eclipse.org/ditto/)**: Digital Twin framework.
- **[Scikit-learn](https://scikit-learn.org/)**: AI/ML risk modeling.

---

## ❓ Common Troubleshooting

- **Yarn Command Not Found**: Use `yarn osd:bootstrap` inside the `wazuh-dashboard` directory instead of just `yarn bootstrap`.
- **Docker Naming Conflicts**: Run `docker rm -f $(docker ps -aq)` to clear old containers if the stack fails to start.
- **Certificate Errors**: Re-run the cert generator:
  ```bash
  cd wazuh-docker/multi-node
  docker-compose -f generate-indexer-certs.yml run --rm generator
  ```

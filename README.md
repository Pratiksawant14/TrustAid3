# Decentralized Aid Platform

A proof-of-concept decentralized application (dApp) built on the Ethereum blockchain to provide a transparent, secure, and efficient platform for humanitarian aid. This project aims to solve the problem of corruption and inefficiency in traditional donation systems by ensuring that funds for specific crises are delivered directly to verified beneficiaries.

---

## 📋 Table of Contents
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## ❓ The Problem

Traditional aid and donation platforms often suffer from a lack of transparency, high administrative overhead, and delays. Donors are rarely able to track their specific contributions to the intended recipients, and a significant portion of aid can be lost to corruption and operational costs.

## ✨ The Solution

This platform leverages blockchain technology to create a trustless ecosystem. Donations for specific, publicly listed campaigns (e.g., "Punjab Flood Relief") are sent to dedicated smart contracts. An independent network of verifiers (NGOs or appointed reviewers) vets and approves beneficiaries. An automated Rule Engine then distributes the collected funds directly from the smart contract to the verified individuals, with every transaction being publicly auditable on the blockchain.

---

## 🚀 Key Features

* **Campaign-Based Donations**: Donors contribute to specific, segregated funds for different crises, ensuring their money is used for its intended purpose.
* **Beneficiary Verification System**: A dedicated portal for NGOs or verifiers to review and approve aid applicants, adding a layer of trust and accountability.
* **Transparent Fund Distribution**: An automated backend Rule Engine triggers fund distribution via a smart contract, eliminating intermediaries.
* **Web3 Wallet Integration**: Seamlessly connects with MetaMask for secure and easy donations.
* **Immutable Audit Trail**: Every donation and distribution is a transaction recorded on the blockchain, publicly verifiable via Etherscan.

---

## 🏗️ System Architecture

The platform is built on a three-tier architecture: a frontend dApp for user interaction, a backend server for automated logic, and a smart contract on the blockchain for trust and execution.

```mermaid
graph TD
    subgraph "Users"
        A[1. Refugee]
        B[2. Verifier / NGO]
        C[3. Donor]
    end

    subgraph "Platform Interfaces (Frontend)"
        D{Main User dApp (React)}
        E{Verifier Portal}
    end

    subgraph "Platform Core (Off-Chain Services)"
        F[Identity & Profile Service]
        G[Verification Service]
        H[Campaign Management Service]
        I[Platform Rule Engine]
    end

    subgraph "Blockchain Trust Layer (On-Chain)"
        J["Campaign Smart Contracts"]
        L[Immutable Ledger / Audit Trail]
    end
    
    A -- "Signs up via" --> D --> F
    B -- "Logs into" --> E --> G -- "Verifies profile in" --> F
    C -- "Donates via" --> D --> J
    I -- "1. Fetches verified refugees from" --> F
    I -- "2. Reads funds from" --> J
    I -- "3. Executes distribution via" --> J --> L
```

---

## 💻 Technology Stack

* **Blockchain**: Solidity, Remix IDE, Sepolia Testnet, MetaMask
* **Frontend**: React, Ethers.js, Material-UI (MUI)
* **Backend**: Node.js, Express.js

---

## 🔧 Getting Started

Follow these instructions to set up and run the project locally for development and testing.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or later)
* [MetaMask](https://metamask.io/) browser extension
* Sepolia ETH in your MetaMask wallet (from a faucet)

### 1. Deploy the Smart Contract
1.  Open the `Campaign.sol` code in the [Remix IDE](https://remix.ethereum.org/).
2.  Compile the contract with a compatible Solidity version.
3.  Deploy the contract to the **Sepolia Testnet**, providing the constructor arguments (`_title`, `initialOwner`).
4.  **Important**: Copy the deployed **Contract Address** and the **ABI**.

### 2. Setup the Backend
1.  Navigate to the `backend-engine` directory.
    ```bash
    cd backend-engine
    ```
2.  Install the dependencies.
    ```bash
    npm install
    ```
3.  Create a `.env` file in this folder and add your configuration.
    ```env
    CONTRACT_ADDRESS="YOUR_CONTRACT_ADDRESS"
    CONTRACT_ABI='[...YOUR_ABI...]'
    PRIVATE_KEY="YOUR_TEST_ACCOUNT_PRIVATE_KEY"
    SEPOLIA_RPC_URL="YOUR_ALCHEMY_SEPOLIA_RPC_URL"
    ```
4.  Start the server.
    ```bash
    node server.js
    ```
    Your backend should now be running on `http://localhost:3001`.

### 3. Setup the Frontend
1.  In a **new terminal**, navigate to the `frontend-dapp` directory.
    ```bash
    cd frontend-dapp
    ```
2.  Install the dependencies.
    ```bash
    npm install
    ```
3.  Fill in the `CONTRACT_ADDRESS` and `CONTRACT_ABI` variables at the top of the `src/App.js` file with the details from step 1.
4.  Start the React application.
    ```bash
    npm start
    ```
    Your frontend should now be running and open in a browser tab at `http://localhost:3000`.

---

## 🌐 Usage

1.  **Verification**: A verifier/NGO would use a dedicated interface to approve applicants. (This is simulated by the backend's rule engine).
2.  **Donation**: A donor connects their MetaMask wallet to the React app, selects a campaign, and donates ETH. The transaction is confirmed and the smart contract balance increases.
3.  **Distribution**: An administrator triggers the backend's `/distribute` endpoint (e.g., via Postman). The Rule Engine fetches the list of verified beneficiaries and calls the smart contract to distribute the funds.
4.  **Transparency**: Any user can take the contract address and verify all donation and distribution transactions on [Sepolia Etherscan](https://sepolia.etherscan.io/).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature suggestions.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

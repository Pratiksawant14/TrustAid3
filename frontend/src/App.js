import { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import './App.css';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DonorDashboard from './components/DonorDashboard';
import ReceiverDashboard from './components/ReceiverDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';

export const AppContext = createContext(null);

// Define a dark theme for the UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212', paper: '#1e1e1e' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: { fontWeight: 700 }
  }
});

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = "0xC0b5d86EE90dA797B7a92D3baaaeaB9088701d21";
const CONTRACT_ABI = [ 
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "distributeFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "donate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DonationReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsDistributed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "campaignTitle",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "donors",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectWallet",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	} ];

function App() {
  // Existing state hooks
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [donationAmount, setDonationAmount] = useState("");
  // <--- Added state for user (initially null)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          const signer = await web3Provider.getSigner();
          const campaignContract = new ethers.Contract(
            CONTRACT_ADDRESS, CONTRACT_ABI, signer
          );
          setContract(campaignContract);
          // Load initial balance
          const currentBalance = await campaignContract.getBalance();
          setBalance(ethers.formatEther(currentBalance));
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    connectWallet();
  }, []);

  const renderDashboard = () => {
    if (!user) return <Navigate to="/" />;
    switch (user.role) {
      case 'donor':
        return <DonorDashboard />;
      case 'receiver':
        return <ReceiverDashboard />;
      case 'reviewer':
        return <ReviewerDashboard />;
      default:
        return <Navigate to="/" />;
    }
  };  // <--- Added missing closing brace for renderDashboard

  const handleDonate = async () => {
    if (!contract || !donationAmount) {
      alert("Please enter a donation amount.");
      return;
    }
    try {
      const amountInWei = ethers.parseEther(donationAmount);
      const tx = await contract.donate({ value: amountInWei });
      await tx.wait();
      alert("Donation successful!");
      // Refresh balance
      const currentBalance = await contract.getBalance();
      setBalance(ethers.formatEther(currentBalance));
      setDonationAmount("");
    } catch (error) {
      console.error("Donation failed", error);
      alert("Donation failed.");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppContext.Provider value={{ user, setUser, provider, setProvider, contract, setContract }}>
        <Router>
          <Box className="App">
            <Routes>
              <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={renderDashboard()} />
            </Routes>
          </Box>
        </Router>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;

import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { AppContext } from '../App';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = "0xC0b5d86EE90dA797B7a92D3baaaeaB9088701d21"; // Your Contract Address
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
	}
];

function LoginPage() {
  const { setUser, setProvider, setContract } = useContext(AppContext);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this platform.");
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();
      const campaignContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setProvider(web3Provider);
      setContract(campaignContract);

      // In a real app, you'd fetch the user's role from a database or smart contract.
      // Here, we'll prompt them to sign up if they are a new user.
      // For this example, let's assume login is for existing users and redirect to signup for new ones.
      alert("Wallet connected! If you are a new user, please sign up.");
      // We don't set user yet, forcing them to go to signup to choose a role
      // In a real app:
      // const userRole = await campaignContract.getUserRole(address);
      // if (userRole) {
      //   setUser({ address, role: userRole });
      //   navigate('/dashboard');
      // } else {
      //   navigate('/signup');
      // }

    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          AidChain
        </Typography>
        <Typography component="p" variant="subtitle1" align="center" sx={{ mb: 3 }}>
          A Transparent Donation Platform
        </Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={connectWallet}
            sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            Connect Wallet to Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            New to the platform?{' '}
            <Link to="/signup" style={{ color: '#90caf9' }}>
              Create an account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
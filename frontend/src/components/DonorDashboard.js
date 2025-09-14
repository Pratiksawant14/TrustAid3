import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../App';
import {
  Container, Typography, Box, Paper, TextField, Button, Grid,
  Card, CardContent, CardActions, LinearProgress, AppBar, Toolbar
} from '@mui/material';

// --- Mock Data for Campaigns ---
const campaigns = [
  {
    id: 1,
    title: "Punjab Flood Relief",
    description: "Support families affected by the recent devastating floods in Punjab. Funds will provide shelter, food, and medical supplies.",
    goal: 50,
    raised: 18.7,
  },
  {
    id: 2,
    title: "Education for Underprivileged Children",
    description: "Help provide books, uniforms, and school supplies for children in rural areas, ensuring they get the education they deserve.",
    goal: 25,
    raised: 5.2,
  },
];

function DonorDashboard() {
  const { user, contract } = useContext(AppContext);
  const [balance, setBalance] = useState("0");
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBalance = async () => {
      if (contract) {
        try {
          const currentBalance = await contract.getBalance();
          setBalance(ethers.formatEther(currentBalance));
        } catch (error) {
          console.error("Could not fetch balance:", error);
        }
      }
    };
    getBalance();
  }, [contract]);

  const handleDonate = async () => {
    if (!contract || !donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    setLoading(true);
    try {
      const amountInWei = ethers.parseEther(donationAmount);
      const tx = await contract.donate({ value: amountInWei });
      await tx.wait(); // Wait for the transaction to be mined
      alert("Donation successful! Thank you for your generosity.");
      const currentBalance = await contract.getBalance();
      setBalance(ethers.formatEther(currentBalance));
      setDonationAmount("");
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Donation failed. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Donor Dashboard
          </Typography>
          <Typography variant="body2">Welcome, {user?.name || 'Donor'}!</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 4, background: 'rgba(255, 255, 255, 0.05)' }}>
          <Typography variant="h5" gutterBottom>
            Total Funds Raised in Contract
          </Typography>
          <Typography variant="h3">{parseFloat(balance).toFixed(4)} ETH</Typography>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Active Campaigns
        </Typography>
        <Grid container spacing={4}>
          {campaigns.map((campaign) => (
            <Grid item key={campaign.id} xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {campaign.title}
                  </Typography>
                  <Typography>
                    {campaign.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={(campaign.raised / campaign.goal) * 100} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {campaign.raised} ETH raised of {campaign.goal} ETH goal
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <TextField
                    label="Amount in ETH"
                    variant="outlined"
                    size="small"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={handleDonate}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Donate'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default DonorDashboard;
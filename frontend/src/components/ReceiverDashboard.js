import { useContext } from 'react';
import { AppContext } from '../App';
import { Container, Typography, Box, Paper, Button, AppBar, Toolbar, Grid, TextField, Alert, AlertTitle } from '@mui/material';

function ReceiverDashboard() {
  const { user } = useContext(AppContext);

  // Mock data for receiver's status
  const receiverStatus = {
    verified: true,
    needs: "Food supplies, warm clothing, and temporary shelter.",
    fundsReceived: "1.25 ETH",
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Your information has been submitted for verification.");
  };
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Receiver Dashboard
          </Typography>
          <Typography variant="body2">Welcome, {user?.name || 'Receiver'}!</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Your Profile & Status
          </Typography>

          {receiverStatus.verified ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Verified</AlertTitle>
              Your profile has been successfully verified by an NGO. You are now eligible to receive aid.
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>Pending Verification</AlertTitle>
              Your profile is under review. You will be notified once the verification is complete.
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Funds Received</Typography>
              <Typography variant="h4" color="primary">{receiverStatus.fundsReceived}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{mb: 2}}>Your Details</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Describe Your Needs"
                        defaultValue={receiverStatus.needs}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Wallet Address for Aid"
                        defaultValue={user?.address}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained">Update Information</Button>
                </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default ReceiverDashboard;
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import {
  Button, Container, Typography, Box, Paper, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, TextField
} from '@mui/material';

function SignupPage() {
  const { setUser } = useContext(AppContext);
  const [role, setRole] = useState('donor');
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    
    if (!window.ethereum?.selectedAddress) {
        alert("Please connect your wallet first from the login page.");
        navigate('/');
        return;
    }

    const userAddress = window.ethereum.selectedAddress;

    // In a real app, you would register this user and their role on your backend or smart contract.
    // For this demo, we just set the state locally.
    console.log(`Signing up ${name} (${userAddress}) as a ${role}`);
    setUser({ address: userAddress, role, name });
    navigate('/dashboard');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        <Typography component="h1" variant="h5">
          Create Your Account
        </Typography>
        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">I am a...</FormLabel>
            <RadioGroup
              row
              aria-label="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel value="donor" control={<Radio />} label="Donor" />
              <FormControlLabel value="receiver" control={<Radio />} label="Receiver" />
              <FormControlLabel value="reviewer" control={<Radio />} label="Reviewer" />
            </RadioGroup>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign Up & Enter
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignupPage;
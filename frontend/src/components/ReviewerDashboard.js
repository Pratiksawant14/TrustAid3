import { useContext } from 'react';
import { AppContext } from '../App';
import {
  Container, Typography, Box, Paper, Button, AppBar, Toolbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

// Mock data for verification requests
const requests = [
  { id: 1, name: 'Aisha Sharma', address: '0x1234...abcd', details: 'Needs urgent medical supplies and food for a family of 4.', status: 'Pending' },
  { id: 2, name: 'Baljeet Singh', address: '0x5678...efgh', details: 'Lost home in the flood, requires funds for temporary shelter.', status: 'Pending' },
  { id: 3, name: 'Fatima Khan', address: '0x9abc...ijkl', details: 'Single mother seeking support for her children\'s education.', status: 'Verified' },
];

function ReviewerDashboard() {
  const { user } = useContext(AppContext);

  const handleApprove = (id) => {
    alert(`Request ID ${id} has been approved.`);
    // Here you would call a smart contract function or API to update the status
  };

  const handleReject = (id) => {
    alert(`Request ID ${id} has been rejected.`);
    // Handle rejection logic
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Reviewer Dashboard
          </Typography>
          <Typography variant="body2">Welcome, {user?.name || 'Reviewer'}!</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Verification Requests
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Wallet Address</TableCell>
                  <TableCell>Needs Details</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.name}</TableCell>
                    <TableCell>{req.address}</TableCell>
                    <TableCell>{req.details}</TableCell>
                    <TableCell align="center">{req.status}</TableCell>
                    <TableCell align="center">
                      {req.status === 'Pending' && (
                        <Box>
                          <Button variant="contained" color="success" size="small" sx={{ mr: 1 }} onClick={() => handleApprove(req.id)}>Approve</Button>
                          <Button variant="contained" color="error" size="small" onClick={() => handleReject(req.id)}>Reject</Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </>
  );
}

export default ReviewerDashboard;
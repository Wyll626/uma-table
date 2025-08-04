'use client';

import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { AdminPanelSettings, Visibility, VisibilityOff, Logout } from '@mui/icons-material';
import AdminPanel from '@/components/AdminPanel';
import LoginDialog from '@/components/LoginDialog';
import DataTable from '@/components/DataTable';

export default function AdminPage() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = () => {
    // Increment refresh trigger to cause DataTable to refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleShowAdminPanel = () => {
    if (isAuthenticated) {
      setShowAdminPanel(!showAdminPanel);
    } else {
      setShowLoginDialog(true);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLoginDialog(false);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAdminPanel(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundImage: 'url(/uma-background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Box sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        minHeight: '100vh',
        p: 2
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" sx={{ color: 'black', fontWeight: 'bold' }}>
            Uma Musume Racing Championship
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isAuthenticated && (
              <Button
                variant="outlined"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ color: 'error.main', borderColor: 'error.main' }}
              >
                Logout
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={showAdminPanel ? <VisibilityOff /> : <AdminPanelSettings />}
              onClick={handleShowAdminPanel}
              sx={{ 
                backgroundColor: showAdminPanel ? 'error.main' : 'primary.main',
                '&:hover': {
                  backgroundColor: showAdminPanel ? 'error.dark' : 'primary.dark'
                }
              }}
            >
              {showAdminPanel ? 'Hide Admin Panel' : 'Show Admin Panel'}
            </Button>
          </Box>
        </Box>

        {/* Admin Panel */}
        {showAdminPanel && isAuthenticated && (
          <Paper sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <AdminPanel onDataChange={handleDataChange} />
          </Paper>
        )}

        {/* Racing Tables */}
        <DataTable refreshTrigger={refreshTrigger} />

        {/* Login Dialog */}
        <LoginDialog
          open={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
          onLogin={handleLogin}
        />
      </Box>
    </Box>
  );
} 
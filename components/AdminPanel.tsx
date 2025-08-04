'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { Trainer, Session, Race, RaceResult } from '@/types';

interface AdminPanelProps {
  onDataChange: () => void;
}

export default function AdminPanel({ onDataChange }: AdminPanelProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [trainerDialog, setTrainerDialog] = useState(false);
  const [sessionDialog, setSessionDialog] = useState(false);
  const [raceDialog, setRaceDialog] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editingRace, setEditingRace] = useState<Race | null>(null);

  // Form states
  const [trainerForm, setTrainerForm] = useState({ name: '' });
  const [sessionForm, setSessionForm] = useState({ name: '', startDate: '', endDate: '', totalRaces: 5 });
  const [raceForm, setRaceForm] = useState({ 
    sessionId: '', 
    raceNumber: 1, 
    results: [] as RaceResult[] 
  });

  // Form error states
  const [trainerErrors, setTrainerErrors] = useState<{ name?: string }>({});
  const [sessionErrors, setSessionErrors] = useState<{ name?: string; startDate?: string; totalRaces?: string }>({});
  const [raceErrors, setRaceErrors] = useState<{ [key: string]: string }>({});

  // Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trainersRes, racesRes] = await Promise.all([
        fetch('/api/trainers'),
        fetch('/api/races')
      ]);
      
      const trainersData = await trainersRes.json();
      const racesData = await racesRes.json();
      
      setTrainers(trainersData.trainers);
      setSessions(racesData.sessions);
      setRaces(racesData.sessions.flatMap((s: Session) => s.races));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  // Calculate points based on positions using F1-style point system
  const positionToPoints = (position: number): number => {
    switch (position) {
      case 1: return 25;
      case 2: return 18;
      case 3: return 15;
      case 4: return 12;
      case 5: return 10;
      case 6: return 8;
      case 7: return 6;
      case 8: return 4;
      case 9: return 2;
      case 10: return 1;
      default: return 0;
    }
  };

  // Trainer CRUD
  const handleTrainerSubmit = async () => {
    try {
      // Clear previous errors
      setTrainerErrors({});

      if (!trainerForm.name.trim()) {
        setTrainerErrors({ name: 'Trainer name is required' });
        return;
      }

      const url = editingTrainer ? `/api/trainers/${editingTrainer.id}` : '/api/trainers';
      const method = editingTrainer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainerForm)
      });

      if (response.ok) {
        showNotification(
          editingTrainer ? 'Trainer updated successfully!' : 'Trainer added successfully!',
          'success'
        );
        setTrainerDialog(false);
        setEditingTrainer(null);
        setTrainerForm({ name: '' });
        setTrainerErrors({});
        fetchData();
        onDataChange();
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to save trainer', 'error');
      }
    } catch (error) {
      showNotification('Error saving trainer', 'error');
    }
  };

  const handleTrainerEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setTrainerForm({ name: trainer.name });
    setTrainerDialog(true);
  };

  const handleTrainerDelete = async (trainerId: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        const response = await fetch(`/api/trainers/${trainerId}`, { method: 'DELETE' });
        if (response.ok) {
          showNotification('Trainer deleted successfully!', 'success');
          fetchData();
          onDataChange();
        } else {
          showNotification('Failed to delete trainer', 'error');
        }
      } catch (error) {
        showNotification('Error deleting trainer', 'error');
      }
    }
  };

  // Session CRUD
  const handleSessionSubmit = async () => {
    try {
      // Clear previous errors
      setSessionErrors({});

      const errors: { name?: string; startDate?: string; totalRaces?: string } = {};

      if (!sessionForm.name.trim()) {
        errors.name = 'Session name is required';
      }

      if (!sessionForm.startDate) {
        errors.startDate = 'Start date is required';
      }

      if (!sessionForm.totalRaces || sessionForm.totalRaces < 1) {
        errors.totalRaces = 'Total races must be at least 1';
      }

      if (Object.keys(errors).length > 0) {
        setSessionErrors(errors);
        return;
      }

      const url = editingSession ? `/api/sessions/${editingSession.id}` : '/api/sessions';
      const method = editingSession ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionForm)
      });

      if (response.ok) {
        showNotification(
          editingSession ? 'Session updated successfully!' : 'Session added successfully!',
          'success'
        );
        setSessionDialog(false);
        setEditingSession(null);
        setSessionForm({ name: '', startDate: '', endDate: '', totalRaces: 5 });
        setSessionErrors({});
        fetchData();
        onDataChange();
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to save session', 'error');
      }
    } catch (error) {
      showNotification('Error saving session', 'error');
    }
  };

  const handleSessionEdit = (session: Session) => {
    setEditingSession(session);
    setSessionForm({ 
      name: session.name, 
      startDate: session.startDate, 
      endDate: session.endDate || '', 
      totalRaces: session.totalRaces 
    });
    setSessionDialog(true);
  };

  const handleSessionDelete = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
        if (response.ok) {
          showNotification('Session deleted successfully!', 'success');
          fetchData();
          onDataChange();
        } else {
          showNotification('Failed to delete session', 'error');
        }
      } catch (error) {
        showNotification('Error deleting session', 'error');
      }
    }
  };

  // Race CRUD
  const handleRaceSubmit = async () => {
    try {
      // Clear previous errors
      setRaceErrors({});

      // Validate race form
      const errors: { [key: string]: string } = {};
      const allErrors: string[] = [];

      if (!raceForm.sessionId) {
        allErrors.push('Session is required');
      }
      if (!raceForm.raceNumber || raceForm.raceNumber < 1) {
        allErrors.push('Race number must be at least 1');
      }

      // Check for duplicate race number in the selected session
      if (raceForm.sessionId && raceForm.raceNumber) {
        const selectedSession = sessions.find(s => s.id === raceForm.sessionId);
        if (selectedSession) {
          const existingRace = selectedSession.races.find(r => r.raceNumber === raceForm.raceNumber);
          if (existingRace && (!editingRace || existingRace.id !== editingRace.id)) {
            allErrors.push(`Race ${raceForm.raceNumber} already exists in ${selectedSession.name}`);
          }
        }
      }

      // Check if all trainers have positions
      const trainersWithoutPositions = trainers.filter(trainer => {
        const result = raceForm.results.find(r => r.trainerId === trainer.id);
        return !result || result.position <= 0;
      });

      if (trainersWithoutPositions.length > 0) {
        const trainerNames = trainersWithoutPositions.map(t => t.name).join(', ');
        allErrors.push(`Please enter positions for: ${trainerNames}`);
      } else {
        // Check for duplicate positions
        const positions = raceForm.results.map(r => r.position);
        const uniquePositions = new Set(positions);
        if (positions.length !== uniquePositions.size) {
          // Find which trainers have duplicate positions
          const positionGroups: { [position: number]: string[] } = {};
          raceForm.results.forEach(result => {
            if (!positionGroups[result.position]) {
              positionGroups[result.position] = [];
            }
            const trainer = trainers.find(t => t.id === result.trainerId);
            if (trainer) {
              positionGroups[result.position].push(trainer.name);
            }
          });
          
          const duplicatePositions = Object.entries(positionGroups)
            .filter(([pos, trainers]) => trainers.length > 1)
            .map(([pos, trainers]) => `Position ${pos}: ${trainers.join(', ')}`);
          
          allErrors.push(`Duplicate positions: ${duplicatePositions.join('; ')}`);
        }
      }

      if (allErrors.length > 0) {
        errors.general = allErrors.join('. ');
      }

      setRaceErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      // Calculate points based on positions using F1-style point system
      const positionToPoints = (position: number): number => {
        switch (position) {
          case 1: return 25;
          case 2: return 18;
          case 3: return 15;
          case 4: return 12;
          case 5: return 10;
          case 6: return 8;
          case 7: return 6;
          case 8: return 4;
          case 9: return 2;
          case 10: return 1;
          default: return 0;
        }
      };

      // Update results with calculated points and filter out invalid entries
      const resultsWithPoints = raceForm.results
        .filter(result => result.position > 0) // Only include results with valid positions
        .map(result => ({
          ...result,
          points: positionToPoints(result.position)
        }));

      const url = editingRace ? `/api/races/${editingRace.id}` : '/api/races';
      const method = editingRace ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...raceForm,
          results: resultsWithPoints
        })
      });

      if (response.ok) {
        showNotification(
          editingRace ? 'Race updated successfully!' : 'Race added successfully!',
          'success'
        );
        setRaceDialog(false);
        setEditingRace(null);
        setRaceForm({ sessionId: '', raceNumber: 1, results: [] });
        setRaceErrors({});
        fetchData();
        onDataChange();
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to save race', 'error');
      }
    } catch (error) {
      showNotification('Error saving race', 'error');
    }
  };

  const handleRaceEdit = (race: Race) => {
    setEditingRace(race);
    
    // Create results array with all trainers, using existing race results where available
    const results = trainers.map(trainer => {
      const existingResult = race.results.find(r => r.trainerId === trainer.id);
      return {
        trainerId: trainer.id,
        position: existingResult ? existingResult.position : 0,
        points: 0 // We'll calculate this automatically
      };
    });
    
    setRaceForm({ 
      sessionId: race.sessionId, 
      raceNumber: race.raceNumber, 
      results
    });
    setRaceDialog(true);
  };

  const handleRaceDelete = async (raceId: string) => {
    if (window.confirm('Are you sure you want to delete this race?')) {
      try {
        const response = await fetch(`/api/races/${raceId}`, { method: 'DELETE' });
        if (response.ok) {
          showNotification('Race deleted successfully!', 'success');
          fetchData();
          onDataChange();
        } else {
          showNotification('Failed to delete race', 'error');
        }
      } catch (error) {
        showNotification('Error deleting race', 'error');
      }
    }
  };

  if (loading) {
    return <Typography>Loading admin panel...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Admin Panel
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              const dataStr = JSON.stringify(trainers, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'trainers.json';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            startIcon={<DownloadIcon />}
          >
            Download Trainers
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const dataStr = JSON.stringify(races, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'races.json';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            startIcon={<DownloadIcon />}
          >
            Download Races
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Trainers Section */}
        <Box sx={{ flex: { xs: 1, md: 1/3 } }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="black">Trainers</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingTrainer(null);
                  setTrainerForm({ name: '' });
                  setTrainerDialog(true);
                }}
              >
                Add Trainer
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell>{trainer.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={trainer.active ? 'Active' : 'Inactive'} 
                          color={trainer.active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleTrainerEdit(trainer)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleTrainerDelete(trainer.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Sessions Section */}
        <Box sx={{ flex: { xs: 1, md: 1/3 } }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="black">Sessions</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingSession(null);
                  setSessionForm({ name: '', startDate: '', endDate: '', totalRaces: 5 });
                  setSessionDialog(true);
                }}
              >
                Add Session
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Races</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.name}</TableCell>
                      <TableCell>{session.races.length}/{session.totalRaces}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleSessionEdit(session)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleSessionDelete(session.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Races Section */}
        <Box sx={{ flex: { xs: 1, md: 1/3 } }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="black">Races</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingRace(null);
                  // Initialize results array with entries for all trainers
                  const initialResults = trainers.map(trainer => ({
                    trainerId: trainer.id,
                    position: 0,
                    points: 0
                  }));
                  setRaceForm({ 
                    sessionId: '', 
                    raceNumber: 1, 
                    results: initialResults 
                  });
                  setRaceDialog(true);
                }}
              >
                Add Race
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Session</TableCell>
                    <TableCell>Race #</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {races.map((race) => (
                    <TableRow key={race.id}>
                      <TableCell>
                        {sessions.find(s => s.id === race.sessionId)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{race.raceNumber}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleRaceEdit(race)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleRaceDelete(race.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      {/* Trainer Dialog */}
      <Dialog open={trainerDialog} onClose={() => setTrainerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
          <IconButton
            onClick={() => setTrainerDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Trainer Name"
            fullWidth
            required
            value={trainerForm.name}
            onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
            error={!!trainerErrors.name}
            helperText={trainerErrors.name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setTrainerDialog(false);
            setTrainerErrors({});
          }}>Cancel</Button>
          <Button onClick={handleTrainerSubmit} variant="contained">
            {editingTrainer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session Dialog */}
      <Dialog open={sessionDialog} onClose={() => setSessionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSession ? 'Edit Session' : 'Add New Session'}
          <IconButton
            onClick={() => setSessionDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Session Name"
            fullWidth
            required
            value={sessionForm.name}
            onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
            error={!!sessionErrors.name}
            helperText={sessionErrors.name}
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            required
            value={sessionForm.startDate}
            onChange={(e) => setSessionForm({ ...sessionForm, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            error={!!sessionErrors.startDate}
            helperText={sessionErrors.startDate}
          />
          <TextField
            margin="dense"
            label="End Date (Optional)"
            type="date"
            fullWidth
            value={sessionForm.endDate}
            onChange={(e) => setSessionForm({ ...sessionForm, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Total Races"
            type="number"
            fullWidth
            required
            value={sessionForm.totalRaces}
            onChange={(e) => setSessionForm({ ...sessionForm, totalRaces: parseInt(e.target.value) })}
            inputProps={{ min: 1 }}
            error={!!sessionErrors.totalRaces}
            helperText={sessionErrors.totalRaces}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setSessionDialog(false);
            setSessionErrors({});
          }}>Cancel</Button>
          <Button onClick={handleSessionSubmit} variant="contained">
            {editingSession ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Race Dialog */}
      <Dialog open={raceDialog} onClose={() => setRaceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRace ? 'Edit Race' : 'Add New Race'}
          <IconButton
            onClick={() => setRaceDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required error={!!raceErrors.general}>
            <InputLabel>Session</InputLabel>
            <Select
              value={raceForm.sessionId}
              onChange={(e) => setRaceForm({ ...raceForm, sessionId: e.target.value })}
              label="Session"
            >
              {sessions.map((session) => (
                <MenuItem key={session.id} value={session.id}>
                  {session.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Race Number"
            type="number"
            fullWidth
            margin="dense"
            required
            value={raceForm.raceNumber}
            onChange={(e) => setRaceForm({ ...raceForm, raceNumber: parseInt(e.target.value) || 0 })}
            inputProps={{ min: 1 }}
            error={!!raceErrors.general}
          />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Race Results</Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Enter positions for all trainers (1-{trainers.length})
          </Typography>
          {trainers.map((trainer) => (
            <Box key={trainer.id} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'bold' }}>
                {trainer.name}:
              </Typography>
              <TextField
                label="Position"
                type="number"
                size="small"
                sx={{ width: 150 }}
                value={raceForm.results.find(r => r.trainerId === trainer.id)?.position || ''}
                onChange={(e) => {
                  const position = parseInt(e.target.value);
                  const newResults = raceForm.results.map(r => 
                    r.trainerId === trainer.id ? { ...r, position } : r
                  );
                  setRaceForm({ ...raceForm, results: newResults });
                }}
                inputProps={{ min: 1, max: trainers.length }}
                error={!!raceErrors.general}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1, minWidth: 60 }}>
                ({raceForm.results.find(r => r.trainerId === trainer.id)?.position ? 
                  `${positionToPoints(raceForm.results.find(r => r.trainerId === trainer.id)?.position || 0)} pts` : 
                  '0 pts'})
              </Typography>
            </Box>
          ))}
          {raceErrors.general && (
            <Typography variant="body2" color="error" sx={{ mt: 2, p: 1, borderRadius: 1 }}>
              {raceErrors.general}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setRaceDialog(false);
            setRaceErrors({});
          }}>Cancel</Button>
          <Button onClick={handleRaceSubmit} variant="contained">
            {editingRace ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.type} 
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 
'use client';

import React, { useState } from 'react';
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
  Paper,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Casino as CasinoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Session, Trainer } from '@/types';

interface RaceData {
  id: number;
  url_name: string;
  name_jp: string;
  name_en: string;
  name_ko: string;
  name_tw: string;
  list_ura: string[];
  grade: number;
  group: number;
  track: number;
  distance: number;
  terrain: number;
  direction: number;
  course: number;
  entries: number;
  race_id: number;
  course_id: number;
  banner_id: number;
  time: number;
  season: number;
  factor: {
    effect_1: string;
    effect_2: string;
  };
}

interface RandomRaceSelectorProps {
  open: boolean;
  onClose: () => void;
  sessions: Session[];
  trainers: Trainer[];
  raceData: RaceData[];
  onDataChange: () => void;
}

export default function RandomRaceSelector({
  open,
  onClose,
  sessions,
  trainers,
  raceData,
  onDataChange
}: RandomRaceSelectorProps) {
  const [randomRaceForm, setRandomRaceForm] = useState({
    sessionId: '',
    raceNumber: 1,
    selectedRaces: [] as RaceData[],
    filterGrade: '',
    filterDistance: '',
    filterTerrain: ''
  });

  const [randomRaceErrors, setRandomRaceErrors] = useState<{ [key: string]: string }>({});

  // Random race selection functions
  const getRandomRaces = (count: number, filters: any = {}) => {
    let filteredRaces = [...raceData];
    
    // Filter out races above grade 300 (keep only G1, G2, G3)
    filteredRaces = filteredRaces.filter(race => race.grade <= 300);
    
    // Apply filters
    if (filters.grade && filters.grade !== 'All') {
      filteredRaces = filteredRaces.filter(race => race.grade === parseInt(filters.grade));
    }
    if (filters.distance && filters.distance !== 'All') {
      filteredRaces = filteredRaces.filter(race => race.distance === parseInt(filters.distance));
    }
    if (filters.terrain && filters.terrain !== 'All') {
      filteredRaces = filteredRaces.filter(race => race.terrain === parseInt(filters.terrain));
    }
    
    // Shuffle and select random races
    const shuffled = [...filteredRaces].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleRandomRaceSelection = () => {
    const selectedRaces = getRandomRaces(5, {
      grade: randomRaceForm.filterGrade,
      distance: randomRaceForm.filterDistance,
      terrain: randomRaceForm.filterTerrain
    });
    setRandomRaceForm({ ...randomRaceForm, selectedRaces });
  };

  const handleRandomRaceSubmit = async () => {
    try {
      setRandomRaceErrors({});

      if (!randomRaceForm.sessionId) {
        setRandomRaceErrors({ sessionId: 'Session is required' });
        return;
      }

      if (randomRaceForm.selectedRaces.length === 0) {
        setRandomRaceErrors({ races: 'Please select races first' });
        return;
      }

      // Create race results for each selected race
      for (let i = 0; i < randomRaceForm.selectedRaces.length; i++) {
        const raceData = randomRaceForm.selectedRaces[i];
        const raceNumber = randomRaceForm.raceNumber + i;
        
        // Create results array with all trainers
        const results = trainers.map(trainer => ({
          trainerId: trainer.id,
          position: 0,
          points: 0
        }));

        const racePayload = {
          sessionId: randomRaceForm.sessionId,
          raceNumber: raceNumber,
          results: results,
          raceData: {
            name: raceData.name_en,
            distance: raceData.distance,
            track: raceData.track,
            terrain: raceData.terrain,
            grade: raceData.grade
          }
        };

        const response = await fetch('/api/races', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(racePayload)
        });

        if (!response.ok) {
          throw new Error(`Failed to create race ${raceNumber}`);
        }
      }

      // Reset form and close dialog
      setRandomRaceForm({
        sessionId: '',
        raceNumber: 1,
        selectedRaces: [],
        filterGrade: '',
        filterDistance: '',
        filterTerrain: ''
      });
      setRandomRaceErrors({});
      onClose();
      onDataChange();
    } catch (error) {
      console.error('Error adding random races:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Random Race Selector
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense" required error={!!randomRaceErrors.sessionId} sx={{ width: '200px' }}>
              <InputLabel>Session</InputLabel>
              <Select
                value={randomRaceForm.sessionId}
                onChange={(e) => setRandomRaceForm({ ...randomRaceForm, sessionId: e.target.value })}
                label="Session"
                size="small"
              >
                {sessions.map((session) => (
                  <MenuItem key={session.id} value={session.id}>
                    {session.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Starting Race Number"
              type="number"
              fullWidth
              margin="dense"
              required
              size="small"
              value={randomRaceForm.raceNumber}
              onChange={(e) => setRandomRaceForm({ ...randomRaceForm, raceNumber: parseInt(e.target.value) || 1 })}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>Filters (Optional)</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="dense" sx={{ width: '80px' }}>
              <InputLabel>Grade</InputLabel>
              <Select
                value={randomRaceForm.filterGrade}
                onChange={(e) => setRandomRaceForm({ ...randomRaceForm, filterGrade: e.target.value })}
                label="Grade"
                size="small"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="100">G1</MenuItem>
                <MenuItem value="200">G2</MenuItem>
                <MenuItem value="300">G3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="dense" sx={{ width: '100px' }}>
              <InputLabel>Distance</InputLabel>
              <Select
                value={randomRaceForm.filterDistance}
                onChange={(e) => setRandomRaceForm({ ...randomRaceForm, filterDistance: e.target.value })}
                label="Distance"
                size="small"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="1200">1200m</MenuItem>
                <MenuItem value="1400">1400m</MenuItem>
                <MenuItem value="1600">1600m</MenuItem>
                <MenuItem value="1800">1800m</MenuItem>
                <MenuItem value="2000">2000m</MenuItem>
                <MenuItem value="2400">2400m</MenuItem>
                <MenuItem value="3000">3000m</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="dense" sx={{ width: '100px' }}>
              <InputLabel>Terrain</InputLabel>
              <Select
                value={randomRaceForm.filterTerrain}
                onChange={(e) => setRandomRaceForm({ ...randomRaceForm, filterTerrain: e.target.value })}
                label="Terrain"
                size="small"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="1">Turf</MenuItem>
                <MenuItem value="2">Dirt</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<CasinoIcon />}
            onClick={handleRandomRaceSelection}
            sx={{ backgroundColor: 'secondary.main' }}
          >
            Generate Random Races
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => setRandomRaceForm({ ...randomRaceForm, selectedRaces: [] })}
          >
            Clear Selection
          </Button>
        </Box>

        {randomRaceForm.selectedRaces.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Selected Races</Typography>
            <Grid container spacing={2}>
                                   {randomRaceForm.selectedRaces.map((race, index) => (
                       <Grid item xs={12} md={6} key={race.id}>
                         <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                           <CardContent>
                             <Typography variant="h6" sx={{ mb: 1 }}>
                               {race.name_en}
                             </Typography>
                             <Typography variant="body2" color="text.secondary">
                               {race.grade === 100 ? 'G1' : race.grade === 200 ? 'G2' : race.grade === 300 ? 'G3' : `G${race.grade}`} | {race.distance}m | {race.terrain === 1 ? 'Turf' : 'Dirt'}
                             </Typography>
                             <Typography variant="body2" color="text.secondary">
                               Race #{randomRaceForm.raceNumber + index}
                             </Typography>
                           </CardContent>
                         </Card>
                       </Grid>
                     ))}
            </Grid>
          </Box>
        )}

        {randomRaceErrors.races && (
          <Typography variant="body2" color="error" sx={{ mt: 2, p: 1, borderRadius: 1 }}>
            {randomRaceErrors.races}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleRandomRaceSubmit} 
          variant="contained"
          disabled={randomRaceForm.selectedRaces.length === 0}
        >
          Add Selected Races
        </Button>
      </DialogActions>
    </Dialog>
  );
} 
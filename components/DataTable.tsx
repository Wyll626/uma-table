'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Flag as FlagIcon,
  Speed as SpeedIcon 
} from '@mui/icons-material';
import { Trainer, Session } from '@/types';
import { 
  calculateTrainerStats, 
  getCurrentSession, 
  createRaceMatrix, 
  getLastSessionResults 
} from '@/utils/calculations';

interface LastResult {
  position: number;
  trainer: string;
  points: number;
  wins: number;
  podiums: number;
  races: number;
}

interface ChampionshipStanding {
  position: number;
  trainer: string;
  points: number;
  wins: number;
  podiums: number;
  races: number;
}

interface DataTableProps {
  refreshTrigger?: number; // Add this prop to trigger refresh
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'finished':
      return 'success';
    case 'dnf':
      return 'error';
    case 'dns':
      return 'warning';
    case 'dsq':
      return 'error';
    default:
      return 'default';
  }
};

const getPositionColor = (position: number) => {
  switch (position) {
    case 1:
      return '#FFD700'; // Gold
    case 2:
      return '#C0C0C0'; // Silver
    case 3:
      return '#CD7F32'; // Bronze
    default:
      return 'inherit';
  }
};

export default function DataTable({ refreshTrigger = 0 }: DataTableProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [trainersResponse, racesResponse] = await Promise.all([
        fetch('/api/trainers'),
        fetch('/api/races')
      ]);

      const trainersData = await trainersResponse.json();
      const racesData = await racesResponse.json();

      setTrainers(trainersData.trainers);
      setSessions(racesData.sessions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]); // Refresh when refreshTrigger changes

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="black">
          Loading racing data...
        </Typography>
      </Box>
    );
  }

  const currentSession = getCurrentSession(sessions);
  const championshipStats = calculateTrainerStats(trainers, sessions);
  const lastSessionStats = getLastSessionResults(sessions, trainers);
  const raceMatrix = currentSession ? createRaceMatrix(currentSession, trainers) : [];

  // Convert stats to the expected format for the existing UI
  const lastResult: LastResult[] = lastSessionStats.map((stat) => ({
    position: stat.position,
    trainer: stat.trainerName,
    points: stat.totalPoints,
    wins: stat.wins,
    podiums: stat.podiums,
    races: stat.races,
  }));

  const championshipStandings: ChampionshipStanding[] = championshipStats.map((stat) => ({
    position: stat.position,
    trainer: stat.trainerName,
    points: stat.totalPoints,
    wins: stat.wins,
    podiums: stat.podiums,
    races: stat.races,
  }));

  // Convert race matrix to the expected format
  const matrixData = raceMatrix.map(row => {
    const raceRow: any = { race: row.raceNumber };
    trainers.forEach(trainer => {
      const value = row.results[trainer.id];
      raceRow[trainer.name] = value === "-" ? "-" : (value || 0);
    });
    return raceRow;
  });

  // Calculate totals for each trainer (only for completed races)
  const totals: { [key: string]: number } = {};
  trainers.forEach(trainer => {
    totals[trainer.name] = raceMatrix.reduce((sum, row) => {
      const value = row.results[trainer.id];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  });

  return (
    <Box sx={{ width: '100%' }}>
      {/* Race Matrix Table */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
            <SpeedIcon sx={{ mr: 1, color: 'blue' }} />
            Current Season - Race Record
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 400, '& .MuiTableCell-root': { padding: '8px 16px' } }} aria-label="race matrix table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Race</TableCell>
                {trainers.map((trainer) => (
                  <TableCell key={trainer.id} sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
                    {trainer.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {matrixData.map((row) => (
                <TableRow key={row.race} hover>
                  <TableCell 
                    component="th" 
                    scope="row"
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: '#f8f9fa',
                      borderRight: 1,
                      borderColor: 'divider'
                    }}
                  >
                    Race {row.race}
                  </TableCell>
                  {trainers.map((trainer) => (
                    <TableCell 
                      key={trainer.id}
                      sx={{ 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        color: row[trainer.name] === 25 ? 'gold' : 
                               row[trainer.name] === "-" ? 'gray' : 'inherit' 
                      }}
                    >
                      {row[trainer.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ 
                    fontWeight: 'bold',
                    backgroundColor: '#e3f2fd',
                    borderRight: 1,
                    borderColor: 'divider'
                  }}
                >
                  Total
                </TableCell>
                {trainers.map((trainer) => (
                  <TableCell key={trainer.id} sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>
                    {totals[trainer.name]}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Current Race Results */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                <FlagIcon sx={{ mr: 1, color: 'red' }} />
                Current Season - Standings
              </Typography>
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 400, '& .MuiTableCell-root': { padding: '8px 16px' } }} aria-label="race results table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pos</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Trainer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Points</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Wins</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Podiums</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Races</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lastResult.map((row) => (
                    <TableRow 
                      key={row.position} 
                      hover
                      sx={{ 
                        backgroundColor: row.position <= 3 ? 'rgba(255, 215, 0, 0.1)' : 'inherit',
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ 
                          fontWeight: 'bold',
                          color: getPositionColor(row.position),
                          fontSize: row.position <= 3 ? '1.1rem' : 'inherit'
                        }}
                      >
                        {row.position}
                      </TableCell>
                      <TableCell sx={{ fontWeight: row.position <= 3 ? 'bold' : 'normal' }}>
                        {row.trainer}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'green' }}>
                        {row.points}
                      </TableCell>
                      <TableCell sx={{ color: row.wins > 0 ? 'gold' : 'inherit' }}>
                        {row.wins}
                      </TableCell>
                      <TableCell>{row.podiums}</TableCell>
                      <TableCell>{row.races}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Championship Standings */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrophyIcon sx={{ mr: 1, color: '#FFD700' }} />
                All Time - Standings
              </Typography>
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 400, '& .MuiTableCell-root': { padding: '8px 16px' } }} aria-label="championship standings table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pos</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Trainer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Points</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Wins</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Podiums</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Races</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {championshipStandings.map((row) => (
                    <TableRow 
                      key={row.position} 
                      hover
                      sx={{ 
                        backgroundColor: row.position <= 3 ? 'rgba(255, 215, 0, 0.1)' : 'inherit',
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ 
                          fontWeight: 'bold',
                          color: getPositionColor(row.position),
                          fontSize: row.position <= 3 ? '1.1rem' : 'inherit'
                        }}
                      >
                        {row.position}
                      </TableCell>
                      <TableCell sx={{ fontWeight: row.position <= 3 ? 'bold' : 'normal' }}>
                        {row.trainer}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'green' }}>
                        {row.points}
                      </TableCell>
                      <TableCell sx={{ color: row.wins > 0 ? 'gold' : 'inherit' }}>
                        {row.wins}
                      </TableCell>
                      <TableCell>{row.podiums}</TableCell>
                      <TableCell>{row.races}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          <strong>Point System:</strong> 1st (25), 2nd (18), 3rd (15), 4th (12), 5th (10), 6th (8), 7th (6), 8th (4), 9th (2), 10th (1)
        </Typography>
      </Box>
    </Box>
  );
} 
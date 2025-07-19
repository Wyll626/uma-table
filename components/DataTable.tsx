'use client';

import React, { useState } from 'react';
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

const lastResult: LastResult[] = [
  {
    position: 1,
    trainer: 'Aiko',
    points: 85,
    wins: 2,
    podiums: 4,
    races: 5,
  },
  {
    position: 2,
    trainer: 'Imca',
    points: 72,
    wins: 1,
    podiums: 3,
    races: 5,
  },
  {
    position: 3,
    trainer: 'Aibon',
    points: 68,
    wins: 1,
    podiums: 3,
    races: 5,
  },
  {
    position: 4,
    trainer: 'Rosie',
    points: 55,
    wins: 1,
    podiums: 2,
    races: 5,
  },
  {
    position: 5,
    trainer: 'Lac',
    points: 42,
    wins: 0,
    podiums: 2,
    races: 5,
  },
  {
    position: 6,
    trainer: 'Chita',
    points: 28,
    wins: 0,
    podiums: 1,
    races: 5,
  },
];

const championshipStandings: ChampionshipStanding[] = [
  {
    position: 1,
    trainer: 'Aiko',
    points: 314,
    wins: 8,
    podiums: 12,
    races: 14,
  },
  {
    position: 2,
    trainer: 'Imca',
    points: 220,
    wins: 2,
    podiums: 8,
    races: 14,
  },
  {
    position: 3,
    trainer: 'Aibon',
    points: 199,
    wins: 1,
    podiums: 7,
    races: 14,
  },
  {
    position: 4,
    trainer: 'Rosie',
    points: 189,
    wins: 1,
    podiums: 6,
    races: 14,
  },
  {
    position: 5,
    trainer: 'Lac',
    points: 175,
    wins: 1,
    podiums: 5,
    races: 14,
  },
  {
    position: 6,
    trainer: 'Chita',
    points: 143,
    wins: 0,
    podiums: 3,
    races: 14,
  },
];

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

export default function RacingTables() {
  // Race matrix data - points for each trainer in each race
  const raceMatrix = [
    { race: 1, Aiko: 25, Imca: 18, Aibon: 15, Rosie: 12, Lac: 10, Chita: 8 },
    { race: 2, Aiko: 18, Imca: 25, Aibon: 12, Rosie: 15, Lac: 8, Chita: 10 },
    { race: 3, Aiko: 25, Imca: 15, Aibon: 18, Rosie: 10, Lac: 12, Chita: 8 },
    { race: 4, Aiko: 12, Imca: 10, Aibon: 25, Rosie: 18, Lac: 15, Chita: 8 },
    { race: 5, Aiko: 15, Imca: 12, Aibon: 8, Rosie: 25, Lac: 18, Chita: 10 },
  ];

  // Calculate totals for each trainer
  const totals = {
    Aiko: raceMatrix.reduce((sum, race) => sum + race.Aiko, 0),
    Imca: raceMatrix.reduce((sum, race) => sum + race.Imca, 0),
    Aibon: raceMatrix.reduce((sum, race) => sum + race.Aibon, 0),
    Rosie: raceMatrix.reduce((sum, race) => sum + race.Rosie, 0),
    Lac: raceMatrix.reduce((sum, race) => sum + race.Lac, 0),
    Chita: raceMatrix.reduce((sum, race) => sum + race.Chita, 0),
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Race Matrix Table */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
            <SpeedIcon sx={{ mr: 1, color: 'blue' }} />
            Current Standings (Last 5 Races)
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 400, '& .MuiTableCell-root': { padding: '8px 16px' } }} aria-label="race matrix table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Race</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', textAlign: 'center' }}>Aiko</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', textAlign: 'center' }}>Imca</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', textAlign: 'center' }}>Aibon</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', textAlign: 'center' }}>Rosie</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', textAlign: 'center' }}>Lac</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', textAlign: 'center' }}>Chita</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {raceMatrix.map((row) => (
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
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: row.Aiko === 25 ? 'gold' : 'inherit' }}>
                    {row.Aiko}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: row.Imca === 25 ? 'gold' : 'inherit' }}>
                    {row.Imca}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: row.Aibon === 25 ? 'gold' : 'inherit' }}>
                    {row.Aibon}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: row.Rosie === 25 ? 'gold' : 'inherit' }}>
                    {row.Rosie}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: row.Lac === 25 ? 'gold' : 'inherit' }}>
                    {row.Lac}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: row.Chita === 25 ? 'gold' : 'inherit' }}>
                    {row.Chita}
                  </TableCell>
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
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>
                  {totals.Aiko}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>
                  {totals.Imca}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>
                  {totals.Aibon}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>
                  {totals.Rosie}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>
                  {totals.Lac}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>
                  {totals.Chita}
                </TableCell>
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
                Last Session Results (5 Races)
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
                Championship Standings
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
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Button,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  GpsFixed as GpsFixedIcon,
  AddLocationAlt as AddLocationAltIcon,
  RestartAlt as RestartAltIcon
} from '@mui/icons-material';

export const LocationControls = ({
  center,
  centerName,
  radiusKm,
  isPickingOnMap,
  onPickOnMapToggle,
  onGpsLocate,
  onResetCenter,
  isGpsLive = false,
  radarMode = 'radar',
  onRadarModeChange,
  placesWithin25Count = 0
}) => {
  const [gpsAcquired, setGpsAcquired] = useState(false);
  const theme = useTheme();

  const handleGps = () => {
    onGpsLocate();
    setGpsAcquired(true);
    setTimeout(() => setGpsAcquired(false), 4000);
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2.5,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.45)' : 'rgba(245, 241, 234, 0.85)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px'
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
          
          {/* Controls Buttons Group */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
            {/* Button 1: Use GPS */}
            <Button
              id="btnGps"
              onClick={handleGps}
              variant="contained"
              color={isGpsLive ? 'secondary' : 'primary'}
              startIcon={
                <GpsFixedIcon
                  sx={{
                    animation: isGpsLive ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                  }}
                />
              }
              sx={{
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'none',
                px: 2,
                py: 1,
                boxShadow: isGpsLive ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none'
              }}
            >
              {isGpsLive ? 'GPS Active (Recenter GPS)' : 'Use My GPS Location'}
            </Button>

            {/* Button 2: Pick on Map */}
            <Button
              id="btnPickMap"
              onClick={onPickOnMapToggle}
              variant={isPickingOnMap ? 'contained' : 'outlined'}
              color={isPickingOnMap ? 'warning' : 'inherit'}
              startIcon={<AddLocationAltIcon />}
              sx={{
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'none',
                px: 2,
                py: 1,
                bgcolor: !isPickingOnMap ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)') : undefined
              }}
            >
              {isPickingOnMap ? 'Click Map To Relocate...' : 'Pick Location on Map'}
            </Button>

            {/* Button 3: Reset Center */}
            <Tooltip title="Reset center back to Ratnapura Town Center">
              <Button
                onClick={() => {
                  onResetCenter();
                  setGpsAcquired(false);
                }}
                variant="outlined"
                color="inherit"
                startIcon={<RestartAltIcon />}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  px: 1.75,
                  py: 1,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#ffffff'
                }}
              >
                Reset Center
              </Button>
            </Tooltip>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
};

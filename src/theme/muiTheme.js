import { createTheme } from '@mui/material/styles';

export const getMuiTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#4ade80' : '#2d6a4f',
        light: isDark ? '#86efac' : '#40916c',
        dark: isDark ? '#22c55e' : '#1b4332',
        contrastText: '#ffffff'
      },
      secondary: {
        main: isDark ? '#60a5fa' : '#1d4ed8',
        light: isDark ? '#93c5fd' : '#3b82f6',
        dark: isDark ? '#3b82f6' : '#1e40af',
        contrastText: '#ffffff'
      },
      warning: {
        main: '#d97706',
        light: '#f59e0b',
        dark: '#b45309'
      },
      background: {
        default: isDark ? '#0f172a' : '#faf7f2',
        paper: isDark ? '#1e293b' : '#ffffff'
      },
      text: {
        primary: isDark ? '#f8fafc' : '#1e293b',
        secondary: isDark ? '#94a3b8' : '#64748b'
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
    },
    typography: {
      fontFamily: '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700
      },
      h2: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700
      },
      h3: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700
      },
      h4: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700
      },
      h5: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 600
      },
      h6: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 600
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em'
      }
    },
    shape: {
      borderRadius: 12
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              : 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)'
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e7e2d8',
            boxShadow: isDark
              ? '0 4px 20px rgba(0,0,0,0.4)'
              : '0 4px 16px rgba(46, 50, 48, 0.04)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            backgroundImage: 'none'
          }
        }
      }
    }
  });
};

import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Settings from './pages/Settings';
import theme from './theme';
import { useCharacterContext } from './contexts/characterContext';
import { ItemsPage } from './pages/ItemsPage';
import { CharacterPage } from './pages/CharacterPage';
import { LoaderPage } from './pages/LoaderPage';
import { DamagePage } from './feature/damage/DamagePage'
import { ItemPage } from './pages/ItemPage';
import { FishingPage } from './pages/FishingPage';
import { LastRunInfoPage } from './pages/LastRunInfoPage';
import { useSettingsContext } from './contexts/settingsContext';
import { iconFromId } from './icons/icons';

export default function App() {
  const { loadClasses } = useCharacterContext();
  const { wc3path } = useSettingsContext();

  const onRefreshClick = () => {
    loadClasses()
    window.electron.ipcRenderer.sendMessage('request_last_run', wc3path);
    window.electron.ipcRenderer.sendMessage('get_latest_damage_by_type');
  }

  return (
    <Router initialEntries={[ '/characters' ]}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Box
            component="div"
            sx={{
              justifyContent: 'space-between',
              flexDirection: 'column',
              display: 'flex',
              minWidth: '220px',
              height: '100vh',
              position: 'relative',
            }}
          >
            <Box>
              <Box
                sx={{
                  height: '50px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>Evo Helper 1.2.1</Typography>
                <IconButton onClick={onRefreshClick}>
                  <CachedIcon />
                </IconButton>
              </Box>
              <MenuList>
                <MenuItem component={Link} to="/characters">
                  Loader
                </MenuItem>
                <MenuItem component={Link} to="/items">
                  Items
                </MenuItem>
                <MenuItem component={Link} to="/fishing">
                  Fishing
                </MenuItem>
                <MenuItem component={Link} to="/lastruninfo">
                  Last run info
                </MenuItem>
                <MenuItem component={Link} to="/damagereport/Boss">
                  Run damage
                </MenuItem>
              </MenuList>
            </Box>
            <Box sx={{ width: '100%', backgroundColor: '#121212' }}>
              <Divider />
              <MenuItem component={Link} to="/settings">
                Settings
              </MenuItem>
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              padding: '20px',
              background: theme.palette.grey[900],
            }}
          >
            <Box sx={{ maxWidth: '105ch' }}>
            <Routes>
              <Route path="/items" element={<ItemsPage/>}/>
              <Route path="/item/:id" element={<ItemPage/>}/>
              <Route path="/characters/:accountURL?" element={<LoaderPage />}/>
              <Route path="/settings" element={<Settings />}/>
              <Route path="/damagereport/:type" element={<DamagePage />}/>
              <Route path="/fishing" element={<FishingPage />} />
              <Route path="/lastruninfo" element={<LastRunInfoPage />}/>
              <Route path="/character/:accountURL/:id" element={<CharacterPage />} />
            </Routes>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

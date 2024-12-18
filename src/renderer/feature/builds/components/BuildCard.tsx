import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { EvoStash } from '../../../components/Stash';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useSettingsContext } from '../../../contexts/settingsContext';
import { TBuild } from '../../../contexts/buildsContext';
import { ExportBuildButton } from './ExportBuildButton';

interface BuildCardProps {
  build: TBuild;
  playerItems?: string[] | null;
}

export function BuildCard({ build, playerItems }: BuildCardProps) {
  const navigate = useNavigate();
  const { addFavouriteClass, removeFavouriteClass } = useSettingsContext();

  const handleNavigate = () => {
    navigate(`/builds/${build.id}`, {
      state: { playerItems: [...(playerItems || [])] },
    });
  };

  return (
    <Box sx={{ padding: '10px' }}>
      <Card
        sx={{ width: 280, padding: '15px', cursor: 'pointer' }}
        onClick={handleNavigate}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '10px',
          }}
        >
          <Typography variant="body1">{build.name}</Typography>
          <IconButton onClick={() => console.log('favourite')}>
            {true ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Box>
        <Box sx={{ paddingBottom: '10px' }}>
          <EvoStash
            sx={{ display: 'flex', flexDirection: 'row', gap: '2px' }}
            itemIds={build.items}
            playerItems={playerItems}
          />
        </Box>
        <Box>
          <ExportBuildButton
            name={build.name}
            items={build.items}
            tooltipTitle="Export build (copy to clipboard)"
          />
        </Box>
      </Card>
    </Box>
  );
}

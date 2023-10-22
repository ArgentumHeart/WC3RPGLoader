import { FC } from 'react';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useCharacterContext } from '../../context';
import { EvoStash } from './Stash';

export const Character: FC = () => {
  const { getCharacterById, onLoadClick } = useCharacterContext();
  const { id } = useParams();

  const character = getCharacterById(id);
  if (!character) {
    return null;
  }

  return (
    <div>
      <Typography variant="h6">
        {character.hero} {character.level && ` - ${character.level} level`}
      </Typography>
      <Typography variant="caption">Gold: {character.gold}</Typography>
      <br />
      <Typography variant="caption">
        PowerShards: {character.powerShards}
      </Typography>
      <Grid container>
        <Grid item sx={{ marginRight: '20px' }}>
          <EvoStash itemIds={character.inventory} />
        </Grid>
        <Grid item>
          <EvoStash itemIds={character.stashes[0]} />
        </Grid>
        <Grid item>
          <EvoStash itemIds={character.stashes[1]} />
        </Grid>
        <Grid item>
          <EvoStash itemIds={character.stashes[2]} />
        </Grid>
        <Grid item>
          <EvoStash itemIds={character.stashes[3]} />
        </Grid>
        <Grid item>
          <EvoStash itemIds={character.stashes[4]} />
        </Grid>
        <Grid item>
          <EvoStash itemIds={character.stashes[5]} />
        </Grid>
      </Grid>

      <Divider sx={{ marginTop: '10px', marginBottom: '10px' }}/>
      <Typography>Press Load - it will set hotkey for A button.</Typography>
      <Typography>Head to wc3 and press A.</Typography>
      <Typography>Let it do its thing.</Typography>
      <Typography>
        Tip: remember to turn off caps lock and switch to English
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="contained"
          onClick={() => onLoadClick(character)}
        >
          Load
        </Button>
        {/*<Button onClick={() => onLoadClick(character, true)}>
          Load (legacy)
        </Button>*/}
      </Box>
    </div>
  );
};

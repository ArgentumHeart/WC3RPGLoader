import { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useCharacterContext } from '../contexts/characterContext';
import { EvoStash } from '../components/Stash';
import Tooltip from '@mui/material/Tooltip';
import { GodlyProgress } from '../feature/item/components/GodlyProgress';
import { BackButton } from '../components/BackButton';
import { CharacterBuildComponent } from '../feature/builds/components/CharacterBuildComponent';
import { useBuildsContext } from '../contexts/buildsContext';
import { ExportBuildButton } from '../feature/builds/components/ExportBuildButton';
import { BuildProgress } from '../feature/builds/components/BuildProgress';

export const CharacterPage: FC = () => {
  const { getCharacter, onLoadClick } = useCharacterContext();
  const { builds, selectedBuilds, saveSelectedBuild } = useBuildsContext();
  const { accountURL, id } = useParams();
  const [selectedBuild, setSelectedBuild] = useState<number | null>(null);

  const character = getCharacter(accountURL, id);
  if (!accountURL || !id || !character) {
    return null;
  }

  useEffect(() => {
    if (selectedBuilds[accountURL]?.[character.hero]) {
      setSelectedBuild(selectedBuilds[accountURL][character.hero]);
    }
  }, [selectedBuilds, accountURL, character]);

  const items = character
    ? [...character.inventory, ...character.stashes.flat()]
    : null;

  const handleSelectBuild = (buildId: number) => {
    setSelectedBuild(buildId);
    saveSelectedBuild(accountURL, character.hero, buildId);
  };

  return (
    <div>
      <BackButton />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ minWidth: '300px' }}>
          <Typography variant="h6">
            {character.hero} {character.level && ` - ${character.level} level`}
          </Typography>
          <Typography variant="caption">Gold: {character.gold}</Typography>
          <br />
          <Typography variant="caption">
            PowerShards: {character.powerShards}
          </Typography>
          {character.notes && (
            <>
              <br />
              <Typography variant="caption">
                Mysterious Notes: {character.notes}
              </Typography>
            </>
          )}
          {character.notes && (
            <>
              <br />
              <Typography variant="caption">
                Mysterious Sigils: {character.sigils}
              </Typography>
            </>
          )}
          <Grid container>
            <Grid item sx={{ marginRight: '20px' }}>
              <EvoStash itemIds={character.inventory} playerItems={items} />
            </Grid>
            <Grid item>
              <EvoStash itemIds={character.stashes[0]} playerItems={items} />
            </Grid>
            <Grid item>
              <EvoStash itemIds={character.stashes[1]} playerItems={items} />
            </Grid>
            <Grid item>
              <EvoStash itemIds={character.stashes[2]} playerItems={items} />
            </Grid>
            <Grid item>
              <EvoStash itemIds={character.stashes[3]} playerItems={items} />
            </Grid>
            <Grid item>
              <EvoStash itemIds={character.stashes[4]} playerItems={items} />
            </Grid>
            <Grid item>
              <EvoStash itemIds={character.stashes[5]} playerItems={items} />
            </Grid>
          </Grid>
        </Box>
        <CharacterBuildComponent
          builds={builds}
          selectedBuild={selectedBuild}
          items={items}
          handleSelectBuild={handleSelectBuild}
        />
      </Box>
      <ExportBuildButton
        name={character.hero}
        items={character.inventory}
        tooltipTitle="Export inventory as build (copy to clipboard)"
      />

      <Divider sx={{ marginTop: '10px', marginBottom: '10px' }} />

      {items && <GodlyProgress itemIdsList={items} />}

      <BuildProgress
        title="Build progress"
        itemIdsList={items || []}
        buildItems={selectedBuild ? builds[selectedBuild].items : []}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Button variant="contained" onClick={() => onLoadClick(character)}>
          Load
        </Button>
        <Tooltip
          sx={{ marginLeft: '15px' }}
          title={
            <Box>
              <Typography variant="body2">
                Press Load - it will set hotkey for A button.
              </Typography>
              <Typography variant="body2">Head to wc3 and press A.</Typography>
              <Typography variant="body2">Let it do its thing.</Typography>
              <Typography variant="caption">
                Tip: remember to turn off caps lock and switch to English
              </Typography>
            </Box>
          }
        >
          <InfoIcon color="primary" />
        </Tooltip>
      </Box>
    </div>
  );
};

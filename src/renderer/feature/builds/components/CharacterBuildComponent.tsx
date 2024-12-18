import { FC } from 'react';
import { TBuild } from '../../../contexts/buildsContext';
import { Autocomplete, Box, TextField } from '@mui/material';
import { BuildDropdownElement } from './BuildDropdownElement';
import theme from '../../../theme';
import { BuildCard } from './BuildCard';

interface CharacterBuildComponentProps {
  builds: { [id: number]: TBuild };
  selectedBuild: number | null;
  items: string[] | null;
  handleSelectBuild: (buildId: number) => void;
}

export const CharacterBuildComponent: FC<CharacterBuildComponentProps> = ({
  builds,
  selectedBuild,
  items,
  handleSelectBuild,
}) => {
  return (
    <>
      {builds && (
        <Box sx={{ paddingLeft: '36px', justifyContent: 'start' }}>
          <Autocomplete
            value={selectedBuild}
            options={Object.keys(builds).map((key) => Number(key))}
            getOptionLabel={(option) => builds[option].name}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Build" />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option} style={{ padding: 0 }}>
                <BuildDropdownElement build={builds[option]} />
              </li>
            )}
            PaperComponent={({ children }) => (
              <Box
                sx={{
                  width: 'fit-content',
                  background: theme.palette.grey[800],
                }}
              >
                {children}
              </Box>
            )}
            onChange={(_, value) => {
              if (value) {
                const build = builds[value];
                if (build && build.id) {
                  handleSelectBuild(build.id);
                }
              }
            }}
          />
          {selectedBuild && (
            <BuildCard build={builds[selectedBuild]} playerItems={items} />
          )}
        </Box>
      )}
    </>
  );
};

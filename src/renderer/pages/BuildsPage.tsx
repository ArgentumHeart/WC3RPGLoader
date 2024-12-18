import { FC, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useBuildsContext } from '../contexts/buildsContext';
import { BuildCard } from '../feature/builds/components/BuildCard';

export const BuildsPage: FC = () => {
  const navigate = useNavigate();
  const { builds } = useBuildsContext();

  const handleCreateNewBuild = () => {
    navigate(`/builds/new`);
  };

  const isEmpty = !builds || Object.keys(builds).length === 0;

  return (
    <Box>
      <Button
        sx={{ marginBottom: '20px', marginLeft: '10px' }}
        variant="contained"
        onClick={handleCreateNewBuild}
      >
        Create new build
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {isEmpty ? (
          <Typography>
            No builds available. Create a new build to get started.
          </Typography>
        ) : (
          Object.keys(builds).map((key) => {
            const buildId = Number(key);
            return <BuildCard key={buildId} build={builds[buildId]} />;
          })
        )}
      </Box>
    </Box>
  );
};

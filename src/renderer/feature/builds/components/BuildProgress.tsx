import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { lightBlue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { useMemo, useState } from 'react';
import { useItemContext } from '../../../contexts/itemsContext';
import {
  DependencyObj,
  getItemArrFlatDependenciesObject,
} from '../../../util/crafting';
import { ItemIconAndTitle } from '../../item/components/ItemIconAndTitle';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const BuildProgress = ({
  title,
  itemIdsList,
  buildItems,
  defaultExpanded = false,
}: {
  title: string;
  itemIdsList: Array<string>;
  buildItems: string[];
  defaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { items } = useItemContext();

  const isBuildEmpty = () => {
    return (
      buildItems.length === 0 ||
      buildItems.filter((item) => item !== '').length === 0
    );
  };

  const [missingForBuild, _] = useMemo(() => {
    if (isBuildEmpty()) {
      return [{}, []] as [DependencyObj, string[]];
    } else {
      return getItemArrFlatDependenciesObject(buildItems, itemIdsList, items);
    }
  }, [itemIdsList, buildItems]);

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  if (missingForBuild && Object.keys(missingForBuild).length === 0) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography>{title}</Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {Object.keys(missingForBuild).map((key) => {
          return (
            <MissingItem id={key} amount={missingForBuild[key]} key={key} />
          );
        })}
      </Collapse>

      <Divider sx={{ marginTop: '10px', marginBottom: '10px' }} />
    </>
  );
};

function MissingItem(props: { id: string; amount: number }) {
  const { id, amount } = props;
  const { items } = useItemContext();
  const item = items[id];

  if (!item) {
    return (
      <Typography>
        {amount} x {id}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography sx={{ width: '30px' }}>{amount} </Typography>
        <ItemIconAndTitle item={item} />
      </Box>
      {item.sourceShort && (
        <Typography variant="body2" sx={{ color: lightBlue[300] }}>
          {item.sourceShort}
        </Typography>
      )}
    </Box>
  );
}

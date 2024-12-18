import Box, { BoxProps } from '@mui/material/Box';
import { iconFromId } from '../../../icons/icons';
import Typography from '@mui/material/Typography';
import { lightBlue } from '@mui/material/colors';
import { TItem } from '../../../../types';
import { CraftsInto } from './CraftsInto';
import { ItemDependenciesTree } from './DependencyTree';

interface EvoItemProps extends BoxProps {
  item: TItem;
  onItemSelect?: (id: string) => void;
  playerItems?: string[] | null;
}

export function EvoItem(props: EvoItemProps) {
  const { item, onItemSelect, playerItems, sx, ...rest } = props;
  const { color } = item.rarity;

  return (
    <Box {...rest} sx={{ maxWidth: onItemSelect ? '400px' : '600px' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', paddingBottom: '10px' }}
      >
        <img src={iconFromId(item.icon)} width={64} height={64} />
        <Box sx={{ paddingLeft: '10px' }}>
          <Typography variant="subtitle1" color={color}>
            {item.id}
          </Typography>
          <Typography variant="subtitle2" color={lightBlue[300]}>
            {item.restriction}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2">{item.description}</Typography>
      <br />
      {item.effects.map((effect, index) => (
        <Typography key={effect + index} variant="body2">
          {effect}
        </Typography>
      ))}
      <ItemDependenciesTree item={item} />
      <CraftsInto
        item={item}
        onItemSelect={onItemSelect}
        playerItems={playerItems}
      />
    </Box>
  );
}

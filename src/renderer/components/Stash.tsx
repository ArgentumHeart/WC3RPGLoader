import Box from '@mui/material/Box';
import { BoxProps } from '@mui/material';
import { CompactItem } from './CompactItem';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface EvoStashProps extends BoxProps {
  itemIds: string[];
  onItemClick?: (index: number) => void;
  playerItems?: string[] | null;
}

export function EvoStash(props: EvoStashProps) {
  const { itemIds, onItemClick, playerItems, ...rest } = props;
  const navigate = useNavigate();

  const handleItemClick = useCallback(
    (id: string, index: number) => {
      if (playerItems) {
        navigate(`/item/${id}`, {
          state: { playerItems: [...(playerItems || [])] },
        });
      } else if (onItemClick) {
        onItemClick(index);
      }
    },
    [onItemClick],
  );

  const getOnClickHandler = useCallback(
    (id: string, index: number) => {
      if (playerItems || onItemClick) {
        return () => handleItemClick(id, index);
      }
      return undefined;
    },
    [handleItemClick, playerItems, onItemClick],
  );

  return (
    <Box {...rest}>
      {itemIds.map((id, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <CompactItem
          key={id + index}
          id={id}
          onClick={getOnClickHandler(id, index)}
        />
      ))}
    </Box>
  );
}

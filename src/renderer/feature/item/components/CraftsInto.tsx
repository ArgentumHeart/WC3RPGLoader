import { FC, useCallback } from 'react';
import { CompactItem } from '../../../components/CompactItem';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { TItem } from '../../../../types';
import { useItemContext } from '../../../contexts/itemsContext';
import { ItemIconAndTitle } from './ItemIconAndTitle';

interface CraftsIntoProps {
  item: TItem;
  onItemSelect?: (id: string) => void;
  playerItems?: string[] | null;
}

export const CraftsInto: FC<CraftsIntoProps> = (props) => {
  const { item, onItemSelect, playerItems } = props;
  const { items } = useItemContext();
  const navigate = useNavigate();

  const usedForItemsArr = item.partOf.map((id) => items[id]);

  const handleItemClick = useCallback(
    (id: string) => {
      if (onItemSelect) {
        onItemSelect(id);
      } else if (playerItems) {
        navigate(`/item/${id}`, {
          state: { playerItems: [...(playerItems || null)] },
        });
      }
    },
    [playerItems, onItemSelect],
  );

  const getOnClickHandler = useCallback(
    (id: string) => {
      if (playerItems || onItemSelect) {
        return () => handleItemClick(id);
      }
      return undefined;
    },
    [handleItemClick, playerItems, onItemSelect],
  );

  if (usedForItemsArr.length === 0) return null;

  return (
    <Box sx={{ width: '500px', paddingTop: '5px' }}>
      <Typography variant="h6">Used for</Typography>
      {usedForItemsArr.length > 4 ? (
        <TiledItems
          items={usedForItemsArr}
          getOnClickHandler={getOnClickHandler}
        />
      ) : (
        <ListedItems
          items={usedForItemsArr}
          onItemSelect={onItemSelect}
          playerItems={playerItems}
        />
      )}
    </Box>
  );
};

function TiledItems({
  items,
  getOnClickHandler,
}: {
  items: TItem[];
  getOnClickHandler: (id: string) => (() => void) | undefined;
}) {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', paddingTop: '5px' }}>
      {items.map((item) => (
        <CompactItem
          key={`used_for_${item.id}`}
          id={item.id}
          onClick={getOnClickHandler(item.id)}
        />
      ))}
    </Box>
  );
}

function ListedItems({
  items,
  onItemSelect,
  playerItems,
}: {
  items: TItem[];
  onItemSelect?: (id: string) => void;
  playerItems?: string[] | null;
}) {
  const navigate = useNavigate();
  if (items.length === 0) return null;

  const handleItemClick = useCallback(
    (id: string) => {
      if (onItemSelect) {
        onItemSelect(id);
      } else if (playerItems) {
        navigate(`/item/${id}`, {
          state: { playerItems: [...(playerItems || [])] },
        });
      }
    },
    [playerItems, onItemSelect],
  );

  const getOnClickHandler = useCallback(
    (id: string) => {
      if (playerItems || onItemSelect) {
        return () => handleItemClick(id);
      }
      return () => navigate(`/item/${id}`);
    },
    [handleItemClick, playerItems, onItemSelect],
  );

  return (
    <Box sx={{ paddingTop: '5px' }}>
      {items.map((item) => (
        <ItemIconAndTitle
          key={`used_for_${item.id}`}
          sx={{
            paddingLeft: '30px',
            cursor: 'pointer',
            '&:hover': {
              background: '#2b2b2b',
            },
          }}
          onClick={getOnClickHandler(item.id)}
          item={item}
        />
      ))}
    </Box>
  );
}

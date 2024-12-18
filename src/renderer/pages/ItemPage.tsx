import { useLocation, useParams } from 'react-router-dom';
import { useItemContext } from '../contexts/itemsContext';
import { BackButton } from '../components/BackButton';
import { Box, Button, Divider } from '@mui/material';
import { FC } from 'react';
import { EvoItem } from '../feature/item/components/Item';
import { BuildProgress } from '../feature/builds/components/BuildProgress';

interface ItemPageParams {
  itemId?: string | null;
  onBackClick?: () => void;
  onItemSelect?: (id: string) => void;
  onAddToBuild?: (id: string) => void;
}

export const ItemPage: FC<ItemPageParams> = ({ ...props }) => {
  const { itemId, onBackClick, onItemSelect, onAddToBuild } = props;
  const { id: paramId } = useParams();
  const { items } = useItemContext();
  const location = useLocation();
  const playerItemsState = location.state?.playerItems;
  const playerItems = playerItemsState?.length > 0 ? playerItemsState : null;

  const id = itemId || paramId;

  if (!id || !items.hasOwnProperty(id)) {
    return <h2>How did you end up here?</h2>;
  }

  return (
    <div>
      <BackButton onClick={onBackClick} />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box>
          {onAddToBuild && (
            <Button
              sx={{ marginBottom: '15px' }}
              variant="contained"
              onClick={() => {
                onAddToBuild(id);
                onItemSelect && onItemSelect('');
              }}
            >
              Add to build
            </Button>
          )}
          <EvoItem
            item={itemId ? items[itemId] : items[id]}
            onItemSelect={onItemSelect}
            playerItems={playerItems}
          />
        </Box>
        {playerItems && !onItemSelect && (
          <>
            <Divider orientation="vertical" flexItem sx={{ marginX: '16px' }} />
            <Box sx={{ width: '100%', minWidth: '400px' }}>
              <BuildProgress
                title="Missing items to craft this item"
                itemIdsList={playerItems}
                buildItems={[id]}
                defaultExpanded={true}
              />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

import { FC, useCallback } from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { grey } from '@mui/material/colors';
import ItemCard from './ItemCard';
import { iconFromId } from '../icons/icons';
import { useNavigate } from 'react-router-dom';
import { useItemContext } from '../contexts/itemsContext';

interface Props {
  id?: string;
  noTooltip?: boolean;
  onClick?: () => void;
}

export const CompactItem: FC<Props> = ({ id, noTooltip, onClick }) => {
  const { items } = useItemContext();
  const navigate = useNavigate();
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (onClick) {
        onClick();
      } else {
        navigate(`/item/${id}`);
      }
    },
    [onClick],
  );
  if (!id) {
    return (
      <Avatar src={iconFromId('EmptySlotIcon')} variant="rounded">
        {' '}
      </Avatar>
    );
  }
  if (!items.hasOwnProperty(id)) {
    return (
      <Tooltip sx={{ boxShadow: 3 }} title={id} placement="right-start">
        <Avatar sx={{ bgcolor: grey[500] }} variant="rounded">
          {id[0]}
        </Avatar>
      </Tooltip>
    );
  }
  return (
    <Tooltip
      sx={{
        boxShadow: 3,
      }}
      title={!noTooltip ? <ItemCard id={id} item={items[id]} /> : null}
      placement="right-start"
    >
      <Avatar
        sx={{ cursor: 'pointer' }}
        variant="rounded"
        src={iconFromId(items[id].icon)}
        onClick={handleClick}
      />
    </Tooltip>
  );
};

import { CompactItem } from '../../../components/CompactItem';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { TItem } from '../../../../types';
import { useItemContext } from '../../../contexts/itemsContext';
import { ItemIconAndTitle } from './ItemIconAndTitle';

export function CraftsInto(props: { item: TItem }) {
    const { item } = props;
    const { items } = useItemContext();
    const usedForItemsArr = item.partOf.map(id => items[id])

    if (usedForItemsArr.length === 0) return null;
    return (
        <Box sx={{ width: '500px', paddingTop: '5px' }}>
            <Typography variant="h6">Used for</Typography>
            {
                usedForItemsArr.length > 4
                    ? <TiledItems items={usedForItemsArr} />
                    : <ListedItems items={usedForItemsArr} />
            }
        </Box>
    )
}

function TiledItems({ items }: { items: TItem[] }) {
    if (!items || items.length === 0) return null;
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', paddingTop: '5px' }}>
            {items.map((item, index) => (
                <CompactItem key={`used_for_${item.id}_${index}`} id={item.id} />
            ))}
        </Box>
    )
}

function ListedItems({ items }: { items: TItem[] }) {
    if (items.length === 0) return null;
    const navigate = useNavigate();

    return (
        <Box sx={{ paddingTop: '5px' }}>
            {items.map((item) => (
                <ItemIconAndTitle 
                    key={item.id}
                    sx={{
                        paddingLeft: '30px',
                        cursor: 'pointer',
                        '&:hover': {
                            background: '#2b2b2b'
                        }
                    }}
                    onClick={() => { navigate(`/item/${item.id}`) }}
                    item={item}/>
            ))}
        </Box>
    )
}
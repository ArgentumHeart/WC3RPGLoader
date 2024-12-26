
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { ItemIconAndTitle } from './ItemIconAndTitle';
import { grey, lightBlue } from '@mui/material/colors';
import { TItem } from '../../../../types';
import { useItemContext } from '../../../contexts/itemsContext';


export function ItemDependenciesTree(props: {item: TItem}) {
    const { item } = props;
    if (item.recipe.length === 0) return null;
    return (
      <Box sx={{ width: '500px', paddingTop: '15px'}}>
        <Typography variant="h6">Crafting</Typography>
        <TreeView sx={{ paddingTop: '10px' }}>
          {
            // additional indexing for recipes with duplicate items
            item.recipe.map((craftingId, index) => (
              <ItemDependency key={`${craftingId}_${index}`} index={item.id} id={craftingId} />
            ))
          }
        </TreeView>
      </Box>
    )
  }

  
function ItemDependency(props: {id: string; index: string;}) {
    const { items } = useItemContext();
    const { id, index } = props;
    const item = items[id];
    const newIndex = index + '_' + id;
  
    if (!item) {
      return (
        <TreeItem nodeId={newIndex} label={
          <Box sx={{display:'flex', flexDirection:'row', alignContent: 'center'}}>
            <Avatar sx={{ bgcolor: grey[500], marginRight: '10px' }} variant="rounded">
              {id[0]}
            </Avatar>
            <Typography variant="body2">{id}</Typography>
          </Box>
        }/>
      );
    }
    return (
      <TreeItem
        nodeId={newIndex}
        label={
          <Box sx={{display:'flex', flexDirection:'row', alingItems: 'center', justifyContent: 'space-between'}}>
            <ItemIconAndTitle item={item} />
            { item.sourceShort && <Typography variant="body2" sx={{ color: lightBlue[300], lineHeight: '40px' }}>{item.sourceShort}</Typography> }
          </Box>
        }>
        {
          item.recipe.map((id, index) => (
            <ItemDependency key={newIndex + id + '_' + index} index={newIndex} id={id} />
          ))
        }
      </TreeItem>
    )
  }
  
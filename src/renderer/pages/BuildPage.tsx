import { FC, useEffect, useRef, useState } from 'react';
import { EvoStash } from '../components/Stash';
import { ItemsPage } from './ItemsPage';
import { useLocation, useParams } from 'react-router-dom';
import { useBuildsContext } from '../contexts/buildsContext';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  TextField,
  Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { ItemPage } from './ItemPage';
import { BackButton } from '../components/BackButton';
import { BuildProgress } from '../feature/builds/components/BuildProgress';

const EMPTY_ITEM = '';

export const BuildPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { builds, saveBuild } = useBuildsContext();
  const buildId = id ? Number(id) : null;
  const existingBuild = builds && buildId ? builds[buildId] : undefined;
  const [items, setItemIds] = useState<string[]>(
    existingBuild ? existingBuild.items : Array(6).fill(EMPTY_ITEM),
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const playerItems = location.state?.playerItems;
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [itemSelected, setItemSelected] = useState<string | null>(null);

  useEffect(() => {
    if (existingBuild) {
      setItemIds(existingBuild.items);
      if (nameRef.current) {
        nameRef.current.value = existingBuild.name;
      }
    }
  }, []);

  const handleItemAdd = (id: string) => {
    const emptyIndex = items.findIndex((itemId) => !itemId);
    if (emptyIndex !== -1) {
      const newItems = [...items];
      newItems[emptyIndex] = id;
      setItemIds(newItems);
    }
  };

  const handleItemRemove = (index: number) => {
    const newItems = [...items];
    newItems[index] = EMPTY_ITEM;
    setItemIds(newItems);
  };

  const getBuild = () => {
    const name = nameRef.current ? nameRef.current.value : '';
    return { id: buildId, name: name || `Build ${buildId}`, items };
  };

  const handleSaveBuild = () => {
    const build = getBuild();
    saveBuild(build);
  };

  const handleExport = () => {
    const name = nameRef.current ? nameRef.current.value : '';
    const build = { name: name || `Build ${buildId}`, items };
    navigator.clipboard.writeText(JSON.stringify(build));
  };

  const handleImport = () => {
    const text = importRef.current?.value;
    if (!text) {
      return;
    }

    try {
      const build = JSON.parse(text);
      if (Array.isArray(build.items) && build.items.length === 6) {
        setItemIds(build.items);
        if (nameRef.current) {
          nameRef.current.value = build.name;
        }
      }
      setImportModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <BackButton />
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start' }}>
        <Box
          sx={{
            maxWidth: `${playerItems ? '400px' : 'auto'}`,
            minWidth: '400px',
          }}
        >
          <TextField
            inputRef={nameRef}
            defaultValue={existingBuild ? existingBuild.name : ''}
            id="name"
            label="Build title"
            variant="standard"
            sx={{ marginBottom: '10px' }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              paddingBottom: '20px',
            }}
          >
            <EvoStash
              sx={{
                display: 'flex',
                flexDirection: 'row',
                paddingRight: '20px',
              }}
              itemIds={items}
              onItemClick={handleItemRemove}
            />
          </Box>
          <Button
            sx={{ paddingX: '40px', marginRight: '10px' }}
            variant="contained"
            onClick={handleSaveBuild}
            disabled={
              buildId
                ? JSON.stringify(getBuild()) === JSON.stringify(builds[buildId])
                : false
            }
          >
            Save
          </Button>
          <Tooltip
            title="Import build"
            disableInteractive
            placement="top"
            arrow
          >
            <IconButton onClick={() => setImportModalOpen(true)}>
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Export build (copy to clipboard)"
            disableInteractive
            placement="top"
            arrow
          >
            <IconButton onClick={handleExport}>
              <ContentPasteIcon />
            </IconButton>
          </Tooltip>
          <Divider sx={{ marginTop: '20px', marginBottom: '20px' }} />
          {itemSelected ? (
            <ItemPage
              itemId={itemSelected}
              onBackClick={() => setItemSelected(null)}
              onItemSelect={setItemSelected}
              onAddToBuild={handleItemAdd}
            />
          ) : (
            <ItemsPage onItemSelect={setItemSelected} />
          )}
        </Box>
        <Divider orientation="vertical" flexItem sx={{ marginX: '16px' }} />
        <Box sx={{ width: '100%', minWidth: '400px' }}>
          <BuildProgress
            title="Items needed to craft this build"
            itemIdsList={playerItems}
            buildItems={items}
            defaultExpanded={!!playerItems}
          />
        </Box>
      </Box>
      <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            inputRef={importRef}
            id="import"
            label="Paste build here"
            variant="standard"
            sx={{ marginBottom: '10px', width: '100%' }}
          />
          <Button
            variant="contained"
            onClick={handleImport}
            sx={{ paddingX: '40px' }}
          >
            Import
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

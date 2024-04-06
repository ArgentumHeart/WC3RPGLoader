import { useState } from 'react';
import Button from '@mui/material/Button';
import { Key } from '../../constants/keyCodes';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export function FishingPage() {
  const [rodButton, setRodButton] = useState(Key.NumPad8);

  const handleChange = (event: SelectChangeEvent) => {
    // @ts-ignore
    setRodButton(event.target.value);
  };
  const onStartClick = () => {
    window.electron.ipcRenderer.sendMessage('fishing_arm', rodButton);
  }

  const onCancelClick = () => {
    window.electron.ipcRenderer.sendMessage('fishing_disarm');
  }

  const keys = Object.keys(Key).map(item => Number(item)).filter((item) => !isNaN(item));

  return (
    <>
      <Typography variant="h6">Current hotkeys:</Typography>
      <Typography variant="body2">Ctrl + 9: fish perfect</Typography>
      <Typography variant="body2">Ctrl + 0: fish standard</Typography>
      <Typography variant="body2">Ctrl + -: pause</Typography>

      <Typography variant="body1">Set 1920x1080 resolution for this to work.</Typography>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="standard-label">Rod hotkey</InputLabel>
        <Select
          labelId="standard-label"
          id="select-standard"
          value={rodButton}
          onChange={handleChange}
          label="Age"
        >
          {keys.map(value => (
            <MenuItem value={value}>
              {Key[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <Button onClick={onStartClick} color="success">
        Start
      </Button>
      <Button onClick={onCancelClick} color="warning">
        Stop
      </Button>
    </>
  )
}

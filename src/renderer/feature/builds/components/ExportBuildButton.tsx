import { FC, useState } from 'react';
import { IconButton, ButtonProps, Tooltip } from '@mui/material';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

interface ExportBuildButtonProps extends ButtonProps {
  tooltipTitle: string;
  name: string;
  items: string[] | null;
}

export const ExportBuildButton: FC<ExportBuildButtonProps> = ({ ...props }) => {
  const { name, items, tooltipTitle } = props;
  const [dynamicTooltipTitle, setDynamicTooltipTitle] = useState<string>();
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const handleExport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const build = { name, items };
    navigator.clipboard.writeText(JSON.stringify(build));
    setTooltipOpen(false);
    setTimeout(() => {
      setTooltipOpen(true);
      setDynamicTooltipTitle('Copied to clipboard!');
    }, 80);
  };
  return (
    <Tooltip
      open={tooltipOpen}
      onMouseEnter={() => {
        setDynamicTooltipTitle(tooltipTitle);
        setTooltipOpen(true);
      }}
      onMouseLeave={() => setTooltipOpen(false)}
      title={dynamicTooltipTitle}
      disableInteractive
      placement="top"
      arrow
    >
      <IconButton onClick={handleExport}>
        <ContentPasteIcon />
      </IconButton>
    </Tooltip>
  );
};

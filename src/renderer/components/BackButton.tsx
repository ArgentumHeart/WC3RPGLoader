import { FC } from 'react';
import { IconButton, Typography, ButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps extends ButtonProps {
  onClick?: () => void;
}

export const BackButton: FC<BackButtonProps> = ({ ...props }) => {
  const { onClick } = props;
  const navigate = useNavigate();
  return (
    <IconButton
      {...props}
      style={{ left: -10 }}
      onClick={() => (onClick ? onClick() : navigate(-1))}
    >
      <ArrowBackIcon />
      <Typography variant="caption" />
    </IconButton>
  );
};

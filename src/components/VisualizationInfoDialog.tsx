import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import infoHolder from '../utils/infoHolder';

interface VisualizationInfoDialogProps {
  visualizationKey: keyof typeof infoHolder.visualizationLogicRegistry;
  title?: string;
}

const VisualizationInfoDialog: React.FC<VisualizationInfoDialogProps> = ({ visualizationKey, title }) => {
  const [open, setOpen] = useState(false);
  const info = infoHolder.visualizationLogicRegistry[visualizationKey];

  if (!info) {
    return null;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title={`Show ${title || 'visualization'} info`}>
        <IconButton size="small" color="primary" onClick={handleOpen}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title || info.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Description:</strong>
          </DialogContentText>
          <DialogContentText>{info.description}</DialogContentText>

          <DialogContentText style={{ marginTop: '15px' }}>
            <strong>Formula:</strong>
          </DialogContentText>
          <DialogContentText>{info.formula}</DialogContentText>

          <DialogContentText style={{ marginTop: '15px' }}>
            <strong>Rules:</strong>
          </DialogContentText>
          <ul>
            {info.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VisualizationInfoDialog;
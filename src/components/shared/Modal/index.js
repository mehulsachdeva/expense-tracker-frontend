import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';

import './style.scss';

function Modal(props) {
    const { onClose, open } = props;

    const handleClose = () => {
        props.handleStateClose(false);
        onClose()
    };

    return (
        <Dialog 
            class = "simple-modal-container" 
            onClose={handleClose} 
            aria-labelledby="simple-dialog-title" 
            open={open}
        >
            <div class = "simple-modal-close-handler">
                <div class = "close-symbol" onClick = {handleClose}>
                    X
                </div>
            </div>
            {props.data}
        </Dialog>
    );
}

SimpleModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default function SimpleModal(props) {
    const [open, setOpen] = React.useState(props.openModal);
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Modal 
            open = {open} 
            onClose = {handleClose} 
            data = {props.children}
            handleStateClose = {props.handleStateClose}
        />
      </div>
    );
}


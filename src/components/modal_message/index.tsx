import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { MdErrorOutline } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";

import { varela_round } from '@/app/fonts/fonts';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 300,
	maxWhidth: 600,
	borderRadius:5,
  bgcolor: 'var(--theme-secundary)',
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  message: { type: string; text: string };
}

export default function BasicModal({ open, handleClose, message }: ModalProps) {
  return (
    <Modal 
			open={open} 
			onClose={handleClose} 
			aria-labelledby="modal-title" 
			aria-describedby="modal-description"
		>
      <Box sx={style}>
        <Box sx={{display:'flex', alignItems:'center', gap:1}}>
					
					{
						message.type === 'success' ?
						<FaRegCircleCheck className='text-[2rem]'/> : <MdErrorOutline className='text-[2rem]'/>
					}

					<Typography id="modal-title" sx={{ fontFamily: varela_round.style.fontFamily}} variant="h6" component="h2">
       	  	 {message.type === 'success' ? 'Sucesso' : 'Erro'}
        	</Typography>
				</Box>
        
				<Typography sx={{ fontFamily: varela_round.style.fontFamily, mt:2}} id="modal-description">
          {message.text}
        </Typography>
      </Box>
    </Modal>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import api from '../Api'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "#fff",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(1, 6, 4),
    },
}));

const RemoveMember = (props) => {
    let inputRef = useRef(null);
    const classes = useStyles();
    const [spinner, setSpinner] = useState(false);
    const [groupName, setGroupName] = useState(" ");
    const [errorMessage, setErrorMessage] = useState(null);



    const handleClose = () => {
        props.onClose();
    };

    const handleDeleteMember = async(memberEmail) => {
        //axios does not support request body in delete mode , thats why we need to send body inside data 
        // console.log(group_id+" "+memberEmail)
    
         try {
             setSpinner(true)
             let response = await api.delete('/groups/member/delete', 
             {
                 data:{
                     member : props.memberEmail,
                     group_id : props.group_id
                 }
             }
             );
             console.log(response.data)
             if(response.data.success === true) {
                 setSpinner(false)
                 props.onRefresh();
                 props.onClose();
                return alert('Deleted')
             } else {
                 setSpinner(false)
                return alert(response.data.status)
             }
         } catch(err) {
             setSpinner(false)
             alert('Something went wrong!!')
            return console.log(err?.response?.data?.status)
         }
     }



    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={true}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={true}>
                    <div className={classes.paper}>
                        <div className="flexCol justifyCenter" style={{ background: '#fff' }}>
                            <div className="flexCol justifyCenter" style={{ background: '#fff' }}>
                                <div className="flexRow justifyBetween">
                                    <h3>Delete Member</h3>
                                </div>
                                <div className="flexCol">
                                    <span>{`Are you sure you want to remove ${props.memberEmail} ?`} </span>
                                    <div className="flexRow  justifyEvenly">
                                        <Button disabled={spinner} onClick={handleDeleteMember} variant="contained" color="primary" >
                                            Yes
                                    </Button>
                                        <Button disabled={spinner} onClick={() => props.onClose()} variant="contained" color="primary" >
                                            No
                                    </Button>
                                    </div>

                                    {spinner && <CircularProgress style={{ height: '25px', width: '25px', alignSelf: 'center' }} />}
                                </div>
                            </div>
                        </div>
                    </div>

                </Fade>
            </Modal>
        </div>
    );
}

export default RemoveMember;



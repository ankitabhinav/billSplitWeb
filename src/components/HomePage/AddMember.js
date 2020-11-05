import React, {useState, useRef, useEffect} from 'react';
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
        padding: theme.spacing(1,6,4),
    },
}));

const AddGroup = (props) => {
    let inputRef = useRef(null);   
    const classes = useStyles();
    const [spinner, setSpinner] = useState(false);
    const [memberEmail, setMemberEmail] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);



    const handleClose = () => {
        props.onClose();
    };

    const handleMemberEmailInput = (e) => {
        setMemberEmail(e.target.value);
    }

    const handleSubmit = async() => {
        if (memberEmail === null || memberEmail.length < 1) {
            return setErrorMessage('Member email is empty')
        }

        if(!ValidateEmail(memberEmail)) {
            return setErrorMessage('Wrong Email address')
        }
        
        if (memberEmail.length < 5) {
            return setErrorMessage('Enter atleast 5 characters')
        }
        setErrorMessage(null);

        console.log('member : ' + memberEmail + 'id : ' + props.group_id)

        try {
            setSpinner(true);

            let response = await api.post('/groups/member/add', {
                group_id: props.group_id,
                member: memberEmail
            })

            //console.log(response.data)

            if (response.data.success === true) {
                setSpinner(false);
                props.onRefresh();
                props.onClose();
                return alert('Member Added')
            } else {
                setSpinner(false);
                return alert(response?.data?.status)
            }
        } catch (err) {
            console.log(err?.response?.data)
            setSpinner(false);
            return alert('something went wrong')
        }
    }

    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        
        return (false)
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
                            <h3>Add Member</h3>
                            <TextField 
                                id="member email" 
                                label="Member Email" 
                                style={{marginBottom:'10px'}}
                                error={errorMessage ? true : false}
                                helperText={errorMessage} 
                                onChange={handleMemberEmailInput}
                                inputRef = {inputRef}
                                autoFocus={true}
                                value={memberEmail}
                                />
                           {spinner && <CircularProgress style={{height:'25px', width:'25px', alignSelf:'center'}} />}
                           {!spinner && <Button onClick={handleSubmit} variant="contained" color="primary" style={{alignSelf:'center'}}>
                                Add
                        </Button>}
                        </div>
                    </div>

                </Fade>
            </Modal>
        </div>
    );
}

export default AddGroup;



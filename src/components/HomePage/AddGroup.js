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
    const [groupName, setGroupName] = useState(" ");
    const [errorMessage, setErrorMessage] = useState(null);



    const handleClose = () => {
        props.onClose();
    };

    const handleGroupInput = (e) => {
        setGroupName(e.target.value);
    }

    const handleSubmit = async() => {
        if (groupName.length<1) {
            return setErrorMessage('Group name is empty')
        }
        if(groupName. length < 5) {
            return setErrorMessage('Enter atleast 5 characters')
        }
        setErrorMessage(null);

        try {
            setSpinner(true);
            let response = await api.post('/groups',{
                group_name: groupName
            })

            //console.log(response.data)

            if(response.data.success === true) {
                setSpinner(false);
                props.onClose();
                props.refresh();
                return alert('Group Created')
            } else {
                setSpinner(false);
                return  alert('something went wrong')
            }
        } catch(err) {
            console.log(err.response.data)
            setSpinner(false);
            return  alert('something went wrong')
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
                            <h3>New Group</h3>
                            <TextField 
                                id="standard-basic" 
                                label="Group Name" 
                                style={{marginBottom:'10px'}}
                                error={errorMessage ? true : false}
                                helperText={errorMessage} 
                                onChange={handleGroupInput}
                                inputRef = {inputRef}
                                autoFocus={true}
                                />
                           {spinner && <CircularProgress style={{height:'25px', width:'25px', alignSelf:'center'}} />}
                           {!spinner && <Button onClick={handleSubmit} variant="contained" color="primary" style={{alignSelf:'center'}}>
                                Create
                        </Button>}
                        </div>
                    </div>

                </Fade>
            </Modal>
        </div>
    );
}

export default AddGroup;



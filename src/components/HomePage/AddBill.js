import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, CircularProgress, Divider, FormControl, FormControlLabel, FormLabel, IconButton, ListItem, ListItemIcon, ListItemText, Paper, Radio, RadioGroup, TextField, Zoom } from '@material-ui/core';
import api from '../Api'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


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

const ListItemComp = (props) => {
    return (
        <Zoom in={true}>
            <Paper elevation={0} style={{ background: 'transparent' }}>
                <ListItem button onClick={props.onClick}>
                    <ListItemText primary={props.title} onClick={() => props.onSelect(props.title)} />
                </ListItem>
                <Divider />
            </Paper>
        </Zoom>
    )
}

const AddBill = (props) => {
    let inputRef = useRef(null);
    const classes = useStyles();
    const [spinner, setSpinner] = useState(false);
    const [groupName, setGroupName] = useState(" ");
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [value, setValue] = React.useState('split');
    const [billAmountInput, setBillAmountInput] = useState(null);
    const [billDescriptionInput, setBillDescriptionInput] = useState(null);
    const [lentToInput, setLentToInput] = useState(null);
    const [viewMembers, setViewMembers] = useState(false)

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = async () => {

        if (billDescriptionInput === null || billDescriptionInput.length < 1) {
            setErrorType('billDescError')
            return setErrorMessage('Bill description is empty')
        }

        if (billAmountInput === null || billAmountInput.length < 1) {
            setErrorType('billAmountError')
            return setErrorMessage('Bill amount is empty')
        }

        if (value === 'lent' && (lentToInput === null || lentToInput.length < 1)) {
            setErrorType('lentToError')
            return setErrorMessage('Borrower email is empty')
        }
        setErrorMessage('');

        // console.log('member : ' + memberEmail + 'id : ' + props.group_id)

        try {
            setSpinner(true);

            let response = await api.post('/groups/transaction/add', {
                group_id: props.group_id,
                amount: billAmountInput,
                type: value,
                purpose: billDescriptionInput,
                to: value === 'lent' ? lentToInput : null
            })

           console.log(response.data)

            if (response.data.success === true) {
                setSpinner(false);
                props.onRefresh();
                props.onClose();
                return alert('Bill Added')
            } else {
                setSpinner(false);
                return alert('something went wrong 1')
            }
        } catch (err) {
            console.log(err?.response?.data)
            setSpinner(false);
            return alert('something went wrong 1')
        }

    }

    const handleBillDescriptionInput = (e) => {
        setBillDescriptionInput(e.target.value)
        //let iconname = getIcons(e);
        //setDescIcon(iconname);
    }



    const handleLentToInput = (e) => {
        setLentToInput(e.target.value)
    }
    const handleBillAmountInput = (e) => {
        setBillAmountInput(e.target.value);
    }



    const handleClose = () => {
        props.onClose();
    };


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
                        {!viewMembers && <div className="flexCol justifyCenter" style={{ background: '#fff' }}>
                            <h3>Add Bill</h3>
                            <TextField
                                id="bill_description"
                                label="Bill Description"
                                style={{ marginBottom: '10px' }}
                                error={errorType === 'billDescError' ? true : false}
                                helperText={errorType === 'billDescError' ? errorMessage : null}
                                onChange={handleBillDescriptionInput}
                                autoFocus={true}
                                value={billDescriptionInput}
                                disabled={spinner}
                            />

                            <TextField
                                id="bill_amount"
                                label="Bill Amount"
                                style={{ marginBottom: '10px' }}
                                error={errorType === 'billAmountError' ? true : false}
                                helperText={errorType === 'billAmountError' ? errorMessage : null}
                                onChange={handleBillAmountInput}
                                value={billAmountInput}
                                disabled={spinner}

                            />

                            <FormControl component="fieldset">

                                <RadioGroup aria-label="bill type" name="bill_type" value={value} onChange={handleChange} >
                                    <FormControlLabel disabled={spinner} value="split" control={<Radio />} label="Split Equally" />
                                    <FormControlLabel disabled={spinner} value="lent" control={<Radio />} label="Lent" />
                                </RadioGroup>
                                {value === 'lent' && <TextField
                                    id="borrower_email"
                                    label="Borrower's Email"
                                    style={{ marginBottom: '10px' }}
                                    error={errorType === 'lentToError' ? true : false}
                                    helperText={errorType === 'lentToError' ? errorMessage : null}
                                    onChange={handleLentToInput}
                                    onFocus={() => setViewMembers(true)}
                                    value={lentToInput}
                                    disabled={spinner}

                                />}
                            </FormControl>
                            {spinner && <CircularProgress style={{ height: '25px', width: '25px', alignSelf: 'center' }} />}
                            {!spinner && <Button onClick={handleSubmit} variant="contained" color="primary" style={{ alignSelf: 'center' }}>
                                Add
                        </Button>}
                        </div>}


                        {viewMembers &&
                            <div className="flexCol justifyCenter" style={{ background: '#fff' }}>
                                <div className="flexRow justifyBetween">
                                    <h3>Add Member</h3>
                                    <IconButton onClick={() => setViewMembers(false)} aria-label="go back" >
                                        <ArrowBackIcon style={{ color: 'black', marginLeft:'10px' }} />
                                    </IconButton>
                                </div>
                                <div className="flexCol">
                                    {props.members.map((item, index) => {
                                        return <ListItemComp key={index} title={item.email} onSelect={(data) => {setLentToInput(data); setViewMembers(false)}}/>
                                    })}
                                </div>
                                

                            </div>
                            }
                    </div>

                </Fade>
            </Modal>
        </div >
    );
}

export default AddBill;



import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, CircularProgress, Divider, FormControl, FormControlLabel, FormLabel, IconButton, ListItem, ListItemIcon, ListItemText, Paper, Radio, RadioGroup, TextField, Zoom } from '@material-ui/core';
import api from '../Api'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "#fff",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(1, 8, 4),
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

const ViewBill = (props) => {
    console.log(props.bill)
    let inputRef = useRef(null);
    const classes = useStyles();
    const [spinner, setSpinner] = useState(false);
    const [groupName, setGroupName] = useState(" ");
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [value, setValue] = useState(props.bill.type);
    const [isSettled, setIsSettled] = useState(props.bill.isSettled)
    const [billAmountInput, setBillAmountInput] = useState(props.bill.amount);
    const [billDescriptionInput, setBillDescriptionInput] = useState(props.bill.purpose);
    const [lentToInput, setLentToInput] = useState(props.bill.to ? props.bill.to : null);
    const [viewMembers, setViewMembers] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)

    const [lockFields, setLockFields] = useState(true)

    const [settleSpinner, setSettleSpinner] = useState(false);
    const [deleteSpinner, setDeleteSpinner] = useState(false);

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

    const handleDeleteBill = async() => {
        let item = {
            "started_by": props.bill.started_by,
            "amount": props.bill.amount,
            "type": props.bill.type,
            "purpose": props.bill.purpose,
            "to": props.bill.to
        }

        //axios does not support request body in delete mode , thats why we need to send body inside data 
        try {
            setDeleteSpinner(true);
            // setLockFields(true);

            let response = await api.delete('/groups/transaction/delete',
                {
                    data: {
                        group_id: props.group_id,
                        transaction: item
                    }
                }
            );
            console.log(response.data)
            if (response.data.success === true) {
                setDeleteSpinner(false);
                //setLockFields(false);
                props.onClose();
                props.onRefresh();

                return alert('Bill Deleted')

            } else {
                return alert(response?.data?.status)
            }
        } catch (err) {
            setDeleteSpinner(false);
            // setLockFields(false);
            alert('something went wrong')
            // return console.log(err.response.data.status)
        }

        //console.log(item);
    }

    const handleBillSettle = async () => {
        console.log('settle called')
        setSpinner(true);

        // setLockFields(true);

        try {
            let response = await api.put('/groups/transaction/settle', {
                group_id: props.group_id,
                transaction: { started_by: props.bill.started_by, amount: props.bill.amount, type: props.bill.type, purpose: props.bill.purpose, to: props.bill.to },
                isSettled: props.bill.isSettled ? false : true
            })

            if (response.data.success === true) {
                setSpinner(false);
                //  setLockFields(false);

                props.onClose();
                props.onRefresh();
                return alert(
                    props.bill.isSettled ? 'Bill Unsettled' : 'Bill Settled',
                );
            } else {
                console.log(response.data);
                setSpinner(false);
                //  setLockFields(false);


                return alert('something went wrong')
            }
        } catch (err) {
            console.log(err.response);
            setSettleSpinner(false);
            // setLockFields(false);

            return alert('something went wrong')
        }
    }

    const handleUnSettleBill = () => {

    }

    const handleUpdate = async () => {
        // return
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
            setLockFields(true);

            let response = await api.put('/groups/transaction/update', {
                group_id: props.group_id,
                transaction: { started_by: props.bill.started_by, amount: props.bill.amount, type: props.bill.type, purpose: props.bill.purpose, to: props.bill.to },
                amount: billAmountInput,
                type: value,
                purpose: billDescriptionInput,
                to: value === 'lent' ? lentToInput : null,
                isSettled: props.bill.isSettled
            })

            console.log(response.data)

            if (response.data.success === true) {
                setSpinner(false);
                setLockFields(false);
                props.onRefresh();
                props.onClose();
                return alert('Bill Updated')
            } else {
                setSpinner(false);
                // setLockFields(false);

                return alert('Something went wrong')
            }
        } catch (err) {
            console.log(err?.response?.data)
            setSpinner(false);
            // setLockFields(false);

            return alert('something went wrong')
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
                        {!viewMembers && !showConfirmDelete && <div className="flexCol justifyCenter" style={{ background: '#fff' }}>
                            <div className="flexRow">
                                <h3 style={{ flex: 1 }}>View Bill</h3>
                                <IconButton onClick={() => setLockFields(false)} aria-label="go back" >
                                    <EditIcon style={{ color: 'black', marginLeft: '10px' }} />
                                </IconButton>
                            </div>

                            <TextField
                                id="bill_description"
                                label="Bill Description"
                                style={{ marginBottom: '10px' }}
                                error={errorType === 'billDescError' ? true : false}
                                helperText={errorType === 'billDescError' ? errorMessage : null}
                                onChange={handleBillDescriptionInput}
                                autoFocus={true}
                                value={billDescriptionInput}
                                disabled={lockFields}
                            />

                            <TextField
                                id="bill_amount"
                                label="Bill Amount"
                                style={{ marginBottom: '10px' }}
                                error={errorType === 'billAmountError' ? true : false}
                                helperText={errorType === 'billAmountError' ? errorMessage : null}
                                onChange={handleBillAmountInput}
                                value={billAmountInput}
                                disabled={lockFields}

                            />

                            <FormControl component="fieldset">

                                <RadioGroup aria-label="bill type" name="bill_type" value={value} onChange={handleChange} >
                                    <FormControlLabel disabled={lockFields} value="split" control={<Radio />} label="Split Equally" />
                                    <FormControlLabel disabled={lockFields} value="lent" control={<Radio />} label="Lent" />
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
                                    disabled={lockFields}

                                />}
                            </FormControl>
                            {spinner && <CircularProgress style={{ height: '25px', width: '25px', alignSelf: 'center' }} />}
                            {!spinner &&
                                <div className="flexRow justifyBetween">
                                    {lockFields &&
                                        <>
                                            <Button onClick={() => setShowConfirmDelete(true)} variant="contained" color="primary" >
                                                Delete
                                            </Button>
                                            {!props.bill.isSettled && <Button onClick={handleBillSettle} variant="contained" color="primary" >
                                                Settle
                                            </Button>}
                                            {props.bill.isSettled && <Button onClick={handleBillSettle} variant="contained" color="primary" >
                                                Un-Settle
                                             </Button>}
                                        </>
                                    }

                                    {!lockFields &&
                                        <Button onClick={handleUpdate} variant="contained" color="primary" >
                                            Update
                                    </Button>
                                    }
                                </div>
                            }
                        </div>
                        }


                        {viewMembers &&
                            <div className="flexCol justifyCenter" style={{ background: '#fff' }}>
                                <div className="flexRow justifyBetween">
                                    <h3>Add Member</h3>
                                    <IconButton onClick={() => setViewMembers(false)} aria-label="go back" >
                                        <ArrowBackIcon style={{ color: 'black', marginLeft: '10px' }} />
                                    </IconButton>
                                </div>
                                <div className="flexCol">
                                    {props.members.map((item, index) => {
                                        return <ListItemComp key={index} title={item.email} onSelect={(data) => { setLentToInput(data); setViewMembers(false) }} />
                                    })}
                                </div>


                            </div>
                        }

                        {showConfirmDelete &&
                            <div className="flexCol justifyCenter" style={{ background: '#fff' }}>
                                <div className="flexRow justifyBetween">
                                    <h3>Delete Bill</h3>
                                </div>
                                <div className="flexCol">
                                    <span>Are you sure you want to delete this bill ? </span>
                                    <div className="flexRow  justifyEvenly">
                                        <Button disabled={deleteSpinner} onClick={handleDeleteBill} variant="contained" color="primary" >
                                            Yes
                                    </Button>
                                        <Button disabled={deleteSpinner} onClick={() => setShowConfirmDelete(false)} variant="contained" color="primary" >
                                            No
                                    </Button>
                                    </div>

                                    {deleteSpinner && <CircularProgress style={{ height: '25px', width: '25px', alignSelf: 'center' }} />}
                                </div>
                            </div>
                        }
                    </div>

                </Fade>
            </Modal>
        </div >
    );
}

export default ViewBill;



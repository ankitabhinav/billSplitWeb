import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link, useHistory } from 'react-router-dom'
import api from '../Api'
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


export default function FadeMenu(props) {
    let history = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [deleteSpinner, setDeleteSpinner] = useState(false);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('billsplit_user_key');
        localStorage.removeItem('billsplit_user_email');
        setAnchorEl(null);
        alert('Logged Out')
        history.push('/sign-in')

    }

    const handleDeleteGroup = async () => {
        handleClose();
        try {
            setDeleteSpinner(true);
            let response = await api.delete('/groups/delete_group',
                {
                    data: {
                        group_id: props.group_id
                    }
                }
            );
            // console.log(response.data)
            if (response.data.success === true) {
                setDeleteSpinner(false);
                alert("Group Deleted");
                props.onReload();

            } else {
                setDeleteSpinner(false);
                return alert(response?.data?.status)
            }
        } catch (err) {
            setDeleteSpinner(false);
            alert('something went wrong');
            console.log(err?.response)
        }

    }

    return (
        <div>
            <Backdrop className={classes.backdrop} open={deleteSpinner}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                <MoreVertIcon style={{ color: '#fff' }} />
            </Button>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                {props.group_id && <MenuItem onClick={handleDeleteGroup}>Delete Group</MenuItem>}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}

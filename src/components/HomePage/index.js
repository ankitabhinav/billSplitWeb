import { useEffect, useState } from "react"
import React from 'react'
import { CircularProgress, Divider, IconButton, InputAdornment, makeStyles, Paper, Tab, Tabs, TextField, Zoom } from "@material-ui/core"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import api from '../Api'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddGroup from './AddGroup'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ViewGroup from './ViewGroup'

const CompanyLogo = () => {
    return (
        <>
            <div className="flexRow justifyCenter alignCenter">
                <img
                    style={{ height: 30, width: 30, borderRadius: 10 }}
                    src='https://i.ibb.co/2YNxscS/billsplit-icon.png'
                />
                <span style={{ fontSize: 20, color: '#fff', marginLeft: 5 }}>BillSplit</span>
            </div>

        </>

    )
}

const ListItemComp = (props) => {
    return (
        <Zoom in={true}>
            <Paper elevation={0} style={{ background: 'transparent' }}>
                <ListItem button onClick={props.onClick}>
                    <ListItemIcon>
                        <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary={props.title} secondary={props.subtitle} />
                </ListItem>
                <Divider />
            </Paper>
        </Zoom>
    )
}


const HomePage = (props) => {

    const [value, setValue] = React.useState(0);
    const [spinner, setSpinner] = useState(true);
    const [groups, setGroups] = useState(null);
    const [backup, setBackUp] = useState(null);
    const [modalState, setModalState] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [query, setQuery] = useState('');
    const [showTabs, setShowTabs] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        getGroups();
    }, [])


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const useStyles = makeStyles({
        root: {
            flexGrow: 1,
        },
    });

    const handleRefresh = () => {
        getGroups();
    }

    const handleGroupSelect = (data) => {
        setCurrentGroup(data);
        setShowTabs(true);
    }


    const getGroups = async () => {
        console.log('fetch called')
        try {
            let response = await api.post('/groups/fetch_groups');
            if (response.data.success === true) {
                setGroups(response.data.groups);
                setBackUp(response.data.groups)
                setSpinner(false);
                setRefreshing(false);
               // console.log(response.data.groups);
                return 
            } else {
                setSpinner(false);
                setRefreshing(false);
                return console.log(response.data.status)
            }
        }
        catch (err) {
            setSpinner(false);
            setRefreshing(false);
            return console.log(err.response.data.status)
        }


    }



    return (
        <>
            <div>
                {modalState && <AddGroup onClose={() => setModalState(false)} refresh={handleRefresh} />}
                <div className="flexCol justifyCenter" style={{ height: '120px', backgroundColor: '#2196f3' }}>
                    <div className="flexRow">
                       {showTabs && <IconButton onClick={() => setShowTabs(false)} aria-label="go back">
                            <ArrowBackIcon style={{color:'#fff'}} />
                        </IconButton>}
                    </div>
                    <CompanyLogo />
                    <span style={{ alignSelf: 'center', fontSize: '15px', color: 'white' }}>{localStorage.getItem('billsplit_user_email')}</span>
                </div>

                {showTabs && <ViewGroup group={currentGroup} />}

                {!showTabs &&
                    <>
                        <div>
                            <h3>My Groups</h3>
                        </div>
                        {spinner && <div className="flexRow justifyCenter">
                            <CircularProgress />
                        </div>}
                        <div className="flexCol justifyCenter">
                            <List component="nav" aria-label="main mailbox folders">
                                {!spinner && groups &&
                                    groups.map((item, i) => {

                                        return <ListItemComp
                                            key={i}
                                            title={item.group_name}
                                            subtitle={item.created_by}
                                            onClick={() => handleGroupSelect(item)}
                                        />
                                    })
                                }
                            </List>
                            <div className="flexRow justifyEnd">
                                <Fab color="secondary" aria-label="add" onClick={() => setModalState(true)}>
                                    <AddIcon />
                                </Fab>
                            </div>

                        </div>
                    </>
                }

            </div>

        </>
    )
}

export default HomePage;
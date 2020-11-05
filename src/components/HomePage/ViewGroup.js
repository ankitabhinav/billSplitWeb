import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Chip, Divider, Fab, ListItem, ListItemIcon, ListItemText, Paper, Zoom } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import api from '../Api'
import AddIcon from '@material-ui/icons/Add';
import AddBill from './AddBill'
import ViewBill from './ViewBill';


const ListItemComp = (props) => {
    return (
        <Zoom in={true}>
            <Paper elevation={0} style={{ background: 'transparent' }}>
                <ListItem button onClick={props.onClick}>
                    <ListItemIcon>
                        <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary={props.title}
                        secondary={props.subtitle} />
                </ListItem>
                <Divider />
            </Paper>
        </Zoom>
    )
}

const SubtitleComp = ({ type, added_by, isSettled }) => {
    return (
        <div className="flexCol">
            <div className="flexRow">

                {type === 'split' &&
                    <Chip size="small" label="splitted equally" style={{ marginRight: '5px', backgroundColor: '#ffcc00' }} />
                }
                {type === 'lent' &&
                    <Chip color="primary" size="small" label="lent" style={{ marginRight: '5px', backgroundColor: '#ff3300' }} />
                }

                <Chip size="small" label={isSettled ? 'settled' : "not settled"} style={{ backgroundColor: isSettled ? '#64DD17' : '#ffcc00' }} />

            </div>
            <span>{`Added By ${added_by}`}</span>

        </div>
    )
}


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function SimpleTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [summary, setSummary] = useState(null);
    const [showAddBill, setShowAddBill] = useState(false);
    const [showViewBill, setShowViewBill] = useState(false);
    const [currentBill, setCurrentBill] = useState(null);

    const [viewBillModalState, setViewBillModalState] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [transactionsState, setTransactionsState] = useState(props.group.transactions)
    const [viewBillDetail, setViewBillDetail] = useState(null)

    useEffect(() => {
        calculateSummary();
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCurrentBill = (item) => {
        setCurrentBill(item);
        setShowViewBill(true);
    }

    const getTransactions = async () => {
        console.log('fetch transactions called')

        try {
            let response = await api.get('groups/transaction?group_id=' + props.group._id);
           // console.log(response.data);
            if (response.data.success === true) {
                setTransactionsState(response.data.data)
                setSpinner(false);
                setRefreshing(false);
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

    const onRefresh = () => {
        setRefreshing(true);
        getTransactions();
    }

    const calculateSummary = async () => {
        try {
            let response = await api.post('/groups/calculate', {
                group_id: props.group._id
            });
            // console.log(response.data);
            if (response.data.success === true) {
                setSummary(response.data.data);
                //console.log(response.data);

            } else {
                return console.log('unable to fetch summary')
            }

        } catch (err) {
            return console.log(err.response.data);
        }
    }

    //console.log(props.group)

    return (
        <div className={classes.root}>
           {showAddBill && <AddBill onClose={() => setShowAddBill(false) } onRefresh={()=>onRefresh()} group_id={props.group._id} members={props.group.members}/>}
           {showViewBill && <ViewBill onClose={() => {setShowViewBill(false); setCurrentBill(null)} } onRefresh={()=>onRefresh()} bill={currentBill} group_id={props.group._id} members={props.group.members}/>}

            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
                <Tab label="Bills" {...a11yProps(0)} />
                <Tab label="Members" {...a11yProps(1)} />
                <Tab label="Summary" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                {transactionsState?.map((item, i) => {
                    return <ListItemComp
                        key={i}
                        title={'₹ ' + item.amount + ' for ' + item.purpose}
                        onClick={() => handleCurrentBill(item)}
                        subtitle={<SubtitleComp added_by={item.started_by} isSettled={item.isSettled} type={item.type} />}
                    />
                })}
                <div className="flexRow justifyEnd">
                    <Fab color="secondary" aria-label="add" onClick={() => setShowAddBill(true)}>
                        <AddIcon />
                    </Fab>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                {props.group.members.map((item, i) => {
                    return <ListItemComp 
                        key={i}
                        title={item.email.split('@')[0]}
                        subtitle={item.email === props.group.created_by ? 'Admin' : 'Member'}
                    />
                })}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {summary?.map((item, i) => {
                    return <ListItemComp 
                        key={i}
                        title={item.item}
                        subtitle={<Chip size="small" label={item.isSettled ? 'settled' : 'not settled'} style={{ marginRight: '5px', backgroundColor: item.isSettled ? '#64DD17' : '#ff3300' }} />}
                    />
                })}
            </TabPanel>
        </div>
    );
}

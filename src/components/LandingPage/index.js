import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import { Box, Button, CircularProgress, Paper, Typography } from '@material-ui/core';
import Zoom from '@material-ui/core/Zoom';
import { Auth, NotAuth } from '../Auth'
import {useHistory} from 'react-router-dom'
import {checkAuth} from '../Utilities'

const LandingPage = (props) => {
    let history = useHistory(); 
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            if(checkAuth()) {
                history.push('/home')
            }
        },3000)
    })


    return (
        <div className="flexCol alignCenter justifyCenter" style={{ height: '100vh' }}>

            <Box position="relative" display="inline-flex">
                <CircularProgress variant="indeterminate" size={80} thickness={2.5} {...props} />
                <Box
                    top={5}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="caption" component="div" color="textSecondary">
                        <img src="/android-icon-192x192.png" style={{ height: '60px', width: '60px', borderRadius: '50%' }} />
                    </Typography>
                </Box>
            </Box>
            <h3>Bill Split</h3>

            <NotAuth> {/* HOC that renders children only when user is not logged in */}
                <div className="flexRow">
                    <Zoom in={true}>
                        <Paper elevation={0}>
                            <Button onClick={() => history.push('/sign-in')} variant="outlined" color="primary" style={{ margin: '10px' }}>
                                Sign In
                            </Button>
                            <Button onClick={() => history.push('/sign-up')} variant="outlined" color="primary" style={{ margin: '10px' }}>
                                Sign Up
                            </Button>
                        </Paper>
                    </Zoom>
                </div>
            </NotAuth>
        </div>
    )
}
export default LandingPage;
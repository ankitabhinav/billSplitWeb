import React from 'react'
import Grid from '@material-ui/core/Grid';
import { Box, CircularProgress, Typography } from '@material-ui/core';

const LandingPage = (props) => {
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
                        <img src="/android-icon-192x192.png" style={{ height: '60px', width: '60px', borderRadius:'50%' }} />
                    </Typography>
                </Box>
            </Box>
            <h3>Bill Split</h3>
           {/*  <img src="/android-icon-192x192.png" style={{ height: '80px', width: '80px' }} /> */}
        </div>
    )
}
export default LandingPage;
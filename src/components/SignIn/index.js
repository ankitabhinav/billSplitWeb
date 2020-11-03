import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Link, useHistory} from 'react-router-dom'
import {Show} from '../Alert'
import api from '../Api'
import { AssignmentReturn } from '@material-ui/icons';


function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://billsplitweb.netlify.app/">
        Bill Split
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    let history = useHistory();
    const classes = useStyles();

    const [spinner, setSpinner] = useState(false);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }

        return (false)
    }

  

    const handleLogin = async () => {
        setSpinner(true);
        console.log('Email :' + email + '  Password:' + password)
        if (email === null || password === null) {
            setSpinner(false);
            return alert('enter email and password to continue');
        }

        if (!ValidateEmail(email)) {
            setSpinner(false);
            return alert("You have entered an invalid email address!");
        }

        try {
            let response = await api.post('/login', {
                email: email,
                password: password
            });

            if (response.data.status === 'login successful') {
                try {
                    localStorage.setItem('billsplit_user_key', response.data.jwt);
                    localStorage.setItem('billsplit_user_email', response.data.email);
                } catch (err) {
                    console.log(err);
                }
                alert('Login Successful')
                history.push('/home')
                

            }
            console.log(response.data);

        }
        catch (err) {
            console.log(err.response.data);
            alert('error'+err.response.data.status)

        }

        setSpinner(false);

    }

    return (
        <>
            <div className="flexRow">
                <IconButton onClick={() => history.goBack()} aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <Container component="main" maxWidth="xs">

                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <div className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleEmail}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handlePassword}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            onClick={handleLogin}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot Password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/sign-up" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
}
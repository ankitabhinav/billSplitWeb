import React, { useState } from 'react';
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
import { CircularProgress, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  let history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const classes = useStyles();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }
  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  }

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }

    return (false)
  }

  const handleRegister = async () => {
    setSpinner(true);
    //console.log('Email :' + email + '  Password:' + password + 'confirm password:' + confirmPassword)
    if (email === null || password === null || confirmPassword == null) {
      setSpinner(false);
      return alert('enter email and password and confirm password to continue');
    }

    if (!ValidateEmail(email)) {
      setSpinner(false);
      return alert("You have entered an invalid email address!");
    }

    if (password !== confirmPassword) {
      setSpinner(false);
      return alert('Passwords do not match !')
    }
    try {
      let response = await axios.post('https://secure-notes-backend.herokuapp.com/register', {
        name: email.split('@')[0],
        email: email,
        password: password,
        secret_key: '12345'
      });

      if (response.data.status === 'registered successfully') {
       // console.log(response.data);
        setSpinner(false);
        alert("Registered Successfully");
        return history.push('/sign-in')

      } else {
        setSpinner(false);

        return alert('something went wrong')
      }

    }
    catch (err) {
      if (err.response) {
        setSpinner(false);
        console.log(err.response.data);
        alert(err?.response?.data?.status);
        return;
      } else {
        setSpinner(false);
        return alert('something went wrong')
      }

    }
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
            Sign up
        </Typography>
          <div className={classes.form} noValidate>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmail}
                  disabled={spinner}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handlePassword}
                  disabled={spinner}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Confirm Password"
                  type="password"
                  id="confirm_password"
                  autoComplete="confirm-password"
                  onChange={handleConfirmPassword}
                  disabled={spinner}
                />
              </Grid>
              <Grid item xs={12}>
                <div className="flexRow justifyCenter alignCenter">
                {spinner && <CircularProgress style={{ height: '25px', width: '25px', alignSelf: 'center' }} />}
                {!spinner && <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleRegister}
                >
                  Sign Up
          </Button>
                }
                </div>
                
              </Grid>

            </Grid>

            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/sign-in" variant="body2">
                  Already have an account? Sign in
              </Link>
              </Grid>
            </Grid>
          </div>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}
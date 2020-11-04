import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LandingPage from "./components/LandingPage";
import SignUp from './components/SignUp'
import SignIn from "./components/SignIn";
import HomePage from './components/HomePage'
import {Auth} from './components/Auth'

const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md" style={{padding:'0px'}}>
        <Typography component="div" style={{ /* backgroundColor: '#fff',  */height: '100vh' }}>
          <Router>
              <Route exact path="/">
                <LandingPage value="50" />
              </Route>
              <Route path="/sign-up">
                <SignUp/>
              </Route>
              <Route path="/sign-in">
                <SignIn/>
              </Route>
              <Route path="/home">
                <Auth> {/* HOC that renders its children only when user is logged in  */}
                  <HomePage/>
                </Auth>
              </Route>
          </Router>
        </Typography>
      </Container>
    </React.Fragment>

  );
}

export default App;

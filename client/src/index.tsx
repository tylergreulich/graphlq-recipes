import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import ApolloClient, { Operation } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Home from './components/Home/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Navbar from './components/Navigation/Navbar';
import { Search } from './components/Recipe/Search';
import AddRecipe from './components/Recipe/AddRecipe';
import RecipePage from './components/Recipe/RecipePage';
import Profile from './components/Profile/Profile';

import { withSession } from './components/withSession';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: (operation: Operation): any => {
    const token = localStorage.getItem('jwtToken');
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log('[Network Error]', networkError);
    }
  }
});

const Root = ({ refetch, session }: any) => (
  <BrowserRouter>
    <>
      <Navbar session={session} />
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/search" component={Search} />
        <Route
          exact={true}
          path="/register"
          render={() => <Register refetch={refetch} />}
        />
        <Route
          exact={true}
          path="/login"
          render={() => <Login refetch={refetch} />}
        />
        <Route
          exact={true}
          path="/recipe/add"
          render={() => <AddRecipe session={session} />}
        />
        <Route exact={true} path="/recipe/:_id" component={RecipePage} />
        <Route
          exact={true}
          path="/profile"
          render={() => <Profile session={session} />}
        />
        <Redirect to="/" />
      </Switch>
    </>
  </BrowserRouter>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();

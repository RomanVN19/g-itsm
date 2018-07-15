import React, { Component } from 'react';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuIcon from '@material-ui/icons/Menu';
import AppIcon from '@material-ui/icons/Apps';

import InfoOutline from "@material-ui/icons/InfoOutline";
import Check from "@material-ui/icons/Check";
import Warning from "@material-ui/icons/Warning";
import Snackbar from 'material-kit-react/dist/components/Snackbar/SnackbarContent';

import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';

import Scrollbar from 'react-custom-scrollbars';

import { primaryColor, defaultFont, primaryBoxShadow } from 'material-kit-react/dist/assets/jss/material-kit-react';

const DocIcon = () => (
  <SvgIcon>
    <svg viewBox="0 0 24 24">
      <path fill="#000000" d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
    </svg>
  </SvgIcon>
);

const drawerWidth = 250;
const collapsedDrawerWidth = 56;
const styles = {
  root: {
    display: 'flex',
  },
  main: {
    padding: 20,
    flex: 1,
  },
  drawerPaper: {
    width: collapsedDrawerWidth,
    backgroundColor: '#222222',
    transition: 'all 100ms linear',
  },
  drawerOpen: {
    width: drawerWidth,
  },
  list: {
    '& svg path': {
      fill: '#fff',
    },
    '& span': {
      color: '#fff',
    },
    '& div': {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  currentItem: {
    backgroundColor: primaryColor,
    ...primaryBoxShadow,
    '&:hover': {
      backgroundColor: primaryColor,
      ...primaryBoxShadow,
    },
  },
  listItem: {
    width: 'auto',
    transition: 'all 300ms linear',
    margin: '10px 15px 0',
    borderRadius: '3px',
    position: 'relative',
    ...defaultFont,
    '&:hover': {
      backgroundColor: '#666666',
    },
  },
  icon: {
    margin: 0,
  },
  listItemCollapsed: {
    margin: '10px 0 0',
  },
  snackbar: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 1300,
  },
};


const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    backgroundColor: '#bbbbbb',
    borderRadius: 3,
  };
  return (
    <div
      style={{ ...style, ...thumbStyle }}
      {...props}
    />
  );
};

class MainLayout extends Component {
  state = {
    drawerOpen: true,
  }
  getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return Warning;
      case 'success':
        return Check;
      default:
        return InfoOutline;
    }
  }
  switchDrawer = () => this.setState({ drawerOpen: !this.state.drawerOpen })
  render() {
    const {
      routes, menu, classes, location, title,
      titlePath, logo, alerts,
    } = this.props;
    const { drawerOpen } = this.state;
    const drawerContent = (
      <List className={classes.list}>
        <NavLink to={titlePath}>
          <ListItem
            button
            className={cx(classes.listItem, {
              [classes.listItemCollapsed]: !drawerOpen,
            })}
          >
            <ListItemIcon className={classes.icon}>
              { logo ? <img src={logo} alt="logo" /> : <AppIcon />}
            </ListItemIcon>
            { drawerOpen ?
              <ListItemText primary={title} />
              : null }
          </ListItem>
        </NavLink>

        <ListItem
          button
          onClick={this.switchDrawer}
          className={cx(classes.listItem, { [classes.listItemCollapsed]: !drawerOpen })}
        >
          <ListItemIcon className={classes.icon}><MenuIcon /></ListItemIcon>
          { drawerOpen ? <ListItemText primary="Collapse" /> : null }
        </ListItem>
        {
          (menu || routes).map(route => (
            <NavLink to={route.path} key={route.path}>
              <ListItem
                button
                className={cx(classes.listItem, {
                  [classes.listItemCollapsed]: !drawerOpen,
                  [classes.currentItem]: location.pathname.indexOf(route.path) === 0,
                })}
              >
                <ListItemIcon>{ route.icon ? <route.icon /> : <DocIcon />}</ListItemIcon>
                { drawerOpen ?
                  <ListItemText primary={route.title} />
                  : null }
              </ListItem>
            </NavLink>

          ))
        }
        <ListItem>
          <ListItemText primary="" />
        </ListItem>

      </List>
    );
    return (
      <div className={classes.root}>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            anchor="left"
            classes={{
              docked: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
              paper: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
            }}
          >
            <Scrollbar
              renderThumbVertical={renderThumb}
              autoHide
            >
              {drawerContent}
            </Scrollbar>
          </Drawer>
        </Hidden>
        <Hidden mdUp>
          {
            drawerOpen ? (
              <Drawer
                variant="temporary"
                anchor="left"
                classes={{
                  docked: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
                  paper: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
                }}
                open
              >
                {drawerContent}
              </Drawer>
            ) : (
              <Drawer
                variant="permanent"
                anchor="left"
                classes={{
                  docked: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
                  paper: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
                }}
              >
                {drawerContent}
              </Drawer>
            )
          }
        </Hidden>
        <main className={classes.main}>
          <Switch>
            {
              // eslint-disable-next-line no-confusing-arrow
              routes.map(route => route.redirect ? (
                <Redirect
                  key={`redirect ${route.redirect}`}
                  to={route.redirect}
                />
              ) : (
                <Route
                  key={route.path}
                  component={route.component}
                  path={route.path}
                />
              ))
            }
          </Switch>
        </main>
        <div className={classes.snackbar}>
          {
            alerts.map(alert => (
              <Snackbar
                key={`${alert.title}${alert.desciption}`}
                message={
                  <span>
                    <b>{alert.title}</b> {alert.desciption}
                  </span>
                }
                close
                color={alert.type || 'info'}
                icon={this.getAlertIcon(alert.type)}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MainLayout);

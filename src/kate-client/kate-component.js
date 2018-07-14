import React, { Component } from 'react';

import { MainLayout } from 'kate-form-material-kit-react';

import KateClientForm from './kate-client-form';

class KateComponent extends Component {
  state = {
  };
  componentWillMount() {
    const { app: App, match } = this.props;
    this.APP = new App({
      history: this.props.history,
      setFormParams: this.setFormParams,
      path: App.path,
    });
    const path = match.path === '/' ? '' : match.path;
    this.path = match.path;
    const routes = this.APP.forms.map(item => ({
      path: `${path}${item.path}`,
      form: item,
      component: props => (
        <KateClientForm
          Form={item}
          app={this.APP}
          {...props}
        />
      ),
    }));

    const menu = this.APP.menu.map(item => ({
      path: `${path}${item.form.path}`,
      title: item.title,
    }));

    routes.push({ path: `${match.url}/`, redirect: menu[0].path });
    this.setState({
      routes,
      menu,
    });
  }
  setFormParams = (form, params) => {
    const { routes } = this.state;
    const formRoute = routes.find(item => item.form === form);
    if (formRoute) {
      formRoute.params = params;
      formRoute.component = props => (
        <KateClientForm
          Form={formRoute.form}
          app={this.APP}
          params={formRoute.params}
          key={formRoute.path}
          {...props}
        />
      );
    }
    this.setState({ routes });
  }
  render() {
    const { app, ...rest } = this.props;
    const { routes, menu } = this.state;
    return (
      <MainLayout
        routes={routes}
        menu={menu}
        titlePath={this.path}
        title={app.title}
        logo={app.logo}
        {...rest}
      />
    );
  }
}

export default KateComponent;

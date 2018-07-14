import React, { Fragment } from 'react';
import { KateForm } from 'kate-form';

import CustomInput from 'material-kit-react/dist/components/CustomInput/CustomInput';
import Button from 'material-kit-react/dist/components/CustomButtons/Button';
import GridContainer from 'material-kit-react/dist/components/Grid/GridContainer';
import GridItem from 'material-kit-react/dist/components/Grid/GridItem';
import Quote from 'material-kit-react/dist/components/Typography/Quote';
import Card from 'material-kit-react/dist/components/Card/Card';
import CardHeader from 'material-kit-react/dist/components/Card/CardHeader';
import CardBody from 'material-kit-react/dist/components/Card/CardBody';

import NavPills from 'material-kit-react/dist/components/NavPills/NavPills';

import { primaryColor } from 'material-kit-react/dist/assets/jss/material-kit-react';
import { Select, DateInput, CustomSwitch, TablePlain, TableEditable } from './components';


const Elements = {
  LABEL: 'labelConnector',
  BUTTON: 'buttonConnector',

  INPUT: 'inputConnector',
  SELECT: 'selectConnector',
  DATE: 'dateConnector',
  SWITCH: 'switchConnector',

  TABLE: 'tableConnector',
  TABLE_EDITABLE: 'tableEditableConnector',

  GROUP: 'groupConnector',
  GRID: 'gridConnector',

  CARD_ACTIONS: 'cardActionsConnector',
  CARD: 'cardConnector',
  TABS: 'tabsConnector',
};


const buttonConnector = ({ title, setData, path, ...props }) => (
  <div><Button color="primary" {...props}>{title}</Button></div>
);

const labelsTags = {
  p: ({ children, ...props }) => <p {...props}>{children}</p>,
  h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
  h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
  h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
  quote: ({ children, ...props }) => <Quote {...props}>{children}</Quote>,
};

const labelConnector = ({ title, setData, path, tag, ...props }) => {
  const Tag = labelsTags[tag] || labelsTags.p;
  return (
    <Tag {...props}>
      {title}
    </Tag>
  );
};

const inputConnector = (allProps) => {
  const {
    title, value, onChange, setData, path,
    dataPath, format, disabled, rows, rowsMax,
    ...props
  } = allProps;
  const change = (e) => {
    let val = e.target.value;
    if (format) {
      val = format(val);
    }
    setData('value', val);
    if (onChange) onChange(val, allProps);
  };
  return (
    <CustomInput
      labelText={title}
      formControlProps={{
        fullWidth: true,
      }}
      inputProps={{
        value: value || '',
        onChange: change,
        multiline: rows && true,
        rows,
        rowsMax,
        disabled,
      }}
      {...props}
    />
  );
};

const switchConnector = (allProps) => {
  const { onChange, setData, path, dataPath, ...props } = allProps;
  const change = (e) => {
    setData('value', e.target.checked);
    if (onChange) onChange(e.target.checked, allProps);
  };
  return (
    <CustomSwitch
      onChange={change}
      {...props}
    />
  );
};

const dateConnector = (allProps) => {
  const { title, value, onChange, setData, path, dataPath, ...props } = allProps;
  const change = (val) => {
    setData('value', val);
    if (onChange) onChange(val, allProps);
  };
  return (
    <DateInput
      labelText={title}
      formControlProps={{
        fullWidth: true,
      }}
      inputProps={{
        value: value || '',
        onChange: change,
      }}
      {...props}
    />
  );
};

const selectConnector = (allProps) => {
  const { title, value, onChange, options, setData, path,
    dataPath, number, ...props } = allProps;
  const change = (val) => {
    setData('value', val);
    if (onChange) onChange(val, allProps);
  };
  return (
    <Select
      labelText={title}
      options={options}
      formControlProps={{
        fullWidth: true,
      }}
      value={value || {}}
      onChange={change}
      {...props}
    />
  );
};

const groupConnector = ({ path }) => (
  <Fragment>
    <KateForm path={`${path}.elements`} />
  </Fragment>
);

const gridConnector = ({ path, elements }) => (
  <GridContainer>
    {
      elements.map((item, index) => (
        <GridItem md={item.cols || 3} key={index}>
          <KateForm path={`${path}.elements.${index}`} />
        </GridItem>
      ))
    }
  </GridContainer>
);

const styleBackgroudPrimary = {
  backgroundColor: primaryColor,
};

const cardConnector = (allProps) => {
  const { title, path, elements } = allProps;
  const actionsIndex = elements.findIndex(item => item.type === Elements.CARD_ACTIONS);
  return (
    <Fragment>
      { title && (
        <h2>{title}</h2>
      )}
      <Card>
        { actionsIndex > -1 && (
          <CardHeader style={styleBackgroudPrimary}>
            <KateForm path={`${path}.elements.${actionsIndex}`} />
          </CardHeader>
        )}
        <CardBody>
          {
            elements.map((item, index) => index !== actionsIndex && (
              <KateForm key={index} path={`${path}.elements.${index}`} />
            ))
          }
        </CardBody>

      </Card>
    </Fragment>
  );
};

const styleFlex = {
  display: 'flex',
};

const cardActionsConnector = ({ path, elements }) => (
  <div style={styleFlex}>
    {
      elements.map((item, index) => (
        <KateForm key={index} path={`${path}.elements.${index}`} />
      ))
    }
  </div>
);

const tableConnector = ({ columns, value, rowClick }) => (
  <TablePlain
    tableHeaderColor="primary"
    tableHead={columns}
    tableData={value || []}
    rowClick={rowClick}
  />
);

const tableEditableConnector = ({ columns, value, path, title, setData, rows, rowChange, getRow }) => (
  <TableEditable
    title={title}
    tableHeaderColor="primary"
    tableHead={columns}
    tableData={value}
    tableRows={rows}
    path={path}
    setData={setData}
    rowChange={rowChange}
    getRow={getRow}
  />
);


const tabsConnector = ({ path, elements }) => (
  <NavPills
    color="primary"
    tabs={elements.map((item, index) => ({
      tabButton: item.title,
      tabIcon: item.icon,
      tabContent: (
        <KateForm path={`${path}.elements.${index}.elements`} />
      ),
    }))}
  />
);

const connectors = {
  buttonConnector,
  labelConnector,

  inputConnector,
  selectConnector,
  dateConnector,
  switchConnector,

  tableConnector,
  tableEditableConnector,

  groupConnector,
  gridConnector,

  cardConnector,
  cardActionsConnector,
  tabsConnector,
};

export {
  Elements,
  connectors,
};

import React from 'react';
import KateForm from './KateForm';

const input = ({ onChange, setData, inputType, value, ...props }) => {
  const change = (e) => {
    setData('value', e.target.value);
    if (onChange) onChange(e.target.value);
  };
  return (
    <input onChange={change} type={inputType} value={value || ''} {...props} />
  );
};

const label = ({ title, setData, ...props }) => (
  <span {...props}>{title}</span>
);

const subform = ({ path, ...props }) => {
  return (
    <KateForm
      path={`${path}.data`}
    />
  );
};

const button = ({ title, setData, ...props }) => (
  <button {...props}>{title}</button>
);

const group = ({ path, elements, layout, ...props }) => {
  return (
    <div style={layout === 'horizontal' ? { display: 'flex' } : null}>
      {
        elements.map((item, index) => (
          <div key={index}>
            <KateForm path={`${path}.elements.${index}`} />
          </div>
        ))
      }
    </div>
  );
};

const connectors = {
  input,
  button,
  subform,
  label,
  group,
};

const Elements = {
  INPUT: 'input',
  BUTTON: 'button',
  FORM: 'subform',
  LABEL: 'label',
  GROUP: 'group',
};

export {
  connectors,
  Elements,
};

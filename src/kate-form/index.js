import KateForm, { getIn } from './KateForm';
import { connectors, Elements } from './connectors';
import { reducer } from './reducer';
import { getSetData, setConnectors } from './actions';
import { KateFormProvider } from './context';
import withKateForm from './withKateForm';

const createElement = (getContent, path, setFormData, prefix = '') => new Proxy({}, {
  get(target, prop) {
    return getIn(getContent(), path)[prop];
  },
  set(target, prop, value) {
    setFormData(`${prefix}${prefix ? '.' : ''}${path}.${prop}`, value);
    return true;
  },
});

const findPath = (data, id, sub) => {
  if (!data || data.id === id) return '';
  if (data[sub]) {
    const subPath = findPath(data[sub], id, sub);
    if (subPath) return `${sub}.${subPath}`;
  }
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].id === id) {
      return `${i}`;
    } else if (data[i][sub]) {
      const subPath = findPath(data[i][sub], id, sub);
      if (subPath) return `${i}.${sub}.${subPath}`;
    }
  }
  return undefined;
};

const createContent = (getFormData, setFormData, sub = 'elements', prefix = '') => {
  const getContent = () => (prefix ? getIn(getFormData(), prefix) : getFormData());
  const elementsProxies = {};
  return new Proxy({}, {
    get(target, prop) {
      const content = getContent();
      const path = findPath(content, prop, sub);
      if (path) {
        if (!elementsProxies[path]) {
          elementsProxies[path] = createElement(getContent, path, setFormData, prefix);
        }
        return elementsProxies[path];
      }

      return undefined;
    },
    set() {
      return true;
    },
  });
};

const getValues = (data, sub = 'elements', result = {}) => {
  const getValue = (element) => {
    if (element.id && Object.prototype.hasOwnProperty.call(element, 'value')) {
      result[element.id] = element.value; // eslint-disable-line no-param-reassign
    }
    if (element[sub]) {
      getValues(element[sub], sub, result);
    }
  };
  if (Array.isArray(data)) {
    data.forEach(getValue);
  } else {
    getValue(data);
  }
  return result;
};

const setFieldValue = (data, field, value) => {
  const newData = Array.isArray(data) ? [...data] : { ...data };
  newData[field] = value;
  return newData;
};

const setIn = (data, path, value) => {
  const pathArray = path.split('.');

  if (pathArray.length < 2) {
    // can't make new object
    return;
  }
  const field = pathArray.pop();
  const subElementField = pathArray.pop();
  const parent = getIn(data, pathArray);
  parent[subElementField] = setFieldValue(parent[subElementField], field, value);
};

const setValues = (values, data, setData, sub = 'elements') => {
  Object.keys(values).forEach((key) => {
    const path = findPath(data, key, sub);
    if (path) {
      setIn(data, `${path}.value`, values[key]);
    }
  });
  setData('', data);
};

export {
  KateForm,
  connectors,
  Elements,
  reducer,
  getSetData,
  setConnectors,
  getIn,
  setIn,
  setValues,
  setFieldValue,
  createContent,
  KateFormProvider,
  getValues,
  withKateForm,
};

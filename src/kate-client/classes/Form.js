import { createContent } from 'kate-form';
import { Elements } from '../index';

const setData = Symbol('setData');
const title = Symbol('title');
const getData = Symbol('getData');
// const createContent = Symbol('createContent');
// const createElement = Symbol('createElement');

export default class Form {
  static checkIdPresence(data, path) {
    (data || []).forEach((item) => {
      if (!item.id) {
        console.error('Missing id of ', item, ' in ', path); // eslint-disable-line no-console
      }
    });
  }
  constructor(params) {
    this[setData] = params.setData;
    this[title] = params.title;
    this[getData] = params.getData;
    this.getValues = params.getValues;
    this.setValues = params.setValues;
    this.app = params.app;
    this.content = createContent(this[getData], this[setData]);
  }

  init = (form) => {
    Form.checkIdPresence(form.actions, 'form actions');
    Form.checkIdPresence(form.content, 'form content');
    this[setData]('', {
      id: 'form',
      type: Elements.CARD,
      elements: [
        {
          type: Elements.CARD_ACTIONS,
          elements: form.actions,
        },
        ...form.elements,
      ],
      title: this[title],
    });
    // this.data = form.data || [];
  }
  // [createContent] = () => {
  //   const { [getData]: getFormData, [createElement]: createFormElement } = this;
  //   return new Proxy({}, {
  //     get(target, prop) {
  //       const { content } = getFormData();
  //       const index = content.findIndex(item => item.id === prop);
  //       // TODO: find elements by id in groups
  //       if (index > -1) return createFormElement(content[index], index);
  //       return undefined;
  //     },
  //     set() {
  //       return true;
  //     },
  //   });
  // }
  // [createElement] = (element, index) => {
  //   const { [setData]: setFormData } = this;
  //   return new Proxy(element, {
  //     get(target, prop) {
  //       return target[prop];
  //     },
  //     set(target, prop, value) {
  //       setFormData(`content.${index}.${prop}`, value);
  //       return true;
  //     },
  //   });
  // }

  // // устанавливает поле value елемента формы по id
  // setValue = (elementId, value) => {
  //   const { content } = this[getData]();
  //   const index = content.findIndex(item => item.id === elementId);
  //   if (index > -1) this[setData](`content.${index}.value`, value);
  // }
  // // устанавливает поле value елементов формы по объекту
  // // где ключ - id элемента
  // setValues = (values) => {
  //   const { content } = this[getData]();
  //   Object.keys(values).forEach((field) => {
  //     const index = content.findIndex(elem => elem.id === field);
  //     if (index > -1) content[index] = { ...content[index], value: values[field] };
  //   });
  //   this[setData]('content', content);
  // }
  // // возвращает объект из полей value элементов формы
  // // где ключ - id элемента
  // getValues = () => {
  //   const { content } = this[getData]();
  //   const values = {};
  //   content.forEach((item) => {
  //     if (item.value && item.id) values[item.id] = item.value;
  //   });
  //   return values;
  // }
  // // устанавливает поля value элементов формы по их
  // // dataPath
  // updateView = () => {
  //   const { elements } = this[getData]();
  //   elements.forEach((item, index) => {
  //     if (item.dataPath) {
  //       let value = getIn(this.data, item.dataPath);
  //       value = value === undefined ? '' : value;
  //       elements[index] = { ...item, value };
  //     }
  //   });
  //   this[setData]('elements', elements);
  // }
  // // собирает поля value элементов формы
  // // и записывает их в data по их dataPath
  // updateData = () => {
  //   const { elements } = this[getData]();
  //   elements.forEach((item) => {
  //     if (item.dataPath) {
  //       const pathArray = item.dataPath.split('.');
  //       const field = pathArray.pop();
  //       const element = getIn(this.data, pathArray);
  //       element[field] = item.value;
  //     }
  //   });
  // }

  static async request(url, params) {
    return fetch(url, {
      headers: {
        'content-type': 'application/json',
      },
      ...params,
    })
      .then(response => response
        .json()
        .then(json => ({ response: json }))
        .catch(() => ({ response })))
      .catch(error => ({ error }));
  }
  static getUrl = (data, type, params) => {
    let { url } = data[type];
    if (params) {
      (Object.keys(params) || []).forEach((param) => {
        url = url.replace(`:${param}`, params[param] || '');
      });
    }
    return `${data.baseUrl}${url}`;
  }
}

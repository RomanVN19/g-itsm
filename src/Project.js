import { Form, Elements } from 'kate-client';

import ProjectList from './ProjectList';

export default class Item extends Form {
  static path = '/project/:id';
  static title = 'Project';

  constructor({ sys, params }) {
    super({ sys, params });
    this.actions = [
      {
        id: '0',
        type: Elements.BUTTON,
        title: 'OK',
        onClick: this.ok,
      },
      {
        id: '1',
        type: Elements.BUTTON,
        title: 'Save',
        onClick: this.save,
      },
      {
        id: '2',
        type: Elements.BUTTON,
        title: 'Load',
        onClick: this.load,
      },
      {
        id: '3',
        type: Elements.BUTTON,
        title: 'Close',
        onClick: this.close,
      },
    ];
    this.elements = [
      {
        id: 'title',
        type: Elements.INPUT,
        title: 'Title',
        value: '',
      },
      {
        id: 'bp',
        type: Elements.SELECT,
        title: 'Business process',
        getOptions: this.getBPs,
      },
      {
        id: 'taskNumber',
        type: Elements.INPUT,
        title: 'Current task number',
        format: val => Number(val.replace(/\D/g, '')),
        value: 0,
      },
    ];
    if (params.id && params.id !== 'new') {
      this._id = params.id;
      this.load();
    }
  }

  getBPs = async () => {
    const result = await this.app.request(`${this.app.baseUrl}/_design/BusinessProcess/_view/list`, {});
    return result.response.rows.map(row => row.value);
  }
  save = async (close) => {
    const data = {
      entity: 'Project',
      ...this.getValues(),
    };
    const result = await this.app.request(`${this.app.baseUrl}/${this._id ? this._id : ''}`, {
      method: this._id ? 'PUT' : 'POST',
      body: JSON.stringify({
        _id: this._id,
        _rev: this._rev,
        ...data,
      }),
    });
    if (result.response) {
      this._id = result.response.id;
      this._rev = result.response.rev;
    }
  }
  load = async () => {
    const result = await this.app.request(`${this.app.baseUrl}/${this._id}`, {});
    if (result.response) {
      const data = result.response;
      this._id = data._id;
      this._rev = data._rev;
      this.setValues(data);
    }
  }
  close = () => {
    this.app.open(ProjectList);
  }
  ok = async () => {
    await this.save();
    this.close();
  }
}

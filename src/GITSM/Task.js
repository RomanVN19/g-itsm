import { Form, Elements } from 'kate-client';

export default class Item extends Form {
  static path = '/task/:id';
  static title = 'Task';

  constructor(sys, params) {
    super(sys);
    this.init({
      actions: [
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
      ],
      elements: [
        {
          type: Elements.GRID,
          elements: [
            {
              type: Elements.GROUP,
              cols: 9,
              elements: [
                {
                  id: 'title',
                  type: Elements.INPUT,
                  title: 'Title',
                  value: '',
                },
                {
                  id: 'description',
                  type: Elements.INPUT,
                  title: 'Description',
                  rows: 5,
                },
              ],
            },
            {
              type: Elements.GROUP,
              cols: 3,
              elements: [
                {
                  id: 'project',
                  type: Elements.SELECT,
                  title: 'Project',
                  getOptions: this.getProjects,
                },
              ],
            },
          ],
        },
      ],
    });
    if (params.id && params.id !== 'new') {
      this._id = params.id;
      this.load();
    }
  }

  getProjects = async () => {
    const result = await Form.request(`${this.app.baseUrl}/_design/Project/_view/list`);
    return result.response.rows.map(row => row.value);
  }
  save = async () => {
    const data = {
      entity: 'Task',
      ...this.getValues(),
    };
    const result = await Form.request(`${this.app.baseUrl}/${this._id ? this._id : ''}`, {
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
    const result = await Form.request(`${this.app.baseUrl}/${this._id}`);
    if (result.response) {
      const data = result.response;
      this._id = data._id;
      this._rev = data._rev;
      this.setValues(data);
    }
  }
}

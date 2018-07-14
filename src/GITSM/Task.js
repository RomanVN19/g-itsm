import moment from 'moment';
import { Form, Elements, getIn } from 'kate-client';

import { BusinessProcessItem } from 'kp-business-processes';

import TaskList from './TaskList';

export default class Item extends Form {
  static path = '/task/:id';
  static title = 'Task';

  constructor(sys, params) {
    super(sys);

    this.bp = new BusinessProcessItem({ parentForm: this, setStepAction: this.setStep });

    const descriptionTabElements = [
      {
        id: 'description',
        type: Elements.INPUT,
        title: 'Description',
        rows: 5,
        rowsMax: 100,
      },
    ];

    const historyTabElements = [
      {
        id: 'history',
        type: Elements.TABLE,
        title: 'Hello, world',
        columns: [
          {
            title: 'Date',
            dataPath: 'date',
            format: val => moment(val).format('DD.MM.YYYY HH:mm'),
          },
          {
            title: 'Action',
            dataPath: 'action',
          },
        ],
      },
    ];

    this.init({
      actions: [
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
                  id: 'tabs',
                  type: Elements.TABS,
                  elements: [
                    {
                      title: 'Description',
                      elements: descriptionTabElements,
                    },
                    {
                      title: 'History',
                      elements: historyTabElements,
                    },
                  ],
                },
              ],
            },
            {
              type: Elements.GROUP,
              cols: 3,
              elements: [
                {
                  id: 'taskNumber',
                  type: Elements.INPUT,
                  title: 'Task number',
                  format: val => Number(val.replace(/\D/g, '')),
                },
                {
                  id: 'project',
                  type: Elements.SELECT,
                  title: 'Project',
                  getOptions: this.getProjects,
                  value: params.project,
                },
              ],
            },
          ],
        },
        ...this.bp.elements,
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
    if (!data.taskNumber && data.project) {
      const { response: project } = await Form.request(`${this.app.baseUrl}/${data.project._id}`);
      project.taskNumber += 1;
      await await Form.request(
        `${this.app.baseUrl}/${data.project._id}`,
        { method: 'PUT', body: JSON.stringify(project) },
      );
      data.taskNumber = project.taskNumber;
      this.content.taskNumber.value = data.taskNumber;
    }
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
      this.bp.update(getIn(data, 'project.bp._id'));
    }
  }
  close = () => {
    this.app.open(TaskList);
  }
  ok = async () => {
    await this.save();
    this.close();
  }
  // predefined func
  afterUpdate = () => {
    const project = this.content.project.value;
    if (project && project.bp) {
      // new project with project preset
      this.bp.update(project.bp._id);
    }
  }
  setStep = (step) => {
    const history = (this.content.history.value || []).slice();
    history.push({
      action: `Step set to ${step.title}`,
      date: new Date(),
    });
    this.content.history.value = history;
  }
}

import { Form, Elements } from 'kate-client';
import BusinessProcessList from './BusinessProcessList';

export default class Item extends Form {
  static path = '/business-process/:id';
  static title = 'Business process';

  constructor(sys, params) {
    super(sys);
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
          id: 'title',
          type: Elements.INPUT,
          title: 'Title',
          value: '',
        },
        {
          id: 'startStep',
          title: 'Start step',
          type: Elements.SELECT,
          getOptions: this.getSteps,
        },
        {
          id: 'endStep',
          title: 'End step',
          type: Elements.SELECT,
          getOptions: this.getSteps,
        },
        {
          type: Elements.LABEL,
          title: 'Steps',
          tag: 'h3',
        },
        {
          id: 'steps',
          type: Elements.GROUP,
          elements: [],
        },
        {
          type: Elements.BUTTON,
          title: 'Add step',
          onClick: this.addStep,
        },
      ],
    });
    if (params.id && params.id !== 'new') {
      this._id = params.id;
      this.load();
    }
  }
  addStepElement = (steps, step = {}) => {
    const tableId = `nextSteps_${steps.length}`;
    steps.push({
      type: Elements.CARD,
      elements: [
        {
          type: Elements.INPUT,
          title: 'Title',
          value: step.title || '',
        },
        {
          type: Elements.BUTTON,
          title: 'Add next step',
          onClick: () => this.content[tableId].addRow({}),
        },
        {
          type: Elements.TABLE_EDITABLE,
          title: 'Next steps',
          id: tableId,
          columns: [
            {
              title: 'Next step',
              dataPath: 'step',
              type: Elements.SELECT,
              getOptions: this.getSteps,
            },
            {
              title: 'Action title',
              dataPath: 'actionTitle',
              type: Elements.INPUT,
            },
          ],
          value: step.nextSteps || [],
        },
      ],
    });
  }
  addStep = () => {
    // need to create new array to update form
    const steps = [...this.content.steps.elements];
    this.addStepElement(steps);
    this.content.steps.elements = steps;
  }
  getSteps = () => this.content.steps.elements
    .map((item, index) => ({ index, title: item.elements[0].value }));

  save = async () => {
    const data = {
      entity: 'BusinessProcess',
      title: this.content.title.value,
      startStep: this.content.startStep.value,
      endStep: this.content.endStep.value,
      steps: this.content.steps.elements
        .map((item, index) => ({
          index,
          title: item.elements[0].value,
          nextSteps: item.elements[2].value,
        })),
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
    const result = await this.app.request(`${this.app.baseUrl}/${this._id}`);
    if (result.response) {
      const data = result.response;
      this._id = data._id;
      this._rev = data._rev;
      this.setValues(data);
      const steps = [];
      data.steps.forEach(step => this.addStepElement(steps, step));
      this.content.steps.elements = steps;
    }
  }
  close = () => {
    this.app.open(BusinessProcessList);
  }
  ok = async () => {
    await this.save();
    this.close();
  }
}

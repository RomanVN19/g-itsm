import { Form, Elements } from 'kate-client';

export default class Item {
  constructor(params) {
    this.elements = [
      {
        type: Elements.CARD,
        elements: [
          {
            id: 'bp_currentStep',
            type: Elements.SELECT,
            title: 'Current step',
            getOptions: this.getSteps,
            onChange: this.setStep,
          },
          {
            id: 'bp_actions',
            type: Elements.GRID,
            elements: [],
          },
        ],
      },
    ];
    this.form = params.parentForm;
    this.content = this.form.content;
  }
  setActions = () => {
    const { nextSteps } = this.bp.steps[this.content.bp_currentStep.value.index];
    if (nextSteps) {
      const actions = [];
      nextSteps.forEach((item) => {
        actions.push({
          type: Elements.BUTTON,
          title: item.step.title,
          onClick: () => this.setStep(item.step),
        });
      });
      this.content.bp_actions.elements = actions;
    }
  }
  update = async (bpId) => {
    const { response: bp } = await Form.request(`${this.form.app.baseUrl}/${bpId}`);
    if (bp) {
      this.bp = bp;
      if (!this.content.bp_currentStep.value) {
        this.content.bp_currentStep.value = bp.startStep;
      }
      this.setActions();
    }
  }
  getSteps = () => this.bp && this.bp.steps.map(({ index, title }) => ({ index, title }));
  setStep = (step) => {
    this.content.bp_currentStep.value = step;
    this.setActions();
  }
}

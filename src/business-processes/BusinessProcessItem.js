import { Elements } from 'kate-client';

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
    this.app = this.form.app;
    this.content = this.form.content;
    this.setStepAction = params.setStepAction;
  }
  setActions = () => {
    const { nextSteps } = this.bp.steps[this.content.bp_currentStep.value.index];
    if (nextSteps) {
      const actions = [];
      nextSteps.forEach((item) => {
        actions.push({
          type: Elements.BUTTON,
          title: item.actionTitle || item.step.title,
          onClick: () => this.setStep(item.step),
        });
      });
      this.content.bp_actions.elements = actions;
    }
  }
  update = async (bpId) => {
    const { response: bp } = await this.app.request(`${this.form.app.baseUrl}/${bpId}`);
    if (bp) {
      this.bp = bp;
      if (!this.content.bp_currentStep.value) {
        this.setStep(bp.startStep);
      }
      this.setActions();
    }
  }
  getSteps = () => this.bp && this.bp.steps.map(({ index, title }) => ({ index, title }));
  setStep = (step) => {
    this.content.bp_currentStep.value = step;
    if (this.setStepAction) this.setStepAction(step);
    this.setActions();
  }
}

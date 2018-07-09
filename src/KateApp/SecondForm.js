import { Form, Elements } from 'kate-client';

const ENTITY = 'Income';
// TODO: выбор с автоподгр статьи
export default class Item extends Form {
  static title = 'Элемент';
  static path = '/item/:id?';

  constructor(sys, params) {
    super(sys);
    console.log('Item params', params); // eslint-disable-line no-console
    this.init({
      title: 'Second form',
      actions: [
        {
          id: '1',
          type: Elements.BUTTON,
          title: 'Save',
          onClick: this.save,
        },
      ],
      elements: [
        {
          id: 'date',
          type: Elements.DATE,
          title: 'Дата',
          value: '',
          dataPath: 'date',
        },
        {
          id: 'article',
          type: Elements.SELECT,
          title: 'Статья',
          value: '',
          dataPath: 'article',
          options: [
            { title: 'salary' },
            { title: 'sale' },
            { title: 'other' },
          ],
        },
        {
          id: 'summ',
          type: Elements.INPUT,
          title: 'Сумма',
          value: '',
          dataPath: 'summ',
          number: true,
        },
        {
          id: 'multi',
          type: Elements.SWITCH,
          title: 'Несколько доходов',
          value: false,
          dataPath: 'multi',
          onChange: this.updateContent,
        },
        {
          id: 'addIncome',
          type: Elements.BUTTON,
          title: 'Add',
          onClick: this.addIncome,
        },
        {
          id: 'incomes',
          type: Elements.TABLE_EDITABLE,
          title: 'Приходы',
          dataPath: 'incomes',
          columns: [
            { title: 'Статья', dataPath: 'article', type: Elements.INPUT },
            { title: 'Сумма', dataPath: 'summ', type: Elements.INPUT, number: true },
          ],
          value: [],
          rowChange: this.updateContent,
        },
      ],
      data: {
        type: ENTITY,
      },
    });
    if (params.id) this.load(params.id);
  }
  updateContent = () => {
    this.content.incomes.hidden = !this.content.multi.value;
    this.content.addIncome.hidden = !this.content.multi.value;
    this.content.summ.disabled = this.content.multi.value;
    if (this.content.multi.value) {
      this.content.summ.value = this.content.incomes.value && this.content.incomes.value
        .reduce((acc, val) => (acc + val.summ), 0);
    }
  }
  addIncome = () => {
    this.content.incomes.addRow();
  }
  load = async (id) => {
    const { response } = await Form.request(Form.getUrl(this.app.data, 'item', { id }));
    this.data = response;
    this.updateView();
    this.updateContent();
  }
  save = async () => {
    this.updateData();
    const { response } = await Form.request(Form.getUrl(this.app.data, 'item', { id: this.data._id }), {
      method: this.data._id ? 'put' : 'post',
      body: JSON.stringify(this.data),
    });
    if (!this.data._id) { // change url if created
      this.app.open(Item, { id: response.id });
    }
    this.data._id = response.id;
    this.data._rev = response.rev;
  }
}

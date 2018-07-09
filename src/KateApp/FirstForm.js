import moment from 'moment';

import { Form, Elements } from 'kate-client';
import Item from './SecondForm';

export default class List extends Form {
  static title = 'Список';
  static path = '/list';

  editRow = (row) => {
    console.log('opening ', row); // eslint-disable-line no-console
    this.app.open(Item, { id: row._id, date: row.date });
  }
  newItem = () => {
    this.app.open(Item, { id: '' });
  }
  load = async () => {
    const data = await Form.request(Form.getUrl(this.app.data, 'list', { entitiy: 'Income' }));
    const rows = data.response.rows.map(row => row.value);
    this.content.list.value = rows;
    //this.setValue('list', rows);
  }
  constructor(sys) {
    super(sys);

    this.init({
      title: 'First form',
      actions: [
        {
          id: '1',
          type: Elements.BUTTON,
          title: 'New',
          onClick: this.newItem,
        },
      ],
      elements: [
        {
          id: 'list',
          type: Elements.TABLE,
          rowClick: this.editRow,
          columns: [
            { title: 'Дата', dataPath: 'date', format: val => moment(val).format('DD.MM.YYYY') },
            { title: 'Статья', dataPath: 'article' },
            { title: 'Сумма', dataPath: 'summ' },
          ],
          value: [],
        },
      ],
    });

    this.load();
  }
}

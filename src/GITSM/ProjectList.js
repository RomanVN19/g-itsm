import { Form, Elements } from 'kate-client';
import Item from './Project';

export default class List extends Form {
  static title = 'Projects';
  static path = '/project';

  constructor(sys) {
    super(sys);

    this.init({
      actions: [
        {
          id: 'new',
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
            { title: 'Name', dataPath: 'title' },
          ],
          value: [],
        },
      ],
    });
    this.load();
  }
  newItem = () => {
    this.app.open(Item, { id: 'new' });
  }
  editRow = (row) => {
    this.app.open(Item, { id: row._id });
  }
  load = async () => {
    const result = await Form.request(`${this.app.baseUrl}/_design/Project/_view/list`);
    this.content.list.value = result.response.rows.map(row => row.value);
  }
}

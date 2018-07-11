import { Form, Elements } from 'kate-client';
import Item from './Task';

export default class List extends Form {
  static title = 'Tasks';
  static path = '/task';

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
          id: 'project',
          type: Elements.SELECT,
          title: 'Project filter',
          getOptions: this.getProjects,
          onChange: this.filterByProject,
        },
        {
          id: 'list',
          type: Elements.TABLE,
          rowClick: this.editRow,
          columns: [
            { title: 'Number', dataPath: 'taskNumber' },
            { title: 'Name', dataPath: 'title' },
          ],
          value: [],
        },
      ],
    });
    this.load();
  }
  filterByProject = (project) => {
    this.load(project);
  }
  getProjects = async () => {
    const result = await Form.request(`${this.app.baseUrl}/_design/Project/_view/list`);
    return result.response.rows.map(row => row.value);
  }
  newItem = () => {
    this.app.open(Item, { id: 'new' });
  }
  editRow = (row) => {
    this.app.open(Item, { id: row._id });
  }
  load = async (project) => {
    let filter = '';
    if (project) {
      filter = `startkey=["${project._id}"]&endkey=["${project._id}", {}]`;
    }
    const result = await Form.request(`${this.app.baseUrl}/_design/Task/_view/list?${filter}`);
    this.content.list.value = result.response.rows.map(row => row.value);
  }
}

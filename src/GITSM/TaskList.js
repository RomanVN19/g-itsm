import { Form, Elements } from 'kate-client';
import Item from './Task';

export default class TasksList extends Form {
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
          id: 'projectFilter',
          type: Elements.SELECT,
          title: 'Project filter',
          getOptions: this.getProjects,
          onChange: this.filterByProject,
          // keep current filter in static var
          value: TasksList.projectFilter,
        },
        {
          id: 'list',
          type: Elements.TABLE,
          rowClick: this.editRow,
          columns: [
            { title: 'Number', dataPath: 'taskNumber' },
            { title: 'Name', dataPath: 'title' },
            { title: 'Step', dataPath: 'step.title' },
          ],
          value: [],
        },
      ],
    });
    this.load(TasksList.projectFilter);
  }
  filterByProject = (project) => {
    this.load(project);
    // keep current filter in static var
    TasksList.projectFilter = project;
  }
  getProjects = async (searchText) => {
    const result = await Form.request(`${this.app.baseUrl}/_design/Project/_view/list?startkey="${searchText || ''}"`);
    return result.response.rows.map(row => row.value);
  }
  newItem = () => {
    this.app.open(Item, { id: 'new', project: this.content.projectFilter.value });
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

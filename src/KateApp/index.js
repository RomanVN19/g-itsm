import { App } from 'kate-client';

import FirstForm from './FirstForm';
import SecondForm from './SecondForm';


export default class KateApp extends App {
  static title = 'Test Kate App';

  constructor(sys) {
    super(sys);

    this.forms = [
      FirstForm,
      SecondForm,
    ];
    this.menu = [
      {
        title: 'First form',
        form: FirstForm,
      },
    ];
    this.data = {
      baseUrl: 'http://localhost:5984/home_budget',
      list: {
        url: '/_design/:entitiy/_view/list',
      },
      item: {
        url: '/:id',
      },
    };
  }
}

import { App } from 'kate-client';

import BPList from 'business-processes/BusinessProcessList';
import BP from 'business-processes/BusinessProcess';

import Task from './Task';
import TaskList from './TaskList';

import Project from './Project';
import ProjectList from './ProjectList';

import logo from './logo.svg';


export default class KateApp extends App {
  static title = 'G-ITSM';
  static logo = logo;
  static path = '/g-itsm';

  constructor(sys) {
    super(sys);

    this.forms = {
      Task,
      TaskList,
      Project,
      ProjectList,
      BP,
      BPList,
    };

    this.menu = [
      {
        title: 'Tasks',
        form: 'TaskList',
      },
      {
        title: 'Projects',
        form: 'ProjectList',
      },
      {
        title: 'BP',
        form: 'BPList',
      },
    ];
    // this.baseUrl = 'http://localhost:5984/gitsm';
    this.baseUrl = 'https://f7dfd831-d41f-4376-b47b-2f9bea8f4d9c-bluemix.cloudant.com/testdb';
  }
}

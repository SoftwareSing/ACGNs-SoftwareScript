import { EventController } from '../Global/EventController';
import { AboutView } from './AboutView';

export class AboutController extends EventController {
  /**
   * AboutScriptController constructor
   * @param {LoginUser} loginUser LoginUser
   */
  constructor(loginUser) {
    super('AboutScriptController', loginUser);

    this.aboutView = new AboutView();
  }
}

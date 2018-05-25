import { EventController } from '../Global/EventController';
import { AccessedRecorder } from './AccessedRecorder';
import { DisconnectReminderView } from './DisconnectReminderView';

export class DisconnectReminderController extends EventController {
  constructor(loginUser) {
    super('DisconnectReminderController', loginUser);
    this.disconnectReminderView = new DisconnectReminderView();
  }

  createReminder(recorder) {
    return () => {
      recorder.addRecord();
      const { count, firstTime } = recorder.checkAccessedCount();
      if (count >= 19) {
        const time = new Date();
        this.disconnectReminderView.displayWarningDialog(recorder.name, count,
          Math.ceil(((60000 - firstTime) - time.getTime()) / 1000)
        );
      }
    };
  }

}

import { View } from '../Global/View';
import { alertDialog } from '../require';
import { translation } from '../Language/language';

export class DisconnectReminderView extends View {
  constructor() {
    super('DisconnectReminderView');
  }

  displayWarningDialog(dbName, count, stopTime) {
    const info = translation(['script', 'disconnectWarningInfo'])(dbName, count, stopTime);
    alertDialog.alert(info);
  }
}

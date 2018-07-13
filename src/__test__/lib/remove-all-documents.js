import Account from '../../model/account';

import Image from '../../model/image';
import Message from '../../model/message';
import Profile from '../../model/profile';
import Reminder from '../../model/reminder';


const removeAllDocuments = () => {
  return Promise.all([
    Account.remove(),

    Image.remove(),
    Message.remove(),
    Profile.remove(),
    Reminder.remove(),
  ]);  
};

export default removeAllDocuments;

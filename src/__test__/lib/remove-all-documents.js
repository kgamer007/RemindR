import Account from '../../model/account';
import Message from '../../model/message';
// import Image from '../../model/image';
// import Reminder from '../../model/reminder';
// import Profile from '../../model/profile';


const removeAllDocuments = () => {
  return Promise.all([
    Account.remove(),
    Message.remove(),
    // Image.remove(),
    // Reminder.remove(),
    // Profile.remove(),
  ]);
};

export default removeAllDocuments;

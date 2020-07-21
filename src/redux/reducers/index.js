import helpdesk from './helpdesk';
import storage from './storage';
import general from './general';
export default {
  ...helpdesk,
  ...storage,
  ...general
}

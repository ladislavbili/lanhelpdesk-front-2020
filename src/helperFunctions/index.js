export {
  toSelArr,
  toSelItem
}
from './select';

export {
  lightenDarkenColor,
}
from './color';

export {
  isEmail,
  sameStringForms,
  textIncluded,
  inputError,
  compareObjectAttributes,
}
from './dataChecks';

export {
  orderArr,
  sortBy,
  arraySelectToString,
  filterUnique,
  splitArrayByFilter,
  updateArrayItem,
}
from './arrayManipulations';

export {
  toMomentInput,
  fromMomentToUnix,
  timeRangeToString,
  timestampToString,
  timestampToDate,
  timestampToHoursAndMinutes,
  afterNow,
  getDayRange,
  getDatesDifferenceInHours,
}
from './moment';

export {
  applyTaskFilter,
  filterDateSatisfied,
  filterOneOf,
  filterProjectsByPermissions,
  localFilterToValues,
  processStringFilter,
}
from './filter';

export {
  changeCKEData
}
from './ckEditor';

export {
  timestampToInput,
  inputToTimestamp,
  toMillisec,
  fromMillisec,
  getDateClock,
}
from './timeManipulations';

export {
  getItemDisplayValue
}
from './showData';

export {
  deleteAttributes,
  objectToAtributeArray
}
from './objectManipulations';

export {
  fromObjectToState,
  setDefaultFromObject
}
from './reactFunctions';

export {
  hightlightText,
  calculateTextAreaHeight,
  getAttributeDefaultValue,
  htmlFixNewLines
}
from './renderFunctions';

export {
  toFloat,
  toFloatOrZero
}
from './numberManipulations';

export {
  getLocation
}
from './navigationFunctions';

export {
  randomString,
  randomPassword,
}
from './stringManipulations';

export {
  getMyData
}
from './userData';
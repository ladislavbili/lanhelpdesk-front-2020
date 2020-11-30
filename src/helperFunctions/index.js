export {
  toSelArr,
  toSelItem
}
from './select';

export {
  isEmail,
  sameStringForms,
  textIncluded,
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
  timestampToString,
  timestampToDate,
  timestampToHoursAndMinutes,
  afterNow
}
from './moment';

export {
  snapshotToArray
}
from './firebase';

export {
  applyTaskFilter,
  filterDateSatisfied,
  filterOneOf,
  filterProjectsByPermissions,
  localFilterToValues,
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
  fromMillisec
}
from './timeManipulations';

export {
  getItemDisplayValue
}
from './showData';

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
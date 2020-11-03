import {
  filterVar,
} from './variables';

export function setTasksAttributesFilter( newValue ) {
  filterVar( newValue );
}

export function setTasksAttributeFilter( attribute, value ) {
  let filter = {
    ...filterVar()
  };
  filter[ attribute ] = value;
  filterVar( filter );
}
import React from 'react';
import {
  Label,
} from 'reactstrap';

import {
  intervals
} from 'configs/constants/repeat';

import RepeatFormModal from './repeatFormModal';

export default function RepeatFormInput( props ) {
  const {
    disabled,
    repeat,
    vertical
  } = props;

  //state
  const [ openModal, setOpenModal ] = React.useState( false );
  const interval = repeat ? intervals.find( ( interval ) => interval.value === repeat.repeatInterval ) : null;
  return (
    <div>
      <div>
        {vertical &&
          <div className="form-selects-entry-column">
            <Label style={{display: "block"}}>Repeat</Label>
            <div className="form-selects-entry-column-rest">
              <button type="button"className="btn-repeat" id={"repeatPopover"} onClick={() => {
                  if(!disabled){
                    setOpenModal(true);
                  }
                }}>
                {
                  repeat ?
                  `Opakovať každý ${repeat.repeatEvery} ${interval.label}` :
                  "No repeat"
                }
              </button>
            </div>
          </div>
        }
        {!vertical &&
          <div className="p-r-10">
            <Label className="col-3 col-form-label">Repeat</Label>
            <div className="col-9">
              <button type="button" className="btn-repeat flex" id={"repeatPopover"} onClick={() => {
                  if(!disabled){
                    setOpenModal(true);
                  }
                }}>
                {
                  repeat ?
                  `Opakovať každý ${repeat.repeatEvery} ${interval.label}` :
                  "No repeat"
                }
              </button>
            </div>
          </div>
        }
      </div>
      <RepeatFormModal
        { ...props }
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        />
    </div>
  );
}
import React from 'react';
import {
  Label,
} from 'reactstrap';

import {
  intervals
} from 'configs/constants/repeat';

import {
  timestampToString,
} from 'helperFunctions';

import RepeatFormModal from './repeatFormModal';

import {
  useTranslation
} from "react-i18next";

export default function RepeatFormInput( props ) {
  const {
    disabled,
    repeat,
    vertical,
    repeatTime,
  } = props;

  const {
    t
  } = useTranslation();

  const triggeredAt = repeatTime ? repeatTime.triggersAt : null;
  //state
  const [ openModal, setOpenModal ] = React.useState( false );
  const interval = repeat ? intervals.find( ( interval ) => interval.value === repeat.repeatInterval ) : null;
  return (
    <div>
      <div>
        {vertical &&
          <div className="form-selects-entry-column">
            <Label style={{display: "block"}}>{t('repeat')}</Label>
            <div className="form-selects-entry-column-rest">
              <button type="button"className="btn-repeat full-width" id={"repeatPopover"} onClick={() => {
                  if(!disabled){
                    setOpenModal(true);
                  }
                }}>
                {
                  repeat ?
                  `${t('repeatEvery')} ${repeat.repeatEvery} ${t(interval.label).toLowerCase()}` :
                  t('noRepeat')
                }
              </button>
            </div>
          </div>
        }
        {!vertical &&
          <div className="p-r-10">
            <Label className="col-3 col-form-label">{t('repeat')}</Label>
            <div className="col-9">
              <button type="button" className="btn-repeat flex full-width" id={"repeatPopover"} onClick={() => {
                  if(!disabled){
                    setOpenModal(true);
                  }
                }}>
                {
                  repeat ?
                  `${t('repeatEvery')} ${repeat.repeatEvery} ${t(interval.label).toLowerCase()}` :
                  t('noRepeat')
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
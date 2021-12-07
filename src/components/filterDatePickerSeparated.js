import React from 'react';
import {
  FormGroup
} from 'reactstrap';

import DatePicker from 'components/DatePicker';
import Checkbox from 'components/checkbox';
import {
  rebase
} from 'index';
import {
  useTranslation
} from "react-i18next";

export default function FilterDatePickerSeparated( props ) {
  const {
    label,
    showNowFrom,
    dateFrom,
    showNowTo,
    dateTo
  } = props;
  const {
    t
  } = useTranslation();
  const [ showCalendarFrom, setShowCalendarFrom ] = React.useState( false );
  const [ showCalendarTo, setShowCalendarTo ] = React.useState( false );

  return (
    <FormGroup>
        <label>{label}</label>
        <div className="row">
          <div className="col-6">
            { !showCalendarFrom && !showNowFrom &&
              <div className="flex">
                <button
                  className="btn-link center-hor"
                  onClick={()=>{
                    setShowNowFrom(true)
                  }}
                  >
                  {t('setNow')}
                </button>
                |
                <button
                  className="btn-link center-hor"
                  onClick={()=>{
                    setShowCalendarFrom(true);
                  }}
                  >
                  {t('setDate')}
                </button>
              </div>
            }
            { showCalendarFrom &&
              <FormGroup className="flex-input-with-icon">
                <DatePicker
                  className="form-control"
                  selected={dateFrom}
                  onChange={(e)=>{ setDateFrom(e) }}
                  placeholderText={t('noDate')}
                  />
                <i className="fa fa-times center-hor m-l-10 m-r-10 clickable" onClick={ () => { setDateFrom(null); setShowCalendarFrom(false) } } />
              </FormGroup>
            }
            { showNowFrom &&
              <FormGroup className="display-flex">
                <span>
                {t( 'currentDate' )}
              </span>
                <i className="fa fa-times center-hor ml-auto m-r-10 clickable" onClick={ () => setShowNowFrom(false) } />
              </FormGroup>
            }
          </div>
          <div className="col-6">
            { !showCalendarTo && !showNowTo &&
              <div className="flex">
                <button
                  className="btn-link center-hor"
                  onClick={()=>{
                    setShowNowTo(true)
                  }}
                  >
                  {t('setNow')}
                </button>
                |
                <button
                  className="btn-link center-hor"
                  onClick={()=>{
                    setShowCalendarTo(true);
                  }}
                  >
                  {t('setDate')}
                </button>
              </div>
            }
            { showCalendarTo &&
              <FormGroup className="flex-input-with-icon">
                <DatePicker
                  className="form-control"
                  selected={dateTo}
                  onChange={(e)=>{ setDateTo(e) }}
                  placeholderText={t('noDate')}
                  />
                <i className="fa fa-times center-hor m-l-10 m-r-10 clickable" onClick={ () => { setDateTo(null); setShowCalendarTo(false) } } />
              </FormGroup>
            }
            { showNowTo &&
              <FormGroup className="display-flex">
                <span>
                {t( 'currentDate' )}
              </span>
                <i className="fa fa-times center-hor ml-auto clickable" onClick={ () => setShowNowTo(false) } />
              </FormGroup>
            }
          </div>
        </div>
      </FormGroup>
  );
}
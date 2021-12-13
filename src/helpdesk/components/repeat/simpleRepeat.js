import React from 'react';
import Select from 'react-select';
import Checkbox from 'components/checkbox';
import classnames from 'classnames';
import Empty from 'components/Empty';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import DatePicker from 'components/DatePicker';

import {
  pickSelectStyle
} from 'configs/components/select';

import {
  useTranslation
} from "react-i18next";

import {
  toMomentInput,
  fromMomentToUnix,
  translateSelectItem,
  translateAllSelectItems,
} from 'helperFunctions';
import {
  intervals
} from 'configs/constants/repeat';

export default function SimpleRepeat( props ) {
  const {
    repeat,
    submitRepeat,
    deleteRepeat,
    vertical,
    disabled,
  } = props;

  const {
    t
  } = useTranslation();

  const [ open, setOpen ] = React.useState( false );
  const [ active, setActive ] = React.useState( true );
  const [ startsAt, setStartsAt ] = React.useState( repeat ? repeat.startsAt : null );
  const [ repeatEvery, setRepeatEvery ] = React.useState( repeat ? repeat.repeatEvery : "1" );
  const [ repeatInterval, setRepeatInterval ] = React.useState( repeat ? repeat.repeatInterval : intervals[ 0 ] );

  React.useEffect( () => {
    setOpen( false )
    if ( repeat === null ) {
      setActive( true );
      setStartsAt( null );
      setRepeatEvery( "1" );
      setRepeatInterval( intervals[ 0 ] );
    } else {
      setActive( repeat.active );
      setStartsAt( repeat.startsAt );
      setRepeatEvery( repeat.repeatEvery );
      setRepeatInterval( repeat.repeatInterval );
    }
  }, [ repeat ] );

  const toggleRepeat = () => {
    if ( disabled ) {
      return;
    }
    setOpen( true );
  }

  const renderRepeatButton = () => {
    return (
      <Empty>
        <button
          type="button"
          className={classnames("btn-repeat",{ "flex": !vertical })}
          id={"repeatPopover"}
          onClick={toggleRepeat}
          style={{
            width: ( repeat && deleteRepeat ? 'calc( 100% - 25px )' : '100%' )
          }}
          >
          {
            repeat ?
            `${t('repeatEvery')} ${repeatEvery} ${t(repeatInterval.label).toLowerCase()}` :
            t('noRepeat')
          }
        </button>
        { repeat && deleteRepeat &&
          <button className="btn btn-link m-l-5" onClick={() => {
              deleteRepeat();
              setOpen(false);
            }}>
            <i className="fa fa-times" />
          </button>
        }
      </Empty>
    )
  }

  return (
    <div  className="display-inline">
      {vertical &&
        <div className="form-selects-entry-column">
          <Label style={{display: "block"}}>{t('repeat')}</Label>
          <div className="form-selects-entry-column-rest">
            {renderRepeatButton()}
          </div>
        </div>
      }
      {!vertical &&
        <div className="row p-r-10">
          <Label className="col-3 col-form-label">{t('repeat')}</Label>
          <div className="col-9">
            {renderRepeatButton()}
          </div>
        </div>
      }

      <Popover placement="bottom" isOpen={open && !disabled} target={"repeatPopover"} toggle={toggleRepeat}>
        <PopoverHeader>{t('repetition')}</PopoverHeader>
        <PopoverBody>
          <div>
            <FormGroup className="task-add-date-picker-placeholder">
              <Label>{t('startDate')} *</Label>
              <DatePicker
                className="form-control"
                selected={startsAt}
                onChange={setStartsAt}
                placeholderText={t('noStartDate')}
                />
            </FormGroup>

            <FormGroup>
              <Label>{t('repeatEvery')} *</Label>
              <div className="row">
                <div className="width-50-p p-r-20">
                  <Input type="number"
                    className={(parseInt(repeatEvery) < 0 ) ? "form-control-warning form-control-secondary" : "form-control-secondary"}
                    placeholder={t('enterNumber')}
                    value={( repeatEvery )}
                    onChange={(e)=> setRepeatEvery(e.target.value)}
                    />
                </div>
                <div className="width-50-p">
                  <Select
                    value={translateSelectItem(repeatInterval, t)}
                    onChange={setRepeatInterval}
                    options={translateAllSelectItems(intervals, t)}
                    styles={pickSelectStyle()}
                    />
                </div>
                {
                  parseInt(repeatEvery) <= 0 &&
                  <Label className="warning">{t('warningMustBeMoreThan0')}.</Label>
                }
              </div>
            </FormGroup>
            <Checkbox
              className = "m-r-5"
              disabled = {disabled}
              label={t('active')}
              value = { active }
              onChange={() => setActive(!active )}
              />

            <div className="row">
              <button
                className="btn-link"
                onClick={() => setOpen(false) }>
                {t('close')}
              </button>
              <button
                className="btn ml-auto"
                onClick={()=>{
                  if(
                    repeatInterval.value===null ||
                    parseInt(repeatEvery) <= 0 ||
                    isNaN(parseInt(repeatEvery)) ||
                    startsAt === null
                  ){
                    if(repeat !== null){
                      deleteRepeat();
                    }
                  }else{
                    submitRepeat({
                      startsAt,
                      repeatEvery,
                      repeatInterval,
                      active
                    });
                  }
                  setOpen(false);
                }}
                >
                {t('save')}
              </button>
            </div>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
import React from 'react';
import Select from 'react-select';
import Checkbox from 'components/checkbox';
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import DatePicker from 'components/DatePicker';

import {
  selectStyle
} from 'configs/components/select';
import {
  toMomentInput,
  fromMomentToUnix
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

  return (
    <div  className="display-inline">
      {vertical &&
        <div className="form-selects-entry-column">
          <Label style={{display: "block"}}>Repeat</Label>
          <div className="form-selects-entry-column-rest">
            <Button type="button"className="btn btn-repeat" id={"repeatPopover"} onClick={toggleRepeat}>
              {
                repeat ?
                ("Opakovať každý "+ repeatEvery + ' ' + repeatInterval.title) :
                "No repeat"
              }
            </Button>
          </div>
        </div>
      }
      {!vertical &&
        <div className="row p-r-10">
          <Label className="col-3 col-form-label">Repeat</Label>
          <div className="col-9">
            <Button type="button" className="btn btn-repeat flex" id={"repeatPopover"} onClick={toggleRepeat}>
              {
                repeat ?
                ("Opakovať každý "+ repeatEvery + ' ' + repeatInterval.title) :
                "No repeat"
              }
            </Button>
          </div>
        </div>
      }

      <Popover placement="bottom" isOpen={open && !disabled} target={"repeatPopover"} toggle={toggleRepeat}>
        <PopoverHeader>Opakovanie</PopoverHeader>
        <PopoverBody>
          <div>
            <FormGroup>
              <Label>Start date *</Label>
              <DatePicker
                className="form-control hidden-input"
                selected={startsAt}
                onChange={setStartsAt}
                placeholderText="No start date"
                />
            </FormGroup>

            <FormGroup>
              <Label>Repeat every *</Label>
              <div className="row">
                <div className="w-50 p-r-20">
                  <Input type="number"
                    className={(parseInt(repeatEvery) < 0 ) ? "form-control-warning" : ""}
                    placeholder="Enter number"
                    value={( repeatEvery )}
                    onChange={(e)=> setRepeatEvery(e.target.value)}
                    />
                </div>
                <div className="w-50">
                  <Select
                    value={repeatInterval}
                    onChange={setRepeatInterval}
                    options={intervals}
                    styles={selectStyle}
                    />
                </div>
                {
                  parseInt(repeatEvery) <= 0 &&
                  <Label className="warning">Must be bigger than 0.</Label>
                }
              </div>
            </FormGroup>
              <Checkbox
                className = "m-r-5"
                disabled = {disabled}
                label="Active"
                value = { active }
                onChange={() => setActive(!active )}
                />
            <div className="row">
              <Button
                className="btn btn-link"
                onClick={() => setOpen(false) }>
                Close
              </Button>
              <Button
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
                Save
              </Button>
            </div>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
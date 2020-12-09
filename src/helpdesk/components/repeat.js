import React from 'react';
import Select from 'react-select';
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import DatePicker from 'react-datepicker';

import {
  selectStyle
} from 'configs/components/select';
import datePickerConfig from 'configs/components/datepicker';
import {
  toMomentInput,
  fromMomentToUnix
} from 'helperFunctions';
import {
  intervals
} from 'configs/constants/repeat';

export default function Repeat( props ) {
  const {
    disabled,
    taskID,
    repeat,
    submitRepeat,
    deleteRepeat,
    vertical,
    addTask
  } = props;

  const [ open, setOpen ] = React.useState( false );
  const [ startsAt, setStartsAt ] = React.useState( repeat ? repeat.startsAt : null );
  const [ repeatEvery, setRepeatEvery ] = React.useState( repeat ? repeat.repeatEvery : "1" );
  const [ repeatInterval, setRepeatInterval ] = React.useState( repeat ? repeat.repeatInterval : intervals[ 0 ] );

  React.useEffect( () => {
    setOpen( false )
    if ( repeat === null ) {
      setStartsAt( null );
      setRepeatEvery( "1" );
      setRepeatInterval( intervals[ 0 ] );
    } else {
      setStartsAt( repeat.startsAt );
      setRepeatEvery( repeat.repeatEvery );
      setRepeatInterval( repeat.repeatInterval );
    }
  }, [ taskID, repeat ] );

  const toggleRepeat = () => {
    if ( disabled ) {
      return;
    }
    setOpen( true );
  }

  return (
    <div  className="display-inline">
      {vertical &&
        <div className="">
          <Label className="col-form-label-2" style={{display: "block"}}>Repeat</Label>
          <div className="col-form-value-2">
            <Button type="button" style={{paddingLeft: "7px"}} className="repeat-btn" id={"openPopover"+taskID} onClick={toggleRepeat}>
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
        !addTask &&
        <div className="display-inline">
          <Label className="col-form-label w-8">Repeat</Label>
          <div className="display-inline-block w-25 p-r-10">
            <Button type="button" className="repeat-btn flex" id={"openPopover"+taskID} onClick={toggleRepeat}>
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
        addTask &&
        <div className="row p-r-10">
          <Label className="col-3 col-form-label">Repeat</Label>
          <div className="col-9">
            <Button type="button" className="repeat-btn flex" id={"openPopover"+taskID} onClick={toggleRepeat}>
              {
                repeat ?
                ("Opakovať každý "+ repeatEvery + ' ' + repeatInterval.title) :
                "No repeat"
              }
            </Button>
          </div>
        </div>
      }

      <Popover placement="bottom" isOpen={open && !disabled} target={"openPopover"+taskID} toggle={toggleRepeat}>
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
                {...datePickerConfig}
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
            <div className="row">
              <Button
                className="btn-link"
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
                      repeatInterval
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
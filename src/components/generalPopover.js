import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';

export default function GeneralPopover( props ) {
  const {
    placement,
    target,
    header,
    children,
    reset,
    submit,
    open,
    close,
    closeOnly,
    className,
    headerClassName,
    hideButtons,
  } = props;

  const [ popoverOpen, setPopoverOpen ] = React.useState( false );

  const closeAction = close ? close : () => setPopoverOpen( false );
  const isOpened = [ true, false ].includes( open ) ? open : popoverOpen;

  return (
    <Popover placement={placement} className={`custom-popover ${className}`} isOpen={isOpened} target={target} toggle={ closeAction }>
      <PopoverBody>
        <label style={{display: "block"}} className={ headerClassName ? headerClassName : ""  }>{`${header}`}</label>
        {children}
        { !closeOnly && !hideButtons &&
        <div className="row m-t-15">
          <button
            type="button"
            className="btn-link-red"
            onClick={() => {
              if(reset){
                reset();
              }
              closeAction();
            }}
            >
            Cancel
          </button>
          <button
            type="button"
            className="btn ml-auto"
            onClick={() => {
              submit();
              closeAction();
            }}
            >
            Save
          </button>
        </div>
        }
        { closeOnly && !hideButtons &&
        <div className="row m-t-15">
          <button
            type="button"
            className="btn-link-red"
            onClick={() => {
              closeAction();
            }}
            >
            Close
          </button>
        </div>
        }
      </PopoverBody>
    </Popover>
  );
}
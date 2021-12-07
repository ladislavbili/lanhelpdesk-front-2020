import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  UncontrolledPopover,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

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
    useLegacy,
  } = props;

  const {
    t
  } = useTranslation();
  const [ popoverOpen, setPopoverOpen ] = React.useState( false );

  const closeAction = close ? close : () => setPopoverOpen( false );
  const isOpened = [ true, false ].includes( open ) ? open : popoverOpen;
  if ( useLegacy ) {
    return (
      <UncontrolledPopover trigger="legacy" placement={placement} className={`custom-popover ${className}`} isOpen={isOpened} target={target} toggle={ closeAction }>
        <PopoverBody>
          { header &&
            <label style={{display: "block"}} className={ (headerClassName ? headerClassName : "")  }>
              {header}
            </label>
          }
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
                {t('cancel')}
              </button>
              <button
                type="button"
                className="btn ml-auto"
                onClick={() => {
                  submit();
                  closeAction();
                }}
                >
                {t('save')}
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
                {t('close')}
              </button>
            </div>
          }
        </PopoverBody>
      </UncontrolledPopover>
    );
  }

  return (
    <Popover placement={placement} className={`custom-popover ${className}`} isOpen={isOpened} target={target} toggle={ closeAction }>
      <PopoverBody>
        { header &&
          <label style={{display: "block"}} className={ headerClassName ? headerClassName : ""  }>
            {header}
          </label>
        }
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
              {t('cancel')}
            </button>
            <button
              type="button"
              className="btn ml-auto"
              onClick={() => {
                submit();
                closeAction();
              }}
              >
              {t('save')}
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
              {t('close')}
            </button>
          </div>
        }
      </PopoverBody>
    </Popover>
  );
}
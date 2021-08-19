import React from 'react';
import Switch from "react-switch";
import Empty from "components/Empty";


export default function HelpdeskSwitch( props ) {
  const {
    onChange,
    value,
    trueLabel,
    falseLabel,
    label,
    simpleSwitch,
    customColor,
    className,
    switchClassName,
    labelClassName,
    height,
    width,
    inline,
    disabled,
  } = props;

  const [ fakeState, setFakeState ] = React.useState( false );

  const useFakeState = typeof value !== "boolean";
  const state = useFakeState ? fakeState : value;
  const defaultHeight = simpleSwitch ? 15 : 22;
  const defaultWidth = simpleSwitch ? 30 : 56;

  const trigger = () => {
    if ( onChange ) {
      onChange( !state );
    }
    setFakeState( !state )
  }

  const switchContent = (
    <label className={`${ className ? className : 'm-b-15 m-t-5' }`}>
      <Switch
        checked={ state }
        height={ height ? height : defaultHeight }
        width={ width ? width : defaultWidth }
        onChange={ trigger }
        disabled={ disabled }
        className={`center-hor ${ switchClassName ? switchClassName : '' }`}
        checkedIcon={<span className="switchLabel">{trueLabel ? trueLabel : ''}</span>}
        uncheckedIcon={<span className="switchLabel">{falseLabel ? falseLabel : ''}</span>}
        onColor={ customColor ? customColor : "#0078D4"}
        />
      <span
        className={`m-l-10 center-hor clickable noselect ${ labelClassName ? labelClassName : '' } `}
        >
        {label}
      </span>
    </label>
  )
  if ( inline ) {
    return switchContent;
  }
  return (
    <div>
      { switchContent }
    </div>
  )
}
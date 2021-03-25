import React from 'react';
import {
  Input
} from 'reactstrap';
import {
  calculateTextAreaHeight
} from '../../helperFunctions';


export default function InteractiveDescription( props ) {

  const {
    item,
    onChange,
    width
  } = props;

  const [ editText, setEditText ] = React.useState( '' );
  const [ editID, setEditID ] = React.useState( null );
  const [ editFake, setEditFake ] = React.useState( null );
  const [ newID, setNewID ] = React.useState( 0 );

  const [ editTextHeight, setEditTextHeight ] = React.useState( 29 );

  return (
    <div className="flex" >
      <Input className="no-scrolling"
        style={{
          height: editText === "" ? item.textHeight : editTextHeight,
          /*width: this.props.width ? 958-this.props.width-20 : 150*/
        }}
        type="textarea"
        value={ editText === "" ? item.text : editText }
        onBlur={ () => {
          let body = {
            text: editText,
            fake: editFake,
            textHeight: editTextHeight
          }
          onChange( body );
          setEditText( "" );
        } }
        onFocus={ () => {
          setEditText( item.text );
          setEditFake( item.fake );
          setEditTextHeight( item.textHeight );
        } }
        onChange={ e => {
          setEditText( e.target.value );
          setEditTextHeight( calculateTextAreaHeight( e ) );
        } }
        />
    </div>
  );
}
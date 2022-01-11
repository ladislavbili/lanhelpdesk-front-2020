import React from 'react';
/*
import {
  CKEditor
} from '@ckeditor/ckeditor5-react';
*/
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import {
  uint8ArrayToImg
} from 'helperFunctions';

export default function CKCustomEditor( props ) {

  const {
    title,
    text,
    setText,
    buttonId,
    onFocus,
    editorIndex
  } = props;

  const inputFile = React.useRef( null );
  const editors = document.getElementsByClassName( "ck-file-dialog-button" );
  return null;
  /*
  React.useEffect( () => {
    if ( editors.length > 0 ) {
      editors[ editorIndex ].id = `ckeditor-file-upload-button-${editorIndex}`;
      const input = document.querySelectorAll( `span#ckeditor-file-upload-button-${editorIndex}>input` )[ 0 ];
      if ( input ) {
        input.click = function() {
          inputFile.current.click();
        };
      }
    }
  }, [ editors, editorIndex ] );
  return (
    <div>
      <CKEditor
        editor={Editor}
        config={{
          plugins: [
            'Essentials',
            'Heading',
            'FontFamily',
            'FontSize',
            'FontColor',
            'FontBackgroundColor',
            'Bold',
            'Italic',
            'Highlight',
            'HorizontalLine',
            'Alignment',
            'Indent',
            'TodoList',
            'BlockQuote',
            'Code',
            'CodeBlock',
            'SpecialCharacters',
            'FindAndReplace',
            'Image',
            'ImageCaption',
            'ImageStyle',
            'ImageToolbar',
            'ImageUpload',
            'Link',
          ],
          toolbar: [
            'Heading',
            'FontFamily',
            'FontSize',
            'FontColor',
            'FontBackgroundColor',
            'bold',
            'italic',
            'Highlight',
            'HorizontalLine',
            'alignment',
            'Indent',
            'TodoList',
            'blockquote',
            'code',
            'CodeBlock',
            'SpecialCharacters',
            'FindAndReplace',
            'ImageUpload',
            'Link',
          ]
        }}
        data={text}
        onReady={() => {
          const editors = document.getElementsByClassName("ck-file-dialog-button");
          editors[editorIndex].id = `ckeditor-file-upload-button-${editorIndex}`;

          const input = document.querySelectorAll(`span#ckeditor-file-upload-button-${editorIndex}>input`)[0];
          if (input){
            input.click = function(){
              inputFile.current.click();
            };
          }
        }}
        onChange={(e, editor) => {
          setText(editor.getData());
        }}
        />
    </div>
  );
  */
};
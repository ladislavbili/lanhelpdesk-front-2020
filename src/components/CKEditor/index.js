import React from 'react';
import {
  CKEditor
} from '@ckeditor/ckeditor5-react';
import {
  Editor,
} from 'ckeditor5-custom-build/build/ckeditor';
import Empty from 'components/Empty';
import classicConfig from './classicConfig';
import imageUploadConfig from './imageUploadConfig';
import advancedConfig from './advancedConfig';

export default function CKCustomEditor( props ) {

  const {
    type,
    value,
    onChange,
    onReady,
  } = props;

  const index = props.index ? props.index : 0;
  const hasImageUpload = type === "imageUpload";
  let config = classicConfig;
  switch ( type ) {
    case "imageUpload": {
      config = imageUploadConfig;
      break;
    }
    case "advanced": {
      config = advancedConfig;
      break;
    }
    default: {
      break;
    }
  }

  return (
    <Empty>
      <CKEditor
        editor={Editor}
        config={config}
        data={value}
        onReady={(editor) => {
          if(onReady){
            onReady(editor);
          }
        }}
        onChange={(e,editor) => {
          let value = editor.getData();
          onChange(value);
        }}
        />
    </Empty>
  );
};
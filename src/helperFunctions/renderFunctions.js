import React from 'react';

export const hightlightText = (message, text, color) => {
  let index = message.toLowerCase().indexOf(text.toLowerCase());
  if (index === -1) {
    return (<span>{message}</span>);
  }
  return (<span>{message.substring(0, index)}<span style={{
      color
    }}>{message.substring(index, index + text.length)}</span>{message.substring(index + text.length, message.length)}</span>);
}

export const calculateTextAreaHeight = (e) => {
  //  const firstHeight = 29;
  //  const expansionHeight = 21;
  //  return firstHeight + Math.floor(Math.abs((e.target.scrollHeight-firstHeight))/expansionHeight)*expansionHeight;
  return e.target.scrollHeight;
}

export const getAttributeDefaultValue = (item) => {
  switch (item.type.id) {
    case 'input':
      return '';
    case 'textarea':
      return '';
    case 'select':
      return item.options.length > 0
        ? item.options[0]
        : null;
    default:
      return '';
  }
}

export const htmlFixNewLines = (text) => {
  return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

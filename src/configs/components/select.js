import chroma from 'chroma-js';

const value = {
  font: '14px Segoe UI',
  color: '#333',
}
const noValue = {
  font: '14px Segoe UI',
  color: '#777',
}
const noValueMandatory = {
  font: '14px Segoe UI',
  color: '#E81123',
}

export const invisibleSelectStyleNoArrow = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0
  } ),
  dropdownIndicator: base => ( {
    ...base,
    color: "transparent",
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    return {
      ...base,
      backgroundColor: data.color ? data.color : "#F2F1F1",
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color ? "white" : "black",
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color ? "white" : "black",
    backgroundColor: data.color ? data.color : "#F2F1F1",
    ':hover': {
      backgroundColor: "rgba(0,0,0,0.5)",
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0,
    ...value,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "inherit",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValue
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),

};

export const invisibleSelectStyleNoArrowNoPadding = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0
  } ),
  dropdownIndicator: base => ( {
    ...base,
    color: "transparent",
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    return {
      ...base,
      backgroundColor: data.color ? data.color : "#F2F1F1",
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color ? "white" : "black",
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color ? "white" : "black",
    backgroundColor: data.color ? data.color : "#F2F1F1",
    ':hover': {
      backgroundColor: "rgba(0,0,0,0.5)",
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px 0px 0px',
    borderRadius: 0,
    ...value,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "inherit",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValueMandatory
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),

};

export const invisibleSelectStyleNoArrowColored = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0
  } ),
  option: ( styles, {
    data,
    isDisabled,
    isFocused,
    isSelected
  } ) => {
    const color = chroma( data.color );
    return {
      ...styles,
      backgroundColor: isDisabled ?
        null : isSelected ?
        data.color : isFocused ?
        color.alpha( 0.1 ).css() : null,
      color: isDisabled ?
        '#ccc' : isSelected ?
        chroma.contrast( color, 'white' ) > 2 ?
        'white' :
        'black' : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[ ':active' ],
        backgroundColor: !isDisabled && ( isSelected ? data.color : color.alpha( 0.3 ).css() ),
      },
    };
  },
  dropdownIndicator: base => ( {
    ...base,
    color: "transparent",
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    const color = chroma( data.color );
    return {
      ...base,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: color.alpha( 0.1 ).css(),
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color,
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 5px',
    borderRadius: 0,
    ...value,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: '0px 5px',
    backgroundColor: "inherit",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValue
  } ),
  singleValue: ( styles, {
    data
  } ) => {
    return ( {
      ...styles,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: data.color
    } );
  },
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),
};

export const invisibleSelectStyleNoArrowRequired = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0
  } ),
  dropdownIndicator: base => ( {
    ...base,
    color: "transparent",
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    return {
      ...base,
      backgroundColor: data.color ? data.color : "#F2F1F1",
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color ? "white" : "black",
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color ? "white" : "black",
    backgroundColor: data.color ? data.color : "#F2F1F1",
    ':hover': {
      backgroundColor: "rgba(0,0,0,0.5)",
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0,
    ...value,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "inherit",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValueMandatory
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
    ...value
  } ),

};

export const invisibleSelectStyleNoArrowRequiredNoPadding = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0
  } ),
  dropdownIndicator: base => ( {
    ...base,
    color: "transparent",
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    return {
      ...base,
      backgroundColor: data.color ? data.color : "#F2F1F1",
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color ? "white" : "black",
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color ? "white" : "black",
    backgroundColor: data.color ? data.color : "#F2F1F1",
    ':hover': {
      backgroundColor: "rgba(0,0,0,0.5)",
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px 0px 0px',
    borderRadius: 0,
    ...value
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "inherit",
    borderRadius: 0,
    ...value
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValueMandatory
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
    ...value
  } ),

};

export const invisibleSelectStyleNoArrowColoredRequired = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0
  } ),
  option: ( styles, {
    data,
    isDisabled,
    isFocused,
    isSelected
  } ) => {
    const color = chroma( data.color );
    return {
      ...styles,
      backgroundColor: isDisabled ?
        null : isSelected ?
        data.color : isFocused ?
        color.alpha( 0.1 ).css() : null,
      color: isDisabled ?
        '#ccc' : isSelected ?
        chroma.contrast( color, 'white' ) > 2 ?
        'white' :
        'black' : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[ ':active' ],
        backgroundColor: !isDisabled && ( isSelected ? data.color : color.alpha( 0.3 ).css() ),
      },
    };
  },
  dropdownIndicator: base => ( {
    ...base,
    color: "transparent",
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    const color = chroma( data.color );
    return {
      ...base,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: color.alpha( 0.1 ).css(),
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color,
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 5px',
    borderRadius: 0,
    ...value

  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: '0px 5px',
    backgroundColor: "inherit",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValueMandatory
  } ),
  singleValue: ( styles, {
    data
  } ) => {
    return ( {
      ...styles,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: data.color
    } );
  },
  placeholder: base => ( {
    ...base,
    font: '14px Segoe UI',
    color: '#E81123',
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),
};

export const invisibleSelectStyleNoArrowColoredRequiredNoPadding = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0
  } ),
  option: ( styles, {
    data,
    isDisabled,
    isFocused,
    isSelected
  } ) => {
    const color = chroma( data.color );
    return {
      ...styles,
      backgroundColor: isDisabled ?
        null : isSelected ?
        data.color : isFocused ?
        color.alpha( 0.1 ).css() : null,
      color: isDisabled ?
        '#ccc' : isSelected ?
        chroma.contrast( color, 'white' ) > 2 ?
        'white' :
        'black' : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[ ':active' ],
        backgroundColor: !isDisabled && ( isSelected ? data.color : color.alpha( 0.3 ).css() ),
      },
    };
  },
  dropdownIndicator: base => ( {
    ...base,
    color: "transparent",
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    const color = chroma( data.color );
    return {
      ...base,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: color.alpha( 0.1 ).css(),
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color,
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px 0px 0px',
    borderRadius: 0,
    ...value
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: '0px 5px',
    backgroundColor: "inherit",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  singleValue: ( styles, {
    data
  } ) => {
    return ( {
      ...styles,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: data.color
    } );
  },
  placeholder: base => ( {
    ...base,
    ...noValueMandatory
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),
};

export const sidebarSelectStyle = {
  singleValue: ( provided, state ) => {
    return {
      ...provided,
      marginLeft: 30,
      color: "#212121"
    };
  },
  indicatorSeparator: ( provided, state ) => {
    return {
      ...provided,
      width: 0,
    };
  },
  control: ( provided, state ) => {
    return {
      ...provided,
      background: "#F9F9F9",
      borderRadius: 0,
      borderWidth: "0",
      height: 40,
      padding: 0
    };
  },
  input: ( provided, state ) => {
    return {
      ...provided,
      marginLeft: 30
    };
  },
  placeholder: ( provided, state ) => {
    return {
      ...provided,
      marginLeft: 30
    };
  },
};

export const selectStyleColored = {
  control: base => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
  } ),
  dropdownIndicator: base => ( {
    ...base,
    width: 0,
    color: "transparent",
    padding: 0,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    const color = chroma( data.color );
    return {
      ...base,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: color.alpha( 0.1 ).css(),
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color,
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: 'inherit',
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  option: ( styles, {
    data,
    isDisabled,
    isFocused,
    isSelected
  } ) => {
    const color = chroma( data.color );
    return {
      ...styles,
      backgroundColor: isSelected ?
        data.color : isFocused ?
        color.alpha( 0.1 ).css() : null,
      color: isSelected ?
        chroma.contrast( color, 'white' ) > 2 ?
        'white' :
        'black' : data.color,

      ':active': {
        ...styles[ ':active' ],
        backgroundColor: !isDisabled && ( isSelected ? data.color : color.alpha( 0.3 ).css() ),
      },
    };
  },
  singleValue: ( styles, {
    data
  } ) => {
    return ( {
      ...styles,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: data.color
    } );
  },
};

export const invisibleSelectStyleOtherFont = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0,
    fontFamily: "Segoe UI",
    fontStyle: "normal",
    fontWeight: 350,
    fontSize: "12px",
    lineHeight: "20px",
    letterSpacing: "0.5px",
    color: "#3C3C3C",
  } ),
  dropdownIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: base => ( {
    ...base,
    backgroundColor: "#F2F1F1",
    borderRadius: 0
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "inherit",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),

};

export const selectStyle = {
  control: base => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
    borderRadius: 0
  } ),
  dropdownIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: base => ( {
    ...base,
    backgroundColor: 'white',
    borderRadius: 0
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0,
    ...value
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: 'inherit',
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValue
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),


};

export const selectStyleNoArrow = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 32,
    borderWidth: 1,
    borderRadius: 1
  } ),
  dropdownIndicator: base => ( {
    ...base,
    color: "transparent",
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: ( base, {
    data
  } ) => {
    return {
      ...base,
      borderRadius: 0,
    };
  },
  multiValueLabel: ( base, {
    data
  } ) => ( {
    ...base,
    color: data.color ? "white" : "black",
  } ),
  multiValueRemove: ( styles, {
    data
  } ) => ( {
    ...styles,
    color: data.color ? "white" : "black",
    backgroundColor: data.color ? data.color : "#F2F1F1",
    ':hover': {
      backgroundColor: "rgba(0,0,0,0.5)",
      color: 'white',
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0,
    ...value,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    color: '#FF4500'
  } ),
  placeholder: base => ( {
    ...base,
    ...noValue
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),

};

export const invisibleSelectStyle = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0
  } ),
  dropdownIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: base => ( {
    ...base,
    backgroundColor: "#F2F1F1",
    borderRadius: 0
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0,
    ...value
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "inherit",
    borderRadius: 0
  } ),
  placeholder: base => ( {
    ...base,
    ...noValue
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),
};

export const disabledSelectStyle = {
  control: base => ( {
    ...base,
    minHeight: 30,
    backgroundColor: '#ced4da',
    borderRadius: 0
  } ),
  dropdownIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: base => ( {
    ...base,
    backgroundColor: 'white',
    borderRadius: 0
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: '#ced4da',
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),

};

export const CRMMertelSelectStyle = {
  control: base => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
    borderRadius: 4.13,
    fontWeight: 600,
    fontSize: 11,
    alignItems: "center",
  } ),
  dropdownIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  clearIndicator: base => ( {
    ...base,
    padding: 4,
  } ),
  multiValue: base => ( {
    ...base,
    backgroundColor: 'white',
    borderRadius: 0,
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: 'white',
    borderRadius: 0,
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),

};
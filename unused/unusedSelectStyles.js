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

export const selectStyleNoArrowNoPadding = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
    border: "none",
    borderRadius: 0,
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
    padding: '0px 5px',
    borderRadius: 0,
    ...value,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "white",
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
    border: "none",
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
    borderRadius: 0,
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

export const selectStyleNoArrowRequired = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
    border: "none",
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
      marginLeft: 0,
      marginRight: 4,
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
      margin: 0,
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0,
    margin: 0,
    ...value,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "white",
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
    zIndex: 9990,
    ...value
  } ),

};

export const selectStyleNoArrowRequiredPlaceHolderHighlight = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
    border: "none",
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
      marginLeft: 0,
      marginRight: 4,
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
      margin: 0,
    },
  } ),
  valueContainer: base => ( {
    ...base,
    padding: '0px 6px',
    borderRadius: 0,
    margin: 0,
    ...value,
  } ),
  input: base => ( {
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: "white",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValueMandatory,
    color: "red",
  } ),
  menu: base => ( {
    ...base,
    zIndex: 9990,
    ...value
  } ),

};

export const invisibleSelectStyleNoArrowRequiredNoPadding = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
    border: "none",
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

export const selectStyleNoArrowColoredRequired = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
    border: "none",
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
    backgroundColor: "white",
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
      backgroundColor: data.color,
      height: 22
    } );
  },
  placeholder: base => ( {
    ...base,
    ...noValueMandatory,
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),
};


export const selectStyleNoArrowColoredRequiredPlaceHolderHighlight = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
    border: "none",
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
    backgroundColor: "white",
    borderRadius: 0
  } ),
  indicatorSeparator: base => ( {
    ...base,
    width: 0,
  } ),
  placeholder: base => ( {
    ...base,
    ...noValueMandatory,
    color: "red",
  } ),
  singleValue: ( styles, {
    data
  } ) => {
    return ( {
      ...styles,
      color: '#FFF',
      padding: '0px 5px',
      backgroundColor: data.color,
      height: 22
    } );
  },
  placeholder: base => ( {
    ...base,
    ...noValueMandatory,
  } ),
  menu: base => ( {
    ...base,
    zIndex: 50,
  } ),
};

export const invisibleSelectStyleNoArrowColoredRequired = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    border: "none",
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
    ...noValueMandatory
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

export const invisibleSelectStyleBlueFont = {
  control: ( base, state ) => ( {
    ...base,
    minHeight: 30,
    backgroundColor: state.isFocused ? 'white' : 'inherit',
    borderWidth: 0,
    borderRadius: 0,
    fontFamily: "Segoe UI",
    fontStyle: "normal",
    fontWeight: 350,
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.5px",
    color: "#0078D4",
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
    borderRadius: 0,
    color: "#0078D4",
  } ),
  placeholder: base => ( {
    ...base,
    color: "#0078D4",
    fontSize: "14px",
  } ),
  singleValue: base => ( {
    ...base,
    backgroundColor: "#F2F1F1",
    borderRadius: 0,
    color: "#0078D4",
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
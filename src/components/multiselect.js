import React, {
  Component
} from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap';
import Checkbox from './checkbox';

export default function Multiselect( props ) {

  const {
    className,
    direction,
    style,
    label,
    options,
    value,
    onChange,
    disabled,
  } = props;

  const [ open, setOpen ] = React.useSate( false );

  return (
    <ButtonDropdown
				className={ className }
				direction={ direction ? direction : "left" }
				style={ style ? style : {} }
				isOpen={ open && !disabled }
				toggle={ () => setOpen(!open) }
				>
				<DropdownToggle caret className="btn btn-link-reversed">
					{label}
				</DropdownToggle>
				<DropdownMenu style={{width:'max-content'}}>
					{ options.map((option)=>
							<Checkbox
								key = {option.id}
								className = "m-l-5 m-r-5"
								label = {option.label}
								value = { value.some((item)=> item.id === option.id ) }
								onChange = {()=>{
									onChange(option);
								}}
								/>
					)}
				</DropdownMenu>
			</ButtonDropdown>
  );
}
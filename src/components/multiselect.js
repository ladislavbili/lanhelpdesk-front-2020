import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Checkbox from './checkbox';

export default class Multiselect extends Component {
	constructor(props){
		super(props);
		this.state = {
			open:false,
		}
	}

	render() {
		return (
			<ButtonDropdown
				className={this.props.className}
				direction={ this.props.direction ? this.props.direction : "left" }
				style={this.props.style?this.props.style:{}}
				isOpen={ this.state.open && !this.props.disabled }
				toggle={()=>this.setState({open:!this.state.open})}
				>
				<DropdownToggle caret className="btn btn-link-reversed">
					{this.props.label}
				</DropdownToggle>
				<DropdownMenu style={{width:'max-content'}}>
					{ this.props.options.map((option)=>
						<Checkbox
							key = {option.id}
							className = "m-l-5 m-r-5"
							label = {option.label}
							value = { this.props.value.some((item)=> item.id === option.id ) }
							onChange = {()=>{
								this.props.onChange(option);
							}}
							/>
					)}
				</DropdownMenu>
			</ButtonDropdown>
		);
	}
}

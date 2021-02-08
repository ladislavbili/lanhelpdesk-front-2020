import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { rebase } from '../../index';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saving: false,
			title: "",
			body: "",
			public: false,
			active: false,
			read: [],
			write: [],
			users: [],
			search: "",

			value: 100,
		};

		this.submit.bind(this);
	}

	submit(){
    this.setState({value: 0, saving: true});
    let newRead = this.state.read.map(user => user.id);
    let newWrite = this.state.write.map(user => user.id);
    rebase.addToCollection('/lanwiki-tags', {title:this.state.title, body:this.state.body, read: newRead, write: newWrite, public: this.state.public, active: this.state.active})
    .then(() => {
      this.setState({
        saving:false,
        title: "",
        body: "",
        users: "",
        read: [],
        write: [],
        public: false,
        active: false,
        value: 100
      }, () => this.props.close());
    });
  }

	render() {
		return (
			<div>
				{/*		<Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>*/}

				<ModalBody>
					<ModalHeader>
						Add tag
					</ModalHeader>
					<FormGroup className="m-t-10 m-b-10">
							<Input
								type="checkbox"
								checked={this.state.active}
								onChange={(e) => this.setState({active: e.target.checked})}
								/>
							<Label className="m-l-15">
								Active
							</Label>
					</FormGroup>

						<FormGroup>
							<Label htmlFor="name">Názov</Label>
							<Input id="name" className="form-control" placeholder="Názov" value={this.state.title} onChange={(e) => this.setState({title: e.target.value})}/>
						</FormGroup>

						<FormGroup>
							<Label htmlFor="body">Popis</Label>
							<Input type="textarea" className="form-control" id="body" placeholder="Zadajte text" value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}/>
						</FormGroup>

					</ModalBody>

					<ModalFooter>
						<Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
							Close
						</Button>
						<Button  className="btn" onClick={this.submit.bind(this)} >
							{!this.state.saving ? "Save":"Saving..."}
						</Button>
					</ModalFooter>

			</div>
			);
		}
	}

import React, { Component } from 'react';
import {Button, FormGroup, Label, Input, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { rebase } from '../../index';
import Permits from "../../components/permissions";

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: this.props.tag.title,
			body: this.props.tag.body,
			view: this.props.tag.view,
			edit: this.props.tag.edit,
			permissions: this.props.tag.permissions,

			saving: false,
			public: false,
			active: false,
			firstRead: [],
			firstWrite: [],
			users: [],
			search: "",

			value: 0,
		};

//		this.addUser.bind(this);
//		this.changeUserRead.bind(this);
//		this.changeUserWrite.bind(this);
		this.submit.bind(this);
		this.remove.bind(this);
		this.fetchData.bind(this);
	//	this.fetchData(this.props.tagEdit.id);
	}

		fetchData(id){
			rebase.get('lanwiki-tags/' + id, {
				context: this,
				withIds: true,
			}).then((tag) =>{
					 /*rebase.get('/lanwiki-users', {
						context: this,
						withIds: true,
						}).then((users) =>*/
								this.setState({
									title: tag.title,
									body: tag.body,
							//		read: users.filter(u => tag.read.includes(u.id)),
							//		write: users.filter(u => tag.write.includes(u.id)),
									active: tag.active,
									public: tag.public,
							//		users,
				//					value: 100,
								})
						//	);
			});
		}

	componentWillReceiveProps(props){
    if(this.props.tag.id !== props.tag.id ){
      this.setState({
		//		value: 0,
				title: props.tag.title,
				body: props.tag.body,
			});
    //  this.fetchData(props.match.params.tagID);
    }
  }

	submit(){
     this.setState({/*value: 0, */saving: true});
  //  let newRead = this.state.read.map(user => user.id);
  //  let newWrite = this.state.write.map(user => user.id);
    rebase.updateDoc('/lanwiki-tags/'+this.props.tag.id, {title:this.state.title, body:this.state.body, /*read: newRead, write: newWrite, public: this.state.public,*/ active: this.state.active})
    .then(() => {
      this.setState({
  //      value: 100,
				saving: false,
      }, () => this.props.close());
    });
  }

	remove(){
  //  this.setState({value: 0});
    if (window.confirm("Chcete zmazať tento tag?")) {
      rebase.removeDoc('/lanwiki-tags/'+this.props.tag.id)
        .then(() =>
            { rebase.get('/lanwiki-notes', {
                context: this,
                withIds: true,
              })
              .then((notes) =>{
                notes.filter(note => (note.tags.includes(this.props.tag.id)))
                .map(note =>
                    rebase.updateDoc('/lanwiki-notes/'+note.id, {title: note.title, body: note.body, tags: note.tags.filter(item => item !== this.props.match.params.tagID)})
                  );
                this.props.close();
              });
            });
      };
  //  this.setState({value: 100});
  }

	render() {
		return (
			<div >
				{/*		<Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>*/}
				<ModalBody>
					<ModalHeader>
						Edit tag
					</ModalHeader>
					<FormGroup className="m-t-10 m-b-10">
							<Input
								type="checkbox"
								checked={this.state.active}
								onChange={(e) => this.setState({active: e.target.checked})}
								/>{'    '}
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

					<Permits id={this.props.tag.id} view={this.props.tag.view} edit={this.props.tag.edit} permissions={this.props.tag.permissions} db="lanwiki-tags"/>

				</ModalBody>

				<ModalFooter>
					<Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
						Close
					</Button>
					<Button  className="btn" onClick={this.submit.bind(this)} >{!this.state.saving ? "Save":"Saving..."}</Button>
					{" "}
					<Button  className="btn-link" onClick={this.remove.bind(this)} >Delete</Button>
				</ModalFooter>


			</div>
			);
		}
	}

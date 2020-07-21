import React, { Component } from 'react';
import { rebase } from '../../index';
import { connect } from "react-redux";
import TimeAgo from 'react-timeago';
import {setWikiOrderBy, setWikiAscending, setLayout} from '../../redux/actions';
import ShowData from '../../components/showData';
import NoteEdit from './NoteEdit';
import NoteEmpty from './noteEmpty';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notes: [],
			tags: [],
			listName:''
		};

		this.createNew.bind(this);
	}

	componentWillMount(){
			this.setState({
			});
			this.ref1 = rebase.listenToCollection('/lanwiki-notes', {
				context: this,
				withIds: true,
				then: notes=> this.setState({notes})
			});
			this.ref2 = rebase.listenToCollection('/lanwiki-tags', {
				context: this,
				withIds: true,
				then: tags=> this.setState({tags})
			});
			this.getFilterName(this.props.match.params.listID);
	}

	createNew(){
    rebase.addToCollection('lanwiki-notes',
    {name: "Untitled",
      tags: (this.props.match.params.listID !== "all" ? [this.props.match.params.listID] : []),
      body: "",
      lastUpdated: Date().getTime(),
      dateCreated: Date().getTime()
    })
    .then((note) => {
      this.props.history.push(`/lanwiki/${this.props.match.params.listID}/${note.id}`);
    });
  }

	componentWillReceiveProps(props){
		if(this.props.match.params.listID!==props.match.params.listID){
			this.getFilterName(props.match.params.listID);
		}
	}

	getFilterName(id){
		if(!id){
			this.setState({filterName:''});
			return;
		}else if(id==='all'){
			this.setState({filterName:'All'});
			return;
		}
		let tag = this.state.tags.find((item)=>item.id===id);
		if(tag){
			this.setState({filterName: (tag.name ? tag.name : tag.title)});
		}else{
			rebase.get('lanwiki-tags/'+id, {
				context: this,
			}).then((result)=>{
				this.setState({filterName: (tag.name ? tag.name : tag.title)});
			}).catch(()=>{
				this.setState({filterName:'Unknown tag'});
			})

		}
	}


	render() {

		let link='';
		if(this.props.match.params.hasOwnProperty('listID')){
			link = '/lanwiki/i/'+this.props.match.params.listID;
		}else{
			link = '/lanwiki/i/all'
		}
		return (
			<ShowData
				layout={this.props.layout}
				setLayout={this.props.setLayout}
				data={this.state.notes.map((note)=>{
					return {
						...note,
						tags:this.state.tags.filter((item)=>note.tags.includes(item.id))
					}
				})
					.filter((item)=>item.tags.some((item)=>item.id===this.props.match.params.listID)||this.props.match.params.listID==='all'||!this.props.match.params.listID)}
				displayCol={(note)=>
					<li>

						<div className="taskCol-body">
							<p className="pull-right m-t-5">
								<span>
									<span className="attribute-label"> Updated: </span>
									{note.lastUpdated&& <TimeAgo date={new Date(note.lastUpdated)} />}
								</span>
							</p>
							<p >
								<span>
									<div className="taskCol-title">
										<span>{note.name}</span>
									</div>
								</span>
							</p>
						</div>
						<div className="taskCol-tags">
							{note.tags.map((tag)=>
								<span key={tag.id} className="label label-info m-r-5">{tag.title}</span>
							)}
						</div>
					</li>
				}
				filterBy={[
					{value:'name',type:'text'},{value:'dateCreated',type:'date'},{value:'lastUpdated',type:'date'},
				]}
				filterName="lanwiki-notes"
				displayValues={[
					{value:'name',label:'Name',type:'text'},{value:'dateCreated',label:'Created at',type:'date'},{value:'lastUpdated',label:'Updated at',type:'date'},
				]}
				orderByValues={[
					{value:'name',label:'Name',type:'text'},{value:'dateCreated',label:'Created at',type:'date'},{value:'lastUpdated',label:'Updated at',type:'date'},
				]}
				link={link}
				history={this.props.history}
				orderBy={this.props.orderBy}
				setOrderBy={this.props.setWikiOrderBy}
				ascending={this.props.ascending}
				setAscending={this.props.setWikiAscending}
				itemID={this.props.match.params.noteID}
				listID={this.props.match.params.listID}
				listName={this.state.filterName}
				match={this.props.match}
				edit={NoteEdit}
				empty={NoteEmpty}
				 />
			);
		}
	}


		const mapStateToProps = ({ filterReducer, wikiReducer, appReducer }) => {
			const { project, filter } = filterReducer;
			const { orderBy, ascending } = wikiReducer;
			return { project, filter,orderBy,ascending, layout:appReducer.layout };
		};

		export default connect(mapStateToProps, { setWikiOrderBy, setWikiAscending, setLayout })(List);

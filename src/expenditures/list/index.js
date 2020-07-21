import React, { Component } from 'react';
import {rebase} from '../../index';
import { connect } from "react-redux";
import ShowData from '../../components/showData';
import EditExpenditure from './editExpenditure';
import {timestampToString} from '../../helperFunctions';
import {setExpendituresOrderBy, setExpendituresAscending, setLayout} from '../../redux/actions';
import EmptyExpenditure from "./emptyExpenditure";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			instances:[],
			listName: "",
		};
		this.ref=null;
		this.getListName.bind(this);
		this.fetchData.bind(this);
		this.fetchData(this.props.match.params.listID);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.listID!==props.match.params.listID){
			this.fetchData(props.match.params.listID);
		}
	}

	fetchData(id){
		if(this.ref!==null){
			rebase.removeBinding(this.ref);
		}
		this.ref = rebase.listenToCollection('/expenditures-instances', {
			context: this,
			withIds: true,
			query: (ref) => ref.where('folder', '==', id),
			then:instances=>{this.setState({instances})},
		});

		this.getListName(id);

	}

	getListName(id){
		if(!id){
			this.setState({listName:''});
			return;
		} else{
			rebase.get('expenditures-folders/'+id, {
				context: this,
			}).then((result)=>{
				this.setState({listName: result.title});
			}).catch(()=>{
				this.setState({listName: 'Untitled'});
			})

		}
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
	}

	render() {
		let link='';
		if(this.props.match.params.hasOwnProperty('listID')){
			link = '/expenditures/i/'+this.props.match.params.listID;
		}else{
			link = '/expenditures'
		}
		return(
			<ShowData
				layout={this.props.layout}
				setLayout={this.props.setLayout}
				data={this.state.instances}
				displayCol={(expenditure)=>
					<li>
						<div className="taskCol-title">
							<span>{expenditure.title}</span>
						</div>
						<div className="taskCol-body">
							<p className="pull-right">
								<span>
									<span className="attribute-label">Start: </span>
									{expenditure.startDate?timestampToString(expenditure.startDate):'None'}</span>
							</p>
							<p >
								<span>
									<span className="attribute-label">Opakovanie: </span>
									{expenditure.repeat?expenditure.repeat:'Žiadne'}</span>
							</p>
							<p>
								<span>
									<span className="attribute-label">Cena: </span>
									{expenditure.price?expenditure.price:'Nezadaná'}</span>
							</p>
						</div>
						<div className="taskCol-tags"></div>
					</li>
				}
				filterBy={[
					{value:'title',type:'text'},
					{value:'startDate',type:'date'},
					{value:'repeat',type:'text'},
					{value:'price',type:'text'},
				]}
				filterName="expenditures-instances"
				displayValues={[
					{value:'startDate',label:'Start date',type:'date'},
					{value:'title',label:'Title',type:'text'},
					{value:'repeat',label:'Repeat',type:'text'},
					{value:'price',label:'Price',type:'text'},
				]}
				orderByValues={[
					{value:'startDate',label:'Start Date',type:'date'},
					{value:'title',label:'Title',type:'text'},
					{value:'repeat',label:'Repeat',type:'text'},
					{value:'price',label:'Price',type:'text'},
				]}
				link={link}
				history={this.props.history}
				orderBy={this.props.orderBy}
				setOrderBy={this.props.setExpendituresOrderBy}
				ascending={this.props.ascending}
				setAscending={this.props.setExpendituresAscending}
				itemID={this.props.match.params.expID}
				listID={this.props.match.params.listID}
				listName={this.state.listName}
				match={this.props.match}
				edit={EditExpenditure}
				empty={EmptyExpenditure}
				 />
		)
		}
	}

	const mapStateToProps = ({ filterReducer, expenditureReducer, appReducer }) => {
		const { project, filter } = filterReducer;
		const { orderBy, ascending } = expenditureReducer;
		return { project, filter,orderBy,ascending, layout:appReducer.layout };
	};

	export default connect(mapStateToProps, { setExpendituresOrderBy, setExpendituresAscending, setLayout })(List);

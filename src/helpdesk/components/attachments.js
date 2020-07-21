import React, { Component } from 'react';

export default class Attachments extends Component {
	constructor(props){
		super(props);
		this.state={
		}
	}

	render() {
		return (
					<div className="full-width attachments">
							{!this.props.disabled &&
								<div className="attachment-label">
								<label htmlFor={"uploadAttachment"+this.props.taskID} className="btn-link-add" >
									<i className="fa fa-plus" /> Add attachment
								</label>
								<input type="file" id={"uploadAttachment"+this.props.taskID} multiple={true} style={{display:'none'}}
									onChange={(e)=>{
										if(e.target.files.length>0){
											let files = [...e.target.files];
											this.props.addAttachments(files);
										}
									}}/>
								</div>
							}
								{
									this.props.attachments.map((attachment,index)=>
									<div key={index}  className="attachment">
												{attachment.url && <a target="_blank" href={attachment.url} style={{cursor:'pointer', color: "black"}} rel="noopener noreferrer">
													{`${attachment.title} (${Math.round(parseInt(attachment.size)/1024)}kB)`}
												</a>}
												{attachment.url && !this.props.disabled && <button className="btn-link-remove"
													disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeAttachment(attachment);
														}
													}}>
													<i className="fa fa-times"  />
												</button>}
												{!attachment.url && <div>
													<span style={{cursor:'pointer', color: "black"}}>{`${attachment.title} (${Math.round(parseInt(attachment.size)/1024)}kB)`}</span>
													{!this.props.disabled && <button className="btn-link-remove"
														disabled={this.props.disabled}
														onClick={()=>{
															if(window.confirm('Are you sure?')){
																this.props.removeAttachment(attachment);
															}
														}}>
														<i className="fa fa-times"  />
													</button>}
												</div>}
									</div>
									)
								}
					</div>

		);
	}
}

import React from 'react';

export default function PageHeader( props ) {

  const {
    sidebarOpen,
    setSidebarOpen,
    history,
  } = props;

  return (
    <div className="width-270 page-header">
				<div className="lansystems-title">
					<h1 className="center-hor p-l-15 clickable noselect" onClick={() => history.push('/helpdesk/taskList/i/all') }>LanHelpdesk</h1>
				</div>
			</div>
  );
}
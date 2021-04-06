import React from 'react';

export default function PageHeader( props ) {

  const {
    sidebarOpen,
    setSidebarOpen,
  } = props;

  return (
    <div className="w-270px page-header">
				<div className="lansystems-title">
          <i className="fas fa-bars" onClick={() => setSidebarOpen(!sidebarOpen)}/>
					<h1 className="center-hor p-l-15">LanHelpdesk</h1>
				</div>
			</div>
  );
}
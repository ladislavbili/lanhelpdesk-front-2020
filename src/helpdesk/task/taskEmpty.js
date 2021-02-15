import React from 'react';

export default function TaskEmpty( props ) {

  return (
    <div className="flex">
			<div className="basic-border-top commandbar">
				<div className="d-flex flex-row align-items-center">
				</div>
			</div>
			<div className="card-box row fit-with-header-and-commandbar">
				<div className=" center-ver center-hor">
					Vyberte task zo zoznamu vlavo.
				</div>
			</div>
		</div>
  );
}
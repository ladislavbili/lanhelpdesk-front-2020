import React from 'react';
import ItemEdit from './itemEdit';
import ItemView from './itemView';

export default function ItemContainer( props ) {

  const [ editFormOpen, setEditFormOpen ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );
  const [ deleting, setDeleting ] = React.useState( false );

  return (
    <div className="fit-with-header">
				<div className="commandbar flex-row">
							{ !editFormOpen &&
								<button type="button" className="center-hor btn-link btn-distance" onClick={() => setEditFormOpen(true)}>
									<i
										className="fas fa-pen commandbar-command-icon"
										/>
									Edit
								</button>
							}
							{ editFormOpen &&
								<button type="button" className="center-hor btn-link btn-distance" onClick={() => setEditFormOpen(false) }>
									<i
										className="fas fa-file-invoice commandbar-command-icon"
										/>
									View
								</button>
							}
							{ !editFormOpen &&
								<button type="button" className="center-hor btn-link btn-distance" onClick={()=>{}}>
									<i
										className="fas fa-print commandbar-command-icon"
										/>
									Print
								</button>
							}
							{ editFormOpen &&
								<button type="button" className="center-hor btn-link btn-distance" onClick={()=>{}} disabled={saving}>
									<i
										className="fas fa-save commandbar-command-icon"
										/>
                  Save
								</button>
							}
							<button type="button" className="center-hor btn-link" onClick={()=>{}} disabled={deleting}>
								<i
									className="fas fa-trash commandbar-command-icon"
									/>
								{" Delete"}
							</button>
				</div>
				{
					editFormOpen &&
					<ItemEdit {...props} close={() => {}} delete={() => {}} saving={saving} setDeleting={(deleting)=>{}} setSaving={(saving)=>{}} />
				}
				{
					!editFormOpen &&
					<ItemView {...props} delete={() => {}} setDeleting={(deleting)=>{}} />
				}
			</div>
  );
}
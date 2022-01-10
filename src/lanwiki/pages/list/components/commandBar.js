import React from 'react';
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";
import {
  setLSidebarFolder,
  setLSidebarTag,
} from 'apollo/localSchema/actions';

// breadcrums, layout switch
export default function CommandBar( props ) {
  const {
    loading,
    folder,
    tag,
    history,
  } = props;

  const {
    t
  } = useTranslation();

  const filteredBreadcrums = [
    {
      type: 'folder',
      data: folder,
      show: true,
      label: t( folder.title ),
      onClick: () => {
        //setLSidebarFolder( folder );
        //history.push( `/lanwiki/i/${folder.id}` );
        setLSidebarTag( null );
      }
    },
    {
      type: 'tag',
      data: tag,
      show: tag.id !== null,
      label: t( tag.title ),
      onClick: () => {
        //setLSidebarTag( tag );
      }
    }
  ];

  return (
    <div className="task-list-commandbar m-l-30 m-r-45">
      <div className="center-hor flex row">
        <div className="flex-row breadcrumbs">
          { filteredBreadcrums.filter((breadcrum) => breadcrum.show ).map( (breadcrum, index) =>(
            <h2
              className="clickable"
              key={index}
              onClick={breadcrum.onClick}
              >
              {`${index !== 0 && breadcrum.label ? '\\' : ''}${breadcrum.label}`}
            </h2>
          ))}
        </div>
        <div className="ml-auto row">
      </div>
      </div>
    </div>
  );
}
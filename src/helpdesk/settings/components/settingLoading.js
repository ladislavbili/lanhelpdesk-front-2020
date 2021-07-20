import React from 'react';
import Loading from 'components/loading';

export default function SettingLoading( props ) {
  //data
  const {
    match,
  } = props;

  return (
    <div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <Loading />
          </div>
          <div className="col-lg-8">
            { match.params.id &&
              <Loading />
            }
          </div>
        </div>
      </div>
  )
}
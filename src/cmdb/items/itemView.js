import React, {
  useCallback
} from 'react';

import Comments from '../components/comments';

import {
  exampleItem as item,
  users,
  usersWithRights
} from '../constants';

export default function ItemView( props ) {


  const deleteItem = useCallback(
    () => {
      if ( window.confirm( 'Are you sure?' ) ) {}
    },
  []
  );

  return (
    <div className="scrollable">
      <div className="fit-with-header-and-commandbar contents">
        <div className="row">
          <h2 className="center-hor">
            {`${item.id}: ${item.title}`}
          </h2>
          <div className="ml-auto item-creation-info">
            <span> Created by <span className="bolder"> Natalia Tyulina </span> at <span className="bolder"> 22:00 16.6.2019 </span></span>
            <span> Edit by <span className="bolder"> Natalia Tyulina </span> at <span className="bolder"> 22:00 16.6.2019 </span></span>
            <span> Status changed by <span className="bolder"> Natalia Tyulina </span> at <span className="bolder"> 22:00 16.6.2019 </span></span>
          </div>
        </div>

        <hr />

        <div className="item-attributes">
          {
            item.attributes.map((attribute, index) =>
            {
              if ( index % 2 === 0 ) {
                return (
                  <div className="row">
                    <div key={attribute.label} className="entry">
                      <label>{attribute.label}</label>
                      <label className="value">{attribute.value}</label>
                    </div>
                    {
                      index < item.attributes.length - 1 &&
                      <div key={item.attributes[index + 1].label} className="entry">
                        <label>{item.attributes[index + 1].label}</label>
                        <label className="value">{item.attributes[index + 1].value}</label>
                      </div>
                    }
                  </div>
                )
              }
            }
          )
        }
      </div>

      <div className="m-t-10">
        <label>Description</label>
        <div className="row">
          <div className="description">
            <div dangerouslySetInnerHTML={{__html: item.description.length === 0 ? "No description" : item.description.replace(/(?:\r\n|\r|\n)/g, '<br>') }}></div>
          </div>
          <div className="description-yellow">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>NIC</th>
            <th>IP</th>
            <th>Mask</th>
            <th>Gateway</th>
            <th>DNS</th>
            <th>VLAN</th>
            <th colSpan={2}>Note</th>
          </tr>
        </thead>
        <tbody>
          { item.ips.map((ip, index)=>
            <tr key={ip.id}>
              <td>{ip.NIC}</td>
              <td>{ip.IP}</td>
              <td>{ip.mask}</td>
              <td>{ip.gateway}</td>
              <td>{ip.DNS1}</td>
              <td>{ip.VLAN}</td>
              <td>{ip.note}</td>
              <td width="30px">
                <button type="button" className="btn-link" onClick={() => {}}>
                  <i
                    className="fas fa-times"
                    />
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <table className="table">
        <thead>
          <tr>
            <th>Passwords</th>
            <th>Login</th>
            <th>Password</th>
            <th>IP/URL</th>
            <th colSpan={2}>Note</th>
          </tr>
        </thead>
        <tbody>
          {
            item.passwords?.map((password,index)=> (
              <tr key={password.id}>
                <td>{password.title}</td>
                <td>{password.login}</td>
                <td>{password.password}</td>
                <td>{password.IP}</td>
                <td>{password.note}</td>
                <th key="action" width="30px">
                  <button type="button" className="btn-link" onClick={() => {}}>
                    <i
                      className="fas fa-times"
                      />
                  </button>
                </th>
              </tr>
            ))
          }
        </tbody>
      </table>

      <div className="m-b-20">
        <label>Backup tasks Description</label>
        <div className="row">
        <div className="description">
          <div>
            {item.backupsDescription ? item.backupsDescription : "No backup tasks description Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis."}
          </div>
        </div>
        <div className="description-yellow">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
        </div>
      </div>
      </div>

      <div className="">
        <label>Monitoring Description</label>
        <div className="row">
        <div className="description">
          <div>
            {item.monitoringDescription ? item.monitoringDescription : "No monitoring description Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis."}
          </div>
        </div>
        <div className="description-yellow">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
        </div>
      </div>
      </div>

    <Comments
      id={1}
      isMulti
      users={users}
      userRights={usersWithRights}
      submitComment={() => {}}
      submitEmail={() => {}}
      />

  </div>
  </div>
  );
}
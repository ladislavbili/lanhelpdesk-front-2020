import React from 'react';
import Search from './search';
import MultiSelect from 'components/MultiSelectNew';
import classnames from "classnames";

export default function ListHeader( props ) {
  const {
    useVisibility,
    setVisibility,
    displayValues: allDisplayValues,
    orderByValues,
    link,
    layout,
    orderBy,
    setOrderBy,
    ascending,
    setAscending,
  } = props;

  const displayValues = allDisplayValues
    .filter( ( displayValue ) => displayValue.type !== 'checkbox' )
    .map( ( displayValue ) => ( {
      ...displayValue,
      id: displayValue.value
    } ) );

  const [ popoverOpen, setPopoverOpen ] = React.useState( false );
  const toggle = () => setPopoverOpen( !popoverOpen );

  return (
    <div className={classnames("d-flex", "h-60px", "flex-row")}>
      <Search {...props}/>

      <div className="ml-auto p-2 align-self-center">
        <div className="d-flex flex-row">
          <div
            className={classnames(
              {
                "m-r-22": (
                  link.includes("settings")
                  || (link.includes("lanwiki") && layout === 1)
                  || (link.includes("passmanager") && layout === 1)
                  || (link.includes("expenditures") && layout === 1)
                ),
                "m-r-5": (
                  (link.includes("passmanager") && layout === 0)
                  || (link.includes("expenditures") && layout === 0)
                  || (link.includes("lanwiki") && layout === 0)
                )
              },
              "d-flex", "flex-row", "align-items-center", "ml-auto"
            )}
            >

            <div className="text-basic m-r-5 m-l-5">
              Sort by
            </div>

            <select
              value={orderBy}
              className="invisible-select text-bold text-highlight"
              onChange={(e)=>setOrderBy(e.target.value)}>
              { orderByValues.map((item,index) =>
                <option value={item.value} key={index}>{item.label}</option>
              ) }
            </select>

            { !ascending &&
              <button type="button" className="btn-link" onClick={()=>setAscending(true)}>
                <i className="fas fa-arrow-up" />
              </button>
            }

            { ascending &&
              <button type="button" className="btn-link" onClick={()=>setAscending(false)}>
                <i className="fas fa-arrow-down" />
              </button>
            }

            { useVisibility &&
              <div className="row">
                <button className="btn-link m-l-10" onClick={ toggle } >
                  <i className="fa fa-cog" />
                </button>
                <MultiSelect
                  className="center-hor"
                  menuClassName="m-t-30"
                  bodyClassName="p-l-10 p-r-10 scrollable"
                  bodyStyle={{ maxHeight: 300 }}
                  direction="left"
                  style={{}}
                  header="Select task list columns"
                  closeMultiSelect={toggle}
                  showFilter={false}
                  open={popoverOpen}
                  items={displayValues}
                  selected={displayValues.filter((displayValue) => displayValue.show )}
                  onChange={(_, item, deleted ) => {
                    let newVisibility = {};
                    displayValues.forEach((displayValue) => {
                      if(displayValue.id !== item.id){
                        newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value ] = displayValue.show;
                      }else{
                        newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value] = !deleted;
                      }
                    })
                    setVisibility(newVisibility);
                  }}
                  />
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export default function CompanyRents( props ) {
  //data
  const {
    data,
    disabled,
    addRent,
    updateRent,
    removeRent
  } = props;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ quantity, setQuantity ] = React.useState( 1 );
  const [ unitCost, setUnitCost ] = React.useState( 0 );
  const [ unitPrice, setUnitPrice ] = React.useState( 0 );
  const [ totalPrice, setTotalPrice ] = React.useState( 0 );

  return (
    <div className="row m-t-20">
      <div className="col-md-12">
        <div>
          <h4>Prenájom Hardware & Software </h4>
          <table className="table m-t--30">
            <thead>
              <tr>
                <th>Názov</th>
                <th>Mn.</th>
                <th>Náklad/ks/mesiac</th>
                <th>Cena/ks/mesiac</th>
                <th>Cena/mesiac</th>
              </tr>
            </thead>
            <tbody>
              { data.map((rent) =>
                <tr key={rent.id}>
                  <td>
                    <input
                      disabled={disabled}
                      className="form-control hidden-input"
                      value={rent.title}
                      onChange={e =>{
                        updateRent({...rent,title:e.target.value});
                      }}
                      />
                  </td>
                  <td>
                    <input
                      disabled={disabled}
                      type="number"
                      className="form-control hidden-input"
                      value={rent.quantity}
                      onChange={(e)=>{
                        if(isNaN(parseInt(e.target.value))||isNaN(parseFloat(rent.unitPrice))){
                          updateRent({...rent, quantity:e.target.value,totalPrice:0 });
                        }else{
                          updateRent({...rent, quantity:e.target.value,totalPrice:parseFloat(rent.unitPrice)*parseInt(e.target.value) });
                        }
                      }}
                      />
                  </td>
                  <td>
                    <input
                      disabled={disabled}
                      type="number"
                      className="form-control hidden-input"
                      value={rent.unitCost}
                      onChange={(e)=>{
                        if(isNaN(parseFloat(e.target.value))||isNaN(parseFloat(rent.unitPrice))){
                          updateRent({...rent, unitCost:e.target.value });
                        }else if(parseFloat(e.target.value)>parseFloat(rent.unitPrice)){
                          if(isNaN(parseInt(rent.quantity))){
                            updateRent({...rent, unitCost:e.target.value,unitPrice:e.target.value });
                          }else{
                            updateRent({...rent, unitCost:e.target.value,unitPrice:e.target.value,totalPrice:parseInt(rent.quantity)*parseFloat(e.target.value) });
                          }
                        }else{
                          updateRent({...rent, unitCost:e.target.value });
                        }
                      }}
                      />
                  </td>
                  <td>
                    <input
                      disabled={disabled}
                      type="number"
                      className="form-control hidden-input"
                      value={rent.unitPrice}
                      onChange={(e)=>{
                        if(isNaN(parseFloat(e.target.value))||isNaN(parseInt(rent.quantity))){
                          updateRent({...rent, unitPrice:e.target.value });
                        }else{
                          updateRent({...rent, unitPrice:e.target.value, totalPrice:parseInt(rent.quantity)*parseFloat(e.target.value) });
                        }
                      }}
                      />
                  </td>
                  <td>
                    <input
                      disabled={disabled||isNaN(rent.quantity)||parseInt(rent.quantity) <= 0}
                      type="number"
                      className="form-control hidden-input"
                      value={rent.totalPrice}
                      onChange={(e)=>{
                        if(isNaN(parseFloat(e.target.value))){
                          updateRent({...rent, totalPrice:e.target.value});
                        }else{
                          updateRent({...rent, totalPrice:e.target.value,unitPrice:parseFloat(e.target.value)/parseInt(rent.quantity) });
                        }
                      }}
                      />
                  </td>

                  <td className="t-a-r">
                    <button className="btn-link"
                      disabled={disabled}
                      onClick={()=>{
                        if(window.confirm('Are you sure?')){
                          removeRent(rent);
                        }
                      }}>
                      <i className="fa fa-times" />
                    </button>
                  </td>

                </tr>
              )}

              <tr>
                <td>
                  <input
                    disabled={disabled}
                    type="text"
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    />
                </td>
                <td>
                  <input
                    disabled={disabled}
                    type="number"
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    value={quantity}
                    onChange={(e)=>{
                      if(isNaN(parseInt(e.target.value))||isNaN(parseFloat(unitPrice))){
                        setQuantity(e.target.value)
                        setTotalPrice(0);
                      }else{
                        setQuantity(e.target.value)
                        setTotalPrice(parseFloat(unitPrice)*parseInt(e.target.value));
                      }
                    }}
                    />
                </td>
                <td>
                  <input
                    disabled={disabled}
                    type="number"
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    value={unitCost}
                    onChange={(e)=>{
                      if(isNaN(parseFloat(e.target.value))||isNaN(parseFloat(unitPrice))){
                        setUnitCost(e.target.value);
                      }else if(parseFloat(e.target.value)>parseFloat(unitPrice)){
                        if(isNaN(parseInt(quantity))){
                          setUnitCost(e.target.value);
                          setUnitPrice(e.target.value);
                        }else{
                          setUnitCost(e.target.value);
                          setUnitPrice(e.target.value);
                          setTotalPrice(parseInt(quantity)*parseFloat(e.target.value));
                        }
                      }else{
                        setUnitCost(e.target.value);
                      }
                    }}
                    />
                </td>
                <td>
                  <input
                    disabled={disabled}
                    type="number"
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    value={unitPrice}
                    onChange={(e)=>{
                      if(isNaN(parseFloat(e.target.value))||isNaN(parseInt(quantity))){
                        setUnitPrice(e.target.value);
                      }else{
                        setUnitPrice(e.target.value);
                        setTotalPrice(parseInt(quantity)*parseFloat(e.target.value) );
                      }
                    }}
                    />
                </td>
                <td>
                  <input
                    disabled={disabled||isNaN(quantity)||parseInt(quantity) <= 0}
                    type="number"
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    value={totalPrice}
                    onChange={(e)=>{
                      if(isNaN(parseFloat(e.target.value))){
                        setTotalPrice(e.target.value);
                      }else{
                        setTotalPrice(e.target.value);
                        setUnitPrice(parseFloat(e.target.value)/parseInt(quantity));
                      }
                    }}
                    />
                </td>
                <td className="t-a-r">
                  <button className="btn-link"
                    disabled={
                      disabled||
                      title===''||
                      isNaN(parseInt(quantity))||
                      isNaN(parseInt(unitCost))||
                      isNaN(parseInt(unitPrice))||
                      isNaN(parseInt(totalPrice))||
                      parseInt(quantity) < 0||
                      parseInt(unitCost) < 0||
                      parseInt(unitPrice) < 0||
                      parseInt(totalPrice) < 0
                    }
                    onClick={()=>{
                      let body={
                        title:title,
                        quantity:quantity,
                        unitCost:unitCost,
                        unitPrice:unitPrice,
                        totalPrice:totalPrice,
                      }
                      setTitle("");
                      setQuantity(1);
                      setUnitCost(0);
                      setUnitPrice(0);
                      setTotalPrice(0);
                      addRent(body);
                    }}
                    >
                    <i className="fa fa-plus" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row justify-content-end">
          <div className="col-md-6">
            <p className="text-right">
              <b>Sub-total:</b>
              {(data.map( (rent) => parseFloat(rent.totalPrice)).reduce((acc, cur) => {
                if(!isNaN(cur)){
                  return acc+parseInt(cur);
                }
                return acc;
              }, 0 )).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
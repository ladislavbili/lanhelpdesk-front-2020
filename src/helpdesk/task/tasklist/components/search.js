import React from 'react';
import classnames from "classnames";
import {
  Button,
  PopoverBody,
  Popover,
  Input,
  Label,
  FormGroup,
} from 'reactstrap';
import Loading from 'components/loading';
import DatePicker from 'components/DatePicker';
import {
  dashboard,
  allMilestones,
} from 'configs/constants/sidebar';
import {
  translateSelectItem,
  translateAllSelectItems,
} from "helperFunctions";
import {
  useTranslation
} from "react-i18next";
import {
  allFilterAttributes,
  defaultTasksAttributesFilter,
} from 'configs/constants/tasks';

export default function Search( props ) {
  const {
    link,
    history,
    loading,
    localProject,
    taskSearch,
    setLocalProject,
    setLocalMilestone,
    setLocalTaskSearch,
    setGlobalTaskSearch,
    localStringFilter,
    setGlobalTaskStringFilter,
    setSingleLocalTaskStringFilter,
    setLocalTaskStringFilter,
    currentUser,
  } = props;

  const {
    t
  } = useTranslation();

  //state
  const [ stringFilterOpen, setStringFilterOpen ] = React.useState( false );
  const [ searchFocused, setSearchFocused ] = React.useState( false );
  const [ originalOpenedFilter, setOriginalOpenedFilter ] = React.useState( null );

  React.useEffect( () => {
    if ( stringFilterOpen ) {
      setOriginalOpenedFilter( localStringFilter );
    }
  }, [ stringFilterOpen ] );

  const userRights = localProject.id === null ? null : localProject.right;
  const configurableStringFilters = translateAllSelectItems( allFilterAttributes, t )
    .filter( ( filterAttribute ) => filterAttribute.right === null || userRights === null || userRights[ filterAttribute.right ] || currentUser.role.level === 0 );

  return (
    <div
      className={classnames( "d-flex h-60 flex-row m-l-30 m-r-30 sticky", "search-row" )}
      >
      <div id="global-search" className={classnames("search", { "search-focused": searchFocused })}>
        <button className="btn btn-link search-btn">
          <i className={`fa fa-${loading ? 'spinner' : 'search'} flip`} />
        </button>
        <input
          type="text"
          className="form-control search-text"
          value={taskSearch}
          onChange={(e)=>setLocalTaskSearch(e.target.value)}
          onFocus={() => setSearchFocused( true ) }
          onBlur={() => setSearchFocused( false ) }
          onKeyPress={(e)=>{
            if( e.key === 'Enter' && !loading ){
              setGlobalTaskSearch()
            }
          }}
          placeholder={t('searchInIDAndTaskTitle')}
          />
        { configurableStringFilters.length > 0 &&
          <button className="btn btn-link search-btn p-l-5 p-r-5" onClick={() => setStringFilterOpen(!stringFilterOpen) }>
            <i className={`fa fa-${stringFilterOpen ? 'chevron-down' :  'chevron-up'}`} />
          </button>
        }
        <button className="btn btn-link search-btn p-l-5 p-r-5" onClick={() => setLocalTaskSearch("") }>
          <i className={`fa fa-times`} />
        </button>
      </div>
      <Button
        disabled={loading}
        className="btn center-hor m-l-0"
        onClick={() =>{
          setGlobalTaskSearch();
          return;
          //clear and search
          setLocalMilestone(allMilestones);
          setLocalProject(dashboard);
          setGlobalTaskSearch();
          history.push(`/helpdesk/taskList/i/all`)
        }}
        >
        {t('search')}
      </Button>
      <Popover
        placement="bottom-start"
        className="search-popover"
        isOpen={configurableStringFilters.length > 0 && stringFilterOpen}
        target="global-search"
        >
        <PopoverBody>
          <div className="p-20 full-width">
            { configurableStringFilters.map((filterAttribute) => {
              if(['createdAt','startsAt','deadline'].includes(filterAttribute.value)){
                return (
                  <FormGroup className="m-b-10" key={filterAttribute.value}>
                    <Label for={filterAttribute.label}>{filterAttribute.label}</Label>
                    <div>
                      <DatePicker
                        className="form-control full-width"
                        wrapperClassName="full-width"
                        selected={localStringFilter[filterAttribute.value]}
                        hideTime
                        isClearable
                        placeholderText={`${t('select')} ${filterAttribute.label.toLowerCase()}`}
                        onChange={date => {
                          setSingleLocalTaskStringFilter(filterAttribute.value, isNaN(date.valueOf()) ? null : date);
                        }}
                        />
                    </div>
                  </FormGroup>
                )
              }else{
                return (
                  <FormGroup className="m-b-10" key={filterAttribute.value}>
                    <Label for={filterAttribute.label}>{filterAttribute.label}</Label>
                    <Input
                      id={filterAttribute.label}
                      type="text"
                      placeholder={`${t('enter')} ${filterAttribute.label.toLowerCase()}`}
                      value={localStringFilter[filterAttribute.value]}
                      onChange={(e)=>{
                        setSingleLocalTaskStringFilter(filterAttribute.value, e.target.value)
                      }}
                      />
                  </FormGroup>
                )
              }
            })}
            <div className="m-t-20 row">
              <Button
                disabled={loading}
                className="btn btn-red center-hor"
                onClick={() =>{
                  setStringFilterOpen(!stringFilterOpen);
                  if(originalOpenedFilter !== null){
                    setLocalTaskStringFilter( originalOpenedFilter );
                  }
                }}
                >
                {t('cancel')}
              </Button>
              <Button
                disabled={loading}
                className="btn btn-link center-hor ml-auto"
                onClick={() => setLocalTaskStringFilter( defaultTasksAttributesFilter ) }
                >
                {t('clear')}
              </Button>
              <Button
                disabled={loading}
                className="btn m-l-10 center-hor"
                onClick={ () => {
                  setGlobalTaskStringFilter();
                  setStringFilterOpen(!stringFilterOpen);
                }}
                >
                {t('search')}
              </Button>
            </div>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
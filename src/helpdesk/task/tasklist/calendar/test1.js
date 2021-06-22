//const [ events, setEvents ] = React.useState( [] );
//const [ changes, setChanges ] = React.useState( [] );

/*
  React.useEffect( () => {
    const newScheduledEvents = scheduledEvents.map( expandScheduledEvent )

    const newRepeatEvents = repeatEvents.map( expandRepeatEvent )

    const newRepeatTimeEvents = repeatTimeEvents.map( expandRepeatTimeEvent )
    if ( changes.length === 0 ) {
      setEvents( [ ...newScheduledEvents, ...newRepeatEvents, ...newRepeatTimeEvents ] );
    }
    if ( changes.some( ( change ) => {
        if ( change.action === 'add' ) {
          return newScheduledEvents.length > events.filter( ( event ) => event.type === change.type )
            .length;
        }
        return false;
      } ) ) {
      setChanges( [] );
      setEvents( [ ...newScheduledEvents, ...newRepeatEvents, ...newRepeatTimeEvents ] );
    }
  }, [ repeatEvents, scheduledEvents, repeatTimeEvents ] );
*/

/*
setEvents( [ ...events, expandScheduledEvent( createEventFromScheduled( {
  fake: true,
  task: draggedTask.task,
  from: start.valueOf()
    .toString(),
  to: end.valueOf()
    .toString(),
  canEdit: false,
} ) ) ] );
setChanges( [ ...changes, {
  action: 'add',
  type: 'scheduled'
} ] )
*/

//  setEvents( events.filter( ( event ) => !event.fake ) )
import React from 'react';
import TimeAgo from 'react-timeago';
import ShowData from 'components/showData';
import NoteEdit from './NoteEdit';
import NoteEmpty from './noteEmpty';
import moment from 'moment';

export default function List( props ) {

  const {
    match,
    layout,
    setLayout
  } = props;

  const notes = [];
  const tags = [
    {
      title: "Tag 1",
      id: 1
    }, {
      title: "Tag 2",
      id: 2
    }, {
      title: "Tag 3",
      id: 3
    },
  ];

  const orderBy = [];
  const setWikiOrderBy = [];
  const ascending = [];
  const setWikiAscending = false;

  const [ listName, setListName ] = React.useState( "HI" );
  const [ filterName, setFilterName ] = React.useState( "DEMO" );

  const createNewNote = () => {
    /*  rebase.addToCollection('lanwiki-notes',
      {name: "Untitled",
        tags: (this.props.match.params.listID !== "all" ? [this.props.match.params.listID] : []),
        body: "",
        lastUpdated: Date().getTime(),
        dateCreated: Date().getTime()
      })
      .then((note) => {
        this.props.history.push(`/lanwiki/${this.props.match.params.listID}/${note.id}`);
      });*/
  }

  const getFilterName = ( id ) => {
    if ( !id ) {
      setFilterName( "" );
      return;
    } else if ( id === 'all' ) {
      setFilterName( "All" );
      return;
    }
    let tag = tags.find( ( item ) => item.id === id );
    if ( tag ) {
      setFilterName( tag.name ? tag.name : tag.title );
    } else {
      setFilterName( 'Unknown tag' );
    }
  }

  let link = '';
  if ( match.params.hasOwnProperty( 'listID' ) ) {
    link = '/lanwiki/i/' + match.params.listID;
  } else {
    link = '/lanwiki/i/all';
  }

  return (
      <ShowData
			layout={2}
			setLayout={setLayout}
			data={
				notes.map((note) => ({
					...note,
					tags:tags.filter((item)=>note.tags.includes(item.id))
				})).filter((item) => item.tags.some((item) => match.params.listID === 'all' || !match.params.listID || item.id === parseInt(match.params.listID)))
			}
			displayCol={(note)=>
				(<li>
					<div className="taskCol-body">
						<p className="pull-right m-t-5">
							<span>
								<span className="attribute-label">
                  Updated:
                </span>
							</span>
						</p>
						<p>
							<span>
								<div className="taskCol-title">
									<span>{note.title}</span>
								</div>
							</span>
						</p>
					</div>
          <div className = "taskCol-tags" >
            {	note.tags.map( ( tag ) => (
              <span key={tag.id} className="label label-info m-r-5">
                {tag.title}
              </span>
            ))}
          </div>
				</li>)
			}
			filterBy={  [
				{
					value: 'title',
					type: 'text'
				}, {
          value: 'dateCreated',
          label: 'Created at',
          type: 'date'
        }, {
          value: 'lastUpdated',
          label: 'Updated at',
          type: 'date'
        },
			] }
			filterName="lanwiki-notes"
			displayValues={  [
				{
					value: 'title',
					label: 'Title',
					type: 'text'
				}, {
          value: 'dateCreated',
          label: 'Created at',
          type: 'date'
        }, {
          value: 'lastUpdated',
          label: 'Updated at',
          type: 'date'
        },
			] }
			orderByValues={[     {
				value: 'title',
				label: 'Title',
				type: 'text'
			}, {
        value: 'dateCreated',
        label: 'Created at',
        type: 'date'
      }, {
        value: 'lastUpdated',
        label: 'Updated at',
        type: 'date'
      },
		] }
		link={ link }
		history={ history }
		orderBy={ orderBy }
		setOrderBy={ setWikiOrderBy }
		ascending={ ascending }
		setAscending={ setWikiAscending }
		itemID={ match.params.noteID }
		listID={ match.params.listID }
		listName={ filterName }
		match={ match }
		edit={ NoteEdit }
		empty={ NoteEmpty }
		/>
);
}

/*
displayValues={  [
  {
    value: 'title',
    label: 'Title',
    type: 'text'
  }, {
    value: 'dateCreated',
    label: 'Created at',
    type: 'date'
  }, {
    value: 'lastUpdated',
    label: 'Updated at',
    type: 'date'
  },
] }
orderByValues={[     {
  value: 'title',
  label: 'Title',
  type: 'text'
}, {
  value: 'dateCreated',
  label: 'Created at',
  type: 'date'
}, {
  value: 'lastUpdated',
  label: 'Updated at',
  type: 'date'
},
] }
*/
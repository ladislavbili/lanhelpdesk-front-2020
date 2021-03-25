import React from 'react';
import moment from 'moment';

export const layout = 0;

export const notes = [
  {
    id: 1,
    title: "NOTE TITLE",
    name: "NOTE NAME",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    dateCreated: moment(),
    dateUpdated: moment(),
    tags: [ 1, 2 ],
    status: {
      color: "#007b99",
      id: 45
    }
},
  {
    id: 2,
    title: "NOTE TITLE",
    name: "NOTE NAME",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    dateCreated: moment(),
    dateUpdated: moment(),
    tags: [ 1, 3 ],
    status: {
      color: "#007b99",
      id: 45
    }
},
  {
    id: 3,
    title: "NOTE TITLE",
    name: "NOTE NAME",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    dateCreated: moment(),
    dateUpdated: moment(),
    tags: [ 3 ],
    status: {
      color: "#007b99",
      id: 45
    }
}
];

export const tags = [
  {
    title: "Tag 1",
    label: "Tag 1",
    value: 1,
    id: 1,
    color: "#007b99",
    }, {
    title: "Tag 2",
    label: "Tag 2",
    value: 2,
    id: 2,
    color: "#00365A",
    }, {
    title: "Tag 3",
    label: "Tag 3",
    value: 3,
    id: 3,
    color: "#00A49F",
    },
  ];


export const users = [
  {
    email: "senk@test.sk",
    username: "SONKA",
    id: 2
  }, {
    email: "customer@test.sk",
    username: "Mr. Customer",
    id: 1
  }
];

export const usersWithRights = [
  {
    email: "senk@test.sk",
    username: "SONKA",
    id: 2,
    rights: {
      admin: false,
      edit: true,
      view: true
    }
  }
];
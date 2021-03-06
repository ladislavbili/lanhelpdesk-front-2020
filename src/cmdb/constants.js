import React from 'react';
import moment from 'moment';

import {
  dashboard,
  addCompany,
} from 'configs/constants/sidebar';

export const itemCategories = [
  {
    id: 2,
    title: "Schema"
	},
  {
    id: 3,
    title: "Servers"
	},
  {
    id: 4,
    title: "Web pages"
	},
  {
    id: 5,
    title: "Routers"
	},
];

export const exampleItem = {
  id: 1,
  title: "ts01.aston.local",
  type: "Server",
  func: "Terminal Server",
  status: "Active",
  ips: [
    {
      id: 1,
      NIC: "eth0",
      IP: "192.159.0.2",
      mask: "255.255.255.0",
      gateway: "192.159.0.252",
      DNS1: "8.8.8.8",
      DNS2: "7.7.7.7",
      VLAN: "vlan",
      note: "note note"
    },
    {
      id: 2,
      NIC: "eth0",
      IP: "192.159.0.2",
      mask: "255.255.255.0",
      gateway: "192.159.0.252",
      DNS1: "8.8.8.8",
      DNS2: "7.7.7.7",
      VLAN: "vlan",
      note: "note note"
      }
  ],
  passwords: [
    {
      id: 1,
      title: "SSH LOGIN",
      login: "root",
      password: "passwords",
      IP: "192.159.0.252",
      note: "note note"
      },
    {
      id: 2,
      title: "SSH LOGIN",
      login: "root",
      password: "passwords",
      IP: "192.159.0.252",
      note: "note note"
        }
    ],
  location: "Bratislava",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  backupTasksDescription: {
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    textHeight: 29,
  },
  monitoringTasksDescription: {
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    textHeight: 29,
  },
  attributes: [
    {
      label: "Status",
      value: "Active",
      type: {
        id: 'select',
      },
      options: [
        {
          value: 0,
          label: "Inactive"
        },
        {
          value: 1,
          label: "Active"
        },
      ]
    },
    {
      label: "Umiestnenie",
      value: "",
      type: {
        id: 'input',
      }
      },
    {
      label: "Item type",
      value: "Servery",
      type: {
        id: 'textarea',
      }
    },
    {
      label: "Dátum inštalácie",
      value: "",
      type: {
        id: 'input',
      }
    },
    {
      label: "Item connection",
      value: "xen01.lansystems.sk",
      type: {
        id: 'input',
      }
    },
    {
      label: "Záruka do",
      value: "",
      type: {
        id: 'input',
      }
    },
    {
      label: "Firma",
      value: "Aston Esquire",
      type: {
        id: 'input',
      }
    },
  ]

};

export const items = [
  {
    id: 1,
    title: "ts01.aston.local",
    type: "Server",
    func: "Terminal Server",
    status: "Active",
    ip: [ "eth0 192.159.0.2", "eth0 192.159.0.2", "eth0 192.159.0.2" ],
    location: "Bratislava",
    attributes: [
      {
        label: "Status",
        value: "Active",
      },
      {
        label: "Umiestnenie",
        value: "",
        },
      {
        label: "Item type",
        value: "Servery",
      },
      {
        label: "Dátum inštalácie",
        value: "",
      },
      {
        label: "Item connection",
        value: "xen01.lansystems.sk",
      },
      {
        label: "Záruka do",
        value: "",
      },
      {
        label: "Firma",
        value: "Aston Esquire",
      },
    ]
	},
  {
    id: 2,
    title: "ts02.aston.local",
    type: "Server",
    func: "Terminal Server 2",
    status: "Active",
    ip: [ "eth0 192.159.0.1" ],
    location: "Bratislava"
  },
];

export const companies = [
		dashboard,
		addCompany,
  {
    id: 1,
    title: 'LanHelpdesk',
    label: 'LanHelpdesk',
    value: 1
	}
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
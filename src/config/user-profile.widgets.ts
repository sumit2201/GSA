import * as Constants from "../app/common/constants";
import { REST_API_URLS } from "../app/common/api-urls";
import { STATICWIDGETS } from "./static-widget-info";
export const USERPROFILEWIDGETS = {};

USERPROFILEWIDGETS["ABOUT"] = {
  name: "keyValue",
  title: "User profile info",
  dataProvider: {
    title: "Userprofile info",
    type: "REST",
    url: "",
    method: "get",
    dev_url: REST_API_URLS.USER_LIST,
    parameters: [
      {
        id: "userId",
        isMendatory: true,
        source: "route",
        sourceValue: "userId"
      }
    ]
  },
  widgetConfig: {
    showHeader: false,
    customClass: "user-about-widget",
  },
  metaType: "user"
};

USERPROFILEWIDGETS["MYTEAMS"] = {
  name: "richTable",
  title: "My team info",
  dataProvider: {
    title: "My team info",
    type: "REST",
    url: "",
    method: "get",
    dev_url: REST_API_URLS.TEAM_LIST,
    parameters: [
      {
        id: "memberid",
        isMendatory: true,
        source: "route",
        sourceValue: "userId"
      },
      {
        "id": "pagingInfo",
        "isMendatory": false
      },
    ]
  },
  widgetConfig: {
    showHeader: false,
  },
  metaType: "my-team"
};


USERPROFILEWIDGETS["TEAMLIST"] = {
  name: "Teams",
  title: "Teams",
  dataProvider: {
    "title": "Teams",
    "type": "rest",
    "method": "get",
    "url": "",
    "dev_url": REST_API_URLS.TEAM_LIST,
    "parameters": [
      {
        "id": "userId",
        "isMendatory": false
      },
      {
        "id": "pagingInfo",
        "isMendatory": false
      },
      {
        id: "team_name",
        isMendatory: false,
      },
      {
        id: "team_email",
        isMendatory: false,
      },
      {
        id: "sportId",
        isMendatory: false,
      },
      {
        id: "state",
        isMendatory: false,
      },
      {
        id: "agegroup",
        isMendatory: false,
      },
      {
        id: "classification",
        isMendatory: false,
      },
      {
        id: "tournamentId",
        isMendatory: false,
      },
    ]
  },
  widgetConfig: {
    showHeader: false,
  },
  "metaType": "team-contact"
};

USERPROFILEWIDGETS["TEAMLISTFILTER"] = {
  name: "form",
  title: "Teams",
  dataProvider: {
    type: "INLINE",
    data: {
      schema: {
        title: "Teams",
        rows: [
          {
            fields: [
              {
                id: "sportId",
                title: "Sport",
                type: "dropdown",
                dependencyInfo: [
                  {
                    fieldId: "agegroup",
                    type: "dataReload"
                  },
                  {
                    fieldId: "classification",
                    type: "dataReload"
                  }],
                dataProvider: {
                  "title": "showSports",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url": REST_API_URLS.LOADALLSPORTS,
                  "parameters": [
                    {
                      "id": "userId",
                      "isMendatory": false,
                      "source": "system",
                    }],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "sportId"
                  },
                }
              },
              {
                id: "state",
                title: "State",
                type: "dropdown",
                dataProvider: {
                  "title": "showStates",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url":REST_API_URLS.LOADALLSTATES,
                  "parameters": [
                    {
                      "id": "userId",
                      "isMendatory": false,
                      "source": "system",
                    }],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "state"
                  },
                }
              },
              {
                id: "agegroup",
                title: "Agegroup",
                type: "dropdown",
                dataProvider: {
                  "title": "showAgegroups",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url": REST_API_URLS.LOADALLAGEGROUPOFSPORT,
                  "parameters": [
                    {
                      "id": "sportId",
                      "isMendatory": true,
                    },
                    {
                      "id": "columnToFetch",
                      "isMendatory": true,
                      "type": "inline",
                      "default": ["id, agegroup as title"]
                    }
                  ],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "agegroup"
                  },
                }
              },
              {
                id: "classification",
                title: "Classification",
                type: "dropdown",
                dataProvider: {
                  "title": "showClassification",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url": REST_API_URLS.loadAllClassificationOfSport,
                  "parameters": [
                    {
                      "id": "sportId",
                      "isMendatory": true
                    }],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "classification"
                  },
                }
              },
            ]
          },
          {
            fields: [
              {
                id: "team_name",
                title: "Name",
                type: "text"
              },
              {

                id: "team_email",
                title: "Email",
                type: "text"
              },
              {
                id: "primary",
                title: "Contact No.",
                type: "text"
              },
            ]
          },
          {
            fields: [
              {
                id: "tournamentId",
                title: "Tournament Teams",
                type: "dropdown",
                dataProvider: {
                  "title": "showTournaments",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url": REST_API_URLS.TURNAMENT_OPTIONS,
                  "parameters": [
                    {
                      "id": "directorId",
                      "isMendatory": true,
                      "source": "route",
                      "sourceValue": "userId",
                    }
                  ],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "tournamentId"
                  },
                }
              }
            ]
          }

        ],
        actions: [
          {
            title: "Filter teams",
            id: "fetchteams",
            type: "local",
            responseHandler: {
              type: "widgetLoad",
              widgetInfoList: [
                {
                  widget: USERPROFILEWIDGETS["TEAMLIST"],
                  dataAction: "fillParameterDefault",
                }
              ]
            }
          },
          {
            title: "Send SMS",
            id: "fetchteams",
            type: "local",
            responseHandler: {
              type: "widgetLoad",
              widgetInfoList: [
                {
                  widget: USERPROFILEWIDGETS["TEAMLIST"],
                  dataAction: "fillParameterDefault",
                }
              ]
            }
          },
          {
            title: "Send Email",
            id: "fetchteams",
            type: "local",
            responseHandler: {
              type: "widgetLoad",
              widgetInfoList: [
                {
                  widget: USERPROFILEWIDGETS["TEAMLIST"],
                  dataAction: "fillParameterDefault",
                }
              ]
            }
          },
        ]
      },
      formConfig: {
        submitOnLoad: true,
      },
    },
  }
};

USERPROFILEWIDGETS["MYTEAMCONTACT"] = USERPROFILEWIDGETS["TEAMLISTFILTER"]

USERPROFILEWIDGETS["TOURNAMENTLIST"] = {
  name: "Tournaments",
  title: "Tournaments",
  dataProvider: {
    "title": "Tournaments",
    "type": "rest",
    "method": "get",
    "url": "",
    "dev_url": REST_API_URLS.TOURNAMENT_LIST,
    "parameters": [
      {
        "id": "directorId",
        "isMendatory": true,
        source: "route",
        sourceValue: "userId",
      },
      {
        "id": "pagingInfo",
        "isMendatory": false
      },
      {
        id: "sportId",
        isMendatory: false,
      },
      {
        id: "state",
        isMendatory: false,
      },
      {
        id: "start_date",
        isMendatory: false,
      },
      {
        id: "end_date",
        isMendatory: false,
      },
      {
        id: "show_in_front",
        isMendatory: true,
        default: "1"
      }
    ]
  },
  "metaType": "my-tournament",
  widgetConfig: {
    showHeader: false,
  }
};

USERPROFILEWIDGETS["MYTOURNAMENTS"] = {
  name: "form",
  title: "Tournaments",
  dataProvider: {
    type: "INLINE",
    data: {
      schema: {
        title: "Tournaments",
        rows: [
          {
            fields: [
              {
                id: "sportId",
                title: "Sport",
                type: "dropdown",
                dataProvider: {
                  "title": "showSports",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url": REST_API_URLS.LOADALLSPORTS,
                  "parameters": [
                    {
                      "id": "userId",
                      "isMendatory": false,
                      "source": "system",
                    }],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "sportId"
                  },
                }
              },
              {
                id: "state",
                title: "State",
                type: "dropdown",
                dataProvider: {
                  "title": "showStates",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url": REST_API_URLS.LOADALLSTATES,
                  "parameters": [
                    {
                      "id": "userId",
                      "isMendatory": false,
                      "source": "system",
                    }],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "state"
                  },
                }
              }
            ]
          },
          {
            fields: [
              {
                id: "directorid",
                title: "Other director",
                type: "dropdown",
                dataProvider: {
                  "title": "Fetch Directors",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "otherDetails": {
                  },
                }
              },
              {
                id: "start_date",
                title: "Start date",
                type: "date"
              },
              {
                id: "end_date",
                title: "End date",
                type: "date"
              },
            ],
          }
        ],
        actions: [
          {
            title: "Fetch tournaments",
            id: "fetchteams",
            type: "local",
            responseHandler: {
              type: "widgetLoad",
              widgetInfoList: [
                {
                  widget: STATICWIDGETS["TOURNAMENTDETAILLIST"],
                  dataAction: "fillParameterDefault",
                }
              ]
            }
          },
        ]
      },
      formConfig: {
        submitOnLoad: true,
      },
    },
  }
};

USERPROFILEWIDGETS["MESSAGES"] = {
  name: "keyValue",
  title: "User profile info",
  dataProvider: {
    title: "Userprofile info",
    type: "REST",
    url: "",
    method: "get",
    dev_url: REST_API_URLS.USER_LIST,
    parameters: [
      {
        id: "userId",
        isMendatory: true,
        source: "route",
        sourceValue: "userId"
      }
    ]
  },
  widgetConfig: {
    showHeader: false,
  },
  metaType: "user"
};



export const UserProfileAction = {
  "title": "showUser",
  "type": "rest",
  "method": "get",
  "url": "",
  "dev_url":  REST_API_URLS.USERLIST,
  "parameters": [
    {
      "id": "userId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "userId"
    }],
  "transformationType": "RAW"
}


export const UserEditAction = {
  "title": "Edit User",
  "type": "url",
  "url": "edit-user",
  "transformationType": "RAW",
  "parameters": [
    {
      "id": "userId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "userId"
    },
    {
      "id": "isPagingRequired",
      "isMendatory": true,
      "default": false,
    }
  ],
}

export const UserProfileImageUpdateAction = {
  "title": "Edit User Profile",
  "type": "url",
  "url": "edit-user-profile-image",
  "transformationType": "RAW",
  "parameters": [
    {
      "id": "userId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "userId"
    },
    {
      "id": "isPagingRequired",
      "isMendatory": true,
      "default": false,
    }
  ],
}

export const CreateTournamentAction = {
  "title": "Edit User",
  "type": "url",
  "url": "add-tournament",
}

export const UserEditActions = {
  Edit: UserEditAction,
  Tournament: CreateTournamentAction,
  ProfileImage: UserProfileImageUpdateAction,
}
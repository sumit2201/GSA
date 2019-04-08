import * as Constants from "../app/common/constants";
import { REST_API_URLS } from "../app/common/api-urls";
export const TEAMPROFILEWIDGETS = {};


TEAMPROFILEWIDGETS["IMAGE"] = {
  name: "image",
  title: "Team profile picture",
  dataProvider: {
    title: "Team profile picture",
    type: "REST",
    url: "",
    dev_url: REST_API_URLS.TEAM_IMAGE,
    parameters: [{
      id: "teamId",
      isMendatory: true,
      source: "route",
      sourceValue: "teamId"
    }]
  },
  widgetConfig: {
    showHeader: false,
  }
};

TEAMPROFILEWIDGETS["ABOUT"] = {
  name: "keyValue",
  title: "Our info",
  dataProvider: {
    title: "Team profile info",
    type: "REST",
    method: "get",
    url: "",
    dev_url: REST_API_URLS.TEAM_LIST,
    parameters: [
      {
        id: "teamId",
        isMendatory: true,
        source: "route",
        sourceValue: "teamId"
      },
      {
        "id": "isPagingRequired",
        "isMendatory": true,
        "default": false,
      }
    ]
  },
  widgetConfig: {
    showHeader: true,
    customClass: "margin-widget team-about-widget"
  },
  metaType: "team",
};

TEAMPROFILEWIDGETS["TEAMROSTER"] = {
  name: "richTable",
  title: "Roster",
  dataProvider: {
    title: "Team profile info",
    type: "REST",
    method: "get",
    url: "",
    dev_url: REST_API_URLS.TEAM_ROSTER,
    parameters: [
      {
        id: "teamId",
        isMendatory: true,
        source: "route",
        sourceValue: "teamId"
      },
      {
        id: "season_year",
        isMendatory: true
      }
    ]
  },
  widgetConfig: {
    showHeader: false,
    isPlainWidget: true,
  },
  "metaType": "team-roster"
};

TEAMPROFILEWIDGETS["TEAMROSTERFILTER"] = {
  name: "form",
  title: "Roster",
  dataProvider: {
    type: "INLINE",
    data: {
      schema: {
        title: "View Team Roster",
        rows: [
          {
            fields: [
              {
                id: "season_year",
                title: "Year",
                type: "dropdown",
                native: true,
                isNonEmpty: true,
                dataProvider: {
                  "title": "showYears",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url": "http://gsaserver.com/public/loadAllSeasonYear",
                  "parameters": [
                    {
                      "id": "userId",
                      "isMendatory": false,
                      "source": "system",
                    }],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "year"
                  },
                },
                dependencyInfo: [{
                  type: "action",
                  actionInfo: {
                    title: "Filter teams",
                    id: "fetchteamroster",
                    type: "local",
                    responseHandler: {
                      type: "widgetLoad",
                      widgetInfoList: [
                        {
                          widget: TEAMPROFILEWIDGETS["TEAMROSTER"],
                          dataAction: "fillParameterDefault",
                        }
                      ]
                    }
                  },
                }]
              }
            ]
          }
        ]
      },
      formConfig: {
        submitOnLoad: true,
      },
    }
  },
  widgetConfig: {
    showHeader: true,
    showContentInHeader: true,
    customClass: "margin-widget team-roster-widget"
  },
  "metaType": "team-roster"
};

TEAMPROFILEWIDGETS["GALLERY"] = {
  name: "imageGallery",
  title: "Our Gallery",
  dataProvider: {
    title: "Team gallery info",
    type: "REST",
    url: "",
    method: "get",
    dev_url: REST_API_URLS.TEAM_GALLERY,
    parameters: [{
      id: "teamId",
      isMendatory: true,
      source: "route",
      sourceValue: "teamId"
    }],
    transformationType: "RAW",
  },
  widgetConfig: {
    showHeader: false,
  }
};

TEAMPROFILEWIDGETS["TEAMTOURNAMENTRESULT"] = {
  name: "ranking",
  title: "Our Tournament Records",
  dataProvider: {
    title: "Team profile info",
    type: "REST",
    url: "",
    method: "get",
    dev_url: REST_API_URLS.TEAM_TOURNAMENT_RESULT,
    transformationType: "RAW",
    parameters: [
      {
        id: "teamId",
        isMendatory: true,
        source: "route",
        sourceValue: "teamId"
      },
      {
        id: "season_year",
        isMendatory: true
      },
    ]
  },
  widgetConfig: {
    showHeader: false,
    isPlainWidget: true,
  },
  metaType: "team-profile-ranking",
  metaConfig: {
    groupedKey: "team_agegroup",
  }
};

TEAMPROFILEWIDGETS["TEAMTOURNAMENTRESULTFILTER"] = {
  name: "form",
  title: "Our Tournament Records",
  dataProvider: {
    type: "INLINE",
    data: {
      schema: {
        title: "View Team Ranking",
        rows: [
          {
            fields: [
              {
                id: "season_year",
                title: "Year",
                type: "dropdown",
                native: true,
                isNonEmpty: true,
                dataProvider: {
                  "title": "showYears",
                  "type": "rest",
                  "method": "get",
                  "url": "",
                  "dev_url": "http://gsaserver.com/public/loadAllSeasonYear",
                  "parameters": [
                    {
                      "id": "userId",
                      "isMendatory": false,
                      "source": "system",
                    }],
                  "transformationType": "RAW",
                  "otherDetails": {
                    "fieldId": "year"
                  },
                },
                dependencyInfo: [{
                  type: "action",
                  actionInfo: {
                    title: "Filter teams",
                    id: "fetchteamranking",
                    type: "local",
                    responseHandler: {
                      type: "widgetLoad",
                      widgetInfoList: [
                        {
                          widget: TEAMPROFILEWIDGETS["TEAMTOURNAMENTRESULT"],
                          dataAction: "fillParameterDefault",
                        }
                      ]
                    }
                  }
                }
                ]
              }
            ]
          }
        ],
      },
      formConfig: {
        submitOnLoad: true,
      },
    }
  },
  widgetConfig: {
    showHeader: true,
    showContentInHeader: true,
    isPlainWidget: false,
    customClass: "margin-widget team-roster-widget"
  },
};

TEAMPROFILEWIDGETS["TEAMUPCOMINGTOURNAMENTS"] = {
  name: "richTable",
  title: "Our Upcoming Tournament",
  dataProvider: {
    title: "Team profile info",
    type: "REST",
    method: "get",
    url: "",
    dev_url: REST_API_URLS.TOURNAMENT_LIST,
    parameters: [
      {
        id: "teamId",
        isMendatory: true,
        source: "route",
        sourceValue: "teamId"
      },
      {
        "id": "isPagingRequired",
        "isMendatory": true,
        "default": false,
      },
      {
        "id": "onlyUpcoming",
        "isMendatory": true,
        "default": true,
      }
    ]
  },
  widgetConfig: {
    showHeader: true,
  },
  metaType: "tournament"
};

TEAMPROFILEWIDGETS["TABSWIDGET"] = {
  name: "tabs",
  title: "",
  dataProvider: {
    type: "INLINE",
    data: {
      tabs: [
        {
          title: "About",
          rowElementCount: "2",
          widgets: [TEAMPROFILEWIDGETS['ABOUT'], TEAMPROFILEWIDGETS['TEAMROSTERFILTER']]
        },
        {
          title: "Tournaments",
          widgets: [TEAMPROFILEWIDGETS['TEAMTOURNAMENTRESULTFILTER'], TEAMPROFILEWIDGETS['TEAMUPCOMINGTOURNAMENTS']]
        },
        {
          title: "Gallery",
          widgets: [TEAMPROFILEWIDGETS['GALLERY']]
        },
        {
          title: "Messages",
          widgets: [TEAMPROFILEWIDGETS['ABOUT']]
        },
      ]
    }
  }
}

export const TeamProfileAction = {
  "title": "showTeam",
  "type": "rest",
  "method": "get",
  "url": "",
  "dev_url": REST_API_URLS.TEAM_LIST,
  "transformationType": "RAW",
  "parameters": [
    {
      "id": "teamId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "teamId"
    },
    {
      "id": "isPagingRequired",
      "isMendatory": true,
      "default": false,
    },
    {
      "id": "requireOwnership",
      "isMendatory": true,
      "default": true,
    },
    {
      "id": "token",
      "isMendatory": false,
      "source": "system",
      "sourceValue": "token"
    },
  ],
}

export const TeamEditAction = {
  "title": "showTeam",
  "type": "rest",
  "method": "get",
  "url": "",
  "dev_url": REST_API_URLS.TEAM_LIST,
  "transformationType": "RAW",
  "parameters": [
    {
      "id": "teamId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "teamId"
    },
    {
      "id": "isPagingRequired",
      "isMendatory": true,
      "default": false,
    }
  ],
}

export const TeamRosterEditAction = {
  "title": "showTeam",
  "type": "url",
  "url": "add-roster",
  "parameters": [
    {
      "id": "teamId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "teamId"
    }
  ],
}

export const TeamGalleryEditAction = {
  "title": "showTeam",
  "type": "url",
  "url": "update-team-gallery",
  "transformationType": "RAW",
  "parameters": [
    {
      "id": "teamId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "teamId"
    }
  ],
}

export const TeamBannerEditAction = {
  "title": "showTeam",
  "type": "url",
  "url": "add-team-banner",
  "parameters": [
    {
      "id": "teamId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "teamId"
    }
  ],
}

export const TeamEditActions = {
  Edit: TeamEditAction,
  ROSTER: TeamRosterEditAction,
  Gallery: TeamGalleryEditAction,
  Banner: TeamBannerEditAction,
}

import * as Constants from "../app/common/constants";
import { REST_API_URLS } from "../app/common/api-urls";
export const TOURNAMENTPROFILEWIDGETS = {};

TOURNAMENTPROFILEWIDGETS["IMAGE"] = {
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

TOURNAMENTPROFILEWIDGETS["WHOISPLAYING"] = {
  name: "expansionPanel",
  title: "Who is playing",
  dataProvider: {
      title: "Who is playing",
      type: "rest",
      method: "get",
      url: "",
      dev_url: REST_API_URLS.TOURNAMENT_TEAMS,
      parameters: [
          {
              id: "tournamentId",
              isMendatory: true,
              source: "route",
              sourceValue: "tournamentId"
          },
          {
              id: "teamColumnToFetch",
              isMendatory: true,
              default: ["t.name,u.name as coach,a.agegroup"]
          },
          {
              id: "orderBy",
              isMendatory: true,
              default: "a.age asc, tr.registration_time asc"
          }
      ],
      "transformationType": "RAW",
  },
  widgetConfig: {
      showHeader: true,
  }
};

TOURNAMENTPROFILEWIDGETS["FEES"] = {
  name: "richTable",
  title: "Tournament profile info",
  dataProvider: {
    title: "Tournament profile info",
    type: "REST",
    method: "get",
    url: "",
    dev_url: REST_API_URLS.TOURNAMENT_FEES,
    parameters: [
      {
        id: "tournamentId",
        isMendatory: true,
        source: "route",
        sourceValue: "tournamentId"
      }
    ]
  },
  widgetConfig: {
    showHeader: false,
  },
  metaType: "tournament-fees"
};


TOURNAMENTPROFILEWIDGETS["TABSWIDGET"] = {
  name: "tabs",
  title: "",
  dataProvider: {
    type: "INLINE",
    data: {
      tabs: [
        {
          title: "Fees",
          widgets: [TOURNAMENTPROFILEWIDGETS['ABOUT']]
        },
        {
          title: "Location",
          widgets: [TOURNAMENTPROFILEWIDGETS['ABOUT']]
        },
        {
          title: "Who is playing",
          widgets: [TOURNAMENTPROFILEWIDGETS['WHOISPLAYING']]
        },
      ]
    }
  }
}

export const TournamentProfileAction = {
  "title": "showTournament",
  "type": "rest",
  "method": "get",
  "url": "",
  "dev_url":  REST_API_URLS.TOURNAMENTLIST,
  "parameters": [
    {
      "id": "tournamentId",
      "isMendatory": true,
      "source": "route",
      "sourceValue": "tournamentId"
    },
    {
      "id": "isPagingRequired",
      "isMendatory": true,
      "default": false
    }
  ],
  "transformationType": "RAW"
}


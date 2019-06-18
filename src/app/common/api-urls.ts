import { Injectable } from "@angular/core";
// for local
 export const SERVER_URL = "http://gsaserver.com/public/"; 

// for live
// export const SERVER_URL = "http://gsaserver.technideus.com/public/"; // change when deploy
export function createAPIURL(url){
return SERVER_URL + url;
}
export const REST_API_URLS = {
    LOAD_SITE_GLOBALS: createAPIURL("loadSiteGlobals"),
    UPDATE_SITE_GLOBALS: createAPIURL("updateSiteGlobals"),
    VIEW_BRACKET: createAPIURL("viewBracket"),
    GET_BRACKET_TITLES: createAPIURL("getBracketTitles"),
    PRINT_BRACKET: createAPIURL("printBracket"),
    HIDE_UNHIDE_BRACKET: createAPIURL("hideUnhideBracket"),
    SHOW_BRACKET_SCORE: createAPIURL("loadBracketScores"),
    TEAM_IMAGE: createAPIURL("getTeamBanner"),
    TEAM_LIST: createAPIURL("teamList"),
    TEAM_SCORE_YEAR: createAPIURL("loadTeamScoreYear"),
    TOURNAMENT_LIST: createAPIURL("tournamentList"),
    TURNAMENT_OPTIONS: createAPIURL("loadTournamentOptions"),
    TOURNAMENT_FEES: createAPIURL("tournamentFees"),
    TOURNAMENT_RANKING: createAPIURL("loadTournamentRanking"),
    USER_LIST: createAPIURL("userList"),
    USER_EDIT: createAPIURL("editUser"),
    TEAM_TOURNAMENT_RESULT: createAPIURL("loadSpecificTournamentRanking"),
    SINGLE_TOURNAMENT_RESULT: createAPIURL("loadSpecificTournamentRanking"),
    SEND_LOGIN_OTP: createAPIURL("sendLoginOTP"),
    VERIFY_MOBILE: createAPIURL("verifyMobile"),
    TOURNAMENT_TEAMS: createAPIURL("loadTournamentTeams"),
    LOAD_AGE_CLASS_OF_TEAM_IN_TOURNAMENT: createAPIURL("loadAgeClassOfTeamsInTournament"),
    TEAM_ROSTER: createAPIURL("loadTeamRoster"),
    TEAM_GALLERY: createAPIURL("loadTeamGallery"),
    UPDATE_TEAM_BANNER: createAPIURL("updateTeamBanner"),
    TEAM_BANNER: createAPIURL("loadTeamBanner"),
    TEAM_TOURNAMENT_BRACKET_DETAIL: createAPIURL("loadBracketDetailOfTeam"),
    TEAM_TOURNAMENT_BRACKET_SCORE: createAPIURL("loadBracketScoreOfTeam"),
    ADD_TEAM_GALLERY: createAPIURL("addTeamGalleryImages"),
    UPDATE_TEAM_GALLERY: createAPIURL("updateTeamGalleryImages"),
    GET_USER_TEAMS: createAPIURL("teamOptions"),
    USERLIST: createAPIURL("userList"),
    LOGIN: createAPIURL("login"),
    LOADUSERTYPES: createAPIURL("loadUserTypes"),
    REGISTER: createAPIURL("register"),
    MENULIST: createAPIURL("menuList"),
    LOADMENUPARENT: createAPIURL("loadMenuParent"),
    ADDMENU: createAPIURL("addMenu"),
    EDITMENU: createAPIURL("editMenu"),
    LOADMENUITEM: createAPIURL("loadMenuItem"),
    TEAMLIST: createAPIURL("teamList"),
    LOADALLSPORTS: createAPIURL("loadAllSports"),
    LOADALLSTATES: createAPIURL("loadAllStates"),
    LOADALLAGEGROUPOFSPORT: createAPIURL("loadAllAgegroupOfSport"),
    loadAllClassificationOfSport :createAPIURL("loadAllClassificationOfSport"),
    TOURNAMENTLIST: createAPIURL("tournamentList"),    
    LOADALLDIRECTORS: createAPIURL("loadAllDirectors"),
    LOADALLSEASONYEAR: createAPIURL("loadAllSeasonYear"),
    APPSEARCH: createAPIURL("appsearch"),
    MENUITEM: createAPIURL("menuItem"),
    LOADALLPARKS: createAPIURL("loadAllParks"),
    LOADPARKDETAIL: createAPIURL("loadParkDetail"),
    ADDTOURNAMENT: createAPIURL("addTournament"),
    ADDTEAM: createAPIURL("addTeam"),
    ADDROSTER: createAPIURL("addRoster"),
    LOADALLBRACKETTYPES: createAPIURL("loadAllBracketTypes"),
    LOADTOURNAMENTPARKS: createAPIURL("loadTournamentParks"),
    LOADALLAGEGROUPOFTOURNAMENT: createAPIURL("loadAllAgegroupOfTournament"),
    LOADALLCLASSIFICATIONOFTOURNAMENT: createAPIURL("loadAllClassificationOfTournament"),
    LOADALLBRACKETMATCHES: createAPIURL("loadAllBracketMatches"),
    LOADTOURNAMENTTEAMS : createAPIURL("loadTournamentTeams"),
    SAVEBRACKET : createAPIURL("saveBracket"),
    LOADALLBRACKETDETAILS: createAPIURL("loadBracketDetails"),
    LOADBRACKETSCORES: createAPIURL("loadBracketScores"),
    LOADTEAMDETAIL: createAPIURL("loadTeamDetail"),
    UPDATETEAMDETAIL: createAPIURL("updateTeamDetails"),
    TEAMOPTIONS: createAPIURL("teamOptions"),
    REGISTERFORTOURNAMENT: createAPIURL("registerForTournament"),
    TEAMOPTIONSBYEMAIL: createAPIURL("teamOptionsByEmail"),
    STORE_COMMENTS_IN_TOURNAMENT: createAPIURL("addDirectorComments"),
    REMOVE_TEAM_TOURNAMENT: createAPIURL("removeTeamFromTournaments"),
    SAVE_MAX_NUMBER: createAPIURL("saveMaxNumberOfTeamsInTournament"),
    CHANGE_AGEGROUP_CLASS: createAPIURL("changeAgegroupAndClass"),
};
@Injectable()
export class AppConstants {
    public static REST_API_URLS = REST_API_URLS;
    public static getRankingTypes(){
        const types = [];
        types.push({title:"Power Rankings", value: 1});
        types.push({title:"Points Rankings", value: 1});
        return types;
    }
}
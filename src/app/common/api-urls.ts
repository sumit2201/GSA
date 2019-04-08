import { Injectable } from "@angular/core";

export const SERVER_URL = "http://gsaserver.com/public/"; // change when deploy
export function createAPIURL(url){
return SERVER_URL + url;
}
export const REST_API_URLS = {
    LOAD_SITE_GLOBALS: createAPIURL("loadSiteGlobals"),
    UPDATE_SITE_GLOBALS: createAPIURL("updateSiteGlobals"),
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
    TEAM_ROSTER: createAPIURL("loadTeamRoster"),
    TEAM_GALLERY: createAPIURL("loadTeamGallery"),
    UPDATE_TEAM_BANNER: createAPIURL("updateTeamBanner"),
    TEAM_BANNER: createAPIURL("loadTeamBanner"),
    TEAM_TOURNAMENT_BRACKET_DETAIL: createAPIURL("loadBracketDetailOfTeam"),
    TEAM_TOURNAMENT_BRACKET_SCORE: createAPIURL("loadBracketScoreOfTeam"),
    ADD_TEAM_GALLERY: createAPIURL("addTeamGalleryImages"),
    UPDATE_TEAM_GALLERY: createAPIURL("updateTeamGalleryImages"),
    
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
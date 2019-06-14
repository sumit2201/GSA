<?php

use Slim\Http\Request;
use Slim\Http\Response;

require_once("common/file-upload-utility.php");
require_once("common/apis.php");
require_once("common/utility.php");
require_once("common/user_apis.php");
require_once("common/tournament_apis.php");
require_once("common/sport_apis.php");
require_once("common/team_apis.php");
require_once("common/email_apis.php");

// Routes

$app->get('/hello/{name}', function (Request $request, Response $response) {
    print_r($this->db);
    $name = $request->getAttribute('name');
    $response->getBody()->write(" Hello, $name ");
    $sth = $this->db->prepare("SELECT * FROM test");
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
    // return $name;
});


$app->get('/loadSiteGlobals', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("Fetching site global info");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchSiteGlobals($parameters);
    return $response->getResponse();
});

$app->post('/updateSiteGlobals', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("Fetching site global info");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = updateSiteGlobals($parameters);
    return $response->getResponse();
});

$app->post('/login', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("Login call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = login($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->post('/verifyMobile', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("verify Mobile call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = verifyMobile($parameters);
    // print_r($response->getResponse());die;
    return $response->getResponse();
});

$app->post('/register', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("register call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = createUser($parameters);
    // print_r($response->getResponse());die;
    return $response->getResponse();
});

$app->post('/addTournament', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add tournament call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = addTournament($parameters);
    return $response->getResponse();
});

$app->post('/registerForTournament', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add tournament call");
    $parameters = json_decode($request->getParam("requestParams"));
    updateTeamDetails($parameters);
    $response = registerForTournament($parameters);
    return $response->getResponse();
});

$app->post('/addTeam', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add team call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = addTeam($parameters);
    return $response->getResponse();
});

$app->post('/addRoster', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add team roster call");
    $parameters = json_decode($request->getParam("requestParams"));
    $uploadedFiles = $request->getUploadedFiles();
    $response = addRoster($parameters,$uploadedFiles);
    return $response->getResponse();
});

$app->post('/addTeamGalleryImages', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add team roster call");
    $parameters = json_decode($request->getParam("requestParams"));
    $uploadedFiles = $request->getUploadedFiles();
    $response = addTeamGalleryImages($parameters,$uploadedFiles);
    return $response->getResponse();
});

$app->post('/updateTeamGalleryImages', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("update team gallery call");
    $parameters = json_decode($request->getParam("requestParams"));
    $uploadedFiles = $request->getUploadedFiles();
    $response = updateTeamGalleryImages($parameters,$uploadedFiles);
    return $response->getResponse();
});

$app->post('/updateTeamBanner', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add team roster call");
    $parameters = json_decode($request->getParam("requestParams"));
    $uploadedFiles = $request->getUploadedFiles();
    $response = updateTeamBannerImgae($parameters,$uploadedFiles);
    return $response->getResponse();
});

$app->get('/loadTeamRoster', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add team roster call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchTeamRoster($parameters);
    return $response->getResponse();
});

$app->get('/loadTeamBanner', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("view team banner call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = getTeamBannerDetails($parameters);
    return $response->getResponse();
});

$app->get('/loadTeamGallery', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add team roster call");
    $parameters = json_decode($request->getParam("requestParams"));
    $uploadedFiles = $request->getUploadedFiles();
    // echo "<pre>";
    // print_r($uploadedFiles);
    $response = fetchTeamGallery($parameters);
    return $response->getResponse();
});

$app->get('/loadAllBracketMatches', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("loading bracket matches");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchBracketMatches($parameters);
    return $response->getResponse();
});

$app->get('/menuList', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("Login call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchMenuList($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->get('/teamList', function (Request $request, Response $response, array $args) {
    // Sample log
    $this->logger->info("Getting team list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchTeamList($parameters);
    return $response->getResponse();
});

$app->get('/teamOptions', function (Request $request, Response $response, array $args) {
    // Sample log
    $this->logger->info("Getting team for dropdown");
    $parameters = json_decode($request->getParam("requestParams"));
    $parameters->columnToFetch = ["t.id", "t.name as title"];
    $response = fetchTeamList($parameters);
       // print_r($response);
    return $response->getResponse();
});

$app->get('/teamOptionsByEmail', function (Request $request, Response $response, array $args) {
    // Sample log
    $this->logger->info("Getting team for dropdown");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchTeamListByEmail($parameters);
       // print_r($response);
    return $response->getResponse();
});

$app->get('/tournamentList', function (Request $request, Response $response, array $args) {
    // Sample log
    $this->logger->info("Getting tournament list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchTournamentList($parameters);
    return $response->getResponse();
});

$app->get('/loadTournamentOptions', function (Request $request, Response $response, array $args) {
    // Sample log
    $this->logger->info("Getting tournament list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchTournamentForDropDown($parameters);
    return $response->getResponse();
});

$app->get('/tournamentFees', function (Request $request, Response $response, array $args) {
    // Sample log
    $this->logger->info("Getting tournament fees");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchTournamentFees($parameters);
    return $response->getResponse();
});

$app->get('/userList', function (Request $request, Response $response, array $args) {
    // Sample log
    $this->logger->info("Getting tournament list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchUserList($parameters);
    return $response->getResponse();
});

$app->get('/menuItem', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting menu item");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchMenuItem($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->get('/loadMenuItem', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting menu item");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchMenuItem($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->get('/loadMenuParent', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting menu item");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchMenuParent($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->get('/loadAllStates', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting state list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllStates($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->get('/loadAllSports', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting sport list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllSports($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->get('/loadAllAgegroupOfSport', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting agegroup list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllAgegroup($parameters);
    return $response->getResponse();
});

$app->get('/loadAllAgegroupOfTournament', function (Request $request, Response $response, array $args) {
    // Sample log
    $this->logger->info("getting agegroup list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllAgegroupsOfTournament($parameters);
    return $response->getResponse();
});

$app->get('/loadAllSeasonYear', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting year for tournament");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllSeasonYear($parameters);
    return $response->getResponse();
});

$app->get('/loadTournamentRanking', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting ranking for tournament");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllRankingOfTournament($parameters);
    return $response->getResponse();
});

$app->get('/loadSpecificTournamentRanking', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting specific ranking  records for tournaments");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchSpecificRankingOfTournaments($parameters);
    return $response->getResponse();
});

$app->get('/loadAllClassificationOfSport', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting classification list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllClassifications($parameters);
    return $response->getResponse();
});

$app->get('/loadAllClassificationOfTournament', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting classification list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = loadAllClassificationsOfTournament($parameters);
    return $response->getResponse();
});


$app->get('/loadBracketDetails', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting bracket details");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchBracketRelatedDetails($parameters);
    return $response->getResponse();
});

$app->get('/loadBracketDetailOfTeam', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting bracket details");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchBracketRelatedDetailsOfTeam($parameters);
    return $response->getResponse();
});

$app->get('/loadBracketScoreOfTeam', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting bracket details");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchBracketRelatedScoreOfTeam($parameters);
    return $response->getResponse();
});

$app->get('/loadTournamentParks', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting park details of tournament");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchParkDetailsForTournament($parameters);
    return $response->getResponse();
});

$app->get('/loadBracketScores', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting bracket scores");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchBracketScores($parameters);
    return $response->getResponse();
});

$app->get('/viewBracket', function (Request $request, Response $response, array $args) {
    // Sample log 
    // echo "In View bracket";
    $this->logger->info("getting bracket scores");
    $parameters = json_decode($request->getParam("requestParams"));
    $userInfo = json_decode($request->getParam("userInfo"));
    $response = fetchBracketDetails($parameters,$userInfo);
    return $response->getResponse();
});

$app->get('/getBracketTitles', function (Request $request, Response $response, array $args) {
    // Sample log 
    // echo "In View bracket";
    $this->logger->info("getting bracket for print");
    $parameters = json_decode($request->getParam("requestParams"));
    $userInfo = json_decode($request->getParam("userInfo"));
    $response = fetchBracketTitles($parameters,$userInfo);
    return $response->getResponse();
});

$app->get('/printBracket', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting bracket scores");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = printBracket($parameters);
    // print_r($response);die;
    return $response->getResponse();
});

$app->get('/hideUnhideBracket', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("hide/unhide bracket");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = hideUnhideBracket($parameters);
    // print_r($response);die;
    return $response->getResponse();
});



$app->post('/saveBracket', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("storing bracket details");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = saveBracketRelatedDetails($parameters);
    return $response->getResponse();
});

$app->get('/loadAllParks', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting parks list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllParks($parameters);
    return $response->getResponse();
});

$app->get('/loadAllDirectors', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting directors list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllDirectors($parameters);
    return $response->getResponse();
});


$app->get('/loadAllBracketTypes', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting all bracket list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchAllBracketTypes($parameters);
    return $response->getResponse();
});

$app->get('/loadTournamentTeams', function (Request $request, Response $response, array $args) {  
    // Sample log  
    $this->logger->info("getting tournament list");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchTournamentTeams($parameters);
    return $response->getResponse();
});

$app->post('/addDirectorComments', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("Storing comments by directors for teams in tournament");
    $parameters = json_decode($request->getParam("requestParams"));
    
    $response = storeDirectorCommentsForTeams($parameters);
    return $response->getResponse();
});

$app->post('/removeTeamFromTournaments', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("Removing Teams by directors from Tournaments");
    $parameters = json_decode($request->getParam("requestParams"));
    
    $response = removeTeamFromTournamentsByDirector($parameters);
    return $response->getResponse();
});


$app->post('/saveMaxNumber', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("Save Maximum Number Of Team");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = saveMaxNumberOfTeam($parameters);
    
    return $response->getResponse();
});





$app->get('/loadParkDetail', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting parks detail");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchParkDetail($parameters);
    return $response->getResponse();
});

$app->get('/loadTeamDetail', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting team detail");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchTeamDetail($parameters);
    return $response->getResponse();
});

$app->get('/updateTeamDetails', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("updateing team communciation detail");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = updateTeamDetails($parameters);
    return $response->getResponse();
});

$app->post('/addMenu', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("add menu item call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = addMenuItem($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->post('/editMenu', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("edit menu item call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = editMenuItem($this->db, $this->logger, $parameters);
    return $response->getResponse();
});

$app->post('/deleteMenu', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("delete menu item call");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = deleteMenuItem($this->db, $this->logger, $parameters);
    return $response->getResponse();
});


// user routes
$app->get('/loadUserTypes', function (Request $request, Response $response, array $args) {
    // Sample log 
    $this->logger->info("getting user types");
    $parameters = json_decode($request->getParam("requestParams"));
    $response = fetchUserTypes($parameters);
    return $response->getResponse();
});

$app->get('/activation', function (Request $request, Response $response, array $args) {
    
    global $db, $logger;
   // print_r('asas');
    $activation_code = $_REQUEST['key'];
    $domain_id = $_REQUEST['domid'];

    //print_r($activation_code);
    
    $sql = "select id from jos_users where email_activation='$activation_code'";
    $sth = $db->prepare($sql);
    $sth->execute();
    $result = $sth->fetchObject();
    $activate_user_id = $result->id;

    if (CommonUtils::isValid($activate_user_id)) {
        //echo $user_id;
        $emailVerify = 1;
        $sql = "update jos_users set `isEmailVerified`= '".$emailVerify."'  where id=" .$activate_user_id;
        $sth = $db->prepare($sql);
        $sth->execute();

        enableUserBasedOnVerification($activate_user_id);

     }
     $domain = getDomainNameFromId($domain_id);
     $check_http = explode("/",$domain);
     //print_r($check_http);die();
     if ($check_http[0] == 'http:' || $check_http[0] == 'https:' ) {
        $newURL = $domain.'/login';
     }
     else {
        $newURL = 'http://'.$domain.'/login';
     }

     header('Location: '.$newURL);  
       
});
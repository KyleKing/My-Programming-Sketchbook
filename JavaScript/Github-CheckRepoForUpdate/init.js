// // Get the latest release to check if an update is needed
// /repos/:owner/:repo/releases
// https://developer.github.com/v3/repos/releases/
// curl -i https://api.github.com/repos/colinking/n1-unsubscribe/releases

var GitHubApi = require("github");

var github = new GitHubApi({
  version: "3.0.0",
  debug: false,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  timeout: 5000,
  headers: {
    "user-agent": "N1-Updater" // GitHub is happy with a unique user agent
  }
});

github.releases.listReleases({
  owner: "colinking",
  repo: "n1-unsubscribe",
  per_page: 1
}, function(err, res) {
  if(err) console.log(err);
  var curVer = '1.3.0';
  var avaVer = res[0].tag_name;
  var releaseURL = res[0].html_url; // available
  var downloadURL = res[0].assets[0].browser_download_url;
  if(avaVer != curVer && res[0].draft === false) {
    console.log('New release available at: ' + releaseURL);
  }
});

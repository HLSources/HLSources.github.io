
function genHTML() {
  var sourceRepo = document.getElementById("sourceRepo").value
  var targetRepo = document.getElementById("targetRepo").value
  var officialSite = document.getElementById("officialSite").value
  var discordURL = document.getElementById("discordURL").value
  var discordName = document.getElementById("discordName").value
  var descriptionText = document.getElementById("descriptionText").value
  var orgName = document.getElementById("orgName").value
  var resultText =  document.getElementById("resultText")

  var githubURL = "https://github\.com/";
  var sourceforgeURL = "https://sourceforge\.net/p/";
  var gitlabURL = "https://gitlab\.com/";

  var repoPattern = new RegExp(".*/(.*)$");
  var repoPattern2 = new RegExp("/code/.*");

  
  var HTMLBeginning = "<div class=\"item\">\n<h3><a href=\"@01@\">@02@</a> @03@[@04@]</h3>\n";
  var HTMLGithub = "<span class=\"subtext\">Mirrors:\n<a href=\"@05@\">@06@</a>,\n<a href=\"https://techgaun.github.io/active-forks/index.html#@04@\">Other forks</a>\n</span><br>\n";
  var HTMLOtherGit = "<span class=\"subtext\">Unofficial mirror on github: \n<a href=\"@05@\">@06@</a></span><br>\n";
  var HTMLOfficialSite = "<span class=\"subtext\">Official website: <a href=\"@07@\">@08@</a>";
  var HTMLOfficialDiscord = "Official Discord server: <a href=\"@09@\">@10@</a></span><br>\n";

  var HTMLEnd = "<p>@11@</p>\n</div>";

  
  var repoName, newRepoName, gitTags, sourceforgeTag, gitlabTag, resultHTML;
  gitTags = sourceforgeTag = gitlabTag =  ""

  var shortSourceRepo = sourceRepo; // same by default
  var shortTargetRepo = targetRepo;
  var shortOfficialSite = officialSite;

  
  // ****************************************************************************
  // Source Repo field

  if (sourceRepo.search("^https?://") == 0) { // if its full URL, not relative path

    if (sourceRepo.search(githubURL)  == 0 || sourceRepo.search(gitlabURL)  == 0) { // if its github or gitlab

      if (sourceRepo.search(githubURL)  == 0) { // for github
        shortSourceRepo = shortSourceRepo.replace(githubURL,"")
        // resultText.innerHTML=shortSourceRepo
      } else { // for gitlab
        shortSourceRepo = shortSourceRepo.replace(gitlabURL,"")
        gitlabTag = "@gitlab " // adding gitlab tag
        // resultText.innerHTML=gitlabTag + shortSourceRepo
      }

      if (shortSourceRepo.match(repoPattern)) { // if relative short path (shortSourceRepo) is correct
        var match = repoPattern.exec(shortSourceRepo);
        repoName = match[1] // getting result of regexp capture (repo name after last slash)
      } else { // relative short path (shortSourceRepo) is not correct
        resultHTML = "ERROR Please enter full Source repo URL or relative path for github in this format: user/repository\n" + 
                      "Parent directories like gitlab.com/username is not supported";
      }

    } else if (sourceRepo.search(sourceforgeURL) == 0) { // if it's sourceforge
      shortSourceRepo = shortSourceRepo.replace(sourceforgeURL,"") // cut URL prefix
      shortSourceRepo = shortSourceRepo.replace(repoPattern2,"") // cut everything after repo name
      repoName = shortSourceRepo // for sourceforge - name is same as short relative path
      gitlabTag = "@sourceforge "

    }  else if (sourceRepo.search("https://sourceforge.net/") == 0) { // sourceforge without /p/ in URL means it's not direct link to repo code
      resultHTML = "ERROR Please enter direct link to repository code, not to main page. Example:\n" +
                         "https://sourceforge.net/p/quark/code/HEAD/tree/\n" +
                         "Instead of https://sourceforge.net/projects/quark/ "

    } else {
      resultHTML = "ERROR Unrecognized git service. Only github, sourceforge and gitlab are supported.";
    }

  } else if (sourceRepo != "") {  // if this field is not empty
    if (shortSourceRepo.match(repoPattern)) { // if relative short path (shortSourceRepo) is correct
      var match = repoPattern.exec(shortSourceRepo);
      repoName = match[1] // getting result of regexp capture (repo name after last slash)
      sourceRepo = githubURL + sourceRepo; // make full URL
    } else {
        resultHTML = "ERROR Please enter full source URL or relative path for github in this format: user/repository";
    }
  } else { // if this field is empty
    resultHTML = "Please enter something for source repo URL";
  }
  

  // ****************************************************************************
  // Target Repo field

  if (targetRepo != "" ) { // if this field not empty
    if (targetRepo.search(githubURL)  != 0) {  // if its relative path (not full URL)

      if (shortTargetRepo.match(repoPattern)) { // if relative short path (shortTargetRepo) is correct
        var match = repoPattern.exec(shortTargetRepo);
        newRepoName = match[1] // getting result of regexp capture (repo name after last slash)
      } else { // otherwise - assume its just name of repo
        newRepoName = targetRepo;
      }
      shortTargetRepo = orgName + "/" + newRepoName;
      targetRepo = githubURL + shortTargetRepo; // make full URL
      
    } else { // for full URL
      shortTargetRepo = shortTargetRepo.replace(githubURL, "");
    }

  } else { // if field is empty
    if (sourceRepo.search(githubURL)  == 0) { // for github
      shortTargetRepo = orgName; // don't show repo name in relative path (shortTargetRepo) because it's same as original
      targetRepo = githubURL + orgName + "/" + repoName;

    } else { // for other git services - show repo name just for clarity
      shortTargetRepo = orgName + "/" + repoName;
      targetRepo = githubURL + shortTargetRepo;
    }
  }


  // ****************************************************************************
  // Official Website field

  if (officialSite != "") { 
    if (officialSite.search("^https?://") == 0) {
      shortOfficialSite = shortOfficialSite.replace(RegExp("^https?://(www.)?") , ""); // remove http(s) and www for shortOfficialSite
    } else {
      officialSite = "http://" + officialSite; // add http:// if not exist
    }
    shortOfficialSite = shortOfficialSite.replace(RegExp("/$"), ""); // remove last slash in URL for shortOfficialSite

    if (discordURL != "") { // if Official Discord also exist
      HTMLOfficialSite += " /\n"; // add slash and newline symbol in the end of HTML
    } else {
      HTMLOfficialSite += "\n</span><br>\n"; // if not - close span tag
    }
  } else {
    HTMLOfficialSite = ""; // if officialSite field is empty - make HTMLOfficialSite blank too
  }


  // ****************************************************************************

  // Official Discord field

  if (discordURL != "") { 
    if (officialSite == "") { // if Official Website field is empty -
      HTMLOfficialDiscord = "<span class=\"subtext\">" + HTMLOfficialDiscord; // add opening span tag in the beginning of HTML
    }
  } else {
    HTMLOfficialDiscord = ""; // if officialDiscord field is empty - make HTMLOfficialDiscord blank too
  }

  if (discordURL != "" && discordName == "") { // if discord URL is not empty, but name field is
    resultHTML = "ERROR Please enter name of the Official Discord server";
  }


  // ****************************************************************************

  // Description field

  descriptionText = descriptionText.replace(RegExp(" +"), " "); // remove double spaces

  // ****************************************************************************

  // Construct resulting HTML code

  if (!resultHTML) { // if resultHTML it not containing some error message

      if (sourceRepo.search(githubURL)  == 0) { // if source repo is on github
          resultHTML = HTMLBeginning + HTMLGithub + HTMLOfficialSite + HTMLOfficialDiscord + HTMLEnd;
      } else {
          resultHTML = HTMLBeginning + HTMLOtherGit + HTMLOfficialSite + HTMLOfficialDiscord + HTMLEnd;
      }
  }
  

  // ****************************************************************************
  // Replacing placeholders in template with real values

    gitTags = sourceforgeTag + gitlabTag; // one of the tag wouldn't be blank (both are blank if its github)

    resultHTML = resultHTML.replaceAll("@01@", sourceRepo);
    resultHTML = resultHTML.replaceAll("@02@", repoName);
    resultHTML = resultHTML.replaceAll("@03@", gitTags);
    resultHTML = resultHTML.replaceAll("@04@", shortSourceRepo);
    resultHTML = resultHTML.replaceAll("@05@", targetRepo);
    resultHTML = resultHTML.replaceAll("@06@", shortTargetRepo);
    resultHTML = resultHTML.replaceAll("@07@", officialSite);
    resultHTML = resultHTML.replaceAll("@08@", shortOfficialSite);
    resultHTML = resultHTML.replaceAll("@09@", discordURL);
    resultHTML = resultHTML.replaceAll("@10@", discordName);
    resultHTML = resultHTML.replaceAll("@11@", descriptionText);

    resultText.innerHTML = resultHTML
}

function copyHTML() {
  var resultText = document.getElementById("resultText");
  resultText.focus();
  resultText.select();
  navigator.clipboard.writeText(resultText.value);
}
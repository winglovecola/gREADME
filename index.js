const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');


const INDENT = "\n\n\n\n";


let githubUsername = "";
let screenshotArray = [];
let screenshotCount = 0;

let licenseData = {};




//inquirer questions array
const questions = [
  {
    type: 'input',
    message: 'Project Title:',
    name: 'title',
    
    /* Legacy way: with this.async */
    validate: function (input) {
      // Declare function as asynchronous, and save the done callback
      const done = this.async();

      // Do async stuff
      setTimeout(function() {
        if (input == '') {
          // Pass the return value in the done callback
          done('Title must be specify');
          return;
        }
        // Pass the return value in the done callback
        done(null, true);
      }, 300);
    }
  },


  {
    type: 'input',
    message: 'Description:',
    name: 'description',
    
  },

  {
    type: 'list',
    message: 'Please select the type of License you want to use in your project.',
    choices: [
      'None', 'GNU General Public License v3.0', 'MIT License', 'BSD 2-clause "Simplified" license', 'BSD 3-clause "New" or "Revised" license', 'Boost Software License 1.0', 'Creative Commons Zero v1.0 Universal', 'Eclipse Public License 2.0', 'GNU Affero General Public License v3.0', 'GNU General Public License v2.0', 'GNU Lesser General Public License v2.1', 'Mozilla Public License 2.0', 'The Unlicense'
    ],
    name: 'license',
  },

  {
    type: 'input',
    message: 'Installation Instructions:',
    name: 'installation',
    
  },

  {
    type: 'input',
    message: 'Usage Information:',
    name: 'usage',
    
  },

  {
    type: 'input',
    message: 'Screenshots URL (Image URL of your app):',
    name: 'preview',

    /* Legacy way: with this.async */
    validate: function (input) {
      // Declare function as asynchronous, and save the done callback
      const done = this.async();

      // Do async stuff
      setTimeout(function() {
        
        if (input != '') {
          // Pass the return value in the done callback

          screenshotCount++;
          screenshotArray.push (input);

          done('Screenshot ' + screenshotCount + ' added. Type another URL to add more -OR- leave blank to skip.');

          return;
        }
        console.log (screenshotCount + " Screenshot Saved");
        done(null, true); 
          
      }, 300);
    }

  },

  {
    type: 'input',
    message: 'Contribution Guidelines:',
    name: 'contribution',
    
  },

  {
    type: 'input',
    message: 'Test Instructions:',
    name: 'test',
    
  },

  {
    type: 'input',
    message: 'Github Account Username:',
    name: 'githubUsername',
    
    /* Legacy way: with this.async */
    validate: function (input) {
      // Declare function as asynchronous, and save the done callback
      const done = this.async();

      // Do async stuff
      setTimeout(function() {
        if (input == '') {
          // Pass the return value in the done callback
          done('Github username must be specify');
          return;
        }
        else if (! /^[a-zA-Z0-9]+$/.test(input)) {
          done('Github username must not contain any special character');
          return;
        }
        // Pass the return value in the done callback
        done(null, true);
      }, 300);
    }
  },

  {
    type: 'input',
    message: 'Your Email Address:',
    name: 'email',
    
  }
];





// Create README file function
function saveReadmeFile(username, data) {

  let dateStr = new Date().toJSON();
  dateStr = dateStr.replace(/:/ig, '-');



  //create directory
  let saveDir = path.join(__dirname, "\\output\\" + username);
  fs.mkdir(saveDir, { recursive: true }, (err) => {
    if (err)
    {
       console.error(err) 
    }
    else
    {
      //save README file
      filePath = saveDir + "\\" + dateStr + "_README.md";

      fs.writeFile(filePath, data, (err) => {
        err ? console.error(err) : console.log('README.md saved to "' + filePath + '"') 
      });
    }
  });
}

function doubleUnderline (str)
{
  let underline = "";
  for (let i = 0; i < str.length; i++) {

    underline += "=";
  } 

  return underline;
}


//create license template and badge
function licenseTemplate (license) {

  let thisLicenseData = {};

  if (license == "None")
  {
    thisLicenseData.template = "Please refer to the LICENSE in the repo." + INDENT;
    thisLicenseData.badge = "";
  }
  else 
  {
    thisLicenseData.template = "This project is under the license of " + license + ". For more detail, please visit [https://choosealicense.com/](https://choosealicense.com/)." + INDENT;

    thisLicenseData.badge = "![License Badge](" + "https://img.shields.io/badge/license-" + encodeURIComponent(license) + "-lightgreen)";
  }

  return thisLicenseData;
}





//initialize app
function init() {

  console.log ("\n\n\nWelcome to gREADME. Please fill in the require fields to generate a professional README.md file for github project. To skip a section, leave it blank and press ENTER key to continue.\n\n\n")

}

init();


inquirer
  .prompt(questions)
  .then((response) => {


  //Construct Readme File Template

  let template = "", tempTitle = "", tempDescription = "", tempInstallation = "", tempUsage = "", tempPreview = "", tempContribution = "", tempQuestions = "", tableOfContent = "";

  

  //template license section
  licenseData = licenseTemplate (response.license);
  
  if (licenseData.template != "")
  {
    tempLicense = "## License\n\n" + licenseData.template + INDENT;
  }
  

  


  //template title section
  tempTitle = "# " + response.title + "\n" + doubleUnderline (response.title) + "\n" + licenseData.badge + INDENT;



  
  //template description section
  if (response.description != "")
  {
    tempDescription = "## Description\n\n" + response.description + INDENT;
  }



  //template installation section
  if (response.installation != "")
  {
    tempInstallation = "## Installation\n\n" + response.installation + INDENT;
    
    tableOfContent += "- [Installation](#installation)\n";
  }



  //template usage section
  if (response.usage != "")
  {
    tempUsage = "## Usage\n\n" + response.usage + INDENT;

    tableOfContent += "- [Usage](#usage)\n";
  }



  //template screenshot section
  if (screenshotCount > 0)
  {
    let tempScreenshot = "";

    if (screenshotCount == 1)
    {
      tempScreenshot = "![Screenshot](" + screenshotArray[0] + ")";
    }
    else if (screenshotCount > 0)
    {
      let i = 1;
      screenshotArray.forEach (element => {

        tempScreenshot += "![Screenshot " + i + "](" + element + ")\n";
        i++;
      });
    }
    
    
    tempPreview = "## Preview\n\n" + tempScreenshot + INDENT;
    tableOfContent += "- [Preview](#preview)\n";
  }



  //template contribution section
  if (response.contribution != "")
  {
    tempContribution += "## Contribution\n\n" + response.contribution + INDENT;
    tableOfContent += "- [Contribution](#contribution)\n";
  }



  //template questions section

  if (response.githubUsername != "")
  {
    githubUsername = response.githubUsername;
    
    let githubProfileLink = "https://github.com/" + response.githubUsername;

    tempQuestions += "Github Profile: " + githubProfileLink + "\n";
    tempQuestions += "Email: " + response.email + " (Please reach me with additional questions)\n";
  }

  if (tempQuestions != "")
  {
    tempQuestions = "## Questions\n\n" + tempQuestions + INDENT;

    tableOfContent += "- [Questions](#questions)\n";
  }

  if (tableOfContent != "")
    tableOfContent = "## Table of Contents\n\n" + tableOfContent + INDENT;


  

  template = `${tempTitle}${tempDescription}${tableOfContent}${tempPreview}${tempInstallation}${tempContribution}${tempUsage}${tempQuestions}${tempLicense}`;



  //Save README file
  saveReadmeFile (githubUsername, template);
});





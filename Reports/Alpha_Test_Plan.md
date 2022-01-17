# Alpha Test Plan   

By David Hutchins, Austin Welch, Branden Evangelista, and Brontë Cadogan

## Specification

### Usability
#### Interface

#### Navigation

#### Perception

#### Responsiveness

### Build Quality
#### Robustness

#### Consistency

#### Aesthetic Rigor

### Vertical Features
#### External Interface

#### Persistent State

#### Internal Systems



## Links
- Repo: https://github.com/davidhutchins/Automatic-Sanitizing-System
- Google Drive: https://drive.google.com/drive/u/1/folders/1yFWsin02HhbcQPVtgGXrDhR7vxmtbRYc

## Build Instructions (also included in README.md in default folder of the repository)
### Install CCS
1. Download CCS from https://www.ti.com/tool/download/CCSTUDIO
2. Proceed through the installer, when asked to select between full and custom installation, choose custom and click next
3. On 'Select Components' Select 'SimpleLink MSP432 low power + performance MCUs'
4. On the next page, select only 'Spectrum Digital Debug Probes and Boards'
5. Proceed until program is installed

### In CCS
1. Go to File > Import 
2. Choose Code Composer Studio > CCS Projects
3. Clone/Download the repository and select Hardware > Hand-Sanitizing-System as the search directory
4. Select Hand-Sanitizing-System_MSP432 and Finish
5. Hit the hammer icon on the top left bar to build the project (if it is not compiling, ensure that (Active - Debug) appears next to the project name on the project explorer, you can do this by clicking on the project, which 'selects' it as the build target)

## Running the Automatic Hand Cleaning System App (Webapp) on a Local Machine
1. Make sure NodeJS is installed https://nodejs.org/en/
2. Download the the repo from GitHub using 
    `git clone https://github.com/davidhutchins/Automatic-Sanitizing-System.git`
3. Install dependencies using: `npm i`
4. Open the command prompt and navigate to the folder containing the server.js file:
   `cd Automatic-Sanitizing-System/Server/sanitizingsystem/src/server`
5. Enter the command `node server.js` to connect to the MongoDB database
6. In another terminal, navigate to this folder:
   `cd Automatic-Sanitizing-System/Server/sanitizingsystem/src`
and run the application with `npm start`
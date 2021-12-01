# Automatic-Sanitizing-System
## IoT Automatic Door Handle Sanitizing System

By David Hutchins, Austin Welch, Branden Evangelista, and Brontë Cadogan

## Building the Embedded Code
### Install CCS
1. Download CCS from https://www.ti.com/tool/download/CCSTUDIO
2. Proceed through the installer, when asked to select between full and custom installation, choose custom and click next
3. On 'Select Components' Select 'SimpleLink MSP432 low power + performance MCUs'
4. On the next page, select only 'Spectrum Digital Debug Probes and Boards'
5. Proceed until program is installed

### In CCS
1. Goto File > Import 
2. Choose Code Composer Studio > CCS Projects
3. Clone/Download the repository and select Hardware > Hand-Sanitizing-System as the search directory
4. Select Hand-Sanitizing-System_MSP432 and Finish
5. Hit the hammer icon on the top left bar to build the project (if it is not compiling, ensure that (Active - Debug) appears next to the project name on the project explorer, you can do this by clicking on the project, which 'selects' it as the build target)

## Running the Automatic Hand Cleaning System App (Webapp) on a Local Machine
Make sure NodeJS is installed https://nodejs.org/en/

Download the the repo from GitHub using 

git clone https://github.com/davidhutchins/Automatic-Sanitizing-System.git

Install dependencies using  npm i

Open the command prompt and navigate to the folder containing the webapp

cd Automatic-Sanitizing-System/Server/sanitizingsystem

Run using npm start

# Automatic-Sanitizing-System
## IoT Automatic Door-Handle Cleaning System

By David Hutchins, Austin Welch, Branden Evangelista, Alejandro Jacobo, and Brontë Cadogan

## Synopsis
The Automatic Handle Cleaning System (A.H.C.S. for short) is a senior design project that attempts to help make the world a more sanitary place. Inspired by the COVID-19 pandemic and its call for a higher degree of sanitation, the A.H.C.S. uses embedded electronics and UV-C lights to detect motion and disinfect door handles as people use them. The entire system is battery powered, allowing for its use to disinfect any door handle, anywhere. The A.H.C.S. is internet enabled, and each device sends its sensor data to the A.H.C.S. server, which allows user accounts to monitor each of their devices and track usage data. Users can use this data to better understand traffic throughout each of their buildings and learn how frequently each door is used over time. 

## Setup Guide
This guide is intended to help you set up your Automatic Handle Cleaning System (AHCS) device, connect it to the internet, and link it with your AHCS account. 

### Step 1: Power on AHCS in configuration mode
In this step, you will turn on the AHCS in configuration mode, where you can then edit its configuration settings. 
1.	Power off the AHCS if it is already on.
2.	Find the configuration button located on the top right of the AHCS and hold it down.
3.	While holding down the configuration button, power on the AHCS.
4.	If successful, the front-facing LED should now be lit yellow.
 
### Step 2: Enter the configuration webpage
This step will show you how to connect to your AHCS device and how to access its configuration page. 
1.	Once the LED is lit yellow, the AHCS will be hosting an Access Point (AP) through which you can connect to with any Wi-Fi enabled device with access to an internet browser (i.e. Chrome, Firefox, Safari).
2.	Connect to the AP named “AHCS-ID” where ID will be replaced with your device’s ID number. 
3.	Once connected, your device might say that your connection does not have internet access, this is okay. 
4.	In a browser, enter the URL handlesetup.net and proceed to the webpage. 
5.	Once the page loads, you can continue to the next step. 

### Step 3: Edit your AHCS’s configuration settings
In the configuration webpage, you can change the AHCS’s Wi-Fi configuration and take note of its ID and registration code. 
1.	Configure your AHCS’s Wi-Fi configuration under the Wi-Fi Configuration tab.
2.	Current SSID and Security correspond to the current network the AHCS is connected to and that network’s security settings.
3.	Enter the SSID, security type, and password of the network you want to connect to and click ‘Apply’. The Current SSID and Security variables at the top will then change.
4.	Head to the Registration tab and take note of the Registration Code and Device ID as these will be needed for the next step.
5.	Click ‘Exit and Restart Device’, the AHCS will then restart and attempt to connect to the Wi-Fi network it was configured to. This will take 15-30 seconds. 
6.	Upon successful connection, the AHCS’s front LED will turn blue. If it cannot connect to the network, it will turn green. If the light turns green start again from step 1 and try again, making sure all the configuration settings were set correctly. 
7.	If the LED is blue, continue to the next step. 

### Step 4: Link AHCS with account
Once the AHCS has connected to a network for the first time, you will be able to link the device to your account.
1.	Go to the AHCS website at http://3.91.185.66/ and sign in to your account. If you do not have one, make sure to create a new account before continuing. 
2.	Once signed in, navigate to the Add Device section on the homepage. 
3.	Enter the AHCS Device ID and Registration/Verification Code from earlier and select ‘Add Device’. 
4.	If successful, you will receive a prompt saying that the link was successful, if not, ensure you have connected your AHCS device to the internet at least once and you correctly entered the AHCS ID and Registration/Verification code. 
5.	Congratulations! You have successfully connected your AHCS device to the internet and linked it to your account! You can now view the AHCS device’s statistics and data on the ‘Sanitizing Statistics’ page. 

## For Development and Testing
### Embedded Code
#### Install CCS
1. Download CCS from https://www.ti.com/tool/download/CCSTUDIO
2. Proceed through the installer, when asked to select between full and custom installation, choose custom and click next
3. On 'Select Components' Select 'SimpleLink MSP432 low power + performance MCUs'
4. On the next page, select only 'Spectrum Digital Debug Probes and Boards'
5. Proceed until program is installed

#### In CCS
1. Go to File > Import 
2. Choose Code Composer Studio > CCS Projects
3. Clone/Download the repository and select Hardware > Hand-Sanitizing-System as the search directory
4. Select Hand-Sanitizing-System_MSP432 and Finish
5. Hit the hammer icon on the top left bar to build the project (if it is not compiling, ensure that (Active - Debug) appears next to the project name on the project explorer, you can do this by clicking on the project, which 'selects' it as the build target)

### Running the Automatic Hand Cleaning System App (Webapp) on a Local Machine
1. Make sure NodeJS is installed https://nodejs.org/en/
2. Download the repo from GitHub using 
    `git clone https://github.com/davidhutchins/Automatic-Sanitizing-System.git`
3. Install dependencies using: `npm i`
4. Open the command prompt and navigate to the folder containing the server.js file:
   `cd Automatic-Sanitizing-System/Server/sanitizingsystem/src/server`
5. Enter the command `node server.js` to connect to the MongoDB database
6. In another terminal, navigate to this folder:
   `cd Automatic-Sanitizing-System/Server/sanitizingsystem/src`
and run the application with `npm start`
7. In another terminal, navigate to this folder:
   `cd Automatic-Sanitizing-System/Server/sanitizingsystem/src`
and enter the command `node exserver.js` to connect to the Express backend

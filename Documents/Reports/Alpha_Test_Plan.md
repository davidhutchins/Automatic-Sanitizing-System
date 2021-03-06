# Alpha Test Plan   

By David Hutchins, Austin Welch, Branden Evangelista, and Brontë Cadogan

## Specification

### Usability
#### Interface
For this alpha build, the web application pages have been updated, both in functionality and design. The statistics page has been revamped to display a line graph of the number of operations (i.e. the number of times the devices collectively trigger a UVC-light to turn on) over time. The statistics page also includes a pie chart to show the number of times each device (that is connected to the web application) is activated per week. The data to form these plots are pulled from a MongoDB database; the microcontroller(s) write to this database whenever the motion sensor triggers an interrupt to turn on the UVC-light. The setup guide page leads to a PDF that shows how to use our product; this PDF has been updated to show the instructions for building the web application on a local machine (instructions also included at the end of this report).

Interfacing with the UVC-light simply requires a hand motion in front of the motion sensor; the light will toggle on and off depending on whether a person's hand is in front of said sensor. The details outlining the sanitation process is in the "Responsiveness" section of this report.

For future iterations of the project, we should be able to connect more than one microcontroller to this web application and have these multiple devices write to the database concurrently.

#### Navigation
The web application is easy to navigate due to the navigation bar at the top of the web page. Users can switch between the home page, statistics page, setup guide page, and device connection page using this navigation bar.

For future builds, the UI will continue to be updated and will focus on the readability of data coming from the microcontroller. The web application will also aim to read connections from multiple devices.

#### Perception
The current iteration of the hardware (i.e. the microcontroller's connection to the WiFi backpack, bluetooth receiver, UVC-light, and motion sensor) are all connected on a breadboard. For future iterations, this breadboard will be consolidated into one PCB board; this board and our external power source will then be placed in a custom-made housing unit for a more simplistic look.

The product itself should be intuitive in design; users simply need to wave their hand in front of the motion sensor (which will be placed near a door handle) to activate the product's sanitation mode. Any interactions with the hardware will be documented on the web application's "Statistic" page. The data recorded by each microcontroller is consolidated in the statistic page's line graph and pie chart.

#### Responsiveness
The external interface makes use of hardware interrupts and software timers to control the use of the UVC-light. Whenever the motion sensor detects motion near the door handle, an interrupt will be triggered to tell the microcontroller to turn off the UVC-light. As long as the user's hand is over the sensor (or there is constant movement near the motion sensor), the UVC-light should turn off, representing the "safety mode" of the system. Once the user takes their hand away from the sensor, another interrupt will be triggered, turning the UVC-light back on. A software timer is then triggered, allowing the UVC to stay on for four seconds before turning back off again. This process is nearly the same as in the prototype; however, for this alpha build, we have incorporated the UVC-light and connected it to a MOSFET transistor. The MOSFET transistor acts like a switch, allowing us to control when the UVC-light will turn on and off (via the interrupts).

For future builds, this process will move from the breadboard to a PCB, which not only cleans up the aesthetic of the product.

### Build Quality
#### Robustness
In terms of robustness, the hardware is able to handle normal use case scenarios. The MOSFET we are using as a switch for the 24V UV-C LED strip is rated for 60V so usage for this product is well within its parameters. The current power source is connected to a wall socket so we are also well within the parameters for power draw. Migrating this to a portable power source will be a concern for robustness; however, the alpha build is robust in its power needs. Each component of the schematic has been tested individually and as a whole to make sure there are no points of failure on the hardware.

For the microcontroller, the interrupts and timers are robust and are resistant to unusual use cases on the MSP432. The timer can be interrupted before it runs through a full cycle and can smoothly transition to off for safety, and still operate correctly. The communication with our AWS server is as robust as the server itself and will work as long as both the network it is connected to and the server it runs on are up.

Our website will most likely be the least robust as it relies on external APIs and tools. Currently, the website has a basic and functional UI that does not allow too much user input so there are not many unusual use cases that can occur; thus, the website and its function are robust.

#### Consistency
Our system as a whole is consistent in its operation. When it detects movement, it activates an external signal that will enable the UV-C LEDs and send the usage to an AWS server. The website will consistently check for updated information from the database it uses.

#### Aesthetic Rigor
The hardware aesthetic as is will not cause any functional issues in its operation. The UI for the website is polished and provides a clean, consistent, and reliable experience. Unfinished aesthetics on the hardware will not inhibit functionality at all. The aesthetic of the website is established and will continue to be improved however in its current state, it is fully functional and gives a good impression of the final product. 

### Vertical Features
#### External Interface
Just like with the prototype, the external interface can be split into a hardware and software section.

The hardware section builds upon the circuit from the Design Prototype, except it makes use of the UV-C light. The interrupts will allow the state of the MOSFET transistor to be toggled which, when combined with the bidirectional level shifter, can provide 24V to the UV-C light with only a single 3.3V power source connected to the majority of the system.

The software section improves the UI and functionality of the web application. In particular, the web application can successfully read and display data from a MongoDB database. Eventually, the microcontroller will be able to send a ping to an AWS server, which will then be sent to the MongoDB database, allowing the website to track the number of times a microcontroller is used (i.e. an interrupt is sent to turn on the UV-C light).

#### Persistent State
The persistent state of the ACHS will be both the MongoDB database and the AWS web server. The web server will connect to the microcontroller’s WiFi backpack, allowing data from the microcontroller to be sent to this web server. This data will then be sent to the MongoDB database and subsequently be displayed on the web application. Data from the microcontroller will only be sent to the server and database if a user interacts with the motion sensor and turns on the UV-C light.

#### Internal Systems
The data processing comes from the microcontroller’s interaction with the AWS web server. The data that will be displayed on the web application will be the number of times the user interacts with the hardware; this count comes in the form of a ping from the microcontroller to the WiFi backpack. The number of pings the microcontroller sends out is subsequently stored in an AWS server.

For future builds, the AWS server should be able to handle pings from multiple microcontrollers simultaneously, which would allow multiple ACHS products to connect to the web application concurrently. Each product should send out a different ping, allowing the web application to track the use of each device individually.

## Links
- Repo: https://github.com/davidhutchins/Automatic-Sanitizing-System
- Google Drive: https://drive.google.com/drive/u/1/folders/1yFWsin02HhbcQPVtgGXrDhR7vxmtbRYc

## Build Instructions
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
2. Download the repo from GitHub using 
    `git clone https://github.com/davidhutchins/Automatic-Sanitizing-System.git`
3. Install dependencies using: `npm i`
4. Open the command prompt and navigate to the folder containing the server.js file:
   `cd Automatic-Sanitizing-System/Server/sanitizingsystem/src/server`
5. Enter the command `node server.js` to connect to the MongoDB database
6. In another terminal, navigate to this folder:
   `cd Automatic-Sanitizing-System/Server/sanitizingsystem/src`
and run the application with `npm start`
/**********************************************************************
    Copyright 2020 Misty Robotics
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    **WARRANTY DISCLAIMER.**

    * General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY
    ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL
    WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
    INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF
    THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC
    RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO
    WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES
    OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
    * Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT
    YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY
    ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO
    ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT,
    COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE
    OR PRODUCT.

    Please refer to the Misty Robotics End User License Agreement for further
    information and full details:
        https://www.mistyrobotics.com/legal/end-user-license-agreement/
**********************************************************************/

// Misty Wanders Random; uses Time of Flight and Bump Sensors to back up when she gets close to an obstacle
misty.Debug("Centering Head");
misty.MoveHeadDegrees(0, 0, 0, 100);
misty.Pause(3000);

misty.Set("StartTime",(new Date()).toUTCString());
misty.Set("tofTriggeredAt",(new Date()).toUTCString());
misty.Set("tofTriggered", false);
misty.Set("driveStartAt",(new Date()).toUTCString());
misty.Set("timeInDrive", getRandomInt(3, 8));
registerAll();

// Everytime a Time of Flight or Bump sensor callback is triggered 
// 1. Unregister the ToFs and Bump senosrs because we do not want the ToFs to keep triggering the callback indefinitely until the misty backs up
// 2. We execute the corresponding back up drive command 
// 3. After about 4 seconds which I think would be a good time for Misty to have backed up, Re-register to ToFs and Bump Sensors

while (true) {
	misty.Pause(50);
	// Wander - tof
	if (misty.Get("tofTriggered")) {
        if (secondsPast(misty.Get("tofTriggeredAt")) > 4.0) {
            misty.Set("tofTriggered", false);
            registerAll();
        }
    }
	//Wander - drive
    if (secondsPast(misty.Get("driveStartAt")) > misty.Get("timeInDrive") && !misty.Get("tofTriggered")) {
        misty.Set("driveStartAt",(new Date()).toUTCString());
        misty.Drive(getRandomInt(20,25), getRandomInt(-35,35));
        misty.Set("timeInDrive", getRandomInt(3, 8));
    }
}

// ------------------------------------------Supporting Functions------------------------------------------

function secondsPast(value) {
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//--------------------------------------TOFs----------------------------------------------------------------

function _BackTOF(data) {

	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let backTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + backTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + backTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(35, 0, 2500);
	misty.Pause(2500);
}

function _FrontTOF(data) {

	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let frontTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + frontTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + frontTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, 52, 2500);
	misty.Pause(2500);
}

function _LeftTOF(data) {

	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let leftTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + leftTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + leftTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, -52, 2500);	
	misty.Pause(2500);
}

function _RightTOF(data) {

	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let rightTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + rightTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + rightTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, 52, 2500);	
	misty.Pause(2500);
}

//--------------------------------------Bump Sensor----------------------------------------------------------------

function _Bumped(data) {

	unregisterAll();
	misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    var sensor = data.AdditionalResults[0];
	misty.Debug(sensor);
	misty.Drive(0,0,0, 200);
    if (sensor === "Bump_FrontRight") {
		misty.DriveTime(-35, 0, 2500);
		misty.Pause(1000);
		misty.DriveTime(0, 52, 2500);	
		misty.Pause(2500);
	} else if (sensor === "Bump_FrontLeft") {
		misty.DriveTime(-35, 0, 2500);
		misty.Pause(1000);
		misty.DriveTime(0, -52, 2500);	
		misty.Pause(2500);
	} else if (sensor === "Bump_RearLeft") {
		misty.DriveTime(35, 0, 2500);
		misty.Pause(1000);
		misty.DriveTime(0, -52, 2500);
		misty.Pause(2500);
	} else {
		// Bump_RearLeft
		misty.DriveTime(35, 0, 2500);
		misty.Pause(1000);
		misty.DriveTime(0, 52, 2500);	
		misty.Pause(2500);
	}       
 }

 //--------------------------------------Easy Register and Unregister Event ----------------------------------------------

function registerAll() {
	// misty.AddPropertyTest(string eventName, string property, string inequality, string valueAsString, string valueType);
    // misty.RegisterEvent(string eventName, string messageType, int debounce, [bool keepAlive = false], [string callbackRule = “synchronous”], [string skillToCall = null]);
    // Enevent callback function names are event names prefixed with an underscore
	misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string"); 
	misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("FrontTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("LeftTOF", "SensorPosition", "==", "Left", "string"); 
	misty.AddPropertyTest("LeftTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("LeftTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("RightTOF", "SensorPosition", "==", "Right", "string"); 
	misty.AddPropertyTest("RightTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("RightTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string"); 
	misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<=", 0.20, "double"); 
	misty.RegisterEvent("BackTOF", "TimeOfFlight", 0, false);

	misty.AddReturnProperty("Bumped", "sensorName",);
    misty.RegisterEvent("Bumped", "BumpSensor", 250 ,true);

}

function unregisterAll(){

	try {
		misty.UnregisterEvent("FrontTOF");
	} catch(err) {}
	try {
		misty.UnregisterEvent("BackTOF");
	} catch(err) {}
	try {
		misty.UnregisterEvent("RightTOF");
	} catch(err) {}
	try {
		misty.UnregisterEvent("LeftTOF");
	} catch(err) {}
	try {
		misty.UnregisterEvent("Bumped");
	} catch(err) {}
}

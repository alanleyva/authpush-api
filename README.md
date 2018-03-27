# Authpush API
Hey there! You're probably here to make your apps better with Authpush, a new, simplified and secure notification service from Authbase. We're here just to tell you how it works. It's simple - don't worry!

## Register an App
Create an [Authbase account](https://authbase.co/register) (if you haven't already), log in, and navigate to [https://authbase.co/authpush/app/new](https://authbase.co/authpush/app/new). Add a name for your app (this can't be changed, so make it good), click 'Create App', and your app has been made. You can add an App IMG and description in the Settings page.

To use the Authpush API, you need your App ID and your App Secret. These can be found in the 'General' menu by scrolling down. 

*Important: you should never show your App Secret to anyone. Doing so will mean they can send notifications pretending to be your app. Never use the Authpush API on the client side of your site.*

## Installing the API
It is required that the Authpush API is ran on the server-side and not on the client-side for security reasons.
### JS API
You can install the Authpush API from npm by running:

`npm install authpush`
### REST API
The base URL for the Rest API is:

V1: `https://authbase.co/api/v1/`

You may wish to set this as a variable. In the examples below, we have set 
`baseURL` to `https://authbase.co/api/v1`. There are no URL params or optional parameters.

## Using the API
### Setting Up
#### REST API
If you're using the REST API, to verify the App ID and App Secret, send a request to the following page:

* **URL**

	/ap-authenticateApp
	
* **Method:**

	`POST`

* **Data Params**
	
	```
	{
		appID: appID,
		appSecret: appSecret
	}
	```

* **Response:**
 - response: See [Response Types](#response-types).

* **Sample Call:**

	In this example, we will use the [jQuery](https://jquery.com) library for sending a POST request to the endpoint. 
	
	```javascript
	$.post(baseURL + "/ap-authenticateApp", {
		appID: "yourAppID",
		appSecret: "yourAppSecret"
	}, function(res){
		if(res.response == "OK"){
			console.log("Successfully authenticated!");
		} else if(res.response == "N/A-AUTH") {
			console.log("The appID or appSecret is incorrect.");
		} else {
			console.log("An error occured.");
		}
	});
	```

#### JS API
If you're using the JS API, to set the App ID and App Secret, just use:

```javascript
Authpush.authenticate({
	appID: "yourAppID",
	appSecret: "yourAppSecret"
}, function(res){
	if(res.response == "OK"){
		console.log("Successfully authenticated!");
	} else if(res.response == "N/A-AUTH") {
		console.log("The appID or appSecret is incorrect.");
	} else {
		console.log("An error occured.");
	}
});
```

The Authpush API will remember these credentials whilst running.
#### Response

 - response: See [Response Types](#response-types).

### Retrieving the User ID
To send a push notification to a specific user, you will need their User ID and UUID. Their User ID can be found by hashing their email using an MD5 encryption. For example:

`support@authbase.co > BC6585ACEAF97EB30EB36B1C8C13D4AD`

*Optional: You can use the [md5 npm package](https://www.npmjs.com/package/md5) to do this.*

### Retrieving the UUID
#### REST API
If you're using the REST API, to send a notification to a user, you will need their UUID. The users UUID can be found by doing:

* **URL**

	/ap-getUUID
	
* **Method:**

	`POST`

* **Data Params**
	
	```
	{
		userID: userID,
		appID: appID,
		appSecret: appSecret
	}
	```
	
* **Response:**
 - response: See [Response Types](#response-types).
   - data
     - UUID: JSON Array of User ID's associated with the User ID. Sorted by date enrolled.

* **Sample Call:**

	In this example, we will use the [jQuery](https://jquery.com) library for sending a POST request to the endpoint. 
	
	```javascript
	$.post(baseURL + "/ap-getUUID", {
		userID: "BC6585ACEAF97EB30EB36B1C8C13D4AD"
		appID: "yourAppID",
		appSecret: "yourAppSecret",
	}, function(res){
		if(res.response == "OK"){
			if(res.data.UUID.length > 0){
				console.log("UUID: " + res.data.UUID[0]);
			} else {
				console.log("No users with this userID was found.");
			}
		} else {
			console.log("An error occured whilst trying to retrieve a UUID.");
		}
	});
	```

#### JS API
If you're using the JS API, to send a notification to a user, you will need their UUID. This can be retrieved from their userID. It also requires you to [have been authenticated](#setting-up) with the Authpush API. The users UUID can be found by doing:

```javascript
Authpush.get.UUID(userID, function(res){
	if(res.response == "OK"){
		if(res.data.UUID.length > 0){
			console.log("UUID: " + res.data.UUID[0]);
		} else {
			console.log("No users with this userID was found.");
		}
	} else {
		console.log("An error occured whilst trying to retrieve a UUID.");
	}
});
```

This will return a JSON Object:

#### Response

 - response: See [Response Types](#response-types).
   - data
     - UUID: JSON Array of User ID's associated with the User ID. Sorted by date enrolled.

### Sending a Notification
### Specific User
Sending a notification to a specific user allows you to notify them of any event. As Authpush supports Android, you won't have to use different code for your iOS / Android users, Authpush handles it automatically.
#### REST API
If you're using the REST API, to send a notification to a specific users, you will need the [UUID](#retrieving-the-uuid), send a request to the following page:

* **URL**

	/ap-sendNotification
	
* **Method:**

	`POST`

* **Data Params**
	
	```
	{
        authPayload: JSON.stringify({
            noti: {
                msg: "This is an example notification."
            },
            data: {
                to: {
                    userID: userID,
                    UUID: UUID
                },
                from: {
                    appID: "yourAppID",
                    appSecret: "yourAppSecret"
                }
            }
        }),
        dataType: "JSON"
	}
	```
	
* **Response:**
	* response: See [Response Types](#response-types).

* **Sample Call:**

	In this example, we will use the [jQuery](https://jquery.com) library for sending a POST request to the endpoint. 

	```javascript
	$.post(baseURL + "/ap-sendNotification",{
        authPayload: JSON.stringify({
            noti: {
                msg: "This is an example notification."
            },
            data: {
                to: {
                    userID: userID,
                    UUID: UUID
                },
                from: {
                    appID: "yourAppID",
                    appSecret: "yourAppSecret"
                }
            }
        }),
        dataType: "JSON"
	}, function(res){
	    if(res.response == "OK"){
	        console.log("Notification sent!");
	    } else {
	        console.log("An error occured whilst trying to send this notification.");
	    }
	});
	```
	

#### JS API
Sending a notification requires the User ID, and the UUID. It also requires you to [have been authenticated](#setting-up) with the Authpush API.

```
var payload = {
    noti: {
        msg: "This is an example notification."
        imgUrl
    },
    data: {
        to: {
            userID: userID,
            UUID: UUID
        }
    }
};

Authpush.push.notification.specific(payload, function(res){
    if(res.response == "OK"){
        console.log("Notification sent!");
    } else {
        console.log("An error occured whilst trying to send this notification.");
    }
});
```
    
This will send the message "Hello World!" to the users phone. It will display as:

![Example Authpush Notification](https://i.imgur.com/U9smGTF.jpg)
The notification features the title of the app in bold (in the case of the screenshot, it is 'Rapid') and the body of the notification below.

See [Optional Notification Options](#optional-notification-options) for more parameters to make your notifications stand out.

#### Response

 - response: See [Response Types](#response-types).

### All Users
Sending a notification to all users is simular to sending a notification to [sending a notification to a specific user](#specific-user). In your payload, under data, 'to' needs to be set to the string `ALL USERS`.

#### REST API
```
var payload = {
    noti: {
        msg: "This is an example notification."
    },
    data: {
        to: "ALL_USERS",
        from: {
            appID: "yourAppID",
            appSecret: "appSecret"
        }
    }
};
```

#### JS API
```
var payload = {
    noti: {
        msg: "This is an example notification."
    },
    data: {
        to: "ALL_USERS"
    }
};
```

See [Optional Notification Options](#optional-notification-options) for more parameters to make your notifications stand out.

#### Response

 - response: See [Response Types](#response-types).
    
### Response Types
Every request will return a JSON object with a 'response' item. The response types for this item are:

- OK
	- The request was successful
- ERR
	- An unknown error occured.
- ERR{ INT }
	- A connection error occured with the ID of { INT }
- 404-USER
	- The user was not found.
- 404-APP
	- The app was not found, or the authentication information was incorrect.
- N/A
	- Not found (General)
- N/A-AUTH
	- You have not yet authenticated with your App ID and App Secret. See [Setting Up](#setting-up).

### Optional Notification Options

You can pass `imgUrl` under `noti` in the JSON object to allow users running Authpush for iOS 1.2 or above to view an image embed in the notification.

You may also wish to pass `sound` under `noti` in the JSON object to allow users running Authpush for iOS 1.2 or above to hear a pre-defined Authpush notification sound. The possible values are:

* default
    * The default notification sound.
* tone
    * A long electronic synth sound.
    * https://authbase.co/assets/sound/tone.wav
* short
    * A short blocky notification sound.
    * https://authbase.co/assets/sound/short.wav
* playful
    * A medium rattly, but playful sound.
    * https://authbase.co/assets/sound/playful.wav

Both `sound` and `imgUrl` are optional.

## Upcoming Features

We are always looking to improve the API to accommidate for developers needs. This is what we're working on:

 - Specific UUID Selecting
 - Rich Push Notifications
	 - Images
	 - URL Linking
 - Profiles
	 - Different Authpush apps for different areas of your code.

# Support

Have any issues using the API? Feel free to email us at [support@authbase.co](mailto:support@authbase.co).

# Licence

The Authpush API is licenced under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International Licence. Read more about it [here](https://creativecommons.org/licenses/by-nc-nd/4.0/).
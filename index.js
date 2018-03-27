var request = require("request");
var md5 = require("md5");
var isJSON = require("is-json");

let apResponses = {
    INPUT_NOT_VALID: "INPUT-NOT-VALID",
    GENERAL_ERROR: "ERR"
};

var urlBase = "http://localhost:5000"

var apTokens = {
    appID: null,
    appSecret: null
};

var AuthpushAPIBE = {
    checkTokenStatus: function(){
        if(apTokens.appID != null && apTokens.appSecret != null){
            return true;
        } else {
            return false;
        }
    },
    sendNotification: function(payload, callback) {
        var toData = {};
        var shouldProceed = true;

        if(payload.data.to == "ALL_USERS"){
            toData = "ALL_USERS";
        } else if(payload.data.to.userID != null && payload.data.to.UUID != null) {
            toData = payload.data.to;
        } else {
            shouldProceed = false;
        }

        if(payload.data){
            payload.data.from = {
                appID: apTokens.appID,
                appSecret: apTokens.appSecret
            }
        } else {
            shouldProceed = false;
        }

        if(AuthpushAPIBE.checkTokenStatus()){
            if(payload.noti.msg){
                request.post({
                    url: urlBase + "/api/v1/ap-sendNotification",
                    form: {
                        authPayload: JSON.stringify(payload),
                        dataType: "JSON"
                    }
                }, function(err, httpResponse, body){
                    if(err){
                        callback({
                            response: apResponses.GENERAL_ERROR
                        });
                    } else {
                        if(httpResponse){
                            if(httpResponse.statusCode == 200){
                                if(body){
                                    if(isJSON(body)){
                                        var response = JSON.parse(body);
                                        var fResponse = {
                                            response: response.response
                                        };
                                        if(response.data){
                                            fResponse.data = response.data
                                        }
                                        callback(fResponse);
                                    } else {
                                        callback({
                                            response: apResponses.GENERAL_ERROR,
                                            geCode: 5
                                        });
                                    }
                                } else {
                                    callback({
                                        response: apResponses.GENERAL_ERROR,
                                        geCode: 4
                                    });
                                }
                            } else {
                                callback({
                                    response: apResponses.GENERAL_ERROR,
                                    geCode: 3
                                });
                            }
                        } else {
                            callback({
                                response: apResponses.GENERAL_ERROR,
                                geCode: 2
                            });
                        }
                    }
                });
            } else {
                callback({
                    response: apResponses.INPUT_NOT_VALID,
                    geCode: 1
                });
            }
        } else {
            callback({
                response: apResponses.INPUT_NOT_VALID,
                geCode: 0
            });
        }    
    },
    authenticate: function(appID, appSecret, callback) {
        if(appID && appSecret) {
            if(appID.length == 10 && appSecret.length == 10){
                request.post({
                    url: urlBase + "/api/v1/ap-authenticateApp",
                    form: {
                        appID: appID,
                        appSecret: appSecret
                    }
                }, function(err, httpResponse, body){
                    if(err){
                        callback({
                            response: apResponses.GENERAL_ERROR
                        });
                    } else {
                        if(httpResponse){
                            if(httpResponse.statusCode == 200){
                                if(body){
                                    if(isJSON(body)){
                                        var response = JSON.parse(body);
                                        if(response.response == "OK"){
                                            apTokens.appID = appID;
                                            apTokens.appSecret = appSecret;
                                        }
                                        callback({
                                            response: response.response
                                        });
                                    } else {
                                        callback({
                                            response: apResponses.GENERAL_ERROR,
                                            geError: 5
                                        });
                                    }
                                } else {
                                    callback({
                                        response: apResponses.GENERAL_ERROR,
                                        geError: 4
                                    });
                                }
                            } else {
                                callback({
                                    response: apResponses.GENERAL_ERROR,
                                    geError: 3
                                });
                            }
                        } else {
                            callback({
                                response: apResponses.GENERAL_ERROR,
                                geError: 2
                            });
                        }
                    }
                });
            } else {
                callback({
                    response: apResponses.INPUT_NOT_VALID,
                    geError: 1
                });
            }
        } else {
            callback({
                response: apResponses.INPUT_NOT_VALID,
                geError: 0
            });
        }
    },
    get: {
        UUID: function(userID, callback){
            if(AuthpushAPIBE.checkTokenStatus()){
                if(userID){
                    request.post({
                        url: urlBase + "/api/v1/ap-getUUID",
                        form: {
                            appID: apTokens.appID,
                            appSecret: apTokens.appSecret,
                            userID: userID
                        }
                    }, function(err, httpResponse, body){
                        if(err){
                            callback({
                                response: apResponses.GENERAL_ERROR
                            });
                        } else {
                            if(httpResponse){
                                if(httpResponse.statusCode == 200){
                                    if(body){
                                        if(isJSON(body)){
                                            var response = JSON.parse(body);
                                            var fResponse = {
                                                response: response.response
                                            };
                                            if(response.data){
                                                fResponse.data = response.data
                                            }
                                            callback(fResponse);
                                        } else {
                                            callback({
                                                response: apResponses.GENERAL_ERROR,
                                                geCode: 5
                                            });
                                        }
                                    } else {
                                        callback({
                                            response: apResponses.GENERAL_ERROR,
                                            geCode: 4
                                        });
                                    }
                                } else {
                                    callback({
                                        response: apResponses.GENERAL_ERROR,
                                        geCode: 3
                                    });
                                }
                            } else {
                                callback({
                                    response: apResponses.GENERAL_ERROR,
                                    geCode: 2
                                });
                            }
                        }
                    });
                } else {
                    callback({
                        response: apResponses.INPUT_NOT_VALID,
                        geCode: 1
                    });
                }
            } else {
                callback({
                    response: apResponses.INPUT_NOT_VALID,
                    geCode: 0
                });
            }  
        }
    }
};

exports.authenticate = function(payload, callback) {
    var appID = payload.appID,
        appSecret = payload.appSecret;

    AuthpushAPIBE.authenticate(appID, appSecret, function(res){
        callback(res);
    })
};

exports.get = {
    UUID: function(userID, callback) {
        AuthpushAPIBE.get.UUID(userID, function(res){
            callback(res);
        });  
    }
}

exports.push = {
    notification: {
        specific: function(payload, callback) {
            AuthpushAPIBE.sendNotification(payload, function(res){
                callback(res);
            });
        },
        all: function(payload, callback) {
            payload.userID = "ALL_USERS";
            payload.UUID = "ALL_USERS";
            AuthpushAPIBE.sendNotification(payload, function(res){
                callback(res);
            });
        }
    }
}
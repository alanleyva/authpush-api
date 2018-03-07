var request = require("request");
var md5 = require("md5");
var isJSON = require("is-json");

let apResponses = {
    INPUT_NOT_VALID: "INPUT-NOT-VALID",
    GENERAL_ERROR: "ERR"
};

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
        var message = payload.message,
        userID = payload.userID,
        UUID = payload.UUID;
        if(AuthpushAPIBE.checkTokenStatus()){
            if(message && userID && UUID){
                request.post({
                    url: "http://localhost:3000/api/v1/ap-sendNotification",
                    form: {
                        msg: message,
                        userID: userID,
                        UUID: UUID,
                        appID: apTokens.appID,
                        appSecret: apTokens.appSecret
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

exports.authenticate = function(payload, callback) {
    var appID = payload.appID,
        appSecret = payload.appSecret;

    if(appID && appSecret) {
        if(appID.length == 10 && appSecret.length == 10){
            request.post({
                url: "http://localhost:3000/api/v1/ap-authenticateApp",
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
};

exports.get = {
    UUID: function(userID, callback) {
        if(AuthpushAPIBE.checkTokenStatus()){
            if(userID){
                request.post({
                    url: "http://localhost:3000/api/v1/ap-getUUID",
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
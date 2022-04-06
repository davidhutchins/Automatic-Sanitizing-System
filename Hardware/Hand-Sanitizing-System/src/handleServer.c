#include "handleServer.h"

char requestParams[512];

uint8_t incrementInteractionCounter(char* deviceID) {
    sprintf(requestParams, "/api/updateInteractions?deviceId=%s", deviceID);
    sendRequestToServer(requestParams);
    if (searchResponse("success")) {
        return 1;
    }

    return 0;
}

uint8_t sendRegistrationCode(char* deviceID, char* regCode) {
    sprintf(requestParams, "/api/handleData/register?deviceId=%s&verificationCode=%s", deviceID, regCode);
    sendRequestToServer(requestParams);
    if (searchResponse("success")) {
        return 1;
    }

    return 0;
}

uint8_t test() {
   sendRequestToServer("/api/ping");
   if (searchResponse("pong"))
   {
       printf("Pinged Server!\n");
       return 1;
   }
   return 0;
}

#include "handleServer.h"

char requestParams[512];

uint8_t incrementInteractionCounter(int16_t handleID) {
    sprintf(requestParams, "/api/updateInteractions?handleId=%u", handleID);
    sendRequestToServer(requestParams);
    if (searchResponse("success")) {
        return 1;
    }

    return 0;
}

uint8_t sendRegistrationCode(int16_t handleID, int32_t regCode) {
    sprintf(requestParams, "/api/handleData/register?handleId=%u&verificationCode=%u", handleID, regCode);
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

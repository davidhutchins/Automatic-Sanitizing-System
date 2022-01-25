#include "handleServer.h"

char requestParams[512];

uint8_t incrementInteractionCounter(int16_t handleID) {
    sprintf(requestParams, "/incrementCounter/%u", handleID);
    sendRequestToServer(requestParams);
    if (strstr(serverResponse, "Success")) {
        return 1;
    }

    return 0;
}

uint8_t updateBatteryLevel(int16_t handleID, int16_t powerLevel) {
    sprintf(requestParams, "/updateBatteryLevel/%u/%u", handleID, powerLevel);
    sendRequestToServer(requestParams);
    if (strstr(serverResponse, "Success")) {
        return 1;
    }

    return 0;
}

#include <msp430.h> 
#include "wifi_usage.h"

#define WEBPAGE "34.227.194.176"
 
signed char SSID_NAME[100]   =    "hotspot";
char PASSKEY[100]     =    "hotspotpassword";   

int main(void)
{
    char request[1024];
    char requestTemplate[512];
    char parsedResponse[1024];

    WDT_A_hold(WDT_A_BASE);
    PMM_unlockLPM5();
    printf("Starting!");
	
	int32_t retVal;

    sprintf(requestTemplate, "GET %s HTTP/1.1\r\nHost:%s\r\n\r\n", "%s", WEBPAGE);

    retVal = configureSimpleLinkToDefaultState();
    if (retVal < 0)
        printf("Error with SL configuration!");

    sl_Start(0, 0, 0);

    retVal = establishConnectionWithAP();
    if (retVal < 0)
        printf("Could not connect to AP!");

    sl_NetAppDnsGetHostByName((_i8 *)WEBPAGE, strlen(WEBPAGE), &DestinationIP, SL_AF_INET);

    sprintf(request, requestTemplate, "/ping");
    if (sendRequestToServer(request))
    {
        
        parseServerResponse(parsedResponse, "pre-wrap\">");
        if (strstr(parsedResponse, "pong"))
        {
            printf("Connected to Server!\n");
            return 1;
        }
    }

    printf("Could not connect to server. Retrying.\n");
    return 0;
	
}

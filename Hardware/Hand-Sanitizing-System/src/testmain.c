#include <msp432.h>
#include <wifi_functions.h>
#include "handleServer.h"
#include "BSP.h"
#include <stdlib.h>
#include <stdio.h>

#define HANDLE_ID 30

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD;

    BSP_InitBoard();


    int choice;
    printf("\n1. Connect to WIFI\n2. Change WIFI Settings\n");
    scanf("%d", &choice);

    if (choice == 2) {
        int16_t retVal = configureSimpleLinkToDefaultState();
        if (retVal < 0)
            printf("Error with SL configuration!");

        int32_t mode = 0;
        uint8_t SecType = 0;

        mode = sl_Start(0, 0, 0);
        if(mode < 0){
            LOOP_FOREVER();
        }

        else {
            if (ROLE_AP == mode) {
                /* If the device is in AP mode, we need to wait for this
                 * event before doing anything */
                while(!IS_IP_ACQUIRED(g_Status)) { _SlNonOsMainLoopTask(); }
            }
            else
            {
                /* Configure CC3100 to start in AP mode */
                retVal = sl_WlanSetMode(ROLE_AP);
                if(retVal < 0)
                    LOOP_FOREVER();
            }
        }

        /* Configure AP mode without security */
        retVal = sl_WlanSet(SL_WLAN_CFG_AP_ID, WLAN_AP_OPT_SSID,
                   pal_Strlen(SSID_AP_MODE), (_u8 *)SSID_AP_MODE);
        if(retVal < 0)
            LOOP_FOREVER();

        SecType = SEC_TYPE_AP_MODE;
        /* Configure the Security parameter in the AP mode */
        retVal = sl_WlanSet(SL_WLAN_CFG_AP_ID, WLAN_AP_OPT_SECURITY_TYPE, 1,
                (_u8 *)&SecType);
        if(retVal < 0)
            LOOP_FOREVER();

        retVal = sl_WlanSet(SL_WLAN_CFG_AP_ID, WLAN_AP_OPT_PASSWORD, pal_Strlen(PASSWORD_AP_MODE),
                (_u8 *)PASSWORD_AP_MODE);
        if(retVal < 0)
            LOOP_FOREVER();
        /* Restart the CC3100 */
        retVal = sl_Stop(SL_STOP_TIMEOUT);
        if(retVal < 0)
            LOOP_FOREVER();

        g_Status = 0;

        mode = sl_Start(0, 0, 0);
        if (ROLE_AP == mode)
        {
            /* If the device is in AP mode, we need to wait for this event before doing anything */
            while(!IS_IP_ACQUIRED(g_Status)) { _SlNonOsMainLoopTask(); }
        }
        else
        {
            printf(" Device couldn't come in AP mode \n\r");
            LOOP_FOREVER();
        }

        printf(" \r\n Device is configured in AP mode \n\r");

        printf(" Waiting for client to connect\n\r");
        /* wait for client to connect */
        while((!IS_IP_LEASED(g_Status)) || (!IS_STA_CONNECTED(g_Status))) { _SlNonOsMainLoopTask(); }

        while(disconnectFlag == 0)
        {
            _SlNonOsMainLoopTask();
        }
        retVal = sl_Stop(SL_STOP_TIMEOUT);
    }

    while(wifi_init() != 1);

    while(1);
}

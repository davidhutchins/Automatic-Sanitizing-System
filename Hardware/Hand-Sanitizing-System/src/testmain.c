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
    printf("\n1. Connect to WIFI\n2. Change WIFI Settings\n3. Reset WIFI\n4. Manual Configuration\n");
    scanf("%d", &choice);

    if (choice == 2) {
        AP_init();

    } if (choice == 3) {
        int32_t retVal = -1;
        int32_t mode = -1;

        mode = sl_Start(0, 0, 0);
        ASSERT_ON_ERROR(mode);

        /* If the device is not in station-mode, try configuring it in station-mode */
        if (ROLE_STA != mode)
        {
            if (ROLE_AP == mode)
            {
                /* If the device is in AP mode, we need to wait for this event before doing anything */
                while (!IS_IP_ACQUIRED(g_Status))
                {
                    _SlNonOsMainLoopTask();
                }
            }

            /* Switch to STA role and restart */
            retVal = sl_WlanSetMode(ROLE_STA);
            ASSERT_ON_ERROR(retVal);

            retVal = sl_Stop(SL_STOP_TIMEOUT);
            ASSERT_ON_ERROR(retVal);

            retVal = sl_Start(0, 0, 0);
            ASSERT_ON_ERROR(retVal);

            /* Check if the device is in station again */
            if (ROLE_STA != retVal)
            {
                /* We don't want to proceed if the device is not coming up in station-mode */
                ASSERT_ON_ERROR(-0x7D0);
            }
        }

        retVal = sl_Stop(SL_STOP_TIMEOUT);

        printf("\nWIFI settings reset!\n");
    } if (choice == 4) {
        signed char SSID[32];
        signed char PASS[32];
        printf("\nEnter SSID\n");
        fflush(stdin);
        scanf("%[^\n]s", SSID);
        printf("\nEnter Pass\n");
        scanf("%s", PASS);

        sl_Start(0, 0, 0);

        configureProfile(SSID, PASS, 2);

        sl_Stop(SL_STOP_TIMEOUT);
    }

    while(wifi_init() != 1);

    while(1);
}

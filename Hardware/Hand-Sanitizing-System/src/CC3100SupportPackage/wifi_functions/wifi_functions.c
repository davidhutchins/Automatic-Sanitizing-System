/*
 * Based on code provided in UT.6.02x Embedded Systems - Shape the World
 * by Jonathan Valvano and Ramesh Yerraballi
 * June 21, 2019
*/

#include "wifi_functions.h"

char SSID_AP_MODE[100]       =    "AHCS-%s";

char DEVICE_ID[] = "593";
char REG_CODE[] = "716928";

char Recvbuff[MAX_RECV_BUFF_SIZE];
char SendBuff[MAX_SEND_BUFF_SIZE];

uint8_t stopConnectionAttempt = 0;
uint8_t connectionTimerCount = 0;

typedef struct updateConnectionConfig {
     signed char SSID[32];
     uint8_t sec;
     signed char pass[128];
} updateConnectionConfig_t;

updateConnectionConfig_t connConf;
int8_t updateFlag = 0;
int8_t disconnectFlag = 0;


uint8_t wifi_init()
{
    int32_t retVal;

    sprintf(requestTemplate, "GET %s HTTP/1.1\r\nHost:%s\r\n\r\n", "%s", WEBPAGE);

    retVal = configureSimpleLinkToDefaultState();
    if (retVal < 0)
        printf("Error with SL configuration!");

    sl_Start(0, 0, 0);

    Delay(750); // Delay as wifi module needs a second switching from AP to Station mode

    if(establishConnectionWithAP() < 0) {
        printf("Could not establish connection with AP.\n");
    }

    sl_NetAppDnsGetHostByName((_i8 *)WEBPAGE, strlen(WEBPAGE), &DestinationIP, SL_AF_INET);

    sendRequestToServer("/api/ping");
    if (searchResponse("pong"))
    {
        printf("Connected to Server!\n");
        return 1;
    }

    printf("Could not connect to server.\n");
    sl_Stop(SL_STOP_TIMEOUT);
    return 0;
}

void AP_init()
{
    sprintf(SSID_AP_MODE, SSID_AP_MODE, DEVICE_ID);

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
        printf("Device couldn't come in AP mode \n\r");
        LOOP_FOREVER();
    }

    printf("\r\nDevice is configured in AP mode");
    printf("\r\nWaiting for client to connect\n\r");

    while((!IS_IP_LEASED(g_Status))) { _SlNonOsMainLoopTask(); }

    printf("Client Connected!\n\r");

    while(disconnectFlag == 0)
    {
        _SlNonOsMainLoopTask();
    }

    printf("Client disconnected, restarting in station mode!\n\r");
    retVal = sl_Stop(SL_STOP_TIMEOUT);

    retVal = configureSimpleLinkToDefaultState();
    if (updateFlag) {
        sl_Start(0, 0, 0);

        configureProfile(connConf.SSID, connConf.pass, connConf.sec);

        sl_Stop(SL_STOP_TIMEOUT);
    }
}

int32_t sendRequestToServer(char* requestParams)
{
    sprintf(request, requestTemplate, requestParams);

    int32_t retVal;
    int32_t ASize = 0;
    SlSockAddrIn_t Addr;
    memset(Recvbuff, 0, MAX_RECV_BUFF_SIZE);

    Addr.sin_family = SL_AF_INET;
    Addr.sin_port = sl_Htons(PORT);
    Addr.sin_addr.s_addr = sl_Htonl(DestinationIP);
    ASize = sizeof(SlSockAddrIn_t);
    SockID = sl_Socket(SL_AF_INET, SL_SOCK_STREAM, 0);

    if (SockID >= 0) {
        retVal = sl_Connect(SockID, (SlSockAddr_t *)&Addr, ASize);

        if ((SockID >= 0) && (retVal >= 0)) {
            strcpy(SendBuff, request);
            sl_Send(SockID, SendBuff, strlen(SendBuff), 0);
            sl_Recv(SockID, Recvbuff, MAX_RECV_BUFF_SIZE, 0);
            sl_Close(SockID);
        }
        else{
            restartWIFI();
            return 0;
        }
    }
    else {
        restartWIFI();
        return 0;
    }

    return 1;
}

uint8_t searchResponse(char* keyword)
{
    char *pt = strstr(Recvbuff, keyword);
    if (pt != 0)
        return 1;
    else
        return 0;
}

void parseServerResponse(char* parsedResponse, char* keyword)
{
    char *pt = 0;
    char *endpt = 0;
    char parsedRecvBuff[MAX_RECV_BUFF_SIZE];

    pt = strstr(Recvbuff, keyword);
    endpt = strstr(Recvbuff, "</span>");
    *endpt = '\0';

    int i = 0;
    if(pt != 0){
        pt += strlen(keyword);
        while(pt < endpt){
            parsedRecvBuff[i] = *pt;
            pt++; i++;
        }
        strcpy(parsedResponse, parsedRecvBuff);
        parsedResponse[i] = '\0';
    } else {
        strcpy(parsedResponse, Recvbuff);
        printf("Could not parse response, received buffer:\n%s", parsedResponse);
        restartWIFI();
    }
}

void restartWIFI()
{
    disconnectFromAP();
    sl_Stop(SL_STOP_TIMEOUT);

    sl_Start(0, 0, 0);
    establishConnectionWithAP();
}


/*
    Supplementary Functions
*/

/*
    \brief This function configure the SimpleLink device in its default state. It:
           - Sets the mode to STATION
           - Configures connection policy to Auto and AutoSmartConfig
           - Deletes all the stored profiles
           - Enables DHCP
           - Disables Scan policy
           - Sets Tx power to maximum
           - Sets power policy to normal
           - Unregisters mDNS services
           - Remove all filters

    \param[in]      none

    \return         On success, zero is returned. On error, negative is returned
*/

int32_t configureSimpleLinkToDefaultState(void)
{
    SlVersionFull ver = {0};
    _WlanRxFilterOperationCommandBuff_t RxFilterIdMask = {0};

    _u8 val = 1;
    _u8 configOpt = 0;
    _u8 configLen = 0;
    _u8 power = 0;

    int32_t retVal = -1;
    int32_t mode = -1;

    mode = sl_Start(0, 0, 0);
    Delay(750);
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

    /* Get the device's version-information */
    configOpt = SL_DEVICE_GENERAL_VERSION;
    configLen = sizeof(ver);
    retVal = sl_DevGet(SL_DEVICE_GENERAL_CONFIGURATION, &configOpt, &configLen, (_u8 *)(&ver));
    ASSERT_ON_ERROR(retVal);

    retVal = sl_WlanPolicySet(SL_POLICY_CONNECTION ,
                         SL_CONNECTION_POLICY(1,0,0,0,0), 0, 0);
    /*
     * Device in station-mode. Disconnect previous connection if any
     * The function returns 0 if 'Disconnected done', negative number if already disconnected
     * Wait for 'disconnection' event if 0 is returned, Ignore other return-codes
     */
    retVal = sl_WlanDisconnect();
    if (0 == retVal)
    {
        /* Wait */
        while (IS_CONNECTED(g_Status))
        {
            _SlNonOsMainLoopTask();
        }
    }

    /* Enable DHCP client*/
    retVal = sl_NetCfgSet(SL_IPV4_STA_P2P_CL_DHCP_ENABLE, 1, 1, &val);
    ASSERT_ON_ERROR(retVal);

    /* Disable scan */
    configOpt = SL_SCAN_POLICY(0);
    retVal = sl_WlanPolicySet(SL_POLICY_SCAN, configOpt, NULL, 0);
    ASSERT_ON_ERROR(retVal);

    /* Set Tx power level for station mode
       Number between 0-15, as dB offset from max power - 0 will set maximum power */
    power = 0;
    retVal = sl_WlanSet(SL_WLAN_CFG_GENERAL_PARAM_ID, WLAN_GENERAL_PARAM_OPT_STA_TX_POWER, 1, (_u8 *)&power);
    ASSERT_ON_ERROR(retVal);

    /* Set PM policy to normal */
    retVal = sl_WlanPolicySet(SL_POLICY_PM, SL_NORMAL_POLICY, NULL, 0);
    ASSERT_ON_ERROR(retVal);

    /* Unregister mDNS services */
    retVal = sl_NetAppMDNSUnRegisterService(0, 0);
    ASSERT_ON_ERROR(retVal);

    /* Remove  all 64 filters (8*8) */
    pal_Memset(RxFilterIdMask.FilterIdMask, 0xFF, 8);
    retVal = sl_WlanRxFilterSet(SL_REMOVE_RX_FILTER, (_u8 *)&RxFilterIdMask,
                                sizeof(_WlanRxFilterOperationCommandBuff_t));
    ASSERT_ON_ERROR(retVal);

    retVal = sl_Stop(SL_STOP_TIMEOUT);
    ASSERT_ON_ERROR(retVal);

    return retVal; /* Success */
}


///*!
//    \brief Connecting to a WLAN Access point
//
//    This function connects to the required AP (SSID_NAME).
//    The function will return once we are connected and have acquired IP address
//
//    \param[in]  None
//
//    \return     0 on success, negative error-code on error
//
//    \note
//
//    \warning    If the WLAN connection fails or we don't acquire an IP address,
//                We will be stuck in this function forever.
//*/
int32_t establishConnectionWithAP(void)
{
    connectionTimer_init();
    NVIC_EnableIRQ(TA2_0_IRQn);

    connectionTimer_start();

    while ((!IS_CONNECTED(g_Status)) || (!IS_IP_ACQUIRED(g_Status)))
    {
        _SlNonOsMainLoopTask();

        if (stopConnectionAttempt) {
            return FAILURE;
        }
    }

    connectionTimer_stop();
    return SUCCESS;
}


///*!
//    \brief Disconnecting from a WLAN Access point
//
//    This function disconnects from the connected AP
//
//    \param[in]      None
//
//    \return         none
//
//    \note
//
//    \warning        If the WLAN disconnection fails, we will be stuck in this function forever.
//*/
int32_t disconnectFromAP(void)
{
    uint32_t retVal = -1;

    /*
     * The function returns 0 if 'Disconnected done', negative number if already disconnected
     * Wait for 'disconnection' event if 0 is returned, Ignore other return-codes
     */
    retVal = sl_WlanDisconnect();
    if (0 == retVal)
    {
        /* Wait */
        while (IS_CONNECTED(g_Status))
        {
            _SlNonOsMainLoopTask();
        }
    }

    return SUCCESS;
}

uint8_t configureProfile(signed char* SEC_SSID_NAME, signed char* SEC_SSID_KEY, uint8_t SEC)
{
    int8_t retVal = sl_WlanProfileDel(0xFF);

    _u8   g_BSSID[SL_BSSID_LENGTH];
    pal_Memset(g_BSSID, 0, sizeof(g_BSSID));

    SlSecParams_t secParams = {0};
    secParams.Type = SEC;
    secParams.Key = SEC_SSID_KEY;
    secParams.KeyLen = pal_Strlen(SEC_SSID_KEY);
    retVal = sl_WlanProfileAdd((_i8 *)SEC_SSID_NAME,
    pal_Strlen(SEC_SSID_NAME), g_BSSID, &secParams, 0, 7, 0);
    ASSERT_ON_ERROR(retVal);

    return SUCCESS;
}


/* EVENT HANDLERS */

/*
    \brief This function handles WLAN events
    \param[in]      pWlanEvent is the event passed to the handler
    \return         None
    \note
    \warning
 */
void SimpleLinkWlanEventHandler(SlWlanEvent_t *pWlanEvent)
{
    if(pWlanEvent == NULL)
    {
        /* [WLAN EVENT] NULL Pointer Error */
        return;
    }

    switch(pWlanEvent->Event)
    {
    case SL_WLAN_CONNECT_EVENT:
    {
        SET_STATUS_BIT(g_Status, STATUS_BIT_CONNECTION);

        /*
         * Information about the connected AP (like name, MAC etc) will be
         * available in 'slWlanConnectAsyncResponse_t' - Applications
         * can use it if required
         *
         * slWlanConnectAsyncResponse_t *pEventData = NULL;
         * pEventData = &pWlanEvent->EventData.STAandP2PModeWlanConnected;
         *
         */
    }
    break;

    case SL_WLAN_DISCONNECT_EVENT:
    {
        slWlanConnectAsyncResponse_t*  pEventData = NULL;

        CLR_STATUS_BIT(g_Status, STATUS_BIT_CONNECTION);
        CLR_STATUS_BIT(g_Status, STATUS_BIT_IP_ACQUIRED);

        pEventData = &pWlanEvent->EventData.STAandP2PModeDisconnected;

        /* If the user has initiated 'Disconnect' request, 'reason_code' is
         * SL_USER_INITIATED_DISCONNECTION */
        if(SL_USER_INITIATED_DISCONNECTION == pEventData->reason_code)
        {
            /* Device disconnected from the AP on application's request */
        }
        else
        {
            /* Device disconnected from the AP on an ERROR..!! */
        }

    }
    break;

    default:
    {
        /* [WLAN EVENT] Unexpected event */
    }
    break;
    }
}

/*!
    \brief This function handles events for IP address acquisition via DHCP
           indication
    \param[in]      pNetAppEvent is the event passed to the handler
    \return         None
    \note
    \warning
 */
void SimpleLinkNetAppEventHandler(SlNetAppEvent_t *pNetAppEvent)
{
    if(pNetAppEvent == NULL)
    {
        /* [NETAPP EVENT] NULL Pointer Error */
        return;
    }

    switch(pNetAppEvent->Event)
    {
    case SL_NETAPP_IPV4_IPACQUIRED_EVENT:
    {
        SET_STATUS_BIT(g_Status, STATUS_BIT_IP_ACQUIRED);

//        SlIpV4AcquiredAsync_t *pEventData = NULL;
//        pEventData = &pNetAppEvent->EventData.ipAcquiredV4;
//        localIP =  pEventData->ip;

        /*
         * Information about the connection (like IP, gateway address etc)
         * will be available in 'SlIpV4AcquiredAsync_t'
         * Applications can use it if required
         *
         * SlIpV4AcquiredAsync_t *pEventData = NULL;
         * pEventData = &pNetAppEvent->EventData.ipAcquiredV4;
         *
         */
    }
    break;

    case SL_NETAPP_IP_LEASED_EVENT:
    {
        SET_STATUS_BIT(g_Status, STATUS_BIT_IP_LEASED);
    }
    break;


    default:
    {
        /* [NETAPP EVENT] Unexpected event */
    }
    break;
    }
}


_u8 POST_token_DC[] = "__SL_P_UDC";
_u8 POST_token_UP[] = "__SL_P_UUP";
_u8 GET_token_ID[]  = "__SL_G_UID";
_u8 GET_token_RC[]  = "__SL_G_URC";

/*!
    \brief This function handles callback for the HTTP server events
    \param[in]      pHttpEvent - Contains the relevant event information
    \param[in]      pHttpResponse - Should be filled by the user with the
                    relevant response information
    \return         None
    \note
    \warning
 */
void SimpleLinkHttpServerCallback(SlHttpServerEvent_t *pEvent,
                                  SlHttpServerResponse_t *pResponse)
{
    if(pEvent == NULL || pResponse == NULL)
        {
            printf(" [HTTP EVENT] NULL Pointer Error \n\r");
            return;
        }

        switch (pEvent->Event)
        {
            case SL_NETAPP_HTTPGETTOKENVALUE_EVENT:
            {
               _u8 *ptr = 0;

               ptr = pResponse->ResponseData.token_value.data;
               pResponse->ResponseData.token_value.len = 0;
               if(pal_Memcmp(pEvent->EventData.httpTokenName.data, GET_token_ID,
                                            pal_Strlen(GET_token_ID)) == 0)
               {
                   memcpy(ptr, DEVICE_ID, sizeof(DEVICE_ID));
                   ptr += sizeof(DEVICE_ID) - 1;
                   pResponse->ResponseData.token_value.len += sizeof(DEVICE_ID) - 1;

                   *ptr = '\0';
               }
               else if(pal_Memcmp(pEvent->EventData.httpTokenName.data, GET_token_RC,
                                  pal_Strlen(GET_token_RC)) == 0)
               {
                   memcpy(ptr, REG_CODE, sizeof(REG_CODE));
                   ptr += sizeof(REG_CODE) - 1;
                   pResponse->ResponseData.token_value.len += sizeof(REG_CODE) - 1;

                   *ptr = '\0';
               }
            }
            break;

            case SL_NETAPP_HTTPPOSTTOKENVALUE_EVENT:
            {
                unsigned char *ptr = pEvent->EventData.httpPostData.token_name.data;

                if(pal_Memcmp(ptr, POST_token_DC, pal_Strlen(POST_token_DC)) == 0)
                {
                    disconnectFlag = 1;
                }
                else if (pal_Memcmp(ptr, POST_token_UP, pal_Strlen(POST_token_UP)) == 0)
                {
                    char* data = pEvent->EventData.httpPostData.token_value.data;
                    ptr = data;

                    char *passkeyptr = strstr(data, "$SEC=");
                    char SSID_len = passkeyptr - ptr;

                    memcpy(connConf.SSID, ptr, SSID_len);
                    connConf.SSID[SSID_len] = '\0';

                    ptr += SSID_len + 5;

                    connConf.sec = *ptr - 48;

                    if (*ptr != 0) {
                       ptr += 10;
                       int8_t PASS_len = pEvent->EventData.httpPostData.token_value.len - (ptr - data);
                       memcpy(connConf.pass, ptr, PASS_len);
                       connConf.pass[PASS_len] = '\0';
                    }

                    updateFlag = 1;
                }
            }
            break;

            default:
                break;
        }
}

/*!
    \brief This function handles general error events indication
    \param[in]      pDevEvent is the event passed to the handler
    \return         None
 */
void SimpleLinkGeneralEventHandler(SlDeviceEvent_t *pDevEvent)
{
    /*
     * Most of the general errors are not FATAL are are to be handled
     * appropriately by the application
     */
    /* [GENERAL EVENT] */
}

/*!
    \brief This function handles socket events indication
    \param[in]      pSock is the event passed to the handler
    \return         None
 */
void SimpleLinkSockEventHandler(SlSockEvent_t *pSock)
{
    if(pSock == NULL)
    {
        /* [SOCK EVENT] NULL Pointer Error */
        return;
    }

}

void connectionTimer_init(void)
{
    TA2CTL |= TASSEL_2 | ID_3;          // Configuring Timer A2 to SMCLK and Divider 8.
    TA2CCTL0 |= CCIE;                   // Enabling interrupt for CC0 on Timer A2
    TA2EX0 |= (BIT2 | BIT1 | BIT0);     // Dividing by 8 a second time.
    TA2CCR0 = 0;                        // Timer will start when this is set to a nonzero value.
}

/****** Helper Function To Start the Timer ******/
void connectionTimer_start(void)
{
    TA2EX0 |= (BIT2 | BIT1 | BIT0);     // Reset the clock divider
    TA2CTL |= MC_1;
    TA2CCR0 = QUARTERSECOND;
}
/****** Helper Function to Stop Timer ******/
void connectionTimer_stop(void)
{
    TA2CCR0 = 0;
    TA2CTL &= ~(BIT4 | BIT5);
}

void TA2_0_IRQHandler()
{
    TA2CCTL0 &= ~CCIFG;
    if (connectionTimerCount < 40)      // With a clock time of .25 seconds. This will count for 10 seconds.
    {
       connectionTimerCount++;
    }
    else
    {
       connectionTimerCount = 0;
       connectionTimer_stop();          // Stop the timer
       stopConnectionAttempt = 1;
    }
}

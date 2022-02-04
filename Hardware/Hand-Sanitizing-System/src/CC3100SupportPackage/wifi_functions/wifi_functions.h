/*
 * Based on code provided in UT.6.02x Embedded Systems - Shape the World
 * by Jonathan Valvano and Ramesh Yerraballi
 * June 21, 2019
*/

#include "simplelink.h"
#include "sl_common.h"
#include <stdbool.h>
#include <stdio.h>

/* Application specific status/error codes */
#define SL_STOP_TIMEOUT 0xFF

_u32 g_Status;

#define MAX_RECV_BUFF_SIZE 1024
#define MAX_SEND_BUFF_SIZE 512
#define SUCCESS 0
#define PORT 80

#define WEBPAGE "54.242.85.61"

char request[1024];
char requestTemplate[512];
char serverResponse[1024];

extern char Recvbuff[MAX_RECV_BUFF_SIZE];
extern char SendBuff[MAX_SEND_BUFF_SIZE];
unsigned long DestinationIP;
int SockID;
static volatile uint32_t localIP;

uint8_t wifi_init();
extern int32_t establishConnectionWithAP(void);
extern int32_t disconnectFromAP(void);
extern int32_t configureSimpleLinkToDefaultState(void);
extern int32_t sendRequestToServer(char* request);
extern void parseServerResponse(char* parsedResponse, char* keyword);
extern uint8_t searchResponse(char* keyword);
void restartWIFI();

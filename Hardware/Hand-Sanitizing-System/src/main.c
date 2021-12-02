#include <msp432.h>
#include "wifi_usage.h"

#define QUARTER_SECOND 46875

#define WEBPAGE "34.227.194.176"
 
signed char SSID_NAME[100]   =    "hotspot";
char PASSKEY[100]     =    "hotspotpassword";   

char request[1024];
char requestTemplate[512];
char parsedResponse[1024];
int count = 0;

int32_t wifi_init();
void gpio_init();
void timer_init();
void timer_start();
void timer_stop();



int main(void)
{
	WDTCTL = WDTPW | WDTHOLD;
	
	BSP_InitBoard();
	gpio_init();
	timer_init();

	while(wifi_init() < 0);

	NVIC_EnableIRQ(PORT4_IRQn);
	NVIC_EnableIRQ(TA1_0_IRQn);

	while(1);
}



void gpio_init(void) {
    P6DIR   = 0xFF;             // Set P1.0 as Output
    P6OUT   &= ~BIT0;            // Set BIT1 as high to start.

    P4DIR   &= ~(BIT5 | BIT4);
    P4IFG   &= ~(BIT5 | BIT4);  // Setting up main mechanism and safety
    P4IES   |= BIT4;            // Bit 4 is high-to-low, so main mechanism
    P4IES   &= ~BIT5;           // Bit 2 is low-to-high, so safety mechanism
    P4IE    |= BIT5 | BIT4;     // Enabling both interrupts
    P4REN   |= BIT4;            // Enabling pull up for main mechanism
    P4OUT   |= BIT4;            // Setting it to pull up as opposed to pull down
}

void timer_init(void)
{
    TA1CTL |= TASSEL_2 | ID_3;    // Configuring Timer A1 to SMCLK and Divider 8.
    TA1CCTL0 |= CCIE;                    // Enabling interrupt for CC0 on Timer A1
    TA1EX0 |= (BIT2 | BIT1 | BIT0);     // Dividing by 8 a second time.
    TA1CCR0 = 0;                        // Timer will start when this is set to a nonzero value.
}


int32_t wifi_init() {
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
            return 0;
        }
    }

    printf("Could not connect to server.\n");
    return -1;
}

/****** Helper Function To Start the Timer ******/
void timer_start(void)
{
    TA1EX0 |= (BIT2 | BIT1 | BIT0);     // Reset the clock divider
    TA1CTL |= MC_1;
    TA1CCR0 = QUARTER_SECOND;
}
/****** Helper Function to Stop Timer ******/
void timer_stop(void)
{
    TA1CCR0 = 0;
    TA1CTL &= ~(BIT4 | BIT5);
}

void PORT4_IRQHandler(){
    if (P4IFG & BIT5)       // Bit 5 is safety (low-to-high)
    {
        count = 0;
        P4IFG &= ~BIT5;     // clearing the interrupt flag
        P6OUT &= ~BIT0;

    }
    else if (P4IFG & BIT4)  // Bit 4 is main mechanism (high-to-low)
    {
        count = 0;
        P4IFG &= ~BIT4;         // clearing the interrupt flag
        P6OUT |= BIT0;
        //Increment value in server
        timer_start();
    }
}
/****** Timer Interrupt ******/
void TA1_0_IRQHandler() {
    TA1CCTL0 &= ~CCIFG;
    if (count < 16)      // With a clock time of .25 seconds. This will count for 4 seconds.
    {
        count++;
    }
    else
    {
        count = 0;
        P6OUT &= ~BIT0; // Turn off light after time has passed
        timer_stop();    // Stop the timer
    }
}

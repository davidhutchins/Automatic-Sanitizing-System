#include <msp432.h>
#include "wifi_functions.h"
#include "handleServer.h"
#include "led.h"
#include "BSP.h"

#define HANDLE_ID 593
#define REGISTRATION_CODE 716928

#define QUARTER_SECOND 46875
 
void gpio_init();
void timer_init();
void timer_start();
void timer_stop();
void safetyTimer_init();
void safetyTimer_start();
void safetyTimer_stop();
void UVC_on();
void UVC_off();

uint8_t count = 0;
uint8_t safetyCount = 0;
uint8_t activationFlag = 0;
uint8_t timerFlag = 0;
uint8_t safetyTimerFlag = 0;
uint8_t safetyTimerDone = 0;
uint8_t connectedToServer = 0;
uint8_t connectionConfigured = 0;

int main(void)
{
	WDTCTL = WDTPW | WDTHOLD;
	
	BSP_InitBoard();
	timer_init();
	safetyTimer_init();
	gpio_init();

	LED_setColor(RED);
	PWM_set(6);
	PWM_init();
	PWM_start();
	NVIC_EnableIRQ(TA3_0_IRQn);

	if (P5->IN & BIT0) {
        LED_setColor(YELLOW);
        AP_init();
        connectionConfigured = 1;
        LED_setColor(RED);
    }

	connectedToServer = wifi_init();
	(connectedToServer) ?  LED_setColor(BLUE) :  LED_setColor(GREEN);

	if (connectedToServer && connectionConfigured) {
	    sendRegistrationCode(HANDLE_ID, REGISTRATION_CODE);
	}

	NVIC_EnableIRQ(PORT3_IRQn);
	NVIC_EnableIRQ(TA0_0_IRQn);
	NVIC_EnableIRQ(TA1_0_IRQn);

	while(1) {
	    if (activationFlag) {
	        activationFlag = 0;
	        count = 0;

	        safetyCount = 0;
	        safetyTimer_start();
	        while(!safetyTimerDone);
	        safetyTimerDone = 0;

            UVC_on();
            LED_setColor(PURPLE);

            if (connectedToServer) {
                uint8_t attempts = 0;
                while(incrementInteractionCounter(HANDLE_ID) == 0) { // Update handle interaction counter, quit after 3 tries, pass if not connected to WIFI
                    attempts++;
                    if (attempts == 3)
                        break;
                }
            }

            timer_start();
	    }

	    if (timerFlag) {
	        timerFlag = 0;
            if (count < 120)       // With a clock time of .25 seconds. This will count for 30 seconds.
            {
                count++;
            }
            else
            {
                count = 0;
                UVC_off();         // Turn off light after time has passed
                timer_stop();      // Stop the timer
                (connectedToServer) ?  LED_setColor(BLUE) :  LED_setColor(GREEN);
            }
	    }
	}
}


void gpio_init(void)
{
    // Ensure no pins are floating
    P1->OUT = 0x00; P1->DIR = 0xFF;
    P2->OUT = 0x00; P2->DIR = 0xFF;
    P3->OUT = 0x00; P3->DIR = 0xFF;
    P4->OUT = 0x00; P4->DIR = 0xFF;
    P5->OUT = 0x00; P5->DIR = 0xFF;
    P6->OUT = 0x00; P6->DIR = 0xFF;
    P7->OUT = 0x00; P7->DIR = 0xFF;
    P8->OUT = 0x00; P8->DIR = 0xFF;
    P9->OUT = 0x00; P9->DIR = 0xFF;
    P10->OUT = 0x00; P10->DIR = 0xFF;
    PJ->OUT = 0x00; PJ->DIR = 0xFF;


    P6DIR   = 0xFF;             // Set P6 as Output
    P6OUT   |= BIT0;            // Set BIT0 as high to start.

    P5DIR   &= ~BIT0;           // Set P5.0 as input
    P5OUT   &= ~BIT0;           // Set P5.0 as low to start.

    P3DIR   &= ~(BIT5 | BIT7);
    P3IFG   &= ~(BIT5 | BIT7);  // Setting up main mechanism and safety
    P3IES   |= BIT7;            // Bit 7 is high-to-low, main mechanism
    P3IES   &= ~BIT5;           // Bit 5 is low-to-high, safety mechanism
    P3IE    |= BIT5 | BIT7;     // Enabling both interrupts
    P3OUT   &= BIT5 | BIT7;

    P4DIR |= BIT0 | BIT2 | BIT4 | BIT5;
    P4OUT |= BIT0 | BIT2 | BIT4 | BIT5;
}

void timer_init(void)
{
    TA1CTL |= TASSEL_2 | ID_3;       // Configuring Timer A1 to SMCLK and Divider 8.
    TA1CCTL0 |= CCIE;                // Enabling interrupt for CC0 on Timer A1
    TA1EX0 |= (BIT2 | BIT1 | BIT0);  // Dividing by 8 a second time.
    TA1CCR0 = 0;                     // Timer will start when this is set to a nonzero value.
}

void timer_start(void)
{
    TA1EX0 |= (BIT2 | BIT1 | BIT0);  // Reset the clock divider
    TA1CTL |= MC_1;
    TA1CCR0 = QUARTER_SECOND;
}

void timer_stop(void)
{
    TA1CCR0 = 0;
    TA1CTL &= ~(BIT4 | BIT5);
}

void safetyTimer_init(void)
{
    TA0CTL |= TASSEL_2 | ID_3;        // Configuring Timer A1 to SMCLK and Divider 8.
    TA0CCTL0 |= CCIE;                 // Enabling interrupt for CC0 on Timer A1
    TA0EX0 |= (BIT2 | BIT1 | BIT0);   // Dividing by 8 a second time.
    TA0CCR0 = 0;                      // Timer will start when this is set to a nonzero value.
}

void safetyTimer_start(void)
{
    TA0EX0 |= (BIT2 | BIT1 | BIT0);   // Reset the clock divider
    TA0CTL |= MC_1;
    TA0CCR0 = QUARTER_SECOND;
}

void safetyTimer_stop(void)
{
    TA0CCR0 = 0;
    TA0CTL &= ~(BIT4 | BIT5);
}

void UVC_on(void)
{
    P6OUT &= ~BIT0;
}

void UVC_off(void)
{
    P6OUT |= BIT0;
}

// I/O Interrupt
void PORT3_IRQHandler()
{
    // Disable UV if light is currently on
    if (P3IFG & BIT5)       // Bit 5 is safety (low-to-high)
    {
       P3IFG &= ~BIT5;      // clearing the interrupt flag
       count = 0;
       UVC_off();
       (connectedToServer) ?  LED_setColor(BLUE) :  LED_setColor(GREEN);
    }

    // Enable UV
    else if (P3IFG & BIT7)  // Bit 7 is main mechanism (high-to-low)
    {
        P3IFG &= ~BIT7;     // clearing the interrupt flag
        activationFlag = 1;
    }
}

/****** Timer Interrupt ******/
void TA0_0_IRQHandler()
{
    TA0CCTL0 &= ~CCIFG;
    if (safetyCount < 12)  // With a clock time of .25 seconds. This will count for 3 seconds.
    {
        safetyCount++;
    }
    else
    {
        safetyCount = 0;
        safetyTimerDone = 1;
        safetyTimer_stop();
    }
}

void TA1_0_IRQHandler()
{
    TA1CCTL0 &= ~CCIFG;
    timerFlag = 1;
}

void TA3_0_IRQHandler()
{
    TA3CCTL0 &= ~CCIFG;
    PWMCount++;
    if (lightOn) {
       if (PWMCount >= PWMPercent) {
           lightOn = 0;
           P4OUT &= ~(BIT5);
           PWMCount = 0;
       }
    } else {
       if (PWMCount >= 100 - PWMPercent) {
           lightOn = 1;
           if (PWMPercent != 0)
               P4OUT |= BIT5;
           PWMCount = 0;
       }
    }

    // Cut down red brightness in mixed colors
    if (currentColor == PURPLE || currentColor == YELLOW) {
        if (redToggle) {
            redToggle = 0;
            P4OUT |= BIT0;
        } else {
            redToggle = 1;
            P4OUT &= ~(BIT0);
        }
    }
}

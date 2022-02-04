#include <msp432.h>
#include <wifi_functions.h>
#include "handleServer.h"
#include "BSP.h"

#define HANDLE_ID 30

#define QUARTER_SECOND 46875
 
void gpio_init();
void timer_init();
void timer_start();
void timer_stop();

uint8_t count = 0;
uint8_t activationFlag = 0;
uint8_t timerFlag = 0;

int main(void)
{
	WDTCTL = WDTPW | WDTHOLD;
	
	BSP_InitBoard();
	timer_init();

	while(wifi_init() != 1);

	gpio_init();
	NVIC_EnableIRQ(PORT3_IRQn);
	NVIC_EnableIRQ(TA1_0_IRQn);

	while(1) {
	    if (activationFlag) {
	        activationFlag = 0;
	        count = 0;
            P6OUT |= BIT0;

            uint8_t attempts = 0;
            while(incrementInteractionCounter(HANDLE_ID) == 0) { // Update handle interaction counter, quit after 3 tries
                attempts++;
                if (attempts == 3)
                    break;
            }

            timer_start();
	    }

	    if (timerFlag) {
	        timerFlag = 0;
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
	}
}


void gpio_init(void) {
    P6DIR   = 0xFF;             // Set P1.0 as Output
    P6OUT   &= ~BIT0;            // Set BIT0 as low to start.

    P3DIR   &= ~(BIT5 | BIT7);
    P3IFG   &= ~(BIT5 | BIT7);  // Setting up main mechanism and safety
    P3IES   |= BIT7;            // Bit 7 is high-to-low, so main mechanism
    P3IES   &= ~BIT5;           // Bit 5 is low-to-high, so safety mechanism
    P3IE    |= BIT5 | BIT7;     // Enabling both interrupts
    P3OUT   &= BIT5 | BIT7;
}

void timer_init(void)
{
    TA1CTL |= TASSEL_2 | ID_3;    // Configuring Timer A1 to SMCLK and Divider 8.
    TA1CCTL0 |= CCIE;                    // Enabling interrupt for CC0 on Timer A1
    TA1EX0 |= (BIT2 | BIT1 | BIT0);     // Dividing by 8 a second time.
    TA1CCR0 = 0;                        // Timer will start when this is set to a nonzero value.
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

void PORT3_IRQHandler(){
    // Disable UV if light is currently on
    if (P3IFG & BIT5)       // Bit 5 is safety (low-to-high)
    {
       P3IFG &= ~BIT5;     // clearing the interrupt flag
       count = 0;
       printf("Safety Triggered!\n");
       P6OUT &= ~BIT0;
    }

    // Enable UV
    else if (P3IFG & BIT7)  // Bit 7 is main mechanism (high-to-low)
    {
        P3IFG &= ~BIT7;         // clearing the interrupt flag
        activationFlag = 1;
        printf("Main Triggered!\n");
    }
}
/****** Timer Interrupt ******/
void TA1_0_IRQHandler() {
    TA1CCTL0 &= ~CCIFG;
    timerFlag = 1;
}

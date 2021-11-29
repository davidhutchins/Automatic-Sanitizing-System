#include <msp430.h>
#include <stdio.h>
#include "sanitize.h"
#include "msp430fr5994.h"
#include "driverlib.h"

int count = 0;
#define half_second  0xF424

/****** Initializing GPIO and Interrupts for main and safety mechanisms ******/
void gpio_init(void) {
    P6DIR   = 0xFF;             // Set P1.0 as Output
    P6OUT   |= BIT1;            // Set BIT1 as high to start.

    P1DIR   = 0x00;
    P1IFG   &= ~(BIT2 | BIT4);  // Setting up main mechanism and safety
    P1IES   |= BIT4;            // Bit 4 is high-to-low, so main mechanism
    P1IES   &= ~BIT2;           // Bit 2 is low-to-high, so safety mechanism
    P1IE    |= BIT2 | BIT4;     // Enabling both interrupts
    P1REN   |= BIT4;            // Enabling pull up for main mechanism
    P1OUT   |= BIT4;            // Setting it to pull up as opposed to pull down
    PM5CTL0 &= ~LOCKLPM5;       // Unlocking LPM I/O pins
}

void timer_init(void)
{
    TA1CTL = TASSEL_2 | MC_1 | ID_3;    // Configuring Timer A1 to SMCLK, Mode 1, and Divider 8.
    TA1CCTL0 = CCIE;                    // Enabling interrupt for CC0 on Timer A1
    // TA1EX0 |= (BIT2 | BIT1 | BIT0);  // Dividing by 8 a second time.
    TA1CCR0 = 0;                        // Timer will start when this is set to a nonzero value.
    // TA1IV |= 0x0E;                   // Set the interrupt source to the TA1CTL register
}

/****** Helper Function To Start the Timer ******/
void start_timer(void)
{
    TA1EX0 |= (BIT2 | BIT1 | BIT0);     // Reset the clock divider
    TA1CTL |= (BIT7 | BIT6)             // Resetting the clock divider
           | (~BIT5 | BIT4);            // Mode control: UP mode
}

/****** Helper Function to Stop Timer ******/
void stop_timer(void)
{
    TA1CTL |= (~BIT5 | ~BIT4);          // Mode control: STOP mode
}

void main(void)
{
    WDTCTL = WDTPW | WDTHOLD;           // stop watchdog timer

    //Initialize relevant modules
    gpio_init();
    timer_init();
    __bis_SR_register(GIE);

    while(1);
}


/****** Main/Safety Mechanism Interrupt ******/
#pragma vector=PORT1_VECTOR
__interrupt void Port_1_interrupt(void)
{
    if (P1IFG & BIT2)       // Bit 2 is safety (low-to-high)
    {
        count = 0;
        P1IFG &= ~BIT2;     // clearing the interrupt flag
        P6OUT &= ~BIT1;
        
    }
    else if (P1IFG & BIT4)  // Bit 4 is main mechanism (high-to-low)
    {
        count = 0;
        P1IFG &= ~BIT4;         // clearing the interrupt flag
        P6OUT |= BIT1;
        TA1CCR0 = half_second;  // Start the timer
    }
}
/****** Timer Interrupt ******/
#pragma vector=TIMER1_A1_VECTOR
__interrupt void Timer_A_interrupt(void)
{
    if (count < 4)      // With a clock time of .5 seconds. This will count for 2 seconds.
    {
        count++;
    }
    else
    {
        count = 0;
        P6OUT &= ~BIT1; // Turn off light after time has passed
        TA1CCR0 = 0;    // Stop the timer
    }
}

#include <msp430.h>
#include <stdio.h>
#include "sanitize.h"
#include "msp430fr5994.h"
#include "driverlib.h"

int count = 0;

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
    TA1CTL |= (BIT9 | ~BIT8)    //Timer A source = SMCLK
           | (BIT7 | BIT6)      //Input divider: /8
           | (~BIT5 | ~BIT4)    //Mode control: Stop mode
           | (BIT2)             //Clear timer A
           | (BIT1);            //Timer A interrupt enable

    TA1EX0 |= (BIT2 | BIT1 | BIT0);  // Dividing by 8 a second time.

    TA1CCR0 |= 0xF44C; // Set the overflow value to be 0xF4CC, or 62540, which is 4x (1MHz / 64). So each timer is 4 seconds
    TA1IV |= 0x0E; //Set the interrupt source to the TA1CTL register
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
    TA1CTL |= (~BIT5 | ~BIT4);         // Mode control: STOP mode
}

void main(void)
{
    WDTCTL = WDTPW | WDTHOLD;   // stop watchdog timer

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
    if (P1IFG & BIT2)
    {
        P1IFG &= ~BIT2;     // clearing the interrupt flag
        P6OUT &= ~BIT1;
    }
    else if (P1IFG & BIT4)
    {
        P1IFG &= ~BIT4;     // clearing the interrupt flag
        P6OUT ^= BIT1;
        P6OUT |= BIT2;
        start_timer();
    }
}
/****** Timer Interrupt ******/
#pragma vector=TIMER1_A1_VECTOR
__interrupt void Timer_A_interrupt(void)
{
    TA1CTL &= ~BIT0;       // Clear interrupt flag
    if (count < 15)
    {
        count++;
        // start_timer();  // Interrupt should automatically restart the timer
    }

    else
    {
        count = 0;
        P6OUT &= ~BIT2; // Turn off light after time has passed
        stop_timer();   // Stop the timer now that 1 minute has passed
    }
}

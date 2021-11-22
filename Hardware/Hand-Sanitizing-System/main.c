#include <msp430.h>
#include <stdio.h>
#include "sanitize.h"
#include "msp430fr5994.h"
#include "driverlib.h"

/****** Initializing GPIO and Interrupts for main and safety mechanisms******/
void gpio_init(void) {
    P6DIR   = 0xFF;             // Set P1.0 as Output
    P6OUT |= BIT1;              // Set BIT1 as high to start.

    P1DIR   = 0x00;
    P1IFG   &= ~(BIT2 | BIT4);  // Setting up main mechanism and safety
    P1IES   |= BIT4;            // Bit 4 is high-to-low, so main mechanism
    P1IES   &= ~BIT2;           // Bit 2 is low-to-high, so safety mechanism
    P1IE    |= BIT2 | BIT4;     // Enabling both interrupts
    P1REN   |= BIT4;            // Enabling pull up for main mechanism
    P1OUT   |= BIT4;            // Setting it to pull up as opposed to pull down
    PM5CTL0 &= ~LOCKLPM5;       // Unlocking LPM I/O pins

}

void main(void)
{
    WDTCTL = WDTPW | WDTHOLD;   // stop watchdog timer
    gpio_init();
    __bis_SR_register(GIE);
    while(1);


}


/****** Main/ Safety Mechanism Interrupt ******/
#pragma vector=PORT1_VECTOR
__interrupt void Port_1_interrupt(void)
{
    if (P1IFG & BIT2) {
        P1IFG &= ~BIT2;     // clearing the interrupt flag
        P6OUT &= ~BIT1;
    } else if (P1IFG & BIT4) {
        P1IFG &= ~BIT4;     // clearing the interrupt flag
        P6OUT ^= BIT1;
        P6OUT |= BIT2;
    }
}


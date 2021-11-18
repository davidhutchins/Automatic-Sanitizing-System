#include <msp430.h>
#include <stdio.h>
#include "sanitize.h"

void main(void)
{
    WDTCTL = WDTPW | WDTHOLD;   // stop watchdog timer
   
    
    
    P3DIR |= BIT7;  // set pin 5 to output, rest to input
    P1REN |= BIT4;
    P1OUT |= BIT4;
    P1IE  |= BIT4;  //Enables interrupt on pin 4
    P1IES |= BIT4;  //Flag set with a low-to-high transition on all pins
    LOCKLPM5
    P1IFG &= ~0x10; // clearing the bit if it was somehow set
    
    __bis_SR_register(GIE);     // Enable low power mode and enables GIE in status register for
                                // interrupts to be received
}

//ISR for Port 1

#pragma vector=PORT1_VECTOR
__interrupt void Port_1_interrupt(void)
{
    P3OUT ^= BIT7;      // setting toggle bit 5
    int i = 0;
    while(i < 20000) {
            i++;
    }
    P1IFG &= 0x00;     // clearing the interrupt flag
}

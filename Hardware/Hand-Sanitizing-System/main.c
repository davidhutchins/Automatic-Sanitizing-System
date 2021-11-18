#include <msp430.h> 
#include <stdio.h>
#include "sanitize.h"

/**
 * main.c
 */

void init_interrupts()
{
    P1DIR |= 0x07; //(0000 0111) sets direction of pins 0-2 as output
    P1OUT  = 0x30; //(0011 0000) configures Pins 4 and 5 as input
    P1REN |= 0x30; //Adds pull up resistors to pins 4 and 5
    P1IE  |= 0x30; //Enables interrupt on pins 4 and 5
    P1IES |= 0x30; //Flag set with a high-to-low transition
    P1IFG &= ~0x30; //Set interrupt on every pin except for 4 and 5

    __bis_SR_register(LPM4_bits + GIE);     // Enable low power mode and enables GIE in status register for
                                            // interrupts to be received
}

//ISR for Port 1
#pragma vector=PORT1_VECTOR
__interrupt void Port_1_interrupt(void)
{

}

int main(void)
{
	WDTCTL = WDTPW | WDTHOLD;	// stop watchdog timer
	init_interrupts();
	

	return 0;
}

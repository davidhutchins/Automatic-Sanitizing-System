/*
 * spi.c - msp430f5529 launchpad spi interface implementation
 *
 * Copyright (C) 2014 Texas Instruments Incorporated - http://www.ti.com/
 *
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *    Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 *    Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the
 *    distribution.
 *
 *    Neither the name of Texas Instruments Incorporated nor the names of
 *    its contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *  OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

#ifndef SL_IF_TYPE_UART
#include <msp430.h>

#include "simplelink.h"
#include "spi_cc3100.h"
#include "board.h"

#define ASSERT_CS()          (P4OUT &= ~BIT4)
#define DEASSERT_CS()        (P4OUT |= BIT4)


int spi_Close(Fd_t fd)
{
    /* Disable WLAN Interrupt ... */
    CC3100_InterruptDisable();

    return NONOS_RET_OK;

}

Fd_t spi_Open(char *ifName, unsigned long flags)
{
    /* Select the SPI lines: MOSI/MISO on P3.0,1 CLK on P3.2 */
    P5SELC |= (BIT0 + BIT1);
    P5REN |= BIT1;
    P5OUT |= BIT1;

    P5SELC |= BIT2;

    /* Enable pull up on P3.3, CC3100 UART RX */
    P6OUT |= BIT0;
    P6REN |= BIT0;

    UCB0CTL1 |= UCSWRST; /* Put state machine in reset */
    UCB0CTL0 = UCMSB + UCMST + UCSYNC + UCCKPH; /* 3-pin, 8-bit SPI master */

    UCB0CTL1 = UCSWRST + UCSSEL_2; /* Use SMCLK, keep RESET */

    /* Set SPI clock */
    UCB0BR0 = 0x02; /* f_UCxCLK = 25MHz/2 */
    UCB0BR1 = 0;
    UCB0CTL1 &= ~UCSWRST;


    /* P1.6 - WLAN enable full DS */
    P6SELC &= ~BIT2;
    P6OUT &= ~BIT2;
    P6DIR |= BIT2;

    /* Configure SPI IRQ line on P2.0 */
    P5DIR &= ~BIT7;
    P5SELC &= ~BIT7;

    P5REN |= BIT7;

    /* Configure the SPI CS to be on P2.2 */
    P4OUT |= BIT4;
    P4SELC &= ~BIT4;
    P4DIR |= BIT4;

    /* 50 ms delay */
    Delay(50);

    /* Enable WLAN interrupt */
    CC3100_InterruptEnable();

    return NONOS_RET_OK;

}


int spi_Write(Fd_t fd, unsigned char *pBuff, int len)
{
    int len_to_return = 0;


    ASSERT_CS();


    len_to_return = len;
    while (len)
    {
        while (!(UCB0IFG&UCTXIFG));
        UCB0TXBUF = *pBuff;
        while (!(UCB0IFG&UCRXIFG));
        UCB0RXBUF;
        len --;
        pBuff++;
    }


    /* At lower SPI clock frequencies the clock may not be in idle state
     * soon after exiting the above loop. Therefore, the user should poll for
     * for the clock pin (P3.2) to go to idle state(low) before de-asserting
     * the Chip Select.
     *
     * while (P3IN & BIT2);
     */

    DEASSERT_CS();

    return len_to_return;
}

int spi_Read(Fd_t fd, unsigned char *pBuff, int len)
{
    int i = 0;

    ASSERT_CS();

    for (i = 0; i < len; i ++)
    {
        while (!(UCB0IFG&UCTXIFG));
        UCB0TXBUF = 0xFF;
        while (!(UCB0IFG&UCRXIFG));
        pBuff[i] = UCB0RXBUF;
    }


    /* At lower SPI clock frequencies the clock may not be in idle state
     * soon after exiting the above loop. Therefore, the user should poll for
     * for the clock pin (P3.2) to go to idle state(low) before de-asserting
     * the Chip Select.
     *
     * while (P3IN & BIT2);
     */

    DEASSERT_CS();

    return len;
}
#endif /* SL_IF_TYPE_UART */

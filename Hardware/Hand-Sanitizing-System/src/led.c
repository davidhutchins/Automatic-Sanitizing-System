#include "led.h"

uint8_t lightOn = 0;
uint8_t PWMCount = 0;
uint16_t PWMPercent = 100;
uint8_t redToggle = 0; //Cut red brightness by 50%
uint8_t currentColor;

void LED_clear() {
    P4OUT |= BIT0 | BIT2 | BIT4;
}

void LED_setColor(uint8_t color) {
    LED_clear();
    currentColor = color;

    if (color == RED)
        P4OUT &= ~(BIT0);
    else if (color == BLUE)
        P4OUT &= ~(BIT2);
    else if (color == GREEN)
        P4OUT &= ~(BIT4);
    else if (color == PURPLE)
        P4OUT &= ~(BIT0 | BIT2);
    else if (color == YELLOW)
        P4OUT &= ~(BIT0 | BIT4);
}

void PWM_set(uint16_t percent) {
    if (percent > 100)
        PWMPercent = 100;

    PWMPercent = percent;
}

void PWM_init(void)
{
    TA3CTL |= TASSEL_2 | ID_3;
    TA3CCTL0 |= CCIE;
    TA3CCR0 = 0;
}

void PWM_start(void)
{
    TA3CTL |= MC_1;
    TA3CCR0 = 250;
}

void PWM_stop(void)
{
    TA3CCR0 = 0;
    TA3CTL &= ~(BIT4 | BIT5);
}

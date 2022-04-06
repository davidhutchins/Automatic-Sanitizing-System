#include <msp432.h>

#define RED 0
#define GREEN 1
#define BLUE 2
#define PURPLE 3
#define YELLOW 4

extern uint8_t lightOn;
extern uint8_t PWMCount;
extern uint16_t PWMPercent;
extern uint8_t redToggle;
extern uint8_t currentColor;

void LED_clear();
void LED_setColor(uint8_t color);
void PWM_set(uint16_t percent);
void PWM_init();
void PWM_start();
void PWM_stop();

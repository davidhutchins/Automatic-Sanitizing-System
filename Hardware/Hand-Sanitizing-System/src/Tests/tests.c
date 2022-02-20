#include <msp432.h>
#include <wifi_functions.h>
#include "handleServer.h"
#include "BSP.h"

#define HANDLE_ID 30

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD;

    BSP_InitBoard();

    while(wifi_init() != 1);

    int numTests = 10;
    printf("Enter number of tests to run: ");
    scanf("%d", &numTests);
    printf("\n");
    printf("Running %i tests...\n", numTests);

    int curTest = 0;
    int successes = 0;
    while(curTest < numTests) {
        if (incrementInteractionCounter(HANDLE_ID) == 1) {
            successes++;
        } else {
            printf("Failed test %i.\n", curTest);
        }

        curTest++;
    }

    printf("\n");
    printf("Testing complete:\n");
    printf("%i/%i tests passed.\n",successes,numTests);

    while(1);
}



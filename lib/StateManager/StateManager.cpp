#include "StateManager.h"

void StateManager::setState(PrismState state)
{
    currentState = state;
}

PrismState StateManager::getState()
{
    return currentState;
}
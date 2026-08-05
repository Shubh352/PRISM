#ifndef STATE_MANAGER_H
#define STATE_MANAGER_H

enum class PrismState
{
    BOOT,
    IDLE,
    WAIT_FOR_FINGER,
    VERIFYING,
    SUCCESS,
    ERROR
};

class StateManager
{
private:
    PrismState currentState = PrismState::BOOT;

public:
    void setState(PrismState state);

    PrismState getState();
};

#endif
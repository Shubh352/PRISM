#ifndef STATE_MANAGER_H
#define STATE_MANAGER_H

enum class PrismState
{
    BOOT,
    READY,
    SCANNING,
    PROCESSING,
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
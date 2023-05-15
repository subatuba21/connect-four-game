export enum status {
    IN_PROGRESS='INPROGRESS',
    ABORTED='ABORTED',
    COMPLETE='COMPLETE'
}

export enum computerType {
    MINIMAX='MINIMAX',
    ALPHABETA='ALPHABETA',
    SIMULATED_ANNEALING='',
}

export const isPlayerNotComputer = (id: string) => {
    return id.startsWith('PLAYER');
}
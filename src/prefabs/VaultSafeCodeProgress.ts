import { Direction, SecretCombination } from "./VaultSafeCodeGeneration";
import { utils } from "pixi.js";

type SecretCombinationProgress = {
    secretCombination: SecretCombination,
    remainingDisplacements: number,
}

export class VaultSafeCodeProgress extends utils.EventEmitter {

    secretCombinationsProgress: SecretCombinationProgress[]

    constructor(secretCombinations: SecretCombination[]) {
        super();

        this.secretCombinationsProgress = secretCombinations.map((secretCombination) => {
            return {
                secretCombination,
                remainingDisplacements: secretCombination.displacements,
            };
        });

        this.addProgress = this.addProgress.bind(this);
    }

    addProgress(direction: Direction) {

        const currentProgress = this.currentSecretCombinationProgress;
        
        if (currentProgress && direction === currentProgress.secretCombination.direction) {

            currentProgress.remainingDisplacements--;

            if (this.isComplete()) {
                this.emit('complete');
            }

        } else {

            this.emit('fail');
        }

    }


    get currentSecretCombinationProgress() {
        return this.secretCombinationsProgress.find(x => x.remainingDisplacements > 0);
    }

    isComplete(): boolean {
        return this.secretCombinationsProgress.every(
            x => x.remainingDisplacements === 0
        );
    }

    public toString(): string {
        return this.secretCombinationsProgress
            .map(x => `${x.remainingDisplacements}, ${x.secretCombination.direction}`)
            .join(" ");
    }
}
export type SecretCombination = {
    displacements: number;
    direction: Direction;
  };

export enum Direction {
    CLOCKWISE = "clockwise",
    COUNTERCLOCKWISE = "counterclockwise"
}

export class VaultSafeCodeGeneration {

    secretCombinations: SecretCombination[]

    config = {
        displacements: {
            min: 1,
            max: 9,
        },
        displacementRotation: 60,

        secretCombinations: 3
    }

    constructor() {
        this.secretCombinations = this.generateSecretCombinations();
    }

    generateSecretCombinations() {

        const secretCombinations: SecretCombination[] = [];

        for (let i = 0; i < this.config.secretCombinations; i++) {

            const randomDisplacements = this.randomDisplacements;
            const randomDirection = this.randomDirection;

            secretCombinations.push({
                displacements: randomDisplacements, 
                direction: randomDirection});
        }

        return secretCombinations;
    }

    get randomDirection() {
        const directions = Object.values(Direction);
        const randomIndex = Math.floor(Math.random() * directions.length);
        return directions[randomIndex];
    }

    get randomDisplacements() {
       return Math.floor(Math.random() * 
       (this.config.displacements.max - this.config.displacements.min + 1) 
       + this.config.displacements.min);
    }

    public toString(): string {
        return this.secretCombinations
            .map(x => `${x.displacements}, ${x.direction}`)
            .join(" ");
    }
}
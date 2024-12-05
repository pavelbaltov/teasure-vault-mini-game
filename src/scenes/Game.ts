import Logger from "../core/Logger";
import Scene from "../core/Scene";
import { VaultSafeCodeGeneration } from "../prefabs/VaultSafeCodeGeneration";
import { VaultSafeCodeProgress } from "../prefabs/VaultSafeCodeProgress";

export default class Game extends Scene {
  name = "Game";

  private vaultSafeCodeGeneration!: VaultSafeCodeGeneration;
  private vaultSafeCodeProgress!: VaultSafeCodeProgress;

  load() {

    //this.addChild();
  }

  async start() {
    this.vaultSafeCodeGeneration = new VaultSafeCodeGeneration();
    this.vaultSafeCodeProgress = new VaultSafeCodeProgress(this.vaultSafeCodeGeneration.secretCombinations);
    this.vaultSafeCodeProgress.removeAllListeners();

    this.vaultSafeCodeProgress.on("fail", this.onCodeFailed);
    this.vaultSafeCodeProgress.on("complete", this.onCodeCompleted);

    Logger.getInstance().log(this.vaultSafeCodeGeneration.toString());
  }

  private async onCodeFailed() {

    
  }


  private async onCodeCompleted() { 

    
  }


  onResize(width: number, height: number) {}
}

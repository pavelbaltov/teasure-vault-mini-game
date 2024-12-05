import Logger from "../core/Logger";
import Scene from "../core/Scene";
import Background from "../prefabs/Background";
import { Blink } from "../prefabs/Blink";
import { VaultSafeCodeGeneration } from "../prefabs/VaultSafeCodeGeneration";
import { VaultSafeCodeProgress } from "../prefabs/VaultSafeCodeProgress";
import { VaultSafeDoor } from "../prefabs/VaultSafeDoor";
import { VaultSafeHandle } from "../prefabs/VaultSafeHandle";

export default class Game extends Scene {
  name = "Game";

  private background!: Background;
  private vaultSafeCodeGeneration!: VaultSafeCodeGeneration;
  private vaultSafeCodeProgress!: VaultSafeCodeProgress;
  private vaultSafeHandle!: VaultSafeHandle;
  private vaultSafeDoor!: VaultSafeDoor;
  private blink!: Blink;

  load() {

    this.background = new Background("bg");
    this.vaultSafeHandle = new VaultSafeHandle();
    this.vaultSafeDoor = new VaultSafeDoor();
    this.blink = new Blink();

    this.addChild(this.background);
    this.background.addChild(this.vaultSafeDoor);
    this.vaultSafeDoor.addChild(this.vaultSafeHandle);

  }

  async start() {

    this.vaultSafeCodeGeneration = new VaultSafeCodeGeneration();
    this.vaultSafeCodeProgress = new VaultSafeCodeProgress(this.vaultSafeCodeGeneration.secretCombinations);
    this.vaultSafeCodeProgress.removeAllListeners();
    this.vaultSafeHandle.onHandleRotate.removeAllListeners();

    this.vaultSafeHandle.onHandleRotate.addListener("rotationCompleted", this.vaultSafeCodeProgress.addProgress);
    this.vaultSafeCodeProgress.on("fail", this.onCodeFailed);
    this.vaultSafeCodeProgress.on("complete", this.onCodeCompleted);

    Logger.getInstance().log(this.vaultSafeCodeGeneration.toString());
  }

  private async onCodeFailed() {

    
  }


  private async onCodeCompleted() { 

    
  }


  onResize(width: number, height: number) {

    if (this.background) {
      this.background.resize(width, height);
    }
  }
}

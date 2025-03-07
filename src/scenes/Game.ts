import Logger from "../core/Logger";
import Scene from "../core/Scene";
import { Stopwatch } from "../core/Stopwatch";
import Background from "../prefabs/Background";
import { Blink } from "../prefabs/Blink";
import { VaultSafeCodeGeneration } from "../prefabs/VaultSafeCodeGeneration";
import { VaultSafeCodeProgress } from "../prefabs/VaultSafeCodeProgress";
import { VaultSafeDoor } from "../prefabs/VaultSafeDoor";
import { VaultSafeHandle } from "../prefabs/VaultSafeHandle";
import { wait } from "../utils/misc";

export default class Game extends Scene {
  name = "Game";

  private background!: Background;
  private vaultSafeCodeGeneration!: VaultSafeCodeGeneration;
  private vaultSafeCodeProgress!: VaultSafeCodeProgress;
  private vaultSafeHandle!: VaultSafeHandle;
  private vaultSafeDoor!: VaultSafeDoor;
  private blink!: Blink;
  private stopwatch!: Stopwatch;

  load() {

    this.background = new Background("bg");
    this.vaultSafeHandle = new VaultSafeHandle();
    this.vaultSafeDoor = new VaultSafeDoor();
    this.blink = new Blink();
    this.stopwatch = new Stopwatch();

    this.addChild(this.background);
    this.background.addChild(this.vaultSafeDoor);
    this.background.addChild(this.blink);
    this.background.addChild(this.stopwatch);
    this.stopwatch.position.set(this.stopwatch.x-1175, this.stopwatch.y - 150);
    this.vaultSafeDoor.addChild(this.vaultSafeHandle);

    this.onCodeFailed = this.onCodeFailed.bind(this);
    this.onCodeCompleted = this.onCodeCompleted.bind(this);

    console.log("starting");
  }

  async start() {

    this.stopwatch.reset();
    this.stopwatch.start();

    this.vaultSafeCodeGeneration = new VaultSafeCodeGeneration();
    this.vaultSafeCodeProgress = new VaultSafeCodeProgress(this.vaultSafeCodeGeneration.secretCombinations);
    this.vaultSafeCodeProgress.removeAllListeners();
    this.vaultSafeHandle.onHandleRotate.removeAllListeners();

    this.vaultSafeHandle.onHandleRotate.addListener("rotationCompleted", this.vaultSafeCodeProgress.addProgress);
    this.vaultSafeCodeProgress.on("fail", this.onCodeFailed);
    this.vaultSafeCodeProgress.on("complete", this.onCodeCompleted);

    Logger.getInstance().log(this.vaultSafeCodeGeneration.toString());
  }

  private async onCodeFailed(): Promise<void> {

    this.stopwatch.stop();

    await this.vaultSafeHandle.rotateRapidly(2400, 2.5);

    this.start();
}


private async onCodeCompleted(): Promise<void> {

    this.stopwatch.stop();

    this.vaultSafeDoor.openDoor();
    this.blink.startBlinking();
    await wait(5);

    await this.vaultSafeDoor.closeDoor();
    this.blink.stopBlinking();

    await this.vaultSafeHandle.rotateRapidly(2400, 2.5);

    this.start();
  } 


  onResize(width: number, height: number) {

    if (this.background) {
      this.background.resize(width, height);
    }
  }
}

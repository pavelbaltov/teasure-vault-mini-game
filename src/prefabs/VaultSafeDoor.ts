import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

export class VaultSafeDoor extends Container {
    public door: Sprite;
    private openDoorShadow: Sprite;

    private initialX!: number;
    private doorClosed: boolean = true;

    constructor() {
        super();

        this.openDoorShadow = Sprite.from("doorOpenShadow");
        this.door = Sprite.from("door");

        this.addChild(this.openDoorShadow);
        this.addChild(this.door);

        this.door.anchor.set(0.5);
        this.openDoorShadow.anchor.set(0.5);
        this.openDoorShadow.visible = false;

        this.position.set(this.position.x + 75, this.position.y - 25);
        this.openDoorShadow.position.set(this.openDoorShadow.x+100, this.openDoorShadow.y+50);

        this.initialX = this.position.x;
    }


    public openDoor(): Promise<void> {
        if (!this.doorClosed) return Promise.resolve();

        return new Promise(async (resolve) => {

            this.doorClosed = false;
            const timeline = gsap.timeline({
                    onComplete: resolve, 
                }
        );
        timeline
            .to(this, {
                x: this.x + this.door.width/1.5,
                duration: 0.3,
                ease: "power0",
            })
            .add(() => {
                this.children.forEach(child => {
                    if (child !== this.door) {
                        child.visible = false;
                    }
                });
                this.door.texture = Texture.from("doorOpen");
            })
            .to(this, {
                x: this.x + this.door.width/1.4,
                duration: 0.3,
                ease: "power0",
            })
            .to(this.door.skew, {
                x: -0.15,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
            })
            .add(() => {
                this.openDoorShadow.alpha = 0;
                this.openDoorShadow.visible = true;
            })
            .to(this.openDoorShadow, {
                alpha: 1, 
                duration: 0.25, 
                ease: "power1.inOut",
            });
        });
    }

    public closeDoor(): Promise<void> {
        if (this.doorClosed) return Promise.resolve();

        return new Promise((resolve) => {
            this.doorClosed = true;
            const timeline = gsap.timeline({
                onComplete: resolve, 
        });

        timeline
            .add(() => {
                this.children.forEach(child => {
                    if (child !== this.door) {
                        child.visible = true;
                    }
                });
                this.door.texture = Texture.from("door");
                this.openDoorShadow.visible = false;
            })
            .to(this, {
                x: this.initialX  + this.door.width/1.5,
                duration: 0.3,
                ease: "power0",
            })
            .to(this, {
                x: this.initialX,
                duration: 0.3,
                ease: "power0",
            });
        });
    }
    
}

import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import { randomInRange } from "../utils/misc";

export class Blink extends Container {
    private textures: Sprite[] = [];
    private blinkTimeline: gsap.core.Timeline;

    constructor() {
        super();

        for (let i = 0; i < 3; i++) {
            const texture = Texture.from("blink");
            const sprite = new Sprite(texture);

            sprite.position.set(
                randomInRange(-700, 500),
                randomInRange(200, 400) 
            );

            this.addChild(sprite);
            this.textures.push(sprite);
            sprite.anchor.set(0.5);
        }

        this.blinkTimeline = this.createBlinkAnimation();
        this.stopBlinking();
    }

    private createBlinkAnimation(): gsap.core.Timeline {
        return gsap.timeline({ repeat: -1 }) 
            .to(this, {
                alpha: 0, 
                duration: 0.5,
                ease: "power1.inOut",
            })
            .to(this, {
                alpha: 1, // Fade in
                duration: 0.5,
                ease: "power1.inOut",
            });
    }

    public startBlinking(): void {
        this.visible = true;
        if (!this.blinkTimeline.isActive()) {
            this.blinkTimeline.play();
        }
    }

    public stopBlinking(): void {
        this.visible = false;
        this.blinkTimeline.pause();
        this.alpha = 1;
    }
}

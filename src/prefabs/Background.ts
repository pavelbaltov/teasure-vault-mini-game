import { Container, Sprite } from "pixi.js";

export default class Background extends Container {
    private sprite: Sprite;

    constructor(bgName: string) {
        super();

        this.sprite = Sprite.from(bgName);
        this.addChild(this.sprite);
        this.sprite.anchor.set(0.5);

        this.resize(window.innerWidth, window.innerHeight);
       
    }

    public resize(width: number, height: number): void {

        const imgRatio = this.sprite.texture.width / this.sprite.texture.height;
        const screenRatio = width / height;

        let scale = 1;

        if (screenRatio >= imgRatio) {
            scale = width / this.sprite.texture.width;
        } else {
            scale = height / this.sprite.texture.height;
        }

        this.width = this.sprite.texture.width * scale;
        this.height = this.sprite.texture.height * scale;

        this.position.set(width / 2, height / 2);
        
    }
}
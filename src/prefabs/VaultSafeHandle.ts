// VaultSafeHandle.ts
import { Container, Sprite, FederatedPointerEvent, Point } from 'pixi.js';
import gsap from 'gsap';
import { utils } from "pixi.js";
import { Direction } from './VaultSafeCodeGeneration';

export class VaultSafeHandle extends Container {
    
    private handle: Sprite;
    private shadow: Sprite;

    private previousAngle: number | null = null;
    private lastMousePosition: Point | null = null;
    private readonly ROTATION_THRESHOLD = (2 * Math.PI) / 180;  //5 degrees in radians
    private accumulatedRotation: number = 0;

    private isRotating: boolean = false;
    private isDragging: boolean = false;

    public onHandleRotate!: utils.EventEmitter;

    constructor() {
        super();

        this.shadow = Sprite.from("handleShadow");
        this.handle = Sprite.from('handle');

        this.addChild(this.shadow);
        this.addChild(this.handle);

        this.position.set(this.x - 90, this.y);
        this.shadow.position.set(this.shadow.x + 30, this.shadow.y + 50)
     
        this.handle.anchor.set(0.5);
        this.shadow.anchor.set(0.5);

        this.eventMode = 'static'; 

        this.onpointerdown = (event) => {
            this.onDragStart(event);
        }

        this.onglobalpointermove = (event) => {
            this.onDragMove(event);
        }

        this.onpointerup = () => {
            this.onDragEnd();
        }


        this.onHandleRotate = new utils.EventEmitter();
    }


    private onDragStart(event: FederatedPointerEvent): void {
        if (this.isRotating) return;

        this.isDragging = true;

        const startingAngle =this.getCurrentAngle(event);

        this.previousAngle = startingAngle;

        this.lastMousePosition = event.global.clone();
    }

    private async onDragMove(event: FederatedPointerEvent) {

        if (this.isDragging && !this.isRotating) {

            if (!this.lastMousePosition || !event.global.equals(this.lastMousePosition)) {

                const currentAngle = this.getCurrentAngle(event);

                if (this.previousAngle !== null) {

                    let angleDifference = currentAngle - this.previousAngle;
                    angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));

                    const rotationDirection = angleDifference >= 0 ? 1 : -1;

                    this.rotation += angleDifference;
                    this.accumulatedRotation += Math.abs(angleDifference);

                    if (Math.abs(this.accumulatedRotation) >= this.ROTATION_THRESHOLD) {

                        this.onDragEnd();

                        await this.rotateHandle(60 * rotationDirection);
                        this.onHandleRotate.emit("rotationCompleted",
                            rotationDirection == 1 ? Direction.CLOCKWISE : Direction.COUNTERCLOCKWISE);

                    }
                }

                this.previousAngle = currentAngle;
                this.lastMousePosition = event.global.clone();
            }
        }
    }

    private onDragEnd(): void {
        this.isDragging = false;
        this.previousAngle = null;
        this.lastMousePosition = null;
        this.accumulatedRotation = 0;
    }

    private getCurrentAngle(event: FederatedPointerEvent) {
        const localPosition = event.global.clone();
        this.toLocal(localPosition, undefined, localPosition);
        const direction = new Point(localPosition.x - this.handle.x, localPosition.y - this.handle.y);
        return Math.atan2(direction.y, direction.x);
    }

    private rotateHandle(angleDeg: number): Promise<void> {

        this.isRotating = true;
        const angleRad = (angleDeg * Math.PI) / 180;
    
        return new Promise((resolve) => {
            gsap.to(this, {
                rotation: this.rotation + angleRad,
                duration: 0.25,
                ease: 'power2.out',
                onComplete: () => {
                    this.isRotating = false;
                    resolve();
                },
            });
        });
    }
    

    public rotateRapidly(angleDeg: number, duration: number = 0.1, ease: string = 'circ.out'): Promise<void> {
        const angleRad = (angleDeg * Math.PI) / 180;
        this.isRotating = true;
    
        return new Promise((resolve) => {
            gsap.to(this, {
                rotation: this.rotation + angleRad * 20,
                duration,
                ease,
                onComplete: () => {
                    this.isRotating = false;
                    resolve();
                },
            });
        });
    }
    
}

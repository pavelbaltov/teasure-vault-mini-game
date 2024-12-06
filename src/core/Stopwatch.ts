import { Container, Text, TextStyle } from "pixi.js";

export class Stopwatch extends Container {
    private elapsedTime: number; 
    private stopwatchText: Text; 
    private intervalId: number | null = null; 

    constructor() {
        super();

        this.elapsedTime = 0;

        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 56,
            fill: 0xffffff, 
        });

        this.stopwatchText = new Text(this.formatTime(this.elapsedTime), style);
        this.stopwatchText.anchor.set(0.5);
        this.addChild(this.stopwatchText);

        this.start();
    }

    private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    public start(): void {
        if (this.intervalId !== null) return;

        this.intervalId = window.setInterval(() => {
            this.elapsedTime++;
            this.stopwatchText.text = this.formatTime(this.elapsedTime);
        }, 1000);
    }

    public stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    public reset(): void {
        this.stop();
        this.elapsedTime = 0;
        this.stopwatchText.text = this.formatTime(this.elapsedTime);
    }

    public resume(): void {
        this.start();
    }
}

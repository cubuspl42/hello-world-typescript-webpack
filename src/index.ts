import {scheduleOnce, schedulePeriodicallyWithIndex} from "./schedule";
import {BoundingClientRectObserver} from "./BoundingClientRectObserver";

const avatar = document.getElementById("avatar")!;
const frame = document.getElementById("frame")!;
const container = document.getElementById("container")!;

new BoundingClientRectObserver((bounds) => {
    console.log("Avatar bounds changed", bounds);

    frame.style.left = `${bounds.x}px`;
    frame.style.top = `${bounds.y}px`;
    frame.style.width = `${bounds.width}px`;
    frame.style.height = `${bounds.height}px`;
}).observe(avatar);

schedulePeriodicallyWithIndex((index) => {
    const tx = Math.sin(index) * 100;
    const ty = Math.cos(index) * 200;
    const newTransform = `translateX(${tx}px) translateY(${ty}px)`;

    container.style.transform = newTransform
}, 2000);

scheduleOnce(() => {
    schedulePeriodicallyWithIndex((index) => {
        const tx = Math.sin(index) * 50;
        const ty = Math.cos(index) * 50;
        const newTransform = `translateX(${tx}px) translateY(${ty}px)`;

        avatar.style.transform = newTransform
    }, 2000);
}, 500);

interface Handle {
    cancel(): void;
}

export function scheduleOnce(
    callback: () => void,
    durationMs: number,
): Handle {
    const id = setTimeout(callback, durationMs);

    return {
        cancel() {
            clearTimeout(id);
        }
    }
}

export function schedulePeriodically(
    callback: () => void,
    durationMs: number,
): Handle {
    let handle: Handle | null = null

    const scheduleNext = () => {
        handle = scheduleOnce(() => {
            scheduleNext();
            callback();
        }, durationMs);
    }

    scheduleNext();

    return {
        cancel() {
            handle?.cancel();
            handle = null;
        }
    }
}

export function schedulePeriodicallyWithIndex(
    callback: (index: number) => void,
    durationMs: number,
): Handle {
    let index = 0;

    return schedulePeriodically(
        () => callback(index++),
        durationMs,
    );
}

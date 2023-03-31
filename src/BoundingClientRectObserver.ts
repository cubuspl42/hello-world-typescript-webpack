interface Bounds {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export class BoundingClientRectObserver {
    readonly callback: (bounds: Bounds) => void;

    constructor(
        callback: (bounds: Bounds) => void,
    ) {
        this.callback = callback;
    }

    observe(element: Element) {
        observePositionChange(element, (bounds) => {
            this.callback(bounds);
        });
    }

    disconnect() {
        // TODO
    }
}

function observePositionChange(
    element: Element,
    callback: (bounds: {
        readonly x: number;
        readonly y: number;
        readonly width: number;
        readonly height: number;
    }) => void,
) {
    let previousPosition = getElementPosition(element);

    observePotentialPositionChange(element, () => {
        const newPosition = getElementPosition(element);

        if (newPosition !== previousPosition) {
            callback(newPosition);
            previousPosition = newPosition;
        }
    });
}

function observePotentialPositionChange(
    element: Element,
    callback: () => void,
) {
    observePotentialDirectPositionChange(element, callback);
    observePotentialParentLayoutChange(element, callback);
}

function observePotentialDirectPositionChange(
    element: Element,
    callback: () => void,
) {
    const mutationObserver = new MutationObserver(callback);

    mutationObserver.observe(element, {
        attributes: true,
        attributeFilter: ['style', 'class'],
    });
}

function observePotentialParentLayoutChange(
    element: Element,
    callback: () => void,
) {
    const parent = element.parentElement;

    if (!parent) {
        return;
    }

    observeSizeChange(parent, callback);

    observeScroll(parent, callback);

    observePotentialPositionChange(parent, callback);

    // for (const sibling of parent.children) {
    // 	if (sibling === element) {
    // 		continue;
    // 	}

    // 	observePotentialSiblingSizeChange(sibling, callback);
    // }
}

function observeScroll(
    element: Element,
    callback: () => void,
) {
    element.addEventListener('scroll', callback);
}

function observeSizeChange(
    element: Element,
    callback: () => void,
) {
    const resizeObserver = new ResizeObserver(callback);

    resizeObserver.observe(element);
}

function getElementPosition(element: Element) {
    const rect = element.getBoundingClientRect();

    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
    };
}

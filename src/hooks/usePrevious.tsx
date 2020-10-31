/* eslint-disable @typescript-eslint/no-explicit-any */
// added disable because value can be anything

import React, {useRef, useEffect} from 'react';

/**
 * Hook which save previous value
 *
 * @param {any} value - some value
 * @returns {any} previous value
 */
export const usePrevious = (value: any): any => {
    const ref = useRef();
    useEffect((): React.EffectCallback => void (ref.current = value), [value]);
    return ref.current;
};

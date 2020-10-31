import React from "react";
import { useSpring, animated } from "react-spring";
import classNames from "classnames";

import { usePrevious, useMeasure } from "../../hooks";
import Arrow from "../../dropdownMark.svg";
import s from "./style.scss";

interface Props {
  children: React.ReactElement[];
  title: string;
  defaultOpen?: boolean;
}

/**
 * Component for render group with options
 *
 * @param {Props} - props component
 * @returns {React.ReactElement} - element
 */
export const GroupOptions = React.memo(
  ({ children, title, onClick, isOpen = false }: Props): React.ReactElement => {
    const previous = usePrevious(isOpen);
    const [bind, { height: viewHeight }] = useMeasure();

    const { height, opacity, translate } = useSpring({
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      translate: `translate3d(${isOpen ? 0 : 20}px,0,0)`,
    });

    return (
      <div className={classNames(s.frame, { [s.isOpen]: isOpen })}>
        <div className={s.title} onClick={onClick}>
          {title}
          <div className={classNames(s.wrapArrow, { [s.isOpen]: isOpen })}>
            <Arrow />
          </div>
        </div>
        <animated.div
          className={s.content}
          style={{
            opacity,
            height: isOpen && previous === isOpen ? "auto" : height,
          }}
        >
          <animated.div style={{ transform: translate }} {...bind}>
            {children}
          </animated.div>
        </animated.div>
      </div>
    );
  }
);

GroupOptions.displayName = "GroupOptions";

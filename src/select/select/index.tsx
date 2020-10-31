import React, { useState, useRef } from "react";
import classNames from "classnames";
import { useSpring, animated } from "react-spring";

import { useGetOptions } from "../helpers";
import { useMeasure } from "../../hooks";
import Arrow from "../../dropdownMark.svg";
import s from "./style.scss";

interface Props {
  onChange: (
    event: React.ChangeEvent<{ name?: string; value: string | object }>,
    item: string | object
  ) => void;
  onBlur?: (
    event: React.FocusEventHandler<{ name?: string; value: string | object }>,
    item: string | object
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  name?: string;
  isError?: boolean;
  isDisabled?: boolean;
  message?: string | string[];
  placeholder?: string;
  children: React.ReactElement[];
  color?: "black" | "white";
}

/**
 * Component for render dropdown
 *
 * @param {Props} - props component
 * @returns {React.ReactElement} - dropdown
 */
export const Select: React.FunctionComponent<Props> = ({
  onChange,
  onBlur,
  onFocus,
  name,
  isError,
  isDisabled,
  message,
  placeholder = "",
  children,
  color = "black",
}: Props): React.ReactElement => {
  const [visibility, setVisibility] = useState(false);
  const [selectValue, setValue] = useState(null);
  const [bind, { height: viewHeight }] = useMeasure();
  const list = useRef(null);
  const wrap = useRef(null);

  const props = useSpring({
    opacity: visibility ? 1 : 0,
    height: visibility ? viewHeight + 20 : 0,
  });

  /**
   * Hide dropdown when user clicked out side
   */
  const onClickOutside = ({ target }): void => {
    if (!wrap.current || !list.current) return;
    if (!list.current.contains(target) && !wrap.current.contains(target)) {
      setVisibility(false);
      document.removeEventListener("mouseup", onClickOutside);
    }
  };

  /**
   *  Method for hide dropdown and remove event listener
   */
  const onHide = (): void => {
    setVisibility(false);
    document.removeEventListener("mouseup", onClickOutside);
  };

  /**
   * Method for show dropdown and add event listener
   */
  const onShow = (): void => {
    if (isDisabled) return;

    if (visibility) {
      document.removeEventListener("mouseup", onClickOutside);
    } else {
      document.addEventListener("mouseup", onClickOutside);
    }

    setVisibility(!visibility);
  };

  /**
   * onChange handler
   *
   * @param {string | object} item - some object with data
   * @returns {((event: React.MouseEvent<HTMLDivElement>) => void)} - func with event
   */
  const onChangeSelect = (
    item: string | object
  ): ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) => (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.persist();

    Object.defineProperty(event, "target", {
      writable: true,
      value: { ...item, name },
    });
    setValue(item);
    onChange(
      (event as unknown) as React.ChangeEvent<{
        name?: string;
        value: string | object;
      }>,
      item
    );
    onHide();
  };

  /**
   * onBlur handler
   *
   * @param {React.FocusEvent<HTMLDivElement>} event - event from div
   */
  const onBlurSelect = (event: React.FocusEvent<HTMLDivElement>): void => {
    if (!visibility && onBlur) {
      event.persist();
      Object.defineProperty(event, "target", {
        writable: true,
        value: { value: selectValue, name },
      });
      onBlur(
        (event as unknown) as React.FocusEventHandler<{
          name?: string;
          value: string | object;
        }>,
        selectValue
      );
    }
  };

  // TODO: maybe it will be useful in future
  // /**
  //  * Utility useEffect for call onBlur after change state
  //  */
  // useEffect(() => {
  //     ref.current.blur();
  // }, [selectValue]);

  /**
   * Get active option (as React.ReactElement) and array of options (as React.ReactElement[])
   */
  const { activeNode, options } = useGetOptions(children, {
    onChange: onChangeSelect,
  });

  return (
    <div
      className={s.wrap}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlurSelect}
    >
      <div
        ref={wrap}
        className={classNames(s.input, s[color], {
          [s.error]: isError,
          [s.disabled]: isDisabled,
        })}
        onClick={onShow}
      >
        <div
          className={classNames(s.label, {
            [s.isDisabled]: isDisabled,
            [s.isPlaceholder]: Boolean(activeNode),
          })}
        >
          {activeNode ? activeNode : placeholder}
        </div>
        <div
          classNames={classNames(s.wrapArrow, {
            [s.isDisabled]: isDisabled,
            [s.isOpen]: visibility,
          })}
        >
          <Arrow />
        </div>
      </div>
      {message && (
        <div className={s.errorMessage}>
          {Array.isArray(message) ? (
            <React.Fragment>
              {message.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </React.Fragment>
          ) : (
            { message }
          )}
        </div>
      )}
      <animated.div
        className={s.wrapList}
        ref={list}
        isShow={visibility}
        style={props}
      >
        <animated.div className={s.list} {...bind}>
          {options}
        </animated.div>
      </animated.div>
    </div>
  );
};

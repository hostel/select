import React from "react";
import classNames from "classnames";
import s from "./style.scss";

interface Props {
  children: React.ReactElement | string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isActive?: boolean;
  value: string | object;
}

/**
 * Component for render option in select
 *
 * @param {Props} - props componenrt
 * @returns {React.ReactElement} - component
 */
export const Option = React.memo(
  ({ children, onClick, isActive = false }: Props): React.ReactElement => (
    <div
      className={classNames(s.item, { [s.isActive]: isActive })}
      onClick={onClick}
    >
      {children}
    </div>
  )
);

Option.displayName = "Option";
